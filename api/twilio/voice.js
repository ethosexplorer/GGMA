import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml');

  try {
    const twiml = new VoiceResponse();
    
    // Check if this is an outbound call request from the WebDialer
    if (req.body.To && req.body.To.trim() !== '') {
      const dial = twiml.dial({
        callerId: '+18889634447', // Company number
        answerOnBridge: true
      });
      // Ensure the number is formatted correctly (e.g., starts with +1)
      let targetNumber = req.body.To;
      if (!targetNumber.startsWith('+1')) {
        targetNumber = '+1' + targetNumber.replace(/\D/g, '');
      }
      dial.number({
        statusCallbackEvent: 'initiated ringing answered completed',
        statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status',
        statusCallbackMethod: 'POST'
      }, targetNumber);
    } else {
      // Incoming call logic: Ring the WebDialer
      const dial = twiml.dial({
        timeout: 60,
        answerOnBridge: true
      });
      
      // Connect to the web browser client
      dial.client({
        statusCallbackEvent: 'initiated ringing answered completed',
        statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status',
        statusCallbackMethod: 'POST'
      }, 'GGMA_User');
    }

    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('Twilio Voice Webhook Error:', error);
    
    const fallback = new VoiceResponse();
    fallback.say('We are currently experiencing technical difficulties. Please try again later.');
    res.status(200).send(fallback.toString());
  }
}
