// POST: Record a vote  |  GET: Fetch aggregated results
// Table auto-creates on first call

const TURSO_URL = 'https://ggma-ggma.aws-us-east-2.turso.io/v2/pipeline';
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ';

async function tursoExec(statements) {
  const requests = statements.map(sql => ({
    type: "execute",
    stmt: typeof sql === 'string' ? { sql } : sql
  }));
  
  const res = await fetch(TURSO_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });
  
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Ensure table exists
async function ensureTable() {
  await tursoExec([
    `CREATE TABLE IF NOT EXISTS poll_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id TEXT NOT NULL,
      option_id TEXT NOT NULL,
      user_id TEXT,
      session_id TEXT,
      ip_hash TEXT,
      state TEXT DEFAULT 'Unknown',
      category TEXT DEFAULT 'general',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id)`,
    `CREATE INDEX IF NOT EXISTS idx_poll_votes_created ON poll_votes(created_at)`,
    // Aggregated results cache for fast reads
    `CREATE TABLE IF NOT EXISTS poll_results (
      poll_id TEXT NOT NULL,
      option_id TEXT NOT NULL,
      vote_count INTEGER DEFAULT 0,
      last_updated TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (poll_id, option_id)
    )`
  ]);
}

// Simple hash for IP dedup (no PII stored)
function hashIP(ip) {
  let hash = 0;
  const str = ip || 'unknown';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit int
  }
  return 'h_' + Math.abs(hash).toString(36);
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureTable();

    // ─── POST: Record vote(s) ───
    if (req.method === 'POST') {
      const { poll_id, option_ids, user_id, session_id, state, category } = req.body || {};
      
      if (!poll_id || !option_ids || !Array.isArray(option_ids) || option_ids.length === 0) {
        return res.status(400).json({ error: 'poll_id and option_ids[] required' });
      }

      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      const ipHash = hashIP(ip);

      // Check if this IP already voted on this poll (dedup)
      const checkResult = await tursoExec([{
        sql: "SELECT COUNT(*) as cnt FROM poll_votes WHERE poll_id = ? AND ip_hash = ?",
        args: [poll_id, ipHash]
      }]);
      
      const existingVotes = checkResult?.results?.[0]?.response?.result?.rows?.[0]?.[0]?.value;
      if (existingVotes && parseInt(existingVotes) > 0) {
        return res.status(409).json({ error: 'already_voted', message: 'You have already voted on this poll' });
      }

      // Insert votes + update aggregated counts
      const insertStatements = [];
      for (const option_id of option_ids) {
        insertStatements.push({
          sql: "INSERT INTO poll_votes (poll_id, option_id, user_id, session_id, ip_hash, state, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
          args: [poll_id, option_id, user_id || null, session_id || null, ipHash, state || 'Unknown', category || 'general']
        });
        // Upsert aggregated result
        insertStatements.push({
          sql: `INSERT INTO poll_results (poll_id, option_id, vote_count, last_updated) 
                VALUES (?, ?, 1, datetime('now'))
                ON CONFLICT(poll_id, option_id) DO UPDATE SET 
                  vote_count = vote_count + 1, 
                  last_updated = datetime('now')`,
          args: [poll_id, option_id]
        });
      }

      await tursoExec(insertStatements);
      return res.status(200).json({ success: true, poll_id, votes: option_ids.length });
    }

    // ─── GET: Fetch results ───
    if (req.method === 'GET') {
      const { poll_id, category, days } = req.query || {};
      
      let statements = [];
      
      if (poll_id) {
        // Single poll results
        statements.push({
          sql: "SELECT option_id, vote_count FROM poll_results WHERE poll_id = ? ORDER BY vote_count DESC",
          args: [poll_id]
        });
      } else {
        // All polls summary (aggregated)
        statements.push({
          sql: `SELECT poll_id, SUM(vote_count) as total_votes 
                FROM poll_results 
                GROUP BY poll_id 
                ORDER BY total_votes DESC`
        });
      }

      // Trend data (last N days)
      if (days) {
        const daysInt = parseInt(days) || 7;
        statements.push({
          sql: `SELECT poll_id, option_id, COUNT(*) as votes, DATE(created_at) as vote_date
                FROM poll_votes 
                WHERE created_at >= datetime('now', '-${daysInt} days')
                ${poll_id ? "AND poll_id = '" + poll_id.replace(/'/g, '') + "'" : ''}
                ${category ? "AND category = '" + category.replace(/'/g, '') + "'" : ''}
                GROUP BY poll_id, option_id, DATE(created_at)
                ORDER BY vote_date DESC`
        });
      }

      // Geographic breakdown
      if (req.query.geo === 'true') {
        statements.push({
          sql: `SELECT state, COUNT(*) as votes 
                FROM poll_votes 
                ${poll_id ? "WHERE poll_id = '" + poll_id.replace(/'/g, '') + "'" : ''}
                GROUP BY state 
                ORDER BY votes DESC 
                LIMIT 20`
        });
      }

      // Overall stats
      statements.push({
        sql: `SELECT 
                COUNT(DISTINCT poll_id) as polls_with_votes,
                COUNT(*) as total_votes,
                COUNT(DISTINCT ip_hash) as unique_voters,
                MIN(created_at) as first_vote,
                MAX(created_at) as last_vote
              FROM poll_votes`
      });

      const result = await tursoExec(statements);
      
      // Parse Turso response into clean JSON
      const parsed = result.results?.map((r, i) => {
        const rows = r.response?.result?.rows || [];
        const cols = r.response?.result?.cols || [];
        return rows.map(row => {
          const obj = {};
          cols.forEach((col, ci) => {
            obj[col.name] = row[ci]?.value;
          });
          return obj;
        });
      });

      return res.status(200).json({
        results: parsed?.[0] || [],
        trends: parsed?.[1] || [],
        geo: req.query.geo === 'true' ? (parsed?.[2] || []) : undefined,
        stats: (parsed?.[parsed.length - 1] || [])[0] || {}
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Poll API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
