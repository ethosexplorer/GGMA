import twilio from 'twilio';
import { createClient } from '@libsql/client/web';
import nodemailer from 'nodemailer';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = twilio.twiml.VoiceResponse;

const TEXTBELT_API_KEY = process.env.TEXTBELT_API_KEY || '';
const TEXTBELT_URL = 'https://textbelt.com/text';
const SENDBLUE_API = 'https://api.sendblue.co/api';

function getSendBlueCredentials() {
  const apiKey = process.env.SENDBLUE_API_KEY || process.env.VITE_SENDBLUE_API_KEY || '';
  const apiSecret = process.env.SENDBLUE_API_SECRET || process.env.VITE_SENDBLUE_API_SECRET || '';
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const MODEL_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent';

// Helper to log speech turns to Turso database
async function logCallSpeech(callSid, role, text, department = null) {
  if (!callSid) return;
  try {
    const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
    const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
    if (authToken) {
      const turso = createClient({ url, authToken });
      const logId = `speech-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: [
          logId,
          "CALL_SPEECH",
          callSid,
          JSON.stringify({
            role,
            text,
            department,
            timestamp: new Date().toISOString()
          })
        ]
      });
    }
  } catch (err) {
    console.error(`[Twilio Log Speech Error]:`, err);
  }
}

// Helper to generate AI summary from transcript
async function generateCallSummary(transcriptText) {
  if (!GEMINI_API_KEY) {
    console.warn("Live Gemini API key missing, could not auto-generate AI summary.");
    return "AI Summary unavailable (Gemini key not configured).";
  }
  try {
    const response = await fetch(`${MODEL_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "You are Sylara, the virtual call assistant for Global Green. Review this transcript of a customer phone call and write a concise, professional summary (2-3 sentences max) highlighting: the caller's main request, the department it was routed to, and the final outcome or next steps."
          }]
        },
        contents: [
          { role: 'user', parts: [{ text: `Here is the call transcript:\n\n${transcriptText}` }] }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300
        }
      })
    });
    if (response.ok) {
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Summary returned empty.";
    }
    const err = await response.json();
    console.error('[Gemini Summary API Error]:', err);
    return "Failed to generate AI summary.";
  } catch (err) {
    console.error('[Gemini Summary Exception]:', err);
    return "Failed to generate AI summary.";
  }
}

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
    } else if (endpoint === 'recording') {
      return await handleRecording(req, res);
    } else if (endpoint === 'send-imessage') {
      return await handleSendIMessage(req, res);
    } else if (endpoint === 'imessage-webhook') {
      return await handleIMessageWebhook(req, res);
    } else if (endpoint === 'imessage-inbox') {
      return await handleIMessageInbox(req, res);
    } else if (endpoint === 'imessage-status') {
      return handleIMessageStatus(req, res);
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

  // Fetch Voicemail Recordings — INBOUND ONLY
  const recordings = await client.recordings.list({ limit: 30 });
  
  // Build a Set of outbound call SIDs so we can exclude them
  const outboundCallSids = new Set(
    calls
      .filter(c => c.direction === 'outbound-api' || c.direction === 'outbound-dial')
      .map(c => c.sid)
  );
  
  const formattedVoicemails = recordings
    .filter(r => !outboundCallSids.has(r.callSid)) // Exclude outbound call recordings
    .map(r => ({
      sid: r.sid,
      callSid: r.callSid,
      duration: r.duration,
      url: `/api/twilio/recording?sid=${r.sid}`,
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

  // Insert live Audit Log into Turso database and generate summary if completed
  let aiSummaryText = '';
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

      // If call completed, fetch transcript and generate summary
      if (CallStatus === 'completed') {
        const speechRes = await turso.execute({
          sql: "SELECT data FROM audit_logs WHERE action = 'CALL_SPEECH' AND user_id = ? ORDER BY rowid ASC",
          args: [CallSid]
        });

        const transcript = [];
        let department = 'GENERAL';

        speechRes.rows.forEach(r => {
          try {
            const item = JSON.parse(r.data);
            transcript.push({
              role: item.role === 'sylara' ? 'Sylara (AI)' : 'Caller',
              text: item.text
            });
            if (item.department) {
              department = item.department;
            }
          } catch (e) {}
        });

        if (transcript.length > 0) {
          const transcriptText = transcript.map(t => `${t.role}: ${t.text}`).join('\n');
          aiSummaryText = await generateCallSummary(transcriptText);

          // Log CALL_SUMMARY record to audit_logs
          await turso.execute({
            sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
            args: [
              `summary-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              "CALL_SUMMARY",
              CallSid,
              JSON.stringify({
                from: From,
                to: To,
                timestamp: new Date().toISOString(),
                transcript,
                summary: aiSummaryText,
                department,
                duration: CallDuration,
                recordingUrl: RecordingUrl || null
              })
            ]
          });
          console.log(`[Twilio Call Status] AI Call Summary logged successfully for department: ${department}`);
        }
      }
    }
  } catch (dbErr) {
    console.error(`[Twilio Call Status] Failed to log to Turso / generate summary:`, dbErr);
  }

  // Backup Email notification
  let subject = `Call Center Update: ${CallStatus.toUpperCase()} Call`;
  let text = `Call Details:\n\nDirection: ${Direction}\nFrom: ${From}\nTo: ${To}\nStatus: ${CallStatus}\nDuration: ${CallDuration || 0} seconds`;

  if (aiSummaryText) {
    subject = `[AI SUMMARY] Call from ${From} (${CallStatus.toUpperCase()})`;
    text += `\n\nAI CALL SUMMARY:\n${aiSummaryText}`;
  }

  if (CallStatus === 'no-answer' || CallStatus === 'failed' || CallStatus === 'busy' || CallStatus === 'canceled') {
    if (!aiSummaryText) {
      subject = `[MISSED CALL / ALERT] Call Center Update: ${CallStatus.toUpperCase()}`;
    }
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

  const toNumber = 
    req.body?.['params[To]'] || 
    req.query?.['params[To]'] || 
    req.body?.['params[dialNumber]'] || 
    req.query?.['params[dialNumber]'] || 
    req.body?.dialNumber || 
    req.query?.dialNumber || 
    (req.body?.To && !req.body.To.startsWith('AP') ? req.body.To : '') || 
    (req.query?.To && !req.query.To.startsWith('AP') ? req.query.To : '') || 
    '';
  const direction = req.body?.Direction || req.query?.Direction || '';
  const from = req.body?.From || req.query?.From || '';
  const fromClient = from.startsWith('client:');
  const callSid = req.body?.CallSid || req.query?.CallSid || '';

  // Log incoming parameters for debugging voice routing loop
  try {
    const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
    const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
    if (authToken) {
      const turso = createClient({ url, authToken });
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: [
          `voice-debug-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          "DEBUG_VOICE_REQUEST",
          callSid || "unknown_call",
          JSON.stringify({
            toNumber,
            direction,
            fromClient,
            From: req.body?.From || req.query?.From || '',
            To: req.body?.To || req.query?.To || '',
            body: req.body || {},
            query: req.query || {},
          })
        ]
      });
    }
  } catch (dbErr) {
    console.error("Failed to log DEBUG_VOICE_REQUEST:", dbErr);
  }

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
      });
      dial.number({
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallback: 'https://ggp-os.com/api/twilio/call-status',
        statusCallbackMethod: 'POST',
      }, cleanNumber);

      res.setHeader('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    }
  }

  // Handle voicemail completion
  if (req.query.action === 'voicemail-completed') {
    const speechMsg = "Thank you for leaving a message. Goodbye.";
    twiml.say({ voice: 'Polly.Joanna-Neural' }, speechMsg);
    twiml.hangup();
    
    if (callSid) {
      await logCallSpeech(callSid, 'sylara', speechMsg, 'VOICEMAIL');
      const recordingUrl = req.body?.RecordingUrl || req.query?.RecordingUrl || '';
      if (recordingUrl) {
        await logCallSpeech(callSid, 'user', `[Left a voicemail recording: ${recordingUrl}]`, 'VOICEMAIL');
      }
    }
    
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
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
    const speechMsg = "Welcome to the Global Green Call Center. Please hold while I connect you to the next available agent on Extension 101.";
    twiml.say({ voice: 'Polly.Joanna-Neural' }, speechMsg);
    
    if (callSid) {
      await logCallSpeech(callSid, 'sylara', speechMsg, 'HUMAN_OVERRIDE');
    }

    const dial = twiml.dial({ timeout: 20, answerOnBridge: true });
    dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggp-os.com/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
    
    twiml.say({ voice: 'Polly.Joanna-Neural' }, "The agent is currently unavailable. Please leave a message after the tone.");
    twiml.record({
      action: '/api/twilio/voice?action=voicemail-completed',
      maxLength: 60,
      playBeep: true
    });
    
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  }

  if (req.query.action === 'respond') {
    const speechResult = req.body?.SpeechResult || req.query?.SpeechResult || '';
    const userSpeech = speechResult.toLowerCase();
    console.log('Sylara heard:', userSpeech);

    if (callSid && userSpeech) {
      await logCallSpeech(callSid, 'user', speechResult, 'GENERAL');
    }

    if (userSpeech.includes('sale') || userSpeech.includes('rep') || userSpeech.includes('buy') || userSpeech.includes('subscrib') || userSpeech.includes('upgrad') || userSpeech.includes('price') || userSpeech.includes('cost')) {
      const msg1 = "Excellent. I will connect you with E'Onna, our AI Sales Director, right now.";
      const msg2 = "Hello! This is E'Onna. Before I transfer you to the appropriate extension, please state your full name or business name, phone number, email address, and the best time to reach you.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Salli-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'SALES');
      }
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_sales', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('patient') || userSpeech.includes('card') || userSpeech.includes('doctor') || userSpeech.includes('telehealth') || userSpeech.includes('appointment')) {
      const msg1 = "You have reached Patient Support. I am transferring you to Geneva, our Patient Care Concierge.";
      const msg2 = "Hello, this is Geneva. I can help you with your medical intake. Please state your full name, date of birth, phone number, email address, and the best time to reach you. I will create a ticket and someone will contact you as soon as possible.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Salli-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'PATIENT');
      }
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_patient', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('business') || userSpeech.includes('license') || userSpeech.includes('dispensary') || userSpeech.includes('compliance') || userSpeech.includes('metrc')) {
      const msg1 = "You have reached Business Licensing. I am transferring you to Harlem, our Corporate Integration Executive.";
      const msg2 = "Hello, this is Harlem. Please state the name of your business, your full name, phone number, email address, and a good time to reach you. I will transfer your file to the escalations department for processing.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Matthew-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'BUSINESS');
      }
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_business', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('legal') || userSpeech.includes('lawyer') || userSpeech.includes('attorney') || userSpeech.includes('arrest') || userSpeech.includes('raid') || userSpeech.includes('police')) {
      const msg1 = "I am prioritizing this call to the Legal Network immediately. Hyriah, our Legal Triage Agent, is taking over.";
      const msg2 = "This is Hyriah. Please state your emergency clearly, followed by your full name, phone number, and the best time to reach you. I will immediately create an escalation ticket.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Salli-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'LEGAL');
      }
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_legal', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('it ') || userSpeech.includes('tech') || userSpeech.includes('computer') || userSpeech.includes('website')) {
      const msg1 = "You have reached IT Support. I am transferring you to Olivia, our AI Technical Specialist.";
      const msg2 = "Hello, this is Olivia. Please describe your technical issue, then provide your full name, phone number, email address, and the best time to reach you so I can create an IT ticket.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Salli-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'TECH');
      }
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_it', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('oversight') || userSpeech.includes('executive') || userSpeech.includes('founder') || userSpeech.includes('shantell') || userSpeech.includes('ryan')) {
      const msg1 = "You have reached Executive Oversight. I am transferring you to Rosalie, our Executive Liaison.";
      const msg2 = "Hello, this is Rosalie. Please state the reason for your call, along with your full name, phone number, email address, and a good time to reach you. I will create a ticket and transfer your request to the escalations department.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Salli-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'OVERSIGHT');
      }
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_oversight', timeout: 6, speechTimeout: 'auto' });

    } else if (userSpeech.includes('telehealth') || userSpeech.includes('doctor') || userSpeech.includes('appointment')) {
      const msg1 = "You have reached Telehealth Services. I am transferring you to Logan, our Telehealth Coordinator.";
      const msg2 = "Hello, this is Logan. I can help you schedule a virtual appointment with a state-certified doctor. Please state your name and preferred time, and I will text you the booking link.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Matthew-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'TELEHEALTH');
      }
      twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=escalate_telehealth', timeout: 4, speechTimeout: 'auto' });

    } else if (userSpeech.includes('support') || userSpeech.includes('help') || userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('extension')) {
      const msg1 = "I understand. I am transferring you to Sophia, our Customer Support Director.";
      const msg2 = "Hello, this is Sophia. Please hold while I connect you to Extension 101 for the next available human agent right now.";
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg1);
      twiml.say({ voice: 'Polly.Salli-Neural' }, msg2);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg1 + " " + msg2, 'SUPPORT');
      }
      
      const dial = twiml.dial({ timeout: 20, answerOnBridge: true });
      dial.client({
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallback: 'https://ggp-os.com/api/twilio/call-status',
        statusCallbackMethod: 'POST'
      }, 'GGMA_User');
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "The agent is currently unavailable. Please leave a message after the tone.");
      twiml.record({
        action: '/api/twilio/voice?action=voicemail-completed',
        maxLength: 60,
        playBeep: true
      });

    } else {
      const msg = "I'm sorry, I didn't quite catch that. You can say 'Sales', 'Patient', 'Business', or 'Operator'.";
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg, 'GENERAL');
      }
      twiml.redirect('/api/twilio/voice');
    }

  } else if (req.query.action && req.query.action.toString().startsWith('escalate_')) {
    const dept = req.query.action.toString().replace('escalate_', '').toUpperCase();
    const speechResult = req.body?.SpeechResult || req.query?.SpeechResult || '';
    const userSpeech = speechResult.toLowerCase();

    if (callSid && userSpeech) {
      await logCallSpeech(callSid, 'user', speechResult, dept);
    }

    if (userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('help')) {
      const msg = "I understand. I am transferring your case to a live human agent on Extension 101 now. Please hold.";
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg, dept);
      }
      
      const dial = twiml.dial({ timeout: 20, answerOnBridge: true });
      dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggp-os.com/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "The agent is currently unavailable. Please leave a message after the tone.");
      twiml.record({
        action: '/api/twilio/voice?action=voicemail-completed',
        maxLength: 60,
        playBeep: true
      });
    } else {
      if (dept === 'SALES') {
        const msg = "Thank you. I have pulled up your file. Our Premium Subscription is $299 per month and includes full access to the CareWallet and LARRY compliance engine. I can process your payment securely over the phone right now, or I can text you a secure checkout link. Which do you prefer?";
        twiml.say({ voice: 'Polly.Salli-Neural' }, msg);
        if (callSid) {
          await logCallSpeech(callSid, 'sylara', msg, 'SALES');
        }
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_sales', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'PATIENT') {
        const msg = "Thank you. I have located your patient file. Your medical card application requires a brief telehealth consultation. I have found an available doctor for today at 3 PM. Shall I lock in that appointment for you?";
        twiml.say({ voice: 'Polly.Salli-Neural' }, msg);
        if (callSid) {
          await logCallSpeech(callSid, 'sylara', msg, 'PATIENT');
        }
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_patient', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'BUSINESS') {
        const msg = "Thank you. I see your business profile. LARRY indicates there are two pending compliance alerts regarding your recent Metrc transfer. I can text you the secure login link to resolve these, or I can connect you to the Director of Compliance. Which do you prefer?";
        twiml.say({ voice: 'Polly.Matthew-Neural' }, msg);
        if (callSid) {
          await logCallSpeech(callSid, 'sylara', msg, 'BUSINESS');
        }
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_business', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'LEGAL') {
        const msg = "Thank you for the details. I have immediately logged this into our secure Attorney Marketplace. An attorney specializing in your issue has been pinged and is reviewing your file right now. They will call you back on this number within 5 minutes. Please stay safe.";
        twiml.say({ voice: 'Polly.Salli-Neural' }, msg);
        if (callSid) {
          await logCallSpeech(callSid, 'sylara', msg, 'LEGAL');
        }
        twiml.hangup();
      } else if (dept === 'IT') {
        const msg = "Thank you. Your IT ticket has been submitted. I can text you the ticket tracking link, or connect you to a live tech support agent now. Which do you prefer?";
        twiml.say({ voice: 'Polly.Joanna-Neural' }, msg);
        if (callSid) {
          await logCallSpeech(callSid, 'sylara', msg, 'TECH');
        }
        twiml.gather({ input: ['speech'], action: '/api/twilio/voice?action=finish_it', timeout: 5, speechTimeout: 'auto' });
      } else if (dept === 'OVERSIGHT') {
        const msg = "Thank you. Your request has been logged securely. I am routing your call to the escalations department now. Please hold.";
        twiml.say({ voice: 'Polly.Joanna-Neural' }, msg);
        if (callSid) {
          await logCallSpeech(callSid, 'sylara', msg, 'OVERSIGHT');
        }
        const dial = twiml.dial({ timeout: 20, answerOnBridge: true });
        dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggp-os.com/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
        twiml.say({ voice: 'Polly.Joanna-Neural' }, "The agent is currently unavailable. Please leave a message after the tone.");
        twiml.record({
          action: '/api/twilio/voice?action=voicemail-completed',
          maxLength: 60,
          playBeep: true
        });
      } else if (dept === 'TELEHEALTH') {
        const msg = "Thank you. I have locked in your appointment request. I am texting you the intake link and appointment details now. Have a healthy day!";
        twiml.say({ voice: 'Polly.Matthew-Neural' }, msg);
        if (callSid) {
          await logCallSpeech(callSid, 'sylara', msg, 'TELEHEALTH');
        }
        twiml.hangup();
      }
    }
  } else if (req.query.action && req.query.action.toString().startsWith('finish_')) {
    const speechResult = req.body?.SpeechResult || req.query?.SpeechResult || '';
    const userSpeech = speechResult.toLowerCase();
    const dept = req.query.action.toString().replace('finish_', '').toUpperCase();

    if (callSid && userSpeech) {
      await logCallSpeech(callSid, 'user', speechResult, dept);
    }

    if (userSpeech.includes('human') || userSpeech.includes('operator') || userSpeech.includes('agent') || userSpeech.includes('compliance')) {
      const msg = "Transferring you to a live agent now. Please hold.";
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg, dept);
      }
      
      const dial = twiml.dial({ timeout: 20, answerOnBridge: true });
      dial.client({ statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], statusCallback: 'https://ggp-os.com/api/twilio/call-status', statusCallbackMethod: 'POST' }, 'GGMA_User');
      
      twiml.say({ voice: 'Polly.Joanna-Neural' }, "The agent is currently unavailable. Please leave a message after the tone.");
      twiml.record({
        action: '/api/twilio/voice?action=voicemail-completed',
        maxLength: 60,
        playBeep: true
      });
    } else {
      const msg = "Perfect. I have processed your request and sent the confirmation to your phone. Thank you for calling Global Green Enterprise. Have a wonderful day!";
      twiml.say({ voice: 'Polly.Joanna-Neural' }, msg);
      
      if (callSid) {
        await logCallSpeech(callSid, 'sylara', msg, dept);
      }
      twiml.hangup();
    }
  } else {
    const speechMsg = "Hello! Welcome to the Global Green Call Center. I am Sylara, your virtual intake agent. Are you calling for Patient Support, Telehealth, Business Licensing, Sales, Legal, IT Support, or Executive Oversight?";
    const fallbackMsg = "I didn't quite catch that. Please name the department you are trying to reach, such as Legal, Telehealth, Patient Support, or Sales.";
    
    if (callSid) {
      await logCallSpeech(callSid, 'sylara', speechMsg, 'GENERAL');
    }

    const gather = twiml.gather({
      input: ['speech'],
      action: '/api/twilio/voice?action=respond',
      timeout: 4,
      speechTimeout: 'auto',
      language: 'en-US'
    });

    gather.say(
      { voice: 'Polly.Joanna-Neural' },
      speechMsg
    );

    twiml.say(
      { voice: 'Polly.Joanna-Neural' },
      fallbackMsg
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
  // GET request for quota check
  if (req.method === 'GET' && req.query.action === 'quota') {
    if (!TEXTBELT_API_KEY) return res.status(200).json({ quotaRemaining: -1, error: 'TEXTBELT_API_KEY not configured' });
    try {
      const qRes = await fetch(`https://textbelt.com/quota/${TEXTBELT_API_KEY}`);
      const qData = await qRes.json();
      return res.status(200).json(qData);
    } catch (e) {
      return res.status(500).json({ quotaRemaining: -1, error: e.message });
    }
  }

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

// ─────────────────────────────────────────────────────────────────────────────
// 7. RECORDING PROXY HANDLER — Streams Twilio recording files securely
// ─────────────────────────────────────────────────────────────────────────────
async function handleRecording(req, res) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const recordingSid = req.query.sid;

  if (!accountSid || !authToken) {
    return res.status(500).json({ error: 'Missing Twilio credentials' });
  }
  if (!recordingSid) {
    return res.status(400).json({ error: 'Missing recording sid' });
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recordingSid}.mp3`;
  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const response = await fetch(twilioUrl, {
      headers: {
        'Authorization': authHeader
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch recording from Twilio' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (err) {
    console.error('[Twilio Recording Proxy Error]:', err);
    return res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SENDBLUE iMESSAGE — Send outgoing iMessage/SMS from 645-246-8277
//    (getSendBlueCredentials is defined at file top-level)
// ─────────────────────────────────────────────────────────────────────────────
async function handleSendIMessage(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST required for sending messages' });
  }

  const creds = getSendBlueCredentials();
  if (!creds) {
    return res.status(503).json({ 
      success: false, 
      error: 'SendBlue credentials not configured. Add SENDBLUE_API_KEY and SENDBLUE_API_SECRET to environment variables.' 
    });
  }

  const { phone, message, mediaUrl, number, content } = req.body;
  const targetPhone = phone || number;
  const targetMessage = message || content;

  if (!targetPhone || !targetMessage) {
    return res.status(400).json({ success: false, error: 'Missing phone/number or message/content' });
  }

  let cleanNumber = targetPhone.replace(/[\s\-\(\)]/g, '');
  if (!cleanNumber.startsWith('+')) {
    cleanNumber = cleanNumber.startsWith('1') ? '+' + cleanNumber : '+1' + cleanNumber;
  }

  try {
    const response = await fetch(`${SENDBLUE_API}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sb-api-key-id': creds.apiKey,
        'sb-api-secret-key': creds.apiSecret,
      },
      body: JSON.stringify({
        number: cleanNumber,
        content: targetMessage,
        ...(mediaUrl ? { media_url: mediaUrl } : {}),
        from_number: '+16452468277',
      }),
    });

    const data = await response.json();

    if (response.ok && data.status !== 'ERROR') {
      console.log(`[SendBlue] ✅ Message sent to ${cleanNumber}`);

      // Log outgoing message to Turso
      try {
        const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
        const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
        if (authToken) {
          const turso = createClient({ url, authToken });
          await turso.execute({
            sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
            args: [
              `imsg-out-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              'IMESSAGE_SENT',
              cleanNumber,
              JSON.stringify({
                to: cleanNumber, from: '+16452468277', content: targetMessage,
                mediaUrl: mediaUrl || null, service: data.is_outbound !== false ? 'iMessage' : 'SMS',
                messageHandle: data.message_handle || null, status: data.status || 'QUEUED',
                timestamp: new Date().toISOString(),
              })
            ]
          });
        }
      } catch (logErr) { console.error('[SendBlue] Log error:', logErr); }

      return res.json({
        success: true, messageId: data.message_handle,
        status: data.status, service: data.is_outbound !== false ? 'iMessage' : 'SMS',
      });
    } else {
      console.error('[SendBlue] ❌ API Error:', data);
      return res.json({ success: false, error: data.error_message || data.message || 'SendBlue API Error', status: data.status });
    }
  } catch (err) {
    console.error('[SendBlue] Network error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. SENDBLUE WEBHOOK — Receive incoming iMessages to 645-246-8277
// ─────────────────────────────────────────────────────────────────────────────
async function handleIMessageWebhook(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { content, is_outbound, number, from_number, to_number, status,
            message_handle, date_sent, date_updated, was_downgraded, media_url, message_type } = req.body;

    console.log(`[SendBlue Webhook] ${is_outbound ? 'OUT' : 'IN'} | From: ${number || from_number} | "${(content || '').substring(0, 50)}"`);

    if (!is_outbound) {
      try {
        const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
        const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
        if (authToken) {
          const turso = createClient({ url, authToken });
          await turso.execute({
            sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
            args: [
              `imsg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              'IMESSAGE_RECEIVED',
              number || from_number || 'unknown',
              JSON.stringify({
                from: number || from_number, to: to_number || '+16452468277',
                content: content || '', mediaUrl: media_url || null,
                wasDowngraded: was_downgraded || false, status: status || 'delivered',
                messageHandle: message_handle || null,
                dateSent: date_sent || new Date().toISOString(),
                dateUpdated: date_updated || null, messageType: message_type || 'message',
              })
            ]
          });
          console.log(`[SendBlue Webhook] ✅ Stored incoming message from ${number || from_number}`);
        }
      } catch (dbErr) { console.error('[SendBlue Webhook] DB error:', dbErr); }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[SendBlue Webhook] Error:', err);
    return res.status(200).json({ success: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. SENDBLUE INBOX — Poll SendBlue API + return stored iMessages
//     On free tier, webhooks are unreliable so we poll the API directly.
// ─────────────────────────────────────────────────────────────────────────────
async function handleIMessageInbox(req, res) {
  try {
    const dbUrl = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
    const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
    if (!authToken) return res.json({ messages: [], error: 'Database not configured' });

    const turso = createClient({ url: dbUrl, authToken });
    const creds = getSendBlueCredentials();

    // ── Step 1: Poll SendBlue API for recent messages (fallback for free tier) ──
    if (creds) {
      try {
        // Use AbortController for timeout (8s max to avoid Vercel function timeout)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        // Try v2 first, fall back to v1
        let sbRes;
        try {
          sbRes = await fetch(`https://api.sendblue.com/api/v2/messages?limit=50&order_by=createdAt&order_direction=desc`, {
            method: 'GET',
            headers: { 'sb-api-key-id': creds.apiKey, 'sb-api-secret-key': creds.apiSecret },
            signal: controller.signal,
          });
        } catch (v2Err) {
          // v2 failed, try v1
          try {
            sbRes = await fetch(`https://api.sendblue.co/api/messages?limit=50`, {
              method: 'GET',
              headers: { 'sb-api-key-id': creds.apiKey, 'sb-api-secret-key': creds.apiSecret },
              signal: controller.signal,
            });
          } catch { sbRes = null; }
        }
        clearTimeout(timeout);

        if (sbRes && sbRes.ok) {
          let sbData;
          try { sbData = await sbRes.json(); } catch { sbData = null; }
          
          if (sbData) {
            const sbMessages = Array.isArray(sbData) ? sbData : (sbData.messages || sbData.data || []);

            if (Array.isArray(sbMessages) && sbMessages.length > 0) {
              // Get existing message handles to avoid duplicates
              const existingResult = await turso.execute({
                sql: `SELECT data FROM audit_logs WHERE action IN ('IMESSAGE_RECEIVED', 'IMESSAGE_SENT') ORDER BY rowid DESC LIMIT 200`,
                args: []
              });
              const existingHandles = new Set();
              const existingContents = new Set();
              existingResult.rows.forEach(row => {
                try {
                  const d = JSON.parse(row.data);
                  if (d.messageHandle) existingHandles.add(d.messageHandle);
                  existingContents.add(`${d.content || ''}|${d.dateSent || d.timestamp || ''}`);
                } catch {}
              });

              let newCount = 0;
              for (const msg of sbMessages) {
                const handle = msg.message_handle || msg.messageHandle || '';
                const content = msg.content || msg.body || '';
                const dateSent = msg.date_sent || msg.dateSent || msg.created_at || '';
                const contentKey = `${content}|${dateSent}`;

                if (handle && existingHandles.has(handle)) continue;
                if (existingContents.has(contentKey)) continue;
                if (!content) continue;

                const isOutbound = msg.is_outbound === true;
                const fromNumber = msg.from_number || msg.number || '';
                const toNumber = msg.to_number || '';
                const msgId = isOutbound
                  ? `imsg-out-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
                  : `imsg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

                await turso.execute({
                  sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
                  args: [
                    msgId,
                    isOutbound ? 'IMESSAGE_SENT' : 'IMESSAGE_RECEIVED',
                    isOutbound ? (toNumber || 'unknown') : (fromNumber || 'unknown'),
                    JSON.stringify({
                      from: isOutbound ? '+16452468277' : fromNumber,
                      to: isOutbound ? toNumber : '+16452468277',
                      content,
                      mediaUrl: msg.media_url || null,
                      wasDowngraded: msg.was_downgraded || false,
                      status: msg.status || 'delivered',
                      messageHandle: handle,
                      dateSent: dateSent || new Date().toISOString(),
                      dateUpdated: msg.date_updated || null,
                      messageType: msg.message_type || 'message',
                      syncedFromApi: true,
                    })
                  ]
                });
                newCount++;
              }
              if (newCount > 0) console.log(`[SendBlue Sync] ✅ Synced ${newCount} new messages from SendBlue API`);
            }
          }
        } else if (sbRes) {
          console.log(`[SendBlue Sync] API returned ${sbRes.status} — skipping sync`);
        }
      } catch (syncErr) {
        // Don't fail the whole request if sync fails — just return what's in DB
        console.error('[SendBlue Sync] Error polling API:', syncErr.message || syncErr);
      }
    }

    // ── Step 2: Return all stored messages from Turso ──
    const limit = Math.min(parseInt(req.query.limit || '50'), 200);
    const result = await turso.execute({
      sql: `SELECT id, user_id, data, created_at FROM audit_logs 
            WHERE action IN ('IMESSAGE_RECEIVED', 'IMESSAGE_SENT') 
            ORDER BY rowid DESC LIMIT ?`,
      args: [limit]
    });

    const messages = result.rows.map(row => {
      let parsed = {};
      try { parsed = JSON.parse(row.data); } catch {}
      return {
        id: row.id, from: parsed.from || row.user_id, to: parsed.to || '',
        content: parsed.content || '', mediaUrl: parsed.mediaUrl || null,
        direction: row.id.startsWith('imsg-out') ? 'outbound' : 'inbound',
        wasDowngraded: parsed.wasDowngraded || false,
        timestamp: parsed.dateSent || parsed.timestamp || row.created_at,
        status: parsed.status || 'delivered',
      };
    });

    return res.json({ messages, total: messages.length });
  } catch (err) {
    console.error('[SendBlue Inbox] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. SENDBLUE STATUS — Check if SendBlue is configured
// ─────────────────────────────────────────────────────────────────────────────
function handleIMessageStatus(req, res) {
  const creds = getSendBlueCredentials();
  return res.json({ configured: !!creds, fromNumber: '+16452468277', service: 'SendBlue iMessage' });
}
