import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Users, Database, Globe, Bot, MessageSquare, Clock, HeartPulse, Building2, 
  FileCheck, BookOpen, Gavel, Zap, FlaskConical, BarChart3, LogOut, ArrowLeft, Edit2, Trash2, Plus, CircleCheck,
  Phone, Scale, Megaphone, FileText, Clipboard, Bell, ArrowUpRight, Sliders
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { turso } from '../lib/turso';
import { voip800 } from '../lib/voip800';
import { InternalMessenger } from '../components/messaging/InternalMessenger';
import { AITrainingTab } from '../components/AITrainingTab';
import { UserCalendar } from '../components/UserCalendar';
// Import existing dashboard components to render as tabs
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { ExternalAdminDashboard } from './ExternalAdminDashboard';
import { StateAuthorityDashboard } from './StateAuthorityDashboard';
import {
  LiveSystemHealth,
  LivePatientsOversight,
  LiveBusinessOversight,
  LiveComplianceMonitor,
  LiveLawEnforcement,
  LiveRapidTesting,
  MasterAnalyticsTab,
  LiveHRIntelligence,
  LiveJurisdictionMap,
  LiveRegulatoryLibrary
} from '../components/dashboard-tabs/LiveExecutiveTabs';
import { LegislativeIntelTab } from '../components/federal/LegislativeIntelTab';
import { AdminSupportCalendar } from '../components/AdminSupportCalendar';
import { EscalationSupportCalendar } from '../components/EscalationSupportCalendar';
import { CallCenterCommandTab } from '../components/telephony/CallCenterCommandTab';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';
import { ExecutiveCRM } from '../components/crm/ExecutiveCRM';
import { VirtualAttendantTab } from '../components/oversight/VirtualAttendantTab';
import { GlobalDirectoryTab } from '../components/founder/GlobalDirectoryTab';
import { PatientCaseTracker } from '../components/patient/PatientCaseTracker';
import { MarketingHub } from '../components/crm/MarketingHub';
import { JudicialMonitorTab } from '../components/federal/JudicialMonitorTab';
import { GGEProcessorTab } from '../components/oversight/GGEProcessorTab';
import { LaunchScriptTab } from '../components/oversight/LaunchScriptTab';
import { SupportIntelligenceTab } from '../components/oversight/SupportIntelligenceTab';
import { RapidRevenueTab } from '../components/crm/RapidRevenueTab';

type NavItem = { section?: string; id?: string; label?: string; icon?: any; badge?: string };

const INTERNAL_NAV_ITEMS: NavItem[] = [
  { id: '_sec_ai', section: 'ARTIFICIAL INTELLIGENCE' },
  { id: 'system_health', label: 'System Health / AI', icon: Zap },
  { id: 'hr_intelligence', label: 'HR Intelligence (Sylara)', icon: Users },
  { id: 'jurisdiction_map', label: 'Nationwide Oversight', icon: Globe },
  { id: '_sec_main', section: 'MAIN' },
  { id: 'b2b_crm', label: 'Executive Pipeline', icon: Users },
  { id: 'ai_training', label: 'My Assistant & Training', icon: Bot },
  { id: 'call_center', label: 'Call Center Command', icon: Zap },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'internal_scheduler', label: 'Calendar & Scheduler', icon: Clock },
  { id: 'realtime_tasks', label: 'Realtime Daily Tasks', icon: Zap },
  { id: '_sec_supreme', section: 'SUPREME COMMAND' },
  { id: 'patients', label: 'Registry Sovereignty', icon: HeartPulse },
  { id: 'business', label: 'Economic Infrastructure', icon: Building2 },
  { id: '_sec_ops', section: 'OPS & COMPLIANCE' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'regulatory_library', label: 'Regulatory Library', icon: BookOpen },
  { id: 'judicial', label: 'Judicial Monitor', icon: Scale },
  { id: '_sec_oversight', section: 'OVERSIGHT HUB' },
  { id: 'virtual_attendant', label: 'GGE World Call Center', icon: Phone },
  { id: 'internal_admin', label: 'Internal Team (GGE Call Center)', icon: Shield },
  { id: 'global_directory', label: 'Global Directory', icon: Users },
  { id: 'patient_case_tracker', label: 'Patient Case Tracker', icon: Clipboard },
  { id: 'law_enforcement', label: 'Law Enforcement (RIP)', icon: Gavel },
  { id: 'processor', label: 'GGE Processor', icon: Activity },
  { id: 'marketing_hub', label: 'Marketing Campaigns', icon: Megaphone },
  { id: 'launch_script', label: 'Master Launch Script', icon: FileText },
  { id: 'support_tickets', label: 'Support Intelligence Hub', icon: MessageSquare },
  { id: '_sec_federal', section: 'FEDERAL & IP MONITORS' },
  { id: 'public_health', label: 'Public Health & Labs', icon: FlaskConical },
  { id: 'rapid_testing', label: 'Rapid Testing Hub', icon: FlaskConical },
  { id: '_sec_system', section: 'SYSTEM CONTROL' },
  { id: 'reports', label: 'Master Analytics', icon: BarChart3 },
  { id: 'intel', label: 'Global Intelligence', icon: BookOpen },
];

const PresidentDashboard = ({ user, onLogout }: { user?: any, onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState('system_health');

  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([
    { icon: '💼', title: 'New CRM Leads Available', desc: '198 new prospects imported to B2B Pipeline', time: 'Just now', tab: 'b2b_crm' },
    { icon: '📬', title: 'New Direct Message', desc: 'You have unread messages in the Global Directory', time: 'Just now', tab: 'messages' },
    { icon: '📬', title: 'System Notification', desc: 'New team chat message received', time: '5m ago', tab: 'messages' },
    { icon: '📋', title: 'New Application in Queue', desc: 'Jasmin Garrett - Patient Med Card', time: 'Just now', tab: 'patient_case_tracker' },
    { icon: '🔴', title: 'DEA Schedule III Final Order', desc: 'Medical cannabis & FDA products reclassified — effective April 23, 2026', time: 'Today', tab: 'compliance' },
    { icon: '⚖️', title: 'State License Audit Alert', desc: 'Compliance audit scheduled for next week', time: '2h ago', tab: 'compliance' },
    { icon: '🗓️', title: 'Critical Task Due', desc: 'Review pending state regulations', time: '3h ago', tab: 'realtime_tasks' },
    { icon: '🗓️', title: 'Daily Report Deadline', desc: 'Submit compliance certification form', time: 'Today', tab: 'realtime_tasks' },
    { icon: '📈', title: 'Monthly Revenue Report Ready', desc: 'Financial summaries for last month available', time: 'Yesterday', tab: 'reports' },
    { icon: '⚖️', title: 'DEA Hearing Scheduled', desc: 'Broader rescheduling hearing begins June 29, 2026', time: 'Today', tab: 'judicial' },
    { icon: '💚', title: 'New Poll Votes Received', desc: 'Community polls receiving engagement in Oklahoma', time: '2h ago', tab: 'jurisdiction_map' },
    { icon: '🔒', title: 'Turso DB Connected', desc: 'Production database environment variables active', time: '5h ago', tab: 'system_health' },
  ]);
  const [hideAlertQueue, setHideAlertQueue] = useState(() => localStorage.getItem('gghp_alert_queue_dismissed') === 'true');
  const [queueAlerts, setQueueAlerts] = useState<any[]>([]);
  const [opsChecks, setOpsChecks] = useState<any[]>([]);
  const [voipQueue, setVoipQueue] = useState(0);
  const [unreadVoicemails, setUnreadVoicemails] = useState(0);

  // Poll Twilio VoIP Queue status every 10 seconds
  useEffect(() => {
    const fetchVoipQueue = async () => {
      try {
        const qCount = await voip800.getQueueCount();
        setVoipQueue(qCount);
      } catch (e) {
        console.error('Error fetching VOIP queue count:', e);
      }
    };
    const fetchVoicemails = async () => {
      try {
        const vms = await voip800.getVoicemails();
        const unreadCount = vms.filter((v: any) => !v.read).length;
        setUnreadVoicemails(unreadCount);
      } catch (e) {
        console.error('Error fetching voicemails:', e);
      }
    };
    fetchVoipQueue();
    fetchVoicemails();

    const handleVoicemailsUpdate = () => {
      fetchVoicemails();
    };
    window.addEventListener('voicemails-updated', handleVoicemailsUpdate);

    const handleNavigate = (e: any) => {
      const { tab } = e.detail;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('gghp-navigate', handleNavigate);

    const handleDismissNotif = (e: any) => {
      const { tab } = e.detail;
      if (tab) {
        setNotifications(prev => prev.filter(n => n.tab !== tab));
      }
    };
    window.addEventListener('gghp-dismiss-notification', handleDismissNotif);

    const interval = setInterval(() => {
      fetchVoipQueue();
      fetchVoicemails();
    }, 10000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('voicemails-updated', handleVoicemailsUpdate);
      window.removeEventListener('gghp-navigate', handleNavigate);
      window.removeEventListener('gghp-dismiss-notification', handleDismissNotif);
    };
  }, []);

  // Poll for Ops Checks and support tickets
  useEffect(() => {
    const q = query(
      collection(db, 'support_tickets'),
      where('status', 'in', ['open', 'in_progress']),
      where('priority', 'in', ['urgent', 'high'])
    );
    const unsub = onSnapshot(q, snap => {
      const tickets = snap.docs.map(doc => ({
        id: doc.id,
        type: doc.data().priority === 'urgent' ? 'CRITICAL ALERT' : 'HIGH PRIORITY',
        color: doc.data().priority === 'urgent' ? 'red' : 'amber',
        time: 'Active',
        text: doc.data().subject || 'Support Request'
      }));
      setQueueAlerts(tickets.slice(0, 5));
    });

    const fetchOpsChecks = async () => {
      try {
        const res = await turso.execute("SELECT * FROM audit_logs WHERE action != 'System_Event' ORDER BY rowid DESC LIMIT 4");
        const checks = res.rows.map((r: any) => {
          let detail = 'System action logged';
          try { detail = JSON.parse(String(r.data)).detail || detail; } catch(e) {}
          return {
            id: String(r.id),
            source: String(r.action).replace(/_/g, ' '),
            time: 'Recent',
            text: detail,
            color: 'indigo'
          };
        });
        setOpsChecks(checks);
      } catch(e) { console.error('Error fetching ops checks', e); }
    };
    
    fetchOpsChecks();
    const opsInterval = setInterval(fetchOpsChecks, 15000);

    return () => {
      unsub();
      clearInterval(opsInterval);
    };
  }, []);

  // Automatically clear active tab notification when tab changes
  useEffect(() => {
    if (activeTab) {
      setNotifications(prev => prev.filter(n => n.tab !== activeTab));
    }
  }, [activeTab]);

  const handleRouteAlert = (id: string | number) => {
    alert(`Alert ${id} successfully routed to ${fullName}'s executive scheduler.`);
  };

  const getCategoryAlertCount = (itemId: string): number => {
    switch (itemId) {
      case 'call_center':
      case 'virtual_attendant':
        return voipQueue + unreadVoicemails;
      case 'support_tickets':
        return queueAlerts.length;
      default:
        return notifications.filter(n => n.tab === itemId).length;
    }
  };

  // Draggable nav state with localStorage persistence
  const [navItems, setNavItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gghp_president_nav_order');
      if (saved) {
        const savedIds = JSON.parse(saved) as string[];
        const idToItem = new Map(INTERNAL_NAV_ITEMS.map((item, i) => [item.id || `sec_${i}`, item]));
        const ordered = savedIds.map(id => idToItem.get(id)).filter(Boolean) as typeof INTERNAL_NAV_ITEMS;
        INTERNAL_NAV_ITEMS.forEach((item, i) => { const key = item.id || `sec_${i}`; if (!savedIds.includes(key)) ordered.push(item); });
        return ordered;
      }
    } catch {}
    return [...INTERNAL_NAV_ITEMS];
  });
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDragStart = (e: any, idx: number) => { setDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e: any, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const items = [...navItems];
    const item = items[dragIdx];
    items.splice(dragIdx, 1);
    items.splice(idx, 0, item);
    setDragIdx(idx);
    setNavItems(items);
    localStorage.setItem('gghp_president_nav_order', JSON.stringify(items.map((it, i) => it.id || `sec_${i}`)));
  };

  const [isEditingNav, setIsEditingNav] = useState(false);
  
  const handleAddSection = () => {
    const name = prompt('Enter new section name:');
    if (!name) return;
    const items = [...navItems, { id: `sec_custom_${Date.now()}`, section: name.toUpperCase() }];
    setNavItems(items);
    localStorage.setItem('gghp_president_nav_order', JSON.stringify(items.map((it, i) => it.id || `sec_${i}`)));
  };

  const handleEditSection = (e: any, idx: number) => {
    e.stopPropagation();
    const name = prompt('Edit section name:', navItems[idx].section);
    if (!name) return;
    const items = [...navItems];
    items[idx] = { ...items[idx], section: name.toUpperCase() };
    setNavItems(items);
    localStorage.setItem('gghp_president_nav_order', JSON.stringify(items.map((it, i) => it.id || `sec_${i}`)));
  };

  const handleDeleteItem = (e: any, idx: number) => {
    e.stopPropagation();
    if (!confirm('Remove this item?')) return;
    const items = [...navItems];
    items.splice(idx, 1);
    setNavItems(items);
    localStorage.setItem('gghp_president_nav_order', JSON.stringify(items.map((it, i) => it.id || `sec_${i}`)));
  };

  const fullName = "Ryan Ferrari";
  const title = "President";

  return (
    <div className="flex h-full bg-[#0A0F1C] overflow-hidden text-slate-300 font-sans">
          

      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0F1C] border-r border-slate-800 flex flex-col h-full shrink-0 relative z-20 shadow-2xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50 bg-[#0A0F1C] shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/50 text-emerald-400 font-bold">
              {fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{fullName}</h2>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest">{title}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-1">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <div 
                  key={item.id || `sec_${idx}`} 
                  draggable={isEditingNav}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={() => setDragIdx(null)}
                  className={cn("pt-6 pb-2 px-3 group relative flex items-center justify-between transition-colors", isEditingNav && "cursor-grab active:cursor-grabbing hover:bg-white/5 border border-dashed border-slate-700 rounded-lg mt-2")}
                >
                  <div className="flex items-center">
                    {isEditingNav && <span className="text-slate-600 mr-2">⠿</span>}
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.section}</p>
                  </div>
                  {isEditingNav && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleEditSection(e, idx)} className="p-1 hover:text-white text-slate-400"><Edit2 size={12} /></button>
                      <button onClick={(e) => handleDeleteItem(e, idx)} className="p-1 hover:text-red-400 text-slate-400"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              );
            }
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className={cn("relative group flex items-center", isEditingNav && "border border-dashed border-slate-800 rounded-xl mb-1")}>
                <button
                  draggable={isEditingNav}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={() => setDragIdx(null)}
                  onClick={() => !isEditingNav && setActiveTab(item.id!)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                    isEditingNav && "cursor-grab active:cursor-grabbing opacity-80",
                    isActive && !isEditingNav
                      ? "bg-emerald-600/10 text-emerald-400 shadow-lg shadow-emerald-900/20 border border-emerald-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isEditingNav && <span className="text-slate-600">⠿</span>}
                    <Icon size={18} className={cn(isActive && !isEditingNav ? "text-emerald-400" : "text-slate-500")} />
                    {item.label}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getCategoryAlertCount(item.id!) > 0 && !isEditingNav && (
                      <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                        {getCategoryAlertCount(item.id!)}
                      </span>
                    )}
                    {item.badge && !isEditingNav && (
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                        item.badge === 'Live' ? 'bg-blue-500 text-white' :
                        item.badge === 'New' ? 'bg-emerald-500 text-white' :
                        item.badge === 'High Priority' ? 'bg-red-500 text-white' :
                        item.badge === 'AI' ? 'bg-indigo-500 text-white' :
                        'bg-slate-700 text-slate-300'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
                {isEditingNav && (
                  <button onClick={(e) => handleDeleteItem(e, idx)} className="absolute right-2 p-1.5 bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0A0F1C] sticky bottom-0 shrink-0 space-y-2">
          <button 
            onClick={() => {
              if (isEditingNav) { setIsEditingNav(false); }
              else { setIsEditingNav(true); }
            }}
            className={cn("w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border", isEditingNav ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500" : "bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white")}
          >
            {isEditingNav ? <CircleCheck size={14} /> : <Edit2 size={14} />} {isEditingNav ? 'Done Editing' : 'Edit Layout'}
          </button>
          {isEditingNav && (
            <button onClick={handleAddSection} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700">
              <Plus size={14} /> Add Section
            </button>
          )}
          
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0F1C] relative">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/50 bg-[#0A0F1C]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={onLogout} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 mr-2">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-xl font-black text-white capitalize tracking-wide">
                  {INTERNAL_NAV_ITEMS.find(i => i.id === activeTab)?.label}
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{title} View</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
               <Bot size={12} /> Larry AI Online
            </span>
            <div className="flex items-center gap-2 mr-2">
              <button data-action-bound="true" onClick={(e) => {
                e.stopPropagation();
                const nextVal = !hideAlertQueue;
                setHideAlertQueue(nextVal);
                localStorage.setItem('gghp_alert_queue_dismissed', nextVal ? 'true' : 'false');
              }} className={cn("p-2 rounded-xl transition-all border", hideAlertQueue ? "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800" : "bg-emerald-600/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-950/50")} title="Toggle Alerts Queue">
                <Sliders size={18} />
              </button>
              <div className="relative">
                <button data-action-bound="true" onClick={(e) => { e.stopPropagation(); setShowNotifPanel(!showNotifPanel); }} className="relative p-2 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0A0F1C]" />
                  )}
                </button>
                {showNotifPanel && (
                  <div className="absolute right-0 top-12 w-80 bg-[#0E1526] border border-slate-800 rounded-2xl shadow-2xl z-[9999] overflow-hidden">
                    <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Notifications</span>
                      <span className="px-2 py-0.5 bg-red-950 text-red-400 text-[10px] font-bold rounded-full">{notifications.length} New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                      {notifications.map((n, i) => (
                        <button key={i} data-action-bound="true" onClick={(e) => {
                          e.stopPropagation();
                          setShowNotifPanel(false);
                          setNotifications(notifications.filter((_, idx) => idx !== i));
                          setActiveTab(n.tab);
                        }} className="w-full px-4 py-3 hover:bg-slate-900/60 cursor-pointer transition-colors group text-left">
                          <div className="flex items-start gap-3">
                            <span className="text-lg">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">{n.title}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{n.desc}</p>
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold shrink-0 mt-0.5">{n.time}</span>
                          </div>
                        </button>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 bg-slate-900/30 border-t border-slate-800">
                      <button data-action-bound="true" onClick={(e) => { e.stopPropagation(); setNotifications([]); setShowNotifPanel(false); }} className="w-full text-center text-[10px] font-bold text-emerald-400 hover:text-emerald-300 py-1">Dismiss All</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className={cn(
          "flex-1 bg-[#0A0F1C] p-8 min-h-0",
          ['ai_training', 'messages', 'b2b_crm', 'marketing_hub', 'operations', 'internal_admin', 'external_admin', 'global_directory'].includes(activeTab)
            ? "overflow-hidden"
            : "overflow-auto"
        )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-[1600px] mx-auto h-full"
              >
                {/* LIVE WIRED EXECUTIVE TABS */}
                {activeTab === 'system_health' && <LiveSystemHealth />}
                
                {activeTab === 'hr_intelligence' && <LiveHRIntelligence />}
                
                {activeTab === 'jurisdiction_map' && <LiveJurisdictionMap />}
                
                {activeTab === 'call_center' && <div className="bg-slate-50 p-6 rounded-3xl overflow-auto h-full"><CallCenterCommandTab /></div>}
                {activeTab === 'b2b_crm' && <div className="h-full w-full -m-8 bg-slate-50 min-h-screen overflow-auto"><ExecutiveCRM /></div>}
                {activeTab === 'ai_training' && <AITrainingTab userProfile={user} />}
                {activeTab === 'messages' && <InternalMessenger currentUser={{ name: fullName, role: title, roleId: 'president' }} />}
                {activeTab === 'internal_scheduler' && <div className="bg-white rounded-3xl overflow-hidden h-full"><UserCalendar user={user} /></div>}
                {activeTab === 'realtime_tasks' && <div className="h-full w-full -m-6 bg-slate-50 p-10 min-h-screen overflow-auto"><RapidRevenueTab /></div>}
                {activeTab === 'admin_support_calendar' && <div className="bg-white rounded-3xl overflow-hidden h-full"><AdminSupportCalendar /></div>}
                {activeTab === 'escalation_support_calendar' && <div className="bg-white rounded-3xl overflow-hidden h-full"><EscalationSupportCalendar /></div>}
                
                {activeTab === 'patients' && <LivePatientsOversight />}
                {activeTab === 'business' && <LiveBusinessOversight />}
                
                {activeTab === 'compliance' && <LiveComplianceMonitor />}
                {activeTab === 'regulatory_library' && <LiveRegulatoryLibrary />}
                
                {activeTab === 'internal_admin' && <div className="bg-white rounded-3xl overflow-hidden h-full"><ExternalAdminDashboard /></div>}
                {activeTab === 'law_enforcement' && <LiveLawEnforcement />}
                
                {activeTab === 'processor' && <GGEProcessorTab />}
                
                {activeTab === 'public_health' && <div className="bg-white rounded-3xl overflow-hidden h-full"><PublicHealthDashboard onLogout={onLogout} user={user} /></div>}
                {activeTab === 'rapid_testing' && <LiveRapidTesting />}
                
                {activeTab === 'reports' && <MasterAnalyticsTab />}
                {activeTab === 'intel' && <div className="h-full w-full -m-8 bg-[#080e1a] p-10 min-h-screen overflow-auto"><LegislativeIntelTab /></div>}

                {/* NEW TABS - Matching Founder */}
                {activeTab === 'virtual_attendant' && <div className="bg-slate-50 p-6 rounded-3xl overflow-auto h-full"><VirtualAttendantTab /></div>}
                {activeTab === 'global_directory' && <div className="h-full w-full -m-8 bg-slate-50 min-h-screen overflow-auto"><GlobalDirectoryTab onOpenMessage={(id: string) => { setActiveTab('messages'); }} /></div>}
                {activeTab === 'patient_case_tracker' && <div className="bg-white rounded-3xl overflow-hidden h-full"><PatientCaseTracker onLogout={onLogout} user={user} /></div>}
                {activeTab === 'marketing_hub' && <div className="h-full w-full -m-8 bg-[#080e1a] min-h-screen overflow-auto"><MarketingHub /></div>}
                {activeTab === 'judicial' && <div className="h-full w-full -m-8 bg-[#080e1a] p-10 min-h-screen overflow-auto"><JudicialMonitorTab /></div>}
                {activeTab === 'launch_script' && <LaunchScriptTab />}
                {activeTab === 'support_tickets' && <SupportIntelligenceTab />}

              </motion.div>
            </AnimatePresence>
        </div>
      </main>

      {/* GLOBAL ALERTS STREAM (RIGHT SIDEBAR) */}
      {!hideAlertQueue && (
        <aside data-action-bound="true" className="w-80 bg-[#080d1a] border-l border-slate-800 flex flex-col shrink-0 transition-all duration-500 hidden xl:flex print:hidden relative z-20 shadow-2xl">
           <div className="h-16 border-b border-slate-800/50 flex items-center justify-between px-6 bg-[#0A0F1C] shrink-0">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-200 flex items-center gap-2"><Bell size={14} className="text-emerald-400" /> Executive Alert Queue</h3>
              <button onClick={() => {
                localStorage.setItem('gghp_alert_queue_dismissed', 'true');
                setHideAlertQueue(true);
              }} className="text-slate-500 hover:text-red-400 transition-colors p-1" title="Dismiss Queue"><LogOut size={14} /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#080d1a]/50 custom-scrollbar scrollbar-thin scrollbar-thumb-slate-800">
                {queueAlerts.map(alert => (
                  <div key={alert.id} className={cn("p-4 bg-[#0c1326] border-l-4 rounded-r-xl shadow-md border-emerald-500 hover:shadow-lg transition-all cursor-pointer", alert.color === 'red' ? 'border-red-500' : 'border-amber-500')}>
                     <div className="flex justify-between items-start mb-2">
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded", alert.color === 'red' ? 'text-red-400 bg-red-950/40' : 'text-amber-400 bg-amber-950/40')}>{alert.type}</span>
                        <span className="text-[9px] text-slate-500 font-bold">{alert.time}</span>
                     </div>
                     <p className="text-xs font-bold text-slate-200">{alert.text}</p>
                     <button onClick={() => handleRouteAlert(alert.id)} className="mt-3 text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={12}/> Route to Scheduler</button>
                  </div>
                ))}
                
                {queueAlerts.length === 0 && (
                  <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 flex flex-col items-center justify-center">
                     <CircleCheck size={20} className="mb-2 text-emerald-500 opacity-80" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">All Alerts Cleared</p>
                  </div>
                )}

              {/* Internal Ops Status Checks */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Activity size={12} className="text-indigo-400" /> Internal Ops Checks</h4>
                 <div className="space-y-3">
                    {opsChecks.map(check => (
                      <div key={check.id} className="p-3 bg-[#0c1326] border border-slate-800 rounded-xl">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">{check.source}</span>
                            <span className="text-[9px] font-bold text-slate-500">{check.time}</span>
                         </div>
                         <p className="text-xs font-medium text-slate-300 truncate whitespace-normal line-clamp-2">{check.text}</p>
                      </div>
                    ))}
                    {opsChecks.length === 0 && (
                      <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Awaiting Telemetry...
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </aside>
      )}
    </div>
  );
};
export { PresidentDashboard };
