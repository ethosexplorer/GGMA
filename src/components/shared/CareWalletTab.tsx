import React, { useState } from 'react';
import { Wallet, CreditCard, ArrowUpCircle, ArrowDownCircle, Shield, Sparkles, Clock, MapPin, TrendingUp, Star, Zap, Lock, Activity, Briefcase, Database } from 'lucide-react';
import { cn } from '../../lib/utils';

const walletTiers = [
  { id: 'bronze', name: 'Bronze', price: 'Free', color: 'from-amber-700 to-amber-900', badge: '🟤', features: ['Compassion Balance (Cash Only)', 'Ecosystem-Only Spending', 'Basic Transaction Ledger', 'Larry Silent Compliance', 'L.A.R.R.Y Basic Guidance'] },
  { id: 'silver', name: 'Silver', price: '$19/mo', color: 'from-slate-400 to-slate-600', badge: '⚪', features: ['Everything in Bronze +', 'GGE Disposable Virtual Card', 'Care Points Tier 1 (1.5x Multiplier)', 'Categorized Spending Tracking', 'Faster Cash Clearing'] },
  { id: 'gold', name: 'Gold', price: '$49/mo', color: 'from-yellow-500 to-amber-600', badge: '🟡', features: ['Everything in Silver +', 'Care Points Tier 2 (2x Multiplier)', 'L.A.R.R.Y Smart Balance Alerts', 'Larry Proactive Violation Block', 'Telehealth & Legal Discounts'] },
  { id: 'platinum', name: 'Platinum', price: '$99/mo', color: 'from-purple-500 to-indigo-700', badge: '🔴', features: ['Everything in Gold +', 'Unlimited Virtual Cards', 'Care Points Tier 3 (5x Multiplier)', 'Full System Routing Access', 'Full L.A.R.R.Y Autonomous AI'] },
];

const recentTransactions = [
  { id: 1, type: 'reload', desc: 'Cash Reload — GGE Oklahoma City', amount: 200, date: '2 hours ago', location: 'GGE OKC Kiosk' },
  { id: 2, type: 'spend', desc: 'Green Leaf Dispensary — Flower', amount: -45.00, date: 'Yesterday', location: 'Tulsa, OK' },
  { id: 3, type: 'spend', desc: 'Telehealth Visit — Dr. Johnson', amount: -99.00, date: '3 days ago', location: 'Virtual' },
  { id: 4, type: 'reload', desc: 'Cash Reload — Partner Store', amount: 150, date: '5 days ago', location: 'QuikTrip #441' },
  { id: 5, type: 'spend', desc: 'Legal Consultation — Smith & Assoc.', amount: -75.00, date: '1 week ago', location: 'Virtual' },
  { id: 6, type: 'spend', desc: 'Edibles Purchase — Canna Co.', amount: -32.50, date: '1 week ago', location: 'Norman, OK' },
];

const reloadLocations = [
  { name: 'GGE Oklahoma City Kiosk', type: 'kiosk', distance: '2.1 mi' },
  { name: 'Green Leaf Dispensary', type: 'dispensary', distance: '3.4 mi' },
  { name: 'QuikTrip #441 — Memorial', type: 'partner', distance: '0.8 mi' },
  { name: 'Cloud Nine Wellness', type: 'dispensary', distance: '5.2 mi' },
];

interface CareWalletTabProps {
  userRole?: 'patient' | 'provider' | 'business' | 'attorney';
}

export const CareWalletTab = ({ userRole = 'patient' }: CareWalletTabProps) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'tiers' | 'locations' | 'b2b' | 'general_tx'>('overview');
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showDisposableCard, setShowDisposableCard] = useState(false);
  const [reloadAmount, setReloadAmount] = useState('100');
  const currentTier = 'silver';
  const compassionBalance = 198.50;
  const carePoints = 742;
  const lineOfCredit = 5000;
  const utilizedCredit = 1250;

  return (
    <div className="space-y-6">
      {/* Balance Hero Card */}
      <div className="relative overflow-hidden bg-[#1a4731] bg-gradient-to-br from-emerald-950 via-[#1a4731] to-emerald-950 rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Wallet size={24} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-emerald-300/80 text-sm font-semibold uppercase tracking-wider">Care Wallet</p>
                <p className="text-xs text-emerald-400/60">Compassion Balance</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-400/20 text-slate-200 text-xs font-bold uppercase tracking-wider">
              ⚪ Silver Tier
            </span>
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-1">${compassionBalance.toFixed(2)}</h2>
          <p className="text-emerald-300/60 text-sm">Available to spend in ecosystem</p>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              <span className="text-sm font-semibold">{carePoints} Care Points</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-300/70">Larry: All Clear</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={() => setShowReloadModal(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <ArrowUpCircle size={16} /> Load Cash
            </button>
            <button 
              onClick={() => setShowCreditModal(true)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm"
            >
              <TrendingUp size={16} className="text-blue-400" /> GGE Compassion Allocation
            </button>
            <button 
              onClick={() => setShowDisposableCard(true)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 border border-white/20 backdrop-blur-sm"
            >
              <Zap size={16} className="text-amber-400" /> GGE Disposable
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GGE Compassion Allocation */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 uppercase tracking-tighter">Private Label Allocation</span>
          </div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Available GGE Allocation</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-3xl font-black text-slate-800">${(lineOfCredit - utilizedCredit).toLocaleString()}</h2>
            <span className="text-xs font-bold text-slate-400">/ ${lineOfCredit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
            <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${(utilizedCredit / lineOfCredit) * 100}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            <strong>GGE Allocation System:</strong> Utilizing GGE proprietary "Seed-to-Patient" financial framework.
          </p>
        </div>

        {/* NomadCash Settlement Info */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100 uppercase tracking-tighter">GGE Cash Node</span>
          </div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Settlement Account</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase">SWIFT/IBAN</span>
              <span className="text-[10px] font-mono font-bold text-slate-700">GGE-NODE-2291</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Routing</span>
              <span className="text-[10px] font-mono font-bold text-slate-700">012291482</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            <strong>Self-Built Processor:</strong> Connected via GGE-Private Settlement Rail. Direct bank-to-ecosystem bridge active.
          </p>
        </div>

        {/* Larry Compliance Division */}
        <div className="bg-[#0A3D2A] rounded-3xl p-6 shadow-lg border border-[#1a4731] relative overflow-hidden lg:col-span-1 md:col-span-2">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={80} className="text-[#D4AF77]" /></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF77]/20 flex items-center justify-center text-[#D4AF77]">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-[#D4AF77] font-black text-xs uppercase tracking-widest">Compliance Division</h3>
              <p className="text-[9px] text-emerald-400 font-bold">Led by Larry, Compliance Intelligence</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-100/90 leading-relaxed italic mb-4">
            "Your GGE Compassion Allocation and Compassion Balance are under 24/7 audit by the Larry Compliance Division. All transactions are GGP-OS verified."
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-emerald-800/50">
            <span className="text-[9px] text-[#D4AF77] font-bold uppercase tracking-widest">SLA Rating: A+</span>
            <span className="text-[9px] text-[#D4AF77] font-bold uppercase tracking-widest">KYC: Verified</span>
          </div>
        </div>
      </div>

      {/* Quick Action: B2B & B2C Charge/Pay */}
      {userRole === 'business' && (
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setActiveSection('b2b')}
            className="flex-1 bg-[#1a4731] hover:bg-[#153a28] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Briefcase size={20} />
            B2B & B2C Charge / Pay
          </button>
        </div>
      )}

      {/* Section Toggle */}
      <div className="flex bg-white rounded-xl border border-slate-200 p-1 w-max shadow-sm">
        {[
          { id: 'overview', label: 'Care Wallet Transactions' },
          { id: 'general_tx', label: 'General Transactions' },
          { id: 'tiers', label: 'Wallet Tiers' },
          { id: 'locations', label: 'Reload Locations' },
          userRole === 'business' && { id: 'b2b', label: 'B2B Transactions' },
        ].filter(Boolean).map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as typeof activeSection)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeSection === s.id ? "bg-[#1a4731] text-white shadow-md" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Transactions */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Recent Transactions</h3>
              <button className="text-sm text-[#1a4731] font-medium hover:underline">Export</button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === 'reload' ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-500"
                    )}>
                      {tx.type === 'reload' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{tx.desc}</p>
                      <p className="text-xs text-slate-500">{tx.location} • {tx.date}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "font-bold text-sm",
                    tx.amount > 0 ? "text-emerald-600" : "text-slate-800"
                  )}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spending Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Spending Breakdown</h3>
              {[
                { category: 'Dispensary', pct: 48, color: 'bg-emerald-500' },
                { category: 'Telehealth', pct: 28, color: 'bg-blue-500' },
                { category: 'Legal', pct: 14, color: 'bg-purple-500' },
                { category: 'Other', pct: 10, color: 'bg-slate-400' },
              ].map((c, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">{c.category}</span>
                    <span className="text-slate-800 font-bold">{c.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", c.color)} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-emerald-600" />
                <h4 className="font-bold text-emerald-800">L.A.R.R.Y Insight</h4>
              </div>
              <p className="text-sm text-emerald-700">"Your spending is well-balanced. Consider reloading $100 this week to maintain a comfortable buffer for your upcoming telehealth visit."</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                  <Activity size={10} className="animate-pulse" /> Node: Active
                </div>
              </div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Shield size={16} className="text-emerald-600" /> Larry Enforcement
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Compliance Status</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-wider">Perfect</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Risk Mitigation</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-wider">Autonomous</span>
                </div>
                <div className="pt-2 border-t border-slate-50 mt-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
                    <Lock size={10} /> Larry is currently enforcing GGP-OS Rule #402 (Closed-Loop Integrity)
                  </div>
                </div>
              </div>
            </div>

            {/* Care Points Rewards */}
            <div className="bg-yellow-50 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-6">
              <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <Star size={16} className="text-yellow-600" /> Care Points & Incentives
              </h4>
              <p className="text-sm text-yellow-700 mb-3 leading-relaxed">
                <span className="font-bold text-yellow-900 block mb-1 underline decoration-yellow-300">Financial Integrity Layer:</span>
                Compassion Balance is your money. <strong>Care Points</strong> are internal incentives earned for responsible usage and consistent reloads.
              </p>
              <ul className="space-y-2 mb-3">
                <li className="flex items-start gap-2 text-xs text-yellow-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  Silver Tier: 1.5x Point Multiplier (Unlocked)
                </li>
                <li className="flex items-start gap-2 text-xs text-yellow-800 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  Partner Perks: 10% off legal consultation fee
                </li>
                <li className="flex items-start gap-2 text-xs text-yellow-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  Health Data Opt-In: Earn 250 bonus points
                </li>
              </ul>
              <div className="mt-4 p-2 bg-yellow-200/50 rounded-lg border border-yellow-300/50">
                <div className="flex justify-between items-center text-[10px] font-bold text-yellow-800 uppercase tracking-tighter">
                  <span>Next Reward Tier</span>
                  <span>742 / 1000 Points</span>
                </div>
                <div className="w-full h-1.5 bg-yellow-300/50 rounded-full mt-1">
                  <div className="h-full bg-yellow-600 rounded-full" style={{ width: '74.2%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Tiers */}
      {activeSection === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {walletTiers.map((tier) => (
            <div key={tier.id} className={cn(
              "rounded-2xl border-2 p-6 transition-all",
              currentTier === tier.id ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-slate-200 hover:border-slate-300"
            )}>
              <div className={cn("inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-4 bg-gradient-to-r", tier.color)}>
                {tier.badge} {tier.name}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{tier.price}</h3>
              <p className="text-xs text-slate-500 mb-4">{tier.id === 'bronze' ? 'Forever free' : 'per month'}</p>
              <ul className="space-y-2">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {currentTier === tier.id ? (
                <div className="mt-4 text-center py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold">Current Plan</div>
              ) : (
                <button className="mt-4 w-full py-2 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                  {tier.id === 'bronze' ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reload Locations */}
      {activeSection === 'locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">Nearby Reload Locations</h3>
            <div className="space-y-3">
              {reloadLocations.map((loc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      loc.type === 'kiosk' ? "bg-blue-100 text-blue-600" :
                      loc.type === 'dispensary' ? "bg-emerald-100 text-emerald-600" :
                      "bg-amber-100 text-amber-600"
                    )}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{loc.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{loc.type} • {loc.distance}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                    Directions
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">How Cash Reload Works</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Visit Location', desc: 'Go to any approved reload point near you' },
                  { step: '2', title: 'Provide Phone Number', desc: 'Staff pulls up your Care Wallet account' },
                  { step: '3', title: 'Hand Over Cash', desc: 'Pay the amount you want to load' },
                  { step: '4', title: 'Balance Updates', desc: 'Compassion Balance updates instantly' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">{s.step}</div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{s.title}</p>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-amber-700" />
                <h4 className="font-bold text-amber-800 text-sm">Closed-Loop System</h4>
              </div>
              <p className="text-xs text-amber-700">Funds can only be used within the GGP-OS ecosystem. No withdrawals, no external transfers, no P2P. Every transaction is logged by Larry for full compliance.</p>
            </div>
          </div>
        </div>
      )}

      {/* B2B Transactions (Business Only) */}
      {activeSection === 'b2b' && userRole === 'business' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Approved Vendor Payments</h3>
              <button className="px-4 py-2 bg-[#1a4731] text-white rounded-lg text-xs font-bold hover:bg-[#153a28]">Add New Vendor</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Apex Cultivation LLC', type: 'Inventory Purchase', amount: 4500, status: 'Pending Approval' },
                { name: 'SecureMovers Logistics', type: 'Transport Fee', amount: 350, status: 'Scheduled' },
                { name: 'OMMA Regulatory Fees', type: 'Compliance Payment', amount: 2500, status: 'Processing' },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{v.name}</p>
                      <p className="text-xs text-slate-500">{v.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-800">${v.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-amber-600 font-bold uppercase">{v.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-900 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Database size={80} /></div>
              <h4 className="font-bold mb-2 flex items-center gap-2 text-blue-300"><Zap size={18} /> B2B Batch Settlement</h4>
              <p className="text-sm text-blue-100/80 mb-6">Settling B2B invoices via GGE-Private Rail reduces transaction costs by 85% compared to traditional banking.</p>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-6">
                 <div className="flex justify-between items-center text-xs mb-2">
                   <span className="opacity-70 font-medium">Daily Settlement Limit</span>
                   <span className="font-bold">$25,000.00</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/10 rounded-full">
                   <div className="h-full bg-blue-400 rounded-full" style={{ width: '45%' }} />
                 </div>
              </div>
              <button className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-black shadow-lg shadow-blue-900/30 transition-all">INITIATE BULK SETTLEMENT</button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-4">
                 <Shield size={18} className="text-emerald-600" />
                 <h4 className="font-bold text-slate-800">SINC Traceability Sync</h4>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">
                 All B2B transactions are automatically logged to your Metrc account via the SINC Integrator API. No manual entry required for tax-compliant purchase logs.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Reload Modal (Cash Simulation) */}
      {showReloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-[#0f2d1e] text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <ArrowUpCircle size={24} className="text-emerald-400" /> Cash Reload Center
              </h3>
              <p className="text-emerald-300/70 text-xs mt-1 font-semibold uppercase tracking-wider">Compassion Balance Integrity</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Select Reload Amount</label>
                <div className="grid grid-cols-3 gap-3">
                  {['50', '100', '250'].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setReloadAmount(amt)}
                      className={cn(
                        "py-3 rounded-xl font-black transition-all border-2",
                        reloadAmount === amt ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                      )}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Verified GGP Kiosk Nearby</p>
                    <p className="text-xs text-emerald-600/80">QuikTrip #441 — Memorial (0.8 mi)</p>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-700/60 font-medium leading-relaxed italic">
                  Present your digital ID or phone number to the kiosk or staff. Hand over cash to replenish your Compassion Balance instantly.
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    alert('Simulated Cash Deposit Confirmed. Balance Updated.');
                    setShowReloadModal(false);
                  }}
                  className="w-full py-4 bg-[#1a4731] text-white rounded-2xl font-black shadow-lg shadow-emerald-900/20 hover:bg-[#153a28] transition-all"
                >
                  CONFIRM CASH RECEIVED
                </button>
                <button 
                  onClick={() => setShowReloadModal(false)}
                  className="w-full py-3 bg-white text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black flex items-center justify-center gap-2">
                <Shield size={10} /> System Enforced by Larry C.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'b2b' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">Charge Patient Wallet</h3>
            <p className="text-sm text-slate-500 mb-4">Verify patient identity, then deduct from their Compassion Balance.</p>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-2">
                <p className="text-xs font-bold text-blue-800 mb-1">Patient Verification Order</p>
                <p className="text-[10px] text-blue-700">1) Phone Number → 2) Medical Card ID → 3) Email on File</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">1. Phone Number (Primary Lookup)</label>
                <input type="tel" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="(405) 555-0199" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">2. Medical Card ID (Secondary)</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="OMMA-XXXX-XXXX" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">3. Email on File (Fallback)</label>
                <input type="email" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="patient@email.com" />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-600 mb-1 block">Amount to Charge ($)</label>
                <input type="number" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="0.00" />
              </div>
              <button onClick={() => alert('Patient identity verified. Transaction successfully deducted from Care Wallet.')} className="w-full bg-[#1a4731] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#153a28]">
                Verify & Charge Patient
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">B2B Vendor Transactions</h3>
            <p className="text-sm text-slate-500 mb-4">Initiate bulk transfers or settle wholesale invoices via GGE Settlement Network.</p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <button onClick={() => alert('Add New Vendor\n\nEnter vendor details:\n1. Business Name & License #\n2. Metrc Facility Tag\n3. Payment Terms (Net-15, Net-30, COD)\n4. Settlement Method (Care Wallet, ACH, Wire)\n\nOnce approved, vendor will appear in your B2B directory.')} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">
                  + Add New Vendor
                </button>
                <button onClick={() => alert('Bulk Transaction initiated via Settlement Network.')} className="flex-1 bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200">
                  Initiate Bulk Tx
                </button>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <label className="text-xs font-bold text-slate-600 mb-1 block">Select Vendor</label>
                <select className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500">
                  <option>Select a verified vendor...</option>
                  <option>Green Leaf Wholesale (VND-882)</option>
                  <option>Nature's Extractors (VND-193)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Invoice Amount ($)</label>
                <input type="number" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-emerald-500" placeholder="0.00" />
              </div>
              <button onClick={() => alert('B2B Settlement executed successfully.')} className="w-full bg-[#1a4731] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#153a28]">
                Pay Vendor Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'general_tx' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800">General Business Transactions</h3>
              <p className="text-xs text-slate-500">Non-wallet transactions: cash, card, bank transfers, and vendor payments</p>
            </div>
            <button onClick={() => alert('Full transaction history exported to CSV.')} className="text-sm text-[#1a4731] font-bold hover:underline">Export All</button>
          </div>
          <div className="space-y-3">
            {[
              { id: 101, type: 'revenue', desc: 'POS Sale — Walk-in Customer #4821', amount: 127.50, date: '1 hour ago', method: 'Cash', ref: 'POS-4821' },
              { id: 102, type: 'revenue', desc: 'POS Sale — Online Order #1092', amount: 89.00, date: '3 hours ago', method: 'Card (Visa)', ref: 'POS-1092' },
              { id: 103, type: 'expense', desc: 'Vendor Payment — Green Leaf Wholesale', amount: -2400.00, date: 'Yesterday', method: 'Bank Transfer', ref: 'VND-882' },
              { id: 104, type: 'revenue', desc: 'POS Sale — Medical Patient (Care Wallet)', amount: 45.00, date: 'Yesterday', method: 'Care Wallet', ref: 'CW-9921' },
              { id: 105, type: 'expense', desc: 'OMMA License Renewal Fee', amount: -2500.00, date: '3 days ago', method: 'Bank Transfer', ref: 'OMMA-2026' },
              { id: 106, type: 'revenue', desc: 'Catering Order — Event Supply', amount: 1800.00, date: '5 days ago', method: 'Invoice', ref: 'INV-0042' },
            ].map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    tx.type === 'revenue' ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-500"
                  )}>
                    {tx.type === 'revenue' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{tx.desc}</p>
                    <p className="text-xs text-slate-500">{tx.method} • Ref: {tx.ref} • {tx.date}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-bold text-sm",
                  tx.amount > 0 ? "text-emerald-600" : "text-slate-800"
                )}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue (30d)</p>
                <p className="text-2xl font-black text-emerald-600">$24,891.50</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses (30d)</p>
                <p className="text-2xl font-black text-red-600">-$8,420.00</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net</p>
                <p className="text-2xl font-black text-slate-800">$16,471.50</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Compassion Allocation Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-blue-900 bg-gradient-to-br from-blue-900 to-slate-900 text-white text-center">
              <h3 className="text-xl font-black text-blue-300 flex items-center justify-center gap-2 uppercase tracking-tighter">
                <TrendingUp size={24} /> Compassion Allocation
              </h3>
            </div>
            <div className="p-8 space-y-6 text-center">
              <p className="text-sm font-medium text-slate-600">Your GGE Compassion Allocation is currently managed by Larry Compliance Division.</p>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-2xl font-black text-blue-800">${(lineOfCredit - utilizedCredit).toLocaleString()}</p>
                <p className="text-[10px] uppercase font-bold text-blue-500 tracking-widest mt-1">Available Allocation</p>
              </div>
              <button 
                onClick={() => {
                  alert('Requesting allocation increase via Larry Compliance Division...');
                  setShowCreditModal(false);
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all"
              >
                REQUEST INCREASE
              </button>
              <button 
                onClick={() => setShowCreditModal(false)}
                className="w-full text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* NomadCash Disposable Card Modal */}
      {showDisposableCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center">
              <h3 className="text-xl font-black text-[#D4AF77] flex items-center justify-center gap-2 uppercase tracking-tighter">
                <Zap size={24} /> GGE Disposable™
              </h3>
              <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest">Disposable Virtual Card</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-slate-100 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <CreditCard size={32} className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase">Ready to Generate</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3 text-amber-800 mb-1">
                  <Clock size={16} />
                  <span className="text-xs font-bold">Expires in 15 Minutes</span>
                </div>
                <p className="text-[9px] text-amber-700/70 leading-relaxed">
                  Generate a one-time use virtual card for a secure transaction. The card will automatically terminate after purchase or 15 minutes.
                </p>
              </div>

              <button 
                onClick={() => {
                  alert('GGE Disposable Card Generated: **** **** **** 9011 (Exp: 15min)');
                  setShowDisposableCard(false);
                }}
                className="w-full py-4 bg-[#1a4731] text-white rounded-2xl font-black shadow-lg shadow-emerald-900/20 hover:bg-[#153a28] transition-all"
              >
                CREATE DISPOSABLE CARD
              </button>
              
              <button 
                onClick={() => setShowDisposableCard(false)}
                className="w-full text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black flex items-center justify-center gap-2">
                <Shield size={10} /> Compliance Node: Active
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

