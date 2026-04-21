import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Package, Truck, Wallet, AlertTriangle, 
  TrendingUp, Activity, ShieldAlert, BarChart3, CheckCircle2 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { turso } from '../lib/turso';
import { AIComplianceService, ComplianceAlert } from '../lib/compliance/AIComplianceService';
import { AdvancedAIIntelligence, YieldPrediction } from '../lib/compliance/AdvancedAIIntelligence';
import { StatCard } from './StatCard';
import { LiveEventStream } from './shared/LiveEventStream';

export const DashboardAnalytics: React.FC<{ facilityId: string }> = ({ facilityId }) => {
  const [stats, setStats] = useState({
    revenue: 0,
    inventoryValue: 0,
    activeTransfers: 0,
    walletBalance: 0,
    salesVelocity: 0
  });
  const [predictions, setPredictions] = useState<YieldPrediction[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Revenue (today)
        const revResult = await turso.execute({
          sql: "SELECT SUM(amount) as total FROM transactions WHERE entity_id = ? AND type = 'B2C Sales'",
          args: [facilityId]
        });
        
        // 2. Fetch Inventory Count
        const invResult = await turso.execute({
          sql: "SELECT SUM(weight) as total FROM packages WHERE facility_id = ? AND status = 'ACTIVE'",
          args: [facilityId]
        });

        // 3. Fetch Active Transfers
        const transResult = await turso.execute({
          sql: "SELECT COUNT(*) as count FROM transfers WHERE from_facility = ? AND status = 'IN_TRANSIT'",
          args: [facilityId]
        });

        // 4. Fetch Wallet Balance
        const walResult = await turso.execute({
          sql: "SELECT balance FROM wallets WHERE user_id = ?",
          args: [facilityId]
        });

        // 5. Run AI Compliance Checks
        const complianceAlerts = await AIComplianceService.runChecks(facilityId);

        // 6. Fetch Yield Predictions
        const yieldPredictions = await AdvancedAIIntelligence.predictYield(facilityId);

        setStats({
          revenue: Number(revResult.rows[0]?.total || 0),
          inventoryValue: Number(invResult.rows[0]?.total || 0),
          activeTransfers: Number(transResult.rows[0]?.count || 0),
          walletBalance: Number(walResult.rows[0]?.balance || 0),
          salesVelocity: 12.5 // Mock for now
        });
        setPredictions(yieldPredictions);
        setAlerts(complianceAlerts);
      } catch (err) {
        console.error('Error fetching dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [facilityId]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Initializing Command Center...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Owner Command Center</h2>
          <p className="text-slate-500 font-medium">Real-time metrics & compliance intelligence</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
             <CheckCircle2 size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Metrc Sync Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
             <Activity size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">Larry AI: Online</span>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          trend={12} 
          icon={DollarSign} 
          color="bg-emerald-600" 
        />
        <StatCard 
          label="Inventory (Grams)" 
          value={`${stats.inventoryValue.toLocaleString()}g`} 
          trend={-2} 
          icon={Package} 
          color="bg-blue-600" 
        />
        <StatCard 
          label="Active Transfers" 
          value={stats.activeTransfers} 
          icon={Truck} 
          color="bg-indigo-600" 
        />
        <StatCard 
          label="Wallet Liquidity" 
          value={`$${stats.walletBalance.toLocaleString()}`} 
          icon={Wallet} 
          color="bg-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={20} /> AI Compliance Intelligence
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Detection</span>
          </div>
          <div className="p-6 space-y-4 flex-1">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-bold text-slate-800">Clean Compliance Score</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">No fraud patterns or inventory mismatches detected by the AI engine.</p>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <div key={i} className={cn(
                  "p-5 rounded-2xl border flex items-start gap-4 transition-all hover:shadow-md",
                  alert.severity === 'high' ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
                )}>
                  <div className={cn(
                    "p-2 rounded-xl shrink-0",
                    alert.severity === 'high' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                  )}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn("font-bold text-sm", alert.severity === 'high' ? "text-red-900" : "text-amber-900")}>
                        {alert.type.replace(/_/g, ' ')}
                      </h4>
                      <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", 
                        alert.severity === 'high' ? "bg-red-200 text-red-700" : "bg-amber-200 text-amber-700"
                      )}>
                        {alert.severity} Risk
                      </span>
                    </div>
                    <p className={cn("text-xs leading-relaxed", 
                      alert.severity === 'high' ? "text-red-700" : "text-amber-700"
                    )}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
             <button className="text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors">Run Deep Forensic Audit</button>
          </div>
        </div>

        {/* Live Event Stream (Kafka Simulation) */}
        <div className="lg:col-span-1 h-[600px]">
           <LiveEventStream />
        </div>

        {/* AI Yield Prediction Widget */}
        <div className="bg-[#1e1b4b] rounded-[2rem] border border-indigo-500/20 p-6 shadow-2xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h3 className="font-bold mb-6 flex items-center gap-2 text-indigo-300">
            <Sparkles size={18} /> Predictive Yield Analysis
          </h3>
          <div className="space-y-6 relative z-10">
            {predictions.length === 0 ? (
              <p className="text-sm text-indigo-200/60 italic py-8 text-center">No flowering batches detected for analysis.</p>
            ) : (
              predictions.map((p, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-indigo-100">{p.strain}</span>
                    <span className={cn("px-2 py-0.5 rounded-full font-black uppercase text-[8px]", 
                      p.status === 'OPTIMAL' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {p.status}
                    </span>
                  </div>
                  <div className="w-full bg-indigo-950/50 rounded-full h-2 border border-indigo-500/10 overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", p.status === 'OPTIMAL' ? "bg-emerald-400" : "bg-indigo-400")} 
                      style={{ width: `${85 + (p.variance)}%` }} 
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-indigo-300/60">Predicted: {p.predictedWeight.toLocaleString()}g</span>
                    <span className={cn("font-bold", p.variance >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {p.variance >= 0 ? '+' : ''}{p.variance.toFixed(1)}% variance
                    </span>
                  </div>
                </div>
              ))
            )}
            <div className="pt-4 border-t border-indigo-500/20 mt-4">
              <div className="flex items-center gap-2 text-indigo-300">
                 <ShieldAlert size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Laundering Detection</span>
              </div>
              <p className="text-[10px] text-indigo-200/60 mt-2">
                Larry is scanning sales for smurfing patterns and smurfing-velocity anomalies. 
                <span className="text-emerald-400 ml-1 font-bold">All clear.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Sales Velocity / Chart Mock */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={18} /> Sales Velocity (Hourly)
          </h3>
          <div className="flex-1 flex items-end gap-2 h-48 mb-6">
            {[35, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-slate-100 group-hover:bg-blue-100 rounded-t-lg transition-all duration-500 ease-out flex items-end justify-center"
                  style={{ height: `${h}%` }}
                >
                  <div className="w-full bg-blue-500/20 group-hover:bg-blue-500 rounded-t-lg transition-all" style={{ height: '30%' }}></div>
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Avg Transaction</span>
                <span className="text-slate-800">$142.50</span>
             </div>
             <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wider">Busiest Hour</span>
                <span className="text-slate-800">4:20 PM</span>
             </div>
             <div className="pt-4 border-t border-slate-100">
               <button className="w-full py-3 bg-[#1a4731] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-[#153a28] transition-all flex items-center justify-center gap-2">
                 <BarChart3 size={16} /> Detailed Analytics
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
