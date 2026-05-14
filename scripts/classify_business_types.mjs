/**
 * Bulk Business Type Re-Classifier
 * 
 * Scans all crm_deals in Firestore and assigns the correct business type
 * based on keyword matching in the business name.
 * 
 * Usage: node scripts/classify_business_types.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'classifier');
const db = getFirestore(app);

// ====================================
// CLASSIFICATION RULES
// ====================================
const CLASSIFICATION_RULES = [
  {
    type: 'dispensary',
    keywords: ['dispensary', 'dispensaries', 'retail', 'dispo', 'apothecary', 'cannabis shop', 'weed shop', 'smoke shop', 'budtender']
  },
  {
    type: 'grower',
    keywords: ['grow', 'grower', 'cultivat', 'farm', 'nursery', 'greenhouse', 'harvest', 'garden', 'cultivation', 'indoor grow', 'outdoor grow', 'hemp']
  },
  {
    type: 'processor',
    keywords: ['process', 'processor', 'manufactur', 'extract', 'edible', 'infuse', 'lab', 'concentrate', 'production', 'refine', 'distillat', 'vape']
  },
  {
    type: 'provider',
    keywords: ['clinic', 'medical', 'doctor', 'dr.', 'health', 'physician', 'wellness', 'care', 'therapy', 'telehealth', 'patient']
  },
  {
    type: 'attorney',
    keywords: ['attorney', 'law', 'lawyer', 'legal', 'counsel', 'pllc', 'esquire', 'esq']
  },
  {
    type: 'distribution',
    keywords: ['transport', 'distribution', 'distribut', 'logistics', 'delivery', 'courier', 'freight', 'shipping', 'hauling']
  },
  {
    type: 'backoffice',
    keywords: ['consult', 'advisory', 'compliance', 'accounting', 'bookkeep', 'payroll', 'security', 'technology', 'software', 'it services', 'staffing', 'marketing']
  }
];

function classifyBusiness(name) {
  if (!name) return 'dispensary';
  const lower = name.toLowerCase();
  
  for (const rule of CLASSIFICATION_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        return rule.type;
      }
    }
  }
  
  return 'dispensary'; // Default for cannabis businesses from OMMA registry
}

async function main() {
  console.log('🏷️  Starting Bulk Business Type Classification...');
  
  // Authenticate first
  const auth = getAuth(app);
  console.log('🔐 Authenticating...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');
  
  const snapshot = await getDocs(collection(db, 'crm_deals'));
  console.log(`📊 Found ${snapshot.size} total records to evaluate.\n`);
  
  const tallies = {};
  let updated = 0;
  let skipped = 0;
  
  // Process in batches of 450 (Firestore limit is 500)
  const docs = snapshot.docs;
  const batchSize = 450;
  
  for (let i = 0; i < docs.length; i += batchSize) {
    const batchDocs = docs.slice(i, i + batchSize);
    const batch = writeBatch(db);
    let batchUpdates = 0;
    
    for (const docSnap of batchDocs) {
      const data = docSnap.data();
      const currentType = data.type;
      const businessName = data.name || '';
      
      // Only reclassify generic "business" or "other" types
      if (currentType === 'business' || currentType === 'other' || !currentType) {
        const newType = classifyBusiness(businessName);
        batch.update(doc(db, 'crm_deals', docSnap.id), { type: newType });
        tallies[newType] = (tallies[newType] || 0) + 1;
        batchUpdates++;
        updated++;
      } else {
        skipped++;
      }
    }
    
    if (batchUpdates > 0) {
      await batch.commit();
      console.log(`  ✅ Batch ${Math.floor(i / batchSize) + 1}: Updated ${batchUpdates} records`);
    }
  }
  
  console.log('\n========================================');
  console.log('📋 CLASSIFICATION RESULTS');
  console.log('========================================');
  console.log(`Total records:     ${snapshot.size}`);
  console.log(`Reclassified:      ${updated}`);
  console.log(`Already correct:   ${skipped}`);
  console.log('\n🏷️  Type Breakdown:');
  for (const [type, count] of Object.entries(tallies).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${type.padEnd(20)} ${count}`);
  }
  console.log('========================================\n');
  
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Classification failed:', err);
  process.exit(1);
});
