/**
 * ============================================================================
 * GGP-OS SANDBOX / DEMO DATA
 * ============================================================================
 * This file contains ALL mock and hardcoded data that was previously embedded
 * directly in production components. It is permanently separated from production.
 *
 * PRODUCTION COMPONENTS: Show empty states or pull from live databases.
 * SANDBOX/DEMO MODE: Can import from this file for demo purposes.
 *
 * DO NOT import this file from any production component.
 * ============================================================================
 */

// ─── CareWalletTab (shared) ─────────────────────────────────────────────────
export const DEMO_CARE_WALLET_TRANSACTIONS = [
  { id: 1, type: 'reload', desc: 'Cash Reload — GGE Oklahoma City', amount: 200, date: '2 hours ago', location: 'GGE OKC Kiosk' },
  { id: 2, type: 'spend', desc: 'Green Leaf Dispensary — Flower', amount: -45.00, date: 'Yesterday', location: 'Tulsa, OK' },
  { id: 3, type: 'spend', desc: 'Telehealth Visit — Dr. Johnson', amount: -99.00, date: '3 days ago', location: 'Virtual' },
  { id: 4, type: 'reload', desc: 'Cash Reload — Partner Store', amount: 150, date: '5 days ago', location: 'QuikTrip #441' },
  { id: 5, type: 'spend', desc: 'Legal Consultation — Smith & Assoc.', amount: -75.00, date: '1 week ago', location: 'Virtual' },
  { id: 6, type: 'spend', desc: 'Edibles Purchase — Canna Co.', amount: -32.50, date: '1 week ago', location: 'Norman, OK' },
];

export const DEMO_RELOAD_LOCATIONS = [
  { name: 'GGE Oklahoma City Kiosk', type: 'kiosk', distance: '2.1 mi' },
  { name: 'Green Leaf Dispensary', type: 'dispensary', distance: '3.4 mi' },
  { name: 'QuikTrip #441 — Memorial', type: 'partner', distance: '0.8 mi' },
  { name: 'Cloud Nine Wellness', type: 'dispensary', distance: '5.2 mi' },
];

export const DEMO_CARE_WALLET_BALANCE = 198.50;
export const DEMO_CARE_POINTS = 742;
export const DEMO_LINE_OF_CREDIT = 5000;
export const DEMO_UTILIZED_CREDIT = 1250;

// ─── CareWalletDashboard ────────────────────────────────────────────────────
export const DEMO_CARE_WALLET_DASHBOARD_TRANSACTIONS = [
  { id: 1, type: 'reload', amount: 200, date: 'Today, 10:30 AM', merchant: 'GGP Kiosk - Tulsa', status: 'Completed' },
  { id: 2, type: 'spend', amount: 45.50, date: 'Yesterday, 04:15 PM', merchant: 'Green Leaf Wellness', status: 'Completed' },
  { id: 3, type: 'spend', amount: 120, date: 'Apr 17, 2026', merchant: 'Dr. Sarah Jenkins (Telehealth)', status: 'Completed' },
  { id: 4, type: 'reward', amount: 15, date: 'Apr 15, 2026', merchant: 'Care Points Conversion', status: 'Completed' },
];

export const DEMO_C3_FACTORS = [
  { name: 'Compassion Discipline', weight: '35%', score: 95, max: 100, status: 'Excellent', color: 'bg-emerald-500' },
  { name: 'Continuity of Engagement', weight: '25%', score: 78, max: 100, status: 'Good', color: 'bg-blue-500' },
  { name: 'Financial Habits', weight: '20%', score: 82, max: 100, status: 'Good', color: 'bg-purple-500' },
  { name: 'Community Reputation', weight: '10%', score: 91, max: 100, status: 'Excellent', color: 'bg-amber-500' },
  { name: 'Larry Compliance Grade', weight: '10%', score: 100, max: 100, status: 'Perfect', color: 'bg-teal-500' },
];

// ─── CannaCribsPage ─────────────────────────────────────────────────────────
export const DEMO_SAMPLE_PROPERTIES = [
  {
    id: 1, title: 'Green Valley Cultivation Center', type: 'Cultivation', size: '5,000 sq ft',
    location: 'Denver, CO', price: '$12,500/mo', status: 'Available', rating: 4.8,
    features: ['Climate Control', 'Security System', 'Water Filtration', 'Loading Dock'],
    image: '🌿', description: 'Premier cultivation facility with state-of-the-art climate control and fully compliant security infrastructure.',
  },
  {
    id: 2, title: 'Mountain Dispensary Suite', type: 'Retail', size: '2,200 sq ft',
    location: 'Boulder, CO', price: '$8,900/mo', status: 'Available', rating: 4.6,
    features: ['Street Frontage', 'Vault Room', 'ADA Compliant', 'Parking'],
    image: '🏔️', description: 'High-visibility retail location in downtown Boulder with built-in security vault and compliant layout.',
  },
  {
    id: 3, title: 'Emerald Processing Lab', type: 'Processing', size: '3,800 sq ft',
    location: 'Portland, OR', price: '$9,200/mo', status: 'Under Review', rating: 4.7,
    features: ['Lab Equipment', 'Ventilation', 'Clean Room', 'Waste Management'],
    image: '🧪', description: 'Fully equipped extraction and processing lab with ventilation systems meeting all state requirements.',
  },
  {
    id: 4, title: 'Sunset Distribution Hub', type: 'Distribution', size: '8,000 sq ft',
    location: 'Los Angeles, CA', price: '$18,500/mo', status: 'Available', rating: 4.9,
    features: ['Cold Storage', 'Fleet Parking', 'GPS Tracking', '24/7 Security'],
    image: '🚚', description: 'Central distribution hub with temperature-controlled storage and fleet management infrastructure.',
  },
  {
    id: 5, title: 'Heritage Grow House', type: 'Cultivation', size: '12,000 sq ft',
    location: 'Tulsa, OK', price: '$6,800/mo', status: 'Available', rating: 4.5,
    features: ['Greenhouse', 'Irrigation', 'Pest Control', 'Staff Housing'],
    image: '🌱', description: 'Large-scale greenhouse cultivation with integrated irrigation and on-site staff quarters.',
  },
  {
    id: 6, title: 'Metro Wellness Retail', type: 'Retail', size: '1,800 sq ft',
    location: 'Oklahoma City, OK', price: '$5,200/mo', status: 'Available', rating: 4.4,
    features: ['Corner Location', 'Digital Signage', 'Consultation Room', 'Safe Room'],
    image: '🏪', description: 'Prime corner retail location with digital menu board infrastructure and private consultation space.',
  },
  {
    id: 7, title: 'Alpine Testing Laboratory', type: 'Testing', size: '4,500 sq ft',
    location: 'Aspen, CO', price: '$14,000/mo', status: 'Leased', rating: 4.9,
    features: ['HPLC Equipment', 'Microbiology Lab', 'ISO Certified', 'Data Center'],
    image: '🔬', description: 'ISO-certified testing laboratory with full analytical equipment suite.',
  },
  {
    id: 8, title: 'River Road Warehouse', type: 'Storage', size: '15,000 sq ft',
    location: 'Eugene, OR', price: '$7,500/mo', status: 'Available', rating: 4.3,
    features: ['Climate Control', 'Loading Bays', 'Sprinkler System', 'Office Space'],
    image: '🏭', description: 'Large-format compliant storage warehouse with climate-controlled zones and office space.',
  },
];

// ─── ProviderDashboard ──────────────────────────────────────────────────────
export const DEMO_PATIENT_QUEUE = [
  { name: 'Sarah Wilson', age: 34, condition: 'Chronic Pain', time: '10:30 AM', status: 'Waiting' },
  { name: 'Michael Chen', age: 45, condition: 'PTSD', time: '11:00 AM', status: 'In Progress' },
  { name: 'Lisa Rodriguez', age: 28, condition: 'Anxiety', time: '11:30 AM', status: 'Scheduled' },
  { name: 'James Thompson', age: 52, condition: 'Insomnia', time: '1:00 PM', status: 'Scheduled' },
  { name: 'Emily Park', age: 39, condition: 'Epilepsy', time: '2:00 PM', status: 'Scheduled' },
];

export const DEMO_PROVIDER_TOKENS = 247;
export const DEMO_ACTIVE_PATIENTS = 12;

// ─── PublicHealthDashboard ──────────────────────────────────────────────────
export const DEMO_TIMELINE_EVENTS = [
  { date: 'Jul 18', title: 'Product Recall — Batch #4401', severity: 'Critical', status: 'Active' },
  { date: 'Jul 15', title: 'Lab Inspection — Metro Lab', severity: 'Low', status: 'Passed' },
  { date: 'Jul 12', title: 'Contamination Alert — Facility #7', severity: 'High', status: 'Resolved' },
  { date: 'Jul 8', title: 'Routine Audit — Green Valley', severity: 'Low', status: 'Completed' },
  { date: 'Jul 3', title: 'New Regulation — Pesticide Limits', severity: 'Medium', status: 'Implemented' },
  { date: 'Jun 28', title: 'Equipment Calibration Due', severity: 'Medium', status: 'Scheduled' },
];

// ─── StateAuthorityDashboard ────────────────────────────────────────────────
export const DEMO_LICENSE_APPLICATIONS = [
  { business: 'Green Leaf Dispensary', type: 'Retail', status: 'Pending', submitted: '2026-07-10' },
  { business: 'Canna Corp', type: 'Cultivation', status: 'Under Review', submitted: '2026-07-05' },
  { business: 'Mountain Extracts', type: 'Processing', status: 'Approved', submitted: '2026-06-20' },
];

export const DEMO_COMPLIANCE_STATS = {
  activeLicenses: '1,247',
  pendingApplications: '89',
  violations: '12',
  revenue: '$4.2M',
};

// ─── AuditLogsTab (old hardcoded entries) ───────────────────────────────────
export const DEMO_AUDIT_LOGS = [
  { id: 'LOG-8821', user: 'Ryan Ferrari', action: 'Executive Emergency Broadcast', entity: 'Platform Global', timestamp: '2 mins ago', status: 'Authorized', severity: 'High', details: 'Alert: Heavy Rain Expected in OK', ip: '192.168.1.42' },
  { id: 'LOG-8820', user: 'Bob Moore', action: 'State Fact Update', entity: 'California', timestamp: '15 mins ago', status: 'Completed', severity: 'Medium', details: 'Updated Compliance Standards v4.2', ip: '172.16.0.12' },
  { id: 'LOG-8819', user: 'System Engine', action: 'Automated METRC Sync', entity: 'Oklahoma Retail #4', timestamp: '45 mins ago', status: 'Success', severity: 'Low', details: 'Synced 4,208 tags across 4 facilities', ip: 'GGHP-BACKBONE-01' },
  { id: 'LOG-8818', user: 'Oversight Staff', action: 'Portal Access', entity: 'Federal Command', timestamp: '1 hour ago', status: 'Authorized', severity: 'Low', details: 'Session started for ID #992', ip: '10.0.4.19' },
  { id: 'LOG-8817', user: 'External Auditor', action: 'Document Download', entity: 'Legal Vault', timestamp: '3 hours ago', status: 'Authorized', severity: 'Medium', details: 'Downloaded P&L Trajectory 2026', ip: '45.12.8.201' },
  { id: 'LOG-8816', user: 'Unidentified User', action: 'Failed Login Attempt', entity: 'Founder Dashboard', timestamp: '5 hours ago', status: 'Denied', severity: 'Critical', details: 'Multiple password failures detected', ip: '198.51.100.1' },
];

// ─── B2B Vendor Payments ────────────────────────────────────────────────────
export const DEMO_VENDOR_PAYMENTS = [
  { name: 'Apex Cultivation LLC', type: 'Inventory Purchase', amount: 4500, status: 'Pending Approval' },
  { name: 'SecureMovers Logistics', type: 'Transport Fee', amount: 350, status: 'Scheduled' },
  { name: 'OMMA Regulatory Fees', type: 'Compliance Payment', amount: 2500, status: 'Processing' },
];

// ─── General Business Transactions ──────────────────────────────────────────
export const DEMO_GENERAL_TRANSACTIONS = [
  { id: 101, type: 'revenue', desc: 'POS Sale — Walk-in Customer #4821', amount: 127.50, date: '1 hour ago', method: 'Cash', ref: 'POS-4821' },
  { id: 102, type: 'revenue', desc: 'POS Sale — Online Order #1092', amount: 89.00, date: '3 hours ago', method: 'Card (Visa)', ref: 'POS-1092' },
  { id: 103, type: 'expense', desc: 'Vendor Payment — Green Leaf Wholesale', amount: -2400.00, date: 'Yesterday', method: 'Bank Transfer', ref: 'VND-882' },
  { id: 104, type: 'revenue', desc: 'POS Sale — Medical Patient (Care Wallet)', amount: 45.00, date: 'Yesterday', method: 'Care Wallet', ref: 'CW-9921' },
  { id: 105, type: 'expense', desc: 'OMMA License Renewal Fee', amount: -2500.00, date: '3 days ago', method: 'Bank Transfer', ref: 'OMMA-2026' },
  { id: 106, type: 'revenue', desc: 'Catering Order — Event Supply', amount: 1800.00, date: '5 days ago', method: 'Invoice', ref: 'INV-0042' },
];

// ─── Patient ApplicationsTab ────────────────────────────────────────────────
export const DEMO_PATIENT_APPLICATIONS = [
  { id: 'APP-001', type: 'New Patient Card', status: 'Submitted', submitted: '2026-07-10' },
  { id: 'APP-002', type: 'Renewal', status: 'In Review', submitted: '2026-06-25' },
];

// ─── Business ApplicationsTab ───────────────────────────────────────────────
export const DEMO_BUSINESS_APPLICATIONS = [
  { id: 'BIZ-001', type: 'Dispensary License', status: 'Pending', submitted: '2026-07-08' },
  { id: 'BIZ-002', type: 'Cultivation Permit', status: 'Under Review', submitted: '2026-06-15' },
];

// ─── Provider Directory ─────────────────────────────────────────────────────
export const DEMO_PROVIDERS = [
  { name: 'Dr. Sarah Jenkins', specialty: 'Pain Management', rating: 4.8, location: 'Tulsa, OK', accepting: true },
  { name: 'Dr. Michael Torres', specialty: 'Psychiatry', rating: 4.6, location: 'OKC, OK', accepting: true },
  { name: 'Dr. Emily Park', specialty: 'General Practice', rating: 4.7, location: 'Norman, OK', accepting: false },
];

// ─── Compliance Travel (State Reciprocity) ──────────────────────────────────
export const DEMO_RECIPROCITY_DATA = [
  { state: 'Arkansas', reciprocity: true, notes: 'Accepts OK card — 30-day limit' },
  { state: 'Missouri', reciprocity: true, notes: 'Accepts OK card — 60-day limit' },
  { state: 'Texas', reciprocity: false, notes: 'No medical cannabis program' },
  { state: 'Kansas', reciprocity: false, notes: 'No reciprocity agreement' },
];

// ─── CEYE Command Center ────────────────────────────────────────────────────
export const DEMO_CEYE_COMPLIANCE_DATA = [
  { facility: 'Green Valley #1', status: 'Compliant', lastAudit: '2026-07-01', score: 98 },
  { facility: 'Metro Dispensary', status: 'Warning', lastAudit: '2026-06-15', score: 72 },
  { facility: 'Heritage Grow', status: 'Compliant', lastAudit: '2026-07-10', score: 95 },
];

// ─── LiveExecutiveTabs ──────────────────────────────────────────────────────
export const DEMO_REVENUE_DATA = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 18200 },
  { month: 'Mar', revenue: 22100 },
  { month: 'Apr', revenue: 19800 },
  { month: 'May', revenue: 28400 },
  { month: 'Jun', revenue: 31200 },
  { month: 'Jul', revenue: 35800 },
];

// ─── Federal ReportingTab ───────────────────────────────────────────────────
export const DEMO_FEDERAL_REPORTS = [
  { id: 'RPT-001', title: 'Quarterly Compliance Report', type: 'Compliance', date: '2026-07-01' },
  { id: 'RPT-002', title: 'Tax Revenue Summary', type: 'Financial', date: '2026-06-30' },
  { id: 'RPT-003', title: 'License Activity Report', type: 'Administrative', date: '2026-06-15' },
];

// ─── Sylara Federal Queries ─────────────────────────────────────────────────
export const DEMO_SYLARA_QUERIES = [
  'What are the top 5 most-cited compliance violations in Oklahoma this quarter?',
  'Show me a breakdown of revenue by license type across all states.',
  'Compare patient enrollment trends between Oklahoma and Colorado.',
  'What is the average time-to-approval for new dispensary licenses?',
];

// ─── Lab & Public Health Intelligence (OverviewTab) ─────────────────────────
export const DEMO_LAB_KPIS = [
  { label: 'Contamination Events', value: '3', sub: '+2 this month', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: '⚠️' },
  { label: 'Active Recalls', value: '1', sub: 'Batch #882 — Microbial', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '🚨' },
  { label: 'Pending COA Uploads', value: '18', sub: 'Awaiting Larry validation', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: '📄' },
  { label: 'Statewide Pass Rate', value: '90.6%', sub: '+1.2% vs last quarter', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✅' },
  { label: 'Avg Recency Index', value: '4.2', sub: 'Normal (340 samples)', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: '🧪' },
];

export const DEMO_FACILITY_SCORECARDS = [
  { name: 'GreenLeaf Testing', state: 'OK', rate: 94, grade: 'A', trend: '↑', trendColor: 'text-emerald-500' },
  { name: 'PureTech Labs', state: 'OK', rate: 89, grade: 'B+', trend: '↓', trendColor: 'text-red-500' },
  { name: 'SafeHarvest Analytics', state: 'CO', rate: 97, grade: 'A+', trend: '↑', trendColor: 'text-emerald-500' },
  { name: 'CannaCheck Inc.', state: 'CA', rate: 82, grade: 'B-', trend: '↓', trendColor: 'text-red-500' },
  { name: 'Tribal Health Labs', state: 'OK', rate: 91, grade: 'A-', trend: '↑', trendColor: 'text-emerald-500' },
];

export const DEMO_ACCREDITATION_STATUS = [
  { lab: 'GreenLeaf', cert: 'ISO 17025', days: 267, status: 'active' },
  { lab: 'PureTech', cert: 'DEA Sched I', days: 42, status: 'renewal' },
  { lab: 'SafeHarvest', cert: 'State #4421', days: 195, status: 'active' },
  { lab: 'CannaCheck', cert: 'ISO 17025', days: -28, status: 'expired' },
  { lab: 'Tribal Health', cert: 'Compact THL-09', days: 540, status: 'active' },
];

export const DEMO_ACTIVE_RECALL = {
  batch: '#882',
  type: 'TYM Microbial Exceedance (18,400 CFU/g)',
  zones: 4,
  patientsExposed: 240,
  notified: 198,
  source: 'MedExtract Co. (processor stage)',
};

