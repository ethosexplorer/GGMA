// Vercel Serverless API Route — /api/send-sms
// Proxies SMS requests to TextBelt to avoid CORS issues in the browser

const TEXTBELT_API_KEY = 'db52652f3be5c4f6d222f51f0baec042c9c2de1dj5ZJQqhgFMxflAFaM9KXOLUAK';
const TEXTBELT_URL = 'https://textbelt.com/text';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ success: false, error: 'Missing phone or message' });
  }

  // Clean phone number
  const cleanNumber = phone.replace(/[\s\-\(\)\+]/g, '');

  try {
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
  } catch (error) {
    console.error('TextBelt API Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
