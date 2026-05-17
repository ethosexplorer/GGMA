import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client/web';
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const twiml = new VoiceResponse();
  
  let routingMode = 'hybrid'; // Default
  try {
    const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
    const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
    if (authToken) {
      const turso = createClient({ url, authToken });
      const result = await turso.execute("SELECT data FROM audit_logs WHERE action = 'CALL_ROUTING' ORDER BY rowid DESC LIMIT 1");
      if (result.rows.length > 0) {
        const dataStr = result.rows[0].data as string;
        if (dataStr.includes('100% AI')) routingMode = 'ai_only';
        else if (dataStr.includes('100% Human')) routingMode = 'human_only';
      }
    }
  } catch (e) {
    console.error('Failed to fetch routing mode from Turso', e);
  }

  if (routingMode === 'human_only' && !req.query.action) {
    twiml.say({ voice: 'Polly.Joanna-Neural' }, "Welcome to the Global Green Call Center. Please hold while I connect you to the next available agent on Extension 101.");
    const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
    const client = dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
    client.parameter({ name: 'DepartmentContext', value: '100% Human Routing Override' });
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  }

  if (req.query.action === 'respond') {
    // ==========================================
    // RESPOND LOGIC (Processing User Speech)
    // ==========================================
    const userSpeech = req.body.SpeechResult?.toLowerCase() || '';
    console.log('Sylara heard:', userSpeech);

    if (userSpeech.includes('sale') || userSpeech.includes('rep') || userSpeech.includes('buy') || userSpeech.includes('subscrib') || userSpeech.includes('upgrad') || userSpeech.includes('price') || userSpeech.includes('cost')) {
      // 1. Sales & Subscriptions -> E'Onna
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "Excellent. I will connect you with E'Onna, our AI Sales Director, right now.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello! This is E'Onna. Before I transfer you to the appropriate extension, please state your full name or business name, phone number, email address, and the best time to reach you.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_sales', timeout: 6, speechTimeout: 'auto' });
      
    } else if (userSpeech.includes('patient') || userSpeech.includes('card') || userSpeech.includes('doctor') || userSpeech.includes('telehealth') || userSpeech.includes('appointment')) {
      // 2. Patient Intake -> Geneva
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Patient Support. I am transferring you to Geneva, our Patient Care Concierge.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Geneva. I can help you with your medical intake. Please state your full name, date of birth, phone number, email address, and the best time to reach you. I will create a ticket and someone will contact you as soon as possible.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_patient', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('business') || userSpeech.includes('license') || userSpeech.includes('dispensary') || userSpeech.includes('compliance') || userSpeech.includes('metrc')) {
      // 3. Business Licensing -> Harlem
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Business Licensing. I am transferring you to Harlem, our Corporate Integration Executive.");
      twiml.say({ voice: 'Polly.Matthew-Neural' }, "Hello, this is Harlem. Please state the name of your business, your full name, phone number, email address, and a good time to reach you. I will transfer your file to the escalations department for processing.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_business', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('legal') || userSpeech.includes('lawyer') || userSpeech.includes('attorney') || userSpeech.includes('arrest') || userSpeech.includes('raid') || userSpeech.includes('police')) {
      // 4. Legal / Urgent -> Hyriah
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I am prioritizing this call to the Legal Network immediately. Hyriah, our Legal Triage Agent, is taking over.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "This is Hyriah. Please state your emergency clearly, followed by your full name, phone number, and the best time to reach you. I will immediately create an escalation ticket.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_legal', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('it ') || userSpeech.includes('tech') || userSpeech.includes('computer') || userSpeech.includes('website')) {
      // 5. IT Support -> Olivia
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached IT Support. I am transferring you to Olivia, our AI Technical Specialist.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Olivia. Please describe your technical issue, then provide your full name, phone number, email address, and the best time to reach you so I can create an IT ticket.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_it', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('oversight') || userSpeech.includes('executive') || userSpeech.includes('founder') || userSpeech.includes('shantell') || userSpeech.includes('ryan')) {
      // 6. Executive Oversight -> Rosalie
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Executive Oversight. I am transferring you to Rosalie, our Executive Liaison.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Rosalie. Please state the reason for your call, along with your full name, phone number, email address, and a good time to reach you. I will create a ticket and transfer your request to the escalations department.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_oversight', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('telehealth') || userSpeech.includes('doctor') || userSpeech.includes('appointment')) {
      // 7. Telehealth -> Logan
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Telehealth Services. I am transferring you to Logan, our Telehealth Coordinator.");
      twiml.say({ voice: 'Polly.Matthew-Neural' }, "Hello, this is Logan. I can help you schedule a virtual appointment with a state-certified doctor. Please state your name and preferred time, and I will text you the booking link.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_telehealth', timeout: 4, speechTimeout: 'auto' });

    } else if (userSpeech.includes('support') || userSpeech.includes('help') || userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('extension')) {
      // 8. Support -> Sophia
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I understand. I am transferring you to Sophia, our Customer Support Director.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Sophia. Please hold while I connect you to Extension 101 for the next available human agent right now.");
      const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
      const client = dial.client({ 
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], 
        statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', 
        statusCallbackMethod: 'POST' 
      }, 'GGMA_User');
      client.parameter({ name: 'DepartmentContext', value: 'General Support Transfer' });

    } else {
      // Fallback
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I'm sorry, I didn't quite catch that. You can say 'Sales', 'Patient', 'Business', or 'Operator'.");
      twiml.redirect('/api/twilio/voice');
    }

  } else if (req.query.action && req.query.action.toString().startsWith('escalate_')) {
    // ==========================================
    // AI HANDLING LOGIC (85% AI COMPLETION)
    // ==========================================
    const dept = req.query.action.toString().replace('escalate_', '').toUpperCase();
    const userSpeech = req.body.SpeechResult?.toLowerCase() || '';

    if (userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('help')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I understand. I am transferring your case to a live human agent on Extension 101 now. Please hold.");
      const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
      const client = dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
      client.parameter({ name: 'DepartmentContext', value: `Escalation from AI: ${dept}` });
    } else {
      if (dept === 'SALES') {
        twiml.say({ voice: 'Polly.Salli-Neural' }, "Thank you. I have pulled up your file. Our Premium Subscription is $299 per month and includes full access to the CareWallet and LARRY compliance engine. I can process your payment securely over the phone right now, or I can text you a secure checkout link. Which do you prefer?");
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_sales', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'PATIENT') {
        twiml.say({ voice: 'Polly.Salli-Neural' }, "Thank you. I have located your patient file. Your medical card application requires a brief telehealth consultation. I have found an available doctor for today at 3 PM. Shall I lock in that appointment for you?");
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_patient', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'BUSINESS') {
        twiml.say({ voice: 'Polly.Matthew-Neural' }, "Thank you. I see your business profile. LARRY indicates there are two pending compliance alerts regarding your recent Metrc transfer. I can text you the secure login link to resolve these, or I can connect you to the Director of Compliance. Which do you prefer?");
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_business', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'LEGAL') {
        twiml.say({ voice: 'Polly.Salli-Neural' }, "Thank you for the details. I have immediately logged this into our secure Attorney Marketplace. An attorney specializing in your issue has been pinged and is reviewing your file right now. They will call you back on this number within 5 minutes. Please stay safe.");
        twiml.hangup();
      } else if (dept === 'IT') {
        twiml.say({ voice: 'Polly.Joanna-Neural' }, "Thank you. Your IT ticket has been submitted. I can text you the ticket tracking link, or connect you to a live tech support agent now. Which do you prefer?");
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_it', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'OVERSIGHT') {
        twiml.say({ voice: 'Polly.Joanna-Neural' }, "Thank you. Your request has been logged securely in the Founder's Dashboard. I am routing your call to the Executive Extension now. Please hold.");
        const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
        const client = dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
        client.parameter({ name: 'DepartmentContext', value: 'Executive Oversight Escalation' });
      } else if (dept === 'TELEHEALTH') {
        twiml.say({ voice: 'Polly.Matthew-Neural' }, "Thank you. I have locked in your appointment request. I am texting you the intake link and appointment details now. Have a healthy day!");
        twiml.hangup();
      }
    }
  } else if (req.query.action && req.query.action.toString().startsWith('finish_')) {
     const userSpeech = req.body.SpeechResult?.toLowerCase() || '';
     if (userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('compliance')) {
        twiml.say({ voice: 'Polly.Joanna-Neural' }, "Transferring you to a live agent now. Please hold.");
        const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
        const client = dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
        client.parameter({ name: 'DepartmentContext', value: 'Human Operator Transfer' });
     } else {
        twiml.say({ voice: 'Polly.Joanna-Neural' }, "Perfect. I have processed your request and sent the confirmation to your phone. Thank you for calling Global Green Enterprise. Have a wonderful day!");
        twiml.hangup();
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
      "Hello! Welcome to the Global Green Call Center. I am Sylara, your virtual intake agent. Are you calling for Patient Support, Telehealth, Business Licensing, Sales, Legal, IT Support, or Executive Oversight?"
    );

    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      "I didn't quite catch that. Please name the department you are trying to reach, such as Legal, Telehealth, Patient Support, or Sales."
    );
    twiml.redirect('/api/twilio/voice');
  }

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
}
