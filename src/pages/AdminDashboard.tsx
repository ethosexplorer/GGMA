import React, { useState } from 'react';
import { turso } from '../lib/turso';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Headphones,
  Zap, UserPlus, GraduationCap, FlaskConical, BookOpen, Phone, ShieldAlert, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { METRC_MANUAL } from '../data/metrcManual';
import { UserCalendar } from '../components/UserCalendar';

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
  const [dbPatients, setDbPatients] = useState<any[]>([]);
  const [dbBusinesses, setDbBusinesses] = useState<any[]>([]);

  React.useEffect(() => {
    turso.execute('SELECT * FROM patients LIMIT 10').then(res => setDbPatients(res.rows)).catch(console.error);
    turso.execute('SELECT * FROM businesses LIMIT 10').then(res => setDbBusinesses(res.rows)).catch(console.error);
  }, []);
  const [regSearch, setRegSearch] = useState('');
  const [regCat, setRegCat] = useState<string | null>(null);
  
  const isExecutive = user?.role === 'executive_founder' || user?.role === 'executive_ceo';
  const [isUnlocked, setIsUnlocked] = useState(isExecutive);
  const [pin, setPin] = useState('');

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-indigo-900 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
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
          { label: 'B2B Network Volume', value: '$84.2M', trend: '+18%', color: 'indigo' },
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
        <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><BookOpen size={160} /></div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Regulatory Intelligence Hub</h2>
           <p className="text-indigo-200 font-medium">METRC User Guide & State Law Repository. Consult for Internal Policy Enforcement.</p>
           
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

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Headphones size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase mb-2">Ops & Call Center</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Live Support Monitoring • Human Takeover Queue • Sylara Handoffs</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase">Sylara Handling</p>
            <p className="text-2xl font-black text-slate-800">1,402</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 px-6 py-3 rounded-2xl text-center">
            <p className="text-[10px] font-black text-amber-600 uppercase">Human Queue</p>
            <p className="text-2xl font-black text-slate-800">14</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-sm"><MessageSquare size={16} className="text-indigo-600"/> Active Escelations</h3>
            <div className="space-y-4">
               {[
                 { id: 'TKT-9428', u: 'Jane Doe (Patient)', t: 'Payment Error during Checkout', s: 'Awaiting Agent', time: '4m ago', prio: 'High' },
                 { id: 'TKT-9429', u: 'GreenLeaf Farms', t: 'Compliance Form #4A Upload Failure', s: 'Sylara Escalated', time: '12m ago', prio: 'Urgent' },
                 { id: 'TKT-9430', u: 'Dr. Smith', t: 'Provider Validation Stuck', s: 'Awaiting Agent', time: '1h ago', prio: 'Medium' },
               ].map(tkt => (
                 <div key={tkt.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={cn("w-2 h-10 rounded-full", tkt.prio === 'Urgent' ? 'bg-red-500' : tkt.prio === 'High' ? 'bg-amber-500' : 'bg-blue-500')}></div>
                       <div>
                          <p className="font-bold text-slate-800">{tkt.t}</p>
                          <p className="text-xs font-medium text-slate-500">{tkt.id} • {tkt.u}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{tkt.s}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1">{tkt.time}</p>
                       </div>
                       <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-black uppercase opacity-0 group-hover:opacity-100 transition-all">Takeover</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-white">
            <h3 className="font-black mb-6 flex items-center gap-2 uppercase tracking-widest text-sm text-indigo-400"><Phone size={16}/> Call Center Load</h3>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-xs font-bold mb-2"><span>Average Wait Time</span> <span className="text-emerald-400">1m 42s</span></div>
                  <div className="flex justify-between text-xs font-bold mb-2"><span>Active Agents</span> <span className="text-white">42 / 50</span></div>
                  <div className="flex justify-between text-xs font-bold mb-2"><span>Resolution Rate</span> <span className="text-emerald-400">94%</span></div>
               </div>
               <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4">Agent Status Feed</p>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Marcus T.</span>
                        <span className="text-slate-400 font-bold italic">On Call (14m)</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Sarah J.</span>
                        <span className="text-slate-400 font-bold italic">Available</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Patient Registry</h2>
           <div className="flex gap-2">
              <input type="text" placeholder="Search patients..." className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:border-indigo-500" />
           </div>
        </div>
        <table className="w-full text-sm text-left">
           <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Patient Details</th>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">License Type</th>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Status</th>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {(dbPatients.length > 0 ? dbPatients.map(t => ({ n: t.name, e: t.email, t: t.medical_condition, s: t.status })) : [
                { n: 'Amanda Collins', e: 'amanda.c@email.com', t: 'Adult Patient (2-Year)', s: 'Active' },
                { n: 'Robert Vance', e: 'r.vance@email.com', t: 'Minor Patient', s: 'Pending Renewal' },
                { n: 'Sarah Jenkins', e: 's.jenkins@email.com', t: 'Caregiver', s: 'Active' },
              ]).map((p: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 group transition-colors">
                   <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{p.n}</p>
                      <p className="text-[10px] font-bold text-slate-400">{p.e}</p>
                   </td>
                   <td className="px-6 py-4 font-bold text-slate-600 text-xs">{p.t}</td>
                   <td className="px-6 py-4">
                      <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase", p.s === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>{p.s}</span>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <button className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-wider">Manage</button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );

  const renderBusiness = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic mb-6">Commercial Nodes</h2>
        <table className="w-full text-sm text-left">
           <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Business Entity</th>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Metrc Status</th>
                 <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {(dbBusinesses.length > 0 ? dbBusinesses.map(t => ({ n: t.business_name, t: t.license_type, l: 'Lic: ' + t.id, s: t.status })) : [
                { n: 'GreenLeaf Cultivation LLC', t: 'Cultivator', s: 'Synced' },
                { n: 'Apex Dispensary', t: 'Dispensary', s: 'Warning' },
                { n: 'Pure Extracts', t: 'Processor', s: 'Synced' },
              ]).map((b: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 group transition-colors">
                   <td className="px-6 py-4 font-bold text-slate-800">{b.n}</td>
                   <td className="px-6 py-4 font-bold text-slate-600 text-xs uppercase">{b.t}</td>
                   <td className="px-6 py-4">
                      <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center w-fit gap-1", b.s === 'Synced' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                        {b.s === 'Warning' ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />} {b.s}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <button className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-wider">Audit</button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
       <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-sm text-white">
          <h2 className="text-2xl font-black italic uppercase tracking-tight mb-2">Agency Approvals Pipeline</h2>
          <p className="text-slate-400 font-medium text-sm">Internal pre-screening queue before OMMA transmission.</p>
       </div>
       <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
          <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center">
             <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-4" />
             <h3 className="text-xl font-black text-slate-800 mb-2">Queue is Empty</h3>
             <p className="text-slate-500 font-medium">Sylara AI has auto-screened and forwarded all pending applications to the State Authority.</p>
          </div>
       </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
       <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-6">Applications Queue</h2>
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                   <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">ID</th>
                   <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Applicant</th>
                   <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Progress</th>
                   <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {[
                  { id: 'APP-991', n: 'John Doe', p: 'Background Check' },
                  { id: 'APP-992', n: 'Jane Smith', p: 'Document Verification' },
                ].map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-bold text-slate-600 text-xs">{a.id}</td>
                     <td className="px-6 py-4 font-black text-slate-800">{a.n}</td>
                     <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{a.p}</td>
                     <td className="px-6 py-4 text-right"><button className="text-xs font-black text-indigo-600 uppercase hover:underline">Review</button></td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
       <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-6 flex items-center gap-2"><ShieldAlert size={24} className="text-indigo-600"/> Compliance Monitor</h2>
          <div className="space-y-4">
             <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-amber-900">Missing Metrc API Key</h4>
                   <p className="text-xs text-amber-700 font-medium">Business: Apex Dispensary</p>
                </div>
                <button className="px-4 py-2 bg-amber-600 text-white text-[10px] font-black uppercase rounded-lg">Send Notice</button>
             </div>
             <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-emerald-900">Monthly Audit Completed</h4>
                   <p className="text-xs text-emerald-700 font-medium">System-wide auto-audit finished 2 hours ago.</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg">View Log</button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderAiMonitor = () => (
    <div className="space-y-6">
       <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Bot size={120} className="text-indigo-500"/></div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight mb-2">Sylara AI Telemetry</h2>
          <p className="text-indigo-300 text-sm font-medium">Real-time artificial intelligence load and token usage.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-slate-400">Total Tokens (24h)</p>
                <p className="text-2xl font-black mt-1">4.2M</p>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-slate-400">Avg Response Time</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">450ms</p>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-slate-400">Resolution Rate</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">98.2%</p>
             </div>
          </div>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
       <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm max-w-2xl">
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight mb-6">Global Admin Settings</h2>
          <div className="space-y-6">
             <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">System Status</label>
                <div className="flex gap-4">
                   <button className="flex-1 py-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 font-black rounded-xl uppercase text-xs">Online</button>
                   <button className="flex-1 py-3 bg-slate-50 border-2 border-slate-200 text-slate-500 font-black rounded-xl uppercase text-xs hover:bg-slate-100">Maintenance Mode</button>
                </div>
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Auto-Escalation Threshold (Mins)</label>
                <input type="number" defaultValue="5" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500" />
             </div>
             <button className="w-full py-4 bg-slate-900 text-white font-black uppercase text-xs rounded-xl shadow-lg hover:bg-slate-800">Save Configuration</button>
          </div>
       </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'calendar': return <div className="h-full w-full -m-10"><UserCalendar user={user} title="src\pages\Admin Calendar" subtitle="Appointments & Scheduling" /></div>;
      case 'overview': return renderOverview();
      case 'staffing': return renderStaffing();
      case 'negligence': return renderNegligence();
      case 'users': return renderUsers();
      case 'patients': return renderPatients();
      case 'business': return renderBusiness();
      case 'approvals': return renderApprovals();
      case 'applications': return renderApplications();
      case 'compliance': return renderCompliance();
      case 'ai_monitor': return renderAiMonitor();
      case 'regulatory_library': return renderRegulatoryLibrary();
      case 'support': return renderSupport();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans relative">
      {!isUnlocked && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <Lock size={48} className="text-indigo-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Restricted Access</h2>
            <p className="text-slate-500 text-sm mb-6">Enter 4-digit Oversight PIN</p>
            <input 
              type="password" 
              maxLength={4} 
              value={pin} 
              onChange={(e) => {
                 setPin(e.target.value);
                 if (e.target.value === '1234') setIsUnlocked(true);
              }} 
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl p-4 text-center text-3xl font-black text-slate-800 tracking-[1em] mb-4 outline-none transition-all" 
              placeholder="••••"
            />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Authorized Personnel Only</p>
          </div>
        </div>
      )}

      <div className={cn("w-64 bg-slate-950 border-r border-slate-900 flex flex-col hidden md:flex shrink-0 transition-all duration-500", !isUnlocked && "blur-md opacity-50 pointer-events-none")}>
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

      <div className={cn("flex-1 flex flex-col h-[calc(100vh)] overflow-hidden transition-all duration-500", !isUnlocked && "blur-xl scale-[0.98] opacity-50 pointer-events-none")}>
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
        
        {/* LIVE OPERATIONS & CLIENT ESCALATION FEED (RIGHT SIDEBAR) */}
        <div className={cn("w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 transition-all duration-500 hidden xl:flex", !isUnlocked && "blur-md opacity-50 pointer-events-none")}>
           <div className="h-20 border-b border-slate-200 flex items-center px-6 bg-slate-50 shrink-0">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 flex items-center gap-2"><Activity size={16} className="text-indigo-600" /> Live Client Escalations</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
              <div className="p-4 bg-white border-l-4 border-amber-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Business Alert</span>
                    <span className="text-[9px] text-slate-400 font-bold">Just Now</span>
                 </div>
                 <p className="text-xs font-bold text-slate-800">Apex Health CEO requests account override.</p>
                 <div className="mt-3 flex justify-between items-center">
                    <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1">Take Ticket</button>
                    <span className="text-[9px] font-bold text-slate-400">Assigned: AI</span>
                 </div>
              </div>
              <div className="p-4 bg-white border-l-4 border-emerald-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Patient Intake</span>
                    <span className="text-[9px] text-slate-400 font-bold">3m ago</span>
                 </div>
                 <p className="text-xs font-bold text-slate-800">Patient licensing error during document upload.</p>
                 <div className="mt-3 flex justify-between items-center">
                    <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1">Take Ticket</button>
                    <span className="text-[9px] font-bold text-slate-400">Assigned: Call Center</span>
                 </div>
              </div>
              <div className="p-4 bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">System Check</span>
                    <span className="text-[9px] text-slate-400 font-bold">12m ago</span>
                 </div>
                 <p className="text-xs font-bold text-slate-800">Daily OMMA sync verified by AI Sylara.</p>
                 <div className="mt-3 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">Auto-Resolved</span>
                    <span className="text-[9px] font-bold text-slate-400">Assigned: AI</span>
                 </div>
              </div>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 flex flex-col items-center justify-center">
                 <Activity size={24} className="mb-2 opacity-50" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Listening for incoming issues...</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};



