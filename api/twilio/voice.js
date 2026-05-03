import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml');

  try {
    const twiml = new VoiceResponse();
    
    const TWILIO_NUMBER = '+18889634447';
    
    // Check if this is an outbound call request from the WebDialer
    // If the destination is NOT our Twilio number, it's an outbound call.
    if (req.body.To && req.body.To !== TWILIO_NUMBER && req.body.To.trim() !== '') {
      const dial = twiml.dial({
        callerId: TWILIO_NUMBER, // Company number
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
      // Check business hours (Mon-Fri, 9am - 5pm CST)
      const now = new Date();
      // CST calculation (simplistic UTC-5/6 depending on DST, but using standard -5 for now)
      const utcHours = now.getUTCHours();
      const cstHours = (utcHours - 5 + 24) % 24;
      const dayOfWeek = now.getUTCDay(); // 0 is Sunday, 1 is Monday

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      // Temporary override: set to true to allow 24/7 testing this weekend
      const isBusinessHours = true; // !isWeekend && cstHours >= 9 && cstHours < 17;

      if (!isBusinessHours) {
        twiml.say("Thank you for calling Global Green Enterprise. You have reached us outside of our normal business hours, which are Monday through Friday, 9 A.M. to 5 P.M. Central Time. Please leave a message and we will return your call on the next business day.");
        twiml.record({
          action: 'https://ggma-five.vercel.app/api/twilio/call-status',
          maxLength: 120,
          playBeep: true
        });
      } else {
        // Incoming call logic: Ring the WebDialer for 60 seconds
        const dial = twiml.dial({
          timeout: 60, // 60 seconds to answer before voicemail
          answerOnBridge: true
        });
        
        // Connect to the web browser client
        dial.client({
          statusCallbackEvent: 'initiated ringing answered completed',
          statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status',
          statusCallbackMethod: 'POST'
        }, 'GGMA_User');

        // If the Dial timeout is reached (no answer), Twilio continues to the next verb: Voicemail
        twiml.say("Thank you for calling Global Green Enterprise. We are currently assisting other callers. Please leave a message after the tone, and we will return your call shortly.");
        twiml.record({
          action: 'https://ggma-five.vercel.app/api/twilio/call-status',
          maxLength: 120,
          playBeep: true
        });
      }
    }

    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('Twilio Voice Webhook Error:', error);
    
    const fallback = new VoiceResponse();
    fallback.say('We are currently experiencing technical difficulties. Please try again later.');
    res.status(200).send(fallback.toString());
  }
}
