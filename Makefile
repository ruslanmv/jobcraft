.PHONY: install setup dev backend frontend clean build-container run-container stop-container publish docker-clean

# ============================================================================
# Local Development
# ============================================================================

install:
	@echo "📦 Installing Backend..."
	uv sync
	@echo "📦 Installing Frontend..."
	cd frontend && npm install

setup: install
	@echo "🎭 Installing Playwright (optional; used only for allowlisted ATS assist)..."
	uv run playwright install chromium

backend:
	uv run jobcraft-serve

frontend:
	cd frontend && npm run dev

dev:
	@echo "🚀 Starting JobCraft Copilot (API + UI)..."
	@(trap 'kill 0' SIGINT; \
	uv run jobcraft-serve & \
	cd frontend && npm run dev & \
	wait)

clean:
	rm -rf backend/__pycache__ backend/**/__pycache__

# ============================================================================
# Docker Container Management
# ============================================================================

# Configuration
DOCKER_IMAGE ?= jobcraft
DOCKER_TAG ?= latest
DOCKER_REGISTRY ?= docker.io
DOCKER_USERNAME ?= $(shell echo $$DOCKERHUB_USERNAME)
BUILD_VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
BUILD_COMMIT ?= $(shell git rev-parse HEAD 2>/dev/null || echo "unknown")
BUILD_DATE ?= $(shell date -u +'%Y-%m-%dT%H:%M:%SZ')

# Build full-stack Docker image (frontend + backend in single container)
build-container:
	@echo "🐳 Building Docker image: $(DOCKER_IMAGE):$(DOCKER_TAG)"
	@echo "   Version: $(BUILD_VERSION)"
	@echo "   Commit:  $(BUILD_COMMIT)"
	@echo "   Date:    $(BUILD_DATE)"
	docker build \
		--target fullstack \
		--build-arg BUILD_VERSION=$(BUILD_VERSION) \
		--build-arg BUILD_COMMIT=$(BUILD_COMMIT) \
		--build-arg BUILD_DATE=$(BUILD_DATE) \
		-t $(DOCKER_IMAGE):$(DOCKER_TAG) \
		-t $(DOCKER_IMAGE):$(BUILD_VERSION) \
		.
	@echo "✅ Build complete: $(DOCKER_IMAGE):$(DOCKER_TAG)"

# Build individual targets
build-frontend:
	@echo "🐳 Building frontend image..."
	docker build --target frontend-production -t $(DOCKER_IMAGE):frontend-$(DOCKER_TAG) .

build-backend:
	@echo "🐳 Building backend image..."
	docker build --target backend-production -t $(DOCKER_IMAGE):backend-$(DOCKER_TAG) .

# Run container locally
run-container:
	@echo "🚀 Starting JobCraft container..."
	@echo "   Image: $(DOCKER_IMAGE):$(DOCKER_TAG)"
	@echo "   Port:  8000"
	@echo ""
	@echo "   Access at: http://localhost:8000"
	@echo ""
	docker run -d \
		--name jobcraft \
		-p 8000:8000 \
		-e DEFAULT_PROVIDER=ollabridge \
		-e OLLABRIDGE_BASE_URL=$${OLLABRIDGE_BASE_URL:-http://localhost:11435} \
		-e OLLABRIDGE_API_KEY=$${OLLABRIDGE_API_KEY} \
		-e OLLABRIDGE_MODEL=$${OLLABRIDGE_MODEL:-deepseek-r1} \
		-v $(PWD)/data:/app/data \
		$(DOCKER_IMAGE):$(DOCKER_TAG)
	@echo ""
	@echo "✅ Container started: jobcraft"
	@echo "   View logs: make logs-container"
	@echo "   Stop:      make stop-container"

# Run container with all environment variables
run-container-env:
	@echo "🚀 Starting JobCraft container with environment file..."
	docker run -d \
		--name jobcraft \
		-p 8000:8000 \
		--env-file .env \
		-v $(PWD)/data:/app/data \
		$(DOCKER_IMAGE):$(DOCKER_TAG)

# Stop and remove container
stop-container:
	@echo "🛑 Stopping container..."
	docker stop jobcraft 2>/dev/null || true
	docker rm jobcraft 2>/dev/null || true
	@echo "✅ Container stopped and removed"

# View container logs
logs-container:
	docker logs -f jobcraft

# Publish to Docker registry
publish: build-container
	@if [ -z "$(DOCKER_USERNAME)" ]; then \
		echo "❌ Error: DOCKERHUB_USERNAME not set"; \
		echo "   Set it with: export DOCKERHUB_USERNAME=your-username"; \
		exit 1; \
	fi
	@echo "🚀 Publishing to Docker Hub..."
	@echo "   Registry: $(DOCKER_REGISTRY)"
	@echo "   Image:    $(DOCKER_USERNAME)/$(DOCKER_IMAGE)"
	@echo "   Tags:     $(DOCKER_TAG), $(BUILD_VERSION)"
	@echo ""
	@echo "Logging in to Docker Hub..."
	docker login $(DOCKER_REGISTRY)
	@echo ""
	@echo "Tagging images..."
	docker tag $(DOCKER_IMAGE):$(DOCKER_TAG) $(DOCKER_REGISTRY)/$(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(DOCKER_TAG)
	docker tag $(DOCKER_IMAGE):$(DOCKER_TAG) $(DOCKER_REGISTRY)/$(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(BUILD_VERSION)
	@echo ""
	@echo "Pushing to registry..."
	docker push $(DOCKER_REGISTRY)/$(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(DOCKER_TAG)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(BUILD_VERSION)
	@echo ""
	@echo "✅ Published successfully!"
	@echo "   Pull with: docker pull $(DOCKER_REGISTRY)/$(DOCKER_USERNAME)/$(DOCKER_IMAGE):$(DOCKER_TAG)"

# Clean Docker artifacts
docker-clean:
	@echo "🧹 Cleaning Docker artifacts..."
	docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG) 2>/dev/null || true
	docker rmi $(DOCKER_IMAGE):$(BUILD_VERSION) 2>/dev/null || true
	docker system prune -f
	@echo "✅ Cleanup complete"

# Show container status
status-container:
	@echo "📊 Container Status:"
	@docker ps -a --filter name=jobcraft --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No container found"

# Interactive shell in running container
shell-container:
	@echo "🐚 Opening shell in container..."
	docker exec -it jobcraft /bin/bash

# Health check
health-container:
	@echo "🏥 Health Check:"
	@curl -f http://localhost:8000/health || echo "Container not responding"

# Help
help:
	@echo "JobCraft Copilot - Makefile Commands"
	@echo ""
	@echo "Local Development:"
	@echo "  make install           - Install dependencies"
	@echo "  make setup             - Full setup including Playwright"
	@echo "  make dev               - Run backend + frontend concurrently"
	@echo "  make backend           - Run backend only"
	@echo "  make frontend          - Run frontend only"
	@echo "  make clean             - Clean Python cache"
	@echo ""
	@echo "Docker Container:"
	@echo "  make build-container   - Build full-stack Docker image"
	@echo "  make run-container     - Run container locally"
	@echo "  make stop-container    - Stop and remove container"
	@echo "  make publish           - Build and publish to Docker Hub"
	@echo "  make logs-container    - View container logs"
	@echo "  make status-container  - Show container status"
	@echo "  make shell-container   - Open shell in container"
	@echo "  make health-container  - Check container health"
	@echo "  make docker-clean      - Clean Docker artifacts"
	@echo ""
	@echo "Build Targets:"
	@echo "  make build-frontend    - Build frontend-only image"
	@echo "  make build-backend     - Build backend-only image"
	@echo ""
	@echo "Environment Variables:"
	@echo "  DOCKER_IMAGE           - Image name (default: jobcraft)"
	@echo "  DOCKER_TAG             - Image tag (default: latest)"
	@echo "  DOCKER_USERNAME        - Docker Hub username"
	@echo "  BUILD_VERSION          - Version tag (auto from git)"
