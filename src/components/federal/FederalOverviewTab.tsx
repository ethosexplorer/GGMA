import React from 'react';
import { Shield, Globe, AlertCircle, TrendingUp, Activity, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

const FedStatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="bg-[#0f1b2d] p-5 rounded-2xl border border-[#1e3a5f]/60 shadow-lg">
    <div className="flex justify-between items-start mb-3">
      <div className={cn("p-2.5 rounded-xl text-white", color || "bg-blue-900")}><Icon size={18} /></div>
      {trend && (
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
          trend > 0 ? "bg-emerald-900/60 text-emerald-400" : "bg-red-900/60 text-red-400"
        )}>{trend > 0 ? '+' : ''}{trend}%</span>
      )}
    </div>
    <p className="text-xs text-blue-300/70 font-semibold uppercase tracking-wider">{label}</p>
    <h3 className="text-2xl font-extrabold text-white mt-1">{value}</h3>
  </div>
);

const alerts = [
  { state: 'Oklahoma + Texas', issue: 'Linked high Recency Index events — 87% coordinated activity probability', severity: 'Critical', time: '12m ago' },
  { state: 'California', issue: 'Traceability break detected — 14 operators flagged', severity: 'High', time: '1h ago' },
  { state: 'Colorado → Oregon', issue: 'Unusual cross-state shipment volume spike', severity: 'High', time: '2h ago' },
  { state: 'Michigan', issue: 'SAM.gov debarment match — Operator #4421', severity: 'Medium', time: '4h ago' },
  { state: 'Northeast Corridor', issue: 'Predicted 34% increase in high Recency Index events', severity: 'Medium', time: '6h ago' },
];

const recentActivity = [
  { event: 'Larry National Risk Score updated', detail: 'National compliance: 94.2%', time: '04:00 AM' },
  { event: 'SAM.gov daily sync complete', detail: '12,847 entities matched', time: '03:30 AM' },
  { event: 'Interstate anomaly detected', detail: 'OK→TX corridor flagged', time: '11:22 AM' },
  { event: 'Congressional report generated', detail: 'Q1 2026 National Summary', time: '09:15 AM' },
  { event: 'New state onboarded', detail: 'Nebraska now reporting', time: 'Yesterday' },
];

export const FederalOverviewTab = () => (
  <div className="space-y-6">
    {/* BREAKING NEWS BANNER */}
    <div className="bg-red-900 bg-gradient-to-r from-red-900/80 via-amber-900/60 to-red-900/80 p-5 rounded-2xl border border-red-500/50 shadow-lg shadow-red-900/20 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse"></div>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <AlertCircle size={12} />
              FEDERAL ALERT
            </span>
            <span className="text-amber-200 text-[10px] font-bold uppercase tracking-wider">April 23, 2026 • DOJ Final Order Issued</span>
          </div>
          <h2 className="text-xl font-extrabold text-white leading-tight mb-2">DOJ Reclassifies Marijuana to Schedule III</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed max-w-4xl">
            The U.S. Department of Justice issued a final order today to reclassify marijuana at the federal level under Section 811 of the CSA. State medical markets will experience immediate compliance and transparency impacts. 
            <strong className="text-white block mt-1">OMMA Director Adria G. Berry: "The move could strengthen OMMA's mission... bringing potential tax breaks, banking opportunities, and new DEA registration requirements."</strong>
          </p>
        </div>
        <div className="shrink-0 flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl transition-all shadow-lg uppercase tracking-widest text-center">
            View DOJ Order
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#0a1628] border border-red-500/30 text-red-100 hover:bg-[#111f36] text-xs font-black rounded-xl transition-all uppercase tracking-widest text-center">
            Assess State Impacts
          </button>
        </div>
      </div>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <FedStatCard label="Active Licenses (National)" value="48,291" trend={6} icon={Shield} color="bg-blue-800" />
      <FedStatCard label="Monthly Tax Revenue" value="$2.1B" trend={12} icon={TrendingUp} color="bg-emerald-800" />
      <FedStatCard label="National Compliance" value="94.2%" trend={2} icon={Activity} color="bg-blue-700" />
      <FedStatCard label="Open Investigations" value="127" icon={FileText} color="bg-amber-700" />
      <FedStatCard label="Rapid Test Triggers" value="1,842" trend={-8} icon={AlertCircle} color="bg-red-800" />
      <FedStatCard label="Illicit Activity Alerts" value="19" icon={Globe} color="bg-purple-800" />
    </div>

    {/* National Map Placeholder + Alerts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Interactive National Map</h3>
        <div className="bg-[#0a1628] rounded-xl h-80 flex items-center justify-center border border-[#1e3a5f]/40 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-blue-500 bg-gradient-to-br from-blue-500 to-transparent"></div>
          <div className="text-center z-10">
            <Globe size={64} className="text-blue-400/50 mx-auto mb-3" />
            <p className="text-blue-300/60 font-bold text-sm">All 50 States + DC • Real-Time</p>
            <p className="text-blue-400/40 text-xs mt-1">Color-coded compliance & risk overlay</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 mt-4">
          {['CA','CO','FL','IL','MI','NY','OH','OK','OR','WA'].map(s => (
            <div key={s} className="bg-[#0a1628] rounded-lg p-2 text-center border border-[#1e3a5f]/30">
              <span className="text-xs font-bold text-blue-300">{s}</span>
              <div className="text-[10px] text-blue-400/50 mt-0.5">{Math.floor(Math.random()*5000+1000)} lic.</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Alerts */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-400" /> Real-Time Alerts
        </h3>
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {alerts.map((a, i) => (
            <div key={i} className="p-3 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628] hover:bg-[#111f36] transition-colors">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-white">{a.state}</span>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                  a.severity === 'Critical' ? "bg-red-900/60 text-red-300" :
                  a.severity === 'High' ? "bg-amber-900/60 text-amber-300" : "bg-blue-900/60 text-blue-300"
                )}>{a.severity}</span>
              </div>
              <p className="text-xs text-blue-300/60 leading-relaxed">{a.issue}</p>
              <p className="text-[10px] text-blue-400/40 mt-1.5 font-mono">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Activity + Compliance by State */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Federal Activity Log</h3>
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1e3a5f]/20 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div>
                  <span className="text-sm text-blue-100 font-medium">{a.event}</span>
                  <p className="text-xs text-blue-300/50">{a.detail}</p>
                </div>
              </div>
              <span className="text-[10px] text-blue-400/40 font-mono shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Compliance by Top States</h3>
        <div className="space-y-3">
          {[
            { state: 'Colorado', rate: 97.1 }, { state: 'Oregon', rate: 95.8 },
            { state: 'California', rate: 93.4 }, { state: 'Michigan', rate: 92.1 },
            { state: 'Illinois', rate: 91.7 }, { state: 'Oklahoma', rate: 88.3 },
          ].map((s, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200 font-medium">{s.state}</span>
                <span className="text-white font-bold">{s.rate}%</span>
              </div>
              <div className="h-1.5 bg-[#0a1628] rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", s.rate > 95 ? "bg-emerald-500" : s.rate > 90 ? "bg-blue-500" : "bg-amber-500")}
                  style={{ width: `${s.rate}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

