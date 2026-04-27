import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2, AlertTriangle, ChevronRight, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CannabisCertWizard = ({ onCancel, onComplete }: { onCancel: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationDone(true);
      setStep(2);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl w-full">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        {[
          { id: 1, label: 'OMMA 2026 Verification' },
          { id: 2, label: 'Medical Assessment' },
          { id: 3, label: 'Issue & File' }
        ].map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
              step > s.id ? "bg-emerald-500 text-white" : step === s.id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "bg-slate-100 text-slate-400"
            )}>
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className={cn("text-xs font-bold", step >= s.id ? "text-slate-800" : "text-slate-400")}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[250px]">
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Shield className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-blue-900">Larry Enforcement Check</h4>
                <p className="text-sm text-blue-800 mt-1">Starting in 2026, OMMA requires real-time verification of Provider Education Credits (CME) and Patient ID against the state database before certification.</p>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Patient Identity (State ID)</span>
                {isVerifying ? <span className="text-sm text-blue-500 font-bold animate-pulse">Verifying...</span> : verificationDone ? <CheckCircle2 className="text-emerald-500" size={18} /> : <span className="text-sm text-slate-400">Pending</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Provider CME Compliance</span>
                {isVerifying ? <span className="text-sm text-blue-500 font-bold animate-pulse">Verifying...</span> : verificationDone ? <CheckCircle2 className="text-emerald-500" size={18} /> : <span className="text-sm text-slate-400">Pending</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Patient Active Limits Check</span>
                {isVerifying ? <span className="text-sm text-blue-500 font-bold animate-pulse">Verifying...</span> : verificationDone ? <CheckCircle2 className="text-emerald-500" size={18} /> : <span className="text-sm text-slate-400">Pending</span>}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleVerify} 
                disabled={isVerifying}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isVerifying ? 'Scanning Database...' : 'Run State Verification'} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Qualifying Condition</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Chronic, Severe, or Intractable Pain</option>
                  <option>Severe Nausea</option>
                  <option>Muscle Spasms</option>
                  <option>Epilepsy / Seizures</option>
                  <option>Terminal Illness</option>
                  <option>Cancer</option>
                  <option>Glaucoma</option>
                  <option>HIV / AIDS</option>
                  <option>Post-Traumatic Stress Disorder (PTSD)</option>
                  <option>Amyotrophic Lateral Sclerosis (ALS)</option>
                  <option>Crohn's Disease</option>
                  <option>Parkinson's Disease</option>
                  <option>Multiple Sclerosis (MS)</option>
                  <option>Intractable Migraines</option>
                  <option>Cachexia / Wasting Syndrome</option>
                  <option>Anorexia</option>
                  <option>Autism (with severe behaviors)</option>
                  <option>Neuropathy</option>
                  <option>Other / Physician Discretion (Subject to OMMA review)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Duration</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>2 Years (Standard)</option>
                  <option>60 Days (Short-Term)</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Physician Notes (Optional)</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Enter notes for patient portal..."
              ></textarea>
            </div>
            
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
                Continue to Review <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <FileText className="text-emerald-500 mx-auto mb-2" size={32} />
              <h4 className="font-bold text-emerald-900 text-lg">Ready to Issue</h4>
              <p className="text-sm text-emerald-800 mt-1">This will automatically file the certification via OMMA API, update the Patient's Care Wallet, and log a HIPAA-compliant audit trail.</p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <input type="checkbox" className="mt-1" defaultChecked />
                <p>I attest under penalty of perjury that I have conducted an appropriate medical assessment and this patient meets the state qualifications.</p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Back</button>
              <button onClick={onComplete} className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all">
                Sign & File Certification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
