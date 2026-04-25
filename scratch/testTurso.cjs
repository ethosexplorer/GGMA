const { createClient } = require('@libsql/client');
const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ"
});
async function test() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS founder_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origin_vector TEXT NOT NULL,
        type TEXT NOT NULL,
        gross_revenue TEXT NOT NULL,
        net_profit TEXT NOT NULL,
        status TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Success!');
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
