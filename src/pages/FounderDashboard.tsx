import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Globe, Zap, Database,
  FlaskConical, CreditCard, Map as MapIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { FederalDashboard } from './FederalDashboard';
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { AdminDashboard } from './AdminDashboard';
import { SubscriptionPortal } from '../components/SubscriptionPortal';

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
  { section: 'OVERSIGHT HUB' },
  { id: 'federal', label: 'Federal Command', icon: Globe },
  { id: 'public_health', label: 'Public Health & Labs', icon: FlaskConical },
  { id: 'operations', label: 'Ops & Support Center', icon: Cpu },
  { id: 'state_admin', label: 'State Licensing (Admin)', icon: Shield },
  { id: 'subscription', label: 'Platform Billing', icon: CreditCard },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Revenue Trajectory (P&L)</h3>
              <select className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                <option>Last 12 Months</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[40, 55, 45, 70, 65, 80, 95, 85, 90, 100, 110, 120].map((h, i) => (
                <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-indigo-600 rounded-t-lg transition-all duration-700 group-hover:bg-indigo-400" style={{ height: `${h * 0.7}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap shadow-xl z-20">
                      ${(h/10).toFixed(1)}M
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Database size={18} className="text-indigo-500"/> Revenue Streams</h3>
            <div className="space-y-5">
              {[
                { n: 'Care Wallet Transactions', v: '$8.4M', p: 55, c: 'bg-indigo-600' },
                { n: 'Business License Fees', v: '$3.2M', p: 25, c: 'bg-emerald-500' },
                { n: 'Patient Registration Fees', v: '$1.8M', p: 15, c: 'bg-blue-500' },
                { n: 'B2B Compliance Services', v: '$1.4M', p: 5, c: 'bg-amber-500' }
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-600">{s.n}</span>
                    <span className="text-slate-900 font-black">{s.v}</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", s.c)} style={{ width: `${s.p}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ArrowUpRight size={18} className="text-emerald-500"/> God View Insights</h3>
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.1em] mb-2 flex items-center gap-2"><Zap size={12}/> Valuation Pulse</p>
                <p className="text-sm text-emerald-700 leading-relaxed font-bold">Platform enterprise value has increased by 14.2% since the Oklahoma RIP integration went live.</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black text-indigo-800 uppercase tracking-[0.1em] mb-2 flex items-center gap-2"><Globe size={12}/> Global Expansion</p>
                <p className="text-sm text-indigo-700 leading-relaxed font-bold">B2B drug inventory tracking systems are seeing 4.2x faster adoption in emerging markets.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700"><Download size={64} /></div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-2">Master Ledger</h4>
            <p className="text-xs text-slate-400 mb-6">Export full nationwide financial audit logs for Q2 2026.</p>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg text-sm">Download Financial PDF</button>
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
               <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center bg-indigo-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Global Access Control</h2>
          <p className="text-indigo-200">Executive override enabled. Create, suspend, or assign invite codes for any role.</p>
        </div>
        <div className="relative z-10 flex gap-4">
           <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
             <Plus size={18} /> Generate Invite Code
           </button>
           <button className="px-6 py-3 bg-indigo-800 text-white font-bold border border-indigo-700 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
             <Settings size={18} /> Role Permissions
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={18} className="text-indigo-500"/> Active Privileged Accounts</h3>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">1,204,891 Total Platform Users</span>
          </div>
          <div className="flex gap-2">
             <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="Search by name or email..." className="pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500" />
             </div>
             <select className="border border-slate-200 text-sm font-bold text-slate-600 rounded-lg px-3 outline-none">
               <option>All Roles</option>
               <option>Executive</option>
               <option>State Regulator</option>
               <option>Federal Oversight</option>
               <option>VIP / Investor</option>
             </select>
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">User / Email</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Assigned Role</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Jurisdiction</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Executive Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { n: 'Marcus Johnson', e: 'marcus@ggp-os.com', r: 'Executive / Founder', j: 'Global (All)', s: 'Active', invite: 'Claimed' },
              { n: 'Sen. Robert Chen', e: 'rchen@senate.gov', r: 'Federal Oversight', j: 'Nationwide (US)', s: 'Active', invite: 'Claimed' },
              { n: 'Emily Davis', e: 'emily.d@omma.ok.gov', r: 'State Regulator', j: 'Oklahoma', s: 'Active', invite: 'Claimed' },
              { n: 'Pending VIP', e: 'j.smith@capital.vc', r: 'VIP / Investor', j: 'Global (Read-Only)', s: 'Pending', invite: 'INV-4921-X9' },
              { n: 'Sarah Jenkins', e: 's.jenkins@ggp-os.com', r: 'System Ops', j: 'Global (Support)', s: 'Suspended', invite: 'Claimed' }
            ].map((u,i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{u.n}</p>
                  <p className="text-xs text-slate-500">{u.e}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border", 
                    u.r.includes('Executive') ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                    u.r.includes('Federal') ? "bg-blue-50 text-blue-700 border-blue-200" :
                    u.r.includes('VIP') ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-slate-100 text-slate-700 border-slate-200"
                  )}>{u.r}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-600">{u.j}</td>
                <td className="px-6 py-4">
                  {u.s === 'Active' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><CheckCircle2 size={14}/> Active</span>
                  ) : u.s === 'Pending' ? (
                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600"><Clock size={14}/> Pending Join</span>
                      <p className="text-[10px] text-slate-500 font-mono">Code: {u.invite}</p>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-600"><AlertTriangle size={14}/> Suspended</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200">Edit</button>
                    {u.s !== 'Suspended' ? (
                      <button className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100">Deactivate</button>
                    ) : (
                      <button className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-100">Restore</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
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
      case 'federal': 
        return <div className="h-full w-full -m-10"><FederalDashboard user={user} onLogout={onLogout} /></div>;
      case 'public_health': 
        return <div className="h-full w-full -m-10"><PublicHealthDashboard user={user} onLogout={onLogout} /></div>;
      case 'operations': 
        return <div className="h-full w-full -m-10"><OperationsDashboard user={user} onLogout={onLogout} /></div>;
      case 'state_admin': 
        return <div className="h-full w-full -m-10"><AdminDashboard user={user} onLogout={onLogout} /></div>;
      case 'subscription': 
        return <SubscriptionPortal userRole="executive_founder" initialPlanId="fed_pro" />;
      case 'overview': return renderOverview();
      case 'global_financials': return renderFinancials();
      case 'system_health': return renderSystemHealth();
      case 'jurisdiction_map': return renderJurisdictionMap();
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