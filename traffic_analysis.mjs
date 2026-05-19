import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  // Get all analytics events ordered by time
  const events = await turso.execute("SELECT * FROM analytics_events ORDER BY created_at ASC");
  
  console.log(`=== ANALYTICS EVENTS (${events.rows.length} total) ===\n`);
  
  // Group by date
  const byDate = {};
  for (const row of events.rows) {
    const ts = String(row.created_at || row.timestamp || '');
    const dateStr = ts.slice(0, 10); // YYYY-MM-DD
    if (!byDate[dateStr]) byDate[dateStr] = { events: [], users: 0, clicks: 0 };
    byDate[dateStr].events.push(row);
    
    // Try to extract metrics
    const data = row.data ? JSON.parse(String(row.data)) : {};
    if (data.users) byDate[dateStr].users += Number(data.users) || 0;
    if (data.clicks) byDate[dateStr].clicks += Number(data.clicks) || 0;
  }
  
  // Show daily breakdown
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  console.log("DATE           | DAY       | EVENTS | DETAILS");
  console.log("---------------|-----------|--------|--------");
  
  for (const [date, info] of Object.entries(byDate)) {
    const d = new Date(date + 'T12:00:00Z');
    const dayName = days[d.getUTCDay()];
    const eventTypes = info.events.map(e => e.event_type || e.action || 'unknown');
    const typeCounts = {};
    eventTypes.forEach(t => { typeCounts[t] = (typeCounts[t] || 0) + 1; });
    const summary = Object.entries(typeCounts).map(([k,v]) => `${k}:${v}`).join(', ');
    console.log(`${date}  | ${dayName.padEnd(9)} | ${String(info.events.length).padEnd(6)} | ${summary}`);
  }
  
  // Also show the raw first and last few events
  console.log("\n=== FIRST 5 EVENTS ===");
  for (const r of events.rows.slice(0, 5)) {
    console.log(`  ${r.created_at} | ${r.event_type || r.action || 'N/A'} | ${String(r.data || '').slice(0, 120)}`);
  }
  
  console.log("\n=== LAST 10 EVENTS ===");
  for (const r of events.rows.slice(-10)) {
    console.log(`  ${r.created_at} | ${r.event_type || r.action || 'N/A'} | ${String(r.data || '').slice(0, 120)}`);
  }

  // Also check system_logs for traffic patterns
  console.log("\n=== SYSTEM LOGS (last 20) ===");
  const logs = await turso.execute("SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 20");
  for (const r of logs.rows) {
    console.log(`  ${r.created_at} | ${r.action || r.event || 'N/A'} | ${String(r.data || r.details || '').slice(0, 100)}`);
  }
  
  // Check analytics_aggregates history
  console.log("\n=== ANALYTICS AGGREGATES ===");
  const agg = await turso.execute("SELECT * FROM analytics_aggregates");
  console.log(JSON.stringify(agg.rows, null, 2));
}

run().catch(console.error);
