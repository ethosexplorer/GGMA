import React from 'react';
import { ShoppingCart, Cpu, CheckCircle, Stethoscope, Wallet, Building2, ArrowLeft } from 'lucide-react';

export const ProductsServicesPage = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
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

      {/* Main Content (Copied from Landing Page) */}
      <section className="py-24 px-6 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-700 uppercase tracking-widest">
              <ShoppingCart size={12} /> Our Products & Services
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Products &amp; Services</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Global Green Enterprise Inc provides SaaS compliance technology, telehealth coordination, AI-powered operational tools, and payment processing for the legal cannabis industry across all 50 U.S. states.</p>
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
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700"><Cpu size={20} /></div>
              <div>
                <h3 className="text-xl font-black text-slate-900">GGP-OS Platform Subscriptions</h3>
                <p className="text-sm text-slate-500">Monthly & annual SaaS subscriptions for compliance, licensing, and AI-powered operations</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Patient / Consumer', icon: '🏥', price: '$49.99', period: '/mo', desc: 'Telehealth coordination, medical card management, Care Wallet, AI guidance via Sylara', features: ['Medical card application sync', 'Telehealth scheduling', 'Care Wallet stored value', 'Sylara AI personal assistant', 'Document vault & compliance tracker'], color: 'emerald' },
                { title: 'Business / Dispensary', icon: '🏢', price: '$199', period: '/mo', desc: 'Full compliance OS with POS, Metrc sync, inventory, and Larry enforcement AI', features: ['SINC POS system (card-ready)', 'Real-time Metrc seed-to-sale sync', 'Inventory & barcode tracking', 'Larry AI compliance monitoring', 'Automated state reporting'], color: 'blue' },
                { title: 'Provider / Physician', icon: '🩺', price: '$99', period: '/mo', desc: 'Patient management, telehealth consultations, recommendation workflows, and AI tools', features: ['Patient roster management', 'Telehealth consultation tools', 'Recommendation workflow', 'Sylara AI clinical guidance', 'Compliance & licensing tracker'], color: 'violet' },
                { title: 'Attorney / Legal', icon: '⚖️', price: '$149', period: '/mo', desc: 'Cannabis & general legal case management, client leads, regulatory AI, and Larry enforcement', features: ['Legal marketplace & lead access', 'Case management dashboard', 'Regulatory intelligence feeds', 'Larry AI legal compliance', 'Client billing & invoicing'], color: 'amber' },
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
          </div>

          {/* ─── PROFESSIONAL SERVICES ─── */}
          <div className="mb-16">
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
          </div>

          {/* ─── CARE WALLET & PAYMENT PROCESSING ─── */}
          <div className="mb-16">
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
          </div>

          {/* ─── GOVERNMENT & ENTERPRISE ─── */}
          <div className="mb-16">
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
              All products and services are provided by Global Green Enterprise Inc, a registered Oklahoma corporation. SaaS subscriptions auto-renew at the listed rate. All plans include a 30-day free trial; after trial, invoicing begins via ACH or card. State application fees are set by individual state authorities and are separate from GGP-OS subscription costs. Telehealth services are facilitated through licensed healthcare providers. Care Wallet is a closed-loop stored value product, not a bank account. FDIC insurance does not apply to Care Wallet balances. Pricing is subject to change. For questions, contact us at 1-888-963-4447.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
