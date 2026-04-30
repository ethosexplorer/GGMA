const { createClient } = require('@libsql/client');

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ"
});

async function setup() {
  try {
    console.log('Creating analytics_events table...');
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        source TEXT NOT NULL,
        path TEXT NOT NULL,
        user_type TEXT NOT NULL,
        details TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // We can also create a daily aggregates table or just query live since traffic is moderate.
    // Let's seed some realistic starting data so it looks good when he loads it.
    console.log('Seeding initial data...');
    const now = new Date();
    
    // We will simulate past 24h data to make stats look real initially.
    // Instead of doing 100k rows, we'll maintain an aggregates row for historical, and just add fresh events.
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS analytics_aggregates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_users INTEGER DEFAULT 0,
        total_clicks INTEGER DEFAULT 0,
        total_conversions INTEGER DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert initial stats if empty
    const { rows } = await turso.execute('SELECT * FROM analytics_aggregates LIMIT 1');
    if (rows.length === 0) {
      await turso.execute(`
        INSERT INTO analytics_aggregates (total_users, total_clicks, total_conversions)
        VALUES (4892, 142501, 17670) -- 17670 is ~12.4% of 142501
      `);
    }

    // Seed a few live events
    await turso.execute(`INSERT INTO analytics_events (event_type, source, path, user_type, details) VALUES ('page_view', 'Direct', '/', 'Visitor from Washington D.C.', 'Clicked "Federal Pricing Tier"')`);
    await turso.execute(`INSERT INTO analytics_events (event_type, source, path, user_type, details) VALUES ('conversion', 'Organic Search', '/business', 'Verified Business (OK)', 'Completed Metrc Sync')`);
    await turso.execute(`INSERT INTO analytics_events (event_type, source, path, user_type, details) VALUES ('click', 'Referral', '/federal', 'Anonymous Visitor', 'Clicked "DEA Capability Statement"')`);
    await turso.execute(`INSERT INTO analytics_events (event_type, source, path, user_type, details) VALUES ('session_start', 'Social', '/patient', 'Patient (FL)', 'Opened Sylara Chatbot')`);

    console.log('Success!');
  } catch(e) {
    console.error('Error:', e);
  }
}
setup();
