import React, { useState } from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SystemDictionary = ({ role = 'patient' }: { role?: string }) => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'qna'>('dictionary');

  const getDictionaryTerms = () => {
    const common = [
      { t: "L.A.R.R.Y", d: "Logical Analysis & Regulatory Reporting Yield. The core compliance AI monitoring engine." },
      { t: "C³ Score", d: "Compassion Compliance Currency. A behavioral score reflecting system adherence." },
      { t: "Care Wallet", d: "Closed-loop stored-value infrastructure for patient loyalty and purchases." }
    ];
    
    if (role === 'business') {
      return [...common, 
        { t: "Metrc Sandbox", d: "Regulatory environment for testing plant/package tracking without state reporting." },
        { t: "SINC", d: "Secure Inventory Node Control. Internal synchronization with Metrc." }
      ];
    }
    if (role === 'provider') {
      return [...common,
        { t: "Aura Provider Network", d: "The proprietary telehealth and physician certification sub-network." },
        { t: "State Certification API", d: "Direct pipeline to OMMA/State databases for automated patient approvals." }
      ];
    }
    if (role === 'attorney') {
      return [...common,
        { t: "Legal Vault", d: "Encrypted storage for patient intake forms, HIPAA releases, and compliance documentation." },
        { t: "Care Wallet Escrow", d: "Trust accounting integration for retainer fees processed via the Care Wallet." }
      ];
    }
    
    // Patient
    return [...common,
      { t: "NomadCash", d: "Your virtual card tied to the Care Wallet for secure dispensary purchases." },
      { t: "Telehealth Node", d: "Secure portal for remote physician consultations and medical card renewals." }
    ];
  };

  const getQnATerms = () => {
    if (role === 'business') {
      return [
        { q: "How do I sync my local inventory with Metrc?", a: "Navigate to your Dashboard > SINC Inventory Tab > Click 'Sync Engine' to perform an automatic reconciliation with your Metrc API key." },
        { q: "How do I process a Care Wallet payment?", a: "In the POS tab, select 'Care Wallet' as the tender type. The patient will present their digital QR or NFC ID for instant deduction." },
        { q: "Where can I view active compliance alerts?", a: "L.A.R.R.Y alerts appear on your main dashboard under the 'Readiness' or 'Action Req.' modules. Click to resolve." }
      ];
    }
    if (role === 'provider') {
      return [
        { q: "How do I certify a patient?", a: "Open the patient's chart from the Queue, verify their medical history, and click 'Submit to State API' to automatically file the certification." },
        { q: "Where do telehealth links generate?", a: "When a patient books, L.A.R.R.Y automatically creates a secure WebRTC room in your 'Upcoming Appointments' tab." }
      ];
    }
    if (role === 'attorney') {
      return [
        { q: "How do I accept a new case?", a: "Review the intake in your 'Case Pipeline'. Clicking 'Accept' automatically deducts the retainer from the patient's Care Wallet into your escrow." },
        { q: "Are the documents HIPAA compliant?", a: "Yes, all files stored in the Legal Vault are encrypted at rest and meet state/federal HIPAA compliance standards." }
      ];
    }
    
    // Patient
    return [
      { q: "How do I load funds into my Care Wallet?", a: "Click the 'Load Funds' button on your Care Wallet tab to connect a bank account or find a cash reload kiosk." },
      { q: "How do I book a doctor's appointment?", a: "Go to the Telehealth tab, select an available Provider, and use your Care Wallet balance to secure the time slot." },
      { q: "Why is my C³ Score important?", a: "A higher C³ Score unlocks rewards, discounts on state fees, and premium telehealth access within the Compassion Network." }
    ];
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('dictionary')} className={cn("flex-1 py-4 font-bold flex items-center justify-center gap-2", activeTab === 'dictionary' ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500" : "text-slate-500 hover:bg-slate-50")}>
          <BookOpen size={18} /> System Dictionary
        </button>
        <button onClick={() => setActiveTab('qna')} className={cn("flex-1 py-4 font-bold flex items-center justify-center gap-2", activeTab === 'qna' ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500" : "text-slate-500 hover:bg-slate-50")}>
          <HelpCircle size={18} /> Reference Q&A Guides
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === 'dictionary' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {getDictionaryTerms().map((term, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors">
                  <h4 className="font-black text-slate-800 text-sm mb-1">{term.t}</h4>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">{term.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'qna' && (
          <div className="space-y-4">
            {getQnATerms().map((faq, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 shadow-sm rounded-2xl">
                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">Q:</span> {faq.q}
                </h4>
                <p className="text-slate-600 text-xs font-medium pl-6">
                  <span className="text-slate-400 font-bold mr-1">A:</span> {faq.a}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
