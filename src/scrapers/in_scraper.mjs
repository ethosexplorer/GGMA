/**
 * Indiana CBD/Hemp Monitor Scraper
 * ⚠️ FULLY ILLEGAL state. CBD must be 0.0% THC for hemp-derived.
 * Tracks CBD shops, defense attorneys, advocacy orgs.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeIndiana() {
  console.log('🏁 Indiana — Monitor Scraper (Illegal State)');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const inDeals = []; snap.forEach(d => { if (d.data().state === 'IN') inDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${inDeals.length} Indiana records in CRM`);
  const byType = {};
  inDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'IN', totalRecords: inDeals.length, byType, sources: ['https://indianacannabis.org/medical'] };
}
if (process.argv[1]?.includes('in_scraper')) scrapeIndiana().then(() => process.exit(0));
