export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // The webhook expects an action: "started" (+1) or "completed" (-1)
  // Make.com should POST {"action": "started"} or {"action": "completed"}
  const { action } = req.body || req.query;

  const url = 'https://ggma-ggma.aws-us-east-2.turso.io/v2/pipeline';
  const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ';

  try {
    let sql = "";
    if (action === 'started') {
      sql = "UPDATE system_state SET value = value + 1 WHERE key = 'queue_count';";
    } else if (action === 'completed') {
      sql = "UPDATE system_state SET value = MAX(0, value - 1) WHERE key = 'queue_count';";
    } else {
      return res.status(400).json({ error: "Invalid action. Use 'started' or 'completed'" });
    }

    const tursoRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql } }
        ]
      })
    });

    if (!tursoRes.ok) {
      const err = await tursoRes.text();
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true, action });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
