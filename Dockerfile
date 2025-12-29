# ============================================================================
# JobCraft Copilot - Multi-Stage Dockerfile
# ============================================================================
# This Dockerfile builds frontend, backend, and full-stack images for
# deployment to Render, Docker Hub, or any container platform.
#
# Build targets:
#   - frontend-production: Static frontend served by nginx
#   - backend-production: FastAPI backend with uvicorn
#   - fullstack: Combined frontend + backend in single container
#
# Usage:
#   docker build --target fullstack -t jobcraft:latest .
#   docker run -p 8000:8000 jobcraft:latest
# ============================================================================

# ============================================================================
# Stage 1: Frontend Builder
# ============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /build

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ ./

# Build frontend static assets
RUN npm run build

# ============================================================================
# Stage 2: Frontend Production (nginx)
# ============================================================================
FROM nginx:alpine AS frontend-production

# Copy built frontend
COPY --from=frontend-builder /build/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# ============================================================================
# Stage 3: Backend Production
# ============================================================================
FROM python:3.11-slim AS backend-production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt ./

# Install Python dependencies
ARG PIP_INDEX_URL
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ============================================================================
# Stage 4: Full Stack (Frontend + Backend in single container)
# ============================================================================
FROM python:3.11-slim AS fullstack

# Build arguments
ARG BUILD_VERSION=dev
ARG BUILD_COMMIT=unknown
ARG BUILD_DATE=unknown

# Labels
LABEL org.opencontainers.image.title="JobCraft Copilot"
LABEL org.opencontainers.image.description="AI-powered job application assistant with privacy-first design"
LABEL org.opencontainers.image.version="${BUILD_VERSION}"
LABEL org.opencontainers.image.revision="${BUILD_COMMIT}"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.source="https://github.com/ruslanmv/jobcraft"
LABEL org.opencontainers.image.licenses="MIT"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt ./
ARG PIP_INDEX_URL
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from builder stage
COPY --from=frontend-builder /build/dist ./frontend/dist

# Copy configuration files
COPY docker/nginx-fullstack.conf /etc/nginx/sites-available/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/start.sh /app/start.sh

# Make start script executable
RUN chmod +x /app/start.sh

# Create necessary directories
RUN mkdir -p /app/data /var/log/supervisor /var/log/nginx

# Remove default nginx config
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Expose port (Render uses PORT env variable)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Environment variables with defaults
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV HOST=0.0.0.0

# Run supervisor to manage both services
CMD ["/app/start.sh"]
