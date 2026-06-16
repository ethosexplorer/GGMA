import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const env = readFileSync('.env', 'utf8');
const token = env.match(/VITE_TURSO_AUTH_TOKEN="?([^"\n]+)"?/)?.[1]?.trim();
const url = env.match(/VITE_TURSO_DATABASE_URL=(.+)/)?.[1]?.trim();

const t = createClient({ url, authToken: token });

// Check schema first
console.log('=== community_polls SCHEMA ===');
const schema1 = await t.execute("PRAGMA table_info(community_polls)");
schema1.rows.forEach(r => console.log(`  ${r.name} (${r.type})`));

console.log('\n=== poll_votes SCHEMA ===');
const schema2 = await t.execute("PRAGMA table_info(poll_votes)");
schema2.rows.forEach(r => console.log(`  ${r.name} (${r.type})`));

console.log('\n=== POLL DATA ===');
const polls = await t.execute('SELECT COUNT(*) as c FROM community_polls');
console.log('Total Polls:', polls.rows[0].c);

const votes = await t.execute('SELECT COUNT(*) as c FROM poll_votes');
console.log('Total Votes in poll_votes table:', votes.rows[0].c);

console.log('\n--- All polls ---');
const allPolls = await t.execute('SELECT * FROM community_polls LIMIT 10');
allPolls.rows.forEach(r => console.log(JSON.stringify(r)));

console.log('\n--- All votes ---');
const allVotes = await t.execute('SELECT * FROM poll_votes');
allVotes.rows.forEach(r => console.log(JSON.stringify(r)));
