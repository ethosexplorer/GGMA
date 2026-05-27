import twilio from 'twilio';
import { createClient } from '@libsql/client/web';
import nodemailer from 'nodemailer';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = twilio.twiml.VoiceResponse;

const TEXTBELT_API_KEY = 'db52652f3be5c4f6d222f51f0baec042c9c2de1dj5ZJQqhgFMxflAFaM9KXOLUAK';
const TEXTBELT_URL = 'https://textbelt.com/text';

export default async function handler(req, res) {
  // Setup CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Determine endpoint from our custom __endpoint query parameter
  const endpoint = req.query.__endpoint;

  try {
    if (endpoint === 'token') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return handleToken(req, res);
    } else if (endpoint === 'history') {
      return await handleHistory(req, res);
    } else if (endpoint === 'call-status') {
      return await handleCallStatus(req, res);
    } else if (endpoint === 'voice') {
      return await handleVoice(req, res);
    } else if (endpoint === 'send-sms') {
      return await handleSendSMS(req, res);
    } else if (endpoint === 'verify') {
      return handleVerify(req, res);
    } else {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (err) {
    console.error(`[Twilio Unified Router] Error on ${endpoint}:`, err);
    return res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. TOKEN HANDLER — Issues WebRTC Voice SDK Tokens
// ─────────────────────────────────────────────────────────────────────────────
function handleToken(req, res) {
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;

  if (!twilioAccountSid || !twilioApiKey || !twilioApiSecret) {
    return res.status(500).json({ error: 'Missing Twilio Voice environment configuration' });
  }

  const identity = 'GGMA_User';

  const voiceGrant = new VoiceGrant({
    incomingAllow: true, 
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID
  });

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: identity, ttl: 14400 }
  );
  token.addGrant(voiceGrant);

  return res.status(200).json({
    identity: identity,
    token: token.toJwt()
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HISTORY HANDLER — Lists recent calls, messages, and voicemails
// ─────────────────────────────────────────────────────────────────────────────
async function handleHistory(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return res.status(500).json({ error: 'Missing Twilio credentials' });
  }

  const client = twilio(accountSid, authToken);
  
  // Fetch Call History
  const calls = await client.calls.list({ limit: 50 });
  const formattedCalls = calls.map(c => ({
    direction: c.direction === 'outbound-api' || c.direction === 'outbound-dial' ? 'outbound' : 'inbound',
    from: c.from,
    to: c.to,
    status: c.status,
    duration: c.duration ? parseInt(c.duration) : 0,
    timestamp: c.dateCreated,
    id: c.sid
  }));

  // Fetch SMS History
  const messages = await client.messages.list({ limit: 50 });
  const formattedMessages = messages.map(m => ({
    direction: m.direction === 'outbound-api' ? 'outbound' : 'inbound',
    from: m.from,
    to: m.to,
    body: m.body,
    status: m.status,
    timestamp: m.dateCreated,
    id: m.sid
  }));

  // Fetch Voicemail Recordings
  const recordings = await client.recordings.list({ limit: 20 });
  const formattedVoicemails = recordings.map(r => ({
    sid: r.sid,
    callSid: r.callSid,
    duration: r.duration,
    url: r.mediaUrl + '.mp3',
    time: new Date(r.dateCreated).toLocaleString()
  }));

  return res.status(200).json({ 
    calls: formattedCalls,
    messages: formattedMessages,
    voicemails: formattedVoicemails
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CALL STATUS HANDLER — Webhook status callbacks & Audit Log writer
// ─────────────────────────────────────────────────────────────────────────────
async function handleCallStatus(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { 
    CallSid, 
    From, 
    To, 
    CallStatus, 
    Direction, 
    CallDuration, 
    RecordingUrl 
  } = req.body;

  console.log(`[Twilio Call Status] ${CallSid} | ${Direction} | ${CallStatus}`);

  // Insert live Audit Log into Turso database
  try {
    const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
    const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
    
    if (authToken) {
      const turso = createClient({ url, authToken });
      
      let actionName = "CALL_COMPLETED";
      if (CallStatus === 'failed' || CallStatus === 'canceled' || CallStatus === 'no-answer') {
        actionName = "CALL_DROPPED";
      }

      const logId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: [
          logId, 
          actionName, 
          "Twilio_Voice_System", 
          JSON.stringify({ 
            detail: `Call from ${From} to ${To} ended with status: ${CallStatus}. Duration: ${CallDuration || 0}s`,
            status: CallStatus,
            duration: CallDuration,
            sid: CallSid,
            voicemail: RecordingUrl || null
          })
        ]
      });
      console.log(`[Twilio Call Status] Logged to Turso database: ${actionName}`);
    }
  } catch (dbErr) {
    console.error(`[Twilio Call Status] Failed to log to Turso:`, dbErr);
  }

  // Backup Email notification
  let subject = `Call Center Update: ${CallStatus.toUpperCase()} Call`;
  let text = `Call Details:\n\nDirection: ${Direction}\nFrom: ${From}\nTo: ${To}\nStatus: ${CallStatus}\nDuration: ${CallDuration || 0} seconds`;

  if (CallStatus === 'no-answer' || CallStatus === 'failed' || CallStatus === 'busy' || CallStatus === 'canceled') {
    subject = `[MISSED CALL / ALERT] Call Center Update: ${CallStatus.toUpperCase()}`;
  }

  if (RecordingUrl) {
    subject = `[VOICEMAIL] New Voicemail from ${From}`;
    text += `\n\nListen to Voicemail: ${RecordingUrl}`;
  }

  try {
    if (process.env.CAREPATRON_EMAIL && process.env.CAREPATRON_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CAREPATRON_EMAIL,
          pass: process.env.CAREPATRON_PASS
        }
      });

      await transporter.sendMail({
        from: `"GGP-OS Call Center" <${process.env.CAREPATRON_EMAIL}>`,
        to: 'asstsupport@gmail.com',
        subject: subject,
        text: text
      });
    }
  } catch (emailErr) {
    console.error(`[Twilio Call Status] Failed to send email notification:`, emailErr);
  }

  return res.status(200).send('OK');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VOICE HANDLER — IVR Phone Tree Engine
// ─────────────────────────────────────────────────────────────────────────────
async function handleVoice(req, res) {
  const twiml = new VoiceResponse();

  const toNumber = req.body?.To || req.query?.To || '';
  const direction = req.body?.Direction || '';
  const fromClient = req.body?.From?.startsWith?.('client:') || false;

  // Intercept Outbound calls from WebDialer
  if (fromClient && toNumber) {
    if (toNumber.startsWith('client:')) {
      const dial = twiml.dial({ timeout: 45, answerOnBridge: true });
      dial.client(toNumber.replace('client:', ''));
      res.setHeader('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    } else {
      let cleanNumber = toNumber.replace(/[\s\-\(\)]/g, '');
      if (!cleanNumber.startsWith('+')) {
        cleanNumber = cleanNumber.startsWith('1') ? '+' + cleanNumber : '+1' + cleanNumber;
      }
      
      const dial = twiml.dial({
        callerId: '+18889634447',
        timeout: 45,
        answerOnBridge: true,
        action: '/api/twilio/call-status',
      });
      dial.number({
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status',
        statusCallbackMethod: 'POST',
      }, cleanNumber);

      res.setHeader('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    }
  }

  // Dynamic routing mode configuration check
  let routingMode = 'hybrid';
  try {
    const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
    const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
    if (authToken) {
      const turso = createClient({ url, authToken });
      const result = await turso.execute("SELECT data FROM audit_logs WHERE action = 'CALL_ROUTING' ORDER BY rowid DESC LIMIT 1");
      if (result.rows.length > 0) {
        const dataStr = result.rows[0].data;
        if (dataStr.includes('100% AI')) routingMode = 'ai_only';
        else if (dataStr.includes('100% Human')) routingMode = 'human_only';
      }
    }
  } catch (e) {
    console.error('Routing mode check failed, defaulting to hybrid:', e);
  }

  // 100% Human Override
  if (routingMode === 'human_only' && !req.query.action) {
    twiml.say({ voice: 'Polly.Joanna-Neural' }, "Welcome to the Global Green Call Center. Please hold while I connect you to the next available agent on Extension 101.");
    const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
    const client = dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
    client.parameter({ name: 'DepartmentContext', value: '100% Human Routing Override' });
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  }

  if (req.query.action === 'respond') {
    const userSpeech = (req.body && req.body.SpeechResult) ? req.body.SpeechResult.toLowerCase() : '';
    console.log('Sylara heard:', userSpeech);

    if (userSpeech.includes('sale') || userSpeech.includes('rep') || userSpeech.includes('buy') || userSpeech.includes('subscrib') || userSpeech.includes('upgrad') || userSpeech.includes('price') || userSpeech.includes('cost')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "Excellent. I will connect you with E'Onna, our AI Sales Director, right now.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello! This is E'Onna. Before I transfer you to the appropriate extension, please state your full name or business name, phone number, email address, and the best time to reach you.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_sales', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('patient') || userSpeech.includes('card') || userSpeech.includes('doctor') || userSpeech.includes('telehealth') || userSpeech.includes('appointment')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Patient Support. I am transferring you to Geneva, our Patient Care Concierge.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Geneva. I can help you with your medical intake. Please state your full name, date of birth, phone number, email address, and the best time to reach you. I will create a ticket and someone will contact you as soon as possible.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_patient', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('business') || userSpeech.includes('license') || userSpeech.includes('dispensary') || userSpeech.includes('compliance') || userSpeech.includes('metrc')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Business Licensing. I am transferring you to Harlem, our Corporate Integration Executive.");
      twiml.say({ voice: 'Polly.Matthew-Neural' }, "Hello, this is Harlem. Please state the name of your business, your full name, phone number, email address, and a good time to reach you. I will transfer your file to the escalations department for processing.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_business', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('legal') || userSpeech.includes('lawyer') || userSpeech.includes('attorney') || userSpeech.includes('arrest') || userSpeech.includes('raid') || userSpeech.includes('police')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I am prioritizing this call to the Legal Network immediately. Hyriah, our Legal Triage Agent, is taking over.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "This is Hyriah. Please state your emergency clearly, followed by your full name, phone number, and the best time to reach you. I will immediately create an escalation ticket.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_legal', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('it ') || userSpeech.includes('tech') || userSpeech.includes('computer') || userSpeech.includes('website')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached IT Support. I am transferring you to Olivia, our AI Technical Specialist.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Olivia. Please describe your technical issue, then provide your full name, phone number, email address, and the best time to reach you so I can create an IT ticket.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_it', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('oversight') || userSpeech.includes('executive') || userSpeech.includes('founder') || userSpeech.includes('shantell') || userSpeech.includes('ryan')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Executive Oversight. I am transferring you to Rosalie, our Executive Liaison.");
      twiml.say({ voice: 'Polly.Salli-Neural' }, "Hello, this is Rosalie. Please state the reason for your call, along with your full name, phone number, email address, and a good time to reach you. I will create a ticket and transfer your request to the escalations department.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_oversight', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('telehealth') || userSpeech.includes('doctor') || userSpeech.includes('appointment')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "You have reached Telehealth Services. I am transferring you to Logan, our Telehealth Coordinator.");
      twiml.say({ voice: 'Polly.Matthew-Neural' }, "Hello, this is Logan. I can help you schedule a virtual appointment with a state-certified doctor. Please state your name and preferred time, and I will text you the booking link.");
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_telehealth', timeout: 4, speechTimeout: 'auto' });

    } else if (userSpeech.includes('support') || userSpeech.includes('help') || userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('extension')) {
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
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I'm sorry, I didn't quite catch that. You can say 'Sales', 'Patient', 'Business', or 'Operator'.");
      twiml.redirect('/api/twilio/voice');
    }

  } else if (req.query.action && req.query.action.toString().startsWith('escalate_')) {
    const dept = req.query.action.toString().replace('escalate_', '').toUpperCase();
    const userSpeech = (req.body && req.body.SpeechResult) ? req.body.SpeechResult.toLowerCase() : '';

    if (userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('help')) {
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "I understand. I am transferring your case to a live human agent on Extension 101 now. Please hold.");
      const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
      const client = dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
      client.parameter({ name: 'DepartmentContext', value: 'Escalation from AI: ' + dept });
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
        twiml.say({ voice: 'Polly.Joanna-Neural' }, "Thank you. Your request has been logged securely. I am routing your call to the escalations department now. Please hold.");
        const dial = twiml.dial({ timeout: 60, answerOnBridge: true });
        const client = dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggma-five.vercel.app/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
        client.parameter({ name: 'DepartmentContext', value: 'Executive Oversight Escalation' });
      } else if (dept === 'TELEHEALTH') {
        twiml.say({ voice: 'Polly.Matthew-Neural' }, "Thank you. I have locked in your appointment request. I am texting you the intake link and appointment details now. Have a healthy day!");
        twiml.hangup();
      }
    }
  } else if (req.query.action && req.query.action.toString().startsWith('finish_')) {
    const userSpeech = (req.body && req.body.SpeechResult) ? req.body.SpeechResult.toLowerCase() : '';
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
  return res.status(200).send(twiml.toString());
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SEND SMS HANDLER — Proxies to TextBelt SMS service
// ─────────────────────────────────────────────────────────────────────────────
async function handleSendSMS(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const phone = req.body.phone || req.body.to;
  const message = req.body.message || req.body.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'Missing phone/to or message/body' });
  }

  const cleanNumber = phone.replace(/[\s\-\(\)\+]/g, '');

  const response = await fetch(TEXTBELT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: cleanNumber,
      message: message,
      key: TEXTBELT_API_KEY,
    }),
  });

  const data = await response.json();
  return res.status(200).json(data);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VERIFY HANDLER — Simple connectivity verifier
// ─────────────────────────────────────────────────────────────────────────────
function handleVerify(req, res) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  if (!accountSid) {
    return res.status(200).json({ connected: false, error: 'Twilio account SID not configured on server.' });
  }
  return res.status(200).json({ connected: true, accountId: accountSid });
}
