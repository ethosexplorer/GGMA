import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioApiKey = process.env.TWILIO_API_KEY;
    const twilioApiSecret = process.env.TWILIO_API_SECRET;

    // Use a hardcoded identity for the solo practitioner for now
    const identity = 'GGMA_User';

    const voiceGrant = new VoiceGrant({
      incomingAllow: true, 
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID
    });

    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: identity }
    );
    token.addGrant(voiceGrant);

    res.status(200).json({
      identity: identity,
      token: token.toJwt()
    });
  } catch (error) {
    console.error('Twilio Token Error:', error);
    res.status(500).json({ error: error.message });
  }
}
