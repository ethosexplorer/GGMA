import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { 
      CallSid, 
      From, 
      To, 
      CallStatus, 
      Direction, 
      CallDuration, 
      RecordingUrl 
    } = req.body;

    console.log(`[Twilio Call Status] ${CallSid} | ${Direction} | ${CallStatus}`);

    let subject = `Call Center Update: ${CallStatus.toUpperCase()} Call`;
    let text = `Call Details:\n\nDirection: ${Direction}\nFrom: ${From}\nTo: ${To}\nStatus: ${CallStatus}\nDuration: ${CallDuration || 0} seconds`;

    // Special handling for missed calls or voicemails
    if (CallStatus === 'no-answer' || CallStatus === 'failed' || CallStatus === 'busy' || CallStatus === 'canceled') {
      subject = `[MISSED CALL] Call Center Update: ${CallStatus.toUpperCase()}`;
    }

    if (RecordingUrl) {
      subject = `[VOICEMAIL] New Voicemail from ${From}`;
      text += `\n\nListen to Voicemail: ${RecordingUrl}`;
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.CAREPATRON_EMAIL,
          pass: process.env.CAREPATRON_PASS
        }
      });

      await transporter.sendMail({
        from: `"GGP-OS Call Center" <${process.env.CAREPATRON_EMAIL}>`,
        to: 'asstsupport@gmail.com',
        subject: subject,
        text: text
      });
      console.log(`[Twilio Call Status] Notification email sent to asstsupport@gmail.com`);
    } catch (emailErr) {
      console.error(`[Twilio Call Status] Failed to send email notification:`, emailErr);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('[Twilio Call Status] Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
}
