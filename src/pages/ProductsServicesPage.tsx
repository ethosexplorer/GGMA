import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, ArrowLeft, ArrowRight, FileText, Copy, Check, X, Shield, Sparkles, Wallet, Cpu, Users, Award, Zap, Phone, MessageCircle, Star, ChevronRight, Globe, Lock } from 'lucide-react';
import { PLATFORM_TIERS } from '../data/productCatalogData';

/* ── Paid Subscription Confirmation & Service Agreement Modal ── */
const SubscriptionLetterModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState('patient');
  const [copied, setCopied] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const plans: Record<string, {
    title: string; tier: string; price: string; annual: string; savings: string;
    billing: string; trialTerms: string; setup: string; training: string; goLive: string;
    features: string[]; sla: string; supportTier: string; dedicatedRep: string;
    disclosures: string[];
  }> = {
    patient: {
      title: 'Patient / Consumer Subscription', tier: 'Individual',
      price: '$49.99/mo', annual: '$479.88/yr', savings: '$119.88',
      billing: 'Monthly auto-renewal via ACH, debit card, or credit card (Visa/MC).',
      trialTerms: '30-day free trial. No charge until Day 31. Cancel anytime during trial at no cost.',
      setup: 'Instant — self-serve account creation, no approval wait',
      training: 'Self-serve tutorials, Sylara AI guided onboarding, in-app walkthroughs',
      goLive: 'Same day — immediate full platform access upon registration',
      features: ['Medical card application sync & state portal integration (all 50 states + tribal nations)', 'Telehealth physician scheduling & HIPAA-compliant video consultations', 'Care Wallet stored value account (Bronze tier included, upgradeable)', 'Sylara AI personal assistant — medication reminders, appointment scheduling, compliance alerts', 'Document vault — encrypted storage for medical records, prescriptions, and legal documents', 'Compliance tracker — license renewal alerts, state requirement changes, expiration notices', 'C3 Credit Scoring — cannabis-specific credit assessment and financial health tools', 'Legal & Attorney Marketplace — direct access to vetted cannabis attorneys', 'Prescription & recommendation management with provider-verified digital records', 'Community forums & advocacy tools access'],
      sla: '99.5% platform uptime. Standard support response within 24 business hours.',
      supportTier: 'Standard — Email & in-app chat support, Mon–Fri 8AM–8PM CT',
      dedicatedRep: 'No — AI-assisted support via Sylara + email escalation',
      disclosures: ['Telehealth services are facilitated through independently licensed, board-certified healthcare providers. GGE does not provide medical care directly.', 'Care Wallet is a closed-loop stored value product for use within the GGP ecosystem only. It is NOT a bank account. FDIC insurance does NOT apply.', 'Medical card application fees are set by individual state authorities and are collected separately from this subscription. GGE charges a $10 processing fee per application submission.', 'All patient health data is classified as Protected Health Information (PHI) under HIPAA and is encrypted using AES-256 encryption at rest and TLS 1.3 encryption in transit.', 'C3 Credit Scoring is an internal assessment tool and is not reported to major credit bureaus.'],
    },
    business: {
      title: 'Business / Dispensary Subscription', tier: 'Commercial',
      price: '$199/mo', annual: '$1,910.40/yr', savings: '$477.60',
      billing: 'Monthly auto-renewal via ACH, credit card (Visa/MC), or invoice (Net 30 available for annual commitments).',
      trialTerms: '30-day free trial with full feature access. POS system configured during trial. No charge until Day 31.',
      setup: '1–2 weeks — includes Metrc API integration, SINC POS configuration, inventory import/migration',
      training: '3–5 business days — dedicated onboarding specialist assigned',
      goLive: '2–3 weeks — full operational readiness verified',
      features: ['SINC POS system — card-ready terminal with Metrc integration', 'Real-time Metrc seed-to-sale synchronization', 'Inventory management & barcode tracking', 'Larry AI compliance monitoring', 'Automated state reporting', 'Tax filing integration', 'Employee management — role-based access control', 'Revenue analytics & margin optimization', 'Customer loyalty program', 'Multi-location support — $99/mo each'],
      sla: '99.7% platform uptime. POS guaranteed 99.9% during business hours. Priority support within 4 business hours.',
      supportTier: 'Priority — Phone, email & chat support. Dedicated onboarding specialist for first 60 days.',
      dedicatedRep: 'Yes — Assigned account manager for first 90 days',
      disclosures: ['Business subscribers must maintain an active state cannabis license in good standing.', 'Metrc integration requires valid API credentials from your state regulatory authority.', 'POS processing fees: 2.9% + $0.30 per card transaction; 1.0% for ACH. Separate from subscription.', 'Larry AI compliance monitoring is advisory. It does NOT constitute legal counsel.'],
    },
    provider: {
      title: 'Provider / Physician Subscription', tier: 'Professional',
      price: '$99/mo', annual: '$950.40/yr', savings: '$237.60',
      billing: 'Monthly auto-renewal via ACH or credit card.',
      trialTerms: '30-day free trial. Credential verification begins during trial — no charge until verified and Day 31.',
      setup: '2–3 business days — includes credential verification, telehealth room setup',
      training: '1–2 business days — HIPAA compliance orientation, telehealth walkthrough',
      goLive: '1 week — upon successful credential verification',
      features: ['Patient roster management & scheduling', 'HIPAA-compliant telehealth video consultations', 'Digital recommendation & prescription workflows', 'Sylara AI clinical decision support', 'Compliance & licensing tracker', 'Secure messaging with patients', 'DEA registration & prescribing integration', 'Revenue reporting & consultation analytics', 'E-signature capability', 'Multi-state practice support'],
      sla: '99.7% platform uptime. Telehealth guaranteed 99.9%. Support within 4 business hours.',
      supportTier: 'Priority — Phone & email support. HIPAA officer available.',
      dedicatedRep: 'Yes — Dedicated practice success manager for first 60 days',
      disclosures: ['Providers must hold active, unrestricted medical licenses.', 'All telehealth must comply with state-specific telemedicine regulations.', 'Sylara AI clinical decision support is advisory only.', 'HIPAA BAA executed upon account activation. GGE maintains SOC 2 Type II.'],
    },
  };

  const plan = plans[selectedPlan];
  const sep = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

  const letterText = [
    '╔════════════════════════════════════════════════════════════╗',
    '║     GLOBAL GREEN ENTERPRISE INC.                           ║',
    '║     SUBSCRIPTION CONFIRMATION & SERVICE AGREEMENT          ║',
    '╚════════════════════════════════════════════════════════════╝',
    '', `Date Issued: ${today}`, `Subscription ID: GGE-SUB-${Date.now().toString(36).toUpperCase()}`, `Plan: ${plan.title}`, `Tier: ${plan.tier}`,
    '', 'Dear Valued Subscriber,', '',
    `Thank you for subscribing to the ${plan.title} on the Global Green Hybrid Platform (GGP-OS). This document serves as your official subscription confirmation and service agreement.`,
    '', sep, 'SECTION 1: SUBSCRIPTION & PRICING', sep, '',
    `Plan Name:       ${plan.title}`, `Monthly Rate:    ${plan.price}`, `Annual Rate:     ${plan.annual}`, `Annual Savings:  ${plan.savings}`,
    '', `Billing: ${plan.billing}`, `Free Trial: ${plan.trialTerms}`,
    '', sep, 'SECTION 2: IMPLEMENTATION', sep, '',
    `Setup:    ${plan.setup}`, `Training: ${plan.training}`, `Go-Live:  ${plan.goLive}`,
    '', sep, 'SECTION 3: FEATURES', sep, '',
    ...plan.features.map((f, i) => `  ${i + 1}. ${f}`),
    '', sep, 'SECTION 4: SLA', sep, '',
    `Uptime: ${plan.sla}`, `Support: ${plan.supportTier}`, `Rep: ${plan.dedicatedRep}`,
    '', sep, 'SECTION 5: DISCLOSURES', sep, '',
    ...plan.disclosures.map((d, i) => `  ${i + 1}. ${d}`),
    '', sep, '',
    'Warm regards,', '', 'Shantell Robinson', 'Founder & CEO', 'Global Green Enterprise Inc.',
    '"Bridging Indigenous and Federal — On Equal Ground"',
    '', sep, `Generated: ${today}`, '© 2024–2026 Global Green Enterprise Inc.', sep,
  ].join('\n');

  const handleCopy = () => { navigator.clipboard.writeText(letterText); setCopied(true); setTimeout(() => setCopied(false), 3000); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 flex items-center justify-between shrink-0 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center"><FileText size={22} className="text-white" /></div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Subscription Confirmation & Service Agreement</h2>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Paid Subscription — Complete Terms & SLA</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"><X size={18} /></button>
        </div>
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 flex-wrap shrink-0">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">Select Plan:</span>
          {[{id:'patient',label:'🏥 Patient',price:'$49.99'},{id:'business',label:'🏢 Business',price:'$199'},{id:'provider',label:'🩺 Provider',price:'$99'}].map(p => (
            <button key={p.id} onClick={() => setSelectedPlan(p.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPlan === p.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'}`}>{p.label} <span className="text-[9px] opacity-70">{p.price}/mo</span></button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-[1.7] selection:bg-indigo-200">{letterText}</div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[10px] text-slate-500 font-bold">Preview template. Personalized upon enrollment.</p>
          <button onClick={handleCopy} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Agreement</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════
   AFFILIATE LANDING PAGE
   Clean, high-conversion page for cold traffic from Freemius affiliate links.
   Shows top 3 plans + CTA to create free account to see all tiers.
   URL: https://ggp-os.com/products-services
   ════════════════════════════════════════════════════════════════════════ */

export const ProductsServicesPage = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [showSubLetter, setShowSubLetter] = useState(false);

  // Top 3 plans for the affiliate page
  const topPlans = PLATFORM_TIERS.filter(t => ['patient', 'business', 'provider'].includes(t.id));

  const planColors: Record<string, { bg: string; border: string; badge: string; btnBg: string; btnHover: string; glow: string }> = {
    patient:  { bg: 'from-emerald-50 to-white', border: 'border-emerald-200 hover:border-emerald-400', badge: 'bg-emerald-100 text-emerald-800', btnBg: 'bg-emerald-600', btnHover: 'hover:bg-emerald-500', glow: 'shadow-emerald-900/10' },
    business: { bg: 'from-blue-50 to-white', border: 'border-blue-200 hover:border-blue-400', badge: 'bg-blue-100 text-blue-800', btnBg: 'bg-blue-600', btnHover: 'hover:bg-blue-500', glow: 'shadow-blue-900/10' },
    provider: { bg: 'from-violet-50 to-white', border: 'border-violet-200 hover:border-violet-400', badge: 'bg-violet-100 text-violet-800', btnBg: 'bg-violet-600', btnHover: 'hover:bg-violet-500', glow: 'shadow-violet-900/10' },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Subscription Letter Modal */}
      {showSubLetter && <SubscriptionLetterModal onClose={() => setShowSubLetter(false)} />}

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f14] via-[#0f2d1e] to-[#1a4731]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(16,185,129,0.4), transparent 70%)' }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Top Nav */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/gghp-logo.png" alt="GGHP" className="h-12 w-auto object-contain brightness-0 invert" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('landing')} className="px-4 py-2 border border-white/20 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 transition-colors">
              <ArrowLeft size={14} className="inline mr-1" /> Back to Portal
            </button>
            <button onClick={() => onNavigate('login')} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/30">
              Login
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-8 pb-20 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-emerald-300 uppercase tracking-widest backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Trusted by businesses & patients across 50 states
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
            The All-in-One Platform<br />
            <span className="text-emerald-400">for Legal Cannabis</span>
          </h1>

          <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed font-medium">
            Compliance, payments, telehealth, and AI — all connected.<br />
            Start your <span className="text-white font-black">30-day free trial</span> today. No credit card required.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button onClick={() => onNavigate('signup')} className="px-10 py-4 bg-white text-[#1a4731] rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-xl shadow-black/10 flex items-center gap-2 border-2 border-white/80 hover:scale-[1.02]">
              Create Your Free Account <ArrowRight size={20} />
            </button>
            <button onClick={() => window.open('https://calendly.com/globalgreenhpmeet/gghp-demo', '_blank')} className="px-8 py-4 bg-emerald-500/20 text-emerald-300 rounded-2xl font-black text-lg hover:bg-emerald-500/30 transition-all border border-emerald-400/30 backdrop-blur-sm">
              📞 Book a Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF STRIP ═══ */}
      <section className="bg-slate-900 border-y border-slate-800 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { value: '50', label: 'States + DC', icon: <Globe size={16} className="text-emerald-400" /> },
            { value: '26', label: 'Languages', icon: <span className="text-sm">🌐</span> },
            { value: '99.9%', label: 'Uptime SLA', icon: <Shield size={16} className="text-emerald-400" /> },
            { value: 'SOC 2', label: 'Certified', icon: <Lock size={16} className="text-emerald-400" /> },
            { value: 'SAM.gov', label: 'Registered', icon: <span className="text-sm">🇺🇸</span> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              {stat.icon}
              <div>
                <p className="text-lg font-black leading-none">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TOP 3 PLAN CARDS ═══ */}
      <section className="py-20 px-6 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-700 uppercase tracking-widest">
              <Sparkles size={12} /> Most Popular Plans
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Choose Your Plan</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Every plan includes a <span className="font-black text-emerald-700">30-day free trial</span>. No commitment. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topPlans.map((plan) => {
              const colors = planColors[plan.id] || planColors.patient;
              const isBusiness = plan.id === 'business';
              return (
                <div
                  key={plan.id}
                  className={`relative bg-gradient-to-b ${colors.bg} rounded-3xl border-2 ${colors.border} p-8 shadow-lg ${colors.glow} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${isBusiness ? 'md:-translate-y-4 md:scale-[1.03]' : ''}`}
                >
                  {isBusiness && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-900/30 flex items-center gap-1.5">
                      <Star size={10} /> Most Popular
                    </div>
                  )}

                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.title}</h3>

                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-sm font-bold text-slate-400">{plan.period}</span>
                  </div>

                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">{plan.desc}</p>

                  <ul className="space-y-3 text-sm text-slate-700 flex-1 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onNavigate('signup')}
                    className={`w-full py-4 ${colors.btnBg} ${colors.btnHover} text-white rounded-2xl font-black text-base transition-all shadow-lg flex items-center justify-center gap-2 group`}
                  >
                    Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-center text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-wider">No credit card required</p>
                </div>
              );
            })}
          </div>

          {/* Save 20% Annual Badge */}
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <Award size={16} className="text-emerald-600" />
              <span className="text-sm font-black text-emerald-800">Save 20% with annual billing on all plans</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CREATE ACCOUNT TO SEE ALL TIERS ═══ */}
      <section className="py-16 px-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.4), transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,185,129,0.4), transparent 50%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-indigo-300 uppercase tracking-widest">
            <ShoppingCart size={12} /> Full Product Catalog
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Want to see <span className="text-emerald-400">all plans & add-ons</span>?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We offer <span className="font-black text-white">7+ subscription tiers</span>, professional services, lab & public health dashboards, government enterprise contracts, Care Wallet, education certifications, and more — all inside your personalized dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {['Attorney / Legal', 'Lab & Testing', 'Government', 'Advocacy', 'Care Wallet', 'Education', 'Rapid Testing'].map((label, i) => (
              <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white/70 backdrop-blur-sm">
                {label}
              </span>
            ))}
          </div>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('signup')}
              className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 mx-auto hover:scale-[1.02] border-2 border-white/80"
            >
              Create a Free Account to See All Plans <ChevronRight size={20} />
            </button>
            <p className="text-xs text-slate-400 mt-4 font-bold">Free forever account • No credit card • Explore every tier inside your dashboard</p>
          </div>
        </div>
      </section>

      {/* ═══ 6 FEATURE ICONS ═══ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Everything You Need, Built In</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Six powerful engines working together as one unified compliance operating system.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: <Wallet size={32} />, title: 'Care Wallet', desc: 'Closed-loop stored value payments with silent compliance tracking. Earn Care Points with every transaction.', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { icon: <Shield size={32} />, title: 'L.A.R.R.Y AI', desc: 'Real-time compliance enforcement engine. Monitors regulations across all 50 states and flags violations instantly.', color: 'bg-red-50 text-red-600 border-red-200' },
              { icon: <Award size={32} />, title: 'C³ Score', desc: 'Cannabis-specific credit scoring. Compassion, Compliance & Community — the industry\'s first trust metric.', color: 'bg-amber-50 text-amber-600 border-amber-200' },
              { icon: <Sparkles size={32} />, title: 'Sylara AI', desc: 'Your intelligent personal assistant. Handles scheduling, compliance alerts, clinical guidance, and more.', color: 'bg-violet-50 text-violet-600 border-violet-200' },
              { icon: <Cpu size={32} />, title: 'SINC POS', desc: 'Card-ready point-of-sale with real-time Metrc seed-to-sale synchronization. Inventory, taxes, and compliance in one.', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
              { icon: <Zap size={32} />, title: 'Recency Index', desc: 'Proprietary impairment detection algorithm (0-9.99 scale). The first real-time THC recency field test.', color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
            ].map((feat, i) => (
              <div key={i} className={`${feat.color} border-2 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-5 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST BADGES ═══ */}
      <section className="py-16 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Verified & Registered Across All Government Levels</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'SAM.gov', sub: 'Federal Supplier', badge: 'CAGE: 9KXZ2', icon: '🇺🇸', color: 'border-blue-200 hover:border-blue-400' },
              { label: 'OMES', sub: 'State Vendor', badge: 'Oklahoma Procurement', icon: '🏛️', color: 'border-emerald-200 hover:border-emerald-400' },
              { label: 'OKC', sub: 'City Registered', badge: 'Business License', icon: '🏙️', color: 'border-purple-200 hover:border-purple-400' },
              { label: 'WOSB', sub: 'Women-Owned', badge: 'SBA Certified', icon: '👩‍💼', color: 'border-rose-200 hover:border-rose-400' },
              { label: 'MBE', sub: 'Minority-Owned', badge: 'State Certified', icon: '🤝', color: 'border-amber-200 hover:border-amber-400' },
            ].map((badge, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 border-2 ${badge.color} hover:shadow-lg hover:-translate-y-1 transition-all text-center`}>
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <h4 className="font-black text-slate-900 text-sm">{badge.label}</h4>
                <p className="text-[10px] text-slate-500 font-bold">{badge.sub}</p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">{badge.badge}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SUBSCRIPTION AGREEMENT PREVIEW ═══ */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <button
            onClick={() => setShowSubLetter(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:scale-[1.02] transition-all border border-slate-700 group"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <FileText size={20} />
            </div>
            <div className="text-left">
              <p className="font-black text-sm uppercase tracking-wider">Preview Subscription Agreement</p>
              <p className="text-slate-400 text-[10px] font-bold">Pricing, SLA, HIPAA, Billing, Disclosures & Legal Terms</p>
            </div>
          </button>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a1f14] to-[#1a4731] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.4), transparent 60%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-emerald-100/70 leading-relaxed font-medium">
            Join thousands of businesses, patients, and providers who trust GGP-OS for their compliance, payments, and operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate('signup')} className="px-10 py-5 bg-white text-[#1a4731] rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-2xl shadow-black/10 flex items-center gap-2 hover:scale-[1.02]">
              Create Your Free Account <ArrowRight size={20} />
            </button>
            <a href="tel:18889634447" className="px-8 py-5 bg-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2 backdrop-blur-sm">
              <Phone size={20} /> 1-888-963-4447
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <a href="imessage://+16452468277" className="flex items-center gap-2 text-emerald-300 font-bold text-sm hover:text-white transition-colors">
              <MessageCircle size={16} /> Text: (645) 246-8277
            </a>
            <span className="text-slate-500">•</span>
            <a href="mailto:asstsupport@gmail.com" className="text-emerald-300 font-bold text-sm hover:text-white transition-colors">
              asstsupport@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-[10px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
            All products and services are provided by Global Green Enterprise Inc, a registered Oklahoma corporation. SaaS subscriptions auto-renew at the listed rate. All plans include a 30-day free trial; after trial, invoicing begins via ACH or card. Quarterly billing saves 10%; annual billing saves 20%. State application fees are set by individual state authorities and are separate from GGP-OS subscription costs. Telehealth services are facilitated through licensed healthcare providers. Care Wallet is a closed-loop stored value product, not a bank account. FDIC insurance does not apply. Pricing is subject to change.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-600 font-bold">
            <span>CAGE: 9KXZ2</span>
            <span>•</span>
            <span>SAM.gov Active</span>
            <span>•</span>
            <span>SOC 2 Type II</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
          </div>
          <p className="text-[10px] text-slate-600">
            © 2024–2026 Global Green Enterprise Inc. All rights reserved. "Bridging Indigenous and Federal — On Equal Ground"
          </p>
        </div>
      </footer>
    </div>
  );
};
