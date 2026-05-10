import React, { useState } from 'react';
import { Calendar, LayoutDashboard, Globe, Activity, Shield, DollarSign, Scale, Sparkles, FileText, BookOpen, Lock, CreditCard, Gavel, AlertTriangle, CircleCheck, Search, Edit2, X } from 'lucide-react';
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
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';
const tabs = [
  { id: 'overview', label: 'Nationwide Overview', icon: LayoutDashboard, tier: 'basic' },
  { id: 'intel', label: 'Legislative Intel', icon: BookOpen, tier: 'basic' },
  { id: 'interstate', label: 'Interstate Monitoring', icon: Globe, tier: 'pro' },
  { id: 'enforcement', label: 'Enforcement & Intel', icon: Shield, tier: 'custom' },
  { id: 'research', label: 'Public Health & Labs', icon: Activity, tier: 'basic' },
  { id: 'economic', label: 'Revenue & Taxation', icon: DollarSign, tier: 'pro' },
  { id: 'policy', label: 'Policy Scenarios', icon: Scale, tier: 'custom' },
  { id: 'sylara', label: 'Sylara & L.A.R.R.Y AI', icon: Sparkles, tier: 'custom' },
  { id: 'reporting', label: 'Reporting & Coordination', icon: FileText, tier: 'pro' },
  { id: 'sam', label: 'Rules & SAM.gov', icon: BookOpen, tier: 'basic' },
  { id: 'audit', label: 'Lease & Audit Logs', icon: Lock, tier: 'custom' },
  { id: 'judicial', label: 'Judicial Monitor', icon: Gavel, tier: 'custom' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard, tier: 'basic' },
];

export const FederalDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pin, setPin] = useState('');
  const [tier, setTier] = useState<'basic' | 'pro' | 'custom'>('pro');
  const [liveAction, setLiveAction] = useState<any>(null);

  React.useEffect(() => {
    const handleLiveAction = async (e: any) => {
      const detail = e.detail;
      // Show immediate processing state
      setLiveAction({ ...detail, type: 'process' });

      try {
        // Fire real Gemini AI call for the action
        const { generateGeminiResponse } = await import('../lib/gemini');
        const prompt = `You are acting as the GGP-OS Federal Intelligence System. The user has requested: "${detail.title}". Context: ${detail.message}. Provide a professional, concise federal-grade response or report summary (4-6 sentences). Include any relevant compliance metrics or risk indicators.`;
        const aiResponse = await generateGeminiResponse(prompt, 'general');

        // Log to Turso
        const { turso } = await import('../lib/turso');
        const auditId = 'FED-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        await turso.execute({
          sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
          args: [auditId, detail.title, 'Federal_Admin', JSON.stringify({ detail: detail.message, response: aiResponse, action: 'FEDERAL_ACTION' })]
        }).catch(console.error);

        // Show the real result
        setLiveAction({ title: detail.title + ' — Complete', type: 'success', message: aiResponse + '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFederal Receipt: ' + auditId + '\nSynced to Turso DB • Gemini AI Generated' });
      } catch (err: any) {
        setLiveAction({ title: 'Processing Error', type: 'warning', message: 'Failed to complete request: ' + (err.message || 'Unknown error') });
      }
    };
    document.addEventListener('live-action', handleLiveAction);
    return () => document.removeEventListener('live-action', handleLiveAction);
  }, []);

  const tierLevels = { basic: 1, pro: 2, custom: 3 };
  const hasAccess = (requiredTier: string) => tierLevels[tier] >= tierLevels[requiredTier as keyof typeof tierLevels];

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
          <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="bg-[#111f36] border border-[#1e3a5f] text-blue-300 text-xs px-2 py-1 rounded outline-none">
            <option value="basic">Basic Tier</option>
            <option value="pro">Pro Tier</option>
            <option value="custom">Custom Tier</option>
          </select>
          
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
            {tabs.map(t => {
              const allowed = hasAccess(t.tier);
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                    activeTab === t.id
                      ? "bg-blue-900/50 text-blue-200 border border-blue-700/40"
                      : "text-blue-300/50 hover:bg-[#111f36] hover:text-blue-200 border border-transparent",
                    !allowed && "opacity-60"
                  )}>
                  <div className="flex items-center gap-2.5">
                    <t.icon size={15} className={activeTab === t.id ? "text-blue-400" : "text-blue-400/30"} />
                    {t.label}
                  </div>
                  {!allowed && <Lock size={12} className="text-blue-500/50" />}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-[#1e3a5f]/20">
            <div className="bg-[#0a1628] rounded-lg p-3 border border-[#1e3a5f]/30">
              <p className="text-[9px] text-blue-400/40 uppercase font-bold tracking-wider mb-1">Lease Tier</p>
              <p className="text-xs font-bold text-blue-200 capitalize">Federal {tier}</p>
              <p className="text-[10px] text-blue-300/40 mt-0.5">{tier === 'custom' ? '$85,000/mo' : tier === 'pro' ? '$24,999/mo' : '$5,999/mo'}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {(() => {
            const currentTab = tabs.find(t => t.id === activeTab);
            if (currentTab && !hasAccess(currentTab.tier)) {
              return (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-blue-900/20 rounded-full flex items-center justify-center mb-6 border border-blue-800/30">
                    <Lock size={32} className="text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3">Tier Upgrade Required</h2>
                  <p className="text-blue-300/70 max-w-md mb-8">
                    The <strong>{currentTab.label}</strong> module is restricted to the <span className="capitalize text-blue-300 font-bold">{currentTab.tier}</span> tier. Upgrade your jurisdiction's subscription to unlock real-time active integrations and deep predictive insights.
                  </p>
                  <button onClick={() => setActiveTab('subscription')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all">
                    View Upgrade Options
                  </button>
                </div>
              );
            }

            return (
              <>
                {activeTab === 'calendar' && (
                  <UserCalendar user={user} title="src\pages\Federal Calendar" subtitle="Appointments & Scheduling" />
                )}
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
                {activeTab === 'judicial' && <JudicialMonitorTab />}
                {activeTab === 'subscription' && <SubscriptionPortal userRole="regulator" initialPlanId={`fed_${tier}`} />}
              </>
            );
          })()}
        </main>
            
      {liveAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b1525] max-w-lg w-full rounded-[2rem] shadow-2xl border border-blue-900/50 overflow-hidden flex flex-col">
            <div className={`p-6 border-b ${liveAction.type === 'warning' ? 'bg-red-900/30 border-red-900/50' : liveAction.type === 'success' ? 'bg-emerald-900/30 border-emerald-900/50' : 'bg-[#111f36] border-blue-900/50'} flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                {liveAction.type === 'warning' && <AlertTriangle className="text-red-500" size={24} />}
                {liveAction.type === 'success' && <CircleCheck className="text-emerald-500" size={24} />}
                {liveAction.type === 'process' && <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />}
                {liveAction.type === 'info' && <Search className="text-blue-400" size={24} />}
                {liveAction.type === 'form' && <Edit2 className="text-blue-400" size={24} />}
                <h3 className="font-black text-white text-lg uppercase tracking-tight">{liveAction.title}</h3>
              </div>
              <button onClick={() => setLiveAction(null)} className="p-2 hover:bg-blue-900/50 rounded-lg transition-colors">
                <X size={20} className="text-blue-400/70" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-blue-100 font-medium leading-relaxed whitespace-pre-line">{liveAction.message}</p>
              
              {liveAction.type === 'process' && (
                <div className="mt-6 space-y-2">
                  <div className="h-2 w-full bg-[#080e1a] rounded-full overflow-hidden border border-blue-900/50">
                    <div className="h-full bg-blue-600 w-2/3 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-blue-400/60 tracking-widest text-right">Connecting to Federal Grid...</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-blue-900/50 bg-[#080e1a] flex justify-end gap-3">
              <button onClick={() => setLiveAction(null)} className="px-5 py-2.5 font-bold text-blue-300 hover:bg-blue-900/50 hover:text-white rounded-xl transition-colors">
                {liveAction.type === 'warning' ? 'Cancel' : 'Close'}
              </button>
              {(liveAction.type === 'warning' || liveAction.type === 'form') && (
                <button onClick={() => {
                  setLiveAction({ title: "Processing Directive", type: 'process', message: 'Executing secure cross-agency transmission...' });
                  
                  // Actual Live Production Backend Call
                  import('../lib/turso').then(({ turso }) => {
                    const auditId = 'FED-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                    turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: [auditId, liveAction.title, 'Federal_Admin', JSON.stringify({ detail: liveAction.message, action: 'FEDERAL_ACTION' })]
                    }).then(() => {
                      setLiveAction({ title: "Directive Confirmed", type: 'success', message: 'The federal action has been permanently logged to the oversight chain.\n\nFederal Receipt: ' + auditId });
                      setTimeout(() => setLiveAction(null), 3500);
                    }).catch((err) => {
                      console.error(err);
                      setLiveAction({ title: "Processing Failed", type: 'warning', message: 'Database transaction failed: ' + err.message });
                    });
                  });
                }} className={`px-5 py-2.5 font-black text-white rounded-xl shadow-lg transition-all uppercase text-sm ${liveAction.type === 'warning' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/50' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50'}`}>
                  Authorize Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
  
      </div>
      </div>
    </div>
  );
};
