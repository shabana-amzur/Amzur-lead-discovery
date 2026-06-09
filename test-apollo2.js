const https = require('https');

const apiKey = 'pq0RuZQMCurbme9Bd_nVkA';

// Simple search
const body = JSON.stringify({
  page: 1,
  per_page: 5,
  organization_locations: ['United States']
});

const options = {
  hostname: 'api.apollo.io',
  path: '/v1/mixed_companies/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey,
    'Content-Length': Buffer.byteLength(body)
  }
};

console.log('Testing Apollo API...\n');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const parsed = JSON.parse(data);
    console.log('\nResponse keys:', Object.keys(parsed));
    if (parsed.organizations) {
      console.log('Found companies:', parsed.organizations.length);
      if (parsed.organizations[0]) {
        console.log('\nFirst company:', parsed.organizations[0].name);
      }
    }
    if (parsed.error) {
      console.log('Error:', parsed.error);
    }
    console.log('\nFull response:', JSON.stringify(parsed, null, 2).slice(0, 500));
  });
});

req.on('error', (e) => console.error('Request error:', e));
req.write(body);
req.end();
