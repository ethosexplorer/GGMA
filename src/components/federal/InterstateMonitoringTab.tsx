import React from 'react';
import { Globe, AlertCircle, TrendingUp, Shield, Truck } from 'lucide-react';
import { cn } from '../../lib/utils';

const corridors = [
  { route: 'CA → NV', volume: 'High', risk: 'Medium', trend: '+12%', flagged: false },
  { route: 'OK → TX', volume: 'Critical', risk: 'High', trend: '+34%', flagged: true },
  { route: 'CO → KS', volume: 'Medium', risk: 'High', trend: '+28%', flagged: true },
  { route: 'OR → WA', volume: 'High', risk: 'Low', trend: '-3%', flagged: false },
  { route: 'MI → IN', volume: 'Medium', risk: 'Medium', trend: '+15%', flagged: false },
  { route: 'IL → MO', volume: 'Low', risk: 'Low', trend: '+5%', flagged: false },
];

const multiStateOps = [
  { name: 'Green Horizons Corp', states: 12, compliance: 94.1, risk: 'Low' },
  { name: 'Pacific Leaf Holdings', states: 8, compliance: 91.3, risk: 'Medium' },
  { name: 'Midwest Cannabis Group', states: 6, compliance: 87.2, risk: 'High' },
  { name: 'Atlantic Wellness Inc', states: 5, compliance: 96.7, risk: 'Low' },
];

export const InterstateMonitoringTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Tracked Corridors', value: '47', icon: Truck, color: 'bg-blue-800' },
        { label: 'Multi-State Operators', value: '312', icon: Globe, color: 'bg-indigo-800' },
        { label: 'Flagged Routes', value: '6', icon: AlertCircle, color: 'bg-red-800' },
        { label: 'Interstate Compliance', value: '91.8%', icon: Shield, color: 'bg-emerald-800' },
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
        <h3 className="text-lg font-bold text-white mb-4">🌐 Cross-State Supply Chain Corridors</h3>
        <div className="space-y-3">
          {corridors.map((c, i) => (
            <div key={i} className={cn("p-3 rounded-xl border bg-[#0a1628] flex items-center justify-between",
              c.flagged ? "border-red-800/60" : "border-[#1e3a5f]/40"
            )}>
              <div className="flex items-center gap-3">
                {c.flagged && <AlertCircle size={14} className="text-red-400" />}
                <span className="text-sm font-bold text-white">{c.route}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                  c.risk === 'High' ? "bg-red-900/60 text-red-300" :
                  c.risk === 'Medium' ? "bg-amber-900/60 text-amber-300" : "bg-emerald-900/60 text-emerald-300"
                )}>{c.risk} Risk</span>
                <span className="text-xs text-blue-300/60 font-mono">{c.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Multi-State Operator Tracking</h3>
        <div className="space-y-3">
          {multiStateOps.map((o, i) => (
            <div key={i} className="p-3 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-white">{o.name}</span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                  o.risk === 'High' ? "bg-red-900/60 text-red-300" :
                  o.risk === 'Medium' ? "bg-amber-900/60 text-amber-300" : "bg-emerald-900/60 text-emerald-300"
                )}>{o.risk}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-blue-300/60">
                <span>{o.states} states</span>
                <span>Compliance: {o.compliance}%</span>
              </div>
              <div className="h-1.5 bg-[#0a1628] rounded-full overflow-hidden mt-2 border border-[#1e3a5f]/20">
                <div className={cn("h-full rounded-full", o.compliance > 95 ? "bg-emerald-500" : o.compliance > 90 ? "bg-blue-500" : "bg-amber-500")}
                  style={{ width: `${o.compliance}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
