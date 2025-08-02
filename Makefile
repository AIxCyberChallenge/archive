# AIxCC Competition Archive - Development Makefile
.PHONY: help setup serve build test clean install

# Default target
help: ## Show this help message
	@echo "AIxCC Competition Archive - Development Commands"
	@echo "================================================"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make setup    # First-time setup"
	@echo "  make serve    # Start development server"
	@echo "  make test     # Run all tests"

setup: ## Run initial setup (install dependencies)
	@echo "🚀 Setting up development environment..."
	./scripts/setup.sh

install: setup ## Alias for setup

serve: ## Start local development server with live reload
	@echo "🌐 Starting development server..."
	./scripts/serve.sh

dev: serve ## Alias for serve

build: ## Build site for production
	@echo "🔨 Building site for production..."
	./scripts/build.sh

test: ## Run all tests (HTML validation, link checking, etc.)
	@echo "🧪 Running tests..."
	./scripts/test.sh

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf _site .jekyll-cache .sass-cache
	@echo "✅ Clean complete"

deps: ## Update dependencies
	@echo "📦 Updating dependencies..."
	bundle update
	@echo "✅ Dependencies updated"

status: ## Show project status
	@echo "📊 AIxCC Archive Status"
	@echo "======================"
	@echo "Ruby version:    $$(ruby -v | cut -d' ' -f2)"
	@echo "Jekyll version:  $$(bundle exec jekyll -v 2>/dev/null || echo 'Not installed')"
	@echo "Bundler version: $$(bundle -v | cut -d' ' -f3)"
	@echo "Site URL:        https://archive.aicyberchallenge.com"
	@echo "Local URL:       http://localhost:4000"
	@if [ -d "_site" ]; then \
		echo "Last build:      $$(stat -f "%Sm" _site 2>/dev/null || echo 'Never')"; \
		echo "Build size:      $$(du -sh _site 2>/dev/null | cut -f1 || echo 'Unknown')"; \
	else \
		echo "Last build:      Never"; \
	fi

# Advanced targets
preview: build ## Build and serve production version locally
	@echo "🔍 Serving production build locally..."
	@cd _site && python3 -m http.server 8080
	@echo "Production preview available at: http://localhost:8080"

lint: ## Run linting checks
	@echo "🔍 Running linting checks..."
	@if command -v markdownlint >/dev/null 2>&1; then \
		markdownlint *.md || true; \
	else \
		echo "⚠️  markdownlint not installed, skipping markdown linting"; \
	fi
	@echo "✅ Linting complete"

all: clean setup build test ## Run complete build pipeline

# Git workflow helpers
commit: test ## Run tests before committing
	@echo "✅ Tests passed! Ready to commit."

push: test ## Run tests before pushing
	@echo "✅ Tests passed! Safe to push."
	@echo "💡 Run: git push origin $$(git branch --show-current)"

# Documentation
docs: ## Open documentation
	@echo "📚 Opening documentation..."
	@open "https://jekyllrb.com/docs/" || echo "Visit: https://jekyllrb.com/docs/"
