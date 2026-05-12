import { createClient } from '@libsql/client';

const db = createClient({
  url: 'file:./local.db',
});

async function run() {
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.log(tables.rows);
}

run().catch(console.error);
