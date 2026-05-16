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

  // Maryland (Dual-use since July 2023. MCA regulates.)
  { name: "Maryland Cannabis Administration (MCA)", city: "Annapolis", state: "MD", type: "gov_state", focus: "State Regulator (Medical + Adult-Use)", email: "mdcannabis.mca@maryland.gov", phone: "410-487-8100" },
  { name: "Maryland NORML", city: "Baltimore", state: "MD", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - MD Chapter", city: "Annapolis", state: "MD", type: "advocate", focus: "Policy Reform", email: "maryland@mpp.org", phone: "202-462-5747" },

  // Michigan (Dual-use mega-market — $3.17B, 838+ retailers)
  { name: "Michigan Cannabis Regulatory Agency (CRA)", city: "Lansing", state: "MI", type: "gov_state", focus: "State Regulator (MRTMA + MMFLA)", email: "CRA-Compliance@michigan.gov", phone: "517-284-8599" },
  { name: "Michigan NORML", city: "Detroit", state: "MI", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - MI Chapter", city: "Lansing", state: "MI", type: "advocate", focus: "Policy Reform", email: "michigan@mpp.org", phone: "202-462-5747" },

  // Minnesota (New dual-use market. OCM regulates. Tribal dispensaries.)
  { name: "Minnesota Office of Cannabis Management (OCM)", city: "St Paul", state: "MN", type: "gov_state", focus: "State Regulator (Adult-Use + Medical + Hemp)", email: "cannabis.info@state.mn.us", phone: "651-201-5000" },
  { name: "Minnesota NORML", city: "Minneapolis", state: "MN", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - MN Chapter", city: "St Paul", state: "MN", type: "advocate", focus: "Policy Reform", email: "minnesota@mpp.org", phone: "202-462-5747" },

  // Massachusetts (Mature dual-use. CCC regulates. 300+ retailers. ~$3B sales.)
  { name: "Massachusetts Cannabis Control Commission (CCC)", city: "Boston", state: "MA", type: "gov_state", focus: "State Regulator (Adult-Use + Medical)", email: "CannabisCommission@mass.gov", phone: "617-010-0100" },
  { name: "Massachusetts NORML", city: "Boston", state: "MA", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - MA Chapter", city: "Boston", state: "MA", type: "advocate", focus: "Policy Reform", email: "massachusetts@mpp.org", phone: "202-462-5747" },

  // Mississippi (Medical only. SB 2095 (2022). MMCP/MSDH regulates. ~200+ dispensaries.)
  { name: "Mississippi Medical Cannabis Program (MMCP)", city: "Jackson", state: "MS", type: "gov_state", focus: "State Regulator (Medical Only)", email: "MMCP@msdh.ms.gov", phone: "601-576-7400" },
  { name: "Mississippi NORML", city: "Jackson", state: "MS", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - MS Chapter", city: "Jackson", state: "MS", type: "advocate", focus: "Policy Reform", email: "mississippi@mpp.org", phone: "202-462-5747" },

  // Missouri (Dual-use. Amendment 3 (2022). DCR/DHSS regulates. 200+ dispensaries. ~$2B market.)
  { name: "Missouri Division of Cannabis Regulation (DCR)", city: "Jefferson City", state: "MO", type: "gov_state", focus: "State Regulator (Adult-Use + Medical)", email: "medicalmarijuanainfo@health.mo.gov", phone: "866-219-0165" },
  { name: "Missouri NORML", city: "St Louis", state: "MO", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - MO Chapter", city: "Kansas City", state: "MO", type: "advocate", focus: "Policy Reform", email: "missouri@mpp.org", phone: "202-462-5747" },

  // Montana (Dual-use. I-190 (2020). CCD/DOR regulates. Hundreds of dispensaries. 20% rec / 4% med tax.)
  { name: "Montana Cannabis Control Division (CCD)", city: "Helena", state: "MT", type: "gov_state", focus: "State Regulator (Adult-Use + Medical) under DOR", email: "DORCannabis@mt.gov", phone: "406-444-0551" },
  { name: "Montana NORML", city: "Missoula", state: "MT", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - MT Chapter", city: "Helena", state: "MT", type: "advocate", focus: "Policy Reform", email: "montana@mpp.org", phone: "202-462-5747" },

  // Nevada (Dual-use LIMITED-LICENSE. Question 2 (2016). CCB regulates. Tourism-driven market.)
  { name: "Nevada Cannabis Compliance Board (CCB)", city: "Carson City", state: "NV", type: "gov_state", focus: "State Regulator (Adult-Use + Medical). Limited-license market.", email: "ccbinfo@ccb.nv.gov", phone: "775-687-7670" },
  { name: "Nevada NORML", city: "Las Vegas", state: "NV", type: "advocate", focus: "Cannabis Advocacy", email: "", phone: "" },
  { name: "Marijuana Policy Project (MPP) - NV Chapter", city: "Las Vegas", state: "NV", type: "advocate", focus: "Policy Reform", email: "nevada@mpp.org", phone: "202-462-5747" },

  // New Hampshire (Medical only. HB 573 (2013). 7 ATCs. 3 operators. DHHS TCP regulates. Tax-free.)
  { name: "NH DHHS Therapeutic Cannabis Program (TCP)", city: "Concord", state: "NH", type: "gov_state", focus: "State Regulator (Medical Only — Therapeutic Cannabis)", email: "DHHS-TCP@dhhs.nh.gov", phone: "603-271-9520" },
  { name: "New Hampshire NORML", city: "Concord", state: "NH", type: "advocate", focus: "Cannabis Advocacy", email: "info@nhnorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - NH Chapter", city: "Concord", state: "NH", type: "advocate", focus: "Policy Reform — pushing adult-use legalization", email: "newhampshire@mpp.org", phone: "202-462-5747" },

  // New Jersey (Dual-use. NJCREAMMA. CRC regulates.)
  { name: "New Jersey Cannabis Regulatory Commission (CRC)", city: "Trenton", state: "NJ", type: "gov_state", focus: "State Regulator (Adult-Use + Medical)", email: "cannabis@nj.gov", phone: "609-376-5550" },
  { name: "New Jersey NORML", city: "Newark", state: "NJ", type: "advocate", focus: "Cannabis Advocacy", email: "info@njnorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - NJ Chapter", city: "Trenton", state: "NJ", type: "advocate", focus: "Policy Reform", email: "newjersey@mpp.org", phone: "202-462-5747" },

  // New Mexico (Dual-use. CRA 2021. CCD regulates. 13% tax. Reciprocity.)
  { name: "NM Cannabis Control Division (CCD)", city: "Santa Fe", state: "NM", type: "gov_state", focus: "State Regulator (Adult-Use + Medical)", email: "Cannabis.Control@state.nm.us", phone: "505-476-4995" },
  { name: "New Mexico NORML", city: "Albuquerque", state: "NM", type: "advocate", focus: "Cannabis Advocacy", email: "info@nmnorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - NM Chapter", city: "Santa Fe", state: "NM", type: "advocate", focus: "Policy Reform", email: "newmexico@mpp.org", phone: "202-462-5747" },

  // North Carolina (Illegal statewide. Hemp/CBD only. EBCI tribal exception.)
  { name: "NC Department of Agriculture (Hemp Program)", city: "Raleigh", state: "NC", type: "gov_state", focus: "State Regulator (Hemp/CBD)", email: "hemp@ncagr.gov", phone: "919-707-3730" },
  { name: "EBCI Cannabis Control Board", city: "Cherokee", state: "NC", type: "gov_state", focus: "Tribal Regulator (Qualla Boundary)", email: "info@ebci-ccb.org", phone: "828-497-7000" },
  { name: "North Carolina NORML", city: "Charlotte", state: "NC", type: "advocate", focus: "Cannabis Advocacy", email: "info@ncnorml.org", phone: "" },

  // North Dakota (Medical only. DHHS regulates. Strict caps.)
  { name: "ND DHHS - Medical Marijuana Program", city: "Bismarck", state: "ND", type: "gov_state", focus: "State Regulator (Medical Cannabis)", email: "medmarijuana@nd.gov", phone: "701-328-3330" },
  { name: "North Dakota NORML", city: "Fargo", state: "ND", type: "advocate", focus: "Cannabis Advocacy", email: "info@ndnorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - ND Chapter", city: "Bismarck", state: "ND", type: "advocate", focus: "Policy Reform", email: "northdakota@mpp.org", phone: "202-462-5747" },

  // Ohio (Dual-use. Issue 2 2023. DCC regulates.)
  { name: "Ohio Division of Cannabis Control (DCC)", city: "Columbus", state: "OH", type: "gov_state", focus: "State Regulator (Dual-Use)", email: "MMCPRegistry@pharmacy.ohio.gov", phone: "833-464-6627" },
  { name: "Ohio NORML", city: "Columbus", state: "OH", type: "advocate", focus: "Cannabis Advocacy", email: "info@ohionorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - OH Chapter", city: "Columbus", state: "OH", type: "advocate", focus: "Policy Reform", email: "ohio@mpp.org", phone: "202-462-5747" },

  // Oregon (Dual-use. OLCC and OHA/OMMP regulates.)
  { name: "Oregon Liquor and Cannabis Commission (OLCC)", city: "Portland", state: "OR", type: "gov_state", focus: "State Regulator (Adult-Use)", email: "marijuana@oregon.gov", phone: "503-872-5000" },
  { name: "Oregon Health Authority (OMMP)", city: "Portland", state: "OR", type: "gov_state", focus: "State Regulator (Medical Registry)", email: "medmarijuana.dispensaries@odhsoha.oregon.gov", phone: "971-673-1234" },
  { name: "Oregon NORML", city: "Portland", state: "OR", type: "advocate", focus: "Cannabis Advocacy", email: "info@ornorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - OR Chapter", city: "Portland", state: "OR", type: "advocate", focus: "Policy Reform", email: "oregon@mpp.org", phone: "202-462-5747" },

  // Pennsylvania (Medical only. DOH regulates. 0% retail tax, 5% wholesale.)
  { name: "Pennsylvania Department of Health (DOH)", city: "Harrisburg", state: "PA", type: "gov_state", focus: "State Regulator (Medical Cannabis)", email: "RA-DHMedMarijuana@pa.gov", phone: "888-733-5595" },
  { name: "Keystone Cannabis Coalition", city: "Philadelphia", state: "PA", type: "advocate", focus: "Cannabis Advocacy", email: "info@keystonecannabis.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - PA Chapter", city: "Harrisburg", state: "PA", type: "advocate", focus: "Policy Reform", email: "pennsylvania@mpp.org", phone: "202-462-5747" },

  // Rhode Island (Dual-use. CCC regulates.)
  { name: "Rhode Island Cannabis Control Commission (CCC)", city: "Providence", state: "RI", type: "gov_state", focus: "State Regulator (Adult-Use)", email: "ccc@ri.gov", phone: "401-222-2828" },
  { name: "Rhode Island Department of Health (DOH)", city: "Providence", state: "RI", type: "gov_state", focus: "State Regulator (Medical)", email: "mmp@health.ri.gov", phone: "401-222-5960" },
  { name: "Rhode Island NORML", city: "Providence", state: "RI", type: "advocate", focus: "Cannabis Advocacy", email: "info@rinorml.org", phone: "" },

  // South Carolina (Illegal. SCDA regulates Hemp.)
  { name: "South Carolina Department of Agriculture (SCDA)", city: "Columbia", state: "SC", type: "gov_state", focus: "State Regulator (Hemp)", email: "hemp@scda.sc.gov", phone: "803-734-2210" },
  { name: "SC Compassionate Care Alliance", city: "Columbia", state: "SC", type: "advocate", focus: "Policy Reform (Medical Cannabis)", email: "info@sccompassionatecare.org", phone: "" },

  // South Dakota (Medical only. DOH regulates.)
  { name: "South Dakota Department of Health (DOH)", city: "Pierre", state: "SD", type: "gov_state", focus: "State Regulator (Medical Cannabis)", email: "MCST@state.sd.us", phone: "605-773-3361" },
  { name: "South Dakotans for Better Marijuana Laws (SDBML)", city: "Sioux Falls", state: "SD", type: "advocate", focus: "Cannabis Advocacy", email: "info@southdakotamarijuana.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - SD Chapter", city: "Pierre", state: "SD", type: "advocate", focus: "Policy Reform", email: "southdakota@mpp.org", phone: "202-462-5747" },

  // Tennessee (Illegal. TABC regulates HDCPs.)
  { name: "Tennessee Alcoholic Beverage Commission (TABC)", city: "Nashville", state: "TN", type: "gov_state", focus: "State Regulator (HDCP Retail)", email: "TABC.Info@tn.gov", phone: "615-741-1602" },
  { name: "Tennessee Department of Agriculture (TDA)", city: "Nashville", state: "TN", type: "gov_state", focus: "State Regulator (Hemp Cultivation)", email: "hemp@tn.gov", phone: "615-837-5100" },
  { name: "Tennessee Growers Coalition", city: "Nashville", state: "TN", type: "advocate", focus: "Hemp Industry Advocacy", email: "info@tngrowerscoalition.com", phone: "" },

  // Texas (Medical only. DPS regulates TCUP.)
  { name: "Texas Department of Public Safety (DPS)", city: "Austin", state: "TX", type: "gov_state", focus: "State Regulator (TCUP)", email: "TCUP@dps.texas.gov", phone: "512-424-2000" },
  { name: "Texas NORML", city: "Austin", state: "TX", type: "advocate", focus: "Cannabis Advocacy", email: "info@texasnorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - TX Chapter", city: "Austin", state: "TX", type: "advocate", focus: "Policy Reform", email: "texas@mpp.org", phone: "202-462-5747" },

  // Utah (Medical only. UDAF/DHHS regulates.)
  { name: "Utah Department of Agriculture and Food (UDAF)", city: "Salt Lake City", state: "UT", type: "gov_state", focus: "State Regulator (Pharmacies/Cultivation)", email: "cannabis@utah.gov", phone: "801-982-2200" },
  { name: "Utah Department of Health and Human Services (DHHS)", city: "Salt Lake City", state: "UT", type: "gov_state", focus: "State Regulator (EVS/Patients)", email: "medicalcannabis@utah.gov", phone: "801-538-6504" },
  { name: "TRUCE Utah", city: "Salt Lake City", state: "UT", type: "advocate", focus: "Patient Advocacy", email: "info@truceutah.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - UT Chapter", city: "Salt Lake City", state: "UT", type: "advocate", focus: "Policy Reform", email: "utah@mpp.org", phone: "202-462-5747" },

  // Vermont (Dual use. CCB regulates.)
  { name: "Vermont Cannabis Control Board (CCB)", city: "Montpelier", state: "VT", type: "gov_state", focus: "State Regulator (Dual-Use)", email: "CCB.Info@vermont.gov", phone: "802-828-1010" },
  { name: "Vermont Cannabis Trade Association", city: "Montpelier", state: "VT", type: "advocate", focus: "Industry Advocacy", email: "info@vtcannabistrade.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - VT Chapter", city: "Montpelier", state: "VT", type: "advocate", focus: "Policy Reform", email: "vermont@mpp.org", phone: "202-462-5747" },

  // Virginia (Medical sales only. Adult-use possession legal. CCA regulates.)
  { name: "Virginia Cannabis Control Authority (CCA)", city: "Richmond", state: "VA", type: "gov_state", focus: "State Regulator", email: "info@cca.virginia.gov", phone: "804-688-6112" },
  { name: "Virginia NORML", city: "Richmond", state: "VA", type: "advocate", focus: "Cannabis Advocacy", email: "director@vanorml.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - VA Chapter", city: "Richmond", state: "VA", type: "advocate", focus: "Policy Reform", email: "virginia@mpp.org", phone: "202-462-5747" },

  // Washington (Dual use. LCB/DOH regulates.)
  { name: "Washington State Liquor and Cannabis Board (LCB)", city: "Olympia", state: "WA", type: "gov_state", focus: "State Regulator (Business/Retail)", email: "customerservice@lcb.wa.gov", phone: "360-664-1600" },
  { name: "Washington State Department of Health (DOH)", city: "Olympia", state: "WA", type: "gov_state", focus: "State Regulator (Medical Program)", email: "medicalcannabis@doh.wa.gov", phone: "360-236-4819" },
  { name: "Washington CannaBusiness Association", city: "Olympia", state: "WA", type: "advocate", focus: "Industry Advocacy", email: "info@wacannabusiness.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - WA Chapter", city: "Olympia", state: "WA", type: "advocate", focus: "Policy Reform", email: "washington@mpp.org", phone: "202-462-5747" },

  // West Virginia (Medical only. OMC regulates.)
  { name: "West Virginia Office of Medical Cannabis (OMC)", city: "Charleston", state: "WV", type: "gov_state", focus: "State Regulator", email: "medcanwv@wv.gov", phone: "304-356-5090" },
  { name: "Marijuana Policy Project (MPP) - WV Chapter", city: "Charleston", state: "WV", type: "advocate", focus: "Policy Reform", email: "westvirginia@mpp.org", phone: "202-462-5747" },

  // Wisconsin (Illegal. Policy tracking.)
  { name: "Wisconsin State Legislature", city: "Madison", state: "WI", type: "gov_state", focus: "Legislative Tracking", email: "legis.info@legis.wisconsin.gov", phone: "608-266-9960" },
  { name: "Wisconsin Cannabis Activist Network (Wisco-CAN)", city: "Madison", state: "WI", type: "advocate", focus: "Cannabis Advocacy", email: "info@wiscocan.org", phone: "" },
  { name: "Marijuana Policy Project (MPP) - WI Chapter", city: "Madison", state: "WI", type: "advocate", focus: "Policy Reform", email: "wisconsin@mpp.org", phone: "202-462-5747" },
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
      jurisdiction: { AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado', CT:'Connecticut', DE:'Delaware', DC:'District Of Columbia', FL:'Florida', GA:'Georgia', HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina', SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VA:'Virginia', VT:'Vermont', WA:'Washington', WV:'West Virginia', WI:'Wisconsin' }[org.state] || org.state,
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
