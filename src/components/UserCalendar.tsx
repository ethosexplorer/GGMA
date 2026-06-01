import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Video, MapPin, Users, Calendar as CalIcon, Trash2, CheckSquare, Bell, Search } from 'lucide-react';
import { collection, query, onSnapshot, where, getDocs, addDoc } from 'firebase/firestore';
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
  { id: 'escalation', label: 'Escalation', color: 'bg-rose-600' },
  { id: 'personal', label: 'Personal', color: 'bg-slate-500' },
  { id: 'task', label: 'Task', color: 'bg-blue-500' },
  { id: 'reminder', label: 'Reminder', color: 'bg-orange-500' },
];

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6AM-9PM

const SEED_EVENTS: CalEvent[] = [];

// Mock events removed to ensure strictly real-time operation

const fmt = (d: Date) => d.toISOString().split('T')[0];
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const format12h = (timeStr: string) => {
  if (!timeStr) return '';
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hour = parseInt(parts[0], 10);
  if (isNaN(hour)) return timeStr;
  const min = parts[1];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${min} ${ampm}`;
};

export const UserCalendar = ({ user, title, subtitle }: { user?: any, title?: string, subtitle?: string }) => {
  const emailLower = user?.email?.toLowerCase() || '';
  const isMonica = emailLower.includes('compliance.globalgreenhp') || emailLower.includes('monica') || user?.role === 'chief_compliance_director';
  const isRyan = emailLower.includes('ceo.globalgreenhp') || user?.role === 'president';
  const isBob = emailLower.includes('bobmooregreenenergy') || emailLower.includes('bobmoore') || user?.role === 'executive_advisor' || user?.role === 'advisor';
  
  const isExecutive = isMonica || isRyan || isBob;
  const isFounder = (user?.role === 'executive_founder' || emailLower === 'globalgreenhp@gmail.com') && !isExecutive;
  
  const availableCategories = ALL_CATEGORIES;
  const initialEvents = isFounder ? SEED_EVENTS : [];

  // Allow Founder to view/edit anyone's calendar, defaulting to their own
  const defaultPersonalId = user?.uid || user?.role || 'default';
  const [activeCalendarId, setActiveCalendarId] = useState<string>(defaultPersonalId);

  // Reverting storage key back to v2 to fully restore all the user's manual calendar data
  const storageKey = `gghp_calendar_v2_${activeCalendarId}`;

  const [events, setEvents] = useState<CalEvent[]>([]);

  React.useEffect(() => {
    let unsubscribe: () => void;
    
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
          localEvents = [];
        }
      } catch (e) {
        localEvents = [];
      }

      setEvents(localEvents);

      // 2. REAL-TIME LISTENER FOR SIGNUPS ON THE FOUNDER'S CALENDAR UNDER 'EXECUTIVE'
      if (activeCalendarId === defaultPersonalId && isFounder) {
        unsubscribe = onSnapshot(collection(db, 'users'), (usersSnap) => {
          setEvents(currentEvents => {
            const updatedEvents = [...currentEvents];
            let changed = false;
            
            usersSnap.forEach(doc => {
              const data = doc.data();
              if (data.createdAt) {
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

            if (changed) {
              localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
              return updatedEvents;
            }
            return currentEvents;
          });
        }, (error) => {
          console.error("Error with real-time users sync for calendar:", error);
        });
      }

      // 3. FETCH ASSIGNED EVENTS FROM FOUNDER
      const unsubAssigned = onSnapshot(query(collection(db, 'calendar_events'), where('assignedTo', '==', defaultPersonalId)), (snap) => {
        setEvents(currentEvents => {
          const updatedEvents = [...currentEvents];
          let changed = false;
          snap.forEach(doc => {
            const data = doc.data();
            const eventId = `assigned_${doc.id}`;
            if (!updatedEvents.some(e => e.id === eventId)) {
              updatedEvents.push({
                id: eventId,
                title: data.title || 'Assigned Event',
                date: data.date,
                startTime: data.startTime || '09:00',
                endTime: data.endTime || '10:00',
                category: data.category || 'task',
                color: 'bg-indigo-500',
                description: `ASSIGNED BY FOUNDER: ${data.description || ''}`,
                meetLink: data.meetLink || ''
              });
              changed = true;
            }
          });
          if (changed) {
            localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
            return updatedEvents;
          }
          return currentEvents;
        });
      });

    };

    loadEvents();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeCalendarId, storageKey, isFounder, defaultPersonalId]);

  const [view, setView] = useState<ViewMode>('month');
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(fmt(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [form, setForm] = useState({ title: '', date: '', startTime: '09:00', endTime: '10:00', category: isFounder ? 'executive' : 'personal', description: '', attendees: '', location: '', meetLink: '', assignedToId: '', assignedToName: '' });
  const [filterCat, setFilterCat] = useState<string | null>(null);
  
  const [showSearchAssign, setShowSearchAssign] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    
    if (form.assignedToId) {
       // Direct assignment to someone else's calendar
       try {
         await addDoc(collection(db, 'calendar_events'), {
           title: form.title,
           date: form.date,
           startTime: form.startTime,
           endTime: form.endTime,
           category: form.category,
           description: form.description,
           meetLink: form.meetLink,
           assignedTo: form.assignedToId,
           assignedBy: user?.displayName || 'Admin',
           createdAt: new Date()
         });
         
         // Notify them
         await addDoc(collection(db, 'notifications'), {
           userId: form.assignedToId,
           title: 'New Calendar Event',
           message: `You have been assigned a new event: ${form.title} on ${form.date}`,
           timestamp: new Date(),
           read: false
         });
         
         alert(`Event successfully assigned to ${form.assignedToName}! They will receive a notification.`);
       } catch (err) {
         console.error('Failed to assign event:', err);
         alert('Failed to assign event. See console.');
       }
    } else {
       setEvents(prev => [...prev, { ...form, id: Date.now().toString(), color: cat?.color || 'bg-slate-500' }]);
    }
    
    setShowForm(false);
    setShowSearchAssign(false);
    setForm({ title: '', date: '', startTime: '09:00', endTime: '10:00', category: isFounder ? 'executive' : 'personal', description: '', attendees: '', location: '', meetLink: '', assignedToId: '', assignedToName: '' });
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
      {!compact && <span className="opacity-80 mr-1">{format12h(ev.startTime)}</span>}{ev.title}
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
              <span className="flex items-center gap-1"><Clock size={10} /> {format12h(ev.startTime)} – {format12h(ev.endTime)}</span>
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
              <p className="text-sm font-bold">{format12h(selectedEvent.startTime)} – {format12h(selectedEvent.endTime)}</p>
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
        {form.assignedToName && (
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex justify-between items-center">
             <span className="text-xs font-bold text-indigo-800">Assigning to: {form.assignedToName}</span>
             <button onClick={() => setForm(f => ({...f, assignedToId: '', assignedToName: ''}))} className="text-indigo-400 hover:text-indigo-600"><X size={14}/></button>
          </div>
        )}
        <button onClick={addEvent} className="w-full py-3 bg-[#1a4731] text-white font-black rounded-xl hover:bg-[#0f291c] transition-colors">
          {form.assignedToId ? 'Assign Event & Notify' : 'Create Event'}
        </button>
      </div>
    </div>
  );

  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const q = query(collection(db, 'users'));
      const snap = await getDocs(q);
      const results = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })).filter(u => 
        (u.displayName || u.fullName || u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    }
    setIsSearching(false);
  };

  const renderSearchAssignModal = () => showSearchAssign && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowSearchAssign(false)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800">Search User to Assign Event</h3>
          <button onClick={() => setShowSearchAssign(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSearchUsers} className="relative">
           <input 
             className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" 
             placeholder="Search by name or email..." 
             value={searchQuery} 
             onChange={e => setSearchQuery(e.target.value)} 
             autoFocus
           />
           <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
           <button type="submit" className="absolute right-2 top-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">
             {isSearching ? '...' : 'Search'}
           </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-2 mt-4">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Results</p>
             {searchResults.map(u => (
               <div key={u.id} className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                 onClick={() => {
                   setForm(f => ({ ...f, assignedToId: u.id, assignedToName: u.displayName || u.fullName || u.email }));
                   setShowSearchAssign(false);
                   setShowForm(true);
                 }}
               >
                 <div>
                   <p className="font-bold text-sm text-slate-800">{u.displayName || u.fullName || 'Unknown'}</p>
                   <p className="text-xs text-slate-500">{u.email}</p>
                 </div>
                 <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Assign</span>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {renderModal()}
      {renderSearchAssignModal()}
      {renderEventDetailsModal()}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">{title || 'My Calendar'}</h2>
            {isFounder && (
              <select 
                className="text-sm font-bold bg-slate-100 border-none rounded-xl px-4 py-2 text-slate-700 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                value={activeCalendarId}
                onChange={(e) => setActiveCalendarId(e.target.value)}
              >
                <option value={defaultPersonalId}>My Personal Calendar</option>
                <option value="monica_green">Monica Green (Compliance)</option>
                <option value="ryan_ceo">Ryan (CEO)</option>
                <option value="bob_moore">Bob Moore (Advisor)</option>
                <option value="sales_team">Sales Team</option>
              </select>
            )}
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{subtitle || 'Schedule • Meetings • Google Meet Integration'}</p>
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
            <button onClick={() => setShowSearchAssign(true)} className="px-4 py-2.5 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-indigo-100 transition-colors shadow-sm"><Search size={14} /> Search & Assign</button>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate, category: 'task' })); setShowForm(true); }} className="px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"><CheckSquare size={14} /> Task</button>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate, category: 'reminder' })); setShowForm(true); }} className="px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"><Bell size={14} /> Reminder</button>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate })); setShowForm(true); }} className="px-4 py-2.5 bg-[#1a4731] text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[#0f291c] transition-colors shadow-md"><Plus size={14} /> New Event</button>
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
