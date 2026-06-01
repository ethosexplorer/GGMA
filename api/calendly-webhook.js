// ============================================================
// GGMA — Calendly Webhook Endpoint
// 
// Receives real-time booking notifications from Calendly and:
// 1. Writes the appointment to Firebase calendar_events collection
// 2. Logs it to the Turso audit trail
// 3. Returns 200 to confirm receipt
//
// Webhook registered: https://ggma.vercel.app/api/calendly-webhook
// Events: invitee.created, invitee.canceled
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Initialize Firebase client SDK (server-side compatible)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

let app;
try { app = initializeApp(firebaseConfig, 'calendly-webhook'); } catch (e) {
  // App already initialized
  const { getApp } = await import('firebase/app');
  try { app = getApp('calendly-webhook'); } catch { app = initializeApp(firebaseConfig, 'calendly-webhook-' + Date.now()); }
}
const db = getFirestore(app);
const auth = getAuth(app);

// Map Calendly event slugs to platform categories + colors
const EVENT_CATEGORY_MAP = {
  'medical-card-recommendation': { category: 'ops', color: 'bg-indigo-500', label: '🏥 Medical Card' },
  'general-patient-support':     { category: 'ops', color: 'bg-indigo-500', label: '🩺 Patient Support' },
  'health-wellness-consultation': { category: 'ops', color: 'bg-indigo-500', label: '💚 Health & Wellness' },
  'gghp-demo':                   { category: 'executive', color: 'bg-purple-500', label: '🎯 GGHP Demo' },
  'calendly-com-ggp-os':         { category: 'executive', color: 'bg-purple-500', label: '💻 GGP-OS Platform' },
  'business-meeting':            { category: 'executive', color: 'bg-purple-500', label: '🤝 Business Meeting' },
  'general-business-consultation': { category: 'executive', color: 'bg-purple-500', label: '📊 Business Consult' },
  'retail-compliance-pro':       { category: 'compliance', color: 'bg-amber-500', label: '📋 Retail Compliance' },
  'sinc-oversight-directives':   { category: 'compliance', color: 'bg-amber-500', label: '🔍 SINC Oversight' },
  'metrc-integration-mastery':   { category: 'compliance', color: 'bg-amber-500', label: '📡 Metrc Integration' },
  'legal-consultation':          { category: 'federal', color: 'bg-red-500', label: '⚖️ Legal Consultation' },
  'it-technical-support':        { category: 'ops', color: 'bg-indigo-500', label: '🛠️ IT Support' },
  'online-classes':              { category: 'ops', color: 'bg-indigo-500', label: '📚 Online Classes' },
};

function categorizeEvent(eventUrl) {
  for (const [slug, meta] of Object.entries(EVENT_CATEGORY_MAP)) {
    if (eventUrl && eventUrl.includes(slug)) {
      return { category: 'ops', color: 'bg-indigo-500', label: meta.label };
    }
  }
  return { category: 'ops', color: 'bg-indigo-500', label: '📅 Calendly' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate with Firebase first to satisfy firestore.rules
  try {
    await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  } catch (authErr) {
    console.error('❌ Firebase Webhook Authentication failed:', authErr.message);
  }

  try {
    const payload = req.body;
    const event = payload.event || '';
    const data = payload.payload || {};

    console.log(`📅 Calendly webhook received: ${event}`);

    // Handle cancellations
    if (event === 'invitee.canceled') {
      console.log(`   ❌ Cancellation received — logged`);
      return res.status(200).json({ status: 'canceled_logged', event });
    }

    if (event !== 'invitee.created') {
      return res.status(200).json({ status: 'ignored', event });
    }

    // Extract booking details
    const invitee = data.invitee || {};
    const eventDetails = data.event || {};
    const scheduledEvent = data.scheduled_event || {};
    const questions = data.questions_and_answers || [];
    const eventTypeUrl = scheduledEvent.event_type || eventDetails.event_type || '';

    // Determine category based on event type
    const { category, color, label } = categorizeEvent(eventTypeUrl);

    // Parse start/end times (CST)
    const startTime = scheduledEvent.start_time || eventDetails.start_time || '';
    const endTime = scheduledEvent.end_time || eventDetails.end_time || '';
    const startDate = startTime ? new Date(startTime) : new Date();
    const endDate = endTime ? new Date(endTime) : new Date();

    // Build calendar event matching FounderCalendar's CalEvent interface
    const calendarEvent = {
      title: `${label}: ${invitee.name || 'New Booking'}`,
      date: startDate.toISOString().split('T')[0],
      startTime: startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' }),
      endTime: endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' }),
      category,
      color,
      description: [
        `Booked via Calendly`,
        `Email: ${invitee.email || 'N/A'}`,
        `Phone: ${invitee.text_reminder_number || 'N/A'}`,
        `Event Type: ${scheduledEvent.name || eventDetails.name || 'Appointment'}`,
        `Location: ${scheduledEvent.location?.location || 'Virtual'}`,
        ...questions.map(q => `${q.question}: ${q.answer}`),
      ].filter(Boolean).join('\n'),
      attendees: invitee.email || '',
      meetLink: scheduledEvent.location?.join_url || '',
      location: scheduledEvent.location?.location || 'Virtual',
      // Required for FounderCalendar visibility
      assignedTo: 'Founder',
      assignedBy: 'Founder',
      // Calendly metadata
      source: 'calendly',
      calendly_event_uri: scheduledEvent.uri || '',
      calendly_invitee_uri: invitee.uri || '',
      invitee_name: invitee.name || '',
      invitee_email: invitee.email || '',
      invitee_phone: invitee.text_reminder_number || '',
      createdAt: new Date().toISOString(),
    };

    console.log(`   📋 ${calendarEvent.title}`);
    console.log(`   📅 ${calendarEvent.date} ${calendarEvent.startTime}-${calendarEvent.endTime}`);
    console.log(`   🏷️ Category: ${category}`);

    // Write to Firebase Firestore (calendar_events collection)
    let firebaseId = null;
    try {
      if (calendarEvent.calendly_event_uri) {
        let q = query(collection(db, 'calendar_events'), where('calendly_event_uri', '==', calendarEvent.calendly_event_uri));
        let snap = await getDocs(q);
        
        if (snap.empty) {
          // Fallback duplicate check by date and startTime
          const q2 = query(
            collection(db, 'calendar_events'),
            where('date', '==', calendarEvent.date),
            where('startTime', '==', calendarEvent.startTime)
          );
          const snap2 = await getDocs(q2);
          
          let matchedDoc = null;
          for (const doc2 of snap2.docs) {
            const d2 = doc2.data();
            const sameEmail = calendarEvent.attendees && d2.attendees === calendarEvent.attendees;
            const sameTitle = d2.title && d2.title.toLowerCase().includes((invitee.name || '').toLowerCase());
            if (sameEmail || sameTitle) {
              matchedDoc = doc2;
              break;
            }
          }

          if (matchedDoc) {
            await updateDoc(matchedDoc.ref, calendarEvent);
            firebaseId = matchedDoc.id;
            console.log(`   ✅ Firebase calendar_events (updated duplicate by time/email): ${firebaseId}`);
          } else {
            const docRef = await addDoc(collection(db, 'calendar_events'), calendarEvent);
            firebaseId = docRef.id;
            console.log(`   ✅ Firebase calendar_events: ${firebaseId}`);
          }
        } else {
          const docRef = snap.docs[0].ref;
          await updateDoc(docRef, calendarEvent);
          firebaseId = snap.docs[0].id;
          console.log(`   ✅ Firebase calendar_events (updated existing): ${firebaseId}`);
        }
      } else {
        const docRef = await addDoc(collection(db, 'calendar_events'), calendarEvent);
        firebaseId = docRef.id;
        console.log(`   ✅ Firebase calendar_events: ${firebaseId}`);
      }
    } catch (fbErr) {
      console.error(`   ⚠️ Firebase write failed:`, fbErr.message);
    }

    // Write notification for real-time alerts
    try {
      await addDoc(collection(db, 'notifications'), {
        type: 'calendly_booking',
        title: `🆕 New Appointment: ${invitee.name || 'Patient'}`,
        message: `${scheduledEvent.name || 'Appointment'} on ${calendarEvent.date} at ${calendarEvent.startTime}`,
        body: `${label} — ${invitee.email || ''}`,
        email: invitee.email || '',
        read: false,
        createdAt: new Date().toISOString(),
        calendarEventId: firebaseId,
      });
      console.log(`   🔔 Notification created`);
    } catch (notifErr) {
      console.error(`   ⚠️ Notification failed:`, notifErr.message);
    }

    // Audit trail in Turso
    try {
      const { createClient } = await import('@libsql/client');
      const turso = createClient({
        url: process.env.VITE_TURSO_DATABASE_URL,
        authToken: process.env.VITE_TURSO_AUTH_TOKEN,
      });
      await turso.execute({
        sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
        args: [
          `calendly_${Date.now()}`,
          'CALENDLY_BOOKING_RECEIVED',
          invitee.email || 'calendly_webhook',
          JSON.stringify({
            invitee_name: invitee.name,
            invitee_email: invitee.email,
            event_name: scheduledEvent.name || eventDetails.name,
            category,
            date: calendarEvent.date,
            start: calendarEvent.startTime,
            end: calendarEvent.endTime,
            firebase_id: firebaseId,
          }),
        ],
      });
      console.log(`   📝 Turso audit logged`);
    } catch (tursoErr) {
      console.error(`   ⚠️ Turso log failed:`, tursoErr.message);
    }

    return res.status(200).json({
      status: 'success',
      firebaseId,
      category,
      booking: {
        name: invitee.name,
        email: invitee.email,
        date: calendarEvent.date,
        time: `${calendarEvent.startTime}-${calendarEvent.endTime}`,
      },
    });

  } catch (error) {
    console.error('❌ Calendly webhook error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
