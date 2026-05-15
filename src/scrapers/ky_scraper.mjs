/**
 * Kentucky Medical Cannabis Scraper
 * Source: https://kymedcan.ky.gov/
 * New program — operational 2025/2026. Lottery-based licensing.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeKentucky() {
  console.log('🐴 Kentucky OMC — Monitor Scraper');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const kyDeals = []; snap.forEach(d => { if (d.data().state === 'KY') kyDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${kyDeals.length} Kentucky records in CRM`);
  const byType = {};
  kyDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'KY', totalRecords: kyDeals.length, byType, sources: ['https://kymedcan.ky.gov/'] };
}
if (process.argv[1]?.includes('ky_scraper')) scrapeKentucky().then(() => process.exit(0));
