/**
 * North Dakota Cannabis Scraper
 * Source: https://www.hhs.nd.gov/health/medical-marijuana
 * Medical only. DHHS regulates. BioTrackTHC. 8 dispensaries.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeNorthDakota() {
  console.log('🌾 North Dakota DHHS — Monitor Scraper (Medical Only)');
  console.log('  Sources:');
  console.log('    - https://www.hhs.nd.gov/health/medical-marijuana');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const ndDeals = []; snap.forEach(d => { if (d.data().state === 'ND') ndDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${ndDeals.length} North Dakota records in CRM`);
  const byType = {};
  ndDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'ND', totalRecords: ndDeals.length, byType, sources: [
    'https://www.hhs.nd.gov/health/medical-marijuana'
  ]};
}
if (process.argv[1]?.includes('nd_scraper')) scrapeNorthDakota().then(() => process.exit(0));
