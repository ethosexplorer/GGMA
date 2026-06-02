// Vercel Serverless API Route — /api/gemini
// Proxies Gemini AI requests to protect the API key from being exposed on the frontend
// Handles both standard JSON responses and Server-Sent Events (SSE) streaming.

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const MODEL_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const STREAM_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent';

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

  const isStream = req.query.stream === 'true' || req.body?.stream === true;

  if (isStream) {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    try {
      const response = await fetch(`${STREAM_ENDPOINT}?alt=sse&key=${GEMINI_API_KEY}`, {
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
            maxOutputTokens: opts?.maxTokens ?? 1200,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('[Gemini Stream API Error]:', err);
        res.write(`data: ${JSON.stringify({ error: 'AI processing error' })}\n\n`);
        res.write('data: [DONE]\n\n');
        return res.end();
      }

      // Pipe the SSE stream from Gemini through to the client
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr || dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
              }
            } catch (parseErr) {
              // Skip unparseable chunks
            }
          }
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error('[Gemini Stream API Exception]:', error.message);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } else {
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
}
