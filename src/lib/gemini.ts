// ═══════════════════════════════════════════════════════════════════════════════
//  GEMINI AI SERVICE — Centralized Intelligence Hub for GGP-OS
//  Handles: Chat, Intake Evaluation, Profile Summarization, Discrepancy Flagging
// ═══════════════════════════════════════════════════════════════════════════════

const API_KEY = () => import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// ─── Internal fetch wrapper ─────────────────────────────────────────────────
async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  opts?: { temperature?: number; maxTokens?: number; history?: { role: string; parts: { text: string }[] }[] }
): Promise<string> {
  const key = API_KEY();
  if (!key) {
    console.error('[Gemini] API Key missing.');
    return '[AI Offline] Configure VITE_GEMINI_API_KEY in your .env file to enable live intelligence.';
  }

  try {
    const res = await fetch(`${MODEL_ENDPOINT}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
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

    if (!res.ok) {
      const err = await res.json();
      console.error('[Gemini] API Error:', err);
      return '[AI Error] I encountered a processing error. Please try again.';
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  } catch (error) {
    console.error('[Gemini] Network error:', error);
    return '[AI Offline] Network connection to the AI engine failed. Check your connection.';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  1. SYLARA CHAT — Primary conversational AI for all portal variants
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANT_INSTRUCTIONS: Record<string, string> = {
  general:
    'You are Sylara, an advanced AI Intake Agent for the Global Green Hybrid Platform (GGHP). You are professional, concise, and highly knowledgeable about cannabis compliance, licensing, and medical card intake. Keep responses conversational but formal. Do not use markdown headers.',
  'med-card':
    'You are Sylara, guiding patients through the GGMA medical card intake process. You know all 50 state cannabis programs, OMMA regulations, fee schedules, and physician consultation workflows. Be warm, precise, and compliance-aware.',
  ggma:
    'You are Sylara, the GGMA Sector Intake Agent. You handle regulatory onboarding, card processing, and registry management for Global Green Enterprise Inc. You are a Validated Metrc Integrator.',
  business:
    'You are Sylara, the Intake Agent for commercial cannabis entities. You help cultivators, dispensaries, and attorneys navigate state compliance (Metrc integration, 280E tax, OMMA tiered licensing) and banking regulations.',
  rip:
    'You are Sylara, the intake coordinator for the Real-time Intelligence & Policing (RIP) portal. You interface with law enforcement and the L.A.R.R.Y Enforcement Engine. You provide strict, compliance-focused oversight regarding roadside swab testing, evidentiary chain of custody, and DUI checkpoint protocols.',
  sinc:
    'You are Sylara, managing the SINC Compliance Infrastructure. You ensure audit trails, encrypted records, network integrity across jurisdictions, and Metrc seed-to-sale synchronization.',
};

export const generateGeminiResponse = async (
  prompt: string,
  variant: 'med-card' | 'business' | 'general' | 'ggma' | 'rip' | 'sinc' = 'general',
  history: { role: string; text: string }[] = []
): Promise<string> => {
  const systemInstruction = VARIANT_INSTRUCTIONS[variant] || VARIANT_INSTRUCTIONS.general;

  const formattedHistory = history
    .filter((m) => m.text && m.text.trim().length > 0)
    .map((msg) => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

  return callGemini(systemInstruction, prompt, { history: formattedHistory });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  2. INTAKE EVALUATION — AI-driven screening of patient/business intake data
// ═══════════════════════════════════════════════════════════════════════════════

export interface IntakeData {
  fullName: string;
  state: string;
  licenseType: string;
  dob?: string;
  isResident?: boolean;
  medicalConditions?: string[];
  businessType?: string;
  metrcLicense?: string;
}

export const evaluateIntake = async (intake: IntakeData): Promise<string> => {
  const sysPrompt =
    'You are L.A.R.R.Y, the Licensing Authority & Regulatory Review sYstem for GGP-OS. ' +
    'Given an intake submission, evaluate regulatory eligibility. Check: (1) state residency requirements, ' +
    '(2) license type validity for the applicant category, (3) missing or suspicious data fields, ' +
    '(4) known compliance red flags. Respond with a structured assessment: ELIGIBLE / NEEDS REVIEW / FLAGGED, ' +
    'followed by a brief explanation. Be concise (3-5 sentences). Do not use markdown headers.';

  const prompt =
    `Evaluate this intake submission:\n` +
    `Name: ${intake.fullName}\n` +
    `State: ${intake.state}\n` +
    `License Type: ${intake.licenseType}\n` +
    `DOB: ${intake.dob || 'Not provided'}\n` +
    `Resident: ${intake.isResident !== undefined ? (intake.isResident ? 'Yes' : 'No') : 'Unknown'}\n` +
    `Medical Conditions: ${intake.medicalConditions?.join(', ') || 'None listed'}\n` +
    `Business Type: ${intake.businessType || 'N/A'}\n` +
    `Metrc License: ${intake.metrcLicense || 'N/A'}`;

  return callGemini(sysPrompt, prompt, { temperature: 0.3, maxTokens: 400 });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  3. PATIENT PROFILE SUMMARIZATION — Executive summary for oversight dashboards
// ═══════════════════════════════════════════════════════════════════════════════

export interface PatientProfile {
  fullName: string;
  state: string;
  licenseType: string;
  licenseExpiry?: string;
  c3Score?: number;
  walletBalance?: number;
  lastActivity?: string;
  complianceFlags?: string[];
  transactionCount?: number;
}

export const summarizePatientProfile = async (profile: PatientProfile): Promise<string> => {
  const sysPrompt =
    'You are Sylara, generating executive profile summaries for the GGP-OS Founder Dashboard. ' +
    'Given patient profile data, produce a concise 3-4 sentence summary covering: compliance status, ' +
    'engagement level (based on C3 score and transactions), any risk indicators, and a recommended action. ' +
    'Use professional, direct language. Do not use markdown headers.';

  const prompt =
    `Summarize this patient profile:\n` +
    `Name: ${profile.fullName}\n` +
    `State: ${profile.state}\n` +
    `License: ${profile.licenseType} (Expires: ${profile.licenseExpiry || 'Unknown'})\n` +
    `C3 Score: ${profile.c3Score ?? 'N/A'}/100\n` +
    `Wallet Balance: $${profile.walletBalance?.toFixed(2) ?? '0.00'}\n` +
    `Last Activity: ${profile.lastActivity || 'Unknown'}\n` +
    `Transactions: ${profile.transactionCount ?? 0}\n` +
    `Compliance Flags: ${profile.complianceFlags?.join(', ') || 'None'}`;

  return callGemini(sysPrompt, prompt, { temperature: 0.4, maxTokens: 300 });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  4. L.A.R.R.Y DISCREPANCY FLAGGING — Real-time anomaly detection
// ═══════════════════════════════════════════════════════════════════════════════

export interface ComplianceRecord {
  entityName: string;
  entityType: 'patient' | 'dispensary' | 'cultivator' | 'processor' | 'lab';
  state: string;
  metrcStatus?: string;
  inventoryDelta?: string; // e.g. "-42 units unaccounted"
  salesVolume?: string;    // e.g. "$128,000 this month"
  flagReason?: string;     // reason for review
  previousViolations?: number;
}

export const flagDiscrepancy = async (record: ComplianceRecord): Promise<string> => {
  const sysPrompt =
    'You are L.A.R.R.Y, the Enforcement Engine for GGP-OS. You analyze compliance records for ' +
    'cannabis-licensed entities and flag discrepancies. Evaluate: (1) inventory mismatches against Metrc, ' +
    '(2) unusual sales volume spikes, (3) prior violation history, (4) license status anomalies. ' +
    'Respond with a risk level (LOW / MEDIUM / HIGH / CRITICAL) and a 2-3 sentence enforcement recommendation. ' +
    'Be direct and authoritative. Do not use markdown headers.';

  const prompt =
    `Analyze this compliance record:\n` +
    `Entity: ${record.entityName} (${record.entityType})\n` +
    `State: ${record.state}\n` +
    `Metrc Status: ${record.metrcStatus || 'Unknown'}\n` +
    `Inventory Delta: ${record.inventoryDelta || 'None reported'}\n` +
    `Sales Volume: ${record.salesVolume || 'N/A'}\n` +
    `Flag Reason: ${record.flagReason || 'Routine audit'}\n` +
    `Previous Violations: ${record.previousViolations ?? 0}`;

  return callGemini(sysPrompt, prompt, { temperature: 0.2, maxTokens: 350 });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  5. REVENUE INTELLIGENCE — AI-driven financial insight for Founder Ledger
// ═══════════════════════════════════════════════════════════════════════════════

export interface RevenueStream {
  name: string;
  grossRevenue: string;
  netProfit: string;
  status: string;
  trend?: string;
}

export const analyzeRevenueStreams = async (streams: RevenueStream[]): Promise<string> => {
  const sysPrompt =
    'You are Sylara, performing financial analysis for the GGP-OS Founder Dashboard (QuickBooks Core Ledger). ' +
    'Given a list of revenue streams, provide a brief executive summary (4-6 sentences) covering: ' +
    'top-performing streams, underperforming or "In Setup" streams that need attention, overall revenue health, ' +
    'and one actionable recommendation. Be precise with numbers. Do not use markdown headers.';

  const streamList = streams
    .map((s) => `• ${s.name}: Gross ${s.grossRevenue}, Net ${s.netProfit} [${s.status}]`)
    .join('\n');

  return callGemini(sysPrompt, `Analyze these revenue streams:\n${streamList}`, {
    temperature: 0.5,
    maxTokens: 400,
  });
};

