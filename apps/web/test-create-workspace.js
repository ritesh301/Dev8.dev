// Test workspace creation locally
const response = await fetch('https://dev8-dev-web.vercel.app/api/workspaces', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
  },
  body: JSON.stringify({
    name: 'Test Workspace',
    cloudProvider: 'AZURE',
    cloudRegion: 'centralindia',
    cpuCores: 2,
    memoryGB: 4,
    storageGB: 20
  })
});

const data = await response.json();
console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));
