import React, { useState } from 'react';
import { ShoppingCart, Plus, Edit2, Trash2, X, Check, Save, Cpu, Stethoscope, Wallet, Building2, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  category: string;
  title: string;
  icon: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', category: 'Platform Subscriptions', title: 'Patient / Consumer', icon: '🏥', price: '$49.99', period: '/mo', desc: 'Telehealth coordination, medical card management, Care Wallet, AI guidance via Sylara', features: ['Medical card application sync', 'Telehealth scheduling', 'Care Wallet stored value', 'Sylara AI personal assistant', 'Document vault & compliance tracker'] },
  { id: 'p2', category: 'Platform Subscriptions', title: 'Business / Dispensary', icon: '🏢', price: '$199', period: '/mo', desc: 'Full compliance OS with POS, Metrc sync, inventory, and Larry enforcement AI', features: ['SINC POS system (card-ready)', 'Real-time Metrc seed-to-sale sync', 'Inventory & barcode tracking', 'Larry AI compliance monitoring', 'Automated state reporting'] },
  { id: 'p3', category: 'Platform Subscriptions', title: 'Provider / Physician', icon: '🩺', price: '$99', period: '/mo', desc: 'Patient management, telehealth consultations, recommendation workflows, and AI tools', features: ['Patient roster management', 'Telehealth consultation tools', 'Recommendation workflow', 'Sylara AI clinical guidance', 'Compliance & licensing tracker'] },
  { id: 'p4', category: 'Platform Subscriptions', title: 'Attorney / Legal', icon: '⚖️', price: '$149', period: '/mo', desc: 'Cannabis & general legal case management, client leads, regulatory AI, and Larry enforcement', features: ['Legal marketplace & lead access', 'Case management dashboard', 'Regulatory intelligence feeds', 'Larry AI legal compliance', 'Client billing & invoicing'] },
  { id: 'p5', category: 'Professional Services', title: 'Telehealth Physician Evaluation', icon: '📋', price: 'Varies by state', period: 'Per Visit', desc: 'Virtual physician consultation for medical cannabis recommendation. Pricing varies by provider and state jurisdiction.', features: ['Physician evaluation', 'GGE processing & sync fee', 'Recommendation valid for state application'] },
  { id: 'p6', category: 'Professional Services', title: 'AI Virtual Attendant (Sylara)', icon: '🤖', price: '$149/mo', period: 'Monthly', desc: 'Branded @TheBackOffice.com virtual receptionist powered by Sylara AI.', features: ['Inbound call handling', 'Appointment scheduling', 'Intake routing', 'Customer service'] },
  { id: 'p7', category: 'Professional Services', title: 'State Application Processing', icon: '📄', price: '$10 processing fee', period: 'Per App', desc: 'State cannabis license and medical card applications. State fees collected separately.', features: ['State fee varies ($22.50–$104.30)', 'GGE $10 processing fee', 'Multi-state support'] },
  { id: 'p8', category: 'Care Wallet Tiers', title: 'Bronze', icon: '🥉', price: 'Free', period: '', desc: 'Basic wallet, cash load, ecosystem spending, silent compliance checks', features: [] },
  { id: 'p9', category: 'Care Wallet Tiers', title: 'Silver', icon: '🥈', price: '$19/mo', period: '', desc: 'Virtual card via NomadCash, spending limits, categorized tracking, insights', features: [] },
  { id: 'p10', category: 'Care Wallet Tiers', title: 'Gold', icon: '🥇', price: '$49/mo', period: '', desc: 'AI-guided spending (Sylara), smart alerts, advanced analytics, auto-reload', features: [] },
  { id: 'p11', category: 'Care Wallet Tiers', title: 'Platinum', icon: '💎', price: '$99/mo', period: '', desc: 'Multiple virtual cards, role-based separation, full financial dashboard, real-time Larry enforcement', features: [] },
  { id: 'p12', category: 'Government & Enterprise', title: 'State Authority', icon: '🏛️', price: 'From $4,999/mo', period: '', desc: 'Unified licensing portal, Metrc integration, compliance monitoring, public transparency.', features: [] },
  { id: 'p13', category: 'Government & Enterprise', title: 'Law Enforcement', icon: '🚔', price: 'From $999/mo', period: '', desc: 'Enforcement dashboards, rapid testing recency index, violation detection, inter-agency coordination.', features: [] },
  { id: 'p14', category: 'Government & Enterprise', title: 'Federal Agency', icon: '🇺🇸', price: 'From $9,999/mo', period: '', desc: 'Nationwide oversight, multi-agency dashboards, interstate commerce monitoring, SAM.gov compliance.', features: [] },
];

const CATEGORIES = ['All', 'Platform Subscriptions', 'Professional Services', 'Care Wallet Tiers', 'Government & Enterprise'];

export const ProductsServicesManager = () => {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [filterCat, setFilterCat] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'Platform Subscriptions', title: '', icon: '📦', price: '', period: '/mo', desc: '', features: [] });

  const filtered = filterCat === 'All' ? products : products.filter(p => p.category === filterCat);

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
    const id = 'p' + Date.now();
    setProducts(prev => [...prev, { ...newProduct, id, features: newProduct.features || [] } as Product]);
    setNewProduct({ category: 'Platform Subscriptions', title: '', icon: '📦', price: '', period: '/mo', desc: '', features: [] });
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
            <p className="text-xs text-slate-500">Manage all GGP-OS products, subscriptions, and services</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-md">
          <Plus size={16} /> Add Product
        </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price</label>
                <input value={newProduct.price} onChange={e => setNewProduct(p => ({...p, price: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="$XX.XX" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Period</label>
                <input value={newProduct.period} onChange={e => setNewProduct(p => ({...p, period: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="/mo, /yr, Per Visit..." />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Icon (Emoji)</label>
                <input value={newProduct.icon} onChange={e => setNewProduct(p => ({...p, icon: e.target.value}))} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="md:col-span-2">
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

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-8"></th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Product / Service</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(product => (
                <tr key={product.id} className={cn("hover:bg-slate-50 transition-colors", editingId === product.id && "bg-emerald-50")}>
                  <td className="px-4 py-3 text-xl">{editingId === product.id ? (
                    <input value={editForm.icon || ''} onChange={e => setEditForm(f => ({...f, icon: e.target.value}))} className="w-10 text-center text-lg border border-slate-200 rounded py-0.5" />
                  ) : product.icon}</td>
                  <td className="px-4 py-3">
                    {editingId === product.id ? (
                      <div className="space-y-1">
                        <input value={editForm.title || ''} onChange={e => setEditForm(f => ({...f, title: e.target.value}))} className="w-full px-2 py-1 border border-slate-200 rounded text-sm font-bold" />
                        <textarea value={editForm.desc || ''} onChange={e => setEditForm(f => ({...f, desc: e.target.value}))} className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-500" rows={2} />
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-sm text-slate-800">{product.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{product.desc}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === product.id ? (
                      <select value={editForm.category || ''} onChange={e => setEditForm(f => ({...f, category: e.target.value}))} className="px-2 py-1 border border-slate-200 rounded text-xs">
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">{product.category}</span>
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
                      <input value={editForm.period || ''} onChange={e => setEditForm(f => ({...f, period: e.target.value}))} className="w-20 px-2 py-1 border border-slate-200 rounded text-xs" />
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
                        <button onClick={() => deleteProduct(product.id)} className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-500">Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-300">Cancel</button>
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
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <ShoppingCart size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-bold text-sm">No products in this category</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.filter(c => c !== 'All').map(cat => (
          <div key={cat} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{cat}</p>
            <p className="text-2xl font-black text-slate-800">{products.filter(p => p.category === cat).length}</p>
            <p className="text-xs text-slate-400">items</p>
          </div>
        ))}
      </div>
    </div>
  );
};
