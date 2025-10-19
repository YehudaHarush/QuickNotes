.PHONY: help setup start stop restart logs clean dev build test

# Default target
.DEFAULT_GOAL := help

# Colors for output
YELLOW := \033[1;33m
GREEN := \033[1;32m
RED := \033[1;31m
NC := \033[0m

help: ## Show this help message
	@echo '$(YELLOW)QuickNotes - Available Commands:$(NC)'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ''

setup: ## Initial setup - copy env files and install dependencies
	@echo '$(YELLOW)Setting up QuickNotes...$(NC)'
	@if not exist .env copy .env.example .env
	@if not exist frontend\.env copy frontend\.env.example frontend\.env
	@echo '$(GREEN)✓ Environment files created$(NC)'
	@echo '$(YELLOW)Installing dependencies...$(NC)'
	@cd backend && npm install
	@cd frontend && npm install
	@echo '$(GREEN)✓ Dependencies installed$(NC)'
	@echo '$(GREEN)✓ Setup complete! Run "make start" to start the application$(NC)'

start: ## Start all services in production mode
	@echo '$(YELLOW)Starting QuickNotes in production mode...$(NC)'
	@docker-compose up -d
	@echo '$(GREEN)✓ Services started!$(NC)'
	@echo '$(GREEN)Frontend: http://localhost$(NC)'
	@echo '$(GREEN)API Health: http://localhost/api/health$(NC)'
	@echo '$(GREEN)Metrics: http://localhost:8080/metrics$(NC)'

stop: ## Stop all services
	@echo '$(YELLOW)Stopping QuickNotes...$(NC)'
	@docker-compose down
	@echo '$(GREEN)✓ Services stopped$(NC)'

restart: stop start ## Restart all services

logs: ## View logs from all services
	@docker-compose logs -f

logs-api: ## View logs from API services only
	@docker-compose logs -f api-1 api-2

logs-frontend: ## View logs from frontend service
	@docker-compose logs -f frontend

clean: ## Stop services and remove volumes
	@echo '$(YELLOW)Cleaning up QuickNotes...$(NC)'
	@docker-compose down -v
	@echo '$(GREEN)✓ Cleanup complete$(NC)'

dev: ## Start all services in development mode with hot reload
	@echo '$(YELLOW)Starting QuickNotes in development mode...$(NC)'
	@docker-compose -f docker-compose.yml -f docker-compose.override.yml up
	@echo '$(GREEN)✓ Development mode started$(NC)'

build: ## Build all Docker images
	@echo '$(YELLOW)Building Docker images...$(NC)'
	@docker-compose build
	@echo '$(GREEN)✓ Build complete$(NC)'

rebuild: ## Rebuild all Docker images without cache
	@echo '$(YELLOW)Rebuilding Docker images...$(NC)'
	@docker-compose build --no-cache
	@echo '$(GREEN)✓ Rebuild complete$(NC)'

ps: ## Show running containers
	@docker-compose ps

status: ## Show service status and health
	@echo '$(YELLOW)Service Status:$(NC)'
	@docker-compose ps
	@echo ''
	@echo '$(YELLOW)Health Checks:$(NC)'
	@curl -s http://localhost/api/health | jq . || echo '$(RED)API not responding$(NC)'

backend-shell: ## Open shell in backend container
	@docker-compose exec api-1 sh

frontend-shell: ## Open shell in frontend container
	@docker-compose exec frontend sh

db-shell: ## Open PostgreSQL shell
	@docker-compose exec postgres psql -U postgres -d quicknotes

redis-cli: ## Open Redis CLI
	@docker-compose exec redis redis-cli

test: ## Run tests (placeholder)
	@echo '$(YELLOW)Running tests...$(NC)'
	@cd backend && npm test
	@cd frontend && npm test
	@echo '$(GREEN)✓ Tests complete$(NC)'
