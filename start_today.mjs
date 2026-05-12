import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  try {
    // Clear out the simulated data completely. Zero tolerance for fake data.
    await turso.execute("DELETE FROM analytics_events");
    await turso.execute("DELETE FROM analytics_aggregates");

    const pRes = await turso.execute('SELECT COUNT(*) as count FROM patients');
    const bRes = await turso.execute('SELECT COUNT(*) as count FROM businesses');
    const dbUsers = Number(pRes.rows[0].count) + Number(bRes.rows[0].count);

    // Pure 1-to-1 reality starting NOW. No padding, no fake clicks.
    await turso.execute({
      sql: "INSERT INTO analytics_aggregates (id, total_users, total_clicks, total_conversions, last_updated) VALUES (?, ?, ?, ?, ?)",
      args: [1, dbUsers, 0, 0, new Date().toISOString()]
    });

    // Start with a clean slate for the events list
    await turso.execute({
      sql: "INSERT INTO analytics_events (event_type, source, path, user_type, details, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: ["SYSTEM_LAUNCH", "Internal", "/dashboard", "Admin", "Real-Time Tracking Activated for Public Launch", new Date().toISOString()]
    });

    console.log("Analytics tables reset to pure reality starting today.");
  } catch(e) {
    console.error(e);
  }
}
run();
