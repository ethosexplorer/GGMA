/**
 * Pennsylvania Cannabis Scraper
 * Source: https://www.health.pa.gov/topics/programs/Medical%20Marijuana
 * Medical only. PA DOH regulates. MJ Freeway.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapePennsylvania() {
  console.log('🔔 Pennsylvania DOH — Monitor Scraper (Medical Only)');
  console.log('  Sources:');
  console.log('    - https://www.health.pa.gov/topics/programs/Medical%20Marijuana/Pages/Dispensaries.aspx');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const paDeals = []; snap.forEach(d => { if (d.data().state === 'PA') paDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${paDeals.length} Pennsylvania records in CRM`);
  const byType = {};
  paDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'PA', totalRecords: paDeals.length, byType, sources: [
    'https://www.health.pa.gov/topics/programs/Medical%20Marijuana/'
  ]};
}
if (process.argv[1]?.includes('pa_scraper')) scrapePennsylvania().then(() => process.exit(0));
