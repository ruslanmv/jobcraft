.PHONY: install setup dev backend frontend clean

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
