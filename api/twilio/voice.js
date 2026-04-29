import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml');

  try {
    const twiml = new VoiceResponse();
    
    // Create a dial block
    const dial = twiml.dial({
      timeout: 60,
      answerOnBridge: true
    });
    
    // Connect to the web browser client
    dial.client('GGMA_User');

    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('Twilio Voice Webhook Error:', error);
    
    const fallback = new VoiceResponse();
    fallback.say('We are currently experiencing technical difficulties. Please try again later.');
    res.status(200).send(fallback.toString());
  }
}
