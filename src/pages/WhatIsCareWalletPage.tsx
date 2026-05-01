import React, { useEffect } from 'react';
import { ArrowLeft, Wallet, HeartHandshake, Gift, ShieldCheck, ArrowRight, Activity, Coins, Heart } from 'lucide-react';

export const WhatIsCareWalletPage = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <ArrowLeft size={18} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
          </div>
          <span className="font-bold text-slate-700 group-hover:text-blue-700">Back to Home</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"><Wallet size={12} className="text-blue-600"/></div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center"><Heart size={12} className="text-emerald-600"/></div>
          </div>
          <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Care OS</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(to bottom right, #172554, #0f172a, #1e1b4b)' }} className="py-24 px-6 relative overflow-hidden text-white">
        {/* Abstract Background Elements */}
        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }} className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }} className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <HeartHandshake size={14} /> Introduced by the Compassion Network
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
              The <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'linear-gradient(to right, #60a5fa, #818cf8)' }}>Care Wallet</span>
            </h1>
            <p className="text-xl text-blue-50/80 leading-relaxed font-medium">
              More than just a payment method. The Care Wallet is your unified health currency—seamlessly connecting your medical cannabis journey, rewarding your compliance, and directly boosting your C³ Score.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => onNavigate('signup')}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
              >
                Open Your Wallet <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }} className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-[2.5rem] border border-white/20 backdrop-blur-2xl p-8 shadow-2xl flex flex-col justify-between overflow-hidden group">
              {/* Card Shine Effect */}
              <div style={{ background: 'linear-gradient(to top right, transparent, rgba(255,255,255,0.05), transparent)' }} className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <Wallet size={32} className="text-blue-400" />
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className="px-3 py-1 rounded-full border border-white/10 text-xs font-bold tracking-wide">
                  Virtual Card
                </div>
              </div>
              
              <div className="relative z-10 mt-12">
                <p style={{ color: 'rgba(191,219,254,0.7)' }} className="text-sm font-medium mb-1">Total Care Balance</p>
                <div className="text-5xl font-black tracking-tighter text-white">$420.50</div>
                <div style={{ backgroundColor: 'rgba(52,211,153,0.1)' }} className="flex items-center gap-2 mt-4 text-sm font-bold text-emerald-400 w-fit px-3 py-1.5 rounded-lg border border-emerald-400/20">
                  <Coins size={14} /> +1,250 Care Points Earned
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works & Benefits */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Every dollar loaded and spent through the Care Wallet works double-time to secure your compliance and reward your loyalty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Wallet size={24} className="text-blue-600" />,
              bg: 'bg-blue-50 border-blue-100',
              title: 'Load & Spend Securely',
              desc: 'Add funds securely from your bank account. Use your Care Wallet balance to pay for state fees, physician consultations, telehealth visits, and at participating dispensaries.'
            },
            {
              icon: <Gift size={24} className="text-purple-600" />,
              bg: 'bg-purple-50 border-purple-100',
              title: 'Accumulate Free Points',
              desc: 'Every transaction earns you Care Points. Redeem these points for free telehealth sessions, discounted legal intake fees, or complimentary medical card renewals.'
            },
            {
              icon: <ShieldCheck size={24} className="text-emerald-600" />,
              bg: 'bg-emerald-50 border-emerald-100',
              title: 'Build Your C³ Score',
              desc: 'The Compassion Network tracks your positive wallet history. Consistent, compliant use of your Care Wallet directly increases your global C³ Trust Score.'
            }
          ].map((feature, idx) => (
            <div key={idx} className={`p-8 rounded-[2rem] border ${feature.bg} hover:-translate-y-1 transition-transform duration-300`}>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Ecosystem Connection */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="aspect-square bg-slate-50 rounded-full border-8 border-white shadow-2xl flex items-center justify-center relative">
              <div className="absolute inset-0 border border-slate-200 rounded-full m-4 border-dashed"></div>
              
              {/* Center */}
              <div className="w-32 h-32 bg-blue-600 rounded-full text-white flex flex-col items-center justify-center shadow-xl shadow-blue-600/30 z-10 relative">
                <Wallet size={32} className="mb-1" />
                <span className="font-black text-sm">Care Wallet</span>
              </div>

              {/* Orbiting Elements */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-lg flex items-center justify-center text-emerald-500">
                <Activity size={24} />
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-lg flex items-center justify-center text-purple-500">
                <Gift size={24} />
              </div>
              <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-lg flex items-center justify-center text-amber-500">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest">
              Integration & Ecosystem
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Fueling the <span className="text-indigo-600">C³ Framework</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              The Care Wallet isn't an isolated feature. It is deeply embedded into the GGHP platform. When you make a purchase at an approved dispensary or pay a physician, L.A.R.R.Y instantly logs the compliant transaction.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                { title: 'Instant Verification', desc: 'Payments automatically prove you are acting within state medical frameworks.' },
                { title: 'C³ Score Amplification', desc: '35% of your C³ score is based on "Payment Discipline" tracked via this wallet.' },
                { title: 'Compassion Network Perks', desc: 'Unlock access to subsidized healthcare when your Care Points cross major thresholds.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-black text-sm">
                    {i+1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <HeartHandshake size={48} className="text-blue-300 mx-auto" />
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Ready to experience the Care Wallet?
          </h2>
          <p className="text-xl text-blue-100 font-medium">
            Join the Compassion Network today and start building your Care Points instantly upon signup.
          </p>
          <button onClick={() => onNavigate('signup')} className="px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-2xl flex items-center gap-2 mx-auto">
            Create Your Account <ArrowRight size={20} />
          </button>
        </div>
      </section>

    </div>
  );
};
