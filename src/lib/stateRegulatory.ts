// ═══════════════════════════════════════════════════════════════════════════════
//  STATE REGULATORY METADATA — Universal Jurisdiction Intelligence for GGP-OS
//  Maps all 50 states + DC to their regulatory frameworks across all verticals
// ═══════════════════════════════════════════════════════════════════════════════

export type TraceabilitySystem = 'Metrc' | 'BioTrackTHC' | 'Leaf Data' | 'CCTT-Metrc' | 'Custom State Portal' | 'None';
export type CannabisStatus = 'Medical & Recreational' | 'Medical Only' | 'CBD/Hemp Only' | 'Prohibited' | 'Decriminalized';
export type AlcoholAuthority = string;

export interface StateRegulatoryData {
  abbr: string;
  cannabisStatus: CannabisStatus;
  traceabilitySystem: TraceabilitySystem;
  licensingAuthority: string;
  taxRate: string;
  medicalQualifying: boolean;
  reciprocity: boolean;
  hempProgram: boolean;
  alcoholAuthority: AlcoholAuthority;
  pharmaBoard: string;
  activeVerticals: string[];
}

export const STATE_REGULATORY_MAP: Record<string, StateRegulatoryData> = {
  'Alabama':        { abbr: 'AL', cannabisStatus: 'Medical Only', traceabilitySystem: 'Metrc', licensingAuthority: 'AMCC', taxRate: '9%', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC Board', pharmaBoard: 'AL Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Alaska':         { abbr: 'AK', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'AMCO', taxRate: '$50/oz cultivation', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'AMCO', pharmaBoard: 'AK Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Arizona':        { abbr: 'AZ', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'AZDHS', taxRate: '16% excise', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'DLLC', pharmaBoard: 'AZ Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Arkansas':       { abbr: 'AR', cannabisStatus: 'Medical Only', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'ABC/MMC', taxRate: '6.5% + 4% privilege', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC', pharmaBoard: 'AR Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'California':     { abbr: 'CA', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'CCTT-Metrc', licensingAuthority: 'DCC', taxRate: '15% excise + local', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC', pharmaBoard: 'CA Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Colorado':       { abbr: 'CO', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'MED', taxRate: '15% excise + 15% retail', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'LED', pharmaBoard: 'CO Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Connecticut':    { abbr: 'CT', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'DCP', taxRate: 'THC-based tiered', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DCP Liquor Control', pharmaBoard: 'CT DCP Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Delaware':       { abbr: 'DE', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'OML', taxRate: '15% retail', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'OABCC', pharmaBoard: 'DE Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Florida':        { abbr: 'FL', cannabisStatus: 'Medical Only', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'OMMU (DOH)', taxRate: 'No state excise', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DBPR/ABT', pharmaBoard: 'FL Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Georgia':        { abbr: 'GA', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'GMA Commission', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'DOR Alcohol & Tobacco', pharmaBoard: 'GA Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Hawaii':         { abbr: 'HI', cannabisStatus: 'Medical Only', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'DOH', taxRate: 'No state excise', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'Liquor Commission', pharmaBoard: 'HI Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Idaho':          { abbr: 'ID', cannabisStatus: 'Prohibited', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'ISP/ABC', pharmaBoard: 'ID Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Illinois':       { abbr: 'IL', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'IDFPR', taxRate: 'THC-tiered 10-25%', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ILCC', pharmaBoard: 'IL DFPR Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Indiana':        { abbr: 'IN', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'ATC', pharmaBoard: 'IN Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Iowa':           { abbr: 'IA', cannabisStatus: 'Medical Only', traceabilitySystem: 'Custom State Portal', licensingAuthority: 'IDPH', taxRate: '7% sales', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABD', pharmaBoard: 'IA Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Kansas':         { abbr: 'KS', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC', pharmaBoard: 'KS Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Kentucky':       { abbr: 'KY', cannabisStatus: 'Medical Only', traceabilitySystem: 'Metrc', licensingAuthority: 'OKC (KYOMCA)', taxRate: 'TBD', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC', pharmaBoard: 'KY Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Louisiana':      { abbr: 'LA', cannabisStatus: 'Medical Only', traceabilitySystem: 'Metrc', licensingAuthority: 'LDAF', taxRate: 'No excise (pharmacy)', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ATC', pharmaBoard: 'LA Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Maine':          { abbr: 'ME', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'OCP', taxRate: '10% retail', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'BABLO', pharmaBoard: 'ME Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Maryland':       { abbr: 'MD', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'MCA', taxRate: '9% retail', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'Comptroller ABT', pharmaBoard: 'MD Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Massachusetts':  { abbr: 'MA', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'CCC', taxRate: '10.75% + local 3%', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABCC', pharmaBoard: 'MA Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Michigan':       { abbr: 'MI', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'CRA', taxRate: '10% excise + 6% sales', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'MLCC', pharmaBoard: 'MI Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Minnesota':      { abbr: 'MN', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'OCM', taxRate: '10% cannabis', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DPS Alcohol & Gambling', pharmaBoard: 'MN Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Mississippi':    { abbr: 'MS', cannabisStatus: 'Medical Only', traceabilitySystem: 'Custom State Portal', licensingAuthority: 'MSDH', taxRate: '7% sales', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC', pharmaBoard: 'MS Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Missouri':       { abbr: 'MO', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'DHSS/DCA', taxRate: '6% retail', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'ATC', pharmaBoard: 'MO Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Montana':        { abbr: 'MT', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'DOR Cannabis', taxRate: '20% retail', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DOR Liquor', pharmaBoard: 'MT Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Nebraska':       { abbr: 'NE', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'NLCC', pharmaBoard: 'NE DHHS Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Nevada':         { abbr: 'NV', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'CCB', taxRate: '10% retail + 15% wholesale', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'NGC Liquor', pharmaBoard: 'NV Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'New Hampshire':  { abbr: 'NH', cannabisStatus: 'Medical Only', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'DHHS TCP', taxRate: 'No excise', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'NHLC', pharmaBoard: 'NH Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'New Jersey':     { abbr: 'NJ', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'CRC', taxRate: '6.625% sales + Social Equity', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC', pharmaBoard: 'NJ Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'New Mexico':     { abbr: 'NM', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'CCD (RLD)', taxRate: '12% excise', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'RLD Alcohol', pharmaBoard: 'NM Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'New York':       { abbr: 'NY', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'OCM', taxRate: 'THC-based potency', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'SLA', pharmaBoard: 'NY Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'North Carolina': { abbr: 'NC', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC Commission', pharmaBoard: 'NC Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'North Dakota':   { abbr: 'ND', cannabisStatus: 'Medical Only', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'NDDOH', taxRate: '5% sales', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'Office of AG', pharmaBoard: 'ND Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Ohio':           { abbr: 'OH', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'DCC', taxRate: '10% adult-use', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DLC', pharmaBoard: 'OH Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Oklahoma':       { abbr: 'OK', cannabisStatus: 'Medical Only', traceabilitySystem: 'Metrc', licensingAuthority: 'OMMA', taxRate: '7% excise', medicalQualifying: true, reciprocity: true, hempProgram: true, alcoholAuthority: 'ABLE Commission', pharmaBoard: 'OK Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Oregon':         { abbr: 'OR', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'OLCC', taxRate: '17% retail', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'OLCC', pharmaBoard: 'OR Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Pennsylvania':   { abbr: 'PA', cannabisStatus: 'Medical Only', traceabilitySystem: 'Leaf Data', licensingAuthority: 'DOH MMP', taxRate: '5% gross receipts', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'PLCB', pharmaBoard: 'PA Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Rhode Island':   { abbr: 'RI', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'CCA', taxRate: '10% retail + 3% local', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DBR', pharmaBoard: 'RI Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'South Carolina': { abbr: 'SC', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'DOR ABL', pharmaBoard: 'SC Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'South Dakota':   { abbr: 'SD', cannabisStatus: 'Medical Only', traceabilitySystem: 'Metrc', licensingAuthority: 'DOH', taxRate: 'No excise', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DOR Special Tax', pharmaBoard: 'SD Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Tennessee':      { abbr: 'TN', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'TABC', pharmaBoard: 'TN Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Texas':          { abbr: 'TX', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'Custom State Portal', licensingAuthority: 'DSHS (CUP only)', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'TABC', pharmaBoard: 'TX Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Utah':           { abbr: 'UT', cannabisStatus: 'Medical Only', traceabilitySystem: 'BioTrackTHC', licensingAuthority: 'UDAF', taxRate: 'No excise (state sales)', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DABC', pharmaBoard: 'UT DOPL Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Vermont':        { abbr: 'VT', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'CCB', taxRate: '14% excise', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'DLC', pharmaBoard: 'VT Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Virginia':       { abbr: 'VA', cannabisStatus: 'Medical Only', traceabilitySystem: 'Metrc', licensingAuthority: 'CCA', taxRate: 'TBD', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABC Authority', pharmaBoard: 'VA Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Washington':     { abbr: 'WA', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Leaf Data', licensingAuthority: 'LCB', taxRate: '37% excise', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'LCB', pharmaBoard: 'WA Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'West Virginia':  { abbr: 'WV', cannabisStatus: 'Medical Only', traceabilitySystem: 'Metrc', licensingAuthority: 'DHHR/BPH', taxRate: 'No excise', medicalQualifying: true, reciprocity: false, hempProgram: true, alcoholAuthority: 'ABCA', pharmaBoard: 'WV Board of Pharmacy', activeVerticals: ['Cannabis','Hemp','Pharma','Alcohol'] },
  'Wisconsin':      { abbr: 'WI', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'DOR Alcohol', pharmaBoard: 'WI Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'Wyoming':        { abbr: 'WY', cannabisStatus: 'CBD/Hemp Only', traceabilitySystem: 'None', licensingAuthority: 'N/A', taxRate: 'N/A', medicalQualifying: false, reciprocity: false, hempProgram: true, alcoholAuthority: 'Liquor Division', pharmaBoard: 'WY Board of Pharmacy', activeVerticals: ['Hemp','Pharma','Alcohol'] },
  'District of Columbia': { abbr: 'DC', cannabisStatus: 'Medical & Recreational', traceabilitySystem: 'Metrc', licensingAuthority: 'ABCA', taxRate: '6% sales', medicalQualifying: true, reciprocity: true, hempProgram: false, alcoholAuthority: 'ABCA', pharmaBoard: 'DC Board of Pharmacy', activeVerticals: ['Cannabis','Pharma','Alcohol'] },
};

export const ALL_STATES = Object.keys(STATE_REGULATORY_MAP);

export const getStateData = (state: string): StateRegulatoryData | null => {
  return STATE_REGULATORY_MAP[state] || null;
};

export const getTraceabilityBadgeColor = (system: TraceabilitySystem): string => {
  switch (system) {
    case 'Metrc': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'CCTT-Metrc': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'BioTrackTHC': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'Leaf Data': return 'bg-violet-500/15 text-violet-400 border-violet-500/30';
    case 'Custom State Portal': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'None': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
};

export const getCannabisStatusColor = (status: CannabisStatus): string => {
  switch (status) {
    case 'Medical & Recreational': return 'text-emerald-400';
    case 'Medical Only': return 'text-blue-400';
    case 'CBD/Hemp Only': return 'text-amber-400';
    case 'Decriminalized': return 'text-violet-400';
    case 'Prohibited': return 'text-red-400';
    default: return 'text-slate-400';
  }
};
