#!/usr/bin/env node

/**
 * Re-enrich existing Apollo leads with improved requirement generation
 */

const { ApolloAPI } = require('../packages/lead-discovery/src/apollo-api.js');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔄 Re-enriching existing Apollo leads...\n');

  const leadsPath = path.join(__dirname, '../apps/api/src/apollo-leads.json');
  
  if (!fs.existsSync(leadsPath)) {
    console.log('❌ No Apollo leads found. Run: pnpm fetch:apollo first');
    process.exit(1);
  }

  const existingLeads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
  console.log(`📊 Found ${existingLeads.length} existing leads\n`);

  const apollo = new ApolloAPI('dummy-key');
  const enrichedLeads = [];

  for (const lead of existingLeads) {
    // Reconstruct company object from lead data
    const company = {
      id: lead.id.replace('apollo-', ''),
      name: lead.companyName,
      website_url: lead.website,
      linkedin_url: lead.companyLinkedin,
      primary_domain: lead.website.replace('http://', '').replace('https://', '').replace('www.', '').split('/')[0],
      industry: lead.industry,
      estimated_num_employees: lead.employeeCount,
      country: lead.location.split(',').pop().trim(),
      city: lead.location.split(',')[0].trim(),
      short_description: lead.companyServices,
      technology_names: lead.signals.find(s => s.type === 'Technology Indicators')
        ?.content.replace('Uses: ', '').split(', ') || [],
      employee_growth_rate: lead.signals[0]?.content.includes('growth') 
        ? parseInt(lead.signals[0].content.match(/(\d+)%/)?.[1] || 0)
        : 0
    };

    // Generate new diverse requirement
    const newRequirement = apollo.generateRequirement(company, lead.serviceMatch);
    const enquiryType = apollo.detectEnquiryType(company, lead.serviceMatch);
    const geography = apollo.detectGeography(company);
    
    // Update lead with new requirement, enquiry type, and corrected geography
    const enrichedLead = {
      ...lead,
      requirement: newRequirement,
      enquiryType: enquiryType,
      geography: geography,
    };

    enrichedLeads.push(enrichedLead);
    console.log(`✓ Re-enriched: ${lead.companyName}`);
  }

  // Save updated leads
  fs.writeFileSync(leadsPath, JSON.stringify(enrichedLeads, null, 2));
  console.log(`\n💾 Saved ${enrichedLeads.length} enriched leads to: ${leadsPath}`);
  console.log('\n✅ Done! Restart your API server to see the changes:');
  console.log('   pkill -f "simple-server" && cd apps/api && node simple-server.js &');
}

main().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
