import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@libsql/client/web';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
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

    // Insert live Audit Log into Turso so the dashboard sees the alert immediately
    try {
      const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
      const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
      
      const turso = createClient({ url, authToken: authToken as string });
      
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
    } catch (dbErr) {
      console.error(`[Twilio Call Status] Failed to log to Turso:`, dbErr);
    }

    // Keep the email notification backup
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

    res.status(200).send('OK');
  } catch (error) {
    console.error('[Twilio Call Status] Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
}
