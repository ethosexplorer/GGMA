import React, { useState } from 'react';
import { Calendar, LayoutDashboard, Globe, Activity, Shield, DollarSign, Scale, Sparkles, FileText, BookOpen, Lock, CreditCard, Gavel } from 'lucide-react';
import { cn } from '../lib/utils';
import { FederalOverviewTab } from '../components/federal/FederalOverviewTab';
import { InterstateMonitoringTab } from '../components/federal/InterstateMonitoringTab';
import { EnforcementIntelTab } from '../components/federal/EnforcementIntelTab';
import { ResearchHealthTab } from '../components/federal/ResearchHealthTab';
import { EconomicAnalyticsTab } from '../components/federal/EconomicAnalyticsTab';
import { PolicyScenariosTab } from '../components/federal/PolicyScenariosTab';
import { SylaraFederalTab } from '../components/federal/SylaraFederalTab';
import { ReportingTab } from '../components/federal/ReportingTab';
import { SAMGovRulesTab } from '../components/federal/SAMGovRulesTab';
import { LeaseAuditTab } from '../components/federal/LeaseAuditTab';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { LegislativeIntelTab } from '../components/federal/LegislativeIntelTab';
import { JudicialMonitorTab } from '../components/federal/JudicialMonitorTab';
import { UserCalendar } from '../components/UserCalendar';
const tabs = [
  { id: 'overview', label: 'Nationwide Overview', icon: LayoutDashboard },
  { id: 'intel', label: 'Legislative Intel', icon: BookOpen },
  { id: 'interstate', label: 'Interstate Monitoring', icon: Globe },
  { id: 'enforcement', label: 'Enforcement & Intel', icon: Shield },
  { id: 'research', label: 'Public Health & Labs', icon: Activity },
  { id: 'economic', label: 'Revenue & Taxation', icon: DollarSign },
  { id: 'policy', label: 'Policy Scenarios', icon: Scale },
  { id: 'reporting', label: 'Reporting & Coordination', icon: FileText },
  { id: 'sam', label: 'Rules & SAM.gov', icon: BookOpen },
  { id: 'audit', label: 'Lease & Audit Logs', icon: Lock },
  { id: 'judicial', label: 'Judicial Monitor', icon: Gavel },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
];

export const FederalDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pin, setPin] = useState('');

  return (
    <div className="h-screen bg-[#080e1a] overflow-hidden relative">
      {!isUnlocked && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#080e1a]/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-[#0b1525] p-8 rounded-[2rem] border border-blue-900/50 shadow-2xl shadow-blue-900/20 text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <Lock size={48} className="text-blue-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-2">Restricted Access</h2>
            <p className="text-blue-300/60 text-sm mb-6">Enter 4-digit Federal PIN</p>
            <input 
              type="password" 
              maxLength={4} 
              value={pin} 
              onChange={(e) => {
                 setPin(e.target.value);
                 if (e.target.value === '1234') setIsUnlocked(true);
              }} 
              className="w-full bg-[#080e1a] border border-blue-900/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-4 text-center text-3xl font-black text-white tracking-[1em] mb-4 outline-none transition-all" 
              placeholder="••••"
            />
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-4">Federal Personnel Only</p>
          </div>
        </div>
      )}

      <div className={cn("h-full flex flex-col transition-all duration-500", !isUnlocked && "blur-xl scale-[0.98] opacity-50 pointer-events-none")}>
        {/* Top Header */}
      <header className="bg-[#0b1525] border-b border-[#1e3a5f]/40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGP-OS" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide">GGP-OS Federal Administrative Dashboard</h1>
            <p className="text-[10px] text-blue-300/50 font-semibold uppercase tracking-widest">Nationwide Oversight Privilege • All 50 States + DC Live • Real-Time</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogout} className="text-xs text-blue-300 hover:text-white transition-colors border border-blue-800/50 px-3 py-1 rounded">Logout</button>
          <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-800/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
          </span>
          <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-700/50 flex items-center justify-center text-blue-300 text-xs font-bold">FD</div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-[#0b1525] border-r border-[#1e3a5f]/30 min-h-[calc(100vh-52px)] flex flex-col shrink-0">
          <nav className="flex-1 py-3 px-2 space-y-0.5">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                  activeTab === t.id
                    ? "bg-blue-900/50 text-blue-200 border border-blue-700/40"
                    : "text-blue-300/50 hover:bg-[#111f36] hover:text-blue-200 border border-transparent"
                )}>
                <t.icon size={15} className={activeTab === t.id ? "text-blue-400" : "text-blue-400/30"} />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-[#1e3a5f]/20">
            <div className="bg-[#0a1628] rounded-lg p-3 border border-[#1e3a5f]/30">
              <p className="text-[9px] text-blue-400/40 uppercase font-bold tracking-wider mb-1">Lease Tier</p>
              <p className="text-xs font-bold text-blue-200">Federal Pro</p>
              <p className="text-[10px] text-blue-300/40 mt-0.5">$24,999/mo</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'calendar' && (
                  <UserCalendar user={user} title="src\pages\Federal Calendar" subtitle="Appointments & Scheduling" />
                )}
                {activeTab === 'overview' && <FederalOverviewTab />}
          {activeTab === 'intel' && <LegislativeIntelTab />}
          {activeTab === 'interstate' && <InterstateMonitoringTab />}
          {activeTab === 'enforcement' && <EnforcementIntelTab />}
          {activeTab === 'research' && <ResearchHealthTab />}
          {activeTab === 'economic' && <EconomicAnalyticsTab />}
          {activeTab === 'sylara' && <SylaraFederalTab />}
          {activeTab === 'reporting' && <ReportingTab />}
          {activeTab === 'sam' && <SAMGovRulesTab />}
          {activeTab === 'audit' && <LeaseAuditTab />}
          {activeTab === 'judicial' && <JudicialMonitorTab />}
          {activeTab === 'subscription' && <SubscriptionPortal userRole="regulator" initialPlanId="fed_pro" />}
        </main>
      </div>
      </div>
    </div>
  );
};
