# Docker Deployment Guide

This guide covers deploying JobCraft Copilot using Docker containers for Render, Railway, Fly.io, and other container platforms.

## Table of Contents

- [Quick Start](#quick-start)
- [Docker Build Targets](#docker-build-targets)
- [Environment Variables](#environment-variables)
- [Deployment Platforms](#deployment-platforms)
  - [Render](#deploy-to-render)
  - [Railway](#deploy-to-railway)
  - [Fly.io](#deploy-to-flyio)
  - [Docker Hub](#deploy-to-docker-hub)
- [Makefile Commands](#makefile-commands)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Build and Run Locally

```bash
# Build the full-stack container
make build-container

# Run the container
make run-container

# View logs
make logs-container

# Stop the container
make stop-container
```

Access the application at http://localhost:8000

### Using Docker Commands Directly

```bash
# Build
docker build --target fullstack -t jobcraft:latest .

# Run
docker run -d -p 8000:8000 \
  -e DEFAULT_PROVIDER=ollabridge \
  -e OLLABRIDGE_BASE_URL=http://localhost:11435 \
  -e OLLABRIDGE_API_KEY=sk-ollabridge-xxx \
  jobcraft:latest

# Stop
docker stop $(docker ps -q --filter ancestor=jobcraft:latest)
```

---

## Docker Build Targets

The Dockerfile provides three build targets:

### 1. **fullstack** (Recommended)
Complete application with frontend and backend in a single container.

```bash
docker build --target fullstack -t jobcraft:latest .
```

**Use Case:** Render, Railway, Fly.io, single-server deployments

### 2. **frontend-production**
Frontend-only container with nginx.

```bash
docker build --target frontend-production -t jobcraft:frontend .
```

**Use Case:** Vercel, Netlify, static hosting with separate API

### 3. **backend-production**
Backend API-only container with uvicorn.

```bash
docker build --target backend-production -t jobcraft:backend .
```

**Use Case:** Microservices architecture, separate API deployment

---

## Environment Variables

### Required Variables

At least one LLM provider must be configured:

| Variable | Description | Example |
|----------|-------------|---------|
| `OLLABRIDGE_BASE_URL` | OllaBridge server URL | `http://localhost:11435` |
| `OLLABRIDGE_API_KEY` | OllaBridge API key | `sk-ollabridge-xxxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEFAULT_PROVIDER` | Active LLM provider | `ollabridge` |
| `PORT` | Application port | `8000` |
| `HOST` | Bind host | `0.0.0.0` |
| `OLLABRIDGE_MODEL` | OllaBridge model | `deepseek-r1` |
| `OLLAMA_BASE_URL` | Ollama server URL | - |
| `OLLAMA_MODEL` | Ollama model | `llama2` |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `OPENAI_MODEL` | OpenAI model | `gpt-4` |
| `ANTHROPIC_API_KEY` | Anthropic API key | - |
| `CLAUDE_MODEL` | Claude model | `claude-3-5-sonnet-20241022` |
| `GEMINI_API_KEY` | Google Gemini API key | - |
| `GEMINI_MODEL` | Gemini model | `gemini-2.0-flash-exp` |
| `WATSONX_API_KEY` | IBM Watsonx API key | - |
| `WATSONX_PROJECT_ID` | IBM Watsonx project ID | - |

---

## Deployment Platforms

### Deploy to Render

Render natively supports Docker deployments from Git repositories.

#### Option 1: Deploy from Git (Recommended)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   ```yaml
   Name: jobcraft-copilot
   Environment: Docker
   Branch: main
   Docker Command: (leave blank, uses CMD from Dockerfile)
   Plan: Free or Starter
   ```

3. **Add Environment Variables**
   ```
   DEFAULT_PROVIDER=ollabridge
   OLLABRIDGE_BASE_URL=https://your-tunnel-url.ollabridge.com
   OLLABRIDGE_API_KEY=sk-ollabridge-xxxxx
   OLLABRIDGE_MODEL=deepseek-r1
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render automatically builds and deploys the Docker container

#### Option 2: Deploy from Docker Hub

```bash
# 1. Build and push to Docker Hub
export DOCKERHUB_USERNAME=your-username
make publish

# 2. Create Render service from Docker image
# Image URL: docker.io/your-username/jobcraft:latest
```

#### Render Configuration File

Create `render.yaml` in your repository:

```yaml
services:
  - type: web
    name: jobcraft-copilot
    env: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    plan: free
    region: oregon
    healthCheckPath: /health
    envVars:
      - key: DEFAULT_PROVIDER
        value: ollabridge
      - key: OLLABRIDGE_BASE_URL
        sync: false
      - key: OLLABRIDGE_API_KEY
        sync: false
      - key: OLLABRIDGE_MODEL
        value: deepseek-r1
      - key: PORT
        value: 8000
```

---

### Deploy to Railway

Railway supports Docker deployments via Dockerfile detection.

1. **Install Railway CLI** (optional)
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy from Dashboard**
   - Go to [Railway Dashboard](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Dockerfile

3. **Configure Environment Variables**
   ```
   DEFAULT_PROVIDER=ollabridge
   OLLABRIDGE_BASE_URL=https://your-tunnel-url
   OLLABRIDGE_API_KEY=sk-ollabridge-xxxxx
   PORT=8000
   ```

4. **Deploy via CLI** (alternative)
   ```bash
   railway init
   railway up
   railway open
   ```

---

### Deploy to Fly.io

Fly.io requires a `fly.toml` configuration file.

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. **Create fly.toml**
   ```toml
   app = "jobcraft-copilot"
   primary_region = "iad"

   [build]
     dockerfile = "Dockerfile"
     [build.args]
       BUILD_VERSION = "1.0.0"

   [env]
     DEFAULT_PROVIDER = "ollabridge"
     OLLABRIDGE_MODEL = "deepseek-r1"
     PORT = "8080"

   [[services]]
     internal_port = 8080
     protocol = "tcp"

     [[services.ports]]
       handlers = ["http"]
       port = 80

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443

     [[services.tcp_checks]]
       interval = "15s"
       timeout = "2s"
       grace_period = "5s"
       restart_limit = 0

   [[services.http_checks]]
     interval = "30s"
     timeout = "5s"
     grace_period = "10s"
     method = "get"
     path = "/health"
   ```

3. **Set Secrets**
   ```bash
   fly secrets set OLLABRIDGE_API_KEY=sk-ollabridge-xxxxx
   fly secrets set OLLABRIDGE_BASE_URL=https://your-tunnel-url
   ```

4. **Deploy**
   ```bash
   fly launch --no-deploy  # Configure first
   fly deploy              # Deploy
   fly open                # Open in browser
   ```

---

### Deploy to Docker Hub

Publish your image to Docker Hub for reuse across platforms.

#### Using Makefile

```bash
# Set your Docker Hub username
export DOCKERHUB_USERNAME=your-username

# Build and publish (prompts for Docker Hub login)
make publish

# Pull the published image
docker pull docker.io/your-username/jobcraft:latest
```

#### Manual Process

```bash
# 1. Build the image
docker build --target fullstack -t jobcraft:latest .

# 2. Tag for Docker Hub
docker tag jobcraft:latest your-username/jobcraft:latest
docker tag jobcraft:latest your-username/jobcraft:v1.0.0

# 3. Login to Docker Hub
docker login docker.io

# 4. Push images
docker push your-username/jobcraft:latest
docker push your-username/jobcraft:v1.0.0
```

#### GitHub Actions

The repository includes a Docker publishing workflow:

**.github/workflows/docker-publish.yml**

**Trigger via Release:**
```bash
git tag v1.0.0
git push origin v1.0.0
# Go to GitHub → Releases → Create Release → Tag: v1.0.0
```

**Trigger Manually:**
- Go to GitHub → Actions → "📦 Publish Docker (Docker Hub)"
- Click "Run workflow"
- Enter version (e.g., `v1.0.0`)

**Required Secrets:**
- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token

---

## Makefile Commands

Complete reference of available make commands:

### Building

```bash
make build-container      # Build full-stack image
make build-frontend       # Build frontend-only image
make build-backend        # Build backend-only image
```

### Running

```bash
make run-container        # Run with default env vars
make run-container-env    # Run with .env file
make logs-container       # View logs (follow mode)
make status-container     # Show container status
make health-container     # Check health endpoint
```

### Managing

```bash
make stop-container       # Stop and remove container
make shell-container      # Open bash shell in container
make docker-clean         # Clean Docker artifacts
```

### Publishing

```bash
make publish              # Build and push to Docker Hub
```

### Information

```bash
make help                 # Show all commands
```

---

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
make logs-container
# or
docker logs jobcraft
```

**Common issues:**
- Missing environment variables (especially LLM provider credentials)
- Port 8000 already in use
- Insufficient disk space

**Solution:**
```bash
# Use different port
docker run -d -p 8080:8000 \
  -e PORT=8000 \
  -e OLLABRIDGE_API_KEY=sk-ollabridge-xxx \
  jobcraft:latest

# Check port usage
lsof -i :8000
```

### Health Check Failing

**Test health endpoint:**
```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{"status": "healthy"}
```

**If failing:**
- Backend may not be starting (check supervisor logs)
- Nginx not proxying correctly (check nginx logs)

**View detailed logs:**
```bash
docker exec jobcraft cat /var/log/supervisor/backend.err.log
docker exec jobcraft cat /var/log/supervisor/nginx.err.log
```

### Build Failing

**Frontend build errors:**
```bash
# Test frontend build separately
cd frontend
npm install
npm run build
```

**Backend dependency errors:**
```bash
# Test backend dependencies
cd backend
pip install -r requirements.txt
```

**Docker build cache issues:**
```bash
# Clean build (no cache)
docker build --no-cache --target fullstack -t jobcraft:latest .
```

### OllaBridge Connection Issues

**Error:** "Failed to connect to OllaBridge"

**Solutions:**

1. **Check OllaBridge is running:**
   ```bash
   curl http://localhost:11435/api/tags
   ```

2. **Use secure tunnel URL in production:**
   ```bash
   # Instead of localhost, use your tunnel URL
   OLLABRIDGE_BASE_URL=https://abc123.ollabridge.com
   ```

3. **Verify API key:**
   ```bash
   # Copy from `ollabridge start` output
   OLLABRIDGE_API_KEY=sk-ollabridge-xxxxx
   ```

### Render-Specific Issues

**Build timeout:**
- Render free tier has 15-minute build timeout
- Solution: Use pre-built Docker Hub image

**Port binding:**
- Render sets `PORT` environment variable dynamically
- Dockerfile handles this automatically via start.sh

**Database persistence:**
- Use Render disk for SQLite persistence
- Add disk mount: `/app/data`

---

## Production Checklist

Before deploying to production:

- [ ] Set strong API keys for all LLM providers
- [ ] Configure environment variables (never commit .env)
- [ ] Enable HTTPS (handled by platform)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy for `/app/data`
- [ ] Review security headers in nginx config
- [ ] Test health check endpoint
- [ ] Verify all provider connections work
- [ ] Set appropriate resource limits
- [ ] Review logs for errors

---

## Additional Resources

- [Dockerfile Reference](./Dockerfile)
- [Makefile Reference](./Makefile)
- [Environment Variables](.env.example)
- [GitHub Actions Workflow](./.github/workflows/docker-publish.yml)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Fly.io Documentation](https://fly.io/docs/)

---

**Need help?** Open an issue at https://github.com/ruslanmv/jobcraft/issues
