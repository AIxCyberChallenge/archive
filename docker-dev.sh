#!/bin/bash

# Docker development script for AIxCC Archive
set -e

echo "🐳 AIxCC Archive - Docker Development"
echo "====================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to show usage
show_usage() {
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  up, start     Start the development server"
    echo "  down, stop    Stop the development server"
    echo "  restart       Restart the development server"
    echo "  build         Rebuild the Docker image"
    echo "  logs          Show server logs"
    echo "  shell         Open a shell in the container"
    echo "  clean         Remove containers and images"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 up         # Start the server at http://localhost:4000"
    echo "  $0 logs       # Follow the server logs"
    echo "  $0 shell      # Open bash in the running container"
    echo ""
}

# Parse command
case "${1:-help}" in
    up|start)
        echo "🚀 Starting Jekyll development server..."
        echo "📍 Site will be available at: http://localhost:4000"
        echo "👀 LiveReload will be available on port 35729"
        echo ""
        docker-compose up -d
        echo ""
        echo "✅ Server started! Use '$0 logs' to view logs or '$0 down' to stop."
        ;;
    
    down|stop)
        echo "🛑 Stopping development server..."
        docker-compose down
        echo "✅ Server stopped."
        ;;
    
    restart)
        echo "🔄 Restarting development server..."
        docker-compose restart
        echo "✅ Server restarted."
        ;;
    
    build)
        echo "🔨 Rebuilding Docker image..."
        docker-compose build --no-cache
        echo "✅ Image rebuilt."
        ;;
    
    logs)
        echo "📋 Showing server logs (Ctrl+C to exit)..."
        docker-compose logs -f jekyll
        ;;
    
    shell)
        echo "🐚 Opening shell in container..."
        docker-compose exec jekyll bash
        ;;
    
    clean)
        echo "🧹 Cleaning up Docker containers and images..."
        docker-compose down --rmi all --volumes --remove-orphans
        echo "✅ Cleanup complete."
        ;;
    
    help)
        show_usage
        ;;
    
    *)
        echo "❌ Unknown command: $1"
        show_usage
        exit 1
        ;;
esac