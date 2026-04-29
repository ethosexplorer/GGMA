import React, { useState } from 'react';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, DollarSign, ChevronRight, Info, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const applicationTypes = [
  { id: 'new_license', title: 'New Commercial License', desc: 'First-time commercial entity application (Grower, Dispensary, Processor)', status: null, icon: '🏢' },
  { id: 'renewal', title: 'License Renewal', desc: 'Renew your existing commercial license', status: null, icon: '🔄' },
  { id: 'amendment', title: 'License Amendment / Relocation', desc: 'Update location or ownership structure', status: null, icon: '📝' },
  { id: 'transporter', title: 'Transporter License', desc: 'Apply for a standalone or secondary transporter permit', status: null, icon: '🚚' },
  { id: 'waste', title: 'Waste Disposal Facility', desc: 'Apply for a commercial waste disposal permit', status: null, icon: '♻️' },
];

export const BusinessApplicationsTab = ({ user, onStartApplication }: { user?: any, onStartApplication?: () => void }) => {
  const [view, setView] = useState<'hub' | 'new'>('hub');
  const [paymentState, setPaymentState] = useState<'idle' | 'invoicing' | 'sent' | 'paid'>('idle');

  const hasIntakeData = !!(user?.email);

  const activeApplications = [
    ...(hasIntakeData ? [{
      id: `SYNC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'New Commercial License (L.A.R.R.Y Sync)',
      submitted: 'Draft Auto-Generated',
      status: 'Ready for Review',
      progress: 85,
      isSync: true
    }] : []),
    { id: 'APP-2026-B882', type: 'Transporter License', submitted: 'Apr 14, 2026', status: 'Under Review', progress: 65 },
  ];

  const applicationSteps = [
    { step: 1, title: 'Entity Information', desc: 'Business name, structure, address', completed: hasIntakeData, syncSource: 'L.A.R.R.Y AI' },
    { step: 2, title: 'Ownership & Officers', desc: 'Primary point of contact, owners info', completed: hasIntakeData, syncSource: 'L.A.R.R.Y AI' },
    { step: 3, title: 'Document Upload', desc: 'Cert of Good Standing, Lease/Deed, Bond', completed: false },
    { step: 4, title: 'Compliance Verifications', desc: '1000ft school distance, Tribal land attest', completed: false },
    { step: 5, title: 'Review & Submit', desc: 'Final review and state submission', completed: false },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 text-sm">2026 Business Application Processing</h4>
            <div className="text-xs text-blue-700 mt-2 grid grid-cols-2 gap-y-1 max-w-md">
              <span>• Application Sync Fee (GGE):</span> <span className="font-bold text-[#1a4731]">$25.00</span>
            </div>
            <p className="text-[10px] text-blue-500 mt-2 italic">* State Fees (e.g. $2,500.00 for Grower/Processor/Dispensary) are separate and paid directly to OMMA upon submission.</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">2026 Bond Requirement (Growers)</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Medical marijuana growers must submit a surety bond or prove land ownership for at least 5 years prior to application. Ensure your documents are prepared before starting a Grower application.
            </p>
          </div>
        </div>
      </div>

      <div className="flex bg-white rounded-xl border border-slate-200 p-1 w-max shadow-sm">
        <button
          onClick={() => setView('hub')}
          className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", view === 'hub' ? "bg-[#1a4731] text-white shadow-md" : "text-slate-500 hover:text-slate-700")}
        >
          My Applications
        </button>
        <button
          onClick={() => setView('new')}
          className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", view === 'new' ? "bg-[#1a4731] text-white shadow-md" : "text-slate-500 hover:text-slate-700")}
        >
          New Application
        </button>
      </div>

      {view === 'hub' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-6">Active Applications</h3>
            {activeApplications.length > 0 ? (
              <div className="space-y-4">
                {activeApplications.map((app) => (
                  <div key={app.id} className="p-5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-slate-900">{app.type}</p>
                        <p className="text-xs text-slate-500">{app.id} • Submitted {app.submitted}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          app.status === 'Approved' ? "bg-emerald-50 text-emerald-700" :
                          app.status === 'Under Review' ? "bg-amber-50 text-amber-700" :
                          app.status === 'Ready for Review' ? "bg-blue-50 text-blue-700" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          {app.status}
                        </span>
                        {(app as any).isSync && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-md border border-emerald-100 uppercase tracking-tighter">
                            <Sparkles size={10} /> L.A.R.R.Y Sync
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", app.progress === 100 ? "bg-emerald-500" : "bg-blue-500")}
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{app.progress}% complete</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileText size={40} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium">No active applications</p>
                <p className="text-sm">Start a new application to register your business</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-[#1a4731] rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Platform Processing</h4>
               <p className="text-sm font-bold mb-4">Complete your business application directly or transmit your records for a $25 processing fee.</p>
               <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs flex justify-between items-center">
                    <span className="text-emerald-200">GGE Sync Processing:</span>
                    <span className="font-black text-lg">$25.00</span>
                  </div>
                  {paymentState === 'idle' && (
                    <button 
                      onClick={() => {
                        setPaymentState('invoicing');
                        setTimeout(() => setPaymentState('sent'), 1500);
                      }}
                      className="w-full py-3 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
                    >
                      💳 Pay $25 Processing Fee
                    </button>
                  )}

                  {paymentState === 'invoicing' && (
                    <button disabled className="w-full py-3 bg-emerald-500/50 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2">
                      Generating Invoice...
                    </button>
                  )}

                  {paymentState === 'sent' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-xl border border-blue-500/30 text-center">
                        Invoice sent! Please check your email and complete the $25 payment to continue.
                      </div>
                      <button 
                        onClick={() => setPaymentState('paid')}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all"
                      >
                        ✅ I Have Paid
                      </button>
                    </div>
                  )}

                  {paymentState === 'paid' && (
                    <div className="space-y-2">
                      <div className="p-3 bg-emerald-500/20 text-emerald-200 text-xs font-bold rounded-xl border border-emerald-500/30 text-center flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Payment Verified
                      </div>
                      <a 
                        href="https://oklahoma.gov/omma/apply.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
                      >
                        🚀 Start OMMA Application
                      </a>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="pt-2 mt-2">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter mb-1">Direct Support Lines</p>
                      <p className="text-[10px] text-white/70">Compliance Desk: <span className="font-bold text-white">1-888-963-4447</span></p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" /> State Fee Schedule
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Standard Commercial</p>
                  <p className="text-xs text-emerald-700 mb-2">Dispensary, Grower, Processor</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-700">State Fee</span>
                    <span className="font-bold text-emerald-800">$2,500.00</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Other Entities</p>
                  <p className="text-xs text-slate-500 mb-2">Waste, Transporter</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">State Fee</span>
                    <span className="font-bold text-slate-800">$500.00 / $2,000.00</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">* State fees are set by the state authority and are separate from GGP-OS subscription costs. Fees are collected at the time of application submission directly to OMMA.</p>
            </div>
          </div>
        </div>
      )}

      {view === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Choose Application Type</h3>
              {hasIntakeData && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Intake Sync Active</span>
                </div>
              )}
            </div>
            {hasIntakeData && (
               <div className="mb-6 p-4 bg-emerald-900 text-white rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Elite Automation Active</p>
                    <p className="text-sm font-medium">Your L.A.R.R.Y intake data has been detected. We will automatically pre-fill your application.</p>
                  </div>
                  <CheckCircle size={24} className="text-emerald-400" />
               </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicationTypes.map((app) => (
                <button 
                  key={app.id} 
                  onClick={() => {
                      if(onStartApplication) onStartApplication();
                      else window.open('https://oklahoma.gov/omma/apply.html', '_blank');
                  }}
                  className="text-left p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="text-2xl mb-3">{app.icon}</div>
                  <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{app.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{app.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Application <ChevronRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4">Application Steps</h3>
            <div className="space-y-4">
              {applicationSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    step.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {step.completed ? <CheckCircle size={14} /> : step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={cn("font-bold text-sm", step.completed ? "text-emerald-700" : "text-slate-800")}>{step.title}</p>
                      {(step as any).syncSource && (
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-0.5">
                          <CheckCircle size={8} /> {(step as any).syncSource}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
