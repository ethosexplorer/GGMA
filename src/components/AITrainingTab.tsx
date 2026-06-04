import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, Trash2, Shield, Plus, Info, RefreshCw, Cloud, CloudOff, 
  Calendar as CalIcon, Clock, Phone, Send, MessageSquare, Zap, 
  CheckSquare, Square, ChevronLeft, ChevronRight, X, Edit2, 
  UserCheck, AlertTriangle, Play, CheckCircle2, ListTodo, Archive, Mic
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LarryMedCardChatbot } from './LarryMedCardChatbot';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, getDocs, writeBatch, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Memory {
  id: string;
  timestamp: number;
  content: string;
}

interface TaskItem {
  id: string;
  docId: string;
  type: 'calendar' | 'task';
  title: string;
  date?: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  category?: string;
  color?: string;
  description?: string;
  attendees?: string;
  location?: string;
  meetLink?: string;
  assignedTo?: string;
  assignedBy?: string;
  status?: string;
  completed?: boolean;
  campaignId?: string;
  createdAt?: any;
}

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  executive: { label: 'Executive', color: 'bg-purple-500' },
  compliance: { label: 'Compliance', color: 'bg-amber-500' },
  telehealth: { label: 'Telehealth', color: 'bg-emerald-600' },
  federal: { label: 'Federal', color: 'bg-red-500' },
  state: { label: 'State Authority', color: 'bg-cyan-500' },
  ops: { label: 'Operations', color: 'bg-indigo-500' },
  admin_support: { label: 'Admin Support', color: 'bg-pink-500' },
  personal: { label: 'Personal', color: 'bg-slate-500' },
  task: { label: 'Task', color: 'bg-blue-500' },
  reminder: { label: 'Reminder', color: 'bg-orange-500' },
  marketing: { label: 'Marketing', color: 'bg-rose-500' },
};

const getLocalDateStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const AITrainingTab = ({ userProfile, onNavigate }: { userProfile: any; onNavigate?: (tabId: string) => void }) => {
  const defaultPersonalId = userProfile?.uid || userProfile?.role || 'default';
  
  // Workspace States
  const [activeDate, setActiveDate] = useState<string>(getLocalDateStr());
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMemoryDrawer, setShowMemoryDrawer] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [forwardingTask, setForwardingTask] = useState<TaskItem | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  
  // Dialer State
  const [dialNumber, setDialNumber] = useState('');
  const [dialerStatus, setDialerStatus] = useState<'ready' | 'offline' | 'busy'>('ready');
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    type: 'task' as 'calendar' | 'task',
    category: 'ops',
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    phone: '',
  });

  // DB States
  const [calEvents, setCalEvents] = useState<TaskItem[]>([]);
  const [realtimeTasks, setRealtimeTasks] = useState<TaskItem[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isSynced, setIsSynced] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  
  // Reset selected tasks on date change
  useEffect(() => {
    setSelectedTaskIds([]);
  }, [activeDate]);
  
  // Staff for Forwarding
  const STAFF_MEMBERS = [
    { id: 'ryan_ceo', name: 'Ryan Ferrari (CEO)', role: 'president' },
    { id: 'monica_green', name: 'Monica Green (Compliance)', role: 'chief_compliance_director' },
    { id: 'bob_moore', name: 'Bob Moore (Advisor)', role: 'advisor' },
    { id: 'sales_team', name: 'Sales Team', role: 'sales' },
    { id: 'support_team', name: 'Support Team', role: 'support' },
  ];

  // Load directives & memory
  useEffect(() => {
    if (!userProfile?.uid) return;
    const memRef = collection(db, 'users', userProfile.uid, 'ai_memory');
    const unsub = onSnapshot(memRef, (snap) => {
      const mems = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          timestamp: data.createdAt?.toDate?.()?.getTime() || Date.now(),
          content: data.content || '',
        };
      });
      mems.sort((a, b) => b.timestamp - a.timestamp);
      setMemories(mems);
      setIsSynced(true);
    }, () => setIsSynced(false));
    return () => unsub();
  }, [userProfile?.uid]);

  // Load Real-time Calendar Events
  useEffect(() => {
    const q = query(collection(db, 'calendar_events'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => {
        const data = d.data();
        return {
          id: `fb_${d.id}`,
          docId: d.id,
          type: 'calendar',
          title: data.title || '',
          date: data.date || '',
          startTime: data.startTime || '09:00',
          endTime: data.endTime || '10:00',
          category: data.category || 'task',
          color: data.color || 'bg-blue-500',
          description: data.description || '',
          attendees: data.attendees || '',
          location: data.location || '',
          meetLink: data.meetLink || '',
          assignedTo: data.assignedTo || '',
          assignedBy: data.assignedBy || '',
          completed: !!data.completed,
          createdAt: data.createdAt,
        } as TaskItem;
      });
      setCalEvents(items);
    });
    return () => unsub();
  }, []);

  // Load Real-time Marketing/Campaign Tasks
  useEffect(() => {
    const q = query(collection(db, 'realtime_tasks'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          docId: d.id,
          type: 'task',
          title: data.title || '',
          dueDate: data.dueDate || '',
          date: data.dueDate || '',
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          status: data.status || 'pending',
          completed: data.status === 'completed',
          priority: data.priority || 'medium',
          category: data.category || 'general',
          description: data.description || '',
          campaignId: data.campaignId || '',
          createdAt: data.createdAt,
        } as TaskItem;
      });
      setRealtimeTasks(items);
    });
    return () => unsub();
  }, []);

  // Dialer Status Event Synchronization
  useEffect(() => {
    const handleStatus = (e: any) => {
      if (e.detail && e.detail.status) {
        const s = e.detail.status.toLowerCase();
        if (s.includes('ready') || s.includes('available')) setDialerStatus('ready');
        else if (s.includes('offline') || s.includes('logout')) setDialerStatus('offline');
        else setDialerStatus('busy');
      }
    };
    window.addEventListener('twilio-status-change', handleStatus);
    return () => window.removeEventListener('twilio-status-change', handleStatus);
  }, []);

  // Process and Filter Tasks
  const { todayList, overdueList } = useMemo(() => {
    const combined = [...calEvents, ...realtimeTasks].filter(item => {
      const titleLower = (item.title || '').toLowerCase();
      const isRenewal = titleLower.startsWith('renewal:') || item.category === 'renewal';
      return !isRenewal;
    });
    
    // Scheduled for active date
    const today = combined.filter(item => {
      const d = item.type === 'calendar' ? item.date : item.dueDate;
      return d === activeDate;
    });

    // Overdue / Incomplete from the past
    const overdue = combined.filter(item => {
      const d = item.type === 'calendar' ? item.date : item.dueDate;
      if (!d || d >= activeDate) return false;
      const isDone = item.type === 'calendar' ? item.completed : item.status === 'completed';
      return !isDone;
    });

    // Apply active filters (All, Pending, Completed)
    const filterFn = (item: TaskItem) => {
      const isDone = item.type === 'calendar' ? item.completed : item.status === 'completed';
      if (filterMode === 'pending') return !isDone;
      if (filterMode === 'completed') return isDone;
      return true;
    };

    return {
      todayList: today.filter(filterFn),
      overdueList: overdue.filter(filterFn),
    };
  }, [calEvents, realtimeTasks, activeDate, filterMode]);

  // Task CRUD Functions
  const handleDeleteSelected = async () => {
    if (selectedTaskIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete the ${selectedTaskIds.length} selected tasks/events?`)) return;
    
    // Capture the IDs to delete before clearing selection
    const idsToDelete = [...selectedTaskIds];
    
    // Optimistically remove from local state immediately so items disappear
    setCalEvents(prev => prev.filter(e => !idsToDelete.includes(e.id)));
    setRealtimeTasks(prev => prev.filter(e => !idsToDelete.includes(e.id)));
    setSelectedTaskIds([]);

    try {
      // Split into chunks of 400 (Firestore batch limit is 500)
      const chunks: string[][] = [];
      for (let i = 0; i < idsToDelete.length; i += 400) {
        chunks.push(idsToDelete.slice(i, i + 400));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(id => {
          if (id.startsWith('fb_')) {
            const docId = id.replace('fb_', '');
            batch.delete(doc(db, 'calendar_events', docId));
          } else {
            batch.delete(doc(db, 'realtime_tasks', id));
          }
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Failed to delete selected tasks:', err);
      alert(`Failed to delete some tasks: ${(err as any)?.message || 'Unknown error'}. They may reappear on refresh.`);
    }
  };

  const handleToggleComplete = async (item: TaskItem) => {
    if (item.type === 'calendar') {
      const nextCompleted = !item.completed;
      await updateDoc(doc(db, 'calendar_events', item.docId), { completed: nextCompleted });
    } else {
      const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
      await updateDoc(doc(db, 'realtime_tasks', item.docId), { status: nextStatus });
    }
  };

  const handleDeleteTask = async (item: TaskItem) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    if (item.type === 'calendar') {
      await deleteDoc(doc(db, 'calendar_events', item.docId));
    } else {
      await deleteDoc(doc(db, 'realtime_tasks', item.docId));
    }
  };

  const handleForwardTask = async (memberId: string) => {
    if (!forwardingTask) return;
    const task = forwardingTask;
    const member = STAFF_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    try {
      if (task.type === 'calendar') {
        await updateDoc(doc(db, 'calendar_events', task.docId), { assignedTo: member.id });
      } else {
        await updateDoc(doc(db, 'realtime_tasks', task.docId), { assignedTo: member.id });
      }

      await addDoc(collection(db, 'notifications'), {
        userId: member.id,
        title: 'Forwarded Personal Task',
        message: `Founder forwarded a task to you: ${task.title}`,
        createdAt: serverTimestamp(),
        read: false
      });

      alert(`Task forwarded to ${member.name}!`);
      setForwardingTask(null);
    } catch (err) {
      console.error(err);
      alert('Failed to forward task.');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const categoryColor = CATEGORY_MAP[form.category]?.color || 'bg-slate-500';
      if (form.type === 'calendar') {
        await addDoc(collection(db, 'calendar_events'), {
          title: form.title,
          date: activeDate,
          startTime: form.startTime,
          endTime: form.endTime,
          category: form.category,
          color: categoryColor,
          description: form.description + (form.phone ? `\nPhone: ${form.phone}` : ''),
          assignedTo: defaultPersonalId,
          assignedBy: defaultPersonalId,
          completed: false,
          createdAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'realtime_tasks'), {
          title: form.title,
          dueDate: activeDate,
          startTime: form.startTime,
          endTime: form.endTime,
          status: 'pending',
          priority: 'medium',
          category: form.category,
          description: form.description + (form.phone ? `\nPhone: ${form.phone}` : ''),
          createdAt: serverTimestamp(),
        });
      }

      setForm({ title: '', type: 'task', category: 'ops', startTime: '09:00', endTime: '10:00', description: '', phone: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create task.');
    }
  };

  // One-Click Campaign execution helper
  const handleResumeCampaign = (item: TaskItem) => {
    let campaignId = item.campaignId;
    let campaignSubject = '';
    
    if (!campaignId) {
      // Extract from title: "Continue Email Campaign: [Subject]"
      const match = item.title.match(/Continue Email Campaign:\s*(.+)/i);
      if (match) {
        campaignSubject = match[1].trim();
      }
    }

    if (campaignId) {
      sessionStorage.setItem('gghp_resume_campaign_id', campaignId);
    }
    if (campaignSubject) {
      sessionStorage.setItem('gghp_resume_campaign_subject', campaignSubject);
    }

    if (onNavigate) {
      onNavigate('marketing_hub');
    }
  };

  // Dial out helper
  const triggerDial = (number: string) => {
    if (!number) return;
    window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number } }));
  };

  const changeDialerStatus = (status: 'ready' | 'offline') => {
    const twilioStatus = status === 'ready' ? 'Ready' : 'Logged out';
    window.dispatchEvent(new CustomEvent('twilio-status-change', { detail: { status: twilioStatus } }));
    setDialerStatus(status);
  };

  // Parse phone from description
  const extractPhone = (desc: string) => {
    const match = desc?.match(/(?:phone|call|tel):\s*([\d+-]+)/i) || desc?.match(/(\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    return match ? match[1] : null;
  };

  const navigateDate = (dir: number) => {
    const d = new Date(activeDate + 'T12:00:00');
    d.setDate(d.getDate() + dir);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setActiveDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !userProfile?.uid) return;

    setIsSavingNote(true);
    try {
      await addDoc(collection(db, 'users', userProfile.uid, 'ai_memory'), {
        content: newNoteContent.trim(),
        createdAt: serverTimestamp(),
        createdBy: userProfile.displayName || userProfile.email || 'Executive',
      });
      setNewNoteContent('');
      setShowAddNoteModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const addManualDirective = async () => {
    const content = prompt('Enter a directive for Sylara to memorize:');
    if (!content?.trim() || !userProfile?.uid) return;

    try {
      await addDoc(collection(db, 'users', userProfile.uid, 'ai_memory'), {
        content: content.trim(),
        createdAt: serverTimestamp(),
        createdBy: userProfile.displayName || userProfile.email || 'Executive',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMemory = async (memId: string) => {
    if (!userProfile?.uid) return;
    try {
      await deleteDoc(doc(db, 'users', userProfile.uid, 'ai_memory', memId));
    } catch (err) {
      console.error(err);
    }
  };

  const dateLabel = new Date(activeDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="flex h-full w-full gap-6 min-h-0 relative">
      
      {/* ── LEFT PANEL: Master Daily Checklist & Dialer (60% width) ── */}
      <div className="w-[58%] bg-slate-900 border border-slate-800 text-white rounded-[2.5rem] p-6 flex flex-col h-full shadow-2xl overflow-hidden relative">
        
        {/* Workspace Header */}
        <div className="flex justify-between items-start border-b border-slate-800/80 pb-4 mb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <h2 className="text-xl font-black italic tracking-tighter uppercase">Executive Workspace</h2>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-0.5">Live Daily Ops Command Console</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowMemoryDrawer(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-none cursor-pointer"
            >
              <Brain size={12} className="text-purple-400" /> Stored Directives
            </button>
            <button 
              onClick={() => setShowAddNoteModal(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-none cursor-pointer"
            >
              <Plus size={12} className="text-purple-400" /> Add Note
            </button>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 border-none cursor-pointer"
            >
              <Plus size={12} /> Add Task
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex justify-between items-center bg-slate-950/60 rounded-2xl px-4 py-2 border border-slate-800/50 mb-4 shrink-0">
          <button onClick={() => navigateDate(-1)} className="p-1 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"><ChevronLeft size={16} /></button>
          <span className="text-xs font-black text-slate-300 tracking-tight">{dateLabel}</span>
          <button onClick={() => navigateDate(1)} className="p-1 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"><ChevronRight size={16} /></button>
        </div>

        {/* Task Checklist Filters */}
        <div className="flex justify-between items-center mb-3 shrink-0">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'pending', 'completed'] as const).map(mode => (
              <button 
                key={mode} 
                onClick={() => setFilterMode(mode)}
                className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none",
                  filterMode === mode ? "bg-indigo-600 text-white shadow-sm" : "bg-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{todayList.length} items for this day</span>
        </div>

        {/* Multi-select Control Bar */}
        {(todayList.length > 0 || overdueList.length > 0) && (
          <div className="flex justify-between items-center bg-slate-950/40 rounded-xl px-4 py-2 border border-slate-800/40 mb-3 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={
                  (todayList.length + overdueList.length) > 0 &&
                  selectedTaskIds.length === (todayList.length + overdueList.length)
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    const allIds = [...todayList, ...overdueList].map(item => item.id);
                    setSelectedTaskIds(allIds);
                  } else {
                    setSelectedTaskIds([]);
                  }
                }}
                className="accent-indigo-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Select All</span>
            </label>
            
            {selectedTaskIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-red-500/20 hover:border-red-500 cursor-pointer"
              >
                🗑️ Delete Selected ({selectedTaskIds.length})
              </button>
            )}
          </div>
        )}

        {/* Scrollable Tasks List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 min-h-0">
          
          {/* Overdue/Incomplete Section */}
          {overdueList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle size={12} /> Overdue Backlog
              </h4>
              {overdueList.map(item => renderTaskCard(item, true))}
            </div>
          )}

          {/* Today's Tasks Section */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <ListTodo size={12} /> Scheduled checklist
            </h4>
            {todayList.length === 0 && overdueList.length === 0 ? (
              <div className="text-center py-10 opacity-40">
                <CalIcon size={36} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-400">Workspace Clear</p>
                <p className="text-xs text-slate-500 mt-0.5">No tasks or appointments logged for this date.</p>
              </div>
            ) : (
              todayList.map(item => renderTaskCard(item, false))
            )}
          </div>

        </div>

        {/* ── Call Center Dialer Dashboard ── */}
        <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 shrink-0 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", 
                dialerStatus === 'ready' ? 'bg-emerald-500 animate-pulse' :
                dialerStatus === 'busy' ? 'bg-rose-500' : 'bg-slate-500'
              )} />
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Line Status: {dialerStatus}</span>
            </div>
            
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button 
                onClick={() => changeDialerStatus('ready')}
                className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all cursor-pointer border-none",
                  dialerStatus === 'ready' ? "bg-emerald-500/20 text-emerald-400" : "bg-transparent text-slate-600"
                )}
              >
                Online
              </button>
              <button 
                onClick={() => changeDialerStatus('offline')}
                className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all cursor-pointer border-none",
                  dialerStatus === 'offline' ? "bg-slate-800 text-slate-400" : "bg-transparent text-slate-600"
                )}
              >
                Offline
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="+1 (555) 555-5555" 
              value={dialNumber}
              onChange={e => setDialNumber(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={() => { triggerDial(dialNumber); setDialNumber(''); }}
              disabled={!dialNumber}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all border-none cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <Phone size={12} /> Call Out
            </button>
          </div>

          {/* Quick Staff Dials */}
          <div className="pt-2 border-t border-slate-900 flex justify-between gap-2 overflow-x-auto">
            {STAFF_MEMBERS.slice(0, 3).map(m => (
              <button 
                key={m.id}
                onClick={() => triggerDial(m.id === 'monica_green' ? '+15554466642' : m.id === 'ryan_ceo' ? '+15557799000' : '+15558833442')}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Phone size={10} className="text-emerald-500" /> {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── RIGHT PANEL: Sylara AI Chat Panel (40% width) ── */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative h-full">
        <div className="absolute inset-0">
          <LarryMedCardChatbot
            userProfile={userProfile}
            inline={true}
            onNavigate={(view: string) => {
              if (onNavigate) {
                onNavigate(view);
              }
            }}
          />
        </div>
      </div>

      {/* ── MODAL: Stored Directives / Memory Drawer ── */}
      {showMemoryDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-end animate-in fade-in duration-200">
          <div className="bg-slate-950 border-l border-slate-800 w-full max-w-md h-full shadow-2xl p-6 text-white flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Brain size={20} className="text-purple-400" />
                <h3 className="text-lg font-black italic uppercase">Stored Directives</h3>
              </div>
              <button 
                onClick={() => setShowMemoryDrawer(false)}
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-400 space-y-2 mb-4">
              <p className="font-bold text-slate-300 uppercase tracking-widest text-[9px] flex items-center gap-1.5"><Info size={12}/> How to train Sylara:</p>
              <p>Type message prefix <strong>Train:</strong>, <strong>Learn:</strong>, or <strong>Remember:</strong> in the chatbot screen. She will immediately capture the knowledge rule.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Directives ({memories.length})</span>
                <button onClick={addManualDirective} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest bg-transparent border-none cursor-pointer flex items-center gap-0.5"><Plus size={10}/> Add Manual</button>
              </div>

              {memories.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <Brain size={32} className="mx-auto text-slate-500 mb-2" />
                  <p className="text-sm font-semibold">Memory Matrix empty</p>
                </div>
              ) : (
                memories.map(mem => (
                  <div key={mem.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 relative group">
                    <button 
                      onClick={() => deleteMemory(mem.id)}
                      className="absolute top-2.5 right-2.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
                      title="Delete Directive"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">{new Date(mem.timestamp).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">{mem.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Create Event/Task Form ── */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl text-white relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-black italic uppercase mb-4 flex items-center gap-2"><Plus size={18}/> New Task or Event</h3>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g., Call compliance director"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Type</label>
                  <select 
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="task">Operations Task</option>
                    <option value="calendar">Calendar Event</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Category</label>
                  <select 
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    {Object.entries(CATEGORY_MAP).map(([id, item]) => (
                      <option key={id} value={id}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Start Time (Optional)</label>
                  <input 
                    type="time" 
                    value={form.startTime}
                    onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">End Time (Optional)</label>
                  <input 
                    type="time" 
                    value={form.endTime}
                    onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Phone Link (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 555-0000"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                  <textarea 
                    placeholder="Enter task details..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 h-20 resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest border-none cursor-pointer shadow-lg shadow-indigo-950/20"
              >
                Create & Sync
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Note/Directive Form ── */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl text-white relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowAddNoteModal(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-black italic uppercase mb-2 flex items-center gap-2">
              <Brain size={18} className="text-purple-400" /> Add Stored Directive
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">
              Add permanent background knowledge, directives, or strategy notes for Sylara.
            </p>
            
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Note Content *</label>
                <textarea 
                  required
                  placeholder="E.g., Learn: The primary medical clinic contact for California is DCC at (800) 555-0199..."
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 h-36 resize-none leading-relaxed"
                />
              </div>

              <button 
                type="submit"
                disabled={isSavingNote || !newNoteContent.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-xl text-xs uppercase tracking-widest border-none cursor-pointer shadow-lg shadow-indigo-950/20 flex items-center justify-center gap-1.5"
              >
                {isSavingNote ? 'Saving to Vault...' : 'Commit to Sylara\'s Memory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Forwarding Staff Selector ── */}
      {forwardingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl text-white relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setForwardingTask(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border-none cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-md font-black italic uppercase mb-2 flex items-center gap-2"><Send size={16} className="text-indigo-400"/> Forward Task</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Select a team member to delegate this event to:</p>
            
            <div className="space-y-2">
              {STAFF_MEMBERS.map(member => (
                <button 
                  key={member.id}
                  onClick={() => handleForwardTask(member.id)}
                  className="w-full p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-850 hover:border-indigo-500/50 text-left transition-all flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{member.name}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{member.role}</p>
                  </div>
                  <span className="text-[9px] font-black text-indigo-400 bg-indigo-950/40 px-2 py-1 rounded-md uppercase tracking-wider">Assign</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Helper to render individual task cards
  function renderTaskCard(item: TaskItem, isOverdue: boolean) {
    const isDone = item.type === 'calendar' ? item.completed : item.status === 'completed';
    const catData = CATEGORY_MAP[item.category || 'ops'] || { label: 'General', color: 'bg-slate-500' };
    const phone = extractPhone(item.description || '');
    const isCampaign = item.title.toLowerCase().includes('campaign') || !!item.campaignId;

    return (
      <div 
        key={item.id}
        className={cn(
          "p-3 rounded-2xl border transition-all flex items-start justify-between gap-4 group/card",
          isDone ? "bg-slate-900/30 border-slate-800/40 opacity-55" : "bg-slate-900/70 border-slate-800 hover:border-slate-700/80 shadow-md",
          isOverdue && !isDone && "border-rose-900/50 bg-rose-950/10"
        )}
      >
        <div className="flex items-start gap-3 min-w-0">
          <input 
            type="checkbox"
            checked={selectedTaskIds.includes(item.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTaskIds(prev => [...prev, item.id]);
              } else {
                setSelectedTaskIds(prev => prev.filter(id => id !== item.id));
              }
            }}
            className="mt-1.5 accent-indigo-500 w-3.5 h-3.5 shrink-0 cursor-pointer"
          />
          
          <div className="min-w-0">
            <p className={cn("text-xs font-bold leading-snug break-words", isDone ? "text-slate-500 line-through" : "text-white")}>
              {item.title}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-1.5 items-center">
              {/* Category tag */}
              <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white", catData.color)}>
                {catData.label}
              </span>
              
              {/* Time indicator */}
              {item.startTime && (
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <Clock size={10} /> {item.startTime} – {item.endTime}
                </span>
              )}

              {/* Created timestamp */}
              {item.createdAt && (
                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                  <CalIcon size={10} /> Created: {(() => {
                    const date = item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
                    const dStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                    const tStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    return `${dStr} ${tStr}`;
                  })()}
                </span>
              )}

              {/* Overdue/Due Date indicator */}
              {isOverdue && !isDone && (
                <span className="text-[8px] font-black uppercase tracking-widest text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle size={8} /> Overdue
                </span>
              )}
            </div>

            {item.description && !isDone && (
              <p className="text-[10px] text-slate-500 mt-1.5 whitespace-pre-wrap leading-relaxed pr-4">
                {item.description.replace(/phone:\s*[\d+-]+/i, '')}
              </p>
            )}

            {/* Live CTA Button Row — includes Mark Complete */}
            <div className="flex items-center gap-2 mt-2">
              <button 
                onClick={() => handleToggleComplete(item)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border-none cursor-pointer",
                  isDone 
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/35" 
                    : "bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300"
                )}
              >
                {isDone ? <><CheckCircle2 size={10} /> Completed</> : <><CheckSquare size={10} /> Mark Complete</>}
              </button>
              {isCampaign && !isDone && (
                <button 
                  onClick={() => handleResumeCampaign(item)}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border-none cursor-pointer"
                >
                  <Play size={8} /> Resume Send
                </button>
              )}
              {phone && !isDone && (
                <button 
                  onClick={() => triggerDial(phone)}
                  className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all border-none cursor-pointer"
                >
                  <Phone size={8} /> Dial Out
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Task Actions — always visible */}
        <div className="flex gap-1 shrink-0">
          <button 
            onClick={() => setForwardingTask(item)}
            className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer"
            title="Forward / Delegate Task"
          >
            <Send size={12} />
          </button>
          <button 
            onClick={() => handleDeleteTask(item)}
            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer"
            title="Delete Task"
          >
            <Trash2 size={12} />
          </button>
        </div>

      </div>
    );
  }
};
