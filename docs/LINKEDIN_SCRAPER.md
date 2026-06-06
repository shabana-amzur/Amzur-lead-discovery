# LinkedIn Scraper Setup

## ⚠️ Important Warning

LinkedIn's Terms of Service **prohibit automated scraping**. This scraper is provided for:
- Educational purposes only
- Demo/testing environments
- Understanding how scrapers work

**For production use, please use:**
- LinkedIn Official API (requires partnership approval)
- Authorized services like Proxycurl, Apollo.io, PhantomBuster

## Setup Instructions

### 1. Install Puppeteer

```bash
cd /Users/ferozshaik/Desktop/Amzur\ Lead\ Engine
pnpm add puppeteer
```

### 2. Set LinkedIn Credentials

```bash
export LINKEDIN_EMAIL="your@email.com"
export LINKEDIN_PASSWORD="yourpassword"
```

### 3. Run the Scraper

```bash
node scripts/scrape-linkedin.js
```

### 4. Restart API Server

The scraper saves leads to `apps/api/src/scraped-leads.json`. Restart your API:

```bash
cd apps/api
node simple-server.js
```

## How It Works

1. **Logs into LinkedIn** using Puppeteer (headless Chrome)
2. **Searches** for posts with keywords like "need developers", "MVP development", etc.
3. **Extracts** post details:
   - Author name and title
   - Company name
   - Post content
   - Engagement (likes, comments)
   - Post URL
4. **Converts** to lead format with:
   - Service type detection
   - Lead scoring
   - Contact information
   - Evidence links
5. **Saves** to JSON file
6. **Loads** into your dashboard

## Limitations & Risks

❌ **LinkedIn may:**
- Detect and block the scraper
- Temporarily restrict your account
- Require CAPTCHA verification
- Ban your account for repeated violations

❌ **Technical limitations:**
- Requires valid LinkedIn account
- Slow (1-2 minutes per keyword)
- May miss posts due to dynamic loading
- Can't access posts from private profiles

## Alternative: Mock Mode

If you don't want to risk your LinkedIn account, keep using the mock data I created. It's realistic and updated with current dates.

## Recommended: Paid Services

For real production use:

1. **Proxycurl** - $49/month
   - Real-time LinkedIn data
   - No risk to your account
   - API with rate limits
   - https://proxycurl.com

2. **PhantomBuster** - $30/month
   - LinkedIn automation
   - Extract posts, profiles
   - Cloud-based (no local browser)
   - https://phantombuster.com

3. **Apollo.io** - $49/month
   - B2B contact database
   - Intent signals
   - Email verified contacts
   - https://apollo.io
