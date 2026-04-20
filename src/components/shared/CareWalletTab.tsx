import React, { useState } from 'react';
import { Wallet, CreditCard, ArrowUpCircle, ArrowDownCircle, Shield, Sparkles, Clock, MapPin, TrendingUp, Star, Zap, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

const walletTiers = [
  { id: 'bronze', name: 'Bronze', price: 'Free', color: 'from-amber-700 to-amber-900', badge: '🟤', features: ['Basic Care Wallet', 'Load funds with cash', 'Spend in ecosystem', 'Basic transaction history', 'Larry silent compliance'] },
  { id: 'silver', name: 'Silver', price: '$19/mo', color: 'from-slate-400 to-slate-600', badge: '⚪', features: ['Everything in Bronze +', 'Virtual Card (NomadCash)', 'Spending limits & categories', 'Categorized tracking', 'Faster processing'] },
  { id: 'gold', name: 'Gold', price: '$49/mo', color: 'from-yellow-500 to-amber-600', badge: '🟡', features: ['Everything in Silver +', 'AI spending insights (Sylara)', 'Smart balance alerts', 'Auto-reload prompts', 'Larry proactive compliance'] },
  { id: 'platinum', name: 'Platinum', price: '$99/mo', color: 'from-purple-500 to-indigo-700', badge: '🔴', features: ['Everything in Gold +', 'Multiple virtual cards', 'Role-based usage', 'Full financial dashboard', 'Full Sylara + Larry AI'] },
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
  const [activeSection, setActiveSection] = useState<'overview' | 'tiers' | 'locations'>('overview');
  const currentTier = 'silver';
  const compassionBalance = 198.50;
  const carePoints = 742;

  return (
    <div className="space-y-6">
      {/* Balance Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f2d1e] via-[#1a4731] to-[#0d3320] rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/5 rounded-full translate-y-1/2 -translate-x-1/2" />
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
          <div className="flex gap-3 mt-6">
            <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30">
              <ArrowUpCircle size={16} /> Reload Funds
            </button>
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-sm">
              <CreditCard size={16} /> Virtual Card
            </button>
          </div>
        </div>
      </div>

      {/* Section Toggle */}
      <div className="flex bg-white rounded-xl border border-slate-200 p-1 w-max shadow-sm">
        {[
          { id: 'overview', label: 'Transactions' },
          { id: 'tiers', label: 'Wallet Tiers' },
          { id: 'locations', label: 'Reload Locations' },
        ].map((s) => (
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

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-emerald-600" />
                <h4 className="font-bold text-emerald-800">Sylara Insight</h4>
              </div>
              <p className="text-sm text-emerald-700">"Your spending is well-balanced. Consider reloading $100 this week to maintain a comfortable buffer for your upcoming telehealth visit."</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Shield size={16} className="text-emerald-600" /> Larry Compliance
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">All transactions compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">No flagged activity</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Purchase limits: OK</span>
                </div>
              </div>
            </div>

            {/* Care Points Rewards */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-6">
              <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <Star size={16} className="text-yellow-600" /> Care Points & Rewards
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                Compassion Balance is your money. <strong>Care Points</strong> are rewards you earn for responsible usage.
              </p>
              <ul className="space-y-2 mb-3">
                <li className="flex items-start gap-2 text-xs text-yellow-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  Unlock credit building features
                </li>
                <li className="flex items-start gap-2 text-xs text-yellow-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  Product & service discounts at approved partners
                </li>
                <li className="flex items-start gap-2 text-xs text-yellow-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                  Data Sharing (Opt-In): Share diagnosis data with dispensaries to help them stock what you need, and earn extra rewards. (Future Implementation)
                </li>
              </ul>
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
    </div>
  );
};
