const CALENDLY_TOKEN = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzc5NDgwMTgzLCJqdGkiOiJjNTM1MWFjNC0wYWU4LTQ4YTYtYTM5NC1iZDU4YTcyOTcwYWIiLCJ1c2VyX3V1aWQiOiJhNmNlMjZiYi1jYmI5LTQzMzAtYWRiZi1mOGM5YjQ2YzA3YTgiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIGFjdGl2aXR5X2xvZzpyZWFkIGRhdGFfY29tcGxpYW5jZTp3cml0ZSBvdXRnb2luZ19jb21tdW5pY2F0aW9uczpyZWFkIHdlYmhvb2tzOnJlYWQgd2ViaG9va3M6d3JpdGUifQ._wCo61kFxqJdzGoV6CmXkpDdsUzejBTh5dcDey8odY9qcn7wFc_ZUN_2SFQ3p2Rj3tfMKnlm2veUhKTs0vHNyw';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os",
  storageBucket: "ggp-os.firebasestorage.app",
  messagingSenderId: "982399448797",
  appId: "1:982399448797:web:d130218d61392bc1fe8d34",
};
const app = initializeApp(firebaseConfig, 'sync-cal');
const db = getFirestore(app);
const auth = getAuth(app);

// Authenticate
await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
console.log('✅ Firebase authenticated');

const EVENT_MAP = {
  'medical-card': { category: 'ops', color: 'bg-indigo-500', label: '🏥 Medical Card' },
  'patient-support': { category: 'ops', color: 'bg-indigo-500', label: '🩺 Patient Support' },
  'health-wellness': { category: 'ops', color: 'bg-indigo-500', label: '💚 Health & Wellness' },
  'technical-support': { category: 'ops', color: 'bg-indigo-500', label: '🛠️ IT Support' },
  'gghp-demo': { category: 'executive', color: 'bg-purple-500', label: '🎯 Demo' },
  'ggp-os': { category: 'executive', color: 'bg-purple-500', label: '💻 GGP-OS' },
  'q&a': { category: 'executive', color: 'bg-purple-500', label: '💻 GGP-OS Q&A' },
  'business-meeting': { category: 'executive', color: 'bg-purple-500', label: '🤝 Business' },
  'business-consultation': { category: 'executive', color: 'bg-purple-500', label: '📊 Consult' },
  'retail-compliance': { category: 'compliance', color: 'bg-amber-500', label: '📋 Compliance' },
  'sinc-oversight': { category: 'compliance', color: 'bg-amber-500', label: '🔍 SINC' },
  'metrc-integration': { category: 'compliance', color: 'bg-amber-500', label: '📡 Metrc' },
  'legal-consultation': { category: 'federal', color: 'bg-red-500', label: '⚖️ Legal' },
  'online-classes': { category: 'ops', color: 'bg-indigo-500', label: '📚 Classes' },
  '15 min': { category: 'ops', color: 'bg-indigo-500', label: '📅 15 Min Meeting' },
  'renew': { category: 'ops', color: 'bg-indigo-500', label: '🔄 Renewal' },
};

function categorize(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, meta] of Object.entries(EVENT_MAP)) {
    if (lower.includes(key)) return meta;
  }
  return { category: 'ops', color: 'bg-indigo-500', label: '📅' };
}

async function writeToFirestore(docData) {
  const docRef = await addDoc(collection(db, 'calendar_events'), docData);
  return docRef.id;
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  GGMA Operations Calendar Sync');
  console.log('═══════════════════════════════════════');

  // Step 1: Fetch Calendly events
  console.log('\n🔄 Fetching Calendly scheduled events...');
  const userRes = await fetch('https://api.calendly.com/users/me', {
    headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
  });
  const userData = await userRes.json();
  const userUri = userData.resource.uri;
  console.log(`   User: ${userData.resource.name}`);

  const minTime = '2026-04-01T00:00:00Z';
  const maxTime = '2026-06-30T23:59:59Z';
  const eventsRes = await fetch(
    `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${minTime}&max_start_time=${maxTime}&count=100&status=active`,
    { headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` } }
  );
  const eventsData = await eventsRes.json();
  const events = eventsData.collection || [];
  console.log(`   Found ${events.length} scheduled events\n`);

  for (const ev of events) {
    const startDate = new Date(ev.start_time);
    const endDate = new Date(ev.end_time);
    const dateStr = startDate.toISOString().split('T')[0];
    const startTimeStr = startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' });
    const endTimeStr = endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' });

    // Get invitees
    let inviteeName = '', inviteeEmail = '';
    try {
      const invRes = await fetch(`${ev.uri}/invitees`, {
        headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
      });
      const invData = await invRes.json();
      if (invData.collection?.length > 0) {
        inviteeName = invData.collection[0].name || '';
        inviteeEmail = invData.collection[0].email || '';
      }
    } catch {}

    const { category, color, label } = categorize(ev.name);
    const title = `${label}: ${inviteeName || ev.name}`;

    try {
      const docId = await writeToFirestore({
        title,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        category,
        color,
        description: `Event: ${ev.name}\nInvitee: ${inviteeName}\nEmail: ${inviteeEmail}\nLocation: ${ev.location?.location || 'Virtual'}`,
        attendees: inviteeEmail,
        meetLink: ev.location?.join_url || '',
        location: ev.location?.location || 'Virtual',
        assignedTo: 'Founder',
        assignedBy: 'Founder',
        source: 'calendly',
        createdAt: new Date().toISOString(),
      });
      console.log(`   ✅ ${title} — ${dateStr} ${startTimeStr} [${category}] → ${docId}`);
    } catch (e) {
      console.error(`   ❌ ${title}: ${e.message}`);
    }
  }

  // Step 2: Add Carepatron event
  console.log('\n🔄 Adding Carepatron events...');
  try {
    const docId = await writeToFirestore({
      title: '🏥 OPERATIONS SUPPORT HUB',
      date: '2026-05-18',
      startTime: '15:00',
      endTime: '16:00',
      category: 'ops',
      color: 'bg-pink-500',
      description: 'Carepatron Operations Support Hub\nTeam: Shantell R. Patient Intake, Wendy Smith (Demo)\nBooking: https://book.carepatron.com/Diversity-Health---Wellness-Network--GoHealthUSA---CCardz-/All?p=MeBev6pvQWuqD4djocNXFg',
      attendees: '',
      meetLink: '',
      location: 'Carepatron',
      assignedTo: 'Founder',
      assignedBy: 'Founder',
      source: 'carepatron',
      createdAt: new Date().toISOString(),
    });
    console.log(`   ✅ OPERATIONS SUPPORT HUB — 2026-05-18 15:00 → ${docId}`);
  } catch (e) {
    console.error(`   ❌ Carepatron:`, e.message);
  }

  console.log('\n✅ Sync complete. Check Operations Calendar now.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
