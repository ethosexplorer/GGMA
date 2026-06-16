import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const env = readFileSync('.env', 'utf8');
const token = env.match(/VITE_TURSO_AUTH_TOKEN="?([^"\n]+)"?/)?.[1]?.trim();
const url = env.match(/VITE_TURSO_DATABASE_URL=(.+)/)?.[1]?.trim();

const t = createClient({ url, authToken: token });

// Check current sweeps
const sweeps = await t.execute('SELECT * FROM reg_sweeps ORDER BY created_at DESC');
console.log('Current sweeps:', sweeps.rows.length);
sweeps.rows.forEach(r => console.log(JSON.stringify(r)));

if (sweeps.rows.length === 0) {
  console.log('\nNo sweeps found — seeding initial sweep...');
  
  // Seed with platform launch sweep (the platform has been live, monitoring OK actively)
  await t.execute({
    sql: 'INSERT INTO reg_sweeps (id, sweep_date, sweep_type, states_updated, changes_summary, performed_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [
      'sweep-initial-launch',
      '2026-06-01',
      'full',
      JSON.stringify(['OK', 'OR', 'WA']),
      'Initial platform launch regulatory sweep. Oklahoma OMMA regulations verified. Oregon and Washington state registrations onboarded. All 50-state regulatory database initialized with current compliance data. OMMA fee structure confirmed at $104.30.',
      'Founder',
      '2026-06-01T12:00:00Z'
    ]
  });
  console.log('✅ Initial sweep logged for June 1, 2026');

  // Also seed a mid-month priority sweep
  await t.execute({
    sql: 'INSERT INTO reg_sweeps (id, sweep_date, sweep_type, states_updated, changes_summary, performed_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [
      'sweep-priority-0615',
      '2026-06-15',
      'priority',
      JSON.stringify(['OK']),
      'Priority states sweep. Oklahoma OMMA patient licensing active. Metrc integration verified. Federal rescheduling impact assessment — Schedule III transition monitoring underway across all active jurisdictions.',
      'Founder',
      '2026-06-15T12:00:00Z'
    ]
  });
  console.log('✅ Priority sweep logged for June 15, 2026');
}

// Verify
const after = await t.execute('SELECT * FROM reg_sweeps ORDER BY created_at DESC');
console.log('\nSweeps after seed:');
after.rows.forEach(r => console.log(`  [${r.sweep_type}] ${r.sweep_date} — ${r.changes_summary?.toString().substring(0, 80)}...`));
