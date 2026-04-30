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
      return res.status(500).json({ connected: false, error: 'Missing Twilio credentials' });
    }

    const client = twilio(accountSid, authToken);
    
    // Fetch account info to verify connectivity
    const account = await client.api.v2010.accounts(accountSid).fetch();

    res.status(200).json({
      connected: account.status === 'active',
      accountId: account.sid,
      name: account.friendlyName
    });
  } catch (error) {
    console.error('[Twilio Verify] Error:', error);
    res.status(500).json({ connected: false, error: error.message });
  }
}
