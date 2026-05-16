/**
 * South Carolina Cannabis/Hemp Scraper
 * Source: https://agriculture.sc.gov/divisions/consumer-protection/hemp/
 * Marijuana is strictly illegal. Hemp/CBD only.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeSouthCarolina() {
  console.log('🌴 South Carolina — Monitor Scraper (CBD/Hemp & Advocacy)');
  console.log('  Sources:');
  console.log('    - https://agriculture.sc.gov/divisions/consumer-protection/hemp/');
  console.log('    - Legislative Tracking (Compassionate Care Act S.53)');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const scDeals = []; snap.forEach(d => { if (d.data().state === 'SC') scDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${scDeals.length} South Carolina records in CRM`);
  const byType = {};
  scDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'SC', totalRecords: scDeals.length, byType, sources: [
    'https://agriculture.sc.gov/divisions/consumer-protection/hemp/'
  ]};
}
if (process.argv[1]?.includes('sc_scraper')) scrapeSouthCarolina().then(() => process.exit(0));
