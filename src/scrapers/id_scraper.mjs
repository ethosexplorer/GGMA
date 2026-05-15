/**
 * Idaho Cannabis Monitor Scraper
 * ⚠️ FULLY ILLEGAL state. 2026 ballot initiative pending.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeIdaho() {
  console.log('🏔️  Idaho — Monitor Scraper (Illegal State)');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const idDeals = []; snap.forEach(d => { if (d.data().state === 'ID') idDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${idDeals.length} Idaho records in CRM`);
  const byType = {};
  idDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'ID', totalRecords: idDeals.length, byType, sources: ['https://idahocannabis.org/medical'] };
}
if (process.argv[1]?.includes('id_scraper')) scrapeIdaho().then(() => process.exit(0));
