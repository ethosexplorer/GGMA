/**
 * ADMIN AUTH API — Backend password management via Firebase Admin SDK
 * 
 * Routes:
 *   POST /api/admin-auth?action=changePassword  — Change user password by email
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin init
function getAdminAuth() {
  if (!getApps().length) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    initializeApp({ credential: cert(sa) });
  }
  return getAuth();
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

      const adminAuth = getAdminAuth();

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

  return res.status(400).json({ error: 'Invalid action', validActions: ['changePassword'] });
}
