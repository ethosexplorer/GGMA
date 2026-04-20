import React from 'react';
import { Package, Shield, Globe, Lock, BrainCircuit, Activity, BarChart3, Users, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MasterAddOnsList = () => {
  return (
    <div className="bg-slate-50 min-h-full p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h1 className="text-2xl font-black text-slate-800 mb-2">GGP-OS Master Add-Ons & Single Services</h1>
          <p className="text-slate-600 mb-4">
            Everything is modular: any add-on or service can be attached to any dashboard, even if it originated on another one.
          </p>
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
                  <th className="px-5 py-3">Add-On Name</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">Premium Sylara Guidance (Unlimited)</td>
                  <td className="px-5 py-4 text-slate-600">Personalized AI advisor, workflows, scenario modeling</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$34.99–$59.99/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">Larry Enforcement Engine</td>
                  <td className="px-5 py-4 text-slate-600">Automated violation alerts, audit trails, auto-corrections</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$24.99–$59.99/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">Sylara for Executive / Strategic</td>
                  <td className="px-5 py-4 text-slate-600">Predictive forecasting, "what-if" modeling, KPI storytelling</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$59.99/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">Sylara for Admin / Operations</td>
                  <td className="px-5 py-4 text-slate-600">Workflow optimization, anomaly detection, bulk actions</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$34.99–$59.99/mo</td>
                </tr>
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
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-700 w-1/3">Patient Dashboard View</td>
                  <td className="px-5 py-4 text-slate-600">Live market patient counts, loyalty data, compassion points</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$149/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-700">Attorney / Legal Workspace</td>
                  <td className="px-5 py-4 text-slate-600">Shared audit-ready files, risk alerts</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$99/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-700">Business Portfolio View</td>
                  <td className="px-5 py-4 text-slate-600">Real-time ops, inventory, compliance across multiple entities</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$79–$99/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-700">Executive Multi-Location Roll-up</td>
                  <td className="px-5 py-4 text-slate-600">Home-office overview of all locations & KPIs</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$89/mo</td>
                </tr>
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
                  <th className="px-5 py-3 w-1/3">Add-On Name</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">Multi-Company / Multi-Agency Mgmt</td>
                  <td className="px-5 py-4 text-slate-600">Central oversight for multiple clients or entities</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$99/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">Traditional Back-Office Suite</td>
                  <td className="px-5 py-4 text-slate-600">Accounting, HR, general reporting (non-cannabis ready)</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$79/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">Help / Support Dashboard</td>
                  <td className="px-5 py-4 text-slate-600">24/7 ticket system + knowledge base</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">+$29/mo</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-emerald-700">White-Label / Re-Branding Service</td>
                  <td className="px-5 py-4 text-slate-600">Let clients or partners brand the platform as their own</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">Enterprise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
