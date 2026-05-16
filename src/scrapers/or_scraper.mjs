/**
 * Oregon Cannabis Scraper
 * Source: https://www.oregon.gov/olcc/marijuana
 * Source: https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram
 * Dual-use market. OLCC & OHA regulate. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeOregon() {
  console.log('🌲 Oregon OLCC/OHA — Monitor Scraper (Dual-Use)');
  console.log('  Sources:');
  console.log('    - https://www.oregon.gov/olcc/marijuana');
  console.log('    - https://ommpsystem.oregon.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const orDeals = []; snap.forEach(d => { if (d.data().state === 'OR') orDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${orDeals.length} Oregon records in CRM`);
  const byType = {};
  orDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'OR', totalRecords: orDeals.length, byType, sources: [
    'https://www.oregon.gov/olcc/marijuana',
    'https://ommpsystem.oregon.gov/'
  ]};
}
if (process.argv[1]?.includes('or_scraper')) scrapeOregon().then(() => process.exit(0));
