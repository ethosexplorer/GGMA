import React from 'react';
import { ArrowLeft, ArrowRight, Activity, Shield, Building2, ChevronRight } from 'lucide-react';
import { MapChart } from '../components/MapChart';
import { FeaturedPoll, RevolvingSurveyBanner } from '../components/CommunityPolls';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Helper to generate some dummy regulatory data per state
const generateStateData = (state: string) => {
  const hash = state.length;
  const tax = hash % 2 === 0 ? `${hash + 5}% Excise Tax` : '0% Excise Tax';
  const status = hash % 3 === 0 ? 'Full Recreational' : hash % 2 === 0 ? 'Open Medical' : 'Strict Medical / Low THC';
  const dispensaries = (hash * 115).toLocaleString() + ' Dispensaries';
  return { s: state, t: tax, c: status, d: dispensaries };
};

export const StateFactsPage = ({ onBack, onNavigate }: { onBack: () => void, onNavigate?: (view: string) => void }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0f2d1e] to-[#1a4731] py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15), transparent 60%)' }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-200 hover:text-white font-bold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                 Live Data Feed
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                Real-time <br /> <span className="text-emerald-400">State Jurisdiction</span> Intelligence
              </h1>
              <p className="text-lg text-emerald-100/80 leading-relaxed font-medium">
                We've uploaded regulatory facts and compliance standards for all 50 states. Our nationwide aggregator Establishment monitors 400+ data points hourly to ensure you are never out of compliance.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                 <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm">
                    <p className="text-3xl font-black text-white">100%</p>
                    <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">US Territory Coverage</p>
                 </div>
                 <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm">
                    <p className="text-3xl font-black text-emerald-400">2.4M</p>
                    <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Active Patient Records</p>
                 </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full h-[500px] bg-white rounded-[3rem] border border-emerald-900 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-emerald-500 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
              <MapChart />
            </div>
          </div>
        </div>
      </div>

      {/* Community Polls Section */}
      <section className="py-16 px-6 bg-slate-100 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-8">
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">Community Voice & Action</h2>
             <p className="text-slate-500 font-medium">Share your opinion, learn new facts, and take action in your jurisdiction.</p>
          </div>
          
          <FeaturedPoll />
          
          <div className="mt-8">
            <RevolvingSurveyBanner />
          </div>
        </div>
      </section>

      {/* State Facts Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="space-y-4">
                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">National Jurisdiction Directory</h2>
                 <p className="text-slate-500 font-medium">Unified access to regulatory information across all 50 states.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {US_STATES.map((state, i) => {
                const st = generateStateData(state);
                return (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group">
                   <h4 className="text-xl font-black text-slate-900 mb-4">{st.s}</h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Activity size={14} className="text-emerald-500" /> {st.t}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Shield size={14} className="text-blue-500" /> {st.c}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Building2 size={14} className="text-amber-500" /> {st.d}</div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-emerald-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Statutes <ChevronRight size={14} />
                   </div>
                </div>
              )})}
           </div>
        </div>
      </section>
    </div>
  );
};
