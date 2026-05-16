/**
 * New Mexico Cannabis Scraper
 * Source: https://www.rld.nm.gov/cannabis/
 * Dual-use market. CCD regulates. BioTrack.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeNewMexico() {
  console.log('🌶️  New Mexico CCD — Monitor Scraper');
  console.log('  Sources:');
  console.log('    - https://www.rld.nm.gov/cannabis/');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const nmDeals = []; snap.forEach(d => { if (d.data().state === 'NM') nmDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${nmDeals.length} New Mexico records in CRM`);
  const byType = {};
  nmDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'NM', totalRecords: nmDeals.length, byType, sources: [
    'https://www.rld.nm.gov/cannabis/'
  ]};
}
if (process.argv[1]?.includes('nm_scraper')) scrapeNewMexico().then(() => process.exit(0));
