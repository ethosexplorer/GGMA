/**
 * OMMA Recall & Embargo Data Connector
 * ============================================================================
 * Source: https://oklahoma.gov/omma/recalls/embargoed-and-recalled-products.html
 * Last Verified: July 19, 2026
 * 
 * OMMA does NOT have a public REST API. Their recall data is published on
 * oklahoma.gov as server-rendered HTML pages with JavaScript-loaded content.
 * 
 * This module provides:
 * 1. A VERIFIED dataset of all 14 recalls/embargoes from the live OMMA page
 * 2. Structured types matching the real data format
 * 3. Utility functions to query recalls by date, type, business, etc.
 * 4. A fetch function to check for page updates (Last-Modified header)
 * 
 * To update: Visit the OMMA page, extract new recall entries, add to OMMA_RECALLS.
 * ============================================================================
 */

export interface OmmaRecall {
  id: string;
  date: string;           // ISO date string
  displayDate: string;    // Human readable date as shown on OMMA site
  type: 'recall' | 'embargo' | 'recall_embargo' | 'voluntary_recall';
  businessName: string;
  licenseNumber: string;  // OMMA license ID (e.g., PAAA-8JA2-CK1Z)
  licenseType: 'processor' | 'grower' | 'dispensary' | 'lab' | 'transporter' | 'unknown';
  products: string;
  reason: string;
  contaminant?: string;   // pesticide, microbial, heavy_metals, etc.
  pdfUrl?: string;        // Link to recall PDF if available
  newsUrl?: string;       // Link to news article
  isActive: boolean;      // Whether this recall is currently active
}

/**
 * REAL OMMA recall data — verified from oklahoma.gov on July 19, 2026.
 * Every entry here corresponds to an actual recall/embargo published by OMMA.
 */
export const OMMA_RECALLS: OmmaRecall[] = [
  {
    id: 'OMMA-2026-05-15',
    date: '2026-05-15',
    displayDate: 'May 15, 2026 (Expanded from March 23, 2026)',
    type: 'recall',
    businessName: 'Sunny Roads Processing 2, LLC',
    licenseNumber: 'PAAA-8JA2-CK1Z',
    licenseType: 'processor',
    products: 'Medical marijuana pre-roll batches',
    reason: 'Failed testing due to pesticide content above allowable thresholds',
    contaminant: 'pesticide',
    newsUrl: 'https://oklahoma.gov/omma/about/news/2026/update-recall-expanded-for-products-processed-by-sunny-roads-processing-2-llc.html',
    isActive: true
  },
  {
    id: 'OMMA-2026-03-19',
    date: '2026-03-19',
    displayDate: 'March 19, 2026',
    type: 'recall',
    businessName: 'Greenleaf Labs LLC',
    licenseNumber: 'LAAA-MP4O-T1EE',
    licenseType: 'lab',
    products: 'Products tested between April 2023 and July 2025',
    reason: 'Failed testing — mold and yeast levels exceeding compliance thresholds',
    contaminant: 'microbial',
    pdfUrl: 'https://oklahoma.gov/content/dam/ok/en/omma/content/embargoed-and-recalled-products/2026-3-19/Product%20and%20Business%20Recall%20List%20March%2019%202026.pdf',
    isActive: true
  },
  {
    id: 'OMMA-2026-01-21',
    date: '2026-01-21',
    displayDate: 'Jan. 21, 2026',
    type: 'embargo',
    businessName: 'OK Farms / RX Harvest Botanicals',
    licenseNumber: 'PAAA-FQG6-QLJP / PAAA-F0B4-WJQP',
    licenseType: 'processor',
    products: 'Untagged products discovered at Bud Guys LLP (DAAA-X7XP-Q2J9) in Tulsa',
    reason: 'Non-licensed operators — products untagged in state inventory tracking system, testing unconfirmed',
    contaminant: 'unlicensed',
    isActive: true
  },
  {
    id: 'OMMA-2025-12-23',
    date: '2025-12-23',
    displayDate: 'Dec. 23, 2025 (Embargo Dec. 11, 2025)',
    type: 'recall_embargo',
    businessName: 'Carter County Extracts, Inc.',
    licenseNumber: 'PAAA-NKNM-0GP0',
    licenseType: 'processor',
    products: 'Concentrates originating from processor',
    reason: 'Failed for pesticides (Myclobutanil)',
    contaminant: 'pesticide',
    isActive: true
  },
  {
    id: 'OMMA-2025-11-25',
    date: '2025-11-25',
    displayDate: 'Nov. 25, 2025',
    type: 'voluntary_recall',
    businessName: 'Vice Capital Extraction, LLC',
    licenseNumber: '',
    licenseType: 'processor',
    products: 'Pre-rolls',
    reason: 'Flower failed microbial testing was combined with other flower material, contaminating the product',
    contaminant: 'microbial',
    isActive: false
  },
  {
    id: 'OMMA-2025-10-24',
    date: '2025-10-24',
    displayDate: 'Oct. 24, 2025 (Embargo Oct. 13, 2025)',
    type: 'recall_embargo',
    businessName: 'Green Delight 2 LLC',
    licenseNumber: 'DAAA-4JYA-UHMD',
    licenseType: 'dispensary',
    products: 'Medical marijuana products',
    reason: 'Failed for pesticides',
    contaminant: 'pesticide',
    isActive: false
  },
  {
    id: 'OMMA-2025-10-23',
    date: '2025-10-23',
    displayDate: 'Oct. 23, 2025 (Embargo Oct. 13, 2025)',
    type: 'recall_embargo',
    businessName: "Ruby Mae's LLC",
    licenseNumber: 'PAAA-EKRQ-5DLS',
    licenseType: 'processor',
    products: 'Medical marijuana products',
    reason: 'Improper testing methods',
    contaminant: 'testing_failure',
    isActive: false
  },
  {
    id: 'OMMA-2025-10-10',
    date: '2025-10-10',
    displayDate: 'Oct. 10, 2025 (Embargo Sept. 25, 2025)',
    type: 'recall_embargo',
    businessName: 'Michael William Redus DBA Rocking R Cannabis',
    licenseNumber: 'PAAA-1H79-INUS',
    licenseType: 'processor',
    products: 'Medical marijuana products',
    reason: 'Failed testing',
    isActive: false
  },
  {
    id: 'OMMA-2025-03-25',
    date: '2025-03-25',
    displayDate: 'March 25, 2025',
    type: 'recall_embargo',
    businessName: 'PAK Family Farm, LLC / Clever Leaf Outdoor, LLC',
    licenseNumber: 'GAAI-VYPS-KBZ2 / GAAA-VFSO-CG6V',
    licenseType: 'grower',
    products: 'Payzos Flower (arsenic), Grape Cream Cake Flower (cadmium), Zour Apples Flower (cadmium)',
    reason: 'Heavy metals present due to test reporting issues by lab',
    contaminant: 'heavy_metals',
    isActive: false
  },
  {
    id: 'OMMA-2024-06-10',
    date: '2024-06-10',
    displayDate: 'June 10, 2024 (Embargo June 7, 2024)',
    type: 'recall_embargo',
    businessName: 'Graves Farm Organics LLC',
    licenseNumber: 'PAAA-EYKG-PCTX',
    licenseType: 'processor',
    products: 'Medical marijuana products',
    reason: 'Failed re-testing for pesticides during investigation',
    contaminant: 'pesticide',
    isActive: false
  },
  {
    id: 'OMMA-2023-11-03',
    date: '2023-11-03',
    displayDate: 'Nov. 3, 2023',
    type: 'recall',
    businessName: 'Unknown Processor',
    licenseNumber: '',
    licenseType: 'processor',
    products: 'Products not properly tested',
    reason: 'Not properly tested by processor in violation of OAC 442:10-8',
    contaminant: 'testing_failure',
    isActive: false
  },
  {
    id: 'OMMA-2023-06-30',
    date: '2023-06-30',
    displayDate: 'June 30, 2023',
    type: 'recall',
    businessName: 'Graves Farm Organics, LLC',
    licenseNumber: 'PAAA-EYKG-PCTX',
    licenseType: 'processor',
    products: 'Infused prerolls — "Space Rocks - (g)" and "Space Rocks - Sativa" (Jan 1 – June 20, 2023)',
    reason: 'Not properly tested',
    contaminant: 'testing_failure',
    isActive: false
  },
  {
    id: 'OMMA-2022-09-16',
    date: '2022-09-16',
    displayDate: 'Sept. 16, 2022',
    type: 'recall_embargo',
    businessName: 'Unknown Licensee',
    licenseNumber: '',
    licenseType: 'unknown',
    products: 'Medical marijuana products',
    reason: 'Transferred products after failed safety testing before notifying OMMA',
    contaminant: 'testing_failure',
    isActive: false
  },
  {
    id: 'OMMA-2022-05-19',
    date: '2022-05-19',
    displayDate: 'May 19, 2022',
    type: 'recall',
    businessName: 'Unknown Testing Lab',
    licenseNumber: '',
    licenseType: 'lab',
    products: 'Products with inaccurate test reporting',
    reason: 'Testing results not accurately reported by the testing lab',
    contaminant: 'testing_failure',
    isActive: false
  }
];

// ─── Utility Functions ──────────────────────────────────────────────────────

/** Get all currently active recalls */
export function getActiveRecalls(customRecalls?: OmmaRecall[]): OmmaRecall[] {
  const list = customRecalls || OMMA_RECALLS;
  return list.filter(r => r.isActive);
}

/** Get recalls from the last N days */
export function getRecentRecalls(days: number = 90, customRecalls?: OmmaRecall[]): OmmaRecall[] {
  const list = customRecalls || OMMA_RECALLS;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return list.filter(r => new Date(r.date) >= cutoff);
}

/** Get recall count by contaminant type */
export function getContaminantBreakdown(customRecalls?: OmmaRecall[]): Record<string, number> {
  const list = customRecalls || OMMA_RECALLS;
  const breakdown: Record<string, number> = {};
  list.forEach(r => {
    const key = r.contaminant || 'unknown';
    breakdown[key] = (breakdown[key] || 0) + 1;
  });
  return breakdown;
}

/** Get recall count by year */
export function getRecallsByYear(customRecalls?: OmmaRecall[]): Record<string, number> {
  const list = customRecalls || OMMA_RECALLS;
  const byYear: Record<string, number> = {};
  list.forEach(r => {
    const year = r.date.split('-')[0];
    byYear[year] = (byYear[year] || 0) + 1;
  });
  return byYear;
}

/** Get the most recent recall */
export function getMostRecentRecall(customRecalls?: OmmaRecall[]): OmmaRecall {
  const list = customRecalls || OMMA_RECALLS;
  return list[0]; // Already sorted newest-first
}

/** Summary stats for the Lab & Public Health dashboard */
export function getOmmaPublicHealthStats(customRecalls?: OmmaRecall[]) {
  const list = customRecalls || OMMA_RECALLS;
  const active = getActiveRecalls(list);
  const recent90 = getRecentRecalls(90, list);
  const contaminants = getContaminantBreakdown(list);
  
  const pesticideCount = contaminants['pesticide'] || 0;
  const microbialCount = contaminants['microbial'] || 0;
  const heavyMetalCount = contaminants['heavy_metals'] || 0;
  const testingFailures = contaminants['testing_failure'] || 0;
  
  return {
    totalRecalls: list.length,
    activeRecalls: active.length,
    recentRecalls90d: recent90.length,
    contaminationByType: {
      pesticide: pesticideCount,
      microbial: microbialCount,
      heavy_metals: heavyMetalCount,
      testing_failure: testingFailures,
    },
    mostRecentRecall: getMostRecentRecall(list),
    activeRecallList: active,
    sourceUrl: 'https://oklahoma.gov/omma/recalls/embargoed-and-recalled-products.html',
    lastVerified: '2026-07-19',
  };
}

/**
 * Check if the OMMA recall page has been updated since our last check.
 * Uses the Last-Modified HTTP header to detect changes without parsing HTML.
 * Returns the date string if available, null if unreachable.
 */
export async function checkForOmmaUpdates(): Promise<string | null> {
  try {
    const response = await fetch(
      'https://oklahoma.gov/omma/recalls/embargoed-and-recalled-products.html',
      { method: 'HEAD' }
    );
    return response.headers.get('Last-Modified');
  } catch {
    return null;
  }
}

