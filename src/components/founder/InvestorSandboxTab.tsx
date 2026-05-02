import React, { useState } from 'react';
import { PatientDashboard } from '../../pages/PatientDashboard';
import { BusinessDashboard } from '../../pages/BusinessDashboard';
import { ProviderDashboard } from '../../pages/ProviderDashboard';
import { AttorneyDashboard } from '../../pages/AttorneyDashboard';
import { StateAuthorityDashboard } from '../../pages/StateAuthorityDashboard';
import { FederalDashboard } from '../../pages/FederalDashboard';
import { EnforcementDashboard } from '../../pages/EnforcementDashboard';
import { MonitorPlay, Building2, HeartPulse, ShieldAlert, Stethoscope, Scale, Gavel, Globe, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

export const InvestorSandboxTab = () => {
  const [activeMock, setActiveMock] = useState<'patient' | 'business' | 'provider' | 'attorney' | 'oversight' | 'federal' | 'enforcement' | 'none'>('none');

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

  if (activeMock === 'provider') {
    return (
      <div className="relative w-full h-full bg-slate-100 flex flex-col">
        <div className="bg-blue-600 text-white p-2 text-center text-xs font-black uppercase tracking-widest flex justify-between items-center px-6 shadow-md z-50 shrink-0">
          <span className="flex items-center gap-2"><MonitorPlay size={14} /> INVESTOR DEMO ENVIRONMENT: HEALTHCARE PROVIDER</span>
          <button onClick={() => setActiveMock('none')} className="hover:text-blue-200 transition-colors bg-black/20 px-3 py-1 rounded">Exit Sandbox</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <ProviderDashboard onLogout={() => setActiveMock('none')} />
          </div>
        </div>
      </div>
    );
  }

  if (activeMock === 'attorney') {
    return (
      <div className="relative w-full h-full bg-slate-100 flex flex-col">
        <div className="bg-amber-600 text-white p-2 text-center text-xs font-black uppercase tracking-widest flex justify-between items-center px-6 shadow-md z-50 shrink-0">
          <span className="flex items-center gap-2"><MonitorPlay size={14} /> INVESTOR DEMO ENVIRONMENT: ATTORNEY PORTAL</span>
          <button onClick={() => setActiveMock('none')} className="hover:text-amber-200 transition-colors bg-black/20 px-3 py-1 rounded">Exit Sandbox</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <AttorneyDashboard onLogout={() => setActiveMock('none')} />
          </div>
        </div>
      </div>
    );
  }

  if (activeMock === 'oversight') {
    return (
      <div className="relative w-full h-full bg-slate-100 flex flex-col">
        <div className="bg-slate-900 text-white p-2 text-center text-xs font-black uppercase tracking-widest flex justify-between items-center px-6 shadow-md z-50 shrink-0">
          <span className="flex items-center gap-2"><MonitorPlay size={14} /> INVESTOR DEMO ENVIRONMENT: REGULATORY OVERSIGHT</span>
          <button onClick={() => setActiveMock('none')} className="hover:text-slate-300 transition-colors bg-white/20 px-3 py-1 rounded">Exit Sandbox</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <StateAuthorityDashboard onLogout={() => setActiveMock('none')} />
          </div>
        </div>
      </div>
    );
  }

  if (activeMock === 'federal') {
    return (
      <div className="relative w-full h-full bg-slate-100 flex flex-col">
        <div className="bg-slate-800 text-white p-2 text-center text-xs font-black uppercase tracking-widest flex justify-between items-center px-6 shadow-md z-50 shrink-0">
          <span className="flex items-center gap-2"><MonitorPlay size={14} /> INVESTOR DEMO ENVIRONMENT: FEDERAL COMMAND</span>
          <button onClick={() => setActiveMock('none')} className="hover:text-slate-300 transition-colors bg-white/20 px-3 py-1 rounded">Exit Sandbox</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <FederalDashboard onLogout={() => setActiveMock('none')} />
          </div>
        </div>
      </div>
    );
  }

  if (activeMock === 'enforcement') {
    return (
      <div className="relative w-full h-full bg-slate-100 flex flex-col">
        <div className="bg-slate-950 text-white p-2 text-center text-xs font-black uppercase tracking-widest flex justify-between items-center px-6 shadow-md z-50 shrink-0">
          <span className="flex items-center gap-2"><MonitorPlay size={14} /> INVESTOR DEMO ENVIRONMENT: LAW ENFORCEMENT</span>
          <button onClick={() => setActiveMock('none')} className="hover:text-slate-300 transition-colors bg-white/20 px-3 py-1 rounded">Exit Sandbox</button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <EnforcementDashboard onLogout={() => setActiveMock('none')} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveMock('patient')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <HeartPulse size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Patient Portal</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Launch the consumer-facing app loaded with mock wallet balances, test documents, and active prescriptions.</p>
          <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('business')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Business Portal</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Launch the commercial dashboard featuring simulated Metrc syncs, B2B transactions, and compliance flags.</p>
          <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('provider')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Stethoscope size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Provider Network</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Demo the healthcare physician portal with mock patient consultations and certification workflows.</p>
          <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('attorney')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Scale size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Attorney Dashboard</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Showcase the legal services portal with mock pro-se filings and client communication logs.</p>
          <div className="mt-8 flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('oversight')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-800 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-slate-200 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Gavel size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">State Regulatory Oversight</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Present the advanced OMMA/State Regulator mock dashboard, demonstrating comprehensive ecosystem tracking and AI intervention logs.</p>
          <div className="mt-8 flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('federal')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-500 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Federal Command</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Launch the DOJ/DEA oversight mock dashboard with federal agency data flows.</p>
          <div className="mt-8 flex items-center gap-2 text-slate-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('enforcement')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-800 transition-all group text-left relative overflow-hidden flex flex-col lg:col-span-3"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-slate-200 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Shield size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Law Enforcement</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Present the RIP Command dashboard with mock breathalyzer tests and field screening logs.</p>
          <div className="mt-8 flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-widest">
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
