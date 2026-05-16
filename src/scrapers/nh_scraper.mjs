/**
 * New Hampshire Therapeutic Cannabis Scraper
 * Source: https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/
 * Medical-only. 7 ATCs. 3 operators. Not-for-profit.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeNewHampshire() {
  console.log('🏔️  New Hampshire DHHS TCP — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const nhDeals = []; snap.forEach(d => { if (d.data().state === 'NH') nhDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${nhDeals.length} New Hampshire records in CRM`);
  const byType = {};
  nhDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'NH', totalRecords: nhDeals.length, byType, sources: [
    'https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/'
  ]};
}
if (process.argv[1]?.includes('nh_scraper')) scrapeNewHampshire().then(() => process.exit(0));
