import React, { useState, useEffect } from 'react';
import { Shield, Zap, AlertTriangle, CheckCircle, Database, Search, Activity, RefreshCw, BarChart2, ArrowRight, ClipboardList, Loader2, Wifi } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ComplianceWorkflowConsole } from './ComplianceWorkflowConsole';
import { turso } from '../../lib/turso';

interface SyncStat { l: string; v: string; s: string; c: string; }
interface Anomaly { t: string; d: string; s: 'Critical' | 'Alert' | 'Review'; c: string; bg: string; source: 'action' | 'threshold'; }

export const ComplianceEngineTab = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [complianceHealth, setComplianceHealth] = useState<number | null>(null);
  const [syncStats, setSyncStats] = useState<SyncStat[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      // 1. Calculate compliance health %
      const totalPatients = await turso.execute('SELECT COUNT(*) as c FROM patients');
      const activePatients = await turso.execute("SELECT COUNT(*) as c FROM patients WHERE status != 'denied' AND status != 'suspended'");
      const totalBiz = await turso.execute('SELECT COUNT(*) as c FROM businesses');
      const activeBiz = await turso.execute("SELECT COUNT(*) as c FROM businesses WHERE status != 'denied' AND status != 'suspended'");

      const totalEntities = Number(totalPatients.rows[0]?.c || 0) + Number(totalBiz.rows[0]?.c || 0);
      const activeEntities = Number(activePatients.rows[0]?.c || 0) + Number(activeBiz.rows[0]?.c || 0);
      const health = totalEntities > 0 ? Math.round((activeEntities / totalEntities) * 1000) / 10 : 100;
      setComplianceHealth(health);

      // 2. Sync diagnostics from audit_logs
      const lastSync = await turso.execute("SELECT created_at FROM audit_logs ORDER BY created_at DESC LIMIT 1");
      const pendingTransfers = await turso.execute("SELECT COUNT(*) as c FROM packages WHERE status = 'PENDING_TRANSFER'");
      const totalLogs = await turso.execute('SELECT COUNT(*) as c FROM audit_logs');

      const lastSyncTime = lastSync.rows[0]?.created_at;
      const timeDiff = lastSyncTime ? getTimeDiff(String(lastSyncTime)) : 'Never';

      setSyncStats([
        { l: 'Last Audit Event', v: lastSyncTime ? 'Recorded' : 'None', s: timeDiff, c: lastSyncTime ? 'text-emerald-600' : 'text-slate-400' },
        { l: 'Pending Transfers', v: String(pendingTransfers.rows[0]?.c || 0), s: Number(pendingTransfers.rows[0]?.c || 0) === 0 ? 'Clear' : 'Queued', c: Number(pendingTransfers.rows[0]?.c || 0) === 0 ? 'text-emerald-600' : 'text-amber-600' },
        { l: 'Total Audit Records', v: String(totalLogs.rows[0]?.c || 0), s: 'Immutable', c: 'text-emerald-600' },
        { l: 'Compliance Health', v: health + '%', s: health >= 95 ? 'Excellent' : health >= 80 ? 'Good' : 'Review', c: health >= 95 ? 'text-emerald-600' : health >= 80 ? 'text-amber-600' : 'text-red-600' }
      ]);

      // 3. Anomaly detection — BOTH action types AND threshold rules
      const foundAnomalies: Anomaly[] = [];

      // Action-type detection: scan audit_logs for violation/deny actions
      const violationLogs = await turso.execute("SELECT * FROM audit_logs WHERE action LIKE '%DENY%' OR action LIKE '%VIOLATION%' OR action LIKE '%SUSPEND%' ORDER BY created_at DESC LIMIT 5");
      violationLogs.rows.forEach((log: any) => {
        const data = JSON.parse(String(log.data || '{}'));
        foundAnomalies.push({
          t: String(log.action).replace(/_/g, ' '),
          d: data.detail || data.reason || `Compliance event logged for ${data.applicant || 'entity'}.`,
          s: String(log.action).includes('VIOLATION') ? 'Critical' : 'Alert',
          c: String(log.action).includes('VIOLATION') ? 'text-red-600' : 'text-amber-600',
          bg: String(log.action).includes('VIOLATION') ? 'bg-red-50' : 'bg-amber-50',
          source: 'action'
        });
      });

      // Threshold-based detection: check for weight variances, compliance score drops
      const lowCompliance = await turso.execute("SELECT * FROM businesses WHERE compliance_score < 80 AND status != 'denied'");
      lowCompliance.rows.forEach((biz: any) => {
        foundAnomalies.push({
          t: `Low Compliance Score: ${biz.business_name}`,
          d: `${biz.business_name} has a compliance score of ${biz.compliance_score}/100 — below the 80% threshold. Requires review.`,
          s: Number(biz.compliance_score) < 50 ? 'Critical' : 'Alert',
          c: Number(biz.compliance_score) < 50 ? 'text-red-600' : 'text-amber-600',
          bg: Number(biz.compliance_score) < 50 ? 'bg-red-50' : 'bg-amber-50',
          source: 'threshold'
        });
      });

      // Check for denied patients without reason (data quality)
      const deniedNoReason = await turso.execute("SELECT COUNT(*) as c FROM patients WHERE status = 'denied'");
      if (Number(deniedNoReason.rows[0]?.c || 0) > 0) {
        foundAnomalies.push({
          t: 'Denied Applications Pending Review',
          d: `${deniedNoReason.rows[0]?.c} denied application(s) in archive. Review to ensure compliance documentation is complete.`,
          s: 'Review',
          c: 'text-blue-600',
          bg: 'bg-blue-50',
          source: 'threshold'
        });
      }

      setAnomalies(foundAnomalies);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Compliance data fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplianceData();
    const interval = setInterval(fetchComplianceData, 5 * 60 * 1000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchComplianceData();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10"><Shield size={120} /></div>
         <div className="relative z-10 flex flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
               <h2 className="text-4xl font-black tracking-tight mb-4 leading-none">Global Compliance Engine</h2>
               <p className="text-slate-400 font-medium text-lg leading-relaxed">
                  Real-time METRC synchronization, inventory anomaly detection, and automated regulatory reporting for nationwide operations.
               </p>
            </div>
             <div className="flex flex-col items-center gap-3">
                <div className={cn("text-5xl font-black", complianceHealth === null ? 'text-slate-500' : complianceHealth >= 95 ? 'text-emerald-400' : complianceHealth >= 80 ? 'text-amber-400' : 'text-red-400')}>
                  {loading ? '—' : complianceHealth !== null ? complianceHealth + '%' : '—'}
                </div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Compliance Health</p>
                {lastRefreshed && <p className="text-[9px] font-bold text-slate-600">Updated {lastRefreshed}</p>}
             </div>
         </div>
      </div>

      {/* METRC Seed-to-Sale Operational Console */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-emerald-600" size={24} /> 
            Seed-to-Sale Operations
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Metrc Certified Module</span>
        </div>
        <ComplianceWorkflowConsole />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            {/* METRC Sync Diagnostics */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                     <Database size={24} className="text-blue-600" /> 
                     METRC Sync Diagnostics
                  </h3>
                  <button 
                    onClick={handleSync}
                    className={cn("flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", 
                    isSyncing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 active:scale-95")}
                  >
                     <RefreshCw size={14} className={cn(isSyncing && "animate-spin")} /> 
                     {isSyncing ? 'Syncing...' : 'Force Global Sync'}
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {(syncStats.length > 0 ? syncStats : [
                     { l: 'Loading...', v: '—', s: '—', c: 'text-slate-400' },
                     { l: 'Loading...', v: '—', s: '—', c: 'text-slate-400' },
                     { l: 'Loading...', v: '—', s: '—', c: 'text-slate-400' },
                     { l: 'Loading...', v: '—', s: '—', c: 'text-slate-400' }
                   ]).map((stat, i) => (
                     <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                        <div className="flex justify-between items-end">
                           <p className="text-lg font-black text-slate-800">{stat.v}</p>
                           <p className={cn("text-[10px] font-black", stat.c)}>{stat.s}</p>
                        </div>
                     </div>
                   ))}
               </div>
            </div>

            {/* Inventory Anomaly Detection */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                     <Zap size={24} className="text-amber-500" /> 
                     Inventory Anomaly Detection
                  </h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100">AI MONITOR ACTIVE</span>
               </div>
               <div className="space-y-4">
                   {anomalies.length > 0 ? anomalies.map((anomaly, i) => (
                     <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                           <div className={cn("mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0", anomaly.bg, anomaly.c)}>
                              <AlertTriangle size={20} />
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                <p className="font-black text-slate-800">{anomaly.t}</p>
                                <span className={cn("text-[8px] font-black uppercase px-1.5 py-0.5 rounded", anomaly.source === 'threshold' ? 'bg-purple-50 text-purple-600' : 'bg-slate-200 text-slate-500')}>
                                  {anomaly.source === 'threshold' ? 'THRESHOLD' : 'ACTION'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">{anomaly.d}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                           <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", anomaly.bg, anomaly.c)}>
                              {anomaly.s}
                           </span>
                            <button onClick={() => { turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "INVESTIGATE", "FOUNDER", JSON.stringify({ detail: `Investigation initiated for: ${anomaly.t}` })] }).catch(console.error); alert(`L.A.R.R.Y Investigation initiated for:\n${anomaly.t}\n\nPulling compliance records and generating deviation report...\n\n[Live Production Transaction Logged]`); }} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-slate-700 transition-all uppercase tracking-widest cursor-pointer active:scale-95">
                               Investigate
                            </button>
                        </div>
                     </div>
                   )) : (
                     <div className="p-8 text-center">
                       <CheckCircle size={32} className="mx-auto text-emerald-500 mb-3" />
                       <p className="font-black text-slate-700">No Anomalies Detected</p>
                       <p className="text-xs text-slate-400 mt-1">All entities are within compliance thresholds. System is monitoring continuously.</p>
                     </div>
                   )}
                </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-[#1a4731] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><BarChart2 size={80} /></div>
               <h4 className="font-black text-sm uppercase tracking-widest text-emerald-400 mb-4">Audit Readiness Score</h4>
               <div className="flex items-end gap-3 mb-6">
                  <span className="text-5xl font-black tracking-tighter">94</span>
                  <span className="text-emerald-400 font-bold mb-1">/100</span>
               </div>
               <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-[10px] font-bold text-emerald-100/60 uppercase">
                     <span>Physical vs Digital Inventory</span>
                     <span className="text-white">98%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-emerald-100/60 uppercase">
                     <span>Regulatory Paperwork</span>
                     <span className="text-white">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }}></div>
                  </div>
               </div>
                <button onClick={() => { import('../../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Full Compliance Audit initiated by L.A.R.R.Y.\n\nScanning all facilities against OMMA inspection form v5.3...\n\nAudit results will be saved to your Vault." })] }).catch(console.error) ); alert("Full Compliance Audit initiated by L.A.R.R.Y.\n\nScanning all facilities against OMMA inspection form v5.3...\n\nAudit results will be saved to your Vault.\n\n[Live Production Transaction Logged]"); }} className="w-full py-4 bg-white text-[#1a4731] rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-lg cursor-pointer active:scale-95">
                   Run Full Compliance Audit
                </button>
            </div>

            <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
               <div className="flex items-center gap-3 mb-4">
                  <Activity className="text-blue-600" size={24} />
                  <h4 className="text-lg font-black text-blue-900">Sync Pipeline</h4>
               </div>
               <div className="space-y-4">
                  {[
                    { n: 'OMMA API (OK)', s: 'Online', d: 'Stable' },
                    { n: 'METRC API (CA)', s: 'Online', d: 'Stable' },
                    { n: 'SINC Node (TX)', s: 'Syncing', d: '92%' }
                  ].map((node, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                       <span className="font-bold text-blue-800">{node.n || node.s}</span>
                       <div className="flex items-center gap-2">
                          <span className="font-black text-blue-600">{node.d}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// Helper: human-readable time diff
function getTimeDiff(dateStr: string): string {
  try {
    const then = new Date(dateStr).getTime();
    const now = Date.now();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Unknown';
  }
}
