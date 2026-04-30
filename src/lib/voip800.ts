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

/**
 * Fetch recent call history
 */
export async function getCallHistory(limit = 50, offset = 0): Promise<CallRecord[]> {
  try {
    const res = await fetch(`${BASE_URL}/calls?limit=${limit}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`800.com API error: ${res.status}`);
    const resData = await res.json();
    const records = resData.data || [];
    return records.map((call: any) => ({
      id: String(call.id),
      from: call.from || call.caller,
      to: call.to || call.dialed,
      direction: call.outbound ? 'outbound' : 'inbound',
      status: call.state || 'completed',
      duration: call.duration_in_seconds || 0,
      timestamp: call.date || call.started_at,
      recording_url: call.recording_url,
    }));
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
    const res = await fetch(`${BASE_URL}/calls?limit=100`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`800.com API error: ${res.status}`);
    const resData = await res.json();
    const records = resData.data || [];
    
    // Calculate simple stats from recent calls
    const totalCalls = records.length;
    const answeredCalls = records.filter((r: any) => r.duration_in_seconds > 0).length;
    const missedCalls = totalCalls - answeredCalls;
    const avgDuration = totalCalls > 0 ? Math.round(records.reduce((acc: number, r: any) => acc + (r.duration_in_seconds || 0), 0) / totalCalls) : 0;
    
    return {
      totalCalls,
      answeredCalls,
      missedCalls,
      averageWaitTime: 12, // Placeholder
      averageCallDuration: avgDuration,
      totalSMS: 0,
      activeAgents: 1,
    };
  } catch (err) {
    console.error('[800.com] Failed to fetch stats:', err);
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
 * Get real-time queue count from Turso state
 */
export async function getQueueCount(): Promise<number> {
  try {
    const TURSO_URL = 'https://ggma-ggma.aws-us-east-2.turso.io/v2/pipeline';
    const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ';
    
    const res = await fetch(TURSO_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TURSO_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql: "SELECT value FROM system_state WHERE key = 'queue_count';" } }
        ]
      })
    });
    
    if (!res.ok) return 0;
    const data = await res.json();
    const rows = data.results?.[0]?.response?.result?.rows;
    if (rows && rows.length > 0) {
      return parseInt(rows[0][0].value, 10) || 0;
    }
    return 0;
  } catch (err) {
    console.error('[800.com] Failed to fetch queue count:', err);
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
