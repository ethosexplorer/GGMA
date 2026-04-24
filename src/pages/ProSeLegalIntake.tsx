import React, { useState } from 'react';
import { 
  Scale, FileText, AlertTriangle, ShieldAlert, CalendarClock, 
  ChevronRight, CheckCircle2, UserCheck, Lock, Gavel, FileSignature
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const ProSeLegalIntake = ({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    caseType: '',
    courtLevel: '',
    industryScope: '',
    hasDeadlines: false,
    deadlinesDesc: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    opposingCounselMisconduct: false,
    misconductDesc: '',
    summary: ''
  });

  const handleNext = () => setStep(step + 1);

  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenenterprize/15-min-meeting' });
    } else {
      window.open('https://calendly.com/globalgreenenterprize/15-min-meeting', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200/50 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
            <Scale size={24} className="text-amber-400" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-xl text-slate-800 tracking-tight block">GGHP Legal Advocacy</span>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">Legal Intake • Strategy • Empowerment</span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
        >
          Cancel Intake
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Legal Advocacy Intake</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            The legal system often weaponizes procedure against those fighting for the truth. Our Legal Advocacy program is designed to level the playing field and help the righteous win—whether you need ethical representation or guidance to fight Pro Se.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: 'Case Triage' },
            { num: 2, label: 'Incident Details' },
            { num: 3, label: 'Rights Violation Scan' },
            { num: 4, label: 'Schedule Review' }
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all",
                step === s.num ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : 
                step > s.num ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-400"
              )}>
                {step > s.num ? <CheckCircle2 size={18} /> : s.num}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                step === s.num ? "text-amber-600" : step > s.num ? "text-slate-800" : "text-slate-400"
              )}>{s.label}</span>
              {i < 3 && <div className="w-12 h-px bg-slate-200"></div>}
            </div>
          ))}
        </div>

        {/* Forms */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-8">
                  <FileText className="text-amber-500" size={24} />
                  <h2 className="text-2xl font-black text-slate-800">Initial Case Triage</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Court Level</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700"
                      value={formData.courtLevel}
                      onChange={e => setFormData({...formData, courtLevel: e.target.value})}
                    >
                      <option value="">Select Jurisdiction Level...</option>
                      <option value="federal_district">Federal District Court</option>
                      <option value="federal_appellate">Federal Appellate Court (Circuit)</option>
                      <option value="state_civil">State Court (Civil)</option>
                      <option value="state_criminal">State Court (Criminal)</option>
                      <option value="municipal">Municipal Court</option>
                      <option value="administrative">Administrative / Regulatory Agency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Industry Scope</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium text-slate-700"
                      value={formData.industryScope}
                      onChange={e => setFormData({...formData, industryScope: e.target.value})}
                    >
                      <option value="">Select Scope...</option>
                      <option value="cannabis">Cannabis Related</option>
                      <option value="non_cannabis">Non-Cannabis Related</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nature of Suit</label>
                    <input 
                      type="text" placeholder="e.g., Copyright Infringement, Civil Rights, Corporate Fraud"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 font-medium text-slate-700"
                      value={formData.caseType}
                      onChange={e => setFormData({...formData, caseType: e.target.value})}
                    />
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                        checked={formData.hasDeadlines}
                        onChange={e => setFormData({...formData, hasDeadlines: e.target.checked})}
                      />
                      <span className="font-bold text-slate-700">I have impending court deadlines within the next 14 days.</span>
                    </label>
                    {formData.hasDeadlines && (
                      <input 
                        type="text" placeholder="Describe deadlines (e.g., Reply Brief due May 12th)"
                        className="w-full mt-3 p-3 bg-white border border-amber-200 rounded-lg text-sm"
                        value={formData.deadlinesDesc}
                        onChange={e => setFormData({...formData, deadlinesDesc: e.target.value})}
                      />
                    )}
                  </div>
                  <button onClick={handleNext} disabled={!formData.courtLevel || !formData.caseType || !formData.industryScope} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all mt-8">
                    Continue to Incident Details <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-8">
                  <AlertTriangle className="text-amber-500" size={24} />
                  <h2 className="text-2xl font-black text-slate-800">Incident Details</h2>
                </div>
                
                <p className="text-slate-600 mb-6 font-medium">To properly evaluate your needs (e.g., criminal defense, civil rights violation, traffic stop, or corporate litigation), provide the specific occurrence details below.</p>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Date of Occurrence</label>
                      <input 
                        type="date"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 font-medium text-slate-700"
                        value={formData.incidentDate}
                        onChange={e => setFormData({...formData, incidentDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Time of Occurrence</label>
                      <input 
                        type="time"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 font-medium text-slate-700"
                        value={formData.incidentTime}
                        onChange={e => setFormData({...formData, incidentTime: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location / Jurisdiction</label>
                    <input 
                      type="text" placeholder="e.g., City, County, or Specific Address"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 font-medium text-slate-700"
                      value={formData.incidentLocation}
                      onChange={e => setFormData({...formData, incidentLocation: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Statement of Facts</label>
                    <textarea 
                      rows={5}
                      placeholder="Give a clear chronological statement of what happened, case numbers (if any), and charges/claims involved..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 font-medium text-slate-700"
                      value={formData.summary}
                      onChange={e => setFormData({...formData, summary: e.target.value})}
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
                      Back
                    </button>
                    <button onClick={handleNext} disabled={!formData.summary} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all">
                    Continue to Rights Violation Scan <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-8">
                  <ShieldAlert className="text-red-500" size={24} />
                  <h2 className="text-2xl font-black text-slate-800">Rights Violation & Misconduct Scan</h2>
                </div>
                
                <p className="text-slate-600 mb-6 font-medium">Opposing counsel and law enforcement frequently use procedural traps, manufactured evidence, and intimidation. Document any suspected misconduct or rights violations below.</p>

                <div className="space-y-6">
                  <div className="bg-red-50/30 border border-red-100 rounded-xl p-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500"
                        checked={formData.opposingCounselMisconduct}
                        onChange={e => setFormData({...formData, opposingCounselMisconduct: e.target.checked})}
                      />
                      <span className="font-bold text-slate-700">Opposing counsel or parties have engaged in misconduct or spoliation.</span>
                    </label>
                  </div>
                  
                  {formData.opposingCounselMisconduct && (
                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail the Misconduct</label>
                      <textarea 
                        rows={4}
                        placeholder="e.g., Ignored defaults, claimed sovereign immunity improperly, submitted false demonstrative evidence, locked out of accounts..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-red-500 font-medium text-slate-700"
                        value={formData.misconductDesc}
                        onChange={e => setFormData({...formData, misconductDesc: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(2)} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
                      Back
                    </button>
                    <button onClick={handleNext} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                      Finalize & Schedule <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-8">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarClock size={40} className="text-amber-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">Intake Complete. Let's Strategize.</h2>
                <p className="text-slate-600 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
                  Your case details have been securely logged. Once you schedule your session, I will review the intake. If this is a case you can handle yourself (Pro Se), I will help you build your strategy. If it requires formal representation, I will match you with the appropriate ethical attorney and provide a direct referral.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Gavel className="text-slate-400" size={20} />
                    <span className="text-sm font-bold text-slate-700">Advocacy Lead: Shantell Robinson</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileSignature className="text-slate-400" size={20} />
                    <span className="text-sm font-bold text-slate-700">Status: Enrolled Paralegal (May 2026)</span>
                  </div>
                </div>

                <button onClick={openCalendly} className="px-8 py-5 bg-[#0069ff] text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 mx-auto">
                  <CalendarClock size={24} /> Schedule Strategy Session
                </button>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">Powered by Calendly Secure Scheduling</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
