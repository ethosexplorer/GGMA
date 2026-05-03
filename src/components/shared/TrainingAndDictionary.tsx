import React, { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle, AlertCircle, Video, FileText, ArrowRight, ShieldAlert, GraduationCap, Dictionary } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'interactive' | 'exam';
  failed?: boolean;
}

export const TrainingAndDictionary = ({ role = 'business', onScheduleConsult }: { role?: string, onScheduleConsult?: () => void }) => {
  const [activeTab, setActiveTab] = useState<'training' | 'dictionary' | 'qna'>('training');
  const [modules, setModules] = useState<Module[]>(
    role === 'business' ? [
      { id: 'b1', title: 'System Implementation & Navigation', duration: '45 mins', completed: true, type: 'video' },
      { id: 'b2', title: 'Metrc Sandbox Operations & Directives', duration: '60 mins', completed: false, type: 'interactive' },
      { id: 'b3', title: 'POS Sync & Compliance Guardrails', duration: '30 mins', completed: false, type: 'video' },
      { id: 'b4', title: 'Final Certification Exam', duration: '30 mins', completed: false, type: 'exam' }
    ] : role === 'provider' ? [
      { id: 'p1', title: 'Platform Onboarding & Navigation', duration: '30 mins', completed: true, type: 'video' },
      { id: 'p2', title: 'State Certification API Mapping', duration: '45 mins', completed: false, type: 'interactive' },
      { id: 'p3', title: 'Telehealth Compliance & Charting', duration: '45 mins', completed: false, type: 'video' },
      { id: 'p4', title: 'Final Certification Exam', duration: '30 mins', completed: false, type: 'exam' }
    ] : [
      { id: 'a1', title: 'Legal Portal Navigation & Vault', duration: '30 mins', completed: true, type: 'video' },
      { id: 'a2', title: 'HIPAA & Compliance Intake', duration: '45 mins', completed: false, type: 'interactive' },
      { id: 'a3', title: 'Retainer & Care Wallet Escrow', duration: '30 mins', completed: false, type: 'video' },
      { id: 'a4', title: 'Final Certification Exam', duration: '30 mins', completed: false, type: 'exam' }
    ]
  );
  
  const [examState, setExamState] = useState<'idle' | 'taking' | 'failed' | 'passed'>('idle');

  const handleSimulateExam = () => {
    setExamState('taking');
    setTimeout(() => {
      // Simulate failure scenario to trigger 1-on-1 consult
      setExamState('failed');
      setModules(prev => prev.map(m => m.type === 'exam' ? { ...m, failed: true } : m));
    }, 2000);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('training')} className={cn("flex-1 py-4 font-bold flex items-center justify-center gap-2", activeTab === 'training' ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500" : "text-slate-500 hover:bg-slate-50")}>
          <GraduationCap size={18} /> Implementation Training
        </button>
        <button onClick={() => setActiveTab('dictionary')} className={cn("flex-1 py-4 font-bold flex items-center justify-center gap-2", activeTab === 'dictionary' ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500" : "text-slate-500 hover:bg-slate-50")}>
          <BookOpen size={18} /> System Dictionary
        </button>
        <button onClick={() => setActiveTab('qna')} className={cn("flex-1 py-4 font-bold flex items-center justify-center gap-2", activeTab === 'qna' ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500" : "text-slate-500 hover:bg-slate-50")}>
          <HelpCircle size={18} /> Reference Q&A Guides
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === 'training' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
              <ShieldAlert className="text-amber-600 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-black text-amber-900 tracking-tight">Mandatory Go-Live Requirement</h3>
                <p className="text-amber-800/80 font-medium mt-1">
                  All users must complete their respective implementation & compliance modules within <strong>14 days</strong> prior to ecosystem activation.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100/50 w-fit px-3 py-1.5 rounded-lg border border-amber-200/50">
                  <AlertCircle size={14} /> Deadline: May 16, 2026
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {modules.map((mod, idx) => (
                <div key={mod.id} className={cn("p-4 rounded-xl border flex items-center justify-between", mod.completed ? "bg-emerald-50/50 border-emerald-100" : mod.failed ? "bg-red-50 border-red-200" : "bg-white border-slate-200")}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", mod.completed ? "bg-emerald-100 text-emerald-600" : mod.failed ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400")}>
                      {mod.completed ? <CheckCircle size={20} /> : mod.failed ? <AlertCircle size={20} /> : mod.type === 'video' ? <Video size={18} /> : mod.type === 'exam' ? <FileText size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{idx + 1}. {mod.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{mod.type === 'exam' ? 'Certification Exam' : `${mod.duration} • ${mod.type.charAt(0).toUpperCase() + mod.type.slice(1)}`}</p>
                    </div>
                  </div>
                  <div>
                    {mod.completed ? (
                      <span className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} /> Completed</span>
                    ) : mod.failed ? (
                      <span className="text-red-600 text-sm font-bold flex items-center gap-1">Failed</span>
                    ) : mod.type === 'exam' ? (
                      <button 
                        onClick={handleSimulateExam} 
                        disabled={examState === 'taking'}
                        className="px-4 py-2 bg-[#1a4731] hover:bg-[#153a28] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {examState === 'taking' ? 'Taking Exam...' : 'Begin Exam'} <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Start Module</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {examState === 'failed' && (
              <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center text-center">
                <AlertCircle size={32} className="text-red-500 mb-3" />
                <h3 className="text-xl font-black text-red-900 mb-2">Certification Failed</h3>
                <p className="text-red-700 font-medium mb-6 max-w-md">
                  You did not meet the passing requirements for the implementation exam. Per protocol, you must schedule a 1-on-1 consult with a GGE Trainer before retaking the exam.
                </p>
                <button 
                  onClick={() => {
                    alert('Consultation scheduled. GGE World HR has been notified.');
                    if (onScheduleConsult) onScheduleConsult();
                  }} 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Schedule 1-on-1 Consult (GGE World)
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <BookOpen className="text-indigo-600" /> Platform Dictionary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                const common = [
                  { t: "L.A.R.R.Y", d: "Logical Analysis & Regulatory Reporting Yield. The core compliance AI monitoring engine." },
                  { t: "C³ Score", d: "Compassion Compliance Currency. A behavioral score reflecting system adherence." },
                  { t: "Care Wallet", d: "Closed-loop stored-value infrastructure for patient loyalty and purchases." }
                ];
                let terms = common;
                if (role === 'business') {
                  terms = [...common,
                    { t: "Metrc Sandbox", d: "Regulatory environment for testing plant/package tracking without state reporting." },
                    { t: "SINC", d: "Secure Inventory Node Control. Internal synchronization with Metrc." }
                  ];
                } else if (role === 'provider') {
                  terms = [...common,
                    { t: "Aura Provider Network", d: "The proprietary telehealth and physician certification sub-network." }
                  ];
                } else if (role === 'attorney') {
                  terms = [...common,
                    { t: "Legal Vault", d: "Encrypted storage for patient intake forms, HIPAA releases, and compliance documentation." }
                  ];
                } else if (role === 'internal_admin') {
                  terms = [...common,
                    { t: "Metrc Sandbox", d: "Regulatory environment for testing plant/package tracking without state reporting." },
                    { t: "SINC", d: "Secure Inventory Node Control. Internal synchronization with Metrc." },
                    { t: "GGE World HR", d: "The Master Oversight Hub for training, recruitment, and personnel command." },
                    { t: "Aura Provider Network", d: "The proprietary telehealth and physician certification sub-network." }
                  ];
                }
                return terms;
              })().map((term, i) => (
                <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-black text-slate-800 text-lg">{term.t}</h4>
                  <p className="text-slate-600 mt-2 font-medium leading-relaxed">{term.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'qna' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <HelpCircle className="text-blue-600" /> Essential Navigation Q&A
            </h2>
            <div className="space-y-4">
              {(() => {
                const common = [
                  { q: "What happens if I fail the implementation exam?", a: "Your account will be temporarily flagged. You must schedule a 1-on-1 consultation which is logged in GGE World HR Hub before retaking the exam." },
                  { q: "Where can I view active compliance alerts?", a: "L.A.R.R.Y alerts appear on your main dashboard under the 'Readiness' or 'Action Req.' modules. Click to resolve." },
                  { q: "When is the Go-Live deadline?", a: "All required documentation and modules must be completed 14 days before your jurisdiction's scheduled go-live date." }
                ];
                let faqs = common;
                if (role === 'business') {
                  faqs = [...common,
                    { q: "How do I sync my local inventory with Metrc?", a: "Navigate to your Dashboard > SINC Inventory Tab > Click 'Sync Engine' to perform an automatic reconciliation with your Metrc API key." },
                    { q: "How do I process a Care Wallet payment?", a: "In the POS tab, select 'Care Wallet' as the tender type. The patient will present their digital QR or NFC ID for instant deduction." }
                  ];
                } else if (role === 'provider') {
                  faqs = [...common,
                    { q: "How do I certify a patient?", a: "Open the patient's chart from the Queue, verify their medical history, and click 'Submit to State API' to automatically file the certification." }
                  ];
                } else if (role === 'attorney') {
                  faqs = [...common,
                    { q: "How do I accept a new case?", a: "Review the intake in your 'Case Pipeline'. Clicking 'Accept' automatically deducts the retainer from the patient's Care Wallet into your escrow." }
                  ];
                }
                return faqs;
              })().map((faq, i) => (
                <div key={i} className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">Q:</span> {faq.q}
                  </h4>
                  <p className="text-slate-600 font-medium pl-6">
                    <span className="text-slate-400 font-bold mr-1">A:</span> {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
