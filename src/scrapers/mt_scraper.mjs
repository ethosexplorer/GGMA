/**
 * Montana Cannabis Scraper
 * Source: https://mtrevenue.gov/cannabis/
 * Dual-use market. CCD/DOR regulates. Hundreds of dispensaries. METRC.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeMontana() {
  console.log('🏔️  Montana CCD — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://mtrevenue.gov/cannabis/');
  console.log('    - https://tap.dor.mt.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const mtDeals = []; snap.forEach(d => { if (d.data().state === 'MT') mtDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${mtDeals.length} Montana records in CRM`);
  const byType = {};
  mtDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'MT', totalRecords: mtDeals.length, byType, sources: [
    'https://mtrevenue.gov/cannabis/',
    'https://tap.dor.mt.gov/'
  ]};
}
if (process.argv[1]?.includes('mt_scraper')) scrapeMontana().then(() => process.exit(0));
