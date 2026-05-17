// ═══════════════════════════════════════════════════════════════════════════════
//  STATE FEE SCHEDULE — Real Pricing Breakdown Per State
//  Model: Doctor/Physician Fee + GGP Processing Fee + State Application Fee = Total
//  OK is the template: Dr=$40 + GGP=$50 (up to $20 discount) + State=$22.50/$100
// ═══════════════════════════════════════════════════════════════════════════════

export interface StateFeeConfig {
  doctorFee: number;              // Physician/provider recommendation fee
  ggpProcessingFee: number;       // Our processing fee (base)
  ggpDiscountMax: number;         // Max discount we can give on processing (financial hardship)
  stateFee: number;               // State application/card fee (standard)
  stateFeeDiscount?: number;      // Reduced state fee (Medicaid/VA/low-income) if available
  totalStandard: number;          // Doctor + GGP + State (standard)
  totalDiscount: number;          // Doctor + (GGP - max discount) + State discount (if available)
  complexityTier: 'simple' | 'medium' | 'high';
  notes?: string;
  discountTriggers?: string[];    // Phrases that trigger discount offer
}

// Discount triggers — agent uses these to offer the processing discount
const DISCOUNT_TRIGGERS = ['too much', 'too expensive', 'cost high', "can't afford", 'callback', 'reschedule', 'call back', 'think about it', 'budget'];

export const STATE_FEES: Record<string, StateFeeConfig> = {
  // ─── OKLAHOMA (Template State) ─────────────────────────────────────────
  'Oklahoma': {
    doctorFee: 35,                // Dr. Jiss Mathew — was $30, +$5 increase
    ggpProcessingFee: 50,         // Our fee
    ggpDiscountMax: 20,           // Can discount up to $20
    stateFee: 104.30,             // OMMA standard
    stateFeeDiscount: 22.50,      // Medicaid/Medicare/100% disabled vet
    totalStandard: 189.30,        // 35+50+104.30
    totalDiscount: 107.50,        // 35+30+22.50 (max processing discount + state discount)
    complexityTier: 'simple',
    notes: 'OMMA $104.30 state fee. $22.50 for SoonerSelect/Medicare/100% disabled vets. Dr. Jiss Mathew.',
    discountTriggers: DISCOUNT_TRIGGERS,
  },

  // ─── HIGH-VOLUME STATES ────────────────────────────────────────────────
  'California': {
    doctorFee: 50, ggpProcessingFee: 60, ggpDiscountMax: 15,
    stateFee: 100, stateFeeDiscount: 50,
    totalStandard: 210, totalDiscount: 145,
    complexityTier: 'medium', notes: 'County-level fees vary. Medi-Cal 50% reduction.',
  },
  'Florida': {
    doctorFee: 175, ggpProcessingFee: 55, ggpDiscountMax: 15,
    stateFee: 75,
    totalStandard: 305, totalDiscount: 250,
    complexityTier: 'medium', notes: 'OMMU $75 state fee. Doctor fees high ($150-200). MMTC vertically integrated.',
  },
  'Michigan': {
    doctorFee: 75, ggpProcessingFee: 50, ggpDiscountMax: 15,
    stateFee: 40,
    totalStandard: 165, totalDiscount: 140,
    complexityTier: 'medium', notes: 'CRA $40 state fee. No waivers.',
  },
  'Illinois': {
    doctorFee: 150, ggpProcessingFee: 55, ggpDiscountMax: 15,
    stateFee: 50, stateFeeDiscount: 25,
    totalStandard: 255, totalDiscount: 215,
    complexityTier: 'medium', notes: 'IDFPR. Veteran/low-income discounts.',
  },
  'New York': {
    doctorFee: 150, ggpProcessingFee: 60, ggpDiscountMax: 15,
    stateFee: 50,
    totalStandard: 260, totalDiscount: 235,
    complexityTier: 'high', notes: 'OCM. No state card fee for auto-certification.',
  },
  'Nevada': {
    doctorFee: 150, ggpProcessingFee: 55, ggpDiscountMax: 15,
    stateFee: 50,
    totalStandard: 255, totalDiscount: 230,
    complexityTier: 'medium', notes: 'CCB. Tourism premium.',
  },

  // ─── DUAL-USE STATES ──────────────────────────────────────────────────
  'Alaska':       { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 25, totalStandard: 175, totalDiscount: 150, complexityTier: 'simple' },
  'Arizona':      { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 150, stateFeeDiscount: 75, totalStandard: 300, totalDiscount: 210, complexityTier: 'simple', notes: 'SNAP recipients 50% state fee reduction.' },
  'Colorado':     { doctorFee: 75, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 52, stateFeeDiscount: 26, totalStandard: 172, totalDiscount: 131, complexityTier: 'simple', notes: 'Low-income waiver at 185% FPL.' },
  'Connecticut':  { doctorFee: 125, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 100, totalStandard: 280, totalDiscount: 250, complexityTier: 'high' },
  'Delaware':     { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 50, totalStandard: 200, totalDiscount: 175, complexityTier: 'medium' },
  'Maine':        { doctorFee: 75, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 0, totalStandard: 120, totalDiscount: 105, complexityTier: 'simple', notes: 'No state card fee. Caregiver culture.' },
  'Maryland':     { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 50, totalStandard: 200, totalDiscount: 175, complexityTier: 'medium' },
  'Massachusetts':{ doctorFee: 125, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 50, stateFeeDiscount: 25, totalStandard: 230, totalDiscount: 190, complexityTier: 'high', notes: 'Hardship program available.' },
  'Minnesota':    { doctorFee: 75, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 0, totalStandard: 125, totalDiscount: 110, complexityTier: 'medium', notes: 'No state card fee.' },
  'Missouri':     { doctorFee: 75, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 25, totalStandard: 150, totalDiscount: 125, complexityTier: 'simple' },
  'Montana':      { doctorFee: 75, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 25, totalStandard: 145, totalDiscount: 120, complexityTier: 'simple' },
  'New Jersey':   { doctorFee: 125, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 100, stateFeeDiscount: 20, totalStandard: 280, totalDiscount: 205, complexityTier: 'high', notes: 'Medicaid/SNAP waiver.' },
  'New Mexico':   { doctorFee: 75, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 0, totalStandard: 125, totalDiscount: 110, complexityTier: 'medium', notes: 'No state card fee.' },
  'Ohio':         { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 50, totalStandard: 200, totalDiscount: 175, complexityTier: 'medium' },
  'Oregon':       { doctorFee: 75, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 200, stateFeeDiscount: 60, totalStandard: 320, totalDiscount: 180, complexityTier: 'simple', notes: 'SNAP/food stamp 70% state fee reduction.' },
  'Rhode Island': { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 50, totalStandard: 200, totalDiscount: 175, complexityTier: 'medium' },
  'Vermont':      { doctorFee: 75, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 50, totalStandard: 170, totalDiscount: 145, complexityTier: 'simple' },
  'Virginia':     { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 50, totalStandard: 200, totalDiscount: 175, complexityTier: 'medium' },
  'Washington':   { doctorFee: 75, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 1, totalStandard: 126, totalDiscount: 111, complexityTier: 'medium', notes: '$1 state recognition card (optional).' },

  // ─── MEDICAL-ONLY STATES ──────────────────────────────────────────────
  'Alabama':      { doctorFee: 200, ggpProcessingFee: 60, ggpDiscountMax: 15, stateFee: 65, totalStandard: 325, totalDiscount: 290, complexityTier: 'high', notes: 'AMCC very restrictive. NO flower. Tablets/capsules/topicals ONLY. Limited certified physicians.' },
  'Arkansas':     { doctorFee: 125, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 50, totalStandard: 225, totalDiscount: 200, complexityTier: 'simple' },
  'Hawaii':       { doctorFee: 150, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 38.50, totalStandard: 243.50, totalDiscount: 218.50, complexityTier: 'medium' },
  'Kentucky':     { doctorFee: 100, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 25, totalStandard: 180, totalDiscount: 155, complexityTier: 'medium', notes: 'New program 2025-2026.' },
  'Louisiana':    { doctorFee: 75, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 0, totalStandard: 120, totalDiscount: 105, complexityTier: 'simple', notes: 'No state card fee. Any doctor can recommend.' },
  'Mississippi':  { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 25, totalStandard: 175, totalDiscount: 150, complexityTier: 'medium' },
  'Nebraska':     { doctorFee: 100, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 50, totalStandard: 205, totalDiscount: 180, complexityTier: 'medium', notes: 'Program launching 2026.' },
  'New Hampshire':{ doctorFee: 75, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 50, totalStandard: 170, totalDiscount: 145, complexityTier: 'simple', notes: 'TAX-FREE state.' },
  'North Dakota': { doctorFee: 100, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 50, totalStandard: 195, totalDiscount: 170, complexityTier: 'simple' },
  'Pennsylvania': { doctorFee: 150, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 50, stateFeeDiscount: 25, totalStandard: 255, totalDiscount: 215, complexityTier: 'medium', notes: 'Pharmacist on-site required.' },
  'South Dakota': { doctorFee: 100, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 50, totalStandard: 195, totalDiscount: 170, complexityTier: 'simple' },
  'Utah':         { doctorFee: 150, ggpProcessingFee: 55, ggpDiscountMax: 15, stateFee: 15, totalStandard: 220, totalDiscount: 195, complexityTier: 'medium', notes: 'Very restrictive. 15 pharmacies only.' },
  'West Virginia':{ doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 50, totalStandard: 200, totalDiscount: 175, complexityTier: 'simple' },

  // ─── LIMITED / CBD-ONLY / NO PROGRAM ──────────────────────────────────
  'District Of Columbia': { doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15, stateFee: 0, totalStandard: 150, totalDiscount: 135, complexityTier: 'medium' },
  'Georgia':      { doctorFee: 100, ggpProcessingFee: 40, ggpDiscountMax: 10, stateFee: 25, totalStandard: 165, totalDiscount: 150, complexityTier: 'simple', notes: 'Low-THC oil registry only.' },
  'Iowa':         { doctorFee: 100, ggpProcessingFee: 45, ggpDiscountMax: 15, stateFee: 0, totalStandard: 145, totalDiscount: 130, complexityTier: 'simple', notes: 'Very limited program.' },
  'Texas':        { doctorFee: 150, ggpProcessingFee: 45, ggpDiscountMax: 10, stateFee: 0, totalStandard: 195, totalDiscount: 180, complexityTier: 'simple', notes: 'Compassionate Use only (intractable epilepsy, terminal, PTSD).' },
  // No-program states
  'Idaho':        { doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'No cannabis program.' },
  'Indiana':      { doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'No cannabis program.' },
  'Kansas':       { doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'No cannabis program.' },
  'North Carolina':{ doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'EBCI tribal exception only.' },
  'South Carolina':{ doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'No cannabis program.' },
  'Tennessee':    { doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'Hemp-derived only.' },
  'Wisconsin':    { doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'No cannabis program.' },
  'Wyoming':      { doctorFee: 0, ggpProcessingFee: 0, ggpDiscountMax: 0, stateFee: 0, totalStandard: 0, totalDiscount: 0, complexityTier: 'simple', notes: 'No cannabis program.' },
};

// BUSINESS LICENSE GGP PROCESSING FEES (by complexity tier)
export const BUSINESS_FEES: Record<string, number> = {
  simple: 249,    // OK, CO, OR, ME, AK, MT, MO, AR, LA, NH, ND, SD, WV, VT
  medium: 349,    // CA, MI, FL, NV, IL, DE, MD, OH, RI, VA, WA, NM, HI, KY, NE, MS, PA, UT, DC
  high: 449,      // NY, NJ, MA, CT, AL (very restrictive/social equity/lottery)
};

// Helper — get fee config with fallback
export const getStateFees = (stateName: string): StateFeeConfig => {
  return STATE_FEES[stateName] || {
    doctorFee: 100, ggpProcessingFee: 50, ggpDiscountMax: 15,
    stateFee: 50, totalStandard: 200, totalDiscount: 175, complexityTier: 'simple',
  };
};

// Helper — get business license fee
export const getBusinessFee = (stateName: string): number => {
  const tier = STATE_FEES[stateName]?.complexityTier || 'simple';
  return BUSINESS_FEES[tier] || 249;
};

// Helper — check if user phrase triggers a discount offer
export const shouldOfferDiscount = (userMessage: string): boolean => {
  const lower = userMessage.toLowerCase();
  return DISCOUNT_TRIGGERS.some(trigger => lower.includes(trigger));
};

// Helper — format price breakdown for agent scripts
export const formatPriceBreakdown = (stateName: string, discounted: boolean = false): string => {
  const fees = getStateFees(stateName);
  if (fees.totalStandard === 0) return `${stateName} does not currently have a medical cannabis card program.`;
  const processing = discounted ? (fees.ggpProcessingFee - fees.ggpDiscountMax) : fees.ggpProcessingFee;
  const state = discounted && fees.stateFeeDiscount !== undefined ? fees.stateFeeDiscount : fees.stateFee;
  const total = fees.doctorFee + processing + state;
  let breakdown = `Doctor/Physician: $${fees.doctorFee} | GGP Processing: $${processing}`;
  if (discounted) breakdown += ` (discount applied)`;
  breakdown += ` | State Fee: $${state}`;
  if (discounted && fees.stateFeeDiscount !== undefined) breakdown += ` (reduced)`;
  breakdown += ` | TOTAL: $${total.toFixed(2)} (cost could vary)`;
  return breakdown;
};
