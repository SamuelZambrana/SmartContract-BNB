.PHONY: help install setup dev build test clean deploy

# Default target
help:
	@echo "🎨 NFT Marketplace - Comandos disponíveis:"
	@echo ""
	@echo "📦 Setup:"
	@echo "  make setup     - Configurar todo o projeto"
	@echo "  make install   - Instalar dependências"
	@echo ""
	@echo "🚀 Desenvolvimento:"
	@echo "  make dev       - Iniciar ambiente de desenvolvimento"
	@echo "  make build     - Buildar todos os componentes"
	@echo ""
	@echo "🧪 Testes:"
	@echo "  make test      - Executar todos os testes"
	@echo ""
	@echo "🗑️  Limpeza:"
	@echo "  make clean     - Limpar arquivos temporários"
	@echo ""
	@echo "🚀 Deploy:"
	@echo "  make deploy    - Deploy para produção"

# Setup completo
setup:
	@echo "🚀 Configurando NodeMeta Assessment..."
	@chmod +x setup-local.sh
	@./setup-local.sh

# Instalar dependências
install:
	@echo "📦 Instalando dependências..."
	@cd contracts && npm install
	@cd frontend && npm install
	@cd backend && npm install
	@cd payments && npm install

# Desenvolvimento
dev:
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:8080"
	@echo "📊 API Health: http://localhost:8080/health"
	@echo ""
	@echo "Pressione Ctrl+C para parar"
	@docker-compose up --build

# Build
build:
	@echo "🔨 Buildando projeto..."
	@cd contracts && npx hardhat compile
	@cd frontend && npm run build
	@cd backend && npm test

# Testes
test:
	@echo "🧪 Executando testes..."
	@cd contracts && npx hardhat test
	@cd frontend && npm run lint
	@cd backend && npm test
	@cd payments && npm test

# Limpeza
clean:
	@echo "🗑️ Limpando arquivos temporários..."
	@cd contracts && npx hardhat clean
	@cd frontend && rm -rf dist node_modules
	@cd backend && rm -rf node_modules
	@docker-compose down -v
	@docker system prune -f

# Deploy
deploy:
	@echo "🚀 Fazendo deploy..."
	@cd contracts && npx hardhat run scripts/deploy.js --network sepolia
	@echo "✅ Deploy concluído!"

# Comandos específicos
contracts-compile:
	@echo "🔨 Compilando smart contracts..."
	@cd contracts && npx hardhat compile

contracts-deploy:
	@echo "🚀 Deployando smart contracts..."
	@cd contracts && npx hardhat run scripts/deploy.js --network sepolia

frontend-dev:
	@echo "📱 Iniciando frontend..."
	@cd frontend && npm run dev

backend-dev:
	@echo "🔧 Iniciando backend..."
	@cd backend && npm run dev

docker-up:
	@echo "🐳 Iniciando containers Docker..."
	@docker-compose up -d

docker-down:
	@echo "🐳 Parando containers Docker..."
	@docker-compose down

# Verificação de saúde
health:
	@echo "🏥 Verificando saúde dos serviços..."
	@curl -f http://localhost:8080/health || echo "❌ Backend não está rodando"
	@curl -f http://localhost:3000 || echo "❌ Frontend não está rodando"

# Logs
logs:
	@docker-compose logs -f

# Backup
backup:
	@echo "💾 Fazendo backup..."
	@tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz \
		--exclude=node_modules \
		--exclude=dist \
		--exclude=.git \
		--exclude=*.tar.gz \
		.