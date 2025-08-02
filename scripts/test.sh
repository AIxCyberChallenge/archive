#!/bin/bash

# Test the built site
set -e

echo "🧪 Running site tests..."

# Build first
./scripts/build.sh

echo ""
echo "🔍 Testing HTML structure and links..."

# Test HTML with HTMLProofer (version 5.x syntax)
bundle exec htmlproofer ./_site \
  --disable-external \
  --ignore-urls="/favicon.ico"

echo ""
echo "✅ All tests passed!"
