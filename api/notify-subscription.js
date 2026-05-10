// Subscription Notification — Routes through the unified notification engine
// Saves to Turso DB + sends email via Resend (replaces declined Twilio SMS)

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

    // Route through the unified notification API
    const origin = req.headers.origin || req.headers.host || 'https://ggma.vercel.app';
    const protocol = origin.startsWith('http') ? '' : 'https://';
    
    const notifyRes = await fetch(`${protocol}${origin}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'subscription',
        title: `New Subscription: ${customerName}`,
        message: [
          `Customer: ${customerName}`,
          `Email: ${customerEmail}`,
          `Phone: ${customerPhone || 'N/A'}`,
          `Company: ${company || 'N/A'}`,
          `Plan: ${plan} (${billing})`,
          `Total: ${trialInfo}${total}`,
          `Add-ons: ${addonsList}`,
          notes ? `Notes: ${notes}` : null,
        ].filter(Boolean).join('\n'),
        recipientEmail: customerEmail,
        internal: true,
        external: true,
        ctaText: 'Access Your Dashboard',
        ctaUrl: `${protocol}${origin}/dashboard`,
        data: { customerName, customerEmail, customerPhone, company, plan, addons, billing, total, trialDays },
      }),
    });

    const result = await notifyRes.json();

    // Log
    console.log('=== NEW SUBSCRIPTION ===');
    console.log(`${customerName} | ${customerEmail} | ${plan} (${billing}) | ${trialInfo}${total}`);
    console.log(`Notification Result:`, result);
    console.log('========================');

    return res.status(200).json({ success: true, message: 'Notification sent', ...result });
  } catch (error) {
    console.error('Subscription notification error:', error);
    // Graceful degradation — never block checkout
    return res.status(200).json({ success: true, message: 'Order recorded (notification delivery best-effort)' });
  }
}
