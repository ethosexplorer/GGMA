/**
 * ADMIN AUTH API — Backend password management via Firebase Admin SDK
 * 
 * Routes:
 *   POST /api/admin-auth?action=changePassword  — Change user password by email
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin init — same pattern as marketing.js
let adminApp;
function ensureAdmin() {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0];
    return adminApp;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
  if (!raw || raw === '{}') {
    throw new Error('FIREBASE_SERVICE_ACCOUNT env var is not set. Please add it in Vercel → Settings → Environment Variables.');
  }
  const sa = JSON.parse(raw);
  if (!sa.project_id) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is missing project_id. Please re-paste the full service account JSON in Vercel.');
  }
  adminApp = initializeApp({ credential: cert(sa) });
  return adminApp;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const action = req.query.action || '';

  if (action === 'changePassword') {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and newPassword are required.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      ensureAdmin();
      const adminAuth = getAuth();

      // Look up user by email
      const userRecord = await adminAuth.getUserByEmail(email);

      // Update the password
      await adminAuth.updateUser(userRecord.uid, { password: newPassword });

      console.log(`[Admin Auth] Password changed for ${email} (uid: ${userRecord.uid})`);
      return res.json({ success: true, message: `Password updated for ${email}` });
    } catch (err) {
      console.error('[Admin Auth] changePassword error:', err);
      if (err.code === 'auth/user-not-found') {
        return res.status(404).json({ error: 'No Firebase Auth account found with this email. User may need to sign up first.' });
      }
      return res.status(500).json({ error: err.message || 'Failed to change password' });
    }
  }

  if (action === 'updateProfile') {
    try {
      const { email, fields } = req.body;
      if (!email || !fields || typeof fields !== 'object') {
        return res.status(400).json({ error: 'Email and fields object are required.' });
      }

      ensureAdmin();
      const adminAuth = getAuth();
      const db = getFirestore();

      // Look up user by email
      const userRecord = await adminAuth.getUserByEmail(email);
      
      // Update Firestore users doc
      await db.collection('users').doc(userRecord.uid).update(fields);

      console.log(`[Admin Auth] Profile updated for ${email} (uid: ${userRecord.uid}):`, Object.keys(fields));
      return res.json({ success: true, message: `Profile updated for ${email}`, updatedFields: Object.keys(fields) });
    } catch (err) {
      console.error('[Admin Auth] updateProfile error:', err);
      if (err.code === 'auth/user-not-found') {
        return res.status(404).json({ error: 'No Firebase Auth account found with this email.' });
      }
      return res.status(500).json({ error: err.message || 'Failed to update profile' });
    }
  }

  return res.status(400).json({ error: 'Invalid action', validActions: ['changePassword', 'updateProfile'] });
}
