// Vercel Serverless API Route — /api/gemini
// Proxies Gemini AI requests to protect the API key from being exposed on the frontend

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const MODEL_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    console.error('Server GEMINI_API_KEY is not defined.');
    return res.status(500).json({ success: false, error: 'Server AI Key Configuration Missing' });
  }

  const { systemInstruction, userPrompt, opts } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ success: false, error: 'Missing prompt' });
  }

  try {
    const response = await fetch(`${MODEL_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        contents: [
          ...(opts?.history ?? []),
          { role: 'user', parts: [{ text: userPrompt }] },
        ],
        generationConfig: {
          temperature: opts?.temperature ?? 0.7,
          maxOutputTokens: opts?.maxTokens ?? 500,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('[Gemini API Proxy Error]:', err);
      return res.status(response.status).json({ success: false, error: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    return res.status(200).json({ success: true, text });
  } catch (error) {
    console.error('[Gemini API Proxy Exception]:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
