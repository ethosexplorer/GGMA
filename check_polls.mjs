import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function run() {
  try {
    const schema = await turso.execute("PRAGMA table_info(community_polls)");
    console.log("=== community_polls schema ===");
    schema.rows.forEach(r => console.log(r));
    
    const count = await turso.execute("SELECT COUNT(*) as c FROM community_polls");
    console.log("\nRow count:", count.rows[0].c);
    
    const rows = await turso.execute("SELECT * FROM community_polls LIMIT 5");
    console.log("\nSample rows:");
    rows.rows.forEach(r => console.log(r));
  } catch(e) {
    console.error(e);
  }
}
run();
