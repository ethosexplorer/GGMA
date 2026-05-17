import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Video, MapPin, Users, Calendar as CalIcon, Trash2, CheckSquare, Bell, Search, Send } from 'lucide-react';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

type ViewMode = 'month' | 'week' | 'day';
interface CalEvent {
  id: string; title: string; date: string; startTime: string; endTime: string;
  category: string; color: string; description?: string; attendees?: string;
  location?: string; meetLink?: string;
}

const ALL_CATEGORIES = [
  { id: 'executive', label: 'Executive', color: 'bg-purple-500' },
  { id: 'compliance', label: 'Compliance', color: 'bg-amber-500' },
  { id: 'telehealth', label: 'Telehealth', color: 'bg-emerald-500' },
  { id: 'federal', label: 'Federal', color: 'bg-red-500' },
  { id: 'state', label: 'State Authority', color: 'bg-cyan-500' },
  { id: 'ops', label: 'Operations', color: 'bg-indigo-500' },
  { id: 'admin_support', label: 'Admin Support', color: 'bg-pink-500' },
  { id: 'personal', label: 'Personal', color: 'bg-slate-500' },
  { id: 'task', label: 'Task', color: 'bg-blue-500' },
  { id: 'reminder', label: 'Reminder', color: 'bg-orange-500' },
];

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6AM-9PM

const SEED_EVENTS: CalEvent[] = [];

const CLINIC_HOOK = `Subject: Double your patient intake without hiring more staff.\n\nHi [Name],\nMost cannabis clinics in [State] are wasting 10+ hours a week on manual patient verifications, filing out state registry forms, and chasing down payments.\n\nGGP-OS is the operating system built specifically to automate your clinic.\n• Automated SMS Reminders: Patients get texted a link to their forms.\n• State Registry Integration: Automatically match conditions to your state's active requirements.\n• Integrated Billing: Collect consultation fees before the patient even hits your Telehealth waiting room.\n\nWe are onboarding our final batch of beta partners in [State]. Try GGP-OS free for 30 Days. If it doesn't save you time and increase your pipeline, walk away.\n\n[Start Your Free Trial Now] | [Book a 10-Min Demo]`;
const DISPENSARY_HOOK = `Subject: Are you miscalculating state cannabis tax exemptions?\n\nHi [Name],\nDepending on your state, miscalculating a medical patient's tax exemption at checkout can result in severe state penalties—or worse, a loss of your business license.\n\nGGP-OS takes the risk out of compliance. Our platform connects directly with state resources to ensure that every patient walking through your door is instantly verified for medical status, ensuring exact compliance with local tax code.\n\n• Instant Verification: Don't guess if an out-of-state card is valid. We track state reciprocity laws in real-time.\n• Pipeline CRM: See exactly who your highest-value patients are.\n• Compliance Built-In: From METRC reporting to local authority requirements.\n\nWe are helping dispensaries like yours automate compliance. Start a 30-Day Free Trial today and let our team handle your custom state configuration.\n\n[Claim Your Free Trial]`;
const ATTORNEY_HOOK = `Subject: Manage your clients' cannabis licensing & compliance from one dashboard.\n\nHi [Name],\nAs an attorney navigating the complex regulations of [State]'s cannabis program, managing permit renewals and METRC compliance for multiple clients is a massive administrative burden.\n\nGGP-OS gives your firm a centralized Command Center.\nMonitor your clients' regulatory standing, track changes in state and federal law, and automate document collection for licensing renewals all in one place.\n\nLet's schedule a 10-minute walk-through to show you how law firms are using GGP-OS to manage their cannabis portfolios.\n\n[Book a Walk-Through]`;

const THIRTY_DAY_TASKS: CalEvent[] = [
  { id: 'marketing-1', title: 'Email Blast: Clinics (OK, OH, PA)', date: '2026-05-18', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: CLINIC_HOOK },
  { id: 'marketing-2', title: 'Email Blast: Dispensaries (All)', date: '2026-05-19', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: DISPENSARY_HOOK },
  { id: 'marketing-3', title: 'Email Blast: Attorneys (CA, WA, IL)', date: '2026-05-20', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: ATTORNEY_HOOK },
  { id: 'marketing-4', title: 'Monitor Initial 30-Day Signups (All)', date: '2026-05-21', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Track early conversions and identify which state segment is reacting best.' },
  { id: 'marketing-5', title: 'Follow-up: Unopened Emails Sweep', date: '2026-05-22', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Resend hooks to contacts who did not open the first email.' },
  { id: 'marketing-6', title: 'Strategy Sync: Analyze First Week', date: '2026-05-23', startTime: '10:00', endTime: '11:00', category: 'executive', color: 'bg-purple-500', description: 'Why: Executive review of which hooks generated the most trial signups.' },
  { id: 'marketing-7', title: 'Prep Video Demos', date: '2026-05-24', startTime: '13:00', endTime: '15:00', category: 'task', color: 'bg-blue-500', description: 'Why: Record personalized 2-minute Looms for VIP targets.' },
  { id: 'marketing-8', title: 'Video Demo: Med-Only (WV, VA, UT, OH)', date: '2026-05-25', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Visual proof of automated compliance for non-clickers.' },
  { id: 'marketing-9', title: 'Video Demo: Dual-Use (VT, WA, CA)', date: '2026-05-26', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Visual proof of automated tax logic for non-clickers.' },
  { id: 'marketing-10', title: 'Video Demo: Clinics (OK, OH, PA)', date: '2026-05-27', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Show the SMS intake workflow to non-clickers.' },
  { id: 'marketing-11', title: 'Video Demo: Attorneys (CA, WA, IL)', date: '2026-05-28', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Show the multi-client dashboard to non-clickers.' },
  { id: 'marketing-12', title: 'Follow Up: Active Free Trials', date: '2026-05-29', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: White-glove onboarding secures long-term retention.' },
  { id: 'marketing-13', title: 'Prepare VIP Telephony List', date: '2026-05-30', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Focus high-touch sales effort on the top 50 highest revenue potential leads.' },
  { id: 'marketing-14', title: 'Call VIP Med-Only (WV, VA, UT, OH)', date: '2026-06-01', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Discuss the immediate financial risk of state fines and audits.' },
  { id: 'marketing-15', title: 'Call VIP Dual-Use (VT, WA, CA)', date: '2026-06-02', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Discuss lost revenue from miscalculated tax exemptions.' },
  { id: 'marketing-16', title: 'Call VIP Clinics (OK, OH, PA)', date: '2026-06-03', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Discuss increasing daily patient throughput without hiring more staff.' },
  { id: 'marketing-17', title: 'Call VIP Attorneys (CA, WA, IL)', date: '2026-06-04', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: "Why: Discuss scaling their firm's client capacity." },
  { id: 'marketing-18', title: 'Live Walk-through Demos (Block A)', date: '2026-06-05', startTime: '09:00', endTime: '11:00', category: 'task', color: 'bg-blue-500', description: "Why: Close the interested leads gathered from the week's calls." },
  { id: 'marketing-19', title: 'Live Walk-through Demos (Block B)', date: '2026-06-06', startTime: '09:00', endTime: '11:00', category: 'task', color: 'bg-blue-500', description: "Why: Close the interested leads gathered from the week's calls." },
  { id: 'marketing-20', title: 'Week 2 Trial Check-in', date: '2026-06-07', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Verify successful first usage of platform to prevent churn.' },
  { id: 'marketing-21', title: 'Review CRM Conversion Metrics', date: '2026-06-08', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Determine which state segment performed best to focus FOMO efforts.' },
  { id: 'marketing-22', title: 'Draft FOMO "Beta Pricing" Copy', date: '2026-06-09', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Create urgency before standard pricing starts.' },
  { id: 'marketing-23', title: 'FOMO Blast to Dispensaries (All)', date: '2026-06-10', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Push fence-sitters to act before prices rise.' },
  { id: 'marketing-24', title: 'FOMO Blast to Clinics (All)', date: '2026-06-11', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Push fence-sitters to act before prices rise.' },
  { id: 'marketing-25', title: 'FOMO Blast to Attorneys (All)', date: '2026-06-12', startTime: '08:00', endTime: '09:00', category: 'task', color: 'bg-blue-500', description: 'Why: Push fence-sitters to act before prices rise.' },
  { id: 'marketing-26', title: 'Call High-Intent FOMO Clickers', date: '2026-06-13', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: "Why: Secure leads who clicked but didn't buy." },
  { id: 'marketing-27', title: 'Final Telephony Sweep', date: '2026-06-14', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Last-minute follow ups before trial expirations.' },
  { id: 'marketing-28', title: 'Convert Trials to Paid', date: '2026-06-15', startTime: '08:00', endTime: '10:00', category: 'task', color: 'bg-blue-500', description: 'Why: Lock in recurring revenue and charge setup fees.' },
];

// Mock events removed to ensure strictly real-time operation

const fmt = (d: Date) => d.toISOString().split('T')[0];
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const FounderCalendar = ({ user, title, subtitle }: { user?: any, title?: string, subtitle?: string }) => {
  const availableCategories = ALL_CATEGORIES;

  const initialEvents = SEED_EVENTS;

  const defaultPersonalId = user?.uid || user?.role || 'default';
  const storageKey = `gghp_calendar_v2_${defaultPersonalId}`;

  const [events, setEvents] = useState<CalEvent[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  React.useEffect(() => {
    let unsubscribeUsers: () => void;
    let unsubscribeEvents: () => void;
    
    const isExecutive = ['executive_founder', 'president', 'chief_compliance_director', 'advisor'].includes(user?.role);
    
    const loadEvents = () => {
      let localEvents: CalEvent[] = [];
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          localEvents = JSON.parse(saved);
          // Hard-purge ALL mock events out of their local storage so they disappear immediately
          const mockIds = Array.from({length: 45}, (_, i) => String(i+1));
          localEvents = localEvents.filter((e: CalEvent) => !mockIds.includes(e.id));
        } else {
          localEvents = initialEvents;
        }
      } catch (e) {
        localEvents = [];
      }

      // Do not inject to localEvents here anymore, since we will push to Firebase directly!
      setEvents(localEvents);

      // REAL-TIME LISTENER FOR FIREBASE ASSIGNED EVENTS
      const q = query(collection(db, 'calendar_events'));
      unsubscribeEvents = onSnapshot(q, (snap) => {
        setEvents(current => {
          // Keep all local events (non-Firebase)
          let updated = current.filter(e => !e.id.startsWith('fb_'));
          
          // Add/update all Firebase events
          snap.docs.forEach(doc => {
            const data = doc.data();
            // Show if assigned to me, created by me, or assigned by Founder
            if (data.assignedTo === user?.uid || data.assignedBy === user?.uid || data.assignedTo === defaultPersonalId || data.assignedBy === defaultPersonalId || data.assignedBy === 'Founder') {
              const evId = `fb_${doc.id}`;
              // Remove any local duplicate that matches this Firebase event (by title+date)
              updated = updated.filter(e => !(e.title === data.title && e.date === data.date && e.id.startsWith('local_')));
              const newEv = {
                id: evId,
                title: data.title,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                category: data.category || 'task',
                color: data.color || 'bg-blue-500',
                description: data.description,
                attendees: data.attendees,
                location: data.location,
                meetLink: data.meetLink
              };
              updated.push(newEv);
            }
          });
          
          // Firebase Injection Logic - Pushes THIRTY_DAY_TASKS if they don't exist
          if (isExecutive && snap.docs.length >= 0) {
            const hasMarketingEvents = snap.docs.some(d => d.id.startsWith('marketing-') || d.data().title?.includes('Email Blast') || d.data().title?.includes('Video Demo'));
            const alreadyInjected = sessionStorage.getItem('hasInjectedTasks') === 'true';
            
            if (!hasMarketingEvents && !alreadyInjected) {
              sessionStorage.setItem('hasInjectedTasks', 'true');
              console.log("No 30-Day marketing tasks found in Firebase. Injecting to Firestore for real-time sync...");
              // We execute async injection
              THIRTY_DAY_TASKS.forEach(task => {
                addDoc(collection(db, 'calendar_events'), {
                  title: task.title,
                  date: task.date,
                  startTime: task.startTime,
                  endTime: task.endTime,
                  category: task.category,
                  color: task.color,
                  description: task.description,
                  assignedTo: user?.uid || 'Founder',
                  assignedBy: 'Founder', // Make it visible to all executives!
                  createdAt: serverTimestamp()
                }).catch(console.error);
              });
            }

            // Inject the new API integration tasks
            const hasIntegrationTasks = snap.docs.some(d => d.data().title?.includes('Contact Metrc to confirm API approval'));
            if (!hasIntegrationTasks) {
              console.log("Injecting API integration tasks to Firestore...");
              [
                { title: 'Contact Metrc to confirm API approval for all listed states', date: '2026-05-18', startTime: '09:00', endTime: '10:00', category: 'executive', color: 'bg-purple-500', description: 'Currently login only shows Oklahoma. Need to confirm approval for the other states.' },
                { title: 'Contact BioTrack, MJ Freeway, and Leaf Data for API integration info', date: '2026-05-19', startTime: '09:00', endTime: '10:00', category: 'executive', color: 'bg-purple-500', description: 'Produce the others info so we can integrate. Contact them to start the process.' }
              ].forEach(task => {
                addDoc(collection(db, 'calendar_events'), {
                  ...task,
                  assignedTo: user?.uid || 'Founder',
                  assignedBy: 'Founder',
                  createdAt: serverTimestamp()
                }).catch(console.error);
              });
            }
          }
          
          return updated;
        });
      });

      // 2. REAL-TIME LISTENER FOR SIGNUPS ON THE FOUNDER'S CALENDAR UNDER 'EXECUTIVE'
      unsubscribeUsers = onSnapshot(collection(db, 'users'), (usersSnap) => {
        const usersList: any[] = [];
        setEvents(currentEvents => {
          const updatedEvents = [...currentEvents];
          let changed = false;
          
          usersSnap.forEach(doc => {
            const data = doc.data();
            usersList.push({ id: doc.id, ...data });
            
            if (data.createdAt && isExecutive) {
              const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              const dateStr = dateObj.toISOString().split('T')[0];
              const displayName = data.displayName || data.companyName || data.email || 'New User';
              
              const eventId = `signup_${doc.id}`;
              if (!updatedEvents.some(e => e.id === eventId)) {
                updatedEvents.push({
                  id: eventId,
                  title: `New Signup: ${displayName}`,
                  date: dateStr,
                  startTime: '08:00',
                  endTime: '09:00',
                  category: 'executive',
                  color: 'bg-emerald-500',
                  description: `Role: ${data.role || 'user'}. Contact: ${data.email}. Review for escalation and marketing subscription options.`,
                });
                changed = true;
              }
            }
          });

          setAllUsers(usersList);

          if (changed) {
            localStorage.setItem(storageKey, JSON.stringify(updatedEvents.filter(e => !e.id.startsWith('fb_'))));
            return updatedEvents;
          }
          return currentEvents;
        });
      }, (error) => {
        console.error("Error with real-time users sync for calendar:", error);
      });
    };

    loadEvents();
    
    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeEvents) unsubscribeEvents();
    };
  }, [storageKey, defaultPersonalId]);

  const [view, setView] = useState<ViewMode>('month');
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(fmt(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [form, setForm] = useState({ title: '', date: '', startTime: '09:00', endTime: '10:00', category: 'executive', description: '', attendees: '', location: '', meetLink: '' });
  const [assignForm, setAssignForm] = useState({ title: '', date: '', startTime: '09:00', endTime: '10:00', category: 'task', description: '', meetLink: '', targetUserId: '' });
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  const filtered = filterCat ? events.filter(e => e.category === filterCat) : events;
  const eventsOn = (d: string) => filtered.filter(e => e.date === d);

  const navigate = (dir: number) => {
    const d = new Date(current);
    if (view === 'month') d.setMonth(d.getMonth() + dir);
    else if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrent(d);
  };

  const goToday = () => { setCurrent(new Date()); setSelectedDate(fmt(new Date())); };

  const monthDays = useMemo(() => {
    const y = current.getFullYear(), m = current.getMonth();
    const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
    const days: { date: Date; inMonth: boolean }[] = [];
    for (let i = first.getDay() - 1; i >= 0; i--) days.push({ date: new Date(y, m, -i), inMonth: false });
    for (let i = 1; i <= last.getDate(); i++) days.push({ date: new Date(y, m, i), inMonth: true });
    const rem = 42 - days.length;
    for (let i = 1; i <= rem; i++) days.push({ date: new Date(y, m + 1, i), inMonth: false });
    return days;
  }, [current]);

  const weekDays = useMemo(() => {
    const d = new Date(current);
    d.setDate(d.getDate() - d.getDay());
    return Array.from({ length: 7 }, (_, i) => { const dd = new Date(d); dd.setDate(d.getDate() + i); return dd; });
  }, [current]);

  const addEvent = async () => {
    if (!form.title || !form.date) return;
    const cat = availableCategories.find(c => c.id === form.category);
    const newEvent: CalEvent = { ...form, id: 'local_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5), color: cat?.color || 'bg-slate-500' };
    
    // 1. Immediately add to local state for instant UI feedback
    setEvents(prev => {
      const updated = [...prev, newEvent];
      // 2. Persist to localStorage as backup
      try { localStorage.setItem(storageKey, JSON.stringify(updated.filter(e => !e.id.startsWith('fb_') && !e.id.startsWith('signup_')))); } catch(e) {}
      return updated;
    });
    
    // 3. Persist to Firebase so it survives re-renders and shows via onSnapshot
    try {
      await addDoc(collection(db, 'calendar_events'), {
        title: form.title,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        color: cat?.color || 'bg-slate-500',
        description: form.description,
        attendees: form.attendees,
        location: form.location,
        meetLink: form.meetLink,
        assignedTo: user?.uid || defaultPersonalId,
        assignedBy: user?.uid || defaultPersonalId,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error('Firebase calendar write error (event still saved locally):', e);
    }
    
    setShowForm(false);
    setForm({ title: '', date: '', startTime: '09:00', endTime: '10:00', category: 'executive', description: '', attendees: '', location: '', meetLink: '' });
  };

  const assignEvent = async () => {
    if (!assignForm.title || !assignForm.date || !assignForm.targetUserId) return;
    
    try {
      // 1. Write the calendar event to Firebase for the specific user
      await addDoc(collection(db, 'calendar_events'), {
        title: assignForm.title,
        date: assignForm.date,
        startTime: assignForm.startTime,
        endTime: assignForm.endTime,
        category: assignForm.category,
        description: assignForm.description,
        meetLink: assignForm.meetLink,
        assignedTo: assignForm.targetUserId,
        assignedBy: 'Founder',
        createdAt: serverTimestamp()
      });

      // 2. Trigger the notification in their dashboard
      await addDoc(collection(db, 'notifications'), {
        userId: assignForm.targetUserId,
        title: 'New Calendar Event Assigned',
        message: `The Founder has assigned a new event to your calendar: ${assignForm.title} on ${assignForm.date}`,
        type: 'calendar_alert',
        read: false,
        createdAt: serverTimestamp()
      });

      alert('Event successfully assigned and user notified!');
      setShowAssignForm(false);
      setAssignForm({ title: '', date: '', startTime: '09:00', endTime: '10:00', category: 'task', description: '', meetLink: '', targetUserId: '' });
      setUserSearch('');
    } catch (e) {
      console.error('Failed to assign event:', e);
      alert('Failed to assign event.');
    }
  };

  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const generateMeetLink = () => {
    const code = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    setForm(f => ({ ...f, meetLink: `https://meet.google.com/${code}` }));
  };

  const GOOGLE_EMAIL = user?.email || 'globalgreenhp@gmail.com';

  // Opens Google Calendar in a new tab for the connected account
  const openGoogleCalendar = () => window.open(`https://calendar.google.com/calendar/u/0/r?authuser=${GOOGLE_EMAIL}`, '_blank');

  // Creates a Google Calendar event URL (pre-filled) so user can add it to their actual GCal
  const buildGCalUrl = (ev: { title: string; date: string; startTime: string; endTime: string; description?: string; attendees?: string; location?: string; meetLink?: string }) => {
    const start = ev.date.replace(/-/g, '') + 'T' + ev.startTime.replace(':', '') + '00';
    const end = ev.date.replace(/-/g, '') + 'T' + ev.endTime.replace(':', '') + '00';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: ev.title,
      dates: `${start}/${end}`,
      details: [ev.description, ev.meetLink ? `Google Meet: ${ev.meetLink}` : ''].filter(Boolean).join('\n'),
      location: ev.location || ev.meetLink || '',
      add: ev.attendees?.split(',').map(a => a.trim()).join(',') || '',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}&authuser=${GOOGLE_EMAIL}`;
  };

  const renderEventChip = (ev: CalEvent, compact = false) => (
    <div key={ev.id} className={cn("group rounded-lg px-2 py-1 text-white text-[10px] font-bold truncate cursor-pointer relative", ev.color, compact ? "mb-0.5" : "mb-1")}
      onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}>
      {!compact && <span className="opacity-80 mr-1">{ev.startTime}</span>}{ev.title}
      {ev.meetLink && <Video size={8} className="inline ml-1 opacity-70" />}
    </div>
  );

  const renderDayEvents = (dateStr: string) => {
    const dayEvts = eventsOn(dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return dayEvts.map(ev => (
      <div key={ev.id} className={cn("rounded-2xl border p-4 flex items-start justify-between gap-4 transition-all hover:shadow-md", ev.color.replace('bg-', 'bg-') + '/10 border-' + ev.color.replace('bg-', '') + '/30')}>
        <div className="flex items-start gap-3 min-w-0">
          <div className={cn("w-3 h-3 rounded-full mt-1 shrink-0 shadow-sm", ev.color)} />
          <div className="min-w-0">
            <p className="font-black text-sm text-slate-800 truncate">{ev.title}</p>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock size={10} /> {ev.startTime} – {ev.endTime}</span>
              {ev.attendees && <span className="flex items-center gap-1"><Users size={10} /> {ev.attendees}</span>}
              {ev.location && <span className="flex items-center gap-1"><MapPin size={10} /> {ev.location}</span>}
            </div>
            {ev.meetLink && (
              <a href={ev.meetLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors">
                <Video size={12} /> Join Google Meet
              </a>
            )}
            {ev.description && <p className="text-xs text-slate-400 mt-1">{ev.description}</p>}
          </div>
        </div>
        <button onClick={() => deleteEvent(ev.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
        <a href={buildGCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-500 transition-colors shrink-0" title="Add to Google Calendar"><CalIcon size={14} /></a>
      </div>
    ));
  };

  const renderEventDetailsModal = () => selectedEvent && (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden relative" onClick={e => e.stopPropagation()}>
        <div className={cn("absolute top-0 left-0 w-full h-3", selectedEvent.color)} />
        <div className="flex justify-between items-start mb-6 mt-2">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedEvent.title}</h3>
            <p className="text-sm font-bold text-slate-500 mt-1">{new Date(selectedEvent.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button onClick={() => setSelectedEvent(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><X size={16} /></button>
        </div>
        
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Clock size={18} className="text-slate-500" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</p>
              <p className="text-sm font-bold">{selectedEvent.startTime} – {selectedEvent.endTime}</p>
            </div>
          </div>
          
          {selectedEvent.attendees && (
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Users size={18} className="text-slate-500" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendees</p>
                <p className="text-sm font-bold">{selectedEvent.attendees}</p>
              </div>
            </div>
          )}
          
          {selectedEvent.location && (
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><MapPin size={18} className="text-slate-500" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                <p className="text-sm font-bold">{selectedEvent.location}</p>
              </div>
            </div>
          )}
          
          {selectedEvent.description && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedEvent.description}</p>
            </div>
          )}
          
          <div className="pt-4 flex flex-col gap-3">
            {selectedEvent.meetLink && (
              <a href={selectedEvent.meetLink} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
                <Video size={18} /> Join Google Meet
              </a>
            )}
            <div className="flex gap-3">
              <a href={buildGCalUrl(selectedEvent)} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                <CalIcon size={14} /> Add to GCal
              </a>
              <button onClick={() => { deleteEvent(selectedEvent.id); setSelectedEvent(null); }} className="px-5 py-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- NEW EVENT MODAL ---
  const renderModal = () => showForm && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">New Event</h3>
          <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <input className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Event title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-black text-slate-500 uppercase">Start</label><input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
          <div><label className="text-[10px] font-black text-slate-500 uppercase">End</label><input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
        </div>
        <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
          {availableCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <input className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="Attendees (comma-separated)" value={form.attendees} onChange={e => setForm(f => ({ ...f, attendees: e.target.value }))} />
        <input className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        <div className="flex gap-2">
          <input className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="Google Meet link" value={form.meetLink} onChange={e => setForm(f => ({ ...f, meetLink: e.target.value }))} />
          <button onClick={generateMeetLink} className="px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 hover:bg-blue-700 whitespace-nowrap"><Video size={14} /> Generate</button>
        </div>
        <textarea className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none" rows={2} placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <button onClick={addEvent} className="w-full py-3 bg-[#1a4731] text-white font-black rounded-xl hover:bg-[#0f291c] transition-colors">Create Event</button>
      </div>
    </div>
  );

  // --- ASSIGN EVENT MODAL (OVERSIGHT TOOL) ---
  const renderAssignModal = () => showAssignForm && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAssignForm(false)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-indigo-700 flex items-center gap-2"><Send size={20} /> Assign Event</h3>
            <p className="text-xs font-bold text-slate-500 mt-1">Search any user and add this directly to their personal calendar.</p>
          </div>
          <button onClick={() => setShowAssignForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        {/* User Search & Select */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Search User to Assign To *</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Type name, email, or role..." 
              value={userSearch} 
              onChange={e => {
                setUserSearch(e.target.value);
                setAssignForm(f => ({ ...f, targetUserId: '' })); // clear selection if they type
              }} 
            />
          </div>
          
          {userSearch && !assignForm.targetUserId && (
            <div className="mt-2 max-h-32 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-sm">
              {allUsers.filter(u => 
                (u.displayName || '').toLowerCase().includes(userSearch.toLowerCase()) || 
                (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                (u.role || '').toLowerCase().includes(userSearch.toLowerCase())
              ).map(u => (
                <div 
                  key={u.id} 
                  className="px-3 py-2 border-b last:border-0 border-slate-100 hover:bg-indigo-50 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    setAssignForm(f => ({ ...f, targetUserId: u.id }));
                    setUserSearch(`${u.displayName || u.email} (${u.role || 'user'})`);
                  }}
                >
                  <span className="text-sm font-bold text-slate-700">{u.displayName || 'Unknown Name'}</span>
                  <span className="text-xs text-slate-400">{u.email}</span>
                </div>
              ))}
              {allUsers.filter(u => (u.displayName || '').toLowerCase().includes(userSearch.toLowerCase()) || (u.email || '').toLowerCase().includes(userSearch.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-400 italic">No users found.</div>
              )}
            </div>
          )}
          {assignForm.targetUserId && (
            <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckSquare size={12} /> User selected</div>
          )}
        </div>

        <input className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Event title *" value={assignForm.title} onChange={e => setAssignForm(f => ({ ...f, title: e.target.value }))} />
        <input type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" value={assignForm.date} onChange={e => setAssignForm(f => ({ ...f, date: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-black text-slate-500 uppercase">Start</label><input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={assignForm.startTime} onChange={e => setAssignForm(f => ({ ...f, startTime: e.target.value }))} /></div>
          <div><label className="text-[10px] font-black text-slate-500 uppercase">End</label><input type="time" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" value={assignForm.endTime} onChange={e => setAssignForm(f => ({ ...f, endTime: e.target.value }))} /></div>
        </div>
        <textarea className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none" rows={2} placeholder="Description or Instructions to User" value={assignForm.description} onChange={e => setAssignForm(f => ({ ...f, description: e.target.value }))} />
        <button 
          onClick={assignEvent} 
          disabled={!assignForm.title || !assignForm.date || !assignForm.targetUserId}
          className="w-full py-3 bg-indigo-600 disabled:opacity-50 text-white font-black rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
        >
          Assign & Notify User
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {renderModal()}
      {renderAssignModal()}
      {renderEventDetailsModal()}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">{title || 'My Calendar'}</h2>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{subtitle || 'Oversight • Schedule • Master Engine'}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* View toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(['day', 'week', 'month'] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)} className={cn("px-4 py-2 rounded-lg text-xs font-black uppercase transition-all", view === v ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>{v}</button>
            ))}
          </div>
          <button onClick={goToday} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50">Today</button>
          <button onClick={openGoogleCalendar} className="px-4 py-2 border border-blue-200 bg-blue-50 rounded-xl text-xs font-black text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition-colors"><CalIcon size={14} /> Google Calendar</button>
          
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <button onClick={() => { setAssignForm(f => ({ ...f, date: selectedDate })); setShowAssignForm(true); }} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"><Search size={14} /> Assign Event</button>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate })); setShowForm(true); }} className="px-4 py-2.5 bg-[#1a4731] text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[#0f291c] transition-colors shadow-md"><Plus size={14} /> My Event</button>
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          {(view === 'day' || view === 'week') && (
            <button onClick={() => setView('month')} className="p-2 mr-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
              <ChevronLeft size={16} /> Back to Month
            </button>
          )}
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronLeft size={20} /></button>
        </div>
        <h3 className="text-lg font-black text-slate-800">
          {view === 'month' && `${monthNames[current.getMonth()]} ${current.getFullYear()}`}
          {view === 'week' && `Week of ${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          {view === 'day' && new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        <button onClick={() => navigate(1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronRight size={20} /></button>
      </div>

      {/* CATEGORY FILTERS */}
      {availableCategories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterCat(null)} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all", !filterCat ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400")}>All</button>
          {availableCategories.map(c => (
            <button key={c.id} onClick={() => setFilterCat(filterCat === c.id ? null : c.id)} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all flex items-center gap-1.5", filterCat === c.id ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400")}>
              <div className={cn("w-2 h-2 rounded-full", c.color)} />{c.label}
            </button>
          ))}
        </div>
      )}

      {/* === MONTH VIEW === */}
      {view === 'month' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-100">
            {dayNames.map(d => <div key={d} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map(({ date, inMonth }, i) => {
              const ds = fmt(date);
              const dayEvts = eventsOn(ds);
              const isToday = ds === fmt(new Date());
              const isSelected = ds === selectedDate;
              return (
                <div key={i} onClick={() => { setSelectedDate(ds); setView('day'); }}
                  className={cn("min-h-[100px] border-b border-r border-slate-50 p-2 cursor-pointer transition-all hover:bg-indigo-50/50",
                    !inMonth && "bg-slate-50/50 opacity-50", isSelected && "ring-2 ring-inset ring-indigo-500/30 bg-indigo-50/30", isToday && "bg-emerald-50/50")}>
                  <div className={cn("text-sm font-bold mb-1", isToday ? "w-7 h-7 bg-[#1a4731] text-white rounded-full flex items-center justify-center" : inMonth ? "text-slate-700" : "text-slate-300")}>{date.getDate()}</div>
                  <div className="space-y-0.5">{dayEvts.slice(0, 3).map(ev => renderEventChip(ev, true))}{dayEvts.length > 3 && <div className="text-[9px] text-slate-400 font-bold">+{dayEvts.length - 3} more</div>}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === WEEK VIEW === */}
      {view === 'week' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-8 border-b border-slate-100">
            <div className="py-3 px-2 text-[10px] font-black text-slate-400 border-r border-slate-100" />
            {weekDays.map(d => {
              const ds = fmt(d); const isToday = ds === fmt(new Date());
              return (<div key={ds} onClick={() => { setSelectedDate(ds); setView('day'); }}
                className={cn("py-3 text-center cursor-pointer hover:bg-indigo-50/50", isToday && "bg-emerald-50")}>
                <div className="text-[10px] font-black text-slate-400 uppercase">{dayNames[d.getDay()]}</div>
                <div className={cn("text-lg font-black", isToday ? "text-[#1a4731]" : "text-slate-700")}>{d.getDate()}</div>
              </div>);
            })}
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {HOURS.map(h => (
              <div key={h} className="grid grid-cols-8 border-b border-slate-50 min-h-[50px]">
                <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 border-r border-slate-100 text-right pr-3 pt-2">{h > 12 ? h - 12 : h}{h >= 12 ? 'PM' : 'AM'}</div>
                {weekDays.map(d => {
                  const ds = fmt(d);
                  const hourEvts = eventsOn(ds).filter(ev => parseInt(ev.startTime) === h);
                  return (
                    <div key={ds} className="border-r border-slate-50 px-1 py-0.5 hover:bg-slate-50/50 cursor-pointer"
                      onClick={() => { setSelectedDate(ds); setForm(f => ({ ...f, date: ds, startTime: `${String(h).padStart(2,'0')}:00`, endTime: `${String(h+1).padStart(2,'0')}:00` })); setShowForm(true); }}>
                      {hourEvts.map(ev => renderEventChip(ev))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === DAY VIEW === */}
      {view === 'day' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-black text-slate-800">Timeline</h4>
              <span className="text-xs text-slate-400 font-bold">{eventsOn(selectedDate).length} events</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {HOURS.map(h => {
                const hourEvts = eventsOn(selectedDate).filter(ev => parseInt(ev.startTime) === h);
                return (
                  <div key={h} className="flex border-b border-slate-50 min-h-[60px] hover:bg-slate-50/30 cursor-pointer"
                    onClick={() => { setForm(f => ({ ...f, date: selectedDate, startTime: `${String(h).padStart(2,'0')}:00`, endTime: `${String(h+1).padStart(2,'0')}:00` })); setShowForm(true); }}>
                    <div className="w-20 shrink-0 px-3 py-2 text-right text-[11px] font-mono font-bold text-slate-400 border-r border-slate-100">{h > 12 ? h - 12 : h}:00 {h >= 12 ? 'PM' : 'AM'}</div>
                    <div className="flex-1 px-3 py-1">{hourEvts.map(ev => renderEventChip(ev))}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Day detail panel */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
              <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><CalIcon size={16} className="text-indigo-600" /> Events for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h4>
              <div className="space-y-3">
                {eventsOn(selectedDate).length === 0 && <p className="text-sm text-slate-400 italic">No events scheduled</p>}
                {renderDayEvents(selectedDate)}
              </div>
            </div>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate })); setShowForm(true); }} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-bold text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"><Plus size={16} /> Add Event</button>
          </div>
        </div>
      )}
    </div>
  );
};
