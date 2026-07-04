// ============================================================
// GGMA — Unified Webhook Endpoint
// 
// Handles:
// 1. General queue updates (Make.com)
// 2. PayPal checkout approvals & payments
// 3. Calendly booking notifications
// 4. Freemius subscription status updates
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { createClient } from '@libsql/client';

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
  app = initializeApp(firebaseConfig, 'unified-webhook');
} catch (e) {
  const { getApp } = await import('firebase/app');
  try {
    app = getApp('unified-webhook');
  } catch {
    app = initializeApp(firebaseConfig, 'unified-webhook-' + Date.now());
  }
}
const db = getFirestore(app);
const auth = getAuth(app);

// Helper to fetch PayPal access token
async function getPayPalAccessToken(clientId, secretKey) {
  const authString = Buffer.from(`${clientId}:${secretKey}`).toString('base64');
  const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) {
    throw new Error('Failed to retrieve PayPal Access Token: ' + (await response.text()));
  }
  
  const data = await response.json();
  return data.access_token;
}

// Calendly Event Map
const EVENT_CATEGORY_MAP = {
  'medical-card-recommendation-clone': { category: 'ops', color: 'bg-indigo-500', label: '🏥 Medical Card' },
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
  const lower = (eventUrl || '').toLowerCase();
  const isRenewal = lower.includes('renew') || lower.includes('renewal');
  for (const [slug, meta] of Object.entries(EVENT_CATEGORY_MAP)) {
    if (eventUrl && eventUrl.includes(slug)) {
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
    label: isRenewal ? '🔄 Renewal' : '📅 Calendly' 
  };
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Identify webhook type from query parameter (defaults to general)
  const type = req.query.type || 'general';

  if (type === 'general') {
    if (req.method !== 'POST' && req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action } = req.body || req.query;
    const url = 'https://ggma-ggma.aws-us-east-2.turso.io/v2/pipeline';
    const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ';

    try {
      let sql = "";
      if (action === 'started') {
        sql = "UPDATE system_state SET value = value + 1 WHERE key = 'queue_count';";
      } else if (action === 'completed') {
        sql = "UPDATE system_state SET value = MAX(0, value - 1) WHERE key = 'queue_count';";
      } else {
        return res.status(400).json({ error: "Invalid action. Use 'started' or 'completed'" });
      }

      const tursoRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            { type: "execute", stmt: { sql } }
          ]
        })
      });

      if (!tursoRes.ok) {
        const err = await tursoRes.text();
        return res.status(500).json({ error: err });
      }

      return res.status(200).json({ success: true, action });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // For other webhooks, we only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Helper function to sign-in to Firebase before making database writes
  const signInFirebase = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
    } catch (authErr) {
      console.error('❌ Firebase Webhook Authentication failed:', authErr.message);
    }
  };

  // Initialize Turso Client helper
  const getTursoClient = () => {
    return createClient({
      url: process.env.VITE_TURSO_DATABASE_URL,
      authToken: process.env.VITE_TURSO_AUTH_TOKEN,
    });
  };

  if (type === 'paypal') {
    const clientId = process.env.VITE_PAYPAL_CLIENT_ID;
    const secretKey = process.env.PAYPAL_SECRET_KEY;
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    // Verify Webhook Signature with PayPal if credentials are fully configured
    if (clientId && secretKey && webhookId) {
      try {
        const transmissionId = req.headers['paypal-transmission-id'] || req.headers['PAYPAL-TRANSMISSION-ID'];
        const transmissionTime = req.headers['paypal-transmission-time'] || req.headers['PAYPAL-TRANSMISSION-TIME'];
        const transmissionSig = req.headers['paypal-transmission-sig'] || req.headers['PAYPAL-TRANSMISSION-SIG'];
        const authAlgo = req.headers['paypal-auth-algo'] || req.headers['PAYPAL-AUTH-ALGO'];
        const certUrl = req.headers['paypal-cert-url'] || req.headers['PAYPAL-CERT-URL'];

        if (transmissionId && transmissionTime && transmissionSig && authAlgo && certUrl) {
          const accessToken = await getPayPalAccessToken(clientId, secretKey);
          
          const verificationRes = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              auth_algo: authAlgo,
              cert_url: certUrl,
              transmission_id: transmissionId,
              transmission_sig: transmissionSig,
              transmission_time: transmissionTime,
              webhook_id: webhookId,
              webhook_event: req.body,
            }),
          });

          if (verificationRes.ok) {
            const verificationResult = await verificationRes.json();
            if (verificationResult.verification_status !== 'SUCCESS') {
              console.warn('⚠️ PayPal webhook signature verification failed (result: ' + verificationResult.verification_status + ')');
              return res.status(401).json({ error: 'Invalid signature verification status' });
            }
          } else {
            console.warn('⚠️ PayPal webhook verification request failed: ' + (await verificationRes.text()));
          }
        }
      } catch (verifyErr) {
        console.error('❌ PayPal verification procedure failed:', verifyErr.message);
      }
    }

    await signInFirebase();

    try {
      const payload = req.body;
      const eventType = payload.event_type || '';
      const resource = payload.resource || {};

      console.log(`💳 PayPal Webhook Event Received: "${eventType}"`);

      const validEvents = ['PAYMENT.CAPTURE.COMPLETED', 'PAYMENT.SALE.COMPLETED', 'CHECKOUT.ORDER.APPROVED'];
      if (!validEvents.includes(eventType)) {
        return res.status(200).json({ status: 'ignored', reason: 'Unhandled event type: ' + eventType });
      }

      const txId = resource.id || resource.transaction_id || 'N/A';
      
      const payerEmail = resource.payer?.email_address || 
                         resource.billing_info?.email_address || 
                         resource.custom_id || 
                         resource.custom || 
                         'unknown@paypal.com';

      const givenName = resource.payer?.name?.given_name || '';
      const surname = resource.payer?.name?.surname || '';
      const payerName = givenName || surname ? `${givenName} ${surname}`.trim() : 'Patient';

      const amount = resource.amount?.value || 
                     resource.amount?.total || 
                     resource.gross_amount?.value || 
                     '0.00';

      const cleanAmount = parseFloat(amount);
      const formattedAmount = '$' + cleanAmount.toFixed(2);

      if (cleanAmount <= 0) {
        return res.status(200).json({ status: 'ignored', reason: 'Zero or negative amount transaction: ' + formattedAmount });
      }

      let productType = 'Processing Fee';
      if (Math.abs(cleanAmount - 194.30) < 1.0) {
        productType = 'Standard Patient Application';
      } else if (Math.abs(cleanAmount - 112.50) < 1.0) {
        productType = 'Discounted Patient Application';
      }

      const turso = getTursoClient();

      // Log to Turso Ledger
      try {
        const payId = 'paypal-' + txId;
        const netProfit = (cleanAmount * 0.97).toFixed(2);
        const formattedNet = '$' + netProfit;

        await turso.execute({
          sql: "INSERT INTO founder_ledger (id, origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          args: [
            payId,
            `${payerName} (${payerEmail})`,
            `${productType} (PayPal)`,
            formattedAmount,
            formattedNet,
            'Settled',
            'bg-emerald-600',
            new Date().toISOString()
          ]
        });
        console.log(`   ✅ Logged payment to Turso Financial Ledger: ${formattedAmount} (Net: ${formattedNet})`);
      } catch (ledgerErr) {
        console.error('   ⚠️ Failed to log payment to ledger:', ledgerErr.message);
      }

      // Log Audit Trail
      try {
        await turso.execute({
          sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
          args: [
            `paypal_${Date.now()}`,
            'PAYPAL_PAYMENT_RECEIVED',
            payerEmail,
            JSON.stringify({
              event: eventType,
              transactionId: txId,
              amount: formattedAmount,
              payerName,
              payerEmail,
              productType
            })
          ]
        });
        console.log(`   ✅ Audit log recorded`);
      } catch (auditErr) {
        console.error('   ⚠️ Failed to log audit trail:', auditErr.message);
      }

      // Create Notification in Firestore
      try {
        await addDoc(collection(db, 'notifications'), {
          type: 'paypal_payment',
          title: `💳 PayPal Payment Settled`,
          message: `${payerName} paid ${formattedAmount} via PayPal`,
          body: `${productType} — ${payerEmail}\nTransaction ID: ${txId}`,
          email: payerEmail,
          read: false,
          createdAt: new Date().toISOString(),
        });
        console.log(`   🔔 Real-time notification created in Firestore`);
      } catch (notifErr) {
        console.error('   ⚠️ Notification creation failed:', notifErr.message);
      }

      return res.status(200).json({ status: 'success', event: eventType, transactionId: txId });

    } catch (err) {
      console.error('❌ PayPal Webhook execution failed:', err);
      return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }

  if (type === 'calendly') {
    await signInFirebase();

    try {
      const payload = req.body;
      const event = payload.event || '';
      const data = payload.payload || {};

      console.log(`📅 Calendly webhook received: ${event}`);

      if (event === 'invitee.canceled') {
        console.log(`   ❌ Cancellation received — logged`);
        return res.status(200).json({ status: 'canceled_logged', event });
      }

      if (event !== 'invitee.created') {
        return res.status(200).json({ status: 'ignored', event });
      }

      const invitee = data.invitee || {};
      const eventDetails = data.event || {};
      const scheduledEvent = data.scheduled_event || {};
      const questions = data.questions_and_answers || [];
      const eventTypeUrl = scheduledEvent.event_type || eventDetails.event_type || '';

      const { category, color, label } = categorizeEvent(eventTypeUrl);

      const startTime = scheduledEvent.start_time || eventDetails.start_time || '';
      const endTime = scheduledEvent.end_time || eventDetails.end_time || '';
      const startDate = startTime ? new Date(startTime) : new Date();
      const endDate = endTime ? new Date(endTime) : new Date();

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
        assignedTo: 'Founder',
        assignedBy: 'Founder',
        source: 'calendly',
        calendly_event_uri: scheduledEvent.uri || '',
        calendly_invitee_uri: invitee.uri || '',
        invitee_name: invitee.name || '',
        invitee_email: invitee.email || '',
        invitee_phone: invitee.text_reminder_number || '',
        createdAt: new Date().toISOString(),
      };

      console.log(`   📋 ${calendarEvent.title}`);

      let firebaseId = null;
      try {
        if (calendarEvent.calendly_event_uri) {
          let q = query(collection(db, 'calendar_events'), where('calendly_event_uri', '==', calendarEvent.calendly_event_uri));
          let snap = await getDocs(q);
          
          if (snap.empty) {
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
              console.log(`   ✅ Firebase calendar_events (updated duplicate): ${firebaseId}`);
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

      // Write notification
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
        const turso = getTursoClient();
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

  if (type === 'freemius') {
    const signature = req.headers['x-signature'] || req.headers['http_x_signature'];
    const secretKey = process.env.FREEMIUS_SECRET_KEY;

    if (secretKey && signature) {
      const rawBody = req.rawBody || JSON.stringify(req.body);
      const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
      
      if (signature !== expectedSignature) {
        console.warn('⚠️ Freemius signature verification failed');
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    await signInFirebase();

    try {
      const payload = req.body;
      const eventType = payload.event || payload.type || '';
      const objects = payload.objects || {};
      const user = objects.user || {};
      const subscription = objects.subscription || {};
      const plan = objects.plan || {};
      const install = objects.install || {};
      const license = objects.license || {};

      console.log(`💳 Freemius Webhook Event: "${eventType}" | User: ${user.email || 'N/A'} | Plan: ${plan.name || plan.id || 'N/A'}`);

      if (!user.email) {
        return res.status(200).json({ status: 'ignored', reason: 'No user email in payload' });
      }

      // ── Comprehensive plan-name → role mapping (covers all 41 plans) ──
      const planName = plan.name || plan.title || plan.id || subscription.plan_id || 'unknown';
      const lower = (typeof planName === 'string' ? planName : String(planName)).toLowerCase();

      let computedRole = 'business'; // Default
      if (lower.includes('b2c') || lower.includes('patient') || lower.includes('care_wallet') || lower.includes('cw_')) {
        computedRole = 'user';
      } else if (lower.includes('provider') || lower.includes('prov_') || lower.includes('doctor') || lower.includes('telehealth')) {
        computedRole = 'provider';
      } else if (lower.includes('attorney') || lower.includes('legal') || lower.includes('att_')) {
        computedRole = 'attorney';
      } else if (lower.includes('public_health') || lower.includes('ph_') || lower.includes('lab')) {
        computedRole = 'public_health';
      } else if (lower.includes('enforcement') || lower.includes('enf_') || lower.includes('combo_')) {
        computedRole = 'regulator_state';
      } else if (lower.includes('state_authority') || lower.includes('state')) {
        computedRole = 'regulator_state';
      } else if (lower.includes('federal') || lower.includes('fed_')) {
        computedRole = 'regulator_federal';
      } else if (lower.includes('gov_office') || lower.includes('political') || lower.includes('policy')) {
        computedRole = 'political_executive';
      } else if (lower.includes('advocate') || lower.includes('advocacy') || lower.includes('research')) {
        computedRole = 'advocate';
      } else if (lower.includes('backoffice') || lower.includes('cannabis_basic') || lower.includes('cannabis_pro') || lower.includes('cannabis_enterprise') || lower.includes('non_cannabis')) {
        computedRole = 'business';
      } else if (lower.includes('b2b') || lower.includes('finance') || lower.includes('fin_')) {
        computedRole = 'business';
      }

      // Determine subscription tier from plan name
      let subscriptionTier = 'basic';
      if (lower.includes('enterprise') || lower.includes('full') || lower.includes('platinum') || lower.includes('command')) {
        subscriptionTier = 'enterprise';
      } else if (lower.includes('pro') || lower.includes('med') || lower.includes('gold') || lower.includes('intelligence') || lower.includes('silver')) {
        subscriptionTier = 'pro';
      }

      // ── Determine event category ──
      const isDeactivation = eventType.includes('cancelled') || eventType.includes('expired') || eventType.includes('deactivated');
      const isTrial = eventType.includes('trial') || (subscription.trial_days && subscription.trial_days > 0);
      const isPayment = eventType.includes('payment') || eventType.includes('charge');
      const newSubscriptionStatus = isDeactivation ? 'Cancelled' : isTrial ? 'Trial' : 'Active';
      const newUserStatus = isDeactivation ? 'Pending' : 'Active';

      // ── Update or create Firestore user ──
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const snap = await getDocs(q);

      let firebaseUserId = null;
      const updateData = {
        subscriptionStatus: newSubscriptionStatus,
        status: newUserStatus,
        planId: plan.id || planName,
        planName: planName,
        subscriptionTier,
        freemiusInstallId: install.id || subscription.install_id || null,
        freemiusLicenseKey: license.secret_key || null,
        freemiusUserId: user.id || null,
        trialDays: subscription.trial_days || 0,
        trialEndsAt: subscription.trial_ends || null,
        updatedAt: new Date().toISOString(),
      };

      if (!snap.empty) {
        const docSnap = snap.docs[0];
        firebaseUserId = docSnap.id;
        // Don't overwrite role if user already has one set — unless it's the default 'business'
        const existingData = docSnap.data();
        const shouldUpdateRole = !existingData.role || existingData.role === 'business' || existingData.role === 'pending';
        if (shouldUpdateRole) {
          updateData.role = computedRole;
        }
        await updateDoc(docSnap.ref, updateData);
        console.log(`   ✅ Updated Firestore user: ${user.email} → ${newSubscriptionStatus} (${subscriptionTier})`);
      } else {
        const newDoc = await addDoc(collection(db, 'users'), {
          email: user.email,
          role: computedRole,
          displayName: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Subscriber',
          createdAt: new Date().toISOString(),
          ...updateData,
        });
        firebaseUserId = newDoc.id;
        console.log(`   ✅ Created Firestore user: ${user.email} → ${computedRole} (${subscriptionTier})`);
      }

      // ── Log payment to Turso Financial Ledger ──
      const turso = getTursoClient();
      const amount = payload.amount || objects.charge?.amount || subscription.gross_revenue || 0;
      const formattedAmount = '$' + parseFloat(amount).toFixed(2);

      if (amount > 0 && !isDeactivation) {
        try {
          const payId = 'freemius-' + Date.now();
          const netProfit = (parseFloat(amount) * 0.93).toFixed(2); // Freemius takes ~7%
          await turso.execute({
            sql: "INSERT INTO founder_ledger (id, origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            args: [
              payId,
              `${user.first_name || ''} ${user.last_name || ''} (${user.email})`.trim(),
              `${planName} Subscription (Freemius)`,
              formattedAmount,
              '$' + netProfit,
              'Settled',
              'bg-emerald-600',
              new Date().toISOString()
            ]
          });
          console.log(`   💰 Ledger entry: ${formattedAmount} (Net: $${netProfit})`);
        } catch (ledgerErr) {
          console.error('   ⚠️ Ledger write failed:', ledgerErr.message);
        }
      }

      // ── Audit Log ──
      try {
        await turso.execute({
          sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
          args: [
            `freemius_${Date.now()}`,
            isDeactivation ? 'FREEMIUS_SUBSCRIPTION_DEACTIVATED' : isTrial ? 'FREEMIUS_TRIAL_STARTED' : 'FREEMIUS_SUBSCRIPTION_ACTIVE',
            user.email,
            JSON.stringify({
              event: eventType,
              userId: user.id,
              planName,
              planId: plan.id,
              subscriptionTier,
              computedRole,
              amount: formattedAmount,
              isDeactivation,
              isTrial,
              firebaseId: firebaseUserId,
              installId: install.id,
            })
          ]
        });
        console.log(`   📝 Audit log recorded`);
      } catch (auditErr) {
        console.error('   ⚠️ Audit log failed:', auditErr.message);
      }

      // ── Create Real-Time Notification in Firestore ──
      try {
        const notifTitle = isDeactivation
          ? `❌ Subscription Cancelled: ${user.first_name || user.email}`
          : isTrial
          ? `🆓 Free Trial Started: ${user.first_name || user.email}`
          : isPayment
          ? `💳 Payment Received: ${formattedAmount}`
          : `🎉 New Subscription: ${user.first_name || user.email}`;

        const notifMessage = isDeactivation
          ? `${planName} subscription cancelled for ${user.email}`
          : `${planName} (${subscriptionTier}) — ${user.email}`;

        await addDoc(collection(db, 'notifications'), {
          type: isDeactivation ? 'subscription_cancelled' : 'subscription_created',
          title: notifTitle,
          message: notifMessage,
          body: `Plan: ${planName} | Tier: ${subscriptionTier} | Role: ${computedRole}\nAmount: ${formattedAmount}`,
          email: user.email,
          read: false,
          createdAt: new Date().toISOString(),
          metadata: {
            freemiusEvent: eventType,
            planName,
            subscriptionTier,
            computedRole,
            firebaseUserId,
          }
        });
        console.log(`   🔔 Real-time notification created`);
      } catch (notifErr) {
        console.error('   ⚠️ Notification failed:', notifErr.message);
      }

      return res.status(200).json({
        status: 'success',
        event: eventType,
        email: user.email,
        role: computedRole,
        tier: subscriptionTier,
      });

    } catch (err) {
      console.error('❌ Freemius webhook execution failed:', err);
      return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }

  return res.status(400).json({ error: 'Invalid webhook type' });
}
