import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  try {
    // Check all tables
    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    console.log("=== ALL TABLES IN DATABASE ===");
    tables.rows.forEach(r => console.log("  -", r.name));

    // Check if community_polls table exists
    const cpCheck = tables.rows.find(r => r.name === 'community_polls');
    console.log("\n=== community_polls exists?", !!cpCheck);

    // Check analytics_aggregates content
    const agg = await turso.execute("SELECT * FROM analytics_aggregates");
    console.log("\n=== analytics_aggregates ===");
    agg.rows.forEach(r => console.log(r));

    // Check analytics_events content
    const ev = await turso.execute("SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 5");
    console.log("\n=== analytics_events (last 5) ===");
    ev.rows.forEach(r => console.log(r));

    // Check poll_votes content
    const pv = await turso.execute("SELECT COUNT(*) as c FROM poll_votes");
    console.log("\n=== poll_votes count ===", pv.rows[0].c);

    // Check audit_logs table
    const alCheck = tables.rows.find(r => r.name === 'audit_logs');
    console.log("\n=== audit_logs exists?", !!alCheck);
    if (alCheck) {
      const al = await turso.execute("SELECT COUNT(*) as c FROM audit_logs");
      console.log("  audit_logs count:", al.rows[0].c);
    }

    // Check compliance_alerts content
    const ca = await turso.execute("SELECT * FROM compliance_alerts ORDER BY created_at DESC LIMIT 5");
    console.log("\n=== compliance_alerts (last 5) ===");
    ca.rows.forEach(r => console.log(r));

    // Check system_logs table
    const slCheck = tables.rows.find(r => r.name === 'system_logs');
    console.log("\n=== system_logs exists?", !!slCheck);

  } catch(e) {
    console.error(e);
  }
}
run();
