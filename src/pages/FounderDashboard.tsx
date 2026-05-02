import React, { useState, useEffect } from 'react';
import { Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Globe, Zap, Database,
  FlaskConical, CreditCard, Map as MapIcon, BookOpen, UserPlus, Trash2,
  MapPin, Target, Layers, TrendingDown, Box, PieChart, GraduationCap, Lock, GripVertical,
  Calculator, Save, ExternalLink, Printer, ArrowLeft, Phone, PhoneCall, PhoneOff, PhoneIncoming, PhoneOutgoing, CircleCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { FederalDashboard } from './FederalDashboard';
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { AdminDashboard } from './AdminDashboard';
import { StateAuthorityDashboard } from './StateAuthorityDashboard';
import { ExternalAdminDashboard } from './ExternalAdminDashboard';
import { BackOfficeDashboard } from './BackOfficeDashboard';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { InvestorSandboxTab } from '../components/founder/InvestorSandboxTab';
import { LegislativeIntelTab } from '../components/federal/LegislativeIntelTab';
import { JudicialMonitorTab } from '../components/federal/JudicialMonitorTab';
import { VirtualAttendantTab } from '../components/oversight/VirtualAttendantTab';
import { onSnapshot, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { METRC_MANUAL } from '../data/metrcManual';
import { turso } from '../lib/turso';
import { MasterBankingInfo } from '../components/MasterBankingInfo';
import { FounderModals } from '../components/FounderModals';
import { ITSupportDashboard } from '../components/it/ITSupportDashboard';
import { RolePermissionsPanel } from '../components/RolePermissionsPanel';
import { InternalMessenger } from '../components/messaging/InternalMessenger';
import { AITrainingTab } from '../components/AITrainingTab';
import { UserCalendar } from '../components/UserCalendar';
import { voip800 } from '../lib/voip800';

type NavItem = { section?: string; id?: string; label?: string; icon?: any; badge?: string };

const NAV_VERSION = 21; // Bumped: Move Ops Center and Internal Admin to single tabs

const INITIAL_NAV_ITEMS: NavItem[] = [
  // Single tabs
  { id: 'ai_training', label: 'My Asst AI', icon: Bot, badge: 'AI' },
  { id: 'overview', label: 'God Overview', icon: Activity },
  { id: 'internal_scheduler', label: 'Calendar / Scheduler', icon: Clock, badge: 'New' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 'Live' },
  { id: 'operations', label: 'Ops Center (Live)', icon: Cpu, badge: 'Live' },
  { id: 'internal_admin', label: 'Internal Team', icon: Shield, badge: '!' },

  // Founder/CEO Popout
  { id: '_sec_founder', section: 'FOUNDER/CEO' },
  { id: 'roles_duties', label: 'My Role & Duties', icon: Shield },
  { id: 'settings', label: 'God Settings', icon: Settings },
  { id: 'launch_script', label: 'Master Launch Script', icon: FileText },
  { id: 'system_health', label: 'System Health / AI', icon: Zap },
  { id: 'investor_sandbox', label: 'Investor Sandbox', icon: MonitorPlay, badge: 'Demo' },

  // COO/Sr Live Agent Popout
  { id: '_sec_ops', section: 'COO/SR LIVE AGENT' },
  { id: 'virtual_attendant', label: 'GGE World Call Center', icon: Phone },
  { id: 'hr_intelligence', label: 'HR Intelligence (Sylara)', icon: UserPlus },
  { id: 'users', label: 'Personnel Force (Total)', icon: Users },
  { id: 'support_tickets', label: 'Support Tickets', icon: MessageSquare, badge: '12' },
  { id: 'it_support', label: 'IT Support & Diagnostics', icon: MonitorPlay, badge: 'Ryan' },

  // Oversight Popout
  { id: '_sec_oversight', section: 'OVERSIGHT' },
  { id: 'jurisdiction_map', label: 'Nationwide Oversight', icon: Globe },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'regulatory_library', label: 'Regulatory Library', icon: BookOpen },
  { id: 'federal', label: 'Federal Command', icon: Globe },
  { id: 'public_health', label: 'Public Health & Labs', icon: FlaskConical },
  { id: 'judicial', label: 'Judicial Monitor', icon: Scale },
  { id: 'ip_monitor', label: 'IP / Patent Monitor', icon: Shield },
  { id: 'rapid_testing', label: 'Rapid Testing Hub', icon: FlaskConical },
  { id: 'law_enforcement', label: 'Law Enforcement (RIP)', icon: Shield },
  { id: 'state_authority', label: 'Regulator / Authority', icon: Gavel },
  { id: 'external_admin', label: 'External Administrator', icon: Activity },
  { id: 'negligence_intercept', label: 'Negligence Intercept', icon: AlertTriangle, badge: '1' },
  { id: 'patients', label: 'Registry Sovereignty', icon: HeartPulse },
  { id: 'business', label: 'Economic Infrastructure', icon: Building2 },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '12' },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '502' },
  { id: 'processor', label: 'GGE Processor', icon: Activity },

  // Analytics Popout
  { id: '_sec_analytics', section: 'ANALYTICS' },
  { id: 'accounting_ledger', label: 'Accounting Ledger (QuickBooks)', icon: TrendingUp },
  { id: 'global_financials', label: 'Global Financials', icon: TrendingUp },
  { id: 'subscriptions', label: 'Subscriptions & Revenue', icon: CreditCard, badge: 'Live' },
  { id: 'reports', label: 'Master Analytics', icon: BarChart3 },
  { id: 'intel', label: 'Global Intelligence', icon: BookOpen },
  { id: 'logs', label: 'System Logs', icon: Database },
];

export const FounderDashboard = ({ onLogout, user, jurisdiction, marqueeNews, setMarqueeNews, marqueeSpeed, setMarqueeSpeed }: { onLogout?: () => void | Promise<void>, user?: any, jurisdiction?: any, marqueeNews?: string[], setMarqueeNews?: any, marqueeSpeed?: string, setMarqueeSpeed?: any }) => {
  const emailLower = user?.email?.toLowerCase() || '';
  const displayNameLower = user?.displayName?.toLowerCase() || '';
  
  const isMonica = emailLower.includes('compliance.globalgreenhp') || emailLower.includes('monica') || displayNameLower.includes('monica');
  const isRyan = emailLower.includes('ceo.globalgreenhp');
  const isBobAdvisor = emailLower.includes('bobmooregreenenergy') || displayNameLower.includes('bob') || user?.role === 'executive_advisor';
  const isExecutive = isMonica || isRyan;
  
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Shantell';
  const fullName = user?.displayName || 'Shantell Robinson';
  const userTitle = isMonica ? 'Chief Executive Compliance Director' : (isRyan ? 'CEO' : (isBobAdvisor ? 'Executive Advisor' : 'Founder'));

  const [liveStats, setLiveStats] = useState({ totalUsers: '1.2M', netRevenue: '$18.2M' });
  const [actionToast, setActionToast] = useState<{ message: string; timestamp: number } | null>(null);

  const [liveAnalytics, setLiveAnalytics] = useState({
    users: 4892,
    clicks: 142501,
    conversions: 17670,
    events: [
      { time: 'Just now', user: 'Visitor from Washington D.C.', action: 'Clicked "Federal Pricing Tier"' },
      { time: '2s ago', user: 'Verified Business (OK)', action: 'Completed Metrc Sync' },
      { time: '5s ago', user: 'Anonymous Visitor', action: 'Clicked "DEA Capability Statement"' },
      { time: '12s ago', user: 'Patient (FL)', action: 'Opened Sylara Chatbot' },
      { time: '18s ago', user: 'Google Bot Crawler', action: 'Indexed "SINC Regulatory Hub"' },
    ]
  });

  useEffect(() => {
    // 1. Fetch live metrics from Turso
    const fetchMetrics = async () => {
      try {
        const pRes = await turso.execute('SELECT COUNT(*) as count FROM patients');
        const bRes = await turso.execute('SELECT COUNT(*) as count FROM businesses');
        const users = (Number(pRes.rows[0].count) + Number(bRes.rows[0].count));
        
        const wRes = await turso.execute('SELECT SUM(amount) as total FROM wallet_transactions');
        const rev = Number(wRes.rows[0].total) || 0;

        setLiveStats({
          totalUsers: users > 1000 ? (users / 1000).toFixed(1) + 'K' : (users > 0 ? users.toString() : '1.2M'),
          netRevenue: rev > 0 ? '$' + (rev > 1000000 ? (rev / 1000000).toFixed(1) + 'M' : rev.toLocaleString()) : '$18.2M'
        });
      } catch (err) {
        console.error('Error fetching live metrics:', err);
      }
    };
    
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);

    // 1b. Fetch live tracking analytics
    const fetchAnalytics = async () => {
      try {
        const aggRes = await turso.execute('SELECT * FROM analytics_aggregates LIMIT 1');
        const evRes = await turso.execute('SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 5');

        if (aggRes.rows.length > 0) {
          const row = aggRes.rows[0];
          
          const mappedEvents = evRes.rows.map((r, i) => {
            // Turso SQLite dates are UTC if appended with Z or parsed properly
            const dateStr = r.created_at + (String(r.created_at).endsWith('Z') ? '' : 'Z');
            const date = new Date(dateStr);
            const diffSecs = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
            let timeStr = diffSecs < 60 ? `${diffSecs}s ago` : `${Math.floor(diffSecs/60)}m ago`;
            if (i === 0 && diffSecs < 10) timeStr = 'Just now';
            return {
              time: timeStr,
              user: String(r.user_type),
              action: String(r.details)
            };
          });

          setLiveAnalytics(prev => ({
            ...prev,
            users: Number(row.total_users),
            clicks: Number(row.total_clicks),
            conversions: Number(row.total_conversions),
            events: mappedEvents.length > 0 ? mappedEvents : prev.events
          }));
        }
      } catch (err) {
        console.error('Error fetching real analytics', err);
      }
    };

    fetchAnalytics();
    const analyticsInterval = setInterval(fetchAnalytics, 15000);

    // 2. Universal Button Interceptor for "Live" Demo actions
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button');
      
      // If it's a button inside our dashboard that doesn't already have an onClick or active intercept
      if (btn && btn.textContent && !btn.hasAttribute('onClick') && !btn.hasAttribute('data-action-bound')) {
        const actionText = btn.textContent.trim().substring(0, 40);
        if (!actionText || actionText.length < 2) return;
        
        e.preventDefault();
        
        // Show loading indicator on button
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="animate-pulse">Processing...</span>`;
        btn.classList.add('opacity-80', 'cursor-not-allowed');
        
        try {
          // Log to Turso
          await turso.execute({
            sql: 'INSERT INTO system_logs (level, source, message) VALUES (?, ?, ?)',
            args: ['info', 'Founder Command', `Action Executed: ${actionText} by ${fullName}`]
          });
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('opacity-80', 'cursor-not-allowed');
            setActionToast({ message: `✅ Executed: ${actionText}`, timestamp: Date.now() });
            
            // Clear toast after 3s
            setTimeout(() => setActionToast(null), 3000);
          }, 800);
          
        } catch (err) {
           btn.innerHTML = originalText;
           btn.classList.remove('opacity-80', 'cursor-not-allowed');
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      clearInterval(interval);
      clearInterval(analyticsInterval);
      document.removeEventListener('click', handleClick);
    };
  }, [fullName]);

  const [navItemsList, setNavItemsList] = useState(() => {
    try {
      // Version check: if nav structure changed, reset saved order
      const savedVersion = localStorage.getItem('gghp_nav_version_v3');
      if (savedVersion !== String(NAV_VERSION)) {
        localStorage.removeItem('gghp_nav_order_v3');
        localStorage.removeItem('gghp_section_names');
        localStorage.removeItem('gghp_custom_sections');
        localStorage.setItem('gghp_nav_version_v3', String(NAV_VERSION));
        return [...INITIAL_NAV_ITEMS];
      }

      const saved = localStorage.getItem('gghp_nav_order_v3');
      const savedSectionNames = localStorage.getItem('gghp_section_names');
      const sectionNameMap: Record<string, string> = savedSectionNames ? JSON.parse(savedSectionNames) : {};
      
      let items: NavItem[] = [...INITIAL_NAV_ITEMS];
      if (saved) {
        const savedIds = JSON.parse(saved) as string[];
        // Rebuild nav from saved order — every item now has a stable id
        const idToItem = new Map(INITIAL_NAV_ITEMS.map(item => [item.id!, item]));
        const ordered = savedIds
          .map(id => idToItem.get(id))
          .filter(Boolean) as typeof INITIAL_NAV_ITEMS;
        // Add any new items that weren't in saved order
        INITIAL_NAV_ITEMS.forEach(item => {
          if (!savedIds.includes(item.id!)) ordered.push(item);
        });
        items = ordered;
      }
      
      // Also check for any user-created sections stored separately
      const customSections = localStorage.getItem('gghp_custom_sections');
      if (customSections) {
        const extras = JSON.parse(customSections) as NavItem[];
        extras.forEach(sec => {
          if (!items.some(it => 'section' in it && it.section === sec.section)) {
            items = [...items, sec];
          }
        });
      }
      
      // Apply any renamed section labels — keyed by stable id
      if (Object.keys(sectionNameMap).length > 0) {
        items = items.map(it => {
          if (it.section && it.id && sectionNameMap[it.id]) {
            return { ...it, section: sectionNameMap[it.id] };
          }
          return it;
        });
      }
      
      return items;
    } catch {}
    return INITIAL_NAV_ITEMS;
  });
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const toggleSection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [editingSectionIdx, setEditingSectionIdx] = useState<number | null>(null);

  const handleDragStart = (e: any, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: any, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newItems = [...navItemsList];
    const item = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, item);
    setDraggedIdx(index);
    setNavItemsList(newItems);
    // Persist order to localStorage — all items have stable ids now
    const ids = newItems.map(it => it.id!);
    localStorage.setItem('gghp_nav_order_v3', JSON.stringify(ids));
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [activePopoutSection, setActivePopoutSection] = useState<string | null>('_sec_founder');

  useEffect(() => {
    const larryTabs = ['state_authority', 'federal', 'jurisdiction_map', 'compliance', 'operations', 'internal_admin', 'external_admin'];
    if (larryTabs.includes(activeTab) || isRyan || isMonica) {
      window.dispatchEvent(new CustomEvent('persona-change', { detail: 'larry' }));
    } else {
      window.dispatchEvent(new CustomEvent('persona-change', { detail: 'sylara' }));
    }
  }, [activeTab, isRyan, isMonica]);

  const [isAddingLedgerEntry, setIsAddingLedgerEntry] = useState<'revenue' | 'payable' | null>(null);
  const [activeModal, setActiveModal] = useState<{type: string, data?: any} | null>(null);
  const [ledgerForm, setLedgerForm] = useState({ name: '', amount: '' });
  const [founderLedger, setFounderLedger] = useState<any[]>([]);
  const [founderPayables, setFounderPayables] = useState<any[]>([
    { n: 'Found Bank (Primary Routing)', t: 'Settlement', g: 'N/A', net: 'N/A', s: 'Active', c: 'bg-emerald-600' }
  ]);

  const addRevenueStream = () => {
    setIsAddingLedgerEntry('revenue');
  };
  
  const addPayableStream = () => {
    setIsAddingLedgerEntry('payable');
  };

  const handleSaveLedgerEntry = () => {
    if (isAddingLedgerEntry === 'revenue') {
       setFounderLedger([{ n: ledgerForm.name || 'Custom Revenue Stream', t: 'Manual Entry', g: ledgerForm.amount || '$0', net: ledgerForm.amount || '$0', s: 'Pending', c: 'bg-amber-500' }, ...founderLedger]);
    } else if (isAddingLedgerEntry === 'payable') {
       setFounderPayables([{ n: ledgerForm.name || 'Custom Payable', t: 'Manual Entry', g: ledgerForm.amount || '$0', net: ledgerForm.amount || '$0', s: 'Pending', c: 'bg-amber-500' }, ...founderPayables]);
    }
    setIsAddingLedgerEntry(null);
    setLedgerForm({ name: '', amount: '' });
  };

  useEffect(() => {
    turso.execute('SELECT * FROM founder_ledger').then(res => setFounderLedger(res.rows)).catch(console.error);
  }, []);
  const [regSearch, setRegSearch] = useState('');
  const [regCat, setRegCat] = useState<string | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('🚨 SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS • GLOBAL GREEN HYBRID PLATFORM (GGHP) • ALL SECTORS (GGMA/RIP/SINC) OPERATIONAL');
  const [broadcastType, setBroadcastType] = useState('Urgent Alert (Red)');
  const [marqueeNewsText, setMarqueeNewsText] = useState(() => {
    try {
      const savedNews = localStorage.getItem('gghp_marquee_news');
      return savedNews ? JSON.parse(savedNews).join(' | ') : '🔴 BREAKING: Federal Marijuana Rescheduling - Schedule I → Schedule III NOW OFFICIAL | 📉 OMMA DATA REVEALS STARK REDUCTION IN OKLAHOMA MEDICAL MARIJUANA LICENSING (APRIL 2026) | Sylara AI processed 50,000+ compliance checks this hour';
    } catch (e) {
      return '🔴 BREAKING: Federal Marijuana Rescheduling - Schedule I → Schedule III NOW OFFICIAL | 📉 OMMA DATA REVEALS STARK REDUCTION IN OKLAHOMA MEDICAL MARIJUANA LICENSING (APRIL 2026) | Sylara AI processed 50,000+ compliance checks this hour';
    }
  });
  const [localMarqueeSpeed, setLocalMarqueeSpeed] = useState(() => localStorage.getItem('gghp_marquee_speed') || marqueeSpeed || 'medium');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pin, setPin] = useState('');
  
  const [marketSize, setMarketSize] = useState(250);
  const [stageMultiplier, setStageMultiplier] = useState(1.8);
  const [claimsStrength, setClaimsStrength] = useState(85);
  const [royaltyRate, setRoyaltyRate] = useState(12);
  const [savedSnapshots, setSavedSnapshots] = useState<any[]>([]);

  const calculateValuation = () => {
    const baseValue = 450000;
    const marketFactor = marketSize / 100;
    const valuation = Math.round(baseValue * marketFactor * stageMultiplier * (claimsStrength / 100));
    return {
      low: Math.round(valuation * 0.75),
      mid: valuation,
      high: Math.round(valuation * 1.45),
    };
  };
  const currentValuation = calculateValuation();

  const calculateLicensingRevenue = (midValue: number) => {
    const annual = Math.round(midValue * (royaltyRate / 100));
    return {
      year1: annual,
      year5Cumulative: Math.round(annual * 5 * 1.15),
      fiveYearTotal: Math.round(annual * (1 + 1.15 + 1.15**2 + 1.15**3 + 1.15**4)),
    };
  };
  const currentRevenue = calculateLicensingRevenue(currentValuation.mid);

  const handleSaveSnapshot = () => {
    const snapshot = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      valuationMid: currentValuation.mid,
      marketSize,
      stageMultiplier,
      claimsStrength,
      royaltyRate,
      revenue5Year: currentRevenue.fiveYearTotal,
    };
    setSavedSnapshots([snapshot, ...savedSnapshots]);
    alert('✅ Valuation Snapshot saved to IP Monitor tab!');
  };

  const comparables = [
    { deal: "Abaca FinTech (cannabis banking & credit platform)", value: "$30,000,000", date: "2022 (scaled to 2025 market)", relevance: "Closed-Loop Credit System", multiplier: "Direct fintech IP acquisition" },
    { deal: "AXIM Water-Soluble Cannabinoids Patent (50% assignment)", value: "Multi-million strategic alliance", date: "Jan 2026", relevance: "Forensic THC Detection", multiplier: "Cannabinoid IP licensing precedent" },
    { deal: "Arches Analytics & Delivery Platform (Vireo Growth acquisition)", value: "Part of $75M financing + tech bundle", date: "Dec 2024", relevance: "Regulatory AI Infrastructure", multiplier: "Proprietary compliance tech" },
    { deal: "Dama Financial (acquired by LeafLink)", value: "Embedded in multi-billion GMV platform", date: "2024–2025", relevance: "Closed-Loop Credit + Compliance", multiplier: "Cannabis fintech scale" }
  ];

  const [hideSystemFreeze, setHideSystemFreeze] = useState(() => localStorage.getItem('gghp_system_freeze_dismissed') === 'true');
  const [hideAlertQueue, setHideAlertQueue] = useState(() => localStorage.getItem('gghp_alert_queue_dismissed') === 'true');
  const [isSystemFreezeExpanded, setIsSystemFreezeExpanded] = useState(false);
  const [queueAlerts, setQueueAlerts] = useState([
    { id: 1, type: 'State Auth', color: 'cyan', time: 'Just Now', text: 'OMMA Regulatory Update Triggered' },
    { id: 2, type: 'Federal', color: 'red', time: '2m ago', text: 'DOJ compliance review request logged.' },
    { id: 3, type: 'SINC Alert', color: 'amber', time: '14m ago', text: 'High-risk B2B transaction flagged.' },
    { id: 4, type: 'Direct Transfer', color: 'purple', time: '31m ago', text: 'Media/Press Inquiry transferred from Sylara.' }
  ]);

  const handleRouteAlert = (id: number) => {
    setQueueAlerts(prev => prev.filter(a => a.id !== id));
    alert('Alert routed successfully. You will be notified when the delegated team handles it.');
  };

  const handleBroadcast = () => {
    localStorage.setItem('gghp_platform_alert', broadcastMsg);
    alert('Broadcast Pushed Globally');
  };

  const renderOverview = () => (
    <div className="space-y-6">

      <div className="bg-slate-900 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-indigo-500/10 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="space-y-2">
             <h2 className="text-3xl font-black tracking-tight">Welcome, {isMonica ? 'Executive Director' : (isRyan ? 'CEO' : 'Founder')}.</h2>
             <p className="text-indigo-200 font-medium">Platform state: <span className="text-emerald-400 font-bold">Operational</span> • Registered Trade Name: <span className="text-white font-bold">GLOBAL GREEN HYBRID PLATFORM OPERATING SYSTEM (GGHP-OS)</span></p>
           </div>
           <div className="flex gap-4">
              <div className={cn("text-center px-6", !isExecutive && "border-r border-white/10")}>
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Total Users</p>
                 <p className="text-2xl font-black">{liveStats.totalUsers}</p>
              </div>
              {!isExecutive && (<div className="text-center px-6"><p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Net Revenue</p><p className="text-2xl font-black text-emerald-400">{liveStats.netRevenue}</p></div>)}
           </div>
        </div>
      </div>

      {/* 🌐 GLOBAL REAL-TIME APP TRAFFIC — Founder Only (TOP PRIORITY) */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-xl overflow-hidden text-white relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-lg flex items-center gap-2"><Globe size={20} className="text-blue-400" /> Global Real-Time Traffic Monitor</h3>
              <p className="text-xs text-slate-400 mt-1">Live tracking of all visitors, active sessions, and outbound link clicks across GGP-OS</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Sync Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Current Active Users</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{liveAnalytics.users.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-bold mb-1.5">Right now</span>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total App Clicks (24h)</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-indigo-400">{liveAnalytics.clicks.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-bold mb-1.5">+18%</span>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Link Conversions</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-blue-400">{((liveAnalytics.conversions / liveAnalytics.clicks) * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-emerald-400 font-bold mb-1.5">Avg CR</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Activity size={12} /> Live Traffic Sources</h4>
              <div className="space-y-4">
                {[
                  { source: 'Direct / Bookmarks', traffic: '45%', color: 'bg-indigo-500' },
                  { source: 'Google Organic Search', traffic: '30%', color: 'bg-blue-500' },
                  { source: 'Federal / SAM.gov Referrals', traffic: '15%', color: 'bg-amber-500' },
                  { source: 'Social Media (LinkedIn, X)', traffic: '10%', color: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-300">{item.source}</span>
                      <span className="text-white">{item.traffic}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: item.traffic }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Action Stream */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Search size={12} /> Live Click Stream</h4>
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-3 h-40 overflow-hidden relative">
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none"></div>
                <div className="space-y-3 animate-pulse">
                  {liveAnalytics.events.map((log, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-[9px] text-slate-500 font-bold shrink-0 mt-0.5">{log.time}</span>
                      <div>
                        <p className="text-[10px] font-bold text-blue-300">{log.user}</p>
                        <p className="text-xs text-slate-300">{log.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY BROADCAST COMMAND */}
      <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 text-red-600"><Shield size={120} /></div>
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-red-600/30">
                  <Bell size={20} />
               </div>
               <h3 className="text-xl font-black text-red-900 tracking-tight">Executive Emergency Broadcast</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-end">
               <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-black text-red-700 uppercase tracking-widest">Active Alert Message (Pushed to Landing Page & All Portals)</label>
                  <input 
                    type="text" 
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="E.g., SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS..." 
                    className="w-full px-6 py-4 bg-white border-2 border-red-100 rounded-2xl outline-none focus:border-red-500 font-bold text-red-900 shadow-inner"
                  />
               </div>
               <div className="flex gap-3">
                  <select 
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value)}
                    className="px-6 py-4 bg-white border-2 border-red-100 rounded-2xl font-bold text-slate-700 outline-none"
                  >
                     <option>Urgent Alert (Red)</option>
                     <option>Info Ticker (Green)</option>
                     <option>Success Blast (Emerald)</option>
                  </select>
                  <button 
                    onClick={handleBroadcast}
                    className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95"
                  >
                     BROADCAST LIVE
                  </button>
               </div>
            </div>
            <div className="mt-6 flex items-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-red-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                  SYSTEM BROADCAST ACTIVE
               </div>
               <div className="text-[10px] font-black text-slate-400">LAST UPDATED: 2M AGO BY FOUNDER</div>
            </div>
         </div>

         {/* Green Scroll / Marquee Editor */}
         <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-8 shadow-inner mt-6 w-full">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <Activity size={20} />
               </div>
               <h3 className="text-xl font-black text-emerald-900 tracking-tight">"In The Know" News Ticker</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-end">
               <div className="flex-1 space-y-2 w-full">
                  <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Scrolling Message (Use | to separate)</label>
                  <input 
                    type="text" 
                    value={marqueeNewsText}
                    onChange={(e) => setMarqueeNewsText(e.target.value)}
                    placeholder="E.g., BREAKING NEWS | SYLARA AI SCANNED..." 
                    className="w-full px-6 py-4 bg-white border-2 border-emerald-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-emerald-900 shadow-sm"
                  />
               </div>
               <div className="flex gap-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest px-2">Scroll Speed</label>
                    <select 
                      value={localMarqueeSpeed}
                      onChange={(e) => setLocalMarqueeSpeed(e.target.value)}
                      className="px-6 py-3.5 bg-white border-2 border-emerald-200 rounded-2xl font-bold text-slate-700 outline-none h-14"
                    >
                       <option value="slow">Slow</option>
                       <option value="medium">Medium</option>
                       <option value="fast">Fast</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.setItem('gghp_marquee_news', JSON.stringify(marqueeNewsText.split('|').map(s => s.trim())));
                      localStorage.setItem('gghp_marquee_speed', localMarqueeSpeed);
                      window.dispatchEvent(new Event('storage'));
                      alert('Green Scroll Ticker Updated Globally!');
                    }}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 h-14 self-end"
                  >
                     UPDATE SCROLL
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active States', value: '42', trend: '+2', color: 'blue' },
          { label: 'AI Sync Rate', value: '99.9%', trend: 'Optimal', color: 'emerald' },
          { label: 'Law Enforcement Units', value: '842', trend: '+12', color: 'red' },
          { label: 'Patient Certificates', value: '891,022', trend: '+45k', color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-600">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🌐 GLOBAL SEARCH ANALYTICS — Founder Only */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Search size={20} /></div>
            Global Search Analytics
          </h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            Real-Time Query Sync
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Searches (24h)', value: '1,420,591', trend: '+18.4% vs yesterday', color: 'text-blue-600' },
            { label: 'Google Referrals', value: '842,100', trend: 'Global Green Hybrid', color: 'text-emerald-600' },
            { label: 'Brand Mentions', value: '45,210', trend: 'News & Media', color: 'text-indigo-600' },
            { label: 'Direct URL Hits', value: '533,281', trend: 'Organic Traffic', color: 'text-amber-600' },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">{s.trend}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-2xl p-4 bg-white">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Globe size={14} className="text-blue-500"/> Top Search Terms (Live)</h4>
            <div className="space-y-3">
              {[
                { term: '"GGMA Medical Cannabis Card"', volume: '412,500', pct: 95 },
                { term: '"Global Green Hybrid Platform"', volume: '298,100', pct: 85 },
                { term: '"RIP Enforcement Login"', volume: '150,420', pct: 60 },
                { term: '"SINC Compliance Dashboard"', volume: '95,100', pct: 45 },
                { term: `"${fullName} Cannabis Tech"`, volume: '62,800', pct: 30 },
              ].map((term, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 w-5">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{term.term}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-indigo-600">{term.volume}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-slate-200 rounded-2xl p-4 bg-white">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={14} className="text-emerald-500"/> Search Intent Diagnostics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-600">Patient Onboarding</span>
                <span className="font-black text-emerald-600">45%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div></div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-600">Business / B2B Licensing</span>
                <span className="font-black text-blue-600">30%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div></div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-600">State & Federal Oversight</span>
                <span className="font-black text-red-500">15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div></div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-600">Press & Media Inquiries</span>
                <span className="font-black text-indigo-500">10%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{ width: '10%' }}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🗳️ COMMUNITY POLLS ANALYTICS — Founder Only */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg"><BarChart3 size={20} /></div>
            Community Polls Command
          </h3>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-widest">Live Data</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Votes', value: '87,420', trend: '+2.4k today', color: 'text-emerald-600' },
            { label: 'Active Polls', value: '20', trend: '8 categories', color: 'text-indigo-600' },
            { label: 'Engagement Rate', value: '34.2%', trend: '+8.1% vs last week', color: 'text-amber-600' },
            { label: 'Comments Submitted', value: '1,247', trend: '+89 today', color: 'text-blue-600' },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">{s.trend}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Polls by Engagement */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">🔥 Top Polls by Engagement</h4>
            <div className="space-y-3">
              {[
                { q: 'Should cannabis be rescheduled from Schedule I?', v: '5,911', cat: 'Legal', pct: 92 },
                { q: 'Do you believe cannabis is a natural source of healing?', v: '3,880', cat: 'Healing', pct: 87 },
                { q: 'Should past cannabis convictions be expunged?', v: '5,751', cat: 'Legal', pct: 85 },
                { q: 'Where should cannabis tax revenue go?', v: '7,096', cat: 'Economic', pct: 82 },
                { q: 'Has the stigma around cannabis changed?', v: '5,663', cat: 'Culture', pct: 78 },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 w-5">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{p.q}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">{p.v} votes</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded">{p.cat}</span>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.pct}%` }} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400">{p.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Category Breakdown */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">📊 Votes by Category</h4>
            <div className="space-y-3">
              {[
                { cat: 'Healing & Medical', votes: 15420, pct: 18, color: 'bg-emerald-500' },
                { cat: 'Legal & Expungement', votes: 14200, pct: 16, color: 'bg-blue-600' },
                { cat: 'Economic & Business', votes: 12890, pct: 15, color: 'bg-amber-500' },
                { cat: 'Political & Policy', votes: 11340, pct: 13, color: 'bg-red-500' },
                { cat: 'Culture & Lifestyle', votes: 10560, pct: 12, color: 'bg-pink-500' },
                { cat: 'Demographics', votes: 9800, pct: 11, color: 'bg-indigo-500' },
                { cat: 'Education', votes: 7450, pct: 9, color: 'bg-purple-500' },
                { cat: 'Growth & Priorities', votes: 5760, pct: 6, color: 'bg-teal-500' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${c.color} shrink-0`} />
                  <span className="text-xs font-bold text-slate-700 flex-1">{c.cat}</span>
                  <span className="text-[10px] font-black text-slate-400">{c.votes.toLocaleString()}</span>
                  <div className="w-20">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 w-8 text-right">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3"><Globe size={22} className="text-indigo-500" /> Jurisdiction Performance Matrix</h3>
               <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-widest">Live Sync</span>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead>
                     <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                        <th className="pb-4">State Hub</th>
                        <th className="pb-4">Active Patients</th>
                        <th className="pb-4">Commercial Density</th>
                        <th className="pb-4">Compliance Score</th>
                        <th className="pb-4">Revenue Pulse</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[
                        { s: 'Oklahoma', p: '242,102', d: '2,400', c: 98, r: '+12.4%', up: true },
                        { s: 'California', p: '892,401', d: '1,102', c: 94, r: '+4.2%', up: true },
                        { s: 'Florida', p: '631,092', d: '680', c: 99, r: '+22.1%', up: true },
                        { s: 'Colorado', p: '142,881', d: '542', c: 96, r: '-2.1%', up: false },
                        { s: 'Missouri', p: '88,401', d: '210', c: 92, r: '+8.4%', up: true },
                     ].map((row, i) => (
                        <tr key={i} className="group hover:bg-slate-100 transition-colors">
                           <td className="py-4 font-black text-slate-800">{row.s}</td>
                           <td className="py-4 text-slate-600 font-bold">{row.p}</td>
                           <td className="py-4 text-slate-600 font-bold">{row.d}</td>
                           <td className="py-4">
                              <div className="flex items-center gap-2">
                                 <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[60px]">
                                    <div className={cn("h-full rounded-full", row.c > 95 ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${row.c}%` }}></div>
                                 </div>
                                 <span className="text-[10px] font-black">{row.c}%</span>
                              </div>
                           </td>
                           <td className="py-4">
                              <span className={cn("font-black", row.up ? "text-emerald-500" : "text-red-500")}>{row.r}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3"><Zap size={22} className="text-amber-500" /> Network Health Pulse</h3>
            <div className="flex-1 flex flex-col justify-between">
               <div className="h-40 flex items-end justify-between gap-1">
                  {[30, 45, 35, 60, 55, 70, 65, 80, 85, 90, 85, 95].map((h, i) => (
                     <div key={i} className="flex-1 bg-slate-100 rounded-full relative group">
                        <div className="absolute bottom-0 w-full bg-emerald-500 rounded-full transition-all duration-700" style={{ height: `${h}%` }}></div>
                     </div>
                  ))}
               </div>
               <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sylara AI Response</span>
                     <span className="text-sm font-black text-emerald-600">42ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Care Wallet Throughput</span>
                     <span className="text-sm font-black text-blue-600">2.4k txn/sec</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Global Intelligence Quick Links */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3"><BookOpen size={22} className="text-amber-500" /> Global Intelligence Command</h3>
           <button onClick={() => setActiveTab('intel')} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Sources</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           {[
             { t: 'CRS: Cannabis State of Play', c: 'Federal', u: 'https://www.congress.gov/crs-product/IF12270' },
             { t: 'NCSL Legislation Database', c: 'State', u: 'https://www.ncsl.org/health/state-cannabis-legislation-database' },
             { t: 'FDA Regulation Guide', c: 'Federal', u: 'https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products-including-cannabidiol-cbd' },
             { t: 'Marijuana Moment', c: 'News', u: 'https://www.marijuanamoment.net/' },
             { t: 'OMMA Licensing & Tax Data', c: 'State (OK)', u: 'https://oklahoma.gov/omma/about/licensing-and-tax-data.html' }
           ].map((source, i) => (
             <a key={i} href={source.u} target="_blank" rel="noopener noreferrer" className="p-5 bg-slate-100 rounded-2xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400">{source.c}</p>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 leading-tight">{source.t}</h4>
             </a>
           ))}
        </div>
      </div>
    </div>
  );

  const renderLaunchScript = () => (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><FileText size={160} /></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Platform Launch Master Script</h2>
            <p className="text-slate-400 font-medium">Use this reference sheet while presenting to investors, partners, or state authorities.</p>
         </div>
      </div>

      <div className="space-y-4">
         {[
           {
             t: 'Accounting Ledger (GGP Core)',
             d: 'Quality Assurance: The financial backbone of the entire ecosystem. It breaks down revenue from Sylara Subscriptions, Metrc integrations, Care Wallet B2B transactions, Telehealth, and Jurisdictional licensing. It dynamically tracks gross revenue versus net profit, showing exactly where operational capital is distributed and what is available for founder draw.'
           },
           {
             t: 'Universal Onboarding Engine',
             d: 'Quality Assurance: The identity provisioning system. Only the Founder can deploy dashboards, set administrative hierarchies, and assign specific operational clearances (like AI Negligence intercept) to executives, state regulators, and staff.'
           },
           {
             t: 'Personnel Force Command',
             d: 'The ultimate authority over human capital. Allows executives to track the active workforce, authorize new sentinels, suspend operators globally, and view the raw security/access logs of every login attempt across the network.'
           },
           {
             t: 'Registry Sovereignty',
             d: 'Monitors the flow of medical marijuana patients. Tracks the total verified citizens running through the system, the growth of the registry, and state-by-state reciprocity (how out-of-state patients are syncing into the local markets).'
           },
           {
             t: 'Economic Infrastructure',
             d: 'The commercial oversight map. It monitors every single commercial node (dispensaries, farms, labs) connected to SINC. It integrates directly with Metrc because Metrc API Integration Fees are a core revenue stream. It tracks tax ingress, active lab syncs, and allows the founder to trigger an Emergency Recall if a bad batch is detected on the map.'
           },
           {
             t: 'Agency Approvals & Applications Queue',
             d: 'The interface with state and federal entities. Shows the real-time processing of new business applications, provider credentials, and law enforcement integrations. Highlights priority applications and geospatial distribution of new licenses.'
           },
           {
             t: 'Compliance War Room (Powered by Larry)',
             d: 'The AI Negligence Intercept center. Larry (the Compliance AI) constantly scans POS sales and Metrc batches. If a budtender or farm manager makes a reporting error, Larry catches it and flags it before it triggers an OMMA audit. This is the shield that protects businesses from losing their licenses.'
           },
           {
             t: 'Regulatory Library',
             d: 'A dynamic, constantly updating repository of state and federal cannabis laws. As politicians pass new bills, the library updates to ensure the ecosystem\'s compliance algorithms remain perfectly legal.'
           },
           {
             t: 'Federal Command & Public Health',
             d: 'The high-level government oversight tabs. Prepares the network for DOJ/DEA reporting and monitors lab data for toxic impurities. This proves to investors that the system is ready for national legalization.'
           },
           {
             t: 'Rapid Testing Hub (Breathalyzer Integration)',
             d: 'CRITICAL FEATURE: Designed first and foremost for Law Enforcement (DUI checks, roadside testing). It connects directly via Bluetooth/API to the SINC Breathalyzer. When an individual uses the breathalyzer, it detects THC and alcohol ppm in their breath. The biometric reading is instantly logged on our immutable blockchain ledger. When utilized internally by businesses, if an employee blows over the legal limit, SINC automatically suspends their operational dashboard and locks them out of fleet vehicles. It provides indisputable liability protection.'
           },
           {
             t: 'Judicial Monitor',
             d: 'Tracks active, real-world lawsuits and state administrative actions (e.g., OMMA revoking licenses). The AI studies these real-world enforcement trends to better predict and prevent compliance failures for our clients.'
           }
         ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500"></div> {item.t}
               </h3>
               <p className="text-sm text-slate-600 leading-relaxed font-medium pl-4 border-l-2 border-slate-200">{item.d}</p>
            </div>
         ))}
      </div>
    </div>
  );

  const renderAccountingLedger = () => {
    if (isAddingLedgerEntry) {
      return (
        <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <button onClick={() => setIsAddingLedgerEntry(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
              <ArrowLeft size={18} /> Back to Ledger
           </button>
           <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                {isAddingLedgerEntry === 'revenue' ? 'Add Revenue Stream' : 'Add Account Payable'}
              </h2>
              <p className="text-slate-500 mb-8 font-medium">Enter the details for this new manual ledger entry.</p>
              
              <div className="space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Account / Source Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Consulting Retainer"
                      value={ledgerForm.name}
                      onChange={(e) => setLedgerForm({...ledgerForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Amount (Monthly/Gross)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $5,000"
                      value={ledgerForm.amount}
                      onChange={(e) => setLedgerForm({...ledgerForm, amount: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                 </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                 <button onClick={handleSaveLedgerEntry} className="px-6 py-3 bg-[#1a4731] hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg transition-colors flex-1">
                    Save Entry
                 </button>
              </div>
           </div>
        </div>
      );
    }
    
    return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="bg-emerald-950 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Wallet size={160} className="text-emerald-400" /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">GGP Core Ledger</h2>
            <p className="text-emerald-200 font-medium text-lg">Universal revenue breakdown, taxation vectors, and master settlement routing.</p>
          </div>
          <div className="text-center md:text-right px-8 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Network Gross</p>
            <p className="text-4xl font-black text-white">$28.3M</p>
          </div>
        </div>
      </div>

      <MasterBankingInfo />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Activity size={20} className="text-emerald-600" /> Accounts Receivable (Revenue Streams)</h3>
               <div className="flex gap-2">
                  <button onClick={addRevenueStream} className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">+ Add Revenue Stream</button>
                  <button className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100">Export CSV</button>
               </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Origin Vector</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Gross Revenue</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Net Profit</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(founderLedger.length > 0 ? founderLedger : [
                  { n: 'Sylara Medical Subscriptions', t: 'SaaS / Recurring', g: '$4.2M', net: '$3.8M', s: 'Settled', c: 'bg-emerald-600' },
                  { n: 'Metrc Integration Fees', t: 'API Gateway', g: '$1.8M', net: '$1.5M', s: 'Settled', c: 'bg-emerald-600' },
                  { n: 'Care Wallet Transactions', t: 'B2B Processor', g: '$6.5M', net: '$1.2M', s: 'Liquid', c: 'bg-blue-600' },
                  { n: 'Telehealth Consults', t: 'Service Fee', g: '$1.2M', net: '$950k', s: 'Settled', c: 'bg-emerald-600' },
                  { n: 'State Jurisdiction Licensing', t: 'Enterprise', g: '$1.1M', net: '$880k', s: 'Pending', c: 'bg-amber-500' },
                  { n: 'Back Office Operations (Cannabis)', t: 'Admin Services', g: '$2.4M', net: '$1.9M', s: 'Active', c: 'bg-emerald-600' },
                  { n: 'Back Office Operations (General)', t: 'Admin Services', g: '$1.1M', net: '$820k', s: 'Active', c: 'bg-emerald-600' },
                  { n: 'Attorney / Legal Retainers (Cannabis)', t: 'Professional Svc', g: '$1.8M', net: '$1.4M', s: 'Active', c: 'bg-emerald-600' },
                  { n: 'Attorney / Legal Retainers (General)', t: 'Professional Svc', g: '$890k', net: '$680k', s: 'Active', c: 'bg-blue-600' },
                  { n: 'Ecosystem Add-ons (Patient)', t: 'Marketplace', g: '$620k', net: '$540k', s: 'Active', c: 'bg-emerald-600' },
                  { n: 'Ecosystem Add-ons (Cross-Dashboard)', t: 'Marketplace', g: '$1.3M', net: '$1.1M', s: 'Active', c: 'bg-blue-600' },
                  { n: 'Distributor / Reseller Fees', t: 'Channel Revenue', g: '$950k', net: '$710k', s: 'Active', c: 'bg-emerald-600' },
                  { n: 'Partner Affiliate Commissions', t: 'Partner Program', g: '$480k', net: '$380k', s: 'Active', c: 'bg-blue-600' },
                  { n: 'Enforcement & Finance AI Bundles', t: 'Gov / Enterprise', g: '$2.1M', net: '$1.7M', s: 'Active', c: 'bg-indigo-600' },
                  { n: 'Care Builder Credit Programs', t: 'FinTech', g: '$340k', net: '$290k', s: 'Active', c: 'bg-blue-600' },
                  { n: 'Federal Dashboard Leases', t: 'Gov Contract', g: '$1.5M', net: '$1.2M', s: 'Pending', c: 'bg-amber-500' }
                ]).map((u: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-100 transition-colors group">
                    <td className="px-6 py-5 font-black text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full shadow-sm", u.color || u.c)}></div>
                        <span className="font-bold text-slate-700">{u.origin_vector || u.n}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-500">{u.type || u.t}</td>
                    <td className="px-6 py-5 font-mono font-bold text-slate-700">{u.gross_revenue || u.g}</td>
                    <td className="px-6 py-5 font-mono font-black text-emerald-600">{u.net_profit || u.net}</td>
                    <td className="px-6 py-5">
                      <span className={cn("text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white", u.color || u.c)}>{u.status || u.s}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <h3 className="font-black text-sm text-emerald-400 uppercase tracking-widest mb-6">Net Profit Distribution</h3>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                     <span className="text-slate-400">OpEx & Infrastructure</span>
                     <span className="text-white">12%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500" style={{ width: '12%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                     <span className="text-slate-400">R&D / Sylara AI Engine</span>
                     <span className="text-white">24%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500" style={{ width: '24%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                     <span className="text-slate-400">Founder Equity Net</span>
                     <span className="text-emerald-400">64%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '64%' }}></div>
                  </div>
               </div>
               
               <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available for Draw</p>
                  <p className="text-2xl font-black text-emerald-400">$8.33M</p>
               </div>
               <button className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Authorize Draw</button>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

  const renderFinancials = () => (
    <div className="space-y-6">
      <div className="bg-indigo-950 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={120} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">Global Financial Command</h2>
            <p className="text-indigo-200">Consolidated revenue across all jurisdictions and service tiers.</p>
          </div>
          <div className="text-center md:text-right px-8 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Network Reserves</p>
            <p className="text-4xl font-black text-white">$14.8M</p>
          </div>
        </div>
      </div>

      <MasterBankingInfo />

        {/* GGE Processor Command Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">GGE Processor Command</h2>
            <p className="text-slate-500 text-sm">Standalone Private Settlement Rail for GGE Entities</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-xs font-bold uppercase tracking-wider">
            <Activity size={14} className="animate-pulse" /> Processor: Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ecosystem Processing (MTD)</p>
            <h3 className="text-2xl font-black text-slate-800">$428,910.00</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">+18.5% Growth</p>
          </div>
          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Settlement Buffer</p>
            <h3 className="text-2xl font-black text-slate-800">$125,000.00</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Status: Liquid</p>
          </div>
          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">External Bank Bridge</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Building2 size={16} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-700 uppercase">Settlement Primary</p>
                <p className="text-[9px] text-slate-500">Chase •••• 4921</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-emerald-900 text-emerald-100 rounded-2xl border border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield size={24} className="text-[#D4AF77]" />
            <div>
              <p className="text-xs font-black text-[#D4AF77] uppercase tracking-widest">Compliance Division Override</p>
              <p className="text-[10px] opacity-80">Larry has verified the last 1,284 transactions for 280E audit trails.</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#D4AF77] text-emerald-900 rounded-xl text-[10px] font-black uppercase shadow-lg">View Audit Logs</button>
        </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
         <div className="lg:col-span-2 space-y-6">
           {/* Executive Action Required */}
           <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-6 shadow-xl shadow-amber-900/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20"><Zap size={20} /></div>
                   <div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">Executive Action Required</h3>
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Priority 1: Metrc Compliance</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Due Today</p>
                   <p className="text-xs font-bold text-slate-500">April 21, 2026</p>
                </div>
             </div>
             <div className="bg-white/60 backdrop-blur-md border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-xs">{firstName.charAt(0)}{(fullName.split(' ')[1] || '').charAt(0)}</div>
                   <div>
                      <p className="text-sm font-bold text-slate-800">Metrc API Training & Certification Test</p>
                      <p className="text-xs text-slate-500">Assigned: {fullName} • Estimated: 2.5 Hours</p>
                   </div>
                </div>
                <button onClick={() => window.open('https://www.metrc.com/integrators/training/', '_blank')} className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-black hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/10">Launch Certification Portal</button>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 relative z-10 mt-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                       <Database size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800">Metrc Production Key Approval</p>
                       <p className="text-xs text-slate-500">Global Green Enterprise Inc (SINC) • All Jurisdictions</p>
                    </div>
                 </div>
                 <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10">Approve & Rotate Keys</button>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500"/> Revenue Trajectory (P&L)</h3>
              <div className="flex gap-2">
                 <button className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200">1D</button>
                 <button className="px-3 py-1 bg-indigo-50 text-[10px] font-bold text-indigo-600 rounded-lg border border-indigo-200">1W</button>
                 <button className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200">1M</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 px-2 relative">
               <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                  <div className="border-t border-slate-900 border-dashed w-full"></div>
                  <div className="border-t border-slate-900 border-dashed w-full"></div>
                  <div className="border-t border-slate-900 border-dashed w-full"></div>
               </div>
              {[40, 55, 45, 70, 65, 80, 95, 85, 90, 100, 110, 120].map((h, i) => (
                <div key={i} className="w-full bg-slate-100/50 rounded-t-lg relative group overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-indigo-700 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-lg transition-all duration-700 group-hover:from-indigo-500 group-hover:to-indigo-300" style={{ height: `${h * 0.7}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap shadow-xl z-20">
                      ${(h/10).toFixed(1)}M
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
         </div>

         <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18} className="text-blue-500"/> Financial Liquidity Score</h3>
            <div className="text-center py-6 space-y-2">
               <p className="text-5xl font-black text-slate-900">98.2</p>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Optimal Reserves</p>
               <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
               </div>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">
               System liquidity is currently backing 12 jurisdictions with 100% solvency for all B2B transactions via the Care Wallet infrastructure.
            </p>
          </div>

          <div className="bg-indigo-600 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><Activity size={64} /></div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-2">Network Reserves</h4>
            <p className="text-4xl font-black mb-1">$14.8M</p>
            <p className="text-[10px] font-bold text-indigo-200 mb-6 uppercase tracking-widest">+1.2M THIS MONTH</p>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold transition-all shadow-lg text-sm hover:bg-indigo-50">View Master Ledger</button>
          </div>
        </div>
       </div>
    </div>
  );

  const renderJurisdictionMap = () => (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Nationwide Jurisdiction Oversight</h2>
          <p className="text-slate-400 font-medium">Live deployment status and compliance health across the United States.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-12 shadow-sm h-[600px] flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Map Visualization with Grid Effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
             <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
               {Array.from({length: 400}).map((_, i) => (
                 <div key={i} className="border-[0.5px] border-slate-900" />
               ))}
             </div>
          </div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-indigo-100 mb-8 transform group-hover:rotate-12 transition-transform duration-700">
              <Globe size={48} className="animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">National Grid Active</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">Cross-referencing live METRC data, seed-to-sale logs, and state licensing registries across 14 active jurisdictions.</p>
          </div>

          <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-6">
             {[{l:'States Active',v:'14',c:'text-indigo-600'},{l:'Under Integration',v:'8',c:'text-amber-600'},{l:'Legal Pending',v:'4',c:'text-red-600'}].map((st,i)=>(
               <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{st.l}</p>
                 <p className={cn("text-3xl font-black", st.c)}>{st.v}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><MapIcon size={20} className="text-indigo-500"/> Priority Hubs</h3>
               <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">REAL-TIME</span>
            </div>
            <div className="space-y-6">
              {[
                { s: 'Oklahoma', r: '$4.2M', st: 'Critical', c: 'text-red-600' },
                { s: 'California', r: '$3.8M', st: 'Stable', c: 'text-emerald-600' },
                { s: 'Colorado', r: '$2.9M', st: 'Stable', c: 'text-emerald-600' },
                { s: 'Michigan', r: '$2.1M', st: 'Review', c: 'text-amber-600' }
              ].map((st, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                    <div>
                      <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{st.s}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{st.r} Net Revenue</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", 
                    st.st === 'Critical' ? "bg-red-50 text-red-600" : 
                    st.st === 'Review' ? "bg-amber-50 text-amber-600" : 
                    "bg-emerald-50 text-emerald-600"
                  )}>{st.st}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 text-xs font-black text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest shadow-sm">Initialize State Drill-down</button>
          </div>
        </div>
      </div>
    </div>
  );

  // LIVE PLATFORM PULSE (Real-time listeners)
  const [counts, setCounts] = useState({ users: 1204891, patients: 891022, businesses: 42891, tickets: 12 });
  
  useEffect(() => {
    // Real-time listener for total force
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const total = snap.size;
      // We'll simulate a base number since it's a demo, but in real life snap.size is the truth
      setCounts(prev => ({ ...prev, users: 1204891 + total }));
    });
    return () => unsub();
  }, []);

  const handleHireFire = async (uid: string, action: 'activate' | 'suspend' | 'terminate') => {
    try {
      const userRef = doc(db, 'users', uid);
      const status = action === 'activate' ? 'Active' : (action === 'suspend' ? 'Suspended' : 'Terminated');
      await updateDoc(userRef, { status });
      alert(`SUPREME COMMAND: User status updated to ${status}`);
    } catch (err) {
      console.error('Supreme Command Error:', err);
    }
  };

  const renderPersonnelForce = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Users size={160} /></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Personnel Force Command</h2>
              <p className="text-indigo-200 font-medium text-lg max-w-lg">The Founder's override. Ultimate authority to authorize, suspend, or terminate any privileged entity across the global network.</p>
              <div className="flex gap-4 mt-8">
                 <button className="px-8 py-3 bg-white text-indigo-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform uppercase text-xs">Authorize New Sentinel</button>
                 <button className="px-8 py-3 bg-indigo-500/20 border border-indigo-400/30 text-white font-black rounded-2xl hover:bg-indigo-500/40 transition-all uppercase text-xs">Security Audit</button>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Force</p>
                 <p className="text-3xl font-black">{counts.users.toLocaleString()}</p>
                 <div className="mt-2 text-[10px] font-bold text-emerald-400">+12 Joined Today</div>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Admin Clearances</p>
                 <p className="text-3xl font-black">1.2k</p>
                 <div className="mt-2 text-[10px] font-bold text-amber-400">4 Flagged Sessions</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
               <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Shield size={22} className="text-indigo-600"/> High-Hierarchy Personnel</h3>
               <div className="flex gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search force..." className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 w-64" />
                  </div>
               </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Sentinel / Email</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Clearance</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { n: 'Marcus Johnson', e: 'marcus@ggp-os.com', r: 'Executive Founder', s: 'Active', c: 'bg-indigo-600' },
                  { n: 'Sen. Robert Chen', e: 'rchen@senate.gov', r: 'Federal Oversight', s: 'Active', c: 'bg-blue-600' },
                  { n: 'Emily Davis', e: 'emily.d@omma.ok.gov', r: 'State Regulator', s: 'Active', c: 'bg-emerald-600' },
                  { n: 'Sarah Jenkins', e: 's.jenkins@ggp-os.com', r: 'System Ops', s: 'Suspended', c: 'bg-red-600' }
                ].map((u, i) => (
                  <tr key={i} className="hover:bg-slate-100 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className={cn("w-2 h-2 rounded-full animate-pulse", u.s === 'Active' ? 'bg-emerald-500' : 'bg-red-500')} />
                         <div>
                            <p className="font-black text-slate-800">{u.n}</p>
                            <p className="text-[10px] font-bold text-slate-400">{u.e}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn("text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm", u.c)}>
                        {u.r}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleHireFire(u.e, u.s === 'Active' ? 'suspend' : 'activate')} className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-slate-800 hover:text-white transition-all uppercase">
                         {u.s === 'Active' ? 'Suspend' : 'Grant'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>

         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-8 opacity-10"><Lock size={120} className="text-red-500" /></div>
            <h3 className="font-black text-lg mb-6 italic uppercase">Access Logs</h3>
            <div className="space-y-6">
               {[
                 { t: '04:02 AM', u: 'M. Johnson', a: 'Platform Wipe Guard Initiated', s: 'Verified' },
                 { t: '03:45 AM', u: 'R. Chen', a: 'Accessed Federal Intel Tab', s: 'Verified' },
                 { t: '02:12 AM', u: 'S. Jenkins', a: 'Attempted Root Login', s: 'BLOCKED' },
                 { t: '01:55 AM', u: 'E. Davis', a: 'Approved OK-Sector Batch', s: 'Verified' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="text-[10px] font-mono text-slate-500 pt-1">{log.t}</div>
                    <div>
                       <p className="text-[10px] font-black text-white">{log.u}</p>
                       <p className="text-[11px] text-slate-400 font-medium">{log.a}</p>
                       <span className={cn("text-[9px] font-black uppercase", log.s === 'Verified' ? 'text-emerald-400' : 'text-red-500')}>{log.s}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-10 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black hover:bg-white/10 transition-all">Full Security Log</button>
         </div>
      </div>

      {/* Universal Onboarding & Provisioning Engine */}
      {!isExecutive && (
      <div className="bg-indigo-950 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 rounded-[2.5rem] shadow-xl border border-indigo-500/30 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><UserPlus size={120} className="text-indigo-400" /></div>
         <h3 className="font-black text-2xl text-white mb-2 italic uppercase">Universal Onboarding Engine</h3>
         <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8">Provision Identities • Assign Dashboards • Manage Hierarchy</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Legal Identity (Name/Email)</label>
                  <input type="text" placeholder="e.g. Sarah Jenkins (sarah@ggp-os.com)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Entity Origin</label>
                     <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                        <option className="bg-slate-900">Internal Core (Staff)</option>
                        <option className="bg-slate-900">External Node (Business/Agency)</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Department / Sector</label>
                     <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                        <option className="bg-slate-900">Compliance & Audit</option>
                        <option className="bg-slate-900">Federal Oversight</option>
                        <option className="bg-slate-900">Quality Assurance</option>
                        <option className="bg-slate-900">Field Operations</option>
                        <option className="bg-slate-900">State Regulation</option>
                     </select>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Job Title / Designation</label>
                     <input type="text" placeholder="e.g. Senior Auditor" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Dashboard Provision</label>
                     <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                        <option className="bg-slate-900">Admin Command (Level 4)</option>
                        <option className="bg-slate-900">State Authority (Level 3)</option>
                        <option className="bg-slate-900">Federal Intel (Level 5)</option>
                        <option className="bg-slate-900">Operations Hub (Level 2)</option>
                     </select>
                  </div>
               </div>
            </div>
            
            <div className="bg-black/20 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
               <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Settings size={14}/> Active Duties & Permissions</h4>
                  <div className="space-y-3">
                     {[
                        { l: 'Can intercept AI negligence', c: true },
                        { l: 'Access to B2B Financials', c: false },
                        { l: 'Authorization to Suspend Licenses', c: false },
                        { l: 'Direct Federal Reporting Line', c: false },
                        { l: 'Edit/Update Regulatory Library', c: true }
                     ].map((duty, i) => (
                       <label key={i} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="accent-indigo-500 w-4 h-4 cursor-pointer" defaultChecked={duty.c} />
                          <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{duty.l}</span>
                       </label>
                     ))}
                  </div>
               </div>
               <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/50">
                  Provision Identity & Deploy Dashboard
               </button>
            </div>
         </div>
      </div>
      )}
    </motion.div>
  );

  const renderRegistrySovereignty = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-white border-4 border-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><HeartPulse size={160} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">Registry Sovereignty</h2>
              <p className="text-slate-500 font-bold text-lg max-w-xl">Unified citizen oversight. Monitor patient distribution, medical card velocity, and state-level registration reciprocities in real-time.</p>
           </div>
           <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center min-w-[240px] shadow-2xl">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Total Verified Citizens</p>
              <p className="text-5xl font-black">{counts.patients.toLocaleString()}</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                 <TrendingUp size={16} /> 4.2% Growth (24h)
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Globe size={60} /></div>
            <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Top Growth States</h4>
            <div className="space-y-4">
               {['Oklahoma', 'Missouri', 'Texas', 'Florida'].map((state, i) => (
                 <div key={i} className="flex justify-between items-center">
                    <span className="font-bold text-sm">{state}</span>
                    <span className="text-xs font-black text-emerald-400">+{(12 - i * 2.5).toFixed(1)}%</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
               <Activity size={18} className="text-indigo-600" /> Patient Reciprocity Index
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { l: 'Verified Medical', v: '82%', c: 'bg-emerald-500' },
                 { l: 'Out-of-State Sync', v: '64%', c: 'bg-blue-500' },
                 { l: 'Auto-Renewals', v: '91%', c: 'bg-indigo-500' },
                 { l: 'Minor Patient Approval', v: '12%', c: 'bg-amber-500' }
               ].map((idx, i) => (
                 <div key={i} className="text-center">
                    <p className="text-3xl font-black text-slate-800">{idx.v}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{idx.l}</p>
                    <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                       <div className={cn("h-full", idx.c)} style={{ width: idx.v }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  );

  const renderEconomicInfrastructure = () => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Building2 size={160} /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Economic Infrastructure</h2>
              <p className="text-slate-400 font-medium text-lg">Commercial force monitoring. Audit verified entities, POS integrations, and B2B infrastructure health across all sectors.</p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                 <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Commercial Nodes</p>
                    <p className="text-2xl font-black">{counts.businesses.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Daily Tax Ingress</p>
                    <p className="text-2xl font-black">$412.4k</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Pending Audits</p>
                    <p className="text-2xl font-black">124</p>
                 </div>
              </div>
           </div>
           {/* RAPID TEST PULSE MONITOR */}
           <div className="w-full lg:w-96 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl relative group">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-indigo-600/30">
                 <FlaskConical size={24} className="text-white" />
              </div>
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Zap size={18} className="text-amber-400" /> Rapid Test Pulse
              </h3>
              <div className="space-y-6">
                 {[
                   { l: 'Active Lab Syncs', v: '42', t: 'Nationwide', c: 'text-white' },
                   { l: 'Tests Processed (1h)', v: '1,842', t: '+12%', c: 'text-emerald-400' },
                   { l: 'Flagged Impurities', v: '3', t: 'CRITICAL', c: 'text-red-500 animate-pulse' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase">{stat.l}</p>
                         <p className="text-[10px] font-bold text-slate-400 italic">{stat.t}</p>
                      </div>
                      <p className={cn("text-2xl font-black", stat.c)}>{stat.v}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Emergency Recall Hub</button>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Building2 size={22} className="text-emerald-600"/> Infrastructure Map</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cultivation
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Retail
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div> Lab/Testing
               </div>
            </div>
         </div>
         <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-4">
                  {[
                    { n: 'Apex Dispensary', e: 'hq@apex-med.com', r: 'Dispensary / Retail', j: 'Oklahoma City', s: 'Active' },
                    { n: 'GreenLeaf Farms', e: 'ops@greenleaf.com', r: 'Cultivator / Grow', j: 'Tulsa', s: 'Active' },
                    { n: 'CannaLogic POS', e: 'dev@cannalogic.io', r: 'Integrator / Tech', j: 'National', s: 'Suspended' }
                  ].map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-100 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                             <Building2 size={18} />
                          </div>
                          <div>
                             <p className="font-black text-slate-800">{u.n}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.r}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={cn("text-[10px] font-black uppercase px-3 py-1 rounded-full", u.s === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200')}>
                             {u.s}
                          </span>
                          <button className="p-2 text-slate-400 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16}/></button>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-8">Infrastructure Health</h4>
                  <div className="space-y-6">
                     <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                           <span className="text-slate-500">Lab Integration Sync</span>
                           <span className="text-emerald-400">99.8%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: '99.8%' }}></div>
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                           <span className="text-slate-500">Tax Reporting Velocity</span>
                           <span className="text-indigo-400">88.4%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: '88.4%' }}></div>
                        </div>
                     </div>
                     <p className="text-xs text-slate-400 font-medium leading-relaxed pt-4 italic">
                        Larry is currently monitoring 42,891 commercial nodes. 3 nodes currently require manual Intercept due to POS bridge timing issues in OK-Sector.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Agency Approval War Room</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Credential Verification • Public Health • Law Enforcement</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {['OMMA', 'DOH', 'OSBI', 'DEA'].map((agency, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3"><Shield size={20}/></div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{agency} Channel</p>
              <p className="text-xl font-black text-slate-800">42 <span className="text-[10px] text-emerald-500">Live</span></p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-[400px]">
            <div className="absolute inset-0 opacity-20">
               <svg viewBox="0 0 400 200" className="w-full h-full fill-indigo-500">
                  <circle cx="200" cy="100" r="80" stroke="white" strokeWidth="1" fill="none" />
                  <circle cx="200" cy="100" r="1" fill="white" />
                  <line x1="200" y1="100" x2="300" y2="20" stroke="white" strokeWidth="0.5" />
               </svg>
            </div>
            <div className="relative z-10">
               <h3 className="text-lg font-black uppercase tracking-widest italic text-indigo-400 mb-4">Scanning Agency Nodes...</h3>
               <div className="space-y-4">
                  {['Sector 4-G Check-In', 'Node 12 Verified', 'Auth Stream Primary'].map((msg, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-emerald-400">
                       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                       {msg}
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 mb-6">Pending Credentials</h3>
            <div className="space-y-3">
               {[
                 { n: 'Officer Davis', r: 'Law Enforcement', a: 'OKC PD', d: 'Apr 18', c: 'bg-blue-50 text-blue-600' },
                 { n: 'Dr. Emily Chen', r: 'Health Official', a: 'State Health', d: 'Apr 18', c: 'bg-emerald-50 text-emerald-600' },
                 { n: 'Apex Holdings LLC', r: 'Business Entity', a: 'Private', d: 'Apr 17', c: 'bg-indigo-50 text-indigo-600' },
               ].map((a, i) => (
                 <div key={i} className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all"><UserCheck size={20}/></div>
                       <div>
                          <p className="font-black text-sm text-slate-800">{a.n}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{a.r} • {a.a}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase">Grant</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5"><Layers size={120} /></div>
         <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Applications Command Queue</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Registry Intake Monitoring • Multi-State Sync</p>
         </div>
         <div className="relative z-10 flex gap-3">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center">
               <span className="text-[10px] font-black text-emerald-600 uppercase">Approved (24h)</span>
               <span className="text-xl font-black text-emerald-700">842</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center">
               <span className="text-[10px] font-black text-amber-600 uppercase">Pending Review</span>
               <span className="text-xl font-black text-amber-700">342</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">Geospatial Distribution</h3>
               <span className="text-[10px] font-bold text-slate-400 uppercase">Live Map Feed</span>
            </div>
            <div className="p-8 flex items-center justify-center bg-slate-900 min-h-[300px] relative">
               <div className="absolute inset-0 opacity-30">
                  <svg viewBox="0 0 400 200" className="w-full h-full fill-slate-700">
                     <rect x="50" y="50" width="300" height="100" rx="10" />
                     <circle cx="100" cy="80" r="4" className="fill-emerald-500 animate-pulse" />
                     <circle cx="200" cy="120" r="6" className="fill-blue-500 animate-pulse" />
                     <circle cx="300" cy="70" r="4" className="fill-amber-500 animate-pulse" />
                  </svg>
               </div>
               <div className="relative z-10 text-center">
                  <p className="text-white font-black text-2xl">MAP OVERLAY ACTIVE</p>
                  <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">Geographic Density Monitoring</p>
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 mb-6 flex justify-between items-center">
               Priority Queue
               <button className="text-indigo-600 text-[10px] font-black uppercase hover:underline">View All</button>
            </h3>
            <div className="space-y-4">
               {[
                 { id: 'APP-5021', n: 'Jane Smith', t: 'Patient Card', st: 'Urgent', d: '2m ago', c: 'text-red-600 bg-red-50 border-red-100' },
                 { id: 'APP-5020', n: 'GreenLeaf Farms', t: 'Cultivator', st: 'In Review', d: '15m ago', c: 'text-amber-600 bg-amber-50 border-amber-100' },
                 { id: 'APP-5019', n: 'Dr. Martin', t: 'Provider', st: 'New', d: '1h ago', c: 'text-blue-600 bg-blue-50 border-blue-100' },
                 { id: 'APP-5018', n: 'CannaCare LLC', t: 'Dispensary', st: 'In Review', d: '2h ago', c: 'text-amber-600 bg-amber-50 border-amber-100' },
               ].map((a, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">#{i+1}</div>
                       <div>
                          <p className="font-black text-sm text-slate-800">{a.n}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{a.id} • {a.t}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border", a.c)}>{a.st}</span>
                       <p className="text-[9px] text-slate-400 mt-1 font-bold">{a.d}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Compliance War Room</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-Time Predictive Anomaly Detection</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20">Predictive Audit</button>
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black">History</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-100 border-2 border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[400px]">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg viewBox="0 0 800 400" className="w-full h-full fill-none stroke-slate-300 stroke-2">
                 <path d="M0,350 Q200,300 400,350 T800,300" />
                 <path d="M0,300 Q200,250 400,300 T800,250" strokeDasharray="5,5" />
              </svg>
           </div>
           
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Target size={16} className="text-red-500" /> Risk Vector Analysis (7D)
           </h3>

           <div className="flex items-end justify-between h-48 gap-4 px-4">
              {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                   <div 
                     className={cn("w-full rounded-t-xl transition-all duration-1000", h > 80 ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-indigo-500")}
                     style={{ height: `${h}%` }}
                   ></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Day {i+1}</span>
                </div>
              ))}
           </div>

           <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center animate-pulse"><AlertTriangle size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Critical Vectors</p>
                    <p className="text-xl font-black text-slate-800">12 Pending</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><CircleCheck size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Auto-Resolved</p>
                    <p className="text-xl font-black text-slate-800">1.2k today</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Recent Violations</h3>
           <div className="flex-1 space-y-4">
              {[
                { e: 'Apex Health', f: 'Sales Cap Violation', s: 'High', t: '2h ago', c: 'bg-red-50 text-red-600' },
                { e: 'GreenLeaf Farms', f: 'Inventory Lag', s: 'Medium', t: '4h ago', c: 'bg-amber-50 text-amber-600' },
                { e: 'Metro Transport', f: 'GPS Drift Anomaly', s: 'Low', t: '1d ago', c: 'bg-blue-50 text-blue-600' },
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer group">
                   <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{c.e}</p>
                      <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full", c.c)}>{c.s}</span>
                   </div>
                   <p className="text-xs text-slate-500 font-medium">{c.f}</p>
                   <p className="text-[10px] text-slate-400 mt-2 font-bold">{c.t}</p>
                </div>
              ))}
           </div>
           <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">View All Audit Logs</button>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10"><BarChart3 size={160} /></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Master Analytics Intelligence</h2>
            <p className="text-indigo-400 font-black tracking-widest text-xs uppercase">Predictive Revenue • Market Saturation • Growth Vectors</p>
         </div>
         <div className="relative z-10 flex gap-6">
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Gross Revenue</p>
               <p className="text-3xl font-black text-emerald-400">$482.9M <span className="text-xs font-bold text-emerald-500/50">+18%</span></p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
               <TrendingUp size={18} className="text-indigo-600" /> Revenue Forecast & Market Velocity
            </h3>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
               {[40, 55, 45, 70, 85, 65, 95, 80, 100, 90, 110, 130].map((v, i) => (
                 <div key={i} className="flex-1 group relative">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                       ${v}M
                    </div>
                    <div className="w-full bg-slate-100 rounded-t-lg transition-all duration-500 hover:bg-indigo-600" style={{ height: `${v * 0.4}%` }}></div>
                    <p className="text-[8px] font-black text-slate-400 mt-2 text-center">M{i+1}</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10">Market Saturation</h3>
            <div className="relative w-48 h-48 mx-auto">
               <div className="absolute inset-0 rounded-full border-[16px] border-slate-200"></div>
               <div className="absolute inset-0 rounded-full border-[16px] border-indigo-600 border-t-transparent border-r-transparent rotate-45"></div>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-black text-slate-800">84%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Capacity</p>
               </div>
            </div>
            <div className="mt-10 space-y-4">
               {['Oklahoma: High', 'Missouri: Emerging', 'Florida: Critical'].map((label, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{label.split(':')[0]}</span>
                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg", i===2?"bg-red-50 text-red-600":"bg-emerald-50 text-emerald-600")}>{label.split(':')[1]}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">System Logs</h2>
      <div className="bg-slate-900 rounded-2xl p-6 text-green-400 font-mono text-xs space-y-1 max-h-[60vh] overflow-y-auto">
        {['[2026-04-20 12:01:04] INFO  auth.service — User login: marcus@apex.com (OK)','[2026-04-20 12:01:02] INFO  sync.omma — Batch sync completed: 402 records','[2026-04-20 12:00:58] WARN  compliance — Anomaly flagged: Entity UID-8922 volume spike','[2026-04-20 12:00:45] INFO  wallet.ledger — Token purchase: $250.00 by Patient #4821','[2026-04-20 12:00:30] INFO  rip.command — Unit TX-DPS-42 check-in: coordinates updated','[2026-04-20 12:00:12] INFO  sylara.ai — Session #1204 started: med-card assistance','[2026-04-20 11:59:55] ERROR api.gateway — Rate limit exceeded for IP 192.168.1.42','[2026-04-20 11:59:40] INFO  auth.service — New registration: business_owner (Pending)'].map((log,i)=>(<div key={i} className={cn(log.includes('ERROR')?'text-red-400':log.includes('WARN')?'text-amber-400':'text-green-400')}>{log}</div>))}
      </div>
    </div>
  );

  const renderRegulatoryLibrary = () => {
    const filtered = METRC_MANUAL.filter(s => 
      (s.title.toLowerCase().includes(regSearch.toLowerCase()) || s.content.toLowerCase().includes(regSearch.toLowerCase())) &&
      (!regCat || s.category === regCat)
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><BookOpen size={160} /></div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Regulatory Intelligence Hub</h2>
           <p className="text-indigo-200 font-medium">METRC User Guide & State Law Repository. Synchronized with Oklahoma OMMA Title 63.</p>
           
           <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search laws, SOPs, or compliance rules..." 
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm backdrop-blur-md"
                 />
              </div>
              <div className="flex gap-2">
                 {['Overview', 'Operations', 'Admin', 'Inventory', 'Compliance'].map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setRegCat(regCat === cat ? null : cat)}
                     className={cn(
                       "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                       regCat === cat ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                     )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {filtered.map((item, i) => (
             <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{item.category}</span>
                   <button className="text-slate-300 hover:text-indigo-600 transition-colors"><ArrowUpRight size={18} /></button>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">{item.content}</p>
                <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                   <span className="text-[10px] font-bold text-slate-400 italic">Source: Metrc Guide 2021 v11.1</span>
                   <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Read Full Section</button>
                </div>
             </div>
           ))}
           {filtered.length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-400 italic">No regulatory matches found for "{regSearch}"</div>
           )}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Platform Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"><h3 className="font-bold text-slate-800">General Configuration</h3>{[{l:'Platform Name',v:'GGP-OS'},{l:'Default Jurisdiction',v:'National (US)'},{l:'MFA Enforcement',v:'Required for All'},{l:'Session Timeout',v:'30 minutes'}].map((c,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-100 rounded-xl"><span className="text-sm font-medium text-slate-600">{c.l}</span><span className="text-sm font-bold text-slate-800">{c.v}</span></div>))}</div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"><h3 className="font-bold text-slate-800">API Keys & Integrations</h3>{[{l:'OMMA Sync API',s:'Connected'},{l:'Firebase Auth',s:'Connected'},{l:'Geoapify Address',s:'Connected'},{l:'Stripe Payments',s:'Pending Setup'}].map((a,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-100 rounded-xl"><span className="text-sm font-medium text-slate-600">{a.l}</span><span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",a.s==='Connected'?"bg-emerald-50 text-emerald-600":"bg-amber-50 text-amber-600")}>{a.s}</span></div>))}</div>
      </div>
    </div>
  );

  const renderCallCenter = () => {
    const isConnected = voip800.isConfigured();
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><PhoneCall size={180} /></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
                  <Phone className="text-emerald-400" size={28} />
                  Call Center Command
                </h2>
                <p className="text-emerald-300 font-bold tracking-widest uppercase text-[10px] mt-1">
                  Twilio VoIP Integration • {voip800.getCompanyNumber()}
                </p>
              </div>
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border", isConnected ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-red-500/20 border-red-400/30 text-red-300")}>
                <div className={cn("w-2.5 h-2.5 rounded-full", isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400")} />
                {isConnected ? 'API Connected' : 'Not Configured'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Company Number', value: '1-888-963-4447', icon: Phone, color: 'text-emerald-400' },
                { label: 'Account ID', value: voip800.ACCOUNT_ID || '—', icon: Shield, color: 'text-indigo-400' },
                { label: 'Provider', value: 'Twilio', icon: Globe, color: 'text-cyan-400' },
                { label: 'Status', value: isConnected ? 'Active' : 'Setup Required', icon: Activity, color: isConnected ? 'text-emerald-400' : 'text-amber-400' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <s.icon size={16} className={cn(s.color, "mb-2")} />
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{s.label}</p>
                  <p className="text-lg font-black text-white mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CALL ROUTING CONFIG */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                <PhoneCall size={18} className="text-indigo-600" />
                Call Routing & Forwarding
              </h3>
              <button 
                onClick={async () => {
                  const dest = prompt('Enter forwarding number (e.g. 4055551234):');
                  if (dest) {
                    const ok = await voip800.updateForwarding(dest);
                    alert(ok ? '✅ Forwarding updated!' : '❌ Failed — check Twilio dashboard');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                + Add Forwarding
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { name: 'Main Line → Live Agent', dest: 'Live Sr Agent', type: 'Standard', status: 'Active', icon: PhoneIncoming },
                { name: 'Overflow → Support Desk', dest: 'asstsupport@gmail.com', type: 'Sequential', status: 'Active', icon: PhoneOutgoing },
                { name: 'After Hours → Voicemail', dest: 'VM Box #1', type: 'Scheduled', status: 'Active', icon: PhoneOff },
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <rule.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{rule.name}</p>
                      <p className="text-[11px] text-slate-500">→ {rule.dest} • {rule.type}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{rule.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK SMS COMPOSER */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-600" />
                Quick SMS
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Send from {voip800.getCompanyNumber()}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Recipient Phone</label>
                <input type="tel" placeholder="(555) 123-4567" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none" id="sms-recipient" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Message</label>
                <textarea rows={3} placeholder="Type your SMS message..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" id="sms-body" />
              </div>
              <button 
                onClick={async () => {
                  const to = (document.getElementById('sms-recipient') as HTMLInputElement)?.value;
                  const body = (document.getElementById('sms-body') as HTMLTextAreaElement)?.value;
                  if (to && body) {
                    const result = await voip800.sendSMS(to, body);
                    alert(result ? '✅ SMS sent!' : '❌ Failed — verify number is text-enabled');
                  } else {
                    alert('Please enter a recipient and message.');
                  }
                }}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Send SMS
              </button>
            </div>
          </div>
        </div>

        {/* CALL LOG TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
              <Clock size={18} className="text-slate-600" />
              Recent Call Log
            </h3>
            <button 
              onClick={async () => {
                const calls = await voip800.getCallHistory(10);
                if (calls.length > 0) {
                  alert(`Fetched ${calls.length} call records from Twilio`);
                } else {
                  alert('No call records returned — this may be a new number or API requires dashboard configuration first.');
                }
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Download size={14} /> Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {['Direction', 'From', 'To', 'Status', 'Duration', 'Time'].map(h => (
                    <th key={h} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { dir: 'Inbound', from: '(405) 555-0142', to: '1-888-963-4447', status: 'Completed', dur: '3:24', time: 'Today, 10:15 AM' },
                  { dir: 'Inbound', from: '(918) 555-0198', to: '1-888-963-4447', status: 'Voicemail', dur: '0:45', time: 'Today, 9:42 AM' },
                  { dir: 'Outbound', from: '1-888-963-4447', to: '(405) 555-0267', status: 'Completed', dur: '12:08', time: 'Yesterday, 4:30 PM' },
                  { dir: 'Inbound', from: '(214) 555-0331', to: '1-888-963-4447', status: 'Missed', dur: '—', time: 'Yesterday, 2:15 PM' },
                  { dir: 'Outbound', from: '1-888-963-4447', to: '(405) 555-0142', status: 'Completed', dur: '5:55', time: 'Yesterday, 11:00 AM' },
                ].map((call, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full", call.dir === 'Inbound' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600')}>
                        {call.dir === 'Inbound' ? '📞 IN' : '📤 OUT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{call.from}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{call.to}</td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", 
                        call.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                        call.status === 'Voicemail' ? 'bg-amber-50 text-amber-600' : 
                        'bg-red-50 text-red-600'
                      )}>{call.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{call.dur}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{call.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CONNECTION VERIFICATION */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">API Connection Test</h4>
              <p className="text-xs text-slate-500 mt-1">Verify the Twilio API integration is operational</p>
            </div>
            <button 
              onClick={async () => {
                const result = await voip800.verifyConnection();
                if (result.connected) {
                  alert(`✅ CONNECTED\nAccount: ${result.accountId}\nNumber: ${result.number}`);
                } else {
                  alert(`❌ CONNECTION FAILED\nAccount: ${result.accountId}\nError: ${result.error}\n\nPlease verify credentials in the .env file or configure via Twilio dashboard.`);
                }
              }}
              className="px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Zap size={16} /> Test Connection
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SystemFreezeAlert = () => {
    if (hideSystemFreeze) return null;
    
    if (isSystemFreezeExpanded) {
      return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-red-600 text-white p-8 rounded-3xl shadow-2xl border-4 border-red-400 w-full max-w-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-white text-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <AlertTriangle size={32} />
              </div>
              <button onClick={() => setIsSystemFreezeExpanded(false)} className="text-white hover:text-red-200 transition-colors bg-black/20 p-2 rounded-full">
                <LogOut size={24} />
              </button>
            </div>
            
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">System Freeze Detected</h3>
            <p className="text-sm font-bold opacity-90 mb-6">AI Guardian has initiated immediate fix protocols for OK-Sector.</p>
            
            <div className="bg-black/20 rounded-xl p-4 mb-6">
              <h4 className="text-[10px] font-black tracking-widest uppercase mb-2 text-red-200">Incident Details</h4>
              <p className="text-xs font-medium">Compliance synchronization failure across 3 connected endpoints. Metrc API reporting 429 Too Many Requests. AI Guardian is currently throttling outgoing packets to stabilize the queue.</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  alert('System Freeze alert routed to Engineering Queue.');
                  localStorage.setItem('gghp_system_freeze_dismissed', 'true');
                  setHideSystemFreeze(true);
                }}
                className="flex-1 py-3 bg-white text-red-600 hover:bg-slate-100 transition-colors rounded-xl text-xs font-black uppercase tracking-widest shadow-lg"
              >
                Route to Engineering
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('gghp_system_freeze_dismissed', 'true');
                  setHideSystemFreeze(true);
                }}
                className="px-6 py-3 bg-black/20 text-white hover:bg-black/40 transition-colors rounded-xl text-xs font-black uppercase tracking-widest"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed bottom-10 right-10 z-[100] animate-bounce cursor-pointer" onClick={() => setIsSystemFreezeExpanded(true)}>
        <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl border-4 border-red-400 flex items-center gap-4 max-w-sm hover:bg-red-700 transition-colors">
          <div className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-tight">System Freeze Detected</h4>
            <p className="text-[10px] font-bold opacity-90">AI Guardian is initiating immediate fix protocols for OK-Sector.</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsSystemFreezeExpanded(true); }}
            className="px-3 py-1.5 bg-white text-red-600 hover:bg-slate-100 transition-colors rounded-lg text-[10px] font-black uppercase"
          >
            Review
          </button>
        </div>
      </div>
    );
  };

  const [opsTab, setOpsTab] = useState('call_center');

  const renderOpsCenter = () => {
    const opsTabs = [
      { id: 'call_center', label: 'Call Center', icon: Phone, badge: 'Live' },
      { id: 'ops_support', label: 'Support Tickets', icon: MessageSquare, badge: '12' },
      { id: 'ops_it', label: 'IT Support', icon: MonitorPlay },
      { id: 'ops_hr', label: 'HR Intelligence', icon: UserPlus },
      { id: 'ops_apps', label: 'Applications', icon: FileText, badge: '502' },
      { id: 'ops_personnel', label: 'Personnel Force', icon: Users },
    ];
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center text-white"><Cpu size={20}/></div>
          <div><h2 className="text-2xl font-black text-slate-800 tracking-tight">Ops Center</h2><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Internal Operations Hub • Twilio Connected</p></div>
        </div>
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {opsTabs.map(t => (
            <button key={t.id} onClick={() => setOpsTab(t.id)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", opsTab === t.id ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-white/50")}>
              <t.icon size={15} /> <span className="hidden lg:inline">{t.label}</span>
              {t.badge && <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", t.badge === 'Live' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600')}>{t.badge}</span>}
            </button>
          ))}
        </div>
        {opsTab === 'call_center' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-black flex items-center gap-2"><Phone className="text-emerald-400" size={20}/> Call Center Command</h3>
              <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mt-1">Twilio VoIP • {voip800.getCompanyNumber()} • Account: {voip800.ACCOUNT_ID || '—'}</p>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[{l:'Number',v:'1-888-963-4447'},{l:'Provider',v:'Twilio'},{l:'Account',v:voip800.ACCOUNT_ID||'—'},{l:'Status',v:voip800.isConfigured()?'Active':'Setup'}].map((s,i)=>(<div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3"><p className="text-[9px] font-bold text-white/40 uppercase">{s.l}</p><p className="text-sm font-black text-white mt-0.5">{s.v}</p></div>))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[{n:'Main → Live Agent',d:'Live Sr Agent',t:'Standard',ic:PhoneIncoming},{n:'Overflow → Support',d:'Support Desk',t:'Sequential',ic:PhoneOutgoing},{n:'After Hours → VM',d:'VM Box #1',t:'Scheduled',ic:PhoneOff}].map((r,i)=>(<div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl"><div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><r.ic size={14}/></div><div><p className="text-sm font-bold text-slate-800">{r.n}</p><p className="text-[10px] text-slate-500">→ {r.d} • {r.t}</p></div></div>))}
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div><h4 className="text-sm font-bold text-slate-800">Test Twilio Connection</h4></div>
              <button onClick={async()=>{const r=await voip800.verifyConnection();alert(r.connected?`✅ Connected\nAccount: ${r.accountId}`:`❌ Failed: ${r.error}`);}} className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg flex items-center gap-2"><Zap size={14}/> Test</button>
            </div>
          </div>
        )}
        {opsTab === 'ops_support' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">{[{l:'Avg Wait',v:'1m 42s'},{l:'Agents',v:'42'},{l:'Resolution',v:'94%'}].map((s,i)=>(<div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl text-center"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p><p className="text-2xl font-black text-slate-800">{s.v}</p></div>))}</div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5"><h4 className="font-bold text-slate-800 mb-4">Active Conversations</h4><div className="space-y-2">{[1,2,3,4].map(i=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-slate-400"><Users size={14}/></div><div><p className="text-sm font-bold text-slate-800">User_{4820+i}</p><p className="text-xs text-slate-500">License Status Inquiry</p></div></div><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Wait: 4m</span></div>))}</div></div>
          </div>
        )}
        {opsTab === 'ops_it' && <ITSupportDashboard />}
        {opsTab === 'ops_hr' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">{[{l:'Staff',v:'42'},{l:'Open',v:'8'},{l:'Apps',v:'156'},{l:'Retention',v:'94%'}].map((s,i)=>(<div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl text-center"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p><p className="text-2xl font-black text-slate-800">{s.v}</p></div>))}</div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5"><h4 className="font-bold text-slate-800 mb-4">Hires & Pipeline</h4><div className="space-y-2">{['IT Admin — Ryan Ferrari (Onboarded)','Compliance Analyst — Background Check','Support Lead — Interview Scheduled','Ops Coordinator — Application Received'].map((h,i)=>(<div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700">{h}</div>))}</div></div>
          </div>
        )}
        {opsTab === 'ops_apps' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">{[{l:'Pending',v:'502',c:'text-amber-600'},{l:'Approved',v:'38',c:'text-emerald-600'},{l:'Flagged',v:'12',c:'text-red-600'}].map((s,i)=>(<div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl text-center"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p><p className={`text-2xl font-black ${s.c}`}>{s.v}</p></div>))}</div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="p-4 border-b"><h4 className="font-bold text-slate-800">Applications Queue</h4></div><div className="divide-y">{[{n:'Green Leaf Dispensary',t:'Business License',s:'Pending'},{n:'John D. Carter',t:'Patient Renewal',s:'Review'},{n:'MedCanna Corp',t:'Grower License',s:'Flagged'},{n:'Sarah Williams',t:'Caregiver',s:'Pending'}].map((a,i)=>(<div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"><div><p className="text-sm font-bold text-slate-800">{a.n}</p><p className="text-xs text-slate-500">{a.t}</p></div><span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full",a.s==='Pending'?'bg-amber-50 text-amber-600':a.s==='Flagged'?'bg-red-50 text-red-600':'bg-blue-50 text-blue-600')}>{a.s}</span></div>))}</div></div>
          </div>
        )}
        {opsTab === 'ops_personnel' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">{[{l:'Total',v:'1,247'},{l:'Active',v:'892'},{l:'Leave',v:'45'},{l:'New',v:'28'}].map((s,i)=>(<div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl text-center"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p><p className="text-2xl font-black text-slate-800">{s.v}</p></div>))}</div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="p-4 border-b"><h4 className="font-bold text-slate-800">Personnel Directory</h4></div><div className="divide-y">{[{n:'Live Sr Agent',r:'Founder/CEO'},{n:'Monica Green',r:'Compliance Director'},{n:'Ryan Ferrari',r:'CEO / IT Lead'},{n:'Larry AI',r:'Compliance Officer'},{n:'Sylara AI',r:'Intake Agent'}].map((p,i)=>(<div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Users size={14}/></div><div><p className="text-sm font-bold text-slate-800">{p.n}</p><p className="text-xs text-slate-500">{p.r}</p></div></div><span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span><button className="px-2 py-1 ml-2 rounded bg-amber-500/20 text-amber-600 border border-amber-500/50 text-[9px] font-black uppercase hover:bg-amber-500 hover:text-white transition-colors" onClick={() => alert('Jurisdiction Unlocked. User must complete Intake again.')}>Unlock State</button></div>))}</div></div>
          </div>
        )}
      </div>
    );
  };

  const renderSupportTickets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Support Intelligence Hub</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Active Resolution Streams • AI-Assisted Support</p>
         </div>
         <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex flex-col items-end">
               <p className="text-[10px] font-black text-slate-400 uppercase">Avg. Response</p>
               <p className="text-lg font-black text-emerald-600">0.4m</p>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="flex flex-col items-end">
               <p className="text-[10px] font-black text-slate-400 uppercase">SLA Success</p>
               <p className="text-lg font-black text-indigo-600">99.9%</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { l: 'Critical Tickets', v: '0', c: 'text-emerald-600', i: Shield },
           { l: 'Pending Approval', v: '12', c: 'text-amber-600', i: Clock },
           { l: 'Active Chats', v: '42', c: 'text-indigo-600', i: MessageSquare },
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100", s.c)}><s.i size={24}/></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                 <p className="text-2xl font-black text-slate-800">{s.v}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Ticket Ref</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Subject / Entity</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Agent Assignment</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { id: 'SUP-9921', s: 'POS Integration Timeout', e: 'Apex Health', a: 'Larry', st: 'In Progress', c: 'text-blue-600 bg-blue-50' },
              { id: 'SUP-9920', s: 'License Renewal Inquiry', e: 'GreenLeaf Farms', a: 'Sarah Jenkins', st: 'Pending', c: 'text-amber-600 bg-amber-50' },
              { id: 'SUP-9919', s: 'Account Access Reset', e: 'John Doe', a: 'Bob Moore', st: 'Resolved', c: 'text-emerald-600 bg-emerald-50' },
            ].map((t, i) => (
              <tr key={i} className="hover:bg-slate-100 group transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] font-black text-indigo-600">{t.id}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{t.s}</p>
                  <p className="text-xs text-slate-400 font-medium">{t.e}</p>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-600 flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-slate-200 border border-white" /> {t.a}
                </td>
                <td className="px-6 py-4">
                   <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", t.c)}>{t.st}</span>
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-all">
                  <button className="px-4 py-2 bg-slate-800 text-white text-xs font-black rounded-xl hover:bg-black transition-colors">Intercept</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInternalScheduler = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">{firstName}'s Internal Scheduler</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Private Executive Queue • Color-Coded Departments</p>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden p-8">
        <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-3"><Clock size={20} className="text-indigo-600" /> My Upcoming Appointments & Tickets</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className={cn("p-4 rounded-xl border flex items-center gap-3", isMonica ? "bg-fuchsia-50 border-fuchsia-100" : (isRyan ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"))}>
             <div className={cn("w-4 h-4 rounded-full", isMonica ? "bg-fuchsia-600" : (isRyan ? "bg-blue-600" : "bg-purple-600"))}></div>
             <span className="text-xs font-bold text-slate-700">Direct Priority ({firstName})</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
             <span className="text-xs font-bold text-slate-700">RIP Intel / Ops</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-amber-500"></div>
             <span className="text-xs font-bold text-slate-700">SINC / Compliance</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
             <span className="text-xs font-bold text-slate-700">Telehealth</span>
          </div>
          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
             <span className="text-xs font-bold text-slate-700">State Authority</span>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-red-600"></div>
             <span className="text-xs font-bold text-slate-700">Federal Oversight</span>
          </div>
        </div>

        <div className="space-y-4">
           {(() => {
             let events = [];
             if (isMonica) {
               events = [
                 { time: 'Today, 10:00 AM', t: 'Compliance Direct Escalation', e: 'Apex Health Legal Team', c: 'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-900', dot: 'bg-fuchsia-600', type: 'Call' },
                 { time: 'Today, 1:30 PM', t: 'OMMA State Regulator Sync', e: 'Emily Davis (OK)', c: 'bg-cyan-50 border-cyan-200 text-cyan-900', dot: 'bg-cyan-500', type: 'Call' },
                 { time: 'Today, 3:00 PM', t: 'HIPAA Violation Review', e: 'SINC Tech Team', c: 'bg-amber-50 border-amber-200 text-amber-900', dot: 'bg-amber-500', type: 'Ticket' },
                 { time: 'Tomorrow, 9:00 AM', t: 'Federal FDA Audit Prep', e: 'Federal Oversight Office', c: 'bg-red-50 border-red-200 text-red-900', dot: 'bg-red-600', type: 'Appointment' },
                 { time: 'Tomorrow, 11:15 AM', t: 'New Facility License Approval', e: 'GreenLeaf Farms', c: 'bg-emerald-50 border-emerald-200 text-emerald-900', dot: 'bg-emerald-500', type: 'Review' },
               ];
             } else if (isRyan) {
               events = [
                 { time: 'Today, 10:00 AM', t: 'Engineering Direct Escalation', e: 'SysOps Team', c: 'bg-blue-100 border-blue-200 text-blue-900', dot: 'bg-blue-600', type: 'Call' },
                 { time: 'Today, 1:30 PM', t: 'AWS Infrastructure Scaling', e: 'DevOps Lead', c: 'bg-cyan-50 border-cyan-200 text-cyan-900', dot: 'bg-cyan-500', type: 'Meeting' },
                 { time: 'Today, 3:00 PM', t: 'Metrc API Auth Hotfix', e: 'SINC Tech Team', c: 'bg-amber-50 border-amber-200 text-amber-900', dot: 'bg-amber-500', type: 'Ticket' },
                 { time: 'Tomorrow, 9:00 AM', t: 'Database Performance Review', e: 'Turso DB Admins', c: 'bg-red-50 border-red-200 text-red-900', dot: 'bg-red-600', type: 'Appointment' },
                 { time: 'Tomorrow, 11:15 AM', t: 'Twilio SIP Trunk Integration', e: 'Voice API Vendor', c: 'bg-emerald-50 border-emerald-200 text-emerald-900', dot: 'bg-emerald-500', type: 'Call' },
               ];
             } else if (isBobAdvisor) {
               events = [
                 { time: 'Today, 10:00 AM', t: 'Investor Relations Briefing', e: 'Venture Partners', c: 'bg-purple-100 border-purple-200 text-purple-900', dot: 'bg-purple-600', type: 'Call' },
                 { time: 'Today, 1:30 PM', t: 'Market Expansion Strategy', e: 'Executive Team', c: 'bg-cyan-50 border-cyan-200 text-cyan-900', dot: 'bg-cyan-500', type: 'Meeting' },
                 { time: 'Today, 3:00 PM', t: 'Financial Risk Assessment', e: 'CFO Office', c: 'bg-amber-50 border-amber-200 text-amber-900', dot: 'bg-amber-500', type: 'Review' },
                 { time: 'Tomorrow, 9:00 AM', t: 'Advisory Board Sync', e: 'External Stakeholders', c: 'bg-red-50 border-red-200 text-red-900', dot: 'bg-red-600', type: 'Appointment' },
                 { time: 'Tomorrow, 11:15 AM', t: 'Telehealth Partner Negotiations', e: 'Dr. Smith', c: 'bg-emerald-50 border-emerald-200 text-emerald-900', dot: 'bg-emerald-500', type: 'Call' },
               ];
             } else {
               // Founder
               events = [
                 { time: 'Today, 10:00 AM', t: 'Direct Escalation (Human Coord)', e: 'Apex Health CEO', c: 'bg-purple-100 border-purple-200 text-purple-900', dot: 'bg-purple-600', type: 'Call' },
                 { time: 'Today, 1:30 PM', t: 'OMMA State Regulator Review', e: 'Emily Davis (OK)', c: 'bg-cyan-50 border-cyan-200 text-cyan-900', dot: 'bg-cyan-500', type: 'Call' },
                 { time: 'Today, 3:00 PM', t: 'Metrc Integration Sync', e: 'SINC Tech Team', c: 'bg-amber-50 border-amber-200 text-amber-900', dot: 'bg-amber-500', type: 'Ticket' },
                 { time: 'Tomorrow, 9:00 AM', t: 'DOJ Intel Review', e: 'Federal Oversight Office', c: 'bg-red-50 border-red-200 text-red-900', dot: 'bg-red-600', type: 'Appointment' },
                 { time: 'Tomorrow, 11:15 AM', t: 'Telehealth Escalation', e: 'Dr. Smith', c: 'bg-emerald-50 border-emerald-200 text-emerald-900', dot: 'bg-emerald-500', type: 'Call' },
               ];
             }
             return events.map((item, i) => (
             <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between ${item.c}`}>
               <div className="flex items-center gap-4">
                 <div className={`w-3 h-3 rounded-full ${item.dot} shadow-sm`}></div>
                 <div>
                   <p className="text-sm font-black">{item.t}</p>
                   <p className="text-xs font-medium opacity-80">{item.e}</p>
                 </div>
               </div>
               <div className="text-right flex items-center gap-6">
                 <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/50">{item.type}</span>
                 <div className="font-mono text-xs font-bold">{item.time}</div>
               </div>
             </div>
           ));
           })()}
        </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden p-8">
         <h3 className="font-black text-white text-lg mb-2">General Support Ticket Queue (Round-Robin)</h3>
         <p className="text-slate-400 text-xs mb-6">These tickets are visible to Call Center & Management for round-robin assignment.</p>
         
         <table className="w-full text-sm text-left">
           <thead className="border-b border-slate-800">
             <tr>
               <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Ticket Ref</th>
               <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Subject</th>
               <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Status</th>
               <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-800">
             {[
               { id: 'SUP-9921', s: 'POS Integration Timeout', st: 'Unassigned', c: 'text-slate-300' },
               { id: 'SUP-9920', s: 'License Renewal Inquiry', st: 'Unassigned', c: 'text-slate-300' },
               { id: 'SUP-9919', s: 'Account Access Reset', st: 'Assigned: Call Center', c: 'text-emerald-400' },
             ].map((t, i) => (
               <tr key={i} className="hover:bg-slate-800 group transition-colors">
                 <td className="px-6 py-4 font-mono text-[10px] font-black text-indigo-400">{t.id}</td>
                 <td className="px-6 py-4 font-bold text-white">{t.s}</td>
                 <td className="px-6 py-4 font-bold text-[10px] uppercase tracking-wider text-slate-400">{t.st}</td>
                 <td className="px-6 py-4 text-right">
                   <button className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-colors">Assign to Me</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );

  const renderHRIntelligence = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
         <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">HR Intelligence Hub</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Managed by Larry AI • The 15% Sentinel Force</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-emerald-50 border border-emerald-200 px-6 py-4 rounded-[2rem] text-center shadow-sm">
               <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Human Ratio</p>
               <p className="text-2xl font-black text-slate-800">15.2%</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 px-6 py-4 rounded-[2rem] text-center shadow-sm">
               <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Total Sentinels</p>
               <p className="text-2xl font-black text-slate-800">428</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Corporate Structure & Departments */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                     <Building2 size={24} className="text-indigo-600" /> Corporate Structure & Departments
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Live Org Chart
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                    { 
                      dept: 'Executive & Strategy', head: `${fullName} (${userTitle})`, 
                      ai: { count: 12, desc: 'Larry Global Monitors, Data Aggregators' }, 
                      humans: { count: 3, desc: 'Founder, CEO, Chief Legal' }, 
                      color: 'bg-indigo-500' 
                    },
                    { 
                      dept: 'Medical & Clinical Intake', head: 'Dr. Sarah Jenkins', 
                      ai: { count: 850, desc: 'Larry Patient Personal Intelligence Assistants, HIPAA Validators' }, 
                      humans: { count: 24, desc: 'Licensed Physicians, RNs, Final-Reviewers' }, 
                      color: 'bg-emerald-500' 
                    },
                    { 
                      dept: 'Regulatory & Compliance', head: 'Marcus Johnson', 
                      ai: { count: 1420, desc: 'L.A.R.R.Y Enforcement Bots, Metrc Sync Nodes' }, 
                      humans: { count: 18, desc: 'Compliance Officers, Legal Analysts' }, 
                      color: 'bg-blue-500' 
                    },
                    { 
                      dept: 'Engineering & SysOps', head: 'Ryan Ferrari', 
                      ai: { count: 310, desc: 'Automated DevSecOps, Load Balancers, Q/A' }, 
                      humans: { count: 12, desc: 'System Architects, DB Administrators' }, 
                      color: 'bg-amber-500' 
                    },
                    { 
                      dept: 'Education & Grants', head: 'Pending Placement', 
                      ai: { count: 15, desc: 'Larry Training Tutors, Curriculum Generators' }, 
                      humans: { count: 8, desc: 'Academy Instructors, Grant Writers' }, 
                      color: 'bg-purple-500' 
                    },
                  ].map((dept, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-100 rounded-[2rem] border border-slate-200 hover:border-indigo-200 transition-all group gap-4">
                       <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${dept.color}`}>
                             <Layers size={20} />
                          </div>
                          <div>
                             <p className="font-black text-slate-800 leading-tight">{dept.dept}</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Head: {dept.head}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-6 md:w-1/2">
                          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-sm relative overflow-hidden group-hover:border-indigo-300 transition-colors">
                             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Bot size={12} className="text-indigo-500" /> AI Force</p>
                             <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-lg font-black text-slate-800">{dept.ai.count}</span>
                                <span className="text-[9px] font-bold text-slate-400 truncate w-full block">{dept.ai.desc}</span>
                             </div>
                          </div>
                          
                          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 shadow-sm relative overflow-hidden group-hover:border-emerald-300 transition-colors">
                             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users size={12} className="text-emerald-500" /> Humans</p>
                             <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-lg font-black text-slate-800">{dept.humans.count}</span>
                                <span className="text-[9px] font-bold text-slate-400 truncate w-full block">{dept.humans.desc}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Performance Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Shield size={80} /></div>
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Staffing Health Index</h4>
                  <div className="flex items-baseline gap-2 mb-6">
                     <span className="text-4xl font-black">96.8</span>
                     <span className="text-sm font-bold text-emerald-400">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Larry AI is successfully managing 98.4% of platform throughput. The Human Sentinel Force is handling the high-hierarchy 1.6% (final authorizations, legal reviews, curriculum approvals) with zero variance.</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Throughput by Dept</h4>
                  <div className="space-y-4">
                     {[
                       { l: 'Regulatory & Compliance', p: 45, c: 'bg-blue-500' },
                       { l: 'Medical & Clinical Intake', p: 35, c: 'bg-emerald-500' },
                       { l: 'Education & Academy', p: 15, c: 'bg-purple-500' },
                       { l: 'Executive Strategy', p: 5, c: 'bg-indigo-500' },
                     ].map((d, i) => (
                       <div key={i}>
                          <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                             <span className="text-slate-500">{d.l}</span>
                             <span className="text-slate-800">{d.p}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className={cn("h-full rounded-full", d.c)} style={{ width: `${d.p}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* The Foundry: Recruitment & Training Pipeline */}
         <div className="space-y-6">
            <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-[#0a0f1c] to-slate-900 rounded-[3rem] p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-20"><GraduationCap size={120} className="text-indigo-400" /></div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-1 flex items-center gap-3 italic">
                     <UserPlus size={28} className="text-indigo-400" /> The Foundry
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Virtual Staffing Pipeline • AI-Led Recruitment</p>
                  
                  <div className="space-y-8">
                     {[
                       { s: 'Advertising', l: 'Elite UQA Guardian', p: 100, st: 'Complete', c: 'text-emerald-400' },
                       { s: 'Assessment', l: '14 Active Applicants', p: 65, st: 'Larry Scoring', c: 'text-indigo-400' },
                       { s: 'The Academy', l: 'Training Phase 2/4', p: 40, st: 'Digital Handbook', c: 'text-amber-400' },
                       { s: 'Certification', l: 'Final Contract Sign', p: 10, st: 'Legal Queue', c: 'text-slate-500' },
                     ].map((step, i) => (
                       <div key={i} className="relative pl-8 border-l border-white/10 pb-8 last:pb-0">
                          <div className={cn("absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-slate-900", i===0?'bg-emerald-500':i===1?'bg-indigo-500':'bg-slate-700')}></div>
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{step.s}</h4>
                             <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg bg-white/5", step.c)}>{step.st}</span>
                          </div>
                          <p className="text-sm font-bold text-white mb-3">{step.l}</p>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className={cn("h-full rounded-full transition-all duration-1000", i===0?'bg-emerald-500':i===1?'bg-indigo-500':'bg-amber-500')} style={{ width: `${step.p}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>

                  <button className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all">
                     Advertise New Virtual Position
                  </button>
               </div>
            </div>

            {/* Negligence Alerts Panel */}
            <div className="bg-red-50 border border-red-200 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-sm font-black text-red-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-600" /> Negligence Alerts
               </h3>
               <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-red-100 shadow-sm relative group overflow-hidden">
                     <div className="absolute top-0 right-0 w-1 h-full bg-red-600"></div>
                     <p className="text-xs font-black text-slate-800 mb-1">Delayed Response: Marcus T.</p>
                     <p className="text-[10px] text-slate-500">Legal Escalation #402 has been idle for 42 minutes. Threshold: 30m.</p>
                     <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-lg">Intercept</button>
                        <button className="px-3 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded-lg">Warn Agent</button>
                     </div>
                  </div>
                  <div className="p-4 bg-white/50 rounded-2xl border border-slate-200">
                     <p className="text-xs font-black text-slate-400 italic">No other critical negligence detected by Larry.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
  const renderRapidTestingHub = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex justify-end print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-xl transition-all">
          <Printer size={18} /> Export / Print Report
        </button>
      </div>
      <div className="bg-indigo-600 bg-gradient-to-br from-indigo-600 via-indigo-900 to-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 p-10 opacity-20"><FlaskConical size={160} className="animate-pulse text-indigo-400" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Rapid Testing Command</h2>
              <p className="text-indigo-200 font-medium text-lg">National laboratory infrastructure. Monitoring purity standards, chemical analysis velocity, and emergency recall protocols across 42 jurisdictions.</p>
              <div className="flex gap-4 mt-8">
                 <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Active Labs</p>
                    <p className="text-2xl font-black">184</p>
                 </div>
                 <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Pass Rate</p>
                    <p className="text-2xl font-black">94.2%</p>
                 </div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl text-center min-w-[280px]">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Tests Processed (24h)</p>
              <p className="text-5xl font-black">42,891</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                 <TrendingUp size={16} /> +18.5% Ingress
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Lab Sync Stream */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <Activity size={24} className="text-indigo-600" /> Lab Integration Pulse
               </h3>
               <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">ALL NODES SYNCED</span>
            </div>
            <div className="space-y-4">
               {[
                 { l: 'Apex Analytics (OKC)', v: '182 tests/hr', st: 'Optimal', p: '99.9%' },
                 { l: 'GreenRiver Labs (Tulsa)', v: '142 tests/hr', st: 'Optimal', p: '98.8%' },
                 { l: 'Metro Testing (Miami)', v: '204 tests/hr', st: 'Maintenance', p: '92.4%' },
                 { l: 'Sovereign Lab (Dallas)', v: '89 tests/hr', st: 'Optimal', p: '99.4%' },
               ].map((lab, i) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-slate-100 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                          <FlaskConical size={20} />
                       </div>
                       <div>
                          <p className="font-black text-slate-800">{lab.l}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{lab.v}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Purity Baseline</p>
                          <p className="text-sm font-black text-slate-800">{lab.p}</p>
                       </div>
                       <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-lg", lab.st === 'Optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                          {lab.st}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Emergency Recall Center */}
         <div className="space-y-6">
            <div className="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform"><AlertTriangle size={80} /></div>
               <h3 className="text-lg font-black italic uppercase mb-4">Recall Intercept</h3>
               <p className="text-red-100 text-xs font-bold leading-relaxed mb-8">Rapid impurity detection has triggered 1 potential recall event in the OK-Sector.</p>
               
               <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
                  <p className="text-[10px] font-black text-red-200 uppercase mb-1">Batch ID: #RE-9921</p>
                  <p className="text-sm font-bold">Impurities Detected: Pesticide X-4</p>
                  <p className="text-[10px] opacity-80 mt-1 italic">Source: GreenLeaf Farms (Tulsa)</p>
               </div>
               
               <button className="w-full py-4 bg-white text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all shadow-xl">
                  EXECUTE NATIONWIDE RECALL
               </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap size={18} className="text-amber-500" /> AI Purity Sentinel
               </h3>
               <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                     Larry is cross-referencing lab data with POS sales velocity. If a batch fails, the system auto-freezes all relevant Care Wallet transactions at the point of sale within <span className="text-indigo-600 font-black">400ms</span>.
                  </p>
                  <div className="pt-4 border-t border-slate-200">
                     <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                        <span className="text-slate-400">Chemical Anomaly Detection</span>
                        <span className="text-indigo-600">Active</span>
                     </div>
                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '100%' }}></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderAutoFixMonitor = () => (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-20"><Zap size={120} className="text-amber-400" /></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
            <Bot size={28} className="text-indigo-400" /> AI System Guardian
          </h3>
          <p className="text-slate-400 font-medium">Real-time proactive monitoring & automated resolution engine.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
              Live Fix Feed
              <span className="flex items-center gap-2 text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                Monitoring
              </span>
            </h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
              {[
                { t: '12:04 PM', m: 'Metrc Sync anomaly detected in OK-Sector', s: 'REVOLVED', r: 'Retried connection via secondary gateway', c: 'text-emerald-400' },
                { t: '11:58 AM', m: 'Database high-latency alert (>500ms)', s: 'OPTIMIZED', r: 'Re-indexed compliance_logs table', c: 'text-blue-400' },
                { t: '11:45 AM', m: 'Unauthorized API access attempt (IP: 192.168.1.4)', s: 'BLOCKED', r: 'IP added to global firewall blacklist', c: 'text-red-400' },
                { t: '11:32 AM', m: 'Care Wallet timeout in POS-Bridge', s: 'FIXED', r: 'Auto-flushed redis cache for bridge-04', c: 'text-emerald-400' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-[10px] font-mono text-slate-500 mt-1">{log.t}</span>
                  <div className="flex-1 border-l-2 border-white/5 pl-4 pb-4">
                    <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{log.m}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-white/5", log.c)}>{log.s}</span>
                      <p className="text-[10px] text-slate-400">{log.r}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white mb-4">Auto-Fix Engine Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Detection Speed</span>
                  <span className="text-xs font-bold text-white">0.02s</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '98%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Success Rate</span>
                  <span className="text-xs font-bold text-white">99.4%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '99.4%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-3xl font-black text-white">4,281</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Issues Auto-Resolved (24h)</p>
              <button className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">View Detailed AI Logs</button>
            </div>
          </div>
        </div>
      </div>

      {/* Roadside Testing Tracker (Copied from IP Monitor) */}
      <div className="bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-900/50 rounded-[2rem] p-10 mt-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-full bg-indigo-500/10 blur-3xl"></div>
         <div className="relative z-10">
           <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><Globe className="text-indigo-400" /> Roadside Testing Regulations Tracker</h2>
           <p className="text-indigo-300 text-sm font-bold mb-8">Current Landscape (April 2026) • Driving licensing demand for Tiered THC Patent</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Federal Level (DOT)</h4>
               <ul className="space-y-3 text-sm text-slate-300 font-medium">
                 <li><span className="text-white font-bold">Status:</span> DOT Part 40 permitted oral fluid testing (Dec 2024).</li>
                 <li><span className="text-white font-bold">Rollout:</span> Mid-2026 (awaiting HHS dual-lab certification).</li>
                 <li><span className="text-white font-bold">Impact:</span> Surging demand for recent-use testing over presence testing.</li>
               </ul>
             </div>
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">State Programs (Live)</h4>
               <ul className="space-y-3 text-sm text-slate-300 font-medium">
                 <li><span className="text-white font-bold">Alabama:</span> First comprehensive U.S. program since 2019. Extensive data pipeline.</li>
                 <li><span className="text-white font-bold">Indiana:</span> Statewide deployment. 200+ devices screening for THC + 5 drugs.</li>
                 <li><span className="text-white font-bold">Oklahoma:</span> DPS pilot launched early 2026. Zero-tolerance for active THC while driving.</li>
               </ul>
             </div>
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Evidentiary Gap</h4>
               <p className="text-sm text-slate-300 font-medium leading-relaxed">
                 Most existing devices detect THC presence long after impairment ends. Your patent solves this with <span className="text-white font-bold">2/5/10 ng/mL thresholds and temporal recency modeling</span>, allowing law enforcement to precisely determine use within the ~2-hour impairment window.
               </p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );

  const renderLawEnforcement = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-xl transition-all">
          <Printer size={18} /> Export / Print Report
        </button>
      </div>
      <div className="bg-slate-950 border border-indigo-500/50 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5"><Shield size={160} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 flex items-center gap-3">
                <Shield className="text-indigo-400" /> Law Enforcement Oversight
              </h2>
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Real-time dispatch, field screening & evidentiary blockchain</p>
            </div>
            <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 text-center backdrop-blur-md">
               <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400 mb-2">Active Field Units</p>
               <p className="text-4xl font-black">412</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Activity className="text-indigo-600" /> Active Dispatches & Stops</h3>
          <div className="space-y-4">
            {[
              { id: 'DP-8291', status: 'Active Screen', unit: 'Unit 44 (Highway Patrol)', time: '2m ago', threat: 'High' },
              { id: 'DP-8290', status: 'Evidence Logged', unit: 'Unit 12 (Metro)', time: '14m ago', threat: 'Low' },
              { id: 'DP-8289', status: 'Lab Routing', unit: 'Unit 08 (County)', time: '45m ago', threat: 'Med' },
            ].map(dispatch => (
              <div key={dispatch.id} className="flex justify-between items-center p-4 bg-slate-100 rounded-xl border border-slate-200">
                <div>
                  <div className="text-sm font-black text-slate-700">{dispatch.unit}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dispatch.id} • {dispatch.time}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-indigo-100 text-indigo-700">{dispatch.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-white shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Database className="text-emerald-400" /> Evidentiary Blockchain</h3>
          <div className="space-y-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>Chain of Custody Status</span>
                <span className="text-emerald-400">100% Immutable</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { hash: '0x8f2...4b1', type: 'Oral Fluid Screen (2 ng/mL)', timestamp: '10:42 AM' },
                { hash: '0x3a1...9c2', type: 'Chain of Custody Transfer', timestamp: '09:15 AM' },
                { hash: '0x7b4...2a9', type: 'Lab Confirmation Request', timestamp: '08:30 AM' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-300">{log.type}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{log.hash} • {log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10"><CreditCard size={120} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <CreditCard className="text-indigo-400" size={28} />
              Platform Subscription Analytics
            </h2>
            <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mt-2">Monthly Recurring Revenue • Active Plans • Add-on Utilization</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex gap-8">
            <div>
               <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Total MRR</p>
               <p className="text-2xl font-black text-emerald-400">$342,850</p>
            </div>
            <div>
               <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Active Subs</p>
               <p className="text-2xl font-black text-white">2,847</p>
            </div>
            <div>
               <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Churn Rate</p>
               <p className="text-2xl font-black text-amber-400">1.2%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { tier: 'Basic', price: '$49/mo', subs: 1420, mrr: '$69,580', color: 'bg-slate-500', pct: 50 },
          { tier: 'Professional', price: '$149/mo', subs: 980, mrr: '$145,920', color: 'bg-indigo-500', pct: 34 },
          { tier: 'Enterprise', price: '$299/mo', subs: 447, mrr: '$133,653', color: 'bg-emerald-500', pct: 16 },
        ].map(t => (
          <div key={t.tier} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-800">{t.tier}</h3>
              <span className="text-xs font-bold text-slate-400">{t.price}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{t.subs.toLocaleString()}</div>
            <p className="text-xs text-slate-400 font-bold mb-3">Active Subscribers</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">{t.pct}% of total</span>
              <span className="text-emerald-600">{t.mrr} MRR</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500" /> Monthly Signups</h3>
          <div className="space-y-3">
            {[
              { month: 'April 2026', signups: 312, revenue: '$46,788' },
              { month: 'March 2026', signups: 287, revenue: '$42,213' },
              { month: 'February 2026', signups: 254, revenue: '$38,846' },
              { month: 'January 2026', signups: 198, revenue: '$28,702' },
            ].map(m => (
              <div key={m.month} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-700">{m.month}</span>
                <div className="flex gap-6 text-xs font-bold">
                  <span className="text-indigo-600">{m.signups} signups</span>
                  <span className="text-emerald-600">{m.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Box size={18} className="text-indigo-500" /> Add-on Revenue</h3>
          <div className="space-y-3">
            {[
              { addon: 'Metrc Integration', users: 892, revenue: '$44,600/mo' },
              { addon: 'AI Compliance Engine', users: 634, revenue: '$31,700/mo' },
              { addon: 'Telehealth Module', users: 445, revenue: '$22,250/mo' },
              { addon: 'Advanced Analytics', users: 312, revenue: '$15,600/mo' },
            ].map(a => (
              <div key={a.addon} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-sm font-bold text-slate-700">{a.addon}</span>
                  <span className="text-xs text-slate-400 ml-2">{a.users} users</span>
                </div>
                <span className="text-xs font-black text-emerald-600">{a.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500" /> By Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { cat: 'Dispensary', count: 1248, pct: '+12%' },
            { cat: 'Cultivator', count: 682, pct: '+8%' },
            { cat: 'Lab / Testing', count: 394, pct: '+15%' },
            { cat: 'Healthcare', count: 523, pct: '+22%' },
          ].map(c => (
            <div key={c.cat} className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-slate-800">{c.count.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{c.cat}</div>
              <div className="text-xs font-black text-emerald-500 mt-1">{c.pct}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'federal': 
        return <div className="h-full w-full -m-10"><FederalDashboard user={user} onLogout={onLogout} /></div>;
      case 'public_health': 
        return <div className="h-full w-full -m-10"><PublicHealthDashboard user={user} onLogout={onLogout} /></div>;
      case 'operations': 
        return <div className="h-full w-full -m-10"><OperationsDashboard user={user} onLogout={onLogout} /></div>;
      case 'internal_admin': 
        return <div className="h-full w-full -m-10"><AdminDashboard user={user} onLogout={onLogout} /></div>;
      case 'external_admin': 
        return <div className="h-full w-full -m-10"><ExternalAdminDashboard user={user} onLogout={onLogout} /></div>;
      case 'state_authority':
        return <div className="h-full w-full -m-10"><StateAuthorityDashboard user={user} onLogout={onLogout} /></div>;
      case 'virtual_attendant':
        return <div className="p-8 h-full overflow-y-auto"><VirtualAttendantTab /></div>;
      case 'processor':
        return (
          <div className="p-8 space-y-6 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">GGE Processor Master Command</h1>
                <p className="text-slate-500">Real-time oversight of the standalone private settlement rail.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-xs font-bold uppercase tracking-wider">Settlement Active</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-xs font-bold uppercase tracking-wider">Liquidity: High</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Network Volume</p>
                <h3 className="text-3xl font-black text-slate-800">$2.48M</h3>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] mt-1"><Activity size={10} /> Live Data Feed</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Settlement Nodes</p>
                <h3 className="text-3xl font-black text-slate-800">42</h3>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] mt-1"><Shield size={10} /> All Nodes Verified</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Bank Bridge</p>
                <h3 className="text-3xl font-black text-slate-800">$0.00</h3>
                <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] mt-1"><Clock size={10} /> Fully Settled</div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-3xl p-8 border border-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu size={120} /></div>
              <div className="relative z-10">
                <h4 className="text-[#D4AF77] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield size={16} /> Compliance Division Master Logs
                </h4>
                <div className="space-y-4">
                   {[
                     { t: '14:02:11', e: 'B2B SETTLEMENT', d: 'Dispensary #482 → Lab #11', a: 'COMPLIANT' },
                     { t: '13:58:42', e: 'RELOAD NODE', d: 'Kiosk OK-49 (Cash Confirmation)', a: 'COMPLIANT' },
                     { t: '13:45:12', e: 'ALLOCATION UTIL', d: 'GGE Allocation #8821 (Case Unlock)', a: 'COMPLIANT' },
                   ].map((log, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                       <span className="font-mono text-slate-400">{log.t}</span>
                       <span className="font-black text-[#D4AF77]">{log.e}</span>
                       <span className="text-slate-300">{log.d}</span>
                       <span className="text-emerald-400 font-black">{log.a}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'subscription': 
        return <SubscriptionPortal userRole="executive_founder" initialPlanId="fed_pro" />;
      case 'investor_sandbox': 
        return <div className="h-full w-full -m-10"><InvestorSandboxTab /></div>;
      case 'overview': return renderOverview();
      case 'accounting_ledger': return renderAccountingLedger();
      case 'launch_script': return renderLaunchScript();
      case 'global_financials': return renderFinancials();
      case 'system_health': return renderAutoFixMonitor();
      case 'jurisdiction_map': return renderJurisdictionMap();
      case 'users': return renderPersonnelForce();
      case 'patients': return renderRegistrySovereignty();
      case 'business': return renderEconomicInfrastructure();
      case 'approvals': return renderApprovals();
      case 'applications': return renderApplications();
      case 'compliance': return renderCompliance();
      case 'regulatory_library': return renderRegulatoryLibrary();
      case 'reports': return renderReports();
      case 'intel': 
        return <div className="h-full w-full -m-10 bg-[#080e1a] p-10 min-h-screen overflow-auto"><LegislativeIntelTab /></div>;
      case 'it_support':
        return <div className="h-full w-full -m-10 p-10 min-h-screen overflow-auto bg-slate-50"><ITSupportDashboard /></div>;
      case 'logs': return renderLogs();
      case 'support_tickets': return renderSupportTickets();
      case 'internal_scheduler': return <UserCalendar user={user} title="Executive Calendar" />;
      case 'subscriptions': return renderSubscriptionsTab();
      case 'negligence_intercept': return <div className="h-full w-full -m-10"><AdminDashboard user={user} initialTab="negligence" onLogout={() => {}} /></div>;
      case 'hr_intelligence': return renderHRIntelligence();
      case 'rapid_testing': return renderRapidTestingHub();
      case 'law_enforcement': return renderLawEnforcement();
      case 'ip_monitor': return renderIPMonitor();
      case 'judicial':
        return <div className="h-full w-full -m-10 bg-[#080e1a] p-10 min-h-screen overflow-auto"><JudicialMonitorTab /></div>;
      case 'roles_duties':
        return <RolePermissionsPanel viewerRole={isMonica ? 'compliance_director' : (isRyan ? 'ceo' : 'founder')} />;
      case 'messages':
        return <InternalMessenger currentUser={{ name: fullName, role: userTitle, roleId: isMonica ? 'compliance_director' : (isRyan ? 'ceo' : 'founder') }} />;
      case 'ai_training': return <div className="h-full w-full -m-10 p-10 bg-slate-50"><AITrainingTab userProfile={user} /></div>;
      case 'settings': return renderSettings();
      case 'call_center': return renderCallCenter();
      default: return renderOverview();
    }
  };

  const renderIPMonitor = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={160} /></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">IP Monitor</h2>
              <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Your complete patent portfolio • Protected & trackable</p>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 text-center">
               <p className="text-2xl font-black text-emerald-400">3</p>
               <p className="text-[10px] uppercase tracking-widest font-bold">Active Assets</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            title: "Tiered Threshold Forensic Oral Fluid Screening System for Δ9-THC",
            type: "Provisional + Utility Patent Application",
            date: "March 26, 2026",
            status: "Active",
            filings: "5 USPTO submissions",
            description: "Multi-channel microfluidic lateral flow device with tiered 2/5/10 ng/mL thresholds and ratio-based temporal recency modeling.",
            files: [
              { name: "Full Utility Patent Application.pdf" },
              { name: "Provisional Application.pdf" },
              { name: "Claims Set.pdf" },
              { name: "Drawings (8 figures).pdf" },
            ]
          },
          {
            id: 2,
            title: "Closed-Loop Private Label Revolving Line of Credit for the Cannabis Industry",
            type: "Provisional Application + Copyright",
            date: "December 2024",
            status: "Registered",
            filings: "Copyright TXu 2-461-818",
            description: "Full closed-loop credit architecture, merchant processing, compliance engine, and jurisdiction-aware lending system.",
            files: [
              { name: "Provisional Patent.pdf" },
              { name: "Drawings.pdf" },
              { name: "Copyright Registration.pdf" },
            ]
          },
          {
            id: 3,
            title: "Multi-Sided Regulatory Infrastructure System with AI-Driven Cross-Module Routing",
            type: "Provisional Application",
            date: "2026",
            status: "Filed",
            filings: "GGP-OS backbone",
            description: "Unified AI routing platform integrating healthcare, legal, compliance, and business modules.",
            files: [
              { name: "Provisional Application.pdf" },
            ]
          }
        ].map(asset => (
          <div key={asset.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:border-emerald-400 transition-colors flex flex-col h-full group">
            <h3 className="text-lg font-black text-slate-800 leading-snug mb-3">{asset.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">{asset.type}</span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">{asset.status}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
              <Clock size={14} /> <span>{asset.date}</span> • <span className="text-emerald-600">{asset.filings}</span>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 flex-1">{asset.description}</p>
            <div className="pt-6 border-t border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FolderLock size={12} /> Attached Documents</p>
              <div className="space-y-2">
                {asset.files.map((file, idx) => (
                  <button key={idx} className="w-full flex justify-between items-center p-3 bg-slate-100 hover:bg-slate-100 rounded-xl text-left transition-colors cursor-pointer group-hover:border-emerald-200 border border-transparent">
                     <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><FileText size={14} className="text-indigo-500" /> {file.name}</span>
                     <Download size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-900/50 rounded-[2rem] p-10 mt-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-full bg-indigo-500/10 blur-3xl"></div>
         <div className="relative z-10">
           <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><Globe className="text-indigo-400" /> Roadside Testing Regulations Tracker</h2>
           <p className="text-indigo-300 text-sm font-bold mb-8">Current Landscape (April 2026) • Driving licensing demand for Tiered THC Patent</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Federal Level (DOT)</h4>
               <ul className="space-y-3 text-sm text-slate-300 font-medium">
                 <li><span className="text-white font-bold">Status:</span> DOT Part 40 permitted oral fluid testing (Dec 2024).</li>
                 <li><span className="text-white font-bold">Rollout:</span> Mid-2026 (awaiting HHS dual-lab certification).</li>
                 <li><span className="text-white font-bold">Impact:</span> Surging demand for recent-use testing over presence testing.</li>
               </ul>
             </div>
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">State Programs (Live)</h4>
               <ul className="space-y-3 text-sm text-slate-300 font-medium">
                 <li><span className="text-white font-bold">Alabama:</span> First comprehensive U.S. program since 2019. Extensive data pipeline.</li>
                 <li><span className="text-white font-bold">Indiana:</span> Statewide deployment. 200+ devices screening for THC + 5 drugs.</li>
                 <li><span className="text-white font-bold">Oklahoma:</span> DPS pilot launched early 2026. Zero-tolerance for active THC while driving.</li>
               </ul>
             </div>
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Evidentiary Gap</h4>
               <p className="text-sm text-slate-300 font-medium leading-relaxed">
                 Most existing devices detect THC presence long after impairment ends. Your patent solves this with <span className="text-white font-bold">2/5/10 ng/mL thresholds and temporal recency modeling</span>, allowing law enforcement to precisely determine use within the ~2-hour impairment window.
               </p>
             </div>
           </div>
         </div>
      </div>

      {/* 📊 ADVANCED IP VALUATION — Moved from Law Enforcement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="col-span-4 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400 rounded-3xl p-8 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5 text-white"><Calculator size={160} /></div>
           <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="flex items-center gap-3 text-white font-black text-2xl uppercase tracking-tight mb-2">
                      <Calculator className="h-6 w-6 text-emerald-400" />
                      Advanced IP Valuation + Licensing Projections
                    </h3>
                    <p className="text-emerald-300 font-bold tracking-widest uppercase text-[10px]">Live estimate • Grounded in 2024–2026 real deals</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <label className="text-white text-[10px] font-black uppercase tracking-widest block">Market Size ($M)</label>
                  <input type="range" min={50} max={1000} value={marketSize} onChange={(e) => setMarketSize(Number(e.target.value))} className="w-full accent-emerald-400" />
                  <div className="text-center text-emerald-300 text-sm font-black">${marketSize}M</div>
                </div>
                <div className="space-y-4">
                  <label className="text-white text-[10px] font-black uppercase tracking-widest block">Stage Multiplier</label>
                  <input type="range" min={1.0} max={3.0} step={0.1} value={stageMultiplier} onChange={(e) => setStageMultiplier(Number(e.target.value))} className="w-full accent-emerald-400" />
                  <div className="text-center text-emerald-300 text-sm font-black">{stageMultiplier.toFixed(1)}x</div>
                </div>
                <div className="space-y-4">
                  <label className="text-white text-[10px] font-black uppercase tracking-widest block">Claims Strength</label>
                  <input type="range" min={50} max={100} value={claimsStrength} onChange={(e) => setClaimsStrength(Number(e.target.value))} className="w-full accent-emerald-400" />
                  <div className="text-center text-emerald-300 text-sm font-black">{claimsStrength}/100</div>
                </div>
                <div className="space-y-4">
                  <label className="text-white text-[10px] font-black uppercase tracking-widest block">Royalty Rate</label>
                  <input type="range" min={5} max={20} step={1} value={royaltyRate} onChange={(e) => setRoyaltyRate(Number(e.target.value))} className="w-full accent-emerald-400" />
                  <div className="text-center text-emerald-300 text-sm font-black">{royaltyRate}%</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-3 text-center divide-x divide-white/10">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">Low Estimate</p>
                      <p className="text-2xl font-black text-white/70">${currentValuation.low.toLocaleString()}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Mid Valuation</p>
                      <p className="text-4xl font-black text-white">${currentValuation.mid.toLocaleString()}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">High Estimate</p>
                      <p className="text-2xl font-black text-white/70">${currentValuation.high.toLocaleString()}</p>
                   </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-emerald-400/30">
                <h4 className="text-white text-[10px] uppercase tracking-widest font-black mb-4">Licensing Revenue Projections (5-Year)</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 p-4 rounded-xl">
                    <div className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">Year 1</div>
                    <div className="text-3xl font-black text-white">${currentRevenue.year1.toLocaleString()}</div>
                  </div>
                  <div className="bg-emerald-400/20 p-4 rounded-xl border border-emerald-400">
                    <div className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">5-Year Cumulative</div>
                    <div className="text-4xl font-black text-white">${currentRevenue.fiveYearTotal.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <div className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">Avg Annual Growth</div>
                    <div className="text-3xl font-black text-white">15%</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Recent Comparable IP Deals (2024–2026)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparables.map((comp, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-emerald-300 text-xs font-bold leading-snug">{comp.deal}</div>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shrink-0">{comp.date}</span>
                      </div>
                      <div className="text-xl font-black text-white mb-2">{comp.value}</div>
                      <p className="text-[10px] text-emerald-200 font-medium mb-1">Relevance: <span className="font-black text-white">{comp.relevance}</span></p>
                      <p className="text-[10px] text-white/50">{comp.multiplier}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSaveSnapshot} className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/50">
                <Save size={18} /> Save Valuation Snapshot to IP Monitor
              </button>
              <p className="text-center text-[10px] font-bold text-emerald-400/50 uppercase tracking-widest">Your portfolio aligns directly with these fintech, cannabinoid, and compliance tech transactions</p>
           </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <Save className="h-6 w-6 text-emerald-600" /> Saved Valuation Snapshots
        </h2>
        {savedSnapshots.length === 0 ? (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-400">
            <Calculator size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold">No snapshots saved yet. Go to the Overview tab to calculate and save a valuation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSnapshots.map(snap => (
              <div key={snap.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{snap.timestamp}</div>
                  <div className="text-2xl font-black text-emerald-600">${snap.valuationMid.toLocaleString()} <span className="text-xs font-bold text-slate-500 uppercase">Mid Valuation</span></div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 bg-slate-100 px-6 py-3 rounded-xl border border-slate-200">
                  <div className="flex flex-col"><span className="text-[9px] uppercase tracking-widest text-slate-400">Market</span> ${snap.marketSize}M</div>
                  <div className="flex flex-col"><span className="text-[9px] uppercase tracking-widest text-slate-400">Stage</span> {snap.stageMultiplier}x</div>
                  <div className="flex flex-col"><span className="text-[9px] uppercase tracking-widest text-slate-400">Claims</span> {snap.claimsStrength}/100</div>
                  <div className="flex flex-col"><span className="text-[9px] uppercase tracking-widest text-slate-400">Royalty</span> {snap.royaltyRate}%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">5-Yr Revenue Projection</div>
                  <div className="text-xl font-black text-slate-800">${snap.revenue5Year.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
        All assets are permanently archived in the system. USPTO receipts and full specifications available on click.
      </div>
    </div>
  );

  const handleDeleteItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (!window.confirm('Remove this label/section permanently?')) return;
    const newItems = [...navItemsList];
    newItems.splice(index, 1);
    setNavItemsList(newItems);
    const ids = newItems.map(it => it.id!);
    localStorage.setItem('gghp_nav_order', JSON.stringify(ids));
  };

  const navGroups: any[] = [];
  let currentGroup: any = null;

  navItemsList.forEach((item, i) => {
    // === FOUNDER-ONLY BLOCKS ===
    const founderOnly = ["accounting_ledger", "global_financials", "hr_intelligence", "launch_script", "jurisdiction_map", "approvals", "ip_monitor"];
    if (isExecutive && (item.section === "FOUNDER/CEO" || founderOnly.includes(item.id || ''))) return;
    if (isRyan && (item.id === "state_authority" || item.id === "federal" || item.id === "system_health")) return;
    if (isMonica && (item.id === "state_authority" || item.id === "federal" || item.id === "system_health")) return;
    const advisorBlocked = ["accounting_ledger", "global_financials", "hr_intelligence", "launch_script", "settings", "system_health", "logs"];
    if (isBobAdvisor && (item.section === "FOUNDER/CEO" || advisorBlocked.includes(item.id || ''))) return;

    if ('section' in item) {
      currentGroup = { item, index: i, children: [] };
      navGroups.push(currentGroup);
    } else {
      if (currentGroup) currentGroup.children.push({ item, index: i });
      else navGroups.push({ item, index: i });
    }
  });

  const activeGroup = navGroups.find(g => g.children && g.item.id === activePopoutSection);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800 font-sans relative">
      
      {/* Global Action Toast */}
      {actionToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
           <Zap size={18} className="text-amber-400" />
           <span className="font-bold text-sm tracking-wide">{actionToast.message}</span>
        </div>
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <Lock size={48} className="text-indigo-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Founder Access Required</h2>
            <p className="text-slate-500 text-sm mb-6">Enter 4-digit Oversight PIN</p>
            <input 
              type="password" 
              maxLength={4} 
              value={pin} 
              onChange={(e) => {
                 setPin(e.target.value);
                 if (e.target.value === '1234') setIsUnlocked(true);
              }} 
              className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl p-4 text-center text-3xl font-black text-slate-800 tracking-[1em] mb-4 outline-none transition-all" 
              placeholder="••••"
            />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Executive Clearance Only</p>
          </div>
        </div>
      )}

      <div className={cn("w-64 bg-slate-950 border-r border-slate-900 flex flex-col hidden md:flex shrink-0 transition-all duration-500 print:hidden z-20 relative", !isUnlocked && "blur-md opacity-50 pointer-events-none")}>
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-black text-sm text-white leading-tight tracking-tight uppercase">
                {isMonica ? 'Executive 1 Command' : (isRyan ? 'Executive.CEO Command Center' : 'Founder Command')}
              </h2>
              <p className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">
                {isExecutive ? 'Compliance Oversight' : 'God View • Platform Owner'}
              </p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 mb-4 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "Founder")}&background=0F172A&color=fff&size=48`} alt="" className="w-full h-full" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{user?.displayName || "Executive Founder"}</p>
              <p className="text-[10px] text-slate-400 font-bold">{userTitle}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
           {navGroups.map((g, gi) => {
             if (g.children) {
               const isPopoutActive = activePopoutSection === g.item.id;
               return (
                 <div key={gi} className="group relative" draggable onDragStart={(e) => handleDragStart(e, g.index)} onDragOver={(e) => handleDragOver(e, g.index)} onDragEnd={() => setDraggedIdx(null)}>
                   <button 
                     onClick={() => setActivePopoutSection(isPopoutActive ? null : g.item.id)}
                     className={cn("w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all", isPopoutActive ? "bg-indigo-600 text-white shadow-xl shadow-indigo-900/40" : "text-slate-400 hover:bg-white/5 hover:text-slate-100", draggedIdx === g.index ? "opacity-30 border border-dashed border-indigo-400" : "")}
                   >
                     <div className="flex items-center gap-3">
                        <GripVertical size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {g.item.section}
                     </div>
                     <div className="flex items-center gap-2">
                       <button onClick={(e) => handleDeleteItem(e, g.index)} className="text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-1" title="Delete Section"><Trash2 size={12} /></button>
                       <span className="opacity-50 text-[14px]">{isPopoutActive ? '-' : '+'}</span>
                     </div>
                   </button>
                 </div>
               );
             } else {
               const item = g.item;
               const displayLabel = isExecutive ? item.label?.replace('God', 'Executive') : item.label;
               return (
                  <div key={gi} draggable onDragStart={(e) => handleDragStart(e, g.index)} onDragOver={(e) => handleDragOver(e, g.index)} onDragEnd={() => setDraggedIdx(null)} className={cn("group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all", activeTab === item.id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100", draggedIdx === g.index ? "opacity-30 border border-dashed border-indigo-400" : "")}>
                    <button onClick={() => { setActiveTab(item.id!); setActivePopoutSection(null); }} className="flex items-center gap-3 flex-1 text-left">
                      <GripVertical size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.icon && <item.icon size={16} className={activeTab === item.id ? "text-white" : "text-slate-500"} />} 
                      {displayLabel}
                    </button>
                    <div className="flex items-center gap-1">
                      {item.badge && <span className="text-[9px] bg-white/10 text-white px-2 py-0.5 rounded-full font-black mr-1">{item.badge}</span>}
                      <button onClick={(e) => handleDeleteItem(e, g.index)} className="text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-1" title="Delete Item"><Trash2 size={12} /></button>
                    </div>
                  </div>
               );
             }
           })}
           <button
             onClick={() => {
               const name = prompt('Enter new group label:');
               if (name && name.trim()) {
                 const newSec = { id: `_sec_custom_${Date.now()}`, section: name.trim().toUpperCase() };
                 const newItems = [...navItemsList, newSec];
                 setNavItemsList(newItems);
                 localStorage.setItem('gghp_nav_order', JSON.stringify(newItems.map(it => it.id!)));
               }
             }}
             className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 hover:bg-white/5 border border-dashed border-white/10 hover:border-emerald-400/30 transition-all"
           >
             <Plus size={14} /> New Group
           </button>
        </div>
        <button onClick={onLogout} className="p-6 border-t border-white/5 flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <LogOut size={18} /> <span className="text-sm font-black uppercase tracking-widest">Master Sign Out</span>
        </button>
      </div>

      {activeGroup && (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0 shadow-2xl z-10 animate-in slide-in-from-left-8 duration-300 relative print:hidden">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                 <h3 className="text-xs font-black text-white uppercase tracking-widest">{activeGroup.item.section}</h3>
                 <p className="text-[10px] font-bold text-slate-500 mt-1">Operational Module</p>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
             {activeGroup.children.map((child: any) => {
                const item = child.item;
                const i = child.index;
                const displayLabel = isExecutive ? item.label?.replace('God', 'Executive') : item.label;
                return (
                  <div 
                    key={item.id || i} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragEnd={() => setDraggedIdx(null)}
                    className={cn("group cursor-grab active:cursor-grabbing w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all", activeTab === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-900/40" : "text-slate-400 hover:bg-white/5 hover:text-slate-100", draggedIdx === i ? "opacity-30 border border-dashed border-indigo-400" : "")}
                  >
                    <button onClick={() => setActiveTab(item.id!)} className="flex items-center gap-3 flex-1 text-left">
                      <GripVertical size={14} className={cn("transition-opacity", activeTab === item.id ? "text-white opacity-50" : "text-slate-500 opacity-0 group-hover:opacity-100")} />
                      {item.icon && <item.icon size={18} className={activeTab === item.id ? "text-white" : "text-slate-500"} />} 
                      {displayLabel}
                    </button>
                    <div className="flex items-center gap-1">
                      {item.badge && <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-black mr-1">{item.badge}</span>}
                      <button onClick={(e) => handleDeleteItem(e, i)} className="text-slate-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-1" title="Delete Item">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
             })}
           </div>
           <button onClick={() => {
              const name = prompt('Enter new item label:');
              if (name && name.trim()) {
                 const newId = `_item_custom_${Date.now()}`;
                 const newItem = { id: newId, label: name.trim(), icon: FileText };
                 const insertIndex = activeGroup.children.length > 0 
                     ? activeGroup.children[activeGroup.children.length - 1].index + 1 
                     : activeGroup.index + 1;
                 const newItemsList = [...navItemsList];
                 newItemsList.splice(insertIndex, 0, newItem);
                 setNavItemsList(newItemsList);
                 localStorage.setItem('gghp_nav_order', JSON.stringify(newItemsList.map(it => it.id!)));
              }
           }} className="p-4 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-400 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              <Plus size={12} /> Add Tool
           </button>
        </div>
      )}

      <div className={cn("flex-1 flex flex-col h-[calc(100vh)] overflow-hidden transition-all duration-500", !isUnlocked && "blur-xl scale-[0.98] opacity-50 pointer-events-none")}>
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-10 bg-white shrink-0 print:hidden">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               SYSTEM ONLINE
            </div>
            <button className="relative p-2.5 bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><Bell size={22} /><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-10">{getContent()}</div>
        
        {/* GLOBAL ALERTS STREAM (RIGHT SIDEBAR) */}
        {!hideAlertQueue && !isExecutive && (
        <div className={cn("w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 transition-all duration-500 hidden xl:flex print:hidden", !isUnlocked && "blur-md opacity-50 pointer-events-none")}>
           <div className="h-20 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-100 shrink-0">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 flex items-center gap-2"><Bell size={16} className="text-indigo-600" /> Executive Oversight & Alert Queue</h3>
              <button onClick={() => {
                localStorage.setItem('gghp_alert_queue_dismissed', 'true');
                setHideAlertQueue(true);
              }} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Dismiss Queue"><LogOut size={16} /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-100/50 custom-scrollbar">
                {queueAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 bg-white border-l-4 border-${alert.color}-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer`}>
                     <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest text-${alert.color}-600 bg-${alert.color}-50 px-2 py-0.5 rounded`}>{alert.type}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{alert.time}</span>
                     </div>
                     <p className="text-xs font-bold text-slate-800">{alert.text}</p>
                     <button onClick={() => handleRouteAlert(alert.id)} className="mt-3 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={12}/> Route to My Scheduler</button>
                  </div>
                ))}
                
                {queueAlerts.length === 0 && (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 flex flex-col items-center justify-center">
                     <CircleCheck size={24} className="mb-2 text-emerald-500 opacity-80" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">All Alerts Routed Successfully</p>
                  </div>
                )}

              {/* Admin & AI Operations Tracker */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2"><Activity size={12} /> Internal Ops Status Checks</h4>
                 <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">AI Sylara</span>
                          <span className="text-[9px] font-bold text-slate-400">1m ago</span>
                       </div>
                       <p className="text-xs font-bold text-slate-700">Daily Metrc Compliance Auto-Audit Completed.</p>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Call Center Ops</span>
                          <span className="text-[9px] font-bold text-slate-400">8m ago</span>
                       </div>
                       <p className="text-xs font-bold text-slate-700">Patient Licensing issue TKT-9428 resolved by Sarah J.</p>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Admin Command</span>
                          <span className="text-[9px] font-bold text-slate-400">12m ago</span>
                       </div>
                       <p className="text-xs font-bold text-slate-700">Business Escalation #402 handed over to Legal Sentinel.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        )}

        <FounderModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

        {/* Proactive System Alert */}
        <SystemFreezeAlert />
      </div>
    </div>
  );
};




