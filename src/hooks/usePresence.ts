/**
 * usePresence — Real-time user presence tracking via Firestore
 * 
 * Writes the authenticated user's online status to Firestore `presence/{uid}`.
 * Heartbeat every 60s keeps the presence doc fresh.
 * Decouples profile changes from session cleanup to prevent race conditions.
 */

import { useEffect, useRef } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const HEARTBEAT_MS = 60_000; // 1 min

export function usePresence(user: { uid?: string; email?: string; displayName?: string; role?: string } | null) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Profile updates: write details when user info is loaded/changed (no offline cleanup here to avoid races)
  useEffect(() => {
    if (!user?.uid || !db) return;

    const presenceRef = doc(db, 'presence', user.uid);
    setDoc(presenceRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email || '',
      role: user.role || '',
      status: 'online',
      lastSeen: serverTimestamp(),
    }, { merge: true }).catch(console.error);
  }, [user?.uid, user?.email, user?.displayName, user?.role]);

  // 2. Lifecycle updates: handle heartbeat, visibility changes, and offline status on actual unmount/logout
  useEffect(() => {
    if (!user?.uid || !db) return;

    const presenceRef = doc(db, 'presence', user.uid);

    const writeOnline = () => {
      setDoc(presenceRef, {
        status: 'online',
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(console.error);
    };

    const writeOffline = () => {
      setDoc(presenceRef, {
        status: 'offline',
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(() => {});
    };

    // Start heartbeat
    intervalRef.current = setInterval(writeOnline, HEARTBEAT_MS);

    // Tab close hook
    const handleUnload = () => {
      writeOffline();
    };
    window.addEventListener('beforeunload', handleUnload);

    // Visibility change hook
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setDoc(presenceRef, { status: 'away', lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
      } else {
        writeOnline();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
      
      // Write offline ONLY when logging out or if UID changes
      writeOffline();
    };
  }, [user?.uid]);
}
