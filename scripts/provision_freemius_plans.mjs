#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════
 * GGMA — Freemius Plan Provisioning Script (v4 — Developer Scope)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Implements Freemius HMAC-SHA256 auth directly (bypasses buggy SDK).
 * Uses DEVELOPER scope with developer credentials for full write access.
 *
 * Usage:
 *   node scripts/provision_freemius_plans.mjs              # Live run
 *   node scripts/provision_freemius_plans.mjs --dry-run    # Preview only
 * ═══════════════════════════════════════════════════════════════
 */

import crypto from 'crypto';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CONFIGURATION ───────────────────────────────────────────
const API_BASE = 'https://api.freemius.com';
const DEVELOPER_ID = '32380';
const PRODUCT_ID = '31063';
const PUBLIC_KEY = 'pk_dee2d9c1cae1d0c192ed4d277fc57';
const SECRET_KEY = 'sk_l*3ymfL8K+ID0iO}_TwOd!TOt!CsK';
const RATE_LIMIT_MS = 800;

const DRY_RUN = process.argv.includes('--dry-run');

// ─── CLOCK SYNC ──────────────────────────────────────────────
let clockDiffMs = 0;

async function syncClock() {
  const res = await fetch(`${API_BASE}/v1/ping.json`);
  const pong = await res.json();
  const serverTime = new Date(pong.timestamp).getTime();
  const localTime = Date.now();
  clockDiffMs = localTime - serverTime;
  console.log(`  Server: ${pong.timestamp}`);
  console.log(`  Local:  ${new Date(localTime).toUTCString()}`);
  console.log(`  Drift:  ${(clockDiffMs / 1000).toFixed(1)}s`);
  return clockDiffMs;
}

// ─── HMAC AUTH (matches PHP SDK exactly) ─────────────────────
// PHP: base64_encode(hash_hmac('sha256', string_to_sign, secret, TRUE))
// The Node SDK has a bug: it hex-encodes then base64-encodes (wrong).
// Correct: digest('base64') directly from HMAC.

function formatRFC2822(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  const day = days[d.getUTCDay()];
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mon = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${day}, ${dd} ${mon} ${year} ${hh}:${mm}:${ss} +0000`;
}

function signRequest(method, resourcePath, jsonBody = '') {
  const now = Date.now() - clockDiffMs;
  const date = formatRFC2822(now);
  const contentType = 'application/json';

  const contentMd5 = (['POST', 'PUT'].includes(method) && jsonBody)
    ? crypto.createHash('md5').update(jsonBody).digest('hex')
    : '';

  const stringToSign = [method, contentMd5, contentType, date, resourcePath].join('\n');

  // Freemius expects: hex-encode the HMAC-SHA256, then base64url-encode that hex string
  const hexDigest = crypto.createHmac('sha256', SECRET_KEY)
    .update(stringToSign)
    .digest('hex');
  const signature = Buffer.from(hexDigest)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  const authorization = `FS ${DEVELOPER_ID}:${PUBLIC_KEY}:${signature}`;

  return { date, authorization, contentMd5, contentType };
}

// ─── API CALL ────────────────────────────────────────────────

let apiCallCount = 0;

async function apiCall(method, subPath, body = null) {
  apiCallCount++;
  const resourcePath = `/v1/developers/${DEVELOPER_ID}/plugins/${PRODUCT_ID}${subPath}`;
  const url = `${API_BASE}${resourcePath}`;
  const jsonBody = body ? JSON.stringify(body) : '';

  const auth = signRequest(method, resourcePath, jsonBody);

  const headers = {
    'Authorization': auth.authorization,
    'Date': auth.date,
    'Content-Type': auth.contentType,
    'Accept': '*/*',
  };
  if (auth.contentMd5) headers['Content-MD5'] = auth.contentMd5;

  const opts = { method, headers };
  if (body && ['POST', 'PUT'].includes(method)) {
    opts.body = jsonBody;
    headers['Content-Length'] = String(Buffer.byteLength(jsonBody));
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!res.ok) {
    const errMsg = data?.error?.message || data?.error?.type || JSON.stringify(data?.error) || `HTTP ${res.status}`;
    throw new Error(`${res.status}: ${errMsg}`);
  }

  return data;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));


// ─── ALL PLAN DEFINITIONS ────────────────────────────────────

const ALL_PLANS = [
  // ══════ PATIENT (B2C) ══════
  { name: 'b2c_basic', title: 'B2C Basic', category: 'Patient (B2C)', description: 'Patient-level basic plan — Gemini Flash + Basic Sylara AI guidance with 500,000 tokens/month.', monthly: 49.99, annual: 499, trial: 30, features: ['Gemini Flash + Basic Sylara AI', '500,000 AI tokens/month', 'Medical card management', 'Provider directory access', 'Basic document vault', 'Community access'] },
  { name: 'b2c_med', title: 'B2C Medium', category: 'Patient (B2C)', description: 'Enhanced patient plan — Gemini Flash + Enhanced Sylara with 1,500,000 tokens/month.', monthly: 99, annual: 1009, trial: 30, features: ['Gemini Flash + Enhanced Sylara AI', '1,500,000 AI tokens/month', 'Everything in B2C Basic', 'Priority provider matching', 'Advanced health insights', 'Expanded document vault'] },
  { name: 'b2c_full', title: 'B2C Full AI', category: 'Patient (B2C)', description: 'Full AI patient plan — unlimited Sylara + Larry enforcement with unlimited tokens.', monthly: 199, annual: 2029, trial: 30, features: ['Full Sylara + Larry AI', 'Unlimited AI tokens/month', 'Everything in B2C Medium', 'Personal AI agent', 'Advanced compliance tools', 'Premium support'] },

  // ══════ CARE WALLET ══════
  { name: 'cw_bronze', title: 'Care Wallet Bronze', category: 'Care Wallet', description: 'Free tier — basic Care Wallet access with cash loading and ecosystem spending.', monthly: 0, annual: 0, trial: 0, features: ['Basic Care Wallet access', 'Load funds via cash', 'Spend inside ecosystem', 'Basic transaction history', 'Larry silent compliance checks'] },
  { name: 'cw_silver', title: 'Care Wallet Silver', category: 'Care Wallet', description: 'Virtual Card via NomadCash, spending limits, and categorized tracking.', monthly: 19, annual: 190, trial: 0, features: ['Everything in Bronze', 'Virtual Card via NomadCash', 'Spending limits & categories', 'Categorized transaction tracking', 'Spending insights'] },
  { name: 'cw_gold', title: 'Care Wallet Gold', category: 'Care Wallet', description: 'Sylara AI-guided spending insights + Larry proactive violation prevention.', monthly: 49, annual: 490, trial: 0, features: ['Everything in Silver', 'AI-guided spending insights (Sylara)', 'Smart balance alerts', 'Advanced analytics & reports', 'Larry proactive violation prevention'] },
  { name: 'cw_platinum', title: 'Care Wallet Platinum', category: 'Care Wallet', description: 'Multiple virtual cards, role-based usage, full financial dashboard.', monthly: 99, annual: 990, trial: 0, features: ['Everything in Gold', 'Multiple virtual cards', 'Role-based card usage', 'Full financial dashboard', 'Sylara active decision support', 'Larry real-time enforcement'] },

  // ══════ CANNABIS B2B ══════
  { name: 'b2bc_starter', title: 'Cannabis B2B Starter', category: 'Cannabis B2B', description: 'Single-location dispensaries — replaces standalone POS + Metrc at lower cost.', monthly: 199, annual: 1990, trial: 14, features: ['Full SINC POS system', 'Real-time Metrc seed-to-sale sync', 'Basic compliance dashboard', 'Inventory tracking', 'Larry passive compliance monitoring', 'Sylara AI workflow assistance', 'Standard reporting', 'Single-location, up to 5 users'] },
  { name: 'b2bc_pro', title: 'Cannabis B2B Professional', category: 'Cannabis B2B', description: 'Growing dispensaries & multi-location operators — all-in-one POS + compliance + AI.', monthly: 249, annual: 2490, trial: 14, features: ['Everything in Starter', 'Advanced POS features', 'Larry real-time compliance alerts', 'Multi-location dashboard (up to 5)', 'Unlimited user accounts', 'Automated compliance reports', 'Sales analytics + tax reconciliation'] },
  { name: 'b2bc_enterprise', title: 'Cannabis B2B Enterprise', category: 'Cannabis B2B', description: 'Multi-state operators & MSOs — complete seed-to-sale + POS + AI compliance engine.', monthly: 499, annual: 4990, trial: 14, features: ['Everything in Professional', 'White-label POS', 'Unlimited locations', 'Larry enforcement + audit readiness', 'Full licensing lifecycle', 'Sylara predictive automation', 'Care Wallet integration', 'Dedicated account manager + SLA'] },

  // ══════ TRADITIONAL B2B ══════
  { name: 'b2bt_basic', title: 'Traditional B2B Basic', category: 'Traditional B2B', description: 'Small businesses & startups — Basic Sylara Guidance + Alerts.', monthly: 99, annual: 1009, trial: 14, features: ['Basic Sylara Guidance + Alerts', 'Core business dashboard', 'Standard reporting'] },
  { name: 'b2bt_medium', title: 'Traditional B2B Medium', category: 'Traditional B2B', description: 'Growing companies — Full Sylara + Larry Enforcement.', monthly: 299, annual: 3059, trial: 14, features: ['Full Sylara + Larry Enforcement', 'Advanced business tools', 'Multi-user access', 'Compliance monitoring'] },
  { name: 'b2bt_full', title: 'Traditional B2B Full AI', category: 'Traditional B2B', description: 'Established & scaling businesses — Unlimited Sylara + Larry + Custom Bots.', monthly: 599, annual: 6119, trial: 14, features: ['Unlimited Sylara + Larry + Custom Bots', 'Enterprise dashboard', 'Custom integrations', 'Dedicated support'] },

  // ══════ CANNABIS BACKOFFICE ══════
  { name: 'cannabis_basic', title: 'Cannabis Backoffice Basic', category: 'Cannabis Backoffice', description: 'Core Backoffice Ops + Larry Alerts + Metrc Sync.', monthly: 199, annual: 2029, trial: 14, features: ['Core Backoffice Ops', 'Basic Larry Alerts', 'Metrc Sync', 'Virtual Attendant'] },
  { name: 'cannabis_pro', title: 'Cannabis Backoffice Pro', category: 'Cannabis Backoffice', description: 'Full Larry Enforcement + Multi-location admin.', monthly: 499, annual: 5090, trial: 14, features: ['Full Larry Enforcement', 'Multi-location admin', 'Audit Vault', 'Advanced compliance'] },
  { name: 'cannabis_enterprise', title: 'Cannabis Backoffice Enterprise', category: 'Cannabis Backoffice', description: 'Unlimited custom bots + closed-loop infrastructure.', monthly: 999, annual: 10190, trial: 14, features: ['Unlimited custom bots', 'Full closed-loop infrastructure', 'Branded Virtual Attendant', 'Unlimited locations'] },

  // ══════ GENERAL BACKOFFICE ══════
  { name: 'non_cannabis_basic', title: 'General Backoffice Basic', category: 'General Backoffice', description: 'Basic Sylara Guidance + Business Rules.', monthly: 149, annual: 1519, trial: 14, features: ['Core Admin Support', 'Basic Workflow Automation', 'Virtual Attendant'] },
  { name: 'non_cannabis_pro', title: 'General Backoffice Pro', category: 'General Backoffice', description: 'Advanced Sylara + Larry Enforcement.', monthly: 399, annual: 4069, trial: 14, features: ['Multi-user workflows', 'Automated CRM pipelines', 'Performance tracking'] },
  { name: 'non_cannabis_enterprise', title: 'General Backoffice Enterprise', category: 'General Backoffice', description: 'Unlimited Sylara + Larry + Custom AI Bots.', monthly: 799, annual: 8149, trial: 14, features: ['End-to-end business ops', 'Multi-location support', 'Growth optimization', 'Custom AI bots'] },

  // ══════ PROVIDER ══════
  { name: 'prov_basic', title: 'Provider Basic', category: 'Provider', description: '500,000 tokens/month for medical providers.', monthly: 99, annual: 1009, trial: 14, features: ['Gemini Flash + Basic Sylara', '500,000 tokens/month', 'Patient management', 'Telehealth tools'] },
  { name: 'prov_med', title: 'Provider Medium', category: 'Provider', description: '2,000,000 tokens/month.', monthly: 249, annual: 2539, trial: 14, features: ['Gemini Flash + Enhanced Sylara', '2,000,000 tokens/month', 'Advanced patient tools', 'Compliance monitoring'] },
  { name: 'prov_full', title: 'Provider Full AI', category: 'Provider', description: 'Full Sylara + Larry — Unlimited tokens.', monthly: 499, annual: 5090, trial: 14, features: ['Full Sylara + Larry', 'Unlimited tokens', 'Full practice management', 'Priority support'] },

  // ══════ CANNABIS ATTORNEY ══════
  { name: 'cann_att_basic', title: 'Cannabis Attorney Basic', category: 'Cannabis Attorney', description: 'Cannabis Legal Marketplace Access.', monthly: 149, annual: 1519, trial: 14, features: ['Cannabis legal marketplace', 'Basic Sylara guidance', 'Client lead dashboard'] },
  { name: 'cann_att_med', title: 'Cannabis Attorney Medium', category: 'Cannabis Attorney', description: 'Enhanced Lead Access & Priority.', monthly: 349, annual: 3559, trial: 14, features: ['Enhanced lead access', 'Advanced Sylara guidance', 'Case management tools'] },
  { name: 'cann_att_full', title: 'Cannabis Attorney Full AI', category: 'Cannabis Attorney', description: 'Full Lead Dominance & Automation.', monthly: 699, annual: 7129, trial: 14, features: ['Full lead dominance', 'Larry enforcement engine', 'Predictive analytics', 'Priority support'] },

  // ══════ GENERAL ATTORNEY ══════
  { name: 'gen_att_basic', title: 'General Attorney Basic', category: 'General Attorney', description: 'General Legal Marketplace Access.', monthly: 149, annual: 1519, trial: 14, features: ['Legal marketplace access', 'Basic Sylara guidance', 'Client lead dashboard'] },
  { name: 'gen_att_med', title: 'General Attorney Medium', category: 'General Attorney', description: 'Enhanced Case Leads & Priority.', monthly: 349, annual: 3559, trial: 14, features: ['Enhanced case leads', 'Advanced Sylara guidance', 'Case management tools'] },
  { name: 'gen_att_full', title: 'General Attorney Full AI', category: 'General Attorney', description: 'Premium Case Flow & Automation.', monthly: 699, annual: 7129, trial: 14, features: ['Premium case flow', 'Larry enforcement', 'Predictive analytics', 'Priority support'] },

  // ══════ PUBLIC HEALTH / LAB ══════
  { name: 'ph_core', title: 'Lab Essentials', category: 'Public Health', description: 'Lab workflow guidance with 500K tokens/month.', monthly: 149, annual: 1499, trial: 30, features: ['Accreditation tracking', 'COA management', 'Contaminant monitoring', 'Compliance reporting', 'Sylara AI Lab guidance', 'Up to 5 users'] },
  { name: 'ph_professional', title: 'Lab Intelligence', category: 'Public Health', description: 'Full Sylara + L.A.R.R.Y. Lab Enforcement.', monthly: 499, annual: 4999, trial: 30, features: ['Everything in Essentials', 'Multi-lab oversight', 'Contaminant trending', 'L.A.R.R.Y. Enforcement', 'Outbreak mapping', 'LIMS integration'] },
  { name: 'ph_enterprise', title: 'Lab Command Center', category: 'Public Health', description: 'Unlimited AI + Custom Models.', monthly: 999, annual: 9999, trial: 30, features: ['Everything in Intelligence', 'Unlimited locations', 'National surveillance', 'Recency Index', 'FDA/USDA reporting', 'Custom AI models', 'Dedicated manager', 'White-label portal'] },

  // ══════ ENFORCEMENT ══════
  { name: 'enf_basic', title: 'Enforcement Basic', category: 'Enforcement', description: 'Basic Sylara + Larry Alert Mode.', monthly: 999, annual: 10190, trial: 14, features: ['Larry Alert Mode', 'Compliance monitoring', 'Violation tracking', 'Basic reporting'] },
  { name: 'enf_pro', title: 'Enforcement Pro', category: 'Enforcement', description: 'Full Sylara + Larry Enforcement Mode.', monthly: 2999, annual: 30590, trial: 14, features: ['Full Larry Enforcement', 'Statewide monitoring', 'Predictive risk scoring', 'Advanced analytics'] },
  { name: 'enf_enterprise', title: 'Enforcement Enterprise', category: 'Enforcement', description: 'Unlimited Custom AI.', monthly: null, annual: null, trial: 0, isCustom: true, features: ['Unlimited Custom AI', 'Multi-agency coordination', 'National intelligence'] },

  // ══════ FINANCE AI ══════
  { name: 'fin_basic', title: 'Finance AI Basic', category: 'Finance AI', description: 'Sylara Guidance + Larry Monitor.', monthly: 1499, annual: 15290, trial: 14, features: ['Larry Monitor', 'Financial dashboards', 'Risk monitoring', 'SAM.gov checks'] },
  { name: 'fin_pro', title: 'Finance AI Pro', category: 'Finance AI', description: 'Predictive Risk + SAM.gov Tools.', monthly: 4999, annual: 50990, trial: 14, features: ['Predictive Risk', 'Financial analytics', 'Compliance automation', 'Revenue optimization'] },
  { name: 'fin_enterprise', title: 'Finance AI Enterprise', category: 'Finance AI', description: 'Full Financial Intelligence.', monthly: null, annual: null, trial: 0, isCustom: true, features: ['Full Financial Intelligence', 'Custom models', 'Enterprise integration'] },

  // ══════ COMBINED ══════
  { name: 'combo_basic', title: 'Combined Enforcement + Finance Basic', category: 'Combined', description: 'Rapid Testing + Basic Finance AI.', monthly: 2299, annual: 23450, trial: 14, features: ['Rapid Testing + Finance AI', 'Combined dashboards', 'Dual monitoring'] },
  { name: 'combo_pro', title: 'Combined Enforcement + Finance Pro', category: 'Combined', description: 'Recency Forecasting + Predictive Finance.', monthly: 6999, annual: 71390, trial: 14, features: ['Recency Forecasting', 'Statewide intelligence', 'Full compliance suite'] },
  { name: 'combo_enterprise', title: 'Combined Enterprise', category: 'Combined', description: 'National Intelligence + SAM.gov.', monthly: null, annual: null, trial: 0, isCustom: true, features: ['National Intelligence', 'Custom AI models', 'Enterprise SLA'] },

  // ══════ STATE AUTHORITY ══════
  { name: 'state_basic', title: 'State Authority Basic', category: 'State Authority', description: 'Unified MedPortal replacing Thentia/Complia.', monthly: 4999, annual: 50990, trial: 14, features: ['Unified MedPortal', 'License processing', 'Compliance dashboard', 'Larry monitoring', 'Metrc read-only', 'Up to 50K licenses', 'Up to 25 staff', 'FedRAMP-ready', 'Onboarding specialist'] },
  { name: 'state_pro', title: 'State Authority Pro', category: 'State Authority', description: 'Eliminates Thentia + Metrc admin contracts.', monthly: 12999, annual: 132590, trial: 14, features: ['Everything in Basic', 'Full Metrc read+write', 'Larry enforcement', 'Applicant screening', 'Revenue analytics', 'Multi-program', 'Unlimited licenses', 'Public transparency portal', 'Federal reporting'] },
  { name: 'state_enterprise', title: 'State Authority Enterprise', category: 'State Authority', description: 'Full replacement for Thentia + Metrc + custom enforcement.', monthly: null, annual: null, trial: 0, isCustom: true, features: ['Everything in Pro', 'White-label MedPortal', 'Larry unified intelligence', 'Custom AI agents', 'Policy simulator', 'Cross-agency sharing', 'SAM.gov automation', 'Dedicated manager', '24/7 support'] },

  // ══════ FEDERAL ══════
  { name: 'fed_basic', title: 'Federal Dashboard Basic', category: 'Federal', description: 'Single agency pilot — 1-Year Lease.', monthly: 9999, annual: 101990, trial: 14, features: ['Nationwide overview', 'License monitoring', 'Larry nationwide insights', 'SAM.gov checks', 'Interstate readiness', 'Up to 50 users', 'FedRAMP-ready'] },
  { name: 'fed_pro', title: 'Federal Dashboard Pro', category: 'Federal', description: 'Multi-agency coordination — 1-2 Year Lease.', monthly: 24999, annual: 254990, trial: 14, features: ['All Basic features', 'Larry predictive scoring', 'Multi-agency dashboards', 'Full SAM.gov tools', 'Cross-state traceability', 'Federal reporting', 'Unlimited users'] },
  { name: 'fed_enterprise', title: 'Federal Dashboard Enterprise', category: 'Federal', description: 'Full interagency integration — 2-5 Year Agreement.', monthly: null, annual: null, trial: 0, isCustom: true, features: ['All Pro features', 'Larry national intelligence', 'Custom federal AI bots', 'Policy impact simulator', 'Dedicated federal manager', 'Federal API integration'] },

  // ══════ EXTERNAL ADMIN ══════
  { name: 'admin_core', title: 'Core Admin Dashboard', category: 'External Admin', description: 'Basic Sylara + Routing for admins.', monthly: 79, annual: 799, trial: 0, features: ['User & role management', 'System oversight', 'Support ticket handling', 'Basic Sylara + Routing'] },

  // ══════ PARTNERS ══════
  { name: 'partner_affiliate', title: 'Brand Ambassador', category: 'Partner', description: 'Earn recurring commissions — zero inventory.', monthly: 0.99, annual: 499.90, trial: 0, features: ['30% commission (12 months)', '20% lifetime residual', 'Referral code + tracking', 'Commission dashboard', 'Co-branded materials', 'Monthly ACH payouts'] },
  { name: 'partner_reseller', title: 'Authorized Reseller', category: 'Partner', description: 'Wholesale pricing, 32-40% gross margin.', monthly: 149, annual: 1490, trial: 0, features: ['Wholesale: $149-$169/mo', '32-40% gross margin', 'White-label portal', 'Demo environment', 'Tier 1/2 support', 'Quarterly reviews', 'Priority features'] },
  { name: 'partner_strategic', title: 'Strategic Distribution Partner', category: 'Partner', description: 'Enterprise distribution with custom revenue share.', monthly: null, annual: null, trial: 0, isCustom: true, features: ['Custom wholesale pricing', 'Embedded SINC', 'Revenue share', 'Co-marketing fund', 'Dedicated engineering', 'Exclusive territory'] },
];


// ─── MAIN ────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  GGMA — Freemius Plan Provisioning (v4 Developer Scope)     ║');
  console.log(`║  Mode: ${DRY_RUN ? 'DRY RUN (preview only)          ' : 'LIVE (creating plans)            '}  ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Step 1: Sync clock
  console.log('Step 1: Syncing clock...');
  await syncClock();
  console.log('');

  // Step 2: Test auth with a GET request
  console.log('Step 2: Testing HMAC auth...');
  try {
    const plans = await apiCall('GET', '/plans.json');
    const existingPlans = plans.plans || [];
    console.log(`  ✓ Auth works! ${existingPlans.length} existing plan(s).`);
    for (const p of existingPlans) {
      console.log(`    • Plan ID ${p.id}: "${p.title}" (slug: ${p.name})`);
    }
    console.log('');

    // Step 3: Try creating a test plan to confirm write access
    if (!DRY_RUN) {
      console.log('Step 3: Testing write access...');
      try {
        const testResult = await apiCall('POST', '/plans.json', {
          title: '_test_write_access',
          name: '_test_write_access_' + Date.now(),
          description: 'Test plan — will be deleted',
          is_hidden: true,
        });
        console.log(`  ✓ Write access confirmed! Test plan ID: ${testResult.id}`);
        // Delete test plan
        try { await apiCall('DELETE', `/plans/${testResult.id}.json`); } catch { /* ignore */ }
        console.log('  ✓ Test plan cleaned up.');
      } catch (writeErr) {
        console.log(`  ✗ Write access denied: ${writeErr.message}`);
        console.log('');
        console.log('  ═══ IMPORTANT ═══');
        console.log('  Plugin-scope keys cannot create plans.');
        console.log('  You need DEVELOPER-scope credentials:');
        console.log('  1. In Freemius dashboard → click your profile (top right)');
        console.log('  2. Go to "Keys" section');
        console.log('  3. Copy your Developer ID, Public Key, and Secret Key');
        console.log('  4. Those are DIFFERENT from the product keys.');
        console.log('');
        process.exit(1);
      }
      console.log('');
    }

    // Step 4: Provision all plans
    const existingNames = new Set(existingPlans.map(p => p.name));
    console.log(`Step 4: Provisioning ${ALL_PLANS.length} plans...`);
    console.log('');

    const mapping = {};
    let created = 0, skipped = 0, failed = 0;
    let currentCat = '';

    for (const plan of ALL_PLANS) {
      if (plan.category !== currentCat) {
        currentCat = plan.category;
        console.log(`  ── ${currentCat} ──`);
      }

      if (existingNames.has(plan.name)) {
        const existing = existingPlans.find(p => p.name === plan.name);
        console.log(`  ⊘ SKIP: "${plan.title}" (exists: ID ${existing?.id})`);
        mapping[plan.name] = { freemiusPlanId: existing?.id, title: plan.title, status: 'existed' };
        skipped++;
        continue;
      }

      if (DRY_RUN) {
        const price = plan.isCustom ? 'Custom' : `$${plan.monthly}/mo`;
        console.log(`  ○ "${plan.title}" — ${price}`);
        mapping[plan.name] = { title: plan.title, status: 'dry_run' };
        continue;
      }

      try {
        // Create plan
        const planResult = await apiCall('POST', '/plans.json', {
          title: plan.title,
          name: plan.name,
          description: plan.description,
          is_hidden: plan.isCustom || false,
        });
        const planId = planResult.id;
        console.log(`  ✓ "${plan.title}" → ID: ${planId}`);
        await sleep(RATE_LIMIT_MS);

        // Create pricing
        let pricingId = null;
        if (!plan.isCustom && plan.monthly !== null) {
          try {
            const pricingResult = await apiCall('POST', `/plans/${planId}/pricing.json`, {
              licenses: 1,
              monthly_price: plan.monthly,
              annual_price: plan.annual,
              trial_period: plan.trial || 0,
            });
            pricingId = pricingResult.id;
            console.log(`    💲 $${plan.monthly}/mo $${plan.annual}/yr ${plan.trial}d trial`);
          } catch (pErr) {
            console.log(`    ⚠ Pricing: ${pErr.message}`);
          }
          await sleep(RATE_LIMIT_MS);
        }

        // Create features
        let featOk = 0;
        for (const feat of plan.features) {
          try {
            await apiCall('POST', `/plans/${planId}/features.json`, { title: feat, is_featured: true });
            featOk++;
          } catch { /* skip */ }
          await sleep(300);
        }
        console.log(`    📋 ${featOk}/${plan.features.length} features`);

        mapping[plan.name] = { freemiusPlanId: planId, freemiusPricingId: pricingId, title: plan.title, monthly: plan.monthly, annual: plan.annual, status: 'created' };
        created++;
        await sleep(RATE_LIMIT_MS);

      } catch (err) {
        console.log(`  ✗ "${plan.title}" — ${err.message}`);
        mapping[plan.name] = { title: plan.title, status: 'failed', error: err.message };
        failed++;
        await sleep(RATE_LIMIT_MS);
      }
    }

    console.log('');
    console.log('═════════════════════════════════════════════════════');
    console.log(`  ${created} created | ${skipped} skipped | ${failed} failed`);
    console.log(`  API calls: ${apiCallCount}`);
    console.log('═════════════════════════════════════════════════════');

    // Save mapping
    const mappingPath = resolve(__dirname, '..', 'freemius_plan_mapping.json');
    writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`\n✓ Mapping → ${mappingPath}`);

    // Print updated plan map code
    const hasIds = Object.values(mapping).some(v => v.freemiusPlanId);
    if (hasIds) {
      console.log('\n── FREEMIUS_PLAN_MAP for src/lib/freemius.ts ──\n');
      console.log('export const FREEMIUS_PLAN_MAP: Record<string, number> = {');
      for (const [key, val] of Object.entries(mapping)) {
        if (val.freemiusPlanId) console.log(`  '${key}': ${val.freemiusPlanId}, // ${val.title}`);
      }
      console.log('};');
    }

  } catch (authErr) {
    console.log(`  ✗ Auth failed: ${authErr.message}`);
    console.log('');
    console.log('  This likely means the keys are incomplete or the plugin scope');
    console.log('  does not support the plans endpoint.');
    console.log('');
    console.log('  Please check your Freemius dashboard:');
    console.log('  • Product Settings → Keys → verify the full Public Key and Secret Key');
    console.log('  • Or use Developer scope: My Profile → Keys → Developer ID + Keys');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});
