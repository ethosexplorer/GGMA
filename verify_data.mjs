import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  // All tables
  const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("=== ALL TABLES ===");
  console.log(tables.rows.map(r => r.name).join(", "));
  
  // Count each table
  for (const row of tables.rows) {
    try {
      const c = await turso.execute(`SELECT COUNT(*) as c FROM ${row.name}`);
      console.log(`  ${row.name}: ${c.rows[0].c} rows`);
    } catch(e) {}
  }
  
  // Specific data checks
  console.log("\n=== KEY METRICS ===");
  
  const patients = await turso.execute("SELECT * FROM patients LIMIT 5");
  console.log("\nPatients:", JSON.stringify(patients.rows, null, 2));

  const ledger = await turso.execute("SELECT * FROM founder_ledger LIMIT 5");
  console.log("\nLedger:", JSON.stringify(ledger.rows, null, 2));

  try {
    const agg = await turso.execute("SELECT * FROM analytics_aggregates LIMIT 1");
    console.log("\nAnalytics Aggregates:", JSON.stringify(agg.rows, null, 2));
  } catch(e) { console.log("\nNo analytics_aggregates table"); }

  const entities = await turso.execute("SELECT id, name, type, state, status FROM entities");
  console.log("\nEntities:", JSON.stringify(entities.rows, null, 2));
}

run().catch(console.error);
