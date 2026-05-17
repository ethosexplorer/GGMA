import type { VercelRequest, VercelResponse } from '@vercel/node';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const twiml = new VoiceResponse();
  
  // Twilio sends the transcribed speech in the 'SpeechResult' parameter
  const userSpeech = req.body.SpeechResult?.toLowerCase() || '';

  console.log('Sylara heard:', userSpeech);

  if (userSpeech.includes('sale') || userSpeech.includes('rep') || userSpeech.includes('buy') || userSpeech.includes('subscrib') || userSpeech.includes('upgrad') || userSpeech.includes('price') || userSpeech.includes('cost')) {
    // 1. Sales & Subscriptions
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "Excellent. I will connect you with our AI Sales Representative right now. Please hold."
    );
    twiml.say(
      { voice: 'Polly.Matthew-Neural' },
      "Hello! This is your Global Green AI Sales Representative. How can I assist you with your subscription today?"
    );
    // In production, we dial out to an ElevenLabs SIP bridge or human rep here
    
  } else if (userSpeech.includes('patient') || userSpeech.includes('card') || userSpeech.includes('doctor') || userSpeech.includes('telehealth') || userSpeech.includes('appointment')) {
    // 2. Patient Intake
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "You have reached Patient Support. For security, I am texting you a direct link to complete your medical intake and book your doctor right from your phone. Have a wonderful day!"
    );
    // In production, Twilio SMS API logic is placed here.
    
  } else if (userSpeech.includes('business') || userSpeech.includes('license') || userSpeech.includes('dispensary') || userSpeech.includes('compliance') || userSpeech.includes('metrc')) {
    // 3. Business Licensing
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "You have reached Business Licensing and Compliance. I am sending a secure link to your phone to access the Business Portal. If you need LARRY, our compliance engine, please press 1."
    );
    twiml.gather({ numDigits: 1, action: '/api/twilio/voice', timeout: 3 });

  } else if (userSpeech.includes('legal') || userSpeech.includes('lawyer') || userSpeech.includes('attorney') || userSpeech.includes('arrest') || userSpeech.includes('raid') || userSpeech.includes('police')) {
    // 4. Legal / Urgent
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "I am prioritizing this call to the Legal Network immediately. Please stay on the line."
    );
    // Simulate dialing emergency legal line
    twiml.dial('+18005550000');

  } else if (userSpeech.includes('support') || userSpeech.includes('help') || userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent')) {
    // 5. Support / Human Operator
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "I understand. Please hold while I connect you with the next available human agent."
    );
    // Ring the WebDialer on the GGP-OS dashboards
    const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
    const client = dial.client({ statusCallbackEvent: 'initiated ringing answered completed', statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
    client.parameter({ name: 'DepartmentContext', value: 'Human Operator Transfer' });

  } else {
    // Fallback
    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "I'm sorry, I didn't quite catch that. You can say 'Sales', 'Patient', 'Business', or 'Operator'."
    );
    twiml.redirect('/api/twilio/voice');
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
}
