/**
 * Wyoming Cannabis Scraper
 * Source: https://wyoleg.gov/
 * ILLEGAL. No active program.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeWyoming() {
  console.log('🤠 Wyoming Legis — Monitor Scraper (Illegal / Policy Tracking)');
  console.log('  Sources:');
  console.log('    - https://wyoleg.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const wyDeals = []; snap.forEach(d => { if (d.data().state === 'WY') wyDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${wyDeals.length} Wyoming records in CRM`);
  const byType = {};
  wyDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'WY', totalRecords: wyDeals.length, byType, sources: [
    'https://wyoleg.gov/'
  ]};
}
if (process.argv[1]?.includes('wy_scraper')) scrapeWyoming().then(() => process.exit(0));
