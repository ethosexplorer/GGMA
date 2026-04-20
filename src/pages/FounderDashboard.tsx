import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Globe, Zap, Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { section: 'FOUNDER EXCLUSIVE' },
  { id: 'global_financials', label: 'Global Financials', icon: TrendingUp },
  { id: 'system_health', label: 'System Health / AI', icon: Zap },
  { id: 'jurisdiction_map', label: 'Nationwide Oversight', icon: Globe },
  { section: 'MAIN' },
  { id: 'overview', label: 'God Overview', icon: Activity },
  { section: 'MANAGEMENT' },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'patients', label: 'Patient Management', icon: HeartPulse },
  { id: 'business', label: 'Business Management', icon: Building2 },
  { section: 'OPS & COMPLIANCE' },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '12' },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '502' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { section: 'SYSTEM CONTROL' },
  { id: 'reports', label: 'Master Analytics', icon: BarChart3 },
  { id: 'logs', label: 'System Logs', icon: Database },
  { id: 'settings', label: 'God Settings', icon: Settings },
];

export const FounderDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-indigo-500/10 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="space-y-2">
             <h2 className="text-3xl font-black tracking-tight">Welcome, Founder.</h2>
             <p className="text-indigo-200 font-medium">Platform state: <span className="text-emerald-400 font-bold">Operational</span> • Jurisdiction: <span className="text-white font-bold">Nationwide (US)</span></p>
           </div>
           <div className="flex gap-4">
              <div className="text-center px-6 border-r border-white/10">
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Total Users</p>
                 <p className="text-2xl font-black">1.2M</p>
              </div>
              <div className="text-center px-6">
                 <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Net Revenue</p>
                 <p className="text-2xl font-black text-emerald-400">$18.2M</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3"><Globe size={22} className="text-indigo-500" /> Jurisdiction Activity Heatmap</h3>
            <div className="h-80 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
               <p className="text-slate-400 font-bold italic">Dynamic SVG US Map Placeholder</p>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3"><Zap size={22} className="text-amber-500" /> System Real-time Feed</h3>
            <div className="flex-1 space-y-4">
               {[
                 { msg: 'OMMA API batch sync success', time: '1m ago', color: 'emerald' },
                 { msg: 'New RIP Unit registered: TX-DPS', time: '4m ago', color: 'blue' },
                 { msg: 'Flagged anomaly in MO dispensary #442', time: '12m ago', color: 'red' },
                 { msg: 'Sylara processed 402 card apps', time: '15m ago', color: 'indigo' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className={cn("w-2 h-2 rounded-full mt-1.5", `bg-${log.color}-500`)}></div>
                    <div>
                       <p className="text-sm font-bold text-slate-700">{log.msg}</p>
                       <p className="text-[10px] text-slate-400 font-medium">{log.time}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Global Financials</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{l:'Total Revenue',v:'$18.2M',t:'+22%'},{l:'MRR',v:'$1.52M',t:'+8%'},{l:'Token Sales',v:'$4.1M',t:'+34%'},{l:'Subscriptions',v:'12,402',t:'+310'}].map((s,i)=>(
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{s.l}</p><div className="flex items-end justify-between"><h3 className="text-2xl font-black text-slate-800">{s.v}</h3><span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">{s.t}</span></div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500"/>Revenue by Portal</h3>
          <div className="space-y-3">{[{n:'Patient Portal',v:'$6.2M',p:34},{n:'Business Portal',v:'$8.1M',p:45},{n:'Oversight Portal',v:'$2.4M',p:13},{n:'Operations',v:'$1.5M',p:8}].map((r,i)=>(<div key={i} className="flex items-center gap-4"><span className="text-sm font-bold text-slate-600 w-32">{r.n}</span><div className="flex-1 bg-slate-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{width:`${r.p}%`}}/></div><span className="text-sm font-black text-slate-800 w-16 text-right">{r.v}</span></div>))}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Wallet size={18} className="text-blue-500"/>Care Wallet Transactions</h3>
          <div className="space-y-2">{[{d:'Token Purchase - Patient #4821',a:'+$250.00',t:'2m ago'},{d:'B2B Transfer - Apex → GreenLeaf',a:'+$1,200.00',t:'8m ago'},{d:'Subscription - Pro Plan',a:'+$149.00',t:'22m ago'},{d:'POS Transaction - Westside Disp.',a:'+$89.50',t:'1h ago'}].map((tx,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"><div><p className="text-sm font-bold text-slate-700">{tx.d}</p><p className="text-[10px] text-slate-400">{tx.t}</p></div><span className="text-sm font-bold text-emerald-600">{tx.a}</span></div>))}</div>
        </div>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">System Health & AI Monitor</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{l:'API Uptime',v:'99.97%',s:'Optimal'},{l:'Sylara AI Load',v:'42%',s:'Normal'},{l:'L.A.R.R.Y Sessions',v:'1,204',s:'Active'}].map((s,i)=>(
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{s.l}</p><h3 className="text-2xl font-black text-slate-800">{s.v}</h3><span className="text-[10px] font-bold text-emerald-600">{s.s}</span></div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Real-time Service Status</h3>
        <div className="space-y-2">{[{n:'Firebase Auth',s:'Online'},{n:'Turso Database',s:'Online'},{n:'OMMA API Sync',s:'Online'},{n:'Sylara NLP Engine',s:'Online'},{n:'Care Wallet Ledger',s:'Online'},{n:'RIP Command Feed',s:'Online'}].map((sv,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm font-bold text-slate-700">{sv.n}</span><span className="flex items-center gap-2 text-xs font-bold text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>{sv.s}</span></div>))}</div>
      </div>
    </div>
  );

  const renderUserMgmt = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">User Management</h2>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between"><span className="font-bold text-slate-700">All Platform Users</span><span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">1,204,891 Total</span></div>
        <table className="w-full text-sm"><thead><tr className="bg-slate-50 text-left"><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Name</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Role</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">State</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Status</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Actions</th></tr></thead>
        <tbody>{[{n:'Marcus Johnson',r:'Business Admin',st:'OK',s:'Active'},{n:'Sarah Connor',r:'Patient',st:'TX',s:'Pending'},{n:'Dr. Rachel Kim',r:'Provider',st:'CA',s:'Active'},{n:'Ofc. Davis',r:'RIP Officer',st:'OK',s:'Active'},{n:'Emily Tran',r:'Regulator',st:'CO',s:'Suspended'}].map((u,i)=>(<tr key={i} className="border-b border-slate-50 hover:bg-slate-50"><td className="px-4 py-3 font-bold text-slate-800">{u.n}</td><td className="px-4 py-3 text-slate-600">{u.r}</td><td className="px-4 py-3 text-slate-600">{u.st}</td><td className="px-4 py-3"><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",u.s==='Active'?"bg-emerald-50 text-emerald-600":u.s==='Pending'?"bg-amber-50 text-amber-600":"bg-red-50 text-red-600")}>{u.s}</span></td><td className="px-4 py-3"><button className="text-xs font-bold text-indigo-600 hover:underline">View</button></td></tr>))}</tbody></table>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Agency Approvals Queue</h2>
      <div className="space-y-3">{[{id:'AUTH-991',n:'Officer Davis',r:'Law Enforcement',a:'OKC PD',b:'OKC-4921',d:'Apr 18'},{id:'AUTH-992',n:'Dr. Emily Chen',r:'Health Official',a:'State Health',b:'DOH-8812',d:'Apr 18'},{id:'AUTH-993',n:'Apex Holdings LLC',r:'Business Entity',a:'Private',b:'EIN-44210',d:'Apr 17'},{id:'AUTH-994',n:'James Ortiz, Esq.',r:'Attorney',a:'Ortiz Law',b:'BAR-99201',d:'Apr 17'}].map((a,i)=>(<div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><UserCheck size={20}/></div><div><p className="font-bold text-slate-800">{a.n} <span className="text-slate-400 font-normal">— {a.r}</span></p><p className="text-xs text-slate-500">{a.a} • Badge: {a.b} • {a.d}</p></div></div><div className="flex gap-2"><button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">Approve</button><button className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100">Deny</button></div></div>))}</div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Applications Queue</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[{l:'New Today',v:'48'},{l:'Under Review',v:'342'},{l:'Awaiting Docs',v:'112'}].map((s,i)=>(<div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center"><p className="text-[10px] font-bold text-slate-500 uppercase">{s.l}</p><p className="text-xl font-black text-slate-800">{s.v}</p></div>))}
      </div>
      <div className="space-y-2">{[{id:'APP-5021',n:'Jane Smith',t:'Patient Card - Adult',st:'Under Review',d:'Apr 18'},{id:'APP-5020',n:'GreenLeaf Farms',t:'Cultivator License',st:'Awaiting Docs',d:'Apr 18'},{id:'APP-5019',n:'Dr. Martin',t:'Provider Registration',st:'New',d:'Apr 17'},{id:'APP-5018',n:'CannaCare LLC',t:'Dispensary License',st:'Under Review',d:'Apr 17'}].map((a,i)=>(<div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between"><div><p className="font-bold text-slate-800 text-sm">{a.id} — {a.n}</p><p className="text-xs text-slate-500">{a.t} • {a.d}</p></div><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",a.st==='New'?"bg-blue-50 text-blue-600":a.st==='Under Review'?"bg-amber-50 text-amber-600":"bg-orange-50 text-orange-600")}>{a.st}</span></div>))}</div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Compliance Monitor</h2>
      <div className="space-y-3">{[{e:'Apex Health LLC',f:'Daily sales volume exceeded threshold',s:'High',t:'2h ago'},{e:'UID-8922',f:'Failed seed-to-sale sync — 3 consecutive',s:'Critical',t:'4h ago'},{e:'GreenLeaf Farms',f:'Inventory discrepancy detected',s:'Medium',t:'1d ago'}].map((c,i)=>(<div key={i} className={cn("bg-white border rounded-2xl p-5 shadow-sm",c.s==='Critical'?"border-red-200":"border-slate-200")}><div className="flex items-center justify-between mb-2"><p className="font-bold text-slate-800">{c.e}</p><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",c.s==='Critical'?"bg-red-50 text-red-600":c.s==='High'?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600")}>{c.s}</span></div><p className="text-sm text-slate-600">{c.f}</p><p className="text-[10px] text-slate-400 mt-1">{c.t}</p></div>))}</div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Master Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><h3 className="font-bold text-slate-800 mb-4">Monthly Growth</h3><div className="h-48 bg-gradient-to-t from-indigo-50 to-white rounded-xl border border-slate-100 flex items-end justify-around px-4 pb-4">{[40,55,45,70,65,80,92].map((h,i)=>(<div key={i} className="w-8 bg-indigo-500 rounded-t-lg" style={{height:`${h}%`}}/>))}</div><div className="flex justify-around mt-2 text-[10px] text-slate-400 font-bold">{['Jan','Feb','Mar','Apr','May','Jun','Jul'].map(m=>(<span key={m}>{m}</span>))}</div></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><h3 className="font-bold text-slate-800 mb-4">Top States by Revenue</h3><div className="space-y-3">{[{s:'Oklahoma',v:'$4.2M',p:85},{s:'California',v:'$3.8M',p:76},{s:'Colorado',v:'$2.9M',p:58},{s:'Michigan',v:'$2.1M',p:42},{s:'Oregon',v:'$1.8M',p:36}].map((st,i)=>(<div key={i} className="flex items-center gap-3"><span className="text-sm font-bold text-slate-600 w-24">{st.s}</span><div className="flex-1 bg-slate-100 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full" style={{width:`${st.p}%`}}/></div><span className="text-sm font-black text-slate-800 w-16 text-right">{st.v}</span></div>))}</div></div>
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Platform Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"><h3 className="font-bold text-slate-800">General Configuration</h3>{[{l:'Platform Name',v:'GGP-OS'},{l:'Default Jurisdiction',v:'National (US)'},{l:'MFA Enforcement',v:'Required for All'},{l:'Session Timeout',v:'30 minutes'}].map((c,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm font-medium text-slate-600">{c.l}</span><span className="text-sm font-bold text-slate-800">{c.v}</span></div>))}</div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"><h3 className="font-bold text-slate-800">API Keys & Integrations</h3>{[{l:'OMMA Sync API',s:'Connected'},{l:'Firebase Auth',s:'Connected'},{l:'Geoapify Address',s:'Connected'},{l:'Stripe Payments',s:'Pending Setup'}].map((a,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm font-medium text-slate-600">{a.l}</span><span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",a.s==='Connected'?"bg-emerald-50 text-emerald-600":"bg-amber-50 text-amber-600")}>{a.s}</span></div>))}</div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'global_financials': return renderFinancials();
      case 'system_health': return renderSystemHealth();
      case 'jurisdiction_map': return renderOverview();
      case 'users': return renderUserMgmt();
      case 'patients': return renderUserMgmt();
      case 'business': return renderUserMgmt();
      case 'approvals': return renderApprovals();
      case 'applications': return renderApplications();
      case 'compliance': return renderCompliance();
      case 'reports': return renderReports();
      case 'logs': return renderLogs();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="GGMA Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-black text-sm text-white leading-tight tracking-tight uppercase">Founder Command</h2>
              <p className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">God View • Platform Owner</p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 mb-4 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "Founder")}&background=0F172A&color=fff&size=48`} alt="" className="w-full h-full" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{user?.displayName || "Executive Founder"}</p>
              <p className="text-[10px] text-slate-400 font-bold">Global Green Holdings</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {NAV_ITEMS.map((item, i) => {
            if ('section' in item) return <div key={i} className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.section}</div>;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id!)} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left", activeTab === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-900/40" : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
                <span className="flex items-center gap-3">{item.icon && <item.icon size={18} className={activeTab === item.id ? "text-white" : "text-slate-500"} />} {item.label}</span>
                {item.badge && <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-black">{item.badge}</span>}
              </button>
            );
          })}
        </div>
        <button onClick={onLogout} className="p-6 border-t border-white/5 flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <LogOut size={18} /> <span className="text-sm font-black uppercase tracking-widest">Master Sign Out</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-10 bg-white shrink-0">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               SYSTEM ONLINE
            </div>
            <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><Bell size={22} /><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-10">{getContent()}</div>
      </div>
    </div>
  );
};