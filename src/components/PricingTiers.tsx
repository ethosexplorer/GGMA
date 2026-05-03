import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckoutModal } from './CheckoutModal';
import { Check,
  Sparkles,
  Building2,
  Shield,
  User,
  Stethoscope,
  Briefcase,
  Gavel,
  Activity,
  Cpu,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Wallet,
  CreditCard,
  Headphones,
  BarChart3,
  Globe,
  Handshake,
  TrendingUp,
  AlertTriangle,
  Gift, CircleCheck } from 'lucide-react';
import {
  CANNABIS_B2B_PLANS,
  TRADITIONAL_B2B_PLANS,
  B2C_PLANS,
  PROVIDER_PLANS,
  CANNABIS_ATTORNEY_PLANS,
  GENERAL_ATTORNEY_PLANS,
  STATE_PLANS,
  FEDERAL_PLANS,
  ENFORCEMENT_PLANS,
  PUBLIC_HEALTH_PLANS,
  CARE_WALLET_PLANS,
  CARE_BUILDER_ADDONS,
  CANNABIS_BACKOFFICE_PLANS,
  NON_CANNABIS_BACKOFFICE_PLANS,
  EXTERNAL_ADMIN_PLANS,
  FINANCE_AI_PLANS,
  COMBINED_ENF_FIN_PLANS,
  PARTNER_PLANS,
  PARTNER_ADDONS,
  VOLUME_INCENTIVES,
  type SubscriptionPlan,
  type AddOn,
  COMMON_B2B_ADDONS,
  CANNABIS_ADDONS,
  ATTORNEY_ADDONS,
  FEDERAL_ADDONS,
  STATE_ADDONS,
  PATIENT_ADDONS,
  PUBLIC_HEALTH_ADDONS,
  BACKOFFICE_ADDONS,
  ADMIN_ADDONS,
  STATE_APPLICATION_FEES,
  TRIAL_TERMS,
} from '../lib/subscriptionPlans';

// ─── Tab Configuration ───
const TIER_TABS = [
  { id: 'patient', label: 'Patient (B2C)', icon: User, color: 'from-sky-500 to-blue-600', accent: 'sky' },
  { id: 'cannabis_b2b', label: 'Cannabis B2B', icon: Building2, color: 'from-emerald-500 to-green-700', accent: 'emerald' },
  { id: 'traditional_b2b', label: 'Traditional B2B', icon: BarChart3, color: 'from-violet-500 to-purple-700', accent: 'violet' },
  { id: 'provider', label: 'Providers', icon: Stethoscope, color: 'from-teal-500 to-cyan-700', accent: 'teal' },
  { id: 'attorney', label: 'Attorneys', icon: Gavel, color: 'from-amber-500 to-orange-600', accent: 'amber' },
  { id: 'backoffice', label: 'Back Office', icon: Cpu, color: 'from-rose-500 to-pink-700', accent: 'rose' },
  { id: 'care_wallet', label: 'Care Wallet', icon: CreditCard, color: 'from-indigo-500 to-blue-700', accent: 'indigo' },
  { id: 'state', label: 'State Authority', icon: Shield, color: 'from-orange-500 to-red-600', accent: 'orange' },
  { id: 'federal', label: 'Federal', icon: Globe, color: 'from-blue-800 to-slate-900', accent: 'blue' },
  { id: 'enforcement', label: 'Enforcement', icon: Activity, color: 'from-red-600 to-red-900', accent: 'red' },
  { id: 'public_health', label: 'Public Health', icon: Shield, color: 'from-emerald-500 to-teal-700', accent: 'emerald' },
  { id: 'partners', label: 'Partners', icon: Handshake, color: 'from-cyan-500 to-teal-700', accent: 'cyan' },
] as const;

type TabId = typeof TIER_TABS[number]['id'];

function getPlansForTab(tabId: TabId): SubscriptionPlan[] {
  switch (tabId) {
    case 'patient': return B2C_PLANS;
    case 'cannabis_b2b': return CANNABIS_B2B_PLANS;
    case 'traditional_b2b': return TRADITIONAL_B2B_PLANS;
    case 'provider': return PROVIDER_PLANS;
    case 'attorney': return [...CANNABIS_ATTORNEY_PLANS, ...GENERAL_ATTORNEY_PLANS];
    case 'backoffice': return [...CANNABIS_BACKOFFICE_PLANS, ...NON_CANNABIS_BACKOFFICE_PLANS];
    case 'care_wallet': return CARE_WALLET_PLANS;
    case 'state': return STATE_PLANS;
    case 'federal': return FEDERAL_PLANS;
    case 'enforcement': return [...ENFORCEMENT_PLANS, ...FINANCE_AI_PLANS];
    case 'public_health': return PUBLIC_HEALTH_PLANS;
    case 'partners': return PARTNER_PLANS;
    default: return [];
  }
}

function getAddOnsForTab(tabId: TabId): AddOn[] {
  switch (tabId) {
    case 'patient': return PATIENT_ADDONS;
    case 'cannabis_b2b': return [...COMMON_B2B_ADDONS, ...CANNABIS_ADDONS];
    case 'traditional_b2b': return COMMON_B2B_ADDONS;
    case 'attorney': return ATTORNEY_ADDONS;
    case 'backoffice': return BACKOFFICE_ADDONS;
    case 'care_wallet': return CARE_BUILDER_ADDONS;
    case 'state': return STATE_ADDONS;
    case 'federal': return FEDERAL_ADDONS;
    case 'enforcement': return [];
    case 'public_health': return PUBLIC_HEALTH_ADDONS;
    case 'provider': return [];
    case 'partners': return PARTNER_ADDONS;
    default: return [];
  }
}

function getTabDescription(tabId: TabId): string {
  switch (tabId) {
    case 'patient': return 'Individual patients & caregivers seeking medical cannabis access and health management.';
    case 'cannabis_b2b': return 'Dispensaries, cultivators, processors — full seed-to-sale compliance with Metrc integration.';
    case 'traditional_b2b': return 'Non-cannabis businesses leveraging our AI-powered operations and compliance platform.';
    case 'provider': return 'Licensed medical professionals conducting consultations, certifications, and telehealth.';
    case 'attorney': return 'Cannabis & general legal counsel managing licensing, compliance portfolios, and client cases.';
    case 'backoffice': return 'AI-powered operational support for cannabis and general businesses — virtual attendants, scheduling, CRM.';
    case 'care_wallet': return 'Closed-loop stored value cards, credit-building programs, and ecosystem-wide spending.';
    case 'state': return 'State regulatory agencies overseeing licensing, compliance monitoring, and public health data.';
    case 'federal': return 'Federal interagency coordination — DEA, FDA, HHS — with nationwide intelligence and enforcement.';
    case 'enforcement': return 'Law enforcement, rapid testing intelligence, and financial crime analytics.';
    case 'public_health': return 'Advocates, researchers, and public health officials monitoring demographic trends and safety data.';
    case 'partners': return 'Earn recurring revenue by referring or reselling SINC to dispensaries, operators, and state agencies.';
    default: return '';
  }
}

function formatPrice(plan: SubscriptionPlan, billing: 'monthly' | 'annual', addonTotal: number = 0): string {
  if (billing === 'monthly') {
    if (plan.monthlyPrice === 'Custom') return 'Custom';
    return (plan.monthlyPrice === 0 && addonTotal === 0) ? 'Free' : `$${(Number(plan.monthlyPrice) + addonTotal).toLocaleString()}`;
  }
  if (typeof plan.annualPrice === 'string') return plan.annualPrice;
  return `$${(Number(plan.annualPrice) + (addonTotal * 12)).toLocaleString()}`;
}

// ─── Plan Card ───
const PlanCard = ({ plan, index, total, billing, selectedAddons, tabId, onCheckout }: { key?: string; plan: SubscriptionPlan; index: number; total: number; billing: 'monthly' | 'annual'; selectedAddons: AddOn[]; tabId: TabId; onCheckout: (items: any[], trialDays: number) => void }) => {
  const isMid = total === 3 && index === 1;
  const isPopular = isMid || (total === 4 && index === 2);
  const addonTotal = selectedAddons.reduce((sum, addon) => sum + (typeof addon.price === 'number' ? addon.price : 0), 0);
  const price = formatPrice(plan, billing, addonTotal);
  const hasTrial = typeof plan.monthlyPrice === 'number' && plan.monthlyPrice > 0 && price !== 'Custom';
  
  // Determine trial type
  const isPatientPlan = tabId === 'patient';
  const isPartnerPlan = tabId === 'partners';
  const trialDays = isPatientPlan ? 30 : isPartnerPlan ? 0 : 7;
  const showTrial = hasTrial && trialDays > 0;
  const discountPercent = (!isPatientPlan && !isPartnerPlan) ? 30 : 0;
  const firstMonthPrice = typeof plan.monthlyPrice === 'number' ? plan.monthlyPrice * (1 - discountPercent / 100) : plan.monthlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`relative flex flex-col rounded-[2rem] border p-8 transition-all ${
        isPopular
          ? 'border-emerald-500 bg-emerald-50/30 shadow-2xl scale-[1.03] z-10'
          : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
          ⭐ Most Popular
        </div>
      )}

      {/* Dynamic Pricing Calculator (Top Right) */}
      {selectedAddons.length > 0 && price !== 'Custom' && (
        <div className="absolute top-4 right-4 bg-white border border-emerald-200 rounded-xl p-3 shadow-lg z-20 text-right min-w-[140px]">
          <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider text-left">Your Total</p>
          <div className="flex justify-between items-center text-[11px] mb-0.5">
            <span className="text-slate-600 text-left">Base Plan:</span>
            <span className="font-medium text-slate-800">${typeof plan.monthlyPrice === 'number' ? (billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice) : plan.monthlyPrice}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] mb-1.5 pb-1.5 border-b border-slate-100">
            <span className="text-emerald-600 text-left">{selectedAddons.length} Add-on{selectedAddons.length > 1 ? 's' : ''}:</span>
            <span className="font-bold text-emerald-600">+{billing === 'monthly' ? `$${addonTotal}` : `$${addonTotal * 12}`}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-black text-slate-900 mb-2">
            <span className="text-left">Total:</span>
            <span>{price}</span>
          </div>
          <button
            onClick={() => onCheckout([{ name: plan.name, price: billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice, type: 'plan', billing }, ...selectedAddons.map(a => ({ name: a.name, price: a.price, type: 'addon' as const, per: a.per }))], trialDays)}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md"
          >
            Checkout <ArrowRight size={10} />
          </button>
        </div>
      )}

      {/* Free Trial Badge */}
      {showTrial && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl mb-2 w-fit shadow-sm">
          <Gift size={12} className="text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{trialDays} Days Free</span>
        </div>
      )}
      {showTrial && discountPercent > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mb-4 w-fit shadow-sm">
          <Star size={12} className="text-white fill-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{discountPercent}% Off Month 1</span>
        </div>
      )}
      {showTrial && discountPercent === 0 && <div className="mb-2" />}

      {/* Header */}
      <h3 className="text-xl font-black text-slate-800 mb-1">{plan.name}</h3>
      {plan.bestFor && (
        <p className="text-xs text-slate-500 italic mb-4 leading-relaxed">{plan.bestFor}</p>
      )}

      {/* Price */}
      {showTrial && (
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-black text-emerald-600">$0</span>
          <span className="text-sm font-bold text-slate-400">for {trialDays} days</span>
        </div>
      )}
      {showTrial && discountPercent > 0 && (
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-lg font-bold text-amber-600">then ${typeof firstMonthPrice === 'number' ? firstMonthPrice.toFixed(2) : firstMonthPrice}<span className="text-xs">/first mo</span></span>
        </div>
      )}
      <div className={`flex items-baseline gap-1 ${showTrial ? 'mb-1' : 'mb-1'}`}>
        {showTrial ? (
          <span className="text-lg font-bold text-slate-400">then {price}<span className="text-xs">/{billing === 'monthly' ? 'mo' : 'yr'}</span></span>
        ) : (
          <>
            <span className="text-4xl font-black text-slate-900">{price}</span>
            {price !== 'Free' && price !== 'Custom' && (
              <span className="text-sm font-bold text-slate-400">
                /{billing === 'monthly' ? 'mo' : 'yr'}
              </span>
            )}
          </>
        )}
      </div>

      {/* Auto-charge disclosure */}
      {hasTrial && (
        <p className="text-[10px] text-amber-700 font-bold mb-4 flex items-start gap-1">
          <CreditCard size={11} className="shrink-0 mt-0.5" />
          Invoice sent after trial. No card required.
        </p>
      )}

      {billing === 'annual' && typeof plan.annualPrice === 'number' && typeof plan.monthlyPrice === 'number' && plan.monthlyPrice > 0 && (
        <p className="text-xs text-emerald-600 font-bold mb-4">
          Save {Math.round((1 - plan.annualPrice / (plan.monthlyPrice * 12)) * 100)}% vs monthly
        </p>
      )}

      {/* AI Level */}
      {plan.aiLevel && (
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl mb-5 border border-slate-200">
          <Sparkles size={14} className="text-purple-500 shrink-0" />
          <span className="text-[11px] font-bold text-slate-600 leading-snug">{plan.aiLevel}</span>
        </div>
      )}

      {/* Contract Type */}
      {plan.contractType && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg mb-4 border border-amber-200">
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">{plan.contractType}</span>
        </div>
      )}

      {/* Tokens */}
      {plan.tokensMonth && (
        <div className="text-xs font-bold text-slate-500 mb-4">
          <span className="text-slate-800">{plan.tokensMonth}</span> tokens/mo
        </div>
      )}

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <div className="space-y-3 mb-8 flex-1">
          {plan.features.map((f, j) => (
            <div key={j} className="flex items-start gap-2.5 text-[13px] text-slate-600">
              <CircleCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">{f}</span>
            </div>
          ))}
        </div>
      )}
      {(!plan.features || plan.features.length === 0) && <div className="flex-1" />}

      {/* CTA */}
      <button
        onClick={() => {
          if (price === 'Custom') {
            window.open('mailto:globalgreenhp@gmail.com?subject=Enterprise Plan Inquiry - ' + plan.name, '_blank');
          } else {
            onCheckout(
              [{ name: plan.name, price: billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice, type: 'plan' as const, billing }, ...selectedAddons.map(a => ({ name: a.name, price: a.price, type: 'addon' as const, per: a.per }))],
              trialDays
            );
          }
        }}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all ${
          isPopular
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20'
            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
        }`}
      >
        {price === 'Custom' ? 'Contact Sales' : price === 'Free' ? 'Get Started Free' : showTrial ? 'Start Free Trial' : 'Get Started'}
      </button>
    </motion.div>
  );
};

// ─── Add-On Card ───
const AddOnCard = ({ addon, isSelected, onToggle }: { key?: string; addon: AddOn; isSelected: boolean; onToggle: (addon: AddOn) => void }) => (
  <div 
    onClick={() => onToggle(addon)}
    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
      isSelected 
        ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
    }`}
  >
    <div className="flex items-center gap-3 flex-1">
      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
        isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-slate-50'
      }`}>
        {isSelected && <Check size={14} className="text-white" />}
      </div>
      <div>
        <p className={`font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{addon.name}</p>
        {addon.per && <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>per {addon.per}</p>}
      </div>
    </div>
    <div className="text-right shrink-0 ml-4">
      <span className={`font-black text-sm ${isSelected ? 'text-emerald-700' : 'text-emerald-600'}`}>
        ${typeof addon.price === 'number' ? addon.price.toLocaleString(undefined, { minimumFractionDigits: addon.price % 1 !== 0 ? 2 : 0 }) : addon.price}
      </span>
      {!addon.per && <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>/mo</span>}
    </div>
  </div>
);

// ─── Main Component ───
export const PricingTiers = ({ onNavigate, defaultTab, onChatRole, allowedTabs }: { onNavigate?: (view: string) => void, defaultTab?: TabId, onChatRole?: (role: string) => void, allowedTabs?: string[] }) => {
  const visibleTabs = allowedTabs ? TIER_TABS.filter(t => allowedTabs.includes(t.id)) : TIER_TABS;
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab || (visibleTabs[0]?.id as TabId) || 'patient');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  // Sync with external defaultTab changes
  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab]);

  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  
  // Clear selected addons when tab changes
  useEffect(() => {
    setSelectedAddons([]);
  }, [activeTab]);

  const toggleAddon = (addon: AddOn) => {
    setSelectedAddons(prev => 
      prev.find(a => a.id === addon.id) 
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  // Checkout modal state
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [checkoutTrialDays, setCheckoutTrialDays] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  const openCheckout = (items: any[], trialDays: number) => {
    setCheckoutItems(items);
    setCheckoutTrialDays(trialDays);
    setShowCheckout(true);
  };

  const plans = getPlansForTab(activeTab);
  const addons = getAddOnsForTab(activeTab);
  const description = getTabDescription(activeTab);
  const activeTabConfig = TIER_TABS.find(t => t.id === activeTab)!;

  return (
    <section id="membership-tiers" className="py-24 px-6 bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto">

        {/* Header — hidden when used inside RolePricingPage */}
        {!allowedTabs && (
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 rounded-full border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
            <Star size={12} className="fill-emerald-500 text-emerald-500" />
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Compliance Membership <span className="text-emerald-600">Tiers</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
            Scalable infrastructure for patients, commercial entities, and regulatory bodies. Choose your role to see tailored plans.
          </p>
        </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Description + Billing Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeTabConfig.color} flex items-center justify-center shadow-lg`}>
              <activeTabConfig.icon size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">{activeTabConfig.label}</h3>
              <p className="text-sm text-slate-500 max-w-md">{description}</p>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                billing === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                billing === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Annual
              <span className="ml-1.5 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-black">SAVE</span>
            </button>
          </div>
        </div>

        {/* Application Fees Note (Patient tab only) */}
        {activeTab === 'patient' && (
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-1">
                <h4 className="font-black text-sky-900 text-sm mb-2">State Application Fees (Separate from Subscription)</h4>
                <p className="text-xs text-sky-700 leading-relaxed mb-3">{STATE_APPLICATION_FEES.note}</p>
                <div className="flex gap-6">
                  <div>
                    <span className="text-lg font-black text-sky-900">${STATE_APPLICATION_FEES.withStateInsurance.total}</span>
                    <p className="text-[10px] text-sky-600 font-bold">{STATE_APPLICATION_FEES.withStateInsurance.eligibility}</p>
                  </div>
                  <div className="border-l border-sky-200 pl-6">
                    <span className="text-lg font-black text-sky-900">${STATE_APPLICATION_FEES.withoutStateInsurance.total}</span>
                    <p className="text-[10px] text-sky-600 font-bold">{STATE_APPLICATION_FEES.withoutStateInsurance.eligibility}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Available Single/Add-on Section — ABOVE Plans */}
        {addons.length > 0 && (
          <div className="max-w-5xl mx-auto mb-10">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Sparkles size={18} className="text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-slate-800 text-sm">Available Single/Add-on</h4>
                    <p className="text-xs text-slate-500">{addons.length} modular enhancements — select to bundle with any plan below</p>
                  </div>
                </div>
                {selectedAddons.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                      <span className="text-xs font-bold text-emerald-700">{selectedAddons.length} selected</span>
                      <span className="text-sm font-black text-emerald-700">
                        +${selectedAddons.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0).toFixed(2)}/mo
                      </span>
                    </div>
                    <button 
                      onClick={() => openCheckout(selectedAddons.map(a => ({ name: a.name, price: a.price, type: 'addon' as const, per: a.per })), 0)}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-md"
                    >
                      Checkout <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Add-on Grid — always visible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
                {addons.map(addon => (
                  <AddOnCard 
                    key={addon.id} 
                    addon={addon} 
                    isSelected={!!selectedAddons.find(a => a.id === addon.id)}
                    onToggle={toggleAddon}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + billing}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            <div className={`grid gap-6 ${
              plans.length <= 3 ? 'grid-cols-1 md:grid-cols-3' :
              plans.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
              plans.length <= 6 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {plans.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} index={i} total={plans.length} billing={billing} selectedAddons={selectedAddons} tabId={activeTab} onCheckout={openCheckout} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Volume Incentives (Partners tab only) */}
        {activeTab === 'partners' && (
          <div className="max-w-5xl mx-auto mt-12">
            <div className="bg-cyan-50 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-base">Volume Incentives</h4>
                  <p className="text-xs text-slate-500">The more clients you bring, the more you earn</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {VOLUME_INCENTIVES.map((v, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-sm">
                    <p className="font-black text-cyan-800 text-sm mb-1">{v.threshold}</p>
                    <p className="text-xs text-slate-600">{v.bonus}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-cyan-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-black text-slate-900">$74.70</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Monthly per referral (Affiliate)</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-600">$80–$100</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Monthly margin per client (Reseller)</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">80–90%</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gross margin on software</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trial Agreement & Auto-Charge Disclosure */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black text-amber-900 text-sm">Trial & Introductory Pricing Notice</h4>
                <div className="text-xs text-amber-700 leading-relaxed mt-1 space-y-1">
                  <p>• <strong>Patients:</strong> {TRIAL_TERMS.patient.shortDisclosure}</p>
                  <p>• <strong>Business & Government:</strong> {TRIAL_TERMS.standard.shortDisclosure}</p>
                  <p>• <strong>Partners:</strong> {TRIAL_TERMS.partner.shortDisclosure}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {TRIAL_TERMS.agreementText}
              </p>
            </div>
            <p className="text-[10px] text-amber-600 mt-3 font-medium">
              {TRIAL_TERMS.cancellationPolicy}
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-slate-500 mb-4 font-medium">
            Need a custom plan? Our team can build a tailored package for your organization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate?.('login')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
            >
              Start Free Today
              <ArrowRight size={18} />
            </button>
            {onChatRole && (
              <button
                onClick={() => onChatRole(activeTab)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-500 transition-all shadow-xl shadow-purple-600/20"
              >
                💬 Ask Sylara About This Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={checkoutItems}
        billing={billing}
        trialDays={checkoutTrialDays}
        planCategory={activeTab}
      />
    </section>
  );
};

export default PricingTiers;

