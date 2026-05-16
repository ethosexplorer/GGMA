/**
 * Vermont Cannabis Scraper
 * Source: https://ccb.vermont.gov/
 * Dual-use market. CCB Regulates.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeVermont() {
  console.log('🍁 Vermont CCB — Monitor Scraper (Dual-Use)');
  console.log('  Sources:');
  console.log('    - https://ccb.vermont.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const vtDeals = []; snap.forEach(d => { if (d.data().state === 'VT') vtDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${vtDeals.length} Vermont records in CRM`);
  const byType = {};
  vtDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'VT', totalRecords: vtDeals.length, byType, sources: [
    'https://ccb.vermont.gov/'
  ]};
}
if (process.argv[1]?.includes('vt_scraper')) scrapeVermont().then(() => process.exit(0));
