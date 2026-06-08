import React, { useState } from 'react';
import { ShoppingCart, Plus, Edit2, Trash2, X, Check, Save, ChevronDown, ChevronRight } from 'lucide-react';
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
  STATE_APPLICATION_FEES,
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
  source?: string; // track where it came from
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
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'Platform Subscriptions', title: '', tier: 'Basic', icon: '📦', price: '', period: '/mo', desc: '', features: [] });

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
                        <tr key={product.id} className={cn("hover:bg-slate-50/80 transition-colors", editingId === product.id && "bg-emerald-50")}>
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
                                <button onClick={() => startEdit(product)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={14} /></button>
                                <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={14} /></button>
                              </div>
                            )}
                          </td>
                        </tr>
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
