// ═══════════════════════════════════════════════════════════════════════════════
//  VALUATION BLAST — Extract agency/gov/advocate/attorney/provider emails
//  from CRM and stage them for Marketing Hub campaigns
//  Run: node scripts/extract_valuation_audience.mjs
// ═══════════════════════════════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBJfRJnPLzDHXIwRSHE9jT2FA-2T07e05M",
  authDomain: "global-green-platform.firebaseapp.com",
  projectId: "global-green-platform",
  storageBucket: "global-green-platform.firebasestorage.app",
  messagingSenderId: "547279498476",
  appId: "1:547279498476:web:3db6e94e02e8c3f2a4d48c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── TARGET TYPES (everyone EXCEPT business and patient) ─────────────────────
const TARGET_TYPES = ['agency', 'advocate', 'attorney', 'provider', 'backoffice', 'distribution', 'other'];
const EXCLUDE_TYPES = ['dispensary', 'grower', 'processor', 'patient'];

// Also catch by keyword for records that might be typed as 'other' but are clearly gov/advocate
const GOV_KEYWORDS = ['agency', 'authority', 'commission', 'department', 'board', 'bureau', 'office', 'governor', 'legislature', 'senator', 'representative', 'council', 'regulatory', 'omma', 'dcc', 'ccb', 'crc', 'ocm', 'mca', 'ccd'];
const ADVOCATE_KEYWORDS = ['advocate', 'advocacy', 'nonprofit', 'non-profit', 'research', 'foundation', 'coalition', 'alliance', 'association', 'society', 'institute', 'network', 'equity', 'justice'];

async function extractValuationAudience() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  VALUATION BLAST — Audience Extraction');
  console.log('═══════════════════════════════════════════════════\n');

  // Pull from all CRM collections
  const collections = ['crm_deals', 'executive_crm_deals', 'crm_contacts', 'executive_crm_contacts'];
  const allRecords = [];

  for (const col of collections) {
    try {
      const snap = await getDocs(collection(db, col));
      const docs = snap.docs.map(d => ({ id: d.id, collection: col, ...d.data() }));
      allRecords.push(...docs);
      console.log(`  ✅ ${col}: ${docs.length} records`);
    } catch (err) {
      console.log(`  ❌ ${col}: ${err.message}`);
    }
  }

  console.log(`\n  📊 Total CRM records: ${allRecords.length}\n`);

  // Dedup by email (lowercase)
  const seen = new Set();
  const deduped = [];
  for (const r of allRecords) {
    const email = (r.email || '').toLowerCase().trim();
    if (!email || email === 'n/a' || email === 'none' || !email.includes('@')) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    deduped.push(r);
  }

  console.log(`  📧 Records with valid, unique emails: ${deduped.length}\n`);

  // Classify into buckets
  const buckets = {
    gov_agency: [],      // Gov / State Agency / Regulatory
    advocate: [],        // Advocate / Research / Non-Profit
    attorney: [],        // Attorney / Law Firm
    provider: [],        // Provider / Clinic
    political: [],       // Political (legislators, gov offices)
    other_relevant: []   // Backoffice, distribution, other (non-business, non-patient)
  };

  for (const r of deduped) {
    const type = (r.type || '').toLowerCase();
    const name = (r.name || '').toLowerCase();
    const notes = (r.notes || '').toLowerCase();
    const email = (r.email || '').toLowerCase().trim();

    // Skip businesses and patients
    if (EXCLUDE_TYPES.includes(type)) continue;

    // Classify
    if (type === 'agency' || GOV_KEYWORDS.some(k => name.includes(k) || notes.includes(k))) {
      // Check if it's specifically political
      if (['governor', 'legislature', 'senator', 'representative', 'council'].some(k => name.includes(k) || notes.includes(k))) {
        buckets.political.push(r);
      } else {
        buckets.gov_agency.push(r);
      }
    } else if (type === 'advocate' || ADVOCATE_KEYWORDS.some(k => name.includes(k) || notes.includes(k))) {
      buckets.advocate.push(r);
    } else if (type === 'attorney') {
      buckets.attorney.push(r);
    } else if (type === 'provider') {
      buckets.provider.push(r);
    } else if (['backoffice', 'distribution', 'other'].includes(type)) {
      buckets.other_relevant.push(r);
    }
  }

  // Print summary
  console.log('  ═══ AUDIENCE BREAKDOWN ═══');
  console.log(`  🏛️  Gov / State Agency:    ${buckets.gov_agency.length}`);
  console.log(`  🏛️  Political (Gov Office): ${buckets.political.length}`);
  console.log(`  🤝 Advocate / Research:    ${buckets.advocate.length}`);
  console.log(`  ⚖️  Attorney / Law Firm:   ${buckets.attorney.length}`);
  console.log(`  🩺 Provider / Clinic:      ${buckets.provider.length}`);
  console.log(`  📋 Other Relevant:         ${buckets.other_relevant.length}`);

  const totalAudience = Object.values(buckets).reduce((sum, b) => sum + b.length, 0);
  console.log(`\n  📬 TOTAL VALUATION AUDIENCE: ${totalAudience}\n`);

  // Combine all into one flat audience for the Marketing Hub
  const fullAudience = [
    ...buckets.gov_agency,
    ...buckets.political,
    ...buckets.advocate,
    ...buckets.attorney,
    ...buckets.provider,
    ...buckets.other_relevant
  ];

  // Stage as a Marketing Campaign in Firestore
  console.log('  📤 Staging campaigns in Firestore...\n');

  // Campaign 1: HUB Campaign (All types combined)
  const hubCampaign = {
    name: '📋 Valuation Brief — Agency & Partner Blast (HUB)',
    subject: 'GGHP-OS Strategic Valuation Brief — The Compliance Operating System for Legal Cannabis',
    type: 'email',
    status: 'draft',
    totalRecipients: fullAudience.length,
    sentCount: 0,
    sentEmails: [],
    dailyLimit: 500,
    audienceFilter: 'agency,advocate,attorney,provider,political,backoffice,distribution',
    excludeFilter: 'dispensary,grower,processor,patient',
    audienceBreakdown: {
      gov_agency: buckets.gov_agency.length,
      political: buckets.political.length,
      advocate: buckets.advocate.length,
      attorney: buckets.attorney.length,
      provider: buckets.provider.length,
      other_relevant: buckets.other_relevant.length,
    },
    createdAt: serverTimestamp(),
    lastSentAt: null,
    message: `<p>This email contains the GGHP-OS Strategic Valuation Brief for agency evaluation.</p>
<p>View the full brief: <a href="https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html">GGHP-OS Valuation Brief</a></p>`,
  };

  const hubRef = await addDoc(collection(db, 'marketing_campaigns'), hubCampaign);
  console.log(`  ✅ HUB Campaign created: ${hubRef.id}`);
  console.log(`     → ${fullAudience.length} recipients staged`);

  // Campaign 2: SWEEP Campaign (Segmented by type for targeted follow-up)
  const sweepSegments = [
    { label: 'Gov & State Agencies', data: [...buckets.gov_agency, ...buckets.political] },
    { label: 'Advocates & Research', data: buckets.advocate },
    { label: 'Attorneys & Law Firms', data: buckets.attorney },
    { label: 'Providers & Clinics', data: buckets.provider },
  ];

  for (const seg of sweepSegments) {
    if (seg.data.length === 0) continue;

    const sweepCampaign = {
      name: `📋 Valuation Brief — ${seg.label} (SWEEP)`,
      subject: `GGHP-OS Strategic Valuation Brief — ${seg.label}`,
      type: 'email',
      status: 'draft',
      totalRecipients: seg.data.length,
      sentCount: 0,
      sentEmails: [],
      dailyLimit: 500,
      audienceSegment: seg.label,
      createdAt: serverTimestamp(),
      lastSentAt: null,
      message: `<p>This email contains the GGHP-OS Strategic Valuation Brief for ${seg.label.toLowerCase()} evaluation.</p>
<p>View the full brief: <a href="https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html">GGHP-OS Valuation Brief</a></p>`,
    };

    const ref = await addDoc(collection(db, 'marketing_campaigns'), sweepCampaign);
    console.log(`  ✅ SWEEP Campaign [${seg.label}]: ${ref.id} → ${seg.data.length} recipients`);
  }

  // Print email lists for verification
  console.log('\n\n═══ EMAIL LISTS BY SEGMENT ═══\n');

  for (const [key, list] of Object.entries(buckets)) {
    if (list.length === 0) continue;
    const label = key.replace(/_/g, ' ').toUpperCase();
    console.log(`\n── ${label} (${list.length}) ──`);
    list.forEach(r => {
      const state = r.jurisdiction || r.state || '??';
      console.log(`  ${r.email.padEnd(40)} ${(r.name || '').substring(0, 35).padEnd(36)} ${state}`);
    });
  }

  console.log('\n\n═══════════════════════════════════════════════════');
  console.log('  ✅ COMPLETE — Campaigns staged in Marketing Hub');
  console.log('  → Open Marketing Campaigns tab to review & send');
  console.log('═══════════════════════════════════════════════════\n');

  process.exit(0);
}

extractValuationAudience().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
