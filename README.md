# AIxCC Competition Archive

Developer documentation for the AIxCC Competition Archive website.

🌐 **Live Site**: [archive.aicyberchallenge.com](https://archive.aicyberchallenge.com)  
🔗 **Main Site**: [aicyberchallenge.com](https://aicyberchallenge.com)

## Quick Start

```bash
git clone https://github.com/AIxCyberChallenge/website.git
cd website
make setup    # Install dependencies
make serve    # Start development server at localhost:4000
```

## Development Commands

| Command | Description |
|---------|-------------|
| `make setup` | Install Ruby dependencies |
| `make serve` | Start development server with live reload |
| `make build` | Build site for production |
| `make test` | Run HTML validation and link checking |
| `make clean` | Remove build artifacts |
| `make help` | Show all available commands |

## Requirements

- **Ruby 3.1+** ([rbenv](https://github.com/rbenv/rbenv) or [RVM](https://rvm.io/) recommended)
- **Bundler** (`gem install bundler`)

> ⚠️ **Ruby 3.4+ users**: Compatibility gems are automatically included

## Deployment

- **Automatic**: Pushes to `main` branch auto-deploy via GitHub Pages
- **Manual testing**: GitHub Actions runs tests on all PRs

## Project Structure

```
├── index.md              # Main page content
├── _layouts/default.html # HTML template
├── _config.yml           # Jekyll configuration
├── Gemfile               # Ruby dependencies
├── Makefile              # Development commands
├── scripts/              # Build and test scripts
├── .github/workflows/    # CI/CD (test only)
└── favicon.*             # Site icons
```

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test: `make serve`
3. Run tests: `make test`
4. Submit PR (tests + visual preview generated automatically)

## Testing

Automated tests check:
- HTML structure validation
- Internal link integrity  
- Image loading
- SEO metadata
