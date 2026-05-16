/**
 * Minnesota Cannabis Scraper
 * Source: https://mn.gov/ocm/
 * New dual-use market. OCM regulates. ~135 licenses. Tribal dispensaries.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeMinnesota() {
  console.log('🌲 Minnesota OCM — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://mn.gov/ocm/businesses/licensing/license-types/');
  console.log('    - https://cannabis.web.health.state.mn.us/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const mnDeals = []; snap.forEach(d => { if (d.data().state === 'MN') mnDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${mnDeals.length} Minnesota records in CRM`);
  const byType = {};
  mnDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'MN', totalRecords: mnDeals.length, byType, sources: [
    'https://mn.gov/ocm/businesses/licensing/license-types/',
    'https://cannabis.web.health.state.mn.us/'
  ]};
}
if (process.argv[1]?.includes('mn_scraper')) scrapeMinnesota().then(() => process.exit(0));
