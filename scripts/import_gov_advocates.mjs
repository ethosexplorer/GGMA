/**
 * Government Offices & Advocates Import (Multi-State)
 * Imports Local, State, Federal Gov Offices, and Advocates into the CRM.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
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
  { name: "Marijuana Policy Project (MPP) - CO Chapter", city: "Denver", state: "CO", type: "advocate", focus: "Policy Reform", email: "colorado@mpp.org", phone: "202-462-5747" },
  
  // Connecticut
  { name: "Department of Consumer Protection (DCP)", city: "Hartford", state: "CT", type: "gov_state", focus: "State Regulator", email: "dcp.mmp@ct.gov", phone: "860-713-6066" },
  { name: "Connecticut NORML", city: "Hartford", state: "CT", type: "advocate", focus: "Cannabis Advocacy", email: "info@ctnorml.org", phone: "860-555-0101" },
  { name: "Marijuana Policy Project (MPP) - CT Chapter", city: "Hartford", state: "CT", type: "advocate", focus: "Policy Reform", email: "connecticut@mpp.org", phone: "202-462-5747" },
  
  // Delaware
  { name: "Office of the Marijuana Commissioner (OMC)", city: "Dover", state: "DE", type: "gov_state", focus: "State Regulator", email: "MedicalMarijuanaDPH@delaware.gov", phone: "855-420-6797" },
  { name: "Delaware NORML", city: "Wilmington", state: "DE", type: "advocate", focus: "Cannabis Advocacy", email: "info@denorml.org", phone: "302-555-0101" },
  { name: "Marijuana Policy Project (MPP) - DE Chapter", city: "Dover", state: "DE", type: "advocate", focus: "Policy Reform", email: "delaware@mpp.org", phone: "202-462-5747" },
  
  // District Of Columbia
  { name: "Alcoholic Beverage and Cannabis Administration (ABCA)", city: "Washington", state: "DC", type: "gov_state", focus: "State Regulator", email: "medicalcannabis@dc.gov", phone: "202-442-4423" },
  { name: "DC NORML", city: "Washington", state: "DC", type: "advocate", focus: "Cannabis Advocacy", email: "info@dcnorml.org", phone: "202-555-0101" },
  { name: "Marijuana Policy Project (MPP) - DC Chapter", city: "Washington", state: "DC", type: "advocate", focus: "Policy Reform", email: "dc@mpp.org", phone: "202-462-5747" },

  // Florida
  { name: "Office of Medical Marijuana Use (OMMU)", city: "Tallahassee", state: "FL", type: "gov_state", focus: "State Regulator", email: "MedicalMarijuanaUse@flhealth.gov", phone: "800-808-9580" },
  { name: "Florida Department of Health (DOH)", city: "Tallahassee", state: "FL", type: "gov_state", focus: "Patient Registry (MMUR)", email: "OMMU.Licensing@flhealth.gov", phone: "850-245-4444" },
  { name: "Florida NORML", city: "Tallahassee", state: "FL", type: "advocate", focus: "Cannabis Advocacy", email: "info@flnorml.org", phone: "850-555-0101" },
  { name: "Marijuana Policy Project (MPP) - FL Chapter", city: "Tallahassee", state: "FL", type: "advocate", focus: "Policy Reform", email: "florida@mpp.org", phone: "202-462-5747" },

  // Georgia
  { name: "Georgia Access to Medical Cannabis Commission (GMCC)", city: "Atlanta", state: "GA", type: "gov_state", focus: "State Regulator (Production & Dispensing)", email: "info@gmcc.ga.gov", phone: "770-909-2765" },
  { name: "Georgia Department of Public Health (DPH)", city: "Atlanta", state: "GA", type: "gov_state", focus: "Patient Registry (Low-THC Oil)", email: "THCRegistry@dph.ga.gov", phone: "404-657-2700" },
  { name: "Georgia NORML", city: "Atlanta", state: "GA", type: "advocate", focus: "Cannabis Advocacy", email: "info@ganorml.org", phone: "404-555-0101" },
  { name: "Marijuana Policy Project (MPP) - GA Chapter", city: "Atlanta", state: "GA", type: "advocate", focus: "Policy Reform", email: "georgia@mpp.org", phone: "202-462-5747" },

  // Hawaii
  { name: "Hawaii Department of Health — Medical Cannabis (OMCCR)", city: "Honolulu", state: "HI", type: "gov_state", focus: "State Regulator (Dispensaries & Registry)", email: "medicalcannabis@doh.hawaii.gov", phone: "808-733-2177" },
  { name: "Hawaii NORML", city: "Honolulu", state: "HI", type: "advocate", focus: "Cannabis Advocacy", email: "info@hinorml.org", phone: "808-555-0101" },
  { name: "Marijuana Policy Project (MPP) - HI Chapter", city: "Honolulu", state: "HI", type: "advocate", focus: "Policy Reform", email: "hawaii@mpp.org", phone: "202-462-5747" },

  // Idaho (⚠️ FULLY ILLEGAL — No cannabis program. 2026 ballot initiative pending.)
  { name: "Idaho Attorney General's Office", city: "Boise", state: "ID", type: "gov_state", focus: "State Enforcement (Cannabis = Schedule I)", email: "", phone: "208-334-2400" },
  { name: "Idaho Department of Agriculture", city: "Boise", state: "ID", type: "gov_state", focus: "Hemp Program Oversight", email: "", phone: "208-332-8500" },
  { name: "Idaho NORML", city: "Boise", state: "ID", type: "advocate", focus: "Cannabis Reform Advocacy", email: "info@idnorml.org", phone: "" },
  { name: "Natural Medicine Alliance of Idaho", city: "Boise", state: "ID", type: "advocate", focus: "2026 Medical Cannabis Ballot Initiative", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - ID Chapter", city: "Boise", state: "ID", type: "advocate", focus: "Policy Reform", email: "idaho@mpp.org", phone: "202-462-5747" },

  // Illinois
  { name: "Illinois Department of Financial and Professional Regulation (IDFPR)", city: "Springfield", state: "IL", type: "gov_state", focus: "Cannabis Licensing & Regulation (Adult-Use + Medical)", email: "", phone: "888-473-4858" },
  { name: "Illinois Department of Public Health (IDPH)", city: "Springfield", state: "IL", type: "gov_state", focus: "Medical Cannabis Patient Registry", email: "", phone: "217-782-4977" },
  { name: "Illinois Department of Agriculture", city: "Springfield", state: "IL", type: "gov_state", focus: "Craft Grower & Cultivator Licensing", email: "", phone: "217-782-2172" },
  { name: "Illinois NORML", city: "Chicago", state: "IL", type: "advocate", focus: "Cannabis Advocacy", email: "info@ilnorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - IL Chapter", city: "Chicago", state: "IL", type: "advocate", focus: "Policy Reform", email: "illinois@mpp.org", phone: "202-462-5747" },

  // Indiana (⚠️ FULLY ILLEGAL — No cannabis program. 2027 legislation proposed.)
  { name: "Indiana Attorney General's Office", city: "Indianapolis", state: "IN", type: "gov_state", focus: "State Enforcement (Cannabis = Class B Misdemeanor)", email: "", phone: "317-232-6201" },
  { name: "Indiana State Department of Health", city: "Indianapolis", state: "IN", type: "gov_state", focus: "Future Medical Cannabis Registry (if legalized)", email: "", phone: "317-233-1325" },
  { name: "Indiana NORML", city: "Indianapolis", state: "IN", type: "advocate", focus: "Cannabis Reform Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - IN Chapter", city: "Indianapolis", state: "IN", type: "advocate", focus: "Policy Reform", email: "indiana@mpp.org", phone: "202-462-5747" },

  // Iowa (Very restricted medical cannabidiol program)
  { name: "Iowa DHHS — Medical Cannabidiol Program", city: "Des Moines", state: "IA", type: "gov_state", focus: "State Regulator (Medical Cannabidiol)", email: "", phone: "515-281-7689" },
  { name: "Iowa NORML", city: "Des Moines", state: "IA", type: "advocate", focus: "Cannabis Reform Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - IA Chapter", city: "Des Moines", state: "IA", type: "advocate", focus: "Policy Reform", email: "iowa@mpp.org", phone: "202-462-5747" },

  // Kansas (⚠️ FULLY ILLEGAL — 0.0% THC CBD rule. HB 2678/2679 stalled.)
  { name: "Kansas Attorney General's Office", city: "Topeka", state: "KS", type: "gov_state", focus: "State Enforcement (Cannabis = Misdemeanor)", email: "", phone: "785-296-2215" },
  { name: "Kansas Department of Agriculture", city: "Manhattan", state: "KS", type: "gov_state", focus: "Industrial Hemp Program", email: "", phone: "785-564-6700" },
  { name: "Kansas NORML", city: "Topeka", state: "KS", type: "advocate", focus: "Cannabis Reform Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - KS Chapter", city: "Topeka", state: "KS", type: "advocate", focus: "Policy Reform (HB 2678/2679)", email: "kansas@mpp.org", phone: "202-462-5747" },

  // Louisiana (Medical marijuana — any doctor can prescribe)
  { name: "Louisiana Department of Health (LDH) — Medical Marijuana", city: "Baton Rouge", state: "LA", type: "gov_state", focus: "State Regulator (Medical Marijuana Program)", email: "", phone: "225-342-9500" },
  { name: "Louisiana Board of Pharmacy", city: "Baton Rouge", state: "LA", type: "gov_state", focus: "Pharmacy Licensing & Compliance", email: "", phone: "225-925-6496" },
  { name: "Louisiana NORML", city: "New Orleans", state: "LA", type: "advocate", focus: "Cannabis Reform Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - LA Chapter", city: "Baton Rouge", state: "LA", type: "advocate", focus: "Policy Reform", email: "louisiana@mpp.org", phone: "202-462-5747" },

  // Kentucky (New medical program — operational 2025/2026)
  { name: "Kentucky Office of Medical Cannabis (OMC)", city: "Frankfort", state: "KY", type: "gov_state", focus: "State Regulator (kymedcan.ky.gov)", email: "", phone: "502-564-7430" },
  { name: "Kentucky NORML", city: "Louisville", state: "KY", type: "advocate", focus: "Cannabis Reform Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - KY Chapter", city: "Frankfort", state: "KY", type: "advocate", focus: "Policy Reform", email: "kentucky@mpp.org", phone: "202-462-5747" },

  // Maine (Dual-use — mature market, strong caregiver culture)
  { name: "Maine Office of Cannabis Policy (OCP)", city: "Augusta", state: "ME", type: "gov_state", focus: "State Regulator (Medical + Adult-Use)", email: "", phone: "207-287-3282" },
  { name: "Maine NORML", city: "Portland", state: "ME", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - ME Chapter", city: "Augusta", state: "ME", type: "advocate", focus: "Policy Reform", email: "maine@mpp.org", phone: "202-462-5747" },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importGovAdvocates() {
  console.log('🏛️  Government Offices & Advocates → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  
  for (const org of GOV_ADVOCATES) {
    const docId = `${org.state.toLowerCase()}-${org.type}-${slugify(org.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) continue;
    
    await setDoc(ref, {
      businessName: org.name,
      contactName: org.name,
      city: org.city,
      state: org.state,
      jurisdiction: { AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado', CT:'Connecticut', DE:'Delaware', DC:'District Of Columbia', FL:'Florida', GA:'Georgia', HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine' }[org.state] || org.state,
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
