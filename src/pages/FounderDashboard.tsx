import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Globe, Zap, Database,
  FlaskConical, CreditCard, Map as MapIcon, BookOpen, UserPlus, Trash2,
  MapPin, Target, Layers, TrendingDown, Box, PieChart, GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { FederalDashboard } from './FederalDashboard';
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { AdminDashboard } from './AdminDashboard';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { LegislativeIntelTab } from '../components/federal/LegislativeIntelTab';
import { onSnapshot, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const NAV_ITEMS = [
  { section: 'FOUNDER EXCLUSIVE' },
  { id: 'global_financials', label: 'Global Financials', icon: TrendingUp },
  { id: 'system_health', label: 'System Health / AI', icon: Zap },
  { id: 'hr_intelligence', label: 'HR Intelligence (Sylara)', icon: UserPlus },
  { id: 'jurisdiction_map', label: 'Nationwide Oversight', icon: Globe },
  { section: 'MAIN' },
  { id: 'overview', label: 'God Overview', icon: Activity },
  { section: 'SUPREME COMMAND' },
  { id: 'users', label: 'Personnel Force (Total)', icon: Users },
  { id: 'patients', label: 'Registry Sovereignty', icon: HeartPulse },
  { id: 'business', label: 'Economic Infrastructure', icon: Building2 },
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
  { id: 'support_tickets', label: 'Support Tickets', icon: MessageSquare, badge: '12' },
  { id: 'settings', label: 'God Settings', icon: Settings },
];

export const FounderDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [broadcastMsg, setBroadcastMsg] = useState('🚨 SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS • GLOBAL GREEN HYBRID PLATFORM (GGHP) • ALL SECTORS (GGMA/RIP/SINC) OPERATIONAL');
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
             <p className="text-indigo-200 font-medium">Platform state: <span className="text-emerald-400 font-bold">Operational</span> • Umbrella: <span className="text-white font-bold">GGHP (Global Green Enterprise Inc)</span></p>
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
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ecosystem Processing (MTD)</p>
            <h3 className="text-2xl font-black text-slate-800">$428,910.00</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">+18.5% Growth</p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Settlement Buffer</p>
            <h3 className="text-2xl font-black text-slate-800">$125,000.00</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Status: Liquid</p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
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
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-xs">SR</div>
                   <div>
                      <p className="text-sm font-bold text-slate-800">Metrc API Training & Certification Test</p>
                      <p className="text-xs text-slate-500">Assigned: Shantell Robinson • Estimated: 2.5 Hours</p>
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

  const renderManagementView = (mode: 'users' | 'patients' | 'business') => {
    const config = {
      users: {
        title: "Supreme Personnel Command",
        desc: "The Founder's override. Ultimate authority to authorize, suspend, or terminate any privileged entity.",
        icon: Users,
        metricLabel: "Total Force",
        metricValue: counts.users,
        tableTitle: "Active Privileged Accounts",
        tableDesc: "Executive, Regulatory, and Support Staff",
        roles: ['Executive', 'Regulator', 'Staff'],
        data: [
          { n: 'Marcus Johnson', e: 'marcus@ggp-os.com', r: 'Executive / Founder', j: 'Global (All)', s: 'Active', invite: 'Claimed' },
          { n: 'Sen. Robert Chen', e: 'rchen@senate.gov', r: 'Federal Oversight', j: 'Nationwide (US)', s: 'Active', invite: 'Claimed' },
          { n: 'Emily Davis', e: 'emily.d@omma.ok.gov', r: 'State Regulator', j: 'Oklahoma', s: 'Active', invite: 'Claimed' },
          { n: 'Sarah Jenkins', e: 's.jenkins@ggp-os.com', r: 'System Ops', j: 'Global (Support)', s: 'Suspended', invite: 'Claimed' }
        ]
      },
      patients: {
        title: "Registry Sovereignty Oversight",
        desc: "Unified citizen oversight. Monitor patient distribution, card status, and state-level registration metrics.",
        icon: HeartPulse,
        metricLabel: "Active Citizens",
        metricValue: counts.patients,
        tableTitle: "Unified Patient Registry",
        tableDesc: "Medical Card Holders & Registered Caregivers",
        roles: ['Patient', 'Caregiver'],
        data: [
          { n: 'John Doe', e: 'j.doe@email.com', r: 'Primary Patient', j: 'Oklahoma', s: 'Active', invite: 'N/A' },
          { n: 'Alice Smith', e: 'alice.s@provider.com', r: 'Caregiver', j: 'Missouri', s: 'Active', invite: 'N/A' },
          { n: 'Michael Ross', e: 'm.ross@health.com', r: 'Minor Patient', j: 'Oklahoma', s: 'Pending', invite: 'DOC-9921' },
          { n: 'David Miller', e: 'd.miller@test.com', r: 'Primary Patient', j: 'Texas', s: 'Suspended', invite: 'N/A' }
        ]
      },
      business: {
        title: "Economic Infrastructure Control",
        desc: "Commercial force monitoring. Audit verified entities, POS integrations, and B2B infrastructure health.",
        icon: Building2,
        metricLabel: "Verified Entities",
        metricValue: counts.businesses,
        tableTitle: "Verified Commercial Entities",
        tableDesc: "Dispensaries, Cultivators, and Legal Firms",
        roles: ['Business', 'Attorney'],
        data: [
          { n: 'Apex Dispensary', e: 'hq@apex-med.com', r: 'Dispensary / Retail', j: 'Oklahoma City', s: 'Active', invite: 'LIC-001' },
          { n: 'GreenLeaf Farms', e: 'ops@greenleaf.com', r: 'Cultivator / Grow', j: 'Tulsa', s: 'Active', invite: 'LIC-002' },
          { n: 'Ortiz Law Firm', e: 'legal@ortiz.com', r: 'Legal / Compliance', j: 'Global', s: 'Active', invite: 'N/A' },
          { n: 'CannaLogic POS', e: 'dev@cannalogic.io', r: 'Integrator / Tech', j: 'National', s: 'Suspended', invite: 'API-992' }
        ]
      }
    }[mode];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-10"><config.icon size={120} /></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">{config.title}</h2>
            <p className="text-slate-400 font-medium">{config.desc}</p>
          </div>
          <div className="relative z-10 flex gap-4">
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center">
               <span className="text-[10px] font-black text-indigo-300 uppercase">{config.metricLabel}</span>
               <span className="text-xl font-black text-white">{config.metricValue.toLocaleString()}</span>
             </div>
             <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500 transition-colors flex items-center gap-2">
               <UserPlus size={18} /> Direct Manage
             </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><config.icon size={18} className="text-indigo-500"/> {config.tableTitle}</h3>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">{config.tableDesc}</span>
            </div>
            <div className="flex gap-2">
               <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input type="text" placeholder="Search registry..." className="pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500" />
               </div>
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Entity / Email</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Classification</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Command Status</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {config.data.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{u.n}</p>
                    <p className="text-xs text-slate-500">{u.e}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border bg-slate-50 text-slate-700 border-slate-200")}>
                      {u.r}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">{u.j}</td>
                  <td className="px-6 py-4">
                    {u.s === 'Active' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><CheckCircle2 size={14}/> Verified</span>
                    ) : u.s === 'Pending' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600"><Clock size={14}/> Processing</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-600"><AlertTriangle size={14}/> Locked</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleHireFire(u.e, 'activate')} className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-lg hover:bg-emerald-600 uppercase">Grant Access</button>
                      <button onClick={() => handleHireFire(u.e, 'suspend')} className="px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black rounded-lg hover:bg-amber-600 uppercase">Lock</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

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
                 <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all"><UserCheck size={20}/></div>
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
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
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
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-slate-200 transition-all cursor-pointer group">
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
        <div className="lg:col-span-2 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[400px]">
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
                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
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
                <div key={i} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
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
               <div className="absolute inset-0 rounded-full border-[16px] border-slate-100"></div>
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

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Platform Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"><h3 className="font-bold text-slate-800">General Configuration</h3>{[{l:'Platform Name',v:'GGP-OS'},{l:'Default Jurisdiction',v:'National (US)'},{l:'MFA Enforcement',v:'Required for All'},{l:'Session Timeout',v:'30 minutes'}].map((c,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm font-medium text-slate-600">{c.l}</span><span className="text-sm font-bold text-slate-800">{c.v}</span></div>))}</div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"><h3 className="font-bold text-slate-800">API Keys & Integrations</h3>{[{l:'OMMA Sync API',s:'Connected'},{l:'Firebase Auth',s:'Connected'},{l:'Geoapify Address',s:'Connected'},{l:'Stripe Payments',s:'Pending Setup'}].map((a,i)=>(<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm font-medium text-slate-600">{a.l}</span><span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",a.s==='Connected'?"bg-emerald-50 text-emerald-600":"bg-amber-50 text-amber-600")}>{a.s}</span></div>))}</div>
      </div>
    </div>
  );

  const SystemFreezeAlert = () => (
    <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
      <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl border-4 border-red-400 flex items-center gap-4 max-w-sm">
        <div className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-tight">System Freeze Detected</h4>
          <p className="text-[10px] font-bold opacity-90">AI Guardian is initiating immediate fix protocols for OK-Sector.</p>
        </div>
        <button className="px-3 py-1.5 bg-white text-red-600 rounded-lg text-[10px] font-black uppercase">Dismiss</button>
      </div>
    </div>
  );

  const renderOpsCenter = () => (
    <div className="h-full w-full -m-10"><OperationsDashboard user={user} onLogout={onLogout} /></div>
  );

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
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50", s.c)}><s.i size={24}/></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                 <p className="text-2xl font-black text-slate-800">{s.v}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
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
              { id: 'SUP-9921', s: 'POS Integration Timeout', e: 'Apex Health', a: 'AI Guardian', st: 'In Progress', c: 'text-blue-600 bg-blue-50' },
              { id: 'SUP-9920', s: 'License Renewal Inquiry', e: 'GreenLeaf Farms', a: 'Sarah Jenkins', st: 'Pending', c: 'text-amber-600 bg-amber-50' },
              { id: 'SUP-9919', s: 'Account Access Reset', e: 'John Doe', a: 'Bob Moore', st: 'Resolved', c: 'text-emerald-600 bg-emerald-50' },
            ].map((t, i) => (
              <tr key={i} className="hover:bg-slate-50 group transition-colors">
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

  const renderHRIntelligence = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
         <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">HR Intelligence Hub</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Managed by Sylara AI • The 15% Sentinel Force</p>
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
         {/* Staff Negligence & Performance Monitor */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                     <Users size={24} className="text-indigo-600" /> Active Sentinel Force
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Live Performance Tracking
                  </div>
               </div>
               <div className="space-y-4">
                  {[
                    { n: 'Alexander Voss', r: 'Sovereign Legal Guardian', s: '98.4%', c: '08:02 AM', st: 'Optimal', p: 'OK-Sector' },
                    { n: 'Elena Rodriguez', r: 'Elite Quality Sentinel', s: '99.1%', c: '07:55 AM', st: 'Optimal', p: 'FL-Sector' },
                    { n: 'Marcus Thorne', r: 'Complex Conflict Arbiter', s: '84.2%', c: '09:12 AM', st: 'Warning', p: 'MO-Sector' },
                    { n: 'Sarah Jenkins', r: 'Staffing Architect', s: '95.0%', c: '08:30 AM', st: 'Optimal', p: 'Global' },
                  ].map((staff, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff.n)}&background=f1f5f9&color=6366f1&bold=true`} alt="" />
                          </div>
                          <div>
                             <p className="font-black text-slate-800 leading-tight">{staff.n}</p>
                             <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{staff.r}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase">Efficiency</p>
                             <p className={cn("text-sm font-black", staff.st === 'Warning' ? 'text-red-600' : 'text-emerald-600')}>{staff.s}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase">Clock-In</p>
                             <p className="text-sm font-bold text-slate-700">{staff.c}</p>
                          </div>
                          <button className={cn(
                             "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                             staff.st === 'Warning' ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "bg-slate-200 text-slate-500 opacity-0 group-hover:opacity-100"
                          )}>
                             {staff.st === 'Warning' ? 'Intercept Negligence' : 'Audit Logs'}
                          </button>
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
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Sylara AI is successfully managing 84.8% of platform throughput. The Human Sentinel Force is handling the high-hierarchy 15.2% with minimal variance.</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Staffing Duties Breakdown</h4>
                  <div className="space-y-4">
                     {[
                       { l: 'Quality Assurance (UQA)', p: 45, c: 'bg-indigo-500' },
                       { l: 'Legal/Regulatory Design', p: 30, c: 'bg-emerald-500' },
                       { l: 'Complex Arbitration', p: 25, c: 'bg-amber-500' },
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
            <div className="bg-gradient-to-br from-slate-900 via-[#0a0f1c] to-slate-900 rounded-[3rem] p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-20"><GraduationCap size={120} className="text-indigo-400" /></div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-1 flex items-center gap-3 italic">
                     <UserPlus size={28} className="text-indigo-400" /> The Foundry
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Virtual Staffing Pipeline • AI-Led Recruitment</p>
                  
                  <div className="space-y-8">
                     {[
                       { s: 'Advertising', l: 'Elite UQA Guardian', p: 100, st: 'Complete', c: 'text-emerald-400' },
                       { s: 'Assessment', l: '14 Active Applicants', p: 65, st: 'Sylara Scoring', c: 'text-indigo-400' },
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
                  <div className="p-4 bg-white/50 rounded-2xl border border-slate-100">
                     <p className="text-xs font-black text-slate-400 italic">No other critical negligence detected by Sylara.</p>
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
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'federal': 
        return <div className="h-full w-full -m-10"><FederalDashboard user={user} onLogout={onLogout} /></div>;
      case 'public_health': 
        return <div className="h-full w-full -m-10"><PublicHealthDashboard user={user} onLogout={onLogout} /></div>;
      case 'operations': 
        return renderOpsCenter();
      case 'state_admin': 
        return <div className="h-full w-full -m-10"><AdminDashboard user={user} onLogout={onLogout} /></div>;
      case 'subscription': 
        return <SubscriptionPortal userRole="executive_founder" initialPlanId="fed_pro" />;
      case 'overview': return renderOverview();
      case 'global_financials': return renderFinancials();
      case 'system_health': return renderAutoFixMonitor();
      case 'jurisdiction_map': return renderJurisdictionMap();
      case 'users': return renderManagementView('users');
      case 'patients': return renderManagementView('patients');
      case 'business': return renderManagementView('business');
      case 'approvals': return renderApprovals();
      case 'applications': return renderApplications();
      case 'compliance': return renderCompliance();
      case 'reports': return renderReports();
      case 'intel': 
        return <div className="h-full w-full -m-10 bg-[#080e1a] p-10 min-h-screen overflow-auto"><LegislativeIntelTab /></div>;
      case 'logs': return renderLogs();
      case 'support_tickets': return renderSupportTickets();
      case 'hr_intelligence': return renderHRIntelligence();
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
        
        {/* Proactive System Alert */}
        <SystemFreezeAlert />
      </div>
    </div>
  );
};