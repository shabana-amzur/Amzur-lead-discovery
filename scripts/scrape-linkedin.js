#!/usr/bin/env node

/**
 * LinkedIn Scraper CLI
 * Run this script to scrape LinkedIn posts and save as leads
 * 
 * Usage:
 *   node scrape-linkedin.js
 *   LINKEDIN_EMAIL=your@email.com LINKEDIN_PASSWORD=yourpass node scrape-linkedin.js
 */

const { LinkedInScraper } = require('../packages/lead-discovery/src/linkedin-scraper.js');
const fs = require('fs');
const path = require('path');

// Keywords to search for
const KEYWORDS = [
  'looking for development team',
  'seeking app developers',
  'need software development partner',
  'hiring developers urgently',
  'MVP development needed',
  'looking for NetSuite implementation',
  'need AI ML developers',
  'Shopify expert needed',
];

async function main() {
  console.log('🚀 LinkedIn Lead Scraper Starting...\n');
  console.log('⚠️  NOTE: LinkedIn scraping may violate ToS. Use at your own risk.\n');

  // Check for credentials
  if (!process.env.LINKEDIN_EMAIL || !process.env.LINKEDIN_PASSWORD) {
    console.log('❌ LinkedIn credentials not found!');
    console.log('Set environment variables:');
    console.log('  export LINKEDIN_EMAIL="your@email.com"');
    console.log('  export LINKEDIN_PASSWORD="yourpassword"\n');
    console.log('Running in demo mode with mock data...\n');
    return;
  }

  const scraper = new LinkedInScraper({
    email: process.env.LINKEDIN_EMAIL,
    password: process.env.LINKEDIN_PASSWORD,
  });

  try {
    console.log(`🔍 Searching ${KEYWORDS.length} keywords...`);
    const leads = await scraper.scrape(KEYWORDS, 5); // 5 posts per keyword

    console.log(`\n✅ Scraped ${leads.length} leads from LinkedIn\n`);

    // Save to file
    const outputPath = path.join(__dirname, '../apps/api/src/scraped-leads.json');
    fs.writeFileSync(outputPath, JSON.stringify(leads, null, 2));
    console.log(`💾 Saved to: ${outputPath}`);

    // Show summary
    console.log('\n📊 Summary:');
    const services = {};
    leads.forEach(lead => {
      services[lead.serviceMatch] = (services[lead.serviceMatch] || 0) + 1;
    });
    Object.entries(services).forEach(([service, count]) => {
      console.log(`   ${service}: ${count}`);
    });

    console.log('\n✅ Scraping complete! Restart your API server to load new leads.');
  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

main();
