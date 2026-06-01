import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

let app;
try {
  app = initializeApp(firebaseConfig, 'sync-calendly-api');
} catch (e) {
  const { getApp } = await import('firebase/app');
  try {
    app = getApp('sync-calendly-api');
  } catch {
    app = initializeApp(firebaseConfig, 'sync-calendly-api-' + Date.now());
  }
}
const db = getFirestore(app);
const auth = getAuth(app);

const CALENDLY_CAT_MAP = {
  'medical-card': { category: 'ops', color: 'bg-indigo-500', label: '🏥 Medical Card' },
  'patient-support': { category: 'ops', color: 'bg-indigo-500', label: '🩺 Patient Support' },
  'health-wellness': { category: 'ops', color: 'bg-indigo-500', label: '💚 Health & Wellness' },
  'technical-support': { category: 'ops', color: 'bg-indigo-500', label: '🛠️ IT Support' },
  'online-classes': { category: 'ops', color: 'bg-indigo-500', label: '📚 Classes' },
  'gghp-demo': { category: 'executive', color: 'bg-purple-500', label: '🎯 Demo' },
  'ggp-os': { category: 'executive', color: 'bg-purple-500', label: '💻 GGP-OS' },
  'q&a': { category: 'executive', color: 'bg-purple-500', label: '💻 Q&A' },
  'business-meeting': { category: 'executive', color: 'bg-purple-500', label: '🤝 Business' },
  'business-consultation': { category: 'executive', color: 'bg-purple-500', label: '📊 Consult' },
  'retail-compliance': { category: 'compliance', color: 'bg-amber-500', label: '📋 Compliance' },
  'sinc-oversight': { category: 'compliance', color: 'bg-amber-500', label: '🔍 SINC' },
  'metrc-integration': { category: 'compliance', color: 'bg-amber-500', label: '📡 Metrc' },
  'legal-consultation': { category: 'federal', color: 'bg-red-500', label: '⚖️ Legal' },
  '15 min': { category: 'ops', color: 'bg-indigo-500', label: '📅 15 Min' },
  '30 min': { category: 'executive', color: 'bg-purple-500', label: '🤝 30 Min' },
  'renew': { category: 'ops', color: 'bg-indigo-500', label: '🔄 Renewal' },
};

const categorizeCalendly = (name) => {
  const lower = (name || '').toLowerCase();
  const isRenewal = lower.includes('renew') || lower.includes('renewal');
  for (const [key, meta] of Object.entries(CALENDLY_CAT_MAP)) {
    if (lower.includes(key)) {
      return { 
        category: isRenewal ? 'renewal' : 'ops', 
        color: isRenewal ? 'bg-yellow-500' : 'bg-emerald-600', 
        label: meta.label 
      };
    }
  }
  return { 
    category: isRenewal ? 'renewal' : 'ops', 
    color: isRenewal ? 'bg-yellow-500' : 'bg-emerald-600', 
    label: isRenewal ? '🔄 Renewal' : '📅' 
  };
};

export default async function handler(req, res) {
  const CALENDLY_TOKEN = process.env.VITE_CALENDLY_TOKEN_V2 || process.env.VITE_CALENDLY_TOKEN;
  
  if (!CALENDLY_TOKEN) {
    return res.status(500).json({ error: 'Calendly token is missing in server environment variables.' });
  }

  // 1. Authenticate with Firebase first to satisfy firestore.rules
  try {
    await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  } catch (authErr) {
    console.error('❌ Firebase Authentication failed:', authErr.message);
    return res.status(500).json({ error: 'Firebase authentication failed.', details: authErr.message });
  }

  try {
    // 2. Get user URI
    const userRes = await fetch('https://api.calendly.com/users/me', {
      headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` },
    });
    
    if (!userRes.ok) {
      const errText = await userRes.text();
      return res.status(userRes.status).json({ error: 'Failed to verify Calendly user.', details: errText });
    }
    
    const userData = await userRes.json();
    const userUri = userData.resource.uri;

    // 2. Fetch events from 3 months back to 2 months forward
    const now = new Date();
    const minDate = new Date(now);
    minDate.setMonth(minDate.getMonth() - 3);
    const maxDate = new Date(now);
    maxDate.setMonth(maxDate.getMonth() + 2);

    let newCount = 0;
    let updatedCount = 0;

    for (const status of ['active', 'canceled']) {
      const url = `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${minDate.toISOString()}&max_start_time=${maxDate.toISOString()}&count=100&status=${status}`;
      const evRes = await fetch(url, { headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` } });
      
      if (!evRes.ok) continue;
      const evData = await evRes.json();

      for (const ev of evData.collection || []) {
        // Fetch invitee details
        let inviteeName = '';
        let inviteeEmail = '';
        let inviteePhone = '';
        let inviteeQuestions = [];
        try {
          const invRes = await fetch(`${ev.uri}/invitees`, { headers: { Authorization: `Bearer ${CALENDLY_TOKEN}` } });
          if (invRes.ok) {
            const invData = await invRes.json();
            if (invData.collection?.length > 0) {
              const invitee = invData.collection[0];
              inviteeName = invitee.name || '';
              inviteeEmail = invitee.email || '';
              inviteePhone = invitee.text_reminder_number || '';
              inviteeQuestions = invitee.questions_and_answers || [];
            }
          }
        } catch (invErr) {
          console.error(`Failed to fetch invitees for ${ev.uri}:`, invErr.message);
        }

        const startDate = new Date(ev.start_time);
        const endDate = new Date(ev.end_time);
        const { category, color, label } = categorizeCalendly(ev.name);
        const isCanceled = ev.status === 'canceled';

        const dateStr = startDate.toISOString().split('T')[0];
        const startTimeStr = startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' });
        const endTimeStr = endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' });
        
        const title = `${isCanceled ? '❌ ' : ''}${label}: ${inviteeName || ev.name}`;

        const evPayload = {
          title,
          date: dateStr,
          startTime: startTimeStr,
          endTime: endTimeStr,
          category,
          color: isCanceled ? 'bg-slate-400' : color,
          description: [
            `📅 Event: ${ev.name}`,
            inviteeName ? `👤 Invitee: ${inviteeName}` : '',
            inviteeEmail ? `📧 Email: ${inviteeEmail}` : '',
            inviteePhone ? `📱 Phone: ${inviteePhone}` : '',
            `📍 Location: ${ev.location?.location || 'Virtual'}`,
            ...inviteeQuestions.map(q => `💬 ${q.question}: ${q.answer}`),
            isCanceled ? '⚠️ CANCELED' : `✅ ${ev.status.toUpperCase()}`,
            `Source: Calendly`,
          ].filter(Boolean).join('\n'),
          attendees: inviteeEmail,
          meetLink: ev.location?.join_url || '',
          location: ev.location?.location || 'Virtual',
          assignedTo: 'Founder',
          assignedBy: 'Founder',
          source: 'calendly',
          calendly_event_uri: ev.uri,
          updatedAt: new Date().toISOString()
        };

        // Check if event already exists in Firestore by calendly_event_uri
        let q = query(collection(db, 'calendar_events'), where('calendly_event_uri', '==', ev.uri));
        let snap = await getDocs(q);

        if (snap.empty) {
          // Fallback duplicate check by date and startTime
          const q2 = query(
            collection(db, 'calendar_events'),
            where('date', '==', dateStr),
            where('startTime', '==', startTimeStr)
          );
          const snap2 = await getDocs(q2);
          
          // Check if any matching date/time has the same email or title name
          let matchedDoc = null;
          for (const doc2 of snap2.docs) {
            const d2 = doc2.data();
            const sameEmail = inviteeEmail && d2.attendees === inviteeEmail;
            const sameTitle = d2.title && d2.title.toLowerCase().includes((inviteeName || '').toLowerCase());
            if (sameEmail || sameTitle) {
              matchedDoc = doc2;
              break;
            }
          }

          if (matchedDoc) {
            // Update the existing document to link it to Calendly
            await updateDoc(matchedDoc.ref, evPayload);
            updatedCount++;
          } else {
            // Add new event
            await addDoc(collection(db, 'calendar_events'), {
              ...evPayload,
              createdAt: new Date().toISOString()
            });
            newCount++;
          }
        } else {
          // Update existing event to ensure it stays in sync
          const docRef = snap.docs[0].ref;
          const currentData = snap.docs[0].data();
          
          if (currentData.title !== title || currentData.date !== dateStr || currentData.startTime !== startTimeStr || currentData.description !== evPayload.description) {
            await updateDoc(docRef, evPayload);
            updatedCount++;
          }
        }
      }
    }

    return res.status(200).json({
      status: 'success',
      message: `Sync complete. Created ${newCount} new events, updated ${updatedCount} existing events.`,
      newCount,
      updatedCount
    });

  } catch (error) {
    console.error('❌ Server Calendly sync failed:', error);
    return res.status(500).json({ error: 'Internal server error during sync.', details: error.message });
  }
}
