import React from 'react';
import { DollarSign, TrendingUp, Building2, CreditCard, PieChart } from 'lucide-react';
import { cn } from '../../lib/utils';

export const EconomicAnalyticsTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'National Tax Revenue (Mo)', value: '$2.1B', icon: DollarSign, color: 'bg-emerald-800', trend: 12 },
        { label: 'Banking Compliance', value: '89.4%', icon: CreditCard, color: 'bg-blue-800', trend: 3 },
        { label: 'Licensed Operators', value: '48,291', icon: Building2, color: 'bg-indigo-800', trend: 6 },
        { label: 'Economic Contribution', value: '$41.2B', icon: PieChart, color: 'bg-purple-800', trend: 18 },
      ].map((s, i) => (
        <div key={i} className="bg-[#0f1b2d] p-5 rounded-2xl border border-[#1e3a5f]/60">
          <div className="flex justify-between items-start mb-3">
            <div className={cn("p-2 rounded-xl text-white", s.color)}><s.icon size={18} /></div>
            {s.trend && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-400">+{s.trend}%</span>}
          </div>
          <p className="text-xs text-blue-300/70 font-semibold uppercase tracking-wider">{s.label}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{s.value}</h3>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">State Tax Revenue Rankings</h3>
        <div className="space-y-3">
          {[
            { state: 'California', rev: '$498M', pct: 100 },
            { state: 'Colorado', rev: '$412M', pct: 83 },
            { state: 'Illinois', rev: '$389M', pct: 78 },
            { state: 'Michigan', rev: '$312M', pct: 63 },
            { state: 'Washington', rev: '$287M', pct: 58 },
            { state: 'Oregon', rev: '$201M', pct: 40 },
            { state: 'Nevada', rev: '$178M', pct: 36 },
          ].map((s, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200 font-medium">{s.state}</span>
                <span className="text-white font-bold">{s.rev}</span>
              </div>
              <div className="h-1.5 bg-[#0a1628] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${s.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Revenue & Tax Forecast (30/60/90 Day)</h3>
        <div className="space-y-4">
          {[
            { period: '30-Day', forecast: '$2.3B', confidence: '92%', trend: '+9.5%' },
            { period: '60-Day', forecast: '$4.8B', confidence: '87%', trend: '+11.2%' },
            { period: '90-Day', forecast: '$7.4B', confidence: '81%', trend: '+13.1%' },
          ].map((f, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628] flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{f.period} Forecast</p>
                <p className="text-xs text-blue-300/50">Confidence: {f.confidence}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-white">{f.forecast}</p>
                <p className="text-xs font-bold text-emerald-400">{f.trend}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-blue-400/40 mt-4">National aggregates only — no Global Green internal profit details exposed to federal view.</p>
      </div>
    </div>
  </div>
);
