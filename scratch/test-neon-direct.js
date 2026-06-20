require('dotenv').config();
const { Client, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
neonConfig.webSocketConstructor = ws;

console.log("Connecting directly with Neon Client...");
const client = new Client(process.env.DATABASE_URL);

client.connect().then(() => {
  console.log("✅ Success: Connected directly using Neon Client!");
  return client.query("SELECT NOW()");
}).then((res) => {
  console.log("Query Result:", res.rows);
  return client.end();
}).catch((err) => {
  console.error("❌ Connection error:", err);
});
