import React, { useState } from 'react';
import { Package, Shield, Globe, Lock, BrainCircuit, Activity, BarChart3, Users, Building2, Check, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MasterAddOnsList = () => {
  const [activeAddOns, setActiveAddOns] = useState<string[]>([]);

  const addons = [
    { id: 'a1', name: 'Premium Sylara Guidance (Unlimited)', price: 49.99, category: 'AI & Intelligence Add-Ons (Highest ROI)', desc: 'Personalized AI advisor, workflows, scenario modeling' },
    { id: 'a2', name: 'Larry Enforcement Engine', price: 39.99, category: 'AI & Intelligence Add-Ons (Highest ROI)', desc: 'Automated violation alerts, audit trails, auto-corrections' },
    { id: 'a3', name: 'Sylara for Executive / Strategic', price: 59.99, category: 'AI & Intelligence Add-Ons (Highest ROI)', desc: 'Predictive forecasting, "what-if" modeling, KPI storytelling' },
    { id: 'a4', name: 'Sylara for Admin / Operations', price: 49.99, category: 'AI & Intelligence Add-Ons (Highest ROI)', desc: 'Workflow optimization, anomaly detection, bulk actions' },
    
    { id: 'v1', name: 'Patient Dashboard View', price: 149.00, category: 'Visibility & Cross-Dashboard Access', desc: 'Live market patient counts, loyalty data, compassion points' },
    { id: 'v2', name: 'Attorney / Legal Workspace', price: 99.00, category: 'Visibility & Cross-Dashboard Access', desc: 'Shared audit-ready files, risk alerts' },
    { id: 'v3', name: 'Business Portfolio View', price: 89.00, category: 'Visibility & Cross-Dashboard Access', desc: 'Real-time ops, inventory, compliance across multiple entities' },
    { id: 'v4', name: 'Executive Multi-Location Roll-up', price: 89.00, category: 'Visibility & Cross-Dashboard Access', desc: 'Home-office overview of all locations & KPIs' },

    { id: 'b1', name: 'Multi-Company / Multi-Agency Mgmt', price: 99.00, category: 'Back-Office, Administrative & General / Non-Cannabis', desc: 'Central oversight for multiple clients or entities' },
    { id: 'b2', name: 'Traditional Back-Office Suite', price: 79.00, category: 'Back-Office, Administrative & General / Non-Cannabis', desc: 'Accounting, HR, general reporting (non-cannabis ready)' },
    { id: 'b3', name: 'Help / Support Dashboard', price: 29.00, category: 'Back-Office, Administrative & General / Non-Cannabis', desc: '24/7 ticket system + knowledge base' },
    { id: 'b4', name: 'White-Label / Re-Branding Service', price: 499.00, category: 'Back-Office, Administrative & General / Non-Cannabis', desc: 'Let clients or partners brand the platform as their own' },
  ];

  const handleToggle = (id: string) => {
    setActiveAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const selectedTotal = addons.filter(a => activeAddOns.includes(a.id)).reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="bg-slate-50 min-h-full p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">Available Single/Add-on</h1>
              <p className="text-slate-600">
                Modular enhancements — select to bundle with your plan or use as single-use
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Sparkles size={24} className="text-emerald-600" />
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Globe className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-blue-800 font-medium">
              <strong>Note:</strong> Any of these add-ons can be activated on any dashboard — even if you don’t see it listed on your current view. Ask your admin or click "Activate" to unlock it instantly.
            </p>
          </div>
        </div>

        {/* 1. AI & Intelligence */}
        <div className="bg-white rounded-2xl border border-emerald-500 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10"><BrainCircuit size={60} /></div>
          <div className="bg-emerald-900 px-5 py-3">
            <h2 className="text-lg font-bold text-emerald-50 flex items-center gap-2">
              <BrainCircuit size={20} /> 1. AI & Intelligence Add-Ons (Highest ROI)
            </h2>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3 w-12">Select</th>
                  <th className="px-5 py-3">Add-On Name</th>
                  <th className="px-5 py-3 hidden md:table-cell">Description</th>
                  <th className="px-5 py-3 text-right">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {addons.filter(a => a.category.includes('AI')).map(addon => (
                  <tr key={addon.id} onClick={() => handleToggle(addon.id)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", activeAddOns.includes(addon.id) ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-white")}>
                        {activeAddOns.includes(addon.id) && <Check size={14} className="text-white" />}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{addon.name}</td>
                    <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{addon.desc}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-800">${addon.price}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Visibility & Cross-Dashboard Access */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-100 px-5 py-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Globe size={20} className="text-slate-500" /> 2. Visibility & Cross-Dashboard Access
            </h2>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] hidden md:table-header-group">
                <tr>
                  <th className="px-5 py-3 w-12">Select</th>
                  <th className="px-5 py-3">Add-On Name</th>
                  <th className="px-5 py-3 hidden md:table-cell">Description</th>
                  <th className="px-5 py-3 text-right">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {addons.filter(a => a.category.includes('Visibility')).map(addon => (
                  <tr key={addon.id} onClick={() => handleToggle(addon.id)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-5 py-4 w-12">
                      <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", activeAddOns.includes(addon.id) ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-white")}>
                        {activeAddOns.includes(addon.id) && <Check size={14} className="text-white" />}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700 md:w-1/3">{addon.name}</td>
                    <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{addon.desc}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-800">${addon.price}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Back-Office, Administrative */}
        <div className="bg-white rounded-2xl border border-emerald-500 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10"><Building2 size={60} /></div>
          <div className="bg-emerald-900 px-5 py-3">
            <h2 className="text-lg font-bold text-emerald-50 flex items-center gap-2">
              <Building2 size={20} /> 6. Back-Office, Administrative & General / Non-Cannabis
            </h2>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3 w-12">Select</th>
                  <th className="px-5 py-3 w-1/3">Add-On Name</th>
                  <th className="px-5 py-3 hidden md:table-cell">Description</th>
                  <th className="px-5 py-3 text-right">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {addons.filter(a => a.category.includes('Back-Office')).map(addon => (
                  <tr key={addon.id} onClick={() => handleToggle(addon.id)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", activeAddOns.includes(addon.id) ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-white")}>
                        {activeAddOns.includes(addon.id) && <Check size={14} className="text-white" />}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{addon.name}</td>
                    <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{addon.desc}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-800">${addon.price}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Floating Checkout Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 z-50 flex items-center justify-center",
        activeAddOns.length > 0 ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                <span className="text-sm font-bold text-emerald-700">{activeAddOns.length} selected</span>
                <span className="text-lg font-black text-emerald-700">
                  +${selectedTotal.toFixed(2)}<span className="text-xs font-bold text-emerald-600/70">/mo</span>
                </span>
             </div>
          </div>
          <button 
             onClick={() => {
                 const count = activeAddOns.length;
                 alert('Redirecting to secure checkout... Processing ' + count + ' item(s). Total: $' + selectedTotal.toFixed(2));
             }}
             className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
             Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
