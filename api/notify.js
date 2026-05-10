// ═══════════════════════════════════════════════════════════════════════════════
//  GGP-OS NOTIFICATION ENGINE — Unified Push Notifications (Internal + Email)
//  Replaces Twilio SMS (declined for cannabis). Uses Resend for email delivery.
//  
//  SETUP: Add RESEND_API_KEY to your Vercel Environment Variables
//    1. Go to https://resend.com → Sign up free
//    2. Create an API Key
//    3. Add your verified domain (or use onboarding@resend.dev for testing)
//    4. Add RESEND_API_KEY to Vercel → Settings → Environment Variables
// ═══════════════════════════════════════════════════════════════════════════════

const TURSO_URL = 'https://ggma-ggma.aws-us-east-2.turso.io/v2/pipeline';
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN;

// Sender — use your verified domain or Resend's test domain
const FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL || 'GGP-OS <notifications@globalgreenenterprise.com>';
const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || 'shantellrobinson@globalgreenenterprise.com';

async function tursoExec(statements) {
  const requests = statements.map(sql => ({
    type: "execute",
    stmt: typeof sql === 'string' ? { sql } : sql
  }));

  const res = await fetch(TURSO_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not configured — skipping email delivery');
    return { skipped: true, reason: 'No API key' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Email] Resend API error:', err);
    return { error: err };
  }

  return res.json();
}

// Beautiful email template
function buildEmailHTML({ title, body, ctaText, ctaUrl, footer }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a4731 0%,#065f46 100%);padding:32px 40px;text-align:center;">
      <h1 style="color:#ffffff;font-size:20px;font-weight:800;margin:0;letter-spacing:0.5px;">
        🌿 Global Green Hybrid Platform
      </h1>
      <p style="color:#6ee7b7;font-size:11px;margin:8px 0 0;font-weight:600;text-transform:uppercase;letter-spacing:2px;">
        GGP-OS • Production Notification
      </p>
    </div>
    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 16px;">${title}</h2>
      <div style="color:#475569;font-size:14px;line-height:1.7;">${body}</div>
      ${ctaText && ctaUrl ? `
      <div style="text-align:center;margin:32px 0 16px;">
        <a href="${ctaUrl}" style="display:inline-block;background:#1a4731;color:#fff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:14px;">
          ${ctaText}
        </a>
      </div>` : ''}
    </div>
    <!-- Footer -->
    <div style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:11px;margin:0;text-align:center;">
        ${footer || 'Global Green Enterprise Inc. • Tulsa, OK • GGP-OS Platform'}
      </p>
      <p style="color:#cbd5e1;font-size:10px;margin:8px 0 0;text-align:center;">
        This is an automated notification from your GGP-OS system. Do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      type,        // 'subscription' | 'alert' | 'system' | 'compliance' | 'custom'
      title,       // Notification title
      message,     // Notification body text
      recipientEmail, // External email to send to (optional)
      recipientName,  // Name of recipient
      recipients,  // Array of emails for bulk send (optional)
      internal,    // true = save to in-app notifications (default: true)
      external,    // true = send email (default: true if recipientEmail provided)
      data,        // Any extra JSON data to store
      ctaText,     // Call-to-action button text
      ctaUrl,      // Call-to-action URL
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }

    const notificationId = 'NOTIF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    const results = { id: notificationId, internal: false, email: false };

    // ── 1. Internal Push (Turso DB) ──
    if (internal !== false && TURSO_TOKEN) {
      try {
        await tursoExec([
          `CREATE TABLE IF NOT EXISTS platform_notifications (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            data TEXT,
            recipient TEXT DEFAULT 'all',
            read INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
          )`,
          {
            sql: "INSERT INTO platform_notifications (id, type, title, message, data, recipient) VALUES (?, ?, ?, ?, ?, ?)",
            args: [notificationId, type || 'system', title, message, JSON.stringify(data || {}), recipientEmail || 'all']
          },
          {
            sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
            args: [notificationId, 'PUSH_NOTIFICATION', recipientEmail || 'system', JSON.stringify({ title, message, type, recipientEmail })]
          }
        ]);
        results.internal = true;
      } catch (err) {
        console.error('[Internal Push] Error:', err);
      }
    }

    // ── 2. External Email ──
    const shouldSendEmail = external !== false && (recipientEmail || recipients?.length > 0);
    if (shouldSendEmail) {
      const emailTargets = recipients || [recipientEmail];
      const html = buildEmailHTML({
        title,
        body: message.replace(/\n/g, '<br/>'),
        ctaText,
        ctaUrl,
      });

      for (const email of emailTargets) {
        if (!email) continue;
        const emailResult = await sendEmail({
          to: email,
          subject: `[GGP-OS] ${title}`,
          html,
        });
        if (!emailResult.error && !emailResult.skipped) {
          results.email = true;
        }
        console.log(`[Email] Sent to ${email}:`, emailResult);
      }

      // Also always notify the founder
      if (!emailTargets.includes(FOUNDER_EMAIL)) {
        await sendEmail({
          to: FOUNDER_EMAIL,
          subject: `[GGP-OS Admin] ${title}`,
          html: buildEmailHTML({
            title: `Admin Copy: ${title}`,
            body: `<strong>Recipient:</strong> ${recipientEmail || 'N/A'}<br/><br/>${message.replace(/\n/g, '<br/>')}`,
          }),
        });
      }
    }

    console.log(`[Notification] ${notificationId} | Internal: ${results.internal} | Email: ${results.email} | Title: ${title}`);

    return res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('[Notification Engine] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
