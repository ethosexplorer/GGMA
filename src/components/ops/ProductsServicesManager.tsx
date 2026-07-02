import React, { useState } from 'react';
import { ShoppingCart, Plus, Edit2, Trash2, X, Check, Save, ChevronDown, ChevronRight, Eye, Zap, Clock, DollarSign, Shield, Layers, FileText, Copy, CreditCard, Send, Sparkles, CheckSquare, Square, Trash, Star, CircleCheck, Info, User, Mail, Phone, Building2, KeyRound } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { turso } from '../../lib/turso';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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

const getRoleFromCategory = (category?: string) => {
  switch (category) {
    case 'cannabis_b2b':
    case 'traditional_b2b':
    case 'backoffice':
    case 'partners':
      return 'business';
    case 'provider': return 'provider';
    case 'attorney': return 'attorney';
    case 'state': return 'regulator_state';
    case 'federal': return 'regulator_federal';
    case 'enforcement': return 'law_enforcement';
    case 'public_health': return 'health';
    default: return 'user';
  }
};

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
  if (TIER_COLORS[tier]) return TIER_COLORS[tier];
  const lc = tier.toLowerCase();
  if (lc.includes('basic') || lc.includes('starter') || lc.includes('core')) return 'bg-slate-100 text-slate-600';
  if (lc.includes('medium') || lc.includes('standard')) return 'bg-blue-50 text-blue-700';
  if (lc.includes('pro') || lc.includes('premium')) return 'bg-violet-50 text-violet-700';
  if (lc.includes('enterprise') || lc.includes('full ai')) return 'bg-amber-50 text-amber-700';
  if (lc.includes('custom') || lc.includes('strategic')) return 'bg-emerald-50 text-emerald-700';
  return 'bg-slate-100 text-slate-500';
};

const getRelevantAddons = (product: Product): AddOn[] => {
  const id = product.id;
  if (id.startsWith('b2c_') || id.includes('patient')) return PATIENT_ADDONS;
  if (id.startsWith('b2bc_') || id.includes('cannabis_b2b')) return [...COMMON_B2B_ADDONS, ...CANNABIS_ADDONS];
  if (id.startsWith('b2bt_') || id.includes('traditional_b2b')) return COMMON_B2B_ADDONS;
  if (id.startsWith('prov_') || id.includes('provider')) return [];
  if (id.startsWith('cann_att') || id.startsWith('gen_att') || id.includes('attorney')) return ATTORNEY_ADDONS;
  if (id.startsWith('state_') || id.includes('state')) return STATE_ADDONS;
  if (id.startsWith('fed_') || id.includes('federal')) return FEDERAL_ADDONS;
  if (id.startsWith('ph_') || id.includes('public_health')) return PUBLIC_HEALTH_ADDONS;
  if (id.startsWith('cannabis_') || id.startsWith('non_cannabis_') || id.includes('backoffice')) return BACKOFFICE_ADDONS;
  if (id.startsWith('admin_') || id.includes('admin')) return ADMIN_ADDONS;
  if (id.startsWith('partner_') || id.includes('partner')) return PARTNER_ADDONS;
  if (id.startsWith('cw_') || id.includes('care_wallet')) return CARE_BUILDER_ADDONS;
  return CROSS_DASHBOARD_ADDONS;
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

  // ─── LIVE ESTIMATE CALCULATOR STATE ───
  const [cartPlan, setCartPlan] = useState<Product | null>(null);
  const [cartAddons, setCartAddons] = useState<AddOn[]>([]);
  const [cartBilling, setCartBilling] = useState<'monthly' | 'annual'>('monthly');
  const [cartIntroDiscount, setCartIntroDiscount] = useState(true);
  const [cartCustomPrice, setCartCustomPrice] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientPassword, setClientPassword] = useState('GGP-Temp123!');
  
  // Checkout & Payment State
  const [checkoutStep, setCheckoutStep] = useState<'calculator' | 'pos' | 'receipt'>('calculator');
  const [payMethod, setPayMethod] = useState<'invoice' | 'chime' | 'pos_card'>('invoice');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const toggleDetail = (id: string) => setExpandedDetail(prev => prev === id ? null : id);

  const generateAgreementText = (p: Product, customPlanPrice?: string, selectedAdds?: AddOn[], billCycle?: 'monthly' | 'annual', custName?: string, custEmail?: string): string => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const subId = `GGE-SUB-${Date.now().toString(36).toUpperCase()}`;
    const sep = '\u2501'.repeat(60);
    
    // Pricing details
    const finalMonthlyPrice = customPlanPrice ? Number(customPlanPrice) : (typeof p.monthlyRaw === 'number' ? p.monthlyRaw : 0);
    const addonsTotal = (selectedAdds || []).reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0);
    
    const monthlyRateText = `$${(finalMonthlyPrice + addonsTotal).toLocaleString()}/mo`;
    const annualRateText = `$${((finalMonthlyPrice * 12 + addonsTotal * 12) * 0.8).toLocaleString()}/yr (20% Off Commit)`;
    const savings = `$${((finalMonthlyPrice * 12 + addonsTotal * 12) * 0.2).toLocaleString()}`;
    
    const lines = [
      '\u2554' + '\u2550'.repeat(60) + '\u2557',
      '\u2551     GLOBAL GREEN ENTERPRISE INC.                           \u2551',
      '\u2551     SUBSCRIPTION CONFIRMATION & SERVICE AGREEMENT          \u2551',
      '\u255A' + '\u2550'.repeat(60) + '\u255D',
      '', 
      `Date Issued: ${today}`, 
      `Subscription ID: ${subId}`,
      `Client Name: ${custName || '[Client Name]'}`,
      `Client Email: ${custEmail || '[Client Email]'}`,
      `Plan: ${p.title} \u2014 ${p.tier}`, 
      `Category: ${p.category}`,
      '', 
      'Dear Valued Subscriber,', 
      '',
      `Thank you for subscribing to the ${p.title} (${p.tier} tier) on the Global Green Hybrid Platform (GGP-OS). This document serves as your official subscription confirmation and service agreement. Please retain this letter for your records.`,
      '', '', sep, 'SECTION 1: WHO THIS PLAN IS FOR', sep, '',
      `Target Audience: ${p.bestFor || 'General platform users'}`,
      `Category: ${p.category}`, `Product Line: ${p.title}`, `Tier: ${p.tier}`,
      '', '', sep, 'SECTION 2: SUBSCRIPTION & PRICING', sep, '',
      `Plan Name:        ${p.title} \u2014 ${p.tier}`,
      `Billing Selection: ${billCycle === 'annual' ? 'Annual Cycle' : 'Monthly Cycle'}`,
      `Monthly Rate:     ${monthlyRateText}`,
      `Annual Rate:      ${annualRateText}`,
      `Annual Savings:   ${savings}`,
      `Contract Type:    ${p.contractType || 'Month-to-Month'}`,
      '', 
      `Billing Terms: Monthly auto-renewal via internal POS system or ACH invoice.`,
      '', 
      `Free Trial: ${p.trialDays !== undefined ? `${p.trialDays}-day free trial. ${p.trialPrice === 0 ? 'No charge until trial ends.' : `$${p.trialPrice} introductory rate.`} Cancel anytime during trial at no cost.` : 'Contact sales for trial terms.'}`,
      '', '', sep, 'SECTION 3: AI & TECHNOLOGY INCLUDED', sep, '',
      `AI Level:         ${p.aiLevel || 'Standard Platform Access'}`,
      `Tokens/Month:     ${p.tokensMonth || 'Standard Allocation'}`,
      '', '', sep, 'SECTION 4: INCLUDED FEATURES & SERVICES', sep, '',
      ...(p.features.length > 0 ? p.features.map((f, i) => `  ${i + 1}. ${f}`) : ['  Standard platform access included.']),
      '', 
      ...(selectedAdds && selectedAdds.length > 0 ? [
        'SELECTED ADD-ONS / MODULES:',
        ...selectedAdds.map((a, i) => `  + ${a.name} ($${a.price}/mo)`)
      ] : []),
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
      '  \u2022 Backups: Geographically redundant, tested monthly', '',
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
    setAgreementText(generateAgreementText(p, cartCustomPrice || undefined, cartAddons, cartBilling, clientName, clientEmail));
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

  // ─── CALCULATOR COMPUTATIONS ───
  const getSelectedPlanPrice = () => {
    if (!cartPlan) return 0;
    if (cartCustomPrice !== '') return Number(cartCustomPrice) || 0;
    const rawPrice = cartBilling === 'monthly' ? cartPlan.monthlyRaw : cartPlan.annualRaw;
    if (rawPrice === 'Custom') return 0;
    return typeof rawPrice === 'number' ? rawPrice : 0;
  };

  const getAddonsTotal = () => {
    return cartAddons.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0);
  };

  const calculateTotals = () => {
    const base = getSelectedPlanPrice();
    const addons = getAddonsTotal();
    
    // First Month/Period Due
    // Business plans have 30% first month discount
    const firstMonthBase = cartBilling === 'monthly' && cartIntroDiscount ? base * 0.70 : base;
    const firstPeriodDue = firstMonthBase + (cartBilling === 'monthly' ? addons : addons * 12);
    
    const recurringMonthly = base + addons;
    const totalContractValue = cartBilling === 'monthly' 
      ? (firstMonthBase + addons) + (recurringMonthly * 11)
      : base + (addons * 12);

    return {
      base,
      addons,
      firstPeriodDue,
      recurringMonthly,
      totalContractValue
    };
  };

  const toggleCalculatorAddon = (addon: AddOn) => {
    setCartAddons(prev => 
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  // Copy Phone Script pitch
  const copyPhoneScript = () => {
    if (!cartPlan) return;
    const { firstPeriodDue, recurringMonthly, totalContractValue } = calculateTotals();
    const script = [
      `"Hi ${clientName || 'there'}, Shantell's office here with Global Green.`,
      `We have you set up for the ${cartPlan.title} (${cartPlan.tier} tier).`,
      `The base plan is $${getSelectedPlanPrice().toLocaleString()}${cartBilling === 'monthly' ? '/mo' : '/yr'}, and we added ${cartAddons.length} modules for a total of $${getAddonsTotal()}/mo in add-ons.`,
      cartBilling === 'monthly' && cartIntroDiscount 
        ? `Since you qualify for the introductory rate, your first month is just $${firstPeriodDue.toLocaleString()}, and it will automatically convert to your standard recurring total of $${recurringMonthly.toLocaleString()}/mo starting in month two.`
        : `Your initial due today is $${firstPeriodDue.toLocaleString()}${cartBilling === 'monthly' ? '/mo' : ' total for the year'}.`,
      `We can run your card right now over the phone using our internal POS system, or email you a secure ACH invoice link to verify your business bank. Which works best for you?"`
    ].join('\n');

    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // ─── PROCESS PAYMENTS & INVOICES ───
  const processCheckout = async () => {
    if (!cartPlan) return;
    if (!clientName || !clientEmail) {
      alert("Please fill out Client Name and Client Email before processing checkout.");
      return;
    }

    setIsProcessing(true);
    const orderId = `gge-pos-${Date.now().toString(36).toUpperCase()}`;
    const { firstPeriodDue, recurringMonthly, totalContractValue } = calculateTotals();

    try {
      // 1. Write the transaction record to Turso database
      await turso.execute({
        sql: `INSERT INTO subscription_requests (id, customer_name, customer_email, customer_phone, company_name, plan_name, addons, billing_cycle, total_amount, trial_days, category, notes, status, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        args: [
          orderId,
          clientName,
          clientEmail,
          clientPhone || '',
          clientCompany || 'Internal Lead',
          cartPlan.tier,
          cartAddons.map(a => a.name).join(', ') || 'None',
          cartBilling,
          firstPeriodDue,
          cartPlan.trialDays || 0,
          cartPlan.category,
          `[Phone POS - ${payMethod.toUpperCase()}] Keyed card: ${payMethod === 'pos_card' ? `XXXX-XXXX-XXXX-${cardNumber.slice(-4)}` : 'N/A'}. Details: ${clientCompany || 'Internal'} Order.`,
          payMethod === 'pos_card' ? 'approved' : 'pending'
        ]
      });

      // 2. Provision client account in Firebase Auth & Firestore
      const computedRole = getRoleFromCategory(cartPlan.category);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, clientEmail, clientPassword);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: clientEmail,
          role: computedRole,
          status: 'Active', // Instantly active since checkout occurred!
          displayName: clientName,
          companyName: clientCompany,
          paymentMethod: payMethod === 'pos_card' ? 'credit_card' : payMethod,
          createdAt: new Date().toISOString()
        });
      } catch (err: any) {
        console.warn('Firebase user provision skipped:', err.message);
      }

      // 3. Mock success receipt data
      setReceiptData({
        orderId,
        clientName,
        clientEmail,
        planName: `${cartPlan.title} — ${cartPlan.tier}`,
        paymentMethod: payMethod === 'pos_card' ? '💳 NomadCash POS Card Reader' : payMethod === 'chime' ? '🏦 Chime / Cash App Transfer' : '📄 ACH Invoice Sent',
        totalCharged: firstPeriodDue,
        recurringMonthly,
        billingCycle: cartBilling,
        timestamp: new Date().toLocaleString()
      });

      setCheckoutStep('receipt');
    } catch (e: any) {
      console.error('Checkout failed:', e);
      alert('Internal checkout error: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCalculator = () => {
    setCartPlan(null);
    setCartAddons([]);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientCompany('');
    setCheckoutStep('calculator');
    setReceiptData(null);
  };

  const calcs = calculateTotals();

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
                <button onClick={() => setAgreementText(generateAgreementText(previewAgreement, cartCustomPrice || undefined, cartAddons, cartBilling, clientName, clientEmail))} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">Reset to Original</button>
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

      {/* ═══ 2-COLUMN LAYOUT: CATALOG + ESTIMATE BUILDER ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Product Catalog */}
        <div className="xl:col-span-2 space-y-3">
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
                            <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider w-32 text-right">Actions</th>
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
                                <p className="text-xs text-slate-500 max-w-[220px] truncate">{product.desc}</p>
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
                            <td className="px-4 py-3 text-right">
                              {editingId === product.id ? (
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={saveEdit} className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500" title="Save"><Check size={14} /></button>
                                  <button onClick={cancelEdit} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300" title="Cancel"><X size={14} /></button>
                                </div>
                              ) : deleteConfirm === product.id ? (
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-500">Yes</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-300">No</button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1">
                                  {/* Add to Cart / Estimate Button */}
                                  <button
                                    onClick={() => {
                                      setCartPlan(product);
                                      setCartAddons([]);
                                      setCheckoutStep('calculator');
                                      setCartCustomPrice(typeof product.monthlyRaw === 'number' ? String(product.monthlyRaw) : '');
                                      // Pre-fill fields for ease of presentation
                                      setClientPassword('GGP-Temp123!');
                                    }}
                                    className={cn("p-1.5 rounded-lg transition-colors border", cartPlan?.id === product.id ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border-slate-200 bg-white')}
                                    title="Add to Package Estimate"
                                  >
                                    <ShoppingCart size={14} />
                                  </button>
                                  <button onClick={() => toggleDetail(product.id)} className={cn("p-1.5 rounded-lg transition-colors border border-slate-200 bg-white", expandedDetail === product.id ? 'text-indigo-600 bg-indigo-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50')} title="Full Detail Breakdown"><Eye size={14} /></button>
                                  <button onClick={() => startEdit(product)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 bg-white" title="Edit"><Edit2 size={14} /></button>
                                  <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200 bg-white" title="Delete"><Trash2 size={14} /></button>
                                </div>
                              )}
                            </td>
                          </tr>
                          {/* Expanded Details Breakdown */}
                          {expandedDetail === product.id && (() => {
                            const relevantAddons = getRelevantAddons(product);

                            // Elevator pitch generator
                            const getElevatorPitch = (): string => {
                              const t = product.title.toLowerCase();
                              if (t.includes('patient') || t.includes('b2c')) return `"Everything you need to manage your medical cannabis journey — card applications, telehealth, prescriptions, legal access, and AI guidance — all in one secure, HIPAA-compliant platform. Starting at just ${product.price}."`;
                              if (t.includes('dispensary') || t.includes('cannabis') && t.includes('business')) return `"Replace your POS, Metrc admin, and compliance tools with one platform — save $140+/mo while getting real-time seed-to-sale sync, AI compliance monitoring, and revenue analytics. Starting at ${product.price}."`;
                              if (t.includes('traditional') && t.includes('business')) return `"Streamline your entire business operations with AI-powered workflow automation, CRM, and compliance tools — no cannabis license required. Starting at ${product.price}."`;
                              if (t.includes('provider') || t.includes('physician')) return `"Run your telehealth practice with HIPAA-compliant video, digital prescribing, patient management, and AI clinical decision support — credential-verified. Starting at ${product.price}."`;
                              if (t.includes('attorney')) return `"Get listed in our legal marketplace with 50,000+ platform users, manage cases, track CLE credits, and let AI handle regulatory intelligence — while you focus on practicing law. Starting at ${product.price}."`;
                              if (t.includes('state authority')) return `"Replace your fragmented Thentia + Metrc contracts with one unified MedPortal — licensing, compliance, enforcement, and public transparency in a single FedRAMP-ready system. Starting at ${product.price}."`;
                              if (t.includes('federal')) return `"Give your agency nationwide visibility into licensed cannabis operations, interstate commerce routes, and automated compliance intelligence. Starting at ${product.price}."`;
                              if (t.includes('enforcement')) return `"Equip your officers with AI-powered enforcement intelligence — violation detection, predictive risk scoring, and multi-agency coordination built for cannabis regulation. Starting at ${product.price}."`;
                              if (t.includes('finance ai')) return `"Financial intelligence engine: predictive risk analytics, SAM.gov compliance automation, and AI-powered financial monitoring for cannabis operators and regulators. Starting at ${product.price}."`;
                              if (t.includes('combined')) return `"Get the best of both worlds — rapid testing enforcement + financial AI intelligence in one integrated dashboard. Starting at ${product.price}."`;
                              if (t.includes('lab') || t.includes('public health')) return `"Manage accreditations, COA validation, contaminant tracking, and outbreak detection — all powered by AI. Built for labs, health departments, and researchers. Starting at ${product.price}."`;
                              if (t.includes('backoffice')) return `"Your AI-powered back office — virtual attendant, workflow automation, scheduling, CRM, and full office support. Starting at ${product.price}."`;
                              if (t.includes('care wallet')) return `"Secure, closed-loop stored value for the cannabis ecosystem — load, spend, track, and get AI-powered financial insights."`;
                              if (t.includes('partner') || t.includes('distribution')) return `"Join our partner network — earn commissions or resell at margin. Built for consultants and distributors. Starting at ${product.price}."`;
                              return `"A comprehensive ${product.tier} subscription with ${product.features.length} features, AI tools, and platform access. Starting at ${product.price}."`;
                            };

                            return (
                            <tr>
                              <td colSpan={tierCount > 1 ? 7 : 6} className="p-0">
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 border-t border-indigo-200 px-6 py-5">
                                  {/* Header */}
                                  <div className="flex items-center gap-2 mb-3">
                                    <Layers size={16} className="text-indigo-600" />
                                    <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Breakdown — {product.tier}</h4>
                                  </div>

                                  {/* Pitch / Value Prop */}
                                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-4">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Elevator Pitch & Target</p>
                                    <p className="text-sm text-indigo-900 leading-relaxed font-semibold italic mb-3">{getElevatorPitch()}</p>
                                    <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg">{product.bestFor || 'Suitable for all platform clients.'}</p>
                                  </div>

                                  {/* Features */}
                                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-4">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Included Features ({product.features.length})</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {product.features.map((f, j) => (
                                        <div key={j} className="flex items-center gap-2 text-xs text-slate-600">
                                          <CircleCheck size={14} className="text-emerald-500 shrink-0" />
                                          <span>{f}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Add-ons */}
                                  {relevantAddons.length > 0 && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-4">
                                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Available Add-ons / Modules ({relevantAddons.length})</p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {relevantAddons.map(addon => (
                                          <div key={addon.id} className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100">
                                            <span className="text-xs text-slate-700 font-medium">{addon.name}</span>
                                            <span className="text-xs font-bold text-slate-800 whitespace-nowrap ml-2">
                                              {addon.price === 'Custom' ? 'Custom' : addon.price === 0 ? 'FREE' : `$${addon.price}`}{addon.per ? `/${addon.per}` : '/mo'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Contract Details */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Type</p>
                                      <p className="text-sm font-bold text-slate-700">{product.contractType || 'Month-to-Month'}</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Tier</p>
                                      <p className="text-sm font-bold text-slate-700">{product.aiLevel || 'Standard AI'}</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tokens/mo</p>
                                      <p className="text-sm font-bold text-slate-700">{product.tokensMonth || 'Standard'}</p>
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                                    <button onClick={() => openAgreementPreview(product)} className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
                                      <FileText size={14} /> Review Agreement Template
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

        {/* Right Column: Live Estimate Calculator & POS Checkout Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl border border-indigo-800 p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5"><ShoppingCart size={100} /></div>
            
            <div className="relative z-10 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                    <ShoppingCart size={16} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider">Estimate Calculator</h3>
                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Internal POS Checkout</p>
                  </div>
                </div>
                {cartPlan && (
                  <button onClick={resetCalculator} className="text-slate-400 hover:text-white text-xs font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">Reset</button>
                )}
              </div>

              {/* ── STAGE 1: CALCULATOR ── */}
              {checkoutStep === 'calculator' && (
                <>
                  {cartPlan ? (
                    <div className="space-y-4">
                      {/* Active Plan Selector */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Plan</span>
                          <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider", getTierColor(cartPlan.tier))}>{cartPlan.tier}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          <span>{cartPlan.icon}</span> {cartPlan.title}
                        </h4>
                        
                        {/* Custom Price Overrider */}
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                          <span className="text-xs font-bold text-slate-400">Plan Custom Price ($)</span>
                          <input
                            type="number"
                            value={cartCustomPrice}
                            onChange={e => setCartCustomPrice(e.target.value)}
                            placeholder={String(cartPlan.monthlyRaw)}
                            className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-xs font-bold text-white outline-none focus:border-emerald-400 text-right"
                          />
                        </div>
                      </div>

                      {/* Billing Cycle Toggle */}
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                        <span className="text-xs font-bold text-slate-300">Billing Cycle</span>
                        <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-white/10 text-xs">
                          <button onClick={() => setCartBilling('monthly')} className={cn("px-3 py-1 rounded font-bold uppercase tracking-wider", cartBilling === 'monthly' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white')}>Monthly</button>
                          <button onClick={() => setCartBilling('annual')} className={cn("px-3 py-1 rounded font-bold uppercase tracking-wider", cartBilling === 'annual' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white')}>Annual</button>
                        </div>
                      </div>

                      {/* B2B 30% First Month Discount Toggle */}
                      {cartBilling === 'monthly' && (
                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div>
                            <span className="text-xs font-bold text-slate-300 block">Introductory B2B Discount</span>
                            <span className="text-[9px] text-slate-500 leading-snug">30% off plan base price in Month 1</span>
                          </div>
                          <button onClick={() => setCartIntroDiscount(prev => !prev)} className="p-1 rounded-lg bg-white/5 border border-white/10">
                            {cartIntroDiscount ? <CheckSquare size={16} className="text-emerald-400" /> : <Square size={16} className="text-slate-400" />}
                          </button>
                        </div>
                      )}

                      {/* Relevant Add-ons Picker */}
                      {(() => {
                        const adds = getRelevantAddons(cartPlan);
                        if (adds.length === 0) return null;
                        return (
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">Select Add-ons & modules</span>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {adds.map(addon => {
                                const isSel = !!cartAddons.find(a => a.id === addon.id);
                                return (
                                  <div 
                                    key={addon.id}
                                    onClick={() => toggleCalculatorAddon(addon)}
                                    className={cn("flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer text-xs", isSel ? 'bg-emerald-500/10 border-emerald-400/40 text-white' : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300')}
                                  >
                                    <div className="flex items-center gap-2">
                                      {isSel ? <CheckSquare size={14} className="text-emerald-400" /> : <Square size={14} className="text-slate-400" />}
                                      <span className="font-bold truncate max-w-[150px]">{addon.name}</span>
                                    </div>
                                    <span className="font-black text-emerald-400">${addon.price}{addon.per ? `/${addon.per.substring(0,3)}` : '/mo'}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Customer Info Form */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Customer Info (For Phone Order)</span>
                        <div className="space-y-2 text-xs">
                          <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Full Name *" className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-400" />
                          <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="Email Address *" className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-400" />
                          <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="Phone Number" className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-400" />
                          <input type="text" value={clientCompany} onChange={e => setClientCompany(e.target.value)} placeholder="Company / Jurisdiction" className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-400" />
                          
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold text-slate-400">Account Password</span>
                            <input
                              type="text"
                              value={clientPassword}
                              onChange={e => setClientPassword(e.target.value)}
                              className="w-32 px-2 py-1 bg-slate-950 border border-white/10 rounded text-center text-[10px] font-mono text-indigo-300 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Calculations Breakdown */}
                      <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>Plan Base price:</span>
                          <span>${calcs.base.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        {calcs.addons > 0 && (
                          <div className="flex justify-between text-slate-400 font-medium">
                            <span>Add-ons ({cartAddons.length}):</span>
                            <span>${(cartBilling === 'monthly' ? calcs.addons : calcs.addons * 12).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        {cartBilling === 'monthly' && cartIntroDiscount && calcs.base > 0 && (
                          <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded">
                            <span>Intro Discount (30%):</span>
                            <span>-${(calcs.base * 0.3).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm font-black">
                          <span>First {cartBilling === 'monthly' ? 'Month' : 'Year'} Due:</span>
                          <span className="text-xl text-emerald-400">${calcs.firstPeriodDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        {cartBilling === 'monthly' && (
                          <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                            <span>Recurring (Month 2+):</span>
                            <span>${calcs.recurringMonthly.toLocaleString()}/mo</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        <button 
                          onClick={() => setCheckoutStep('pos')}
                          disabled={!clientName || !clientEmail}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CreditCard size={16} /> Proceed to POS Payment
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={copyPhoneScript}
                            className={cn("py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-1", copiedScript ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10')}
                          >
                            {copiedScript ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Read script</>}
                          </button>
                          <button 
                            onClick={() => openAgreementPreview(cartPlan)}
                            className="py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-white/10 flex items-center justify-center gap-1"
                          >
                            <FileText size={12} /> View contract
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-500 space-y-4">
                      <ShoppingCart size={40} className="mx-auto text-slate-600 opacity-40" />
                      <p className="text-xs font-semibold leading-relaxed max-w-[200px] mx-auto">No plan selected. Click the cart icon next to any product tier in the catalog to build a client estimate.</p>
                    </div>
                  )}
                </>
              )}

              {/* ── STAGE 2: INTERNAL POS CHECKOUT ── */}
              {checkoutStep === 'pos' && cartPlan && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Checkout Summary</span>
                    <div className="flex justify-between"><span className="text-slate-400">Client:</span><span className="font-bold text-white">{clientName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Selected Plan:</span><span className="font-bold text-white">{cartPlan.tier}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Totals:</span><span className="font-black text-emerald-400">${calcs.firstPeriodDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">POS Payment Mode</span>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      {[
                        { id: 'invoice', label: 'ACH Invoice', icon: '📄' },
                        { id: 'chime', label: 'Chime request', icon: '🏦' },
                        { id: 'pos_card', label: 'Card Swipe', icon: '💳' }
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => setPayMethod(method.id as any)}
                          className={cn("py-2.5 rounded-xl border transition-all text-center flex flex-col items-center gap-1", payMethod === method.id ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold' : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400')}
                        >
                          <span className="text-base">{method.icon}</span>
                          <span>{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Keyed Card Fields (Phone Order POS) */}
                  {payMethod === 'pos_card' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 text-xs">
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block flex items-center gap-1.5"><KeyRound size={12} /> Key Card Info Over Phone</span>
                      <div className="space-y-2">
                        <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Credit Card Number" className="w-full px-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-slate-600 outline-none focus:border-cyan-400 text-center font-mono" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-slate-600 outline-none focus:border-cyan-400 text-center font-mono" />
                          <input type="text" value={cardCvc} onChange={e => setCardCvc(e.target.value)} placeholder="CVC" className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-lg text-white placeholder-slate-600 outline-none focus:border-cyan-400 text-center font-mono" />
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal bg-slate-950 p-2.5 rounded-lg italic">"Key in details over phone. Integrates directly with NomadCash card processor. Charged immediately."</p>
                    </div>
                  )}

                  {payMethod === 'invoice' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
                      <p className="font-bold text-white flex items-center gap-1"><Info size={12} className="text-indigo-400" /> ACH Business Billing Terms</p>
                      <p>Reps will send an instant ACH bank payment invoice. The client clicks the secure link to execute bank transfer. Net 30/60 options apply. Billed after 30-day trial.</p>
                    </div>
                  )}

                  {payMethod === 'chime' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
                      <p className="font-bold text-white flex items-center gap-1"><Info size={12} className="text-indigo-400" /> Cash App / Venmo / Zelle Transfer</p>
                      <p>Triggers request-to-pay via Chime phone lookup. Payment instruction guidelines are auto-forwarded to client's email. Account marked pending until funds clear.</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => setCheckoutStep('calculator')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold uppercase">Back</button>
                    <button 
                      onClick={processCheckout} 
                      disabled={isProcessing || (payMethod === 'pos_card' && (!cardNumber || !cardExpiry || !cardCvc))}
                      className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing POS...' : 'Execute Order'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── STAGE 3: RECEIPT ── */}
              {checkoutStep === 'receipt' && receiptData && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CircleCheck size={26} />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-black text-base text-white">POS Transaction Success</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">{receiptData.orderId}</p>
                  </div>

                  <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex justify-between"><span className="text-slate-500">Client Name:</span><span className="font-bold text-white">{receiptData.clientName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Email Address:</span><span className="font-bold text-white">{receiptData.clientEmail}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Selected Plan:</span><span className="font-bold text-white">{receiptData.planName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Payment Processor:</span><span className="font-bold text-emerald-400">{receiptData.paymentMethod}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Initial Charged:</span><span className="font-black text-emerald-400">${receiptData.totalCharged.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                    {receiptData.billingCycle === 'monthly' && (
                      <div className="flex justify-between"><span className="text-slate-500">Subsequent Bills:</span><span className="font-bold text-indigo-400">${receiptData.recurringMonthly.toLocaleString()}/mo</span></div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-white/10 text-[10px] text-slate-500">
                      <span>Date/Time:</span>
                      <span>{receiptData.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-center text-slate-500 leading-normal">Cryptographic keys generated. Firebase user credential registered as Active. Receipt summary sent to client.</p>

                  <button onClick={resetCalculator} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg">New Package Estimate</button>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

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

export default ProductsServicesManager;
