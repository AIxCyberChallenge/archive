#!/bin/bash

# Serve the site locally for development (robust to busy ports)
set -euo pipefail

DEFAULT_PORT="4000"
DEFAULT_LR_PORT="35729"

port_in_use() {
  local port="$1"
  # macOS: lsof is available by default
  if lsof -iTCP:"$port" -sTCP:LISTEN -n -P >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

find_free_port() {
  local start="$1"
  local limit="10"
  local port="$start"
  local i=0
  while [ $i -lt $limit ]; do
    if ! port_in_use "$port"; then
      echo "$port"
      return 0
    fi
    port=$((port+1))
    i=$((i+1))
  done
  # If all tried, just return the starting port (let Jekyll error)
  echo "$start"
}

SERVER_PORT="${PORT:-$DEFAULT_PORT}"
LR_PORT="${LR_PORT:-$DEFAULT_LR_PORT}"

# Choose free ports when possible
if port_in_use "$SERVER_PORT"; then
  SERVER_PORT="$(find_free_port "$SERVER_PORT")"
fi
if [ "${DISABLE_LIVERELOAD:-0}" != "1" ]; then
  if port_in_use "$LR_PORT"; then
    LR_PORT="$(find_free_port "$LR_PORT")"
  fi
fi

echo "🌐 Starting Jekyll development server..."
echo "📍 Site will be available at: http://localhost:${SERVER_PORT}"
if [ "${DISABLE_LIVERELOAD:-0}" = "1" ]; then
  echo "� LiveReload: disabled (set DISABLE_LIVERELOAD=0 to enable)"
else
  echo "👀 LiveReload port: ${LR_PORT} (set LR_PORT to override, or DISABLE_LIVERELOAD=1 to disable)"
fi
echo "🔄 Press Ctrl+C to stop"
echo ""

ARGS=(
  --open-url
  --incremental
  --host 0.0.0.0
  --port "${SERVER_PORT}"
)

if [ "${DISABLE_LIVERELOAD:-0}" != "1" ]; then
  ARGS+=( --livereload --livereload-port "${LR_PORT}" )
fi

bundle exec jekyll serve "${ARGS[@]}"
