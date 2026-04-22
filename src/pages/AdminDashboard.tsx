import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Headphones,
  Zap, UserPlus, GraduationCap, FlaskConical, BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { METRC_MANUAL } from '../data/metrcManual';

const NAV_ITEMS = [
  { section: 'INTERNAL COMMAND' },
  { id: 'overview', label: 'Admin Overview', icon: Activity },
  { id: 'staffing', label: 'Staffing Intelligence', icon: UserPlus },
  { id: 'negligence', label: 'Negligence Intercept', icon: Shield, badge: '1' },
  { section: 'MANAGEMENT' },
  { id: 'users', label: 'User Directory', icon: Users },
  { id: 'patients', label: 'Patient Registry', icon: HeartPulse },
  { id: 'business', label: 'Commercial Nodes', icon: Building2 },
  { section: 'OPS & COMPLIANCE' },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '8' },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '342' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { section: 'SYSTEM CONTROL' },
  { id: 'ai_monitor', label: 'AI Monitoring', icon: Bot },
  { id: 'regulatory_library', label: 'Regulatory Library', icon: BookOpen },
  { id: 'support', label: 'Support Hub', icon: MessageSquare },
  { id: 'settings', label: 'Admin Settings', icon: Settings },
];

export const AdminDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [regSearch, setRegSearch] = useState('');
  const [regCat, setRegCat] = useState<string | null>(null);

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Shield size={160} /></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">Internal Admin Command</h2>
          <p className="text-indigo-200 font-medium text-lg">System-wide administrative hub. Managing the human force and operational integrity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: '42,901', trend: '+12%', color: 'blue' },
          { label: 'Active Businesses', value: '1,422', trend: '+3%', color: 'emerald' },
          { label: 'Staff Efficiency', value: '96.2%', trend: 'Optimal', color: 'indigo' },
          { label: 'System Revenue', value: '$2.4M', trend: '+18%', color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
              <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg", 
                stat.trend.includes('+') || stat.trend === 'Optimal' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-6"><Activity size={22} className="text-indigo-500" /> Operational Throughput</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-2 relative">
               {[40, 55, 45, 70, 65, 80, 95, 85, 90, 100, 110, 120].map((h, i) => (
                 <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group overflow-hidden">
                   <div className="absolute bottom-0 w-full bg-indigo-500 transition-all duration-700" style={{ height: `${h * 0.6}%` }}></div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={80} className="text-amber-500" /></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3"><Bot size={22} className="text-indigo-400" /> AI Guardian Status</h3>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                     <span className="text-slate-500">Auto-Resolution Rate</span>
                     <span className="text-emerald-400">92%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                     <span className="text-slate-500">Human Handover Req</span>
                     <span className="text-amber-400">8%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500" style={{ width: '8%' }}></div>
                  </div>
               </div>
               <p className="text-xs text-slate-400 italic mt-6">"Sylara is currently managing 2,402 active support threads. No critical human interventions required at this moment."</p>
            </div>
         </div>
      </div>
    </div>
  );

  const renderStaffing = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5"><UserPlus size={120} /></div>
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Staffing Intelligence</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Human Performance Monitoring • Live Clock-ins • Resource Allocation</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-indigo-50 border border-indigo-200 px-6 py-4 rounded-2xl text-center">
               <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Active Human Sentinels</p>
               <p className="text-2xl font-black text-slate-800">428</p>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Users size={22} className="text-indigo-600"/> Real-Time Monitoring Queue</h3>
            <div className="flex gap-2">
               <input type="text" placeholder="Search staff..." className="px-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 w-64" />
            </div>
         </div>
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Employee / Title</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Clock-In</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Efficiency</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Current Task</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Command</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {[
                 { n: 'Sarah Jenkins', r: 'Staffing Architect', t: '08:02 AM', e: '98%', job: 'Onboarding Oversight', st: 'Optimal' },
                 { n: 'Marcus Thorne', r: 'Conflict Arbiter', t: '09:12 AM', e: '84%', job: 'Legal Escalation #402', st: 'Warning' },
                 { n: 'Alexander Voss', r: 'Legal Guardian', t: '08:55 AM', e: '99%', job: 'Registry Audit', st: 'Optimal' },
                 { n: 'Elena Rodriguez', r: 'Quality Sentinel', t: '07:45 AM', e: '96%', job: 'Public Health Sync', st: 'Optimal' },
               ].map((staff, i) => (
                 <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full", staff.st === 'Warning' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500')} />
                          <div>
                             <p className="font-black text-slate-800">{staff.n}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">{staff.r}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600">{staff.t}</td>
                    <td className="px-8 py-6">
                       <span className={cn("font-black", staff.st === 'Warning' ? 'text-red-600' : 'text-emerald-600')}>{staff.e}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500 italic">{staff.job}</td>
                    <td className="px-8 py-6 text-right">
                       <button className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", 
                          staff.st === 'Warning' ? "bg-red-600 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-800 hover:text-white"
                       )}>
                          {staff.st === 'Warning' ? 'Intercept' : 'Audit'}
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  const renderNegligence = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-20"><AlertTriangle size={120} /></div>
         <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Negligence Intercept</h2>
         <p className="text-red-100 font-medium">Critical performance breaches and idle task monitoring. Handle immediately.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white border-2 border-red-100 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black text-red-900 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Shield size={18} className="text-red-600" /> Active Negligence Alerts
            </h3>
            <div className="space-y-4">
               {[
                 { n: 'Marcus Thorne', r: 'Conflict Arbiter', m: 'Legal Escalation #402 has been idle for 42 minutes. Threshold: 30m.', t: '42m Idle' },
                 { n: 'System Monitor', r: 'Auto-Sentinel', m: 'Unusually low throughput on Support Channel #12.', t: 'Pattern Divergence' },
               ].map((alert, i) => (
                 <div key={i} className="p-5 bg-red-50 border border-red-100 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-red-600"></div>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="font-black text-red-900">{alert.n}</p>
                          <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">{alert.r}</p>
                       </div>
                       <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-red-600 text-white rounded-lg animate-pulse">{alert.t}</span>
                    </div>
                    <p className="text-xs text-red-800 font-medium leading-relaxed">{alert.m}</p>
                    <div className="mt-4 flex gap-2">
                       <button className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl hover:bg-red-700 uppercase">Direct Intercept</button>
                       <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-[10px] font-black rounded-xl hover:bg-red-50 uppercase">Issue Warning</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-slate-800">
            <div className="absolute bottom-0 right-0 p-8 opacity-10"><MonitorPlay size={120} className="text-indigo-500" /></div>
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Efficiency Sentinel (AI)</h3>
            <div className="space-y-6">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                     "Sylara is analyzing clock-in patterns and task resolution velocity. 1 sentinel (M. Thorne) is currently under-performing based on historical baseline for Complex Arbitration."
                  </p>
               </div>
               <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black uppercase text-slate-500">Global Staffing Health</span>
                     <span className="text-emerald-400 font-black">96.8 / 100</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '96.8%' }}></div>
                  </div>
               </div>
               <button className="w-full py-3 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-black hover:bg-white/20 transition-all uppercase">Full Performance Audit</button>
            </div>
         </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Staff & User Management</h2>
          <p className="text-slate-500 text-sm">Manage state-level staff, inspectors, and patient/business accounts.</p>
        </div>
        <div className="relative z-10 flex gap-4">
           <button className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md hover:bg-slate-700 transition-colors flex items-center gap-2">
             <Plus size={16} /> Create Staff Invite
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Users size={16} className="text-indigo-500"/> Account Directory</h3>
          <div className="flex gap-2">
             <select className="border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-2 py-1 outline-none">
               <option>All Accounts</option>
               <option>State Staff</option>
               <option>Compliance Agent</option>
               <option>Business Admin</option>
               <option>Patient</option>
             </select>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase text-left">Name / Email</th>
              <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase text-left">Role</th>
              <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase text-left">Status</th>
              <th className="px-4 py-3 font-bold text-slate-500 text-xs uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Marcus Johnson', email: 'marcus@apexhealth.com', role: 'Business Admin', status: 'Active', date: 'Apr 18, 2026' },
              { name: 'Sarah Connor', email: 'sarah@greenvalley.com', role: 'Patient', status: 'Pending', date: 'Apr 17, 2026' },
              { name: 'Dr. Rachel Kim', email: 'rkim@provider.org', role: 'Physician', status: 'Active', date: 'Apr 16, 2026' },
              { name: 'David Smith', email: 'dsmith@state.gov', role: 'Compliance Inspector', status: 'Active', date: 'Apr 19, 2026' }
            ].map((u,i) => (
              <tr key={i} className="hover:bg-slate-50 group">
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs font-bold">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", u.status==='Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex justify-end gap-2">
                     <button className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200">Edit</button>
                     <button className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100">Suspend</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><BookOpen size={160} /></div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Regulatory Intelligence Hub</h2>
           <p className="text-indigo-200 font-medium">Native METRC User Guide & State Law Repository. Consult for Internal Policy Enforcement.</p>
           
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
                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
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

  const getContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'staffing': return renderStaffing();
      case 'negligence': return renderNegligence();
      case 'users': return renderUsers();
      case 'patients': return <div>Patient Management Placeholder</div>;
      case 'business': return <div>Business Management Placeholder</div>;
      case 'approvals': return <div>Agency Approvals Placeholder</div>;
      case 'applications': return <div>Applications Queue Placeholder</div>;
      case 'compliance': return <div>Compliance Monitor Placeholder</div>;
      case 'ai_monitor': return <div>AI Monitoring Placeholder</div>;
      case 'regulatory_library': return renderRegulatoryLibrary();
      case 'support': return <div>Support Hub Placeholder</div>;
      case 'settings': return <div>Admin Settings Placeholder</div>;
      default: return renderOverview();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Shield size={20} /></div>
            <div>
              <h2 className="font-black text-sm text-white leading-tight uppercase tracking-tight">Internal Admin</h2>
              <p className="text-[10px] text-indigo-400 font-black tracking-widest uppercase">Operational Control</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {NAV_ITEMS.map((item, i) => {
            if ('section' in item) return <div key={i} className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.section}</div>;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id!)} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left", activeTab === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-900/40" : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
                <span className="flex items-center gap-3">{item.icon && <item.icon size={18} className={activeTab === item.id ? "text-white" : "text-slate-500"} />} {item.label}</span>
                {item.badge && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">{item.badge}</span>}
              </button>
            );
          })}
        </div>
        <button onClick={onLogout} className="p-6 border-t border-white/5 flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <LogOut size={18} /> <span className="text-sm font-black uppercase tracking-widest">Admin Exit</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-10 bg-white shrink-0">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               SYSTEM OPERATIONAL
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-10">{getContent()}</div>
      </div>
    </div>
  );
};
