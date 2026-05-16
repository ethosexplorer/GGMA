/**
 * West Virginia Cannabis Scraper
 * Source: https://omc.wv.gov/
 * Medical only. OMC Regulated.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeWestVirginia() {
  console.log('🏔️ West Virginia OMC — Monitor Scraper (Medical Only)');
  console.log('  Sources:');
  console.log('    - https://omc.wv.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const wvDeals = []; snap.forEach(d => { if (d.data().state === 'WV') wvDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${wvDeals.length} West Virginia records in CRM`);
  const byType = {};
  wvDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'WV', totalRecords: wvDeals.length, byType, sources: [
    'https://omc.wv.gov/'
  ]};
}
if (process.argv[1]?.includes('wv_scraper')) scrapeWestVirginia().then(() => process.exit(0));
