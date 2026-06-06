# Development Setup Guide

## Prerequisites

Make sure you have the following installed:

- **Node.js**: v20 or higher
- **pnpm**: v9 or higher
- **Docker**: Latest version
- **Docker Compose**: Latest version
- **Git**: Latest version

## Step-by-Step Setup

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 2. Clone and Navigate

```bash
cd "Amzur Lead Engine"
```

### 3. Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Required: OpenAI API Key
OPENAI_API_KEY="sk-your-key-here"

# Required: Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_your-key"
CLERK_SECRET_KEY="sk_your-key"

# Database (default for Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/amzur_lead_engine"

# Redis (default for Docker)
REDIS_URL="redis://localhost:6379"

# Elasticsearch (default for Docker)
ELASTICSEARCH_URL="http://localhost:9200"
```

### 4. Start Infrastructure Services

Start PostgreSQL, Redis, and Elasticsearch:

```bash
docker-compose up -d
```

Verify services are running:

```bash
docker-compose ps
```

You should see:
- `amzur-postgres` (port 5432)
- `amzur-redis` (port 6379)
- `amzur-elasticsearch` (port 9200)

### 5. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for:
- Root workspace
- Frontend (apps/web)
- Backend (apps/api)
- All packages
- All agents

### 6. Setup Database

Generate Prisma client:

```bash
pnpm db:generate
```

Push database schema:

```bash
pnpm db:push
```

Optional: Open Prisma Studio to view database:

```bash
pnpm db:studio
```

### 7. Start Development Servers

Run all apps in development mode:

```bash
pnpm dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

### 8. Run AI Agents (Optional)

In separate terminal windows, start individual agents:

**Discovery Agent:**
```bash
cd agents/discovery-agent
pnpm dev
```

**Signal Agent:**
```bash
cd agents/signal-agent
pnpm dev
```

**Qualification Agent:**
```bash
cd agents/qualification-agent
pnpm dev
```

**Enrichment Agent:**
```bash
cd agents/enrichment-agent
pnpm dev
```

**Outreach Agent:**
```bash
cd agents/outreach-agent
pnpm dev
```

## Verify Setup

### Check Frontend
Visit http://localhost:3000 - You should see the Amzur Lead Engine dashboard

### Check Backend API
Visit http://localhost:3001/api/docs - You should see Swagger API documentation

### Check Database
Run: `pnpm db:studio` - Prisma Studio should open in your browser

### Check Docker Services

```bash
# Check PostgreSQL
docker exec -it amzur-postgres psql -U postgres -d amzur_lead_engine -c "\dt"

# Check Redis
docker exec -it amzur-redis redis-cli ping
# Should return: PONG

# Check Elasticsearch
curl http://localhost:9200/_cluster/health
```

## Common Issues & Solutions

### Issue: Port already in use

**Solution:** Stop the service using the port or change the port in `.env`

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Issue: Docker services won't start

**Solution:** Reset Docker

```bash
docker-compose down -v
docker-compose up -d
```

### Issue: Prisma errors

**Solution:** Regenerate Prisma client

```bash
pnpm db:generate
pnpm db:push
```

### Issue: Missing dependencies

**Solution:** Clean and reinstall

```bash
pnpm clean
pnpm install
```

### Issue: TypeScript errors

**Solution:** Rebuild workspace

```bash
pnpm build
```

## Development Workflow

### Making Changes

1. **Frontend changes**: Edit files in `apps/web/src`
   - Hot reload is enabled
   - Changes appear immediately

2. **Backend changes**: Edit files in `apps/api/src`
   - NestJS watch mode is enabled
   - API restarts automatically

3. **Database changes**: Edit `packages/database/prisma/schema.prisma`
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

### Testing Your Changes

```bash
# Run linter
pnpm lint

# Format code
pnpm format

# Run tests (when implemented)
pnpm test
```

### Creating a Migration

```bash
cd packages/database
pnpm db:migrate
```

### Viewing Logs

```bash
# Docker logs
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
```

## Stopping the Application

### Stop Development Servers
Press `Ctrl+C` in the terminal running `pnpm dev`

### Stop Docker Services
```bash
docker-compose down
```

### Stop Everything and Clean Up
```bash
docker-compose down -v  # Removes volumes (deletes data!)
pnpm clean             # Removes node_modules and build files
```

## Next Steps

1. **Explore the API**: http://localhost:3001/api/docs
2. **View Database**: `pnpm db:studio`
3. **Read Architecture**: See `docs/ARCHITECTURE.md`
4. **Check API Docs**: See `docs/API.md`
5. **Start building features!**

## Getting Help

- Check `README.md` for overview
- Check `docs/ARCHITECTURE.md` for system design
- Check `docs/API.md` for API reference
- Open an issue on GitHub

## Useful Commands Reference

```bash
# Development
pnpm dev              # Start all dev servers
pnpm build            # Build all apps
pnpm lint             # Run linters
pnpm format           # Format code
pnpm clean            # Clean build files

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to DB
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio

# Docker
docker-compose up -d           # Start services
docker-compose down            # Stop services
docker-compose logs -f         # View logs
docker-compose ps              # List services
docker-compose restart         # Restart services

# Agents
cd agents/discovery-agent && pnpm dev
cd agents/signal-agent && pnpm dev
cd agents/qualification-agent && pnpm dev
cd agents/enrichment-agent && pnpm dev
cd agents/outreach-agent && pnpm dev
```

Happy coding! 🚀
