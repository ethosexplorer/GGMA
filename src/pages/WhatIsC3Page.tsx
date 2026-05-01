import React, { useEffect } from 'react';
import { ArrowLeft, CircleCheck, Star, Check, User, Building2 } from 'lucide-react';

export const WhatIsC3Page = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate('landing')}>
          <ArrowLeft size={20} className="text-slate-500" />
          <img src="/gghp-logo.png" alt="GGHP Logo" className="h-12 w-auto object-contain" />
        </div>
        <button onClick={() => onNavigate('landing')} className="text-sm font-bold text-slate-600 hover:text-emerald-600">
          Back to Home
        </button>
      </nav>

      {/* C3 Hero Section */}
      <section className="py-24 px-6 bg-slate-900 bg-gradient-to-br from-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border-r border-b border-white/20"></div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest">
              ✨ The Industry's First Cannabis Credit Bureau
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
              What is <span className="text-emerald-400">C³</span>?
            </h1>
            <p className="text-xl text-emerald-50/80 leading-relaxed font-medium">
              C³ stands for **Compassion, Compliance & Community** — the industry's first <strong className="text-emerald-400">Cannabis Credit Bureau</strong>. Like a FICO score for cannabis, C³ is our proprietary real-time trust metric that quantifies ethical participation, regulatory adherence, and community impact across the entire Global Green ecosystem.
            </p>
            <div className="space-y-6">
              {[
                { t: 'Compassion', d: 'Rewards accessible patient care and social equity participation.' },
                { t: 'Compliance', d: 'Verifies real-time adherence to Metrc and state statutes via L.A.R.R.Y.' },
                { t: 'Community', d: 'Measures engagement with our educational and operational support hubs.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 font-black text-emerald-400">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{item.t}</h4>
                    <p className="text-emerald-100/60 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full aspect-square bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center relative group">
            <div className="absolute inset-0 bg-emerald-400/20 blur-[100px] rounded-full scale-50 group-hover:scale-75 transition-transform duration-1000 opacity-50"></div>
            <div className="text-8xl font-black text-emerald-400 mb-4 tracking-tighter relative">C³</div>
            <div className="text-2xl font-bold text-white mb-2 relative">Score Verification Active</div>
            <p className="text-emerald-100/40 text-sm mb-8 relative">Integrated across all GGMA, RIP, and SINC sectors</p>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 relative w-full"
            >
              Sign Up & Get Your Score
            </button>
          </div>
        </div>
      </section>

      {/* C³ Score Deep Dive — What it does for YOU */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 rounded-full border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
              ✨ C³ Score Explained
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              How C³ <span className="text-emerald-600">Works For You</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Your C³ Score is a living, real-time trust rating that measures Compassion, Compliance & Community across every interaction in the Global Green ecosystem. The higher your score, the more benefits you unlock.
            </p>
          </div>

          {/* How It's Calculated */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                score: 'Compassion', 
                emoji: '💚', 
                weight: '33%',
                color: 'from-teal-500 to-emerald-600',
                items: [
                  'Patient accessibility & social equity participation',
                  'Affordable pricing initiatives for underserved communities',
                  'Caregiver engagement & support network involvement',
                  'Charitable contributions & community health programs'
                ]
              },
              { 
                score: 'Compliance', 
                emoji: '🛡️', 
                weight: '34%',
                color: 'from-blue-500 to-indigo-600',
                items: [
                  'Real-time Metrc & seed-to-sale adherence',
                  'OMMA license status & renewal tracking',
                  'L.A.R.R.Y AI audit pass rates',
                  'Zero violations, zero diversions verified'
                ]
              },
              { 
                score: 'Community', 
                emoji: '🤝', 
                weight: '33%',
                color: 'from-purple-500 to-violet-600',
                items: [
                  'Platform engagement & educational course completion',
                  'Peer referrals & network growth',
                  'Community forum participation & feedback',
                  'Support ticket response quality & transparency'
                ]
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                  {pillar.emoji}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1">{pillar.score}</h3>
                <p className="text-emerald-600 text-xs font-bold mb-4 uppercase tracking-widest">{pillar.weight} of total score</p>
                <ul className="space-y-2.5">
                  {pillar.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CircleCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Benefits by Tier */}
          <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-10 mb-16">
            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">Benefits by C³ Score Tier</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { tier: 'Bronze', range: '0-249', color: 'bg-amber-700', benefits: ['Basic platform access', 'Standard support', 'Community forums'] },
                { tier: 'Silver', range: '250-499', color: 'bg-slate-400', benefits: ['Priority support queue', 'Monthly compliance reports', '5% add-on discounts'] },
                { tier: 'Gold', range: '500-749', color: 'bg-amber-500', benefits: ['Dedicated account manager', 'Quarterly strategy review', '15% off renewals', 'Early feature access'] },
                { tier: 'Platinum', range: '750-1000', color: 'bg-emerald-600', benefits: ['White-glove onboarding', 'Custom API integrations', '25% lifetime discount', 'Advisory board invitation', 'Featured partner listing'] }
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                  <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <Star size={18} className="text-white" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-1">{t.tier}</h4>
                  <p className="text-xs text-emerald-600 font-bold mb-4">{t.range} points</p>
                  <ul className="space-y-2">
                    {t.benefits.map((b, j) => (
                      <li key={j} className="text-xs text-slate-600 flex items-start gap-2">
                        <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Who it helps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50 rounded-[2rem] border border-emerald-200 p-8">
              <h3 className="text-xl font-black text-emerald-900 mb-4 flex items-center gap-2"><User size={20} /> For Patients</h3>
              <ul className="space-y-3 text-sm text-emerald-800">
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Track your compliance journey — card renewals, physician visits, and care milestones</li>
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Earn rewards for staying compliant and engaging with educational resources</li>
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Higher scores unlock discounts at participating dispensaries</li>
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Build a verified patient trust profile visible to your care team</li>
              </ul>
            </div>
            <div className="bg-slate-900 rounded-[2rem] border border-slate-700 p-8 text-white">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Building2 size={20} /> For Businesses</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Demonstrate audit readiness to OMMA and state regulators in real-time</li>
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Reduce compliance violations and avoid costly fines with AI-driven monitoring</li>
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Attract investors and partners with a verified, transparent trust score</li>
                <li className="flex items-start gap-2"><CircleCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Qualify for reduced insurance premiums and preferred vendor listings</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <button onClick={() => onNavigate('signup')} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/30">
              Join the Ecosystem & Track Your C³ Score
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
