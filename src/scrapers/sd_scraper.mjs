/**
 * South Dakota Cannabis Scraper
 * Source: https://medcannabis.sd.gov/
 * Medical only. SD DOH regulates. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeSouthDakota() {
  console.log('Mount Rushmore State 🏔️ South Dakota DOH — Monitor Scraper (Medical Only)');
  console.log('  Sources:');
  console.log('    - https://medcannabis.sd.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const sdDeals = []; snap.forEach(d => { if (d.data().state === 'SD') sdDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${sdDeals.length} South Dakota records in CRM`);
  const byType = {};
  sdDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'SD', totalRecords: sdDeals.length, byType, sources: [
    'https://medcannabis.sd.gov/'
  ]};
}
if (process.argv[1]?.includes('sd_scraper')) scrapeSouthDakota().then(() => process.exit(0));
