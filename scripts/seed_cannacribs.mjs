#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
//  SEED CANNACRIBS FIRESTORE COLLECTIONS
//  One-time migration: moves demo data into production Firestore
//  Safe to re-run — skips if collections already have docs
// ═══════════════════════════════════════════════════════════════════
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ─── SEED DATA ──────────────────────────────────────────────────────────────

const PROPERTIES = [
  { id: 'PROP-001', name: 'Modern Cannabis-Friendly Loft', location: 'Oklahoma City, OK', type: 'Apartment', tier: 'Gold', rent: 1450, status: 'Occupied', tenant: 'Marcus Reed', nextInspection: '2026-07-18', occupancy: '100%', beds: '2', baths: '1', sqft: '950', photos: [] },
  { id: 'PROP-002', name: 'Cozy 420-Friendly Cottage', location: 'Norman, OK', type: 'House', tier: 'Green', rent: 1200, status: 'Vacant', tenant: '—', nextInspection: '—', occupancy: '0%', beds: '3', baths: '2', sqft: '1400', photos: [] },
  { id: 'PROP-003', name: 'Luxury CannaCrib Suite', location: 'Scottsdale, AZ', type: 'Short-Term', tier: 'Executive', rent: 189, status: 'Booked', tenant: 'Ashley Park (Jul 15-20)', nextInspection: '2026-07-15', occupancy: '85%', beds: '1', baths: '1', sqft: '650', photos: [] },
  { id: 'PROP-004', name: 'Spacious Grow-Friendly Rancher', location: 'Edmond, OK', type: 'House', tier: 'Platinum', rent: 1800, status: 'Occupied', tenant: 'David Rosenberg (Owner)', nextInspection: '2026-07-20', occupancy: '100%', beds: '4', baths: '3', sqft: '2200', photos: [] },
  { id: 'PROP-005', name: 'Cannabis-Friendly Commercial Space', location: 'Moore, OK', type: 'Commercial', tier: 'Platinum', rent: 3200, status: 'Vacant', tenant: '—', nextInspection: '—', occupancy: '0%', beds: '—', baths: '2', sqft: '3500', photos: [] },
  { id: 'PROP-006', name: 'Midtown 420 Friendly Townhome', location: 'Oklahoma City, OK', type: 'House', tier: 'Gold', rent: 1650, status: 'Occupied', tenant: 'Jasmine Wells', nextInspection: '2026-07-22', occupancy: '100%', beds: '3', baths: '2.5', sqft: '1800', photos: [] },
];

const APPLICATIONS = [
  { id: 'CC-APP-001', name: 'James Carter', type: 'Tenant', email: 'james.carter@email.com', phone: '(405) 555-0142', property: 'Modern Cannabis-Friendly Loft', propertyType: 'Apartment', location: 'Oklahoma City, OK', status: 'Pending Review', submitted: '2026-07-12', submittedTime: '10:30 AM', creditScore: 720, cannabis_card: true, employment: 'Verified', income: '$4,200/mo', notes: '', dob: '1992-03-15', ssn_last4: '4821', currentAddress: '1234 NW 10th St, OKC, OK 73103', emergencyName: 'Linda Carter', emergencyPhone: '(405) 555-0199', emergencyRelation: 'Mother', allergies: 'None', medicalConditions: 'None', medications: 'Medical cannabis (THC)', previousLandlord: 'Mark Reynolds', previousLandlordPhone: '(405) 555-0312', reasonForMoving: 'Current landlord prohibits cannabis', pets: 'Dog — Golden Retriever, 45 lbs', vehicles: '2022 Toyota Camry', moveInDate: '2026-08-01', leaseTerm: '12 months', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-002', name: 'Sarah Mitchell', type: 'Tenant', email: 'sarah.m@email.com', phone: '(918) 555-0387', property: 'Cozy 420-Friendly Cottage', propertyType: 'House', location: 'Norman, OK', status: 'Background Check', submitted: '2026-07-11', submittedTime: '2:15 PM', creditScore: 685, cannabis_card: true, employment: 'Verified', income: '$3,800/mo', notes: 'Previous landlord reference positive', dob: '1995-08-22', ssn_last4: '7193', currentAddress: '567 Elm St, Norman, OK 73071', emergencyName: 'Robert Mitchell', emergencyPhone: '(918) 555-0401', emergencyRelation: 'Father', allergies: 'Penicillin', medicalConditions: 'Asthma (mild)', medications: 'Inhaler, Medical cannabis', previousLandlord: 'Susan Blake', previousLandlordPhone: '(918) 555-0288', reasonForMoving: 'Lease ending, wants grow-friendly space', pets: 'Cat — Siamese', vehicles: '2021 Honda Civic', moveInDate: '2026-08-15', leaseTerm: '6 months', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-003', name: 'David Rosenberg', type: 'Landlord', email: 'drosenberg@realty.com', phone: '(480) 555-0219', property: '3BR House — Edmond, OK', propertyType: 'House', location: 'Edmond, OK', status: 'Approved', submitted: '2026-07-09', submittedTime: '9:00 AM', creditScore: 0, cannabis_card: false, employment: 'N/A', income: 'N/A', notes: 'Platinum tier selected. Signed contract.', dob: '', ssn_last4: '', currentAddress: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '', allergies: '', medicalConditions: '', medications: '', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: 'Rosenberg Realty LLC', llPropertyAddress: '789 Oak Ridge Dr, Edmond, OK 73034', llTierPreference: 'Platinum', llInsurance: true, llNumUnits: '2', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-004', name: 'Maria Gonzalez', type: 'Tenant', email: 'mgonzalez@gmail.com', phone: '(405) 555-0901', property: 'Downtown Cannabis-Friendly Studio', propertyType: 'Apartment', location: 'Tulsa, OK', status: 'Pending Review', submitted: '2026-07-13', submittedTime: '11:45 AM', creditScore: 740, cannabis_card: true, employment: 'Pending', income: '$5,100/mo', notes: '', dob: '1990-11-03', ssn_last4: '3056', currentAddress: '321 S Boston Ave, Tulsa, OK 74103', emergencyName: 'Carlos Gonzalez', emergencyPhone: '(405) 555-0822', emergencyRelation: 'Brother', allergies: 'Latex', medicalConditions: 'Anxiety', medications: 'Medical cannabis, Lexapro', previousLandlord: 'Heritage Apts Mgmt', previousLandlordPhone: '(918) 555-0100', reasonForMoving: 'Need cannabis-friendly policy', pets: 'None', vehicles: '2024 Tesla Model 3', moveInDate: '2026-09-01', leaseTerm: '12 months', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-005', name: 'Tom Williams', type: 'Landlord', email: 'twilliams@okprops.com', phone: '(405) 555-0555', property: '4-Unit Multi-Family — Moore, OK', propertyType: 'Multi-Family', location: 'Moore, OK', status: 'Verification', submitted: '2026-07-10', submittedTime: '3:30 PM', creditScore: 0, cannabis_card: false, employment: 'N/A', income: 'N/A', notes: 'Gold tier. Wants inspection schedule.', dob: '', ssn_last4: '', currentAddress: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '', allergies: '', medicalConditions: '', medications: '', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: 'OK Properties', llPropertyAddress: '456 SW 4th St, Moore, OK 73160', llTierPreference: 'Gold', llInsurance: false, llNumUnits: '4', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-006', name: 'Ashley Park', type: 'Short-Term Guest', email: 'ashpark@travel.com', phone: '(602) 555-0733', property: 'Desert Oasis Cannabis Retreat', propertyType: 'Short-Term', location: 'Bullhead City, AZ', status: 'Approved', submitted: '2026-07-08', submittedTime: '6:00 PM', creditScore: 0, cannabis_card: true, employment: 'N/A', income: 'N/A', notes: 'Guest for Jul 15-20. Executive tier property.', dob: '1988-05-12', ssn_last4: '', currentAddress: '9876 E Camelback Rd, Scottsdale, AZ 85251', emergencyName: 'Jessica Park', emergencyPhone: '(602) 555-0800', emergencyRelation: 'Sister', allergies: 'None', medicalConditions: 'None', medications: 'None', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '2026-07-15', stCheckOut: '2026-07-20', stGuests: '2', stPurpose: 'Vacation — cannabis retreat' },
];

const LANDLORDS = [
  { name: 'David Rosenberg', email: 'drosenberg@realty.com', properties: 2, tier: 'Platinum', revenue: '$598/mo', status: 'Active', phone: '(480) 555-0219', company: 'Rosenberg Realty LLC', address: '789 Oak Ridge Dr, Edmond, OK 73034', bankInfo: 'Chase ****4821', taxId: '**-***7890', insurance: 'State Farm Policy #SF-29381', notes: 'Long-term partner. 2 properties. Platinum tier.' },
  { name: 'Tom Williams', email: 'twilliams@okprops.com', properties: 1, tier: 'Gold', revenue: '$149/mo', status: 'Onboarding', phone: '(405) 555-0555', company: 'OK Properties', address: '456 SW 4th St, Moore, OK 73160', bankInfo: 'BoA ****3392', taxId: '**-***1234', insurance: 'Pending', notes: 'Onboarding in progress. 4-unit multi-family.' },
  { name: 'Linda Chen', email: 'lchen@email.com', properties: 1, tier: 'Executive', revenue: '$499/mo', status: 'Active', phone: '(602) 555-0811', company: 'Chen Hospitality Group', address: '9012 E Camelback, Scottsdale, AZ 85251', bankInfo: 'Wells Fargo ****5567', taxId: '**-***5678', insurance: 'Allstate Policy #AL-83291', notes: 'Short-term rental specialist. Executive tier.' },
  { name: 'Robert Jackson', email: 'rjackson@prop.com', properties: 1, tier: 'Green', revenue: '$49/mo', status: 'Active', phone: '(918) 555-0422', company: '', address: '123 Main St, Norman, OK 73071', bankInfo: 'Credit Union ****9901', taxId: '**-***9012', insurance: 'None on file', notes: 'Independent landlord. Single cottage.' },
];

const CALENDAR = [
  { date: '2026-07-15', title: 'Pre-Guest Inspection', property: 'Desert Oasis Cannabis Retreat', type: 'inspection', tier: 'Executive' },
  { date: '2026-07-15', title: 'Guest Check-In: Ashley Park', property: 'Luxury CannaCrib Suite', type: 'booking', tier: 'Executive' },
  { date: '2026-07-18', title: 'Bi-Weekly Inspection', property: 'Modern Cannabis-Friendly Loft', type: 'inspection', tier: 'Gold' },
  { date: '2026-07-19', title: 'Standard Clean', property: 'Midtown 420 Friendly Townhome', type: 'cleaning', tier: 'Gold' },
  { date: '2026-07-20', title: 'Weekly Inspection', property: 'Spacious Grow-Friendly Rancher', type: 'inspection', tier: 'Platinum' },
  { date: '2026-07-20', title: 'Guest Check-Out: Ashley Park', property: 'Luxury CannaCrib Suite', type: 'booking', tier: 'Executive' },
  { date: '2026-07-20', title: 'Turnover Clean + Ozone', property: 'Luxury CannaCrib Suite', type: 'cleaning', tier: 'Executive' },
  { date: '2026-07-22', title: 'Bi-Weekly Inspection', property: 'Midtown 420 Friendly Townhome', type: 'inspection', tier: 'Gold' },
  { date: '2026-07-25', title: 'HVAC Maintenance', property: 'Spacious Grow-Friendly Rancher', type: 'maintenance', tier: 'Platinum' },
  { date: '2026-07-28', title: 'Guest Booking: J. Thomas', property: 'Luxury CannaCrib Suite', type: 'booking', tier: 'Executive' },
];

const VAULT = [
  { id: 'V-001', name: 'Lease Agreement — Marcus Reed', type: 'Lease', property: 'Modern Cannabis-Friendly Loft', date: '2026-06-01', size: '2.4 MB' },
  { id: 'V-002', name: 'Inspection Report Jul 13', type: 'Inspection', property: 'Modern Cannabis-Friendly Loft', date: '2026-07-13', size: '1.1 MB' },
  { id: 'V-003', name: 'Cannabis Card — James Carter', type: 'ID Docs', property: '—', date: '2026-07-12', size: '890 KB' },
  { id: 'V-004', name: 'Property Photos — Desert Oasis', type: 'Photos', property: 'Luxury CannaCrib Suite', date: '2026-06-15', size: '18.3 MB' },
  { id: 'V-005', name: 'Landlord Contract — D. Rosenberg', type: 'Contract', property: 'Spacious Grow-Friendly Rancher', date: '2026-07-09', size: '3.2 MB' },
  { id: 'V-006', name: 'Insurance Certificate', type: 'Insurance', property: 'Midtown 420 Friendly Townhome', date: '2026-05-20', size: '1.5 MB' },
];

const FEES = {
  application_fee: { label: 'Application Fee', amount: '$45', type: 'Per application' },
  background_check: { label: 'Background Check', amount: '$35', type: 'Per tenant' },
  lease_processing: { label: 'Lease Processing', amount: '$75', type: 'Per lease' },
  short_term_booking: { label: 'Short-Term Booking', amount: '12%', type: 'Per booking' },
  cannabis_card_verify: { label: 'Cannabis Card Verify', amount: '$15', type: 'Per verification' },
  renters_insurance: { label: "Renter's Insurance", amount: '$29', type: 'Per month' },
  move_inspect: { label: 'Move-In/Out Inspect', amount: '$95', type: 'Per event' },
  key_deposit: { label: 'Key Deposit', amount: '$50', type: 'Refundable' },
};

const INSPECTION_CHECKLIST = [
  'Exterior Condition', 'Interior Walls & Paint', 'Flooring Condition', 'Windows & Locks', 'Doors & Hinges', 'Plumbing & Fixtures',
  'Electrical Outlets', 'HVAC System', 'Smoke Detectors', 'CO Detectors', 'Fire Extinguisher', 'Appliance Function',
  'Kitchen Condition', 'Bathroom Condition', 'Pest Inspection', 'Cannabis Odor Level', 'Ventilation System', 'Air Filtration',
  'Grow Area (if any)', 'Waste Disposal', 'Yard/Exterior Clean', 'Parking Area', 'Security System', 'Key/Lock Integrity',
  'Furniture Condition', 'Linen/Bedding Check', 'Supply Inventory', 'Neighbor Complaints', 'Photo Documentation', 'Overall Rating',
];

// ─── SEED FUNCTIONS ─────────────────────────────────────────────────────────

async function seedCollection(collectionName, data, idField) {
  const col = collection(db, collectionName);
  const snap = await getDocs(col);
  if (!snap.empty) {
    console.log(`  ⏭️  ${collectionName} — already has data (${snap.size} docs), skipping`);
    return;
  }

  const batch = writeBatch(db);
  for (const item of data) {
    const docId = item[idField] || `${collectionName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const docData = { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    batch.set(doc(db, collectionName, docId), docData);
  }
  await batch.commit();
  console.log(`  ✅ ${collectionName} — seeded ${data.length} docs`);
}

async function seedConfig() {
  // Fees
  const feesRef = doc(db, 'cannacribs_config', 'fees');
  try {
    const feesSnap = await getDocs(collection(db, 'cannacribs_config'));
    const hasConfig = feesSnap.docs.some(d => d.id === 'fees');
    if (hasConfig) {
      console.log('  ⏭️  cannacribs_config/fees — already exists, skipping');
    } else {
      await setDoc(feesRef, { fees: FEES, updatedAt: new Date().toISOString() });
      console.log('  ✅ cannacribs_config/fees — seeded');
    }
  } catch {
    await setDoc(feesRef, { fees: FEES, updatedAt: new Date().toISOString() });
    console.log('  ✅ cannacribs_config/fees — seeded');
  }

  // Inspection checklist
  const checkRef = doc(db, 'cannacribs_config', 'inspection_checklist');
  try {
    const cfgSnap = await getDocs(collection(db, 'cannacribs_config'));
    const hasChecklist = cfgSnap.docs.some(d => d.id === 'inspection_checklist');
    if (hasChecklist) {
      console.log('  ⏭️  cannacribs_config/inspection_checklist — already exists, skipping');
    } else {
      await setDoc(checkRef, { items: INSPECTION_CHECKLIST, updatedAt: new Date().toISOString() });
      console.log('  ✅ cannacribs_config/inspection_checklist — seeded');
    }
  } catch {
    await setDoc(checkRef, { items: INSPECTION_CHECKLIST, updatedAt: new Date().toISOString() });
    console.log('  ✅ cannacribs_config/inspection_checklist — seeded');
  }
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔐 Authenticating...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('🔓 Authenticated!\n');

  console.log('🏠 SEEDING CANNACRIBS FIRESTORE COLLECTIONS\n');

  await seedCollection('cannacribs_properties', PROPERTIES, 'id');
  await seedCollection('cannacribs_applications', APPLICATIONS, 'id');
  await seedCollection('cannacribs_landlords', LANDLORDS, 'email');
  
  // Calendar items don't have unique IDs, need individual doc names
  const calCol = collection(db, 'cannacribs_calendar');
  const calSnap = await getDocs(calCol);
  if (!calSnap.empty) {
    console.log(`  ⏭️  cannacribs_calendar — already has data (${calSnap.size} docs), skipping`);
  } else {
    for (let i = 0; i < CALENDAR.length; i++) {
      await setDoc(doc(db, 'cannacribs_calendar', `CAL-${String(i + 1).padStart(3, '0')}`), {
        ...CALENDAR[i], createdAt: new Date().toISOString()
      });
    }
    console.log(`  ✅ cannacribs_calendar — seeded ${CALENDAR.length} docs`);
  }

  await seedCollection('cannacribs_vault', VAULT, 'id');
  await seedConfig();

  console.log('\n✅ CannaCribs seed complete!\n');
  process.exit(0);
}

main().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
