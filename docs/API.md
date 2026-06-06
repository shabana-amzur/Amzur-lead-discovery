# API Documentation

Base URL: `http://localhost:3001/api`

Interactive Documentation: `http://localhost:3001/api/docs` (Swagger UI)

## Authentication

Currently using Clerk for authentication. Include JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Leads

#### GET /leads
Get all leads with optional filters

**Query Parameters:**
- `status` (optional): Filter by status (NEW, QUALIFIED, CONTACTED, etc.)
- `industry` (optional): Filter by industry
- `minScore` (optional): Minimum lead score

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "companyName": "TechCorp Inc",
      "website": "https://techcorp.com",
      "industry": "Technology",
      "employeeCount": 500,
      "status": "QUALIFIED",
      "score": 92,
      "createdAt": "2024-06-01T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### GET /leads/:id
Get lead details with all related data

**Response:**
```json
{
  "id": "clx...",
  "company": { ... },
  "status": "QUALIFIED",
  "score": 92,
  "companyFit": 35,
  "serviceFit": 28,
  "intentScore": 24,
  "signals": [
    {
      "type": "HIRING",
      "content": "AWS Cloud Architect position",
      "confidence": 90,
      "detectedAt": "2024-06-01T10:00:00Z"
    }
  ],
  "opportunities": [
    {
      "serviceType": "CLOUD_SERVICES",
      "confidence": 92
    }
  ],
  "contacts": [ ... ]
}
```

#### POST /leads
Create a new lead

**Request Body:**
```json
{
  "companyName": "Example Corp",
  "website": "https://example.com",
  "industry": "Healthcare",
  "employeeCount": 250
}
```

#### PATCH /leads/:id
Update lead information

**Request Body:**
```json
{
  "status": "CONTACTED",
  "notes": "Initial outreach sent"
}
```

#### DELETE /leads/:id
Delete a lead

**Response:** `204 No Content`

#### POST /leads/discover
Trigger lead discovery job

**Response:**
```json
{
  "message": "Lead discovery job queued",
  "jobId": "job-1234567890"
}
```

#### POST /leads/:id/qualify
Run qualification on a lead

**Response:**
```json
{
  "id": "clx...",
  "score": 85,
  "status": "QUALIFIED",
  "companyFit": 32,
  "serviceFit": 28,
  "intentScore": 21
}
```

#### POST /leads/:id/enrich
Trigger enrichment for a lead

**Response:**
```json
{
  "message": "Lead enrichment started",
  "leadId": "clx..."
}
```

### Opportunities

#### GET /opportunities
Get all opportunities

**Query Parameters:**
- `service` (optional): Filter by service type

**Response:**
```json
[
  {
    "id": "clx...",
    "leadId": "clx...",
    "companyName": "TechCorp Inc",
    "serviceType": "Cloud Migration",
    "confidence": 92,
    "signals": [
      "Hiring AWS Architect",
      "Legacy infrastructure mentioned"
    ]
  }
]
```

#### GET /opportunities/by-service
Get opportunities grouped by service

**Response:**
```json
{
  "Cloud Migration": 12,
  "AI Implementation": 8,
  "NetSuite ERP": 6,
  "Cybersecurity": 5,
  "Digital Engineering": 10,
  "Managed Services": 4
}
```

### Contacts

#### GET /contacts/lead/:leadId
Get all contacts for a lead

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "John Smith",
    "title": "CTO",
    "email": "john.smith@techcorp.com",
    "linkedinUrl": "https://linkedin.com/in/johnsmith",
    "seniority": "C-Level"
  }
]
```

### Dashboard

#### GET /dashboard/stats
Get dashboard statistics

**Response:**
```json
{
  "totalLeads": 1234,
  "highIntentLeads": 89,
  "activeOpportunities": 45,
  "successRate": 34,
  "leadsByStatus": {
    "new": 234,
    "qualified": 89,
    "contacted": 56,
    "meeting": 23,
    "proposal": 12
  },
  "opportunitiesByService": {
    "Cloud Migration": 12,
    "AI Implementation": 8,
    "NetSuite ERP": 6
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

## Webhooks

(To be implemented)

Webhook events:
- `lead.created`
- `lead.qualified`
- `lead.contacted`
- `opportunity.created`
- `outreach.sent`

## Error Responses

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```
