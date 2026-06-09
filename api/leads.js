// Vercel serverless function for API
const fs = require('fs');
const path = require('path');

// Load leads with fallback
let leads = [];
try {
  // Try multiple paths for Vercel compatibility
  const possiblePaths = [
    path.join(__dirname, 'apollo-leads.json'),
    path.join(process.cwd(), 'api/apollo-leads.json'),
    './apollo-leads.json'
  ];
  
  for (const leadsPath of possiblePaths) {
    if (fs.existsSync(leadsPath)) {
      leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
      console.log(`Loaded ${leads.length} leads from ${leadsPath}`);
      break;
    }
  }
  
  if (leads.length === 0) {
    console.error('No leads file found in any location');
  }
} catch (error) {
  console.error('Error loading leads:', error);
}

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if leads loaded
  if (leads.length === 0) {
    console.error('No leads available');
    return res.status(500).json({
      success: false,
      error: 'No leads data available',
      message: 'Leads file not found on server'
    });
  }

  // Parse query parameters
  const { geography, service, enquiryType, status } = req.query;
  
  // Filter leads
  let filteredLeads = [...leads];
  
  if (status) {
    filteredLeads = filteredLeads.filter(lead => lead.status === status);
  }
  if (geography) {
    filteredLeads = filteredLeads.filter(lead => lead.geography === geography);
  }
  if (service) {
    filteredLeads = filteredLeads.filter(lead => lead.serviceMatch === service);
  }
  if (enquiryType) {
    filteredLeads = filteredLeads.filter(lead => lead.enquiryType === enquiryType);
  }
  
  console.log(`Returning ${filteredLeads.length} leads (total: ${leads.length})`);
  
  // Return response
  res.status(200).json({
    success: true,
    data: filteredLeads,
    total: filteredLeads.length
  });
};
  });
};
