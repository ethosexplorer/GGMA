import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Target, Zap, Search, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';

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

export const EnforcementIntelTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await turso.execute('SELECT * FROM omma_enforcement_records ORDER BY created_at DESC LIMIT 5');
        setRecentAudits(res.rows);
      } catch (err) {
        console.error('EnforcementIntelTab recent load error:', err);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = async (queryStr: string, stateCode: string) => {
    setSearchQuery(queryStr);
    if (!queryStr.trim() && stateCode === 'ALL') {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      let sql = 'SELECT * FROM omma_enforcement_records WHERE 1=1';
      const args: any[] = [];

      if (queryStr.trim()) {
        sql += ' AND (business_name LIKE ? OR dba LIKE ? OR license_number LIKE ?)';
        const likeQuery = `%${queryStr}%`;
        args.push(likeQuery, likeQuery, likeQuery);
      }

      if (stateCode !== 'ALL') {
        sql += ' AND state = ?';
        args.push(stateCode);
      }

      sql += ' LIMIT 20';
      const res = await turso.execute({ sql, args });
      setResults(res.rows);
    } catch (err) {
      console.error('National Intel Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      {/* GGMA National Regulatory Enforcement Database lookup */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e3a5f]/30 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              National Regulatory & Enforcement Ledger
            </h3>
            <p className="text-xs text-blue-300/50">
              Aggregated historical registry of license suspensions, forfeitures, and regulatory outcomes.
            </p>
          </div>
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-2.5 py-1 rounded-lg uppercase tracking-wider self-start md:self-center">
            Realtime Sync Active
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search business, DBA, or license ID..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value, stateFilter)}
              className="w-full bg-[#0a1628] border border-[#1e3a5f]/50 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none text-white transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="sm:w-48 bg-[#0a1628] rounded-xl border border-[#1e3a5f]/50 flex items-center px-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-2">State:</span>
            <select
              value={stateFilter}
              className="flex-1 bg-transparent border-none text-xs font-bold text-white outline-none cursor-pointer py-2.5"
              onChange={(e) => {
                const val = e.target.value;
                setStateFilter(val);
                handleSearch(searchQuery, val);
              }}
            >
              <option value="ALL" className="bg-[#0a1628]">All States</option>
              <option value="OK" className="bg-[#0a1628]">Oklahoma (OK)</option>
              <option value="MS" className="bg-[#0a1628]">Mississippi (MS)</option>
              <option value="CA" className="bg-[#0a1628]">California (CA)</option>
              <option value="TX" className="bg-[#0a1628]">Texas (TX)</option>
              <option value="MO" className="bg-[#0a1628]">Missouri (MO)</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8 gap-3 text-slate-400 text-xs font-bold">
              <div className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
              Querying national authority databases...
            </div>
          ) : (searchQuery.trim() || stateFilter !== 'ALL') ? (
            results.length > 0 ? (
              results.map((record) => (
                <div key={record.id} className="bg-[#0a1628]/60 border border-[#1e3a5f]/30 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 text-[9px] font-black border border-blue-900/40 uppercase tracking-wider">{record.state}</span>
                      <span className="text-xs font-black text-white">{record.business_name}</span>
                      {record.dba && <span className="text-slate-400 text-[10px] font-medium">({record.dba})</span>}
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                      <strong className="text-slate-400">Action/Reason:</strong> {record.reasons}
                    </p>
                    <div className="flex items-center gap-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>Type: {record.license_type}</span>
                      <span>License: {record.license_number}</span>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0">
                    <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                      record.status.toLowerCase().includes('active') 
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/40' 
                        : record.status.toLowerCase().includes('suspend') 
                        ? 'bg-amber-950/80 text-amber-400 border-amber-900/40' 
                        : 'bg-red-950/80 text-red-400 border-red-900/40'
                    )}>{record.status}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{record.dates_connected}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs font-semibold bg-[#0a1628]/20 rounded-xl border border-dashed border-[#1e3a5f]/40">
                No matching records found.
              </div>
            )
          ) : (
            // Default: show recent database updates
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Latest Database Audits
              </p>
              {recentAudits.map((record) => (
                <div key={record.id} className="bg-[#0a1628]/30 border border-[#1e3a5f]/20 rounded-xl p-3 flex flex-col md:flex-row justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[8px] font-black uppercase tracking-wider">{record.state}</span>
                      <span className="text-xs font-bold text-white">{record.business_name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed truncate max-w-xl">
                      {record.reasons}
                    </p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{record.dates_connected}</span>
                    <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                      record.status.toLowerCase().includes('active') 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' 
                        : record.status.toLowerCase().includes('suspend') 
                        ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' 
                        : 'bg-red-950/40 text-red-400 border-red-900/30'
                    )}>{record.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
};
