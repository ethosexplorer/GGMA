/**
 * Texas Cannabis Scraper (TCUP)
 * Source: https://www.dps.texas.gov/section/compassionate-use-program
 * Medical only. Highly restricted. 1% THC limit.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeTexas() {
  console.log('🤠 Texas DPS (TCUP) — Monitor Scraper (Medical Only)');
  console.log('  Sources:');
  console.log('    - https://www.dps.texas.gov/section/compassionate-use-program');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const txDeals = []; snap.forEach(d => { if (d.data().state === 'TX') txDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${txDeals.length} Texas records in CRM`);
  const byType = {};
  txDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'TX', totalRecords: txDeals.length, byType, sources: [
    'https://www.dps.texas.gov/section/compassionate-use-program'
  ]};
}
if (process.argv[1]?.includes('tx_scraper')) scrapeTexas().then(() => process.exit(0));
