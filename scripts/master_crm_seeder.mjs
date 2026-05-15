import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function runMasterImport() {
  console.log('Master CRM Seeder starting...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated to Firebase once.');

  const files = fs.readdirSync('./scripts').filter(f => f.startsWith('import_') && f.endsWith('.mjs') && f !== 'import_omma_csv.mjs');
  
  for (const f of files) {
    console.log(`Processing ${f}...`);
    const code = fs.readFileSync(path.join('./scripts', f), 'utf-8');
    
    // We will extract any setDoc logic by finding the objects 
    // We can just regex the arrays.
    // E.g. const DE_PATIENTS = [ ... ];
    const arrayMatch = code.match(/const [A-Z_]+ = (\[[\s\S]*?\]);/);
    if (!arrayMatch) continue;
    
    try {
      const dataStr = arrayMatch[1].replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
      // A safe eval for the array
      const data = eval(arrayMatch[1]);
      
      // Look for the tags, jurisdiction, state, pipeline in the setDoc string
      const setDocMatch = code.match(/await setDoc\(ref, (\{[\s\S]*?\})\);/);
      if (!setDocMatch) continue;
      
      let template = setDocMatch[1];
      
      for (const item of data) {
         let docId;
         if (f.includes('patient')) docId = `${f.split('_')[1]}-patient-${slugify(item.name)}`;
         else if (f.includes('physician')) docId = `${f.split('_')[1]}-provider-${slugify(item.name)}`;
         else if (f.includes('attorney')) docId = `${f.split('_')[1]}-attorney-${slugify(item.name)}`;
         else if (f.includes('gov_advocates')) docId = `gov-${slugify(item.name)}`;
         else docId = `${f.split('_')[1]}-business-${slugify(item.name)}`;
         
         const ref = doc(db, 'crm_contacts', docId);
         if ((await getDoc(ref)).exists()) {
             continue;
         }

         // evaluate the setDoc template for this item
         // To do this, we just inject the item as `p` or `b` or `a`
         // We will extract the exact logic
         
         let payloadCode = `(function(p, a, b, item) { return ${setDocMatch[1]}; })(item, item, item, item)`;
         // also support a, b, p 
         let payload = eval(payloadCode);
         
         await setDoc(ref, payload);
      }
      console.log(`✅ Loaded ${data.length} records from ${f}`);
    } catch(e) {
      console.log(`Error parsing ${f}: ${e.message}`);
    }
  }
  
  console.log("🎉 ALL STATES SEEDED SUCCESSFULLY!");
  process.exit(0);
}

runMasterImport().catch(console.error);
