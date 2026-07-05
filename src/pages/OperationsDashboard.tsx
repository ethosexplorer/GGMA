import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Headphones,
  Phone, PhoneCall, PhoneOff, PhoneIncoming, PhoneOutgoing, UserPlus, Globe, Zap, Database, CircleCheck, ShoppingCart, CreditCard, Check, Copy, Save, Edit, FileEdit } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { UserCalendar } from '../components/UserCalendar';
import { FounderCalendar } from '../components/FounderCalendar';
import { ITSupportDashboard } from '../components/it/ITSupportDashboard';
import { CallCenterCommandTab } from '../components/telephony/CallCenterCommandTab';
import { PhoneIntakeForm } from '../components/telephony/PhoneIntakeForm';
import { voip800 } from '../lib/voip800';
import { turso } from '../lib/turso';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';
import { DocumentVaultTab } from '../components/ops/DocumentVaultTab';
import { PostPaymentTab } from '../components/ops/PostPaymentTab';
import { PatientCaseTracker } from '../components/patient/PatientCaseTracker';
import { AccountLookupTab } from '../components/ops/AccountLookupTab';
import { ProductsServicesManager } from '../components/ops/ProductsServicesManager';
import { PaymentLookupTab } from '../components/ops/PaymentLookupTab';

const NAV_ITEMS = [
  { section: 'CALL CENTER' },
  { id: 'call_center', label: 'Call Center Command', icon: Phone },
  { id: 'phone_intake', label: 'Phone Intake Form', icon: UserPlus },
  { id: 'account_lookup', label: 'Account Lookup', icon: Search },
  { id: 'payment_lookup', label: 'Payment Lookup', icon: CreditCard },
  { section: 'SUPPORT OPERATIONS' },
  { id: 'operations_calendar', label: 'Operations Calendar', icon: Calendar },
  { id: 'support', label: 'Active Support Tickets', icon: MessageSquare, badge: '0' },
  { id: 'calls', label: 'Call Queue', icon: Headphones, badge: '0' },
  { id: 'backoffice', label: 'Escalations Queue', icon: Cpu, dot: true },
  { section: 'MANAGEMENT' },
  { id: 'it_support', label: 'IT Support & Diagnostics', icon: MonitorPlay },
  { id: 'hr_intelligence', label: 'HR Intelligence', icon: UserPlus },
  { id: 'applications', label: 'Applications Queue', icon: FileText },
  { id: 'document_vault', label: 'Document Vault', icon: FolderLock },
  { id: 'post_payment', label: 'Post Payment', icon: Wallet },
  { id: 'personnel', label: 'Personnel Force (Total)', icon: Users },
  { section: 'USER ASSISTANCE' },
  { id: 'patients', label: 'Patient Inquiries', icon: HeartPulse },
  { id: 'business', label: 'Business Inquiries', icon: Building2 },
  { section: 'PRODUCTS' },
  { id: 'products_services', label: 'Products & Services', icon: ShoppingCart },
];

export const OperationsDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('call_center');
  const [liveApplications, setLiveApplications] = useState<any[]>([]);
  const [selectedPatientCase, setSelectedPatientCase] = useState<any | null>(null);
  const [appsFilter, setAppsFilter] = useState('Pending');
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [businessSearch, setBusinessSearch] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesTempText, setNotesTempText] = useState('');
  const [copiedContactId, setCopiedContactId] = useState<string | null>(null);

  const isAppr = (s: string) => {
    const status = (s || '').toLowerCase();
    return status === 'state approved' || status === 'doctor recommendation approved' || status === 'state mailed';
  };
  const isFlag = (s: string) => {
    const status = (s || '').toLowerCase();
    return status === 'state rejected' || status === 'doctor recommendation rejected' || status === 'do not call';
  };
  const isPend = (s: string) => !isAppr(s) && !isFlag(s);

  const isMaster = user?.role === 'founder' || 
                   user?.role === 'executive_founder' || 
                   user?.role === 'executive' || 
                   user?.role === 'president' ||
                   user?.roleId === 'founder' ||
                   (user?.displayName || user?.name || '').toLowerCase().includes('founder') ||
                   (user?.displayName || user?.name || '').toLowerCase().includes('shantell');

  const updateApplicationStatus = async (
    patientUid: string,
    patientName: string,
    patientEmail: string,
    patientState: string,
    patientPhone: string,
    newStatus: string
  ) => {
    try {
      const staffName = user?.displayName || user?.name || 'Staff User';

      // 1. Update case_data main document in Firestore
      const caseRef = doc(db, 'users', patientUid, 'case_data', 'main');
      await setDoc(caseRef, {
        applicationStatus: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: staffName,
      }, { merge: true });

      // 2. Update users root document in Firestore
      const userRef = doc(db, 'users', patientUid);
      await setDoc(userRef, {
        applicationStatus: newStatus,
        fullName: patientName,
        name: patientName,
        email: patientEmail,
        phone: patientPhone,
        state: patientState,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // 3. Add to status_checks subcollection
      const checksRef = collection(db, 'users', patientUid, 'status_checks');
      await addDoc(checksRef, {
        checkedBy: staffName,
        checkedAt: serverTimestamp(),
        status: newStatus,
        notes: `🔄 Status updated directly in Operations applications queue.`,
      });

      // 4. Update local state immediately
      setLiveApplications(prev => prev.map(app => {
        if (app.uid === patientUid) {
          return {
            ...app,
            applicationStatus: newStatus
          };
        }
        return app;
      }));

    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const pendingAppsCount = liveApplications.filter(p => isPend(p.applicationStatus)).length;

  useEffect(() => {
    let firebaseUsers: any[] = [];
    let tursoUsers: any[] = [];
    let contactsUsers: any[] = [];

    const mergeData = () => {
      const list: any[] = [];

      const addOrMerge = (item: any) => {
        // Skip test records
        const emailLower = (item.email || '').toLowerCase().trim();
        const nameLower = (item.fullName || item.name || '').toLowerCase().trim();
        if (emailLower.includes('testagent') || emailLower.includes('test_agent') || nameLower.includes('test agent') || nameLower === 'test agent') {
          return; // Skip test records!
        }

        const phoneClean = (item.phone || '').replace(/\D/g, '');

        // Find if there is any existing item in list that matches email, phone, or name
        const existingIdx = list.findIndex(x => {
          const xEmail = (x.email || '').toLowerCase().trim();
          const xPhone = (x.phone || '').replace(/\D/g, '');
          const xName = (x.fullName || '').toLowerCase().trim();

          if (emailLower && xEmail && emailLower === xEmail) return true;
          if (phoneClean && xPhone && phoneClean === xPhone) return true;
          if (nameLower && xName && nameLower === xName) return true;
          return false;
        });

        if (existingIdx >= 0) {
          // Merge fields, prioritizing non-empty values
          const existing = list[existingIdx];
          list[existingIdx] = {
            ...existing,
            ...item,
            uid: item.uid || existing.uid,
            fullName: item.fullName || existing.fullName,
            email: item.email || existing.email,
            phone: item.phone || existing.phone,
            state: item.state || existing.state,
            applicationStatus: item.applicationStatus || existing.applicationStatus,
            applicationType: item.applicationType || existing.applicationType,
            createdAt: item.createdAt || existing.createdAt,
            accountId: item.accountId || existing.accountId,
            contactType: item.contactType || existing.contactType,
            source: existing.source === 'firebase' ? 'firebase' : item.source,
            payments: [...(existing.payments || []), ...(item.payments || [])]
          };
        } else {
          list.push(item);
        }
      };

      // 1. Load legacy Turso data first
      tursoUsers.forEach(t => {
        const safeName = typeof t.name === 'string' ? t.name : String(t.name || t.id);
        addOrMerge({
          uid: String(t.id || t.uid || `turso-${safeName}`),
          fullName: t.name || t.fullName || 'Unknown Patient',
          email: t.email || '',
          phone: t.phone || '',
          state: t.state || t.jurisdiction || 'Oklahoma',
          applicationStatus: t.status === 'Pending' ? 'Pending Review' : (t.status || 'Pending Review'),
          applicationType: t.applicationType || 'renewal',
          createdAt: t.created_at,
          contactType: 'patient',
          source: 'turso'
        });
      });

      // 2. Load contacts from captureContact (phone intakes, online submissions)
      contactsUsers.forEach(c => {
        addOrMerge({
          uid: c.id || `contact-${c.email || c.name}`,
          fullName: c.name || 'Unknown',
          email: c.email || '',
          phone: c.phone || '',
          state: c.state || c.jurisdiction || 'Oklahoma',
          applicationStatus: c.status || 'Pending Review',
          applicationType: c.applicationType || 'renewal',
          createdAt: c.createdAt,
          accountId: c.accountId || '',
          contactType: c.contactType || 'patient',
          source: 'contacts',
          payments: c.payments || [],
        });
      });

      // 3. Override with live Firebase real-time data
      firebaseUsers.forEach(f => {
        addOrMerge({
          uid: f.uid,
          fullName: f.fullName || f.name || f.displayName || 'Unknown Patient',
          email: f.email || '',
          phone: f.phone || f.textPhone || '',
          state: f.state || f.jurisdiction || 'Oklahoma',
          applicationStatus: f.applicationStatus || 'Pending Review',
          applicationType: f.applicationType || 'renewal',
          createdAt: f.createdAt,
          contactType: 'patient',
          source: 'firebase'
        });
      });

      setLiveApplications(list);
    };

    // Fetch Turso (Legacy)
    turso.execute('SELECT * FROM patients ORDER BY created_at DESC')
      .then((res: any) => {
        tursoUsers = res.rows;
        mergeData();
      }).catch(console.error);

    // Fetch Firebase contacts (Phone Intakes & Online Submissions)
    const unsubContacts = onSnapshot(collection(db, 'contacts'), (snap) => {
      contactsUsers = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((c: any) => {
          // Only include patient-type contacts (not business leads)
          const cType = (c.contactType || '').toLowerCase();
          return cType === 'patient' || cType === '' || cType === 'intake';
        });
      mergeData();
    });

    // Fetch Firebase users (Live)
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const adminRoles = ['admin', 'founder', 'executive', 'president', 'chief_compliance_director', 
        'executive_advisor', 'advisor', 'executive_founder', 'internal_admin', 'compliance_director',
        'manager', 'team_lead', 'rep', 'ai_agent'];
      
      firebaseUsers = snap.docs
        .map(d => ({ uid: d.id, ...d.data() }))
        .filter((u: any) => {
          const role = (u.role || '').toLowerCase().trim();
          if (adminRoles.some(ar => role.includes(ar))) return false;
          if (role === 'business' || role === 'provider' || role === 'attorney') return false;
          return true;
        });
      mergeData();
    });

    // Fetch all Firebase contacts in real-time for Inquiries tabs
    const unsubAllContacts = onSnapshot(collection(db, 'contacts'), (snap) => {
      setAllContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubUsers(); unsubContacts(); unsubAllContacts(); };
  }, []);

  // Draggable nav state with localStorage persistence
  const [opsNavItems, setOpsNavItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gghp_ops_nav_order');
      if (saved) {
        const savedIds = JSON.parse(saved) as string[];
        const idToItem = new Map(NAV_ITEMS.map((item, i) => [item.id || `ops-section-${i}`, item]));
        const ordered = savedIds.map(id => idToItem.get(id)).filter(Boolean) as typeof NAV_ITEMS;
        NAV_ITEMS.forEach((item, i) => { const key = item.id || `ops-section-${i}`; if (!savedIds.includes(key)) ordered.push(item); });
        return ordered;
      }
    } catch {}
    return [...NAV_ITEMS];
  });
  const [opsDragIdx, setOpsDragIdx] = useState<number | null>(null);
  const [opsEditIdx, setOpsEditIdx] = useState<number | null>(null);

  const opsHandleDragStart = (e: any, idx: number) => { setOpsDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; };
  const opsHandleDragOver = (e: any, idx: number) => {
    e.preventDefault();
    if (opsDragIdx === null || opsDragIdx === idx) return;
    const items = [...opsNavItems]; const item = items[opsDragIdx]; items.splice(opsDragIdx, 1); items.splice(idx, 0, item);
    setOpsDragIdx(idx); setOpsNavItems(items);
    localStorage.setItem('gghp_ops_nav_order', JSON.stringify(items.map((it, i) => it.id || `ops-section-${i}`)));
  };

  const [agentStatus, setAgentStatus] = useState('Available');

  useEffect(() => {
    let timer: any;
    // Sync with WebDialer floating widget
    window.dispatchEvent(new CustomEvent('twilio-status-change', { detail: { status: agentStatus } }));

    if (agentStatus === 'Available' || agentStatus === 'Ready') {
      // Listen for missed call event (mocked here, but sets the pattern)
      const checkMissedCalls = setInterval(() => {
         // In a live system, this would poll the queue or listen to a websocket.
         // If a call is missed while available, wait 30 seconds and log out.
         const missedCallDetected = false; // Placeholder for real webhook trigger
         if (missedCallDetected) {
            setAgentStatus('Logged out');
            (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Status changed to Logged out due to missed call." })] }).catch(console.error) ); alert("Status changed to Logged out due to missed call.\n\n[Live Production Transaction Logged]"); })();
         }
      }, 5000);
      return () => clearInterval(checkMissedCalls);
    }
  }, [agentStatus]);

  const [liveQueue, setLiveQueue] = useState(0);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [routingTab, setRoutingTab] = useState<'routing' | 'dialpad' | 'voicemails'>('routing');
  const [dialNumber, setDialNumber] = useState('');
  const [routingRules, setRoutingRules] = useState([
    { name: 'Main → Live Agent', dest: 'Live Sr Agent', type: 'Standard', icon: PhoneIncoming, active: true },
    { name: 'Overflow → Support', dest: 'Support Desk', type: 'Sequential', icon: PhoneOutgoing, active: true },
    { name: 'After Hours → VM', dest: 'VM Box #1', type: 'Scheduled', icon: PhoneOff, active: true },
  ]);
  const [voicemails, setVoicemails] = useState<any[]>([]);
  
  // Inline UI states for Transfer/Forward to avoid prompt()
  const [showTransfer, setShowTransfer] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [forwardTarget, setForwardTarget] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const qCount = await voip800.getQueueCount();
      setLiveQueue(qCount);
      const calls = await voip800.getCallHistory(10);
      const sortedCalls = calls.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentCalls(sortedCalls);
    };
    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Scaled: 5s→30s for 100k+ user support
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    voip800.getVoicemails().then(setVoicemails).catch(() => {});
  }, [routingTab]);

  const renderSupport = () => (
    <div className="space-y-6">
          

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Average Wait Time</h4>
            <p className="text-2xl font-black text-slate-800">0s</p>
         </div>
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Agents</h4>
            <p className="text-2xl font-black text-emerald-600">1</p>
         </div>
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resolution Rate</h4>
            <p className="text-2xl font-black text-indigo-600">100%</p>
         </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
         <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><MessageSquare size={18} className="text-blue-500" /> Active Conversations</h3>
         <div className="space-y-3">
            <div className="p-8 text-center text-slate-500 font-bold">No active support tickets.</div>
         </div>
      </div>
    </div>
  );

  const renderITSupport = () => (
    <div className="h-full w-full min-h-[70vh]">
      <ITSupportDashboard />
    </div>
  );

  const renderHRIntelligence = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-950 to-indigo-950 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-black flex items-center gap-2"><UserPlus size={22} className="text-purple-400" /> HR Intelligence (Sylara)</h2>
        <p className="text-purple-300 text-[10px] font-bold uppercase tracking-widest mt-1">Workforce Analytics & Talent Pipeline</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ l: 'Active Staff', v: '1', c: 'emerald' }, { l: 'Open Positions', v: '0', c: 'amber' }, { l: 'Applications', v: '1', c: 'blue' }, { l: 'Retention Rate', v: '100%', c: 'indigo' }].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className={`text-2xl font-black text-${s.c}-600`}>{s.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Recent Hires & Pipeline</h3>
        <div className="space-y-3">
          <div className="p-8 text-center text-slate-500 font-bold">No recent HR activity.</div>
        </div>
      </div>
    </div>
  );

  const renderApplicationsQueue = () => {
    if (selectedPatientCase) {
      return (
        <div className="bg-white border-4 border-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden max-h-full flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
            <button onClick={() => setSelectedPatientCase(null)} className="px-5 py-2 bg-slate-900 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2">
              <span className="text-lg leading-none mt-[-2px]">←</span> Back to Queue
            </button>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <FileText size={14} className="text-indigo-600" /> Patient Case File
            </h3>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <PatientCaseTracker
              patientUid={String(selectedPatientCase.uid || 'unknown-uid')}
              patientName={selectedPatientCase.fullName || selectedPatientCase.name || selectedPatientCase.displayName || 'Unknown'}
              patientEmail={selectedPatientCase.email || ''}
              patientState={selectedPatientCase.state || selectedPatientCase.jurisdiction || 'Oklahoma'}
              patientPhone={selectedPatientCase.phone || selectedPatientCase.textPhone || ''}
              staffName={user?.displayName || user?.name || 'Staff User'}
            />
          </div>
        </div>
      );
    }
    
    const pendingApps = liveApplications.filter(p => isPend(p.applicationStatus));
    const approvedApps = liveApplications.filter(p => isAppr(p.applicationStatus));
    const flaggedApps = liveApplications.filter(p => isFlag(p.applicationStatus));
    
    const displayApps = appsFilter === 'Pending' ? pendingApps : appsFilter === 'Approved' ? approvedApps : flaggedApps;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { l: 'Pending Review', v: pendingApps.length.toString(), c: 'amber', f: 'Pending' }, 
            { l: 'Approved Today', v: approvedApps.length.toString(), c: 'emerald', f: 'Approved' }, 
            { l: 'Rejected/Flagged', v: flaggedApps.length.toString(), c: 'red', f: 'Flagged' }
          ].map((s, i) => (
            <div key={i} onClick={() => setAppsFilter(s.f)} className={`bg-white border ${appsFilter === s.f ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'} rounded-2xl p-5 text-center transition-all cursor-pointer`}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
              <p className={`text-2xl font-black text-${s.c}-600`}>{s.v}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={16} className="text-indigo-600" /> Applications Queue: {appsFilter}</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {displayApps.map((a, i) => (
              <div key={a.uid || i} onClick={() => setSelectedPatientCase(a)} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-sm">
                     {(a.fullName || a.name || a.displayName || '?').charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{a.fullName || a.name || a.displayName || 'Unknown Patient'}</p>
                     <p className="text-xs text-slate-500 font-medium">
                       {a.applicationType === 'new_card' ? 'Patient New Card' : 'Patient Renewal'} • {a.state || a.jurisdiction || 'OK'}
                       {a.email ? ` • ${a.email}` : ''}
                     </p>
                   </div>
                </div>
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  {a.accountId && (
                    <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{a.accountId}</span>
                  )}
                  <select
                    value={a.applicationStatus || 'Lead'}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      await updateApplicationStatus(
                        a.uid,
                        a.fullName || a.name || a.displayName || '',
                        a.email || '',
                        a.state || 'Oklahoma',
                        a.phone || '',
                        newStatus
                      );
                    }}
                    className={cn(
                      "text-[10px] font-black uppercase px-2.5 py-1 rounded-xl border outline-none cursor-pointer transition-all",
                      a.applicationStatus && !isPend(a.applicationStatus)
                        ? (isAppr(a.applicationStatus) ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100/50' : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100/50')
                        : 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100/50'
                    )}
                  >
                    <option value="Lead">Lead</option>
                    <option value="Do not call">Do not call</option>
                    <option value="GGP account created">GGP account created</option>
                    <option value="State account created/access given">State account created/access given</option>
                    <option value="application appointment rescheduled">appointment rescheduled</option>
                    <option value="doctor appointment set">doctor appointment set</option>
                    <option value="Doctor recommendation appointment completed">rec completed</option>
                    <option value="doctor recommendation approved">rec approved</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="docs needed">docs needed</option>
                    <option value="admin Review">admin Review</option>
                    <option value="state application submitted">state application submitted</option>
                    <option value="state application pending">state application pending</option>
                    <option value="state rejected">state rejected</option>
                    <option value="state approved">state approved</option>
                    <option value="state mailed">state mailed</option>
                  </select>
                </div>
              </div>
            ))}
            {displayApps.length === 0 && (
              <div className="p-8 text-center text-slate-500 font-medium">No {appsFilter.toLowerCase()} applications in the queue.</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const [personnelList, setPersonnelList] = useState([
    { name: 'Live Sr Agent', role: 'Founder/CEO', dept: 'Executive', status: 'Active', empId: 'GGE-001', ext: '101' },
    { name: 'Monica Green', role: 'Compliance Director', dept: 'Compliance', status: 'Active', empId: 'GGE-002', ext: '102' },
    { name: 'Ryan Ferrari', role: 'CEO / IT Lead', dept: 'Operations', status: 'Active', empId: 'GGE-003', ext: '103' },
    { name: 'Bob Moore', role: 'Executive Advisor', dept: 'Executive', status: 'Active', empId: 'GGE-004', ext: '104' },
    { name: 'Larry AI', role: 'Compliance Service Officer', dept: 'AI Systems', status: 'Online', empId: 'GGE-A01', ext: '901' },
    { name: 'Sylara AI', role: 'Intake & HR Agent', dept: 'AI Systems', status: 'Online', empId: 'GGE-A02', ext: '902' },
  ]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', dept: 'Operations', empId: '', ext: '' });
  const [onboardingStep, setOnboardingStep] = useState(0);

  const DEPTS = ['Executive', 'Operations', 'Compliance', 'Sales', 'Support', 'AI Systems', 'Finance', 'Legal', 'IT', 'HR'];

  const handleCompleteOnboarding = () => {
    if (!newStaff.name || !newStaff.role) return (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Name and role are required" })] }).catch(console.error) ); alert("Name and role are required\n\n[Live Production Transaction Logged]"); })();
    setPersonnelList(prev => [...prev, { ...newStaff, status: 'Active' }]);
    setNewStaff({ name: '', role: '', dept: 'Operations' });
    setShowAddStaff(false);
    setOnboardingStep(0);
  };

  const renderPersonnel = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ l: 'Total Personnel', v: String(personnelList.length) }, { l: 'Active Today', v: String(personnelList.filter(p => p.status === 'Active' || p.status === 'Online').length) }, { l: 'On Leave', v: String(personnelList.filter(p => p.status === 'On Leave').length) }, { l: 'New This Month', v: '3' }].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className="text-2xl font-black text-slate-800">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Add Staff Onboarding Modal */}
      {showAddStaff && (
        <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus size={18} />
              <h4 className="font-black text-sm">Staff Onboarding — New Entry</h4>
            </div>
            <button onClick={() => { setShowAddStaff(false); setOnboardingStep(0); }} className="text-white/60 hover:text-white">✕</button>
          </div>
          <div className="p-5 space-y-4">
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-2">
              {['Info', 'Role', 'Review'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= onboardingStep ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                  <span className={`text-xs font-bold ${i <= onboardingStep ? 'text-indigo-600' : 'text-slate-400'}`}>{step}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 ${i < onboardingStep ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>

            {onboardingStep === 0 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Full Name *</label>
                  <input value={newStaff.name} onChange={(e) => setNewStaff(p => ({ ...p, name: e.target.value }))} placeholder="Enter full name" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                </div>
                <button onClick={() => newStaff.name ? setOnboardingStep(1) : (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Enter a name" })] }).catch(console.error) ); alert("Enter a name\n\n[Live Production Transaction Logged]"); })()} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold">Next →</button>
              </div>
            )}

            {onboardingStep === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Job Title / Role *</label>
                  <input value={newStaff.role} onChange={(e) => setNewStaff(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Dispensary Manager" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Department</label>
                  <select value={newStaff.dept} onChange={(e) => setNewStaff(p => ({ ...p, dept: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400">
                    {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOnboardingStep(0)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold">← Back</button>
                  <button onClick={() => newStaff.role ? setOnboardingStep(2) : (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Enter a role" })] }).catch(console.error) ); alert("Enter a role\n\n[Live Production Transaction Logged]"); })()} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold">Next →</button>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Onboarding Summary</p>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Name:</span><span className="font-bold text-slate-800">{newStaff.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Role:</span><span className="font-bold text-slate-800">{newStaff.role}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Department:</span><span className="font-bold text-slate-800">{newStaff.dept}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-600">Active</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Auto-generated:</span><span className="font-bold text-indigo-600">Employee ID ({newStaff.empId || `GGE-00${personnelList.length + 1}`}), Ext ({newStaff.ext || `${100 + personnelList.length + 1}`})</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOnboardingStep(1)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold">← Back</button>
                  <button onClick={() => {
                    const empId = `GGE-00${personnelList.length + 1}`;
                    const ext = `${100 + personnelList.length + 1}`;
                    setPersonnelList(prev => [...prev, { ...newStaff, empId, ext, status: 'Active' }]);
                    setNewStaff({ name: '', role: '', dept: 'Operations', empId: '', ext: '' });
                    setShowAddStaff(false);
                    setOnboardingStep(0);
                  }} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2">
                    <CircleCheck size={16} /> Complete Onboarding & Add to Directory
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={16} /> Personnel Directory</h3>
          <button onClick={() => setShowAddStaff(true)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md">
            <Plus size={14} /> Add Staff
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {personnelList.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Users size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{p.name} <span className="text-xs text-indigo-500 font-mono bg-indigo-50 px-1 py-0.5 rounded ml-2">{p.empId}</span></p>
                  <p className="text-xs text-slate-500">{p.role} • {p.dept}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ext</p>
                  <p className="text-sm font-bold text-slate-700 font-mono">{p.ext || '---'}</p>
                </div>
                <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-20 text-center", p.status === 'Active' || p.status === 'Online' ? 'text-emerald-600 bg-emerald-50' : p.status === 'On Leave' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100')}>{p.status}</span>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: p.ext } }))}
                  className="bg-sky-50 hover:bg-sky-100 text-sky-600 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <UserPlus size={12} /> Transfer
                </button>
                <button 
                  onClick={() => {
                    const newStatus = (p.status === 'Active' || p.status === 'Online') ? 'Logged Out' : 'Active';
                    const listCopy = [...personnelList];
                    listCopy[i].status = newStatus;
                    setPersonnelList(listCopy);
                    import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: `Force status change for ${p.name} to ${newStatus}` })] }).catch(console.error));
                  }}
                  className={cn("text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors", (p.status === 'Active' || p.status === 'Online') ? "bg-red-50 hover:bg-red-100 text-red-600" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600")}
                >
                  <LogOut size={12} /> {(p.status === 'Active' || p.status === 'Online') ? 'Log Out' : 'Log In'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const updateContactField = async (contactId: string, fieldName: string, value: any) => {
    try {
      const contactRef = doc(db, 'contacts', contactId);
      await updateDoc(contactRef, {
        [fieldName]: value,
        updatedAt: new Date().toISOString()
      });
      setAllContacts(prev => prev.map(c => c.id === contactId ? { ...c, [fieldName]: value } : c));
    } catch (err: any) {
      console.error('Error updating contact:', err);
      alert('Failed to update: ' + err.message);
    }
  };

  const handleCopyContactDetails = (c: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Name: ${c.name}
Email: ${c.email || 'N/A'}
Phone: ${c.phone || 'N/A'}
Location: ${c.city || ''}, ${c.state || ''} ${c.zip || ''}
Source: ${c.source || 'N/A'}
Notes: ${c.notes || 'No notes'}`;
    navigator.clipboard.writeText(text);
    setCopiedContactId(c.id);
    setTimeout(() => setCopiedContactId(null), 2000);
  };

  const renderPatientInquiries = () => {
    const patients = allContacts.filter(c => {
      const type = (c.contactType || '').toLowerCase();
      const src = (c.source || '').toLowerCase();
      return type === 'patient' || src.includes('patient') || type === 'intake';
    });

    const displayPatients = patients.filter(c => {
      if (!patientSearch.trim()) return true;
      const q = patientSearch.toLowerCase();
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.state || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.notes || '').toLowerCase().includes(q) ||
        (c.source || '').toLowerCase().includes(q)
      );
    });

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10"><HeartPulse size={80} /></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                <HeartPulse size={20} className="text-emerald-400" />
              </div>
              Patient Inquiries & Leads
            </h2>
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mt-1">Manage prospective patient registrations, phone intakes, and online inquiries</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Patient Contacts', value: String(patients.length), color: 'text-emerald-600', icon: Users },
            { label: 'Online Signups', value: String(patients.filter(p => p.source === 'patient_signup').length), color: 'text-indigo-600', icon: Globe },
            { label: 'Phone Intakes', value: String(patients.filter(p => p.source === 'phone_intake_patient').length), color: 'text-sky-600', icon: Phone },
            { label: 'Active Leads', value: String(patients.filter(p => p.status === 'active').length), color: 'text-amber-600', icon: Activity }
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                <s.icon size={14} className={s.color} />
              </div>
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search patients by name, email, phone, location, source, or notes..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 font-medium"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Patient Inquiries Log ({displayPatients.length})</h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {displayPatients.length === 0 ? (
              <div className="p-16 text-center text-slate-500 font-bold">No patient inquiries found matching the query.</div>
            ) : displayPatients.map((c) => {
              const isSelected = selectedContactId === c.id;
              const isEditingNotes = editingNotesId === c.id;

              return (
                <div key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <div
                    onClick={() => {
                      setSelectedContactId(isSelected ? null : c.id);
                      setEditingNotesId(null);
                    }}
                    className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                        {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-800">{c.name}</p>
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 capitalize">
                            {(c.source || 'Lead').replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.phone || 'No phone'} • {c.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {c.city ? `${c.city}, ` : ''}{c.state || 'N/A'}
                      </span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                        {c.status || 'Active'}
                      </span>
                      {isSelected ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="bg-slate-50/50 border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Full Name', value: c.name, icon: User },
                          { label: 'Email Address', value: c.email || 'None', icon: Mail },
                          { label: 'Phone Number', value: c.phone || 'None', icon: Phone },
                          { label: 'State Jurisdiction', value: c.state || 'N/A', icon: Globe },
                          { label: 'City', value: c.city || 'N/A', icon: Globe },
                          { label: 'Zip Code', value: c.zip || 'N/A', icon: Globe },
                          { label: 'Registration Source', value: c.source || 'N/A', icon: FileText },
                          { label: 'Date Logged', value: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A', icon: Calendar }
                        ].map((f, i) => (
                          <div key={i}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                              <f.icon size={10} /> {f.label}
                            </p>
                            <p className="text-xs font-semibold text-slate-700">{f.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <FileText size={12} /> Notes & Inquiries Details
                          </p>
                          {!isEditingNotes ? (
                            <button
                              onClick={() => {
                                setEditingNotesId(c.id);
                                setNotesTempText(c.notes || '');
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                              <Edit size={10} /> Edit Notes
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  await updateContactField(c.id, 'notes', notesTempText);
                                  setEditingNotesId(null);
                                }}
                                className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                              >
                                <Save size={10} /> Save
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditingNotes ? (
                          <textarea
                            value={notesTempText}
                            onChange={(e) => setNotesTempText(e.target.value)}
                            rows={3}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none leading-relaxed"
                          />
                        ) : (
                          <p className="text-xs text-slate-600 whitespace-pre-wrap">{c.notes || 'No notes or inquiries submitted.'}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                        {c.phone && (
                          <button
                            onClick={() => window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: c.phone } }))}
                            className="px-4 py-2 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <Phone size={12} /> Call Patient
                          </button>
                        )}
                        <button
                          onClick={(e) => handleCopyContactDetails(c, e)}
                          className={cn("px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-sm border",
                            copiedContactId === c.id
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          {copiedContactId === c.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Details</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessInquiries = () => {
    const businesses = allContacts.filter(c => {
      const type = (c.contactType || '').toLowerCase();
      const src = (c.source || '').toLowerCase();
      return type !== 'patient' && !src.includes('patient') && type !== 'intake';
    });

    const displayBusinesses = businesses.filter(c => {
      if (!businessSearch.trim()) return true;
      const q = businessSearch.toLowerCase();
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.businessName || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.state || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.notes || '').toLowerCase().includes(q) ||
        (c.source || '').toLowerCase().includes(q)
      );
    });

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Building2 size={80} /></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-indigo-400" />
              </div>
              Business Inquiries & B2B Leads
            </h2>
            <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mt-1">Track compliance inquiries, business license leads, and dispensary partnership signups</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total B2B Contacts', value: String(businesses.length), color: 'text-indigo-600', icon: Users },
            { label: 'Dispensary Leads', value: String(businesses.filter(b => b.contactType === 'dispensary').length), color: 'text-emerald-600', icon: Store },
            { label: 'Growers & Processors', value: String(businesses.filter(b => b.contactType === 'grower' || b.contactType === 'processor').length), color: 'text-green-600', icon: Sprout },
            { label: 'Phone Intakes', value: String(businesses.filter(b => b.source === 'phone_intake_business').length), color: 'text-sky-600', icon: Phone }
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                <s.icon size={14} className={s.color} />
              </div>
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={businessSearch}
              onChange={(e) => setBusinessSearch(e.target.value)}
              placeholder="Search B2B leads by company name, contact, email, phone, location, notes..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Business Contacts Log ({displayBusinesses.length})</h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {displayBusinesses.length === 0 ? (
              <div className="p-16 text-center text-slate-500 font-bold">No business inquiries found matching the query.</div>
            ) : displayBusinesses.map((c) => {
              const isSelected = selectedContactId === c.id;
              const isEditingNotes = editingNotesId === c.id;

              return (
                <div key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <div
                    onClick={() => {
                      setSelectedContactId(isSelected ? null : c.id);
                      setEditingNotesId(null);
                    }}
                    className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-800">{c.businessName || c.name || 'Unnamed Corporate'}</p>
                          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 capitalize">
                            {(c.contactType || 'B2B Lead').replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.name ? `${c.name} • ` : ''}{c.phone || 'No phone'} • {c.email || 'No email'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {c.city ? `${c.city}, ` : ''}{c.state || 'N/A'}
                      </span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                        {c.status || 'Active'}
                      </span>
                      {isSelected ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="bg-slate-50/50 border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Business Legal Name', value: c.businessName || 'N/A', icon: Building2 },
                          { label: 'Contact Person', value: c.name || 'N/A', icon: User },
                          { label: 'Email Address', value: c.email || 'None', icon: Mail },
                          { label: 'Phone Number', value: c.phone || 'None', icon: Phone },
                          { label: 'Jurisdiction', value: c.state || 'N/A', icon: Globe },
                          { label: 'License Type Offered', value: c.licenseType || 'N/A', icon: FileText },
                          { label: 'License Number', value: c.licenseNumber || 'N/A', icon: FileText },
                          { label: 'EIN Number', value: c.ein || 'N/A', icon: FileText }
                        ].map((f, i) => (
                          <div key={i}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                              <f.icon size={10} /> {f.label}
                            </p>
                            <p className="text-xs font-semibold text-slate-700">{f.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <FileText size={12} /> Notes & Inquiries Details
                          </p>
                          {!isEditingNotes ? (
                            <button
                              onClick={() => {
                                setEditingNotesId(c.id);
                                setNotesTempText(c.notes || '');
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                              <Edit size={10} /> Edit Notes
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  await updateContactField(c.id, 'notes', notesTempText);
                                  setEditingNotesId(null);
                                }}
                                className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                              >
                                <Save size={10} /> Save
                              </button>
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditingNotes ? (
                          <textarea
                            value={notesTempText}
                            onChange={(e) => setNotesTempText(e.target.value)}
                            rows={3}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none leading-relaxed"
                          />
                        ) : (
                          <p className="text-xs text-slate-600 whitespace-pre-wrap">{c.notes || 'No notes or inquiries submitted.'}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                        {c.phone && (
                          <button
                            onClick={() => window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: c.phone } }))}
                            className="px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <Phone size={12} /> Call Contact
                          </button>
                        )}
                        <button
                          onClick={(e) => handleCopyContactDetails(c, e)}
                          className={cn("px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-sm border",
                            copiedContactId === c.id
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          {copiedContactId === c.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Details</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAccessRestricted = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white border border-slate-200 rounded-3xl max-w-md mx-auto shadow-sm animate-in fade-in zoom-in duration-300">
      <Shield size={48} className="text-red-500 mb-4 animate-bounce" />
      <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">Access Restricted</h3>
      <p className="text-slate-500 text-xs mt-2 leading-relaxed">
        This module contains sensitive business intelligence and full contact databases. It is restricted to Platform Administrators and Executive Oversight roles only.
      </p>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'call_center': return <CallCenterCommandTab />;
      case 'phone_intake': return <PhoneIntakeForm />;
      case 'account_lookup': return <AccountLookupTab />;
      case 'payment_lookup': return <PaymentLookupTab user={user} />;
      case 'operations_calendar': return <div className="h-full w-full -m-10"><FounderCalendar user={user} title="Operations Calendar" /></div>;
      case 'support': return renderSupport();
      case 'it_support': return renderITSupport();
      case 'hr_intelligence': return renderHRIntelligence();
      case 'applications': return renderApplicationsQueue();
      case 'document_vault': return <DocumentVaultTab />;
      case 'post_payment': return <PostPaymentTab />;
      case 'products_services': return <ProductsServicesManager />;
      case 'personnel': return renderPersonnel();
      case 'patients': 
        if (!isMaster) return renderAccessRestricted();
        return renderPatientInquiries();
      case 'business': 
        if (!isMaster) return renderAccessRestricted();
        return renderBusinessInquiries();
      default: return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto"><Headphones size={32}/></div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab.replace(/_/g, ' ').toUpperCase()}</h3>
            <p className="text-slate-500 text-sm font-medium">This module is part of the Operations Oversight suite. Real-time escalations and support metrics are displayed here.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-50 text-slate-800 font-sans">
      {/* Top Navigation Bar (replaces left sidebar) */}
      <div className="bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-indigo-900 border border-indigo-700 flex items-center justify-center text-white rounded-lg shadow-lg">
               <Headphones size={18} />
            </div>
            <div>
              <h2 className="font-bold text-xs text-white leading-tight uppercase tracking-tight">Ops Center</h2>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Internal Operations</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700 shrink-0" />
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 min-w-max">
              {opsNavItems
                .filter(item => {
                  if (item.id === 'patients' || item.id === 'business') {
                    return isMaster;
                  }
                  return true;
                })
                .map((item, i) => {
                if ('section' in item && item.section) {
                  return (
                    <span key={`ops-sec-${i}`} className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-2 shrink-0">
                      {item.section}
                    </span>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id!)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0",
                      activeTab === item.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}
                  >
                    {item.icon && <item.icon size={13} />}
                    {item.label}
                    {(item.badge || (item.id === 'applications' && pendingAppsCount > 0)) && (
                      <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {item.id === 'applications' ? pendingAppsCount : item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Content Area (full width) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight capitalize">{activeTab.replace(/_/g, ' ')}</h1>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">Live Queue: Active</div>
             <Bell size={20} className="text-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{getContent()}</div>
      </div>
    </div>
  );
};
