import React, { useState, useEffect } from 'react';
import { PipelineCRM } from '../crm/PipelineCRM';
import { Search, MapPin, Building2, Download, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export const GlobalSweepTab = () => {
  const [selectedState, setSelectedState] = useState('OK');
  const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});
  const [typeCounts, setTypeCounts] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    const q = query(collection(db, 'crm_deals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deals = snapshot.docs.map(doc => doc.data());
      const newCounts: Record<string, number> = {};
      const newTypes: Record<string, Record<string, number>> = {};
      
      deals.forEach(deal => {
        const state = deal.jurisdiction || 'US';
        const type = deal.type || 'other';
        newCounts[state] = (newCounts[state] || 0) + 1;
        
        if (!newTypes[state]) newTypes[state] = {};
        newTypes[state][type] = (newTypes[state][type] || 0) + 1;
      });
      
      setLiveCounts(newCounts);
      setTypeCounts(newTypes);
    });
    return () => unsubscribe();
  }, []);
  
  const baseStates = [
    { code: 'CA', name: 'California (DCC)', status: 'Active' },
    { code: 'CO', name: 'Colorado (MED)', status: 'Active' },
    { code: 'WA', name: 'Washington (LCB)', status: 'Active' },
    { code: 'OR', name: 'Oregon (OLCC)', status: 'Active' },
    { code: 'MI', name: 'Michigan (CRA)', status: 'Active' },
    { code: 'NV', name: 'Nevada (CCB)', status: 'Active' },
    { code: 'IL', name: 'Illinois (IDFPR)', status: 'Active' },
    { code: 'MA', name: 'Massachusetts (CCC)', status: 'Active' },
    { code: 'OH', name: 'Ohio (DCC)', status: 'Active' },
    { code: 'OK', name: 'Oklahoma (OMMA)', status: 'Active' },
    { code: 'NY', name: 'New York (OCM)', status: 'Active' },
    { code: 'NJ', name: 'New Jersey (CRC)', status: 'Active' },
    { code: 'AZ', name: 'Arizona (ADHS)', status: 'Active' },
    { code: 'MD', name: 'Maryland (MCA)', status: 'Active' },
    { code: 'MO', name: 'Missouri (DCR)', status: 'Active' },
    { code: 'FL', name: 'Florida (OMMU)', status: 'Active' },
    { code: 'PA', name: 'Pennsylvania (DOH)', status: 'Active' },
    { code: 'MT', name: 'Montana (CCD)', status: 'Active' },
    { code: 'NM', name: 'New Mexico (CCD)', status: 'Active' },
    { code: 'AK', name: 'Alaska (AMCO)', status: 'Active' },
    { code: 'ME', name: 'Maine (OMP)', status: 'Active' },
    { code: 'CT', name: 'Connecticut (DCP)', status: 'Active' },
    { code: 'VT', name: 'Vermont (CCB)', status: 'Active' },
    { code: 'RI', name: 'Rhode Island (DBR)', status: 'Active' },
    { code: 'US', name: 'National Database (All Other States)', status: 'Active' }
  ];

  const states = baseStates.map(s => ({
    ...s,
    count: liveCounts[s.code] || 0,
    types: typeCounts[s.code] || {}
  }));

  const activeState = states.find(s => s.code === selectedState);

  return (
    <div className="h-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side: Sweep Command Center */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 bg-white flex flex-col shrink-0 min-w-[320px]">
        <div className="p-4 border-b border-slate-100 bg-emerald-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-black flex items-center gap-2"><MapPin size={18} className="text-emerald-400" /> Global Sweep Hub</h2>
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold mt-0.5">Multi-State Registry Engine</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Jurisdiction</label>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {states.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
            
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Pipeline Volume:</span>
              <span className="font-black text-slate-700">{activeState?.count.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Scraper Status:</span>
              <span className={`font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                activeState?.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                activeState?.status === 'Building' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {activeState?.status}
              </span>
            </div>

            {/* Sub-Tally by Category */}
            {activeState?.count !== undefined && activeState?.count > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Category Breakdown</p>
                <div className="space-y-1">
                  {Object.entries(activeState.types || {}).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 capitalize">{type}</span>
                      <span className="font-bold text-slate-700">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            {activeState?.status === 'Active' ? (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Scraper Ready</h3>
                <p className="text-xs text-slate-500 font-medium mb-6">
                  The extraction engine for {activeState?.name} is active and bypassing portal restrictions.
                </p>
                <div className="space-y-3 w-full">
                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                    <Play size={16} /> Run Terminal Sweep
                  </button>
                  <button className="w-full py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> Download CSV
                  </button>
                </div>
              </>
            ) : activeState?.status === 'Building' ? (
              <>
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-inner animate-pulse">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Engineering in Progress</h3>
                <p className="text-xs text-slate-500 font-medium">
                  We are currently writing the custom traversal logic for the {activeState?.name} government portal. Check back soon.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Planned Jurisdiction</h3>
                <p className="text-xs text-slate-500 font-medium">
                  This state is in the verified roadmap but engineering has not yet begun on its custom portal scraper.
                </p>
              </>
            )}
          </div>
          
          <div className="mt-6 bg-slate-100 border border-slate-200 p-3 rounded-xl text-slate-600 text-[10px] font-bold leading-relaxed">
            <p><strong>Note:</strong> Automated extraction commands must be triggered from the backend terminal to bypass Cross-Origin restrictions.</p>
          </div>
        </div>
      </div>

      {/* Right Side: CRM Pipeline */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex-1 flex flex-col h-full bg-[#080e1a] overflow-auto">
        <div className="p-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <h2 className="font-black text-white flex items-center gap-2"><Building2 size={18} className="text-emerald-400" /> State-Specific CRM Pipeline</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Imported from {activeState?.name}</p>
        </div>
        <div className="flex-1 overflow-auto relative -m-6 p-6">
          <div className="absolute inset-0">
            <PipelineCRM />
          </div>
        </div>
      </div>

    </div>
  );
};
