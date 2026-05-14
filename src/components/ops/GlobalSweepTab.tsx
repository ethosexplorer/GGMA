import React, { useState } from 'react';
import { PipelineCRM } from '../crm/PipelineCRM';
import { Search, MapPin, Building2, Download, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const GlobalSweepTab = () => {
  const [selectedState, setSelectedState] = useState('OK');
  
  const states = [
    { code: 'OK', name: 'Oklahoma (OMMA)', status: 'Active', count: '30,000+' },
    { code: 'CA', name: 'California (DCC)', status: 'Active', count: '10,000+' },
    { code: 'OH', name: 'Ohio (DCC)', status: 'Active', count: '1,500+' },
    { code: 'MI', name: 'Michigan (CRA)', status: 'Active', count: '10,000+' },
    { code: 'IL', name: 'Illinois (IDFPR)', status: 'Planned', count: 'Pending' }
  ];

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
              <span className="font-black text-slate-700">{activeState?.count}</span>
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
