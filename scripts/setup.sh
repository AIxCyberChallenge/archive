#!/bin/bash

# Development setup script for AIxCC Archive
set -e

echo "🚀 Setting up AIxCC Archive development environment..."

# Check if Ruby is installed
if ! command -v ruby &> /dev/null; then
    echo "❌ Ruby is not installed. Please install Ruby 3.1+ first."
    echo "   On macOS: brew install ruby"
    exit 1
fi

# Check Ruby version
RUBY_VERSION=$(ruby -v | cut -d' ' -f2 | cut -d'.' -f1,2)
if [[ $(echo "$RUBY_VERSION < 3.0" | bc -l) -eq 1 ]]; then
    echo "❌ Ruby version $RUBY_VERSION is too old. Please upgrade to Ruby 3.1+"
    exit 1
fi

echo "✅ Ruby version: $(ruby -v)"

# Install bundler if not present
if ! command -v bundle &> /dev/null; then
    echo "📦 Installing Bundler..."
    gem install bundler
fi

# Install dependencies
echo "📦 Installing Jekyll and dependencies..."
bundle install

echo ""
echo "🎉 Setup complete! You can now run:"
echo ""
echo "  📝 Start development server:"
echo "     ./scripts/serve.sh"
echo ""
echo "  🔧 Build the site:"
echo "     ./scripts/build.sh"
echo ""
echo "  🧪 Run tests:"
echo "     ./scripts/test.sh"
echo ""
