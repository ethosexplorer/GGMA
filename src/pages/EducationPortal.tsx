import React, { useState } from 'react';
import { GraduationCap, BookOpen, Award, FileCheck, ChevronRight, ArrowLeft, PlayCircle, BookMarked, Download, Search, Shield, Briefcase, Clock, CircleCheck, Eye, Activity, Database, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const EducationPortal = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('programs');
  const [selectedTopic, setSelectedTopic] = useState('workplace');
  const [selectedAsk, setSelectedAsk] = useState('50m');
  const [roadmapWeek, setRoadmapWeek] = useState(1);

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
              <p className="text-indigo-200 text-sm mb-6 max-w-2xl">The underlying software workflows, credit architectures, and impairment mapping systems are legally protected under active USPTO provisional applications.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-medium">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3">Patent / Innovation</th>
                      <th className="py-3">USPTO Application No.</th>
                      <th className="py-3">Official Filing Title</th>
                      <th className="py-3 text-right">Filing Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-200">
                    <tr>
                      <td className="py-4 font-bold text-emerald-400">Recency Index (RI)</td>
                      <td className="py-4 font-mono text-sm">64/017,726</td>
                      <td className="py-4 italic">"Systems and Methods for Detection of Recent Substance Use"</td>
                      <td className="py-4 text-right">March 26, 2026</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-emerald-400">Closed-Loop Credit System</td>
                      <td className="py-4 font-mono text-sm">64/016,698</td>
                      <td className="py-4 italic">"Closed-Loop Private Label Revolving Line of Credit System for the Cannabis Industry"</td>
                      <td className="py-4 text-right">March 26, 2026</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-emerald-400">The Reg System</td>
                      <td className="py-4 font-mono text-sm">64/012,230</td>
                      <td className="py-4 italic">"Multi-Sided Regulatory Infrastructure System with Cross-Module Routing"</td>
                      <td className="py-4 text-right">March 19, 2026</td>
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
            {/* Left: General Pitch Slides */}
            <div className="lg:col-span-1 space-y-6">
              {/* Vision Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Platform Vision</span>
                <h4 className="font-bold text-slate-800 text-lg mb-2">3-Year Strategic Goal</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  "We are building the infrastructure layer for regulated industries, starting with cannabis. GGP-OS becomes the essential backbone infrastructure - not a point solution. Strategic exit at 8–12x ARR."
                </p>
              </div>

              {/* Market Size Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Market Target</span>
                <h4 className="font-bold text-slate-800 text-lg mb-4">Total Addressable Market</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase">TAM</span>
                    <span className="text-sm font-black text-slate-800">$541 Billion</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase">SAM</span>
                    <span className="text-sm font-black text-slate-800">$85 Billion</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-black text-emerald-600 uppercase">SOM (Yr 5)</span>
                    <span className="text-sm font-black text-emerald-700">$3.5 Billion</span>
                  </div>
                </div>
              </div>

              {/* 90-Day Roadmap Tracker */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Execution Timeline</span>
                <h4 className="font-bold text-slate-800 text-lg mb-4">90-Day Roadmap</h4>
                
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {[1, 2, 3, 4].map(w => (
                    <button 
                      key={w} 
                      onClick={() => setRoadmapWeek(w)}
                      className={cn(
                        "py-2 rounded-xl text-xs font-black transition-all",
                        roadmapWeek === w ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                    >
                      {w === 1 ? "W1-2" : w === 2 ? "W3-6" : w === 3 ? "W7-8" : "W9-12"}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 text-xs leading-relaxed text-slate-600">
                  {roadmapWeek === 1 && (
                    <ul className="space-y-1.5 list-disc pl-4">
                      <li>GGP-OS Funds wired</li>
                      <li>Sign first 6–8 elite hires (AI Lead + Compliance Counsel first)</li>
                      <li>Team under contract and aligned to 85/15 model</li>
                    </ul>
                  )}
                  {roadmapWeek === 2 && (
                    <ul className="space-y-1.5 list-disc pl-4">
                      <li>Convert all 3 provisional patents to utility filings</li>
                      <li>Spin up full AWS/GCP AI compute environment</li>
                      <li>Sylara + Larry engines fully activated</li>
                    </ul>
                  )}
                  {roadmapWeek === 3 && (
                    <ul className="space-y-1.5 list-disc pl-4">
                      <li>Deploy live patient dashboard (ggma-five.vercel.app)</li>
                      <li>Onboard first 5 MSO/clinic partners in Oklahoma + 2 additional states</li>
                    </ul>
                  )}
                  {roadmapWeek === 4 && (
                    <ul className="space-y-1.5 list-disc pl-4">
                      <li>Run first full Sylara/Larry pilot with real patients & regulators</li>
                      <li>Generate live compliance reports + wellness outcome data</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Funding Options & Scripts */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Ask Options</span>
                    <h3 className="text-2xl font-black text-slate-800 mt-1">Pitch Briefing Scripts</h3>
                  </div>
                  <HelpCircle className="text-slate-400" size={24} />
                </div>

                {/* Ask Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: '8m', label: "$8M Minimal" },
                    { id: '20m', label: "$20M Scale" },
                    { id: '50m', label: "$50M Full" },
                  ].map(ask => (
                    <button
                      key={ask.id}
                      onClick={() => setSelectedAsk(ask.id)}
                      className={cn(
                        "py-3 rounded-xl font-bold text-sm transition-all border",
                        selectedAsk === ask.id 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {ask.label}
                    </button>
                  ))}
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

      </main>
    </div>
  );
};
