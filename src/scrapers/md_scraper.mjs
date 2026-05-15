/**
 * Maryland Cannabis Scraper
 * Source: https://cannabis.maryland.gov/
 * Dual-use state since July 2023. MCA (formerly MMCC) regulates.
 * 100+ dispensaries statewide. Interactive dispensary map available.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeMaryland() {
  console.log('🦀 Maryland MCA — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://cannabis.maryland.gov/Pages/Industry_Licensees_and_Registrants.aspx');
  console.log('    - MCA Interactive Dispensary Map');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const mdDeals = []; snap.forEach(d => { if (d.data().state === 'MD') mdDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${mdDeals.length} Maryland records in CRM`);
  const byType = {};
  mdDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'MD', totalRecords: mdDeals.length, byType, sources: [
    'https://cannabis.maryland.gov/Pages/Industry_Licensees_and_Registrants.aspx',
    'https://cannabis.maryland.gov/Pages/patients.aspx'
  ]};
}
if (process.argv[1]?.includes('md_scraper')) scrapeMaryland().then(() => process.exit(0));
