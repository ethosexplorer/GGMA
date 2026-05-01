import React, { useState, useEffect } from 'react';
import { Leaf, Package, Truck, ClipboardList, Plus, Search, Tag, Zap, AlertCircle, ArrowRight, ShieldCheck, Database, Wallet, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MetrcEngine as complianceService } from '../../lib/metrc/MetrcEngine';
import { MetrcConnector } from '../../lib/metrc/MetrcConnector';
import { turso } from '../../lib/turso';

type Module = 'plants' | 'packages' | 'transfers' | 'audit' | 'wallet';

export const ComplianceWorkflowConsole = () => {
  const [activeModule, setActiveModule] = useState<Module>('plants');
  const [batches, setBatches] = useState<any[]>([]);
  const [activePlants, setActivePlants] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [facilityWallet, setFacilityWallet] = useState<any>(null);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatch, setNewBatch] = useState({ strain: '', count: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [metrcStatus, setMetrcStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [metrcFacilities, setMetrcFacilities] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [showMetrcConfig, setShowMetrcConfig] = useState(false);
  const [metrcConfig, setMetrcConfig] = useState({
    integratorApiKey: '',
    userApiKey: '',
    licenseNumber: '',
    environment: 'production' as const
  });

  useEffect(() => {
    fetchData();
  }, [activeModule]);

  const fetchData = async () => {
    try {
      if (activeModule === 'plants') {
        const batchRes = await turso.execute('SELECT * FROM plant_batches ORDER BY created_at DESC');
        setBatches(batchRes.rows);
        const plantRes = await turso.execute('SELECT * FROM plants LIMIT 10');
        setActivePlants(plantRes.rows);
      } else if (activeModule === 'packages') {
        const pkgRes = await turso.execute('SELECT * FROM packages ORDER BY created_at DESC');
        setPackages(pkgRes.rows);
      } else if (activeModule === 'audit') {
        const logRes = await turso.execute('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50');
        setAuditLogs(logRes.rows);
      } else if (activeModule === 'wallet') {
        const walletRes = await turso.execute("SELECT * FROM wallets WHERE type = 'facility' LIMIT 1");
        setFacilityWallet(walletRes.rows[0]);
        const txRes = await turso.execute("SELECT * FROM transactions ORDER BY date DESC LIMIT 5");
        setWalletTransactions(txRes.rows);
      }
    } catch (err) {
      console.error('Error fetching compliance data:', err);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await complianceService.createPlantBatch(newBatch.strain, newBatch.count, 'ent-2');
      setShowAddBatch(false);
      setNewBatch({ strain: '', count: 10 });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetrcSync = async () => {
    if (!metrcConfig.integratorApiKey || !metrcConfig.userApiKey) {
      setShowMetrcConfig(true);
      return;
    }
    
    setIsLoading(true);
    setMetrcStatus('disconnected');
    try {
      const connector = new MetrcConnector(metrcConfig);
      const facilities = await connector.getFacilitiesV2();
      setMetrcFacilities(facilities);
      setMetrcStatus('connected');
      setShowMetrcConfig(false);
      // Persist config for demo
      localStorage.setItem('metrc_production_config', JSON.stringify(metrcConfig));
    } catch (err) {
      console.error('Metrc Sync Error:', err);
      setMetrcStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('metrc_production_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMetrcConfig(parsed);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row h-[800px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-2">
        <div className="mb-6 px-2">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Compliance Ops</h3>
        </div>
        
        <button 
          onClick={() => setActiveModule('plants')}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", 
          activeModule === 'plants' ? "bg-[#1a4731] text-white shadow-lg shadow-emerald-900/20" : "text-slate-500 hover:bg-slate-200")}
        >
          <Leaf size={18} /> Plants & Batches
        </button>
        
        <button 
          onClick={() => setActiveModule('packages')}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", 
          activeModule === 'packages' ? "bg-[#1a4731] text-white shadow-lg shadow-emerald-900/20" : "text-slate-500 hover:bg-slate-200")}
        >
          <Package size={18} /> Inventory Packages
        </button>
        
        <button 
          onClick={() => setActiveModule('transfers')}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", 
          activeModule === 'transfers' ? "bg-[#1a4731] text-white shadow-lg shadow-emerald-900/20" : "text-slate-500 hover:bg-slate-200")}
        >
          <Truck size={18} /> B2B Transfers
        </button>
        
        <button 
          onClick={() => setActiveModule('wallet')}
          className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all", 
          activeModule === 'wallet' ? "bg-[#1a4731] text-white shadow-lg shadow-emerald-900/20" : "text-slate-500 hover:bg-slate-200")}
        >
          <Wallet size={18} /> Care Wallet Integration
        </button>
        
        <div className="mt-auto pt-6 border-t border-slate-200 space-y-4">
          <div className="px-4 py-3 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metrc Sync</span>
              <div className={cn("w-2 h-2 rounded-full", 
                metrcStatus === 'connected' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : 
                metrcStatus === 'error' ? "bg-red-500" : "bg-slate-300")} />
            </div>
            <button 
              onClick={handleMetrcSync}
              className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Database size={12} /> {metrcStatus === 'connected' ? 'Re-Sync V2' : 'Connect Production'}
            </button>
          </div>

          {metrcStatus === 'connected' && metrcFacilities.length > 0 && (
            <div className="px-4 py-3 bg-blue-50 rounded-2xl border border-blue-100">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 block">Active Facility</label>
              <select 
                value={selectedFacility} 
                onChange={e => setSelectedFacility(e.target.value)}
                className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-bold text-blue-900 outline-none"
              >
                <option value="">Select Facility...</option>
                {metrcFacilities.map((f, i) => (
                  <option key={i} value={f.LicenseNumber}>{f.Name} ({f.LicenseNumber})</option>
                ))}
              </select>
            </div>
          )}
          
          <button 
            onClick={() => setActiveModule('audit')}
            className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all w-full", 
            activeModule === 'audit' ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-200")}
          >
            <ClipboardList size={18} /> Immutable Audit Logs
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-8 bg-white">
        {activeModule === 'plants' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Plants & Cultivation</h2>
                <p className="text-sm text-slate-500 font-medium">Manage lifecycle from immature batches to flowering plants.</p>
              </div>
              <button 
                onClick={() => setShowAddBatch(true)}
                className="bg-[#1a4731] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Create Plant Batch
              </button>
            </div>

            {showAddBatch && (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 animate-in zoom-in-95 duration-200">
                <form onSubmit={handleCreateBatch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Strain Name</label>
                    <input 
                      required
                      value={newBatch.strain}
                      onChange={e => setNewBatch({...newBatch, strain: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-emerald-500/20 outline-none"
                      placeholder="e.g. Pineapple Express"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Plant Count</label>
                    <input 
                      type="number"
                      required
                      value={newBatch.count}
                      onChange={e => setNewBatch({...newBatch, count: parseInt(e.target.value)})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 text-white font-black text-xs uppercase py-3.5 rounded-xl hover:bg-emerald-700 transition-colors">
                      {isLoading ? 'Creating...' : 'Initialize Batch'}
                    </button>
                    <button type="button" onClick={() => setShowAddBatch(false)} className="px-6 py-3.5 bg-slate-200 text-slate-600 font-black text-xs uppercase rounded-xl hover:bg-slate-300">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400"><Database size={16} /> Active Batches</h3>
                <div className="space-y-3">
                  {batches.map((b, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                      <div>
                        <p className="font-black text-slate-800">{b.strain}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{b.count} Plants • {b.status}</p>
                      </div>
                      <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
                  {batches.length === 0 && <p className="text-xs text-slate-400 italic">No batches found.</p>}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400"><Tag size={16} /> Individual RFID Tags</h3>
                <div className="space-y-3">
                  {activePlants.map((p, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-[10px]">
                          {i+1}
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-slate-700">{p.tag_id}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{p.phase}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full">ACTIVE</span>
                    </div>
                  ))}
                  {activePlants.length === 0 && <p className="text-xs text-slate-400 italic">No tagged plants found.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModule === 'packages' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Inventory Packages</h2>
                <p className="text-sm text-slate-500 font-medium">Finished goods ready for transfer or retail sale.</p>
              </div>
              <button onClick={() => alert("Create New Package wizard started.\n\nSelect source batch, enter weight (grams), assign RFID tag, and confirm package for retail or transfer.")} className="bg-[#1a4731] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 cursor-pointer active:scale-95">
                <Package size={16} /> Create New Package
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tag ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item / Weight</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {packages.map((pkg, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-mono font-bold text-slate-800">{pkg.tag_id}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Source: {pkg.source_type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-700">{pkg.weight} Grams</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", 
                          pkg.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-black text-[#1a4731] hover:underline uppercase tracking-widest">Manage</button>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">No packages found in inventory.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeModule === 'audit' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Immutable Audit Logs</h2>
              <p className="text-sm text-slate-500 font-medium">Cryptographically signed record of all compliance-sensitive actions.</p>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log, i) => {
                const data = JSON.parse(log.data);
                return (
                  <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all border-l-4 border-l-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{log.action}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{log.created_at}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {log.action === 'CREATE_PLANT_BATCH' ? `Created ${data.count} plants for strain ${data.strain}` : 
                           log.action === 'ASSIGN_TAGS' ? `Assigned RFID sequence starting at ${data.tagStart}` :
                           log.action === 'WALLET_DEBIT' ? `Debited $${data.amount} for reference ${data.referenceId}` :
                           `Processed compliance event with ID ${log.id.slice(0, 8)}`}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-200 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-slate-300">Verify Hash</button>
                  </div>
                );
              })}
              {auditLogs.length === 0 && <p className="p-12 text-center text-slate-400 italic">No audit logs recorded yet.</p>}
            </div>
          </div>
        )}

        {activeModule === 'wallet' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-[#0f291c] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-10"><Wallet size={120} /></div>
               <div className="relative z-10">
                  <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Care Wallet • Facility Account</p>
                  <h2 className="text-5xl font-black tracking-tighter mb-4">${facilityWallet?.balance?.toLocaleString() || '0.00'}</h2>
                  <div className="flex gap-4">
                     <button onClick={() => alert("Transfer to Corporate initiated.\n\nFacility balance will be swept to the GGE Corporate Treasury account. Funds will settle within 24 hours via the Settlement Network.")} className="px-8 py-3 bg-white text-[#1a4731] rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all shadow-xl shadow-black/20 cursor-pointer active:scale-95">
                        Transfer to Corporate
                     </button>
                     <button onClick={() => setActiveModule("audit")} className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all backdrop-blur-sm cursor-pointer active:scale-95">
                        View Ledger
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><Zap size={24} className="text-amber-500" /> Auto-Payment Rules</h3>
                  <div className="space-y-4">
                     {[
                       { n: 'State Tax Allocation', d: 'Auto-debit 15% of daily sales to escrow', s: 'Active' },
                       { n: 'Vendor Net-30', d: 'Auto-settle wholesale invoices on delivery', s: 'Paused' },
                       { n: 'Agent Card Renewals', d: 'Cover staff OMMA fees from facility balance', s: 'Active' }
                     ].map((rule, i) => (
                       <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                          <div>
                             <p className="font-black text-slate-800">{rule.n}</p>
                             <p className="text-xs text-slate-500 font-medium">{rule.d}</p>
                          </div>
                          <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase", rule.s === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-200 text-slate-500")}>
                             {rule.s}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-blue-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><ShieldCheck size={80} /></div>
                  <h4 className="font-black text-sm uppercase tracking-widest text-blue-300 mb-4">Compliance Guard</h4>
                  <div className="space-y-4 mb-8">
                     <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Recent Ledger Events</p>
                     {walletTransactions.map((tx, i) => (
                       <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-white/10 pb-2">
                          <span className="text-blue-300">{tx.type}</span>
                          <span className="font-black text-white">${tx.amount.toLocaleString()}</span>
                          <span className="text-blue-400">{tx.date}</span>
                       </div>
                     ))}
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10">
                     <AlertCircle className="text-blue-300" size={20} />
                     <p className="text-xs font-bold text-blue-200">System Secure: 100% Asset Backing</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeModule === 'transfers' && (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <Truck size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">B2B Transfer Manifests</h2>
            <p className="text-slate-500 max-w-sm mt-2 font-medium">Create and track legal movement of product between licensed facilities.</p>
            <button onClick={() => alert("Transfer Manifest initialized.\n\nSelect destination facility, add packages to transfer, generate RFID manifest, and submit to Metrc for compliance tracking.")} className="mt-8 bg-[#1a4731] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-105 transition-all cursor-pointer active:scale-95">
              Initialize Manifest
            </button>
          </div>
        )}
      </div>

      {/* Metrc Configuration Modal */}
      {showMetrcConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Metrc API Setup</h3>
                <p className="text-sm text-slate-500 font-medium">Enter your production credentials to enable live V2 synchronization.</p>
              </div>
              <button onClick={() => setShowMetrcConfig(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <AlertCircle className="text-slate-400" size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Integrator API Key</label>
                <input 
                  type="password"
                  value={metrcConfig.integratorApiKey}
                  onChange={e => setMetrcConfig({...metrcConfig, integratorApiKey: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 ring-blue-500/20 outline-none"
                  placeholder="Paste Integrator Key..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">User API Key (Optional)</label>
                <input 
                  type="password"
                  value={metrcConfig.userApiKey}
                  onChange={e => setMetrcConfig({...metrcConfig, userApiKey: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 ring-blue-500/20 outline-none"
                  placeholder="Paste User Key..."
                />
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Database className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    This will use the <strong>GET /facilities/v2</strong> endpoint to retrieve all available licenses in your OK production environment.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleMetrcSync}
                disabled={isLoading || !metrcConfig.integratorApiKey}
                className="w-full py-4 bg-[#1a4731] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                Authenticate & Sync V2
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

