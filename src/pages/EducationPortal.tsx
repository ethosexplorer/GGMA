import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Award, FileCheck, CheckCircle2, 
  ChevronRight, ArrowLeft, PlayCircle, BookMarked, Download, Search, Shield, Briefcase, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

export const EducationPortal = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('programs');

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200/50 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGHP Logo" className="h-12 w-auto object-contain" />
          <div className="hidden sm:block">
            <span className="font-black text-xl text-slate-800 tracking-tight block">GGHP Education Academy</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Private Sector Training • Grants • Certification</span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Platform
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
        
        {/* Hero */}
        <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-[#1a4731] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-full bg-emerald-500/20 blur-3xl"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
              <GraduationCap size={16} /> Empowering the Next Generation
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              The Standard in Cannabis <br/><span className="text-emerald-400">Compliance & Education</span>
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl font-medium leading-relaxed mb-8 opacity-90">
              Welcome to our private-sector academy. We offer accredited On-The-Job Training, Certificates of Compliance, and Continuing Education funded by top-tier grants. Learn from the architects of the Global Green platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
                <PlayCircle size={20} /> Start Training
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                <Download size={20} /> View Grant Opportunities
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'programs', label: 'School Programs', icon: BookOpen },
            { id: 'compliance', label: 'Certificates of Compliance', icon: FileCheck },
            { id: 'ce', label: 'Continuing Education (CE)', icon: BookMarked },
            { id: 'accreditation', label: 'Accredits & Credentials', icon: Award },
            { id: 'ojt', label: 'On-The-Job Training', icon: Briefcase },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-bold text-sm rounded-xl transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-emerald-400" : "text-slate-400"} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[
              { title: 'Metrc Integration Mastery', desc: 'Master the API and compliance rules of the Metrc state systems. Grant-funded.', hrs: '40 Hrs', tag: 'Core Program', price: '$2,495' },
              { title: 'SINC Oversight Directives', desc: 'Training for law enforcement and regulators on identifying compliance issues.', hrs: '24 Hrs', tag: 'Gov / Law Enforcement', price: '$1,850' },
              { title: 'Retail Compliance Pro', desc: 'Frontline budtender and manager training for point-of-sale compliance.', hrs: '16 Hrs', tag: 'Business', price: '$750' },
            ].map((prog, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{prog.tag}</span>
                  <div className="text-right">
                    <span className="block text-lg font-black text-emerald-600">{prog.price}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Per Seat / Grant Eligible</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{prog.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1">{prog.desc}</p>
                <div className="flex items-center justify-between mt-auto border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-600"><Clock size={16} className="text-emerald-500" /> {prog.hrs}</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                    Enroll <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Shield className="text-emerald-500" /> State-Recognized Compliance Certificates
            </h2>
            <p className="text-slate-600 mb-8 max-w-3xl">GGHP sets the private-sector standard. Our certificates of compliance are rigorously aligned with State Authority matrices, making them highly sought after by enterprise MSOs (Multi-State Operators).</p>
            
            <div className="space-y-4">
              {['Level 1: Core Traceability Handler', 'Level 2: Medical Intake & HIPAA Standards', 'Level 3: Regulatory Auditing & Metrc Variance', 'Executive Master of Compliance (EMC)'].map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black">
                      {i+1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{cert}</h4>
                      <p className="text-xs text-slate-500 font-medium">Certification valid for 24 months.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">View Requirements</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback for other tabs */}
        {['ce', 'accreditation', 'ojt'].includes(activeTab) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Award size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">
              {activeTab === 'ce' ? 'Continuing Education (CE)' : activeTab === 'accreditation' ? 'Accredits & Credentials' : 'On-The-Job Training'}
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Our grant-funded curriculum and credentialing network is currently being mapped to state portals. Enrollees will be notified once private-sector modules are active.
            </p>
          </div>
        )}

      </main>
    </div>
  );
};
