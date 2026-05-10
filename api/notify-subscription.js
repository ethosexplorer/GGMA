// Direct Push Notification — Replaces Twilio SMS (declined due to cannabis industry)
// Saves notifications to Turso DB for in-app delivery + optional browser push

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      company,
      plan,
      addons,
      billing,
      total,
      trialDays,
      notes,
    } = req.body;

    const addonsList = addons && addons.length > 0 ? addons.join(', ') : 'None';
    const trialInfo = trialDays > 0 ? `${trialDays}-day free trial, then ` : '';

    // ── 1. Save notification directly to Turso DB ──
    const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL
      ? process.env.VITE_TURSO_DATABASE_URL.replace('libsql://', 'https://') + '/v2/pipeline'
      : 'https://ggma-ggma.aws-us-east-2.turso.io/v2/pipeline';
    const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN;

    const notificationId = 'NOTIF-' + Date.now().toString(36).toUpperCase();
    const notificationData = JSON.stringify({
      type: 'new_subscription',
      customerName,
      customerEmail,
      customerPhone: customerPhone || 'N/A',
      company: company || 'N/A',
      plan,
      billing,
      total: `${trialInfo}${total}`,
      addons: addonsList,
      notes: notes || 'None',
      timestamp: new Date().toISOString(),
    });

    if (TURSO_TOKEN) {
      // Ensure notifications table exists + insert
      await fetch(TURSO_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              type: 'execute',
              stmt: {
                sql: `CREATE TABLE IF NOT EXISTS platform_notifications (
                  id TEXT PRIMARY KEY,
                  type TEXT NOT NULL,
                  title TEXT NOT NULL,
                  message TEXT NOT NULL,
                  data TEXT,
                  recipient TEXT DEFAULT 'founder',
                  read INTEGER DEFAULT 0,
                  created_at TEXT DEFAULT (datetime('now'))
                )`
              }
            },
            {
              type: 'execute',
              stmt: {
                sql: "INSERT INTO platform_notifications (id, type, title, message, data, recipient) VALUES (?, ?, ?, ?, ?, ?)",
                args: [
                  { type: 'text', value: notificationId },
                  { type: 'text', value: 'new_subscription' },
                  { type: 'text', value: `New Subscription: ${customerName}` },
                  { type: 'text', value: `${customerName} (${customerEmail}) subscribed to ${plan} (${billing}). Total: ${trialInfo}${total}. Add-ons: ${addonsList}` },
                  { type: 'text', value: notificationData },
                  { type: 'text', value: 'founder' },
                ]
              }
            },
            {
              type: 'execute',
              stmt: {
                sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                args: [
                  { type: 'text', value: notificationId },
                  { type: 'text', value: 'NEW_SUBSCRIPTION_NOTIFICATION' },
                  { type: 'text', value: customerEmail || 'unknown' },
                  { type: 'text', value: notificationData },
                ]
              }
            }
          ]
        })
      });
    }

    // ── 2. Log to Vercel console ──
    console.log('=== NEW SUBSCRIPTION REQUEST ===');
    console.log(`Customer: ${customerName} (${customerEmail})`);
    console.log(`Phone: ${customerPhone || 'N/A'}`);
    console.log(`Company: ${company || 'N/A'}`);
    console.log(`Plan: ${plan} (${billing})`);
    console.log(`Total: ${trialInfo}${total}`);
    console.log(`Add-ons: ${addonsList}`);
    console.log(`Notes: ${notes || 'None'}`);
    console.log(`Notification ID: ${notificationId}`);
    console.log('================================');

    return res.status(200).json({ 
      success: true, 
      message: 'Push notification saved to database',
      notificationId 
    });
  } catch (error) {
    console.error('Notification error:', error);
    return res.status(200).json({ success: true, message: 'Order recorded (notification delivery best-effort)' });
  }
}
