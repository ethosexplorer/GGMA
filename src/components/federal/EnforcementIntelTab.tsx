import React from 'react';
import { Shield, AlertCircle, TrendingUp, Activity, Eye, Target, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const riskTargets = [
  { name: 'Midwest Cannabis Group', score: 87, states: 'MI, OH, IN', reason: 'Traceability breaks + volume anomaly', status: 'Active' },
  { name: 'Desert Sun LLC', score: 82, states: 'AZ, NV', reason: 'License shopping pattern detected', status: 'Active' },
  { name: 'Green River Distro', score: 76, states: 'OK, TX, AR', reason: 'Coordinated Recency Index spikes', status: 'Monitoring' },
  { name: 'Pacific Edge Corp', score: 71, states: 'CA, OR', reason: 'SAM.gov debarment flag + compliance drop', status: 'Monitoring' },
  { name: 'Baystate Holdings', score: 68, states: 'MA, CT, NY', reason: 'Unusual cross-state shipment pattern', status: 'Reviewing' },
];

const larryAlerts = [
  { type: 'Diversion', msg: 'OK→TX corridor: 87% probability of coordinated diversion network', confidence: 94, time: '12m ago' },
  { type: 'Anomaly', msg: 'CA rapid test positivity rate spike — 3 counties above threshold', confidence: 88, time: '1h ago' },
  { type: 'Pattern', msg: 'License shopping detected: 4 entities, 3 states, same beneficial owner', confidence: 91, time: '2h ago' },
  { type: 'Forecast', msg: 'Northeast: predicted 34% increase in high Recency Index events next 30 days', confidence: 79, time: '3h ago' },
  { type: 'SAM.gov', msg: 'Operator #4421 matched federal debarment list — $2.4M HHS grant active', confidence: 99, time: '4h ago' },
];

export const EnforcementIntelTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'National Risk Score', value: '34/100', icon: Shield, color: 'bg-emerald-800' },
        { label: 'Active Larry Flags', value: '19', icon: AlertCircle, color: 'bg-red-800' },
        { label: 'Diversion Networks', value: '3', icon: Target, color: 'bg-amber-800' },
        { label: 'Predictions (30-day)', value: '47', icon: Zap, color: 'bg-purple-800' },
      ].map((s, i) => (
        <div key={i} className="bg-[#0f1b2d] p-5 rounded-2xl border border-[#1e3a5f]/60">
          <div className={cn("p-2 rounded-xl text-white w-fit mb-3", s.color)}><s.icon size={18} /></div>
          <p className="text-xs text-blue-300/70 font-semibold uppercase tracking-wider">{s.label}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">{s.value}</h3>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Larry Intelligence Feed */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <img src="/larry-logo.png" alt="Larry" className="w-6 h-6 rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          Larry National Intelligence Feed
        </h3>
        <p className="text-xs text-blue-300/50 mb-4">Real-time AI compliance & enforcement intelligence</p>
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {larryAlerts.map((a, i) => (
            <div key={i} className="p-3 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628]">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                  a.type === 'Diversion' ? "bg-red-900/60 text-red-300" :
                  a.type === 'Anomaly' ? "bg-amber-900/60 text-amber-300" :
                  a.type === 'SAM.gov' ? "bg-purple-900/60 text-purple-300" : "bg-blue-900/60 text-blue-300"
                )}>{a.type}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{a.confidence}% confidence</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">{a.msg}</p>
              <p className="text-[10px] text-blue-400/40 mt-1 font-mono">{a.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Targets */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target size={18} className="text-amber-400" /> Priority Risk Targets
        </h3>
        <div className="space-y-3">
          {riskTargets.map((t, i) => (
            <div key={i} className="p-3 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-bold text-white">{t.name}</span>
                  <p className="text-[10px] text-blue-300/50 mt-0.5">{t.states}</p>
                </div>
                <div className="text-right">
                  <span className={cn("text-lg font-extrabold", t.score > 80 ? "text-red-400" : t.score > 70 ? "text-amber-400" : "text-blue-400")}>{t.score}</span>
                  <p className="text-[9px] text-blue-400/40">RISK SCORE</p>
                </div>
              </div>
              <p className="text-xs text-blue-300/60">{t.reason}</p>
              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-2 inline-block",
                t.status === 'Active' ? "bg-red-900/60 text-red-300" : t.status === 'Monitoring' ? "bg-amber-900/60 text-amber-300" : "bg-blue-900/60 text-blue-300"
              )}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Larry Predictive Loop */}
    <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Larry Enforcement Intelligence Loop</h3>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {['Aggregate', 'Predict', 'Model', 'Prioritize', 'Coordinate', 'Report'].map((step, i) => (
          <React.Fragment key={i}>
            <div className="bg-blue-900/40 text-blue-200 px-4 py-2 rounded-xl text-sm font-bold border border-blue-800/40">{step}</div>
            {i < 5 && <span className="text-blue-400/40 font-bold">→</span>}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-blue-300/50 text-center mt-4">Larry never issues enforcement actions — it only provides visibility and intelligence. States and locals retain full authority.</p>
    </div>
  </div>
);
