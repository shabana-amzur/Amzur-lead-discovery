// Vercel Cron Job - Automatically fetch fresh leads from Apollo.io
const { ApolloAPI } = require('../../packages/lead-discovery/src/apollo-api.js');

// Search queries for different services
const SEARCHES = [
  {
    service: 'MVP as a Service',
    keywords: ['series a', 'seed funding', 'startup'],
    locations: ['United States', 'United Kingdom'],
    employeeRanges: ['1,10', '11,50'],
  },
  {
    service: 'AI/ML Services',
    keywords: ['machine learning', 'artificial intelligence', 'data science'],
    locations: ['United States', 'United Kingdom'],
    employeeRanges: ['51,200', '201,500'],
  },
  {
    service: 'Shopify',
    keywords: ['ecommerce', 'retail', 'consumer'],
    locations: ['United Kingdom', 'Australia'],
    employeeRanges: ['11,50', '51,200'],
  },
];

module.exports = async (req, res) => {
  // Verify this is called by Vercel Cron (security)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Apollo API key not configured' });
  }

  try {
    const apollo = new ApolloAPI(apiKey);
    const allLeads = [];

    console.log(`Fetching leads from ${SEARCHES.length} categories...`);

    for (const search of SEARCHES) {
      try {
        const companies = await apollo.searchCompanies({
          keywords: search.keywords,
          locations: search.locations,
          employeeRanges: search.employeeRanges,
          limit: 5,
        });

        for (const company of companies) {
          const contacts = await apollo.searchPeople(company.name);
          const lead = apollo.convertToLead(company, search.service, contacts);
          allLeads.push(lead);
          await apollo.delay(300); // Rate limiting
        }
      } catch (error) {
        console.error(`Error fetching ${search.service}:`, error);
      }
    }

    console.log(`Fetched ${allLeads.length} fresh leads`);

    // TODO: Save to database or update JSON file
    // For now, just return the data
    return res.status(200).json({
      success: true,
      message: `Fetched ${allLeads.length} new leads`,
      leads: allLeads,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch leads',
      message: error.message 
    });
  }
};
