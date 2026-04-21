import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Globe, HeartPulse, Cpu, LayoutDashboard, LogOut, ArrowLeft, 
  FlaskConical, CreditCard, ChevronRight, Clock, Phone
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FederalDashboard } from './FederalDashboard';
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { OperationsDashboard } from './OperationsDashboard';
import { AdminDashboard } from './AdminDashboard';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { AuditLogsTab } from '../components/oversight/AuditLogsTab';
import { VirtualAttendantTab } from '../components/oversight/VirtualAttendantTab';

const NAV_ITEMS = [
  { section: 'MAIN OVERSIGHT' },
  { id: 'overview', label: 'Master Command', icon: LayoutDashboard },
  { id: 'audit_logs', label: 'System Audit Logs', icon: FileText },
  { section: 'SPECIALIZED PORTALS' },
  { id: 'federal', label: 'Federal Command', icon: Globe },
  { id: 'public_health', label: 'Public Health & Labs', icon: FlaskConical },
  { id: 'operations', label: 'Ops & Support Center', icon: Cpu },
  { id: 'state_admin', label: 'State Licensing (Admin)', icon: Shield },
  { id: 'virtual_attendant', label: 'GGE World Call Center', icon: Phone },
  { id: 'processor', label: 'GGE Processor', icon: Activity },
  { section: 'SYSTEM' },
  { id: 'subscription', label: 'Billing & Tiers', icon: CreditCard },
];

export const OversightDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight">GGHP Oversight Command Hub</h1>
           <p className="text-slate-500 font-medium">Unified access to Global Green Enterprise Inc sectors: GGMA, RIP, and SINC.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0b1525] p-6 rounded-3xl border border-[#1e3a5f]/30 shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('federal')}>
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform"><Globe size={120} /></div>
           <div className="w-12 h-12 bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-blue-700/50"><Globe size={24} /></div>
           <h3 className="text-xl font-bold text-white mb-2">Federal Command</h3>
           <p className="text-sm text-blue-200/60 mb-6">Nationwide analytics, interstate monitoring, and SAM.gov integration.</p>
           <div className="flex items-center text-blue-400 font-bold text-sm">Launch Portal <ChevronRight size={16} /></div>
        </div>

        <div className="bg-emerald-950 p-6 rounded-3xl border border-emerald-900/30 shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('public_health')}>
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform"><FlaskConical size={120} /></div>
           <div className="w-12 h-12 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-700/50"><FlaskConical size={24} /></div>
           <h3 className="text-xl font-bold text-white mb-2">Public Health</h3>
           <p className="text-sm text-emerald-200/60 mb-6">Lab standards, real-time exposure tracking, and recall management.</p>
           <div className="flex items-center text-emerald-400 font-bold text-sm">Launch Portal <ChevronRight size={16} /></div>
        </div>

        <div className="bg-indigo-950 p-6 rounded-3xl border border-indigo-900/30 shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('operations')}>
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform"><Cpu size={120} /></div>
           <div className="w-12 h-12 bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-700/50"><Cpu size={24} /></div>
           <h3 className="text-xl font-bold text-white mb-2">Ops Center</h3>
           <p className="text-sm text-indigo-200/60 mb-6">System support, ticket escalation, and back-office live queue.</p>
           <div className="flex items-center text-indigo-400 font-bold text-sm">Launch Portal <ChevronRight size={16} /></div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('state_admin')}>
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform"><Shield size={120} /></div>
           <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-700"><Shield size={24} /></div>
           <h3 className="text-xl font-bold text-white mb-2">State Licensing</h3>
           <p className="text-sm text-slate-400 mb-6">Manage patients, businesses, approvals, and platform compliance.</p>
           <div className="flex items-center text-slate-300 font-bold text-sm">Launch Portal <ChevronRight size={16} /></div>
        </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'audit_logs': return <div className="p-8 h-full overflow-hidden"><AuditLogsTab /></div>;
      case 'federal': 
        // We use a negative margin trick to make the embedded dashboard fill the container
        return <div className="h-full w-full -m-0"><FederalDashboard user={user} onLogout={onLogout} /></div>;
      case 'public_health': 
        return <div className="h-full w-full -m-0"><PublicHealthDashboard user={user} onLogout={onLogout} /></div>;
      case 'operations': 
        return <div className="h-full w-full -m-0"><OperationsDashboard user={user} onLogout={onLogout} /></div>;
      case 'state_admin': 
        return <div className="h-full w-full -m-0"><AdminDashboard user={user} onLogout={onLogout} /></div>;
      case 'virtual_attendant':
        return <div className="p-8 h-full overflow-y-auto"><VirtualAttendantTab /></div>;
      case 'processor':
        return (
          <div className="p-8 space-y-6 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">GGE Processor Master Command</h1>
                <p className="text-slate-500">Real-time oversight of the standalone private settlement rail.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-xs font-bold uppercase tracking-wider">Settlement Active</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-xs font-bold uppercase tracking-wider">Liquidity: High</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Network Volume</p>
                <h3 className="text-3xl font-black text-slate-800">$2.48M</h3>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] mt-1"><Activity size={10} /> Live Data Feed</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Settlement Nodes</p>
                <h3 className="text-3xl font-black text-slate-800">42</h3>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] mt-1"><Shield size={10} /> All Nodes Verified</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Bank Bridge</p>
                <h3 className="text-3xl font-black text-slate-800">$0.00</h3>
                <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] mt-1"><Clock size={10} /> Fully Settled</div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-3xl p-8 border border-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu size={120} /></div>
              <div className="relative z-10">
                <h4 className="text-[#D4AF77] font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield size={16} /> Compliance Division Master Logs
                </h4>
                <div className="space-y-4">
                   {[
                     { t: '14:02:11', e: 'B2B SETTLEMENT', d: 'Dispensary #482 → Lab #11', a: 'COMPLIANT' },
                     { t: '13:58:42', e: 'RELOAD NODE', d: 'Kiosk OK-49 (Cash Confirmation)', a: 'COMPLIANT' },
                     { t: '13:45:12', e: 'ALLOCATION UTIL', d: 'GGE Allocation #8821 (Case Unlock)', a: 'COMPLIANT' },
                   ].map((log, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                       <span className="font-mono text-slate-400">{log.t}</span>
                       <span className="font-black text-[#D4AF77]">{log.e}</span>
                       <span className="text-slate-300">{log.d}</span>
                       <span className="text-emerald-400 font-black">{log.a}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'subscription': 
        return <div className="p-8"><SubscriptionPortal userRole="regulator" initialPlanId="fed_pro" /></div>;
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Primary Oversight Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col shrink-0 z-50 shadow-2xl">
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-10 h-10 object-contain" />
            <div>
              <h2 className="font-black text-sm text-white leading-tight">Oversight Hub</h2>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Unified Command</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
              {user?.displayName?.[0] || "A"}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{user?.displayName || "Administrator"}</p>
              <p className="text-[10px] text-slate-500">Executive Access</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {NAV_ITEMS.map((item, i) => {
            if ('section' in item) return <div key={i} className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.section}</div>;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id!)} 
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left", 
                  activeTab === item.id 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner" 
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                )}
              >
                <span className="flex items-center gap-3">{item.icon && <item.icon size={18} />} {item.label}</span>
              </button>
            );
          })}
        </div>
        <button onClick={onLogout} className="p-5 border-t border-slate-900 flex items-center gap-3 text-slate-500 hover:text-white transition-colors bg-slate-950">
          <LogOut size={18} /> <span className="text-sm font-bold">Secure Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col bg-slate-50">
        {activeTab === 'overview' && (
          <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm z-10">
            <h1 className="text-lg font-black text-slate-800 tracking-tight">Oversight Command</h1>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ALL SYSTEMS ONLINE
              </span>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-hidden relative">
           {getContent()}
        </div>
      </div>
    </div>
  );
};
