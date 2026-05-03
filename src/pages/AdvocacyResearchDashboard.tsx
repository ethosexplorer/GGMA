import React, { useState } from 'react';
import { LayoutDashboard, Activity, Shield, HeartPulse, ShieldAlert, FileText, Lock, CreditCard, Users, Download, Database, Dna } from 'lucide-react';
import { cn } from '../lib/utils';
import { SubscriptionPortal } from '../components/SubscriptionPortal';

export const AdvocacyResearchDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pin, setPin] = useState('');
  const [tier, setTier] = useState<'basic' | 'pro' | 'custom'>('pro');

  const tierLevels = { basic: 1, pro: 2, custom: 3 };
  const hasAccess = (requiredTier: string) => tierLevels[tier] >= tierLevels[requiredTier as keyof typeof tierLevels];

  const tabs = [
    { id: 'overview', label: 'Public Health Overview', icon: LayoutDashboard, tier: 'basic' },
    { id: 'safety', label: 'Product Safety & Recalls', icon: ShieldAlert, tier: 'basic' },
    { id: 'demographics', label: 'Patient Demographics', icon: Users, tier: 'pro' },
    { id: 'opioid', label: 'Opioid Reduction Metrics', icon: HeartPulse, tier: 'pro' },
    { id: 'community', label: 'Community Impact Reports', icon: FileText, tier: 'pro' },
    { id: 'predictive_health', label: 'Predictive Health Modeling', icon: Dna, tier: 'custom' },
    { id: 'research_api', label: 'Research Data API', icon: Database, tier: 'custom' },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, tier: 'basic' },
  ];

  return (
    <div className="h-screen bg-slate-50 overflow-hidden relative font-sans text-slate-800">
      {!isUnlocked && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <Shield className="text-teal-500 mx-auto mb-6 w-12 h-12" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Researcher Access</h2>
            <p className="text-slate-500 text-sm mb-6">Enter 4-digit Institute PIN</p>
            <input 
              type="password" 
              maxLength={4} 
              value={pin} 
              onChange={(e) => {
                 setPin(e.target.value);
                 if (e.target.value === '1234') setIsUnlocked(true);
              }} 
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl p-4 text-center text-3xl font-black text-slate-800 tracking-[1em] mb-4 outline-none transition-all" 
              placeholder="••••"
            />
          </div>
        </div>
      )}

      <div className={cn("h-full flex flex-col transition-all duration-500", !isUnlocked && "blur-xl scale-[0.98] opacity-50 pointer-events-none")}>
        {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGP-OS" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-wide">Public Health & Advocacy Portal</h1>
            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Non-profits, Researchers & Advocates</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs px-2 py-1.5 rounded-lg outline-none">
            <option value="basic">Basic Tier</option>
            <option value="pro">Pro Tier</option>
            <option value="custom">Custom Tier</option>
          </select>
          <button onClick={onLogout} className="text-xs text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg font-medium">Logout</button>
          <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span> SYNCED
          </span>
          <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 text-xs font-bold">EDU</div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {tabs.map(t => {
              const allowed = hasAccess(t.tier);
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={cn("w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === t.id
                      ? "bg-teal-50 text-teal-700 border border-teal-100 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent",
                    !allowed && "opacity-50"
                  )}>
                  <div className="flex items-center gap-3">
                    <t.icon size={18} className={activeTab === t.id ? "text-teal-600" : "text-slate-400"} />
                    {t.label}
                  </div>
                  {!allowed && <Lock size={14} className="text-slate-300" />}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Institute Tier</p>
              <p className="text-sm font-black text-slate-800 capitalize">Research {tier}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
          {(() => {
            const currentTab = tabs.find(t => t.id === activeTab);
            if (currentTab && !hasAccess(currentTab.tier)) {
              return (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-8 border border-teal-100">
                    <Lock size={40} className="text-teal-600" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4">Research Tier Upgrade</h2>
                  <p className="text-slate-500 max-w-lg mb-8 text-lg">
                    The <strong>{currentTab.label}</strong> module requires the <span className="capitalize text-teal-600 font-bold">{currentTab.tier}</span> tier. Upgrade your institute's subscription to access deep analytics and APIs.
                  </p>
                  <button onClick={() => setActiveTab('subscription')} className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-2xl shadow-xl shadow-teal-600/20 transition-all active:scale-95">
                    View Upgrade Options
                  </button>
                </div>
              );
            }

            return (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                   <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 text-teal-600">
                      {currentTab?.icon && <currentTab.icon size={28} />}
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-slate-900">{currentTab?.label}</h2>
                     <p className="text-slate-500 font-medium">Anonymized public health data and community outcomes.</p>
                   </div>
                </div>

                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Registered Patients</p>
                      <h3 className="text-4xl font-black text-slate-900">482,912</h3>
                      <p className="text-teal-600 text-sm font-bold mt-2">Verified Medical Necessity</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Lab Safety Checks</p>
                      <h3 className="text-4xl font-black text-slate-900">1.2M</h3>
                      <p className="text-emerald-500 text-sm font-bold mt-2">Pass Rate: 98.4%</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Opioid Prescription Drop</p>
                      <h3 className="text-4xl font-black text-indigo-600">-22%</h3>
                      <p className="text-slate-500 text-sm font-bold mt-2">In Legalized Counties</p>
                    </div>
                  </div>
                )}
                {activeTab === 'safety' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest">Product Safety & Recalls Data...</div>}
                {activeTab === 'demographics' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest">Patient Demographics Analytics...</div>}
                {activeTab === 'opioid' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest">Opioid Reduction Correlational Data...</div>}
                {activeTab === 'community' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest">Community Impact Reports...</div>}
                {activeTab === 'predictive_health' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest">Predictive Health Modeling Active...</div>}
                {activeTab === 'research_api' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest">Developer Research API Endpoints...</div>}
                {activeTab === 'subscription' && <SubscriptionPortal userRole="patient" initialPlanId={`advocacy_${tier}`} />}
              </div>
            );
          })()}
        </main>
      </div>
      </div>
    </div>
  );
};
