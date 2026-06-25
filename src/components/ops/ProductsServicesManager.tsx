import React, { useState } from 'react';
import { ShoppingCart, Plus, Edit2, Trash2, X, Check, Save, ChevronDown, ChevronRight, Eye, Zap, Clock, DollarSign, Shield, Layers, FileText, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  B2C_PLANS, CANNABIS_B2B_PLANS, TRADITIONAL_B2B_PLANS,
  PROVIDER_PLANS, CANNABIS_ATTORNEY_PLANS, GENERAL_ATTORNEY_PLANS,
  STATE_PLANS, FEDERAL_PLANS, ENFORCEMENT_PLANS,
  FINANCE_AI_PLANS, COMBINED_ENF_FIN_PLANS,
  PUBLIC_HEALTH_PLANS, EXTERNAL_ADMIN_PLANS,
  CANNABIS_BACKOFFICE_PLANS, NON_CANNABIS_BACKOFFICE_PLANS,
  CARE_WALLET_PLANS, PARTNER_PLANS,
  COMMON_B2B_ADDONS, CANNABIS_ADDONS, ATTORNEY_ADDONS, PROVIDER_ADDONS,
  FEDERAL_ADDONS, PATIENT_ADDONS, PUBLIC_HEALTH_ADDONS, STATE_ADDONS,
  BACKOFFICE_ADDONS, ADMIN_ADDONS, CROSS_DASHBOARD_ADDONS,
  CARE_BUILDER_ADDONS, PARTNER_ADDONS,
  STATE_APPLICATION_FEES, TRIAL_TERMS, VOLUME_INCENTIVES,
  type SubscriptionPlan, type AddOn,
} from '../../lib/subscriptionPlans';

interface Product {
  id: string;
  category: string;
  title: string;
  tier: string;
  icon: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  source?: string;
  aiLevel?: string;
  contractType?: string;
  tokensMonth?: string;
  trialDays?: number;
  trialPrice?: number;
  bestFor?: string;
  monthlyRaw?: number | 'Custom';
  annualRaw?: number | 'Custom';
}

// Helper to format price
const fmtPrice = (p: number | 'Custom') => p === 'Custom' ? 'Custom' : `$${p.toLocaleString()}`;

// Build products from subscriptionPlans.ts data
const buildProductsFromPlans = (): Product[] => {
  const products: Product[] = [];

  const addPlanGroup = (plans: SubscriptionPlan[], category: string, icon: string, groupTitle: string) => {
    plans.forEach(plan => {
      products.push({
        id: plan.id,
        category,
        title: `${groupTitle}`,
        tier: plan.name,
        icon,
        price: `${fmtPrice(plan.monthlyPrice)}/mo`,
        period: plan.annualPrice !== 'Custom' ? `${fmtPrice(plan.annualPrice)}/yr` : 'Custom',
        desc: plan.bestFor || plan.aiLevel || '',
        features: plan.features || [],
        source: 'subscriptionPlans',
        aiLevel: plan.aiLevel,
        contractType: plan.contractType,
        tokensMonth: plan.tokensMonth,
        trialDays: plan.trialDays,
        trialPrice: plan.trialPrice,
        bestFor: plan.bestFor,
        monthlyRaw: plan.monthlyPrice,
        annualRaw: plan.annualPrice,
      });
    });
  };

  // B2C Patient / Consumer
  addPlanGroup(B2C_PLANS, 'Platform Subscriptions', '🏥', 'Patient / Consumer (B2C)');

  // Cannabis Business
  addPlanGroup(CANNABIS_B2B_PLANS, 'Platform Subscriptions', '🌿', 'Business / Dispensary (Cannabis)');

  // Traditional Business
  addPlanGroup(TRADITIONAL_B2B_PLANS, 'Platform Subscriptions', '🏢', 'Business (Traditional)');

  // Provider / Physician
  addPlanGroup(PROVIDER_PLANS, 'Platform Subscriptions', '🩺', 'Provider / Physician');

  // Cannabis Attorney
  addPlanGroup(CANNABIS_ATTORNEY_PLANS, 'Platform Subscriptions', '⚖️', 'Attorney (Cannabis)');

  // General Attorney
  addPlanGroup(GENERAL_ATTORNEY_PLANS, 'Platform Subscriptions', '⚖️', 'Attorney (General)');

  // Cannabis Backoffice
  addPlanGroup(CANNABIS_BACKOFFICE_PLANS, 'BackOffice Plans', '📦', 'Cannabis BackOffice');

  // General Backoffice
  addPlanGroup(NON_CANNABIS_BACKOFFICE_PLANS, 'BackOffice Plans', '📦', 'General BackOffice');

  // External Admin
  addPlanGroup(EXTERNAL_ADMIN_PLANS, 'BackOffice Plans', '🔑', 'External Admin Dashboard');

  // Care Wallet
  addPlanGroup(CARE_WALLET_PLANS, 'Care Wallet Tiers', '💳', 'Care Wallet');

  // State Authority
  addPlanGroup(STATE_PLANS, 'Government & Enterprise', '🏛️', 'State Authority');

  // Federal
  addPlanGroup(FEDERAL_PLANS, 'Government & Enterprise', '🇺🇸', 'Federal Agency');

  // Enforcement
  addPlanGroup(ENFORCEMENT_PLANS, 'Government & Enterprise', '🚔', 'Law Enforcement');

  // Finance AI
  addPlanGroup(FINANCE_AI_PLANS, 'Government & Enterprise', '📊', 'Finance AI');

  // Combined
  addPlanGroup(COMBINED_ENF_FIN_PLANS, 'Government & Enterprise', '⚡', 'Combined Enforcement + Finance');

  // Public Health
  addPlanGroup(PUBLIC_HEALTH_PLANS, 'Government & Enterprise', '🔬', 'Public Health & Lab');

  // Partners
  addPlanGroup(PARTNER_PLANS, 'Partner Programs', '🤝', 'Partner / Distribution');

  // Professional Services (manual — not plan-based)
  products.push(
    { id: 'svc_telehealth', category: 'Professional Services', title: 'Telehealth Physician Evaluation', tier: '—', icon: '📋', price: 'Varies by state', period: 'Per Visit', desc: 'Virtual physician consultation for medical cannabis recommendation.', features: ['Physician evaluation', 'GGE processing & sync fee', 'Recommendation valid for state application'], source: 'manual' },
    { id: 'svc_sylara', category: 'Professional Services', title: 'AI Virtual Attendant (Sylara)', tier: '—', icon: '🤖', price: '$149/mo', period: 'Monthly', desc: 'Branded @TheBackOffice.com virtual receptionist powered by Sylara AI.', features: ['Inbound call handling', 'Appointment scheduling', 'Intake routing', 'Customer service'], source: 'manual' },
    { id: 'svc_stateapp', category: 'Professional Services', title: 'State Application Processing', tier: '—', icon: '📄', price: `$${STATE_APPLICATION_FEES.withoutStateInsurance.total} standard / $${STATE_APPLICATION_FEES.withStateInsurance.total} insured`, period: 'Per App', desc: `State fees + GGE processing. ${STATE_APPLICATION_FEES.note}`, features: ['State fee varies', 'GGE processing fee included', 'Multi-state support'], source: 'manual' },
  );

  return products;
};

const CATEGORIES = ['All', 'Platform Subscriptions', 'BackOffice Plans', 'Professional Services', 'Care Wallet Tiers', 'Government & Enterprise', 'Partner Programs'];

const TIER_COLORS: Record<string, string> = {
  'Basic': 'bg-slate-100 text-slate-600',
  'Starter': 'bg-slate-100 text-slate-600',
  'B2C Basic': 'bg-slate-100 text-slate-600',
  'Standard': 'bg-blue-50 text-blue-700',
  'Medium': 'bg-blue-50 text-blue-700',
  'Professional': 'bg-violet-50 text-violet-700',
  'Pro': 'bg-violet-50 text-violet-700',
  'Premium': 'bg-violet-50 text-violet-700',
  'Enterprise': 'bg-amber-50 text-amber-700',
  'Full AI': 'bg-rose-50 text-rose-700',
  'Custom': 'bg-emerald-50 text-emerald-700',
  'Bronze': 'bg-orange-50 text-orange-700',
  'Silver': 'bg-slate-100 text-slate-600',
  'Gold': 'bg-yellow-50 text-yellow-700',
  'Platinum': 'bg-indigo-50 text-indigo-700',
  'Brand Ambassador': 'bg-teal-50 text-teal-700',
  'Authorized Reseller': 'bg-cyan-50 text-cyan-700',
  'Strategic Distribution Partner': 'bg-purple-50 text-purple-700',
  '—': 'bg-slate-50 text-slate-400',
};

const getTierColor = (tier: string) => {
  // Try exact match first, then partial matches
  if (TIER_COLORS[tier]) return TIER_COLORS[tier];
  const lc = tier.toLowerCase();
  if (lc.includes('basic') || lc.includes('starter') || lc.includes('core')) return 'bg-slate-100 text-slate-600';
  if (lc.includes('medium') || lc.includes('standard')) return 'bg-blue-50 text-blue-700';
  if (lc.includes('pro') || lc.includes('premium')) return 'bg-violet-50 text-violet-700';
  if (lc.includes('enterprise') || lc.includes('full ai')) return 'bg-amber-50 text-amber-700';
  if (lc.includes('custom') || lc.includes('strategic')) return 'bg-emerald-50 text-emerald-700';
  return 'bg-slate-100 text-slate-500';
};

export const ProductsServicesManager = () => {
  const [products, setProducts] = useState<Product[]>(buildProductsFromPlans);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [filterCat, setFilterCat] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null);
  const [previewAgreement, setPreviewAgreement] = useState<Product | null>(null);
  const [agreementText, setAgreementText] = useState('');
  const [copiedAgreement, setCopiedAgreement] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'Platform Subscriptions', title: '', tier: 'Basic', icon: '📦', price: '', period: '/mo', desc: '', features: [] });

  const toggleDetail = (id: string) => setExpandedDetail(prev => prev === id ? null : id);

  const generateAgreementText = (p: Product): string => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const subId = `GGE-SUB-${Date.now().toString(36).toUpperCase()}`;
    const sep = '\u2501'.repeat(60);
    const savings = p.monthlyRaw !== 'Custom' && p.annualRaw !== 'Custom' && p.monthlyRaw && p.annualRaw ? `$${((p.monthlyRaw as number) * 12 - (p.annualRaw as number)).toFixed(2)}` : 'Custom';
    const lines = [
      '\u2554' + '\u2550'.repeat(60) + '\u2557',
      '\u2551     GLOBAL GREEN ENTERPRISE INC.                           \u2551',
      '\u2551     SUBSCRIPTION CONFIRMATION & SERVICE AGREEMENT          \u2551',
      '\u255A' + '\u2550'.repeat(60) + '\u255D',
      '', `Date Issued: ${today}`, `Subscription ID: ${subId}`,
      `Plan: ${p.title} \u2014 ${p.tier}`, `Category: ${p.category}`,
      '', 'Dear Valued Subscriber,', '',
      `Thank you for subscribing to the ${p.title} (${p.tier} tier) on the Global Green Hybrid Platform (GGP-OS). This document serves as your official subscription confirmation and service agreement. Please retain this letter for your records.`,
      '', '', sep, 'SECTION 1: WHO THIS PLAN IS FOR', sep, '',
      `Target Audience: ${p.bestFor || 'General platform users'}`,
      `Category: ${p.category}`, `Product Line: ${p.title}`, `Tier: ${p.tier}`,
      '', '', sep, 'SECTION 2: SUBSCRIPTION & PRICING', sep, '',
      `Plan Name:        ${p.title} \u2014 ${p.tier}`,
      `Monthly Rate:     ${p.price}`,
      `Annual Rate:      ${p.period}`,
      `Annual Savings:   ${savings}`,
      `Contract Type:    ${p.contractType || 'Month-to-Month'}`,
      '', `Billing Terms: Monthly auto-renewal via ACH invoice. Card processing coming soon.`,
      '', `Free Trial: ${p.trialDays !== undefined ? `${p.trialDays}-day free trial. ${p.trialPrice === 0 ? 'No charge until trial ends.' : `$${p.trialPrice} introductory rate.`} Cancel anytime during trial at no cost.` : 'Contact sales for trial terms.'}`,
      '', '', sep, 'SECTION 3: AI & TECHNOLOGY INCLUDED', sep, '',
      `AI Level:         ${p.aiLevel || 'Standard Platform Access'}`,
      `Tokens/Month:     ${p.tokensMonth || 'Standard Allocation'}`,
      '', '', sep, 'SECTION 4: INCLUDED FEATURES & SERVICES', sep, '',
      ...(p.features.length > 0 ? p.features.map((f, i) => `  ${i + 1}. ${f}`) : ['  Standard platform access included.']),
      '', '', sep, 'SECTION 5: ACCOUNT ACCESS', sep, '',
      'Platform URL:     https://ggp-os.com',
      'Login Email:      [Subscriber registered email]',
      'Password:         [Set during registration \u2014 change upon first login]', '',
      'SECURITY REQUIREMENTS:',
      '  \u2022 Change your password upon first login',
      '  \u2022 Enable two-factor authentication (2FA)',
      '  \u2022 Do not share login credentials with unauthorized personnel',
      '  \u2022 Report suspected unauthorized access to security@ggp-os.com',
      '', '', sep, 'SECTION 6: BILLING, RENEWAL & CANCELLATION', sep, '',
      'AUTO-RENEWAL:',
      '  Your subscription automatically renews at the end of each billing',
      '  cycle at the then-current rate. Email reminder sent 7 days before renewal.', '',
      'BILLING CYCLES & DISCOUNTS:',
      '  \u2022 Monthly \u2014 Standard rate',
      '  \u2022 Quarterly \u2014 10% discount applied',
      '  \u2022 Annual \u2014 20% discount applied', '',
      'CANCELLATION:',
      '  \u2022 Cancel anytime through account settings or call 1-888-963-4447',
      '  \u2022 Takes effect at end of current billing period',
      '  \u2022 You retain access until end of paid period',
      '  \u2022 30-day written notice for annual plan cancellations', '',
      'REFUND POLICY:',
      '  \u2022 Free trial: No charge if cancelled within trial period',
      '  \u2022 Monthly plans: No partial-month refunds',
      '  \u2022 Annual plans: Prorated refund within first 90 days', '',
      'FAILED PAYMENTS:',
      '  \u2022 7-day grace period for failed payments',
      '  \u2022 Account suspended after 7 days, deactivated after 30 days',
      '  \u2022 Data retained for 90 days per retention policy',
      '', '', sep, 'SECTION 7: DATA PRIVACY, SECURITY & COMPLIANCE', sep, '',
      'DATA ENCRYPTION:',
      '  \u2022 At Rest: AES-256 encryption',
      '  \u2022 In Transit: TLS 1.3',
      '  \u2022 Backups: Encrypted, geographically redundant, tested monthly', '',
      'HIPAA COMPLIANCE:',
      '  \u2022 Full HIPAA compliance for all health-related data',
      '  \u2022 Business Associate Agreements (BAA) with all processors',
      '  \u2022 Annual third-party HIPAA audit',
      '  \u2022 Breach notification within 60 days per HITECH Act', '',
      'CERTIFICATIONS: SOC 2 Type II (current), FedRAMP (in progress), ISO 27001 aligned', '',
      'DATA RETENTION:',
      '  \u2022 Active accounts: Duration of subscription',
      '  \u2022 After cancellation: 90 days then deleted',
      '  \u2022 Health records: 7-year minimum (HIPAA)',
      '  \u2022 Lab/COA records: 3-year minimum (federal)',
      '  \u2022 Data export available anytime (CSV, JSON, PDF)',
      '', '', sep, 'SECTION 8: ACCEPTABLE USE POLICY', sep, '',
      'You agree NOT to:',
      '  \u2022 Use the platform for any illegal activity',
      '  \u2022 Access other users\' accounts or data',
      '  \u2022 Reverse engineer platform software',
      '  \u2022 Resell or redistribute platform access',
      '  \u2022 Transmit malware or harmful code',
      '  \u2022 Misrepresent identity, credentials, or licensing status', '',
      'Violation may result in immediate termination without refund.',
      '', '', sep, 'SECTION 9: LIMITATION OF LIABILITY', sep, '',
      '  \u2022 GGE total liability capped at fees paid in preceding 12 months',
      '  \u2022 Not liable for indirect, incidental, or consequential damages',
      '  \u2022 Not liable for third-party service provider actions',
      '  \u2022 No guarantee of specific business outcomes',
      '', '', sep, 'SECTION 10: GOVERNING LAW & DISPUTE RESOLUTION', sep, '',
      '  \u2022 Governed by laws of the State of Oklahoma',
      '  \u2022 Disputes: good-faith negotiation, then binding arbitration (OKC, AAA Rules)',
      '  \u2022 Class action waiver: all disputes brought individually',
      '  \u2022 Tribal sovereign immunity rights preserved',
      '', '', sep, 'SECTION 11: SUPPORT & CONTACT', sep, '',
      '  \uD83D\uDCDE Toll-Free:     1-888-963-4447',
      '  \uD83D\uDCF1 Direct:       645-246-8277',
      '  \uD83D\uDCE7 Email:        asstsupport@gmail.com',
      '  \uD83C\uDF10 Platform:     https://ggp-os.com',
      '  \uD83D\uDD50 Hours:        Mon\u2013Fri 8AM\u20138PM CT / Sat 10AM\u20134PM CT', '',
      'ESCALATION: Support Team \u2192 Account Manager \u2192 VP Operations \u2192 CEO',
      '', '', sep, 'COMPANY INFORMATION', sep, '',
      '  Company:     Global Green Enterprise Inc.',
      '  Entity:      Oklahoma Corporation',
      '  CAGE Code:   9KXZ2',
      '  SAM.gov:     Active Registration',
      '', '', sep, '',
      'By subscribing to this plan, you acknowledge that you have read,',
      'understood, and agree to all terms, disclosures, and policies',
      'outlined in this Subscription Confirmation & Service Agreement.', '', '',
      'Warm regards,', '', 'Shantell Robinson', 'Founder & CEO',
      'Global Green Enterprise Inc.',
      '"Bridging Indigenous and Federal \u2014 On Equal Ground"', '',
      sep, `Document generated: ${today}`,
      '\u00A9 2024\u20132026 Global Green Enterprise Inc. All rights reserved.', sep,
    ];
    return lines.join('\n');
  };

  const openAgreementPreview = (p: Product) => {
    setAgreementText(generateAgreementText(p));
    setPreviewAgreement(p);
  };

  const copyAgreement = () => {
    navigator.clipboard.writeText(agreementText);
    setCopiedAgreement(true);
    setTimeout(() => setCopiedAgreement(false), 3000);
  };

  const filtered = filterCat === 'All' ? products : products.filter(p => p.category === filterCat);

  // Group by title for collapsible sections
  const grouped = filtered.reduce<Record<string, Product[]>>((acc, p) => {
    const key = `${p.category}::${p.title}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Product : p));
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const addProduct = () => {
    if (!newProduct.title || !newProduct.price) return;
    const id = 'custom_' + Date.now();
    setProducts(prev => [...prev, { ...newProduct, id, features: newProduct.features || [], source: 'manual' } as Product]);
    setNewProduct({ category: 'Platform Subscriptions', title: '', tier: 'Basic', icon: '📦', price: '', period: '/mo', desc: '', features: [] });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* ═══ AGREEMENT PREVIEW MODAL ═══ */}
      {previewAgreement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPreviewAgreement(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[94vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 flex items-center justify-between shrink-0 border-b border-indigo-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center"><FileText size={20} className="text-white" /></div>
                <div>
                  <h2 className="text-base font-black text-white tracking-tight">Agreement Preview — {previewAgreement.title} → {previewAgreement.tier}</h2>
                  <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Editable • Review & Modify Before Sending</p>
                </div>
              </div>
              <button onClick={() => setPreviewAgreement(null)} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <textarea
                value={agreementText}
                onChange={e => setAgreementText(e.target.value)}
                className="w-full min-h-[600px] bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-[11px] text-slate-700 leading-[1.7] resize-y focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 selection:bg-indigo-200"
                spellCheck={false}
              />
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <p className="text-[10px] text-slate-500 font-bold">This agreement is editable. Modify any text above before copying.</p>
                <p className="text-[9px] text-slate-400">11 sections • Pricing, Features, Billing, HIPAA, Cancellation, Liability, Legal & more</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setAgreementText(generateAgreementText(previewAgreement))} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">Reset to Original</button>
                <button onClick={copyAgreement} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${copiedAgreement ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                  {copiedAgreement ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Agreement</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Products & Services Manager</h2>
            <p className="text-xs text-slate-500">All GGP-OS products, subscription tiers, add-ons & services — sourced from subscriptionPlans.ts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">{products.length} total products</span>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-md">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} className={cn("px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border", filterCat === cat ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>
            {cat} {cat === 'All' ? `(${products.length})` : `(${products.filter(p => p.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Add New Product / Service</h3>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct(p => ({...p, category: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input value={newProduct.title} onChange={e => setNewProduct(p => ({...p, title: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Product name..." />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tier Name</label>
                <input value={newProduct.tier} onChange={e => setNewProduct(p => ({...p, tier: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Basic, Standard, Premium..." />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price</label>
                <input value={newProduct.price} onChange={e => setNewProduct(p => ({...p, price: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="$XX.XX/mo" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Annual / Period</label>
                <input value={newProduct.period} onChange={e => setNewProduct(p => ({...p, period: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="$XXX/yr or Per Visit..." />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Icon (Emoji)</label>
                <input value={newProduct.icon} onChange={e => setNewProduct(p => ({...p, icon: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="md:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea value={newProduct.desc} onChange={e => setNewProduct(p => ({...p, desc: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={2} placeholder="Product description..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={addProduct} className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-500 flex items-center gap-2"><Save size={14} /> Save Product</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table — Grouped by Product Title */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([groupKey, groupProducts]: [string, Product[]]) => {
          const isExpanded = expandedGroups.has(groupKey) || groupProducts.length === 1;
          const first = groupProducts[0];
          const tierCount = groupProducts.length;

          return (
            <div key={groupKey} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Group Header */}
              <button
                onClick={() => tierCount > 1 ? toggleGroup(groupKey) : null}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                  tierCount > 1 ? "hover:bg-slate-50 cursor-pointer" : "cursor-default",
                  isExpanded && tierCount > 1 && "bg-slate-50 border-b border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  {tierCount > 1 ? (
                    isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />
                  ) : <span className="w-4" />}
                  <span className="text-xl">{first.icon}</span>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{first.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{first.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tierCount > 1 && (
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{tierCount} TIERS</span>
                  )}
                  {tierCount === 1 && (
                    <div className="flex items-center gap-3">
                      <span className={cn("px-2 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider", getTierColor(first.tier))}>{first.tier}</span>
                      <span className="font-bold text-sm text-emerald-700">{first.price}</span>
                      <span className="text-xs text-slate-400 font-bold">{first.period}</span>
                    </div>
                  )}
                </div>
              </button>

              {/* Expanded Tiers */}
              {(isExpanded || tierCount === 1) && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    {tierCount > 1 && (
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider w-10"></th>
                          <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">Tier</th>
                          <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">Best For</th>
                          <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">Monthly</th>
                          <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">Annual</th>
                          <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider w-24">Actions</th>
                        </tr>
                      </thead>
                    )}
                    <tbody className="divide-y divide-slate-50">
                      {groupProducts.map(product => (
                        <React.Fragment key={product.id}>
                        <tr className={cn("hover:bg-slate-50/80 transition-colors", editingId === product.id && "bg-emerald-50", expandedDetail === product.id && "bg-indigo-50/50")}>
                          {tierCount > 1 && <td className="px-4 py-3 text-lg">{product.icon}</td>}
                          <td className="px-4 py-3">
                            {editingId === product.id ? (
                              <div className="space-y-1">
                                <input value={editForm.tier || ''} onChange={e => setEditForm(f => ({...f, tier: e.target.value}))} className="w-full px-2 py-1 border border-slate-200 rounded text-sm font-bold" placeholder="Tier name" />
                                <textarea value={editForm.desc || ''} onChange={e => setEditForm(f => ({...f, desc: e.target.value}))} className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-500" rows={2} />
                              </div>
                            ) : (
                              <div>
                                <span className={cn("px-2 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider inline-block", getTierColor(product.tier))}>{product.tier}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {editingId === product.id ? null : (
                              <p className="text-xs text-slate-500 max-w-[260px] truncate">{product.desc}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {editingId === product.id ? (
                              <input value={editForm.price || ''} onChange={e => setEditForm(f => ({...f, price: e.target.value}))} className="w-28 px-2 py-1 border border-slate-200 rounded text-sm" />
                            ) : (
                              <span className="font-bold text-sm text-emerald-700">{product.price}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {editingId === product.id ? (
                              <input value={editForm.period || ''} onChange={e => setEditForm(f => ({...f, period: e.target.value}))} className="w-28 px-2 py-1 border border-slate-200 rounded text-xs" />
                            ) : (
                              <span className="text-xs text-slate-400 font-bold">{product.period}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {editingId === product.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={saveEdit} className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500" title="Save"><Check size={14} /></button>
                                <button onClick={cancelEdit} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300" title="Cancel"><X size={14} /></button>
                              </div>
                            ) : deleteConfirm === product.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-500">Yes</button>
                                <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-300">No</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <button onClick={() => toggleDetail(product.id)} className={cn("p-1.5 rounded-lg transition-colors", expandedDetail === product.id ? 'text-indigo-600 bg-indigo-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50')} title="Full Detail Breakdown"><Eye size={14} /></button>
                                <button onClick={() => startEdit(product)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={14} /></button>
                                <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {/* ═══ FULL DETAIL BREAKDOWN PANEL — WHO / WHAT / WHEN / WHY ═══ */}
                        {expandedDetail === product.id && (() => {
                          // Determine relevant add-ons for this product category
                          const getRelevantAddons = (): { label: string; addons: AddOn[] }[] => {
                            const result: { label: string; addons: AddOn[] }[] = [];
                            const id = product.id;
                            const cat = product.category;
                            const title = product.title.toLowerCase();
                            if (id.startsWith('b2c_')) result.push({ label: 'Patient Add-Ons', addons: PATIENT_ADDONS });
                            if (id.startsWith('b2bc_') || id.startsWith('b2bt_')) { result.push({ label: 'Business Add-Ons', addons: COMMON_B2B_ADDONS }); if (id.startsWith('b2bc_')) result.push({ label: 'Cannabis-Specific Add-Ons', addons: CANNABIS_ADDONS }); }
                            if (id.startsWith('prov_')) result.push({ label: 'Provider Add-Ons', addons: PROVIDER_ADDONS });
                            if (id.startsWith('cann_att') || id.startsWith('gen_att')) result.push({ label: 'Attorney Add-Ons', addons: ATTORNEY_ADDONS });
                            if (id.startsWith('state_')) result.push({ label: 'State Authority Add-Ons', addons: STATE_ADDONS });
                            if (id.startsWith('fed_')) result.push({ label: 'Federal Add-Ons', addons: FEDERAL_ADDONS });
                            if (id.startsWith('ph_')) result.push({ label: 'Public Health & Lab Add-Ons', addons: PUBLIC_HEALTH_ADDONS });
                            if (id.startsWith('cannabis_') || id.startsWith('non_cannabis_')) result.push({ label: 'BackOffice Add-Ons', addons: BACKOFFICE_ADDONS });
                            if (id.startsWith('admin_')) result.push({ label: 'Admin Add-Ons', addons: ADMIN_ADDONS });
                            if (id.startsWith('partner_')) result.push({ label: 'Partner Add-Ons', addons: PARTNER_ADDONS });
                            if (id.startsWith('cw_')) result.push({ label: 'Care Builder Add-Ons', addons: CARE_BUILDER_ADDONS });
                            if (result.length === 0) result.push({ label: 'Cross-Dashboard Add-Ons', addons: CROSS_DASHBOARD_ADDONS });
                            return result;
                          };
                          const relevantAddons = getRelevantAddons();
                          const totalAddonCount = relevantAddons.reduce((s, g) => s + g.addons.length, 0);

                          // Elevator pitch generator
                          const getElevatorPitch = (): string => {
                            const t = product.title.toLowerCase();
                            if (t.includes('patient') || t.includes('b2c')) return `"Everything you need to manage your medical cannabis journey — card applications, telehealth, prescriptions, legal access, and AI guidance — all in one secure, HIPAA-compliant platform. Starting at just ${product.price}."`;
                            if (t.includes('dispensary') || t.includes('cannabis') && t.includes('business')) return `"Replace your POS, Metrc admin, and compliance tools with one platform — save $140+/mo while getting real-time seed-to-sale sync, AI compliance monitoring, and revenue analytics. Starting at ${product.price}."`;
                            if (t.includes('traditional') && t.includes('business')) return `"Streamline your entire business operations with AI-powered workflow automation, CRM, and compliance tools — no cannabis license required. Starting at ${product.price}."`;
                            if (t.includes('provider') || t.includes('physician')) return `"Run your telehealth practice with HIPAA-compliant video, digital prescribing, patient management, and AI clinical decision support — credential-verified. Starting at ${product.price}."`;
                            if (t.includes('attorney')) return `"Get listed in our legal marketplace with 50,000+ platform users, manage cases, track CLE credits, and let AI handle regulatory intelligence — while you focus on practicing law. Starting at ${product.price}."`;
                            if (t.includes('state authority')) return `"Replace your fragmented Thentia + Metrc contracts with one unified MedPortal — licensing, compliance, enforcement, and public transparency in a single FedRAMP-ready system. Starting at ${product.price}."`;
                            if (t.includes('federal')) return `"Give your agency nationwide visibility into licensed cannabis operations, cross-state traceability, SAM.gov compliance, and predictive enforcement intelligence. Starting at ${product.price}."`;
                            if (t.includes('enforcement')) return `"Equip your officers with AI-powered enforcement intelligence — violation detection, predictive risk scoring, and multi-agency coordination built for cannabis regulation. Starting at ${product.price}."`;
                            if (t.includes('finance ai')) return `"Financial intelligence engine: predictive risk analytics, SAM.gov compliance automation, and AI-powered financial monitoring for cannabis operators and regulators. Starting at ${product.price}."`;
                            if (t.includes('combined')) return `"Get the best of both worlds — rapid testing enforcement + financial AI intelligence in one integrated dashboard. Starting at ${product.price}."`;
                            if (t.includes('lab') || t.includes('public health')) return `"Manage accreditations, COA validation, contaminant tracking, and outbreak detection — all powered by AI. Built for labs, health departments, and researchers. Starting at ${product.price}."`;
                            if (t.includes('backoffice')) return `"Your AI-powered back office — virtual attendant, workflow automation, scheduling, CRM, and full business operations support. Starting at ${product.price}."`;
                            if (t.includes('care wallet')) return `"Secure, closed-loop stored value for the cannabis ecosystem — load, spend, track, and get AI-powered financial insights. No bank account required."`;
                            if (t.includes('partner') || t.includes('distribution')) return `"Join our partner network — earn recurring commissions, resell at margin, or embed our platform in yours. Built for consultants, POS companies, and strategic distributors."`;
                            if (t.includes('admin')) return `"Manage users, roles, compliance, and support tickets across your organization with our admin dashboard — built for client-designated operations staff."`;
                            return `"A comprehensive ${product.tier} subscription with ${product.features.length} included features, AI-powered tools, and full platform access. Starting at ${product.price}."`;
                          };

                          return (
                          <tr>
                            <td colSpan={tierCount > 1 ? 7 : 6} className="p-0">
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 border-t-2 border-indigo-200 px-6 py-5">
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-1">
                                  <Layers size={16} className="text-indigo-600" />
                                  <h4 className="font-black text-sm text-slate-800 uppercase tracking-wider">Full Detail Breakdown — {product.tier}</h4>
                                  <span className="ml-auto text-[9px] font-bold text-red-500 uppercase bg-red-50 px-2 py-1 rounded-lg border border-red-200">🔒 Founder View Only</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mb-5 pl-6">Complete WHO / WHAT / WHEN / WHY for {product.title} → {product.tier}</p>

                                {/* ── WHO ── */}
                                <div className="bg-white rounded-xl border-2 border-blue-200 p-4 shadow-sm mb-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">👤</span>
                                    <span className="text-xs font-black text-blue-800 uppercase tracking-widest">WHO — Target Audience</span>
                                  </div>
                                  {product.bestFor ? (
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{product.bestFor}</p>
                                  ) : (
                                    <p className="text-sm text-slate-500 italic">General platform users across all verticals</p>
                                  )}
                                  <div className="mt-3 pt-3 border-t border-blue-100">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Category</p>
                                    <p className="text-xs text-slate-700 font-bold">{product.category} → {product.title}</p>
                                  </div>
                                </div>

                                {/* ── WHAT ── */}
                                <div className="bg-white rounded-xl border-2 border-emerald-200 p-4 shadow-sm mb-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">📦</span>
                                    <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">WHAT — Everything They Get</span>
                                    <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{product.features.length} Features</span>
                                  </div>

                                  {/* AI & Technology Summary */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                    <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                                      <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">⚡ AI Level</p>
                                      <p className="text-xs font-bold text-violet-800">{product.aiLevel || 'Standard Platform'}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">🔢 Tokens/Month</p>
                                      <p className="text-xs font-bold text-blue-800">{product.tokensMonth || 'Standard Allocation'}</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">📋 Contract</p>
                                      <p className="text-xs font-bold text-amber-800">{product.contractType || 'Month-to-Month'}</p>
                                    </div>
                                  </div>

                                  {/* Full Feature List */}
                                  {product.features.length > 0 && (
                                    <div>
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Included Features</p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                                        {product.features.map((f, i) => (
                                          <div key={i} className="flex items-start gap-2 text-xs">
                                            <span className="text-emerald-500 font-bold mt-0.5 shrink-0">{i + 1}.</span>
                                            <span className="text-slate-700 leading-snug">{f}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* ── WHEN ── */}
                                <div className="bg-white rounded-xl border-2 border-amber-200 p-4 shadow-sm mb-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">⏱️</span>
                                    <span className="text-xs font-black text-amber-800 uppercase tracking-widest">WHEN — Timeline & Onboarding</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
                                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Free Trial</p>
                                      <p className="text-xl font-black text-emerald-700">{product.trialDays !== undefined ? `${product.trialDays} Days` : 'N/A'}</p>
                                      <p className="text-[9px] text-emerald-600 font-bold">{product.trialPrice !== undefined ? (product.trialPrice === 0 ? 'No charge during trial' : `$${product.trialPrice} intro rate`) : ''}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
                                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">After Trial</p>
                                      <p className="text-sm font-black text-blue-700">30% Off Month 1</p>
                                      <p className="text-[9px] text-blue-600 font-bold">Business & Gov plans</p>
                                    </div>
                                    <div className="bg-violet-50 rounded-lg p-3 border border-violet-100 text-center">
                                      <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">Auto-Renewal</p>
                                      <p className="text-sm font-black text-violet-700">Yes</p>
                                      <p className="text-[9px] text-violet-600 font-bold">Cancel anytime before billing</p>
                                    </div>
                                    <div className="bg-rose-50 rounded-lg p-3 border border-rose-100 text-center">
                                      <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Billing Method</p>
                                      <p className="text-sm font-black text-rose-700">ACH Invoice</p>
                                      <p className="text-[9px] text-rose-600 font-bold">Card processing coming soon</p>
                                    </div>
                                  </div>
                                </div>

                                {/* ── WHY ── */}
                                <div className="bg-white rounded-xl border-2 border-purple-200 p-4 shadow-sm mb-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">💡</span>
                                    <span className="text-xs font-black text-purple-800 uppercase tracking-widest">WHY — Value Proposition & Elevator Pitch</span>
                                  </div>
                                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100 mb-3">
                                    <p className="text-sm text-purple-900 leading-relaxed font-medium italic">{getElevatorPitch()}</p>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">💰 Monthly Price</p>
                                      <p className="text-lg font-black text-emerald-700">{product.price}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">📅 Annual Price</p>
                                      <p className="text-lg font-black text-blue-700">{product.period}</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">🏷️ Annual Savings</p>
                                      <p className="text-lg font-black text-amber-700">{product.monthlyRaw !== 'Custom' && product.annualRaw !== 'Custom' && product.monthlyRaw && product.annualRaw ? `$${((product.monthlyRaw as number) * 12 - (product.annualRaw as number)).toFixed(2)}` : 'Custom'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* ── AVAILABLE ADD-ONS ── */}
                                {relevantAddons.length > 0 && (
                                  <div className="bg-white rounded-xl border-2 border-teal-200 p-4 shadow-sm mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className="text-lg">🔌</span>
                                      <span className="text-xs font-black text-teal-800 uppercase tracking-widest">Available Add-Ons & Upsells</span>
                                      <span className="ml-auto text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{totalAddonCount} Available</span>
                                    </div>
                                    {relevantAddons.map((group, gi) => (
                                      <div key={gi} className={gi > 0 ? 'mt-3 pt-3 border-t border-teal-100' : ''}>
                                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mb-2">{group.label}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          {group.addons.map(addon => (
                                            <div key={addon.id} className="flex items-center justify-between bg-teal-50/50 rounded-lg px-3 py-2 border border-teal-100">
                                              <span className="text-xs text-slate-700">{addon.name}</span>
                                              <span className="text-xs font-black text-teal-700 whitespace-nowrap ml-2">
                                                {addon.price === 'Custom' ? 'Custom' : addon.price === 0 ? 'FREE' : `$${addon.price}`}{addon.per ? `/${addon.per}` : '/mo'}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* ── BILLING, CANCELLATION & LEGAL ── */}
                                <div className="bg-white rounded-xl border-2 border-slate-300 p-4 shadow-sm">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">📜</span>
                                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Billing, Cancellation & Agreement Terms</span>
                                  </div>
                                  <div className="space-y-3 text-[11px] text-slate-600 leading-relaxed">
                                    <div><strong className="text-slate-800">Trial Summary:</strong> {TRIAL_TERMS.trialSummary}</div>
                                    <div><strong className="text-slate-800">Cancellation:</strong> {TRIAL_TERMS.cancellationPolicy}</div>
                                    <div><strong className="text-slate-800">Auto-Renewal:</strong> {TRIAL_TERMS.autoRenews ? 'Yes — subscription auto-renews at the end of each billing period at the standard rate.' : 'No'}</div>
                                    <div><strong className="text-slate-800">Requires Card:</strong> {TRIAL_TERMS.requiresCard ? 'Yes — card required at signup.' : 'No — ACH invoice billing. Card processing coming soon.'}</div>
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Subscriber Agreement Text</p>
                                      <p className="text-[10px] text-slate-500 leading-relaxed italic">{TRIAL_TERMS.agreementText}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* ── PREVIEW AGREEMENT BUTTON ── */}
                                <div className="mt-5 pt-4 border-t-2 border-dashed border-indigo-200 flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-black text-slate-700">📄 Ready to review the full agreement?</p>
                                    <p className="text-[10px] text-slate-400">11 sections • Pricing, Features, HIPAA, Cancellation, Liability, Legal & more</p>
                                  </div>
                                  <button
                                    onClick={() => openAgreementPreview(product)}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                  >
                                    <FileText size={16} />
                                    Preview Full Agreement
                                  </button>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                          );
                        })()}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <ShoppingCart size={32} className="mx-auto mb-3 opacity-50" />
          <p className="font-bold text-sm">No products in this category</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {CATEGORIES.filter(c => c !== 'All').map(cat => (
          <div key={cat} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1 truncate">{cat}</p>
            <p className="text-2xl font-black text-slate-800">{products.filter(p => p.category === cat).length}</p>
            <p className="text-xs text-slate-400">items</p>
          </div>
        ))}
      </div>
    </div>
  );
};
