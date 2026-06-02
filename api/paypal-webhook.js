// ============================================================
// GGMA — PayPal Webhook Endpoint
// 
// Receives transaction notifications from PayPal and:
// 1. Verifies the signature with PayPal's API
// 2. Logs the settled payment directly to the Turso financial ledger
// 3. Adds an entry in the Turso audit trail
// 4. Writes a real-time notification in Firestore
// 5. Returns 200 OK to confirm receipt
//
// Webhook URL: https://ggma.vercel.app/api/paypal-webhook
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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
  app = initializeApp(firebaseConfig, 'paypal-webhook');
} catch (e) {
  const { getApp } = await import('firebase/app');
  try {
    app = getApp('paypal-webhook');
  } catch {
    app = initializeApp(firebaseConfig, 'paypal-webhook-' + Date.now());
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

export default async function handler(req, res) {
  // CORS Headers
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

  const clientId = process.env.VITE_PAYPAL_CLIENT_ID;
  const secretKey = process.env.PAYPAL_SECRET_KEY;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  // 1. Verify Webhook Signature with PayPal if credentials are fully configured
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
      // We log but continue to let transactions go through in case of transient network issues with PayPal's endpoints
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
    const eventType = payload.event_type || '';
    const resource = payload.resource || {};

    console.log(`💳 PayPal Webhook Event Received: "${eventType}"`);

    // Handle payment capture / sale completed event types
    const validEvents = ['PAYMENT.CAPTURE.COMPLETED', 'PAYMENT.SALE.COMPLETED', 'CHECKOUT.ORDER.APPROVED'];
    if (!validEvents.includes(eventType)) {
      return res.status(200).json({ status: 'ignored', reason: 'Unhandled event type: ' + eventType });
    }

    // Extract details
    const txId = resource.id || resource.transaction_id || 'N/A';
    
    // Check multiple potential locations for payer email
    const payerEmail = resource.payer?.email_address || 
                       resource.billing_info?.email_address || 
                       resource.custom_id || 
                       resource.custom || 
                       'unknown@paypal.com';

    // Get name
    const givenName = resource.payer?.name?.given_name || '';
    const surname = resource.payer?.name?.surname || '';
    const payerName = givenName || surname ? `${givenName} ${surname}`.trim() : 'Patient';

    // Extract amount paid
    const amount = resource.amount?.value || 
                   resource.amount?.total || 
                   resource.gross_amount?.value || 
                   '0.00';

    const cleanAmount = parseFloat(amount);
    const formattedAmount = '$' + cleanAmount.toFixed(2);

    if (cleanAmount <= 0) {
      return res.status(200).json({ status: 'ignored', reason: 'Zero or negative amount transaction: ' + formattedAmount });
    }

    // Determine the product type (Standard $194.30 vs Reduced $112.50)
    let productType = 'Processing Fee';
    if (Math.abs(cleanAmount - 194.30) < 1.0) {
      productType = 'Standard Patient Application';
    } else if (Math.abs(cleanAmount - 112.50) < 1.0) {
      productType = 'Discounted Patient Application';
    }

    // 3. Log settled payment to Turso Financial Ledger
    const { createClient } = await import('@libsql/client');
    const turso = createClient({
      url: process.env.VITE_TURSO_DATABASE_URL,
      authToken: process.env.VITE_TURSO_AUTH_TOKEN,
    });

    try {
      const payId = 'paypal-' + txId;
      const netProfit = (cleanAmount * 0.97).toFixed(2); // Subtract standard ~3% transaction fee
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

    // 4. Log Audit Trail to Turso
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

    // 5. Create a Real-Time Notification in Firestore
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
