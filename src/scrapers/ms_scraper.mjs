/**
 * Mississippi Cannabis Scraper
 * Source: https://www.mmcp.ms.gov/
 * Medical-only market. MMCP/MSDH regulates. ~200+ dispensaries. BioTrack.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeMississippi() {
  console.log('🫘 Mississippi MMCP — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://www.mmcp.ms.gov/');
  console.log('    - https://ms-doh-public.nls.egov.com/login');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const msDeals = []; snap.forEach(d => { if (d.data().state === 'MS') msDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${msDeals.length} Mississippi records in CRM`);
  const byType = {};
  msDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'MS', totalRecords: msDeals.length, byType, sources: [
    'https://www.mmcp.ms.gov/',
    'https://ms-doh-public.nls.egov.com/login'
  ]};
}
if (process.argv[1]?.includes('ms_scraper')) scrapeMississippi().then(() => process.exit(0));
