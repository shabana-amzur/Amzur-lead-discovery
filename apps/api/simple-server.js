// Simple standalone API server using only Node.js built-in modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Start with empty leads array
const leads = [];

// Load ONLY Apollo.io leads (no mock/sample data)
try {
  const apolloPath = path.join(__dirname, 'src/apollo-leads.json');
  if (fs.existsSync(apolloPath)) {
    const apolloLeads = JSON.parse(fs.readFileSync(apolloPath, 'utf8'));
    apolloLeads.forEach(lead => {
      if (!leads.find(l => l.id === lead.id)) {
        leads.push(lead);
      }
    });
    console.log(`✓ Loaded ${apolloLeads.length} real leads from Apollo.io`);
  }
} catch (e) {
  console.log('✗ No Apollo leads found (run: pnpm fetch:apollo)');
}

console.log(`✓ Total: ${leads.length} real Apollo.io leads only`);
console.log(`   - No mock or sample data included`);

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // GET /leads
  if (pathname === '/leads' && req.method === 'GET') {
    let filteredLeads = [...leads];
    
    if (query.status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === query.status);
    }
    
    if (query.industry) {
      filteredLeads = filteredLeads.filter(lead => lead.industry === query.industry);
    }
    
    if (query.geography) {
      filteredLeads = filteredLeads.filter(lead => lead.geography === query.geography);
    }
    
    if (query.service) {
      filteredLeads = filteredLeads.filter(lead => lead.serviceMatch === query.service);
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: filteredLeads,
      total: filteredLeads.length,
    }));
    return;
  }

  // GET /leads/:id
  const leadIdMatch = pathname.match(/^\/leads\/(.+)$/);
  if (leadIdMatch && req.method === 'GET') {
    const leadId = leadIdMatch[1];
    const lead = leads.find(l => l.id === leadId);
    
    if (lead) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(lead));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Lead not found' }));
    }
    return;
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Simple API server running on http://localhost:${PORT}`);
  console.log(`📊 Serving ${leads.length} leads`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/leads`);
});
