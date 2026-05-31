import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  try {
    console.log("=== community_polls Schema ===");
    const info = await turso.execute("PRAGMA table_info(community_polls)");
    info.rows.forEach(r => console.log(r));

    console.log("\n=== community_polls Records ===");
    const records = await turso.execute("SELECT * FROM community_polls LIMIT 10");
    records.rows.forEach(r => console.log(r));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

run();
