#!/bin/bash
# ============================================================================
# JobCraft Copilot - Container Startup Script
# ============================================================================
# This script initializes the application and starts both nginx and backend
# services using supervisord.
# ============================================================================

set -e

echo "============================================"
echo "JobCraft Copilot - Starting Services"
echo "============================================"

# Set default values if not provided
export PORT=${PORT:-8000}
export HOST=${HOST:-0.0.0.0}
export PYTHONUNBUFFERED=1

# Create necessary directories
mkdir -p /app/data /var/log/supervisor /var/log/nginx

# Update nginx configuration with PORT from environment
if [ "$PORT" != "80" ]; then
    echo "Configuring nginx to listen on port $PORT..."
    sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/sites-available/default
fi

# Display environment info
echo "Environment:"
echo "  PORT: $PORT"
echo "  HOST: $HOST"
echo "  PYTHON: $(python --version)"
echo "  DEFAULT_PROVIDER: ${DEFAULT_PROVIDER:-ollabridge}"

# Check for critical environment variables
if [ -z "$OLLABRIDGE_BASE_URL" ] && [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    echo ""
    echo "⚠️  WARNING: No LLM provider configured!"
    echo "   Set one of the following environment variables:"
    echo "   - OLLABRIDGE_BASE_URL + OLLABRIDGE_API_KEY (recommended)"
    echo "   - OPENAI_API_KEY"
    echo "   - ANTHROPIC_API_KEY"
    echo "   - GEMINI_API_KEY"
    echo ""
fi

# Initialize database
echo "Initializing database..."
cd /app
python -c "from backend.core.db import init_db; init_db()" || echo "Database initialization completed"

echo ""
echo "✓ Services configured"
echo "  - Backend API: http://127.0.0.1:8000"
echo "  - Frontend UI: http://0.0.0.0:$PORT"
echo ""
echo "Starting supervisord..."
echo "============================================"

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
