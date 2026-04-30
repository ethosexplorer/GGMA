/**
 * 800.com VoIP Integration Service
 * 
 * Connects GGP-OS platform to the company toll-free number (888-963-4447)
 * via the 800.com REST API for call routing, SMS, and call center operations.
 * 
 * API Token Format: accountId|apiKey
 */

const VOIP_TOKEN = import.meta.env.VITE_VOIP_800_TOKEN || '372214|lVvahKoz5PH5uCZmfmCxhdSDFi0qqobzKhABsx73e2d198d2';
const [ACCOUNT_ID, API_KEY] = VOIP_TOKEN.split('|');
const BASE_URL = 'https://api.800.com';
const COMPANY_NUMBER = '18889634447';

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

let cachedHistory: any = null;
let lastFetchTime = 0;

async function fetchHistory() {
  const now = Date.now();
  if (cachedHistory && now - lastFetchTime < 10000) return cachedHistory; // Cache for 10 seconds

  try {
    const res = await fetch('/api/twilio/history');
    if (!res.ok) throw new Error('Failed to fetch Twilio history');
    cachedHistory = await res.json();
    lastFetchTime = now;
    return cachedHistory;
  } catch (err) {
    console.error('[Twilio] Failed to fetch history:', err);
    return { calls: [], messages: [] };
  }
}

/**
 * Fetch recent call history
 */
export async function getCallHistory(limit = 50, offset = 0): Promise<CallRecord[]> {
  const data = await fetchHistory();
  return data.calls.slice(0, limit);
}

/**
 * Send an SMS message from the company number
 */
export async function sendSMS(to: string, body: string): Promise<SMSMessage | null> {
  try {
    const res = await fetch(`/api/twilio/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body }),
    });
    if (!res.ok) throw new Error(`Twilio SMS error: ${res.status}`);
    const data = await res.json();
    return {
      id: data.messageId,
      from: COMPANY_NUMBER,
      to,
      body,
      direction: 'outbound',
      status: data.status,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('[Twilio] Failed to send SMS:', err);
    return null;
  }
}

/**
 * Fetch SMS conversation history
 */
export async function getSMSHistory(limit = 50): Promise<SMSMessage[]> {
  const data = await fetchHistory();
  return data.messages.slice(0, limit);
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
    const data = await fetchHistory();
    const calls = data.calls;
    
    // Calculate stats from real Twilio recent calls
    const totalCalls = calls.length;
    const answeredCalls = calls.filter((r: any) => r.status === 'completed' || r.status === 'in-progress').length;
    const missedCalls = totalCalls - answeredCalls;
    const avgDuration = totalCalls > 0 ? Math.round(calls.reduce((acc: number, r: any) => acc + (r.duration || 0), 0) / totalCalls) : 0;
    
    // Calculate active queue based on in-progress calls
    const activeQueue = calls.filter((r: any) => r.status === 'in-progress' || r.status === 'ringing').length;
    
    return {
      totalCalls,
      answeredCalls,
      missedCalls,
      averageWaitTime: missedCalls * 3, // Basic simulated wait time metric based on dropped calls
      averageCallDuration: avgDuration,
      totalSMS: data.messages.length,
      activeAgents: activeQueue > 0 ? activeQueue + 1 : 1, // Assume at least 1 agent is online (Web Dialer)
    };
  } catch (err) {
    console.error('[Twilio] Failed to fetch stats:', err);
    return {
      totalCalls: 0, answeredCalls: 0, missedCalls: 0, averageWaitTime: 0, averageCallDuration: 0, totalSMS: 0, activeAgents: 0,
    };
  }
}

/**
 * Get account/number info to verify connectivity
 */
export async function verifyConnection(): Promise<{ connected: boolean; accountId: string; number: string; error?: string }> {
  try {
    const res = await fetch('/api/twilio/verify');
    const data = await res.json();
    
    if (!res.ok || !data.connected) {
      return { connected: false, accountId: ACCOUNT_ID, number: COMPANY_NUMBER, error: data.error || `API returned ${res.status}` };
    }
    return { connected: true, accountId: data.accountId || ACCOUNT_ID, number: COMPANY_NUMBER };
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
  return '1-888-963-4447';
}

/**
 * Get real-time queue count
 */
export async function getQueueCount(): Promise<number> {
  try {
    const data = await fetchHistory();
    const activeQueue = data.calls.filter((r: any) => r.status === 'in-progress' || r.status === 'ringing').length;
    return activeQueue;
  } catch (err) {
    console.error('[Twilio] Failed to fetch queue count:', err);
    return 0;
  }
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
  getQueueCount,
  ACCOUNT_ID,
  COMPANY_NUMBER,
};
