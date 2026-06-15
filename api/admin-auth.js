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
      const db = getFirestore();

      let userRecord;
      let wasCreated = false;

      try {
        // Try to find existing user
        userRecord = await adminAuth.getUserByEmail(email);
        // Update existing user's password
        await adminAuth.updateUser(userRecord.uid, { password: newPassword });
      } catch (lookupErr) {
        if (lookupErr.code === 'auth/user-not-found') {
          // AUTO-CREATE: No auth account exists — create one now
          console.log(`[Admin Auth] No auth account for ${email} — auto-creating...`);
          userRecord = await adminAuth.createUser({
            email,
            password: newPassword,
            displayName: email.split('@')[0],
          });
          wasCreated = true;

          // Enrich profile from CRM data
          const crmSnap = await db.collection('crm_deals').where('email', '==', email).limit(1).get();
          let profileData = {
            uid: userRecord.uid,
            email,
            displayName: email.split('@')[0],
            role: 'user',
            status: 'Active',
            createdAt: new Date().toISOString(),
          };

          if (!crmSnap.empty) {
            const crm = crmSnap.docs[0].data();
            const crmName = crm.name || (crm.firstName && crm.lastName ? `${crm.firstName} ${crm.lastName}` : '');
            profileData = {
              ...profileData,
              displayName: crmName || profileData.displayName,
              firstName: crm.firstName || (crm.name || '').split(' ')[0] || '',
              lastName: crm.lastName || (crm.name || '').split(' ').slice(1).join(' ') || '',
              phone: crm.phone || crm.textPhone || '',
              state: crm.state || crm.jurisdiction || '',
              address: crm.address || crm.physicalAddress || '',
              city: crm.city || '',
              contactType: crm.contactType || 'patient',
              applicationSubmittedAt: crm.createdAt || crm.dateAdded || new Date().toISOString(),
            };
          }

          await db.collection('users').doc(userRecord.uid).set(profileData);
          console.log(`[Admin Auth] Created account + profile for ${email} (uid: ${userRecord.uid})`);
        } else {
          throw lookupErr;
        }
      }

      const msg = wasCreated
        ? `Account created & password set for ${email}`
        : `Password updated for ${email}`;
      console.log(`[Admin Auth] ${msg} (uid: ${userRecord.uid})`);
      return res.json({ success: true, message: msg, created: wasCreated });
    } catch (err) {
      console.error('[Admin Auth] changePassword error:', err);
      return res.status(500).json({ error: err.message || 'Failed to set password' });
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

  if (action === 'createUser') {
    try {
      const { email, password, displayName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      ensureAdmin();
      const adminAuth = getAuth();
      const db = getFirestore();

      // Create Firebase Auth account
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: displayName || email.split('@')[0],
      });

      // Create Firestore users doc with CRM data if available
      const crmSnap = await db.collection('crm_deals').where('email', '==', email).limit(1).get();
      let profileData = {
        uid: userRecord.uid,
        email,
        displayName: displayName || email.split('@')[0],
        role: 'user',
        status: 'Active',
        createdAt: new Date().toISOString(),
      };

      if (!crmSnap.empty) {
        const crm = crmSnap.docs[0].data();
        const crmName = crm.name || (crm.firstName && crm.lastName ? `${crm.firstName} ${crm.lastName}` : '');
        profileData = {
          ...profileData,
          displayName: crmName || profileData.displayName,
          firstName: crm.firstName || (crm.name || '').split(' ')[0] || '',
          lastName: crm.lastName || (crm.name || '').split(' ').slice(1).join(' ') || '',
          phone: crm.phone || crm.textPhone || '',
          state: crm.state || crm.jurisdiction || '',
          address: crm.address || crm.physicalAddress || '',
          city: crm.city || '',
          contactType: crm.contactType || 'patient',
          applicationSubmittedAt: crm.createdAt || crm.dateAdded || new Date().toISOString(),
        };
      }

      await db.collection('users').doc(userRecord.uid).set(profileData);

      console.log(`[Admin Auth] Created user ${email} (uid: ${userRecord.uid})`);
      return res.json({ success: true, message: `Account created for ${email}`, uid: userRecord.uid });
    } catch (err) {
      console.error('[Admin Auth] createUser error:', err);
      if (err.code === 'auth/email-already-exists') {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      return res.status(500).json({ error: err.message || 'Failed to create user' });
    }
  }

  return res.status(400).json({ error: 'Invalid action', validActions: ['changePassword', 'updateProfile', 'createUser'] });
}
