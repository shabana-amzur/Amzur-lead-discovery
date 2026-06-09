#!/usr/bin/env node

/**
 * Apollo.io Lead Fetcher
 * Fetch real leads from Apollo.io API
 * 
 * Usage:
 *   APOLLO_API_KEY=your_key node scripts/fetch-apollo-leads.js
 */

const { ApolloAPI } = require('../packages/lead-discovery/src/apollo-api.js');
const fs = require('fs');
const path = require('path');

// Search queries focusing on INTENT SIGNALS (funding, growth, tech changes)
const SEARCHES = [
  {
    service: 'MVP as a Service',
    keywords: ['series a', 'seed funding', 'startup'],
    locations: ['United States', 'United Kingdom'],
    employeeRanges: ['1,10', '11,50'],  // Early stage = need MVP
  },
  {
    service: 'ERP (NetSuite)',
    keywords: ['expanding', 'multiple locations', 'enterprise'],
    locations: ['United States', 'United Arab Emirates'],
    employeeRanges: ['51,200', '201,500'],  // Mid-size scaling up
  },
  {
    service: 'AI/ML Services',
    keywords: ['machine learning', 'artificial intelligence', 'data science'],
    locations: ['United States', 'United Kingdom'],
    employeeRanges: ['51,200', '201,500'],
  },
  {
    service: 'Custom App Development',
    keywords: ['technology', 'software', 'saas'],
    locations: ['United States', 'Australia'],
    employeeRanges: ['51,200', '201,500'],
  },
  {
    service: 'Shopify',
    keywords: ['ecommerce', 'retail', 'consumer'],
    locations: ['United Kingdom', 'Australia'],
    employeeRanges: ['11,50', '51,200'],  // D2C brands scaling
  },
];

async function main() {
  console.log('🚀 Apollo.io Lead Fetcher Starting...\n');

  // Check for API key
  if (!process.env.APOLLO_API_KEY) {
    console.log('❌ Apollo API key not found!');
    console.log('Get your key from: https://apollo.io/settings/api');
    console.log('\nThen run:');
    console.log('  export APOLLO_API_KEY="your_api_key_here"');
    console.log('  pnpm fetch:apollo\n');
    process.exit(1);
  }

  const apollo = new ApolloAPI(process.env.APOLLO_API_KEY);
  const allLeads = [];

  console.log(`🔍 Searching ${SEARCHES.length} categories...\n`);

  for (const search of SEARCHES) {
    console.log(`  Searching: ${search.service} (${search.employeeRanges.join('-')} employees)...`);
    
    try {
      const companies = await apollo.searchCompanies({
        keywords: search.keywords,
        locations: search.locations,
        employeeRanges: search.employeeRanges,
        limit: 5,
      });

      console.log(`  ✓ Found ${companies.length} companies`);

      // Get contacts for each company
      for (const company of companies) {
        const contacts = await apollo.searchPeople(company.name);
        const lead = apollo.convertToLead(company, search.service, contacts);
        allLeads.push(lead);
        
        // Rate limiting
        await apollo.delay(300);
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
  }

  console.log(`\n✅ Fetched ${allLeads.length} leads from Apollo.io\n`);

  // Save to file
  const outputPath = path.join(__dirname, '../apps/api/src/apollo-leads.json');
  fs.writeFileSync(outputPath, JSON.stringify(allLeads, null, 2));
  console.log(`💾 Saved to: ${outputPath}`);

  // Show summary
  console.log('\n📊 Summary by Geography:');
  const geoStats = {};
  allLeads.forEach(lead => {
    geoStats[lead.geography] = (geoStats[lead.geography] || 0) + 1;
  });
  Object.entries(geoStats).forEach(([geo, count]) => {
    console.log(`   ${geo}: ${count} leads`);
  });

  console.log('\n📊 Summary by Service:');
  const serviceStats = {};
  allLeads.forEach(lead => {
    serviceStats[lead.serviceMatch] = (serviceStats[lead.serviceMatch] || 0) + 1;
  });
  Object.entries(serviceStats).forEach(([service, count]) => {
    console.log(`   ${service}: ${count} leads`);
  });

  console.log('\n✅ Done! Restart your API server to load Apollo leads.');
  console.log('   pkill -f "node simple-server" && cd apps/api && node simple-server.js &');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
