import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Headphones
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { section: 'MAIN' },
  { id: 'overview', label: 'Admin Overview', icon: Activity },
  { section: 'MANAGEMENT' },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'patients', label: 'Patient Management', icon: HeartPulse },
  { id: 'business', label: 'Business Management', icon: Building2 },
  { section: 'OPS & COMPLIANCE' },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '8' },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '342' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { section: 'OPERATIONS & AI' },
  { id: 'wallet', label: 'Care Wallet System', icon: Wallet },
  { id: 'backoffice', label: 'Backoffice Operations', icon: Cpu },
  { id: 'ai_monitor', label: 'AI Monitoring', icon: MonitorPlay },
  { id: 'support', label: 'Support Tickets', icon: MessageSquare },
];

const MOCK_USERS = [
  { name: 'Marcus Johnson', email: 'marcus@apexhealth.com', role: 'Business Admin', status: 'Active', date: 'Apr 18, 2026' },
  { name: 'Sarah Connor', email: 'sarah@greenvalley.com', role: 'Patient', status: 'Pending', date: 'Apr 17, 2026' },
  { name: 'Dr. Rachel Kim', email: 'rkim@provider.org', role: 'Physician', status: 'Active', date: 'Apr 16, 2026' },
  { name: 'James Ortiz', email: 'jortiz@dispensary.com', role: 'Dispensary Mgr', status: 'Suspended', date: 'Apr 15, 2026' },
  { name: 'Emily Tran', email: 'emily@westside.com', role: 'External Admin', status: 'Active', date: 'Apr 14, 2026' },
];

const MOCK_APPROVALS = [
  { id: 'AUTH-991', name: 'Officer Davis', role: 'Law Enforcement', agency: 'OKC PD', badge: 'OKC-4921', status: 'Pending', date: 'Apr 18, 2026' },
  { id: 'AUTH-992', name: 'Dr. Emily Chen', role: 'Health Official', agency: 'State Health', badge: 'DOH-8812', status: 'Pending', date: 'Apr 18, 2026' },
];

export const AdminDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: '42,901', trend: '+12%', color: 'blue' },
          { label: 'Active Businesses', value: '1,422', trend: '+3%', color: 'emerald' },
          { label: 'Pending Approvals', value: '342', trend: 'Critical', color: 'amber' },
          { label: 'System Revenue', value: '$2.4M', trend: '+18%', color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", 
                stat.trend.includes('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-indigo-500" /> Platform Activity Pulse
        </h3>
        <div className="h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
          <p className="text-slate-400 font-medium">Activity Chart Visualization</p>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">User Management</h2>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead><tr className="bg-slate-50 text-left"><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Name</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Email</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Role</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Status</th><th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase">Date</th></tr></thead>
        <tbody>{MOCK_USERS.map((u,i)=>(<tr key={i} className="border-b border-slate-50 hover:bg-slate-50"><td className="px-4 py-3 font-bold text-slate-800">{u.name}</td><td className="px-4 py-3 text-slate-500">{u.email}</td><td className="px-4 py-3 text-slate-600">{u.role}</td><td className="px-4 py-3"><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",u.status==='Active'?"bg-emerald-50 text-emerald-600":u.status==='Pending'?"bg-amber-50 text-amber-600":"bg-red-50 text-red-600")}>{u.status}</span></td><td className="px-4 py-3 text-slate-500 text-xs">{u.date}</td></tr>))}</tbody></table>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Agency Approvals</h2>
      <div className="space-y-3">{MOCK_APPROVALS.map((a,i)=>(<div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between"><div><p className="font-bold text-slate-800">{a.name} <span className="text-slate-400">— {a.role}</span></p><p className="text-xs text-slate-500">{a.agency} • {a.badge} • {a.date}</p></div><div className="flex gap-2"><button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg">Approve</button><button className="px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg">Deny</button></div></div>))}</div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Patient Management</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">{[{l:'Total Patients',v:'42,901'},{l:'Active Cards',v:'38,210'},{l:'Pending Renewals',v:'4,691'}].map((s,i)=>(<div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center"><p className="text-[10px] font-bold text-slate-500 uppercase">{s.l}</p><p className="text-xl font-black text-slate-800">{s.v}</p></div>))}</div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm"><thead><tr className="bg-slate-50"><th className="px-4 py-3 text-left font-bold text-slate-500 text-xs uppercase">Patient</th><th className="px-4 py-3 text-left font-bold text-slate-500 text-xs uppercase">Card ID</th><th className="px-4 py-3 text-left font-bold text-slate-500 text-xs uppercase">Type</th><th className="px-4 py-3 text-left font-bold text-slate-500 text-xs uppercase">Expires</th><th className="px-4 py-3 text-left font-bold text-slate-500 text-xs uppercase">Status</th></tr></thead>
        <tbody>{[{n:'Jane Smith',c:'OK-4821-2291',t:'Adult',e:'Dec 2026',s:'Active'},{n:'Mike Davis',c:'OK-4822-1102',t:'Caregiver',e:'Nov 2026',s:'Active'},{n:'Sarah Lee',c:'OK-4823-0091',t:'Minor',e:'Oct 2026',s:'Renewal'},{n:'Tom Garcia',c:'OK-4824-5521',t:'Adult',e:'Sep 2026',s:'Expired'}].map((p,i)=>(<tr key={i} className="border-b border-slate-50"><td className="px-4 py-3 font-bold text-slate-800">{p.n}</td><td className="px-4 py-3 text-slate-600 font-mono text-xs">{p.c}</td><td className="px-4 py-3 text-slate-600">{p.t}</td><td className="px-4 py-3 text-slate-500 text-xs">{p.e}</td><td className="px-4 py-3"><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",p.s==='Active'?"bg-emerald-50 text-emerald-600":p.s==='Renewal'?"bg-amber-50 text-amber-600":"bg-red-50 text-red-600")}>{p.s}</span></td></tr>))}</tbody></table>
      </div>
    </div>
  );

  const renderBusiness = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Business Management</h2>
      <div className="space-y-3">{[{n:'Apex Health LLC',t:'Dispensary',st:'OK',s:'Active',l:'OMMA-D-4421'},{n:'GreenLeaf Farms',t:'Cultivator',st:'OK',s:'Active',l:'OMMA-G-2210'},{n:'CannaCare Processing',t:'Processor',st:'OK',s:'Under Review',l:'OMMA-P-1192'},{n:'Westside Transport',t:'Transport',st:'TX',s:'Pending',l:'TX-TR-0081'}].map((b,i)=>(<div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Building2 size={20}/></div><div><p className="font-bold text-slate-800">{b.n}</p><p className="text-xs text-slate-500">{b.t} • {b.st} • License: {b.l}</p></div></div><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",b.s==='Active'?"bg-emerald-50 text-emerald-600":"bg-amber-50 text-amber-600")}>{b.s}</span></div>))}</div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Compliance Monitor</h2>
      <div className="space-y-3">{[{e:'Apex Health LLC',f:'Daily sales volume exceeded threshold',s:'High',t:'2h ago'},{e:'UID-8922',f:'Failed seed-to-sale sync — 3 consecutive',s:'Critical',t:'4h ago'},{e:'GreenLeaf Farms',f:'Inventory discrepancy detected',s:'Medium',t:'1d ago'}].map((c,i)=>(<div key={i} className={cn("bg-white border rounded-2xl p-5 shadow-sm",c.s==='Critical'?"border-red-200":"border-slate-200")}><div className="flex items-center justify-between mb-2"><p className="font-bold text-slate-800">{c.e}</p><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",c.s==='Critical'?"bg-red-50 text-red-600":c.s==='High'?"bg-amber-50 text-amber-600":"bg-blue-50 text-blue-600")}>{c.s}</span></div><p className="text-sm text-slate-600">{c.f}</p><p className="text-[10px] text-slate-400 mt-1">{c.t}</p></div>))}</div>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Care Wallet System</h2>
      <div className="grid grid-cols-3 gap-4">{[{l:'Total Wallet Volume',v:'$2.4M'},{l:'Active Wallets',v:'18,902'},{l:'B2B Transfers Today',v:'142'}].map((s,i)=>(<div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center"><p className="text-[10px] font-bold text-slate-500 uppercase">{s.l}</p><p className="text-xl font-black text-slate-800">{s.v}</p></div>))}</div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3">Recent Transactions</h3>
        <div className="space-y-2">{[{d:'Patient #4821 → Apex Dispensary',a:'$89.50',t:'POS Purchase'},{d:'GreenLeaf → CannaCare Processing',a:'$4,200.00',t:'B2B Transfer'},{d:'Token Purchase — Jane Smith',a:'$500.00',t:'Top-up'},{d:'Subscription — Pro Plan Renewal',a:'$149.00',t:'Recurring'}].map((tx,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><div><p className="text-sm font-bold text-slate-700">{tx.d}</p><p className="text-[10px] text-slate-400">{tx.t}</p></div><span className="text-sm font-bold text-emerald-600">+{tx.a}</span></div>))}</div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">AI Monitoring</h2>
      <div className="grid grid-cols-3 gap-4">{[{l:'Sylara Sessions',v:'842',s:'Active'},{l:'L.A.R.R.Y Assists',v:'1,204',s:'Today'},{l:'Auto-Resolved',v:'89%',s:'Rate'}].map((s,i)=>(<div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center"><p className="text-[10px] font-bold text-slate-500 uppercase">{s.l}</p><p className="text-xl font-black text-slate-800">{s.v}</p><p className="text-[10px] text-emerald-600 font-bold">{s.s}</p></div>))}</div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"><h3 className="font-bold text-slate-800 mb-3">AI Activity Feed</h3><div className="space-y-2">{['Sylara resolved 42 patient inquiries — avg 18s response','L.A.R.R.Y completed 8 med-card applications','Escalation: Complex legal query routed to paralegal','Sylara voice call handled — patient renewal assistance'].map((l,i)=>(<div key={i} className="p-3 bg-slate-50 rounded-xl text-sm text-slate-700 flex items-center gap-3"><Bot size={16} className="text-indigo-500 shrink-0"/>{l}</div>))}</div></div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">Support Tickets</h2>
      <div className="space-y-3">{[{id:'TKT-1021',s:'Login Issue',u:'sarah@email.com',st:'Open',p:'High'},{id:'TKT-1020',s:'Card Renewal Help',u:'mike@email.com',st:'In Progress',p:'Medium'},{id:'TKT-1019',s:'POS Integration Error',u:'apex@business.com',st:'Escalated',p:'Critical'},{id:'TKT-1018',s:'Document Upload Failed',u:'jane@email.com',st:'Resolved',p:'Low'}].map((t,i)=>(<div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between"><div><p className="font-bold text-slate-800 text-sm">{t.id}: {t.s}</p><p className="text-xs text-slate-500">{t.u}</p></div><div className="flex gap-2"><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",t.p==='Critical'?"bg-red-50 text-red-600":t.p==='High'?"bg-amber-50 text-amber-600":"bg-slate-100 text-slate-600")}>{t.p}</span><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",t.st==='Resolved'?"bg-emerald-50 text-emerald-600":"bg-blue-50 text-blue-600")}>{t.st}</span></div></div>))}</div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'patients': return renderPatients();
      case 'business': return renderBusiness();
      case 'approvals': return renderApprovals();
      case 'applications': return renderApplications();
      case 'compliance': return renderCompliance();
      case 'wallet': return renderWallet();
      case 'backoffice': return renderSupport();
      case 'ai_monitor': return renderAI();
      case 'support': return renderSupport();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="GGMA Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">Admin Command</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Jesus View • Administrator</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "Admin")}&background=4F46E5&color=fff&size=32`} alt="" className="w-full h-full" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{user?.displayName || "Admin"}</p>
              <p className="text-[10px] text-slate-400">Internal Operations</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {NAV_ITEMS.map((item, i) => {
            if ('section' in item) return <div key={i} className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.section}</div>;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id!)} className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left", activeTab === item.id ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:bg-slate-800/50")}>
                <span className="flex items-center gap-3">{item.icon && <item.icon size={16} />} {item.label}</span>
                {item.badge && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
              </button>
            );
          })}
        </div>
        <button onClick={onLogout} className="p-4 border-t border-slate-800 flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <LogOut size={16} /> <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h1 className="text-xl font-black text-slate-800 tracking-tight capitalize">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{getContent()}</div>
      </div>
    </div>
  );
};