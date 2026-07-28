# ============================================================
# Portfolio Mobile — Makefile
# ============================================================
# Usage: make <target>
# Run `make help` to see all available commands.
# ============================================================

# Variables
APP_NAME       := portfolio-mobile
DOCKER_USER    := ntphong04102k4
IMAGE_NAME     := $(DOCKER_USER)/$(APP_NAME)
VERSION        := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
CONTAINER_NAME := $(APP_NAME)

# Colors for output
CYAN  := \033[36m
GREEN := \033[32m
RESET := \033[0m

.PHONY: help install dev build lint lint-fix typecheck ci preview clean \
        docker-build docker-run docker-stop docker-push docker-tag \
        docker-compose-up docker-compose-down docker-compose-dev docker-logs

# ============================================================
# 📖 Help
# ============================================================

help: ## Show available commands
	@echo ""
	@echo "$(CYAN)Portfolio Mobile — Available Commands$(RESET)"
	@echo "======================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-22s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ============================================================
# 🛠️  Development
# ============================================================

install: ## Install dependencies
	npm ci

dev: ## Start Vite dev server
	npm run dev

build: ## Build production bundle
	npm run build

preview: ## Preview production build locally
	npm run preview

# ============================================================
# 🔍 Code Quality
# ============================================================

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npx eslint . --fix

typecheck: ## Run TypeScript type checking
	npx tsc --noEmit

ci: lint typecheck build ## Run full CI pipeline locally (lint + typecheck + build)
	@echo "$(GREEN)✅ All CI checks passed!$(RESET)"

# ============================================================
# 🐳 Docker
# ============================================================

docker-build: ## Build Docker image
	docker build -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .

docker-run: ## Run Docker container (port 3000)
	docker run -d --name $(CONTAINER_NAME) -p 3000:80 $(IMAGE_NAME):latest

docker-stop: ## Stop and remove Docker container
	docker stop $(CONTAINER_NAME) 2>/dev/null || true
	docker rm $(CONTAINER_NAME) 2>/dev/null || true

docker-tag: ## Tag Docker image with version
	docker tag $(IMAGE_NAME):latest $(IMAGE_NAME):$(VERSION)

docker-push: docker-tag ## Push Docker image to Docker Hub
	docker push $(IMAGE_NAME):$(VERSION)
	docker push $(IMAGE_NAME):latest

docker-logs: ## View Docker container logs
	docker logs -f $(CONTAINER_NAME)

docker-shell: ## Open shell in running container
	docker exec -it $(CONTAINER_NAME) sh

# ============================================================
# 🐳 Docker Compose
# ============================================================

docker-compose-up: ## Start production via docker-compose
	docker compose up -d portfolio

docker-compose-dev: ## Start dev server via docker-compose
	docker compose up portfolio-dev

docker-compose-down: ## Stop all docker-compose services
	docker compose down

docker-compose-build: ## Rebuild docker-compose images
	docker compose build --no-cache

# ============================================================
# 🧹 Cleanup
# ============================================================

clean: ## Remove dist/ and node_modules/
	rm -rf dist node_modules

clean-docker: docker-stop ## Remove Docker image and container
	docker rmi $(IMAGE_NAME):latest $(IMAGE_NAME):$(VERSION) 2>/dev/null || true
