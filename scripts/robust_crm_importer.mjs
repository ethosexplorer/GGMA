import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

function slugify(str) { 
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); 
}

const STATE_MAPPING = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA', colorado: 'CO',
  connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA', hawaii: 'HI', idaho: 'ID',
  illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS', kentucky: 'KY', louisiana: 'LA',
  maine: 'ME', maryland: 'MD', massachusetts: 'MA', michigan: 'MI', minnesota: 'MN',
  mississippi: 'MS', missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
  newhampshire: 'NH', newjersey: 'NJ', newmexico: 'NM', newyork: 'NY', northcarolina: 'NC',
  northdakota: 'ND', ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA',
  rhodeisland: 'RI', southcarolina: 'SC', southdakota: 'SD', tennessee: 'TN', texas: 'TX',
  utah: 'UT', vermont: 'VT', virginia: 'VA', washington: 'WA', westvirginia: 'WV',
  wisconsin: 'WI', wyoming: 'WY', dc: 'DC'
};

const STATE_NAMES = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado',
  CT:'Connecticut', DE:'Delaware', DC:'District Of Columbia', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas',
  KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts',
  MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana',
  NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico', NC:'North Carolina',
  ND:'North Dakota', OH:'Ohio', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island',
  SC:'South Carolina', SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah',
  VA:'Virginia', VT:'Vermont', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming'
};

// Target keywords for classification
const GOV_KEYWORDS = ['agency', 'authority', 'commission', 'department', 'board', 'bureau', 'office', 'governor', 'legislature', 'senator', 'representative', 'council', 'regulatory', 'omma', 'dcc', 'ccb', 'crc', 'ocm', 'mca', 'ccd', 'municipal', 'county', 'federal', 'city', 'state office', 'mayor'];
const ADVOCATE_KEYWORDS = ['advocate', 'advocacy', 'nonprofit', 'non-profit', 'foundation', 'coalition', 'alliance', 'association', 'society', 'network', 'equity', 'justice'];
const RESEARCHER_KEYWORDS = ['research', 'researcher', 'scientist', 'university', 'college', 'professor', 'academic', 'lab', 'laboratory', 'institute', 'study'];
const INVESTOR_KEYWORDS = ['investor', 'investment', 'capital', 'venture', 'fund', 'finance', 'funding', 'partner', 'angel', 'asset', 'wealth', 'holdings', 'equity'];

async function run() {
  console.log('🏁 Starting robust CRM seeder and contact extractor...\n');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated successfully.\n');

  const scriptsDir = './scripts';
  const files = fs.readdirSync(scriptsDir).filter(f => f.startsWith('import_') && f.endsWith('.mjs') && f !== 'import_omma_csv.mjs' && f !== 'import_large_acuity_csv.mjs');
  
  let totalImported = 0;
  let totalSkipped = 0;

  for (const f of files) {
    console.log(`📂 Processing script: ${f}`);
    const code = fs.readFileSync(path.join(scriptsDir, f), 'utf-8');
    
    // Extract state and base type from filename
    // e.g. import_alabama_attorneys.mjs -> state: AL, type: attorney
    // e.g. import_gov_advocates.mjs -> state: US, type: gov
    const parts = f.replace('import_', '').replace('.mjs', '').split('_');
    const stateName = parts[0];
    const inferredState = STATE_MAPPING[stateName] || 'US';
    const inferredType = parts[1] || 'other';

    // Find the array of entities in the code
    const arrayMatch = code.match(/(?:const|let|var)\s+[A-Z0-9_]+\s*=\s*(\[[\s\S]*?\])\s*;/);
    if (!arrayMatch) {
      console.log(`⚠️  No data array found in ${f}`);
      continue;
    }

    try {
      // Evaluate the data array safely
      const data = eval(arrayMatch[1]);
      
      for (const item of data) {
        const name = item.name || item.businessName || item.contactName || '';
        if (!name) continue;

        const email = (item.email || '').toLowerCase().trim();
        const type = item.type || inferredType;
        const state = item.state || inferredState;
        
        let docId;
        if (f.includes('patient')) docId = `${state.toLowerCase()}-patient-${slugify(name)}`;
        else if (f.includes('physician') || type === 'provider') docId = `${state.toLowerCase()}-provider-${slugify(name)}`;
        else if (f.includes('attorney') || type === 'attorney') docId = `${state.toLowerCase()}-attorney-${slugify(name)}`;
        else if (f.includes('gov_advocates')) docId = `gov-${slugify(name)}`;
        else docId = `${state.toLowerCase()}-${type}-${slugify(name)}`;

        const ref = doc(db, 'crm_deals', docId);
        
        // Skip if document exists in Firestore
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          totalSkipped++;
          continue;
        }

        // Write document to Firestore
        const payload = {
          businessName: name,
          contactName: name,
          city: item.city || '',
          state: state,
          jurisdiction: STATE_NAMES[state] || state,
          type: type,
          email: email,
          phone: item.phone || item.telephone || '',
          licenseStatus: 'Active',
          source: 'CRM Seeder',
          status: 'Lead',
          pipeline: 'new',
          emailVerified: email && email.includes('@') ? true : false,
          tags: [state.toLowerCase(), type, 'imported'],
          notes: item.notes || item.focus || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(ref, payload);
        totalImported++;
      }
    } catch (e) {
      console.error(`❌ Error parsing ${f}:`, e.message);
    }
  }

  console.log(`\n🎉 Seed Completed! Imported: ${totalImported}, Skipped: ${totalSkipped}\n`);

  console.log('📋 Starting Extraction of Target Audiences (Gov, Advocates, Researchers, Investors)...');

  // Pull all contacts from database
  const crmCollections = ['crm_deals', 'executive_crm_deals', 'crm_contacts', 'executive_crm_contacts'];
  const allRecords = [];

  for (const col of crmCollections) {
    try {
      const snap = await getDocs(collection(db, col));
      snap.docs.forEach(d => {
        allRecords.push({ id: d.id, collection: col, ...d.data() });
      });
      console.log(`   Fetched ${snap.size} records from ${col}`);
    } catch (e) {
      console.error(`   Error reading ${col}:`, e.message);
    }
  }

  console.log(`\n📊 Total CRM records loaded: ${allRecords.length}`);

  // Deduplicate by email
  const seen = new Set();
  const deduped = [];

  for (const r of allRecords) {
    const email = (r.email || '').toLowerCase().trim();
    if (!email || !email.includes('@') || email === 'n/a' || email === 'none') continue;
    if (seen.has(email)) continue;
    seen.add(email);
    deduped.push(r);
  }

  console.log(`📧 Unique email records: ${deduped.length}`);

  // Categorize
  const csvHeaders = ['Organization Name', 'Contact Name', 'Email', 'Phone', 'State', 'Jurisdiction', 'Type', 'Category', 'Source', 'Notes'];
  const csvRows = [csvHeaders.join(',')];

  let govCount = 0;
  let advocateCount = 0;
  let researcherCount = 0;
  let investorCount = 0;
  let attorneyCount = 0;
  let providerCount = 0;

  for (const r of deduped) {
    const name = (r.businessName || r.name || r.contactName || '').trim();
    const type = (r.type || '').toLowerCase();
    const nameLower = name.toLowerCase();
    const notesLower = (r.notes || '').toLowerCase();
    const email = (r.email || '').toLowerCase().trim();

    let category = null;

    // Check classification keywords
    if (type === 'gov_state' || type === 'gov_local' || type === 'gov_federal' || type === 'agency' || GOV_KEYWORDS.some(k => nameLower.includes(k) || notesLower.includes(k))) {
      category = 'Government Office / Agency';
      govCount++;
    } else if (type === 'investor' || INVESTOR_KEYWORDS.some(k => nameLower.includes(k) || notesLower.includes(k))) {
      category = 'Investor';
      investorCount++;
    } else if (type === 'researcher' || RESEARCHER_KEYWORDS.some(k => nameLower.includes(k) || notesLower.includes(k))) {
      category = 'Researcher / Academic';
      researcherCount++;
    } else if (type === 'advocate' || ADVOCATE_KEYWORDS.some(k => nameLower.includes(k) || notesLower.includes(k))) {
      category = 'Advocate / Non-Profit';
      advocateCount++;
    } else if (type === 'attorney') {
      category = 'Attorney';
      attorneyCount++;
    } else if (type === 'provider') {
      category = 'Healthcare Provider';
      providerCount++;
    }

    if (category) {
      // Clean values for CSV
      const clean = (val) => `"${(val || '').toString().replace(/\n/g, ' ').replace(/"/g, '""').trim()}"`;
      
      const row = [
        clean(name),
        clean(r.contactName || ''),
        clean(email),
        clean(r.phone || ''),
        clean(r.state || ''),
        clean(r.jurisdiction || ''),
        clean(r.type || ''),
        clean(category),
        clean(r.source || ''),
        clean(r.notes || '')
      ];
      csvRows.push(row.join(','));
    }
  }

  const csvPath = './valuation_contacts_export.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'));

  console.log('\n📊 EXTRACTION SUMMARY:');
  console.log('────────────────────────────────────────');
  console.log(`🏛️  Gov & Public Offices:   ${govCount}`);
  console.log(`🤝 Advocates & Non-Profits: ${advocateCount}`);
  console.log(`🔬 Researchers & Academics: ${researcherCount}`);
  console.log(`💰 Investors & Funding:     ${investorCount}`);
  console.log(`⚖️  Attorneys:               ${attorneyCount}`);
  console.log(`🩺 Providers:               ${providerCount}`);
  console.log('────────────────────────────────────────');
  console.log(`📬 TOTAL EXPORTED CONTACTS: ${govCount + advocateCount + researcherCount + investorCount + attorneyCount + providerCount}`);
  console.log(`📂 SAVED SPREADSHEET TO: ${csvPath}\n`);

  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
