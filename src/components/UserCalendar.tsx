import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Video, MapPin, Users, Calendar as CalIcon, Trash2, CheckSquare, Bell, Search, Send, Shield } from 'lucide-react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

type ViewMode = 'month' | 'week' | 'day';

interface CalEvent {
  id: string; 
  title: string; 
  date: string; 
  startTime: string; 
  endTime: string;
  category: string; 
  color: string; 
  description?: string; 
  attendees?: string;
  location?: string; 
  meetLink?: string; 
  source?: string; 
  isBusiness?: boolean;
}

export const LEVEL_CATEGORIES = [
  { 
    level: 'Level 5 — Executive', 
    items: [
      { id: 'executive', label: 'Executive', color: 'bg-purple-500' },
      { id: 'escalation', label: 'Escalation', color: 'bg-rose-600' }
    ]
  },
  { 
    level: 'Level 4 — Regulatory & Compliance', 
    items: [
      { id: 'compliance', label: 'Compliance', color: 'bg-amber-500' },
      { id: 'state', label: 'State Authority', color: 'bg-cyan-500' },
      { id: 'federal', label: 'Federal', color: 'bg-red-500' }
    ]
  },
  { 
    level: 'Level 3 — Operations & Clinical', 
    items: [
      { id: 'ops', label: 'Operations', color: 'bg-indigo-500' },
      { id: 'booking', label: 'Scheduled Booking', color: 'bg-emerald-600' },
      { id: 'renewal', label: 'License Renewal', color: 'bg-yellow-500' },
      { id: 'telehealth', label: 'Telehealth', color: 'bg-emerald-500' }
    ]
  },
  { 
    level: 'Level 2 — Admin & Support', 
    items: [
      { id: 'admin_support', label: 'Admin Support', color: 'bg-pink-500' },
      { id: 'task', label: 'Task', color: 'bg-blue-500' },
      { id: 'reminder', label: 'Reminder', color: 'bg-orange-500' }
    ]
  },
  { 
    level: 'Level 1 — General & Personal', 
    items: [
      { id: 'personal', label: 'Personal', color: 'bg-slate-500' },
      { id: 'canceled', label: 'Canceled Booking', color: 'bg-slate-400' }
    ]
  }
];

export const ALL_CATEGORIES = LEVEL_CATEGORIES.flatMap(g => g.items);

const getEventCategoryObj = (ev: CalEvent) => {
  const titleLower = (ev.title || '').toLowerCase();
  const descLower = (ev.description || '').toLowerCase();

  // 1. Canceled events
  if (ev.color === 'bg-slate-400' || ev.title.includes('❌') || descLower.includes('canceled')) {
    return { id: 'canceled', label: 'Canceled Booking', color: 'bg-slate-400' };
  }

  // 2. Scheduled Bookings from Calendly / Carepatron
  if (ev.source === 'calendly' || ev.source === 'carepatron' || ev.category === 'booking') {
    return { id: 'booking', label: 'Scheduled Booking', color: 'bg-emerald-600' };
  }

  // 3. Renewals (yellow / business blue/red)
  const isExplicitRenewal = ev.category === 'renewal' || ev.color === 'bg-yellow-500';
  const hasRenewalHint = titleLower.includes('renewal') || descLower.includes('renew');
  const isRenewal = isExplicitRenewal || (hasRenewalHint && (!ev.category || ev.category === 'ops'));

  if (isRenewal) {
    const isBiz = ev.isBusiness || descLower.includes('business') || titleLower.includes('llc') || titleLower.includes('l.l.c.') || titleLower.includes('inc.') || titleLower.includes('co.') || titleLower.includes('corp');
    if (isBiz) {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      return ev.date < todayStr
        ? { id: 'renewal_overdue_business', label: 'Overdue Business Renewal', color: 'bg-red-500' }
        : { id: 'renewal_active_business', label: 'Business Renewal', color: 'bg-sky-400' };
    }
    return { id: 'renewal', label: 'License Renewal', color: 'bg-yellow-500' };
  }

  // 4. Standard mapping
  const found = ALL_CATEGORIES.find(c => c.id === ev.category);
  return found || { id: 'personal', label: 'Personal', color: ev.color || 'bg-slate-500' };
};

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6AM-9PM
const fmt = (d: Date) => d.toISOString().split('T')[0];
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const format12h = (timeStr: string) => {
  if (!timeStr) return '';
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
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

export const UserCalendar = ({ 
  user, 
  title, 
  subtitle,
  mode = 'personal',
  businessId
}: { 
  user?: any; 
  title?: string; 
  subtitle?: string;
  mode?: 'personal' | 'operations' | 'business' | 'founder';
  businessId?: string;
}) => {
  const isFounder = user?.role === 'executive_founder' || user?.email?.toLowerCase() === 'globalgreenhp@gmail.com';
  const isExecutive = ['executive_founder', 'president', 'chief_compliance_director', 'advisor'].includes(user?.role);

  // Dynamic state for active calendar mode
  const [calendarMode, setCalendarMode] = useState<'founder' | 'operations' | 'personal' | 'business'>(mode);
  
  // Resolve partition key
  const activeCalendarId = useMemo(() => {
    if (calendarMode === 'founder') return `founder_private_${user?.uid || 'default'}`;
    if (calendarMode === 'operations') return 'operations_shared';
    if (calendarMode === 'business') return `business_${businessId || user?.businessId || 'default'}`;
    return `personal_${user?.uid || 'default'}`;
  }, [calendarMode, user?.uid, user?.businessId, businessId]);

  // State
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [view, setView] = useState<ViewMode>('month');
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(fmt(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [showSearchAssign, setShowSearchAssign] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    title: '', 
    date: '', 
    startTime: '09:00', 
    endTime: '10:00', 
    category: 'personal', 
    description: '', 
    attendees: '', 
    location: '', 
    meetLink: '',
    assignedToId: '',
    assignedToName: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const isMatrix = calendarMode === 'founder';

  // 1. Heading colors
  const titleClass = isMatrix 
    ? "text-3xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3" 
    : "text-3xl font-black text-slate-900 tracking-tight italic";

  const subtitleClass = isMatrix 
    ? "text-[#D4AF77] font-black uppercase tracking-widest text-[10px] mt-1" 
    : "text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1";

  // 2. Control bar wrapper (Month/Week/Day tabs + buttons)
  const navBarClass = isMatrix 
    ? "flex items-center justify-between bg-[#0c1326] border border-slate-900 rounded-2xl px-6 py-3 shadow-md text-white" 
    : "flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-3 shadow-sm";

  const navTitleClass = isMatrix 
    ? "text-lg font-black text-[#D4AF77] uppercase tracking-wider" 
    : "text-lg font-black text-slate-800";

  const navBtnHoverClass = isMatrix 
    ? "p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white" 
    : "p-2 hover:bg-slate-100 rounded-xl transition-colors";

  const backToMonthClass = isMatrix 
    ? "p-2 mr-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-wider" 
    : "p-2 mr-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-wider";

  // 3. View selector tabs
  const tabsWrapperClass = isMatrix 
    ? "flex bg-slate-950/80 rounded-xl p-1 gap-1 border border-slate-900" 
    : "flex bg-slate-100 rounded-xl p-1 gap-1";

  const tabBtnClass = (active: boolean) => {
    if (isMatrix) {
      return active 
        ? "px-4 py-2 rounded-lg text-xs font-black uppercase transition-all bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 shadow-md shadow-emerald-950/50" 
        : "px-4 py-2 rounded-lg text-xs font-black uppercase transition-all text-slate-400 hover:text-white hover:bg-white/5";
    }
    return active 
      ? "px-4 py-2 rounded-lg text-xs font-black uppercase transition-all bg-white text-slate-800 shadow-sm" 
      : "px-4 py-2 rounded-lg text-xs font-black uppercase transition-all text-slate-500 hover:text-slate-700";
  };

  // 4. Action buttons
  const todayBtnClass = isMatrix 
    ? "px-4 py-2 border border-slate-900 bg-[#0c1326] rounded-xl text-xs font-black text-slate-300 hover:bg-white/5 hover:text-white" 
    : "px-4 py-2 border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50";

  const toolbarBtnClass = (colorType: 'task' | 'reminder' | 'new') => {
    if (isMatrix) {
      if (colorType === 'new') {
        return "px-4 py-2.5 bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[#134D36] transition-all shadow-md";
      }
      return "px-4 py-2.5 border border-slate-900 bg-[#0c1326] text-slate-300 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-white/5 transition-all shadow-sm";
    }
    if (colorType === 'new') {
      return "px-4 py-2.5 bg-[#1a4731] text-white rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[#0f291c] transition-colors shadow-md";
    }
    return "px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm";
  };

  // 5. Grid View containers
  const gridContainerClass = isMatrix 
    ? "bg-[#060a14] border border-slate-900 rounded-3xl shadow-xl overflow-hidden" 
    : "bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden";

  const gridHeaderClass = isMatrix 
    ? "grid grid-cols-7 border-b border-slate-900 bg-[#0c1326]/50" 
    : "grid grid-cols-7 border-b border-slate-100";

  const gridHeaderDayNameClass = isMatrix 
    ? "py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest" 
    : "py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest";

  // 6. Day cells
  const cellClass = (inMonth: boolean, isSelected: boolean, isToday: boolean) => {
    if (isMatrix) {
      return cn(
        "min-h-[100px] border-b border-r border-slate-900/60 p-2 cursor-pointer transition-all",
        !inMonth && "bg-[#080d1a]/20 opacity-30",
        inMonth && !isSelected && !isToday && "bg-[#0c1326]/30 hover:bg-[#0A3D2A]/10",
        isSelected && "ring-2 ring-inset ring-[#D4AF77]/30 bg-[#0A3D2A]/20",
        isToday && "bg-[#0A3D2A]/30 border-t-2 border-t-[#D4AF77]"
      );
    }
    return cn(
      "min-h-[100px] border-b border-r border-slate-50 p-2 cursor-pointer transition-all hover:bg-indigo-50/50",
      !inMonth && "bg-slate-50/50 opacity-50",
      isSelected && "ring-2 ring-inset ring-indigo-500/30 bg-indigo-50/30",
      isToday && "bg-emerald-50/50"
    );
  };

  const cellDateNumberClass = (isToday: boolean, inMonth: boolean) => {
    if (isMatrix) {
      return isToday 
        ? "w-7 h-7 bg-[#D4AF77] text-[#061F15] rounded-full flex items-center justify-center font-black" 
        : inMonth 
          ? "text-slate-350 text-sm font-bold" 
          : "text-slate-650 text-sm font-bold";
    }
    return isToday 
      ? "w-7 h-7 bg-[#1a4731] text-white rounded-full flex items-center justify-center font-bold" 
      : inMonth 
        ? "text-slate-700 text-sm font-bold" 
        : "text-slate-300 text-sm font-bold";
  };

  // 7. Day View timelines
  const timelinePanelClass = isMatrix 
    ? "lg:col-span-2 bg-[#060a14] border border-slate-900 rounded-3xl shadow-xl overflow-hidden" 
    : "lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden";

  const timelineHeaderClass = isMatrix 
    ? "px-6 py-4 border-b border-slate-900 flex justify-between items-center bg-[#0c1326]/30" 
    : "px-6 py-4 border-b border-slate-100 flex justify-between items-center";

  const timelineTitleClass = isMatrix 
    ? "font-black text-[#D4AF77] uppercase tracking-wider text-sm" 
    : "font-black text-slate-800";

  const timelineRowClass = isMatrix 
    ? "flex border-b border-slate-900/60 min-h-[60px] hover:bg-[#0A3D2A]/10 cursor-pointer" 
    : "flex border-b border-slate-50 min-h-[60px] hover:bg-slate-50/30 cursor-pointer";

  const timelineTimeLabelClass = isMatrix 
    ? "w-20 shrink-0 px-3 py-2 text-right text-[11px] font-mono font-bold text-slate-550 border-r border-slate-900/60" 
    : "w-20 shrink-0 px-3 py-2 text-right text-[11px] font-mono font-bold text-slate-400 border-r border-slate-100";

  // 8. Event list panel
  const eventPanelClass = isMatrix 
    ? "bg-[#060a14] border border-slate-900 rounded-3xl shadow-xl p-6" 
    : "bg-white border border-slate-200 rounded-3xl shadow-sm p-6";

  const eventPanelTitleClass = isMatrix 
    ? "font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide text-sm" 
    : "font-black text-slate-800 mb-4 flex items-center gap-2";

  const eventPanelTitleIconClass = isMatrix 
    ? "text-[#D4AF77]" 
    : "text-indigo-600";

  const eventPanelAddBtnClass = isMatrix 
    ? "w-full py-3 border-2 border-dashed border-slate-800 rounded-2xl text-sm font-bold text-slate-500 hover:border-[#D4AF77] hover:text-[#D4AF77] transition-all flex items-center justify-center gap-2" 
    : "w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-bold text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2";

  // 9. Select filter & forms
  const filterSelectClass = isMatrix 
    ? "text-xs font-black bg-[#0c1326] border border-slate-900 hover:border-[#D4AF77]/30 rounded-xl px-3 py-2 text-slate-350 outline-none cursor-pointer transition-all shadow-sm max-w-xs focus:border-[#D4AF77]" 
    : "text-xs font-black bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer transition-all shadow-sm max-w-xs";

  const filterLabelClass = isMatrix 
    ? "text-xs font-black text-slate-400 uppercase tracking-wider" 
    : "text-xs font-black text-slate-500 uppercase tracking-wider";

  // 10. Booking command center
  const bookingPanelClass = isMatrix 
    ? "bg-gradient-to-r from-[#061F15] via-[#0A3D2A] to-[#0A3D2A]/80 border border-[#D4AF77]/20 rounded-2xl p-5 shadow-xl animate-in slide-in-from-top-4 duration-300 text-white" 
    : "bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200/60 rounded-2xl p-5 shadow-sm animate-in slide-in-from-top-4 duration-300";

  const bookingHeaderClass = isMatrix 
    ? "text-sm font-black text-[#D4AF77] tracking-wider uppercase flex items-center gap-2" 
    : "text-sm font-black text-indigo-900 tracking-tight flex items-center gap-2";

  const bookingSubtitleClass = isMatrix 
    ? "text-[10px] font-bold text-emerald-400 mt-0.5 uppercase tracking-widest" 
    : "text-[10px] font-bold text-indigo-500/80 mt-0.5 uppercase tracking-widest";

  const bookingBtnClass = (src: string) => {
    if (isMatrix) {
      return src === 'Carepatron' 
        ? "group flex items-center gap-2 px-3 py-2.5 bg-purple-950/60 text-purple-200 border border-purple-800 rounded-xl text-[11px] font-bold transition-all hover:bg-purple-800 hover:text-white" 
        : "group flex items-center gap-2 px-3 py-2.5 bg-slate-950/60 text-slate-300 border border-slate-900 rounded-xl text-[11px] font-bold transition-all hover:border-[#D4AF77]/30 hover:bg-[#0A3D2A]/30 hover:text-white";
    }
    return src === 'Carepatron' 
      ? "group flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold border transition-all hover:shadow-md hover:-translate-y-0.5 bg-purple-600 text-white border-purple-700 hover:bg-purple-700" 
      : "group flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold border transition-all hover:shadow-md hover:-translate-y-0.5 bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
  };

  const bookingBadgeClass = (src: string) => {
    if (isMatrix) {
      return src === 'Carepatron' 
        ? "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-purple-900/60 text-purple-300 rounded-md shrink-0" 
        : "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-emerald-950 text-[#D4AF77] rounded-md shrink-0";
    }
    return src === 'Carepatron' 
      ? "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-white/20 text-white" 
      : "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-indigo-100 text-indigo-600";
  };

  // Modals
  const modalOverlayClass = "fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200";

  const modalContentClass = isMatrix 
    ? "bg-[#0c1326] border-2 border-[#D4AF77] text-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 space-y-5 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300" 
    : "bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-5 max-h-[90vh] overflow-y-auto relative";

  const modalTitleClass = isMatrix 
    ? "text-xl font-black text-[#D4AF77] uppercase tracking-wider" 
    : "text-xl font-black text-slate-800";

  const modalLabelClass = isMatrix 
    ? "text-[10px] font-black text-slate-500 uppercase tracking-widest" 
    : "text-[10px] font-black text-slate-500 uppercase";

  const modalInputClass = isMatrix 
    ? "w-full px-4 py-3 bg-slate-950/60 border border-slate-900 rounded-xl text-sm font-medium text-slate-100 focus:border-[#D4AF77] outline-none transition-all placeholder-slate-600" 
    : "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none";

  const modalSelectClass = isMatrix 
    ? "w-full px-4 py-3 bg-slate-950/60 border border-slate-900 rounded-xl text-sm font-medium text-slate-100 focus:border-[#D4AF77] outline-none cursor-pointer transition-all" 
    : "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer";

  const modalTextAreaClass = isMatrix 
    ? "w-full px-4 py-3 bg-slate-950/60 border border-slate-900 rounded-xl text-sm text-slate-200 focus:border-[#D4AF77] outline-none resize-none transition-all" 
    : "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none";

  const modalSaveBtnClass = isMatrix 
    ? "w-full py-3 bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 font-black rounded-xl hover:bg-[#134D36] transition-colors shadow-md" 
    : "w-full py-3 bg-[#1a4731] text-white font-black rounded-xl hover:bg-[#0f291c] transition-colors shadow-md";

  const detailsModalContentClass = isMatrix 
    ? "bg-[#0c1326] border-2 border-[#D4AF77] text-slate-100 rounded-[2.5rem] shadow-2xl w-full max-w-sm p-6 max-h-[85vh] overflow-y-auto relative animate-in zoom-in-95 duration-300" 
    : "bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 max-h-[85vh] overflow-y-auto relative";

  const detailsModalTitleClass = isMatrix 
    ? "text-lg font-black text-white tracking-tight leading-tight uppercase" 
    : "text-lg font-black text-slate-800 tracking-tight leading-tight";

  const detailsModalCloseBtnClass = isMatrix 
    ? "p-1.5 bg-slate-950/60 hover:bg-white/5 text-slate-400 rounded-full transition-colors shrink-0 border border-slate-900" 
    : "p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shrink-0";

  const detailsRowBgClass = isMatrix 
    ? "w-8 h-8 rounded-full bg-slate-950/60 flex items-center justify-center shrink-0 border border-slate-900" 
    : "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0";

  const detailsRowTextClass = isMatrix 
    ? "text-xs font-bold text-slate-200" 
    : "text-xs font-bold text-slate-700";

  const detailsDescClass = isMatrix 
    ? "bg-slate-950/40 p-3 rounded-xl border border-slate-900 text-slate-350" 
    : "bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600";

  const CATEGORY_STYLE_MAP: Record<string, { dot: string; stdActive: string; stdInactive: string; mtxActive: string; mtxInactive: string; }> = {
    ops: {
      dot: 'bg-indigo-500',
      stdActive: 'bg-indigo-600 text-white border-transparent shadow-indigo-500/20 shadow-lg',
      stdInactive: 'bg-indigo-50/60 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300',
      mtxActive: 'bg-indigo-500 text-white border-white/20 shadow-indigo-500/30 shadow-lg',
      mtxInactive: 'bg-indigo-950/20 border-indigo-900/60 text-indigo-350 hover:bg-indigo-950/40 hover:border-indigo-800/40',
    },
    booking: {
      dot: 'bg-emerald-600',
      stdActive: 'bg-emerald-600 text-white border-transparent shadow-emerald-600/20 shadow-lg',
      stdInactive: 'bg-emerald-50/60 border-emerald-250 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300',
      mtxActive: 'bg-emerald-600 text-white border-white/20 shadow-emerald-600/30 shadow-lg',
      mtxInactive: 'bg-emerald-950/20 border-emerald-900/60 text-emerald-350 hover:bg-emerald-950/40 hover:border-emerald-800/40',
    },
    renewal: {
      dot: 'bg-yellow-500',
      stdActive: 'bg-yellow-500 text-slate-900 border-transparent shadow-yellow-500/20 shadow-lg',
      stdInactive: 'bg-yellow-50/40 border-yellow-200 text-yellow-800 hover:bg-yellow-50 hover:border-yellow-300',
      mtxActive: 'bg-yellow-500 text-slate-950 border-white/20 shadow-yellow-500/30 shadow-lg',
      mtxInactive: 'bg-yellow-950/10 border-yellow-900/40 text-yellow-350 hover:bg-yellow-950/25 hover:border-yellow-800/30',
    },
    canceled: {
      dot: 'bg-slate-400',
      stdActive: 'bg-slate-500 text-white border-transparent shadow-slate-400/20 shadow-lg',
      stdInactive: 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:border-slate-300',
      mtxActive: 'bg-slate-500 text-white border-white/25 shadow-slate-500/30 shadow-lg',
      mtxInactive: 'bg-slate-950/30 border-slate-900 text-slate-400 hover:bg-white/5 hover:border-slate-800',
    },
    telehealth: {
      dot: 'bg-emerald-500',
      stdActive: 'bg-emerald-500 text-white border-transparent shadow-emerald-500/20 shadow-lg',
      stdInactive: 'bg-emerald-50/60 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300',
      mtxActive: 'bg-[#00FF66]/20 border-[#00FF66]/40 text-[#00FF66] shadow-[#00FF66]/25 shadow-lg',
      mtxInactive: 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-[#00FF66]/30 hover:bg-[#00FF66]/5',
    },
    executive: {
      dot: 'bg-purple-500',
      stdActive: 'bg-purple-600 text-white border-transparent shadow-purple-500/20 shadow-lg',
      stdInactive: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300',
      mtxActive: 'bg-purple-600 text-white border-white/20 shadow-purple-500/30 shadow-lg',
      mtxInactive: 'bg-purple-950/20 border-purple-900/65 text-purple-350 hover:bg-purple-950/40 hover:border-purple-800/40',
    },
    escalation: {
      dot: 'bg-rose-600',
      stdActive: 'bg-rose-600 text-white border-transparent shadow-rose-600/20 shadow-lg',
      stdInactive: 'bg-rose-55 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300',
      mtxActive: 'bg-rose-600 text-white border-white/20 shadow-rose-600/30 shadow-lg',
      mtxInactive: 'bg-rose-950/20 border-rose-900/65 text-rose-350 hover:bg-rose-950/40 hover:border-rose-800/40',
    },
    federal: {
      dot: 'bg-red-500',
      stdActive: 'bg-red-600 text-white border-transparent shadow-red-500/20 shadow-lg',
      stdInactive: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300',
      mtxActive: 'bg-red-600 text-white border-white/20 shadow-red-500/30 shadow-lg',
      mtxInactive: 'bg-red-950/20 border-red-900/65 text-red-350 hover:bg-red-950/40 hover:border-red-800/40',
    },
    compliance: {
      dot: 'bg-amber-500',
      stdActive: 'bg-amber-500 text-white border-transparent shadow-amber-500/20 shadow-lg',
      stdInactive: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300',
      mtxActive: 'bg-amber-500 text-white border-white/20 shadow-amber-500/30 shadow-lg',
      mtxInactive: 'bg-amber-950/20 border-amber-900/65 text-amber-350 hover:bg-amber-950/40 hover:border-amber-800/40',
    },
    state: {
      dot: 'bg-cyan-500',
      stdActive: 'bg-cyan-500 text-white border-transparent shadow-cyan-500/20 shadow-lg',
      stdInactive: 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300',
      mtxActive: 'bg-cyan-500 text-white border-white/20 shadow-cyan-500/30 shadow-lg',
      mtxInactive: 'bg-cyan-950/20 border-cyan-900/65 text-cyan-350 hover:bg-cyan-950/40 hover:border-cyan-800/40',
    },
    admin_support: {
      dot: 'bg-pink-500',
      stdActive: 'bg-pink-500 text-white border-transparent shadow-pink-500/20 shadow-lg',
      stdInactive: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300',
      mtxActive: 'bg-pink-500 text-white border-white/20 shadow-pink-500/30 shadow-lg',
      mtxInactive: 'bg-pink-950/20 border-pink-900/65 text-pink-350 hover:bg-pink-950/40 hover:border-pink-800/40',
    },
    task: {
      dot: 'bg-blue-500',
      stdActive: 'bg-blue-600 text-white border-transparent shadow-blue-500/20 shadow-lg',
      stdInactive: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300',
      mtxActive: 'bg-blue-500 text-white border-white/20 shadow-blue-500/30 shadow-lg',
      mtxInactive: 'bg-blue-950/20 border-blue-900/65 text-blue-350 hover:bg-blue-950/40 hover:border-blue-800/40',
    },
    reminder: {
      dot: 'bg-orange-500',
      stdActive: 'bg-orange-500 text-white border-transparent shadow-orange-500/20 shadow-lg',
      stdInactive: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300',
      mtxActive: 'bg-orange-500 text-white border-white/20 shadow-orange-500/30 shadow-lg',
      mtxInactive: 'bg-orange-950/20 border-orange-900/65 text-orange-350 hover:bg-orange-950/40 hover:border-orange-800/40',
    },
    personal: {
      dot: 'bg-slate-500',
      stdActive: 'bg-slate-600 text-white border-transparent shadow-slate-500/20 shadow-lg',
      stdInactive: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300',
      mtxActive: 'bg-slate-550 text-white border-white/20 shadow-slate-500/30 shadow-lg',
      mtxInactive: 'bg-slate-950/30 border-slate-900 text-slate-400 hover:bg-white/5 hover:border-slate-800',
    }
  };

  const getCategoryBtnClass = (categoryId: string, active: boolean) => {
    const meta = CATEGORY_STYLE_MAP[categoryId] || CATEGORY_STYLE_MAP.personal;
    if (isMatrix) {
      return cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all text-left cursor-pointer",
        active ? meta.mtxActive : meta.mtxInactive
      );
    }
    return cn(
      "flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all text-left cursor-pointer",
      active ? meta.stdActive : meta.stdInactive
    );
  };

  const getEventCardClass = (categoryId: string) => {
    const meta = CATEGORY_STYLE_MAP[categoryId] || CATEGORY_STYLE_MAP.personal;
    const colorName = meta.dot.replace('bg-', '');
    if (isMatrix) {
      return cn(
        "rounded-2xl border p-4 flex items-start justify-between gap-4 transition-all hover:shadow-md bg-slate-950/40",
        `border-${colorName}/30 hover:border-${colorName}/60 hover:bg-slate-950/60 hover:shadow-${colorName}/5`
      );
    }
    return cn(
      "rounded-2xl border p-4 flex items-start justify-between gap-4 transition-all hover:shadow-md",
      `bg-${colorName}/5 border-${colorName}/20 hover:bg-${colorName}/10 hover:border-${colorName}/30 hover:shadow-${colorName}/5 text-slate-800`
    );
  };

  // Dynamic Google Calendar configurations (No hardcoded founder fallbacks displayed to non-founders)
  const PERSONAL_EMAILS = isFounder 
    ? ['globalgreenhp@gmail.com', 'globalgreenenterprize@gmail.com', 'thebackoffice2021@gmail.com', 'diversityhealthandwellness@gmail.com']
    : [user?.email].filter(Boolean);
  const [selectedGCalEmail, setSelectedGCalEmail] = useState(user?.email || 'globalgreenhp@gmail.com');

  const OPS_EMAILS = isFounder 
    ? ['asstsupport@gmail.com', 'globalgreenhp@gmail.com', 'thebackoffice.com@gmail.com']
    : ['operations@globalgreenhp.com'];
  const [selectedOpsEmail, setSelectedOpsEmail] = useState(isFounder ? 'asstsupport@gmail.com' : 'operations@globalgreenhp.com');

  const getOpsCalendlyUrl = (email: string) => {
    if (email === 'globalgreenhp@gmail.com') return 'https://calendly.com/chroniccardz';
    if (email === 'thebackoffice.com@gmail.com') return 'https://calendly.com/thebackoffice';
    return 'https://calendly.com/asstsupport';
  };

  // Trigger Calendly sync in background (Executive roles only)
  React.useEffect(() => {
    if (!isExecutive) return;
    const syncCalendly = async () => {
      try {
        await fetch('/api/sync-calendly');
      } catch (err) {}
    };
    syncCalendly();
    const interval = setInterval(syncCalendly, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isExecutive]);

  // Firestore Sync - Pure Real-Time Partition Isolation
  React.useEffect(() => {
    let unsubscribeEvents: () => void;
    let unsubscribeSignups: () => void;

    // Load dismissed signup IDs from local storage
    let dismissedList: string[] = [];
    try {
      const saved = localStorage.getItem('gghp_dismissed_signups');
      if (saved) dismissedList = JSON.parse(saved);
    } catch (e) {}

    const eventsRef = collection(db, 'calendar_events');
    
    const loadEvents = () => {
      let directEvents: CalEvent[] = [];
      let assignedEvents: CalEvent[] = [];
      let signupEvents: CalEvent[] = [];

      const updateState = () => {
        const all = [...directEvents, ...assignedEvents, ...signupEvents].filter(
          e => !dismissedList.includes(e.id)
        );
        // Deduplicate
        const unique = all.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setEvents(unique);
      };

      // 1. Direct partition listener
      const qA = query(eventsRef, where('calendarId', '==', activeCalendarId));
      const unsubA = onSnapshot(qA, (snap) => {
        directEvents = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: `fb_${doc.id}`,
            title: data.title,
            date: data.date,
            startTime: data.startTime || '09:00',
            endTime: data.endTime || '10:00',
            category: data.category || 'personal',
            color: data.color || 'bg-slate-500',
            description: data.description,
            attendees: data.attendees,
            location: data.location,
            meetLink: data.meetLink,
            source: data.source || '',
            isBusiness: !!data.isBusiness
          };
        });
        updateState();
      });

      // 2. Assignments listener (Personal Schedules only)
      let unsubB = () => {};
      if (calendarMode === 'personal') {
        const qB = query(eventsRef, where('assignedTo', '==', user?.uid || 'default'));
        unsubB = onSnapshot(qB, (snap) => {
          assignedEvents = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: `fb_${doc.id}`,
              title: data.title,
              date: data.date,
              startTime: data.startTime || '09:00',
              endTime: data.endTime || '10:00',
              category: data.category || 'personal',
              color: data.color || 'bg-indigo-500',
              description: data.description,
              attendees: data.attendees,
              location: data.location,
              meetLink: data.meetLink,
              source: data.source || '',
              isBusiness: !!data.isBusiness
            };
          });
          updateState();
        });
      }

      // 3. User Signups listener (Founder Master mode only)
      let unsubC = () => {};
      if (calendarMode === 'founder' && isFounder) {
        unsubC = onSnapshot(collection(db, 'users'), (usersSnap) => {
          signupEvents = [];
          const usersList: any[] = [];
          usersSnap.forEach(doc => {
            const data = doc.data();
            usersList.push({ id: doc.id, ...data });
            if (data.createdAt) {
              const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              const dateStr = dateObj.toISOString().split('T')[0];
              const displayName = data.displayName || data.companyName || data.email || 'New User';
              signupEvents.push({
                id: `signup_${doc.id}`,
                title: `New Signup: ${displayName}`,
                date: dateStr,
                startTime: '08:00',
                endTime: '09:00',
                category: 'executive',
                color: 'bg-emerald-500',
                description: `Role: ${data.role || 'user'}. Contact: ${data.email}. Review for escalation and marketing subscription options.`,
              });
            }
          });
          setAllUsers(usersList);
          updateState();
        });
      }

      unsubscribeEvents = () => {
        unsubA();
        unsubB();
        unsubC();
      };
    };

    loadEvents();
    return () => {
      if (unsubscribeEvents) unsubscribeEvents();
    };
  }, [activeCalendarId, calendarMode, user?.uid, isFounder]);

  // Mutations
  const addEvent = async () => {
    if (!form.title || !form.date) return;
    const cat = ALL_CATEGORIES.find(c => c.id === form.category);
    setShowForm(false);

    const currentForm = { ...form };
    const currentColor = cat?.color || 'bg-slate-500';
    const isEditing = editingEventId;

    setEditingEventId(null);
    setForm({ 
      title: '', date: '', startTime: '09:00', endTime: '10:00', category: 'personal', 
      description: '', attendees: '', location: '', meetLink: '', assignedToId: '', assignedToName: '' 
    });

    try {
      if (isEditing) {
        if (isEditing.startsWith('fb_')) {
          await updateDoc(doc(db, 'calendar_events', isEditing.replace('fb_', '')), {
            title: currentForm.title || '',
            date: currentForm.date || '',
            startTime: currentForm.startTime || '',
            endTime: currentForm.endTime || '',
            category: currentForm.category || 'personal',
            color: currentColor,
            description: currentForm.description || '',
            attendees: currentForm.attendees || '',
            location: currentForm.location || '',
            meetLink: currentForm.meetLink || ''
          });
        }
      } else {
        if (currentForm.assignedToId) {
          // Direct assignment to someone else's personal calendar
          await addDoc(collection(db, 'calendar_events'), {
            title: currentForm.title,
            date: currentForm.date,
            startTime: currentForm.startTime,
            endTime: currentForm.endTime,
            category: currentForm.category,
            description: currentForm.description,
            meetLink: currentForm.meetLink,
            location: currentForm.location || '',
            attendees: currentForm.attendees || '',
            assignedTo: currentForm.assignedToId,
            assignedBy: user?.displayName || user?.email || 'Admin',
            calendarId: `personal_${currentForm.assignedToId}`,
            createdAt: serverTimestamp()
          });

          // Trigger dashboard notification
          await addDoc(collection(db, 'notifications'), {
            userId: currentForm.assignedToId,
            title: 'New Calendar Event Assigned',
            message: `A new event has been assigned to your calendar: ${currentForm.title} on ${currentForm.date}`,
            type: 'calendar_alert',
            read: false,
            createdAt: serverTimestamp()
          });
        } else {
          // Add directly to active partition
          await addDoc(collection(db, 'calendar_events'), {
            title: currentForm.title,
            date: currentForm.date,
            startTime: currentForm.startTime,
            endTime: currentForm.endTime,
            category: currentForm.category,
            color: currentColor,
            description: currentForm.description,
            meetLink: currentForm.meetLink,
            location: currentForm.location || '',
            attendees: currentForm.attendees || '',
            calendarId: activeCalendarId,
            assignedTo: activeCalendarId,
            assignedBy: user?.uid || 'default',
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEvent = async (id: string) => {
    if (id.startsWith('signup_')) {
      try {
        const saved = localStorage.getItem('gghp_dismissed_signups');
        const list = saved ? JSON.parse(saved) : [];
        list.push(id);
        localStorage.setItem('gghp_dismissed_signups', JSON.stringify(list));
        setEvents(prev => prev.filter(e => e.id !== id));
      } catch (e) {}
    } else if (id.startsWith('fb_')) {
      try {
        await deleteDoc(doc(db, 'calendar_events', id.replace('fb_', '')));
      } catch (e) {}
    }
  };

  const changeEventColorAndCategory = async (id: string, newColor: string, newCategory: string) => {
    if (id.startsWith('fb_')) {
      try {
        await updateDoc(doc(db, 'calendar_events', id.replace('fb_', '')), { color: newColor, category: newCategory });
      } catch (e) {}
    }
    setSelectedEvent(prev => prev && prev.id === id ? { ...prev, color: newColor, category: newCategory } : prev);
  };

  // Navigations
  const navigate = (dir: number) => {
    if (view === 'day') {
      const d = new Date(selectedDate + 'T12:00:00');
      d.setDate(d.getDate() + dir);
      setSelectedDate(fmt(d));
      setCurrent(d);
    } else {
      const d = new Date(current);
      if (view === 'month') d.setMonth(d.getMonth() + dir);
      else if (view === 'week') d.setDate(d.getDate() + dir * 7);
      setCurrent(d);
    }
  };

  const goToday = () => {
    setCurrent(new Date());
    setSelectedDate(fmt(new Date()));
  };

  // GCal Integrations
  const openGoogleCalendar = () => window.open(`https://calendar.google.com/calendar/u/0/r?authuser=${selectedGCalEmail}`, '_blank');

  const buildGCalUrl = (ev: CalEvent) => {
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
    return `https://calendar.google.com/calendar/render?${params.toString()}&authuser=${selectedGCalEmail}`;
  };

  // Search Logic
  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const results = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })).filter(u => 
        (u.displayName || u.fullName || u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } catch (err) {}
    setIsSearching(false);
  };

  // Mapped Memos
  const filtered = useMemo(() => {
    if (!filterCat) return events;
    return events.filter(e => getEventCategoryObj(e).id === filterCat);
  }, [events, filterCat]);

  const eventsOn = (d: string) => filtered.filter(e => e.date === d);

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

  // Sub-renders
  const renderEventChip = (ev: CalEvent, compact = false) => (
    <div key={ev.id} className={cn("group rounded-lg px-2 py-1 text-white text-[10px] font-bold truncate cursor-pointer relative", getEventCategoryObj(ev).color, compact ? "mb-0.5" : "mb-1")}
      onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}>
      {!compact && <span className="opacity-80 mr-1">{format12h(ev.startTime)}</span>}{ev.title}
      {ev.meetLink && <Video size={8} className="inline ml-1 opacity-70" />}
    </div>
  );

  const renderDayEvents = (dateStr: string) => {
    const dayEvts = eventsOn(dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return dayEvts.map(ev => (
      <div key={ev.id} className={getEventCardClass(getEventCategoryObj(ev).id)}>
        <div className="flex items-start gap-3 min-w-0">
          <div className={cn("w-3 h-3 rounded-full mt-1 shrink-0 shadow-sm", getEventCategoryObj(ev).color)} />
          <div className="min-w-0">
            <p className={cn("font-black text-sm truncate", isMatrix ? "text-white" : "text-slate-800")}>{ev.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm", getEventCategoryObj(ev).color)}>
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                {getEventCategoryObj(ev).label}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
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
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => deleteEvent(ev.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete event"><Trash2 size={14} /></button>
          <a href={buildGCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors" title="Add to Google Calendar"><CalIcon size={14} /></a>
        </div>
      </div>
    ));
  };

  const renderEventDetailsModal = () => selectedEvent && (
    <div className={modalOverlayClass} onClick={() => setSelectedEvent(null)}>
      <div className={detailsModalContentClass} onClick={e => e.stopPropagation()}>
        {!isMatrix && <div className={cn("absolute top-0 left-0 w-full h-2 rounded-t-2xl", getEventCategoryObj(selectedEvent).color)} />}
        <div className="flex justify-between items-start mb-3 mt-1">
          <div className="min-w-0 pr-2">
            <h3 className={detailsModalTitleClass}>{selectedEvent.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white shadow-sm", getEventCategoryObj(selectedEvent).color)}>
                <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                {getEventCategoryObj(selectedEvent).label}
              </span>
            </div>
            <p className={cn("text-xs font-bold mt-1.5", isMatrix ? "text-slate-400" : "text-slate-500")}>{new Date(selectedEvent.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button onClick={() => setSelectedEvent(null)} className={detailsModalCloseBtnClass}><X size={14} /></button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className={detailsRowBgClass}><Clock size={14} className={isMatrix ? "text-[#D4AF77]" : "text-slate-500"} /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Time</p>
              <p className={detailsRowTextClass}>{format12h(selectedEvent.startTime)} – {format12h(selectedEvent.endTime)}</p>
            </div>
          </div>
          
          {selectedEvent.attendees && (
            <div className="flex items-center gap-2.5">
              <div className={detailsRowBgClass}><Users size={14} className={isMatrix ? "text-[#D4AF77]" : "text-slate-500"} /></div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Attendees</p>
                <p className={detailsRowTextClass}>{selectedEvent.attendees}</p>
              </div>
            </div>
          )}
          
          {selectedEvent.location && (
            <div className="flex items-center gap-2.5">
              <div className={detailsRowBgClass}><MapPin size={14} className={isMatrix ? "text-[#D4AF77]" : "text-slate-500"} /></div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Location</p>
                <p className={detailsRowTextClass}>{selectedEvent.location}</p>
              </div>
            </div>
          )}
          
          {selectedEvent.description && (
            <div className={detailsDescClass}>
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
            </div>
          )}

          {/* Color Coordinator Grid */}
          <div className={cn("space-y-1.5 pt-2 border-t", isMatrix ? "border-slate-900" : "border-slate-100")}>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Color Coordinator (Clearance Levels)</p>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {ALL_CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => changeEventColorAndCategory(selectedEvent.id, c.color, c.id)}
                  className={getCategoryBtnClass(c.id, getEventCategoryObj(selectedEvent).id === c.id)}
                >
                  <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 shadow-sm", c.color)} />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-3 flex flex-col gap-2">
            {selectedEvent.meetLink && (
              <a href={selectedEvent.meetLink} target="_blank" rel="noopener noreferrer" className={cn("w-full py-2.5 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg", isMatrix ? "bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 hover:bg-[#134D36]" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20")}>
                <Video size={14} /> Join Google Meet
              </a>
            )}
            <div className="flex gap-2">
              <a href={buildGCalUrl(selectedEvent)} target="_blank" rel="noopener noreferrer" className={cn("flex-1 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors", isMatrix ? "border-slate-900 bg-slate-950/60 text-slate-400 hover:bg-white/5 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700")}>
                <CalIcon size={12} /> Add to GCal
              </a>
              <button onClick={() => { 
                setForm({ 
                  title: selectedEvent.title, date: selectedEvent.date, startTime: selectedEvent.startTime, endTime: selectedEvent.endTime, 
                  category: selectedEvent.category, description: selectedEvent.description || '', attendees: selectedEvent.attendees || '', 
                  location: selectedEvent.location || '', meetLink: selectedEvent.meetLink || '', assignedToId: '', assignedToName: '' 
                });
                setEditingEventId(selectedEvent.id);
                setSelectedEvent(null);
                setShowForm(true);
              }} className={cn("px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors", isMatrix ? "border-slate-900 bg-slate-950/60 text-slate-400 hover:bg-white/5 hover:text-white" : "border-slate-200 hover:bg-slate-50 text-slate-700")}>
                Edit
              </button>
              <button onClick={() => { deleteEvent(selectedEvent.id); setSelectedEvent(null); }} className={cn("px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors", isMatrix ? "border-red-950 bg-red-950/20 text-red-400 hover:bg-red-950/40" : "border-red-200 hover:bg-red-50 text-red-600")}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const generateMeetLink = () => {
    const code = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    setForm(f => ({ ...f, meetLink: `https://meet.google.com/${code}` }));
  };

  const renderModal = () => showForm && (
    <div className={modalOverlayClass} onClick={() => setShowForm(false)}>
      <div className={modalContentClass} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className={modalTitleClass}>New Event</h3>
          <button onClick={() => setShowForm(false)} className={cn("transition-colors", isMatrix ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-600")}><X size={20} /></button>
        </div>
        <input className={modalInputClass} placeholder="Event title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input type="date" className={modalInputClass} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className={modalLabelClass}>Start</label><input type="time" className={modalInputClass} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
          <div><label className={modalLabelClass}>End</label><input type="time" className={modalInputClass} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
        </div>

        {/* Level Grouped Category Buttons */}
        <div className="space-y-2">
          <p className={modalLabelClass}>Color Coordinator (Select Department/Color)</p>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {LEVEL_CATEGORIES.map(group => (
              <div key={group.level} className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 pl-1">{group.level}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.items.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: c.id }))}
                      className={getCategoryBtnClass(c.id, form.category === c.id)}
                    >
                      <div className={cn("w-2 h-2 rounded-full shrink-0 shadow-sm", c.color)} />
                      <span className="truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <input className={modalInputClass} placeholder="Attendees (comma-separated)" value={form.attendees} onChange={e => setForm(f => ({ ...f, attendees: e.target.value }))} />
        <input className={modalInputClass} placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        
        <div className="flex gap-2">
          <input className={modalInputClass} placeholder="Google Meet link" value={form.meetLink} onChange={e => setForm(f => ({ ...f, meetLink: e.target.value }))} />
          <button onClick={generateMeetLink} className={cn("px-4 py-3 rounded-xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-colors", isMatrix ? "bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 hover:bg-[#134D36]" : "bg-blue-600 text-white hover:bg-blue-700")}><Video size={14} /> Generate</button>
        </div>
        
        <textarea className={modalTextAreaClass} rows={2} placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        
        {form.assignedToName && (
          <div className={cn("p-3 rounded-xl flex justify-between items-center border", isMatrix ? "bg-indigo-955/20 border-indigo-900/50 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-850")}>
             <span className="text-xs font-bold">Assigning to: {form.assignedToName}</span>
             <button onClick={() => setForm(f => ({...f, assignedToId: '', assignedToName: ''}))} className="text-indigo-400 hover:text-indigo-600"><X size={14}/></button>
          </div>
        )}

        <button onClick={addEvent} className={modalSaveBtnClass}>
          {form.assignedToId ? 'Assign Event & Notify' : 'Create Event'}
        </button>
      </div>
    </div>
  );

  const renderSearchAssignModal = () => showSearchAssign && (
    <div className={modalOverlayClass} onClick={() => setShowSearchAssign(false)}>
      <div className={modalContentClass} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h3 className={modalTitleClass}>Search User to Assign Event</h3>
          <button onClick={() => setShowSearchAssign(false)} className={cn("transition-colors", isMatrix ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-600")}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSearchUsers} className="relative">
           <input 
             className={modalInputClass} 
             placeholder="Search by name or email..." 
             value={searchQuery} 
             onChange={e => setSearchQuery(e.target.value)} 
             autoFocus
           />
           <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
           <button type="submit" className={cn("absolute right-2 top-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all", isMatrix ? "bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 hover:bg-[#134D36]" : "bg-indigo-600 text-white hover:bg-indigo-700")}>
             {isSearching ? '...' : 'Search'}
           </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-2 mt-4">
             <p className={modalLabelClass}>Results</p>
             {searchResults.map(u => (
               <div key={u.id} className={cn("flex items-center justify-between p-3 border rounded-xl transition-all cursor-pointer", isMatrix ? "border-slate-900 bg-slate-950/40 hover:border-[#D4AF77]/30 hover:bg-[#0c1326]" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50")}
                 onClick={() => {
                   setForm(f => ({ ...f, assignedToId: u.id, assignedToName: u.displayName || u.fullName || u.email }));
                   setShowSearchAssign(false);
                   setShowForm(true);
                 }}
               >
                 <div>
                   <p className={cn("font-bold text-sm", isMatrix ? "text-white" : "text-slate-800")}>{u.displayName || u.fullName || 'Unknown'}</p>
                   <p className="text-xs text-slate-500">{u.email}</p>
                 </div>
                 <span className={cn("text-xs font-bold px-2 py-1 rounded-md", isMatrix ? "bg-[#0A3D2A] text-[#D4AF77]" : "bg-indigo-50 text-indigo-600")}>Assign</span>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-6 animate-in fade-in duration-500", isMatrix ? "text-slate-100" : "text-slate-800")}>
      {renderModal()}
      {renderSearchAssignModal()}
      {renderEventDetailsModal()}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className={titleClass}>
              {isMatrix && <Shield className="text-[#D4AF77] shrink-0" size={24} />}
              {title || 'My Calendar'}
            </h2>
            
            {/* FOUNDER MODE SELECTOR */}
            {isFounder && (
              <div className={cn("flex items-center gap-1 p-1 rounded-xl shadow-sm border", isMatrix ? "bg-slate-950 border-slate-900" : "bg-slate-100 border-slate-200/50")}>
                <button 
                  onClick={() => {
                    setCalendarMode('founder');
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", 
                    calendarMode === 'founder' 
                      ? isMatrix 
                        ? "bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 shadow-md" 
                        : "bg-purple-600 text-white shadow-sm" 
                      : "text-slate-505 hover:bg-white/5"
                  )}
                >
                  🔒 Private Master
                </button>
                <button 
                  onClick={() => {
                    setCalendarMode('operations');
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", 
                    calendarMode === 'operations' 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : isMatrix 
                        ? "text-slate-400 hover:text-white hover:bg-white/5" 
                        : "text-slate-500 hover:bg-slate-200"
                  )}
                >
                  🤝 Operations Shared
                </button>
              </div>
            )}
          </div>
          <p className={subtitleClass}>{subtitle || 'Oversight • Schedule • Live Integration Engine'}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View toggle */}
          <div className={tabsWrapperClass}>
            {(['day', 'week', 'month'] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)} className={tabBtnClass(view === v)}>{v}</button>
            ))}
          </div>
          <button onClick={goToday} className={todayBtnClass}>Today</button>

          {/* DYNAMIC GCAL SELECTORS */}
          {isFounder && (
            <>
              <div className={cn("flex items-center border rounded-xl overflow-hidden shadow-sm h-9", isMatrix ? "bg-blue-955/40 border-blue-900/50" : "bg-blue-50 border-blue-200")}>
                <button onClick={openGoogleCalendar} className={cn("px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-all border-r h-9", isMatrix ? "text-blue-400 hover:bg-blue-900/30 border-blue-900/30" : "text-blue-700 hover:bg-blue-100 border-blue-200/50")}>
                  <CalIcon size={14} /> Personal GCal
                </button>
                <select 
                  className={cn("px-2 py-2 bg-transparent text-xs font-bold outline-none cursor-pointer transition-all border-none h-9 pr-6", isMatrix ? "text-blue-400 hover:bg-blue-900/20" : "text-blue-700 hover:bg-blue-100/50")}
                  value={selectedGCalEmail}
                  onChange={(e) => setSelectedGCalEmail(e.target.value)}
                >
                  {PERSONAL_EMAILS.map(email => (
                    <option key={email} value={email} className={isMatrix ? "bg-[#0c1326] text-slate-350" : ""}>{email}</option>
                  ))}
                </select>
              </div>

              <div className={cn("flex items-center border rounded-xl overflow-hidden shadow-sm h-9", isMatrix ? "bg-pink-955/40 border-pink-900/50" : "bg-pink-50 border-pink-200")}>
                <button onClick={() => window.open(`https://calendar.google.com/calendar/u/0/r?authuser=${selectedOpsEmail}`, '_blank')} className={cn("px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-all border-r h-9", isMatrix ? "text-pink-400 hover:bg-pink-900/30 border-pink-900/30" : "text-pink-700 hover:bg-pink-100 border-pink-200/50")}>
                  <CalIcon size={14} /> Operations GCal
                </button>
                <select 
                  className={cn("px-2 py-2 bg-transparent text-xs font-bold outline-none cursor-pointer transition-all border-none h-9 pr-6", isMatrix ? "text-pink-400 hover:bg-pink-900/20" : "text-pink-700 hover:bg-pink-100/50")}
                  value={selectedOpsEmail}
                  onChange={(e) => setSelectedOpsEmail(e.target.value)}
                >
                  {OPS_EMAILS.map(email => (
                    <option key={email} value={email} className={isMatrix ? "bg-[#0c1326] text-slate-355" : ""}>{email}</option>
                  ))}
                </select>
              </div>

              <button onClick={() => window.open(getOpsCalendlyUrl(selectedOpsEmail), '_blank')} className={cn("px-4 py-2 border rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors h-9", isMatrix ? "border-pink-900/50 bg-pink-950/40 text-pink-400 hover:bg-pink-900/30" : "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100")}>
                <CalIcon size={14} /> Calendly Page
              </button>
            </>
          )}

          {/* Shared Action Toolbar */}
          <div className={cn("flex items-center gap-2 border-l pl-3", isMatrix ? "border-slate-900" : "border-slate-200")}>
            {(isFounder || user?.role === 'chief_compliance_director') && (
              <button onClick={() => setShowSearchAssign(true)} className={cn("px-4 py-2.5 border rounded-xl text-xs font-black flex items-center gap-2 transition-colors shadow-sm", isMatrix ? "border-slate-800 bg-[#0c1326] text-[#D4AF77] hover:bg-white/5" : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100")}><Search size={14} /> Search & Assign</button>
            )}
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate, category: 'task' })); setShowForm(true); }} className={toolbarBtnClass('task')}><CheckSquare size={14} /> Task</button>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate, category: 'reminder' })); setShowForm(true); }} className={toolbarBtnClass('reminder')}><Bell size={14} /> Reminder</button>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate })); setShowForm(true); }} className={toolbarBtnClass('new')}><Plus size={14} /> New Event</button>
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <div className={navBarClass}>
        <div className="flex items-center gap-2">
          {(view === 'day' || view === 'week') && (
            <button onClick={() => setView('month')} className={backToMonthClass}>
              <ChevronLeft size={16} /> Back to Month
            </button>
          )}
          <button onClick={() => navigate(-1)} className={navBtnHoverClass}><ChevronLeft size={20} /></button>
        </div>
        <h3 className={navTitleClass}>
          {view === 'month' && `${monthNames[current.getMonth()]} ${current.getFullYear()}`}
          {view === 'week' && `Week of ${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          {view === 'day' && new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        <button onClick={() => navigate(1)} className={navBtnHoverClass}><ChevronRight size={20} /></button>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex items-center gap-2">
        <label htmlFor="category-filter-select" className={filterLabelClass}>Filter by Category:</label>
        <select
          id="category-filter-select"
          value={filterCat || ''}
          onChange={(e) => setFilterCat(e.target.value || null)}
          className={filterSelectClass}
        >
          <option value="" className={isMatrix ? "bg-[#0c1326] text-slate-350" : ""}>All Categories</option>
          {ALL_CATEGORIES.map(c => (
            <option key={c.id} value={c.id} className={isMatrix ? "bg-[#0c1326] text-slate-200" : ""}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* BOOKING LINKS — Only visible to the Founder for CRM/Scheduler administration */}
      {isFounder && filterCat === 'ops' && (
        <div className={bookingPanelClass}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={bookingHeaderClass}>
                <span className="w-6 h-6 bg-[#0c1326] rounded-lg flex items-center justify-center text-white text-[10px]">📅</span>
                Scheduling Links Command Center
              </h3>
              <p className={bookingSubtitleClass}>Active Channels • Click to Book on Calendly & Carepatron</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              { label: '🏥 Medical Card (Std)', url: 'https://calendly.com/globalgreenhpmeet/medical-card-recommendation', src: 'Calendly' },
              { label: '🏥 Medical Card (Disc)', url: 'https://calendly.com/globalgreenhpmeet/medical-card-recommendation-clone', src: 'Calendly' },
              { label: '🩺 Patient Support', url: 'https://calendly.com/globalgreenhpmeet/general-patient-support', src: 'Calendly' },
              { label: '💚 Health & Wellness', url: 'https://calendly.com/globalgreenhpmeet/health-wellness-consultation', src: 'Calendly' },
              { label: '🛠️ IT Support', url: 'https://calendly.com/globalgreenhpmeet/it-technical-support', src: 'Calendly' },
              { label: '📚 Online Classes', url: 'https://calendly.com/globalgreenhpmeet/online-classes', src: 'Calendly' },
              { label: '🎯 GGHP Demo', url: 'https://calendly.com/globalgreenhpmeet/gghp-demo', src: 'Calendly' },
              { label: '💻 GGP-OS Platform', url: 'https://calendly.com/globalgreenhpmeet/calendly-com-ggp-os', src: 'Calendly' },
              { label: '🤝 Business Meeting', url: 'https://calendly.com/globalgreenhpmeet/business-meeting', src: 'Calendly' },
              { label: '📊 Business Consult', url: 'https://calendly.com/globalgreenhpmeet/general-business-consultation', src: 'Calendly' },
              { label: '📋 Retail Compliance', url: 'https://calendly.com/globalgreenhpmeet/retail-compliance-pro', src: 'Calendly' },
              { label: '🔍 SINC Oversight', url: 'https://calendly.com/globalgreenhpmeet/sinc-oversight-directives', src: 'Calendly' },
              { label: '📡 Metrc Integration', url: 'https://calendly.com/globalgreenhpmeet/metrc-integration-mastery', src: 'Calendly' },
              { label: '⚖️ Legal Consultation', url: 'https://calendly.com/globalgreenhpmeet/legal-consultation', src: 'Calendly' },
              { label: '🏥 Carepatron Booking', url: 'https://book.carepatron.com/Diversity-Health---Wellness-Network--GoHealthUSA---CCardz-/All?p=MeBev6pvQWuqD4djocNXFg', src: 'Carepatron' },
            ].map(link => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                className={bookingBtnClass(link.src)}
              >
                <span className="truncate">{link.label}</span>
                <span className={bookingBadgeClass(link.src)}>{link.src}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* === MONTH VIEW === */}
      {view === 'month' && (
        <div className={gridContainerClass}>
          <div className={gridHeaderClass}>
            {dayNames.map(d => <div key={d} className={gridHeaderDayNameClass}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map(({ date, inMonth }, i) => {
              const ds = fmt(date);
              const dayEvts = eventsOn(ds);
              const isToday = ds === fmt(new Date());
              const isSelected = ds === selectedDate;
              return (
                <div key={i} onClick={() => { setSelectedDate(ds); setView('day'); }}
                  className={cellClass(inMonth, isSelected, isToday)}>
                  <div className={cellDateNumberClass(isToday, inMonth)}>{date.getDate()}</div>
                  <div className="space-y-0.5">{dayEvts.slice(0, 3).map(ev => renderEventChip(ev, true))}{dayEvts.length > 3 && <div className="text-[9px] text-slate-500 font-bold">+{dayEvts.length - 3} more</div>}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === WEEK VIEW === */}
      {view === 'week' && (
        <div className={gridContainerClass}>
          <div className={cn("grid grid-cols-8 border-b", isMatrix ? "border-slate-900 bg-[#0c1326]/50" : "border-slate-100")}>
            <div className={cn("py-3 px-2 text-[10px] font-black border-r", isMatrix ? "text-slate-550 border-slate-900 bg-[#0c1326]/30" : "text-slate-450 border-slate-100")} />
            {weekDays.map(d => {
              const ds = fmt(d); const isToday = ds === fmt(new Date());
              return (<div key={ds} onClick={() => { setSelectedDate(ds); setView('day'); }}
                className={cn("py-3 text-center cursor-pointer hover:bg-indigo-50/50", isToday && (isMatrix ? "bg-[#0A3D2A]/20" : "bg-emerald-50"))}>
                <div className="text-[10px] font-black text-slate-500 uppercase">{dayNames[d.getDay()]}</div>
                <div className={cn("text-lg font-black", isToday ? (isMatrix ? "text-[#D4AF77]" : "text-[#1a4731]") : (isMatrix ? "text-slate-350" : "text-slate-700"))}>{d.getDate()}</div>
              </div>);
            })}
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {HOURS.map(h => (
              <div key={h} className={cn("grid grid-cols-8 border-b min-h-[50px]", isMatrix ? "border-slate-900 bg-[#0c1326]/10" : "border-slate-50")}>
                <div className={cn("px-2 py-1 text-[10px] font-mono font-bold border-r text-right pr-3 pt-2", isMatrix ? "text-slate-550 border-slate-900 bg-[#0c1326]/20" : "text-slate-400 border-slate-100")}>{h > 12 ? h - 12 : h}{h >= 12 ? 'PM' : 'AM'}</div>
                {weekDays.map(d => {
                  const ds = fmt(d);
                  const hourEvts = eventsOn(ds).filter(ev => parseInt(ev.startTime) === h);
                  return (
                    <div key={ds} className={cn("border-r px-1 py-0.5 hover:bg-[#0c1326]/20 cursor-pointer", isMatrix ? "border-slate-900/60" : "border-slate-50")}
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
          <div className={timelinePanelClass}>
            <div className={timelineHeaderClass}>
              <h4 className={timelineTitleClass}>Timeline</h4>
              <span className="text-xs text-slate-500 font-bold">{eventsOn(selectedDate).length} events</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {HOURS.map(h => {
                const hourEvts = eventsOn(selectedDate).filter(ev => parseInt(ev.startTime) === h);
                return (
                  <div key={h} className={timelineRowClass}
                    onClick={() => { setForm(f => ({ ...f, date: selectedDate, startTime: `${String(h).padStart(2,'0')}:00`, endTime: `${String(h+1).padStart(2,'0')}:00` })); setShowForm(true); }}>
                    <div className={timelineTimeLabelClass}>{h > 12 ? h - 12 : h}:00 {h >= 12 ? 'PM' : 'AM'}</div>
                    <div className="flex-1 px-3 py-1">{hourEvts.map(ev => renderEventChip(ev))}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <div className={eventPanelClass}>
              <h4 className={eventPanelTitleClass}>
                <CalIcon size={16} className={eventPanelTitleIconClass} /> 
                Events for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </h4>
              <div className="space-y-3">
                {eventsOn(selectedDate).length === 0 && <p className="text-sm text-slate-500 italic">No events scheduled</p>}
                {renderDayEvents(selectedDate)}
              </div>
            </div>
            <button onClick={() => { setForm(f => ({ ...f, date: selectedDate })); setShowForm(true); }} className={eventPanelAddBtnClass}><Plus size={16} /> Add Event</button>
          </div>
        </div>
      )}
    </div>
  );
};
