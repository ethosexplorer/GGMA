import React, { useState } from 'react';
import { TrendingUp, Shield, Star, Award, Zap, Target, Lock, CreditCard, Sparkles, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const c3Factors = [
  { name: 'Payment Discipline', weight: 35, score: 78, maxPts: 300, desc: 'Consistent cash reloads + responsible spending', icon: CreditCard },
  { name: 'Care Points Behavior', weight: 25, score: 82, maxPts: 212, desc: 'Compassion Points earned & redeemed responsibly', icon: Star },
  { name: 'Compliance & Larry Score', weight: 20, score: 91, maxPts: 170, desc: 'Regulatory adherence, audit readiness', icon: Shield },
  { name: 'Insurance & Risk Structure', weight: 10, score: 65, maxPts: 85, desc: 'Bonding history, claims, risk controls', icon: Lock },
  { name: 'Tenure & Ecosystem Depth', weight: 5, score: 70, maxPts: 42, desc: 'Time in platform + cross-dashboard usage', icon: Target },
  { name: 'Traditional/Alt Data', weight: 5, score: 55, maxPts: 41, desc: 'Optional credit file or alternative data', icon: Zap },
];

const c3Tiers = [
  { name: 'Bronze', range: '300–549', color: 'from-amber-700 to-amber-900', unlocks: 'Basic Care Wallet, paper trail only', credit: 'No credit line yet' },
  { name: 'Silver', range: '550–649', color: 'from-slate-400 to-slate-600', unlocks: 'Care Builder Plus, virtual card priority, +10% Care Points', credit: 'Pre-approved for $500–$2K (Phase 2)' },
  { name: 'Gold', range: '650–749', color: 'from-yellow-500 to-amber-600', unlocks: 'Care Builder Premium, insurance discounts (up to 15%)', credit: 'Pre-approved for $2K–$10K (Phase 2)' },
  { name: 'Platinum', range: '750–850', color: 'from-purple-500 to-indigo-700', unlocks: 'Full ecosystem, custom scenarios, 20-30% insurance discounts', credit: '$10K+ revolving line (Phase 2)' },
];

const careBuilderPlans = [
  { name: 'Basic', price: '$9/mo', period: '6 months', goal: '$50–$100/mo', features: ['Basic tracking & logging', 'Sylara reminders', 'Monthly progress report', 'Positive habit milestones'] },
  { name: 'Plus', price: '$19/mo', period: '12 months', goal: '$100–$250/mo', features: ['Everything in Basic +', 'Advanced AI insights', 'Larry auto-alerts', 'Quarterly reports', 'Ecosystem rewards'] },
  { name: 'Premium', price: '$29/mo', period: '12–24 months', goal: '$250+/mo', features: ['Everything in Plus +', 'Priority support', 'Scenario modeling (Sylara)', 'Exportable audit reports', 'Early access features'] },
];

export const CreditScoreTab = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const currentScore = 662;
  const currentTier = 'Gold';
  const carePointsBonus = 10; // +10% for 1000+ pts in 90 days

  return (
    <div className="space-y-6">
      {/* C³ Score Hero */}
      <div className="relative overflow-hidden bg-[#0c1f14] bg-gradient-to-br from-[#0c1f14] via-[#163829] to-[#0a2a1a] rounded-2xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 rounded-xl">
              <Award size={24} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-emerald-300/80 text-sm font-semibold uppercase tracking-wider">C³ Score</p>
              <p className="text-xs text-emerald-400/50">Cannabis Compassion Credit Score</p>
            </div>
          </div>

          <div className="flex items-end gap-6">
            <div>
              <h2 className="text-7xl font-black tracking-tight">{currentScore}</h2>
              <p className="text-emerald-300/60 text-sm mt-1">out of 850</p>
            </div>
            <div className="mb-3">
              <span className={cn("px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r text-white", 'from-yellow-500 to-amber-600')}>
                🟡 {currentTier} Tier
              </span>
              <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-semibold">
                <ChevronUp size={14} /> +12 pts this month
              </div>
            </div>
          </div>

          {/* Score Bar */}
          <div className="mt-6">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full" style={{ width: `${((currentScore - 300) / 550) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-emerald-300/40 mt-1">
              <span>300</span>
              <span>550</span>
              <span>650</span>
              <span>750</span>
              <span>850</span>
            </div>
          </div>

          {carePointsBonus > 0 && (
            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 w-fit">
              <Star size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-200 font-semibold">Care Points Bonus: +{carePointsBonus}% Compassion Premium active</span>
            </div>
          )}
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">Score Factor Breakdown</h3>
        <div className="space-y-5">
          {c3Factors.map((factor, i) => {
            const earned = Math.round((factor.score / 100) * factor.maxPts);
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <factor.icon size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{factor.name} <span className="text-slate-400 font-normal">({factor.weight}%)</span></p>
                      <p className="text-xs text-slate-500">{factor.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{earned}<span className="text-slate-400 font-normal text-xs">/{factor.maxPts}</span></p>
                    <p className="text-xs text-slate-500">{factor.score}%</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all",
                      factor.score >= 80 ? "bg-emerald-500" : factor.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* C³ Tiers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">C³ Score Tiers — What You Unlock</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {c3Tiers.map((tier) => (
            <div key={tier.name} className={cn(
              "rounded-xl border-2 p-4 transition-all",
              currentTier === tier.name ? "border-emerald-500 shadow-md" : "border-slate-200"
            )}>
              <div className={cn("inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-3 bg-gradient-to-r", tier.color)}>
                {tier.name}
              </div>
              <p className="text-xs font-bold text-slate-700 mb-1">{tier.range}</p>
              <p className="text-xs text-slate-500 mb-2">{tier.unlocks}</p>
              <p className="text-[10px] text-blue-600 font-semibold">{tier.credit}</p>
              {currentTier === tier.name && (
                <div className="mt-2 text-center py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">You are here</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Care Builder */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" /> Care Builder — Build Your Credit
            </h3>
            <p className="text-xs text-slate-500 mt-1">Turn consistent Care Wallet usage into a verifiable credit-building journey</p>
            <p className="text-xs font-bold text-amber-600 mt-2">
              * Note: At this time, we are ONLY offering credit building tools. We do not issue credit or loans.
            </p>
          </div>
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition-colors"
          >
            {showBuilder ? 'Hide Plans' : 'View Plans'}
          </button>
        </div>

        {showBuilder && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {careBuilderPlans.map((plan) => (
              <div key={plan.name} className="rounded-xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all">
                <h4 className="font-bold text-slate-900">{plan.name}</h4>
                <p className="text-2xl font-black text-emerald-700 mt-1">{plan.price}</p>
                <p className="text-xs text-slate-500">{plan.period} commitment • Goal: {plan.goal}</p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors">
                  Start Care Builder
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-800">How Care Builder Works</p>
              <p className="text-xs text-blue-700 mt-1">Set a monthly reload goal → Sylara coaches you → Larry monitors compliance → Every responsible action builds your paper trail → Future credit bureau reporting (Phase 2)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

