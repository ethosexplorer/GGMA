// ─── PRODUCT CATALOG DATA ─────────────────────────────────────────────
// Single source of truth for all GGP-OS subscription tiers, add-ons,
// services, and pricing. Used by:
//   • DashboardProductMenu (role-filtered catalog inside dashboards)
//   • Affiliate Landing Page (top 3 plans shown)
//   • SubscriptionLetterModal (plan details for agreement)
// ──────────────────────────────────────────────────────────────────────

export interface ProductTier {
  id: string;
  title: string;
  icon: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  color: string;
  tag?: string;
  tagColor?: string;
}

export interface PlanDetail {
  name: string;
  setup: string;
  training: string;
  goLive: string;
  monthly: string;
  quarterly: string;
  annual: string;
  savings?: string;
}

export interface ServiceItem {
  title: string;
  price: string;
  type: string;
  desc: string;
  icon: string;
}

export interface CareWalletTier {
  tier: string;
  price: string;
  desc: string;
}

export interface GovPlan {
  title: string;
  price: string;
  desc: string;
}

// ─── SECTION DEFINITIONS ──────────────────────────────────────────────

export type SectionId = 'platform' | 'professional' | 'lab_health' | 'health_addons' | 'rapid_testing' | 'education' | 'care_wallet' | 'government';

export const SECTION_META: Record<SectionId, { label: string; icon: string; description: string }> = {
  platform:      { label: 'Platform Subscriptions',    icon: '⚙️', description: 'Monthly, quarterly & annual SaaS subscriptions for compliance, licensing, and AI-powered operations' },
  professional:  { label: 'Professional Services',     icon: '🩺', description: 'One-time and recurring services we facilitate and collect payment for' },
  lab_health:    { label: 'Lab & Public Health',        icon: '🔬', description: 'COA management, contamination monitoring, accreditation tracking, and compliance dashboards' },
  health_addons: { label: 'Health Add-Ons',             icon: '🏥', description: 'Specialized modules for hospitals, health networks, and research institutions' },
  rapid_testing: { label: 'Rapid Testing',              icon: '📱', description: 'Field-deployable impairment testing for law enforcement, employers, testing sites, and health agencies' },
  education:     { label: 'Education',                  icon: '🎓', description: 'Training programs, compliance certifications, and continuing education for industry professionals' },
  care_wallet:   { label: 'Care Wallet',                icon: '💳', description: 'Closed-loop stored value ecosystem for compliant cannabis transactions' },
  government:    { label: 'Government',                 icon: '🏛️', description: 'High-capacity platforms for state regulators, law enforcement, and federal agencies' },
};

// ─── ROLE → SECTION VISIBILITY MAP ────────────────────────────────────

export const ROLE_SECTIONS: Record<string, SectionId[]> = {
  patient:      ['platform', 'professional', 'care_wallet', 'education', 'health_addons'],
  business:     ['platform', 'professional', 'care_wallet', 'rapid_testing', 'education'],
  provider:     ['platform', 'professional', 'care_wallet', 'health_addons', 'education'],
  attorney:     ['platform', 'professional', 'education'],
  enforcement:  ['platform', 'government', 'rapid_testing', 'lab_health', 'health_addons'],
  lab:          ['platform', 'lab_health', 'health_addons', 'rapid_testing'],
  government:   ['platform', 'government', 'lab_health', 'health_addons', 'rapid_testing', 'education'],
  advocacy:     ['platform', 'professional', 'education'],
  distributor:  ['platform', 'professional', 'care_wallet', 'rapid_testing', 'education'],
  political:    ['platform', 'government', 'lab_health', 'education'],
  admin:        ['platform', 'professional', 'lab_health', 'health_addons', 'rapid_testing', 'education', 'care_wallet', 'government'],
};

// ─── CORE PLATFORM SUBSCRIPTIONS ──────────────────────────────────────

export const PLATFORM_TIERS: ProductTier[] = [
  {
    id: 'patient', title: 'Patient / Consumer', icon: '🏥', price: '$49.99', period: '/mo', color: 'emerald',
    desc: 'Telehealth coordination, medical card management, Care Wallet, AI guidance via Sylara',
    features: ['Medical card application sync', 'Telehealth scheduling', 'Care Wallet stored value', 'Sylara AI personal assistant', 'Document vault & compliance tracker'],
  },
  {
    id: 'business', title: 'Business / Dispensary', icon: '🏢', price: '$199', period: '/mo', color: 'blue',
    desc: 'Full compliance OS with POS, Metrc sync, inventory, and Larry enforcement AI',
    features: ['SINC POS system (card-ready)', 'Real-time Metrc seed-to-sale sync', 'Inventory & barcode tracking', 'Larry AI compliance monitoring', 'Automated state reporting'],
  },
  {
    id: 'provider', title: 'Provider / Physician', icon: '🩺', price: '$99', period: '/mo', color: 'violet',
    desc: 'Patient management, telehealth consultations, recommendation workflows, and AI tools',
    features: ['Patient roster management', 'Telehealth consultation tools', 'Recommendation workflow', 'Sylara AI clinical guidance', 'Compliance & licensing tracker'],
  },
  {
    id: 'attorney', title: 'Attorney / Legal', icon: '⚖️', price: '$149', period: '/mo', color: 'amber',
    desc: 'Cannabis & general legal case management, client leads, regulatory AI, and Larry enforcement',
    features: ['Legal marketplace & lead access', 'Case management dashboard', 'Regulatory intelligence feeds', 'Larry AI legal compliance', 'Client billing & invoicing'],
  },
  {
    id: 'advocacy', title: 'Advocacy & Research', icon: '📊', price: '$79', period: '/mo', color: 'rose',
    desc: 'Health demographic trends, safety reporting, anonymized research data, and policy analysis tools',
    features: ['Anonymized health demographic data', 'Safety & outcome reporting tools', 'Policy impact analysis dashboards', 'Research data export (CSV/API)', 'Community engagement analytics'],
  },
];

export const PLATFORM_PLAN_DETAILS: PlanDetail[] = [
  { name: 'Patient / Consumer', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$49.99/mo', quarterly: '$134.97/qtr', annual: '$479.88/yr', savings: '20%' },
  { name: 'Business / Dispensary', setup: '1–2 Weeks', training: '3–5 Days', goLive: '2–3 Weeks', monthly: '$199/mo', quarterly: '$537.30/qtr', annual: '$1,910.40/yr', savings: '20%' },
  { name: 'Provider / Physician', setup: '2–3 Days', training: '1–2 Days', goLive: '1 Week', monthly: '$99/mo', quarterly: '$267.30/qtr', annual: '$950.40/yr', savings: '20%' },
  { name: 'Attorney / Legal', setup: '2–3 Days', training: '1–2 Days', goLive: '1 Week', monthly: '$149/mo', quarterly: '$402.30/qtr', annual: '$1,430.40/yr', savings: '20%' },
  { name: 'Advocacy & Research', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$79/mo', quarterly: '$213.30/qtr', annual: '$758.40/yr', savings: '20%' },
];

// ─── PROFESSIONAL SERVICES ────────────────────────────────────────────

export const PROFESSIONAL_SERVICES: ServiceItem[] = [
  { title: 'Telehealth Physician Evaluation', price: 'Varies by state', type: 'Per Visit', desc: 'Virtual physician consultation for medical cannabis recommendation. Pricing varies by provider and state jurisdiction. Includes physician evaluation and GGE processing & sync fee.', icon: '📋' },
  { title: 'AI Virtual Attendant (Sylara)', price: '$149/mo', type: 'Monthly Add-on', desc: 'Branded @TheBackOffice.com virtual receptionist powered by Sylara AI. Handles inbound calls, appointment scheduling, intake routing, and customer service across your business.', icon: '🤖' },
  { title: 'State Application Processing', price: 'Varies by state', type: 'Per Application', desc: 'We facilitate state cannabis license and medical card applications. State fees (e.g. $22.50–$104.30 in Oklahoma) are collected separately by the state authority. GGE charges a $10 processing fee.', icon: '📄' },
];

export const PROFESSIONAL_PLAN_DETAILS: PlanDetail[] = [
  { name: 'Telehealth Evaluation', setup: 'N/A', training: 'N/A', goLive: 'Per Visit', monthly: 'Per Visit', quarterly: 'N/A', annual: 'N/A' },
  { name: 'AI Virtual Attendant', setup: '3–5 Days', training: '2–3 Days', goLive: '1–2 Weeks', monthly: '$149/mo', quarterly: '$402.30/qtr', annual: '$1,430.40/yr', savings: '20%' },
  { name: 'State App Processing', setup: 'N/A', training: 'N/A', goLive: 'Per App', monthly: '$10/app', quarterly: 'N/A', annual: 'N/A' },
];

// ─── LAB & PUBLIC HEALTH ──────────────────────────────────────────────

export const LAB_HEALTH_TIERS: ProductTier[] = [
  {
    id: 'independent_lab', title: 'Independent Lab', icon: '🧪', price: '$499', period: '/mo', color: 'teal',
    tag: 'MOST POPULAR', tagColor: 'emerald',
    desc: 'Full COA management, accreditation tracking, contaminant monitoring, and multi-state compliance for licensed testing labs',
    features: ['COA upload, validation & auto-scan', 'Accreditation tracking (ISO 17025, DEA)', 'Contaminant flagging & recall alerts', 'Statewide pass rate analytics', 'Recency Index field test integration', 'Larry AI compliance monitoring'],
  },
  {
    id: 'regional_lab', title: 'Regional Lab Network', icon: '🏗️', price: '$1,499', period: '/mo', color: 'blue',
    tag: 'MULTI-SITE', tagColor: 'blue',
    desc: 'Multi-location lab network management with centralized compliance oversight and cross-facility contamination tracking',
    features: ['Everything in Independent Lab', 'Multi-facility dashboard (up to 10 labs)', 'Cross-facility contamination correlation', 'Centralized accreditation management', 'Network-wide pass rate benchmarking', 'Priority API access & data exports'],
  },
  {
    id: 'state_health', title: 'State Health Department', icon: '🏛️', price: '$4,999', period: '/mo', color: 'purple',
    tag: 'GOVERNMENT', tagColor: 'purple',
    desc: 'Statewide contamination monitoring, patient outcome tracking, outbreak detection, and recall management for state health agencies',
    features: ['GIS contamination zone mapping', 'Patient exposure tracking & notifications', 'Statewide lab compliance scorecards', 'Automated recall broadcast system', 'Source chain tracing (seed-to-sale)', 'Sylara Public Health AI assistant'],
  },
  {
    id: 'tribal_health', title: 'Tribal Health Authority', icon: '🪶', price: '$2,499', period: '/mo', color: 'amber',
    tag: 'TRIBAL SOVEREIGNTY', tagColor: 'amber',
    desc: 'Dual-jurisdiction compliance for tribal nations with federal-tribal bridge protocols and culturally integrated health data',
    features: ['Tribal compact compliance tracking', 'Federal-tribal bridge protocols', 'Sovereign health data management', 'Community exposure monitoring', 'Cultural wellness integration', 'Tribal-federal reporting automation'],
  },
];

export const LAB_HEALTH_PLAN_DETAILS: PlanDetail[] = [
  { name: 'Independent Lab', setup: '2–4 Weeks', training: '1 Week', goLive: '4–6 Weeks', monthly: '$499/mo', quarterly: '$1,347.30/qtr', annual: '$4,790.40/yr', savings: '20%' },
  { name: 'Regional Lab Network', setup: '4–6 Weeks', training: '2 Weeks', goLive: '6–8 Weeks', monthly: '$1,499/mo', quarterly: '$4,047.30/qtr', annual: '$14,390.40/yr', savings: '20%' },
  { name: 'State Health Dept', setup: '6–10 Weeks', training: '2–4 Weeks', goLive: '10–14 Weeks', monthly: '$4,999/mo', quarterly: '$13,497.30/qtr', annual: '$47,990.40/yr', savings: '20%' },
  { name: 'Tribal Health Authority', setup: '4–8 Weeks', training: '2–3 Weeks', goLive: '8–12 Weeks', monthly: '$2,499/mo', quarterly: '$6,747.30/qtr', annual: '$23,990.40/yr', savings: '20%' },
];

// ─── HEALTH ADD-ONS ───────────────────────────────────────────────────

export const HEALTH_ADDONS: ServiceItem[] = [
  { title: 'COA Validation & Auto-Scan Engine', price: '$299/mo', type: 'Add-On Module', desc: 'Upload COAs in PDF or XML format and Larry auto-validates against state limits for heavy metals, pesticide residue, microbial pathogens, and residual solvents.', icon: '📊' },
  { title: 'Contamination Response System', price: '$799/mo', type: 'Add-On Module', desc: 'Real-time GIS exposure mapping, automated patient notification via Care Wallet, source chain analysis, and coordinated recall broadcast to affected zones.', icon: '🚨' },
  { title: 'Accreditation & Compliance Tracking', price: '$199/mo', type: 'Add-On Module', desc: 'Track ISO 17025, DEA Schedule I, state licenses, and tribal compacts across all facilities. Auto-renewal alerts 90 days before expiration.', icon: '🏅' },
];

export const HEALTH_ADDONS_PLAN_DETAILS: PlanDetail[] = [
  { name: 'COA Validation Engine', setup: '1–2 Weeks', training: '2–3 Days', goLive: '2–3 Weeks', monthly: '$299/mo', quarterly: '$807.30/qtr', annual: '$2,870.40/yr', savings: '20%' },
  { name: 'Contamination Response', setup: '2–4 Weeks', training: '1 Week', goLive: '4–6 Weeks', monthly: '$799/mo', quarterly: '$2,157.30/qtr', annual: '$7,670.40/yr', savings: '20%' },
  { name: 'Accreditation Tracking', setup: '1 Week', training: '1–2 Days', goLive: '1–2 Weeks', monthly: '$199/mo', quarterly: '$537.30/qtr', annual: '$1,910.40/yr', savings: '20%' },
];

// ─── EDUCATION & CERTIFICATION ────────────────────────────────────────

export const EDUCATION_ITEMS: ServiceItem[] = [
  { title: 'Compliance Officer Certification', price: '$299', type: 'One-Time', desc: 'Comprehensive training on state-by-state cannabis regulations, Metrc compliance, OMMA licensing requirements, and federal scheduling implications.', icon: '🎓' },
  { title: 'Budtender & Staff Training', price: '$49/seat', type: 'Per Employee', desc: 'Online course covering product knowledge, patient interaction protocols, seed-to-sale tracking, POS operation, and state-specific compliance requirements.', icon: '📚' },
  { title: 'Continuing Education Portal', price: '$19/mo', type: 'Subscription', desc: 'Monthly updated courses on regulatory changes, DEA scheduling updates, new state legalization frameworks, and best practices.', icon: '📖' },
];

export const EDUCATION_PLAN_DETAILS: PlanDetail[] = [
  { name: 'Compliance Officer Cert', setup: 'Instant', training: '40 Hours', goLive: '1–2 Weeks', monthly: '$299 (one-time)', quarterly: 'N/A', annual: 'N/A' },
  { name: 'Budtender Training', setup: 'Instant', training: '8–12 Hours', goLive: '2–3 Days', monthly: '$49/seat', quarterly: 'N/A', annual: 'N/A' },
  { name: 'CE Portal', setup: 'Instant', training: 'Self-paced', goLive: 'Same Day', monthly: '$19/mo', quarterly: '$51.30/qtr', annual: '$182.40/yr', savings: '20%' },
];

// ─── CARE WALLET TIERS ────────────────────────────────────────────────

export const CARE_WALLET_TIERS: CareWalletTier[] = [
  { tier: 'Bronze', price: 'Free', desc: 'Basic wallet, cash load, ecosystem spending, silent compliance checks' },
  { tier: 'Silver', price: '$19/mo', desc: 'Virtual card via NomadCash, spending limits, categorized tracking, insights' },
  { tier: 'Gold', price: '$49/mo', desc: 'AI-guided spending (Sylara), smart alerts, advanced analytics, auto-reload' },
  { tier: 'Platinum', price: '$99/mo', desc: 'Multiple virtual cards, role-based separation, full financial dashboard, real-time Larry enforcement' },
];

export const CARE_WALLET_PLAN_DETAILS: PlanDetail[] = [
  { name: 'Bronze', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: 'Free', quarterly: 'Free', annual: 'Free' },
  { name: 'Silver', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$19/mo', quarterly: '$51.30/qtr', annual: '$182.40/yr', savings: '20%' },
  { name: 'Gold', setup: 'Instant', training: '1 Hour', goLive: 'Same Day', monthly: '$49/mo', quarterly: '$132.30/qtr', annual: '$470.40/yr', savings: '20%' },
  { name: 'Platinum', setup: '1–2 Days', training: '2–3 Hours', goLive: '1–3 Days', monthly: '$99/mo', quarterly: '$267.30/qtr', annual: '$950.40/yr', savings: '20%' },
];

// ─── GOVERNMENT & ENTERPRISE ──────────────────────────────────────────

export const GOVERNMENT_PLANS: GovPlan[] = [
  { title: 'State Authority', price: 'From $4,999/mo', desc: 'Unified licensing portal, Metrc integration, compliance monitoring, public transparency. Replaces Thentia + Metrc admin at lower cost.' },
  { title: 'Law Enforcement', price: 'From $999/mo', desc: 'Enforcement dashboards, rapid testing recency index, violation detection, inter-agency coordination, Larry AI intelligence.' },
  { title: 'Federal Agency', price: 'From $9,999/mo', desc: 'Nationwide oversight, multi-agency dashboards, interstate commerce monitoring, SAM.gov compliance, policy simulation.' },
];

export const GOVERNMENT_PLAN_DETAILS: PlanDetail[] = [
  { name: 'State Authority', setup: '8–12 Weeks', training: '4–6 Weeks', goLive: '12–16 Weeks', monthly: 'From $4,999/mo', quarterly: 'From $13,497/qtr', annual: 'From $47,990/yr', savings: '20%' },
  { name: 'Law Enforcement', setup: '4–8 Weeks', training: '2–4 Weeks', goLive: '8–12 Weeks', monthly: 'From $999/mo', quarterly: 'From $2,697/qtr', annual: 'From $9,590/yr', savings: '20%' },
  { name: 'Federal Agency', setup: '12–20 Weeks', training: '6–10 Weeks', goLive: '20–30 Weeks', monthly: 'From $9,999/mo', quarterly: 'From $26,997/qtr', annual: 'From $95,990/yr', savings: '20%' },
];

// ─── PAYMENT METHODS ──────────────────────────────────────────────────

export const ACCEPTED_PAYMENTS = ['ACH Bank Transfer', 'Debit Card', 'Credit Card (Visa/MC)', 'Care Wallet', 'Wire Transfer', 'Invoice / Net 30'];
