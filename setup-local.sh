#!/bin/bash

echo "🚀 Setting up NodeMeta Assessment for local development..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

check_requirements() {
  print_status "Checking requirements..."
  if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+"
    exit 1
  fi
  if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
  fi
  print_status "All requirements are met!"
}

setup_dir() {
  local dir=$1
  print_status "Setting up $dir..."
  cd "$dir" || exit 1
  if [ ! -f .env ] && [ -f env.example ]; then
    cp env.example .env
    print_warning "Created .env in $dir"
  fi
  npm install
  cd - > /dev/null || exit 1
}

main() {
  check_requirements
  setup_dir backend
  setup_dir frontend
  setup_dir contracts
  setup_dir payments

  echo ""
  print_status "Setup completed successfully!"
  echo ""
  echo "📋 Start all services:"
  echo "  Terminal 1: cd contracts && npx hardhat node"
  echo "  Terminal 2: cd contracts && npx hardhat run scripts/deploy.js --network localhost"
  echo "  Terminal 3: cd backend && npm run dev"
  echo "  Terminal 4: cd payments && npm start"
  echo "  Terminal 5: cd frontend && npm run dev"
  echo ""
  echo "🌐 URLs:"
  echo "   Frontend:  http://localhost:3000"
  echo "   Verify:    http://localhost:3000/verify"
  echo "   Backend:   http://localhost:8080/health"
  echo "   Payments:  http://localhost:3003/health"
}

main
