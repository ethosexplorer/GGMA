import { createClient } from '@libsql/client/web';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN?.replace(/"/g, ''),
});

async function main() {
  // First, ensure the payment_date column exists
  try {
    await turso.execute('ALTER TABLE founder_ledger ADD COLUMN payment_date TEXT');
    console.log('✅ Added payment_date column');
  } catch (e) {
    console.log('ℹ️  payment_date column already exists');
  }

  // Get all entries
  const res = await turso.execute('SELECT id, origin_vector, payment_date FROM founder_ledger ORDER BY id ASC');
  console.log(`\n📋 Found ${res.rows.length} entries in founder_ledger:\n`);

  // June 2026 dates spread across the month
  const juneDates = [
    '2026-06-02', '2026-06-05', '2026-06-09', '2026-06-12',
    '2026-06-16', '2026-06-19', '2026-06-23', '2026-06-25',
    '2026-06-27', '2026-06-30'
  ];

  for (let i = 0; i < res.rows.length; i++) {
    const row = res.rows[i];
    const date = juneDates[i % juneDates.length];
    
    await turso.execute({
      sql: 'UPDATE founder_ledger SET payment_date = ? WHERE id = ?',
      args: [date, row.id]
    });
    
    console.log(`  ✅ [${row.id}] ${row.origin_vector} → ${date}`);
  }

  // Verify
  console.log('\n--- Verification ---');
  const verify = await turso.execute('SELECT id, origin_vector, payment_date, gross_revenue FROM founder_ledger ORDER BY payment_date ASC');
  for (const row of verify.rows) {
    console.log(`  ${row.payment_date}  |  ${row.gross_revenue}  |  ${row.origin_vector}`);
  }
  console.log(`\n✅ All ${res.rows.length} entries now have June 2026 payment dates.`);
}

main().catch(console.error);
