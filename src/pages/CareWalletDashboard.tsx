import React, { useState } from 'react';
import { 
  Wallet, CreditCard, TrendingUp, ShieldCheck, History, ArrowUpRight, 
  ArrowDownLeft, PlusCircle, Award, Target, Activity, Zap, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';

const transactions = [
  { id: 1, type: 'reload', amount: 200, date: 'Today, 10:30 AM', merchant: 'GGP Kiosk - Tulsa', status: 'Completed' },
  { id: 2, type: 'spend', amount: 45.50, date: 'Yesterday, 04:15 PM', merchant: 'Green Leaf Wellness', status: 'Completed' },
  { id: 3, type: 'spend', amount: 120, date: 'Apr 17, 2026', merchant: 'Dr. Sarah Jenkins (Telehealth)', status: 'Completed' },
  { id: 4, type: 'reward', amount: 15, date: 'Apr 15, 2026', merchant: 'Care Points Conversion', status: 'Completed' },
];

const c3Factors = [
  { name: 'Compassion Discipline', weight: '35%', score: 95, max: 100, status: 'Excellent', color: 'bg-emerald-500' },
  { name: 'Incentive Engagement', weight: '25%', score: 88, max: 100, status: 'Good', color: 'bg-blue-500' },
  { name: 'Larry Enforcement Node', weight: '20%', score: 100, max: 100, status: 'Secure', color: 'bg-purple-500' },
  { name: 'System Tenure', weight: '5%', score: 70, max: 100, status: 'Growing', color: 'bg-amber-500' },
];

const loyaltyTiers = [
  { name: 'Bronze', threshold: 0, multiplier: '1x', color: 'text-amber-700', bg: 'bg-amber-50' },
  { name: 'Silver', threshold: 500, multiplier: '1.5x', color: 'text-slate-500', bg: 'bg-slate-50' },
  { name: 'Gold', threshold: 2500, multiplier: '2x', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'Platinum', threshold: 10000, multiplier: '5x', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export const CareWalletDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
      alert('GGP-OS SECURE LOCATOR: 3 Approved Cash-Only Reload Kiosks verified within 5 miles. Please present your digital ID at the kiosk to load your Compassion Balance.');
    }, 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 hidden md:flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 shadow-inner">
              <Wallet size={24} />
            </div>
            <div>
              <h2 className="font-black text-sm leading-tight tracking-tight text-white uppercase">Care Wallet</h2>
              <p className="text-[10px] text-emerald-500/80 font-bold tracking-widest uppercase mt-0.5">Financial Core</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600">
              {user?.name ? user.name.charAt(0) : 'JD'}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{user?.name || 'Marcus Johnson'}</p>
              <p className="text-[10px] text-slate-400">Care Builder Plus Tier</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          <button onClick={() => setActiveTab('wallet')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left", activeTab === 'wallet' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Wallet size={16} className={cn(activeTab === 'wallet' ? "text-emerald-400" : "text-slate-500")} />
            Compassion Balance
          </button>
          <button onClick={() => setActiveTab('credit')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left", activeTab === 'credit' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <TrendingUp size={16} className={cn(activeTab === 'credit' ? "text-blue-400" : "text-slate-500")} />
            C³ Compassion Score
          </button>
          <button onClick={() => setActiveTab('cards')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left", activeTab === 'cards' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <CreditCard size={16} className={cn(activeTab === 'cards' ? "text-purple-400" : "text-slate-500")} />
            Virtual Cards
          </button>
          <button onClick={() => setActiveTab('rewards')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left", activeTab === 'rewards' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Award size={16} className={cn(activeTab === 'rewards' ? "text-amber-400" : "text-slate-500")} />
            Care Points
          </button>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Financial Overview</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Zero Chargeback Risk</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-2">
              <ShieldCheck size={14} /> KYC Verified
            </span>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors">
              <PlusCircle size={16} /> Load Funds
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top Row: Balance & C3 Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Compassion Balance Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                        <Wallet size={16} /> Compassion Balance
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">Available to spend in GGP-OS ecosystem</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-white text-xs font-bold mb-1">
                        Account # •••• 4092
                      </div>
                      <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Cleared Funds Only</span>
                    </div>
                  </div>
                  
                  <h1 className="text-6xl font-black text-white mb-2">$845.50</h1>
                  
                  <div className="flex items-center gap-4 mt-8">
                    <button onClick={handleReload} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
                      <PlusCircle size={18} /> Find Cash Reload
                    </button>
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl border border-slate-600 transition-colors flex items-center justify-center gap-2">
                      <History size={18} /> View Statement
                    </button>
                  </div>
                </div>
              </div>

              {/* C3 Compassion Score Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-slate-800 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-500" /> C³ Compassion Architecture
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">Closed-Loop Behavioral Scoring Engine</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-tighter border border-yellow-200">Silver Reward Tier</span>
                    <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-bold">1.5x Multiplier Active</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 mt-2">
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                      <path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="80, 100" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-800">712</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 850</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {loyaltyTiers.map((t, idx) => (
                        <div key={idx} className={cn("p-2 rounded-lg border text-center", t.name === 'Silver' ? "border-slate-300 bg-slate-50 shadow-sm" : "border-transparent opacity-40")}>
                          <p className={cn("text-[9px] font-black uppercase tracking-tighter", t.color)}>{t.name}</p>
                          <p className="text-[10px] font-bold text-slate-700">{t.multiplier}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-start gap-2">
                      <ShieldCheck size={14} className="text-emerald-600 mt-0.5" />
                      <p className="text-[10px] text-emerald-800 leading-tight">
                        <strong>Ecosystem Integrity:</strong> Your C³ score is built exclusively on internal GGP behaviors. Positive habit milestones are logged in the <strong>Audit Vault</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sylara Insight & Virtual Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2">
                {/* Sylara Insight */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl border border-blue-800 p-6 flex items-start gap-4 shadow-md mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/20">
                    <Zap size={24} />
                  </div>
                  <div className="flex-1 text-white">
                    <h4 className="font-bold flex items-center gap-2 text-lg">
                      Sylara Financial Insight <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/30 text-blue-200 border border-blue-500/50">Active</span>
                    </h4>
                    <p className="text-sm text-blue-100/90 mt-1 leading-relaxed">
                      "Marcus, you've maintained a positive Compassion Balance for 3 straight months and earned 450 Care Points. If you continue this payment discipline for 30 more days, you will unlock a 10% discount on telehealth visits and pre-qualify for our Phase 2 revolving provision line."
                    </p>
                  </div>
                </div>

                {/* C3 Factors Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Target size={18} className="text-[#1a4731]" /> Behavioral Enforcement Metrics
                  </h3>
                  <div className="space-y-4">
                    {c3Factors.map((factor, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{factor.name} <span className="text-slate-400 font-normal">({factor.weight})</span></span>
                          <span className="text-[10px] font-black text-slate-500 uppercase">{factor.status}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", factor.color)} style={{ width: `${(factor.score / factor.max) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-tight">Larry Enforcement Engine</p>
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Rule-Based Behavioral Guardrails: Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Virtual Card & Transactions */}
              <div className="space-y-6">
                
                {/* NomadCash / Virtual Card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><CreditCard size={120} /></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <span className="font-black tracking-widest text-lg">GGP CARD</span>
                      <span className="px-2 py-1 bg-white/20 rounded text-[10px] font-bold uppercase backdrop-blur-md">Virtual</span>
                    </div>
                    <p className="font-mono text-xl tracking-widest mb-2 opacity-90">4092 8812 3456 9011</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-70">Cardholder</p>
                        <p className="font-bold text-sm tracking-wide uppercase">{user?.name || 'Marcus Johnson'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-70">Exp</p>
                        <p className="font-bold text-sm">12/28</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions & Risk Logging */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <History size={18} className="text-slate-500" /> Immutable Ledger
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      Larry Monitored
                    </span>
                  </div>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            tx.type === 'reload' ? "bg-emerald-100 text-emerald-600" :
                            tx.type === 'spend' ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {tx.type === 'reload' ? <ArrowDownLeft size={14} /> : 
                             tx.type === 'spend' ? <ArrowUpRight size={14} /> : <Award size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{tx.merchant}</p>
                            <p className="text-[10px] text-slate-400">{tx.date} • ID: TXN-{Math.floor(Math.random() * 90000) + 10000}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-sm font-bold",
                            tx.type === 'reload' || tx.type === 'reward' ? "text-emerald-600" : "text-slate-700"
                          )}>
                            {tx.type === 'reload' || tx.type === 'reward' ? '+' : '-'}${tx.amount.toFixed(2)}
                          </p>
                          <p className="text-[9px] text-slate-400 uppercase">{tx.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors">
                    Export Audit-Ready Log
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
