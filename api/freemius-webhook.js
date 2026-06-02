// ============================================================
// GGMA — Freemius Webhook Endpoint
// 
// Receives subscription notifications from Freemius and:
// 1. Updates the user's subscription status in Firestore
// 2. Logs the payment to the Turso financial ledger
// 3. Appends an audit log entry in Turso
// 4. Returns 200 OK to confirm receipt
//
// Webhook URL: https://ggma.vercel.app/api/freemius-webhook
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
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
  app = initializeApp(firebaseConfig, 'freemius-webhook');
} catch (e) {
  const { getApp } = await import('firebase/app');
  try {
    app = getApp('freemius-webhook');
  } catch {
    app = initializeApp(firebaseConfig, 'freemius-webhook-' + Date.now());
  }
}
const db = getFirestore(app);
const auth = getAuth(app);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authenticate webhook origin if secret is set
  const signature = req.headers['x-signature'] || req.headers['http_x_signature'];
  const secretKey = process.env.FREEMIUS_SECRET_KEY;

  if (secretKey && signature) {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
    
    if (signature !== expectedSignature) {
      console.warn('⚠️ Freemius signature verification failed');
      // We log but still process in sandbox mode or if not strictly enforced, 
      // but let's return 401 for production integrity
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
  }

  // 2. Authenticate Firebase Client SDK
  try {
    await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  } catch (authErr) {
    console.error('❌ Firebase Webhook Authentication failed:', authErr.message);
  }

  try {
    const payload = req.body;
    const eventType = payload.event || payload.type || '';
    const objects = payload.objects || {};
    const user = objects.user || {};
    const subscription = objects.subscription || {};
    const plan = objects.plan || {};
    const plugin = objects.plugin || {};

    console.log(`💳 Freemius Webhook Event Received: "${eventType}" for user: ${user.email || 'N/A'}`);

    if (!user.email) {
      return res.status(200).json({ status: 'ignored', reason: 'No user email in payload' });
    }

    // Determine the user's role from plan metadata or category
    const planName = plan.name || plan.id || subscription.plan_id || 'Standard Plan';
    const lowerPlan = planName.toLowerCase();
    let computedRole = 'business'; // Default to B2B business
    if (lowerPlan.includes('patient') || lowerPlan.includes('b2c')) {
      computedRole = 'user';
    } else if (lowerPlan.includes('provider') || lowerPlan.includes('doctor')) {
      computedRole = 'provider';
    } else if (lowerPlan.includes('attorney') || lowerPlan.includes('legal')) {
      computedRole = 'attorney';
    } else if (lowerPlan.includes('compliance') || lowerPlan.includes('regulator')) {
      computedRole = 'regulator_state';
    }

    // 3. Update or Create User subscription details in Firestore
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', user.email));
    const snap = await getDocs(q);

    let firebaseUserId = null;
    const isDeactivation = eventType.includes('cancelled') || eventType.includes('expired') || eventType.includes('deactivated');
    const newSubscriptionStatus = isDeactivation ? 'Cancelled' : 'Active';
    const newUserStatus = isDeactivation ? 'Pending' : 'Active';

    if (!snap.empty) {
      const docSnap = snap.docs[0];
      firebaseUserId = docSnap.id;
      await updateDoc(docSnap.ref, {
        subscriptionStatus: newSubscriptionStatus,
        status: newUserStatus,
        planId: plan.id || planName,
        trialDays: subscription.trial_days || 0,
        updatedAt: new Date().toISOString()
      });
      console.log(`   ✅ Updated existing Firestore user: ${user.email} (Status: ${newSubscriptionStatus})`);
    } else {
      // Create user placeholder record in Firestore
      const newDoc = await addDoc(collection(db, 'users'), {
        email: user.email,
        role: computedRole,
        status: newUserStatus,
        subscriptionStatus: newSubscriptionStatus,
        planId: plan.id || planName,
        trialDays: subscription.trial_days || 0,
        displayName: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Subscriber',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      firebaseUserId = newDoc.id;
      console.log(`   ✅ Created placeholder Firestore user: ${user.email} (Status: ${newSubscriptionStatus})`);
    }

    // 4. Record to Turso Financial Ledger if there is a payment
    const { createClient } = await import('@libsql/client');
    const turso = createClient({
      url: process.env.VITE_TURSO_DATABASE_URL,
      authToken: process.env.VITE_TURSO_AUTH_TOKEN,
    });

    const amount = payload.amount || objects.charge?.amount || subscription.gross_revenue || 0;
    const formattedAmount = '$' + parseFloat(amount).toFixed(2);

    if (amount > 0 && !isDeactivation) {
      try {
        const payId = 'freemius-' + Date.now();
        await turso.execute({
          sql: "INSERT INTO founder_ledger (id, origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          args: [
            payId,
            `${user.email} — GGP-OS Subscription`,
            `Subscription (Freemius)`,
            formattedAmount,
            formattedAmount,
            'Settled',
            'bg-emerald-600',
            new Date().toISOString()
          ]
        });
        console.log(`   📝 Logged payment to Turso Financial Ledger: ${formattedAmount}`);
      } catch (ledgerErr) {
        console.error('   ⚠️ Failed to log payment to ledger:', ledgerErr.message);
      }
    }

    // 5. Audit Log in Turso
    try {
      await turso.execute({
        sql: `INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)`,
        args: [
          `freemius_${Date.now()}`,
          isDeactivation ? 'FREEMIUS_SUBSCRIPTION_DEACTIVATED' : 'FREEMIUS_SUBSCRIPTION_ACTIVE',
          user.email,
          JSON.stringify({
            event: eventType,
            userId: user.id,
            planName,
            amount: formattedAmount,
            isDeactivation,
            firebaseId: firebaseUserId
          })
        ]
      });
      console.log(`   📝 Turso audit log created`);
    } catch (auditErr) {
      console.error('   ⚠️ Failed to log audit trail:', auditErr.message);
    }

    return res.status(200).json({ status: 'success', event: eventType, email: user.email });

  } catch (err) {
    console.error('❌ Freemius webhook execution failed:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
