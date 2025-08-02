#!/bin/bash

# Build the site for production
set -e

echo "🔨 Building Jekyll site for production..."

# Clean previous build
rm -rf _site

# Build with production environment
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter

echo "✅ Build complete! Site generated in _site/"
echo "📂 Site size: $(du -sh _site | cut -f1)"
