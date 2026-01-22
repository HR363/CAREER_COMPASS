
const https = require('https');
const fs = require('fs');
const path = require('path');

// Value is hardcoded for the script execution context or read from .env if possible
// We will try to read from ../.env
const envPath = path.join(__dirname, '.env');
let apiKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GEMINI_API_KEY=(.*)/);
  if (match && match[1]) {
    apiKey = match[1].trim();
  }
} catch (e) {
  console.log('Could not read .env file');
}

if (!apiKey) {
    console.error('No GEMINI_API_KEY found in .env');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log('Available Models:');
        json.models.forEach(m => {
          if (m.supportedGenerationMethods.includes('generateContent')) {
             console.log(`- ${m.name}`);
          }
        });
      } else {
        console.log('Error listing models:', json);
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response:', data);
    }
  });

}).on('error', (err) => {
  console.error('Error making request:', err);
});
