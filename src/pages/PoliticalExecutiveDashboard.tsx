import React, { useState } from 'react';
import { Calendar, LayoutDashboard, Activity, Shield, DollarSign, Scale, Sparkles, FileText, BookOpen, Lock, CreditCard, Users, TrendingUp, Vote, Building } from 'lucide-react';
import { cn } from '../lib/utils';
import { SubscriptionPortal } from '../components/SubscriptionPortal';

export const PoliticalExecutiveDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pin, setPin] = useState('');
  const [tier, setTier] = useState<'basic' | 'pro' | 'custom'>('pro');

  const tierLevels = { basic: 1, pro: 2, custom: 3 };
  const hasAccess = (requiredTier: string) => tierLevels[tier] >= tierLevels[requiredTier as keyof typeof tierLevels];

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, tier: 'basic' },
    { id: 'bills', label: 'Active Legislation', icon: FileText, tier: 'basic' },
    { id: 'tax_revenue', label: 'Tax & Revenue Forecasts', icon: DollarSign, tier: 'pro' },
    { id: 'jobs', label: 'Job Creation & Economy', icon: TrendingUp, tier: 'pro' },
    { id: 'public_sentiment', label: 'Voter Sentiment Analysis', icon: Vote, tier: 'pro' },
    { id: 'policy_simulator', label: 'AI Policy Simulator', icon: Sparkles, tier: 'custom' },
    { id: 'lobby_intel', label: 'Lobbyist & PAC Tracking', icon: Building, tier: 'custom' },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, tier: 'basic' },
  ];

  return (
    <div className="h-screen bg-[#080e1a] overflow-hidden relative font-sans text-white">
      {!isUnlocked && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#080e1a]/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-[#0b1525] p-8 rounded-[2rem] border border-blue-900/50 shadow-2xl shadow-blue-900/20 text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <Lock size={48} className="text-blue-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-2">Executive Access</h2>
            <p className="text-blue-300/60 text-sm mb-6">Enter 4-digit Authorization PIN</p>
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
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-4">Authorized Officials Only</p>
          </div>
        </div>
      )}

      <div className={cn("h-full flex flex-col transition-all duration-500", !isUnlocked && "blur-xl scale-[0.98] opacity-50 pointer-events-none")}>
        {/* Top Header */}
      <header className="bg-[#0b1525] border-b border-[#1e3a5f]/40 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGP-OS" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide">Government Executive & Policy Dashboard</h1>
            <p className="text-[10px] text-blue-300/50 font-semibold uppercase tracking-widest">Legislators, Congress & Governors • Live Data</p>
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
          <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-700/50 flex items-center justify-center text-blue-300 text-xs font-bold">GOV</div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b1525] border-r border-[#1e3a5f]/30 flex flex-col shrink-0">
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {tabs.map(t => {
              const allowed = hasAccess(t.tier);
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={cn("w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === t.id
                      ? "bg-blue-900/50 text-blue-200 border border-blue-700/40 shadow-lg shadow-blue-900/20"
                      : "text-blue-300/60 hover:bg-[#111f36] hover:text-blue-200 border border-transparent",
                    !allowed && "opacity-50"
                  )}>
                  <div className="flex items-center gap-3">
                    <t.icon size={18} className={activeTab === t.id ? "text-blue-400" : "text-blue-400/40"} />
                    {t.label}
                  </div>
                  {!allowed && <Lock size={14} className="text-blue-500/50" />}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-[#1e3a5f]/20">
            <div className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/30">
              <p className="text-[10px] text-blue-400/50 uppercase font-bold tracking-widest mb-1">Office Tier</p>
              <p className="text-sm font-black text-blue-200 capitalize">Executive {tier}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {(() => {
            const currentTab = tabs.find(t => t.id === activeTab);
            if (currentTab && !hasAccess(currentTab.tier)) {
              return (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-blue-900/20 rounded-full flex items-center justify-center mb-8 border border-blue-800/30">
                    <Lock size={40} className="text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4">Tier Upgrade Required</h2>
                  <p className="text-blue-300/70 max-w-lg mb-8 text-lg">
                    The <strong>{currentTab.label}</strong> module is restricted to the <span className="capitalize text-blue-300 font-bold">{currentTab.tier}</span> tier. Upgrade your office's subscription to unlock deep political insights and economic forecasting.
                  </p>
                  <button onClick={() => setActiveTab('subscription')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95">
                    View Upgrade Options
                  </button>
                </div>
              );
            }

            return (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-800/50">
                   <div className="p-3 bg-blue-900/30 rounded-2xl border border-blue-800/30 text-blue-400">
                      {currentTab?.icon && <currentTab.icon size={28} />}
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-white">{currentTab?.label}</h2>
                     <p className="text-slate-400 font-medium">Real-time legislative and economic oversight.</p>
                   </div>
                </div>

                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0b1525] p-6 rounded-2xl border border-[#1e3a5f]/40">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Constituent Approval</p>
                      <h3 className="text-4xl font-black text-white">62.4%</h3>
                      <p className="text-emerald-400 text-sm font-bold mt-2">↑ 4.2% Since Last Bill</p>
                    </div>
                    <div className="bg-[#0b1525] p-6 rounded-2xl border border-[#1e3a5f]/40">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Pending Legislation</p>
                      <h3 className="text-4xl font-black text-white">14</h3>
                      <p className="text-amber-400 text-sm font-bold mt-2">3 Require Immediate Review</p>
                    </div>
                    <div className="bg-[#0b1525] p-6 rounded-2xl border border-[#1e3a5f]/40">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Economic Impact MTD</p>
                      <h3 className="text-4xl font-black text-emerald-400">+$4.2M</h3>
                      <p className="text-slate-400 text-sm font-bold mt-2">Cannabis Tax Revenue</p>
                    </div>
                  </div>
                )}
                {activeTab === 'bills' && <div className="text-center py-40 text-slate-500 font-bold uppercase tracking-widest">Active Legislation Tracker Loading...</div>}
                {activeTab === 'tax_revenue' && <div className="text-center py-40 text-slate-500 font-bold uppercase tracking-widest">Tax & Revenue Forecasting Dashboard...</div>}
                {activeTab === 'jobs' && <div className="text-center py-40 text-slate-500 font-bold uppercase tracking-widest">Economic Impact & Job Growth...</div>}
                {activeTab === 'public_sentiment' && <div className="text-center py-40 text-slate-500 font-bold uppercase tracking-widest">Social Media & Voter Sentiment Analysis...</div>}
                {activeTab === 'policy_simulator' && <div className="text-center py-40 text-slate-500 font-bold uppercase tracking-widest">AI Policy Sandbox Initializing...</div>}
                {activeTab === 'lobby_intel' && <div className="text-center py-40 text-slate-500 font-bold uppercase tracking-widest">PAC & Lobbyist Activity Monitor...</div>}
                {activeTab === 'subscription' && <SubscriptionPortal userRole="executive" initialPlanId={`gov_${tier}`} />}
              </div>
            );
          })()}
        </main>
      </div>
      </div>
    </div>
  );
};
