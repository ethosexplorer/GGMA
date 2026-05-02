import React, { useState } from 'react';
import { CreditCard, Shield, Settings, Zap, FileText, Plus, Sparkles, ArrowRight, Check, ChevronDown, ChevronUp, CircleCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { getAllPlansForLookup, getAllAddonsForLookup, AddOn, getAddOnsForRole } from '../lib/subscriptionPlans';
import { PricingTiers } from './PricingTiers';

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
        {typeof addon.price === 'number' ? `$${addon.price.toLocaleString(undefined, { minimumFractionDigits: addon.price % 1 !== 0 ? 2 : 0 })}` : addon.price}
      </span>
      {!addon.per && typeof addon.price === 'number' && <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>/mo</span>}
    </div>
  </div>
);

const Button = ({ children, className, icon: Icon, variant, ...props }: any) => (
  <button className={cn("inline-flex items-center justify-center gap-2 px-4 py-2 font-bold rounded-lg shadow-sm border transition-all", 
    variant === "outline" ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50" : "bg-[#1a4731] text-white border-transparent hover:bg-[#153a28]",
    className)} {...props}>
    {Icon && <Icon size={16} />} {children}
  </button>
);

export const SubscriptionPortal = ({ userRole = 'user', initialPlanId = 'b2bc_basic', initialAddOns = [] }: { userRole?: string, initialPlanId?: string, initialAddOns?: string[] }) => {
  const allPlans = getAllPlansForLookup();
  const allAddons = getAllAddonsForLookup();

  const [activePlanId, setActivePlanId] = useState(initialPlanId);
  const [activeAddOns, setActiveAddOns] = useState<string[]>(initialAddOns);
  const [showPricing, setShowPricing] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  
  React.useEffect(() => {
    const handleOpenPricing = () => setShowPricing(true);
    window.addEventListener('open-pricing', handleOpenPricing);
    return () => window.removeEventListener('open-pricing', handleOpenPricing);
  }, []);
  
  const currentPlan = allPlans.find(p => p.id === activePlanId) || allPlans[0];
  const roleAddons = getAddOnsForRole(userRole === 'user' ? 'patient' : userRole as any, 'cannabis', 'State');
  const displayAddons = roleAddons.length > 0 ? roleAddons : allAddons.slice(0, 8);
  const currentAddonsList = allAddons.filter(a => activeAddOns.includes(a.id));

  if (showPricing) {
    return (
      <div className="animate-in fade-in duration-500">
        <button onClick={() => setShowPricing(false)} className="mb-4 text-emerald-700 hover:text-emerald-900 font-bold text-sm flex items-center gap-2">
          ← Back to Dashboard
        </button>
        <PricingTiers />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1a4731] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
            <Shield size={250} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md text-emerald-50 border border-white/10">Active Plan</span>
                 <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/40 px-3 py-1 rounded-full"><CircleCheck size={12}/> Verified</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-extrabold mb-1">{currentPlan.name}</h2>
               <p className="text-emerald-100 font-medium opacity-90 max-w-lg leading-relaxed">
                 {currentPlan.aiLevel ? `AI Level: ${currentPlan.aiLevel}` : "Active Access"} 
                 {currentPlan.tokensMonth ? ` • ${currentPlan.tokensMonth} Tokens` : ""}
               </p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm self-start md:self-center shrink-0">
               <p className="text-sm text-emerald-100 font-medium mb-1">Current Billing</p>
               <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-extrabold">{currentPlan.monthlyPrice === 'Custom' ? 'Custom' : `$${currentPlan.monthlyPrice}`}</span>
                 <span className="text-emerald-200">/mo</span>
               </div>
               <p className="text-xs text-emerald-100/70 mt-1">Renews on Oct 1, 2026</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Settings size={20} className="text-[#1a4731]" />
                 Plan Details & Usage
               </h3>
               
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-sm text-slate-700">Monthly AI Tokens</span>
                     <span className="text-sm font-bold text-[#1a4731]">124,500 / {currentPlan.tokensMonth || 'Unlimited'}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                     <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
               </div>

               {currentPlan.features && currentPlan.features.length > 0 && (
                 <div className="mb-6">
                   <h4 className="text-sm font-bold text-slate-800 mb-3">Included in your plan</h4>
                   <ul className="space-y-2">
                     {currentPlan.features.map((feature, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                         <div className="mt-0.5 text-[#1a4731]">
                           <CircleCheck size={16} />
                         </div>
                         <span>{feature}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-emerald-50 text-[#1a4731] rounded-full flex items-center justify-center">
                         <CreditCard size={18} />
                       </div>
                       <div>
                         <p className="font-bold text-slate-800 text-sm">Payment Method</p>
                         <p className="text-xs text-slate-500">Visa ending in 4242</p>
                       </div>
                     </div>
                     <button onClick={() => alert("Update Payment Method\n\nRedirecting to secure payment gateway to update your card on file. Your current card (Visa ending in 4242) will be replaced.")} className="text-[#1a4731] text-sm font-bold cursor-pointer hover:underline">Update</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                         <FileText size={18} />
                       </div>
                       <div>
                         <p className="font-bold text-slate-800 text-sm">Billing History</p>
                         <p className="text-xs text-slate-500">View past invoices and receipts</p>
                       </div>
                     </div>
                     <button onClick={() => alert("Billing History\n\nInvoice #INV-2026-04 | $49.00 | Paid Apr 1, 2026\nInvoice #INV-2026-03 | $49.00 | Paid Mar 1, 2026\nInvoice #INV-2026-02 | $49.00 | Paid Feb 1, 2026\n\nAll invoices saved in your Document Vault.")} className="text-[#1a4731] text-sm font-bold cursor-pointer hover:underline">View</button>
                  </div>
               </div>
            </div>

            {/* Quick Upgrade Section */}
            {(typeof currentPlan.monthlyPrice === 'number' && currentPlan.monthlyPrice < 200) && (
                <div className="bg-slate-900 bg-gradient-to-r from-slate-900 to-[#1a4731] p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                   <div className="absolute -right-10 -top-10 text-white/5 group-hover:scale-110 transition-transform duration-700">
                     <Zap size={150} />
                   </div>
                   <div className="relative z-10">
                     <h3 className="text-xl font-bold text-white mb-2">Ready for Full AI?</h3>
                     <p className="text-slate-300 text-sm max-w-sm">Upgrade your plan to unlock Unlimited AI Tokens, Custom Sylara Bots, and Priority Enforcement modules.</p>
                   </div>
                   <Button onClick={() => setShowPricing(true)} className="shrink-0 bg-white text-[#1a4731] hover:bg-slate-100 shadow-xl relative z-10 px-8 py-3">View Upgrades</Button>
                </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-slate-800">Active Add-Ons</h3>
                 <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{currentAddonsList.length} Active</span>
               </div>
               
               {currentAddonsList.length === 0 ? (
                 <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                    <p className="text-sm font-medium text-slate-500 mb-3">No active add-ons</p>
                    <Button onClick={() => alert('Opening Sylara Add-On Manager...')} variant="outline" className="text-xs cursor-pointer">Browse Add-Ons</Button>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {currentAddonsList.map(addon => (
                     <div key={addon.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                           <p className="font-bold text-sm text-slate-800 leading-tight pr-4">{addon.name}</p>
                           <p className="text-sm font-bold text-[#1a4731]">{typeof addon.price === 'number' ? `$${addon.price}/mo` : addon.price}</p>
                        </div>
                        <button className="text-xs text-red-500 font-bold hover:underline">Remove</button>
                     </div>
                   ))}
                   <Button onClick={() => setShowPricing(true)} variant="outline" className="w-full mt-2 cursor-pointer" icon={Plus}>Add More Features</Button>
                 </div>
               )}
            </div>

             <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
               <h4 className="font-bold text-slate-800 mb-2">Need Help?</h4>
               <p className="text-xs text-slate-500 mb-4 px-4 font-medium leading-relaxed">Our support team is available 24/7 to help you with billing inquiries or custom pricing tailored to your scale.</p>
               <div className="flex flex-col gap-2">
                 <Button onClick={() => alert('Starting Sylara Support Session...')} className="w-full bg-purple-600 hover:bg-purple-500 text-white border-transparent shadow-lg shadow-purple-900/20">Ask Sylara AI</Button>
                 <Button onClick={() => alert('Phone Support\n\nCall us at: (888) 963-4447\n\nHours: Mon-Fri 8am-8pm CST\nSat-Sun 10am-6pm CST\n\nOr use the QR code feature on the GGHP mobile app to call from your phone.')} variant="outline" className="w-full">Call Phone Support</Button>
               </div>
            </div>
         </div>
      </div>

      {/* Available Single/Add-on Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Sparkles size={18} className="text-emerald-600" />
            </div>
            <div className="text-left">
              <h4 className="font-black text-slate-800 text-sm">Available Single/Add-on</h4>
              <p className="text-xs text-slate-500">Modular enhancements — select to bundle with your plan or use as single-use</p>
            </div>
          </div>
          {activeAddOns.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 hidden sm:flex">
                <span className="text-xs font-bold text-emerald-700">{activeAddOns.length} selected</span>
                <span className="text-sm font-black text-emerald-700">
                  +${currentAddonsList.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0).toFixed(2)}/mo
                </span>
              </div>
              <button 
                onClick={() => {
                  const selectedItems = currentAddonsList.filter(a => activeAddOns.includes(a.id));
                  alert(`Redirecting to secure checkout...\n\nProcessing payment for ${selectedItems.length} item(s):\n${selectedItems.map(a => `• ${a.name} ($${a.price})`).join('\n')}\n\nTotal: $${selectedItems.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0).toFixed(2)}`);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-md"
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-5">
          {displayAddons.map(addon => (
            <AddOnCard 
              key={addon.id} 
              addon={addon} 
              isSelected={activeAddOns.includes(addon.id)}
              onToggle={(addon) => setActiveAddOns(prev => prev.includes(addon.id) ? prev.filter(id => id !== addon.id) : [...prev, addon.id])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

