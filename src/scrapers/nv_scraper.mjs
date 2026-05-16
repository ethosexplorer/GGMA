/**
 * Nevada Cannabis Scraper
 * Source: https://ccb.nv.gov/
 * Dual-use LIMITED-LICENSE market. CCB regulates. METRC.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeNevada() {
  console.log('🎰 Nevada CCB — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://ccb.nv.gov/');
  console.log('    - https://mmportal.nv.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const nvDeals = []; snap.forEach(d => { if (d.data().state === 'NV') nvDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${nvDeals.length} Nevada records in CRM`);
  const byType = {};
  nvDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'NV', totalRecords: nvDeals.length, byType, sources: [
    'https://ccb.nv.gov/',
    'https://mmportal.nv.gov/'
  ]};
}
if (process.argv[1]?.includes('nv_scraper')) scrapeNevada().then(() => process.exit(0));
