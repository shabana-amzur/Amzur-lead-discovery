# Apollo.io API Integration Guide

## What is Apollo.io?

Apollo.io is a B2B sales intelligence platform with:
- **275M+ contacts** with verified emails
- **60M+ companies** with detailed firmographic data
- **LinkedIn profile data** (job changes, activity)
- **Buying signals** (hiring, funding, tech stack changes)
- **REST API** for programmatic access

## Why Apollo.io?

### ✅ Benefits:
- **Legal**: Complies with terms of service
- **Fast**: Get results in seconds (vs minutes with scraping)
- **Reliable**: 95%+ email accuracy guarantee
- **No Risk**: Won't get banned like LinkedIn scraping
- **Rich Data**: Company size, revenue, tech stack, contacts
- **Intent Signals**: Hiring activity, funding rounds, job postings

### ❌ Web Scraping Problems (LinkedIn):
- Takes 5-10 minutes per run
- Violates LinkedIn TOS → account ban risk
- Captcha challenges
- Rate limiting
- Unstable (HTML changes)

## How to Get Apollo.io API

### Step 1: Sign Up for Apollo.io

1. Go to: **https://apollo.io**
2. Click **"Start Free Trial"**
3. Create account with business email

### Step 2: Choose a Plan

| Plan | Price | API Credits/Month | Best For |
|------|-------|-------------------|----------|
| **Free** | $0 | 50 credits | Testing only |
| **Basic** | $49/mo | 12,000 credits | Small teams |
| **Professional** | $99/mo | 24,000 credits | Growing teams |
| **Organization** | $149/mo | Unlimited | Enterprises |

**Recommended**: Start with **Basic ($49/mo)** - 12,000 credits = ~400 leads/day

### Step 3: Get Your API Key

1. Login to Apollo.io
2. Click your profile → **Settings**
3. Navigate to **API** tab
4. Click **"Create New Key"**
5. Copy your key (looks like: `api_xxxxxxxxxxxxxxxxxx`)

### Step 4: Set Environment Variable

```bash
# In your terminal
export APOLLO_API_KEY="api_your_actual_key_here"

# Or add to .env file
echo 'APOLLO_API_KEY="api_your_actual_key_here"' >> .env
```

## How to Use Apollo Integration

### Fetch Leads from Apollo.io

```bash
# Fetch 25 real leads (5 per service category)
pnpm fetch:apollo
```

This will:
1. Search Apollo for companies in your target categories:
   - MVP as a Service (startups, early stage)
   - ERP (NetSuite, business software)
   - AI/ML Services
   - Custom App Development
   - Shopify (ecommerce)

2. For each company:
   - Get firmographic data (size, location, industry)
   - Find decision makers (CTO, VP Engineering, etc.)
   - Detect buying signals (hiring, tech stack)
   - Calculate lead score (0-100)

3. Save to `apps/api/src/apollo-leads.json`

4. Restart API server to load new leads

### Restart API to Load Apollo Leads

```bash
# Kill current server
pkill -f "node simple-server"

# Start with Apollo leads
cd apps/api && node simple-server.js &
```

You should see:
```
✓ Added 25 leads from Apollo.io
✓ Loaded 40 total leads
   - LinkedIn: 5
   - Apollo: 25
   - Manual: 10
```

## What Data You Get

Each Apollo lead includes:

### Company Information
- Company name, website, LinkedIn
- Industry, employee count, revenue
- Location (US, UK, UAE, Australia)
- Technology stack
- Short description

### Contact Information
- Decision maker names (CTO, VP Engineering, etc.)
- Verified email addresses
- Phone numbers
- LinkedIn profiles

### Intent Signals
- Hiring activity (job postings)
- Technology changes
- Funding rounds
- Company growth rate

### Amzur-Specific Fields
- **Service Match**: Which service they need
- **Lead Score**: 0-100 based on fit
- **Evidence Link**: Company LinkedIn/website
- **Deadline**: Suggested outreach date
- **Approach Strategy**: How to reach out

## API Pricing & Credits

### How Credits Work:
- **1 credit** = 1 company search result
- **1 credit** = 1 contact/email reveal
- **0 credits** = Company enrichment (free)

### Example Cost:
```
Fetch 25 leads:
- 25 companies × 1 credit = 25 credits
- 25 contacts × 1 credit = 25 credits
Total: 50 credits per run
```

With **Basic plan** (12,000 credits/month):
- **240 runs/month** (12,000 ÷ 50)
- **8 runs/day**
- **6,000 leads/month**

## Apollo API Endpoints Used

### 1. Company Search
```javascript
POST https://api.apollo.io/v1/mixed_companies/search
```
Search companies by keywords, location, size, tech stack

### 2. People Search
```javascript
POST https://api.apollo.io/v1/mixed_people/search
```
Find contacts at a specific company by job title

### 3. Company Enrichment
```javascript
GET https://api.apollo.io/v1/organizations/enrich
```
Get full company details by domain (free - no credits)

## Customizing Your Search

Edit `scripts/fetch-apollo-leads.js` to change:

### Search Keywords
```javascript
const SEARCHES = [
  {
    service: 'AI/ML Services',
    keywords: ['artificial intelligence', 'machine learning', 'deep learning'],
  },
  // Add more...
];
```

### Locations
```javascript
organization_locations: [
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Australia',
  'Canada', // Add new location
],
```

### Company Size
```javascript
organization_num_employees_ranges: [
  '11,50',      // Small (11-50 employees)
  '51,200',     // Medium (51-200)
  '201,500',    // Large (201-500)
  '501,1000',   // Enterprise (501-1000)
  '1001,10000', // Large Enterprise (1000+)
],
```

### Job Titles (for contacts)
```javascript
person_titles: [
  'CTO',
  'VP Engineering',
  'Head of Technology',
  'Director of IT', // Add more
],
```

## Rate Limiting

Apollo has rate limits:
- **10 requests/second** (free tier)
- **50 requests/second** (paid tiers)

Our integration includes delays:
```javascript
await apollo.delay(300); // 300ms between requests
```

## Troubleshooting

### "Apollo API key not found"
```bash
# Check if key is set
echo $APOLLO_API_KEY

# Set it properly
export APOLLO_API_KEY="api_your_key_here"
```

### "401 Unauthorized"
- Your API key is invalid or expired
- Get new key from Apollo.io settings

### "429 Too Many Requests"
- You hit rate limit
- Wait 60 seconds and try again
- Increase delay in code: `await apollo.delay(500)`

### "No leads found"
- Check your search keywords
- Try broader terms
- Verify locations are correct

## Next Steps

1. **Get API Key**: Sign up at apollo.io
2. **Set Environment**: `export APOLLO_API_KEY="..."`
3. **Fetch Leads**: `pnpm fetch:apollo`
4. **Restart API**: `pkill -f simple-server && cd apps/api && node simple-server.js &`
5. **View Dashboard**: http://localhost:3000/leads

## Resources

- **Apollo.io**: https://apollo.io
- **API Documentation**: https://apolloio.github.io/apollo-api-docs/
- **Pricing**: https://apollo.io/pricing
- **Support**: support@apollo.io
