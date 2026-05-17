import type { VercelRequest, VercelResponse } from '@vercel/node';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const twiml = new VoiceResponse();

  if (req.query.action === 'respond') {
    // ==========================================
    // RESPOND LOGIC (Processing User Speech)
    // ==========================================
    const userSpeech = req.body.SpeechResult?.toLowerCase() || '';
    console.log('Sylara heard:', userSpeech);

    if (userSpeech.includes('sale') || userSpeech.includes('rep') || userSpeech.includes('buy') || userSpeech.includes('subscrib') || userSpeech.includes('upgrad') || userSpeech.includes('price') || userSpeech.includes('cost')) {
      // 1. Sales & Subscriptions -> E'Onna
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "Excellent. I will connect you with E'Onna, our AI Sales Director, right now. Please hold.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello! This is E'Onna, your Global Green AI Sales Director. How can I assist you with your subscription today?");
      
    } else if (userSpeech.includes('patient') || userSpeech.includes('card') || userSpeech.includes('doctor') || userSpeech.includes('telehealth') || userSpeech.includes('appointment')) {
      // 2. Patient Intake -> Geneva
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Patient Support. I am transferring you to Geneva, our Patient Care Concierge. She is texting you a secure link right now to complete your medical intake from your phone.");
      
    } else if (userSpeech.includes('business') || userSpeech.includes('license') || userSpeech.includes('dispensary') || userSpeech.includes('compliance') || userSpeech.includes('metrc')) {
      // 3. Business Licensing -> Harlem
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Business Licensing. I am transferring you to Harlem, our Corporate Integration Executive. If you need LARRY, our compliance engine, please press 1.");
      twiml.gather({ numDigits: 1, action: '/api/twilio/voice', timeout: 3 });

    } else if (userSpeech.includes('legal') || userSpeech.includes('lawyer') || userSpeech.includes('attorney') || userSpeech.includes('arrest') || userSpeech.includes('raid') || userSpeech.includes('police')) {
      // 4. Legal / Urgent -> Hyriah
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I am prioritizing this call to the Legal Network immediately. Hyriah, our Legal Triage Agent, is connecting you to a live attorney. Please stay on the line.");
      twiml.dial('+18005550000');

    } else if (userSpeech.includes('support') || userSpeech.includes('help') || userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent')) {
      // 5. Support / Human Operator
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I understand. Please hold while I connect you with the next available human agent.");
      const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
      const client = dial.client({ 
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], 
        statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', 
        statusCallbackMethod: 'POST' 
      }, 'GGMA_User');
      client.parameter({ name: 'DepartmentContext', value: 'Human Operator Transfer' });

    } else {
      // Fallback
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I'm sorry, I didn't quite catch that. You can say 'Sales', 'Patient', 'Business', or 'Operator'.");
      twiml.redirect('/api/twilio/voice');
    }

  } else {
    // ==========================================
    // INITIAL GREETING LOGIC
    // ==========================================
    const gather = twiml.gather({
      input: ['speech'],
      action: '/api/twilio/voice?action=respond',
      timeout: 4,
      speechTimeout: 'auto',
      language: 'en-US'
    });

    gather.say(
      { voice: 'Polly.Joanna-Neural' },
      "Hello! Welcome to the Global Green Call Center. I am Sylara, your virtual intake agent. Are you calling for Patient Support, Business Licensing, or to speak with Sales?"
    );

    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "I didn't quite catch that. Please say Patient, Business, or Sales."
    );
    twiml.redirect('/api/twilio/voice');
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
}
