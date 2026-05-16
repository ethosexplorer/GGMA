/**
 * Ohio Cannabis Scraper
 * Source: https://com.ohio.gov/divisions-and-programs/cannabis-control
 * Dual-use market. DCC regulates. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeOhio() {
  console.log('🌰 Ohio DCC — Monitor Scraper (Dual-Use)');
  console.log('  Sources:');
  console.log('    - https://com.ohio.gov/divisions-and-programs/cannabis-control');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const ohDeals = []; snap.forEach(d => { if (d.data().state === 'OH') ohDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${ohDeals.length} Ohio records in CRM`);
  const byType = {};
  ohDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'OH', totalRecords: ohDeals.length, byType, sources: [
    'https://com.ohio.gov/divisions-and-programs/cannabis-control'
  ]};
}
if (process.argv[1]?.includes('oh_scraper')) scrapeOhio().then(() => process.exit(0));
