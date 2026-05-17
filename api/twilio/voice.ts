import type { VercelRequest, VercelResponse } from '@vercel/node';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Create a new TwiML response
  const twiml = new VoiceResponse();

  // Determine if it's during business hours or if AI is toggled on
  // (For now, we assume Sylara AI is active!)
  
  // Sylara introduces herself using a highly realistic Neural Voice
  const gather = twiml.gather({
    input: ['speech'],
    action: '/api/twilio/respond',
    timeout: 4,
    speechTimeout: 'auto',
    language: 'en-US'
  });

  gather.say(
    { voice: 'Polly.Joanna-Neural' },
    "Hello! Welcome to the Global Green Call Center. I am Sylara, your virtual intake agent. Are you calling for Patient Support, Business Licensing, or to speak with Sales?"
  );

  // If the user doesn't say anything, Sylara prompts them again
  twiml.say(
    { voice: 'Polly.Joanna-Neural' },
    "I didn't quite catch that. Please say Patient, Business, or Sales."
  );
  twiml.redirect('/api/twilio/voice'); // Loops back to the top

  // Send the TwiML XML back to Twilio
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
}
