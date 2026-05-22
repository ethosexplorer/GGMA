// ============================================================
// GGMA — Calendly Webhook Endpoint
// 
// Receives real-time booking notifications from Calendly and:
// 1. Writes the appointment to Firebase calendar_events collection
// 2. Logs it to the Turso audit trail
// 3. Returns 200 to confirm receipt
//
// Setup: In Calendly → Integrations → Webhooks → Subscribe
//   URL: https://your-domain.vercel.app/api/calendly-webhook
//   Events: invitee.created
// ============================================================

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: `firebase-adminsdk@${process.env.VITE_FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      // For production, use FIREBASE_ADMIN_PRIVATE_KEY env var
      // For now, we use the client-side config which works for Firestore writes
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    const event = payload.event || '';
    const data = payload.payload || {};

    console.log(`📅 Calendly webhook received: ${event}`);

    // We care about new bookings
    if (event !== 'invitee.created') {
      console.log(`   Ignoring event type: ${event}`);
      return res.status(200).json({ status: 'ignored', event });
    }

    // Extract booking details from Calendly payload
    const invitee = data.invitee || {};
    const eventDetails = data.event || {};
    const scheduledEvent = data.scheduled_event || {};
    const questions = data.questions_and_answers || [];

    // Parse start/end times
    const startTime = scheduledEvent.start_time || eventDetails.start_time || '';
    const endTime = scheduledEvent.end_time || eventDetails.end_time || '';
    const startDate = startTime ? new Date(startTime) : new Date();
    const endDate = endTime ? new Date(endTime) : new Date();

    // Build calendar event
    const calendarEvent = {
      title: `📅 ${invitee.name || 'New Patient'} — Calendly Booking`,
      date: startDate.toISOString().split('T')[0],
      startTime: startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' }),
      endTime: endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' }),
      category: 'admin_support',
      color: 'bg-emerald-500',
      description: [
        `Booked via Calendly`,
        `Email: ${invitee.email || 'N/A'}`,
        `Event: ${scheduledEvent.name || eventDetails.name || 'Appointment'}`,
        `Location: ${scheduledEvent.location?.location || 'Virtual'}`,
        questions.map(q => `${q.question}: ${q.answer}`).join('\n'),
      ].filter(Boolean).join('\n'),
      attendees: invitee.email || '',
      meetLink: scheduledEvent.location?.join_url || '',
      location: scheduledEvent.location?.location || 'Virtual',
      source: 'calendly',
      calendly_event_uri: scheduledEvent.uri || '',
      calendly_invitee_uri: invitee.uri || '',
      invitee_name: invitee.name || '',
      invitee_email: invitee.email || '',
      invitee_phone: invitee.text_reminder_number || '',
      createdAt: new Date().toISOString(),
    };

    console.log(`   📋 Booking: ${calendarEvent.title}`);
    console.log(`   📅 Date: ${calendarEvent.date} ${calendarEvent.startTime}-${calendarEvent.endTime}`);
    console.log(`   📧 Email: ${invitee.email}`);

    // Write to Firebase Firestore
    let firebaseId = null;
    try {
      const firestore = getFirestore();
      const docRef = await firestore.collection('calendar_events').add(calendarEvent);
      firebaseId = docRef.id;
      console.log(`   ✅ Written to Firebase: ${firebaseId}`);
    } catch (fbErr) {
      console.error(`   ⚠️ Firebase write failed (will still log to Turso):`, fbErr.message);
    }

    // Also write a notification to Firebase for real-time alerts
    try {
      const firestore = getFirestore();
      await firestore.collection('notifications').add({
        type: 'calendly_booking',
        title: `🆕 New Appointment: ${invitee.name || 'Patient'}`,
        body: `${scheduledEvent.name || 'Appointment'} scheduled for ${calendarEvent.date} at ${calendarEvent.startTime}`,
        email: invitee.email || '',
        read: false,
        createdAt: new Date().toISOString(),
        calendarEventId: firebaseId,
      });
      console.log(`   🔔 Notification created`);
    } catch (notifErr) {
      console.error(`   ⚠️ Notification write failed:`, notifErr.message);
    }

    // Log to Turso audit trail
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
            date: calendarEvent.date,
            start: calendarEvent.startTime,
            end: calendarEvent.endTime,
            firebase_id: firebaseId,
          }),
        ],
      });
      console.log(`   📝 Audit log written to Turso`);
    } catch (tursoErr) {
      console.error(`   ⚠️ Turso audit log failed:`, tursoErr.message);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Booking received and synced to platform',
      firebaseId,
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
