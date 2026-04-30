import twilio from 'twilio';

const { MessagingResponse } = twilio.twiml;

export default async function handler(req, res) {
  // Only allow POST requests for Twilio webhooks
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // The incoming text message details are sent in req.body
    const incomingMsg = req.body.Body || '';
    const fromNumber = req.body.From || '';

    console.log(`[Twilio SMS] Received message from ${fromNumber}: ${incomingMsg}`);

    // Create a new TwiML response
    const twiml = new MessagingResponse();

    // In the future, this can be wired into Sylara or the platform's chat UI
    // For now, we respond with a professional auto-reply
    twiml.message("Thank you for contacting the GGP-OS Communications Hub. Your message has been received. A representative will contact you shortly if a response is required.");

    // Send the response back to Twilio
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());

  } catch (error) {
    console.error('[Twilio SMS] Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process incoming message' });
  }
}
