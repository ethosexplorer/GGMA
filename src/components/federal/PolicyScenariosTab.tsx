import React, { useState } from 'react';
import { Zap, TrendingUp, Scale, Globe, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const scenarios = [
  {
    id: 1, title: 'Schedule III Reclassification',
    desc: 'Model the impact of moving cannabis from Schedule I to Schedule III under the CSA.',
    results: [
      { metric: 'Interstate Commerce', impact: '+340% volume', direction: 'up' },
      { metric: 'State Compliance Rates', impact: '-11% avg drop', direction: 'down' },
      { metric: 'Tax Revenue', impact: '+$4.2B annually', direction: 'up' },
      { metric: 'Enforcement Workload', impact: '+28% (transition)', direction: 'up' },
      { metric: 'Research Programs', impact: '+180% growth', direction: 'up' },
    ]
  },
  {
    id: 2, title: 'Interstate Commerce Clarification',
    desc: 'What happens if federal rules explicitly allow cross-state cannabis transport?',
    results: [
      { metric: 'Compliance Rate (9 states)', impact: '+11-18% improvement', direction: 'up' },
      { metric: 'Diversion Risk (3 states)', impact: '+22% increase', direction: 'down' },
      { metric: 'Multi-State Operators', impact: '+67% growth', direction: 'up' },
      { metric: 'Supply Chain Efficiency', impact: '+41% improvement', direction: 'up' },
    ]
  },
  {
    id: 3, title: 'Federal Banking Access (SAFE Act)',
    desc: 'Impact of full federal banking access for cannabis businesses.',
    results: [
      { metric: 'Banking Compliance', impact: '+34% improvement', direction: 'up' },
      { metric: 'Cash Diversion Risk', impact: '-62% reduction', direction: 'up' },
      { metric: 'Tax Collection Efficiency', impact: '+28% improvement', direction: 'up' },
      { metric: 'Investment Volume', impact: '+$12B annually', direction: 'up' },
    ]
  },
];

export const PolicyScenariosTab = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const active = scenarios[activeScenario];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((s, i) => (
          <button key={s.id} onClick={() => setActiveScenario(i)}
            className={cn("p-5 rounded-2xl border text-left transition-all",
              activeScenario === i ? "bg-blue-900/40 border-blue-500/60" : "bg-[#0f1b2d] border-[#1e3a5f]/60 hover:border-blue-700/40"
            )}>
            <div className={cn("p-2 rounded-xl text-white w-fit mb-3", activeScenario === i ? "bg-blue-600" : "bg-blue-900")}><Zap size={18} /></div>
            <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
            <p className="text-xs text-blue-300/60 leading-relaxed">{s.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-600 text-white"><Scale size={20} /></div>
          <div>
            <h3 className="text-lg font-bold text-white">{active.title} — Projected Impacts</h3>
            <p className="text-xs text-blue-300/50">{active.desc}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {active.results.map((r, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628] flex items-center justify-between">
              <span className="text-sm font-medium text-blue-200">{r.metric}</span>
              <span className={cn("text-sm font-extrabold", r.direction === 'up' ? "text-emerald-400" : "text-amber-400")}>{r.impact}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-blue-400/40 mt-4">Simulated results based on aggregated national data. No live data is modified during scenario modeling.</p>
      </div>

      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">National Benchmarking</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg State Compliance', value: '94.2%', benchmark: '90% target' },
            { label: 'Avg Processing Time', value: '14 days', benchmark: '21-day target' },
            { label: 'Testing Turnaround', value: '3.2 days', benchmark: '5-day target' },
            { label: 'License Renewal Rate', value: '87%', benchmark: '85% target' },
          ].map((b, i) => (
            <div key={i} className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/30 text-center">
              <p className="text-xs text-blue-300/60 font-semibold mb-1">{b.label}</p>
              <p className="text-xl font-extrabold text-white">{b.value}</p>
              <p className="text-[10px] text-emerald-400/60 mt-1">✓ {b.benchmark}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
