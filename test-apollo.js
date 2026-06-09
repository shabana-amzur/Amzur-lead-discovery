const https = require('https');

const apiKey = 'pq0RuZQMCurbme9Bd_nVkA';

// Test basic API call
const body = JSON.stringify({
  api_key: apiKey,
  page: 1,
  per_page: 5
});

const options = {
  hostname: 'api.apollo.io',
  path: '/v1/mixed_companies/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(data));
  });
});

req.on('error', (e) => console.error('Error:', e));
req.write(body);
req.end();
