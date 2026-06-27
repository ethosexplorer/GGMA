import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Award, FileCheck, ChevronRight, ArrowLeft, PlayCircle, 
  BookMarked, Download, Search, Shield, Briefcase, Clock, CircleCheck, Eye, 
  Activity, Database, HelpCircle, Globe, Phone, Copy, MessageSquare, Check, Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { STATE_RESOURCES } from '../stateResources';

export const EducationPortal = ({ 
  onBack,
  jurisdiction = 'Oklahoma',
  setJurisdiction
}: { 
  onBack: () => void;
  jurisdiction?: string;
  setJurisdiction?: (state: string) => void;
}) => {
  const [hubMode, setHubMode] = useState<'general' | 'regulatory'>('general');
  const [selectedState, setSelectedState] = useState(jurisdiction);
  const [activeTab, setActiveTab] = useState('programs');
  const [selectedTopic, setSelectedTopic] = useState('workplace');
  const [selectedAsk, setSelectedAsk] = useState('50m');
  const [roadmapWeek, setRoadmapWeek] = useState(1);
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSMS, setCopiedSMS] = useState(false);

  useEffect(() => {
    setSelectedState(jurisdiction);
  }, [jurisdiction]);

  // Topics content for the Academy Knowledge Hub (Continuing Education tab)
  const academyTopics = {
    workplace: {
      title: "Workplace Safety & Employee Screening",
      target: "Businesses & Multi-State Operators (MSOs)",
      desc: "Pre-shift visual/cognitive screening, employee safety policies, and OSHA compliance guides.",
      bulletPoints: [
        "Workers' Comp & Liability Savings: Daily pre-shift screening reduces commercial liability and worker's compensation insurance premiums by 15–25%.",
        "Automated Safety Gate: Integrates with GGP-OS fleet dispatch and POS dashboards. Failing a pre-shift screening automatically blocks operational dashboard access.",
        "OSHA Compliance Defense: Creates a secure, objective audit trail proving an employee was safe and unimpaired prior to beginning hazardous shifts."
      ],
      hardware: "SINC Breathalyzer + Oral Fluid Rapid Strips (chemical THC screening) paired with visual/pupil tracking.",
      dashboard: "System flags employee status as 'Unavailable' in real-time, locking out dispatch keys on the Business Dashboard."
    },
    clinical: {
      title: "Objective Clinical & Impairment Metrics",
      target: "Healthcare Providers & Physicians",
      desc: "HIPAA-compliant intakes, ocular latency tracking, and dosage calibration.",
      bulletPoints: [
        "Objective Tolerance Mapping: Replaces subjective patient self-reports with quantitative visual reaction-time tracking.",
        "Dosage Fine-Tuning: Enables physicians to chart a patient's visual response speed over time to adjust medical recommendations.",
        "Card Renewal Justification: Provides a standardized, clinical history log proving responsible consumption for state reciprocity reviews."
      ],
      hardware: "IMMAD visual testing camera API integration via standard webcams.",
      dashboard: "Results are securely saved to the patient's Care Wallet and synchronized with the Provider Dashboard queue."
    },
    roadside: {
      title: "Roadside & Field Interception",
      target: "Regulators & Law Enforcement",
      desc: "Roadside safety checks, oral fluid nanogram verification, and blockchain-backed chain of custody.",
      bulletPoints: [
        "THC DUI Solution: Standardizes driving-under-the-influence testing by matching chemical presence (THC concentration) with functional impairment (ocular test score).",
        "Biometric Chain of Custody: Logs biometric ID, oral fluid nanogram levels, and GPS geofence coordinates to an immutable database ledger.",
        "Evidentiary Integrity: Tamper-proof reports reduce court litigation costs and high dismissal rates of DUI cases."
      ],
      hardware: "SINC handheld Breathalyzer + Oral Fluid rapid cassette reader.",
      dashboard: "Enforcement log is generated on the Enforcement RIP dashboard and synced immediately to the State Authority."
    },
    patient: {
      title: "Patient Driving Readiness & Education",
      target: "Registered Patients & Consumers",
      desc: "Responsible consumption education, visual reaction self-testing, and insurance integrations.",
      bulletPoints: [
        "Self-Regulation Safety: Simple camera-based ocular test lets patients verify their own driving readiness after consuming.",
        "Visual Dilation Analysis: Teaches patients how cannabis affects pupil dilation, motor skills, and reaction speed.",
        "Insurance Discount Program: Passing safety checks before driving allows patients to share logs with auto insurance partners for premium discounts."
      ],
      hardware: "Camera-based pupil and ocular tracking test inside the patient's mobile Care Wallet.",
      dashboard: "Logs are saved privately to the patient's Care Wallet to maintain medical privacy."
    }
  };

  const fundingAsks = {
    "8m": {
      title: "Option 1: $8 Million Minimal Plan",
      period: "3-Year Period",
      allocation: [
        { label: "Personnel & Benefits", value: "$4.0M (50%)" },
        { label: "AI Compute & Platform", value: "$2.0M (25%)" },
        { label: "Program Services & Wellness", value: "$800K (10%)" },
        { label: "Marketing & Partnerships", value: "$600K (7.5%)" },
        { label: "All Other", value: "$600K (7.5%)" }
      ],
      promise: "Launches GGP-OS with an elite 8–10 person team running an 85% AI / 15% human platform, proving real-time compliance and wellness outcomes in cannabis and early healthcare.",
      script: "If you fund us at $8M, we literally start tomorrow. Week 1-2: Wire hits, we sign the first six hires — AI lead and compliance counsel first. Week 3-6: Convert all three patents to utility and spin up the AWS/GCP AI stack. Week 7-8: Deploy the live dashboard you've already seen to our first five MSO/clinic partners in Oklahoma plus two other states. Week 9-12: Run the first Sylara/Larry pilot with real patients and regulators. By the end of Month 3 you'll have live revenue from pilots, the 85/15 AI model proven in production, first wellness outcome data, and the full infrastructure humming. We don't need years — the platform is built and the team is ready. We start tomorrow."
    },
    "20m": {
      title: "Option 2: $20 Million Scale Plan",
      period: "4-Year Period",
      allocation: [
        { label: "Personnel & Benefits", value: "$10.0M (50%)" },
        { label: "AI Compute & Platform", value: "$4.5M (22.5%)" },
        { label: "Program Services & Wellness", value: "$2.5M (12.5%)" },
        { label: "Marketing & Partnerships", value: "$1.5M (7.5%)" },
        { label: "All Other", value: "$1.5M (7.5%)" }
      ],
      promise: "Scales GGP-OS to multi-state operations with a lean 12–15 person elite team and 85% AI / 15% human model — delivering compliance enforcement and wellness impact.",
      script: "If you fund us at $20M, we hit the ground running tomorrow. Week 1–2: Funds wire and we lock in the first eight hires — core AI, compliance, and product leads. Week 3–6: Finalize utility patent filings and fully activate the AI compute environment for Sylara and Larry. Week 7–8: Roll out the live patient dashboard to our first five MSO/clinic partners in Oklahoma plus two additional states. Week 9–12: Launch the first full Sylara/Larry pilot with real patients and regulators — generating compliance reports and wellness data immediately. By Month 3 you'll see live revenue, the 85/15 model proven at scale, measurable wellness impact, and the infrastructure ready for multi-state growth."
    },
    "50m": {
      title: "Option 3: $50 Million Full Vision",
      period: "5-Year Period",
      allocation: [
        { label: "Personnel & Benefits", value: "$26.0M (52%)" },
        { label: "AI Compute & Platform", value: "$9.5M (19%)" },
        { label: "Program Services & Wellness", value: "$6.0M (12%)" },
        { label: "Marketing & Partnerships", value: "$3.5M (7%)" },
        { label: "Facilities & Operations", value: "$2.5M (5%)" },
        { label: "Evaluation, Audits & Compliance", value: "$1.5M (3%)" },
        { label: "Overhead", value: "$1.0M (2%)" }
      ],
      promise: "Funds the elite team and AI infrastructure required to scale GGP-OS as the backbone for regulated industries — starting with cannabis and expanding into healthcare, government, and financial compliance.",
      script: "If you fund us at $50M, we start tomorrow and never look back. Week 1–2: Wire clears and we sign the first eight hires — our elite AI leadership and compliance counsel first. Week 3–6: Convert all three patents to utility stage and spin up the full AWS/GCP AI compute stack that powers the entire platform. Week 7–8: Deploy the live patient dashboard (ggma-five.vercel.app) to our first five MSO and clinic partners in Oklahoma plus two additional states. Week 9–12: Run the first Sylara/Larry pilot with real patients and regulators — delivering live compliance reports and wellness program data. By the end of Month 3 you will have live revenue from pilots, the 85% AI / 15% human model proven in production, first measurable wellness-impact data, and the entire infrastructure humming with a world-class lean team. We start tomorrow."
    }
  };

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
              <GraduationCap size={16} /> GGP-OS Presentation Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
              The Standard in Regulated <br/><span className="text-emerald-400">Impairment & Enforced Compliance</span>
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl font-medium leading-relaxed mb-8 opacity-90">
              Welcome to the GGHP interactive presentation hub. Explore training pathways, review patented hardware specifications, and access official script resources for MSO, regulator, and investor pitch briefings.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => ((window as any).Calendly ? (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet' }) : window.open('https://calendly.com/globalgreenhpmeet', '_blank'))}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
              >
                <PlayCircle size={20} /> Schedule Zoom Briefing
              </button>
            </div>
          </div>
        </div>

        {/* Hub Mode Toggle */}
        <div className="flex gap-4 p-1.5 bg-slate-200/60 rounded-2xl mb-8 max-w-xl shadow-inner border border-slate-200">
          <button 
            onClick={() => setHubMode('general')}
            className={cn(
              "flex-1 py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              hubMode === 'general' 
                ? "bg-[#1a4731] text-white shadow-md" 
                : "text-slate-600 hover:text-[#1a4731]"
            )}
          >
            <BookOpen size={18} /> General Platform Academy
          </button>
          <button 
            onClick={() => setHubMode('regulatory')}
            className={cn(
              "flex-1 py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              hubMode === 'regulatory' 
                ? "bg-slate-900 text-white shadow-md" 
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Globe size={18} /> State Compliance Simulator
          </button>
        </div>

        {hubMode === 'general' ? (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'programs', label: 'School Programs', icon: BookOpen },
                { id: 'compliance', label: 'Certificates of Compliance', icon: FileCheck },
                { id: 'ce', label: 'Impairment & Safety Academy (Interactive)', icon: BookMarked },
                { id: 'accreditation', label: 'SINC Testing Hardware & Patents', icon: Award },
                { id: 'ojt', label: 'Investor Pitch & Roadmap', icon: Briefcase },
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
            
            {/* 1. School Programs */}
            {activeTab === 'programs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {[
                  { title: 'Metrc Integration Mastery', link: 'https://calendly.com/globalgreenhpmeet/metrc-integration-mastery', desc: 'Master the API and compliance rules of the Metrc state systems. Grant-funded.', hrs: '40 Hrs', tag: 'Core Program', price: '$2,495' },
                  { title: 'SINC Oversight Directives', link: 'https://calendly.com/globalgreenhpmeet/sinc-oversight-directives', desc: 'Training for law enforcement and regulators on identifying compliance issues.', hrs: '24 Hrs', tag: 'Gov / Law Enforcement', price: '$1,850' },
                  { title: 'Retail Compliance Pro', link: 'https://calendly.com/globalgreenhpmeet/retail-compliance-pro', desc: 'Frontline budtender and manager training for point-of-sale compliance.', hrs: '16 Hrs', tag: 'Business', price: '$750' },
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
                      <button 
                        onClick={() => prog.link && window.open(prog.link, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                      >
                        Enroll <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Certificates of Compliance */}
            {activeTab === 'compliance' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm animate-in fade-in duration-300">
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
                      <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">View Requirements</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Impairment & Safety Academy (Interactive) */}
            {activeTab === 'ce' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                {/* Left Side: Clickable Topics List */}
                <div className="lg:col-span-1 space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Select a Safety Vertical</p>
                  {Object.keys(academyTopics).map((key) => {
                    const topic = academyTopics[key as keyof typeof academyTopics];
                    const isSelected = selectedTopic === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedTopic(key)}
                        className={cn(
                          "w-full text-left p-5 rounded-2xl border transition-all flex flex-col gap-1.5 shadow-sm",
                          isSelected 
                            ? "bg-slate-900 border-emerald-500 text-white scale-[1.02]" 
                            : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100"
                        )}
                      >
                        <span className={cn("text-[9px] font-black uppercase tracking-wider", isSelected ? "text-emerald-400" : "text-emerald-600")}>
                          {topic.target}
                        </span>
                        <h3 className="font-bold text-md leading-tight">{topic.title}</h3>
                        <p className={cn("text-xs leading-normal truncate w-full", isSelected ? "text-slate-400" : "text-slate-500")}>
                          {topic.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Detailed View Card */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
                  {(() => {
                    const topic = academyTopics[selectedTopic as keyof typeof academyTopics];
                    return (
                      <div className="space-y-6">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                          <div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                              {topic.target}
                            </span>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-2">{topic.title}</h2>
                          </div>
                          <BookMarked className="text-emerald-500" size={32} />
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Presentation Talking Points</h4>
                          <ul className="space-y-3">
                            {topic.bulletPoints.map((bp, i) => (
                              <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed items-start">
                                <CircleCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                                <span>{bp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                              <Activity size={14} className="text-emerald-500" /> SINC Device Integration
                            </h5>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{topic.hardware}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                              <Database size={14} className="text-blue-500" /> GGP-OS Enforcement
                            </h5>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{topic.dashboard}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* 4. SINC Testing Hardware & Patents */}
            {activeTab === 'accreditation' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* SINC Architecture card */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                  <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                    <Activity className="text-emerald-500" /> The SINC Dual-Testing Architecture
                  </h2>
                  <p className="text-slate-600 mb-8 max-w-3xl leading-relaxed">
                    GGHP's dual-testing mechanism solves the cannabis industry's biggest regulatory bottleneck by combining chemical presence markers (THC nanograms) with biological functional metrics. Testing for chemical presence alone fails DUI standards; pairing it with objective ocular latency metrics creates a bulletproof, legally defensible standard.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "1. Chemical Fluid Strips", desc: "Rapid cassettes reading saliva or breath delta-9 THC nanograms. Yields positive/negative indicator in minutes." },
                      { title: "2. Visual Pupil Tracking", desc: "IMMAD integration tracks pupillary light response, visual saccades, and cognitive motor delay via API." },
                      { title: "3. Blockchain Chain of Custody", desc: "Both test results are bound with geofenced GPS, time, and biometrics, then uploaded directly to the ledger." }
                    ].map((step, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-2">{step.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patent Registry table */}
                <div className="bg-slate-900 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2rem] p-8 shadow-xl">
                  <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                    <Shield className="text-emerald-400" /> USPTO Intellectual Property Registry
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 font-medium">Active provisional filings registered with the United States Patent and Trademark Office.</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="pb-3">Patent / Technology Title</th>
                          <th className="pb-3">USPTO Application No.</th>
                          <th className="pb-3">Filing Date</th>
                          <th className="pb-3">Regulatory Scope</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-slate-200">
                        <tr>
                          <td className="py-3.5 font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Systems and Methods for Detection of Recent Substance Use (Recency Index)
                          </td>
                          <td className="py-3.5 font-mono">64/017,726</td>
                          <td className="py-3.5">March 26, 2026</td>
                          <td className="py-3.5 text-slate-400 font-semibold">Dual-channel chemical saliva strip + biological ocular latency delay matching.</td>
                        </tr>
                        <tr>
                          <td className="py-3.5 font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Closed-Loop Private Label Revolving Line of Credit System for the Cannabis Industry
                          </td>
                          <td className="py-3.5 font-mono">64/016,698</td>
                          <td className="py-3.5">March 26, 2026</td>
                          <td className="py-3.5 text-slate-400 font-semibold">In-house credit underwriting node linking operators with GGP-OS compliance status.</td>
                        </tr>
                        <tr>
                          <td className="py-3.5 font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Multi-Sided Regulatory Infrastructure System with Cross-Module Routing (The Reg System)
                          </td>
                          <td className="py-3.5 font-mono">64/012,230</td>
                          <td className="py-3.5">March 19, 2026</td>
                          <td className="py-3.5 text-slate-400 font-semibold">Secure network routing live data from POS/clinics directly to OMMA/State Authority.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Investor Pitch & Roadmap */}
            {activeTab === 'ojt' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                {/* 90-Day Stepper */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">90-Day Execution Roadmap</h3>
                    <p className="text-xs text-slate-400 mt-1">Rollout strategy from wire-transfer to live compliance audits.</p>
                  </div>
                  
                  <div className="relative border-l-2 border-slate-100 pl-6 ml-2 space-y-8">
                    {[
                      { step: 1, title: "Week 1–2: Capitalization & Core Team", desc: "Finalize corporate formation, execute first 6 engineer hires, activate AWS compute." },
                      { step: 2, title: "Week 3–6: Patent Utility Spin-up", desc: "Convert provisional filings to full utility stage. Establish seed-to-sale API bridge." },
                      { step: 3, title: "Week 7–8: Multi-State Deployment", desc: "Integrate dashboard with 5 clinic partners in OK plus 2 additional target states." },
                      { step: 4, title: "Week 9–12: Live Sylara/Larry Pilot", desc: "Launch clinical ocular tracking with state regulatory oversight audit reports." }
                    ].map((item) => (
                      <button 
                        key={item.step}
                        onClick={() => setRoadmapWeek(item.step)}
                        className={cn(
                          "w-full text-left relative transition-all group",
                          roadmapWeek === item.step ? "scale-[1.02]" : "opacity-75 hover:opacity-100"
                        )}
                      >
                        <div className={cn(
                          "absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all",
                          roadmapWeek === item.step 
                            ? "bg-slate-900 border-emerald-500 text-emerald-400 scale-110 shadow-md" 
                            : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                        )}>
                          {item.step}
                        </div>
                        <h4 className={cn("text-xs font-black uppercase tracking-wider", roadmapWeek === item.step ? "text-[#1a4731]" : "text-slate-600")}>
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pitch Funding Selector */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-800">Select Funding Tier Scenario</h3>
                        <p className="text-xs text-slate-400 mt-1">Review customized capital allocations and Shantell's scripts.</p>
                      </div>
                      <Briefcase className="text-emerald-500" size={24} />
                    </div>

                    <div className="flex gap-2">
                      {Object.keys(fundingAsks).map((key) => {
                        const ask = fundingAsks[key as keyof typeof fundingAsks];
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedAsk(key)}
                            className={cn(
                              "flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all",
                              selectedAsk === key 
                                ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {ask.title.split(":")[0]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Ask Detail */}
                    {(() => {
                      const ask = fundingAsks[selectedAsk as keyof typeof fundingAsks];
                      return (
                        <div className="space-y-6 animate-in fade-in duration-300">
                          <div>
                            <h4 className="text-xl font-black text-slate-800">{ask.title} ({ask.period})</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Platform Promise & Scope</p>
                            <p className="text-sm text-slate-600 leading-relaxed mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/50">{ask.promise}</p>
                          </div>

                          <div>
                            <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Capital Allocation Breakdown</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {ask.allocation.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <span className="text-xs text-slate-500 font-bold">{item.label}</span>
                                  <span className="text-xs font-black text-slate-800">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                            <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Shantell's Pitch Script (Underwriting)</h5>
                            <div className="p-5 bg-emerald-950 text-emerald-100 text-sm leading-relaxed rounded-2xl border border-emerald-900/50 font-mono italic shadow-inner">
                              "{ask.script}"
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* State Selector Control Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Globe className="text-emerald-600" size={24} />
                    Nationwide State Compliance Simulator
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Select any U.S. state to dynamically review custom guidelines, licensing portals, and tracking systems.</p>
                </div>
                
                {/* State Select dropdown */}
                <div className="w-full md:w-80">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Select Target State</label>
                  <select 
                    value={selectedState}
                    onChange={(e) => {
                      const state = e.target.value;
                      setSelectedState(state);
                      setJurisdiction?.(state);
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-[#1a4731] outline-none cursor-pointer"
                  >
                    {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic State Info Grid */}
              {(() => {
                const stateData = STATE_RESOURCES[selectedState];
                if (!stateData) return <div className="text-center p-6 text-slate-500 font-medium">No resource data available for {selectedState}.</div>;
                const shareUrl = `${window.location.origin}/demo?state=${encodeURIComponent(selectedState)}`;
                
                return (
                  <div className="space-y-8">
                    {/* Share Link Generator Box */}
                    <div className="bg-slate-900 bg-gradient-to-br from-slate-900 to-[#122e20] p-6 rounded-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-900/30">
                      <div>
                        <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Custom Demo Link for {selectedState}</h4>
                        <p className="text-xs text-slate-400 mt-1">Send this direct link via text or email. The platform will automatically lock to {selectedState}'s rules.</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl);
                            setCopiedLink(true);
                            setTimeout(() => setCopiedLink(false), 2000);
                          }}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all",
                            copiedLink ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                          {copiedLink ? "Link Copied!" : "Copy Share Link"}
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`Hi, here is your direct, password-free link to explore the GGHP-OS regulatory compliance portal customized for ${selectedState} state guidelines: ${shareUrl}`);
                            setCopiedSMS(true);
                            setTimeout(() => setCopiedSMS(false), 2000);
                          }}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all",
                            copiedSMS ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          {copiedSMS ? <Check size={14} /> : <MessageSquare size={14} />}
                          {copiedSMS ? "SMS Pitch Copied!" : "Copy SMS Pitch"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">State Regulatory Authority</span>
                        <h4 className="font-bold text-slate-800 text-md">{stateData.regulator || "State Cannabis Authority"}</h4>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Traceability Tracking System</span>
                        <h4 className="font-bold text-slate-800 text-md flex items-center gap-2">
                          <Database size={16} className="text-indigo-500" />
                          {stateData.trackingSystem || "State-managed"}
                        </h4>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">License Limitations / Caps</span>
                        <h4 className="font-bold text-slate-800 text-md">{stateData.licenseCaps || "Varies by municipality"}</h4>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contact Phone</span>
                        <h4 className="font-bold text-slate-800 text-md flex items-center gap-2">
                          <Phone size={14} className="text-emerald-500" />
                          {stateData.contactPhone || "State Office"}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: Portals and Checklists */}
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                          <h4 className="font-bold text-slate-800 text-md border-b border-slate-200/60 pb-2">Compliance Action Checklists</h4>
                          <ul className="space-y-2">
                            {(stateData.checklistItems || ["Licensing Verification", "Inventory Seed-to-sale Audit", "Labeling & Warning Review"]).map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                                <CircleCheck className="text-emerald-500 shrink-0" size={16} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                          <h4 className="font-bold text-slate-800 text-md border-b border-slate-200/60 pb-2">Official State Portal Integrations</h4>
                          <div className="grid grid-cols-1 gap-3">
                            {stateData.patientPortal && (
                              <a href={stateData.patientPortal} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white hover:bg-slate-100/50 rounded-xl border border-slate-200 text-xs font-bold text-[#1a4731] transition-all">
                                <span>Patient Registration Portal</span>
                                <ChevronRight size={14} />
                              </a>
                            )}
                            {stateData.businessPortal && (
                              <a href={stateData.businessPortal} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white hover:bg-slate-100/50 rounded-xl border border-slate-200 text-xs font-bold text-[#1a4731] transition-all">
                                <span>Business Licensing & Applications</span>
                                <ChevronRight size={14} />
                              </a>
                            )}
                            {stateData.intakeForms?.map((form, fIdx) => (
                              <a key={fIdx} href={form.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white hover:bg-slate-100/50 rounded-xl border border-slate-200 text-xs font-bold text-[#1a4731] transition-all">
                                <span>{form.name}</span>
                                <ChevronRight size={14} />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Qualifying Conditions list */}
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <h4 className="font-bold text-slate-800 text-md border-b border-slate-200/60 pb-2">Qualifying Medical Conditions</h4>
                        {stateData.conditions && stateData.conditions.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                            {stateData.conditions.map((cond, cIdx) => (
                              <div key={cIdx} className="p-2 bg-white rounded-lg border border-slate-200/60 text-[10px] font-bold text-slate-600 truncate" title={cond}>
                                • {cond}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">No explicit condition cap listed, practitioner discretion applies.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
