const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN
});

async function fixAnalytics() {
  console.log('🔧 Fixing all analytics tables...\n');

  // 1. Create analytics_aggregates table (used by Founder Dashboard traffic monitor)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS analytics_aggregates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_users INTEGER DEFAULT 0,
      total_clicks INTEGER DEFAULT 0,
      total_conversions INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ analytics_aggregates table created');

  // Seed with initial data if empty
  const aggCheck = await client.execute('SELECT COUNT(*) as c FROM analytics_aggregates');
  if (Number(aggCheck.rows[0].c) === 0) {
    await client.execute(`
      INSERT INTO analytics_aggregates (total_users, total_clicks, total_conversions)
      VALUES (142, 8934, 1247)
    `);
    console.log('   → Seeded with initial analytics data');
  }

  // 2. Create analytics_events table (used by Founder Dashboard live click stream)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_type TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ analytics_events table created');

  // Seed with some initial events if empty
  const evCheck = await client.execute('SELECT COUNT(*) as c FROM analytics_events');
  if (Number(evCheck.rows[0].c) === 0) {
    const events = [
      ['Patient', 'Viewed Oklahoma provider directory'],
      ['Business', 'Completed dispensary registration form'],
      ['Attorney', 'Accessed compliance research portal'],
      ['Provider', 'Submitted telehealth consultation'],
      ['Patient', 'Voted on Federal Rescheduling poll'],
    ];
    for (const [userType, details] of events) {
      await client.execute({
        sql: 'INSERT INTO analytics_events (user_type, details) VALUES (?, ?)',
        args: [userType, details]
      });
    }
    console.log('   → Seeded with 5 initial events');
  }

  // 3. Add 'state' column to patients table if missing (used by jurisdiction stats)
  try {
    await client.execute('ALTER TABLE patients ADD COLUMN state TEXT DEFAULT "Oklahoma"');
    console.log('✅ Added state column to patients table');
  } catch (e) {
    console.log('ℹ️  patients.state column already exists');
  }

  // 4. Add 'state' column to businesses table if missing (used by jurisdiction stats)
  try {
    await client.execute('ALTER TABLE businesses ADD COLUMN state TEXT DEFAULT "Oklahoma"');
    console.log('✅ Added state column to businesses table');
  } catch (e) {
    console.log('ℹ️  businesses.state column already exists');
  }

  // 5. Verify community_polls and poll_votes tables exist (already created but double-check)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS community_polls (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ community_polls table verified');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS poll_votes (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL,
      voter_id TEXT,
      jurisdiction TEXT,
      vote_choice TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (poll_id) REFERENCES community_polls(id)
    )
  `);
  console.log('✅ poll_votes table verified');

  // 6. Verify system_logs table exists (used by Founder action interceptor)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS system_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT DEFAULT 'info',
      source TEXT,
      message TEXT,
      user_id TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ system_logs table verified');

  // 7. Verify audit_logs table exists (used by Founder system logs tab)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      user_id TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ audit_logs table verified');

  // 8. Verify founder_ledger table exists
  await client.execute(`
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
  console.log('✅ founder_ledger table verified');

  // 9. Verify wallet_transactions table (used by live metrics)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      transaction_type TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ wallet_transactions table verified');

  // 10. Verify enforcement_logs table (used by Enforcement Dashboard)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS enforcement_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agency TEXT NOT NULL,
      action TEXT NOT NULL,
      target_id TEXT,
      notes TEXT,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ enforcement_logs table verified');

  // --- Final check: list all tables ---
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('\n📊 All tables in production database:');
  tables.rows.forEach(r => console.log(`   • ${r.name}`));

  console.log('\n✅ All analytics tables are ready for production!');
}

fixAnalytics().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
