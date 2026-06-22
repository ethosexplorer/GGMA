/**
 * SendBlue iMessage API — /api/send-imessage
 * 
 * Handles:
 *   POST /api/send-imessage                — Send outgoing iMessage/SMS
 *   POST /api/send-imessage?action=webhook — Receive incoming messages (webhook from SendBlue)
 *   GET  /api/send-imessage?action=inbox   — Fetch stored incoming messages
 *   GET  /api/send-imessage?action=status  — Check if SendBlue is configured
 */

import { createClient } from '@libsql/client/web';

const SENDBLUE_API = 'https://api.sendblue.co/api';

function getTurso() {
  const url = process.env.VITE_TURSO_DATABASE_URL || "libsql://gghp-gghp.aws-us-east-2.turso.io";
  const authToken = process.env.VITE_TURSO_AUTH_TOKEN;
  if (!authToken) return null;
  return createClient({ url, authToken });
}

function getCredentials() {
  const apiKey = process.env.SENDBLUE_API_KEY;
  const apiSecret = process.env.SENDBLUE_API_SECRET;
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action || '';

  // ════════════════════════════════════════════════════════════════════
  // STATUS CHECK — Is SendBlue configured?
  // ════════════════════════════════════════════════════════════════════
  if (action === 'status') {
    const creds = getCredentials();
    return res.json({ 
      configured: !!creds,
      fromNumber: '+16452468277',
      service: 'SendBlue iMessage'
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // INCOMING WEBHOOK — Receive messages texted to 645-246-8277
  // ════════════════════════════════════════════════════════════════════
  if (action === 'webhook') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    try {
      const {
        accountEmail,
        content,
        is_outbound,
        number,        // sender's phone number
        send_style,
        status,
        error_code,
        error_message,
        message_handle,
        date_sent,
        date_updated,
        from_number,
        to_number,
        was_downgraded, // true if fell back to SMS
        media_url,
        message_type,   // 'message' or 'group'
      } = req.body;

      console.log(`[SendBlue Webhook] ${is_outbound ? 'OUT' : 'IN'} | From: ${number || from_number} | "${(content || '').substring(0, 50)}"`);

      // Only store INBOUND messages (outbound are already tracked by us)
      if (!is_outbound) {
        const turso = getTurso();
        if (turso) {
          const msgId = `imsg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
          await turso.execute({
            sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
            args: [
              msgId,
              'IMESSAGE_RECEIVED',
              number || from_number || 'unknown',
              JSON.stringify({
                from: number || from_number,
                to: to_number || '+16452468277',
                content: content || '',
                mediaUrl: media_url || null,
                wasDowngraded: was_downgraded || false,
                status: status || 'delivered',
                messageHandle: message_handle || null,
                dateSent: date_sent || new Date().toISOString(),
                dateUpdated: date_updated || null,
                messageType: message_type || 'message',
              })
            ]
          });
          console.log(`[SendBlue Webhook] ✅ Stored incoming message from ${number || from_number}`);
        }
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[SendBlue Webhook] Error:', err);
      return res.status(200).json({ success: true }); // Always 200 to avoid retries
    }
  }

  // ════════════════════════════════════════════════════════════════════
  // INBOX — Fetch stored incoming iMessages from Turso
  // ════════════════════════════════════════════════════════════════════
  if (action === 'inbox') {
    try {
      const turso = getTurso();
      if (!turso) return res.json({ messages: [], error: 'Database not configured' });

      const limit = Math.min(parseInt(req.query.limit || '50'), 200);
      const result = await turso.execute({
        sql: `SELECT id, user_id, data, created_at FROM audit_logs 
              WHERE action = 'IMESSAGE_RECEIVED' 
              ORDER BY rowid DESC LIMIT ?`,
        args: [limit]
      });

      const messages = result.rows.map(row => {
        let parsed = {};
        try { parsed = JSON.parse(row.data); } catch {}
        return {
          id: row.id,
          from: row.user_id,
          content: parsed.content || '',
          mediaUrl: parsed.mediaUrl || null,
          wasDowngraded: parsed.wasDowngraded || false,
          timestamp: parsed.dateSent || row.created_at,
          status: parsed.status || 'delivered',
        };
      });

      return res.json({ messages, total: messages.length });
    } catch (err) {
      console.error('[SendBlue Inbox] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ════════════════════════════════════════════════════════════════════
  // SEND MESSAGE — Outgoing iMessage/SMS from 645-246-8277
  // ════════════════════════════════════════════════════════════════════
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST required for sending messages' });
  }

  const creds = getCredentials();
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

  // Clean phone number
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
      console.log(`[SendBlue] ✅ Message sent to ${cleanNumber} via ${data.is_outbound ? 'iMessage' : 'SMS'}`);

      // Log outgoing message to Turso
      const turso = getTurso();
      if (turso) {
        const logId = `imsg-out-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        await turso.execute({
          sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
          args: [
            logId,
            'IMESSAGE_SENT',
            cleanNumber,
            JSON.stringify({
              to: cleanNumber,
              from: '+16452468277',
              content: targetMessage,
              mediaUrl: mediaUrl || null,
              service: data.is_outbound ? 'iMessage' : 'SMS',
              messageHandle: data.message_handle || null,
              status: data.status || 'QUEUED',
              timestamp: new Date().toISOString(),
            })
          ]
        });
      }

      return res.json({
        success: true,
        messageId: data.message_handle,
        status: data.status,
        service: data.is_outbound !== false ? 'iMessage' : 'SMS',
      });
    } else {
      console.error('[SendBlue] ❌ API Error:', data);
      return res.json({
        success: false,
        error: data.error_message || data.message || 'SendBlue API Error',
        status: data.status,
      });
    }
  } catch (err) {
    console.error('[SendBlue] Network error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
