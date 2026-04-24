import React, { useState } from 'react';
import { Sparkles, Send, Globe, TrendingUp, Shield, FileText, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const sampleInsights = [
  { type: 'Forecast', msg: 'National compliance predicted to hold at 94.2% through Q2. Three states (OK, MI, FL) show elevated risk of decline based on Recency Index trends.', time: 'Today' },
  { type: 'Alert', msg: 'Director — 19 new interstate illicit activity alerts this week. Briefing pack ready for review.', time: 'Today' },
  { type: 'Policy', msg: 'Schedule III modeling complete: projected +$4.2B annual tax revenue, +340% interstate commerce volume, but 11% avg compliance rate drop during transition.', time: 'Yesterday' },
  { type: 'Optimization', msg: 'Recommended reallocation of enforcement focus: shift 15% of resources from West Coast to Midwest corridor based on emerging diversion patterns.', time: 'Yesterday' },
];

const sampleQueries = [
  'What are the top national diversion risks this quarter?',
  'Model the tax impact of Schedule III implementation',
  'Which states show highest Recency Index volatility?',
  'Generate congressional briefing for Q1 2026',
];

export const SylaraFederalTab = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Sylara Header */}
      <div className="bg-[#0f1b2d] bg-gradient-to-r from-[#0f1b2d] via-[#1a2d4a] to-[#0f1b2d] rounded-2xl border border-blue-500/30 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5"><Sparkles size={200} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white"><Sparkles size={20} /></div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Sylara AI — Federal Intelligence Co-Pilot</h3>
              <p className="text-xs text-blue-300/60">National strategic intelligence • Policy guidance • Predictive analytics</p>
            </div>
          </div>
          <p className="text-sm text-blue-200/70 mt-3 max-w-3xl">Sylara for Federal serves as your national strategic intelligence co-pilot — helping agencies navigate the complex federal-state cannabis landscape with predictive forecasting, policy scenario modeling, and cross-jurisdictional risk mapping.</p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h4 className="text-sm font-bold text-blue-200 mb-3">Natural Language Federal Assistant</h4>
        <div className="relative">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Ask Sylara: 'What are the top national diversion risks this quarter?'"
            className="w-full bg-[#0a1628] border border-[#1e3a5f]/60 text-white placeholder:text-blue-400/30 text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500/60 transition-all" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"><Send size={18} /></button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {sampleQueries.map((q, i) => (
            <button key={i} onClick={() => setQuery(q)}
              className="text-[10px] font-bold text-blue-300/60 bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-800/30 hover:bg-blue-800/40 transition-colors">{q}</button>
          ))}
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, title: 'Predictive Trend Forecasting', desc: 'Analyzes aggregated data to predict compliance shifts, market trends, diversion risks, and economic impacts nationally.' },
          { icon: Zap, title: 'Policy Scenario Modeling', desc: 'Simulates outcomes of federal actions — rescheduling effects on interstate commerce, research, and tax revenue.' },
          { icon: Globe, title: 'Cross-Jurisdictional Risk Mapping', desc: 'Identifies federal concerns like interstate diversion or scheduling conflicts using anonymized state-level data.' },
          { icon: Shield, title: 'Resource Optimization', desc: 'Recommends federal priority areas for investigations or coordination with state partners.' },
          { icon: FileText, title: 'Audit-Ready Summaries', desc: 'Generates explainable reports with transparent data sources for congressional or inter-agency use.' },
          { icon: Sparkles, title: 'Larry Integration', desc: 'Sylara insights feed directly into Larry monitoring — creating a closed federal oversight loop.' },
        ].map((c, i) => (
          <div key={i} className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-5">
            <div className="p-2 rounded-xl bg-blue-900 text-blue-300 w-fit mb-3"><c.icon size={18} /></div>
            <h4 className="text-sm font-bold text-white mb-1">{c.title}</h4>
            <p className="text-xs text-blue-300/50 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Intelligence Feed */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Latest Sylara Intelligence</h3>
        <div className="space-y-3">
          {sampleInsights.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628]">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                  s.type === 'Forecast' ? "bg-blue-900/60 text-blue-300" :
                  s.type === 'Alert' ? "bg-red-900/60 text-red-300" :
                  s.type === 'Policy' ? "bg-purple-900/60 text-purple-300" : "bg-emerald-900/60 text-emerald-300"
                )}>{s.type}</span>
                <span className="text-[10px] text-blue-400/40 font-mono">{s.time}</span>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">{s.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

