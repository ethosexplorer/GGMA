import React, { useState } from 'react';
import { PatientDashboard } from '../../pages/PatientDashboard';
import { BusinessDashboard } from '../../pages/BusinessDashboard';
import { MonitorPlay, Building2, HeartPulse, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export const InvestorSandboxTab = () => {
  const [activeMock, setActiveMock] = useState<'patient' | 'business' | 'none'>('none');

  if (activeMock === 'patient') {
    return (
      <div className="relative w-full h-full bg-slate-100 flex flex-col">
        <div className="bg-indigo-600 text-white p-2 text-center text-xs font-black uppercase tracking-widest flex justify-between items-center px-6 shadow-md z-50 shrink-0">
          <span className="flex items-center gap-2"><MonitorPlay size={14} /> INVESTOR DEMO ENVIRONMENT: PATIENT PORTAL</span>
          <button onClick={() => setActiveMock('none')} className="hover:text-indigo-200 transition-colors bg-black/20 px-3 py-1 rounded">Exit Sandbox</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          {/* We wrap it in a container that acts like the full screen */}
          <div className="absolute inset-0">
            <PatientDashboard onLogout={() => setActiveMock('none')} />
          </div>
        </div>
      </div>
    );
  }

  if (activeMock === 'business') {
    return (
      <div className="relative w-full h-full bg-slate-100 flex flex-col">
        <div className="bg-emerald-600 text-white p-2 text-center text-xs font-black uppercase tracking-widest flex justify-between items-center px-6 shadow-md z-50 shrink-0">
          <span className="flex items-center gap-2"><MonitorPlay size={14} /> INVESTOR DEMO ENVIRONMENT: BUSINESS PORTAL</span>
          <button onClick={() => setActiveMock('none')} className="hover:text-emerald-200 transition-colors bg-black/20 px-3 py-1 rounded">Exit Sandbox</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <BusinessDashboard onLogout={() => setActiveMock('none')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><MonitorPlay size={160} /></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Investor Sandbox</h2>
            <p className="text-slate-400 font-medium">Safe environment loaded with mock data for investor pitches. Real production data is protected.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setActiveMock('patient')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all group text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <HeartPulse size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Patient Portal (Mock)</h3>
          <p className="text-slate-500 font-medium">Launch the consumer-facing app fully loaded with mock wallet balances, test documents, and active prescriptions.</p>
          <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('business')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all group text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Building2 size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Business Portal (Mock)</h3>
          <p className="text-slate-500 font-medium">Launch the commercial dashboard featuring simulated Metrc syncs, B2B transactions, and compliance flags.</p>
          <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 mt-8">
        <ShieldAlert className="text-amber-500 shrink-0" size={24} />
        <div>
          <h4 className="font-black text-amber-900 mb-1">Production Isolation Active</h4>
          <p className="text-amber-800/80 text-sm font-medium">
            Any actions taken inside these sandbox portals (like creating transactions or accepting applications) will be reset when you exit. They will not affect the live production database on Monday.
          </p>
        </div>
      </div>
    </div>
  );
};
