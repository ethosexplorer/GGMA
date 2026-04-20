import React, { useState } from 'react';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, DollarSign, ChevronRight, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const applicationTypes = [
  { id: 'new_card', title: 'New Medical Card', desc: 'First-time cannabis patient card application', status: null, icon: '🌿' },
  { id: 'renewal', title: 'Card Renewal', desc: 'Renew your existing medical marijuana card', status: null, icon: '🔄' },
  { id: 'caregiver', title: 'Caregiver Application', desc: 'Apply to be a designated caregiver', status: null, icon: '🤝' },
  { id: 'amendment', title: 'Card Amendment', desc: 'Update information on your existing card', status: null, icon: '📝' },
];

const activeApplications = [
  { id: 'APP-2026-4421', type: 'New Medical Card', submitted: 'Apr 14, 2026', status: 'Under Review', progress: 65 },
  { id: 'APP-2026-3892', type: 'Card Renewal', submitted: 'Mar 28, 2026', status: 'Approved', progress: 100 },
];

const applicationSteps = [
  { step: 1, title: 'Personal Information', desc: 'Name, DOB, address, contact info', completed: true },
  { step: 2, title: 'Medical Information', desc: 'Qualifying conditions, physician info', completed: true },
  { step: 3, title: 'Document Upload', desc: 'Photo ID, doctor recommendation', completed: true },
  { step: 4, title: 'State Fee Payment', desc: 'State application fee (separate from subscription)', completed: false },
  { step: 5, title: 'Review & Submit', desc: 'Final review before submission', completed: false },
];

export const ApplicationsTab = () => {
  const [view, setView] = useState<'hub' | 'new'>('hub');
  const [hasStateInsurance, setHasStateInsurance] = useState<boolean | null>(null);

  const stateFee = hasStateInsurance ? 20.00 : 100.00;
  const processingFee = hasStateInsurance ? 2.50 : 4.30;
  const totalFee = stateFee + processingFee;

  return (
    <div className="space-y-6">
      {/* Important Notice */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 text-sm">Free to Apply — State Fees at Submission Only</h4>
            <p className="text-xs text-blue-700 mt-1">
              Applications are free to start and complete. State fees are only required when you submit your application for approval. 
              These fees are set by the state and are <strong>separate from any GGP-OS subscription</strong>. No subscription is needed to apply.
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
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
          {/* Active Applications */}
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
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        app.status === 'Approved' ? "bg-emerald-50 text-emerald-700" :
                        app.status === 'Under Review' ? "bg-amber-50 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {app.status}
                      </span>
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
                <p className="text-sm">Start a new application to get your medical card</p>
              </div>
            )}
          </div>

          {/* State Fee Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" /> State Fee Schedule
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">With State-Funded Insurance</p>
                  <p className="text-xs text-emerald-700 mb-2">Medicaid, Medicare, SoonerCare, 100% Veteran</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-700">State Fee</span>
                    <span className="font-bold text-emerald-800">$20.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-700">Processing Fee</span>
                    <span className="font-bold text-emerald-800">$2.50</span>
                  </div>
                  <div className="border-t border-emerald-300 mt-2 pt-2 flex justify-between text-sm">
                    <span className="font-bold text-emerald-800">Total</span>
                    <span className="font-black text-emerald-900 text-lg">$22.50</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Without State-Funded Insurance</p>
                  <p className="text-xs text-slate-500 mb-2">Standard rate for all other applicants</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">State Fee</span>
                    <span className="font-bold text-slate-800">$100.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Processing Fee</span>
                    <span className="font-bold text-slate-800">$4.30</span>
                  </div>
                  <div className="border-t border-slate-300 mt-2 pt-2 flex justify-between text-sm">
                    <span className="font-bold text-slate-700">Total</span>
                    <span className="font-black text-slate-900 text-lg">$104.30</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">* State fees are set by the state authority and are separate from GGP-OS subscription costs. Fees are collected at the time of application submission only.</p>
            </div>
          </div>
        </div>
      )}

      {view === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Types */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-4">Choose Application Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicationTypes.map((app) => (
                <button key={app.id} className="text-left p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group">
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

          {/* Application Steps Preview */}
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
                    <p className={cn("font-bold text-sm", step.completed ? "text-emerald-700" : "text-slate-800")}>{step.title}</p>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Insurance Selection */}
            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-xs font-bold text-blue-800 mb-3">Do you have state-funded insurance?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setHasStateInsurance(true)}
                  className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                    hasStateInsurance === true ? "bg-emerald-500 text-white" : "bg-white text-slate-600 border border-slate-200"
                  )}
                >
                  Yes — $22.50
                </button>
                <button
                  onClick={() => setHasStateInsurance(false)}
                  className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                    hasStateInsurance === false ? "bg-slate-700 text-white" : "bg-white text-slate-600 border border-slate-200"
                  )}
                >
                  No — $104.30
                </button>
              </div>
              {hasStateInsurance !== null && (
                <p className="text-[10px] text-blue-600 mt-2">State fee: ${stateFee.toFixed(2)} + Processing: ${processingFee.toFixed(2)} = <strong>${totalFee.toFixed(2)}</strong> due at submission</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
