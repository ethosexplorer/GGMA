/**
 * Utah Medical Cannabis Scraper
 * Source: https://medicalcannabis.utah.gov/
 * Medical only. Pharmacies. DHHS/UDAF Regulated. EVS.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeUtah() {
  console.log('🐝 Utah (DHHS/UDAF) — Monitor Scraper (Medical Only)');
  console.log('  Sources:');
  console.log('    - https://medicalcannabis.utah.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const utDeals = []; snap.forEach(d => { if (d.data().state === 'UT') utDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${utDeals.length} Utah records in CRM`);
  const byType = {};
  utDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'UT', totalRecords: utDeals.length, byType, sources: [
    'https://medicalcannabis.utah.gov/'
  ]};
}
if (process.argv[1]?.includes('ut_scraper')) scrapeUtah().then(() => process.exit(0));
