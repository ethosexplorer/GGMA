/**
 * Washington Cannabis Scraper
 * Source: https://lcb.wa.gov/ and https://doh.wa.gov/
 * Dual-use. LCB/DOH Regulated.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeWashington() {
  console.log('🌲 Washington LCB/DOH — Monitor Scraper (Dual-Use)');
  console.log('  Sources:');
  console.log('    - https://lcb.wa.gov/mjlicense/marijuana-licensing');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const waDeals = []; snap.forEach(d => { if (d.data().state === 'WA') waDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${waDeals.length} Washington records in CRM`);
  const byType = {};
  waDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'WA', totalRecords: waDeals.length, byType, sources: [
    'https://lcb.wa.gov/', 'https://doh.wa.gov/'
  ]};
}
if (process.argv[1]?.includes('wa_scraper')) scrapeWashington().then(() => process.exit(0));
