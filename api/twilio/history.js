import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      return res.status(500).json({ error: 'Missing Twilio credentials' });
    }

    const client = twilio(accountSid, authToken);
    
    // Fetch last 20 calls
    const calls = await client.calls.list({ limit: 20 });
    
    // Fetch last 20 messages
    const messages = await client.messages.list({ limit: 20 });

    res.status(200).json({
      calls: calls.map(c => ({
        id: c.sid,
        from: c.from,
        to: c.to,
        direction: c.direction.includes('inbound') ? 'inbound' : 'outbound',
        status: c.status,
        duration: parseInt(c.duration || '0', 10),
        timestamp: c.dateCreated
      })),
      messages: messages.map(m => ({
        id: m.sid,
        from: m.from,
        to: m.to,
        body: m.body,
        direction: m.direction.includes('inbound') ? 'inbound' : 'outbound',
        status: m.status,
        timestamp: m.dateCreated
      }))
    });
  } catch (error) {
    console.error('[Twilio History] Error:', error);
    res.status(500).json({ error: error.message });
  }
}
