import type { VercelRequest, VercelResponse } from '@vercel/node';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const twiml = new VoiceResponse();
  
  // Twilio sends the transcribed speech in the 'SpeechResult' parameter
  const userSpeech = req.body.SpeechResult?.toLowerCase() || '';

  console.log('Sylara heard:', userSpeech);

  if (userSpeech.includes('sale') || userSpeech.includes('rep') || userSpeech.includes('buy') || userSpeech.includes('connect')) {
    // Route to Sales Rep
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "Excellent. I will connect you with our AI Sales Representative right now. Please hold on for just a moment."
    );
    
    // In a full production setup with ElevenLabs, this is where we would bridge the call 
    // to an ElevenLabs conversational agent via WebSockets or Twilio SIP.
    // For now, we simulate the transfer or dial a human sales number if AI Sales is offline.
    twiml.say(
      { voice: 'Polly.Matthew-Neural' },
      "Hello! This is your Global Green Sales Representative. How can I assist you with your subscription today?"
    );
    // You could also use <Dial> to forward the call to Ryan's real phone number here!
    
  } else if (userSpeech.includes('patient') || userSpeech.includes('card')) {
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "You have reached Patient Intake. I can text you a secure link to complete your medical card application right from your phone. Would you like me to send that text?"
    );
    // Wait for "Yes" or "No"
    twiml.gather({
      input: ['speech'],
      action: '/api/twilio/voice', // We just loop back for now
      timeout: 3,
      speechTimeout: 'auto',
      language: 'en-US'
    });
    
  } else if (userSpeech.includes('business') || userSpeech.includes('license')) {
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "You have reached Business Intake. Business licensing requires completing our secure online portal. I will send a link to your phone number. Have a great day!"
    );
  } else {
    // Fallback if she doesn't understand
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "I'm sorry, I didn't quite catch that. Connecting you to a live operator for further assistance."
    );
    // Replace with a real routing number or keep in queue
    // twiml.dial('+1234567890');
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
}
