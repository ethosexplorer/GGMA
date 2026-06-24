import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Cpu, CheckCircle, Stethoscope, Wallet, Building2, ArrowLeft, Smartphone, GraduationCap, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { id: 'platform', label: 'Platform Subscriptions', icon: '⚙️' },
  { id: 'professional', label: 'Professional Services', icon: '🩺' },
  { id: 'lab_health', label: 'Lab & Public Health', icon: '🔬' },
  { id: 'health_addons', label: 'Health Add-Ons', icon: '🏥' },
  { id: 'rapid_testing', label: 'Rapid Testing', icon: '📱' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'care_wallet', label: 'Care Wallet', icon: '💳' },
  { id: 'government', label: 'Government', icon: '🏛️' },
];

/* ── comprehensive plan details table ────────────── */
const PlanDetailsTable = ({ tiers }: { tiers: { name: string; setup: string; training: string; goLive: string; monthly: string; quarterly: string; annual: string; savings?: string }[] }) => (
  <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-xs">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="text-left px-4 py-3 font-black text-slate-700 uppercase tracking-widest text-[10px] sticky left-0 bg-slate-50 z-10">Plan</th>
          <th className="text-center px-3 py-3 font-black text-blue-700 uppercase tracking-widest text-[10px] border-l border-slate-200" colSpan={3}>
            ⏱️ Implementation Timeline
          </th>
          <th className="text-center px-3 py-3 font-black text-emerald-700 uppercase tracking-widest text-[10px] border-l border-slate-200" colSpan={3}>
            💰 Billing Cycles
          </th>
        </tr>
        <tr className="bg-slate-100/60 border-b border-slate-200">
          <th className="text-left px-4 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest sticky left-0 bg-slate-100/60 z-10"></th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest border-l border-slate-200">Setup & Build</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest">Training</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest">Go-Live</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest border-l border-slate-200">Monthly</th>
          <th className="text-center px-3 py-2 font-bold text-slate-500 text-[9px] uppercase tracking-widest">Quarterly</th>
          <th className="text-center px-3 py-2 font-bold text-emerald-600 text-[9px] uppercase tracking-widest">Annual ✨</th>
        </tr>
      </thead>
      <tbody>
        {tiers.map((t, i) => (
          <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30 transition-colors`}>
            <td className="px-4 py-3 font-bold text-slate-800 sticky left-0 bg-inherit z-10 whitespace-nowrap">{t.name}</td>
            <td className="px-3 py-3 text-center font-bold text-blue-600 border-l border-slate-100">{t.setup}</td>
            <td className="px-3 py-3 text-center font-bold text-blue-600">{t.training}</td>
            <td className="px-3 py-3 text-center">
              <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">{t.goLive}</span>
            </td>
            <td className="px-3 py-3 text-center font-bold text-slate-600 border-l border-slate-100">{t.monthly}</td>
            <td className="px-3 py-3 text-center font-bold text-blue-700">{t.quarterly}</td>
            <td className="px-3 py-3 text-center">
              <span className="font-black text-emerald-700">{t.annual}</span>
              {t.savings && <span className="ml-1 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">Save {t.savings}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ProductsServicesPage = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [activeSection, setActiveSection] = useState('platform');
  const navRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  /* ── drag-to-scroll for section nav ── */
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (navRef.current?.offsetLeft || 0);
    scrollLeft.current = navRef.current?.scrollLeft || 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (navRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    if (navRef.current) navRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => { isDragging.current = false; };

  const scrollNav = (dir: 'left' | 'right') => {
    if (navRef.current) navRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  /* ── intersection observer for active section highlighting ── */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 });
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/gghp-logo.png" alt="GGHP" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="w-px h-6 bg-slate-300" />
          <span className="text-slate-800 font-black text-sm tracking-wide">Products & Services</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('landing')} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={14} className="inline mr-1" /> Back to Portal
          </button>
        </div>
      </nav>

      {/* ── STICKY SECTION NAV BAR ── */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-1 px-2">
          <button onClick={() => scrollNav('left')} className="shrink-0 p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div
            ref={navRef}
            className="flex-1 flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeSection === s.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={() => scrollNav('right')} className="shrink-0 p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 px-6 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-700 uppercase tracking-widest">
              <ShoppingCart size={12} /> Our Products & Services
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Products &amp; Services</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Global Green Enterprise Inc provides SaaS compliance technology, telehealth coordination, AI-powered operational tools, public health monitoring, and payment processing for the legal cannabis industry across all 50 U.S. states and tribal nations.</p>
          </div>

          {/* FREE Account Banner */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-8 shadow-2xl shadow-emerald-900/20 border border-emerald-400/30 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <span className="text-white text-xs font-black uppercase tracking-widest">No Cost to Get Started</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                Create Your Account for <span className="text-yellow-300">FREE</span>
              </h2>
              <p className="text-emerald-50 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-4">
                Self-serve your <span className="font-bold text-white">medical card applications</span>, <span className="font-bold text-white">business license applications</span>, 
                and <span className="font-bold text-white">state portal registrations</span> — all at no charge. 
                Your account gives you direct access to do it yourself.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-xl mx-auto border border-white/20">
                <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                  <span className="font-black text-yellow-300">Subscriptions are optional</span> — only needed if you want our 
                  providers, agents, or assistants to handle the process for you, or to unlock premium benefits 
                  like telehealth, compliance tools, and dedicated support.
                </p>
              </div>
            </div>
          </div>

          {/* ─── CORE PLATFORM SUBSCRIPTIONS ─── */}
          <div id="platform" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700"><Cpu size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">GGP-OS Platform Subscriptions</h3>
                <p className="text-sm text-slate-500">Monthly, quarterly & annual SaaS subscriptions for compliance, licensing, and AI-powered operations</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Patient / Consumer', icon: '🏥', price: '$49.99', period: '/mo', desc: 'Telehealth coordination, medical card management, Care Wallet, AI guidance via Sylara', features: ['Medical card application sync', 'Telehealth scheduling', 'Care Wallet stored value', 'Sylara AI personal assistant', 'Document vault & compliance tracker'], color: 'emerald' },
                { title: 'Business / Dispensary', icon: '🏢', price: '$199', period: '/mo', desc: 'Full compliance OS with POS, Metrc sync, inventory, and Larry enforcement AI', features: ['SINC POS system (card-ready)', 'Real-time Metrc seed-to-sale sync', 'Inventory & barcode tracking', 'Larry AI compliance monitoring', 'Automated state reporting'], color: 'blue' },
                { title: 'Provider / Physician', icon: '🩺', price: '$99', period: '/mo', desc: 'Patient management, telehealth consultations, recommendation workflows, and AI tools', features: ['Patient roster management', 'Telehealth consultation tools', 'Recommendation workflow', 'Sylara AI clinical guidance', 'Compliance & licensing tracker'], color: 'violet' },
                { title: 'Attorney / Legal', icon: '⚖️', price: '$149', period: '/mo', desc: 'Cannabis & general legal case management, client leads, regulatory AI, and Larry enforcement', features: ['Legal marketplace & lead access', 'Case management dashboard', 'Regulatory intelligence feeds', 'Larry AI legal compliance', 'Client billing & invoicing'], color: 'amber' },
                { title: 'Advocacy & Research', icon: '📊', price: '$79', period: '/mo', desc: 'Health demographic trends, safety reporting, anonymized research data, and policy analysis tools', features: ['Anonymized health demographic data', 'Safety & outcome reporting tools', 'Policy impact analysis dashboards', 'Research data export (CSV/API)', 'Community engagement analytics'], color: 'rose' },
              ].map((product, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-300 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="text-3xl mb-3">{product.icon}</div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{product.title}</h4>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black text-emerald-700">{product.price}</span>
                    <span className="text-xs font-bold text-slate-400">{product.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{product.desc}</p>
                  <ul className="space-y-2 text-xs text-slate-600 flex-1">
                    {product.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2"><CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => onNavigate('larry-chatbot')} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors uppercase tracking-wider">Get Started</button>
                    <button onClick={() => window.open('https://calendly.com/globalgreenhpmeet/gghp-demo', '_blank')} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition-colors uppercase tracking-wider">Book Demo</button>
                  </div>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Patient / Consumer', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$49.99/mo', quarterly: '$134.97/qtr', annual: '$479.88/yr', savings: '20%' },
              { name: 'Business / Dispensary', setup: '1–2 Weeks', training: '3–5 Days', goLive: '2–3 Weeks', monthly: '$199/mo', quarterly: '$537.30/qtr', annual: '$1,910.40/yr', savings: '20%' },
              { name: 'Provider / Physician', setup: '2–3 Days', training: '1–2 Days', goLive: '1 Week', monthly: '$99/mo', quarterly: '$267.30/qtr', annual: '$950.40/yr', savings: '20%' },
              { name: 'Attorney / Legal', setup: '2–3 Days', training: '1–2 Days', goLive: '1 Week', monthly: '$149/mo', quarterly: '$402.30/qtr', annual: '$1,430.40/yr', savings: '20%' },
              { name: 'Advocacy & Research', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$79/mo', quarterly: '$213.30/qtr', annual: '$758.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── PROFESSIONAL SERVICES ─── */}
          <div id="professional" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700"><Stethoscope size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Professional Services</h3>
                <p className="text-sm text-slate-500">One-time and recurring services we facilitate and collect payment for</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Telehealth Physician Evaluation', price: 'Varies by state', type: 'Per Visit', desc: 'Virtual physician consultation for medical cannabis recommendation. Pricing varies by provider and state jurisdiction. Includes physician evaluation and GGE processing & sync fee. Recommendation valid for state application.', icon: '📋' },
                { title: 'AI Virtual Attendant (Sylara)', price: '$149/mo', type: 'Monthly Add-on', desc: 'Branded @TheBackOffice.com virtual receptionist powered by Sylara AI. Handles inbound calls, appointment scheduling, intake routing, and customer service across your business.', icon: '🤖' },
                { title: 'State Application Processing', price: 'Varies by state', type: 'Per Application', desc: 'We facilitate state cannabis license and medical card applications. State fees (e.g. $22.50–$104.30 in Oklahoma) are collected separately by the state authority. GGE charges a $10 processing fee.', icon: '📄' },
              ].map((svc, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{svc.icon}</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">{svc.type}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{svc.title}</h4>
                  <p className="text-xl font-black text-emerald-700 mb-3">{svc.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Telehealth Evaluation', setup: 'N/A', training: 'N/A', goLive: 'Per Visit', monthly: 'Per Visit', quarterly: 'N/A', annual: 'N/A' },
              { name: 'AI Virtual Attendant', setup: '3–5 Days', training: '2–3 Days', goLive: '1–2 Weeks', monthly: '$149/mo', quarterly: '$402.30/qtr', annual: '$1,430.40/yr', savings: '20%' },
              { name: 'State App Processing', setup: 'N/A', training: 'N/A', goLive: 'Per App', monthly: '$10/app', quarterly: 'N/A', annual: 'N/A' },
            ]} />
          </div>

          {/* ─── LAB & PUBLIC HEALTH SUBSCRIPTIONS ─── */}
          <div id="lab_health" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700">🔬</div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Lab & Public Health Subscriptions</h3>
                <p className="text-sm text-slate-500">COA management, contamination monitoring, accreditation tracking, and compliance dashboards</p>
              </div>
            </div>
            <div className="mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 rounded-xl p-4">
              <p className="text-xs text-teal-800 leading-relaxed">
                <span className="font-black">NEW:</span> Purpose-built for cannabis testing laboratories, state health departments, tribal health authorities, and hospital systems.
                Includes real-time contamination zone mapping, patient outcome analytics, recall management, and Recency Index field testing integration.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Independent Lab', icon: '🧪', price: '$499', period: '/mo', tag: 'MOST POPULAR', tagColor: 'emerald', desc: 'Full COA management, accreditation tracking, contaminant monitoring, and multi-state compliance for licensed testing labs', features: ['COA upload, validation & auto-scan', 'Accreditation tracking (ISO 17025, DEA)', 'Contaminant flagging & recall alerts', 'Statewide pass rate analytics', 'Recency Index field test integration', 'Larry AI compliance monitoring'], color: 'teal' },
                { title: 'Regional Lab Network', icon: '🏗️', price: '$1,499', period: '/mo', tag: 'MULTI-SITE', tagColor: 'blue', desc: 'Multi-location lab network management with centralized compliance oversight and cross-facility contamination tracking', features: ['Everything in Independent Lab', 'Multi-facility dashboard (up to 10 labs)', 'Cross-facility contamination correlation', 'Centralized accreditation management', 'Network-wide pass rate benchmarking', 'Priority API access & data exports'], color: 'blue' },
                { title: 'State Health Department', icon: '🏛️', price: '$4,999', period: '/mo', tag: 'GOVERNMENT', tagColor: 'purple', desc: 'Statewide contamination monitoring, patient outcome tracking, outbreak detection, and recall management for state health agencies', features: ['GIS contamination zone mapping', 'Patient exposure tracking & notifications', 'Statewide lab compliance scorecards', 'Automated recall broadcast system', 'Source chain tracing (seed-to-sale)', 'Sylara Public Health AI assistant'], color: 'purple' },
                { title: 'Tribal Health Authority', icon: '🪶', price: '$2,499', period: '/mo', tag: 'TRIBAL SOVEREIGNTY', tagColor: 'amber', desc: 'Dual-jurisdiction compliance for tribal nations with federal-tribal bridge protocols and culturally integrated health data', features: ['Tribal compact compliance tracking', 'Federal-tribal bridge protocols', 'Sovereign health data management', 'Community exposure monitoring', 'Cultural wellness integration', 'Tribal-federal reporting automation'], color: 'amber' },
              ].map((product, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-slate-100 hover:border-teal-300 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col relative">
                  {product.tag && (
                    <div className={`absolute -top-3 right-4 px-3 py-1 bg-${product.tagColor}-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg`}>
                      {product.tag}
                    </div>
                  )}
                  <div className="text-3xl mb-3">{product.icon}</div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{product.title}</h4>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black text-teal-700">{product.price}</span>
                    <span className="text-xs font-bold text-slate-400">{product.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{product.desc}</p>
                  <ul className="space-y-2 text-xs text-slate-600 flex-1">
                    {product.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2"><CheckCircle size={12} className="text-teal-500 shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex gap-2">
                    <button onClick={() => onNavigate('larry-chatbot')} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-teal-50 hover:text-teal-700 transition-colors uppercase tracking-wider">Get Started</button>
                    <button onClick={() => window.open('https://calendly.com/globalgreenhpmeet/gghp-demo', '_blank')} className="flex-1 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-500 transition-colors uppercase tracking-wider">Book Demo</button>
                  </div>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Independent Lab', setup: '2–4 Weeks', training: '1 Week', goLive: '4–6 Weeks', monthly: '$499/mo', quarterly: '$1,347.30/qtr', annual: '$4,790.40/yr', savings: '20%' },
              { name: 'Regional Lab Network', setup: '4–6 Weeks', training: '2 Weeks', goLive: '6–8 Weeks', monthly: '$1,499/mo', quarterly: '$4,047.30/qtr', annual: '$14,390.40/yr', savings: '20%' },
              { name: 'State Health Dept', setup: '6–10 Weeks', training: '2–4 Weeks', goLive: '10–14 Weeks', monthly: '$4,999/mo', quarterly: '$13,497.30/qtr', annual: '$47,990.40/yr', savings: '20%' },
              { name: 'Tribal Health Authority', setup: '4–8 Weeks', training: '2–3 Weeks', goLive: '8–12 Weeks', monthly: '$2,499/mo', quarterly: '$6,747.30/qtr', annual: '$23,990.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── PUBLIC HEALTH PROFESSIONAL SERVICES ─── */}
          <div id="health_addons" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-700">🏥</div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Public Health Add-On Services</h3>
                <p className="text-sm text-slate-500">Specialized modules for hospitals, health networks, and research institutions</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'COA Validation & Auto-Scan Engine', price: '$299/mo', type: 'Add-On Module', desc: 'Upload COAs in PDF or XML format and Larry auto-validates against state limits for heavy metals, pesticide residue, microbial pathogens, and residual solvents. Includes dual-channel rapid testing device pairing for Recency Index field tests.', icon: '📊' },
                { title: 'Contamination Response System', price: '$799/mo', type: 'Add-On Module', desc: 'Real-time GIS exposure mapping, automated patient notification via Care Wallet, source chain analysis (cultivator → processor → lab → retailer), and coordinated recall broadcast to affected zones. Includes Sylara Public Health AI assistant.', icon: '🚨' },
                { title: 'Accreditation & Compliance Tracking', price: '$199/mo', type: 'Add-On Module', desc: 'Track ISO 17025, DEA Schedule I, state licenses, and tribal compacts across all facilities. Auto-renewal alerts 90 days before expiration. Compliance scorecard with trend analysis and facility benchmarking.', icon: '🏅' },
              ].map((svc, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{svc.icon}</span>
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100">{svc.type}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{svc.title}</h4>
                  <p className="text-xl font-black text-teal-700 mb-3">{svc.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'COA Validation Engine', setup: '1–2 Weeks', training: '2–3 Days', goLive: '2–3 Weeks', monthly: '$299/mo', quarterly: '$807.30/qtr', annual: '$2,870.40/yr', savings: '20%' },
              { name: 'Contamination Response', setup: '2–4 Weeks', training: '1 Week', goLive: '4–6 Weeks', monthly: '$799/mo', quarterly: '$2,157.30/qtr', annual: '$7,670.40/yr', savings: '20%' },
              { name: 'Accreditation Tracking', setup: '1 Week', training: '1–2 Days', goLive: '1–2 Weeks', monthly: '$199/mo', quarterly: '$537.30/qtr', annual: '$1,910.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── RAPID TESTING & HARDWARE — COMING SOON ─── */}
          <div id="rapid_testing" className="mb-16 scroll-mt-36 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-blue-900/30 border border-blue-400/30 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Coming Soon — Seeking Investment Partners
            </div>
            <div className="border-2 border-dashed border-blue-300 rounded-3xl p-8 pt-12 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700"><Smartphone size={20} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Rapid Testing & Hardware Products</h3>
                  <p className="text-sm text-slate-500">Field-deployable impairment testing for law enforcement, employers, testing sites, and health agencies</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white border border-blue-800 relative overflow-hidden">
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-500 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full">Coming Soon</div>
                  <div className="text-3xl mb-3">🔬</div>
                  <h4 className="text-lg font-black mb-1">Dual-Channel Rapid Testing Device</h4>
                  <p className="text-blue-300 text-xs font-bold mb-3">Recency Index (RI) Field Test</p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">Proprietary dual-channel breath analysis device that measures THC presence AND recency of consumption (0–9.99 RI scale) in real time. Differentiates active impairment from residual metabolites — the distinction traditional tests can't make. Instant results like an alcohol breathalyzer. Designed for law enforcement roadside stops, employer workplace safety programs, third-party testing sites, and clinical health screenings.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Recency Scale</p>
                      <p className="text-xs font-black text-emerald-400">0–9.99 RI</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Result Time</p>
                      <p className="text-xs font-black text-white">Instant (Breathalyzer)</p>
                    </div>
                  </div>
                  <button onClick={() => onNavigate('larry-chatbot')} className="w-full py-2.5 bg-yellow-500 text-slate-900 font-bold text-xs rounded-xl hover:bg-yellow-400 transition-colors uppercase tracking-wider">Join Waitlist</button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative">
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-[9px] font-black uppercase tracking-widest rounded-full border border-yellow-200">Coming Soon</div>
                  <div className="text-2xl mb-3">🧫</div>
                  <h4 className="font-black text-slate-900 mb-1">RI Test Strip Cartridges</h4>
                  <p className="text-lg font-black text-slate-400 mb-3">Price TBD <span className="text-xs font-bold">(per unit)</span></p>
                  <p className="text-xs text-slate-500 leading-relaxed">Replacement dual-channel cartridges for the Rapid Testing Device. Each cartridge performs one Recency Index field test. Bulk pricing available for law enforcement agencies, employers, testing facilities, and health departments.</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative">
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-[9px] font-black uppercase tracking-widest rounded-full border border-yellow-200">Coming Soon</div>
                  <div className="text-2xl mb-3">📱</div>
                  <h4 className="font-black text-slate-900 mb-1">Device Cloud Connectivity</h4>
                  <p className="text-lg font-black text-slate-400 mb-3">Price TBD <span className="text-xs font-bold">(per device/mo)</span></p>
                  <p className="text-xs text-slate-500 leading-relaxed">Bluetooth pairing, cloud sync, and auto-routing of RI test results to enforcement, lab, and patient dashboards. Firmware updates and device health monitoring included.</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 italic">Interested in partnering or investing in this technology? <button onClick={() => window.open('https://calendly.com/globalgreenhpmeet/gghp-demo', '_blank')} className="text-blue-600 font-bold hover:underline">Schedule a meeting →</button></p>
              </div>
            </div>
          </div>

          {/* ─── EDUCATION & CERTIFICATION ─── */}
          <div id="education" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700"><GraduationCap size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Education & Certification</h3>
                <p className="text-sm text-slate-500">Training programs, compliance certifications, and continuing education for industry professionals</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Compliance Officer Certification', price: '$299', type: 'One-Time', desc: 'Comprehensive training on state-by-state cannabis regulations, Metrc compliance, OMMA licensing requirements, and federal scheduling implications. Includes certificate of completion recognized by state agencies.', icon: '🎓' },
                { title: 'Budtender & Staff Training', price: '$49/seat', type: 'Per Employee', desc: 'Online course covering product knowledge, patient interaction protocols, seed-to-sale tracking, POS operation, and state-specific compliance requirements. Includes quiz-based certification.', icon: '📚' },
                { title: 'Continuing Education Portal', price: '$19/mo', type: 'Subscription', desc: 'Monthly updated courses on regulatory changes, DEA scheduling updates, new state legalization frameworks, and best practices. Required CE credits for compliance maintenance.', icon: '📖' },
              ].map((edu, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{edu.icon}</span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">{edu.type}</span>
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{edu.title}</h4>
                  <p className="text-xl font-black text-emerald-700 mb-3">{edu.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{edu.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Compliance Officer Cert', setup: 'Instant', training: '40 Hours', goLive: '1–2 Weeks', monthly: '$299 (one-time)', quarterly: 'N/A', annual: 'N/A' },
              { name: 'Budtender Training', setup: 'Instant', training: '8–12 Hours', goLive: '2–3 Days', monthly: '$49/seat', quarterly: 'N/A', annual: 'N/A' },
              { name: 'CE Portal', setup: 'Instant', training: 'Self-paced', goLive: 'Same Day', monthly: '$19/mo', quarterly: '$51.30/qtr', annual: '$182.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── CARE WALLET & PAYMENT PROCESSING ─── */}
          <div id="care_wallet" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700"><Wallet size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Care Wallet &amp; Payment Processing</h3>
                <p className="text-sm text-slate-500">Closed-loop stored value ecosystem for compliant cannabis transactions</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { tier: 'Bronze', price: 'Free', desc: 'Basic wallet, cash load, ecosystem spending, silent compliance checks' },
                { tier: 'Silver', price: '$19/mo', desc: 'Virtual card via NomadCash, spending limits, categorized tracking, insights' },
                { tier: 'Gold', price: '$49/mo', desc: 'AI-guided spending (Sylara), smart alerts, advanced analytics, auto-reload' },
                { tier: 'Platinum', price: '$99/mo', desc: 'Multiple virtual cards, role-based separation, full financial dashboard, real-time Larry enforcement' },
              ].map((w, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white border border-slate-700 hover:border-indigo-500 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{w.tier}</p>
                  <p className="text-xl font-black mb-2">{w.price}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'Bronze', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: 'Free', quarterly: 'Free', annual: 'Free' },
              { name: 'Silver', setup: 'Instant', training: 'Self-serve', goLive: 'Same Day', monthly: '$19/mo', quarterly: '$51.30/qtr', annual: '$182.40/yr', savings: '20%' },
              { name: 'Gold', setup: 'Instant', training: '1 Hour', goLive: 'Same Day', monthly: '$49/mo', quarterly: '$132.30/qtr', annual: '$470.40/yr', savings: '20%' },
              { name: 'Platinum', setup: '1–2 Days', training: '2–3 Hours', goLive: '1–3 Days', monthly: '$99/mo', quarterly: '$267.30/qtr', annual: '$950.40/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── GOVERNMENT & ENTERPRISE ─── */}
          <div id="government" className="mb-16 scroll-mt-36">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700"><Building2 size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Government &amp; Enterprise</h3>
                <p className="text-sm text-slate-500">High-capacity platforms for state regulators, law enforcement, and federal agencies</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'State Authority', price: 'From $4,999/mo', desc: 'Unified licensing portal, Metrc integration, compliance monitoring, public transparency. Replaces Thentia + Metrc admin at lower cost.' },
                { title: 'Law Enforcement', price: 'From $999/mo', desc: 'Enforcement dashboards, rapid testing recency index, violation detection, inter-agency coordination, Larry AI intelligence.' },
                { title: 'Federal Agency', price: 'From $9,999/mo', desc: 'Nationwide oversight, multi-agency dashboards, interstate commerce monitoring, SAM.gov compliance, policy simulation.' },
              ].map((gov, i) => (
                <div key={i} className="bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 p-6 shadow-sm hover:shadow-lg transition-all">
                  <h4 className="font-black text-slate-900 text-lg mb-1">{gov.title}</h4>
                  <p className="text-emerald-700 font-black mb-3">{gov.price}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{gov.desc}</p>
                </div>
              ))}
            </div>
            <PlanDetailsTable tiers={[
              { name: 'State Authority', setup: '8–12 Weeks', training: '4–6 Weeks', goLive: '12–16 Weeks', monthly: 'From $4,999/mo', quarterly: 'From $13,497/qtr', annual: 'From $47,990/yr', savings: '20%' },
              { name: 'Law Enforcement', setup: '4–8 Weeks', training: '2–4 Weeks', goLive: '8–12 Weeks', monthly: 'From $999/mo', quarterly: 'From $2,697/qtr', annual: 'From $9,590/yr', savings: '20%' },
              { name: 'Federal Agency', setup: '12–20 Weeks', training: '6–10 Weeks', goLive: '20–30 Weeks', monthly: 'From $9,999/mo', quarterly: 'From $26,997/qtr', annual: 'From $95,990/yr', savings: '20%' },
            ]} />
          </div>

          {/* ─── ACCEPTED PAYMENT METHODS ─── */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 text-center">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-4">Accepted Payment Methods</h4>
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {['ACH Bank Transfer', 'Debit Card', 'Credit Card (Visa/MC)', 'Care Wallet', 'Wire Transfer', 'Invoice / Net 30'].map((method, i) => (
                <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm">{method}</span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">Payment processing is facilitated by Authorize.net (credit/debit), Chime (Cash App/Venmo/Zelle), and ACH invoicing. All subscription billing is handled digitally. No cash payments are accepted online. Care Wallet is a closed-loop stored value system for in-ecosystem transactions only. Global Green Enterprise Inc (CAGE: 9KXZ2) is a registered federal supplier and Oklahoma state vendor.</p>
          </div>

          {/* ─── LEGAL DISCLOSURE ─── */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 max-w-3xl mx-auto leading-relaxed">
              All products and services are provided by Global Green Enterprise Inc, a registered Oklahoma corporation. SaaS subscriptions auto-renew at the listed rate. All plans include a 30-day free trial; after trial, invoicing begins via ACH or card. Quarterly billing saves 10%; annual billing saves 20%. State application fees are set by individual state authorities and are separate from GGP-OS subscription costs. Telehealth services are facilitated through licensed healthcare providers. Lab & Public Health subscriptions require verified laboratory or health authority credentials. Care Wallet is a closed-loop stored value product, not a bank account. FDIC insurance does not apply to Care Wallet balances. Pricing is subject to change. For questions, contact us at 1-888-963-4447.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
