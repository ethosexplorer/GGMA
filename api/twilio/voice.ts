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
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "Excellent. I will connect you with E'Onna, our AI Sales Director, right now.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello! This is E'Onna. Before I transfer you to the CEO's extension, please tell me the name of your business and what state you are calling from.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_sales', timeout: 4, speechTimeout: 'auto' });
      
    } else if (userSpeech.includes('patient') || userSpeech.includes('card') || userSpeech.includes('doctor') || userSpeech.includes('telehealth') || userSpeech.includes('appointment')) {
      // 2. Patient Intake -> Geneva
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Patient Support. I am transferring you to Geneva, our Patient Care Concierge.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Geneva. I can help you with your medical intake. Please state your full name and date of birth, and I will create an escalation ticket and transfer you to the Founder's extension.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_patient', timeout: 4, speechTimeout: 'auto' });

    } else if (userSpeech.includes('business') || userSpeech.includes('license') || userSpeech.includes('dispensary') || userSpeech.includes('compliance') || userSpeech.includes('metrc')) {
      // 3. Business Licensing -> Harlem
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Business Licensing. I am transferring you to Harlem, our Corporate Integration Executive.");
      twiml.say({ voice: 'Polly.Matthew-Neural' }, "Hello, this is Harlem. Please briefly state your business type, for example, dispensary or grower, and I will transfer your file to the executive extension for processing.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_business', timeout: 4, speechTimeout: 'auto' });

    } else if (userSpeech.includes('legal') || userSpeech.includes('lawyer') || userSpeech.includes('attorney') || userSpeech.includes('arrest') || userSpeech.includes('raid') || userSpeech.includes('police')) {
      // 4. Legal / Urgent -> Hyriah
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I am prioritizing this call to the Legal Network immediately. Hyriah, our Legal Triage Agent, is taking over.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "This is Hyriah. Please state your emergency or legal issue clearly, and I will immediately create an escalation ticket and transfer you to the executive extension.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_legal', timeout: 4, speechTimeout: 'auto' });

    } else if (userSpeech.includes('support') || userSpeech.includes('help') || userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('extension')) {
      // 5. Support / Direct Extension Transfer
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I am transferring you to Extension 101 for the Founder and Senior Agent right now.");
      const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
      const client = dial.client({ 
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], 
        statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', 
        statusCallbackMethod: 'POST' 
      }, 'GGMA_User');
      client.parameter({ name: 'DepartmentContext', value: 'Support Transfer' });

    } else {
      // Fallback
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I'm sorry, I didn't quite catch that. You can say 'Sales', 'Patient', 'Business', or 'Operator'.");
      twiml.redirect('/api/twilio/voice');
    }

  } else if (req.query.action && req.query.action.toString().startsWith('escalate_')) {
    // ==========================================
    // ESCALATION / TRANSFER TO EXTENSION LOGIC
    // ==========================================
    const dept = req.query.action.toString().replace('escalate_', '').toUpperCase();
    twiml.say({ voice: 'Polly.Joanna-Neural' }, "Thank you. Your intake information has been recorded and an escalation ticket has been created. Transferring to the Founder's extension, Extension 101, now.");
    
    // Ring the WebDialer on the Dashboard (EXT 101)
    const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
    const client = dial.client({ 
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], 
      statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', 
      statusCallbackMethod: 'POST' 
    }, 'GGMA_User'); // GGMA_User acts as the universal WebDialer endpoint for now
    client.parameter({ name: 'DepartmentContext', value: `Intake Complete: ${dept}` });

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
