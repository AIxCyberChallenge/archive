#!/bin/bash

# Serve the site locally for development
set -e

echo "🌐 Starting Jekyll development server..."
echo "📍 Site will be available at: http://localhost:4000"
echo "🔄 Press Ctrl+C to stop"
echo ""

bundle exec jekyll serve \
  --livereload \
  --open-url \
  --incremental \
  --host 0.0.0.0 \
  --port 4000
