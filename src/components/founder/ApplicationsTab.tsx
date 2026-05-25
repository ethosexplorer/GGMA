import React from 'react';
import { Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ApplicationsTab = ({
  patientList,
  liveQueue,
  setActiveTab
}: {
  patientList: any[];
  liveQueue: any[];
  setActiveTab: (tabId: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Layers size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Applications Command Queue</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Registry Intake Monitoring • Multi-State Sync</p>
        </div>
        <div className="relative z-10 flex gap-3">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center">
            <span className="text-[10px] font-black text-emerald-600 uppercase">Approved (24h)</span>
            <span className="text-xl font-black text-emerald-700">{patientList.filter((p: any) => p.applicationStatus === 'Approved' || p.applicationStatus === 'State Application Pending').length}</span>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col items-center">
            <span className="text-[10px] font-black text-amber-600 uppercase">Pending Review</span>
            <span className="text-xl font-black text-amber-700">{patientList.filter((p: any) => !p.applicationStatus || p.applicationStatus === 'Pending Review').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-6 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-800">Geospatial Distribution</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Live Map Feed</span>
          </div>
          <div className="p-8 flex items-center justify-center bg-slate-900 min-h-[300px] relative">
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 400 200" className="w-full h-full fill-slate-700">
                <rect x="50" y="50" width="300" height="100" rx="10" />
                <circle cx="100" cy="80" r="4" className="fill-emerald-500 animate-pulse" />
                <circle cx="200" cy="120" r="6" className="fill-blue-500 animate-pulse" />
                <circle cx="300" cy="70" r="4" className="fill-amber-500 animate-pulse" />
              </svg>
            </div>
            <div className="relative z-10 text-center">
              <p className="text-white font-black text-2xl">MAP OVERLAY ACTIVE</p>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">Geographic Density Monitoring</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 mb-6 flex justify-between items-center">
            Priority Queue
            <button onClick={() => { setActiveTab('omma_pipeline'); }} className="text-indigo-600 text-[10px] font-black uppercase hover:underline">View All</button>
          </h3>
          <div className="space-y-4">
            {liveQueue.length > 0 ? liveQueue.map((a, i) => (
              <div key={i} onClick={() => { if (a.t.includes('Patient')) { setActiveTab('operations'); } else { setActiveTab('b2b_crm'); } }} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">#{i + 1}</div>
                  <div>
                    <p className="font-black text-sm text-slate-800">{a.n}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{a.id} • {a.t}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border", a.c)}>{a.st}</span>
                  <p className="text-[9px] text-slate-400 mt-1 font-bold">{a.d}</p>
                </div>
              </div>
            )) : (
              <div className="text-center text-slate-400 font-bold text-sm py-4">No pending applications found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
