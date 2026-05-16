/**
 * Wisconsin Cannabis Scraper
 * Source: https://docs.legis.wisconsin.gov/
 * ILLEGAL. No active program.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeWisconsin() {
  console.log('🧀 Wisconsin Legis — Monitor Scraper (Illegal / Policy Tracking)');
  console.log('  Sources:');
  console.log('    - https://docs.legis.wisconsin.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const wiDeals = []; snap.forEach(d => { if (d.data().state === 'WI') wiDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${wiDeals.length} Wisconsin records in CRM`);
  const byType = {};
  wiDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'WI', totalRecords: wiDeals.length, byType, sources: [
    'https://docs.legis.wisconsin.gov/'
  ]};
}
if (process.argv[1]?.includes('wi_scraper')) scrapeWisconsin().then(() => process.exit(0));
