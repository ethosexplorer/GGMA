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
  { id: 'fed_basic', name: 'Federal Basic', monthlyPrice: 9999, annualPrice: 101990, bestFor: 'Single federal agency pilot', contractType: '1-year lease' },
  { id: 'fed_pro', name: 'Federal Pro', monthlyPrice: 24999, annualPrice: 254990, bestFor: 'Multi-agency coordination', contractType: '1–2 year lease' },
  { id: 'fed_enterprise', name: 'Federal Enterprise', monthlyPrice: 0, annualPrice: 'Custom', bestFor: 'Full federal oversight', contractType: '2–5 year contract' }
];

export const STATE_PLANS: SubscriptionPlan[] = [
  { id: 'state_basic', name: 'State Basic', monthlyPrice: 2999, annualPrice: 30590, bestFor: 'Smaller states or pilots', contractType: '1-year lease' },
  { id: 'state_pro', name: 'State Pro', monthlyPrice: 7999, annualPrice: 81590, bestFor: 'Most state agencies', contractType: '1–2 year lease' },
  { id: 'state_enterprise', name: 'State Enterprise', monthlyPrice: 0, annualPrice: 'Custom', bestFor: 'Large/complex states', contractType: '2–5 year lease' }
];

export const ENFORCEMENT_PLANS: SubscriptionPlan[] = [
  { id: 'enf_basic', name: 'Enforcement Basic', monthlyPrice: 999, annualPrice: 10190, bestFor: 'Local / County Law Enforcement' },
  { id: 'enf_pro', name: 'Enforcement Pro', monthlyPrice: 2999, annualPrice: 30590, bestFor: 'State-Level Enforcement Units' },
  { id: 'enf_enterprise', name: 'Enforcement Enterprise', monthlyPrice: 0, annualPrice: 'Custom', bestFor: 'Large Multi-Agency or State-Wide' }
];

export const PROVIDER_PLANS: SubscriptionPlan[] = [
  { id: 'prov_basic', name: 'Provider Basic', monthlyPrice: 99, annualPrice: 1009, aiLevel: 'Gemini Flash + Basic Sylara', tokensMonth: '500,000' },
  { id: 'prov_med', name: 'Provider Medium', monthlyPrice: 249, annualPrice: 2539, aiLevel: 'Gemini Flash + Enhanced Sylara', tokensMonth: '2,000,000' },
  { id: 'prov_full', name: 'Provider Full AI', monthlyPrice: 499, annualPrice: 5090, aiLevel: 'Full Sylara + Larry', tokensMonth: 'Unlimited' }
];

export const ATTORNEY_PLANS: SubscriptionPlan[] = [
  { id: 'att_basic', name: 'Attorney Basic', monthlyPrice: 149, annualPrice: 1519, aiLevel: 'Gemini Flash + Basic Sylara', tokensMonth: '500,000' },
  { id: 'att_med', name: 'Attorney Medium', monthlyPrice: 349, annualPrice: 3559, aiLevel: 'Gemini Flash + Enhanced Sylara', tokensMonth: '2,000,000' },
  { id: 'att_full', name: 'Attorney Full AI', monthlyPrice: 699, annualPrice: 7129, aiLevel: 'Full Sylara + Larry', tokensMonth: 'Unlimited' }
];

export const B2C_PLANS: SubscriptionPlan[] = [
  { id: 'b2c_basic', name: 'B2C Basic', monthlyPrice: 49, annualPrice: 499, aiLevel: 'Gemini Flash + Basic Sylara', tokensMonth: '500,000' },
  { id: 'b2c_med', name: 'B2C Medium', monthlyPrice: 99, annualPrice: 1009, aiLevel: 'Gemini Flash + Enhanced Sylara', tokensMonth: '1,500,000' },
  { id: 'b2c_full', name: 'B2C Full AI', monthlyPrice: 199, annualPrice: 2029, aiLevel: 'Full Sylara + Larry', tokensMonth: 'Unlimited' }
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

export const getPlansForRole = (role: string, businessType: 'cannabis' | 'traditional', jurisdiction: string): SubscriptionPlan[] => {
  switch (role) {
    case 'user': return B2C_PLANS;
    case 'provider': return PROVIDER_PLANS;
    case 'attorney': return ATTORNEY_PLANS;
    case 'business': return businessType === 'cannabis' ? CANNABIS_B2B_PLANS : TRADITIONAL_B2B_PLANS;
    case 'regulator':
      if (jurisdiction === 'Federal') return FEDERAL_PLANS;
      if (jurisdiction === 'State') return STATE_PLANS;
      return ENFORCEMENT_PLANS; // County / Municipal
    default: return [];
  }
};

export const getAddOnsForRole = (role: string, businessType: 'cannabis' | 'traditional'): AddOn[] => {
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
    ...ATTORNEY_PLANS,
    ...B2C_PLANS,
  ];
};

export const getAllAddonsForLookup = (): AddOn[] => {
  return [
    ...COMMON_B2B_ADDONS,
    ...CANNABIS_ADDONS,
    ...ATTORNEY_ADDONS,
  ];
};

