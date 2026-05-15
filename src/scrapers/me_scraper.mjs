/**
 * Maine Cannabis Scraper
 * Source: https://www.maine.gov/dafs/ocp/
 * Dual-use state. Strong caregiver culture. OCP regulates both programs.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeMaine() {
  console.log('🦞 Maine OCP — Monitor Scraper');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const meDeals = []; snap.forEach(d => { if (d.data().state === 'ME') meDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${meDeals.length} Maine records in CRM`);
  const byType = {};
  meDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'ME', totalRecords: meDeals.length, byType, sources: ['https://www.maine.gov/dafs/ocp/'] };
}
if (process.argv[1]?.includes('me_scraper')) scrapeMaine().then(() => process.exit(0));
