# GitHub Stars AI

AI-powered GitHub stars analyzer and code generator using hierarchical LLM agents.

## Features

- Retrieves and analyzes your GitHub starred repositories
- Categorizes and indexes repositories by various metrics
- Extracts reusable code patterns and examples
- Generates new code based on analyzed patterns
- Uses Claude 3 Sonnet for advanced code understanding

## Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Anthropic API key
- GitHub personal access token

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/github-stars-ai.git
cd github-stars-ai

# Install dependencies
bun install

# Build the project
bun run build
```

## Configuration

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
GITHUB_TOKEN=your_github_token_here
```

## Usage

```bash
# Analyze GitHub stars
bun run start analyze --username your-github-username

# Generate code based on analysis
bun run start generate --prompt "Create a TypeScript utility library"
```

## Development

```bash
# Start development mode
bun run dev

# Run tests
bun run test

# Lint code
bun run lint

# Format code
bun run format
```

## Project Structure

```
github-stars-ai/
├── packages/
│   ├── config/      # Configuration management
│   ├── agents/      # AI agent implementations
│   ├── utils/       # Shared utilities
│   └── workflow/    # Workflow orchestration
├── config/          # Agent configurations
└── src/            # Main application code
```

## License

MIT License - see [LICENSE](LICENSE) for details
