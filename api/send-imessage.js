// Vercel Serverless API Route — /api/send-imessage
// Sends iMessages via SendBlue API with automatic SMS fallback
// Use for 1:1 patient communications, case updates, intake follow-ups

const SENDBLUE_API_URL = 'https://api.sendblue.com/api/send-message';

export default async function handler(req, res) {
  // CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.SENDBLUE_API_KEY;
  const apiSecret = process.env.SENDBLUE_API_SECRET;
  const fromNumber = process.env.SENDBLUE_FROM_NUMBER;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ success: false, error: 'SendBlue credentials not configured' });
  }

  const { phone, message, mediaUrl } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'Missing phone or message' });
  }

  // Normalize to E.164 format
  let e164 = phone.replace(/[\s\-\(\)]/g, '');
  if (!e164.startsWith('+')) e164 = '+1' + e164;

  try {
    const body = {
      number: e164,
      from_number: fromNumber,
      content: message,
      // SendBlue auto-falls back: iMessage → RCS → SMS
      // status_callback can be set to receive delivery receipts
      status_callback: process.env.SENDBLUE_STATUS_WEBHOOK || undefined,
    };

    // Attach media if provided (images, PDFs, flyers)
    if (mediaUrl) {
      body.media_url = mediaUrl;
    }

    const response = await fetch(SENDBLUE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sb-api-key-id': apiKey,
        'sb-api-secret-key': apiSecret,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('SendBlue API Error:', data);
      return res.status(response.status).json({
        success: false,
        error: data.message || data.error_message || 'SendBlue delivery failed',
        status: data.status,
      });
    }

    return res.status(200).json({
      success: true,
      messageId: data.message_handle,
      status: data.status,
      service: data.service, // 'iMessage' or 'SMS'
      fromNumber: data.from_number,
    });
  } catch (error) {
    console.error('SendBlue Request Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
