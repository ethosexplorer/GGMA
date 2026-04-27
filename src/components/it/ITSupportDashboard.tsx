import React, { useState } from 'react';
import { Activity, Users, ShieldAlert, ToggleLeft, ToggleRight, Server, Terminal, Search, CheckCircle2, AlertTriangle, KeySquare, Slash, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ITSupportDashboard = () => {
  const [activeTab, setActiveTab] = useState('apm');
  const [searchQuery, setSearchQuery] = useState('');

  const renderAPM = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
           <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={14} className="text-emerald-500" /> API Latency</h3>
           <p className="text-3xl font-black text-white">42<span className="text-lg text-slate-500 ml-1">ms</span></p>
           <p className="text-xs text-emerald-500 font-bold mt-2">Optimal</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
           <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Server size={14} className="text-indigo-500" /> Server Load</h3>
           <p className="text-3xl font-black text-white">28<span className="text-lg text-slate-500 ml-1">%</span></p>
           <p className="text-xs text-indigo-400 font-bold mt-2">Stable (US-East-1)</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 border border-red-900/50 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert size={60} className="text-red-500" /></div>
           <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Terminal size={14} className="text-red-500" /> Exceptions (1H)</h3>
           <p className="text-3xl font-black text-white">12</p>
           <p className="text-xs text-red-400 font-bold mt-2">Requires Review</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Terminal size={18} className="text-indigo-500" /> Recent Stack Traces (Sentry Simulation)</h3>
        <div className="space-y-3">
          {[
            { id: 'ERR-9921', service: 'pdf-gen', msg: 'Timeout waiting for font buffer', time: '2m ago', color: 'text-amber-500' },
            { id: 'ERR-9920', service: 'auth', msg: 'Invalid token signature', time: '14m ago', color: 'text-red-500' },
            { id: 'ERR-9919', service: 'db-sync', msg: 'Deadlock during wallet transaction', time: '1h ago', color: 'text-red-500' },
            { id: 'WARN-441', service: 'metrc', msg: 'API Rate limit approaching (85%)', time: '2h ago', color: 'text-amber-500' },
          ].map((err, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 font-mono text-sm">
               <span className={`font-bold ${err.color}`}>{err.id}</span>
               <span className="text-slate-400 w-24">[{err.service}]</span>
               <span className="text-slate-200 flex-1">{err.msg}</span>
               <span className="text-slate-500 text-xs">{err.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <input 
             type="text" 
             placeholder="Search users by email, ID, or phone number..." 
             className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-700"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-colors">
          Query User
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Support Actions Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-4">User</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Last Active</th>
                <th className="pb-4">IT Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'Dr. Sarah Jenkins', email: 's.jenkins@oklahoma-med.com', role: 'Provider', status: 'Active', time: '5m ago' },
                { name: 'Michael Thorne', email: 'm.thorne@thc-legal.com', role: 'Attorney', status: 'Locked', time: '2d ago' },
                { name: 'DispenseCo Tulsa', email: 'admin@dispenseco.com', role: 'Business', status: 'Active', time: '1h ago' },
              ].map((user, i) => (
                <tr key={i}>
                  <td className="py-4">
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                  </td>
                  <td className="py-4"><span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{user.role}</span></td>
                  <td className="py-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold", user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 text-xs font-bold text-slate-400">{user.time}</td>
                  <td className="py-4 flex gap-2">
                    <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg tooltip-trigger" title="Reset Password"><KeySquare size={18} /></button>
                    <button className="p-2 hover:bg-slate-100 text-red-600 rounded-lg tooltip-trigger" title="Suspend Account"><Slash size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFeatureFlags = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
           <div>
             <h3 className="font-bold text-slate-800 text-xl">System Feature Flags</h3>
             <p className="text-sm text-slate-500">Toggle core systems without deploying code. Use during outages.</p>
           </div>
           <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest border border-red-100">God Mode Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 1, name: 'Stripe Payments Processing', active: true, desc: 'Controls whether users can buy tokens or subscribe.' },
            { id: 2, name: 'Native Browser PDF Generation', active: true, desc: 'If false, disables form submissions globally.' },
            { id: 3, name: 'Metrc Sandbox Syncing', active: true, desc: 'Controls automatic syncing of inventory logs to Metrc.' },
            { id: 4, name: 'L.A.R.R.Y AI Overrides', active: false, desc: 'Experimental: allows AI to automatically resolve compliance flags.' },
          ].map((flag) => (
            <div key={flag.id} className="p-5 border border-slate-200 rounded-xl flex items-start gap-4">
              <div className="pt-1 cursor-pointer">
                {flag.active ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{flag.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{flag.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Terminal size={160} /></div>
        <div className="relative z-10">
           <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">IT Support & Diagnostics</h2>
           <p className="text-indigo-200 font-medium max-w-2xl">
             Secure operations center. Access application performance monitors, manage user states, and control feature flags without touching source code.
           </p>
        </div>
      </div>

      <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'apm', label: 'APM & Logs', icon: Activity },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'flags', label: 'Feature Flags', icon: ToggleRight },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
              activeTab === t.id ? "bg-white text-indigo-900 shadow-md" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <t.icon size={18} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'apm' && renderAPM()}
      {activeTab === 'users' && renderUserManagement()}
      {activeTab === 'flags' && renderFeatureFlags()}
    </div>
  );
};
