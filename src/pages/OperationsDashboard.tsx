import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Headphones,
  Phone, PhoneCall, PhoneOff, PhoneIncoming, PhoneOutgoing, UserPlus, Globe, Zap, Database, CircleCheck, ShoppingCart, CreditCard, Check, Copy, Save, Edit, FileEdit, ChevronDown, ChevronUp, Store, Sprout, User, Mail, Home, Leaf, ClipboardList, CalendarCheck, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { UserCalendar } from '../components/UserCalendar';
import { ITSupportDashboard } from '../components/it/ITSupportDashboard';
import { CallCenterCommandTab } from '../components/telephony/CallCenterCommandTab';
import { PhoneIntakeForm } from '../components/telephony/PhoneIntakeForm';
import { voip800 } from '../lib/voip800';
import { turso } from '../lib/turso';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';
import { StateJurisdictionSelector } from '../components/shared/StateJurisdictionSelector';
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
  { section: 'CANNACRIBS' },
  { id: 'cc_applications', label: 'CC Applications', icon: ClipboardList, badge: '2' },
  { id: 'cc_inspections', label: 'CC Inspections', icon: CalendarCheck },
  { id: 'cc_scheduling', label: 'CC Scheduling', icon: Calendar },
];

export const OperationsDashboard = ({ onLogout, user, isFounder, jurisdiction }: { onLogout?: () => void | Promise<void>, user?: any, isFounder?: boolean, jurisdiction?: string }) => {
  // ═══ ROLE HIERARCHY — 5 Levels ═══
  // Each level inherits all tabs from lower levels
  const LEVEL_TABS: Record<number, string[]> = {
    // Level 1: New Rep / Intake Agent — Call Center basics only
    1: ['call_center', 'phone_intake', 'account_lookup'],
    // Level 2: Senior Agent / Operations — + Support operations
    2: ['payment_lookup', 'operations_calendar', 'support', 'calls', 'backoffice'],
    // Level 3: Supervisor / Team Lead — + Applications & CannaCribs
    3: ['applications', 'products_services', 'cc_applications', 'cc_inspections', 'cc_scheduling'],
    // Level 4: Manager / Internal Admin — + HR, Personnel, Vault
    4: ['hr_intelligence', 'personnel', 'document_vault', 'post_payment', 'patients', 'business'],
    // Level 5: Executive / Founder — + IT & everything else
    5: ['it_support'],
  };

  const LEVEL_LABELS: Record<number, { title: string; subtitle: string; color: string; icon: 'headphones' | 'users' }> = {
    1: { title: 'Call Center', subtitle: 'Intake Agent', color: 'cyan', icon: 'headphones' },
    2: { title: 'Ops Center', subtitle: 'Senior Agent', color: 'indigo', icon: 'headphones' },
    3: { title: 'Supervisor Hub', subtitle: 'Team Lead', color: 'blue', icon: 'headphones' },
    4: { title: 'Management Hub', subtitle: 'Team & Personnel Management', color: 'purple', icon: 'users' },
    5: { title: 'Master Operations', subtitle: 'Full Access', color: 'emerald', icon: 'users' },
  };

  // Determine natural staff level from role
  const userRole = (user?.role || '').toLowerCase();
  const getNaturalLevel = (): number => {
    if (isFounder) return 5;
    if (userRole.includes('founder') || userRole.includes('executive_founder') || userRole.includes('president') || userRole.includes('admin_internal') || userRole.includes('manager') || userRole === 'admin') return 4;
    if (userRole.includes('team_lead') || userRole.includes('supervisor')) return 3;
    if (userRole.includes('operations') || userRole.includes('senior')) return 2;
    if (userRole.includes('rep') || userRole.includes('intake') || userRole.includes('agent')) return 1;
    return 2;
  };

  const naturalLevel = getNaturalLevel();
  const canSwitchLevels = !!isFounder; // Only the principal founder can preview or switch levels

  // Level override state — allows founder to preview any level
  const [levelOverride, setLevelOverride] = useState<number | null>(null);
  const [showSwitchConsole, setShowSwitchConsole] = useState(false);
  const staffLevel = levelOverride ?? naturalLevel;
  const isManagement = staffLevel >= 4;

  // Build allowed tabs: cumulative from Level 1 up to active level
  const getTabsForLevel = (level: number): string[] => {
    const tabs: string[] = [];
    for (let i = 1; i <= level; i++) {
      tabs.push(...(LEVEL_TABS[i] || []));
    }
    return tabs;
  };

  const levelAllowedTabs = getTabsForLevel(staffLevel);

  // Staff access control: explicit allowedTabs from profile override hierarchy
  const hasExplicitRestrictions = Array.isArray(user?.allowedTabs) && user.allowedTabs.length > 0;
  const effectiveAllowedTabs = hasExplicitRestrictions ? user.allowedTabs : (staffLevel < 5 ? levelAllowedTabs : null);
  
  // For nav filtering
  const staffAllowedTabs = effectiveAllowedTabs;
  const hasTabRestrictions = !!effectiveAllowedTabs;

  const levelLabel = LEVEL_LABELS[staffLevel] || LEVEL_LABELS[2];

  // When level changes, reset active tab to the default for that level
  const getDefaultTabForLevel = (level: number): string => {
    const tabs = getTabsForLevel(level);
    if (level >= 4 && tabs.includes('hr_intelligence')) return 'hr_intelligence';
    return tabs[0] || 'call_center';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTabForLevel(staffLevel));

  // Reset active tab when level changes (if current tab isn't allowed)
  useEffect(() => {
    if (effectiveAllowedTabs && !effectiveAllowedTabs.includes(activeTab)) {
      setActiveTab(getDefaultTabForLevel(staffLevel));
    }
  }, [staffLevel]);
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

  const isMaster = isFounder ||
                   user?.role === 'founder' || 
                   user?.role === 'executive_founder' || 
                   user?.role === 'executive' || 
                   user?.role === 'president' ||
                   user?.roleId === 'founder' ||
                   (user?.displayName || user?.name || '').toLowerCase().includes('founder') ||
                   (user?.displayName || user?.name || '').toLowerCase().includes('shantell');

  const [selectedState, setSelectedState] = useState(() => {
    return jurisdiction || user?.jurisdiction || user?.homeState || 'Oklahoma';
  });

  useEffect(() => {
    if (jurisdiction) {
      setSelectedState(jurisdiction);
    }
  }, [jurisdiction]);

  const activeJurisdiction = isMaster ? selectedState : (user?.jurisdiction || user?.homeState || 'Oklahoma');

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

  const pendingAppsCount = liveApplications.filter(p => isPend(p.applicationStatus) && (p.state || p.jurisdiction || 'Oklahoma').toLowerCase() === activeJurisdiction.toLowerCase()).length;

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

  // Nav items — always use canonical order from NAV_ITEMS (no localStorage persistence)
  const opsNavItems = NAV_ITEMS;

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
    
    const pendingApps = liveApplications.filter(p => isPend(p.applicationStatus) && (p.state || p.jurisdiction || 'Oklahoma').toLowerCase() === activeJurisdiction.toLowerCase());
    const approvedApps = liveApplications.filter(p => isAppr(p.applicationStatus) && (p.state || p.jurisdiction || 'Oklahoma').toLowerCase() === activeJurisdiction.toLowerCase());
    const flaggedApps = liveApplications.filter(p => isFlag(p.applicationStatus) && (p.state || p.jurisdiction || 'Oklahoma').toLowerCase() === activeJurisdiction.toLowerCase());
    
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

  // ═══ CANNACRIBS OPERATIONS STATE ═══
  const [ccApps, setCcApps] = useState([
    { id: 'CC-APP-001', name: 'James Carter', type: 'Tenant', email: 'james.carter@email.com', phone: '(405) 555-0142', property: 'Modern Cannabis-Friendly Loft', propertyType: 'Apartment', location: 'Oklahoma City, OK', status: 'Pending Review', date: 'Jul 12', card: true, credit: 720, income: '$4,200/mo', employment: 'Verified', dob: '1992-03-15', currentAddress: '1234 NW 10th St, OKC, OK 73103', emergencyName: 'Linda Carter', emergencyPhone: '(405) 555-0199', emergencyRelation: 'Mother', allergies: 'None', medicalConditions: 'None', medications: 'Medical cannabis (THC)', previousLandlord: 'Mark Reynolds', previousLandlordPhone: '(405) 555-0312', reasonForMoving: 'Current landlord prohibits cannabis', pets: 'Dog — Golden Retriever, 45 lbs', vehicles: '2022 Toyota Camry', moveInDate: '2026-08-01', leaseTerm: '12 months' },
    { id: 'CC-APP-002', name: 'Sarah Mitchell', type: 'Tenant', email: 'sarah.m@email.com', phone: '(918) 555-0387', property: 'Cozy 420-Friendly Cottage', propertyType: 'House', location: 'Norman, OK', status: 'Background Check', date: 'Jul 11', card: true, credit: 685, income: '$3,800/mo', employment: 'Verified', dob: '1995-08-22', currentAddress: '567 Elm St, Norman, OK 73071', emergencyName: 'Robert Mitchell', emergencyPhone: '(918) 555-0401', emergencyRelation: 'Father', allergies: 'Penicillin', medicalConditions: 'Asthma (mild)', medications: 'Inhaler, Medical cannabis', previousLandlord: 'Susan Blake', previousLandlordPhone: '(918) 555-0288', reasonForMoving: 'Lease ending, wants grow-friendly space', pets: 'Cat — Siamese', vehicles: '2021 Honda Civic', moveInDate: '2026-08-15', leaseTerm: '6 months' },
    { id: 'CC-APP-003', name: 'David Rosenberg', type: 'Landlord', email: 'drosenberg@realty.com', phone: '(480) 555-0219', property: '3BR House — Edmond, OK', propertyType: 'House', location: 'Edmond, OK', status: 'Approved', date: 'Jul 9', card: false, credit: 0, income: 'N/A', employment: 'N/A', dob: '', currentAddress: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '', allergies: '', medicalConditions: '', medications: '', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: 'Rosenberg Realty LLC', llPropertyAddress: '789 Oak Ridge Dr, Edmond, OK 73034', llTierPreference: 'Platinum', llNumUnits: '2' },
    { id: 'CC-APP-004', name: 'Maria Gonzalez', type: 'Tenant', email: 'mgonzalez@gmail.com', phone: '(405) 555-0901', property: 'Downtown Cannabis-Friendly Studio', propertyType: 'Apartment', location: 'Tulsa, OK', status: 'Pending Review', date: 'Jul 13', card: true, credit: 740, income: '$5,100/mo', employment: 'Pending', dob: '1990-11-03', currentAddress: '321 S Boston Ave, Tulsa, OK 74103', emergencyName: 'Carlos Gonzalez', emergencyPhone: '(405) 555-0822', emergencyRelation: 'Brother', allergies: 'Latex', medicalConditions: 'Anxiety', medications: 'Medical cannabis, Lexapro', previousLandlord: 'Heritage Apts Mgmt', previousLandlordPhone: '(918) 555-0100', reasonForMoving: 'Need cannabis-friendly policy', pets: 'None', vehicles: '2024 Tesla Model 3', moveInDate: '2026-09-01', leaseTerm: '12 months' },
    { id: 'CC-APP-005', name: 'Tom Williams', type: 'Landlord', email: 'twilliams@okprops.com', phone: '(405) 555-0555', property: '4-Unit Multi-Family', propertyType: 'Multi-Family', location: 'Moore, OK', status: 'Verification', date: 'Jul 10', card: false, credit: 0, income: 'N/A', employment: 'N/A', dob: '', currentAddress: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '', allergies: '', medicalConditions: '', medications: '', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: 'OK Properties', llPropertyAddress: '456 SW 4th St, Moore, OK 73160', llTierPreference: 'Gold', llNumUnits: '4' },
    { id: 'CC-APP-006', name: 'Ashley Park', type: 'Short-Term Guest', email: 'ashpark@travel.com', phone: '(602) 555-0733', property: 'Desert Oasis Cannabis Retreat', propertyType: 'Short-Term', location: 'Bullhead City, AZ', status: 'Approved', date: 'Jul 8', card: true, credit: 0, income: 'N/A', employment: 'N/A', dob: '1988-05-12', currentAddress: '9876 E Camelback Rd, Scottsdale, AZ 85251', emergencyName: 'Jessica Park', emergencyPhone: '(602) 555-0800', emergencyRelation: 'Sister', allergies: 'None', medicalConditions: 'None', medications: 'None', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', stCheckIn: '2026-07-15', stCheckOut: '2026-07-20', stGuests: '2', stPurpose: 'Vacation — cannabis retreat' },
  ] as any[]);
  const [ccAppFilter, setCcAppFilter] = useState('All');
  const [ccSelectedApp, setCcSelectedApp] = useState<any>(null);
  const [ccInspections, setCcInspections] = useState([
    { id: 'INS-001', date: 'Jul 15', property: 'Desert Oasis Cannabis Retreat', location: 'Bullhead City, AZ', tier: 'Executive', type: 'Pre-Guest Inspection', status: 'Scheduled', inspector: 'Staff TBD', score: '' },
    { id: 'INS-002', date: 'Jul 18', property: 'Modern Cannabis-Friendly Loft', location: 'Oklahoma City, OK', tier: 'Gold', type: 'Bi-Weekly Check', status: 'Scheduled', inspector: 'Staff TBD', score: '' },
    { id: 'INS-003', date: 'Jul 20', property: 'Spacious Grow-Friendly Rancher', location: 'Edmond, OK', tier: 'Platinum', type: 'Weekly Inspection', status: 'Scheduled', inspector: 'Staff TBD', score: '' },
    { id: 'INS-004', date: 'Jul 22', property: 'Midtown 420 Friendly Townhome', location: 'Oklahoma City, OK', tier: 'Gold', type: 'Bi-Weekly Check', status: 'Scheduled', inspector: 'Staff TBD', score: '' },
  ]);
  const [ccActiveInspection, setCcActiveInspection] = useState<any>(null);
  const [ccInspChecks, setCcInspChecks] = useState<boolean[]>([]);
  const [ccShowScheduleInsp, setCcShowScheduleInsp] = useState(false);
  const [ccNewInsp, setCcNewInsp] = useState({ date: '', property: '', type: 'Bi-Weekly Check', tier: 'Green', inspector: '' });
  const [ccEditApp, setCcEditApp] = useState<any>(null);
  const [ccShowScheduleService, setCcShowScheduleService] = useState(false);
  const [ccNewService, setCcNewService] = useState({ date: '', time: '', property: '', task: 'Standard Clean', crew: 'Team Alpha', tier: 'Green', notes: '' });
  const [ccScheduleItems, setCcScheduleItems] = useState([
    { time: '8:00 AM', task: 'Pre-Guest Turnover Clean', property: 'Desert Oasis Cannabis Retreat', type: 'Turnover + Ozone', status: 'In Progress', crew: 'Team Alpha', tier: 'Executive' },
    { time: '10:30 AM', task: 'Bi-Weekly Inspection', property: 'Modern Cannabis-Friendly Loft', type: '30-Point Check', status: 'Completed', crew: 'Inspector J.', tier: 'Gold' },
    { time: '1:00 PM', task: 'Maintenance - HVAC Filter', property: 'Spacious Grow-Friendly Rancher', type: 'Maintenance', status: 'Scheduled', crew: 'Maintenance', tier: 'Platinum' },
    { time: '3:30 PM', task: 'New Tenant Move-In Inspection', property: 'Cozy 420-Friendly Cottage', type: 'Move-In Check', status: 'Scheduled', crew: 'Inspector J.', tier: 'Green' },
  ]);

  const CC_STATUSES = ['Pending Review', 'Background Check', 'Verification', 'Approved', 'Denied', 'On Hold', 'Waitlisted'];
  const CC_CHECKLIST = ['Exterior Condition','Interior Walls & Paint','Flooring Condition','Windows & Locks','Doors & Hinges','Plumbing & Fixtures','Electrical Outlets','HVAC System','Smoke Detectors','CO Detectors','Fire Extinguisher','Appliance Function','Kitchen Condition','Bathroom Condition','Pest Inspection','Cannabis Odor Level','Ventilation System','Air Filtration','Grow Area (if any)','Waste Disposal','Yard/Exterior Clean','Parking Area','Security System','Key/Lock Integrity','Furniture Condition','Linen/Bedding Check','Supply Inventory','Neighbor Complaints','Photo Documentation','Overall Rating'];
  const CC_PROPERTIES = ['Modern Cannabis-Friendly Loft','Cozy 420-Friendly Cottage','Luxury CannaCrib Suite','Spacious Grow-Friendly Rancher','Cannabis-Friendly Commercial Space','Midtown 420 Friendly Townhome','Desert Oasis Cannabis Retreat'];

  const filteredCcApps = ccApps.filter(a => {
    if (ccAppFilter === 'All') return true;
    if (ccAppFilter === 'Pending') return a.status === 'Pending Review';
    if (ccAppFilter === 'Approved') return a.status === 'Approved';
    if (ccAppFilter === 'Denied') return a.status === 'Denied';
    return true;
  });

  // ═══ CANNACRIBS OPERATIONS RENDER FUNCTIONS ═══
  const renderCCApplications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Leaf className="text-white" size={18} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900"><span className="text-green-600">Canna</span><span className="text-amber-500">Cribs</span> Applications</h2>
            <p className="text-xs text-slate-500">Process tenant, landlord, and short-term guest applications</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">{ccApps.filter(a => a.status === 'Pending Review').length} Pending Review</span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l: 'Total Applications', v: String(ccApps.length), color: 'text-slate-800' },
          { l: 'Pending Review', v: String(ccApps.filter(a => a.status === 'Pending Review').length), color: 'text-amber-600' },
          { l: 'Background Check', v: String(ccApps.filter(a => a.status === 'Background Check').length), color: 'text-blue-600' },
          { l: 'Approved', v: String(ccApps.filter(a => a.status === 'Approved').length), color: 'text-emerald-600' },
          { l: 'Verification', v: String(ccApps.filter(a => a.status === 'Verification').length), color: 'text-purple-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className={cn("text-2xl font-black", s.color)}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {ccSelectedApp && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCcSelectedApp(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div><h3 className="font-black text-lg text-slate-900">{ccSelectedApp.name}</h3><p className="text-xs text-slate-500">{ccSelectedApp.id} • {ccSelectedApp.type} Application</p></div>
              <button onClick={() => setCcSelectedApp(null)} className="p-2 hover:bg-slate-100 rounded-lg"><XCircle size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center gap-3 flex-wrap">
                <select value={ccSelectedApp.status} onChange={e => { const newStatus = e.target.value; setCcApps(p => p.map(a => a.id === ccSelectedApp.id ? { ...a, status: newStatus } : a)); setCcSelectedApp({ ...ccSelectedApp, status: newStatus }); }} className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold outline-none">
                  {CC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="text-xs text-slate-400">Submitted {ccSelectedApp.date}</span>
              </div>
              {/* Contact */}
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-200 pb-1">Contact Information</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[['Email', ccSelectedApp.email], ['Phone', ccSelectedApp.phone], ['DOB', ccSelectedApp.dob], ['Current Address', ccSelectedApp.currentAddress], ['Type', ccSelectedApp.type], ['Property Type', ccSelectedApp.propertyType]].map(([l, v], i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black tracking-wider mb-0.5">{l}</div><div className="text-sm text-slate-800 font-medium">{v || '—'}</div></div>
                ))}
              </div>
              {/* Property */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-[10px] text-green-600 uppercase font-bold mb-1">Property Applied For</div>
                <div className="text-sm text-slate-900 font-bold">{ccSelectedApp.property}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {ccSelectedApp.location}</div>
              </div>
              {/* Tenant Screening */}
              {ccSelectedApp.type === 'Tenant' && (<>
                <div className="text-[10px] font-black text-green-600 uppercase tracking-widest border-b border-slate-200 pb-1">Screening & Verification</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[['Credit Score', ccSelectedApp.credit], ['Cannabis Card', ccSelectedApp.card ? '✅' : '❌'], ['Employment', ccSelectedApp.employment], ['Income', ccSelectedApp.income]].map(([l, v], i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-lg font-black text-slate-900">{v}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{l}</div></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[['Desired Move-In', ccSelectedApp.moveInDate], ['Lease Term', ccSelectedApp.leaseTerm], ['Reason for Moving', ccSelectedApp.reasonForMoving], ['Pets', ccSelectedApp.pets], ['Vehicles', ccSelectedApp.vehicles], ['Previous Landlord', `${ccSelectedApp.previousLandlord} ${ccSelectedApp.previousLandlordPhone}`]].map(([l, v], i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black mb-0.5">{l}</div><div className="text-sm text-slate-800 font-medium">{v || '—'}</div></div>
                  ))}
                </div>
              </>)}
              {/* Landlord */}
              {ccSelectedApp.type === 'Landlord' && ccSelectedApp.llCompany && (<>
                <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-slate-200 pb-1">Landlord Details</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[['Company/LLC', ccSelectedApp.llCompany], ['Property Address', ccSelectedApp.llPropertyAddress], ['Tier Preference', ccSelectedApp.llTierPreference], ['# Units', ccSelectedApp.llNumUnits]].map(([l, v], i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black mb-0.5">{l}</div><div className="text-sm text-slate-800 font-medium">{v || '—'}</div></div>
                  ))}
                </div>
              </>)}
              {/* Short-Term */}
              {ccSelectedApp.type === 'Short-Term Guest' && (<>
                <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest border-b border-slate-200 pb-1">Stay Details</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[['Check-In', ccSelectedApp.stCheckIn], ['Check-Out', ccSelectedApp.stCheckOut], ['# Guests', ccSelectedApp.stGuests], ['Purpose', ccSelectedApp.stPurpose]].map(([l, v], i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black mb-0.5">{l}</div><div className="text-sm text-slate-800 font-medium">{v || '—'}</div></div>
                  ))}
                </div>
              </>)}
              {/* Emergency & Medical */}
              <div className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-slate-200 pb-1">Emergency Contact & Medical</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[['Emergency Contact', ccSelectedApp.emergencyName], ['Emergency Phone', ccSelectedApp.emergencyPhone], ['Relationship', ccSelectedApp.emergencyRelation], ['Allergies', ccSelectedApp.allergies], ['Medical Conditions', ccSelectedApp.medicalConditions], ['Medications', ccSelectedApp.medications]].map(([l, v], i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black mb-0.5">{l}</div><div className="text-sm text-slate-800 font-medium">{v || '—'}</div></div>
                ))}
              </div>
              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => { setCcApps(p => p.map(a => a.id === ccSelectedApp.id ? { ...a, status: 'Approved' } : a)); setCcSelectedApp({ ...ccSelectedApp, status: 'Approved' }); }} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"><CheckCircle size={16} /> Approve</button>
                <button onClick={() => setCcEditApp({ ...ccSelectedApp })} className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
                <button onClick={() => { setCcApps(p => p.map(a => a.id === ccSelectedApp.id ? { ...a, status: 'Denied' } : a)); setCcSelectedApp({ ...ccSelectedApp, status: 'Denied' }); }} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><XCircle size={16} /> Deny</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {ccEditApp && (
        <div className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCcEditApp(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 z-10 px-6 py-4 text-white flex items-center justify-between">
              <div><h3 className="font-black text-lg">✏️ Edit Application — {ccEditApp.name}</h3><p className="text-xs text-blue-200">{ccEditApp.id}</p></div>
              <button onClick={() => setCcEditApp(null)} className="p-2 hover:bg-white/10 rounded-lg"><XCircle size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-200 pb-1">Personal Information</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[['name', 'Full Name'], ['email', 'Email'], ['phone', 'Phone'], ['dob', 'Date of Birth'], ['currentAddress', 'Current Address'], ['type', 'Applicant Type']].map(([key, label]) => (
                  <div key={key}><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
                  {key === 'type' ? (
                    <select value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white">
                      {['Tenant', 'Landlord', 'Short-Term Guest'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  )}
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-green-600 uppercase tracking-widest border-b border-slate-200 pb-1">Property & Lease</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[['property', 'Property Applied'], ['propertyType', 'Property Type'], ['location', 'Location'], ['moveInDate', 'Move-In Date'], ['leaseTerm', 'Lease Term'], ['income', 'Income']].map(([key, label]) => (
                  <div key={key}><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
                  {key === 'propertyType' ? (
                    <select value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white">
                      {['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Duplex', 'Multi-Family', 'Short-Term', 'Commercial Space'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  ) : key === 'property' ? (
                    <select value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white">
                      {CC_PROPERTIES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  ) : (
                    <input value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  )}
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-violet-600 uppercase tracking-widest border-b border-slate-200 pb-1">Screening & Background</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[['credit', 'Credit Score'], ['employment', 'Employment'], ['previousLandlord', 'Previous Landlord'], ['previousLandlordPhone', 'LL Phone'], ['reasonForMoving', 'Reason for Moving'], ['pets', 'Pets'], ['vehicles', 'Vehicles']].map(([key, label]) => (
                  <div key={key}><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
                  {key === 'employment' ? (
                    <select value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white">
                      {['Verified', 'Pending', 'Unverified', 'N/A'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  )}
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-slate-200 pb-1">Emergency Contact & Medical</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[['emergencyName', 'Emergency Contact'], ['emergencyPhone', 'Emergency Phone'], ['emergencyRelation', 'Relationship'], ['allergies', 'Allergies'], ['medicalConditions', 'Medical Conditions'], ['medications', 'Medications']].map(([key, label]) => (
                  <div key={key}><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
                  <input value={ccEditApp[key] || ''} onChange={e => setCcEditApp({ ...ccEditApp, [key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-200 pb-1">Status</div>
              <select value={ccEditApp.status || ''} onChange={e => setCcEditApp({ ...ccEditApp, status: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold outline-none bg-white">
                {CC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => { setCcApps(p => p.map(a => a.id === ccEditApp.id ? { ...ccEditApp } : a)); setCcSelectedApp(ccEditApp); setCcEditApp(null); }} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"><CheckCircle size={16} /> Save Changes</button>
                <button onClick={() => setCcEditApp(null)} className="py-3 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={16} className="text-green-600" /> Application Queue</h3>
          <div className="flex gap-1">
            {['All', 'Pending', 'Approved', 'Denied'].map(f => (
              <button key={f} onClick={() => setCcAppFilter(f)} className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all", ccAppFilter === f ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-700')}>{f}</button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <th className="text-left p-3">Applicant</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Property</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Submitted</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCcApps.map((app, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-green-50/30 transition-colors cursor-pointer" onClick={() => setCcSelectedApp(app)}>
                <td className="p-3">
                  <div className="text-sm font-bold text-slate-800 hover:text-green-600">{app.name}</div>
                  {app.type === 'Tenant' && <div className="text-[10px] text-slate-400">Credit: {app.credit} • Card: {app.card ? '✅' : '❌'}</div>}
                </td>
                <td className="p-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold",
                    app.type === 'Tenant' ? 'bg-blue-100 text-blue-700' :
                    app.type === 'Landlord' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  )}>{app.type}</span>
                </td>
                <td className="p-3">
                  <div className="text-xs font-medium text-slate-700">{app.property}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={8} /> {app.location}</div>
                </td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <select value={app.status} onChange={e => setCcApps(p => p.map(a => a.id === app.id ? { ...a, status: e.target.value } : a))} className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border outline-none cursor-pointer",
                    app.status === 'Pending Review' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    app.status === 'Background Check' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    app.status === 'Verification' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    app.status === 'Denied' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  )}>
                    {CC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-xs text-slate-500">{app.date}</td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <button onClick={() => { setCcApps(p => p.map(a => a.id === app.id ? { ...a, status: 'Approved' } : a)); }} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all" title="Approve"><CheckCircle size={12} /></button>
                    <button onClick={() => { setCcApps(p => p.map(a => a.id === app.id ? { ...a, status: 'Denied' } : a)); }} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all" title="Deny"><XCircle size={12} /></button>
                    <button onClick={() => setCcSelectedApp(app)} className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all" title="View Full Application"><Eye size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCCInspections = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Eye className="text-white" size={18} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900"><span className="text-green-600">Canna</span><span className="text-amber-500">Cribs</span> Inspections</h2>
            <p className="text-xs text-slate-500">30-point property inspections, cleaning schedules, and compliance tracking</p>
          </div>
        </div>
        <button onClick={() => setCcShowScheduleInsp(true)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-all flex items-center gap-1.5"><Plus size={14} /> Schedule Inspection</button>
      </div>

      {/* Schedule Inspection Modal */}
      {ccShowScheduleInsp && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCcShowScheduleInsp(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900">Schedule Inspection</h3>
              <button onClick={() => setCcShowScheduleInsp(false)} className="p-2 hover:bg-slate-100 rounded-lg"><XCircle size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Date *</label><input type="date" value={ccNewInsp.date} onChange={e => setCcNewInsp(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Property *</label><select value={ccNewInsp.property} onChange={e => setCcNewInsp(p => ({ ...p, property: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"><option value="">Select Property</option>{CC_PROPERTIES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Inspection Type</label><select value={ccNewInsp.type} onChange={e => setCcNewInsp(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"><option>Bi-Weekly Check</option><option>Weekly Inspection</option><option>Pre-Guest Inspection</option><option>Move-In Check</option><option>Move-Out Check</option><option>Quarterly Review</option></select></div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Tier</label><select value={ccNewInsp.tier} onChange={e => setCcNewInsp(p => ({ ...p, tier: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></select></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Inspector</label><input value={ccNewInsp.inspector} onChange={e => setCcNewInsp(p => ({ ...p, inspector: e.target.value }))} placeholder="Inspector name" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20" /></div>
              <button onClick={() => { if (!ccNewInsp.date || !ccNewInsp.property) return alert('Date and property required.'); const dateStr = new Date(ccNewInsp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); setCcInspections(p => [...p, { id: 'INS-' + String(p.length + 1).padStart(3, '0'), date: dateStr, property: ccNewInsp.property, location: '', tier: ccNewInsp.tier, type: ccNewInsp.type, status: 'Scheduled', inspector: ccNewInsp.inspector || 'Staff TBD', score: '' }]); setCcNewInsp({ date: '', property: '', type: 'Bi-Weekly Check', tier: 'Green', inspector: '' }); setCcShowScheduleInsp(false); }} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Active Inspection Modal (30-point Checklist) */}
      {ccActiveInspection && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCcActiveInspection(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-700 z-10 px-6 py-4 text-white flex items-center justify-between">
              <div><h3 className="font-black text-lg">🔍 Live Inspection — {ccActiveInspection.property}</h3><p className="text-xs text-green-200">{ccActiveInspection.type} • {ccActiveInspection.date}</p></div>
              <button onClick={() => setCcActiveInspection(null)} className="p-2 hover:bg-white/10 rounded-lg"><XCircle size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-sm font-bold text-blue-700">Progress: {ccInspChecks.filter(Boolean).length} / {CC_CHECKLIST.length} Items</span>
                <span className="text-lg font-black text-blue-700">{Math.round((ccInspChecks.filter(Boolean).length / CC_CHECKLIST.length) * 100)}%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CC_CHECKLIST.map((item, i) => (
                  <label key={i} className={cn("flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border", ccInspChecks[i] ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200 hover:bg-slate-100")}>
                    <input type="checkbox" checked={!!ccInspChecks[i]} onChange={() => setCcInspChecks(p => { const n = [...p]; n[i] = !n[i]; return n; })} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                    <span className={cn("text-xs font-medium", ccInspChecks[i] ? "text-emerald-700 line-through" : "text-slate-700")}>{item}</span>
                    {ccInspChecks[i] && <CheckCircle size={12} className="text-emerald-500 ml-auto" />}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => { const score = `${ccInspChecks.filter(Boolean).length}/${CC_CHECKLIST.length}`; setCcInspections(p => p.map(insp => insp.id === ccActiveInspection.id ? { ...insp, status: 'Completed', score } : insp)); setCcActiveInspection(null); setCcInspChecks([]); }} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"><CheckCircle size={16} /> Complete Inspection ({ccInspChecks.filter(Boolean).length}/{CC_CHECKLIST.length})</button>
                <button onClick={() => { setCcActiveInspection(null); setCcInspChecks([]); }} className="py-3 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Inspections */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><CalendarCheck size={16} className="text-blue-600" /> Upcoming Inspections</h3>
          <span className="text-xs text-slate-400 font-bold">{ccInspections.filter(i => i.status === 'Scheduled').length} Scheduled</span>
        </div>
        <div className="divide-y divide-slate-100">
          {ccInspections.map((insp, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex flex-col items-center justify-center border border-blue-100">
                  <span className="text-[9px] font-black text-blue-400 uppercase">Jul</span>
                  <span className="text-lg font-black text-blue-600">{insp.date.split(' ')[1]}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{insp.property}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} /> {insp.location || 'Location TBD'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                      insp.tier === 'Executive' ? 'bg-purple-100 text-purple-700' :
                      insp.tier === 'Platinum' ? 'bg-violet-100 text-violet-700' :
                      insp.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>{insp.tier}</span>
                    <span className="text-[10px] text-slate-500">{insp.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-lg", insp.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')}>{insp.status}</span>
                {insp.score && <span className="text-sm font-black text-emerald-600">{insp.score}</span>}
                {insp.status === 'Scheduled' && (
                  <button onClick={() => { setCcActiveInspection(insp); setCcInspChecks(new Array(CC_CHECKLIST.length).fill(false)); }} className="px-3 py-1.5 bg-green-600 text-white text-[10px] font-bold rounded-lg hover:bg-green-500 transition-all">Start Inspection</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Point Checklist Reference */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4"><Shield size={16} className="text-emerald-600" /> 30-Point Inspection Checklist</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {CC_CHECKLIST.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 rounded-lg text-[10px] font-medium text-slate-600">
              <CheckCircle size={10} className="text-emerald-500 shrink-0" /> {item}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inspection Results */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Activity size={16} className="text-emerald-600" /> Recent Inspection Results</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            ...ccInspections.filter(i => i.status === 'Completed').map(i => ({ date: i.date, property: i.property, score: i.score, result: 'PASSED', notes: 'Completed via live inspection form.' })),
            { date: 'Jul 13', property: 'Modern Cannabis-Friendly Loft', score: '30/30', result: 'PASSED', notes: 'All areas clean, HVAC filter replaced, no odor issues.' },
            { date: 'Jul 10', property: 'Desert Oasis Cannabis Retreat', score: '29/30', result: 'PASSED', notes: 'Minor: Air filtration filter at 80% life. Ordered replacement.' },
            { date: 'Jul 6', property: 'Midtown 420 Friendly Townhome', score: '30/30', result: 'PASSED', notes: 'Excellent condition. Tenant very cooperative.' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div>
                <div className="text-sm font-bold text-slate-800">{r.property}</div>
                <div className="text-xs text-slate-400">{r.date} • {r.notes}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-emerald-600">{r.score}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full">{r.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCCScheduling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Calendar className="text-white" size={18} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900"><span className="text-green-600">Canna</span><span className="text-amber-500">Cribs</span> Scheduling</h2>
            <p className="text-xs text-slate-500">Cleaning services, turnovers, maintenance, and property scheduling</p>
          </div>
        </div>
        <button onClick={() => setCcShowScheduleService(true)} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 transition-all flex items-center gap-1.5">
          <Plus size={14} /> Schedule Service
        </button>
      </div>

      {/* Schedule Service Modal */}
      {ccShowScheduleService && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setCcShowScheduleService(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900">Schedule Service</h3>
              <button onClick={() => setCcShowScheduleService(false)} className="p-2 hover:bg-slate-100 rounded-lg"><XCircle size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Date *</label><input type="date" value={ccNewService.date} onChange={e => setCcNewService(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20" /></div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Time *</label><input type="time" value={ccNewService.time} onChange={e => setCcNewService(p => ({ ...p, time: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Property *</label><select value={ccNewService.property} onChange={e => setCcNewService(p => ({ ...p, property: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"><option value="">Select Property</option>{CC_PROPERTIES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Service Type</label><select value={ccNewService.task} onChange={e => setCcNewService(p => ({ ...p, task: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"><option>Standard Clean</option><option>Deep Clean</option><option>Turnover Clean</option><option>Turnover + Ozone</option><option>Pre-Guest Inspection</option><option>Move-In Check</option><option>Move-Out Check</option><option>30-Point Check</option><option>Maintenance</option><option>Supply Restock</option><option>Guest Check-In Prep</option><option>Guest Check-Out</option><option>Odor Check</option></select></div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Tier</label><select value={ccNewService.tier} onChange={e => setCcNewService(p => ({ ...p, tier: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Assign Crew</label><select value={ccNewService.crew} onChange={e => setCcNewService(p => ({ ...p, crew: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"><option>Team Alpha</option><option>Team Bravo</option><option>Inspector J.</option><option>Maintenance</option><option>Staff TBD</option></select></div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Notes</label><input value={ccNewService.notes} onChange={e => setCcNewService(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20" /></div>
              </div>
              <button onClick={() => { if (!ccNewService.date || !ccNewService.time || !ccNewService.property) return alert('Date, time, and property required.'); const timeStr = new Date('2026-01-01T' + ccNewService.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); setCcScheduleItems(p => [...p, { time: timeStr, task: ccNewService.task, property: ccNewService.property, type: ccNewService.task, status: 'Scheduled', crew: ccNewService.crew, tier: ccNewService.tier }]); setCcNewService({ date: '', time: '', property: '', task: 'Standard Clean', crew: 'Team Alpha', tier: 'Green', notes: '' }); setCcShowScheduleService(false); }} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Schedule Service</button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2"><Calendar size={16} /> Today's Schedule — Jul 13, 2026</h3>
          <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">{ccScheduleItems.length} Tasks</span>
        </div>
        <div className="divide-y divide-slate-100">
          {ccScheduleItems.map((task, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-16 text-center">
                  <div className="text-sm font-black text-slate-800">{task.time}</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{task.task}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1"><Home size={10} /> {task.property}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                      task.tier === 'Executive' ? 'bg-purple-100 text-purple-700' :
                      task.tier === 'Platinum' ? 'bg-violet-100 text-violet-700' :
                      task.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>{task.tier}</span>
                    <span className="text-[10px] text-slate-400">{task.type} • {task.crew}</span>
                  </div>
                </div>
              </div>
              <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-lg",
                task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-600'
              )}>{task.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Week */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><CalendarCheck size={16} className="text-indigo-600" /> This Week — Cleaning & Turnovers</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { date: 'Jul 14 (Mon)', tasks: ['Standard Clean — Midtown Townhome', 'Odor check — Modern Loft'] },
            { date: 'Jul 15 (Tue)', tasks: ['Guest Check-In Prep — Desert Oasis', 'Pre-Guest Inspection — Desert Oasis'] },
            { date: 'Jul 16 (Wed)', tasks: ['Bi-weekly Inspect — Grow Rancher'] },
            { date: 'Jul 17 (Thu)', tasks: ['Deep Clean — Cottage (turnover)', 'Supply restock — Desert Oasis'] },
            { date: 'Jul 18 (Fri)', tasks: ['Bi-weekly Inspect — Modern Loft', 'Maintenance review — All properties'] },
            { date: 'Jul 20 (Sun)', tasks: ['Guest Check-Out — Desert Oasis', 'Turnover Clean + Ozone — Desert Oasis'] },
          ].map((day, i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <div className="w-28 shrink-0">
                <span className="text-xs font-bold text-slate-800">{day.date}</span>
              </div>
              <div className="flex-1 space-y-1">
                {day.tasks.map((t, j) => (
                  <div key={j} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div> {t}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
      case 'operations_calendar': return <div className="h-full w-full -m-10"><UserCalendar user={user} mode="operations" title="Operations Calendar" /></div>;
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
      case 'cc_applications': return renderCCApplications();
      case 'cc_inspections': return renderCCInspections();
      case 'cc_scheduling': return renderCCScheduling();
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
            <div className={`w-8 h-8 ${levelLabel.color === 'purple' ? 'bg-purple-900 border-purple-700' : levelLabel.color === 'emerald' ? 'bg-emerald-900 border-emerald-700' : levelLabel.color === 'blue' ? 'bg-blue-900 border-blue-700' : levelLabel.color === 'cyan' ? 'bg-cyan-900 border-cyan-700' : 'bg-indigo-900 border-indigo-700'} border flex items-center justify-center text-white rounded-lg shadow-lg`}>
               {levelLabel.icon === 'users' ? <Users size={18} /> : <Headphones size={18} />}
            </div>
            <div>
              <h2 className="font-bold text-xs text-white leading-tight uppercase tracking-tight flex items-center gap-2">
                {levelLabel.title}
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black ${staffLevel >= 4 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : staffLevel >= 3 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}>
                  LVL {staffLevel}
                </span>
              </h2>
              <p className={`text-[9px] ${levelLabel.color === 'purple' ? 'text-purple-400' : levelLabel.color === 'emerald' ? 'text-emerald-400' : levelLabel.color === 'blue' ? 'text-blue-400' : levelLabel.color === 'cyan' ? 'text-cyan-400' : 'text-indigo-400'} font-bold uppercase tracking-wider`}>{levelLabel.subtitle}</p>
            </div>
          </div>
          {/* Level Switcher — Founder Only */}
          {canSwitchLevels && (
            <select
              value={staffLevel}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setLevelOverride(val === naturalLevel ? null : val);
              }}
              className="appearance-none bg-slate-800 text-white font-bold text-[10px] px-3 py-1.5 pr-7 rounded-lg border border-slate-600 hover:border-indigo-500 outline-none cursor-pointer transition-all shrink-0 uppercase tracking-wide"
              title="Preview staff level views"
            >
              <option value={1}>⬜ LVL 1 — Intake Agent</option>
              <option value={2}>🔷 LVL 2 — Senior Agent</option>
              <option value={3}>🔵 LVL 3 — Team Lead</option>
              <option value={4}>🟣 LVL 4 — Manager</option>
              <option value={5}>🟢 LVL 5 — Full Access</option>
            </select>
          )}
          <div className="w-px h-8 bg-slate-700 shrink-0" />
          <div className="flex-1 flex items-center justify-between px-4">
            {isMaster || staffLevel === 5 ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowSwitchConsole(!showSwitchConsole)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-all shadow-md active:scale-95",
                      showSwitchConsole && "ring-2 ring-indigo-500 border-indigo-500"
                    )}
                  >
                    <Cpu size={14} className="text-indigo-400" />
                    Console Matrix
                    <span className="text-[10px] text-slate-400 font-bold">({activeTab.replace(/_/g, ' ')})</span>
                    <span className="text-[9px] text-indigo-400 font-black">▾</span>
                  </button>

                  {showSwitchConsole && (
                    <>
                      {/* Backdrop Click Dismiss */}
                      <div className="fixed inset-0 z-[90]" onClick={() => setShowSwitchConsole(false)} />
                      {/* MEGA MENU DIALOG */}
                      <div className="absolute left-0 top-full mt-3 w-[840px] max-w-[calc(100vw-12rem)] bg-slate-950/95 border border-slate-800 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                          <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                              <Cpu size={16} className="text-indigo-500" /> Global Green Operations Matrix
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Clearance Level 5: God View Switcher</p>
                          </div>
                          <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase">Founder Console</span>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4">
                          {[1, 2, 3, 4, 5].map((lvl) => {
                            const labelData = LEVEL_LABELS[lvl as keyof typeof LEVEL_LABELS];
                            const tabIds = LEVEL_TABS[lvl];
                            return (
                              <div key={lvl} className="space-y-4">
                                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800/60">
                                  <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    lvl === 5 ? "bg-emerald-500 shadow-md shadow-emerald-500/40" : lvl === 4 ? "bg-purple-500 shadow-md shadow-purple-500/40" : lvl === 3 ? "bg-blue-500 shadow-md shadow-blue-500/40" : lvl === 2 ? "bg-indigo-500 shadow-md shadow-indigo-500/40" : "bg-cyan-500 shadow-md shadow-cyan-500/40"
                                  )} />
                                  <div className="leading-tight">
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{labelData.title}</h4>
                                    <p className="text-[8px] text-slate-500 font-bold uppercase">Lvl {lvl}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  {tabIds.map(tabId => {
                                    const navItem = NAV_ITEMS.find(n => n.id === tabId);
                                    if (!navItem) return null;
                                    const Icon = navItem.icon;
                                    const isActive = activeTab === tabId;
                                    return (
                                      <button
                                        key={tabId}
                                        onClick={() => {
                                          setActiveTab(tabId);
                                          setShowSwitchConsole(false);
                                        }}
                                        className={cn(
                                          "w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all relative group",
                                          isActive
                                            ? (lvl === 5 ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/40" : lvl === 4 ? "bg-purple-600 text-white shadow-lg shadow-purple-950/40" : lvl === 3 ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40" : "bg-indigo-600 text-white shadow-lg shadow-indigo-950/40")
                                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                        )}
                                      >
                                        <span className="flex items-center gap-2">
                                          {Icon && <Icon size={12} className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300 transition-colors"} />}
                                          <span className="truncate max-w-[100px]">{navItem.label}</span>
                                        </span>
                                        {(navItem.badge || (navItem.id === 'applications' && pendingAppsCount > 0)) && (
                                          <span className={cn(
                                            "text-[8px] px-1 py-0.5 rounded-full font-black ml-1 shrink-0",
                                            isActive ? "bg-white/30 text-white" : "bg-slate-800 text-slate-400"
                                          )}>
                                            {navItem.id === 'applications' ? pendingAppsCount : navItem.badge}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <StateJurisdictionSelector
                  value={selectedState}
                  onChange={setSelectedState}
                  variant="dark"
                  compact={true}
                  showMetadata={true}
                  label=""
                />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {(() => {
                  const visibleIds = new Set(
                    NAV_ITEMS
                      .filter(item => {
                        if (!item.id) return false;
                        if (staffAllowedTabs) return staffAllowedTabs.includes(item.id);
                        if (item.id === 'patients' || item.id === 'business') return isMaster;
                        return true;
                      })
                      .map(item => item.id!)
                  );
                  const filtered: typeof NAV_ITEMS = [];
                  for (let i = 0; i < NAV_ITEMS.length; i++) {
                    const item = NAV_ITEMS[i];
                    if ('section' in item) {
                      let hasVisibleChild = false;
                      for (let j = i + 1; j < NAV_ITEMS.length; j++) {
                        if ('section' in NAV_ITEMS[j]) break;
                        if (NAV_ITEMS[j].id && visibleIds.has(NAV_ITEMS[j].id!)) { hasVisibleChild = true; break; }
                      }
                      if (hasVisibleChild) filtered.push(item);
                    } else if (item.id && visibleIds.has(item.id)) {
                      filtered.push(item);
                    }
                  }
                  return filtered;
                })().map((item, i) => {
                  if ('section' in item && item.section) {
                    return (
                      <span key={`ops-sec-${i}`} className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-2 shrink-0">
                        {item.section}
                      </span>
                    );
                  }
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id!)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0",
                        isActive
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      )}
                    >
                      {Icon && <Icon size={13} />}
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
            )}
            
            <div className="shrink-0 flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {activeJurisdiction} HQ
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
