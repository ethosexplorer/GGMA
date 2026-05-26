/**
 * Acuity Scheduling to CRM Syncer
 * 
 * Fetches the Acuity iCal feed, extracts customer contact information,
 * calculates their medical card renewal date, and upserts them into
 * the Firestore CRM pipeline (crm_deals).
 * 
 * Usage: node scripts/sync_acuity_to_crm.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'acuity-crm-sync');
const db = getFirestore(app);

const ACUITY_FEED_URL = "https://app.acuityscheduling.com/export.php?owner=22720152&token=cm1oNFAxdS9BWXl5Q2RNWTNoVFFRV2FBdEN6S3Y1TlJDUWlYSjhrZGR1TWZoSjR5TTBrUGlOcmEyamJEaDYxajZQQ3V0MVRBdlhJREVkdzZkMFdzZGRVWXFoL2FVSUU5QXh5ZEY4eTdvQ2ZYS2g2Q0FLTmlydnB6a0RaYQ%3D%3D";

function parseICalDate(val) {
  if (!val || val.length < 8) return null;
  const year = parseInt(val.slice(0, 4));
  const month = parseInt(val.slice(4, 6));
  const day = parseInt(val.slice(6, 8));
  return new Date(year, month - 1, day);
}

function parseICS(icsText) {
  const events = [];
  const lines = icsText.split(/\r?\n/);
  
  const unfoldedLines = [];
  for (let line of lines) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (unfoldedLines.length > 0) {
        unfoldedLines[unfoldedLines.length - 1] += line.slice(1);
      }
    } else {
      unfoldedLines.push(line);
    }
  }

  let currentEvent = null;
  for (let line of unfoldedLines) {
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent) {
        events.push(currentEvent);
        currentEvent = null;
      }
    } else if (currentEvent) {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        let key = line.slice(0, colonIdx);
        const value = line.slice(colonIdx + 1);
        if (key.includes(';')) {
          key = key.split(';')[0];
        }
        currentEvent[key] = value;
      }
    }
  }
  return events;
}

async function main() {
  console.log('🔄 Starting Acuity Scheduling to CRM Synchronization...');
  
  // Authenticate
  const auth = getAuth(app);
  console.log('🔐 Authenticating Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.');

  // Load existing CRM contacts for deduplication
  console.log('📊 Loading existing CRM records...');
  const existingSnap = await getDocs(collection(db, 'crm_deals'));
  const existingEmails = new Set();
  const existingNames = new Set();
  
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.email) existingEmails.add(data.email.toLowerCase().trim());
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
  });
  console.log(`   Found ${existingSnap.size} existing records.`);

  // Fetch feed
  console.log(`🌐 Fetching Acuity Scheduling Feed...`);
  const res = await fetch(ACUITY_FEED_URL);
  if (!res.ok) throw new Error(`Acuity fetch failed: ${res.statusText}`);
  const icsText = await res.text();
  const rawEvents = parseICS(icsText);
  console.log(`   Parsed ${rawEvents.length} calendar events.\n`);

  const toImport = [];
  
  for (const ev of rawEvents) {
    const summary = ev.SUMMARY || '';
    const desc = (ev.DESCRIPTION || '').replace(/\\n/g, '\n').replace(/\\,/g, ',');
    const dtStart = ev.DTSTART;

    let name = '';
    let email = '';
    let phone = '';
    let state = 'Oklahoma';
    let appointmentDate = '';
    
    // Parse Date
    const apptDateObj = parseICalDate(dtStart);
    if (apptDateObj) {
      appointmentDate = apptDateObj.toISOString().split('T')[0];
    }

    // Try extracting structured fields from Description
    const nameMatch = desc.match(/Name:\s*(.*)/i);
    const emailMatch = desc.match(/Email:\s*(.*)/i);
    const phoneMatch = desc.match(/Phone:\s*(.*)/i);
    const stateMatch = desc.match(/State:\s*(.*)/i);

    if (nameMatch) name = nameMatch[1].trim();
    if (emailMatch) email = emailMatch[1].trim().toLowerCase();
    if (phoneMatch) phone = phoneMatch[1].trim();
    if (stateMatch) state = stateMatch[1].trim();

    // Fallback parsing if Description is simple text
    if (!name && summary.includes(':')) {
      const parts = summary.split(':');
      name = parts[0].trim();
    }
    
    if (!name) continue;

    // Determine state from summary
    if (summary.toLowerCase().includes('ok') || summary.toLowerCase().includes('oklahoma')) {
      state = 'Oklahoma';
    }

    // Calculate card renewal date (Oklahoma licenses are valid for 2 years)
    let renewalDate = '';
    if (apptDateObj) {
      const renewalYear = apptDateObj.getFullYear() + 2;
      const renewalDateObj = new Date(apptDateObj);
      renewalDateObj.setFullYear(renewalYear);
      renewalDate = renewalDateObj.toISOString().split('T')[0];
    }

    // Deduplicate
    const emailKey = email ? email.toLowerCase().trim() : '';
    const nameKey = name.toLowerCase().trim();

    if (emailKey && existingEmails.has(emailKey)) continue;
    if (existingNames.has(nameKey)) continue;

    // Add to import list
    existingNames.add(nameKey);
    if (emailKey) existingEmails.add(emailKey);

    // Format phone for CRM
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `(${cleanPhone.slice(0,3)}) ${cleanPhone.slice(3,6)}-${cleanPhone.slice(6)}`;
    }

    toImport.push({
      name: name,
      contactName: name,
      type: 'patient',
      stage: 'lead',
      value: 0,
      assignedTo: 'unassigned',
      phone: cleanPhone || phone,
      email: email,
      jurisdiction: state,
      notes: `Acuity Appointment: ${summary}\nDate of appointment: ${appointmentDate}\nCalculated Card Expiry/Renewal: ${renewalDate}\n\n${desc}`,
      licenseStatus: new Date(renewalDate) < new Date() ? 'Expired' : 'Active',
      licenseExpiration: renewalDate, // Store card renewal date
      source: 'Acuity Scheduling Sync',
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }

  console.log(`📊 CRM Syncer Preview:`);
  console.log(`   New unique patients to import: ${toImport.length}\n`);

  if (toImport.length === 0) {
    console.log('✅ All clients from Acuity feed are already sync\'d to the CRM!');
    process.exit(0);
  }

  // Batch insert into crm_deals
  const BATCH_SIZE = 400;
  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const chunk = toImport.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    
    for (const record of chunk) {
      const ref = doc(collection(db, 'crm_deals'));
      batch.set(ref, record);
    }
    
    await batch.commit();
    console.log(`   ✅ Imported batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} clients`);
  }

  console.log('\n🎉 Synchronization complete!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
