/**
 * Missouri Cannabis Scraper
 * Source: https://health.mo.gov/safety/cannabis/
 * Dual-use market. DCR/DHSS regulates. 200+ dispensaries. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeMissouri() {
  console.log('🐻 Missouri DCR — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://health.mo.gov/safety/cannabis/');
  console.log('    - https://mo-public.mycomplia.com/login');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const moDeals = []; snap.forEach(d => { if (d.data().state === 'MO') moDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${moDeals.length} Missouri records in CRM`);
  const byType = {};
  moDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'MO', totalRecords: moDeals.length, byType, sources: [
    'https://health.mo.gov/safety/cannabis/',
    'https://mo-public.mycomplia.com/login'
  ]};
}
if (process.argv[1]?.includes('mo_scraper')) scrapeMissouri().then(() => process.exit(0));
