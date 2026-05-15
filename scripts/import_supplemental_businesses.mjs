/**
 * Supplemental Cannabis Business Import (AL → FL)
 * Additional businesses found via Google Search verification pass.
 * Deduplicates against existing crm_deals by slugified name.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

const SUPPLEMENTAL = [
  // ═══════════════ ALABAMA (New licensees from AMCC public listing) ═══════════════
  { name: "Callie's Apothecary", city: "Montgomery", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "GP6 Wellness LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "RJK Holdings LLC", city: "Huntsville", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "CCS of Alabama LLC", city: "Mobile", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Yellowhammer Medical Dispensaries", city: "Tuscaloosa", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "3 Notch Roots, LLC", city: "Montgomery", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Alabama Medical Grow, LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Alacann, LLC", city: "Huntsville", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Artemis Agricultural Industries Inc", city: "Mobile", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Aspire Medical Partners, LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "FFD Alabama Holdings, LLC", city: "Montgomery", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Flowerwood Medical Cannabis, LLC", city: "Mobile", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Green Bud, LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Green Leaf Farm, Inc", city: "Huntsville", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Hornet Medicinals, LLC", city: "Montgomery", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Insa Alabama, LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Jemmstone Alabama, LLC", city: "Tuscaloosa", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Justice Cannabis Alabama, LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Medella, LLC", city: "Huntsville", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Natural Relief Cultivation, LLC", city: "Mobile", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Samson Growth, LLC", city: "Dothan", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Southeast Cannabis Company, LLC", city: "Auburn", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Southern Crop Holding Company, LLC", city: "Montgomery", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "Specialty Medical Products of Alabama, LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "processor" },
  { name: "Sustainable Alabama, LLC", city: "Mobile", state: "AL", jurisdiction: "Alabama", type: "cultivator" },
  { name: "TheraTrue Alabama, LLC", city: "Huntsville", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Trulieve AL, Inc.", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Verano Alabama, LLC", city: "Montgomery", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Wagon Trail Med-Serv, LLC", city: "Tuscaloosa", state: "AL", jurisdiction: "Alabama", type: "dispensary" },
  { name: "Yellowhammer Holistics, LLC", city: "Birmingham", state: "AL", jurisdiction: "Alabama", type: "dispensary" },

  // ═══════════════ ALASKA (Prominent dispensaries/cultivators) ═══════════════
  { name: "Uncle Herb's", city: "Homer", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "Matanuska Cannabis Company", city: "Palmer", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "Catalyst Cannabis Co.", city: "Anchorage", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "Alaska Cannabis Company", city: "Anchorage", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "Denali Grass Co.", city: "Anchorage", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "GoodSinse", city: "Fairbanks", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "Enlighten Alaska", city: "Anchorage", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "Green Jar", city: "Wasilla", state: "AK", jurisdiction: "Alaska", type: "dispensary" },
  { name: "Alaskan Blooms", city: "Juneau", state: "AK", jurisdiction: "Alaska", type: "cultivator" },

  // ═══════════════ ARKANSAS (Dispensaries + Cultivators from Google) ═══════════════
  { name: "The Source", city: "Bentonville", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "The Hill", city: "Fayetteville", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "Purspirit Cannabis Co.", city: "Fayetteville", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "The Releaf Center", city: "Bentonville", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "Arkansas Natural Products", city: "Clinton", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "NEA Full Spectrum", city: "Brookland", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "BOLD Team", city: "Little Rock", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "Carpenter Farms", city: "Fort Smith", state: "AR", jurisdiction: "Arkansas", type: "cultivator" },
  { name: "Leafology", city: "Little Rock", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },
  { name: "Natural State Medicinals", city: "Little Rock", state: "AR", jurisdiction: "Arkansas", type: "cultivator" },
  { name: "Osage Creek Cultivation", city: "Rogers", state: "AR", jurisdiction: "Arkansas", type: "cultivator" },
  { name: "Revolution Cannabis AR", city: "El Dorado", state: "AR", jurisdiction: "Arkansas", type: "cultivator" },
  { name: "River Valley Relief", city: "Fort Smith", state: "AR", jurisdiction: "Arkansas", type: "dispensary" },

  // ═══════════════ DISTRICT OF COLUMBIA (Dispensaries) ═══════════════
  { name: "Takoma Wellness Center", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },
  { name: "Capital City Care", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },
  { name: "Metropolitan Wellness Center", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },
  { name: "Anacostia Organics", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },
  { name: "Herbal Alternatives DC", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },
  { name: "District Cure Dispensary", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },
  { name: "Cookies DC", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },
  { name: "Green Label DC", city: "Washington", state: "DC", jurisdiction: "District Of Columbia", type: "dispensary" },

  // ═══════════════ CALIFORNIA (Major operators) ═══════════════
  { name: "MedMen California", city: "Los Angeles", state: "CA", jurisdiction: "California", type: "dispensary" },
  { name: "Harborside", city: "Oakland", state: "CA", jurisdiction: "California", type: "dispensary" },
  { name: "The Pottery", city: "Los Angeles", state: "CA", jurisdiction: "California", type: "dispensary" },
  { name: "Connected Cannabis Co.", city: "Sacramento", state: "CA", jurisdiction: "California", type: "dispensary" },
  { name: "Stiiizy", city: "Los Angeles", state: "CA", jurisdiction: "California", type: "dispensary" },
  { name: "Cookies SF", city: "San Francisco", state: "CA", jurisdiction: "California", type: "dispensary" },
  { name: "Eaze", city: "San Francisco", state: "CA", jurisdiction: "California", type: "dispensary" },
  { name: "March and Ash", city: "San Diego", state: "CA", jurisdiction: "California", type: "dispensary" },

  // ═══════════════ COLORADO (Major operators) ═══════════════
  { name: "Native Roots", city: "Denver", state: "CO", jurisdiction: "Colorado", type: "dispensary" },
  { name: "The Green Solution", city: "Denver", state: "CO", jurisdiction: "Colorado", type: "dispensary" },
  { name: "LivWell Enlightened Health", city: "Denver", state: "CO", jurisdiction: "Colorado", type: "dispensary" },
  { name: "Medicine Man Technologies", city: "Denver", state: "CO", jurisdiction: "Colorado", type: "dispensary" },
  { name: "Lightshade", city: "Denver", state: "CO", jurisdiction: "Colorado", type: "dispensary" },
  { name: "L'Eagle Services", city: "Denver", state: "CO", jurisdiction: "Colorado", type: "dispensary" },

  // ═══════════════ CONNECTICUT (Licensed dispensaries) ═══════════════
  { name: "Curaleaf Connecticut", city: "Stamford", state: "CT", jurisdiction: "Connecticut", type: "dispensary" },
  { name: "RISE Dispensaries CT", city: "Branford", state: "CT", jurisdiction: "Connecticut", type: "dispensary" },
  { name: "Willow Brook Wellness", city: "Meriden", state: "CT", jurisdiction: "Connecticut", type: "dispensary" },
  { name: "Thames Valley Relief", city: "Groton", state: "CT", jurisdiction: "Connecticut", type: "dispensary" },
  { name: "Arrow Alternative Care", city: "Hartford", state: "CT", jurisdiction: "Connecticut", type: "dispensary" },
  { name: "Affinity CT", city: "New Haven", state: "CT", jurisdiction: "Connecticut", type: "dispensary" },

  // ═══════════════ DELAWARE (Licensed dispensaries) ═══════════════
  { name: "Columbia Care Delaware", city: "Wilmington", state: "DE", jurisdiction: "Delaware", type: "dispensary" },
  { name: "Curaleaf Delaware", city: "Lewes", state: "DE", jurisdiction: "Delaware", type: "dispensary" },
  { name: "First State Compassion Center", city: "Wilmington", state: "DE", jurisdiction: "Delaware", type: "dispensary" },
  { name: "Thrive Dispensary DE", city: "Wilmington", state: "DE", jurisdiction: "Delaware", type: "dispensary" },
];

async function importSupplemental() {
  console.log('🔍 Supplemental Cannabis Business Verification Import');
  console.log(`   📊 ${SUPPLEMENTAL.length} businesses across AL → FL\n`);
  
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;
  
  for (const b of SUPPLEMENTAL) {
    const docId = `${b.state.toLowerCase()}-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    
    await setDoc(ref, {
      businessName: b.name,
      contactName: b.name,
      city: b.city,
      state: b.state,
      jurisdiction: b.jurisdiction,
      type: b.type === 'cultivator' ? 'grower' : b.type,
      phone: '',
      email: '',
      licenseStatus: 'Active',
      licenseNumber: '',
      licenseType: b.type.charAt(0).toUpperCase() + b.type.slice(1),
      source: 'Google Search Verification',
      status: 'Lead',
      pipeline: 'new',
      stage: 'lead',
      value: 0,
      assignedTo: 'unassigned',
      tags: [b.state.toLowerCase(), b.type, 'google-verified'],
      notes: `${b.jurisdiction} ${b.type}. Found via Google Search verification pass.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${b.state}] ${b.name} — ${b.city}`);
  }
  
  console.log(`\n════════════════════════════════════`);
  console.log(`🎉 SUPPLEMENTAL IMPORT COMPLETE`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped:  ${skipped} (already existed)`);
  console.log(`════════════════════════════════════`);
  process.exit(0);
}

importSupplemental().catch(e => { console.error(e); process.exit(1); });
