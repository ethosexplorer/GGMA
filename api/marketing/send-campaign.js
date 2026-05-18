import nodemailer from 'nodemailer';

// TextBelt API Key for SMS
const TEXTBELT_API_KEY = process.env.TEXTBELT_API_KEY || 'db52652f3be5c4f6d222f51f0baec042c9c2de1dj5ZJQqhgFMxflAFaM9KXOLUAK';

// Nodemailer SMTP Transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type, subject, message, recipients } = req.body;

    if (!message || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Message and a non-empty recipients array are required.' });
    }

    const results = {
      total: recipients.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    if (type === 'email') {
      // ----------------------------------------------------
      // EMAIL BLAST LOGIC (Nodemailer)
      // ----------------------------------------------------
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ error: 'SMTP credentials are not configured on the server.' });
      }

      const transporter = createTransporter();
      
      // We use Promise.allSettled to send all emails in parallel
      const emailPromises = recipients.map(async (recipient) => {
        if (!recipient.email) throw new Error('Missing email address');
        
        return transporter.sendMail({
          from: `"Global Green Enterprise - Marketing" <marketing.globalgreenhp@gmail.com>`,
          to: recipient.email,
          subject: subject || 'Important Update',
          text: message,
          html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">${message.replace(/\n/g, '<br/>')}</div>`
        });
      });

      const outcomes = await Promise.allSettled(emailPromises);
      
      outcomes.forEach((outcome, index) => {
        if (outcome.status === 'fulfilled') {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push({ recipient: recipients[index], error: outcome.reason.message });
        }
      });

    } else if (type === 'sms') {
      // ----------------------------------------------------
      // SMS BLAST LOGIC (TextBelt)
      // ----------------------------------------------------
      const smsPromises = recipients.map(async (recipient) => {
        if (!recipient.phone) throw new Error('Missing phone number');
        
        const cleanNumber = recipient.phone.replace(/[\s\-\(\)\+]/g, '');
        
        const response = await fetch('https://textbelt.com/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: cleanNumber,
            message: message,
            key: TEXTBELT_API_KEY,
          }),
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'TextBelt API Error');
        }
        return data;
      });

      const outcomes = await Promise.allSettled(smsPromises);
      
      outcomes.forEach((outcome, index) => {
        if (outcome.status === 'fulfilled') {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push({ recipient: recipients[index], error: outcome.reason.message });
        }
      });

    } else {
      return res.status(400).json({ error: 'Invalid campaign type. Must be "email" or "sms".' });
    }

    return res.status(200).json({
      success: true,
      message: `Campaign completed. Sent: ${results.successful}, Failed: ${results.failed}`,
      results
    });

  } catch (error) {
    console.error('Marketing API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
