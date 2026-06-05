import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
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
  app = initializeApp(firebaseConfig, 'sync-gcal-api');
} catch (e) {
  try {
    app = getApp('sync-gcal-api');
  } catch {
    app = initializeApp(firebaseConfig, 'sync-gcal-api-' + Date.now());
  }
}
const db = getFirestore(app);
const auth = getAuth(app);

// ─── Lightweight ICS Parser ───
function parseICS(icsText) {
  const events = [];
  const lines = icsText.replace(/\r\n /g, '').replace(/\r/g, '').split('\n');
  let current = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
    } else if (line === 'END:VEVENT' && current) {
      events.push(current);
      current = null;
    } else if (current) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const keyPart = line.substring(0, colonIdx);
      const value = line.substring(colonIdx + 1);
      const baseKey = keyPart.split(';')[0];

      switch (baseKey) {
        case 'SUMMARY': current.summary = value; break;
        case 'DTSTART': current.dtstart = value; break;
        case 'DTEND': current.dtend = value; break;
        case 'DESCRIPTION': current.description = (value || '').replace(/\\n/g, '\n').replace(/\\,/g, ','); break;
        case 'LOCATION': current.location = (value || '').replace(/\\,/g, ','); break;
        case 'UID': current.uid = value; break;
        case 'STATUS': current.status = value; break;
      }
    }
  }
  return events;
}

// Parse ICS datetime → JS Date (handles both 20260608T194000Z and 20260608T144000 with TZID)
function parseICSDate(dtStr) {
  if (!dtStr) return null;
  // Remove quotes and whitespace
  dtStr = dtStr.trim().replace(/"/g, '');
  
  // Format: 20260608T194000Z (UTC)
  const utcMatch = dtStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (utcMatch) {
    const [, y, m, d, h, min, s] = utcMatch;
    return new Date(Date.UTC(+y, +m - 1, +d, +h, +min, +s));
  }

  // Format: 20260608T144000 (local time, assume Central)
  const localMatch = dtStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/);
  if (localMatch) {
    const [, y, m, d, h, min, s] = localMatch;
    // Treat as Central Time (UTC-5 CDT / UTC-6 CST)
    // Create as local date and let toLocaleTimeString handle TZ
    return new Date(+y, +m - 1, +d, +h, +min, +s);
  }

  // Format: plain date 20260608
  const dateMatch = dtStr.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateMatch) {
    const [, y, m, d] = dateMatch;
    return new Date(+y, +m - 1, +d);
  }

  // Fallback
  return new Date(dtStr);
}

// Categorize Google Calendar events
function categorizeGCalEvent(summary) {
  const lower = (summary || '').toLowerCase();
  if (lower.includes('doctor') || lower.includes('recommendation') || lower.includes('telehealth') || lower.includes('medical')) {
    return { category: 'telehealth', color: 'bg-emerald-600' };
  }
  if (lower.includes('compliance') || lower.includes('audit') || lower.includes('inspection')) {
    return { category: 'compliance', color: 'bg-amber-500' };
  }
  if (lower.includes('meeting') || lower.includes('demo') || lower.includes('consult')) {
    return { category: 'executive', color: 'bg-purple-500' };
  }
  if (lower.includes('call') || lower.includes('phone')) {
    return { category: 'ops', color: 'bg-indigo-500' };
  }
  if (lower.includes('court') || lower.includes('legal') || lower.includes('hearing')) {
    return { category: 'federal', color: 'bg-red-500' };
  }
  // Default: operations event
  return { category: 'ops', color: 'bg-teal-600' };
}

// ─── Google Calendar API v3 fetch (requires API key + public calendar) ───
async function fetchViaAPI(calendarId, apiKey, timeMin, timeMax) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=250`;
  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Calendar API error (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return (data.items || []).map(item => ({
    uid: item.id,
    summary: item.summary || 'Untitled Event',
    dtstart: item.start?.dateTime || item.start?.date || '',
    dtend: item.end?.dateTime || item.end?.date || '',
    description: item.description || '',
    location: item.location || '',
    status: item.status || 'confirmed',
    _apiMode: true,
  }));
}

// ─── iCal feed fetch (works with public or private/secret iCal URL) ───
async function fetchViaICS(icsUrl) {
  const res = await fetch(icsUrl);
  if (!res.ok) {
    throw new Error(`ICS fetch failed (${res.status}): ${res.statusText}`);
  }
  const text = await res.text();
  return parseICS(text);
}

export default async function handler(req, res) {
  // Google Calendar accounts to sync
  const OPS_CALENDARS = [
    { id: 'asstsupport@gmail.com', label: 'Operations (asstsupport)' },
  ];
  const PERSONAL_CALENDARS = [
    { id: 'globalgreenhp@gmail.com', label: 'Personal (globalgreenhp)' },
  ];

  const GOOGLE_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY || '';
  const OPS_ICS_URL = process.env.GCAL_OPS_ICS_URL || '';
  const PERSONAL_ICS_URL = process.env.GCAL_PERSONAL_ICS_URL || '';

  // 1. Authenticate with Firebase
  try {
    await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  } catch (authErr) {
    console.error('❌ Firebase Authentication failed:', authErr.message);
    return res.status(500).json({ error: 'Firebase authentication failed.', details: authErr.message });
  }

  const now = new Date();
  const timeMin = new Date(now);
  timeMin.setMonth(timeMin.getMonth() - 1);
  const timeMax = new Date(now);
  timeMax.setMonth(timeMax.getMonth() + 3);

  let newCount = 0;
  let updatedCount = 0;
  let errors = [];

  // Build list of calendars to sync with their fetch methods
  const syncs = [];

  for (const cal of OPS_CALENDARS) {
    if (OPS_ICS_URL) {
      syncs.push({ ...cal, method: 'ics', url: OPS_ICS_URL });
    } else if (GOOGLE_API_KEY) {
      syncs.push({ ...cal, method: 'api', apiKey: GOOGLE_API_KEY });
    } else {
      // Try public iCal feed (works if calendar is set to public)
      syncs.push({ ...cal, method: 'ics', url: `https://calendar.google.com/calendar/ical/${encodeURIComponent(cal.id)}/public/basic.ics` });
    }
  }

  for (const cal of PERSONAL_CALENDARS) {
    if (PERSONAL_ICS_URL) {
      syncs.push({ ...cal, method: 'ics', url: PERSONAL_ICS_URL });
    } else if (GOOGLE_API_KEY) {
      syncs.push({ ...cal, method: 'api', apiKey: GOOGLE_API_KEY });
    } else {
      syncs.push({ ...cal, method: 'ics', url: `https://calendar.google.com/calendar/ical/${encodeURIComponent(cal.id)}/public/basic.ics` });
    }
  }

  for (const cal of syncs) {
    try {
      let rawEvents = [];

      if (cal.method === 'api') {
        rawEvents = await fetchViaAPI(cal.id, cal.apiKey, timeMin.toISOString(), timeMax.toISOString());
      } else {
        rawEvents = await fetchViaICS(cal.url);
      }

      console.log(`📆 Fetched ${rawEvents.length} events from ${cal.label} via ${cal.method}`);

      for (const ev of rawEvents) {
        try {
          let startDate, endDate;

          if (ev._apiMode) {
            // Google API returns ISO strings
            startDate = new Date(ev.dtstart);
            endDate = ev.dtend ? new Date(ev.dtend) : new Date(startDate.getTime() + 60 * 60 * 1000);
          } else {
            // ICS format
            startDate = parseICSDate(ev.dtstart);
            endDate = ev.dtend ? parseICSDate(ev.dtend) : null;
            if (!startDate || isNaN(startDate.getTime())) continue;
            if (!endDate || isNaN(endDate.getTime())) {
              endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
            }
          }

          // Skip events outside our window
          if (startDate < timeMin || startDate > timeMax) continue;

          // Skip all-day holidays and generic calendar events
          const isAllDay = !ev.dtstart.includes('T');
          const skipPatterns = ['holiday', 'daylight saving', 'new year', 'christmas', 'thanksgiving'];
          if (skipPatterns.some(p => (ev.summary || '').toLowerCase().includes(p))) continue;

          const dateStr = startDate.toISOString().split('T')[0];
          const startTimeStr = startDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' });
          const endTimeStr = endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/Chicago' });

          const { category, color } = categorizeGCalEvent(ev.summary);
          const isCanceled = (ev.status || '').toLowerCase() === 'cancelled';

          const title = `${isCanceled ? '❌ ' : '📆 '}${ev.summary}`;
          const gcalUid = `gcal_${cal.id}_${ev.uid || ev.summary}_${dateStr}`;

          const evPayload = {
            title,
            date: dateStr,
            startTime: isAllDay ? '09:00' : startTimeStr,
            endTime: isAllDay ? '17:00' : endTimeStr,
            category,
            color: isCanceled ? 'bg-slate-400' : color,
            description: [
              `📆 Google Calendar Event`,
              `📅 Calendar: ${cal.label}`,
              ev.description ? `📝 ${ev.description}` : '',
              ev.location ? `📍 Location: ${ev.location}` : '',
              isCanceled ? '⚠️ CANCELED' : '✅ CONFIRMED',
              `Source: Google Calendar (${cal.id})`,
            ].filter(Boolean).join('\n'),
            location: ev.location || '',
            source: 'google_calendar',
            gcal_uid: gcalUid,
            gcal_calendar: cal.id,
            assignedTo: 'Founder',
            assignedBy: 'Google Calendar Sync',
            updatedAt: new Date().toISOString(),
          };

          // Check if event already exists by gcal_uid
          const q1 = query(collection(db, 'calendar_events'), where('gcal_uid', '==', gcalUid));
          const snap1 = await getDocs(q1);

          if (snap1.empty) {
            // Check for duplicate by date + time + similar title
            const q2 = query(
              collection(db, 'calendar_events'),
              where('date', '==', dateStr),
              where('startTime', '==', isAllDay ? '09:00' : startTimeStr)
            );
            const snap2 = await getDocs(q2);
            let matchedDoc = null;
            for (const doc2 of snap2.docs) {
              const d2 = doc2.data();
              if (d2.title && d2.title.toLowerCase().includes((ev.summary || '').toLowerCase().substring(0, 10))) {
                matchedDoc = doc2;
                break;
              }
            }

            if (matchedDoc) {
              await updateDoc(matchedDoc.ref, evPayload);
              updatedCount++;
            } else {
              await addDoc(collection(db, 'calendar_events'), {
                ...evPayload,
                createdAt: new Date().toISOString(),
              });
              newCount++;
            }
          } else {
            // Update existing
            const existing = snap1.docs[0];
            const currentData = existing.data();
            if (currentData.title !== title || currentData.date !== dateStr || currentData.startTime !== evPayload.startTime) {
              await updateDoc(existing.ref, evPayload);
              updatedCount++;
            }
          }
        } catch (evErr) {
          console.error(`Error processing event "${ev.summary}":`, evErr.message);
        }
      }
    } catch (calErr) {
      console.error(`❌ Failed to sync ${cal.label}:`, calErr.message);
      errors.push({ calendar: cal.label, error: calErr.message });
    }
  }

  return res.status(200).json({
    status: 'success',
    message: `Google Calendar sync complete. Created ${newCount} new events, updated ${updatedCount} existing.`,
    newCount,
    updatedCount,
    errors: errors.length > 0 ? errors : undefined,
  });
}
