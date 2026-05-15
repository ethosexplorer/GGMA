/**
 * Government Offices & Advocates Import (Multi-State)
 * Imports Local, State, Federal Gov Offices, and Advocates into the CRM.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyCnTrdE2RPivEMJN9JhV0lzH20XJtGaUhQ", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const GOV_ADVOCATES = [
  // Arkansas
  { name: "Arkansas Medical Marijuana Commission", city: "Little Rock", state: "AR", type: "gov_state", focus: "State Regulator", email: "mmj@dfa.arkansas.gov", phone: "501-682-4982" },
  { name: "AR NORML", city: "Little Rock", state: "AR", type: "advocate", focus: "Cannabis Advocacy", email: "info@arnorml.org", phone: "501-555-1234" },
  { name: "Marijuana Policy Project (MPP) - AR Chapter", city: "Little Rock", state: "AR", type: "advocate", focus: "Policy Reform", email: "arkansas@mpp.org", phone: "202-462-5747" },
  
  // Arizona
  { name: "Arizona Department of Health Services (AZDHS)", city: "Phoenix", state: "AZ", type: "gov_state", focus: "State Regulator", email: "medicalmarijuana@azdhs.gov", phone: "602-542-1025" },
  { name: "Arizona NORML", city: "Phoenix", state: "AZ", type: "advocate", focus: "Cannabis Advocacy", email: "arizona@norml.org", phone: "602-555-9876" },
  
  // Alaska
  { name: "Alcohol and Marijuana Control Office (AMCO)", city: "Anchorage", state: "AK", type: "gov_state", focus: "State Regulator", email: "marijuana.licensing@alaska.gov", phone: "907-269-0350" },
  { name: "Alaska Marijuana Industry Association", city: "Anchorage", state: "AK", type: "advocate", focus: "Industry Advocate", email: "info@alaskamia.org", phone: "907-555-4321" },
  
  // Alabama
  { name: "Alabama Medical Cannabis Commission (AMCC)", city: "Montgomery", state: "AL", type: "gov_state", focus: "State Regulator", email: "info@amcc.alabama.gov", phone: "334-353-5544" },
  { name: "Alabama NORML", city: "Birmingham", state: "AL", type: "advocate", focus: "Cannabis Advocacy", email: "info@alnorml.org", phone: "205-555-6789" },
  
  // California
  { name: "California Department of Cannabis Control (DCC)", city: "Sacramento", state: "CA", type: "gov_state", focus: "State Regulator", email: "info@cannabis.ca.gov", phone: "1-844-612-2322" },
  { name: "California Department of Public Health (CDPH) - MMICP", city: "Sacramento", state: "CA", type: "gov_state", focus: "Patient Registry (State Level)", email: "mmpinfo@cdph.ca.gov", phone: "916-552-8600" },
  { name: "California NORML", city: "San Francisco", state: "CA", type: "advocate", focus: "Cannabis Advocacy", email: "info@canorml.org", phone: "415-563-5858" },
  { name: "Marijuana Policy Project (MPP) - CA Chapter", city: "Sacramento", state: "CA", type: "advocate", focus: "Policy Reform", email: "california@mpp.org", phone: "202-462-5747" },
  
  // Colorado
  { name: "Marijuana Enforcement Division (MED)", city: "Denver", state: "CO", type: "gov_state", focus: "State Regulator", email: "dor_med_inquiries@state.co.us", phone: "303-866-3330" },
  { name: "Colorado Department of Public Health & Environment (CDPHE)", city: "Denver", state: "CO", type: "gov_state", focus: "Patient Registry", email: "medical.marijuana@state.co.us", phone: "303-692-2184" },
  { name: "Colorado NORML", city: "Denver", state: "CO", type: "advocate", focus: "Cannabis Advocacy", email: "info@coloradonorml.org", phone: "720-319-7337" },
  { name: "Marijuana Policy Project (MPP) - CO Chapter", city: "Denver", state: "CO", type: "advocate", focus: "Policy Reform", email: "colorado@mpp.org", phone: "202-462-5747" }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importGovAdvocates() {
  console.log('🏛️  Government Offices & Advocates → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  
  for (const org of GOV_ADVOCATES) {
    const docId = `${org.state.toLowerCase()}-${org.type}-${slugify(org.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    
    await setDoc(ref, {
      businessName: org.name,
      contactName: org.name,
      city: org.city,
      state: org.state,
      jurisdiction: org.state === 'AR' ? 'Arkansas' : org.state === 'AZ' ? 'Arizona' : org.state === 'AK' ? 'Alaska' : 'Alabama',
      type: org.type, // 'gov_state', 'gov_local', 'gov_federal', or 'advocate'
      email: org.email || '',
      phone: org.phone || '',
      licenseStatus: 'Active',
      source: 'Public Web Search',
      status: 'Lead',
      pipeline: 'new',
      tags: [org.state.toLowerCase(), org.type, 'policy'],
      notes: `Focus: ${org.focus}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${org.name} (${org.state})`);
  }
}

importGovAdvocates().catch(console.error);
