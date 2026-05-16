/**
 * North Carolina Cannabis Scraper
 * Source: https://www.ncagr.gov/divisions/plant-industry/plant-protection/hemp
 * Illegal statewide. Hemp/CBD only. EBCI tribal exception.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeNorthCarolina() {
  console.log('🌲 North Carolina — Monitor Scraper (Hemp/CBD / Tribal)');
  console.log('  Sources:');
  console.log('    - https://www.ncagr.gov/divisions/plant-industry/plant-protection/hemp');
  console.log('    - https://ebci-ccb.org/ (Tribal)');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const ncDeals = []; snap.forEach(d => { if (d.data().state === 'NC') ncDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${ncDeals.length} North Carolina records in CRM`);
  const byType = {};
  ncDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'NC', totalRecords: ncDeals.length, byType, sources: [
    'https://www.ncagr.gov/',
    'https://ebci-ccb.org/'
  ]};
}
if (process.argv[1]?.includes('nc_scraper')) scrapeNorthCarolina().then(() => process.exit(0));
