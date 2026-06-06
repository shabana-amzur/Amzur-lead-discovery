// Simple standalone API server using only Node.js built-in modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Load LinkedIn leads
const { getLinkedInLeads } = require('./src/linkedin-leads.js');

const leads = getLinkedInLeads();

// Load additional leads from TypeScript service file if available
try {
  const serviceContent = fs.readFileSync(path.join(__dirname, 'src/leads/leads.service.ts'), 'utf8');
  // Extract the leads array content
  const match = serviceContent.match(/private leads = \[([\s\S]*?)\n  \];/);
  if (match) {
    // Parse additional leads data
    const leadsString = '[' + match[1] + ']';
    const additionalLeads = eval(leadsString);
    // Add unique leads (avoid duplicates)
    additionalLeads.forEach(lead => {
      if (!leads.find(l => l.id === lead.id)) {
        leads.push(lead);
      }
    });
    console.log(`✓ Total leads: ${leads.length} (${additionalLeads.length} from service file)`);
  }
} catch (e) {
  console.log('✓ Using LinkedIn leads only');
}

console.log(`✓ Loaded ${leads.length} leads (${leads.filter(l => l.source === 'LinkedIn').length} from LinkedIn)`);

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
