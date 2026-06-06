#!/bin/bash

# Amzur Lead Engine - Local Development Setup Script

echo "🚀 Setting up Amzur Lead Engine..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Copy environment file
if [ ! -f .env ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your OpenAI API key and other credentials"
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL, Redis, Elasticsearch)..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🔨 Generating Prisma client..."
pnpm db:generate

# Push database schema
echo "📊 Pushing database schema..."
pnpm db:push

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys"
echo "2. Run 'pnpm dev' to start development servers"
echo "3. Visit http://localhost:3000 for the frontend"
echo "4. Visit http://localhost:3001/api/docs for API documentation"
echo ""
echo "Useful commands:"
echo "  pnpm dev          - Start all development servers"
echo "  pnpm db:studio    - Open Prisma Studio"
echo "  docker-compose logs - View Docker logs"
echo ""
