# Contributing to Amzur Lead Engine

Thank you for your interest in contributing to the Amzur Lead Engine! This guide will help you get started.

## Development Setup

Please see [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## Project Structure

```
amzur-lead-engine/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # NestJS backend
├── packages/
│   ├── ai/               # OpenAI integration
│   ├── lead-discovery/   # Discovery services
│   ├── lead-scoring/     # Scoring algorithms
│   └── database/         # Prisma schema
├── agents/
│   ├── discovery-agent/
│   ├── signal-agent/
│   ├── qualification-agent/
│   ├── enrichment-agent/
│   └── outreach-agent/
└── docs/                 # Documentation
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### 2. Make Your Changes

Follow these guidelines:

#### Code Style
- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic

#### Formatting
```bash
# Format code before committing
pnpm format
```

#### Linting
```bash
# Check for linting errors
pnpm lint
```

### 3. Test Your Changes

```bash
# Run tests (when implemented)
pnpm test

# Test locally
pnpm dev
```

Ensure:
- Frontend renders correctly
- API endpoints work as expected
- No TypeScript errors
- No console errors

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new lead scoring algorithm"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update API documentation"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `chore:` - Build/tooling changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Link to related issue (if any)
- Screenshots (for UI changes)
- Test instructions

## Coding Guidelines

### TypeScript

```typescript
// ✅ Good
interface Lead {
  id: string;
  companyName: string;
  score: number;
}

async function qualifyLead(leadId: string): Promise<Lead> {
  // Implementation
}

// ❌ Bad
function qualifyLead(leadId: any): any {
  // Implementation
}
```

### React Components

```typescript
// ✅ Good
interface LeadCardProps {
  lead: Lead;
  onSelect: (id: string) => void;
}

export function LeadCard({ lead, onSelect }: LeadCardProps) {
  return (
    <div onClick={() => onSelect(lead.id)}>
      {lead.companyName}
    </div>
  );
}

// ❌ Bad
export function LeadCard(props: any) {
  return <div>{props.lead.companyName}</div>;
}
```

### NestJS Services

```typescript
// ✅ Good
@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AIService
  ) {}

  async qualifyLead(leadId: string): Promise<LeadScore> {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });
    
    return this.ai.qualifyLead(lead);
  }
}
```

### Error Handling

```typescript
// ✅ Good
try {
  const lead = await this.leadsService.findOne(id);
  if (!lead) {
    throw new NotFoundException(`Lead ${id} not found`);
  }
  return lead;
} catch (error) {
  if (error instanceof NotFoundException) {
    throw error;
  }
  throw new InternalServerErrorException('Failed to fetch lead');
}

// ❌ Bad
const lead = await this.leadsService.findOne(id);
return lead;
```

## Database Changes

When modifying the database schema:

1. Edit `packages/database/prisma/schema.prisma`
2. Generate Prisma client:
   ```bash
   pnpm db:generate
   ```
3. Create a migration:
   ```bash
   pnpm db:migrate
   ```
4. Update types in affected files

## Adding New Features

### Adding a New AI Agent

1. Create agent directory: `agents/your-agent/`
2. Add `package.json` with dependencies
3. Create `src/index.ts` with Worker implementation
4. Define job types and processing logic
5. Update main README with agent description

### Adding a New API Endpoint

1. Create/update controller in `apps/api/src/*/`
2. Add service methods
3. Add DTOs for request/response
4. Add Swagger decorators
5. Update `docs/API.md`

### Adding a New Frontend Page

1. Create page in `apps/web/src/app/`
2. Create components in `apps/web/src/components/`
3. Add to navigation if needed
4. Style with Tailwind CSS

## Testing

### Unit Tests (Coming Soon)

```typescript
describe('LeadScoringService', () => {
  it('should calculate correct score', () => {
    const score = leadScoring.calculateScore(mockLead);
    expect(score.totalScore).toBe(85);
  });
});
```

### Integration Tests (Coming Soon)

```typescript
describe('LeadsController', () => {
  it('should create a new lead', async () => {
    const response = await request(app.getHttpServer())
      .post('/leads')
      .send(createLeadDto)
      .expect(201);
    
    expect(response.body.id).toBeDefined();
  });
});
```

## Documentation

When adding features:

1. Update README.md if needed
2. Update docs/ARCHITECTURE.md for architectural changes
3. Update docs/API.md for new endpoints
4. Add JSDoc comments to functions:

```typescript
/**
 * Qualifies a lead by calculating fit and intent scores
 * @param leadId - The unique identifier of the lead
 * @returns Lead qualification data including score breakdown
 * @throws NotFoundException if lead doesn't exist
 */
async qualifyLead(leadId: string): Promise<LeadQualification> {
  // Implementation
}
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add screenshots for UI changes
4. Request review from maintainers
5. Address review feedback
6. Squash commits if needed
7. Merge when approved

## Questions?

- Check existing documentation in `docs/`
- Look at existing code for examples
- Open an issue for clarification
- Ask in pull request comments

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

Thank you for contributing to Amzur Lead Engine! 🚀
