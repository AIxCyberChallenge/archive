#!/bin/bash

# Build the site for production
set -e

echo "🔨 Building Jekyll site for production..."

# Clean previous build
rm -rf _site

# Resolve Bundler: prefer Homebrew Ruby bundler if available, then fallback
BREW_PREFIX=$(command -v brew >/dev/null 2>&1 && brew --prefix || echo "")
CANDIDATES=(
	"$(command -v bundle)"                  # Use the same bundle your shell uses
	"$BREW_PREFIX/opt/ruby/bin/bundle"
	"/opt/homebrew/opt/ruby/bin/bundle"     # Apple Silicon default
	"/usr/local/opt/ruby/bin/bundle"        # Intel default
)

BUNDLE_CMD=""
for c in "${CANDIDATES[@]}"; do
	if [ -n "$c" ] && [ -x "$c" ]; then
		BUNDLE_CMD="$c"
		break
	fi
done

if [ -z "$BUNDLE_CMD" ]; then
	echo "❌ Bundler not found. Please install bundler 2.7.1 (e.g., gem install bundler:2.7.1) or run 'make setup'." >&2
	exit 1
fi

# Build with production environment
JEKYLL_ENV=production "$BUNDLE_CMD" exec jekyll build --strict_front_matter

echo "✅ Build complete! Site generated in _site/"
echo "📂 Site size: $(du -sh _site | cut -f1)"
