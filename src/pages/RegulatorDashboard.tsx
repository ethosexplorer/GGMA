import React, { useState } from 'react';
import { ShadowOverlay } from '../components/shared/ShadowOverlay';
import { Calendar, Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, CircleCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { UserCalendar } from '../components/UserCalendar';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const NAV_ITEMS = [
  { section: 'STATE OVERSIGHT' },
  { id: 'overview', label: 'Jurisdiction Overview', icon: Activity },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '8' },
  { id: 'applications', label: 'Applications Queue', icon: FileText },
  { section: 'COMPLIANCE' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'enforcement', label: 'RIP Enforcement Queue', icon: Gavel, dot: true },
  { id: 'reports', label: 'Regulatory Reports', icon: BarChart3 },
];

export const RegulatorDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-slate-100 border border-slate-200 p-8 rounded-3xl flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">State Regulatory Dashboard</h2>
            <p className="text-slate-500 font-medium">Monitoring jurisdiction: <span className="text-indigo-600 font-bold">{user?.state || 'Oklahoma'}</span></p>
         </div>
         <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Licenses</p>
               <p className="text-xl font-black text-slate-800">4,201</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Apps</p>
               <p className="text-xl font-black text-amber-600">342</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><UserCheck size={18} className="text-emerald-500"/> Recent Approvals</h3>
            <div className="space-y-3">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                       <p className="text-sm font-bold text-slate-700">Application #APP-{4920+i}</p>
                       <p className="text-[10px] text-slate-400 font-medium">Business License Renewal</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Approved</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500"/> Compliance Flags</h3>
            <div className="space-y-3">
               {[1,2].map(i => (
                 <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                       <p className="text-sm font-bold text-slate-700">Entity UID-{8820+i}</p>
                       <p className="text-[10px] text-slate-400 font-medium">Failed Seed-to-Sale Sync</p>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Flagged</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'calendar': return <div className="h-full w-full -m-10"><UserCalendar user={user} title="src\pages\Regulator Calendar" subtitle="Appointments & Scheduling" /></div>;
      case 'overview': return renderOverview();
      default: return (
        <div className="flex items-center justify-center h-[60vh]">
          

          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto"><FileText size={32}/></div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab.toUpperCase()} Module</h3>
            <p className="text-slate-500 text-sm font-medium">Securely scoped to the {user?.state || 'State'} Jurisdiction. Data here reflects real-time compliance metrics and application queues.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      <div className="bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 rounded-lg">
               <Shield size={18} />
            </div>
            <div>
              <h2 className="font-bold text-xs text-white leading-tight uppercase tracking-tight">State Oversight</h2>
              <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Regulator Portal</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700 shrink-0" />
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 min-w-max">
              {NAV_ITEMS.map((item, i) => {
                if ('section' in item) return <span key={i} className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-2 shrink-0">{item.section}</span>;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id!)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0", activeTab === item.id ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200")}>
                    {item.icon && <item.icon size={13} />} {item.label}
                    {item.badge && <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight capitalize">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">Authorized Personnel Only</div>
             <Bell size={20} className="text-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{getContent()}</div>
      </div>
    </div>
  );
};
