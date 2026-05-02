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
    
    // Fetch Call History
    const calls = await client.calls.list({ limit: 50 });
    const formattedCalls = calls.map(c => ({
      direction: c.direction === 'outbound-api' || c.direction === 'outbound-dial' ? 'outbound' : 'inbound',
      from: c.from,
      to: c.to,
      status: c.status,
      duration: c.duration ? parseInt(c.duration) : 0,
      timestamp: c.dateCreated,
      id: c.sid
    }));

    // Fetch SMS History
    const messages = await client.messages.list({ limit: 50 });
    const formattedMessages = messages.map(m => ({
      direction: m.direction === 'outbound-api' ? 'outbound' : 'inbound',
      from: m.from,
      to: m.to,
      body: m.body,
      status: m.status,
      timestamp: m.dateCreated,
      id: m.sid
    }));

    // Fetch Voicemail Recordings
    const recordings = await client.recordings.list({ limit: 20 });
    const formattedVoicemails = recordings.map(r => ({
      sid: r.sid,
      callSid: r.callSid,
      duration: r.duration,
      url: r.mediaUrl + '.mp3', // Direct MP3 link
      time: new Date(r.dateCreated).toLocaleString()
    }));

    res.status(200).json({ 
      calls: formattedCalls,
      messages: formattedMessages,
      voicemails: formattedVoicemails
    });
  } catch (error) {
    console.error('[Twilio History] Error:', error);
    res.status(500).json({ error: error.message });
  }
}
