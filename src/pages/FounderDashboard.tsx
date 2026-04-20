import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Globe, Zap, Database,
  FlaskConical, CreditCard, Map as MapIcon, BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { FederalDashboard } from './FederalDashboard';
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { AdminDashboard } from './AdminDashboard';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { LegislativeIntelTab } from '../components/federal/LegislativeIntelTab';

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
  { id: 'intel', label: 'Global Intelligence', icon: BookOpen },
  { id: 'logs', label: 'System Logs', icon: Database },
  { id: 'settings', label: 'God Settings', icon: Settings },
];

export const FounderDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [broadcastMsg, setBroadcastMsg] = useState('🚨 SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS • ALL NODES OPERATIONAL • FEDERAL DIRECTIVE IF12270 APPLIED');
  const [broadcastType, setBroadcastType] = useState('Urgent Alert (Red)');

  const handleBroadcast = () => {
    localStorage.setItem('gghp_platform_alert', broadcastMsg);
    alert('Broadcast Pushed Globally');
  };

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
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3"><Globe size={22} className="text-indigo-500" /> Jurisdiction Performance Matrix</h3>
               <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-widest">Live Sync</span>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead>
                     <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
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
                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
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
               <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { t: 'CRS: Cannabis State of Play', c: 'Federal', u: 'https://www.congress.gov/crs-product/IF12270' },
             { t: 'NCSL Legislation Database', c: 'State', u: 'https://www.ncsl.org/health/state-cannabis-legislation-database' },
             { t: 'FDA Regulation Guide', c: 'Federal', u: 'https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products-including-cannabidiol-cbd' },
             { t: 'Marijuana Moment', c: 'News', u: 'https://www.marijuanamoment.net/' }
           ].map((source, i) => (
             <a key={i} href={source.u} target="_blank" rel="noopener noreferrer" className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400">{source.c}</p>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 leading-tight">{source.t}</h4>
             </a>
           ))}
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
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500"/> Revenue Trajectory (P&L)</h3>
              <div className="flex gap-2">
                 <button className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200">1D</button>
                 <button className="px-3 py-1 bg-indigo-50 text-[10px] font-bold text-indigo-600 rounded-lg border border-indigo-200">1W</button>
                 <button className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200">1M</button>
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
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-lg transition-all duration-700 group-hover:from-indigo-500 group-hover:to-indigo-300" style={{ height: `${h * 0.7}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap shadow-xl z-20">
                      ${(h/10).toFixed(1)}M
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Building2 size={18} className="text-emerald-500"/> Jurisdiction Revenue Breakdown</h3>
            <div className="space-y-4">
               {[
                 { s: 'Oklahoma', r: '$4.2M', g: '+14%', p: 85, c: 'bg-emerald-500' },
                 { s: 'Florida', r: '$3.8M', g: '+28%', p: 76, c: 'bg-blue-500' },
                 { s: 'California', r: '$2.9M', g: '+2%', p: 58, c: 'bg-indigo-500' },
                 { s: 'New Jersey', r: '$1.4M', g: '+8%', p: 28, c: 'bg-amber-500' }
               ].map((row, i) => (
                 <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-24 text-sm font-bold text-slate-600">{row.s}</div>
                    <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full transition-all duration-1000", row.c)} style={{ width: `${row.p}%` }}></div>
                    </div>
                    <div className="w-32 text-right">
                       <span className="text-sm font-black text-slate-800">{row.r}</span>
                       <span className="text-[10px] font-bold text-emerald-600 ml-2">{row.g}</span>
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

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
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
      case 'intel': 
        return <div className="h-full w-full -m-10 bg-[#080e1a] p-10 min-h-screen overflow-auto"><LegislativeIntelTab /></div>;
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
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-12 h-12 object-contain" />
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