/**
 * SendBlue iMessage Client — Frontend utility for GGHP-OS
 * 
 * Routes messages through the Vercel API route (/api/send-imessage)
 * to avoid exposing API keys in the browser.
 * 
 * Usage:
 *   import { sendIMessage, sendPatientUpdate } from '../lib/sendblue';
 *   await sendIMessage('+19185551234', 'Your application has been approved!');
 *   await sendPatientUpdate(patient, 'Your OMMA card is ready for pickup.');
 */

const API_ENDPOINT = '/api/twilio/send-imessage';

interface SendResult {
  success: boolean;
  messageId?: string;
  status?: string;
  service?: 'iMessage' | 'SMS';
  error?: string;
}

/**
 * Send an iMessage (with automatic SMS fallback) via SendBlue
 */
export async function sendIMessage(
  phone: string,
  message: string,
  mediaUrl?: string
): Promise<SendResult> {
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message, mediaUrl }),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('[SendBlue] Send failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send a patient case update via iMessage
 * Formats a professional message with GGHP branding
 */
export async function sendPatientUpdate(
  patient: { name: string; phone: string; state?: string },
  updateMessage: string
): Promise<SendResult> {
  const formatted = [
    `🌿 GGHP Patient Update`,
    ``,
    `Hi ${patient.name},`,
    ``,
    updateMessage,
    ``,
    `— Global Green Hybrid Platform`,
    `Questions? Reply to this message.`,
  ].join('\n');

  return sendIMessage(patient.phone, formatted);
}

/**
 * Send a business notification via iMessage
 */
export async function sendBusinessNotification(
  contact: { name: string; phone: string; businessName?: string },
  notification: string
): Promise<SendResult> {
  const formatted = [
    `🏢 GGHP Business Alert`,
    ``,
    `Hi ${contact.name}${contact.businessName ? ` (${contact.businessName})` : ''},`,
    ``,
    notification,
    ``,
    `— Global Green Hybrid Platform`,
  ].join('\n');

  return sendIMessage(contact.phone, formatted);
}

/**
 * Check if SendBlue is configured (API keys present on server)
 * Useful for conditionally showing iMessage vs SMS options in the UI
 */
export async function isSendBlueConfigured(): Promise<boolean> {
  try {
    // A quick test — if the endpoint exists and doesn't return a 500 config error
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '', message: '' }),
    });
    const data = await res.json();
    // If it says "missing phone or message" that means the API is working (keys are set)
    // If it says "credentials not configured" that means keys aren't set yet
    return !data.error?.includes('credentials not configured');
  } catch {
    return false;
  }
}
