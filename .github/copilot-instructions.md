# Amzur Lead Engine - Workspace Instructions

## Project Overview
AI-powered lead intelligence platform for Amzur Technologies that automatically discovers, qualifies, enriches, scores, and prioritizes potential prospects.

## Tech Stack
- Frontend: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- Backend: NestJS, Node.js, TypeScript
- Database: PostgreSQL with Prisma ORM
- Search: Elasticsearch
- Queue: Redis + BullMQ
- AI: OpenAI GPT-4
- Auth: Clerk
- Monorepo: Turborepo

## Setup Progress

- [x] Create .github/copilot-instructions.md
- [x] Get project setup information
- [x] Initialize monorepo structure
- [x] Set up Next.js 15 frontend (apps/web)
- [x] Set up NestJS backend (apps/api)
- [x] Create shared packages
- [x] Create AI agents
- [x] Set up database schema
- [x] Create infrastructure configs
- [x] Create documentation

## ✅ Project Setup Complete!

The Amzur Lead Engine workspace has been successfully created with the following structure:

### Apps
- **apps/web** - Next.js 15 frontend with Tailwind CSS and shadcn/ui
- **apps/api** - NestJS backend with REST API and Swagger docs

### Packages
- **packages/database** - Prisma ORM with PostgreSQL schema
- **packages/ai** - OpenAI GPT-4 integration for signal detection and content generation
- **packages/lead-discovery** - Web scraping and API integrations for lead discovery
- **packages/lead-scoring** - Lead scoring algorithms (0-100 points)

### AI Agents
- **agents/discovery-agent** - Discovers companies from job boards and news
- **agents/signal-agent** - Detects buying signals using AI
- **agents/qualification-agent** - Scores and qualifies leads
- **agents/enrichment-agent** - Enriches company data and finds decision makers
- **agents/outreach-agent** - Generates personalized outreach content

### Infrastructure
- **docker-compose.yml** - PostgreSQL, Redis, Elasticsearch services
- **Dockerfiles** - Container configurations for web and API
- **scripts/setup.sh** - Automated setup script

### Documentation
- **README.md** - Project overview and quick start guide
- **docs/ARCHITECTURE.md** - System architecture and data flow
- **docs/API.md** - API endpoint documentation
- **docs/SETUP.md** - Detailed development setup guide

## Next Steps

1. **Install dependencies**: Run `pnpm install` in the root directory
2. **Start Docker services**: Run `docker-compose up -d`
3. **Configure environment**: Copy `.env.example` to `.env` and add your API keys
4. **Setup database**: Run `pnpm db:generate && pnpm db:push`
5. **Start development**: Run `pnpm dev`

See **docs/SETUP.md** for detailed setup instructions.
