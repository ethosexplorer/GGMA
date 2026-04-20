import React from 'react';
import { Activity, Users, Shield, Beaker, Heart, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ResearchHealthTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Research Programs', value: '1,247', icon: Beaker, color: 'bg-cyan-800' },
        { label: 'Patient Outcomes Tracked', value: '2.1M', icon: Heart, color: 'bg-pink-800' },
        { label: 'Lab Tests (National)', value: '847K', icon: Activity, color: 'bg-blue-800' },
        { label: 'Provider Reports', value: '12,480', icon: Users, color: 'bg-emerald-800' },
      ].map((s, i) => (
        <div key={i} className="bg-[#0f1b2d] p-5 rounded-2xl border border-[#1e3a5f]/60">
          <div className={cn("p-2 rounded-xl text-white w-fit mb-3", s.color)}><s.icon size={18} /></div>
          <p className="text-xs text-blue-300/70 font-semibold uppercase tracking-wider">{s.label}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{s.value}</h3>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Anonymized National Health Trends</h3>
        <div className="space-y-4">
          {[
            { condition: 'Chronic Pain', patients: '412K', trend: '+8%', efficacy: '78%' },
            { condition: 'PTSD', patients: '189K', trend: '+14%', efficacy: '72%' },
            { condition: 'Epilepsy', patients: '67K', trend: '+5%', efficacy: '84%' },
            { condition: 'Anxiety', patients: '298K', trend: '+22%', efficacy: '69%' },
            { condition: 'Cancer Support', patients: '94K', trend: '+11%', efficacy: '76%' },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628]">
              <span className="text-sm font-bold text-white">{c.condition}</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-blue-300/60">{c.patients} patients</span>
                <span className="text-emerald-400 font-bold">{c.trend}</span>
                <span className="text-blue-200 font-bold">{c.efficacy} efficacy</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-blue-400/40 mt-4">All data anonymized and aggregated at national level. No individual patient data exposed.</p>
      </div>
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Lab Testing & Safety Trends</h3>
        <div className="space-y-4">
          {[
            { test: 'Potency Verification', pass: 96.2, volume: '234K' },
            { test: 'Pesticide Screening', pass: 98.1, volume: '198K' },
            { test: 'Heavy Metals', pass: 99.3, volume: '187K' },
            { test: 'Microbial Contamination', pass: 97.8, volume: '201K' },
            { test: 'Residual Solvents', pass: 98.9, volume: '176K' },
          ].map((t, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">{t.test}</span>
                <span className="text-white font-bold">{t.pass}% pass</span>
              </div>
              <div className="h-1.5 bg-[#0a1628] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${t.pass}%` }}></div>
              </div>
              <p className="text-[10px] text-blue-400/40">{t.volume} tests this quarter</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
      <h3 className="text-lg font-bold text-white mb-2">Rapid Testing — Dual-Channel Recency Index</h3>
      <p className="text-xs text-blue-300/50 mb-4">R = [Δ9-THC] / ([11-OH-THC] + [THCCOOH] + ε) — National aggregated trend</p>
      <div className="grid grid-cols-3 gap-4">
        {[
          { region: 'West Coast', index: 0.42, trend: '-3%' },
          { region: 'Midwest', index: 0.58, trend: '+12%' },
          { region: 'Northeast', index: 0.51, trend: '+34%' },
        ].map((r, i) => (
          <div key={i} className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/30 text-center">
            <p className="text-xs text-blue-300/60 font-semibold mb-1">{r.region}</p>
            <p className="text-2xl font-extrabold text-white">{r.index}</p>
            <p className={cn("text-xs font-bold mt-1", r.trend.startsWith('+') ? "text-amber-400" : "text-emerald-400")}>{r.trend}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
