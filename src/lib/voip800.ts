/**
 * 800.com VoIP Integration Service
 * 
 * Connects GGP-OS platform to the company toll-free number (844-333-4447)
 * via the 800.com REST API for call routing, SMS, and call center operations.
 * 
 * API Token Format: accountId|apiKey
 */

const VOIP_TOKEN = import.meta.env.VITE_VOIP_800_TOKEN || '372214|lVvahKoz5PH5uCZmfmCxhdSDFi0qqobzKhABsx73e2d198d2';
const [ACCOUNT_ID, API_KEY] = VOIP_TOKEN.split('|');
const BASE_URL = 'https://api.800.com/v1';
const COMPANY_NUMBER = '18443334447';

// ──── Auth Headers ────
const getHeaders = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'X-Account-Id': ACCOUNT_ID,
});

// ──── Types ────
export interface CallRecord {
  id: string;
  from: string;
  to: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'voicemail' | 'in-progress';
  duration: number; // seconds
  timestamp: string;
  recording_url?: string;
}

export interface SMSMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  direction: 'inbound' | 'outbound';
  status: 'delivered' | 'sent' | 'failed' | 'queued';
  timestamp: string;
}

export interface ForwardingRule {
  id: string;
  name: string;
  destination: string;
  type: 'sequential' | 'simultaneous' | 'standard';
  active: boolean;
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export interface CallCenterStats {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  averageWaitTime: number;
  averageCallDuration: number;
  totalSMS: number;
  activeAgents: number;
}

// ──── API Methods ────

/**
 * Fetch recent call history
 */
export async function getCallHistory(limit = 50, offset = 0): Promise<CallRecord[]> {
  try {
    const res = await fetch(`${BASE_URL}/calls?number=${COMPANY_NUMBER}&limit=${limit}&offset=${offset}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`800.com API error: ${res.status}`);
    const data = await res.json();
    return data.calls || data.data || [];
  } catch (err) {
    console.error('[800.com] Failed to fetch call history:', err);
    return [];
  }
}

/**
 * Send an SMS message from the company number
 */
export async function sendSMS(to: string, body: string): Promise<SMSMessage | null> {
  try {
    const res = await fetch(`${BASE_URL}/sms/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        from: COMPANY_NUMBER,
        to: to.replace(/\D/g, ''), // Strip non-digits
        body,
      }),
    });
    if (!res.ok) throw new Error(`800.com SMS error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[800.com] Failed to send SMS:', err);
    return null;
  }
}

/**
 * Fetch SMS conversation history
 */
export async function getSMSHistory(limit = 50): Promise<SMSMessage[]> {
  try {
    const res = await fetch(`${BASE_URL}/sms?number=${COMPANY_NUMBER}&limit=${limit}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`800.com API error: ${res.status}`);
    const data = await res.json();
    return data.messages || data.data || [];
  } catch (err) {
    console.error('[800.com] Failed to fetch SMS history:', err);
    return [];
  }
}

/**
 * Get current call forwarding / routing rules
 */
export async function getForwardingRules(): Promise<ForwardingRule[]> {
  try {
    const res = await fetch(`${BASE_URL}/numbers/${COMPANY_NUMBER}/forwarding`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`800.com API error: ${res.status}`);
    const data = await res.json();
    return data.rules || data.data || [];
  } catch (err) {
    console.error('[800.com] Failed to fetch forwarding rules:', err);
    return [];
  }
}

/**
 * Update call forwarding destination
 */
export async function updateForwarding(destination: string, type: 'standard' | 'sequential' | 'simultaneous' = 'standard'): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/numbers/${COMPANY_NUMBER}/forwarding`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        destination: destination.replace(/\D/g, ''),
        type,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[800.com] Failed to update forwarding:', err);
    return false;
  }
}

/**
 * Get real-time call center statistics
 */
export async function getCallCenterStats(): Promise<CallCenterStats> {
  try {
    const res = await fetch(`${BASE_URL}/analytics/summary?number=${COMPANY_NUMBER}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`800.com API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[800.com] Failed to fetch stats:', err);
    // Return mock data for initial setup
    return {
      totalCalls: 0,
      answeredCalls: 0,
      missedCalls: 0,
      averageWaitTime: 0,
      averageCallDuration: 0,
      totalSMS: 0,
      activeAgents: 0,
    };
  }
}

/**
 * Get account/number info to verify connectivity
 */
export async function verifyConnection(): Promise<{ connected: boolean; accountId: string; number: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/account`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      return { connected: false, accountId: ACCOUNT_ID, number: COMPANY_NUMBER, error: `API returned ${res.status}` };
    }
    const data = await res.json();
    return { connected: true, accountId: ACCOUNT_ID, number: COMPANY_NUMBER };
  } catch (err: any) {
    return { connected: false, accountId: ACCOUNT_ID, number: COMPANY_NUMBER, error: err.message };
  }
}

/**
 * Utility: Check if 800.com is configured
 */
export function isConfigured(): boolean {
  return Boolean(ACCOUNT_ID && API_KEY);
}

/**
 * Get the formatted company number for display
 */
export function getCompanyNumber(): string {
  return '1-844-333-4447';
}

export const voip800 = {
  getCallHistory,
  sendSMS,
  getSMSHistory,
  getForwardingRules,
  updateForwarding,
  getCallCenterStats,
  verifyConnection,
  isConfigured,
  getCompanyNumber,
  ACCOUNT_ID,
  COMPANY_NUMBER,
};
