import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      return res.status(500).json({ error: 'Missing Twilio credentials' });
    }

    const { to, body } = req.body;
    
    if (!to || !body) {
      return res.status(400).json({ error: 'Missing to or body in request' });
    }

    const client = twilio(accountSid, authToken);
    
    const message = await client.messages.create({
      body: body,
      from: '+18889634447',
      to: to.startsWith('+1') ? to : `+1${to.replace(/\D/g, '')}`
    });

    res.status(200).json({
      success: true,
      messageId: message.sid,
      status: message.status
    });
  } catch (error) {
    console.error('[Twilio Send SMS] Error:', error);
    res.status(500).json({ error: error.message });
  }
}
