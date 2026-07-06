import React, { useState, useEffect } from 'react';
import { Bell, Globe, Activity, Search, Shield, Cpu, MessageSquare, Bot, PhoneCall, Clock, X, AlertTriangle, Zap, BookOpen, ExternalLink, Download, Eye, BarChart3, UserPlus, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';
import { getSweepFreshness } from '../../lib/regSweep';
import { ImportantUpdates } from '../ImportantUpdates';
import { StateJurisdictionSelector } from '../shared/StateJurisdictionSelector';
import { STATE_REGULATORY_MAP, getTraceabilityBadgeColor, getCannabisStatusColor } from '../../lib/stateRegulatory';
import { NationalEnforcementLedger } from '../federal/NationalEnforcementLedger';
import { RegulatoryCommandCenter } from './RegulatoryCommandCenter';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { FACILITIES, TRANSPORTS, CAMERA_FEEDS } from '../ceye/CEYECommandCenter';

export const OverviewTab = ({
  user,
  fullName,
  userTitle,
  isExecutive,
  isMonica,
  isRyan,
  isBobAdvisor,
  liveStats,
  lastRegSweepDate,
  liveAnalytics,
  pollStats,
  jurisdictionStats,
  liveQueue,
  opsCrmCount,
  opsLiveTasks,
  opsTicketCount,
  queueAlerts,
  setActiveTab,
  notifications,
  setNotifications,
  runCheck,
  healthReport,
  isHealthChecking,
  lastHealthCheck,
  healthHistory
}: {
  user: any;
  fullName: string;
  userTitle: string;
  isExecutive: boolean;
  isMonica: boolean;
  isRyan: boolean;
  isBobAdvisor: boolean;
  liveStats: { totalUsers: string; netRevenue: string };
  lastRegSweepDate: string | null;
  liveAnalytics: any;
  pollStats: any;
  jurisdictionStats: any[];
  liveQueue: any[];
  opsCrmCount: number;
  opsLiveTasks: any[];
  opsTicketCount: number;
  queueAlerts: any[];
  setActiveTab: (tabId: string) => void;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  runCheck: () => Promise<void>;
  healthReport: any;
  isHealthChecking: boolean;
  lastHealthCheck: string;
  healthHistory: any[];
}) => {
  const [hideUpdates, setHideUpdates] = useState(() => localStorage.getItem('ggp_updates_read') === 'true');
  const [isSystemFreezeExpanded, setIsSystemFreezeExpanded] = useState(false);
  const [hideSystemFreeze, setHideSystemFreeze] = useState(() => localStorage.getItem('gghp_system_freeze_dismissed') === 'true');
  const [hideAlertQueue, setHideAlertQueue] = useState(() => localStorage.getItem('gghp_alert_queue_dismissed') === 'true');
  const [overviewJurisdiction, setOverviewJurisdiction] = useState(() => localStorage.getItem('overview_jurisdiction') || 'All States Active');

  // Persist jurisdiction
  useEffect(() => {
    localStorage.setItem('overview_jurisdiction', overviewJurisdiction);
  }, [overviewJurisdiction]);

  const overviewStateData = overviewJurisdiction !== 'All States Active' ? STATE_REGULATORY_MAP[overviewJurisdiction] : null;

  // ── ACTIVE USERS PANEL STATE ──
  const [showActiveUsersPanel, setShowActiveUsersPanel] = useState(false);
  const [activePresenceUsers, setActivePresenceUsers] = useState<{ displayName: string; email: string; role: string; status: string }[]>([]);

  // ── CLICK STREAM TIME RANGE STATE ──
  const [clickStreamRange, setClickStreamRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('today');
  const [clickStreamEvents, setClickStreamEvents] = useState<{ time: string; user: string; action: string }[]>(liveAnalytics.events || []);
  const [clickStreamLoading, setClickStreamLoading] = useState(false);

  const clickStreamRangeLabels: Record<string, string> = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
    all: 'All Time'
  };

  // Fetch active presence users from Firebase when panel opens
  useEffect(() => {
    if (!showActiveUsersPanel) return;
    const fetchPresence = async () => {
      try {
        const { getDocs, collection: fbColl, query: fbQuery, where: fbWhere } = await import('firebase/firestore');
        const presSnap = await getDocs(fbQuery(fbColl(db, 'presence'), fbWhere('status', 'in', ['online', 'away'])));
        const users = presSnap.docs.map(d => {
          const data = d.data();
          return {
            displayName: data.displayName || data.name || '',
            email: data.email || d.id || '',
            role: data.role || data.userType || 'user',
            status: data.status || 'online'
          };
        });
        setActivePresenceUsers(users);
      } catch (e) {
        console.error('Error fetching presence:', e);
        setActivePresenceUsers([]);
      }
    };
    fetchPresence();
  }, [showActiveUsersPanel]);

  // Fetch click stream events by time range
  const fetchClickStreamByRange = async (range: string) => {
    setClickStreamLoading(true);
    try {
      let sinceDate: string;
      const now = new Date();
      switch (range) {
        case 'today': {
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          sinceDate = start.toISOString();
          break;
        }
        case 'week':
          sinceDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'month':
          sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'year':
          sinceDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
          break;
        default:
          sinceDate = '2020-01-01T00:00:00Z';
      }
      const res = await turso.execute({
        sql: 'SELECT * FROM analytics_events WHERE created_at >= ? ORDER BY created_at DESC LIMIT 50',
        args: [sinceDate]
      });
      const mapped: any[] = [];
      res.rows.forEach((r: any) => {
        const dateStr = r.created_at + (String(r.created_at).endsWith('Z') ? '' : 'Z');
        const date = new Date(dateStr);
        const diffSecs = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
        let timeStr: string;
        if (diffSecs < 60) timeStr = `${diffSecs}s ago`;
        else if (diffSecs < 3600) timeStr = `${Math.floor(diffSecs / 60)}m ago`;
        else if (diffSecs < 86400) timeStr = `${Math.floor(diffSecs / 3600)}h ago`;
        else timeStr = `${Math.floor(diffSecs / 86400)}d ago`;
        if (mapped.length === 0 && diffSecs < 10) timeStr = 'Just now';

        const user = String(r.user_type || 'unknown');
        const action = String(r.details || r.path || 'Page view');

        // Check if this event is a duplicate of a mapped event
        const isDuplicate = mapped.some((prev: any) => {
          const prevTime = prev._rawDate;
          const timeDiff = Math.abs(prevTime.getTime() - date.getTime());
          if (timeDiff < 5000) {
            if (prev.user === user && prev.action === action) return true;
            if (prev.action === action) {
              if ((prev.user === 'Anonymous Visitor' && user !== 'Anonymous Visitor') ||
                  (prev.user !== 'Anonymous Visitor' && user === 'Anonymous Visitor')) {
                return true;
              }
            }
          }
          return false;
        });

        if (!isDuplicate) {
          mapped.push({
            time: timeStr,
            user,
            action,
            _rawDate: date
          });
        } else {
          // If existing is anonymous but we have real role, upgrade it
          const idx = mapped.findIndex((prev: any) => {
            const prevTime = prev._rawDate;
            return Math.abs(prevTime.getTime() - date.getTime()) < 5000 && prev.action === action;
          });
          if (idx !== -1 && mapped[idx].user === 'Anonymous Visitor' && user !== 'Anonymous Visitor') {
            mapped[idx].user = user;
          }
        }
      });
      setClickStreamEvents(mapped);
    } catch (e) {
      console.error('Error fetching click stream:', e);
    } finally {
      setClickStreamLoading(false);
    }
  };

  // Initial load + sync with liveAnalytics events
  useEffect(() => {
    if (liveAnalytics.events && liveAnalytics.events.length > 0 && clickStreamRange === 'today') {
      setClickStreamEvents(liveAnalytics.events);
    }
  }, [liveAnalytics.events]);

  // Fetch on initial mount
  useEffect(() => { fetchClickStreamByRange('today'); }, []);

  // ── SEARCH ANALYTICS TIME RANGE STATE ──
  const [searchAnalyticsRange, setSearchAnalyticsRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('all');
  const [searchAnalyticsData, setSearchAnalyticsData] = useState({
    totalClicks: liveAnalytics.clicks || 0,
    conversions: liveAnalytics.conversions || 0,
    clicksByPath: liveAnalytics.clicksByPath || {} as Record<string, number>,
    clicksByUserType: liveAnalytics.clicksByUserType || {} as Record<string, number>
  });

  const searchAnalyticsRangeLabels: Record<string, string> = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
    all: 'All Time'
  };

  const fetchSearchAnalytics = async (range: string) => {
    try {
      let sinceDate: string;
      const now = new Date();
      switch (range) {
        case 'today': {
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          sinceDate = start.toISOString();
          break;
        }
        case 'week':
          sinceDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'month':
          sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'year':
          sinceDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
          break;
        default:
          sinceDate = '2020-01-01T00:00:00Z';
      }

      const [clickRes, convRes, pathRes, utRes] = await Promise.all([
        turso.execute({ sql: 'SELECT COUNT(*) as c FROM analytics_events WHERE created_at >= ?', args: [sinceDate] }),
        turso.execute({ sql: "SELECT COUNT(*) as c FROM analytics_events WHERE created_at >= ? AND path != '/' AND path != ''", args: [sinceDate] }),
        turso.execute({ sql: 'SELECT path, COUNT(*) as c FROM analytics_events WHERE created_at >= ? GROUP BY path ORDER BY c DESC LIMIT 10', args: [sinceDate] }),
        turso.execute({ sql: 'SELECT user_type, COUNT(*) as c FROM analytics_events WHERE created_at >= ? GROUP BY user_type ORDER BY c DESC', args: [sinceDate] })
      ]);

      const clicksByPath: Record<string, number> = {};
      pathRes.rows.forEach((r: any) => { clicksByPath[String(r.path)] = Number(r.c); });

      const clicksByUserType: Record<string, number> = {};
      utRes.rows.forEach((r: any) => { clicksByUserType[String(r.user_type)] = Number(r.c); });

      setSearchAnalyticsData({
        totalClicks: Number(clickRes.rows[0]?.c || 0),
        conversions: Number(convRes.rows[0]?.c || 0),
        clicksByPath,
        clicksByUserType
      });
    } catch (e) {
      console.error('Error fetching search analytics:', e);
    }
  };

  // Sync with parent liveAnalytics when range is 'all' (default)
  useEffect(() => {
    if (searchAnalyticsRange === 'all') {
      setSearchAnalyticsData({
        totalClicks: liveAnalytics.clicks || 0,
        conversions: liveAnalytics.conversions || 0,
        clicksByPath: liveAnalytics.clicksByPath || {},
        clicksByUserType: liveAnalytics.clicksByUserType || {}
      });
    }
  }, [liveAnalytics.clicks, liveAnalytics.conversions, liveAnalytics.clicksByPath, liveAnalytics.clicksByUserType]);

  // ── LIVE ACCOUNT ACTIVITY FEED ──────────────────────────────────────────
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [accountCounts, setAccountCounts] = useState({ total: 0, today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0 });
  const [activityRange, setActivityRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');
  const [selectedActivityUser, setSelectedActivityUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      let today = 0;
      let thisWeek = 0;
      let thisMonth = 0;
      let thisYear = 0;

      const allUsers = snap.docs.map(d => {
        const data = d.data();
        let createdDate: Date | null = null;
        if (data.createdAt?.toDate) {
          createdDate = data.createdAt.toDate();
        } else if (typeof data.createdAt === 'string') {
          createdDate = new Date(data.createdAt);
        }

        if (createdDate) {
          const cStr = createdDate.toISOString().split('T')[0];
          if (cStr === todayStr) today++;
          if (createdDate >= weekAgo) thisWeek++;
          if (createdDate >= monthAgo) thisMonth++;
          if (createdDate >= yearAgo) thisYear++;
        }

        return {
          uid: d.id,
          email: data.email || 'Unknown',
          displayName: data.displayName || data.email?.split('@')[0] || 'Unknown',
          role: data.role || 'user',
          status: data.status || 'Active',
          createdAt: createdDate,
          state: data.state || data.jurisdiction || '',
        };
      });

      // Sort by createdAt descending (most recent first)
      allUsers.sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      setAllAccounts(allUsers);
      setAccountCounts({ total: snap.size, today, thisWeek, thisMonth, thisYear });
    });
    return () => unsub();
  }, []);

  // Filter accounts based on selected time range
  const filteredAccounts = allAccounts.filter(acct => {
    if (activityRange === 'all') return true;
    if (!acct.createdAt) return false;
    const now = new Date();
    const diff = now.getTime() - acct.createdAt.getTime();
    switch (activityRange) {
      case 'today': return diff < 24 * 60 * 60 * 1000;
      case 'week': return diff < 7 * 24 * 60 * 60 * 1000;
      case 'month': return diff < 30 * 24 * 60 * 60 * 1000;
      case 'year': return diff < 365 * 24 * 60 * 60 * 1000;
      default: return true;
    }
  });

  const rangeLabel = { today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year', all: 'All Time' };
  const rangeCount = { today: accountCounts.today, week: accountCounts.thisWeek, month: accountCounts.thisMonth, year: accountCounts.thisYear, all: accountCounts.total };

  const [broadcastMsg, setBroadcastMsg] = useState('🚨 SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS • GLOBAL GREEN HYBRID PLATFORM (GGHP) • ALL SECTORS (GGMA/RIP/SINC) OPERATIONAL');
  const [broadcastType, setBroadcastType] = useState('Urgent Alert (Red)');
  const [marqueeNewsText, setMarqueeNewsText] = useState('🔴 BREAKING: Federal Marijuana Rescheduling - Schedule I → Schedule III NOW OFFICIAL | 📉 OMMA DATA REVEALS STARK REDUCTION IN OKLAHOMA MEDICAL MARIJUANA LICENSING (APRIL 2026) | Sylara AI processed 50,000+ compliance checks this hour');
  const [localMarqueeSpeed, setLocalMarqueeSpeed] = useState(() => localStorage.getItem('gghp_marquee_speed') || 'medium');
  const [localBroadcastSpeed, setLocalBroadcastSpeed] = useState(() => localStorage.getItem('gghp_platform_alert_speed') || 'fast');

  // Sync platform settings from Turso on mount
  useEffect(() => {
    const fetchPlatformSettings = async () => {
      try {
        const res = await turso.execute('SELECT key, value FROM platform_settings');
        if (res.rows && res.rows.length > 0) {
          res.rows.forEach((row: any) => {
            const val = row.value;
            if (row.key === 'gghp_platform_alert') {
              setBroadcastMsg(val);
            } else if (row.key === 'gghp_platform_alert_speed') {
              setLocalBroadcastSpeed(val);
            } else if (row.key === 'gghp_platform_alert_type') {
              setBroadcastType(val);
            } else if (row.key === 'gghp_marquee_news') {
              setMarqueeNewsText(val);
            } else if (row.key === 'gghp_marquee_speed') {
              setLocalMarqueeSpeed(val);
            }
          });
        }
      } catch (err) {
        console.error('Failed to load settings in Overview Tab:', err);
      }
    };
    fetchPlatformSettings();
  }, []);

  const insertEmoji = (inputId: string, emoji: string, getValue: string, setValue: (val: string) => void) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      const start = input.selectionStart ?? getValue.length;
      const end = input.selectionEnd ?? getValue.length;
      const textBefore = getValue.substring(0, start);
      const textAfter = getValue.substring(end);
      const newValue = textBefore + emoji + textAfter;
      setValue(newValue);
      setTimeout(() => {
        input.focus();
        const newCursorPos = start + emoji.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      setValue(getValue + emoji);
    }
  };

  const handleBroadcast = () => {
    localStorage.setItem('gghp_platform_alert', broadcastMsg);
    localStorage.setItem('gghp_platform_alert_speed', localBroadcastSpeed);
    localStorage.setItem('gghp_platform_alert_type', broadcastType);
    window.dispatchEvent(new Event('storage'));

    turso.execute({
      sql: "INSERT INTO platform_settings (key, value) VALUES ('gghp_platform_alert', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      args: [broadcastMsg]
    }).catch(console.error);
    turso.execute({
      sql: "INSERT INTO platform_settings (key, value) VALUES ('gghp_platform_alert_speed', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      args: [localBroadcastSpeed]
    }).catch(console.error);
    turso.execute({
      sql: "INSERT INTO platform_settings (key, value) VALUES ('gghp_platform_alert_type', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      args: [broadcastType]
    }).catch(console.error);
    turso.execute({
      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
      args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Broadcast Pushed Globally" })]
    }).then(() => {
      alert("Broadcast Pushed Globally!\n\n[Live Production Transaction Logged]");
    }).catch(console.error);
  };

  return (
    <div className="space-y-4 overflow-y-auto pr-2">
      {!hideUpdates && (
        <div className="mb-6 relative group">
          <button onClick={() => { setHideUpdates(true); localStorage.setItem('ggp_updates_read', 'true'); localStorage.setItem('ggp_updates_read_date', new Date().toISOString()); }} className="absolute top-2 right-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm transition-all z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <X size={14} /> Mark as Read
          </button>
          <ImportantUpdates role="founder" />
        </div>
      )}
      {hideUpdates && (
        <button onClick={() => { setHideUpdates(false); localStorage.removeItem('ggp_updates_read'); }} className="w-full max-w-5xl mx-auto bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors shadow-sm mb-6">
          <Bell size={16} /> View Important Updates
        </button>
      )}

      <div className="bg-slate-900 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-indigo-500/10 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Welcome, {isMonica ? 'Executive Director' : (isRyan ? 'CEO' : 'Founder')}.</h2>
            <p className="text-indigo-200 font-medium">Platform state: <span className="text-emerald-400 font-bold">Operational</span> • Registered Trade Name: <span className="text-white font-bold">GLOBAL GREEN HYBRID PLATFORM OPERATING SYSTEM (GGHP-OS)</span></p>
          </div>
          <div className="flex gap-4">
            <StateJurisdictionSelector
              value={overviewJurisdiction}
              onChange={setOverviewJurisdiction}
              variant="dark"
              showMetadata={false}
              compact={false}
              label="Jurisdiction"
            />
            <div className={cn("text-center px-6", !isExecutive && "border-r border-white/10")}>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Total Users</p>
              <p className="text-2xl font-black">{liveStats.totalUsers}</p>
            </div>
            {!isExecutive && (<div className="text-center px-6"><p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Net Revenue</p><p className="text-2xl font-black text-emerald-400">{liveStats.netRevenue}</p></div>)}
            {!isExecutive && (() => { const f = getSweepFreshness(lastRegSweepDate); return (<div className="text-center px-6 border-l border-white/10"><p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Reg Sweep</p><p className={cn("text-sm font-black", f.color === 'text-emerald-600' ? 'text-emerald-400' : f.color === 'text-amber-600' ? 'text-amber-400' : 'text-red-400')}>{f.label}</p></div>); })()}
          </div>
        </div>
      </div>

      {/* ═══ MULTI-INDUSTRY JURISDICTION STATUS BAR ═══ */}
      {overviewStateData && (
        <div className="bg-gradient-to-r from-slate-900 via-[#0e1a2f] to-slate-900 border border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-indigo-400" />
              <span className="text-xs font-black text-white uppercase tracking-widest">
                {overviewStateData.abbr} — {overviewJurisdiction} Regulatory Profile
              </span>
            </div>
            <span className={cn('text-xs font-black', getCannabisStatusColor(overviewStateData.cannabisStatus))}>
              Cannabis: {overviewStateData.cannabisStatus}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Traceability</p>
              <span className={cn('px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase', getTraceabilityBadgeColor(overviewStateData.traceabilitySystem))}>
                {overviewStateData.traceabilitySystem}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">License Auth</p>
              <p className="text-xs font-bold text-white">{overviewStateData.licensingAuthority}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tax Rate</p>
              <p className="text-xs font-bold text-emerald-400">{overviewStateData.taxRate}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Alcohol Auth</p>
              <p className="text-xs font-bold text-amber-400">{overviewStateData.alcoholAuthority}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Pharma Board</p>
              <p className="text-xs font-bold text-cyan-400">{overviewStateData.pharmaBoard}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Industry Verticals</p>
              <div className="flex flex-wrap gap-1">
                {overviewStateData.activeVerticals.map((v, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 text-[8px] font-black uppercase">{v}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
            <span className={cn('text-[10px] font-bold', overviewStateData.medicalQualifying ? 'text-emerald-400' : 'text-slate-600')}>
              {overviewStateData.medicalQualifying ? '✅ Medical Program' : '❌ No Medical Program'}
            </span>
            <span className={cn('text-[10px] font-bold', overviewStateData.reciprocity ? 'text-cyan-400' : 'text-slate-600')}>
              {overviewStateData.reciprocity ? '✅ Reciprocity' : '❌ No Reciprocity'}
            </span>
            <span className={cn('text-[10px] font-bold', overviewStateData.hempProgram ? 'text-emerald-400' : 'text-slate-600')}>
              {overviewStateData.hempProgram ? '✅ Hemp Program' : '❌ No Hemp Program'}
            </span>
          </div>
        </div>
      )}

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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-red-700 uppercase tracking-widest">Active Alert Message (Pushed to Landing Page & All Portals)</label>
                <div className="flex items-center gap-1">
                  {['🚨', '📢', '⚠️', 'ℹ️', '🎉', '🟢', '🔴', '🌿', '⚕️', '⚖️', '🏢'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji('emergency-broadcast-input', emoji, broadcastMsg, setBroadcastMsg)}
                      className="px-1.5 py-0.5 bg-white hover:bg-red-50 border border-red-100 hover:border-red-300 rounded text-xs transition-all active:scale-90"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                id="emergency-broadcast-input"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="E.g., SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS..."
                rows={3}
                className="w-full px-6 py-4 bg-white border-2 border-red-100 rounded-2xl outline-none focus:border-red-500 font-bold text-red-900 shadow-inner resize-none"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-black text-red-700 uppercase tracking-widest px-2">Scroll Speed</label>
                <select
                  value={localBroadcastSpeed}
                  onChange={(e) => setLocalBroadcastSpeed(e.target.value)}
                  className="px-6 py-3.5 bg-white border-2 border-red-100 rounded-2xl font-bold text-slate-700 outline-none h-14"
                >
                  <option value="pause">Pause</option>
                  <option value="slow">Slow</option>
                  <option value="medium">Medium</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-black text-red-700 uppercase tracking-widest px-2">Alert Type</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value)}
                  className="px-6 py-3.5 bg-white border-2 border-red-100 rounded-2xl font-bold text-slate-700 outline-none h-14"
                >
                  <option>Urgent Alert (Red)</option>
                  <option>Caution (Yellow)</option>
                  <option>Warning (Orange)</option>
                  <option>Notice (Pink)</option>
                  <option>Info Ticker (Blue)</option>
                  <option>Special Announcement (Purple)</option>
                  <option>Info Ticker (Green)</option>
                  <option>Success Blast (Emerald)</option>
                </select>
              </div>
              <button
                onClick={handleBroadcast}
                className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95 h-14 self-end"
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
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Scrolling Message (Use | to separate)</label>
                <div className="flex items-center gap-1">
                  {['🔴', '🟢', '⚖️', '🚨', '💰', '🔬', '📈', '⚠️', '🌿', '📊', '💬'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji('marquee-news-input', emoji, marqueeNewsText, setMarqueeNewsText)}
                      className="px-1.5 py-0.5 bg-white hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-300 rounded text-xs transition-all active:scale-90"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                id="marquee-news-input"
                value={marqueeNewsText}
                onChange={(e) => setMarqueeNewsText(e.target.value)}
                placeholder="E.g., BREAKING NEWS | SYLARA AI SCANNED..."
                rows={3}
                className="w-full px-6 py-4 bg-white border-2 border-emerald-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-emerald-900 shadow-sm resize-none"
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
                  <option value="pause">Pause</option>
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

                  turso.execute({
                    sql: "INSERT INTO platform_settings (key, value) VALUES ('gghp_marquee_news', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                    args: [marqueeNewsText]
                  }).catch(console.error);

                  turso.execute({
                    sql: "INSERT INTO platform_settings (key, value) VALUES ('gghp_marquee_speed', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                    args: [localMarqueeSpeed]
                  }).catch(console.error);

                  turso.execute({
                    sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                    args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Green Scroll Ticker Updated Globally!" })]
                  }).then(() => {
                    alert("Green Scroll Ticker Updated Globally!\n\n[Live Production Transaction Logged]");
                  }).catch(console.error);
                }}
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 h-14 self-end"
              >
                UPDATE SCROLL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌐 GLOBAL REAL-TIME APP TRAFFIC — Founder Only */}
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
            <div 
              className={cn("p-4 rounded-xl border cursor-pointer transition-all hover:border-blue-500/40", showActiveUsersPanel ? "bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20" : "bg-slate-800/50 border-slate-700/50")}
              onClick={() => setShowActiveUsersPanel(!showActiveUsersPanel)}
            >
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Current Active Users</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{liveAnalytics.users.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-bold mb-1.5">Right now</span>
              </div>
              <p className="text-[9px] text-blue-400 font-bold mt-1">Click to {showActiveUsersPanel ? 'hide' : 'view'} active users →</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total App Clicks</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-indigo-400">{liveAnalytics.clicks.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-bold mb-1.5">All time</span>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Link Conversions</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-blue-400">{liveAnalytics.clicks > 0 ? ((liveAnalytics.conversions / liveAnalytics.clicks) * 100).toFixed(1) : 0}%</span>
                <span className="text-[10px] text-emerald-400 font-bold mb-1.5">Avg CR</span>
              </div>
            </div>
          </div>

          {/* Active Users Panel — Expandable */}
          {showActiveUsersPanel && (
            <div className="mb-8 bg-slate-800/30 rounded-2xl border border-blue-500/20 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2"><Eye size={14} className="text-blue-400" /> Active Users Right Now</h4>
                <button onClick={() => setShowActiveUsersPanel(false)} className="text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
              </div>
              <div className="divide-y divide-slate-800/50 max-h-[200px] overflow-y-auto">
                {activePresenceUsers.length > 0 ? activePresenceUsers.map((u, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-xs font-black uppercase">
                        {(u.displayName || u.email || '?').charAt(0)}
                      </div>
                      <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900", u.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500')}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{u.displayName || u.email || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.email || 'No email'} • {u.role || 'user'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", u.status === 'online' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border border-amber-500/20')}>
                        {u.status === 'online' ? '🟢 Online' : '🟡 Away'}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="px-5 py-8 text-center text-sm text-slate-500 italic">No active users detected. Firebase presence collection may need initialization.</div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Activity size={12} /> Live Traffic Sources</h4>
              <div className="space-y-4">
                {(() => {
                  const sources = liveAnalytics.trafficSources || {};
                  const total = Object.values(sources).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1;
                  
                  const directCount = Number(sources['Direct / Bookmarks'] || 0);
                  const googleCount = Number(sources['Google Organic Search'] || 0);
                  const fedCount = Number(sources['Federal / SAM.gov Referrals'] || 0);
                  const socialCount = Number(sources['Social Media (LinkedIn, X)'] || 0);
                  
                  // Calculate percentages
                  const directPct = Math.round((directCount / total) * 100);
                  const googlePct = Math.round((googleCount / total) * 100);
                  const fedPct = Math.round((fedCount / total) * 100);
                  const socialPct = Math.round((socialCount / total) * 100);

                  const items = [
                    { source: 'Direct / Bookmarks', pct: directPct, color: 'bg-indigo-500' },
                    { source: 'Google Organic Search', pct: googlePct, color: 'bg-blue-500' },
                    { source: 'Federal / SAM.gov Referrals', pct: fedPct, color: 'bg-amber-500' },
                    { source: 'Social Media (LinkedIn, X)', pct: socialPct, color: 'bg-purple-500' },
                  ];

                  return items.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-300">{item.source}</span>
                        <span className="text-white">{item.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.pct}%` }}></div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Search size={12} /> Live Click Stream</h4>
                <select
                  value={clickStreamRange}
                  onChange={e => {
                    setClickStreamRange(e.target.value as any);
                    fetchClickStreamByRange(e.target.value);
                  }}
                  className="bg-slate-800 border border-slate-600 text-white text-[10px] font-bold rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-3 max-h-[280px] overflow-y-auto relative">
                {clickStreamLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-400 ml-2">Loading events...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clickStreamEvents.length > 0 ? clickStreamEvents.map((log: any, i: number) => (
                      <div key={i} className="flex gap-3 items-start hover:bg-slate-700/20 rounded-lg px-2 py-1.5 transition-colors">
                        <span className="text-[9px] text-slate-500 font-bold shrink-0 mt-0.5 w-14 text-right">{log.time}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-blue-300 truncate">{log.user}</p>
                          <p className="text-xs text-slate-300 truncate">{log.action}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-6 text-sm text-slate-500 italic">No click events in this time range</div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[9px] text-slate-500 font-bold mt-2 text-right">{clickStreamEvents.length} events • {clickStreamRangeLabels[clickStreamRange]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🏢 OPERATIONS SUPPORT HUB */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-xl overflow-hidden text-white relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-lg flex items-center gap-2"><Cpu size={20} className="text-cyan-400" /> Operations Support Hub</h3>
              <p className="text-xs text-slate-400 mt-1">Enterprise Tier — 85% AI Automated • Real-time operations oversight</p>
            </div>
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Active Tasks', value: opsLiveTasks.length, sub: `${opsLiveTasks.filter((t: any) => t.status === 'pending' || !t.status).length} pending action`, icon: Clock, color: 'text-white' },
              { label: 'Active Tickets', value: opsTicketCount, sub: `${queueAlerts.length} requiring escalation`, icon: MessageSquare, color: 'text-amber-400' },
              { label: 'CRM Pipeline', value: opsCrmCount.toLocaleString(), sub: `${liveQueue.length} recent registrations`, icon: PhoneCall, color: 'text-white' },
              { label: 'AI Resolution Rate', value: opsTicketCount > 0 ? `${Math.round(Math.max(0, opsTicketCount - queueAlerts.length) / Math.max(1, opsTicketCount) * 100)}%` : '—', sub: 'Auto-resolved vs escalated', icon: Bot, color: 'text-emerald-400', highlight: true },
            ].map((stat, i) => (
              <div key={i} className={cn("p-4 rounded-xl border", stat.highlight ? "bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border-violet-500/30" : "bg-slate-800/50 border-slate-700/50")}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  <stat.icon size={16} className="text-slate-500" />
                </div>
                <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
                <p className={cn("text-[10px] mt-1 font-medium", stat.highlight ? "text-violet-300" : "text-slate-500")}>{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-slate-800/30 rounded-2xl border border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-black text-white flex items-center gap-2"><Clock size={14} className="text-cyan-400" /> Priority Task Stream</h4>
                <button onClick={() => setActiveTab('operations')} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors">View All Tasks →</button>
              </div>
              <div className="space-y-3">
                {(() => {
                  const realTasks = opsLiveTasks.slice(0, 4).map((t: any) => ({
                    icon: t.title?.includes('📧') ? '📧' : t.title?.includes('🔴') ? '🔴' : t.status === 'completed' ? '✅' : '📋',
                    title: t.title || 'Untitled Task',
                    desc: t.description || t.notes || `${t.assignedTo || 'Unassigned'} • ${t.dueDate || 'No due date'}`,
                    action: t.status === 'completed' ? 'Done' : 'Handle',
                    actionColor: t.status === 'completed' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }));
                  const alertTasks = queueAlerts.slice(0, 2).map(a => ({
                    icon: a.type === 'CRITICAL ALERT' ? '🔴' : '⚠️',
                    title: a.text,
                    desc: `${a.type} • ${a.time}`,
                    action: 'Route',
                    actionColor: 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }));
                  const combined = [...realTasks, ...alertTasks].slice(0, 5);
                  if (combined.length === 0) {
                    return <p className="text-sm text-slate-500 italic text-center py-6">No active tasks — all clear ✨</p>;
                  }
                  return combined.map((task, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors group">
                      <span className="text-lg shrink-0">{task.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{task.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{task.desc}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (task.action === 'Done') return;
                          if (task.title?.toLowerCase().includes('campaign') || task.title?.toLowerCase().includes('email')) {
                            setActiveTab('marketing_hub');
                          } else if (task.action === 'Route') {
                            setActiveTab('operations');
                          } else {
                            setActiveTab('operations');
                          }
                        }}
                        className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all opacity-70 group-hover:opacity-100 shrink-0 cursor-pointer", task.actionColor)}
                      >
                        {task.action} →
                      </button>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Bot size={16} className="text-violet-200" />
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Sylara Operational AI</h4>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                  <p className="text-[13px] text-white/90 leading-relaxed font-medium">
                    "Currently tracking <span className="font-black text-white">{opsCrmCount.toLocaleString()}</span> CRM records across all jurisdictions. There are <span className="font-black text-white">{opsLiveTasks.length}</span> active tasks and <span className="font-black text-white">{opsTicketCount}</span> support tickets in the queue. {queueAlerts.length > 0 ? `${queueAlerts.length} ticket(s) need escalation.` : 'No escalations needed — operations running smoothly.'}"
                  </p>
                </div>
                <div className="space-y-2">
                  <button onClick={() => {
                    turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: ['log-' + Math.random().toString(36).substr(2, 9), 'SYLARA_DIRECTIVE', fullName, JSON.stringify({ detail: 'Approved Staffing Shift recommendation from Sylara AI' })]
                    }).then(() => {
                      setNotifications(prev => prev.filter(n => n.id !== 'hr_compliance'));
                      alert('✅ Staffing shift approved — Sylara will reassign agents');
                    }).catch(console.error);
                  }} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/30">
                    Approve Staffing Shift
                  </button>
                  <button onClick={() => setActiveTab('virtual_attendant')} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/10">
                    Review AI Chat Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔬 LAB & PUBLIC HEALTH INTELLIGENCE COMMAND */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-lg text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">🔬</div>
                Lab & Public Health Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-1">Contamination monitoring, accreditation tracking, facility compliance & Recency Index</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('public_health')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-500 transition-all shadow-md">
                Open Full Dashboard →
              </button>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Monitoring
              </span>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Contamination Events', value: '3', sub: '+2 this month', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: '⚠️' },
              { label: 'Active Recalls', value: '1', sub: 'Batch #882 — Microbial', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: '🚨' },
              { label: 'Pending COA Uploads', value: '18', sub: 'Awaiting Larry validation', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: '📄' },
              { label: 'Statewide Pass Rate', value: '90.6%', sub: '+1.2% vs last quarter', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✅' },
              { label: 'Avg Recency Index', value: '4.2', sub: 'Normal (340 samples)', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: '🧪' },
            ].map((kpi, i) => (
              <div key={i} className={cn("p-4 rounded-2xl border", kpi.bg, kpi.border)}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                  <span className="text-sm">{kpi.icon}</span>
                </div>
                <p className={cn("text-2xl font-black", kpi.color)}>{kpi.value}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Facility Compliance Snapshot */}
            <div className="lg:col-span-2 border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">🏢 Facility Compliance Scorecards</h4>
                <span className="text-[9px] font-bold text-slate-400">5 facilities monitored</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { name: 'GreenLeaf Testing', state: 'OK', rate: 94, grade: 'A', trend: '↑', trendColor: 'text-emerald-500' },
                  { name: 'PureTech Labs', state: 'OK', rate: 89, grade: 'B+', trend: '↓', trendColor: 'text-red-500' },
                  { name: 'SafeHarvest Analytics', state: 'CO', rate: 97, grade: 'A+', trend: '↑', trendColor: 'text-emerald-500' },
                  { name: 'CannaCheck Inc.', state: 'CA', rate: 82, grade: 'B-', trend: '↓', trendColor: 'text-red-500' },
                  { name: 'Tribal Health Labs', state: 'OK', rate: 91, grade: 'A-', trend: '↑', trendColor: 'text-emerald-500' },
                ].map((f, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{f.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{f.state}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full">
                          <div className={cn("h-1.5 rounded-full", f.rate >= 95 ? 'bg-emerald-500' : f.rate >= 88 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${f.rate}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-slate-700 w-10 text-right">{f.rate}%</span>
                      </div>
                      <span className={cn("text-sm font-black", f.trendColor)}>{f.trend}</span>
                      <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full",
                        f.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      )}>{f.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditation Alerts */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">🏆 Accreditation Status</h4>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { lab: 'GreenLeaf', cert: 'ISO 17025', days: 267, status: 'active' },
                  { lab: 'PureTech', cert: 'DEA Sched I', days: 42, status: 'renewal' },
                  { lab: 'SafeHarvest', cert: 'State #4421', days: 195, status: 'active' },
                  { lab: 'CannaCheck', cert: 'ISO 17025', days: -28, status: 'expired' },
                  { lab: 'Tribal Health', cert: 'Compact THL-09', days: 540, status: 'active' },
                ].map((a, i) => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{a.lab}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{a.cert}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-[10px] font-black",
                        a.days > 180 ? 'text-emerald-500' : a.days > 60 ? 'text-amber-500' : a.days > 0 ? 'text-red-500' : 'text-red-700'
                      )}>
                        {a.days > 0 ? `${a.days}d` : `EXPIRED`}
                      </span>
                      <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                        a.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        a.status === 'renewal' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                      )}>
                        {a.status === 'active' ? 'Active' : a.status === 'renewal' ? 'Renew' : 'Expired'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Recall Alert Banner */}
          <div className="mt-6 bg-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 animate-pulse">🚨</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">Active Recall: Batch #882 — TYM Microbial Exceedance (18,400 CFU/g)</h4>
                <p className="text-xs text-slate-400 mt-1">4 zones affected • 240 patients exposed • 198 notified via Care Wallet • Source: MedExtract Co. (processor stage)</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setActiveTab('public_health')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors">View Recall Details</button>
                  <button onClick={() => setActiveTab('public_health')} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors border border-white/10">Exposure Map</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 👁️ LIVE ACCOUNT ACTIVITY FEED — God's Eye on Signups & Logins */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-xl overflow-hidden text-white relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-lg flex items-center gap-2"><UserPlus size={20} className="text-emerald-400" /> Live Account Activity</h3>
              <p className="text-xs text-slate-400 mt-1">Real-time Firebase user registrations • Who's creating accounts on your platform right now</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activityRange}
                onChange={e => setActivityRange(e.target.value as any)}
                className="bg-slate-800 border border-slate-600 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-emerald-500/50 transition-colors"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Firebase Sync</span>
              </div>
            </div>
          </div>

          {/* Account Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Accounts', value: accountCounts.total.toLocaleString(), icon: '👥', color: 'text-white', active: activityRange === 'all' },
              { label: 'Joined Today', value: accountCounts.today.toString(), icon: '🟢', color: accountCounts.today > 0 ? 'text-emerald-400' : 'text-slate-400', active: activityRange === 'today' },
              { label: 'This Week', value: accountCounts.thisWeek.toString(), icon: '📅', color: accountCounts.thisWeek > 0 ? 'text-cyan-400' : 'text-slate-400', active: activityRange === 'week' },
              { label: 'This Month', value: accountCounts.thisMonth.toString(), icon: '📊', color: accountCounts.thisMonth > 0 ? 'text-indigo-400' : 'text-slate-400', active: activityRange === 'month' },
            ].map((stat, i) => (
              <div key={i} className={cn("p-4 rounded-xl border transition-all cursor-pointer hover:border-emerald-500/40",
                stat.active ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' : 'bg-slate-800/50 border-slate-700/50')}
                onClick={() => {
                  const ranges: Record<number, typeof activityRange> = { 0: 'all', 1: 'today', 2: 'week', 3: 'month' };
                  setActivityRange(ranges[i]);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  <span className="text-sm">{stat.icon}</span>
                </div>
                <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Account Activity Feed */}
          <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
              <h4 className="text-sm font-black text-white flex items-center gap-2"><LogIn size={14} className="text-emerald-400" /> {rangeLabel[activityRange]} Signups</h4>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{filteredAccounts.length} {activityRange === 'all' ? 'total' : `in ${rangeLabel[activityRange].toLowerCase()}`}</span>
            </div>
            <div className="divide-y divide-slate-800/50 max-h-[320px] overflow-y-auto">
              {filteredAccounts.length > 0 ? filteredAccounts.map((acct, i) => {
                const roleColors: Record<string, string> = {
                  'user': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  'patient': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  'Patient / Caregiver': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  'business': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  'provider': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  'attorney': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  'executive_founder': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  'president': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  'admin_internal': 'bg-red-500/20 text-red-300 border-red-500/30',
                };
                const roleColor = roleColors[acct.role] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
                const statusColor = acct.status === 'Active' ? 'text-emerald-400' : acct.status === 'Pending' ? 'text-amber-400' : 'text-red-400';

                // Time ago calculation
                let timeAgo = 'Unknown';
                if (acct.createdAt) {
                  const diffMs = Date.now() - acct.createdAt.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);
                  if (diffMins < 1) timeAgo = 'Just now';
                  else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
                  else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
                  else if (diffDays < 30) timeAgo = `${diffDays}d ago`;
                  else timeAgo = acct.createdAt.toLocaleDateString();
                }

                return (
                  <div 
                    key={acct.uid || i} 
                    className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedActivityUser(acct)}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <UserPlus size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-white truncate">{acct.displayName}</p>
                        <span className={cn("text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border", roleColor)}>
                          {acct.role?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {acct.email}
                        {acct.state && <span className="text-slate-500"> • {acct.state}</span>}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("text-[10px] font-black uppercase tracking-wider", statusColor)}>{acct.status}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">{timeAgo}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="px-5 py-8 text-center text-sm text-slate-500 italic">No signups {activityRange === 'all' ? 'found' : rangeLabel[activityRange].toLowerCase()}</div>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active States', value: jurisdictionStats.length > 0 ? jurisdictionStats.length.toString() : '0', trend: jurisdictionStats.length > 0 ? 'Live' : 'Awaiting data', color: 'blue' },
          { label: 'AI Sync Rate', value: liveAnalytics.users > 0 || liveAnalytics.clicks > 0 ? '100%' : '—', trend: liveAnalytics.users > 0 ? 'Optimal' : 'Idle', color: 'emerald' },
          { label: 'Compliance Alerts', value: jurisdictionStats.reduce((a: number, r: any) => a + (r.c < 100 ? 1 : 0), 0).toString(), trend: jurisdictionStats.every((r: any) => r.c >= 95) ? 'All Clear' : 'Needs Review', color: 'red' },
          { label: 'Total Registrations', value: liveStats.totalUsers, trend: 'Patients + Businesses', color: 'indigo' },
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

      {/* Reusable National Regulatory & Enforcement Ledger */}
      <NationalEnforcementLedger dark={false} />

      {/* 🌐 GLOBAL SEARCH ANALYTICS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Search size={20} /></div>
            Global Search Analytics
          </h3>
          <div className="flex items-center gap-3">
            <select
              value={searchAnalyticsRange}
              onChange={e => {
                const val = e.target.value as any;
                setSearchAnalyticsRange(val);
                fetchSearchAnalytics(val);
              }}
              className="bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-blue-400 transition-colors"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              Real-Time Query Sync
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: `Total Page Views (${searchAnalyticsRangeLabels[searchAnalyticsRange]})`, value: searchAnalyticsData.totalClicks.toLocaleString(), trend: 'All tracked sessions', color: 'text-blue-600' },
            { label: 'Unique User Types', value: Object.keys(searchAnalyticsData.clicksByUserType).length.toString(), trend: 'Distinct roles', color: 'text-emerald-600' },
            { label: 'Unique Pages Visited', value: Object.keys(searchAnalyticsData.clicksByPath).length.toString(), trend: 'Distinct routes', color: 'text-indigo-600' },
            { label: 'Deep Navigation Rate', value: searchAnalyticsData.totalClicks > 0 ? ((searchAnalyticsData.conversions / searchAnalyticsData.totalClicks) * 100).toFixed(1) + '%' : '0%', trend: 'Non-landing clicks', color: 'text-amber-600' },
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
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Globe size={14} className="text-blue-500" /> Top Pages ({searchAnalyticsRangeLabels[searchAnalyticsRange]})</h4>
            <div className="space-y-3">
              {Object.entries(searchAnalyticsData.clicksByPath).slice(0, 5).map(([path, count]: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{path === '/' ? 'Landing Page' : path.replace(/\//g, ' / ').replace(/^\s\/\s/, '')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-indigo-600">{count.toLocaleString()} views</p>
                  </div>
                </div>
              ))}
              {Object.keys(searchAnalyticsData.clicksByPath).length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-4">No page views in this time range</p>
              )}
            </div>
          </div>
          <div className="border border-slate-200 rounded-2xl p-4 bg-white">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={14} className="text-emerald-500" /> Traffic by User Type</h4>
            <div className="space-y-4">
              {(() => {
                const entries = Object.entries(searchAnalyticsData.clicksByUserType);
                const totalUT = entries.reduce((a, [, v]) => a + Number(v), 0);
                const colors = ['text-emerald-600', 'text-blue-600', 'text-amber-600', 'text-indigo-600', 'text-red-500', 'text-purple-600'];
                const barColors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-indigo-500', 'bg-red-500', 'bg-purple-500'];
                if (entries.length === 0) return <p className="text-sm text-slate-400 italic text-center py-4">No traffic data in this time range</p>;
                return entries.slice(0, 6).map(([userType, count], i) => {
                  const pct = totalUT > 0 ? Math.round((Number(count) / totalUT) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600">{userType || 'Unknown'}</span>
                        <span className={`font-black ${colors[i % colors.length]}`}>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2"><div className={`${barColors[i % barColors.length]} h-2 rounded-full`} style={{ width: `${pct}%` }}></div></div>
                    </div>
                  );
                });
              })()}
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
            { label: 'Total Votes', value: pollStats.totalVotes.toLocaleString(), trend: 'Live updates', color: 'text-emerald-600' },
            { label: 'Active Polls', value: pollStats.activePolls.toString(), trend: 'Global database', color: 'text-indigo-600' },
            { label: 'Engagement Rate', value: pollStats.engagementRate, trend: 'vs total users', color: 'text-amber-600' },
            { label: 'Comments Submitted', value: pollStats.commentsSubmitted.toLocaleString(), trend: 'Disabled pending AI filter', color: 'text-blue-600' },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">{s.trend}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">🔥 Top Polls by Engagement</h4>
            <div className="space-y-3">
              {pollStats.topPolls.length > 0 ? pollStats.topPolls.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{p.q}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">{p.v.toLocaleString()} votes</span>
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
              )) : (
                <div className="text-sm text-slate-400 py-4 text-center">No votes recorded yet</div>
              )}
            </div>
          </div>
          <div className="border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">📊 Votes by Category</h4>
            <div className="space-y-3">
              {pollStats.votesByCategory.length > 0 ? pollStats.votesByCategory.map((c: any, i: number) => {
                const colors = ['bg-emerald-500', 'bg-blue-600', 'bg-amber-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-indigo-500'];
                const color = colors[i % colors.length];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                    <span className="text-xs font-bold text-slate-700 flex-1">{c.cat}</span>
                    <span className="text-[10px] font-black text-slate-400">{c.votes.toLocaleString()}</span>
                    <div className="w-20">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${c.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 w-8 text-right">{c.pct}%</span>
                  </div>
                );
              }) : (
                <div className="text-sm text-slate-400 py-4 text-center">No votes recorded yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CEYE Command Intelligence Analytics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <Eye size={22} className="text-cyan-500" /> CEYE Command Analytics
            </h3>
            <p className="text-xs text-slate-500 mt-1">Cross-jurisdictional sensor fusion and operational compliance metrics</p>
          </div>
          <span className="px-3 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-black rounded-full border border-cyan-100 uppercase tracking-widest animate-pulse flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span> Real-time Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {(() => {
            const avgComp = Math.round(FACILITIES.reduce((a, f) => a + f.compliance, 0) / FACILITIES.length);
            const activeTransports = TRANSPORTS.filter(t => t.status === 'in_transit' || t.status === 'deviation').length;
            const onlineCameras = CAMERA_FEEDS.filter(c => c.status === 'online').length;
            const totalCameras = CAMERA_FEEDS.length;

            const stats = [
              { label: 'CEYE Avg Compliance', value: `${avgComp}%`, sub: 'Target: 95%', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'Monitored Facilities', value: `${FACILITIES.length} Active`, sub: 'OK, AZ, CO, MN, OR', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
              { label: 'Camera Network', value: `${onlineCameras}/${totalCameras} Online`, sub: `${totalCameras - onlineCameras} offline / degraded`, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
              { label: 'Active Transports', value: `${activeTransports} Active`, sub: `${TRANSPORTS.filter(t => t.status === 'deviation').length} route deviation alert(s)`, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
            ];

            return stats.map((stat, i) => (
              <div key={i} className={cn("p-4 rounded-2xl border", stat.bg)}>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{stat.sub}</p>
              </div>
            ));
          })()}
        </div>

        {/* Mini Charts & Feeds for Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Facility Risk Analysis */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Risk Category Share</h4>
            <div className="space-y-3">
              {(() => {
                const total = FACILITIES.length || 1;
                const low = FACILITIES.filter(f => f.risk === 'low').length;
                const med = FACILITIES.filter(f => f.risk === 'medium').length;
                const high = FACILITIES.filter(f => f.risk === 'high' || f.risk === 'critical').length;
                
                const lowPct = Math.round((low / total) * 100);
                const medPct = Math.round((med / total) * 100);
                const highPct = 100 - lowPct - medPct; // Ensure sum is exactly 100%

                const risks = [
                  { label: 'Low Risk (Compliant)', pct: lowPct, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
                  { label: 'Medium Risk (Monitored)', pct: medPct, color: 'bg-amber-500', textColor: 'text-amber-600' },
                  { label: 'High Risk (Flagged)', pct: highPct, color: 'bg-red-500', textColor: 'text-red-600' },
                ];

                return risks.map((risk, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">{risk.label}</span>
                      <span className={risk.textColor}>{risk.pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", risk.color)} style={{ width: `${risk.pct}%` }} />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Active Sensor Alerts */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 lg:col-span-2">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Critical CEYE Sensor Alerts</h4>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {[
                { time: 'Just now', type: 'ROUTE', msg: 'Transport TRN-4403 deviated 2.4 miles from approved corridor on I-44 W', severity: 'CRITICAL', color: 'text-red-600 bg-red-100 border-red-200' },
                { time: '4m ago', type: 'WEIGHT', msg: 'Weight discrepancy detected: Manifest MAN-88714 shows 22.1 lbs, scale reads 21.3 lbs', severity: 'HIGH', color: 'text-amber-600 bg-amber-100 border-amber-200' },
                { time: '12m ago', type: 'CAMERA', msg: 'Grow Room 3 camera at Desert Bloom offline - signal lost', severity: 'MEDIUM', color: 'text-yellow-600 bg-yellow-100 border-yellow-200' },
              ].map((alert, i) => (
                <div key={i} className={cn("p-3 rounded-xl border flex items-start justify-between text-xs gap-3", alert.color)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black tracking-wider uppercase text-[9px]">{alert.type}</span>
                      <span className="text-[9px] opacity-75">{alert.time}</span>
                    </div>
                    <p className="font-medium text-slate-700 leading-normal">{alert.msg}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-white/60 border border-current">{alert.severity}</span>
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
                {jurisdictionStats.length > 0 ? jurisdictionStats.map((row, i) => (
                  <tr key={i} className="group hover:bg-slate-100 transition-colors">
                    <td className="py-4 font-black text-slate-800">{row.s}</td>
                    <td className="py-4 text-slate-600 font-bold">{row.p.toLocaleString()}</td>
                    <td className="py-4 text-slate-600 font-bold">{row.d.toLocaleString()}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[60px]">
                          <div className={cn("h-full rounded-full", row.c > 95 ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${row.c}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black">{row.c}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={cn("font-black", row.up ? "text-emerald-500" : "text-slate-400")}>{row.r}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-6 text-center text-xs font-bold text-slate-400">Waiting for live jurisdiction data...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3"><Zap size={22} className="text-amber-500" /> Network Health Pulse</h3>
          <div className="flex-1 flex flex-col justify-between">
            <div className="h-40 flex items-end justify-between gap-1">
              {(() => {
                const bars = healthHistory.length > 0
                  ? healthHistory.slice(-12).map(h => {
                    if (h.status === 'healthy') return Math.max(70, Math.min(100, 100 - Math.round(h.avgLatency / 10)));
                    if (h.status === 'degraded') return Math.max(30, Math.min(69, 70 - Math.round(h.avgLatency / 20)));
                    return Math.max(10, 30 - Math.round(h.avgLatency / 50));
                  })
                  : Array(12).fill(healthReport ? (healthReport.overallStatus === 'healthy' ? 85 : 50) : 0);
                while (bars.length < 12) bars.unshift(0);
                return bars.map((h: number, i: number) => (
                  <div key={i} className="flex-1 bg-slate-100 rounded-full relative group">
                    <div className={`absolute bottom-0 w-full rounded-full ${h >= 70 ? 'bg-emerald-500' : h >= 40 ? 'bg-amber-500' : h > 0 ? 'bg-red-500' : 'bg-slate-200'}`} style={{ height: `${h}%` }}></div>
                  </div>
                ));
              })()}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Latency</span>
                <span className={`text-sm font-black ${healthReport?.avgLatencyMs < 500 ? 'text-emerald-600' : 'text-amber-600'}`}>{healthReport ? `${Math.round(healthReport.avgLatencyMs)}ms` : '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Status</span>
                <span className={`text-sm font-black ${healthReport?.overallStatus === 'healthy' ? 'text-emerald-600' : healthReport?.overallStatus === 'degraded' ? 'text-amber-600' : healthReport ? 'text-red-600' : 'text-slate-400'}`}>{healthReport ? healthReport.overallStatus.charAt(0).toUpperCase() + healthReport.overallStatus.slice(1) : '—'}</span>
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

      {/* 🛡️ REGULATORY SWEEP COMMAND CENTER */}
      <RegulatoryCommandCenter />

      {/* ── USER DETAIL MODAL OVERLAY ── */}
      {selectedActivityUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <h4 className="font-black text-white flex items-center gap-2">
                <UserPlus size={18} className="text-emerald-400" />
                User Signup Details
              </h4>
              <button 
                onClick={() => setSelectedActivityUser(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                  {(selectedActivityUser.displayName || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{selectedActivityUser.displayName}</h3>
                  <p className="text-xs text-slate-400">UID: <span className="font-mono text-indigo-300 select-all">{selectedActivityUser.uid}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-805 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Email Address</span>
                  <span className="font-bold text-white truncate block">{selectedActivityUser.email}</span>
                </div>
                <div className="bg-slate-805 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">User Role</span>
                  <span className="font-bold text-emerald-400 capitalize">{selectedActivityUser.role?.replace(/_/g, ' ')}</span>
                </div>
                <div className="bg-slate-805 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Jurisdiction</span>
                  <span className="font-bold text-white">{selectedActivityUser.state || 'N/A'}</span>
                </div>
                <div className="bg-slate-805 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Account Status</span>
                  <span className="font-bold text-cyan-400">{selectedActivityUser.status}</span>
                </div>
              </div>

              <div className="bg-slate-805 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Created At</span>
                <span className="font-bold text-white">
                  {selectedActivityUser.createdAt ? selectedActivityUser.createdAt.toLocaleString() : 'Unknown'}
                </span>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850 text-xs text-slate-400 space-y-1.5">
                <p className="font-bold text-slate-300">ℹ️ Firestore Data Integrity Reference</p>
                <p>This document is stored live in your Firebase Project under the <span className="font-mono text-emerald-400">users</span> collection. All profile changes, roles, and registrations sync instantly across all devices.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedActivityUser(null)} 
                className="px-4 py-2 bg-slate-80 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
