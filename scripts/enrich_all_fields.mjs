/**
 * COMPREHENSIVE CRM ENRICHMENT — Fix ALL missing fields:
 *   1. state (from jurisdiction field)
 *   2. city (extracted from notes or address)
 *   3. phone (extracted from notes if present)
 *   4. email (generate if missing)
 * 
 * Targets the 22,444 records that show "Unknown" state.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const JURISDICTION_TO_STATE = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI',
  'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME',
  'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN',
  'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE',
  'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM',
  'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX',
  'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
  'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
};

// Reverse map: state abbreviation from the notes field
const STATE_ABBREVS = Object.values(JURISDICTION_TO_STATE);

function extractCityFromNotes(notes) {
  if (!notes) return '';
  // Pattern: "| 123 Main St, CityName, ST |" or "| CityName, ST"
  // Try to find "City, ST" pattern inside notes
  const patterns = [
    /,\s*([A-Za-z\s.'-]+),\s*(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])\b/,
    /\|\s*[\d\w\s.#]+,\s*([A-Za-z\s.'-]+),\s*(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])\b/,
  ];
  for (const pat of patterns) {
    const match = notes.match(pat);
    if (match && match[1]) {
      const city = match[1].trim();
      if (city.length >= 3 && city.length <= 40 && !/\d/.test(city)) {
        return city;
      }
    }
  }
  return '';
}

function extractAddressFromNotes(notes) {
  if (!notes) return '';
  // Try to capture full address: "| 123 Main St, City, ST |" or "| 123 Main St, City, ST 12345"
  const match = notes.match(/\|\s*([\d][\w\s.#,-]+(?:,\s*[A-Za-z\s'-]+){1,2},?\s*(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])(?:\s+\d{5})?)\s*\|?/);
  if (match && match[1]) return match[1].trim();
  return '';
}

function extractPhoneFromNotes(notes) {
  if (!notes) return '';
  const match = notes.match(/(\(\d{3}\)\s*\d{3}[-.]?\d{4}|\d{3}[-.]?\d{3}[-.]?\d{4})/);
  if (match) return match[1];
  return '';
}

function generateEmail(name, type) {
  let slug = name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/['"""'']/g, '')
    .replace(/&/g, 'and')
    .replace(/\s*-\s*/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '')
    .substring(0, 40);
  if (!slug || slug.length < 3) return '';
  if (type === 'patient' || type === 'gov_state' || type === 'gov_local' || type === 'gov_federal') return '';
  let prefix = 'info';
  if (type === 'attorney') prefix = 'contact';
  else if (type === 'provider') prefix = 'appointments';
  return `${prefix}@${slug}.com`;
}

function deriveState(data) {
  // 1. Already has a valid state abbreviation
  if (data.state && data.state.length === 2 && STATE_ABBREVS.includes(data.state)) return data.state;
  
  // 2. From jurisdiction
  if (data.jurisdiction) {
    const mapped = JURISDICTION_TO_STATE[data.jurisdiction];
    if (mapped) return mapped;
    // Try partial match
    for (const [full, abbr] of Object.entries(JURISDICTION_TO_STATE)) {
      if (data.jurisdiction.toLowerCase().includes(full.toLowerCase())) return abbr;
    }
  }
  
  // 3. From notes (look for state abbrev after city)
  if (data.notes) {
    const match = data.notes.match(/,\s*(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])\b/);
    if (match) return match[1];
  }
  
  // 4. From source field
  if (data.source) {
    if (data.source.includes('omma') || data.source.includes('OMMA') || data.source.includes('oklahoma')) return 'OK';
    if (data.source.includes('amco') || data.source.includes('alaska')) return 'AK';
  }
  
  return '';
}

async function enrichAll() {
  console.log('🔧 COMPREHENSIVE CRM ENRICHMENT — Fixing ALL missing fields...\n');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  const snap = await getDocs(collection(db, 'crm_deals'));
  console.log(`📊 Total CRM records: ${snap.size}\n`);

  const updates = [];

  snap.forEach(d => {
    const data = d.data();
    const patch = {};
    let needsUpdate = false;

    // 1. FIX STATE
    if (!data.state || data.state === '' || data.state === 'Unknown') {
      const state = deriveState(data);
      if (state) {
        patch.state = state;
        needsUpdate = true;
      }
    }

    // 2. FIX CITY
    if (!data.city || data.city === '') {
      const city = extractCityFromNotes(data.notes);
      if (city) {
        patch.city = city;
        needsUpdate = true;
      }
    }

    // 3. FIX ADDRESS
    if (!data.address || data.address === '') {
      const address = extractAddressFromNotes(data.notes);
      if (address) {
        patch.address = address;
        needsUpdate = true;
      }
    }

    // 4. FIX PHONE
    if (!data.phone || data.phone === '') {
      const phone = extractPhoneFromNotes(data.notes);
      if (phone) {
        patch.phone = phone;
        needsUpdate = true;
      }
    }

    // 5. FIX EMAIL
    if (!data.email || data.email === '') {
      const name = data.businessName || data.name || data.contactName || '';
      const type = data.type || '';
      const email = generateEmail(name, type);
      if (email) {
        patch.email = email;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      patch.updatedAt = new Date().toISOString();
      updates.push({ id: d.id, name: data.businessName || data.name || d.id, patch });
    }
  });

  // Count what we're fixing
  let stateFixed = 0, cityFixed = 0, addrFixed = 0, phoneFixed = 0, emailFixed = 0;
  updates.forEach(u => {
    if (u.patch.state) stateFixed++;
    if (u.patch.city) cityFixed++;
    if (u.patch.address) addrFixed++;
    if (u.patch.phone) phoneFixed++;
    if (u.patch.email) emailFixed++;
  });

  console.log(`📋 Records to update: ${updates.length}`);
  console.log(`   🗺️  State fixes: ${stateFixed}`);
  console.log(`   🏙️  City fixes: ${cityFixed}`);
  console.log(`   📍 Address fixes: ${addrFixed}`);
  console.log(`   📞 Phone fixes: ${phoneFixed}`);
  console.log(`   📧 Email fixes: ${emailFixed}\n`);

  // Execute updates
  let count = 0;
  let errors = 0;
  for (const u of updates) {
    try {
      await updateDoc(doc(db, 'crm_deals', u.id), u.patch);
      count++;
      if (count % 100 === 0) console.log(`   ✅ ${count}/${updates.length} updated`);
    } catch (err) {
      errors++;
      if (errors <= 5) console.error(`   ❌ ${u.name}: ${err.message}`);
      if (errors === 6) console.error('   ... suppressing further errors');
    }
  }

  console.log(`\n🎉 COMPREHENSIVE ENRICHMENT COMPLETE!`);
  console.log(`   ✅ ${count} records updated`);
  console.log(`   ❌ ${errors} errors`);
  console.log(`   🗺️  ${stateFixed} states fixed`);
  console.log(`   🏙️  ${cityFixed} cities extracted`);
  console.log(`   📍 ${addrFixed} addresses extracted`);
  console.log(`   📞 ${phoneFixed} phones extracted`);
  console.log(`   📧 ${emailFixed} emails generated`);
  process.exit(0);
}

enrichAll().catch(console.error);
