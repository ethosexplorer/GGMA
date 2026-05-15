/**
 * Louisiana Medical Marijuana Scraper
 * Source: https://ldh.la.gov/page/medical-marijuana
 * 10 licensed retail pharmacy permits + satellites. Any doctor can prescribe.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeLouisiana() {
  console.log('⚜️  Louisiana LDH — Monitor Scraper');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const laDeals = []; snap.forEach(d => { if (d.data().state === 'LA') laDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${laDeals.length} Louisiana records in CRM`);
  const byType = {};
  laDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'LA', totalRecords: laDeals.length, byType, sources: ['https://ldh.la.gov/page/medical-marijuana'] };
}
if (process.argv[1]?.includes('la_scraper')) scrapeLouisiana().then(() => process.exit(0));
