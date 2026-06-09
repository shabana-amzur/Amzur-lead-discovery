// Vercel serverless function for API
const fs = require('fs');
const path = require('path');

// Load leads from JSON file
let leads = [];
try {
  const leadsPath = path.join(__dirname, 'apollo-leads.json');
  if (fs.existsSync(leadsPath)) {
    leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
    console.log(`Loaded ${leads.length} leads from apollo-leads.json`);
  } else {
    console.error('apollo-leads.json not found at:', leadsPath);
  }
} catch (e) {
  console.error('Error loading leads:', e);
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

  const { pathname, query } = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/leads
  if (pathname === '/api/leads' && req.method === 'GET') {
    let filteredLeads = [...leads];
    
    if (query.get('status')) {
      filteredLeads = filteredLeads.filter(lead => lead.status === query.get('status'));
    }
    if (query.get('geography')) {
      filteredLeads = filteredLeads.filter(lead => lead.geography === query.get('geography'));
    }
    if (query.get('service')) {
      filteredLeads = filteredLeads.filter(lead => lead.serviceMatch === query.get('service'));
    }
    if (query.get('enquiryType')) {
      filteredLeads = filteredLeads.filter(lead => lead.enquiryType === query.get('enquiryType'));
    }
    
    res.status(200).json({
      success: true,
      data: filteredLeads,
      total: filteredLeads.length
    });
    return;
  }

  // GET /api/leads/:id
  if (pathname.startsWith('/api/leads/') && req.method === 'GET') {
    const id = pathname.replace('/api/leads/', '');
    const lead = leads.find(l => l.id === id);
    
    if (lead) {
      res.status(200).json({
        success: true,
        data: lead
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }
    return;
  }

  // Default response
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'API endpoint not found'
  });
};
