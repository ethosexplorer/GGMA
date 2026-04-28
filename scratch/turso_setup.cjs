const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ';
const url = 'https://ggma-ggma.aws-us-east-2.turso.io/v2/pipeline';

async function run() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql: "CREATE TABLE IF NOT EXISTS system_state (key TEXT PRIMARY KEY, value INTEGER);" } },
        { type: "execute", stmt: { sql: "INSERT OR IGNORE INTO system_state (key, value) VALUES ('queue_count', 0);" } },
        { type: "execute", stmt: { sql: "SELECT * FROM system_state;" } }
      ]
    })
  });
  console.log(await res.text());
}
run();
