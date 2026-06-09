// Vercel serverless function for API
const leads = require('./apollo-leads.json');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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
  
  // Return response
  res.status(200).json({
    success: true,
    data: filteredLeads,
    total: filteredLeads.length
  });
};
  });
};
