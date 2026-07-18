import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Package, Sparkles, Wallet, Building2, GraduationCap, Stethoscope, Smartphone, Shield, Cpu } from 'lucide-react';
import {
  SECTION_META, ROLE_SECTIONS, PLATFORM_TIERS, PLATFORM_PLAN_DETAILS,
  PROFESSIONAL_SERVICES, PROFESSIONAL_PLAN_DETAILS,
  LAB_HEALTH_TIERS, LAB_HEALTH_PLAN_DETAILS,
  HEALTH_ADDONS, HEALTH_ADDONS_PLAN_DETAILS,
  EDUCATION_ITEMS, EDUCATION_PLAN_DETAILS,
  CARE_WALLET_TIERS, CARE_WALLET_PLAN_DETAILS,
  GOVERNMENT_PLANS, GOVERNMENT_PLAN_DETAILS,
  ACCEPTED_PAYMENTS,
  type SectionId, type PlanDetail,
} from '../../data/productCatalogData';

/* ── Mini Plan Details Table ── */
const MiniPlanTable = ({ tiers }: { tiers: PlanDetail[] }) => (
  <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-[10px]">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="text-left px-3 py-2 font-black text-slate-600 uppercase tracking-widest sticky left-0 bg-slate-50 z-10">Plan</th>
          <th className="text-center px-2 py-2 font-black text-blue-600 uppercase tracking-widest border-l border-slate-200">Setup</th>
          <th className="text-center px-2 py-2 font-black text-blue-600 uppercase tracking-widest">Training</th>
          <th className="text-center px-2 py-2 font-black text-emerald-600 uppercase tracking-widest">Go-Live</th>
          <th className="text-center px-2 py-2 font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Monthly</th>
          <th className="text-center px-2 py-2 font-black text-emerald-600 uppercase tracking-widest">Annual ✨</th>
        </tr>
      </thead>
      <tbody>
        {tiers.map((t, i) => (
          <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50/30 transition-colors`}>
            <td className="px-3 py-2 font-bold text-slate-800 sticky left-0 bg-inherit z-10 whitespace-nowrap">{t.name}</td>
            <td className="px-2 py-2 text-center font-bold text-blue-600 border-l border-slate-100">{t.setup}</td>
            <td className="px-2 py-2 text-center font-bold text-blue-600">{t.training}</td>
            <td className="px-2 py-2 text-center">
              <span className="font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{t.goLive}</span>
            </td>
            <td className="px-2 py-2 text-center font-bold text-slate-600 border-l border-slate-100">{t.monthly}</td>
            <td className="px-2 py-2 text-center">
              <span className="font-black text-emerald-700">{t.annual}</span>
              {t.savings && <span className="ml-1 text-[8px] font-bold text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded-full">Save {t.savings}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Product Card ── */
const ProductCard = ({ product }: { key?: any; product: { title: string; icon: string; price: string; period?: string; desc: string; features?: string[]; tag?: string; tagColor?: string } }) => (
  <div className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-sm hover:shadow-lg transition-all group flex flex-col relative">
    {product.tag && (
      <div className={`absolute -top-2.5 right-3 px-2.5 py-0.5 bg-${product.tagColor || 'emerald'}-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-md`}>
        {product.tag}
      </div>
    )}
    <div className="text-2xl mb-2">{product.icon}</div>
    <h4 className="text-sm font-black text-slate-900 mb-1">{product.title}</h4>
    <div className="flex items-baseline gap-1 mb-2">
      <span className="text-lg font-black text-emerald-700">{product.price}</span>
      {product.period && <span className="text-[10px] font-bold text-slate-400">{product.period}</span>}
    </div>
    <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">{product.desc}</p>
    {product.features && (
      <ul className="space-y-1.5 text-[10px] text-slate-600 flex-1">
        {product.features.map((f, j) => (
          <li key={j} className="flex items-start gap-1.5"><CheckCircle size={10} className="text-emerald-500 shrink-0 mt-0.5" />{f}</li>
        ))}
      </ul>
    )}
  </div>
);

/* ── Service Card ── */
const ServiceCard = ({ svc }: { key?: any; svc: { title: string; icon: string; price: string; type: string; desc: string } }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xl">{svc.icon}</span>
      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">{svc.type}</span>
    </div>
    <h4 className="font-black text-slate-900 text-sm mb-1">{svc.title}</h4>
    <p className="text-sm font-black text-emerald-700 mb-2">{svc.price}</p>
    <p className="text-[10px] text-slate-500 leading-relaxed">{svc.desc}</p>
  </div>
);

/* ── Section Icon Map ── */
const SECTION_ICONS: Record<string, React.ReactNode> = {
  platform: <Cpu size={18} />,
  professional: <Stethoscope size={18} />,
  lab_health: <span className="text-base">🔬</span>,
  health_addons: <span className="text-base">🏥</span>,
  rapid_testing: <Smartphone size={18} />,
  education: <GraduationCap size={18} />,
  care_wallet: <Wallet size={18} />,
  government: <Building2 size={18} />,
};

/* ════════════════════════════════════════════════════════════════════════
   DASHBOARD PRODUCT MENU
   Role-filtered product catalog displayed as an accordion inside dashboards.
   ════════════════════════════════════════════════════════════════════════ */

export const DashboardProductMenu = ({ role }: { role: string }) => {
  const sections = ROLE_SECTIONS[role] || ROLE_SECTIONS['admin'];
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(sections[0] || null);

  const toggle = (id: SectionId) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const renderSectionContent = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'platform':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {PLATFORM_TIERS.map((p, i) => <ProductCard key={i} product={p} />)}
            </div>
            <MiniPlanTable tiers={PLATFORM_PLAN_DETAILS} />
          </>
        );

      case 'professional':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROFESSIONAL_SERVICES.map((s, i) => <ServiceCard key={i} svc={s} />)}
            </div>
            <MiniPlanTable tiers={PROFESSIONAL_PLAN_DETAILS} />
          </>
        );

      case 'lab_health':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LAB_HEALTH_TIERS.map((p, i) => <ProductCard key={i} product={p} />)}
            </div>
            <MiniPlanTable tiers={LAB_HEALTH_PLAN_DETAILS} />
          </>
        );

      case 'health_addons':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HEALTH_ADDONS.map((s, i) => <ServiceCard key={i} svc={s} />)}
            </div>
            <MiniPlanTable tiers={HEALTH_ADDONS_PLAN_DETAILS} />
          </>
        );

      case 'rapid_testing':
        return (
          <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
              Coming Soon — Seeking Investment Partners
            </div>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl p-5 text-white border border-blue-800 relative">
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500 text-slate-900 text-[8px] font-black uppercase tracking-widest rounded-full">Coming Soon</div>
                <div className="text-2xl mb-2">🔬</div>
                <h4 className="text-sm font-black mb-1">Dual-Channel Rapid Testing Device</h4>
                <p className="text-blue-300 text-[10px] font-bold mb-2">Recency Index (RI) Field Test</p>
                <p className="text-slate-400 text-[10px] leading-relaxed">Proprietary dual-channel breath analysis device that measures THC presence AND recency of consumption (0–9.99 RI scale) in real time.</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 relative">
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[8px] font-black uppercase tracking-widest rounded-full border border-yellow-200">Coming Soon</div>
                <div className="text-xl mb-2">🧫</div>
                <h4 className="font-black text-slate-900 text-sm mb-1">RI Test Strip Cartridges</h4>
                <p className="text-slate-400 text-sm font-black mb-2">Price TBD</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">Replacement dual-channel cartridges for the Rapid Testing Device. Each cartridge performs one Recency Index field test.</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 relative">
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[8px] font-black uppercase tracking-widest rounded-full border border-yellow-200">Coming Soon</div>
                <div className="text-xl mb-2">📱</div>
                <h4 className="font-black text-slate-900 text-sm mb-1">Device Cloud Connectivity</h4>
                <p className="text-slate-400 text-sm font-black mb-2">Price TBD</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">Bluetooth pairing, cloud sync, and auto-routing of RI test results to enforcement, lab, and patient dashboards.</p>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EDUCATION_ITEMS.map((e, i) => <ServiceCard key={i} svc={e} />)}
            </div>
            <MiniPlanTable tiers={EDUCATION_PLAN_DETAILS} />
          </>
        );

      case 'care_wallet':
        return (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CARE_WALLET_TIERS.map((w, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white border border-slate-700 hover:border-indigo-500 transition-all">
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">{w.tier}</p>
                  <p className="text-lg font-black mb-1">{w.price}</p>
                  <p className="text-[10px] text-slate-300 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
            <MiniPlanTable tiers={CARE_WALLET_PLAN_DETAILS} />
          </>
        );

      case 'government':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GOVERNMENT_PLANS.map((gov, i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-purple-100 hover:border-purple-300 p-5 shadow-sm hover:shadow-lg transition-all">
                  <h4 className="font-black text-slate-900 text-sm mb-1">{gov.title}</h4>
                  <p className="text-emerald-700 font-black text-sm mb-2">{gov.price}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{gov.desc}</p>
                </div>
              ))}
            </div>
            <MiniPlanTable tiers={GOVERNMENT_PLAN_DETAILS} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Products & Services</h2>
            <p className="text-xs text-slate-500">Explore plans, add-ons, and upgrade options available for your account</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-widest">
            {sections.length} Categories Available
          </span>
        </div>
      </div>

      {/* Accepted Payment Methods Banner */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-2">Payment Methods:</span>
        {ACCEPTED_PAYMENTS.map((m, i) => (
          <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm">{m}</span>
        ))}
      </div>

      {/* Accordion Sections */}
      {sections.map(sectionId => {
        const meta = SECTION_META[sectionId];
        const isExpanded = expandedSection === sectionId;

        return (
          <div key={sectionId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggle(sectionId)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  {SECTION_ICONS[sectionId] || <Sparkles size={18} />}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-900">{meta.label}</h3>
                  <p className="text-[10px] text-slate-500">{meta.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden md:inline">{meta.icon}</span>
                {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {renderSectionContent(sectionId)}
              </div>
            )}
          </div>
        );
      })}

      {/* Legal Disclosure */}
      <div className="text-center pt-4">
        <p className="text-[9px] text-slate-400 max-w-3xl mx-auto leading-relaxed">
          All products and services are provided by Global Green Enterprise Inc, a registered Oklahoma corporation. SaaS subscriptions auto-renew at the listed rate. All plans include a 30-day free trial. Quarterly billing saves 10%; annual billing saves 20%. Care Wallet is a closed-loop stored value product, not a bank account. FDIC insurance does not apply. Pricing is subject to change. Contact: 1-888-963-4447.
        </p>
      </div>
    </div>
  );
};

export default DashboardProductMenu;
