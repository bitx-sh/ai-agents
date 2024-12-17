
use std::error::Error;
use std::time::{Duration, Instant};
use tokio::sync::mpsc;
use tui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    symbols,
    text::Span,
    widgets::{Axis, Block, Borders, Chart, Dataset, GraphType},
    Terminal,
};
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use yahoo_finance_api as yahoo;

const TICKERS: &[&str] = &["SPY", "XLK", "XLV", "XLF", "XLI", "XLC", "XLY", "XLP", "XLE", "XLB", "XLRE"];
const WEIGHTS: &[f64] = &[0.25, 0.08, 0.06, 0.06, 0.05, 0.05, 0.05, 0.04, 0.04, 0.04, 0.03];

#[derive(Debug)]
struct Portfolio {
    returns: Vec<(f64, f64)>,
    drawdowns: Vec<(f64, f64)>,
    max_drawdown: f64,
    avg_return: f64,
}

async fn fetch_data(ticker: &str) -> Result<Vec<f64>, Box<dyn Error>> {
    let provider = yahoo::YahooConnector::new();
    let now = chrono::Utc::now();
    let five_years_ago = now - chrono::Duration::days(5 * 365);
    
    let response = provider.get_quote_history(ticker, five_years_ago, now).await?;
    let quotes = response.quotes()?;
    
    Ok(quotes.iter().map(|q| q.adjclose).collect())
}

async fn calculate_portfolio_metrics() -> Result<Portfolio, Box<dyn Error>> {
    let mut portfolio_values = Vec::new();
    let mut timestamps = Vec::new();
    
    for (ticker, &weight) in TICKERS.iter().zip(WEIGHTS.iter()) {
        let prices = fetch_data(ticker).await?;
        if portfolio_values.is_empty() {
            portfolio_values = prices.iter().map(|&p| p * weight).collect();
            timestamps = (0..prices.len()).map(|i| i as f64).collect();
        } else {
            for (i, &price) in prices.iter().enumerate() {
                portfolio_values[i] += price * weight;
            }
        }
    }
    
    let mut returns = Vec::new();
    let mut drawdowns = Vec::new();
    let mut peak = portfolio_values[0];
    let mut max_drawdown = 0.0;
    let mut total_return = 0.0;
    
    for (i, &value) in portfolio_values.iter().enumerate() {
        if i > 0 {
            let daily_return = (value - portfolio_values[i-1]) / portfolio_values[i-1];
            total_return += daily_return;
            returns.push((timestamps[i], daily_return * 100.0));
        }
        
        peak = peak.max(value);
        let drawdown = (peak - value) / peak * 100.0;
        max_drawdown = max_drawdown.max(drawdown);
        drawdowns.push((timestamps[i], drawdown));
    }
    
    Ok(Portfolio {
        returns,
        drawdowns,
        max_drawdown,
        avg_return: total_return / (portfolio_values.len() as f64) * 100.0,
    })
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    enable_raw_mode()?;
    let mut stdout = std::io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let (tx, mut rx) = mpsc::channel(32);
    let tick_rate = Duration::from_millis(250);
    
    tokio::spawn(async move {
        let mut last_tick = Instant::now();
        loop {
            if event::poll(std::time::Duration::from_millis(100)).unwrap() {
                if let Event::Key(key) = event::read().unwrap() {
                    tx.send(key.code).await.unwrap();
                }
            }
            
            if last_tick.elapsed() >= tick_rate {
                last_tick = Instant::now();
            }
        }
    });

    let portfolio = calculate_portfolio_metrics().await?;
    
    loop {
        terminal.draw(|f| {
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .margin(2)
                .constraints([
                    Constraint::Percentage(50),
                    Constraint::Percentage(50),
                ].as_ref())
                .split(f.size());

            let returns_dataset = Dataset::default()
                .name("Daily Returns")
                .marker(symbols::Marker::Dot)
                .graph_type(GraphType::Line)
                .style(Style::default().fg(Color::Cyan))
                .data(&portfolio.returns);

            let returns_chart = Chart::new(vec![returns_dataset])
                .block(Block::default().title("Portfolio Daily Returns").borders(Borders::ALL))
                .x_axis(Axis::default()
                    .title(Span::styled("Time", Style::default().fg(Color::Gray)))
                    .style(Style::default().fg(Color::Gray))
                    .bounds([0.0, portfolio.returns.len() as f64]))
                .y_axis(Axis::default()
                    .title(Span::styled("Return %", Style::default().fg(Color::Gray)))
                    .style(Style::default().fg(Color::Gray))
                    .bounds([-5.0, 5.0]));

            let drawdown_dataset = Dataset::default()
                .name("Drawdown")
                .marker(symbols::Marker::Dot)
                .graph_type(GraphType::Line)
                .style(Style::default().fg(Color::Red))
                .data(&portfolio.drawdowns);

            let drawdown_chart = Chart::new(vec![drawdown_dataset])
                .block(Block::default()
                    .title(format!("Maximum Drawdown: {:.2}% | Avg Daily Return: {:.2}%",
                                 portfolio.max_drawdown,
                                 portfolio.avg_return))
                    .borders(Borders::ALL))
                .x_axis(Axis::default()
                    .title(Span::styled("Time", Style::default().fg(Color::Gray)))
                    .style(Style::default().fg(Color::Gray))
                    .bounds([0.0, portfolio.drawdowns.len() as f64]))
                .y_axis(Axis::default()
                    .title(Span::styled("Drawdown %", Style::default().fg(Color::Gray)))
                    .style(Style::default().fg(Color::Gray))
                    .bounds([0.0, portfolio.max_drawdown + 5.0]));

            f.render_widget(returns_chart, chunks[0]);
            f.render_widget(drawdown_chart, chunks[1]);
        })?;

        if let Some(key_code) = rx.try_recv().ok() {
            if key_code == KeyCode::Char('q') {
                break;
            }
        }
    }

    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    Ok(())
}
