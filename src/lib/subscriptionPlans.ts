export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number | 'Custom';
  bestFor?: string;
  aiLevel?: string;
  contractType?: string;
  tokensMonth?: string;
  features?: string[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  per?: string; // e.g. "integration", "additional state"
}

export const CANNABIS_B2B_PLANS: SubscriptionPlan[] = [
  { 
    id: 'b2bc_basic', 
    name: 'Basic', 
    monthlyPrice: 299, 
    annualPrice: 2990, 
    bestFor: 'Single-location operators', 
    aiLevel: 'Basic Sylara + Larry Guidance',
    features: [
      'Business Operations Dashboard (daily ops, basic inventory + transaction tracking)',
      'Larry (Cannabis): basic compliance monitoring + state requirement guidance',
      'Basic licensing visibility + compliance reminders',
      'Sylara AI: assists with workflows + questions',
      'Basic reporting + transaction visibility'
    ]
  },
  { 
    id: 'b2bc_pro', 
    name: 'Medium', 
    monthlyPrice: 699, 
    annualPrice: 6990, 
    bestFor: 'Growing / multi-location operators', 
    aiLevel: 'Real-time Alerts + Automation',
    features: [
      'Everything in Basic',
      'Enhanced inventory + sales tracking',
      'Multi-user access',
      'Larry: real-time compliance alerts + violation detection',
      'Automated compliance reports + renewal tracking',
      'Sylara: workflow automation + smarter guidance',
      'Performance dashboard + compliance scoring'
    ]
  },
  { 
    id: 'b2bc_enterprise', 
    name: 'Full AI', 
    monthlyPrice: 1499, 
    annualPrice: 14990, 
    bestFor: 'Scalable End-to-End Management', 
    aiLevel: 'End-to-End Automation & Real-time Action',
    features: [
      'Everything in Medium',
      'End-to-end business management (multi-location support)',
      'Larry: real-time enforcement + audit readiness + automated actions',
      'Full licensing lifecycle (apply → manage → renew)',
      'Sylara: full business assistant + decision support + automation',
      'Revenue analytics, risk analysis, predictive insights'
    ]
  }
];

export const TRADITIONAL_B2B_PLANS: SubscriptionPlan[] = [
  { id: 'b2bt_basic', name: 'Basic', monthlyPrice: 99, annualPrice: 1009, bestFor: 'Small businesses & startups', aiLevel: 'Basic Sylara Guidance + Alerts' },
  { id: 'b2bt_medium', name: 'Medium', monthlyPrice: 299, annualPrice: 3059, bestFor: 'Growing companies', aiLevel: 'Full Sylara + Larry Enforcement' },
  { id: 'b2bt_full', name: 'Full AI', monthlyPrice: 599, annualPrice: 6119, bestFor: 'Established & scaling businesses', aiLevel: 'Unlimited Sylara + Larry + Custom Bots' }
];

export const FEDERAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'fed_basic',
    name: 'Federal Dashboard Basic',
    monthlyPrice: 9999,
    annualPrice: 101990,
    bestFor: 'Single federal agency pilot (DEA, FDA, HHS)',
    contractType: '1-Year Lease',
    aiLevel: 'Basic Sylara Guidance + Larry Alert Mode',
    features: [
      'Nationwide real-time overview of licensed cannabis operations across all legal states',
      'Aggregated license and operator monitoring',
      'Basic compliance and violation trend reporting',
      'Larry (Cannabis): basic nationwide compliance insights + flagged risks',
      'SAM.gov eligibility checks + entity matching',
      'Interstate commerce readiness view',
      'Exportable national reports + state-by-state comparisons',
      'Up to 50 federal user accounts',
      'Secure role-based access with FedRAMP-ready controls',
    ]
  },
  {
    id: 'fed_pro',
    name: 'Federal Dashboard Pro',
    monthlyPrice: 24999,
    annualPrice: 254990,
    bestFor: 'Multi-agency coordination (DEA + FDA + DOJ)',
    contractType: '1–2 Year Lease',
    aiLevel: 'Full Sylara Guidance + Larry Enforcement Mode',
    features: [
      'All Basic features',
      'Larry predictive risk scoring + proactive national alerts',
      'Multi-agency shared dashboards + unified visibility',
      'Full SAM.gov compliance tools + grant cross-reference',
      'Aggregated rapid testing Recency Index trends + anomaly detection',
      'Cross-state traceability and supply chain visibility',
      'Interstate enforcement insights + corridor monitoring',
      'Automated federal reporting and audit support',
      'Unlimited users across participating agencies',
      'Basic predictive national risk analytics',
    ]
  },
  {
    id: 'fed_enterprise',
    name: 'Federal Dashboard Enterprise',
    monthlyPrice: 0,
    annualPrice: 'Custom',
    bestFor: 'Full federal interagency integration',
    contractType: '2–5 Year Federal Agreement',
    aiLevel: 'Unlimited Sylara + Larry + Custom Federal AI',
    features: [
      'All Pro features',
      'Larry unified national intelligence engine — real-time enforcement intel',
      'Executive nationwide analytics with risk forecasting',
      'Custom AI bots for federal-specific monitoring and anomaly detection',
      'Full SAM.gov + grant compliance automation',
      'Policy impact simulator — model regulatory changes nationally',
      'Cross-agency unified dashboard and data sharing controls',
      'Rapid Testing national dashboard with automated alerts',
      'Dedicated federal program manager + custom onboarding',
      'API integration with existing federal systems',
      'Advanced custom reporting and intelligence export tools',
    ]
  }
];

export const STATE_PLANS: SubscriptionPlan[] = [
  {
    id: 'state_basic',
    name: 'State Authority Basic',
    monthlyPrice: 4999,
    annualPrice: 50990,
    bestFor: 'Smaller states, pilot programs, or single-program agencies (replaces Thentia-only licensing at a fraction of multi-vendor cost)',
    contractType: '1-Year Lease',
    aiLevel: 'Basic Sylara Guidance + Larry Alert Mode',
    features: [
      'Unified MedPortal — patient, caregiver & business licensing in one system (replaces Thentia/Complia)',
      'Real-time license application processing + automated renewal tracking',
      'Basic compliance dashboard with violation alerts',
      'Larry (Cannabis): passive compliance monitoring + flagged risk notifications',
      'Seed-to-sale visibility via Metrc API integration (read-only sync)',
      'Up to 50,000 active licenses managed',
      'Role-based access for up to 25 state staff accounts',
      'Standard reporting + exportable state compliance summaries',
      'Secure cloud hosting with FedRAMP-ready controls',
      'Dedicated onboarding specialist (first 90 days)',
    ]
  },
  {
    id: 'state_pro',
    name: 'State Authority Pro',
    monthlyPrice: 12999,
    annualPrice: 132590,
    bestFor: 'Most state regulatory agencies — eliminates need for separate Thentia ($0.35–$0.50/license/mo) + Metrc admin contracts',
    contractType: '1–2 Year Lease',
    aiLevel: 'Full Sylara Guidance + Larry Enforcement Mode',
    features: [
      'Everything in Basic',
      'Full bi-directional Metrc integration (read + write — no separate Metrc admin contract needed)',
      'Larry real-time enforcement engine — proactive violation detection + auto-flagging',
      'Advanced applicant screening + background check integration',
      'Patient & provider program oversight with telehealth monitoring',
      'Revenue, tax & economic analytics dashboard',
      'Multi-program support (Medical + Adult-Use + Hemp in one portal)',
      'Unlimited active licenses managed',
      'Unlimited state staff accounts with audit trails',
      'Public transparency portal (consumer-facing license verification)',
      'Automated federal reporting + USDA/FDA data export',
      'Quarterly strategy reviews with GGP-OS account team',
    ]
  },
  {
    id: 'state_enterprise',
    name: 'State Authority Enterprise',
    monthlyPrice: 0,
    annualPrice: 'Custom',
    bestFor: 'Large or complex states (OK, CA, CO, FL) — full replacement for Thentia + Metrc admin + custom enforcement tools',
    contractType: '2–5 Year Multi-Year Agreement (Preferred)',
    aiLevel: 'Unlimited Sylara + Larry + Custom State AI Agents',
    features: [
      'Everything in Pro',
      'Complete white-label MedPortal branded to your state agency',
      'Larry unified intelligence engine — real-time statewide enforcement + predictive risk scoring',
      'Custom AI agents trained on your state\'s specific statutes & regulations',
      'Policy impact simulator — model regulatory changes before implementation',
      'Full seed-to-sale closed-loop infrastructure (replace or augment Metrc entirely)',
      'Cross-agency data sharing with law enforcement, public health & revenue',
      'Interstate commerce readiness + reciprocity management',
      'SAM.gov compliance automation for federal grant eligibility',
      'Dedicated state program manager + 24/7 priority support',
      'Custom API integrations with existing state systems (ERP, PDMP, etc.)',
      'On-site training + annual compliance audit support',
      'Executive analytics with legislative reporting tools',
    ]
  }
];

export const EXTERNAL_ADMIN_PLANS: SubscriptionPlan[] = [
  { id: 'admin_core', name: 'Core Admin Dashboard', monthlyPrice: 79, annualPrice: 799, bestFor: 'Client-designated admins & agency staff', aiLevel: 'Basic Sylara + Routing', features: ['User & role management', 'Basic system oversight', 'Support ticket handling'] }
];

export const ADMIN_ADDONS: AddOn[] = [
  { id: 'admin_add_business', name: 'Business & Entity Operations View', price: 59, per: 'company tier' },
  { id: 'admin_add_access', name: 'User & Access Control', price: 39, per: 'month' },
  { id: 'admin_add_compliance', name: 'Compliance & Audit Oversight', price: 49, per: 'month' },
  { id: 'admin_add_support', name: 'Support & Help Desk Tools', price: 29, per: 'month' },
  { id: 'admin_add_multi', name: 'Multi-Company / Multi-Agency Management', price: 99, per: 'month' },
  { id: 'admin_add_ai', name: 'Premium AI Operational Guidance (Sylara for Admin)', price: 34.99, per: 'unlimited tokens' },
  { id: 'admin_add_reporting', name: 'Advanced Reporting & Configuration Tools', price: 39, per: 'month' }
];

export const CANNABIS_BACKOFFICE_PLANS: SubscriptionPlan[] = [
  { id: 'cannabis_basic', name: 'Cannabis Backoffice Basic', monthlyPrice: 199, annualPrice: 2029, bestFor: 'Single-location operators', aiLevel: 'Basic Sylara Guidance + Larry Alert Mode', features: ['Core Backoffice Ops', 'Basic Larry Alerts', 'Metrc Sync', 'Virtual Attendant'] },
  { id: 'cannabis_pro', name: 'Cannabis Backoffice Pro', monthlyPrice: 499, annualPrice: 5090, bestFor: 'Growing operators (up to 5 locations)', aiLevel: 'Full Sylara Guidance + Larry Enforcement Mode', features: ['Full Larry Enforcement', 'Multi-location admin', 'Audit Vault', 'Advanced compliance'] },
  { id: 'cannabis_enterprise', name: 'Cannabis Backoffice Enterprise Full AI', monthlyPrice: 999, annualPrice: 10190, bestFor: 'Multi-state operators & MSOs', aiLevel: 'Unlimited Sylara + Larry + Custom AI Bots', features: ['Unlimited custom bots', 'Full closed-loop infrastructure', 'Fully branded Virtual Attendant'] }
];

export const NON_CANNABIS_BACKOFFICE_PLANS: SubscriptionPlan[] = [
  { id: 'non_cannabis_basic', name: 'General Backoffice Basic', monthlyPrice: 149, annualPrice: 1519, bestFor: 'Small businesses / solo operators', aiLevel: 'Basic Sylara Guidance + Business Rules', features: ['Core Admin Support', 'Basic Workflow Automation', 'Virtual Attendant'] },
  { id: 'non_cannabis_pro', name: 'General Backoffice Pro', monthlyPrice: 399, annualPrice: 4069, bestFor: 'Growing businesses', aiLevel: 'Advanced Sylara + Larry General Enforcement', features: ['Multi-user workflows', 'Automated CRM pipelines', 'Performance tracking'] },
  { id: 'non_cannabis_enterprise', name: 'General Backoffice Enterprise Full AI', monthlyPrice: 799, annualPrice: 8149, bestFor: 'Scaling businesses / agencies', aiLevel: 'Unlimited Sylara + Larry + Custom AI Bots', features: ['End-to-end business ops', 'Multi-location support', 'Growth optimization'] }
];

export const STATE_ADDONS: AddOn[] = [
  { id: 'state_add_inventory', name: 'Real-Time Business & Inventory Monitoring (Metrc Overlay)', price: 15000, per: 'year' },
  { id: 'state_add_patient', name: 'Patient & Provider Program Oversight + Telehealth', price: 12000, per: 'year' },
  { id: 'state_add_risk', name: 'Risk, Violation & Predictive Enforcement (Larry Pro)', price: 18000, per: 'year' },
  { id: 'state_add_revenue', name: 'Revenue, Tax & Economic Impact Analytics', price: 20000, per: 'year' },
  { id: 'state_add_multi', name: 'Multi-Program / Multi-Jurisdiction Management', price: 25000, per: 'year' },
  { id: 'state_add_ai', name: 'Premium Sylara State AI (Unlimited Tokens + Custom Training)', price: 24000, per: 'year' },
  { id: 'state_add_reports', name: 'Advanced Reporting, Public Transparency & FOIA Tools', price: 10000, per: 'year' },
  { id: 'state_add_interstate', name: 'Interstate Commerce & Reciprocity Module', price: 15000, per: 'year' },
  { id: 'state_add_lab', name: 'Lab Testing & Public Health Integration', price: 12000, per: 'year' },
  { id: 'state_add_training', name: 'On-Site Staff Training & Annual Compliance Audit', price: 8000, per: 'engagement' }
];

export const BACKOFFICE_ADDONS: AddOn[] = [
  { id: 'bo_add_virtual', name: 'Branded @TheBackOffice.com Virtual Attendant', price: 149, per: 'month' },
  { id: 'bo_add_manager', name: 'Dedicated AI Success Manager + Custom Bot Training', price: 299, per: 'month' },
  { id: 'bo_add_integrations', name: 'Premium Integrations (Payroll, Banking, Telehealth)', price: 99, per: 'month' },
  { id: 'bo_add_support', name: 'Priority Phone Support + SLA', price: 199, per: 'month' },
  { id: 'bo_add_multistate', name: 'Multi-State Expansion Pack', price: 99, per: 'month' },
  { id: 'bo_add_callcenter', name: 'Call Center & Receptionist Tools', price: 49, per: 'month' },
  { id: 'bo_add_scheduling', name: 'Appointment & Scheduling Engine', price: 39, per: 'month' },
  { id: 'bo_add_it', name: 'IT Support & Technical Ticket System', price: 45, per: 'month' },
  { id: 'bo_add_crm', name: 'Customer / Client Relationship Management', price: 29, per: 'month' },
  { id: 'bo_add_reporting', name: 'Advanced Reporting & Analytics Tools', price: 25, per: 'month' }
];


export const PROVIDER_PLANS: SubscriptionPlan[] = [
  { id: 'prov_basic', name: 'Provider Basic', monthlyPrice: 99, annualPrice: 1009, aiLevel: 'Gemini Flash + Basic Sylara', tokensMonth: '500,000' },
  { id: 'prov_med', name: 'Provider Medium', monthlyPrice: 249, annualPrice: 2539, aiLevel: 'Gemini Flash + Enhanced Sylara', tokensMonth: '2,000,000' },
  { id: 'prov_full', name: 'Provider Full AI', monthlyPrice: 499, annualPrice: 5090, aiLevel: 'Full Sylara + Larry', tokensMonth: 'Unlimited' }
];

export const CANNABIS_ATTORNEY_PLANS: SubscriptionPlan[] = [
  { id: 'cann_att_basic', name: 'Cannabis Attorney Basic', monthlyPrice: 149, annualPrice: 1519, aiLevel: 'Gemini Flash + Basic Sylara', bestFor: 'Cannabis Legal Marketplace Access' },
  { id: 'cann_att_med', name: 'Cannabis Attorney Medium', monthlyPrice: 349, annualPrice: 3559, aiLevel: 'Gemini Flash + Enhanced Sylara', bestFor: 'Enhanced Lead Access & Priority' },
  { id: 'cann_att_full', name: 'Cannabis Attorney Full AI', monthlyPrice: 699, annualPrice: 7129, aiLevel: 'Full Sylara + Larry Enforcement', bestFor: 'Full Lead Dominance & Automation' }
];

export const GENERAL_ATTORNEY_PLANS: SubscriptionPlan[] = [
  { id: 'gen_att_basic', name: 'General Attorney Basic', monthlyPrice: 149, annualPrice: 1519, aiLevel: 'Gemini Flash + Basic Sylara', bestFor: 'General Legal Marketplace Access' },
  { id: 'gen_att_med', name: 'General Attorney Medium', monthlyPrice: 349, annualPrice: 3559, aiLevel: 'Gemini Flash + Enhanced Sylara', bestFor: 'Enhanced Case Leads & Priority' },
  { id: 'gen_att_full', name: 'General Attorney Full AI', monthlyPrice: 699, annualPrice: 7129, aiLevel: 'Full Sylara + Larry (General)', bestFor: 'Premium Case Flow & Automation' }
];

export const B2C_PLANS: SubscriptionPlan[] = [
  { id: 'b2c_basic', name: 'B2C Basic', monthlyPrice: 49, annualPrice: 499, aiLevel: 'Gemini Flash + Basic Sylara', tokensMonth: '500,000' },
  { id: 'b2c_med', name: 'B2C Medium', monthlyPrice: 99, annualPrice: 1009, aiLevel: 'Gemini Flash + Enhanced Sylara', tokensMonth: '1,500,000' },
  { id: 'b2c_full', name: 'B2C Full AI', monthlyPrice: 199, annualPrice: 2029, aiLevel: 'Full Sylara + Larry', tokensMonth: 'Unlimited' }
];

export const PUBLIC_HEALTH_PLANS: SubscriptionPlan[] = [
  { id: 'ph_core', name: 'Core Public Health & Lab Dashboard', monthlyPrice: 149, annualPrice: 1499, aiLevel: 'Basic Workflow & Accreditation', bestFor: 'Labs & public health depts' }
];

export const PUBLIC_HEALTH_ADDONS: AddOn[] = [
  { id: 'ph_add_inventory', name: 'Business & Inventory Testing View', price: 99, per: 'per connected business' },
  { id: 'ph_add_health_data', name: 'Patient & Provider Health Data Access', price: 59 },
  { id: 'ph_add_risk_monitor', name: 'Risk & Contaminant Monitoring', price: 79 },
  { id: 'ph_add_research', name: 'Research & Analytics Tools', price: 89 },
  { id: 'ph_add_multi_lab', name: 'Multi-Lab / Multi-Jurisdiction Oversight', price: 129 },
  { id: 'ph_add_ai_safety', name: 'Premium AI Safety Guidance (Sylara)', price: 54.99, per: 'unlimited tokens' },
  { id: 'ph_add_reporting', name: 'Reporting & Partnership Tools', price: 49 }
];

export const ENFORCEMENT_PLANS: SubscriptionPlan[] = [
  { id: 'enf_basic', name: 'Enforcement Basic', monthlyPrice: 999, annualPrice: 10190, aiLevel: 'Basic Sylara + Larry Alert Mode', bestFor: 'Local/County Law Enforcement' },
  { id: 'enf_pro', name: 'Enforcement Pro', monthlyPrice: 2999, annualPrice: 30590, aiLevel: 'Full Sylara + Larry Enforcement Mode', bestFor: 'State-Level Enforcement Units' },
  { id: 'enf_enterprise', name: 'Enforcement Enterprise', monthlyPrice: 0, annualPrice: 'Custom', aiLevel: 'Unlimited Custom AI', bestFor: 'Multi-Agency / National' }
];

export const FINANCE_AI_PLANS: SubscriptionPlan[] = [
  { id: 'fin_basic', name: 'Finance AI Basic', monthlyPrice: 1499, annualPrice: 15290, aiLevel: 'Sylara Guidance + Larry Monitor', bestFor: 'Small businesses / Providers' },
  { id: 'fin_pro', name: 'Finance AI Pro', monthlyPrice: 4999, annualPrice: 50990, aiLevel: 'Predictive Risk + SAM.gov Tools', bestFor: 'Mid-size operators' },
  { id: 'fin_enterprise', name: 'Finance AI Enterprise', monthlyPrice: 0, annualPrice: 'Custom', aiLevel: 'Full Financial Intelligence', bestFor: 'Large operators / States' }
];

export const COMBINED_ENF_FIN_PLANS: SubscriptionPlan[] = [
  { id: 'combo_basic', name: 'Combined Basic', monthlyPrice: 2299, annualPrice: 23450, aiLevel: 'Rapid Testing + Basic Finance AI', bestFor: 'Small operators / Local agencies' },
  { id: 'combo_pro', name: 'Combined Pro', monthlyPrice: 6999, annualPrice: 71390, aiLevel: 'Recency Forecasting + Predictive Finance', bestFor: 'Mid-size / State-level' },
  { id: 'combo_enterprise', name: 'Combined Enterprise', monthlyPrice: 0, annualPrice: 'Custom', aiLevel: 'National Intelligence + SAM.gov', bestFor: 'Large / Federal' }
];

export const COMMON_B2B_ADDONS: AddOn[] = [
  { id: 'addon_attendant', name: 'Branded @TheBackOffice.com Virtual Attendant', price: 149 },
  { id: 'addon_success_mgr', name: 'Dedicated AI Success Manager + Custom Bot Training', price: 299 },
  { id: 'addon_integrations', name: 'Premium Integrations (Payroll, Banking, CRM, etc.)', price: 99, per: 'integration' },
  { id: 'addon_phone_support', name: 'Priority Phone Support + SLA', price: 199 }
];

export const CANNABIS_ADDONS: AddOn[] = [
  { id: 'addon_multi_state', name: 'Multi-State Expansion Pack', price: 99, per: 'additional state' }
];

export const ATTORNEY_ADDONS: AddOn[] = [
  { id: 'addon_att_basic', name: 'Attorney Backoffice Basic', price: 199 },
  { id: 'addon_att_pro', name: 'Attorney Backoffice Pro', price: 399 },
  { id: 'addon_att_ent', name: 'Attorney Backoffice Enterprise', price: 699 }
];

export const FEDERAL_ADDONS: AddOn[] = [
  { id: 'addon_fed_interstate', name: 'Interstate Commerce Monitoring', price: 2999 },
  { id: 'addon_fed_research', name: 'Research & Public Health Aggregation', price: 2499 },
  { id: 'addon_fed_enforcement', name: 'Enforcement & Diversion Intelligence', price: 3999 },
  { id: 'addon_fed_economic', name: 'Tax, Banking & Economic Analytics', price: 3499 },
  { id: 'addon_fed_policy', name: 'Policy & Scheduling Scenario Tools', price: 4499 },
  { id: 'addon_fed_sylara', name: 'Premium Sylara Federal AI (Unlimited)', price: 4999 },
  { id: 'addon_fed_reporting', name: 'Advanced National Reporting & Coordination', price: 2499 },
  { id: 'addon_fed_samgov', name: 'Full SAM.gov Compliance Automation', price: 1999 },
];



export const getPlansForRole = (role: string, businessType: 'cannabis' | 'traditional', jurisdiction: string): SubscriptionPlan[] => {
  switch (role) {
    case 'user': return B2C_PLANS;
    case 'provider': return PROVIDER_PLANS;
    case 'attorney': return businessType === 'cannabis' ? CANNABIS_ATTORNEY_PLANS : GENERAL_ATTORNEY_PLANS;
    case 'health': return PUBLIC_HEALTH_PLANS;
    case 'enforcement': return [...ENFORCEMENT_PLANS, ...COMBINED_ENF_FIN_PLANS];
    case 'finance': return FINANCE_AI_PLANS;
    case 'business': return businessType === 'cannabis' ? CANNABIS_B2B_PLANS : TRADITIONAL_B2B_PLANS;
    case 'regulator':
      if (jurisdiction === 'Federal') return FEDERAL_PLANS;
      if (jurisdiction === 'State') return STATE_PLANS;
      return ENFORCEMENT_PLANS; // County / Municipal
    case 'state': return STATE_PLANS;
    case 'external_admin': return EXTERNAL_ADMIN_PLANS;
    case 'admin': return EXTERNAL_ADMIN_PLANS;
    case 'backoffice_cannabis': return CANNABIS_BACKOFFICE_PLANS;
    case 'backoffice_general': return NON_CANNABIS_BACKOFFICE_PLANS;
    case 'backoffice': return businessType === 'cannabis' ? CANNABIS_BACKOFFICE_PLANS : NON_CANNABIS_BACKOFFICE_PLANS;
    default: return [];
  }
};

export const getAddOnsForRole = (role: string, businessType: 'cannabis' | 'traditional', jurisdiction?: string): AddOn[] => {
  const addons: AddOn[] = [];
  if (role === 'business') {
    addons.push(...COMMON_B2B_ADDONS);
    if (businessType === 'cannabis') {
      addons.push(...CANNABIS_ADDONS);
    }
  }
  if (role === 'attorney') {
    addons.push(...ATTORNEY_ADDONS);
  }
  if (role === 'regulator' || role === 'federal') {
    addons.push(...FEDERAL_ADDONS);
  }
  if (role === 'regulator' && jurisdiction === 'State' || role === 'state') {
    addons.push(...STATE_ADDONS);
  }
  if (role === 'health') {
    addons.push(...PUBLIC_HEALTH_ADDONS);
  }
  if (role === 'backoffice' || role === 'backoffice_cannabis' || role === 'backoffice_general') {
    addons.push(...BACKOFFICE_ADDONS);
  }
  if (role === 'external_admin' || role === 'admin') {
    addons.push(...ADMIN_ADDONS);
  }
  return addons;
};

export const getAllPlansForLookup = (): SubscriptionPlan[] => {
  return [
    ...CANNABIS_B2B_PLANS,
    ...TRADITIONAL_B2B_PLANS,
    ...FEDERAL_PLANS,
    ...STATE_PLANS,
    ...ENFORCEMENT_PLANS,
    ...PROVIDER_PLANS,
    ...CANNABIS_ATTORNEY_PLANS,
    ...GENERAL_ATTORNEY_PLANS,
    ...PUBLIC_HEALTH_PLANS,
    ...ENFORCEMENT_PLANS,
    ...FINANCE_AI_PLANS,
    ...COMBINED_ENF_FIN_PLANS,
    ...B2C_PLANS,
    ...CARE_WALLET_PLANS,
    ...CARE_BUILDER_PLANS,
    ...CANNABIS_BACKOFFICE_PLANS,
    ...NON_CANNABIS_BACKOFFICE_PLANS,
    ...EXTERNAL_ADMIN_PLANS,
  ];
};

export const getAllAddonsForLookup = (): AddOn[] => {
  return [
    ...COMMON_B2B_ADDONS,
    ...CANNABIS_ADDONS,
    ...ATTORNEY_ADDONS,
    ...FEDERAL_ADDONS,
    ...PATIENT_ADDONS,
    ...PUBLIC_HEALTH_ADDONS,
    ...STATE_ADDONS,
    ...BACKOFFICE_ADDONS,
    ...ADMIN_ADDONS,
    ...CROSS_DASHBOARD_ADDONS,
  ];
};

// ─── CARE WALLET PLANS (Closed-Loop Stored Value) ───
export const CARE_WALLET_PLANS: SubscriptionPlan[] = [
  {
    id: 'cw_bronze', name: 'Bronze', monthlyPrice: 0, annualPrice: 0,
    bestFor: 'New users testing the system',
    aiLevel: 'Larry silent compliance only',
    features: [
      'Basic Care Wallet access',
      'Load funds via cash at approved locations',
      'Spend inside ecosystem (dispensaries, telehealth, legal, partners)',
      'Basic transaction history',
      'Larry silent compliance checks on every transaction',
    ]
  },
  {
    id: 'cw_silver', name: 'Silver', monthlyPrice: 19, annualPrice: 190,
    bestFor: 'Users who want basic control',
    aiLevel: 'Basic + Virtual Card',
    features: [
      'Everything in Bronze',
      'Virtual Card via NomadCash',
      'Controlled spending per transaction',
      'Set spending limits & categories',
      'Categorized transaction tracking',
      'Spending insights',
      'Faster transaction processing',
    ]
  },
  {
    id: 'cw_gold', name: 'Gold', monthlyPrice: 49, annualPrice: 490,
    bestFor: 'Users who want intelligence',
    aiLevel: 'Sylara AI + Larry Proactive',
    features: [
      'Everything in Silver',
      'AI-guided spending insights (Sylara)',
      'Smart balance alerts & auto-reload prompts',
      'Advanced analytics & usage reports',
      'Spending trend visualization',
      'Larry proactive violation prevention',
      'Flags anomalies automatically',
    ]
  },
  {
    id: 'cw_platinum', name: 'Platinum', monthlyPrice: 99, annualPrice: 990,
    bestFor: 'Power users & businesses',
    aiLevel: 'Full Sylara + Larry AI',
    features: [
      'Everything in Gold',
      'Multiple virtual cards',
      'Role-based card usage (personal/business separation)',
      'Full ecosystem routing across all services',
      'Full financial dashboard with behavior insights',
      'Sylara active decision support',
      'Larry real-time compliance enforcement',
      'Real-time balance intelligence',
    ]
  },
];

// ─── CARE BUILDER PLANS (Credit-Building Add-On) ───
export const CARE_BUILDER_PLANS: SubscriptionPlan[] = [
  {
    id: 'cb_basic', name: 'Care Builder Basic', monthlyPrice: 9, annualPrice: 54,
    bestFor: '6-month commitment, $50-$100/mo reload goal',
    features: [
      'Basic tracking & logging of all reload/spend activity',
      'Sylara guidance reminders',
      'Monthly progress report',
      'Positive habit milestones',
    ]
  },
  {
    id: 'cb_plus', name: 'Care Builder Plus', monthlyPrice: 19, annualPrice: 228,
    bestFor: '12-month commitment, $100-$250/mo reload goal',
    features: [
      'Everything in Basic',
      'Advanced AI insights (spending patterns, optimization)',
      'Larry auto-alerts for low balance',
      'Quarterly detailed reports',
      'Ecosystem rewards (bonus Care Points)',
    ]
  },
  {
    id: 'cb_premium', name: 'Care Builder Premium', monthlyPrice: 29, annualPrice: 348,
    bestFor: '12-24 month commitment, $250+/mo reload goal',
    features: [
      'Everything in Plus',
      'Priority support',
      'Custom "what-if" scenario modeling via Sylara',
      'Exportable audit-ready reports for future credit use',
      'Early access to new reporting features',
    ]
  },
];

// ─── STATE APPLICATION FEES (Separate from Subscriptions) ───
export const STATE_APPLICATION_FEES = {
  withStateInsurance: {
    stateFee: 20.00,
    processingFee: 2.50,
    total: 22.50,
    eligibility: 'Medicaid, Medicare, SoonerCare, 100% Veteran',
  },
  withoutStateInsurance: {
    stateFee: 100.00,
    processingFee: 4.30,
    total: 104.30,
    eligibility: 'Standard rate for all other applicants',
  },
  note: 'State fees are set by the state authority and are completely separate from GGP-OS subscription costs. No subscription is required to apply.',
};

// ─── PATIENT ADD-ONS (Modular Revenue Streams) ───
export const PATIENT_ADDONS: AddOn[] = [
  { id: 'addon_pt_provider', name: 'Provider Connection Add-on', price: 7.99 },
  { id: 'addon_pt_legal', name: 'Attorney / Legal Record Access', price: 5.99 },
  { id: 'addon_pt_ai', name: 'Premium AI Guidance (Sylara Personal)', price: 14.99 },
  { id: 'addon_pt_insights', name: 'Personal Insights & Analytics', price: 6.99 },
  { id: 'addon_pt_disposable_card', name: 'Disposable Card (Single Use)', price: 1.99 },
  { id: 'addon_pt_physical_card', name: 'Physical Card Request', price: 9.99 },
  { id: 'addon_pt_ai_agent', name: 'Personal AI Agent', price: 29.99 },
];

// ─── CROSS-DASHBOARD ADD-ONS (Master List) ───
export const CROSS_DASHBOARD_ADDONS: AddOn[] = [
  // AI & Intelligence
  { id: 'addon_x_sylara_unlimited', name: 'Premium Sylara Guidance (Unlimited)', price: 59.99 },
  { id: 'addon_x_larry_engine', name: 'Larry Enforcement Engine', price: 59.99 },
  { id: 'addon_x_sylara_exec', name: 'Sylara for Executive / Strategic', price: 59.99 },
  { id: 'addon_x_sylara_admin', name: 'Sylara for Admin / Operations', price: 34.99 },
  // Visibility & Cross-Dashboard
  { id: 'addon_x_patient_view', name: 'Patient Dashboard View', price: 149 },
  { id: 'addon_x_provider_view', name: 'Provider Dashboard View', price: 129 },
  { id: 'addon_x_attorney_view', name: 'Attorney / Legal Workspace', price: 99 },
  { id: 'addon_x_business_view', name: 'Business Portfolio View', price: 99 },
  { id: 'addon_x_investor_view', name: 'Investor / Finance Portfolio View', price: 79 },
  { id: 'addon_x_health_view', name: 'Public Health & Lab Testing View', price: 99 },
  { id: 'addon_x_exec_rollup', name: 'Executive Multi-Location Roll-up', price: 89 },
  // Compliance & Risk
  { id: 'addon_x_risk_monitor', name: 'Risk & Liability Monitoring', price: 59 },
  { id: 'addon_x_insurance_tracker', name: 'Insurance & Bonding Tracker', price: 49 },
  { id: 'addon_x_loan_compliance', name: 'Loan / Credit Compliance Tools', price: 69 },
  { id: 'addon_x_inventory_view', name: 'Real-Time Inventory & Transaction View', price: 99 },
  // Reporting & Data
  { id: 'addon_x_vault', name: 'Advanced Vault & Document Storage', price: 79 },
  { id: 'addon_x_audit_reports', name: 'One-Click Audited Reporting Suite', price: 49 },
  // Financial
  { id: 'addon_x_credit_dashboard', name: 'Credit Dashboard & Financial Wellness', price: 19 },
  // Back-Office
  { id: 'addon_x_multi_company', name: 'Multi-Company / Multi-Agency Management', price: 99 },
  { id: 'addon_x_traditional_bo', name: 'Traditional Back-Office Suite', price: 79 },
  { id: 'addon_x_help_dashboard', name: 'Help / Support Dashboard', price: 29 },
];
