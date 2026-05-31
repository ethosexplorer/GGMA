const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN
});

async function setup() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS community_polls (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS poll_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id TEXT NOT NULL,
      option_id TEXT NOT NULL,
      user_id TEXT,
      session_id TEXT,
      ip_hash TEXT,
      state TEXT DEFAULT 'Unknown',
      category TEXT DEFAULT 'general',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const res = await client.execute('SELECT count(*) as c FROM community_polls');
  if (Number(res.rows[0].c) === 0) {
    await client.execute(`INSERT INTO community_polls (id, question, category) VALUES 
      ('poll_1', 'Should cannabis be rescheduled from Schedule I?', 'Legal & Expungement'),
      ('poll_2', 'Do you believe cannabis is a natural source of healing?', 'Healing & Medical'),
      ('poll_3', 'Should past cannabis convictions be expunged?', 'Legal & Expungement'),
      ('poll_4', 'Where should cannabis tax revenue go?', 'Economic & Business'),
      ('poll_5', 'Has the stigma around cannabis changed?', 'Culture & Lifestyle');
    `);
  }

  console.log('Poll schema created');
}

setup().catch(console.error);
