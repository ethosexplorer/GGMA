import React from 'react';
import { ArrowLeft, Shield, Scale, AlertTriangle, CheckCircle2, Lock, XCircle, Database, MapPin } from 'lucide-react';

export const FederalStatePage = ({ onBack, onNavigate }: { onBack: () => void, onNavigate?: (view: string) => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* 🏛️ DEA Schedule III Ready Banner (Repurposed as Hero) */}
      <section className="relative bg-[#0b1120] border-b-8 border-indigo-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20" />
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-200 hover:text-white font-bold text-sm mb-12 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </button>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                Federal Compliance Ready
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
                DEA Schedule III<br />
                <span className="text-indigo-400">Registration Ready</span>
              </h1>
              
              <p className="text-lg text-indigo-100/80 leading-relaxed font-medium">
                GGP-OS maps directly to all 5 primary sections of the DEA's federal registration application. State-licensed dispensaries can prepare, verify, and export their compliance data — all from one platform.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                 <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                    <Database size={16} className="text-indigo-400" />
                    <span className="text-white font-bold text-xs">Metrc Integrated</span>
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="text-white font-bold text-xs">State Certified</span>
                 </div>
                 <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                    <Shield size={16} className="text-amber-400" />
                    <span className="text-white font-bold text-xs">SOP Library</span>
                 </div>
              </div>

              <div className="pt-8 flex items-center gap-4">
                <button 
                  onClick={() => onNavigate && onNavigate('login')}
                  className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/25"
                >
                  Explore Business Portal
                </button>
                <div className="text-xs font-bold text-blue-300">
                  60-day application window • Deadline: June 22, 2026
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full space-y-4">
               {/* Progress Bars */}
               {[
                 { num: '01', title: 'Business Info', pct: '100%', complete: true },
                 { num: '02', title: 'Drug Codes', pct: '100%', complete: true },
                 { num: '03', title: 'State Licenses', pct: '100%', complete: true },
                 { num: '04', title: 'Liability', pct: '100%', complete: true },
                 { num: '05', title: 'SOPs & Compliance', pct: '92%', complete: false },
                 { num: '06', title: 'Payment', pct: '0%', complete: false },
                 { num: '07', title: 'Submission', pct: '0%', complete: false },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-xs">
                      {item.num}
                    </div>
                    <div className="flex-1">
                       <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.complete ? 'bg-emerald-400' : 'bg-blue-500'}`}
                            style={{ width: item.pct }}
                          />
                       </div>
                    </div>
                    <div className={`text-xs font-bold w-12 text-right ${item.complete ? 'text-emerald-400' : 'text-blue-300/50'}`}>
                      {item.pct}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Reality: Federal vs State */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Reality: Federal vs. State</h2>
          <p className="text-lg text-slate-500 font-medium max-w-3xl mx-auto">
            Schedule III rescheduling opens doors, but it creates massive friction points between conflicting state frameworks and rigid federal oversight. Here are the facts they tell you—and the hidden truths they don't.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Federal Column */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Scale size={160} />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Federal Oversight</h3>
                <p className="text-blue-600 font-bold text-sm">DEA Schedule III Classification</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">The Pros</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> IRC 280E Tax Relief unlocked for businesses.</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Expanded banking, credit, and financial services.</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Reduced federal criminal penalties for authorized entities.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">The Hidden Truths</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><XCircle size={16} className="text-red-500 mt-0.5 shrink-0" /> <strong>Strict FDA Oversight:</strong> Edibles, concentrates, and packaging will be subject to intense FDA scrutiny.</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><XCircle size={16} className="text-red-500 mt-0.5 shrink-0" /> <strong>Pharmacy Mandates:</strong> Distribution may ultimately be restricted to registered pharmacies, devastating standalone dispensaries.</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><XCircle size={16} className="text-red-500 mt-0.5 shrink-0" /> <strong>Federal Registration Fees:</strong> Hidden fees, complex DEA portal requirements, and mandatory federal background checks.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* State Column */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <MapPin size={160} />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Database className="text-emerald-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">State Sovereignty</h3>
                <p className="text-emerald-600 font-bold text-sm">Local Regulatory Compliance</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">The Pros</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Established local markets with existing customer bases.</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> State tax eliminations and relief initiatives rolling out to boost legal operators.</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Market access tailored to the state (e.g., Medical-only programs like Oklahoma, or full adult-use in others).</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" /> Diverse product types allowed beyond strict medical definitions.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">The Hidden Truths</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" /> <strong>Interstate Bans:</strong> Crossing state lines remains a federal crime until explicit compacts are formed.</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" /> <strong>API Traceability Failures:</strong> States routinely fail to sync their internal databases, leaving business owners liable for "ghost inventory."</li>
                  <li className="flex items-start gap-2 text-sm text-slate-700 font-medium"><AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" /> <strong>Aggressive Enforcement:</strong> State authorities use minor reporting infractions to execute raids and seize assets.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clearing the Confusion: Fact vs Fiction */}
      <section className="py-20 px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clearing the Confusion</h2>
            <p className="text-slate-500 font-medium">There is a lot of hearsay surrounding the Schedule III transition. Let's break down exactly how the law works and what actually changes.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black flex-shrink-0">MYTH</div>
              <div>
                <h4 className="text-lg font-black text-slate-800 mb-2">"Schedule III makes cannabis federally legal for recreational use."</h4>
                <p className="text-slate-600 text-sm leading-relaxed"><strong className="text-slate-800">FACT:</strong> No, it does not. Schedule III means the federal government officially recognizes medical value. It remains federally illegal for adult/recreational use. You must still adhere strictly to state medical programs and obtain federal DEA registration to be compliant.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black flex-shrink-0">MYTH</div>
              <div>
                <h4 className="text-lg font-black text-slate-800 mb-2">"I don't need a DEA registration if my state already licensed me."</h4>
                <p className="text-slate-600 text-sm leading-relaxed"><strong className="text-slate-800">FACT:</strong> If you touch the plant, you need federal registration. Your state license allows you to operate locally, but without a DEA Schedule III registration, you are still technically trafficking a controlled substance in the eyes of federal law, which blocks your access to banking and 280E tax relief.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black flex-shrink-0">MYTH</div>
              <div>
                <h4 className="text-lg font-black text-slate-800 mb-2">"I can now transport products across state lines."</h4>
                <p className="text-slate-600 text-sm leading-relaxed"><strong className="text-slate-800">FACT:</strong> Absolutely not. Interstate commerce of a Schedule III substance without explicit FDA/DEA authorization is a severe federal crime. Until Congress passes legislation authorizing interstate compacts, your operations and supply chain must remain strictly locked within your state borders.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black flex-shrink-0">MYTH</div>
              <div>
                <h4 className="text-lg font-black text-slate-800 mb-2">"The state and federal systems will talk to each other automatically."</h4>
                <p className="text-slate-600 text-sm leading-relaxed"><strong className="text-slate-800">FACT:</strong> They do not. State APIs like Metrc do not format data correctly for DEA audits. If you rely solely on your state's POS system, you will fail a federal audit due to data discrepancy. This is exactly why you need a bridge like GGP-OS.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-24 px-6 bg-[#0f2d1e] text-center border-t border-emerald-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
            <Lock className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">How GGP-OS Protects You</h2>
          <p className="text-lg text-emerald-100/80 font-medium leading-relaxed">
            The friction between state tracking systems (like Metrc) and federal oversight (DEA/FDA) creates a massive liability trap. <strong>Global Green Enterprise Inc.</strong> built GGP-OS to be the ultimate compliance bridge. 
          </p>
          <div className="bg-white/5 border border-emerald-500/30 rounded-3xl p-8 text-left space-y-6 backdrop-blur-sm">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex flex-shrink-0 items-center justify-center font-black text-emerald-400">1</div>
               <div>
                 <h4 className="text-white font-black text-lg mb-1">Unified API Bridging</h4>
                 <p className="text-emerald-100/70 text-sm leading-relaxed">We automatically map your state-level Metrc inventory data into the format required for DEA federal compliance audits, eliminating dual-entry and data mismatch.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex flex-shrink-0 items-center justify-center font-black text-emerald-400">2</div>
               <div>
                 <h4 className="text-white font-black text-lg mb-1">Pre-emptive Violation Detection</h4>
                 <p className="text-emerald-100/70 text-sm leading-relaxed">Larry AI continuously monitors your activity logs against both state statutes and federal guidelines, halting operations before a compliance violation occurs.</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex flex-shrink-0 items-center justify-center font-black text-emerald-400">3</div>
               <div>
                 <h4 className="text-white font-black text-lg mb-1">Automated Federal Registration</h4>
                 <p className="text-emerald-100/70 text-sm leading-relaxed">Our built-in wizard takes the guesswork out of the DEA Schedule III portal. We guide you through the rigid application process, drastically reducing the chance of rejection or criminal liability.</p>
               </div>
             </div>
          </div>

          <button 
            onClick={() => onNavigate && onNavigate('login')}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-8"
          >
            Enter the Secure Portal
          </button>
        </div>
      </section>

    </div>
  );
};
