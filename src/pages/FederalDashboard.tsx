import React, { useState } from 'react';
import { LayoutDashboard, Globe, Activity, Shield, DollarSign, Scale, Sparkles, FileText, BookOpen, Lock, CreditCard } from 'lucide-react';
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

const tabs = [
  { id: 'overview', label: 'Nationwide Overview', icon: LayoutDashboard },
  { id: 'intel', label: 'Legislative Intel', icon: BookOpen },
  { id: 'interstate', label: 'Interstate Monitoring', icon: Globe },
  { id: 'enforcement', label: 'Enforcement & Intel', icon: Shield },
  { id: 'research', label: 'Public Health & Labs', icon: Activity },
  { id: 'economic', label: 'Revenue & Taxation', icon: DollarSign },
  { id: 'policy', label: 'Policy Scenarios', icon: Scale },
  { id: 'sylara', label: 'Sylara Federal AI', icon: Sparkles },
  { id: 'reporting', label: 'Reporting & Coordination', icon: FileText },
  { id: 'sam', label: 'Rules & SAM.gov', icon: BookOpen },
  { id: 'audit', label: 'Lease & Audit Logs', icon: Lock },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
];

export const FederalDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#080e1a]">
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
          {activeTab === 'overview' && <FederalOverviewTab />}
          {activeTab === 'intel' && <LegislativeIntelTab />}
          {activeTab === 'interstate' && <InterstateMonitoringTab />}
          {activeTab === 'enforcement' && <EnforcementIntelTab />}
          {activeTab === 'research' && <ResearchHealthTab />}
          {activeTab === 'economic' && <EconomicAnalyticsTab />}
          {activeTab === 'policy' && <PolicyScenariosTab />}
          {activeTab === 'sylara' && <SylaraFederalTab />}
          {activeTab === 'reporting' && <ReportingTab />}
          {activeTab === 'sam' && <SAMGovRulesTab />}
          {activeTab === 'audit' && <LeaseAuditTab />}
          {activeTab === 'subscription' && <SubscriptionPortal userRole="regulator" initialPlanId="fed_pro" />}
        </main>
      </div>
    </div>
  );
};
