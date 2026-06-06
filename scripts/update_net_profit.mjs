import { createClient } from '@libsql/client/web';

const turso = createClient({
  url: "libsql://ggma-ggma.aws-us-east-2.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ",
});

async function main() {
  // First, see all current ledger entries
  const res = await turso.execute('SELECT id, origin_vector, gross_revenue, net_profit FROM founder_ledger ORDER BY created_at DESC');
  console.log('=== Current Ledger Entries ===');
  for (const row of res.rows) {
    console.log(`  [${row.id}] ${row.origin_vector} | Gross: ${row.gross_revenue} | Net: ${row.net_profit}`);
  }

  // Update ONLY Jaime Laughing's Renewal Fee to $55.00 net
  await turso.execute({
    sql: `UPDATE founder_ledger SET net_profit = '$55.00' WHERE id = 58`,
    args: []
  });
  console.log('✅ Updated Jaime Laughing Renewal Fee → Net: $55.00');

  // Revert Jasmin Garrett's processing fee back to $20 (it's a flat fee, not a medical card)
  await turso.execute({
    sql: `UPDATE founder_ledger SET net_profit = '$20.00' WHERE id = 57`,
    args: []
  });
  console.log('✅ Reverted Jasmin Garrett Processing Fee → Net: $20.00');

  // Verify
  const res2 = await turso.execute('SELECT id, origin_vector, gross_revenue, net_profit FROM founder_ledger ORDER BY created_at DESC');
  console.log('\n=== Updated Ledger Entries ===');
  for (const row of res2.rows) {
    console.log(`  [${row.id}] ${row.origin_vector} | Gross: ${row.gross_revenue} | Net: ${row.net_profit}`);
  }
}

main().catch(console.error);
