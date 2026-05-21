import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  console.log("=== POLL VOTES ===");
  try {
    const pv = await turso.execute("SELECT COUNT(*) as c FROM poll_votes");
    console.log("Total poll_votes:", pv.rows[0].c);
    const pvSample = await turso.execute("SELECT * FROM poll_votes LIMIT 5");
    console.log("Sample votes:", pvSample.rows);
  } catch(e) { console.error("poll_votes error:", e.message); }

  console.log("\n=== PATIENTS ===");
  try {
    const p = await turso.execute("SELECT state, COUNT(*) as c FROM patients GROUP BY state");
    console.log("Patients by state:", p.rows);
    const pAll = await turso.execute("SELECT id, name, state, status FROM patients LIMIT 10");
    console.log("Patient details:", pAll.rows);
  } catch(e) { console.error("patients error:", e.message); }

  console.log("\n=== BUSINESSES ===");
  try {
    const b = await turso.execute("SELECT state, COUNT(*) as c FROM businesses GROUP BY state");
    console.log("Businesses by state:", b.rows);
  } catch(e) { console.error("businesses error:", e.message); }

  console.log("\n=== FOUNDER LEDGER (revenue) ===");
  try {
    const fl = await turso.execute("SELECT * FROM founder_ledger LIMIT 10");
    console.log("Ledger entries:", fl.rows);
  } catch(e) { console.error("founder_ledger error:", e.message); }

  console.log("\n=== COMPLIANCE ALERTS ===");
  try {
    const ca = await turso.execute("SELECT * FROM compliance_alerts WHERE is_resolved = 0");
    console.log("Unresolved alerts:", ca.rows);
  } catch(e) { console.error("compliance_alerts error:", e.message); }

  console.log("\n=== ANALYTICS EVENTS (last 14d count) ===");
  try {
    const since = new Date(Date.now() - 14*24*60*60*1000).toISOString();
    const ae = await turso.execute({ sql: "SELECT COUNT(*) as c FROM analytics_events WHERE created_at >= ?", args: [since] });
    console.log("Events in 14d:", ae.rows[0].c);
  } catch(e) { console.error("analytics_events error:", e.message); }
}

run();
