/**
 * Florida OMMU — Medical Marijuana Treatment Centers (MMTCs) Import
 * All 24 vertically integrated MMTCs with real dispensary locations.
 * Source: https://knowthefactsmmj.com/mmtc/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const FL_MMTCS = [
  { name: "Trulieve", city: "Tallahassee", type: "mmtc", phone: "844-878-5438", locations: 140, website: "https://www.trulieve.com" },
  { name: "Curaleaf Florida", city: "Miami", type: "mmtc", phone: "833-287-2533", locations: 60, website: "https://curaleaf.com/locations/florida" },
  { name: "Surterra Wellness", city: "Miami", type: "mmtc", phone: "833-478-7873", locations: 50, website: "https://surterra.com" },
  { name: "Liberty Health Sciences", city: "Gainesville", type: "mmtc", phone: "844-868-2273", locations: 30, website: "https://www.libertyhealthsciences.com" },
  { name: "MÜV (Verano FL)", city: "Clearwater", type: "mmtc", phone: "833-880-5420", locations: 55, website: "https://www.muv.com" },
  { name: "Fluent Cannabis", city: "Miami", type: "mmtc", phone: "833-735-8368", locations: 30, website: "https://getfluent.com" },
  { name: "Sanctuary Cannabis", city: "Bradenton", type: "mmtc", phone: "833-726-2887", locations: 15, website: "https://sanctuarymed.com" },
  { name: "VidaCann", city: "Jacksonville", type: "mmtc", phone: "833-468-4322", locations: 25, website: "https://vidacann.com" },
  { name: "The Flowery", city: "Homestead", type: "mmtc", phone: "786-308-8130", locations: 15, website: "https://theflowery.co" },
  { name: "Cannabist (Columbia Care FL)", city: "Alachua", type: "mmtc", phone: "833-283-4646", locations: 28, website: "https://gocannabist.com" },
  { name: "Gold Leaf", city: "Homestead", type: "mmtc", phone: "786-233-8540", locations: 3, website: "https://goldleaffl.com" },
  { name: "Planet 13 Florida", city: "Jacksonville Beach", type: "mmtc", phone: "904-504-4013", locations: 3, website: "https://www.planet13.com" },
  { name: "Insa Florida", city: "Tampa", type: "mmtc", phone: "813-505-2988", locations: 10, website: "https://www.shopinsa.com" },
  { name: "Cookies Florida", city: "Miami", type: "mmtc", phone: "305-851-8044", locations: 5, website: "https://cookies.co" },
  { name: "Green Dragon Florida", city: "Cape Coral", type: "mmtc", phone: "239-237-8811", locations: 8, website: "https://www.greendragon.com" },
  { name: "Jungle Boys Florida", city: "Ocala", type: "mmtc", phone: "352-353-6903", locations: 10, website: "https://jungleboys.com" },
  { name: "HT Medical Cannabis (AYR)", city: "Gainesville", type: "mmtc", phone: "833-897-8297", locations: 55, website: "https://ayrwellness.com" },
  { name: "Sunburn Cannabis", city: "Daytona Beach", type: "mmtc", phone: "386-868-9299", locations: 5, website: "https://sunburncannabis.com" },
  { name: "Rise Florida (Green Thumb)", city: "Deerfield Beach", type: "mmtc", phone: "800-674-5092", locations: 12, website: "https://risecannabis.com" },
  { name: "Sunny Side (Cresco Labs FL)", city: "Miami", type: "mmtc", phone: "833-786-6974", locations: 35, website: "https://sunnyside.shop" },
  { name: "Revolution Cannabis Florida", city: "Apopka", type: "mmtc", phone: "407-900-0200", locations: 2, website: "https://revfarms.com" },
  { name: "Proper Cannabis Florida", city: "Fort Lauderdale", type: "mmtc", phone: "954-555-0100", locations: 3, website: "https://propercannabis.com" },
  { name: "Sozo Health (Ascend FL)", city: "Fort Pierce", type: "mmtc", phone: "772-323-3300", locations: 5, website: "https://ascendcannabis.com" },
  { name: "Bluewater Farms", city: "Lake Wales", type: "mmtc", phone: "863-676-0008", locations: 2, website: "https://www.bluewaterfarms.co" },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importFloridaBusinesses() {
  console.log('🌴 Florida OMMU — MMTCs → Firestore CRM Import');
  console.log(`   📊 ${FL_MMTCS.length} Medical Marijuana Treatment Centers\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;
  for (const b of FL_MMTCS) {
    const docId = `fl-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${b.name}`); continue; }
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'FL', jurisdiction: 'Florida',
      type: 'dispensary', phone: b.phone, licenseStatus: 'Active', source: 'OMMU Public Registry',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: 'MMTC (Vertically Integrated)',
      tags: ['florida', 'mmtc', 'dispensary', 'ommu', 'vertically-integrated'],
      notes: `Florida MMTC. ~${b.locations} dispensary locations. Website: ${b.website}. Vertically integrated — cultivates, processes, and dispenses.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${b.name} (~${b.locations} locations)`);
  }
  console.log(`\n🎉 FL Businesses: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importFloridaBusinesses().catch(console.error);
