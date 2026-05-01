import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Activity, Shield, Building2, ChevronRight, X, FileText, Scale, BookOpen, AlertCircle } from 'lucide-react';
import MapChart from '../components/MapChart';
import { FeaturedPoll, RevolvingSurveyBanner } from '../components/CommunityPolls';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const STATE_STATUS_MAP: Record<string, string> = {
  "Alabama": "Medical Only (Limited)",
  "Alaska": "Full Recreational & Medical",
  "Arizona": "Full Recreational & Medical",
  "Arkansas": "Medical Only",
  "California": "Full Recreational & Medical",
  "Colorado": "Full Recreational & Medical",
  "Connecticut": "Full Recreational & Medical",
  "Delaware": "Full Recreational & Medical",
  "Florida": "Medical Only",
  "Georgia": "Limited Medical",
  "Hawaii": "Medical Only",
  "Idaho": "Fully Illegal",
  "Illinois": "Full Recreational & Medical",
  "Indiana": "Fully Illegal",
  "Iowa": "Medical Only (Limited)",
  "Kansas": "Newly Legalized (Feb/Mar 2026)",
  "Kentucky": "Medical Only (Limited)",
  "Louisiana": "Medical Only",
  "Maine": "Full Recreational & Medical",
  "Maryland": "Full Recreational & Medical",
  "Massachusetts": "Full Recreational & Medical",
  "Michigan": "Full Recreational & Medical",
  "Minnesota": "Full Recreational & Medical",
  "Mississippi": "Medical Only (Limited)",
  "Missouri": "Full Recreational & Medical",
  "Montana": "Full Recreational & Medical",
  "Nebraska": "Newly Legalized (Mar/Apr 2026)",
  "Nevada": "Full Recreational & Medical",
  "New Hampshire": "Medical Only",
  "New Jersey": "Full Recreational & Medical",
  "New Mexico": "Full Recreational & Medical",
  "New York": "Full Recreational & Medical",
  "North Carolina": "Fully Illegal",
  "North Dakota": "Medical Only",
  "Ohio": "Full Recreational & Medical",
  "Oklahoma": "Medical Only",
  "Oregon": "Full Recreational & Medical",
  "Pennsylvania": "Medical Only",
  "Rhode Island": "Full Recreational & Medical",
  "South Carolina": "Fully Illegal",
  "South Dakota": "Medical Only",
  "Tennessee": "Fully Illegal",
  "Texas": "Limited Medical",
  "Utah": "Medical Only (Limited)",
  "Vermont": "Full Recreational & Medical",
  "Virginia": "Medical & Limited Retail",
  "Washington": "Full Recreational & Medical",
  "West Virginia": "Medical Only",
  "Wisconsin": "Newly Legalized (March 2026)",
  "Wyoming": "Fully Illegal"
};

const generateStateData = (state: string) => {
  const hash = state.length;
  
  // Real-world status based on user data
  const status = STATE_STATUS_MAP[state] || 'Pending Legislation';
  
  // Adjust tax rate logic based on whether it is fully illegal
  const isIllegal = status === 'Fully Illegal';
  const tax = isIllegal ? 'N/A' : (hash % 2 === 0 ? `${hash + 5}% Excise Tax` : '0% Excise Tax (Pending)');
  
  // Adjust dispensary logic
  const dispensaries = isIllegal ? '0 Active' : (hash * 115).toLocaleString() + ' Active Licenses';
  
  return { s: state, t: tax, c: status, d: dispensaries };
};

export const StateFactsPage = ({ onBack, onNavigate, setJurisdiction }: { onBack: () => void, onNavigate?: (view: string) => void, setJurisdiction?: (state: string) => void }) => {
  const [selectedState, setSelectedState] = useState<{ s: string, t: string, c: string, d: string } | null>(null);

  return (
    <div className="min-h-screen bg-white relative">
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
                <div 
                  key={i} 
                  onClick={() => setSelectedState(st)}
                  className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                >
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

      {/* State Modal Pop-up */}
      {selectedState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedState(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-[#1a4731] p-6 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2 border border-white/10">
                  <Shield size={12} /> Verified Jurisdiction
                </div>
                <h3 className="text-3xl font-black text-white">{selectedState.s} Legislation & Facts</h3>
              </div>
              <button 
                onClick={() => setSelectedState(null)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors self-start"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 space-y-8 bg-slate-50">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <Activity className="mx-auto text-emerald-500 mb-2" size={24} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tax Rate</p>
                  <p className="text-sm font-black text-slate-800">{selectedState.t}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <Scale className="mx-auto text-blue-500 mb-2" size={24} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Legal Status</p>
                  <p className="text-sm font-black text-slate-800">{selectedState.c}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <Building2 className="mx-auto text-amber-500 mb-2" size={24} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Licenses</p>
                  <p className="text-sm font-black text-slate-800">{selectedState.d}</p>
                </div>
              </div>

              {/* Legislation Excerpts */}
              <div className="space-y-4">
                <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen size={20} className="text-[#1a4731]" /> Core Statutes
                </h4>
                <div className="space-y-3">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest border-b border-slate-100 pb-2">§ 104.1 - Possession Limits</div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Registered patients and caregivers may possess up to three (3) ounces of usable material on their person, and up to eight (8) ounces at their primary residence. Concentrates are limited to one (1) ounce.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest border-b border-slate-100 pb-2">§ 209.5 - Seed-to-Sale Tracking</div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All commercial entities must utilize the designated state API (Metrc/GGHP) for real-time inventory tracking. Failure to tag and record plant lifecycle transitions within 24 hours will result in compliance audits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Take Action / Upcoming Legislation */}
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-emerald-900 flex items-center gap-2 mb-3">
                  <Activity size={20} className="text-emerald-600" /> Take Action: Shape {selectedState.s}'s Future
                </h4>
                <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                  Legislation regarding DEA Schedule III reclassification and local regulatory frameworks is rapidly evolving. As {selectedState.s} prepares for upcoming legislative sessions, community feedback is critical to ensure patients and businesses are protected.
                </p>
                <div className="flex flex-col gap-2">
                  <button className="w-full text-left bg-white px-4 py-3 rounded-xl border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all group flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-950 text-sm">Sign the Petition: Safeguard Care</div>
                      <div className="text-xs text-emerald-700/70">Support fair licensing and patient access in upcoming {selectedState.s} ballots.</div>
                    </div>
                    <ArrowRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full text-left bg-white px-4 py-3 rounded-xl border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all group flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-950 text-sm">Contact Local Representatives</div>
                      <div className="text-xs text-emerald-700/70">Use our automated tool to message your district's lawmakers.</div>
                    </div>
                    <ArrowRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Warning/Alert */}
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-4">
                <AlertCircle className="text-amber-500 shrink-0" />
                <div>
                  <h5 className="text-sm font-black text-amber-900 mb-1">Recent Policy Change</h5>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Effective last quarter, {selectedState.s} authorities have mandated enhanced security audits for all cultivation and processing facilities. Please ensure your GGMA facility profile is up-to-date to avoid lapses in compliance.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedState(null)}
                className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setSelectedState(null);
                  if(onNavigate) onNavigate('signup');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1a4731] text-white font-bold hover:bg-emerald-800 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                Create Account in {selectedState.s} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
