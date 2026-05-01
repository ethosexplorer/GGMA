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

    const addonsList = addons && addons.length > 0 ? addons.join('\n  • ') : 'None';
    const trialInfo = trialDays > 0 ? `${trialDays}-day free trial, then ` : '';

    // Send notification via Twilio SMS to the team
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      const client = require('twilio')(accountSid, authToken);
      
      await client.messages.create({
        body: `🔔 NEW SUBSCRIPTION REQUEST\n\nCustomer: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone || 'N/A'}\nCompany: ${company || 'N/A'}\n\nPlan: ${plan}\nBilling: ${billing}\nTotal: ${trialInfo}${total}\nAdd-ons: ${addons?.length || 0}\n\nPlease send ACH invoice/payment request via Found.`,
        from: '+18889634447',
        to: '+19188169498',
      });
    }

    // Log the subscription request
    console.log('=== NEW SUBSCRIPTION REQUEST ===');
    console.log(`Customer: ${customerName} (${customerEmail})`);
    console.log(`Phone: ${customerPhone || 'N/A'}`);
    console.log(`Company: ${company || 'N/A'}`);
    console.log(`Plan: ${plan} (${billing})`);
    console.log(`Total: ${trialInfo}${total}`);
    console.log(`Add-ons: ${addonsList}`);
    console.log(`Notes: ${notes || 'None'}`);
    console.log('================================');

    return res.status(200).json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Notification error:', error);
    return res.status(200).json({ success: true, message: 'Order recorded (notification delivery best-effort)' });
  }
}
