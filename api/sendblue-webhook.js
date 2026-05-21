// Vercel Serverless API Route — /api/sendblue-webhook
// Receives inbound iMessages and delivery status updates from SendBlue
// Routes incoming patient messages to the Call Center Command / Patient Case Tracker

import { createClient } from '@libsql/client/web';

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL || '',
  authToken: process.env.VITE_TURSO_AUTH_TOKEN || '',
});

export default async function handler(req, res) {
  // Only accept POST from SendBlue
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  // SendBlue sends different webhook types
  // Inbound message: has `from_number`, `content`, `to_number`
  // Status update: has `message_handle`, `status`
  // Typing indicator: has `is_typing`

  try {
    if (payload.from_number && payload.content) {
      // ─── INBOUND MESSAGE ───
      // Log to analytics_events for dashboard tracking
      await turso.execute({
        sql: `INSERT INTO analytics_events (event_type, source, path, user_type, details, created_at) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          'imessage_inbound',
          'sendblue',
          '/imessage',
          'patient',
          `Inbound iMessage from ${payload.from_number}: ${(payload.content || '').substring(0, 100)}`,
          new Date().toISOString(),
        ],
      });

      console.log(`[SendBlue] Inbound from ${payload.from_number}: ${payload.content}`);

      // Return 200 immediately to prevent SendBlue retries
      return res.status(200).json({
        received: true,
        from: payload.from_number,
        service: payload.service, // 'iMessage' or 'SMS'
      });
    }

    if (payload.message_handle && payload.status) {
      // ─── DELIVERY STATUS UPDATE ───
      console.log(`[SendBlue] Status: ${payload.status} for ${payload.message_handle}`);
      return res.status(200).json({ received: true, status: payload.status });
    }

    if (payload.is_typing !== undefined) {
      // ─── TYPING INDICATOR ───
      console.log(`[SendBlue] ${payload.number} ${payload.is_typing ? 'is typing...' : 'stopped typing'}`);
      return res.status(200).json({ received: true });
    }

    // Unknown webhook type
    console.log('[SendBlue] Unknown webhook:', JSON.stringify(payload));
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[SendBlue] Webhook error:', error.message);
    // Still return 200 to prevent retries on our DB errors
    return res.status(200).json({ received: true, error: error.message });
  }
}
