/**
 * usePresence — Real-time user presence tracking via Firestore
 * 
 * Writes the authenticated user's online status to Firestore `presence/{uid}`.
 * On page close / tab close, marks the user as offline via beforeunload.
 * Heartbeat every 60s keeps the presence doc fresh so stale sessions
 * can be detected (offline if lastSeen > 2 min ago).
 */

import { useEffect, useRef } from 'react';
import { doc, setDoc, serverTimestamp, deleteField } from 'firebase/firestore';
import { db } from '../lib/firebase';

const HEARTBEAT_MS = 60_000; // 1 min

export function usePresence(user: { uid?: string; email?: string; displayName?: string; role?: string } | null) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user?.uid || !db) return;

    const presenceRef = doc(db, 'presence', user.uid);

    const writeOnline = () => {
      setDoc(presenceRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email || '',
        role: user.role || '',
        status: 'online',
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(console.error);
    };

    const writeOffline = () => {
      // Use a non-async fetch-based write for beforeunload reliability
      // But for Firestore, we use the SDK (best-effort)
      setDoc(presenceRef, {
        status: 'offline',
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(() => {});
    };

    // Go online immediately
    writeOnline();

    // Heartbeat
    intervalRef.current = setInterval(writeOnline, HEARTBEAT_MS);

    // Mark offline when tab closes
    window.addEventListener('beforeunload', writeOffline);

    // Visibility change — mark away/online
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setDoc(presenceRef, { status: 'away', lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
      } else {
        writeOnline();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      writeOffline();
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('beforeunload', writeOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user?.uid, user?.email, user?.displayName, user?.role]);
}
