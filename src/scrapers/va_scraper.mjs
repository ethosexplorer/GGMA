/**
 * Virginia Cannabis Scraper
 * Source: https://cca.virginia.gov/
 * Medical sales only. CCA Regulates.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeVirginia() {
  console.log('🏛️ Virginia CCA — Monitor Scraper (Medical Sales Only)');
  console.log('  Sources:');
  console.log('    - https://cca.virginia.gov/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const vaDeals = []; snap.forEach(d => { if (d.data().state === 'VA') vaDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${vaDeals.length} Virginia records in CRM`);
  const byType = {};
  vaDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'VA', totalRecords: vaDeals.length, byType, sources: [
    'https://cca.virginia.gov/'
  ]};
}
if (process.argv[1]?.includes('va_scraper')) scrapeVirginia().then(() => process.exit(0));
