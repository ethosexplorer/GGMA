/**
 * Kansas Cannabis Monitor Scraper
 * ⚠️ FULLY ILLEGAL. Strictest CBD rule in US (0.0% THC). HB 2678/2679 stalled.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeKansas() {
  console.log('🌻 Kansas — Monitor Scraper (Illegal State)');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const ksDeals = []; snap.forEach(d => { if (d.data().state === 'KS') ksDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${ksDeals.length} Kansas records in CRM`);
  const byType = {};
  ksDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'KS', totalRecords: ksDeals.length, byType, sources: ['https://kansasstatecannabis.org/medical'] };
}
if (process.argv[1]?.includes('ks_scraper')) scrapeKansas().then(() => process.exit(0));
