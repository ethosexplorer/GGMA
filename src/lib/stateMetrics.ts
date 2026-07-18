// ═══════════════════════════════════════════════════════════════════════════════
//  STATE METRICS — Dynamic per-jurisdiction data generation
//  Generates consistent, plausible mock metrics for any state based on
//  population, cannabis program maturity, and regulatory framework data
// ═══════════════════════════════════════════════════════════════════════════════

import { STATE_REGULATORY_MAP, type StateRegulatoryData, type CannabisStatus } from './stateRegulatory';

// Simple deterministic hash for consistent per-state number generation
const stateHash = (state: string, seed: number = 0): number => {
  let hash = seed;
  for (let i = 0; i < state.length; i++) {
    hash = ((hash << 5) - hash) + state.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

// Seeded pseudo-random between min and max (inclusive), consistent per state+seed
const seededRange = (state: string, seed: number, min: number, max: number): number => {
  const h = stateHash(state, seed);
  return min + (h % (max - min + 1));
};

// State populations (approximate, for scaling)
const STATE_POPULATIONS: Record<string, number> = {
  'Alabama': 5_024_000, 'Alaska': 733_000, 'Arizona': 7_276_000, 'Arkansas': 3_011_000,
  'California': 39_538_000, 'Colorado': 5_773_000, 'Connecticut': 3_605_000, 'Delaware': 989_000,
  'Florida': 21_538_000, 'Georgia': 10_711_000, 'Hawaii': 1_455_000, 'Idaho': 1_839_000,
  'Illinois': 12_812_000, 'Indiana': 6_732_000, 'Iowa': 3_190_000, 'Kansas': 2_937_000,
  'Kentucky': 4_505_000, 'Louisiana': 4_657_000, 'Maine': 1_362_000, 'Maryland': 6_177_000,
  'Massachusetts': 6_892_000, 'Michigan': 10_077_000, 'Minnesota': 5_706_000, 'Mississippi': 2_961_000,
  'Missouri': 6_154_000, 'Montana': 1_084_000, 'Nebraska': 1_961_000, 'Nevada': 3_104_000,
  'New Hampshire': 1_377_000, 'New Jersey': 9_288_000, 'New Mexico': 2_117_000, 'New York': 20_201_000,
  'North Carolina': 10_440_000, 'North Dakota': 779_000, 'Ohio': 11_799_000, 'Oklahoma': 3_959_000,
  'Oregon': 4_237_000, 'Pennsylvania': 13_002_000, 'Rhode Island': 1_097_000, 'South Carolina': 5_118_000,
  'South Dakota': 886_000, 'Tennessee': 6_910_000, 'Texas': 29_145_000, 'Utah': 3_271_000,
  'Vermont': 643_000, 'Virginia': 8_631_000, 'Washington': 7_614_000, 'West Virginia': 1_793_000,
  'Wisconsin': 5_893_000, 'Wyoming': 576_000, 'District of Columbia': 689_000,
};

// Major cities per state (for enforcement actions, applicant regions, etc.)
const STATE_CITIES: Record<string, string[]> = {
  'Alabama': ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa'],
  'Alaska': ['Anchorage', 'Fairbanks', 'Juneau', 'Wasilla', 'Sitka'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Tempe'],
  'Arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland'],
  'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Boulder', 'Fort Collins'],
  'Connecticut': ['Hartford', 'New Haven', 'Stamford', 'Bridgeport', 'Waterbury'],
  'Delaware': ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Bear'],
  'Florida': ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale'],
  'Georgia': ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Macon'],
  'Hawaii': ['Honolulu', 'Hilo', 'Kailua', 'Pearl City', 'Waipahu'],
  'Idaho': ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'],
  'Illinois': ['Chicago', 'Springfield', 'Aurora', 'Rockford', 'Naperville'],
  'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'],
  'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
  'Kansas': ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Olathe'],
  'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
  'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'],
  'Maine': ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'],
  'Maryland': ['Baltimore', 'Columbia', 'Germantown', 'Silver Spring', 'Annapolis'],
  'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Flint'],
  'Minnesota': ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington'],
  'Mississippi': ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'],
  'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'],
  'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Helena'],
  'Nebraska': ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'],
  'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'],
  'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover'],
  'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton'],
  'New Mexico': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'],
  'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Lawton', 'Stillwater'],
  'Oregon': ['Portland', 'Salem', 'Eugene', 'Bend', 'Medford'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Harrisburg'],
  'Rhode Island': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'],
  'South Carolina': ['Charleston', 'Columbia', 'North Charleston', 'Greenville', 'Rock Hill'],
  'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'],
  'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  'Utah': ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem'],
  'Vermont': ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'],
  'Virginia': ['Virginia Beach', 'Norfolk', 'Richmond', 'Arlington', 'Alexandria'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
  'West Virginia': ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'],
  'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'],
  'Wyoming': ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs'],
  'District of Columbia': ['NW Washington', 'NE Washington', 'SE Washington', 'SW Washington', 'Capitol Hill'],
};

// State-specific law enforcement / investigation agency
const STATE_INVESTIGATION_AGENCY: Record<string, string> = {
  'Alabama': 'ALEA/SBI', 'Alaska': 'AST/ABI', 'Arizona': 'DPS/CIB', 'Arkansas': 'ASP/CID',
  'California': 'CA DOJ/BCI', 'Colorado': 'CBI', 'Connecticut': 'DESPP', 'Delaware': 'DSP/SBI',
  'Florida': 'FDLE', 'Georgia': 'GBI', 'Hawaii': 'AG/CJD', 'Idaho': 'ISP/BCI',
  'Illinois': 'ISP/DCI', 'Indiana': 'ISP', 'Iowa': 'DCI', 'Kansas': 'KBI',
  'Kentucky': 'KSP', 'Louisiana': 'LSP', 'Maine': 'MSP', 'Maryland': 'MSP/CID',
  'Massachusetts': 'MSP/CPAC', 'Michigan': 'MSP/CID', 'Minnesota': 'BCA', 'Mississippi': 'MBI',
  'Missouri': 'MSHP/DCI', 'Montana': 'DOJ/DCI', 'Nebraska': 'NSP', 'Nevada': 'DPS/IB',
  'New Hampshire': 'NHSP', 'New Jersey': 'NJSP/SBI', 'New Mexico': 'NMSP/DCI', 'New York': 'NYSP/BCI',
  'North Carolina': 'SBI', 'North Dakota': 'BCI', 'Ohio': 'BCI&I', 'Oklahoma': 'OSBI',
  'Oregon': 'OSP/CID', 'Pennsylvania': 'PSP/BCI', 'Rhode Island': 'RISP', 'South Carolina': 'SLED',
  'South Dakota': 'DCI', 'Tennessee': 'TBI', 'Texas': 'DPS/CID', 'Utah': 'DPS/BCI',
  'Vermont': 'VSP/BCI', 'Virginia': 'VSP/BCI', 'Washington': 'WSP', 'West Virginia': 'WVSP',
  'Wisconsin': 'DCI', 'Wyoming': 'DCI', 'District of Columbia': 'MPD/CID',
};

// State agriculture departments
const STATE_AG_DEPT: Record<string, string> = {
  'Alabama': 'ADAI', 'Alaska': 'DNR', 'Arizona': 'AZDA', 'Arkansas': 'AAD',
  'California': 'CDFA', 'Colorado': 'CDA', 'Connecticut': 'DOAG', 'Delaware': 'DDA',
  'Florida': 'FDACS', 'Georgia': 'GDA', 'Hawaii': 'HDOA', 'Idaho': 'ISDA',
  'Illinois': 'IDOA', 'Indiana': 'ISDA', 'Iowa': 'IDALS', 'Kansas': 'KDA',
  'Kentucky': 'KDA', 'Louisiana': 'LDAF', 'Maine': 'DACF', 'Maryland': 'MDA',
  'Massachusetts': 'MDAR', 'Michigan': 'MDARD', 'Minnesota': 'MDA', 'Mississippi': 'MDAC',
  'Missouri': 'MDA', 'Montana': 'MDA', 'Nebraska': 'NDA', 'Nevada': 'NDA',
  'New Hampshire': 'DAMF', 'New Jersey': 'NJDA', 'New Mexico': 'NMDA', 'New York': 'NYSDAM',
  'North Carolina': 'NCDA&CS', 'North Dakota': 'NDDA', 'Ohio': 'ODA', 'Oklahoma': 'ODAFF',
  'Oregon': 'ODA', 'Pennsylvania': 'PDA', 'Rhode Island': 'DEM', 'South Carolina': 'SCDA',
  'South Dakota': 'SDDA', 'Tennessee': 'TDA', 'Texas': 'TDA', 'Utah': 'UDAF',
  'Vermont': 'VAAFM', 'Virginia': 'VDACS', 'Washington': 'WSDA', 'West Virginia': 'WVDA',
  'Wisconsin': 'DATCP', 'Wyoming': 'WDA', 'District of Columbia': 'DOEE',
};

// State tax commission / revenue agency
const STATE_TAX_AGENCY: Record<string, string> = {
  'Alabama': 'ADOR', 'Alaska': 'DOR', 'Arizona': 'ADOR', 'Arkansas': 'DFA',
  'California': 'CDTFA', 'Colorado': 'DOR', 'Connecticut': 'DRS', 'Delaware': 'DOR',
  'Florida': 'DOR', 'Georgia': 'DOR', 'Hawaii': 'DOTAX', 'Idaho': 'ISTC',
  'Illinois': 'IDOR', 'Indiana': 'DOR', 'Iowa': 'IDR', 'Kansas': 'KDOR',
  'Kentucky': 'DOR', 'Louisiana': 'LDR', 'Maine': 'MRS', 'Maryland': 'Comptroller',
  'Massachusetts': 'DOR', 'Michigan': 'Treasury', 'Minnesota': 'DOR', 'Mississippi': 'DOR',
  'Missouri': 'DOR', 'Montana': 'DOR', 'Nebraska': 'DOR', 'Nevada': 'DOT',
  'New Hampshire': 'DRA', 'New Jersey': 'DOT', 'New Mexico': 'TRD', 'New York': 'DTF',
  'North Carolina': 'DOR', 'North Dakota': 'Tax Dept', 'Ohio': 'DOT', 'Oklahoma': 'OTC',
  'Oregon': 'DOR', 'Pennsylvania': 'DOR', 'Rhode Island': 'DOT', 'South Carolina': 'DOR',
  'South Dakota': 'DOR', 'Tennessee': 'DOR', 'Texas': 'Comptroller', 'Utah': 'USTC',
  'Vermont': 'DOT', 'Virginia': 'DOT', 'Washington': 'DOR', 'West Virginia': 'STTD',
  'Wisconsin': 'DOR', 'Wyoming': 'DOR', 'District of Columbia': 'OTR',
};

// Neighboring states for comparison table
const STATE_NEIGHBORS: Record<string, string[]> = {
  'Alabama': ['Mississippi', 'Tennessee', 'Georgia', 'Florida'],
  'Alaska': ['Washington', 'Oregon', 'Hawaii', 'California'],
  'Arizona': ['New Mexico', 'Nevada', 'California', 'Utah', 'Colorado'],
  'Arkansas': ['Oklahoma', 'Missouri', 'Tennessee', 'Mississippi', 'Louisiana'],
  'California': ['Oregon', 'Nevada', 'Arizona', 'Colorado'],
  'Colorado': ['Wyoming', 'Nebraska', 'Kansas', 'Oklahoma', 'New Mexico', 'Utah'],
  'Connecticut': ['New York', 'Massachusetts', 'Rhode Island', 'New Jersey'],
  'Delaware': ['Maryland', 'Pennsylvania', 'New Jersey', 'Virginia'],
  'Florida': ['Georgia', 'Alabama', 'South Carolina', 'Louisiana'],
  'Georgia': ['Florida', 'Alabama', 'Tennessee', 'South Carolina', 'North Carolina'],
  'Hawaii': ['California', 'Alaska', 'Oregon', 'Washington'],
  'Idaho': ['Montana', 'Wyoming', 'Utah', 'Nevada', 'Oregon', 'Washington'],
  'Illinois': ['Indiana', 'Wisconsin', 'Iowa', 'Missouri', 'Michigan'],
  'Indiana': ['Illinois', 'Ohio', 'Michigan', 'Kentucky'],
  'Iowa': ['Minnesota', 'Wisconsin', 'Illinois', 'Missouri', 'Nebraska', 'South Dakota'],
  'Kansas': ['Nebraska', 'Missouri', 'Oklahoma', 'Colorado'],
  'Kentucky': ['Tennessee', 'Virginia', 'West Virginia', 'Ohio', 'Indiana'],
  'Louisiana': ['Mississippi', 'Arkansas', 'Texas'],
  'Maine': ['New Hampshire', 'Vermont', 'Massachusetts'],
  'Maryland': ['Virginia', 'West Virginia', 'Pennsylvania', 'Delaware'],
  'Massachusetts': ['Connecticut', 'Rhode Island', 'New Hampshire', 'Vermont', 'New York'],
  'Michigan': ['Ohio', 'Indiana', 'Wisconsin', 'Illinois'],
  'Minnesota': ['Wisconsin', 'Iowa', 'South Dakota', 'North Dakota'],
  'Mississippi': ['Alabama', 'Tennessee', 'Arkansas', 'Louisiana'],
  'Missouri': ['Illinois', 'Kansas', 'Oklahoma', 'Arkansas', 'Tennessee', 'Kentucky'],
  'Montana': ['North Dakota', 'South Dakota', 'Wyoming', 'Idaho'],
  'Nebraska': ['Iowa', 'Missouri', 'Kansas', 'Colorado', 'Wyoming', 'South Dakota'],
  'Nevada': ['California', 'Oregon', 'Idaho', 'Utah', 'Arizona'],
  'New Hampshire': ['Vermont', 'Maine', 'Massachusetts'],
  'New Jersey': ['New York', 'Pennsylvania', 'Delaware', 'Connecticut'],
  'New Mexico': ['Arizona', 'Colorado', 'Oklahoma', 'Texas'],
  'New York': ['New Jersey', 'Connecticut', 'Massachusetts', 'Vermont', 'Pennsylvania'],
  'North Carolina': ['Virginia', 'Tennessee', 'South Carolina', 'Georgia'],
  'North Dakota': ['Minnesota', 'South Dakota', 'Montana'],
  'Ohio': ['Michigan', 'Indiana', 'Kentucky', 'West Virginia', 'Pennsylvania'],
  'Oklahoma': ['Texas', 'Kansas', 'Arkansas', 'Missouri', 'Colorado'],
  'Oregon': ['Washington', 'California', 'Nevada', 'Idaho'],
  'Pennsylvania': ['New York', 'New Jersey', 'Delaware', 'Maryland', 'Ohio', 'West Virginia'],
  'Rhode Island': ['Connecticut', 'Massachusetts', 'New York'],
  'South Carolina': ['North Carolina', 'Georgia', 'Tennessee'],
  'South Dakota': ['North Dakota', 'Minnesota', 'Iowa', 'Nebraska', 'Wyoming', 'Montana'],
  'Tennessee': ['Kentucky', 'Virginia', 'North Carolina', 'Georgia', 'Alabama', 'Mississippi', 'Arkansas', 'Missouri'],
  'Texas': ['Louisiana', 'Arkansas', 'Oklahoma', 'New Mexico'],
  'Utah': ['Nevada', 'Idaho', 'Wyoming', 'Colorado', 'Arizona', 'New Mexico'],
  'Vermont': ['New Hampshire', 'Massachusetts', 'New York'],
  'Virginia': ['Maryland', 'West Virginia', 'Kentucky', 'Tennessee', 'North Carolina'],
  'Washington': ['Oregon', 'Idaho', 'Montana', 'California'],
  'West Virginia': ['Virginia', 'Kentucky', 'Ohio', 'Pennsylvania', 'Maryland'],
  'Wisconsin': ['Minnesota', 'Iowa', 'Illinois', 'Michigan'],
  'Wyoming': ['Montana', 'South Dakota', 'Nebraska', 'Colorado', 'Utah', 'Idaho'],
  'District of Columbia': ['Maryland', 'Virginia', 'Pennsylvania', 'Delaware'],
};

export interface StateMetrics {
  // Core KPIs
  activeLicenses: number;
  annualTaxRevenue: number;  // in millions
  totalJobs: number;
  directJobs: number;
  indirectJobs: number;
  economicMultiplier: number;
  patientCards: number;
  complianceRate: number;
  gdpContribution: number;  // in billions
  gdpPercent: number;
  gdpGrowth: number;
  
  // License breakdown
  dispensaries: number;
  cultivators: number;
  processors: number;
  labs: number;
  transporters: number;
  wasteDisposal: number;
  
  // Hemp/agriculture
  hempLicenses: number;
  alcoholLicenses: number;
  pharmaLicenses: number;
  
  // Revenue breakdown
  ytdRevenue: number; // in millions
  monthlyAverage: number;
  licenseFeeRevenue: number;
  penaltyCollections: number;
  monthlyRevenue: { month: string; revenue: number }[];
  
  // Tax allocation
  educationPct: number;
  courtsPct: number;
  operationsPct: number;
  generalFundPct: number;
  
  // Compliance
  totalInspections: number;
  violationsIssued: number;
  licensesSuspended: number;
  auditCompletion: number;
  metrcSyncCompliance: number;
  inspectionPassRate: number;
  licenseVerificationRate: number;
  
  // Social equity
  minorityOwned: number;
  ruralZones: number;
  veteranOwned: number;
  socialEquityFund: number; // in millions
  
  // Supply chain
  plantsTracked: string;
  manifestsPerMonth: number;
  
  // Market
  flowerPrice: number;
  concentratePrice: number;
  ediblePrice: number;
  cartridgePrice: number;
  topicalPrice: number;
  
  // Geography
  cities: string[];
  investigationAgency: string;
  agDept: string;
  taxAgency: string;
  neighbors: string[];
  population: number;
  counties: number;
}

// Status multiplier based on cannabis program maturity
const getStatusMultiplier = (status: CannabisStatus): number => {
  switch (status) {
    case 'Medical & Recreational': return 1.0;
    case 'Medical Only': return 0.55;
    case 'CBD/Hemp Only': return 0.05;
    case 'Decriminalized': return 0.08;
    case 'Prohibited': return 0.0;
    default: return 0.1;
  }
};

export const getStateMetrics = (stateName: string): StateMetrics => {
  const data = STATE_REGULATORY_MAP[stateName];
  const pop = STATE_POPULATIONS[stateName] || 3_000_000;
  const cities = STATE_CITIES[stateName] || ['Capital City', 'Metro Area', 'Suburban District', 'Rural County', 'University Town'];
  const statusMult = data ? getStatusMultiplier(data.cannabisStatus) : 0.3;
  
  // Scale factor: larger states with mature programs have more licenses
  const popScale = pop / 4_000_000; // normalized to ~Oklahoma population
  const baseScale = popScale * statusMult;
  
  // Core license count
  const activeLicenses = statusMult === 0 ? 0 : Math.max(3, Math.round(baseScale * seededRange(stateName, 1, 3200, 5400)));
  const dispensaries = Math.round(activeLicenses * (seededRange(stateName, 10, 40, 55) / 100));
  const cultivators = Math.round(activeLicenses * (seededRange(stateName, 11, 8, 18) / 100));
  const processors = Math.round(activeLicenses * (seededRange(stateName, 12, 12, 22) / 100));
  const labs = Math.max(1, Math.round(baseScale * seededRange(stateName, 13, 18, 65)));
  const transporters = Math.round(activeLicenses * (seededRange(stateName, 14, 5, 12) / 100));
  const wasteDisposal = Math.max(2, Math.round(baseScale * seededRange(stateName, 15, 30, 120)));
  
  // Revenue & economic impact
  const annualTaxRevenue = Math.round(baseScale * seededRange(stateName, 2, 80, 220) * 10) / 10;
  const totalJobs = Math.round(baseScale * seededRange(stateName, 3, 8000, 18000));
  const directJobs = Math.round(totalJobs * 0.65);
  const indirectJobs = totalJobs - directJobs;
  const economicMultiplier = Math.round((2.8 + (seededRange(stateName, 4, 0, 15) / 10)) * 10) / 10;
  const patientCards = data?.medicalQualifying ? Math.round(pop * (seededRange(stateName, 5, 3, 8) / 100)) : 0;
  const complianceRate = 92 + seededRange(stateName, 6, 0, 7) + seededRange(stateName, 60, 0, 9) / 10;
  const gdpContribution = Math.round(baseScale * seededRange(stateName, 7, 120, 280) * 10) / 1000;
  const gdpPercent = Math.round((1.2 + seededRange(stateName, 8, 0, 25) / 10) * 10) / 10;
  const gdpGrowth = seededRange(stateName, 9, 8, 24);
  
  // Revenue breakdown
  const ytdRevenue = Math.round(annualTaxRevenue * (seededRange(stateName, 20, 50, 62) / 100) * 10) / 10;
  const monthlyAverage = Math.round(annualTaxRevenue / 12 * 10) / 10;
  const licenseFeeRevenue = Math.round(activeLicenses * seededRange(stateName, 21, 2800, 5200) / 1_000_000 * 10) / 10;
  const penaltyCollections = Math.round(baseScale * seededRange(stateName, 22, 6, 22) * 10) / 10;
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const monthlyRevenue = months.map((month, i) => ({
    month,
    revenue: Math.round((monthlyAverage + (seededRange(stateName, 30 + i, -15, 20) / 10) * monthlyAverage * 0.1) * 10) / 10,
  }));
  
  // Tax allocation varies slightly by state
  const educationPct = seededRange(stateName, 40, 35, 45);
  const courtsPct = seededRange(stateName, 41, 18, 28);
  const operationsPct = seededRange(stateName, 42, 15, 25);
  const generalFundPct = 100 - educationPct - courtsPct - operationsPct;
  
  // Compliance metrics
  const totalInspections = Math.round(baseScale * seededRange(stateName, 50, 1200, 2800));
  const violationsIssued = Math.round(totalInspections * (seededRange(stateName, 51, 8, 18) / 100));
  const licensesSuspended = Math.round(violationsIssued * (seededRange(stateName, 52, 5, 12) / 100));
  const auditCompletion = 60 + seededRange(stateName, 53, 0, 30);
  const metrcSyncCompliance = 94 + seededRange(stateName, 54, 0, 5) + seededRange(stateName, 55, 0, 9) / 10;
  const inspectionPassRate = 86 + seededRange(stateName, 56, 0, 10) + seededRange(stateName, 57, 0, 9) / 10;
  const licenseVerificationRate = 97 + seededRange(stateName, 58, 0, 2) + seededRange(stateName, 59, 0, 9) / 10;
  
  // Social equity
  const minorityOwned = Math.round(activeLicenses * (seededRange(stateName, 70, 12, 24) / 100));
  const ruralZones = seededRange(stateName, 71, 12, 52);
  const veteranOwned = Math.round(activeLicenses * (seededRange(stateName, 72, 3, 7) / 100));
  const socialEquityFund = Math.round(baseScale * seededRange(stateName, 73, 20, 80) * 10) / 100;
  
  // Supply chain
  const plantsTracked = baseScale > 1 ? `${(baseScale * 1.2).toFixed(1)}M` : `${Math.round(baseScale * 1200)}K`;
  const manifestsPerMonth = Math.round(baseScale * seededRange(stateName, 80, 800, 1800));
  
  // Market pricing
  const flowerPrice = 8 + seededRange(stateName, 90, 0, 10) + seededRange(stateName, 91, 0, 9) / 10;
  const concentratePrice = 22 + seededRange(stateName, 92, 0, 18) + seededRange(stateName, 93, 0, 9) / 10;
  const ediblePrice = 10 + seededRange(stateName, 94, 0, 12) + seededRange(stateName, 95, 0, 9) / 10;
  const cartridgePrice = 25 + seededRange(stateName, 96, 0, 15) + seededRange(stateName, 97, 0, 9) / 10;
  const topicalPrice = 18 + seededRange(stateName, 98, 0, 14) + seededRange(stateName, 99, 0, 9) / 10;

  const counties = seededRange(stateName, 100, 20, 95);

  return {
    activeLicenses, annualTaxRevenue, totalJobs, directJobs, indirectJobs, economicMultiplier,
    patientCards, complianceRate, gdpContribution, gdpPercent, gdpGrowth,
    dispensaries, cultivators, processors, labs, transporters, wasteDisposal,
    hempLicenses: Math.round(baseScale * seededRange(stateName, 110, 400, 1200)),
    alcoholLicenses: Math.round(popScale * seededRange(stateName, 111, 3000, 8000)),
    pharmaLicenses: Math.round(popScale * seededRange(stateName, 112, 1800, 5000)),
    ytdRevenue, monthlyAverage, licenseFeeRevenue, penaltyCollections, monthlyRevenue,
    educationPct, courtsPct, operationsPct, generalFundPct,
    totalInspections, violationsIssued, licensesSuspended, auditCompletion,
    metrcSyncCompliance, inspectionPassRate, licenseVerificationRate,
    minorityOwned, ruralZones, veteranOwned, socialEquityFund,
    plantsTracked, manifestsPerMonth,
    flowerPrice, concentratePrice, ediblePrice, cartridgePrice, topicalPrice,
    cities,
    investigationAgency: STATE_INVESTIGATION_AGENCY[stateName] || 'SBI',
    agDept: STATE_AG_DEPT[stateName] || 'Dept. of Agriculture',
    taxAgency: STATE_TAX_AGENCY[stateName] || 'Tax Commission',
    neighbors: STATE_NEIGHBORS[stateName] || ['California', 'Texas', 'New York', 'Florida'],
    population: pop,
    counties,
  };
};

// Generate comparison data for a state in the table
export const getComparisonRow = (stateName: string) => {
  const data = STATE_REGULATORY_MAP[stateName];
  if (!data) return null;
  const m = getStateMetrics(stateName);
  return {
    state: stateName,
    status: data.cannabisStatus === 'Medical & Recreational' ? 'Med & Rec' : data.cannabisStatus,
    licenses: m.activeLicenses.toLocaleString(),
    tax: data.taxRate,
    revenue: m.annualTaxRevenue >= 1 ? `$${m.annualTaxRevenue.toFixed(1)}M` : `<$1M`,
    reciprocity: data.reciprocity,
  };
};
