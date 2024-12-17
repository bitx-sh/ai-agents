<examples>
<example>
<risk_level>
Moderate-Conservative
</risk_level>
<constraints>
- Maximum 25% allocation to emerging markets
- Minimum 40% in fixed income securities
- No more than 3% in any individual stock
- At least 10% allocation to dividend-paying stocks
- Maximum 10% in alternative investments
- Use of currency hedging for international positions
- No investments in companies with poor corporate governance ratings
- Semi-annual rebalancing with 3% threshold for individual positions
- Maximum 20% in any single sector
- Preference for low-cost index funds and ETFs where possible
</constraints>
<strategy_type>
Income-focused with emerging market exposure
</strategy_type>
<market_conditions>
- Global economic growth slowing but still positive, with emerging markets outpacing developed economies
- Inflation rates moderating in most major economies, but remaining above central bank targets
- Yield curve inversion in some developed markets, raising recession concerns
- Emerging market currencies showing increased volatility against major currencies
- Commodity prices stabilizing after recent volatility, with focus on renewable energy resources
- Demographic shifts in developed countries leading to increased demand for income-generating assets
- Rising geopolitical tensions impacting global trade and supply chains
- Technological advancements in fintech changing the landscape of financial services in emerging markets
- Increasing focus on sustainable investing and ESG factors across both developed and emerging markets
- Central banks in emerging markets adopting more accommodative monetary policies to stimulate growth
- Growing middle class in emerging economies driving increased consumer spending and financial inclusion
</market_conditions>
<investment_horizon>
7-12 years
</investment_horizon>
<custom_asset_preferences>
- iShares Core High Dividend ETF (HDV): 8-12%
- Vanguard Emerging Markets Government Bond ETF (VWOB): 5-8%
- Schwab U.S. Dividend Equity ETF (SCHD): 6-10%
- iShares J.P. Morgan USD Emerging Markets Bond ETF (EMB): 4-7%
- WisdomTree Emerging Markets High Dividend Fund (DEM): 3-6%
- SPDR Bloomberg Barclays International Treasury Bond ETF (BWX): 5-8%
</custom_asset_preferences>
<ideal_output>
I'll help develop a comprehensive portfolio strategy based on the given requirements. Let me start with the analysis.

<strategy_development>

1. Client's Risk Tolerance and Investment Objectives Analysis:
   a) Input Summary:
   - Moderate-Conservative risk profile
   - 7-12 year investment horizon
   - Income focus with emerging market exposure
   
   b) Implications:
   - Target return should be inflation + 3-4% annually
   - Capital preservation is important but some growth needed
   - Need for stable income stream through dividends and interest
   
   c) Recommendations:
   - Core-satellite approach with defensive core holdings
   - Focus on quality income-producing assets
   - Strategic use of emerging markets for growth potential

2. Market Trends and Risks Analysis:
   a) Key Trends:
   - Slowing global growth with EM outperformance
   - Moderating but elevated inflation
   - Yield curve concerns in developed markets
   - Rising EM currency volatility
   
   b) Opportunities:
   - EM bonds offering attractive yields
   - Dividend stocks providing inflation protection
   - Currency hedging opportunities in volatile markets
   
   c) Risks:
   - Recession risk in developed markets
   - Currency risk in EM exposure
   - Geopolitical tensions affecting trade

3. Asset Allocation Framework:
   a) Proposed Ranges:
   - Fixed Income: 40-50%
   - Dividend Stocks: 25-35%
   - Emerging Markets: 15-25%
   - Alternatives: 5-10%
   
   b) Strategic Considerations:
   - Higher allocation to fixed income for stability
   - Mix of domestic and international dividend stocks
   - Tactical EM allocation within constraints
   
   c) Implementation Focus:
   - Use of low-cost ETFs
   - Currency-hedged vehicles for international exposure
   - Quality screen for individual positions

4. Risk Management Framework:
   a) Key Risks:
   - Currency risk
   - Interest rate risk
   - Market risk
   - Emerging market specific risks
   
   b) Hedging Strategies:
   - Currency forwards for major exposures
   - Duration management in fixed income
   - Geographic diversification
   
   c) Monitoring Metrics:
   - Value at Risk (VaR)
   - Sharpe Ratio
   - Maximum drawdown
   - Currency exposure metrics

Summary:
The analysis suggests a balanced approach focusing on income generation while carefully managing emerging market exposure. The strategy should emphasize quality fixed income and dividend-paying stocks, with tactical allocation to emerging markets within strict risk parameters. Regular rebalancing and comprehensive risk monitoring will be essential for maintaining the desired risk-return profile.

</strategy_development>

{
  "portfolio_strategy": {
    "investment_approach": {
      "philosophy": "Income-focused core-satellite strategy with managed EM exposure",
      "return_target": "Inflation + 3.5% annually",
      "risk_budget": "Expected volatility 8-10% annually"
    },
    "asset_allocation": {
      "core_holdings": {
        "developed_market_fixed_income": {
          "target": 35,
          "range": [30, 40],
          "primary_vehicles": ["BWX", "AGG", "VCIT"]
        },
        "dividend_stocks": {
          "target": 30,
          "range": [25, 35],
          "primary_vehicles": ["HDV", "SCHD"]
        }
      },
      "satellite_holdings": {
        "emerging_market_bonds": {
          "target": 15,
          "range": [10, 20],
          "primary_vehicles": ["VWOB", "EMB"]
        },
        "emerging_market_equity": {
          "target": 12,
          "range": [8, 15],
          "primary_vehicles": ["DEM", "DVYE"]
        },
        "alternatives": {
          "target": 8,
          "range": [5, 10],
          "primary_vehicles": ["REET", "PDBC"]
        }
      }
    },
    "risk_management": {
      "limits": {
        "position_limits": {
          "individual_stock": 3,
          "sector": 20,
          "emerging_markets": 25,
          "alternatives": 10
        },
        "currency_hedging": {
          "developed_markets": 75,
          "emerging_markets": 50
        }
      },
      "monitoring_metrics": {
        "risk_metrics": ["VaR", "Sortino_Ratio", "Information_Ratio"],
        "frequency": "daily",
        "thresholds": {
          "var_95": -2.5,
          "tracking_error": 3.0
        }
      }
    },
    "implementation": {
      "rebalancing": {
        "schedule": "semi-annual",
        "threshold": 3,
        "method": "threshold-based"
      },
      "trading": {
        "execution_style": "limit_orders",
        "lot_size_optimization": true
      }
    }
  },
  "gui_implementation": {
    "framework": {
      "frontend": "Tauri + React",
      "backend": "Rust",
      "runtime": "Bun"
    },
    "modules": {
      "portfolio_overview": {
        "components": [
          "asset_allocation_chart",
          "performance_metrics",
          "risk_dashboard"
        ]
      },
      "risk_analytics": {
        "components": [
          "var_calculator",
          "stress_testing",
          "correlation_matrix"
        ]
      },
      "trading": {
        "components": [
          "rebalancing_tool",
          "order_management",
          "execution_analytics"
        ]
      },
      "reporting": {
        "components": [
          "custom_report_builder",
          "scheduled_reports",
          "export_functionality"
        ]
      }
    }
  }
}
</ideal_output>
</example>
</examples>


You are an Advanced Financial Portfolio Management Architect AI, specializing in multi-asset portfolio construction, risk management, and automated portfolio rebalancing. Your primary task is to design and manage sophisticated investment portfolios using various asset classes, derivatives, and hedging strategies while ensuring risk control, optimal performance, and comprehensive reporting.

Given the following portfolio requirements, you need to develop a comprehensive portfolio strategy:

<strategy_type>
{{strategy_type}}
</strategy_type>

<risk_level>
{{risk_level}}
</risk_level>

<investment_horizon>
{{investment_horizon}}
</investment_horizon>

<constraints>
{{constraints}}
</constraints>

<custom_asset_preferences>
{{custom_asset_preferences}}
</custom_asset_preferences>

<market_conditions>
{{market_conditions}}
</market_conditions>

Before providing the final portfolio strategy, please analyze the requirements and market conditions in <strategy_development> tags. Consider the following aspects:

1. Client's risk tolerance and investment objectives
   - Evaluate the given risk level and its implications
   - Determine appropriate return targets based on the risk level and investment horizon

2. Current market trends and potential risks
   - Analyze the provided market conditions
   - Identify potential opportunities and threats in the current market environment

3. Appropriate asset allocation based on the strategy type and risk level
   - Consider various asset classes and their suitability for the given strategy
   - Propose initial allocation ranges for each asset class

4. Suitable risk management techniques and hedging strategies
   - Identify key risks that need to be managed
   - Suggest appropriate hedging instruments and strategies

5. Reporting and monitoring requirements
   - Propose key performance indicators (KPIs) and risk metrics to track
   - Suggest an appropriate frequency for reporting and rebalancing

For each aspect, follow these steps:
a) Summarize the relevant input information
b) Analyze the implications of this information
c) Draw preliminary conclusions or recommendations

After your analysis, provide a comprehensive portfolio strategy in JSON format. The strategy should include:

1. Overall investment approach
2. Asset allocation (including targets and ranges)
3. Risk management plan (including metrics, limits, and hedging strategies)
4. Implementation details (including rebalancing rules)
5. Monitoring framework

Ensure that your strategy adheres to the given constraints and is appropriate for the specified risk level and investment horizon. Be as specific as possible, providing numeric values where appropriate.

Additionally, include a section in your JSON output for a Desktop Portfolio GUI implementation using Tauri with Rust and Bun. This section should outline the basic structure and features of the GUI, considering the portfolio strategy you've developed.

Your final output should be structured as follows:

1. <strategy_development> tags containing your detailed analysis
2. JSON output containing the comprehensive portfolio strategy and GUI implementation details

Remember to tailor your strategy to the specific requirements provided, and ensure all constraints are met. At the end of your <strategy_development> section, include a brief summary of your key findings and recommendations.
<strategy_development>

1. Client's Risk Tolerance and Investment Objectives Analysis:
   a) Input Summary:
   - Moderate-Aggressive risk profile
   - 10-15 year investment horizon
   - Growth focus with technology/healthcare emphasis
   
   b) Implications:
   - Higher risk tolerance allows for greater equity exposure
   - Long horizon enables riding out market volatility
   - Target return should be around 8-10% annually
   
   c) Recommendations:
   - Overweight growth sectors while maintaining diversification
   - Use options for strategic protection
   - Include international exposure for diversification

2. Market Trends and Risks Analysis:
   a) Key Trends:
   - Strong tech sector momentum
   - Healthcare innovation acceleration
   - ESG investing prominence
   - Rising inflation concerns
   
   b) Opportunities:
   - AI and cloud computing growth
   - Healthcare innovation
   - Clean energy transition
   - International markets recovery
   
   c) Risks:
   - Tech sector valuations
   - Regulatory pressures
   - Interest rate sensitivity
   - Supply chain disruptions

3. Asset Allocation Framework:
   a) Proposed Ranges:
   - Growth Equities: 45-55%
   - International Equities: 20-25%
   - Fixed Income: 15-20%
   - Alternatives: 10-15%
   
   b) Strategic Considerations:
   - Sector tilts within equity allocation
   - ESG integration
   - Options overlay strategy
   
   c) Implementation Focus:
   - Use of targeted ETFs
   - Options for income/protection
   - ESG screening

4. Risk Management Framework:
   a) Key Risks:
   - Sector concentration
   - Growth stock volatility
   - Interest rate risk
   - Technology disruption risk
   
   b) Hedging Strategies:
   - Protective puts on major positions
   - Covered call writing
   - International diversification
   
   c) Monitoring Metrics:
   - Beta exposure
   - Sector correlation
   - Options Greeks
   - ESG scores

Summary:
The analysis supports a growth-oriented strategy with significant technology and healthcare exposure, balanced by international diversification and strategic options use. The long investment horizon allows for higher equity allocation, while options and fixed income provide risk management. Regular monitoring of sector exposure and systematic rebalancing will be crucial for maintaining the desired risk-return profile.

</strategy_development>

{
  "portfolio_strategy": {
    "investment_approach": {
      "philosophy": "Growth-focused strategy with sector tilts and options overlay",
      "return_target": "9% annually",
      "risk_budget": "Expected volatility 15-18% annually"
    },
    "asset_allocation": {
      "core_holdings": {
        "us_growth_equities": {
          "target": 50,
          "range": [45, 55],
          "primary_vehicles": ["VGT", "IXJ", "QQQ"]
        },
        "international_equities": {
          "target": 22,
          "range": [20, 25],
          "primary_vehicles": ["EFG", "ICLN"]
        }
      },
      "defensive_holdings": {
        "fixed_income": {
          "target": 18,
          "range": [15, 20],
          "primary_vehicles": ["BNDX", "VCIT"]
        },
        "alternatives": {
          "target": 10,
          "range": [8, 15],
          "primary_vehicles": ["ARKK", "XBI"]
        }
      }
    },
    "risk_management": {
      "limits": {
        "position_limits": {
          "individual_stock": 5,
          "sector": 35,
          "small_cap": 30,
          "alternatives": 15
        },
        "options_strategy": {
          "covered_calls": {
            "maximum_coverage": 30,
            "delta_target": 0.3
          },
          "protective_puts": {
            "coverage": 25,
            "delta_target": -0.2
          }
        }
      },
      "monitoring_metrics": {
        "risk_metrics": ["Beta", "Sharpe_Ratio", "Sector_Exposure", "Options_Greeks"],
        "frequency": "daily",
        "thresholds": {
          "beta_max": 1.3,
          "var_95": -3.0
        }
      }
    },
    "implementation": {
      "rebalancing": {
        "schedule": "quarterly",
        "threshold": 5,
        "method": "drift-based"
      },
      "esg_integration": {
        "screening": "positive",
        "minimum_score": 7
      }
    }
  },
  "gui_implementation": {
    "framework": {
      "frontend": "Tauri + React",
      "backend": "Rust",
      "runtime": "Bun"
    },
    "modules": {
      "portfolio_dashboard": {
        "components": [
          "sector_allocation_chart",
          "options_positions_monitor",
          "esg_metrics_display"
        ]
      },
      "risk_analytics": {
        "components": [
          "options_greeks_calculator",
          "sector_exposure_analysis",
          "volatility_metrics"
        ]
      },
      "trading": {
        "components": [
          "options_strategy_builder",
          "rebalancing_simulator",
          "order_management"
        ]
      },
      "reporting": {
        "components": [
          "performance_attribution",
          "risk_metrics_dashboard",
          "esg_impact_report"
        ]
      }
    }
  }
}
Thanks! Now please build me a Desktop Portfolio GUI in Tauri using Rust and Bun. 
I'll help you create a Desktop Portfolio GUI using Tauri with Rust and Bun. Here's a step-by-step implementation:

1. First, let's set up the project structure:

```bash
# Create a new Tauri project
cargo create-tauri-app portfolio-manager
cd portfolio-manager

# Initialize Bun project
bun init

# Install necessary dependencies
bun add react react-dom @mantine/core @mantine/hooks @tanstack/react-query
bun add recharts @visx/grid @visx/axis @visx/scale
bun add @tauri-apps/api @tauri-apps/cli
bun add tailwindcss postcss autoprefixer
```

2. Here's the main Rust backend code (src-tauri/src/main.rs):

```rust
#[tauri::command]
use serde::{Deserialize, Serialize};
use rust_decimal::Decimal;
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Debug)]
struct Portfolio {
    id: String,
    name: String,
    total_value: Decimal,
    positions: Vec<Position>,
    last_updated: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Position {
    symbol: String,
    quantity: Decimal,
    current_price: Decimal,
    cost_basis: Decimal,
    sector: String,
    asset_type: String,
}

#[tauri::command]
async fn get_portfolio(portfolio_id: String) -> Result<Portfolio, String> {
    // Implementation for fetching portfolio data
    Ok(Portfolio {
        id: portfolio_id,
        name: "Growth Portfolio".to_string(),
        total_value: Decimal::new(1000000, 2),
        positions: vec![],
        last_updated: Utc::now(),
    })
}

#[tauri::command]
async fn calculate_risk_metrics(portfolio: Portfolio) -> Result<RiskMetrics, String> {
    // Implementation for risk calculations
    Ok(RiskMetrics {
        beta: 1.2,
        sharpe_ratio: 1.5,
        var_95: -2.5,
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_portfolio,
            calculate_risk_metrics
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

3. Create the React frontend structure (src/App.tsx):

```tsx
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell, Navbar, Header } from '@mantine/core';
import { PortfolioDashboard } from './components/PortfolioDashboard';
import { Navigation } from './components/Navigation';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <AppShell
          padding="md"
          navbar={<Navigation />}
          header={<Header height={60} p="xs">Portfolio Manager</Header>}
        >
          <PortfolioDashboard />
        </AppShell>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
```

4. Create the main dashboard component (src/components/PortfolioDashboard.tsx):

```tsx
import React from 'react';
import { Grid, Paper } from '@mantine/core';
import { AssetAllocation } from './charts/AssetAllocation';
import { PerformanceChart } from './charts/PerformanceChart';
import { RiskMetrics } from './widgets/RiskMetrics';
import { PositionsTable } from './tables/PositionsTable';

export function PortfolioDashboard() {
  return (
    <Grid>
      <Grid.Col span={8}>
        <Paper p="md" shadow="sm">
          <PerformanceChart />
        </Paper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="md" shadow="sm">
          <AssetAllocation />
        </Paper>
      </Grid.Col>
      <Grid.Col span={12}>
        <Paper p="md" shadow="sm">
          <RiskMetrics />
        </Paper>
      </Grid.Col>
      <Grid.Col span={12}>
        <Paper p="md" shadow="sm">
          <PositionsTable />
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
```

5. Create a chart component (src/components/charts/AssetAllocation.tsx):

```tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'US Growth Equities', value: 50 },
  { name: 'International Equities', value: 22 },
  { name: 'Fixed Income', value: 18 },
  { name: 'Alternatives', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AssetAllocation() {
  return (
    <div style={{ height: 300 }}>
      <h3>Asset Allocation</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

6. Create a positions table component (src/components/tables/PositionsTable.tsx):

```tsx
import React from 'react';
import { Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/tauri';

export function PositionsTable() {
  const { data: positions, isLoading } = useQuery(['positions'], () =>
    invoke('get_portfolio', { portfolioId: '1' })
  );

  if (isLoading) return <Text>Loading positions...</Text>;

  return (
    <Table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Quantity</th>
          <th>Current Price</th>
          <th>Market Value</th>
          <th>Gain/Loss</th>
        </tr>
      </thead>
      <tbody>
        {positions?.positions.map((position) => (
          <tr key={position.symbol}>
            <td>{position.symbol}</td>
            <td>{position.quantity}</td>
            <td>${position.current_price}</td>
            <td>${position.quantity * position.current_price}</td>
            <td>${(position.current_price - position.cost_basis) * position.quantity}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
```

7. Create a risk metrics widget (src/components/widgets/RiskMetrics.tsx):

```tsx
import React from 'react';
import { Grid, Paper, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/tauri';

export function RiskMetrics() {
  const { data: metrics, isLoading } = useQuery(['risk-metrics'], () =>
    invoke('calculate_risk_metrics', { portfolioId: '1' })
  );

  if (isLoading) return <Text>Loading risk metrics...</Text>;

  return (
    <Grid>
      <Grid.Col span={4}>
        <Paper p="md" shadow="sm">
          <Text size="lg">Beta</Text>
          <Text size="xl" weight={700}>{metrics?.beta.toFixed(2)}</Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="md" shadow="sm">
          <Text size="lg">Sharpe Ratio</Text>
          <Text size="xl" weight={700}>{metrics?.sharpe_ratio.toFixed(2)}</Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper p="md" shadow="sm">
          <Text size="lg">VaR (95%)</Text>
          <Text size="xl" weight={700}>{metrics?.var_95.toFixed(2)}%</Text>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
```

8. Configure Tauri (src-tauri/tauri.conf.json):

```json
{
  "build": {
    "beforeDevCommand": "bun run dev",
    "beforeBuildCommand": "bun run build",
    "devPath": "http://localhost:1420",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Portfolio Manager",
    "version": "0.1.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      }
    },
    "bundle": {
      "active": true,
      "category": "DeveloperTool",
      "copyright": "",
      "deb": {
        "depends": []
      },
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.portfolio.manager",
      "longDescription": "",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 800,
        "resizable": true,
        "title": "Portfolio Manager",
        "width": 1200
      }
    ]
  }
}
```

To run the application:

```bash
# Development mode
cargo tauri dev

# Build for production
cargo tauri build
```

This implementation provides a basic portfolio management GUI with:
- Asset allocation visualization
- Performance tracking
- Risk metrics monitoring
- Position management
- Real-time updates using Tauri's IPC
- Responsive design using Mantine
- Data visualization using Recharts

The application can be extended with additional features such as:
- Options strategy builder
- Trade execution
- Portfolio rebalancing tools
- Advanced risk analytics
- Custom reporting
- ESG metrics tracking

Would you like me to expand on any particular aspect or add additional features?
Looks like you
