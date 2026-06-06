# Amzur Lead Engine - Architecture Documentation

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Dashboard │  │  Leads   │  │Opportunities│  │Contacts│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API
┌────────────────────────────┼────────────────────────────────────┐
│                       Backend (NestJS)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Leads   │  │Opportunities│  │ Contacts │  │Dashboard│       │
│  │Controller│  │ Controller │  │Controller│  │Controller│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                      Job Queues (BullMQ + Redis)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Discovery │  │  Signal  │  │Qualification│  │Enrichment│       │
│  │  Queue   │  │  Queue   │  │   Queue   │  │  Queue   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                        AI Agents (Workers)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Discovery │  │  Signal  │  │Qualification│  │Enrichment│       │
│  │  Agent   │  │  Agent   │  │   Agent   │  │  Agent   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                     Data Layer (Prisma ORM)                      │
│                                                                   │
│              ┌─────────────────────────────────┐                │
│              │      PostgreSQL Database        │                │
│              │  • Companies   • Leads          │                │
│              │  • Signals     • Opportunities  │                │
│              │  • Contacts    • Outreach       │                │
│              └─────────────────────────────────┘                │
└───────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (apps/web)

**Technology**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui

**Key Features**:
- Server-side rendering (SSR)
- Client-side state management with Zustand
- API data fetching with TanStack Query
- Authentication with Clerk
- Responsive dashboard UI

**Pages**:
- `/dashboard` - Executive dashboard
- `/leads` - Lead management
- `/opportunities` - Opportunities by service
- `/contacts` - Decision maker directory

### Backend API (apps/api)

**Technology**: NestJS, TypeScript, Express

**Architecture**: Modular NestJS with dependency injection

**Modules**:
- `LeadsModule` - CRUD operations for leads
- `OpportunitiesModule` - Service opportunity tracking
- `ContactsModule` - Decision maker management
- `DashboardModule` - Aggregated statistics

**Key Features**:
- RESTful API endpoints
- Swagger/OpenAPI documentation
- Input validation with class-validator
- Database queries via Prisma ORM
- Job queue integration with BullMQ

### AI Agents

#### 1. Discovery Agent
**Purpose**: Continuously discover companies showing buying intent

**Data Sources**:
- LinkedIn Jobs
- Indeed
- News websites (TechCrunch, VentureBeat)
- Social media (Twitter/X, Reddit)
- Company websites

**Process**:
1. Searches for keywords (e.g., "AWS Architect", "Cloud Migration")
2. Scrapes job postings and news articles
3. Creates Company and Lead records
4. Triggers signal detection for new leads

#### 2. Signal Agent
**Purpose**: Analyze content to detect buying signals using AI

**Signal Types**:
- **HIRING**: Job postings for relevant roles
- **TECHNOLOGY**: Tech stack mentions
- **FUNDING**: Funding announcements
- **GROWTH**: Expansion, new offices
- **PAIN_POINT**: Inefficiencies, technical debt

**Process**:
1. Fetches unprocessed job postings and news articles
2. Sends content to OpenAI GPT-4 for analysis
3. Saves detected signals with confidence scores
4. Marks content as processed

#### 3. Qualification Agent
**Purpose**: Score and qualify leads based on fit and intent

**Scoring Algorithm**:
- **Company Fit (0-35)**:
  - Industry match: 0-15
  - Company size: 0-10
  - Geography: 0-10
- **Service Fit (0-30)**:
  - Technology stack alignment
  - Service need detection
- **Intent Score (0-25)**:
  - Signal strength: 0-15
  - Signal recency: 0-10
- **Engagement (0-10)**:
  - Interaction history

**Process**:
1. Fetches lead with company, signals, opportunities
2. Calculates score using scoring service
3. Uses AI for additional qualification insights
4. Updates lead status based on score:
   - 70+: QUALIFIED
   - 50-69: CONTACTED
   - <50: NEW

#### 4. Enrichment Agent
**Purpose**: Enrich company data and find decision makers

**Data Sources** (integrations to be added):
- Clearbit API
- Hunter.io
- RocketReach
- Apollo.io
- LinkedIn Sales Navigator

**Process**:
1. Enriches company data (employee count, revenue, industry)
2. Searches for decision makers:
   - CTO, CIO
   - VP Engineering
   - Director of IT
3. Finds contact information (email, LinkedIn)
4. Creates Contact records

#### 5. Outreach Agent
**Purpose**: Generate personalized outreach content using AI

**Outreach Types**:
- **Cold Email**: Subject + body (150 words max)
- **LinkedIn Message**: Connection request (300 chars max)
- **Discovery Call Script**: Opening, questions, value prop, next steps

**Process**:
1. Fetches lead with signals and opportunities
2. Identifies top service match
3. Generates personalized content via OpenAI
4. Saves as draft OutreachMessage
5. Human review before sending

## Data Flow

### Lead Discovery Flow
```
Job Boards / News → Discovery Agent → Company + Lead Created
                                    ↓
                              Signal Agent Triggered
                                    ↓
                         Buying Signals Detected
                                    ↓
                        Qualification Agent Triggered
                                    ↓
                           Lead Scored & Qualified
                                    ↓
                         Enrichment Agent Triggered
                                    ↓
                     Company Enriched + Contacts Found
                                    ↓
                         Outreach Agent Triggered
                                    ↓
                      Outreach Messages Generated
```

### Lead Lifecycle

```
NEW → Signal Detection → QUALIFIED (Score 70+)
                            ↓
                    Enrichment & Outreach
                            ↓
                    CONTACTED → MEETING_SCHEDULED
                                      ↓
                               PROPOSAL_SENT
                                      ↓
                               WON or LOST
```

## Database Schema

### Key Entities

```prisma
Company
├── id: String (cuid)
├── name: String
├── website: String (unique)
├── industry: String
├── employeeCount: Int
├── revenue: String
└── technologies: String[]

Lead
├── id: String (cuid)
├── companyId: String (FK)
├── status: LeadStatus (enum)
├── score: Int (0-100)
├── companyFit: Int (0-35)
├── serviceFit: Int (0-30)
├── intentScore: Int (0-25)
└── engagement: Int (0-10)

BuyingSignal
├── id: String (cuid)
├── leadId: String (FK)
├── type: SignalType (enum)
├── source: String
├── content: String
├── confidence: Int (0-100)
└── detectedAt: DateTime

Opportunity
├── id: String (cuid)
├── leadId: String (FK)
├── serviceType: ServiceType (enum)
├── confidence: Int (0-100)
└── status: OpportunityStatus (enum)

Contact
├── id: String (cuid)
├── companyId: String (FK)
├── name: String
├── title: String
├── email: String
└── linkedinUrl: String

OutreachMessage
├── id: String (cuid)
├── leadId: String (FK)
├── contactId: String (FK)
├── type: OutreachType (enum)
├── content: String
└── status: OutreachStatus (enum)
```

## Scalability Considerations

### Horizontal Scaling
- **Frontend**: Deploy on Vercel edge network
- **Backend**: Containerized NestJS instances behind load balancer
- **Agents**: Run multiple worker instances per agent type
- **Database**: PostgreSQL read replicas for queries

### Performance Optimization
- **Caching**: Redis for frequently accessed data
- **Job Queuing**: BullMQ for async processing
- **Database Indexing**: Indexes on frequently queried fields
- **Elasticsearch**: Full-text search for companies and leads

### Monitoring
- Application logs via Winston
- Job queue monitoring with BullMQ dashboard
- Database query performance monitoring
- OpenAI API usage tracking

## Security

### Authentication & Authorization
- Clerk for user authentication
- JWT tokens for API access
- Role-based access control (RBAC)

### Data Protection
- Environment variables for secrets
- Encrypted database connections
- API rate limiting
- Input validation and sanitization

### Compliance
- GDPR compliance for EU data
- CAN-SPAM compliance for email outreach
- LinkedIn Terms of Service compliance

## Deployment Architecture

### Production Setup

```
┌─────────────────┐
│   Vercel CDN    │ ← Frontend (Next.js)
└────────┬────────┘
         │ HTTPS
┌────────┼────────────────────────────────┐
│        │    AWS VPC                     │
│  ┌─────┴─────┐                          │
│  │   ALB     │ ← Load Balancer          │
│  └─────┬─────┘                          │
│        │                                │
│  ┌─────┴─────┐                          │
│  │  ECS      │ ← NestJS API Containers  │
│  │  Cluster  │                          │
│  └─────┬─────┘                          │
│        │                                │
│  ┌─────┴─────┐     ┌──────────┐        │
│  │    RDS    │     │ElastiCache        │
│  │ PostgreSQL│     │  (Redis)  │        │
│  └───────────┘     └──────────┘        │
│                                         │
│  ┌─────────────────────────────┐       │
│  │    ECS Tasks (Agents)       │       │
│  │  • Discovery  • Signal      │       │
│  │  • Qualification • Enrichment│      │
│  └─────────────────────────────┘       │
└─────────────────────────────────────────┘
```

## Future Enhancements

1. **Real-time Notifications**
   - WebSocket connections for live updates
   - Push notifications for high-value leads

2. **Machine Learning**
   - Custom ML models for lead scoring
   - Predictive analytics for conversion probability

3. **Advanced Integrations**
   - CRM integration (Salesforce, HubSpot)
   - Email automation (SendGrid, Mailgun)
   - LinkedIn automation (Phantombuster)

4. **Analytics**
   - Custom dashboards
   - Export to BI tools
   - ROI tracking

5. **Collaboration**
   - Team workspaces
   - Lead assignment
   - Activity feeds
   - Comments and notes
