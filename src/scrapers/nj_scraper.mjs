/**
 * New Jersey Cannabis Scraper
 * Source: https://www.nj.gov/cannabis/ / https://njcrcgov.info/dispensary
 * Dual-use market. CRC regulates. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeNewJersey() {
  console.log('🏗️  New Jersey CRC — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://www.nj.gov/cannabis/');
  console.log('    - https://njcrcgov.info/dispensary');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const njDeals = []; snap.forEach(d => { if (d.data().state === 'NJ') njDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${njDeals.length} New Jersey records in CRM`);
  const byType = {};
  njDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'NJ', totalRecords: njDeals.length, byType, sources: [
    'https://www.nj.gov/cannabis/',
    'https://njcrcgov.info/dispensary'
  ]};
}
if (process.argv[1]?.includes('nj_scraper')) scrapeNewJersey().then(() => process.exit(0));
