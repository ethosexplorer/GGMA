import React, { useState, useEffect } from 'react';
import { Shield, Clock, Globe, FileText, Plus, CheckCircle, AlertTriangle, Calendar, ExternalLink, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  initRegSweepTables, getLastSweep, getStateUpdates, getLastUpdatePerState,
  logSweep, logStateUpdate, getNextSweepDate, getSweepFreshness,
  ALL_STATES, UPDATE_TYPES, type RegSweepEntry, type StateRegUpdate
} from '../../lib/regSweep';

export const RegulatoryCommandCenter = () => {
  const [lastSweep, setLastSweep] = useState<RegSweepEntry | null>(null);
  const [stateUpdates, setStateUpdates] = useState<StateRegUpdate[]>([]);
  const [lastUpdateMap, setLastUpdateMap] = useState<Record<string, string>>({});
  const [showLogSweep, setShowLogSweep] = useState(false);
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sweep form
  const [sweepForm, setSweepForm] = useState({
    type: 'full' as 'full' | 'priority',
    summary: '',
  });

  // State update form
  const [updateForm, setUpdateForm] = useState({
    stateCode: 'OK',
    stateName: 'Oklahoma',
    updateType: 'New Legislation Signed',
    summary: '',
    sourceUrl: '',
    effectiveDate: '',
  });

  useEffect(() => {
    initRegSweepTables().then(() => {
      refreshData();
    });
  }, []);

  const refreshData = async () => {
    const sweep = await getLastSweep();
    setLastSweep(sweep);
    const updates = await getStateUpdates();
    setStateUpdates(updates);
    const map = await getLastUpdatePerState();
    setLastUpdateMap(map);
  };

  const nextSweep = getNextSweepDate();
  const freshness = getSweepFreshness(lastSweep?.sweep_date || null);

  const handleLogSweep = async () => {
    if (!sweepForm.summary) { alert('Enter a sweep summary.'); return; }
    const statesInSummary = ALL_STATES.filter(s => sweepForm.summary.toLowerCase().includes(s.name.toLowerCase())).map(s => s.code);
    await logSweep(sweepForm.type, statesInSummary.length > 0 ? statesInSummary : ['ALL'], sweepForm.summary);
    setSweepForm({ type: 'full', summary: '' });
    setShowLogSweep(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    refreshData();
  };

  const handleAddUpdate = async () => {
    if (!updateForm.summary) { alert('Enter update details.'); return; }
    await logStateUpdate(updateForm.stateCode, updateForm.stateName, updateForm.updateType, updateForm.summary, updateForm.sourceUrl, updateForm.effectiveDate);
    setUpdateForm({ stateCode: 'OK', stateName: 'Oklahoma', updateType: 'New Legislation Signed', summary: '', sourceUrl: '', effectiveDate: '' });
    setShowAddUpdate(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    refreshData();
  };

  const filteredStates = ALL_STATES.filter(s => {
    const q = stateSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Shield size={100} /></div>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <Shield className="text-indigo-400" size={24} /> Regulatory Sweep Command
            </h2>
            <p className="text-indigo-300 font-bold uppercase tracking-widest text-[10px] mt-1">
              Bi-Monthly National Compliance Monitoring • 50 States + DC
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Last Sweep Badge */}
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">Last Sweep</p>
              <p className={cn("text-sm font-black", freshness.color === 'text-emerald-600' ? 'text-emerald-400' : freshness.color === 'text-amber-600' ? 'text-amber-400' : 'text-red-400')}>
                {freshness.label}
              </p>
            </div>

            {/* Next Sweep Badge */}
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest">Next Sweep</p>
              <p className="text-sm font-black text-white">{nextSweep.date}</p>
              <p className="text-[8px] font-bold text-indigo-400 uppercase">{nextSweep.type === 'full' ? '🔵 Full National' : '🟡 Priority States'}</p>
            </div>
          </div>
        </div>
      </div>

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle className="text-emerald-600" size={20} />
          <p className="text-sm font-bold text-emerald-800">Logged successfully! Audit trail updated.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => { setShowLogSweep(!showLogSweep); setShowAddUpdate(false); }} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Calendar size={14} /> Log Sweep Completion
        </button>
        <button onClick={() => { setShowAddUpdate(!showAddUpdate); setShowLogSweep(false); }} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20">
          <Plus size={14} /> Add State Update
        </button>
        <button onClick={() => setShowChangelog(!showChangelog)} className="px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center gap-2">
          <FileText size={14} /> {showChangelog ? 'Hide' : 'View'} Changelog
        </button>
      </div>

      {/* Log Sweep Form */}
      {showLogSweep && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-in slide-in-from-top duration-200">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2"><Calendar size={16} className="text-indigo-600" /> Log a Completed Sweep</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Sweep Type</label>
              <select value={sweepForm.type} onChange={(e) => setSweepForm({ ...sweepForm, type: e.target.value as any })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium">
                <option value="full">🔵 Full National (1st of month)</option>
                <option value="priority">🟡 Priority States (15th of month)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
              <input type="text" value={new Date().toLocaleDateString()} disabled className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Sweep Summary</label>
            <textarea value={sweepForm.summary} onChange={(e) => setSweepForm({ ...sweepForm, summary: e.target.value })} placeholder="e.g. Full national sweep completed. Oklahoma — OMMA fee update. California — new testing requirements effective 7/1." rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium resize-none" />
          </div>
          <button onClick={handleLogSweep} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors">
            ✓ Log Sweep
          </button>
        </div>
      )}

      {/* Add State Update Form */}
      {showAddUpdate && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-in slide-in-from-top duration-200">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2"><Globe size={16} className="text-emerald-600" /> Log State-Level Regulatory Change</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">State</label>
              <select value={updateForm.stateCode} onChange={(e) => { const s = ALL_STATES.find(s => s.code === e.target.value); setUpdateForm({ ...updateForm, stateCode: e.target.value, stateName: s?.name || '' }); }} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium">
                {ALL_STATES.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Update Type</label>
              <select value={updateForm.updateType} onChange={(e) => setUpdateForm({ ...updateForm, updateType: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium">
                {UPDATE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Effective Date (optional)</label>
              <input type="date" value={updateForm.effectiveDate} onChange={(e) => setUpdateForm({ ...updateForm, effectiveDate: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Change Summary *</label>
            <textarea value={updateForm.summary} onChange={(e) => setUpdateForm({ ...updateForm, summary: e.target.value })} placeholder="e.g. OMMA increased patient application fee from $100 to $104.30 effective May 1, 2026" rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Source URL (optional)</label>
            <input type="url" value={updateForm.sourceUrl} onChange={(e) => setUpdateForm({ ...updateForm, sourceUrl: e.target.value })} placeholder="https://omma.ok.gov/..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium" />
          </div>
          <button onClick={handleAddUpdate} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors">
            ✓ Log State Update
          </button>
        </div>
      )}

      {/* State-by-State Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Globe size={16} className="text-indigo-500" /> State Regulatory Status ({ALL_STATES.length} Jurisdictions)
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={stateSearch} onChange={(e) => setStateSearch(e.target.value)} placeholder="Filter states..." className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none w-48" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-slate-100">
          {filteredStates.map(s => {
            const lastUpdate = lastUpdateMap[s.code];
            const isActive = s.code === 'OK';
            return (
              <div key={s.code} className={cn("bg-white p-3 text-center hover:bg-indigo-50 transition-colors cursor-default", isActive && "ring-2 ring-inset ring-emerald-400")}>
                <p className={cn("text-lg font-black", isActive ? 'text-emerald-600' : 'text-slate-800')}>{s.code}</p>
                <p className="text-[9px] font-bold text-slate-500 truncate">{s.name}</p>
                {lastUpdate ? (
                  <p className="text-[8px] font-bold text-indigo-600 mt-1">{new Date(lastUpdate).toLocaleDateString()}</p>
                ) : (
                  <p className="text-[8px] font-bold text-slate-300 mt-1">No updates</p>
                )}
                {isActive && <p className="text-[7px] font-black text-emerald-600 uppercase mt-0.5">● Active</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Regulatory Changelog */}
      {showChangelog && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={16} className="text-indigo-500" /> Regulatory Changelog (Last 100 Entries)
            </h3>
          </div>
          {stateUpdates.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-bold">No regulatory updates logged yet. Add your first update above.</div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {stateUpdates.map((u, i) => (
                <div key={i} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{u.state_code}</span>
                      <span className="text-sm font-bold text-slate-800">{u.summary}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-4">{new Date(u.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{u.update_type}</span>
                    {u.effective_date && <span className="text-[9px] text-slate-400">Effective: {u.effective_date}</span>}
                    {u.source_url && (
                      <a href={u.source_url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-indigo-500 hover:underline flex items-center gap-0.5">
                        <ExternalLink size={8} /> Source
                      </a>
                    )}
                    <span className="text-[9px] text-slate-300">by {u.performed_by}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
