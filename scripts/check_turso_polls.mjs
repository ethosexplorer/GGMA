import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  console.log("Checking Turso Database Tables and Polls...");
  try {
    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("=== Database Tables ===");
    tables.rows.forEach(r => console.log(`- ${r.name}`));

    for (const t of ['poll_votes', 'community_polls', 'platform_settings']) {
      try {
        const count = await turso.execute(`SELECT COUNT(*) as c FROM ${t}`);
        console.log(`Table "${t}": ${count.rows[0].c} records`);
      } catch (err) {
        console.log(`Table "${t}": ERROR: ${err.message}`);
      }
    }

    try {
      console.log("\n=== poll_votes Schema ===");
      const info = await turso.execute("PRAGMA table_info(poll_votes)");
      info.rows.forEach(r => console.log(r));
    } catch(e) {}

    try {
      console.log("\n=== Sample poll_votes (first 5) ===");
      const sample = await turso.execute("SELECT * FROM poll_votes LIMIT 5");
      sample.rows.forEach(r => console.log(r));
    } catch (e) {}

  } catch (err) {
    console.error("Failed to connect or query Turso:", err);
  }
  process.exit(0);
}

run();
