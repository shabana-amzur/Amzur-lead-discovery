# Amzur Lead Engine

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

> AI-powered lead intelligence platform that automatically discovers, qualifies, enriches, scores, and prioritizes potential prospects for Amzur Technologies.

## 🎯 Overview

Amzur Lead Engine is a sophisticated B2B lead generation and intelligence platform designed to help Amzur's sales, marketing, and business development teams identify companies actively showing buying intent for Amzur's services. The platform provides actionable lead intelligence for outreach, eliminating manual research and prospecting efforts.

### Key Features

- **🔍 Automated Lead Discovery** - Continuously scans LinkedIn, job boards, news sites, and social media for prospects
- **🧠 AI-Powered Signal Detection** - Uses GPT-4 to identify buying intent from hiring, funding, tech stack, and pain point signals
- **📊 Intelligent Lead Scoring** - Scores leads 0-100 based on company fit, service match, and intent strength
- **💎 Lead Enrichment** - Automatically finds decision makers (CTO, CIO, VP Engineering) with contact details
- **📧 Outreach Assistant** - Generates personalized cold emails, LinkedIn messages, and discovery call scripts
- **📈 Executive Dashboard** - Real-time pipeline visibility and opportunity tracking

### Amzur Services Matched

- **Digital Engineering** - App development, modernization, low-code, Shopify
- **Cloud Services** - AWS migration, Kubernetes, DevOps transformation
- **AI/ML** - Computer vision, generative AI, chatbots, ML implementation
- **ERP (NetSuite)** - NetSuite implementation, ERP consulting, financial automation
- **Managed Services** - Infrastructure management, application support, QA testing
- **Cybersecurity** - Vulnerability management, security testing, compliance

## 🏗️ Architecture

```
amzur-lead-engine/
├── apps/
│   ├── web/              # Next.js 15 frontend
│   └── api/              # NestJS backend API
├── packages/
│   ├── ai/               # OpenAI integration
│   ├── lead-discovery/   # Web scraping & API integrations
│   ├── lead-scoring/     # Scoring algorithms
│   ├── lead-enrichment/  # Contact finding
│   ├── database/         # Prisma schema & client
│   └── ui/               # Shared UI components
├── agents/
│   ├── discovery-agent/      # Discovers companies
│   ├── signal-agent/         # Detects buying signals
│   ├── qualification-agent/  # Scores & qualifies leads
│   ├── enrichment-agent/     # Enriches lead data
│   └── outreach-agent/       # Generates outreach
└── infrastructure/
    └── docker/          # Docker configurations
```

### Tech Stack

**Frontend**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Clerk Authentication
- TanStack Query

**Backend**
- NestJS
- Node.js
- PostgreSQL + Prisma ORM
- Redis + BullMQ (job queues)
- Elasticsearch (search)
- OpenAI GPT-4

**Infrastructure**
- Docker & Docker Compose
- Vercel (frontend deployment)
- AWS (backend deployment)
- Turborepo (monorepo management)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd amzur-lead-engine
   ```

2. **Run setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys:
   # - OPENAI_API_KEY
   # - CLERK_SECRET_KEY
   # - Database credentials (if not using Docker defaults)
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs

### Manual Setup

If you prefer manual setup:

```bash
# Start infrastructure services
docker-compose up -d

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start all apps
pnpm dev
```

## 📖 Usage

### Starting the AI Agents

Run individual agents:

```bash
# Discovery Agent - Finds new companies
cd agents/discovery-agent
pnpm dev

# Signal Agent - Detects buying signals
cd agents/signal-agent
pnpm dev

# Qualification Agent - Scores leads
cd agents/qualification-agent
pnpm dev

# Enrichment Agent - Finds contacts
cd agents/enrichment-agent
pnpm dev

# Outreach Agent - Generates outreach
cd agents/outreach-agent
pnpm dev
```

### Database Management

```bash
# Open Prisma Studio
pnpm db:studio

# Create a migration
pnpm db:migrate

# Reset database
pnpm db:push --force-reset
```

### Running Tests

```bash
pnpm test
```

## 🎯 How It Works

### 1. Lead Discovery
The Discovery Agent continuously searches for companies showing interest in IT services:
- Monitors job boards (LinkedIn, Indeed) for relevant roles (AWS Architect, DevOps Engineer, etc.)
- Scans tech news for funding announcements, expansions, digital transformation initiatives
- Tracks social media for technology discussions

### 2. Signal Detection
The Signal Agent uses AI to analyze content and detect buying signals:
- **HIRING**: Job postings for technical roles
- **TECHNOLOGY**: Tech stack changes, modernization needs
- **FUNDING**: Investment rounds, expansion funding
- **GROWTH**: New offices, market expansion
- **PAIN_POINT**: Operational inefficiencies, technical debt

### 3. Lead Qualification
The Qualification Agent scores leads 0-100:
- **Company Fit (0-35)**: Industry, size, geography alignment
- **Service Fit (0-30)**: Match with Amzur's service offerings
- **Intent Score (0-25)**: Strength and recency of buying signals
- **Engagement (0-10)**: Interaction history

Leads scoring 70+ are marked as "Qualified"

### 4. Lead Enrichment
The Enrichment Agent finds decision makers:
- Searches for CTO, CIO, VP Engineering, Director of IT
- Finds contact information (email, LinkedIn)
- Enriches company data (employee count, revenue, tech stack)

### 5. Outreach Generation
The Outreach Agent generates personalized content:
- **Cold Emails**: Personalized to company signals and pain points
- **LinkedIn Messages**: Short, conversational connection requests
- **Discovery Scripts**: Tailored questions for sales calls

## 📊 Database Schema

### Core Entities

- **Company** - Company information (name, website, industry, size)
- **Lead** - Lead records with status and score
- **BuyingSignal** - Detected intent signals
- **Opportunity** - Service-specific opportunities
- **Contact** - Decision maker contacts
- **OutreachMessage** - Generated outreach content
- **JobPosting** - Scraped job postings
- **NewsArticle** - Collected news articles

## 🔧 API Endpoints

### Leads
- `POST /api/leads/discover` - Trigger lead discovery
- `GET /api/leads` - List all leads (with filters)
- `GET /api/leads/:id` - Get lead details
- `POST /api/leads/:id/qualify` - Run qualification
- `POST /api/leads/:id/enrich` - Enrich lead data
- `PATCH /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Opportunities
- `GET /api/opportunities` - List opportunities
- `GET /api/opportunities/by-service` - Group by service

### Contacts
- `GET /api/contacts/lead/:leadId` - Get contacts for lead

### Dashboard
- `GET /api/dashboard/stats` - Dashboard metrics

## 🎨 Frontend Pages

- `/` - Landing page
- `/dashboard` - Executive dashboard with metrics
- `/leads` - Lead pipeline (kanban view)
- `/leads/[id]` - Detailed lead view
- `/opportunities` - Service-based opportunities
- `/contacts` - Decision maker directory
- `/settings` - Configuration

## 🔐 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/amzur_lead_engine"

# Redis
REDIS_URL="redis://localhost:6379"

# Elasticsearch
ELASTICSEARCH_URL="http://localhost:9200"

# OpenAI
OPENAI_API_KEY="sk-..."

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Optional: Third-party APIs
CRUNCHBASE_API_KEY=""
LINKEDIN_API_KEY=""
CLEARBIT_API_KEY=""
```

## 📦 Monorepo Commands

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Build all apps
pnpm build

# Run linters
pnpm lint

# Format code
pnpm format

# Clean all builds
pnpm clean

# Database commands
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
pnpm db:migrate     # Create migration
pnpm db:studio      # Open Prisma Studio
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel
```

### Backend (AWS/Docker)

```bash
# Build production image
docker build -f apps/api/Dockerfile -t amzur-api .

# Run production container
docker run -p 3001:3001 --env-file .env amzur-api
```

## 📈 Roadmap

- [ ] LinkedIn API integration
- [ ] Crunchbase API integration
- [ ] Email sending integration
- [ ] LinkedIn messaging automation
- [ ] Advanced analytics & reporting
- [ ] Custom alert rules
- [ ] Webhook integrations
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built for Amzur Technologies

## 📞 Support

For support, email support@amzur.com or open an issue on GitHub.

---

**Made with ❤️ for Amzur Technologies**
