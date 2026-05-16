/**
 * Massachusetts Cannabis Scraper
 * Source: https://masscannabiscontrol.com/
 * Mature dual-use market. CCC regulates. 300+ retailers. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeMassachusetts() {
  console.log('🏛️ Massachusetts CCC — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://masscannabiscontrol.com/');
  console.log('    - https://patient.massciportal.com/mmj-patient/login');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const maDeals = []; snap.forEach(d => { if (d.data().state === 'MA') maDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${maDeals.length} Massachusetts records in CRM`);
  const byType = {};
  maDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'MA', totalRecords: maDeals.length, byType, sources: [
    'https://masscannabiscontrol.com/',
    'https://patient.massciportal.com/mmj-patient/login'
  ]};
}
if (process.argv[1]?.includes('ma_scraper')) scrapeMassachusetts().then(() => process.exit(0));
