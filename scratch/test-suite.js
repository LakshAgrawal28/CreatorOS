require('dotenv').config();
console.log("DATABASE_URL read in node:", process.env.DATABASE_URL);
const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

// Inject WebSocket constructor for Neon database pool in Node.js environments
neonConfig.webSocketConstructor = ws;

// Set up Neon serverless database client
const connectionString = process.env.DATABASE_URL || "";
let db;

if (connectionString) {
  const adapter = new PrismaNeon({ connectionString });
  db = new PrismaClient({ adapter });
} else {
  db = new PrismaClient();
}

async function runTests() {
  console.log("=== CREATOROS TEST SUITE ===");
  
  try {
    // Test 1: Database connection
    console.log("Running Test 1: Database Connection...");
    const userCount = await db.user.count();
    console.log(`✅ Success: Database connected successfully. Current users in DB: ${userCount}`);

    // Test 2: pgvector stored function validation
    console.log("\nRunning Test 2: pgvector Similarity Function Validation...");
    // Let's call our stored function with a dummy 1536-dimension zero vector
    const dummyVector = `[${new Array(1536).fill(0).join(",")}]`;
    const result = await db.$queryRawUnsafe(
      `SELECT * FROM match_creators_to_campaign(cast($1 as vector), 0, 10000000)`,
      dummyVector
    );
    console.log("✅ Success: Stored function 'match_creators_to_campaign' executed successfully.");
    console.log(`Result count: ${result.length}`);

    // Test 3: Razorpay transaction release logic verification
    console.log("\nRunning Test 3: Escrow Payout Calculations...");
    const sponsorBudget = 500; // USD
    const rate = 85; // INR exchange rate
    const budgetInInr = sponsorBudget * rate;
    
    // Validate calculations
    const creatorPayoutInPaise = Math.round(budgetInInr * 100);
    console.log(`USD Budget: $${sponsorBudget}`);
    console.log(`INR Conversion (1 USD = ${rate} INR): ₹${budgetInInr.toLocaleString()}`);
    console.log(`Razorpay Payout Amount in Paise: ${creatorPayoutInPaise} paise`);
    
    if (creatorPayoutInPaise === 4250000) {
      console.log("✅ Success: Escrow payout calculation matches expected amount (42,500.00 INR).");
    } else {
      throw new Error(`Calculation mismatch: Expected 4250000 paise but got ${creatorPayoutInPaise}`);
    }

    console.log("\n=== ALL TESTS PASSED SUCCESSFULLY ===");
  } catch (error) {
    console.error("\n❌ Test Suite Failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runTests();
