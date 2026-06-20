require('dotenv').config();
const { Client } = require('@neondatabase/serverless');
const ws = require('ws');

let connectionString = process.env.DATABASE_URL || "";
if (connectionString.startsWith('prisma+postgres://')) {
  try {
    const urlObj = new URL(connectionString);
    const apiKey = urlObj.searchParams.get('api_key');
    if (apiKey) {
      const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString('utf8'));
      connectionString = decoded.databaseUrl;
    }
  } catch (e) {
    console.error("Failed to parse prisma+postgres URL, using as-is", e);
  }
}

console.log('Connecting to:', connectionString.split('@')[1] || connectionString);
const client = new Client({
  connectionString,
  webSocketConstructor: ws
});

async function run() {
  try {
    await client.connect();
    console.log('Connected! Creating vector extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('Extension "vector" created or already exists!');
  } catch (err) {
    console.error('Error creating vector extension:', err);
  } finally {
    await client.end();
  }
}

run();
