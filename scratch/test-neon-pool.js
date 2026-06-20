require('dotenv').config();
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
neonConfig.webSocketConstructor = ws;

console.log("Connecting with Neon Pool...");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query("SELECT NOW()").then((res) => {
  console.log("✅ Success: Queried using Neon Pool!");
  console.log("Query Result:", res.rows);
  return pool.end();
}).catch((err) => {
  console.error("❌ Pool error:", err);
});
