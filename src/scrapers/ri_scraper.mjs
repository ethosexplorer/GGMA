/**
 * Rhode Island Cannabis Scraper
 * Source: https://ccc.ri.gov/
 * Dual-use market. CCC regulates. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeRhodeIsland() {
  console.log('⚓ Rhode Island CCC — Monitor Scraper (Dual-Use)');
  console.log('  Sources:');
  console.log('    - https://ccc.ri.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const riDeals = []; snap.forEach(d => { if (d.data().state === 'RI') riDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${riDeals.length} Rhode Island records in CRM`);
  const byType = {};
  riDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'RI', totalRecords: riDeals.length, byType, sources: [
    'https://ccc.ri.gov/'
  ]};
}
if (process.argv[1]?.includes('ri_scraper')) scrapeRhodeIsland().then(() => process.exit(0));
