// TextBelt SMS Service — https://textbelt.com
// Sends SMS via TextBelt API (US/Canada)

const TEXTBELT_API_KEY = 'db52652f3be5c4f6d222f51f0baec042c9c2de1dj5ZJQqhgFMxflAFaM9KXOLUAK';
const TEXTBELT_URL = 'https://textbelt.com/text';

export interface TextBeltResponse {
  success: boolean;
  textId?: string;
  quotaRemaining?: number;
  message?: string;
  error?: string;
}

/**
 * Send an SMS message via TextBelt
 * @param phoneNumber - US/Canada phone number (e.g. "4055551234" or "+14055551234")
 * @param message - The SMS message body (max ~160 chars for single SMS)
 * @returns TextBelt API response with success status and remaining quota
 */
export const sendSMS = async (phoneNumber: string, message: string): Promise<TextBeltResponse> => {
  // Clean phone number — strip spaces, dashes, parentheses
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
  
  try {
    // Route through Vercel serverless function to avoid CORS
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanNumber,
        message: message,
      }),
    });

    const data: TextBeltResponse = await response.json();
    
    if (data.success) {
      console.log(`✅ SMS sent to ${cleanNumber}. Quota remaining: ${data.quotaRemaining}`);
    } else {
      console.warn(`⚠️ SMS failed to ${cleanNumber}: ${data.message || data.error}`);
    }

    return data;
  } catch (error: any) {
    console.error('❌ TextBelt SMS Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Check remaining SMS quota
 */
export const checkQuota = async (): Promise<number> => {
  try {
    const response = await fetch(`https://textbelt.com/quota/${TEXTBELT_API_KEY}`);
    const data = await response.json();
    return data.quotaRemaining || 0;
  } catch {
    return -1;
  }
};

/**
 * Pre-built notification templates
 */
export const SMS_TEMPLATES = {
  applicationSubmitted: (patientName: string, state: string) =>
    `Hi ${patientName}, your ${state} medical card application has been submitted! We are monitoring your status daily. You'll receive updates as they come. - Global Green Health Platform`,

  applicationApproved: (patientName: string, state: string) =>
    `Great news ${patientName}! Your ${state} medical card has been APPROVED! Your card will be mailed within 7-10 business days. - Global Green Health Platform`,

  cardMailed: (patientName: string) =>
    `Hi ${patientName}, your medical card has been mailed! Expect delivery within 7-10 business days. Check your mailbox daily. - Global Green Health Platform`,

  cardDelivered: (patientName: string) =>
    `Congratulations ${patientName}! Your medical card should have arrived. If you haven't received it, contact us immediately. Welcome aboard! - Global Green Health Platform`,

  statusUpdate: (patientName: string, status: string) =>
    `Hi ${patientName}, your application status update: ${status}. Login to your dashboard for details or reply to this message. - Global Green Health Platform`,

  appointmentReminder: (patientName: string, date: string, time: string) =>
    `Reminder: ${patientName}, your telehealth appointment is on ${date} at ${time}. Please be ready 5 mins early. - Global Green Health Platform`,

  custom: (message: string) => message,
};
