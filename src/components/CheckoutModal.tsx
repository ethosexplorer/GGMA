import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, CreditCard, ArrowRight, Loader2, Building2, Mail, Phone, User, FileText, CircleCheck } from 'lucide-react';
import { turso } from '../lib/turso';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface CheckoutItem {
  name: string;
  price: string | number;
  type: 'plan' | 'addon';
  billing?: 'monthly' | 'annual';
  per?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  billing: 'monthly' | 'annual';
  trialDays?: number;
  planCategory?: string;
}

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

export const CheckoutModal = ({ isOpen, onClose, items, billing, trialDays, planCategory }: CheckoutModalProps) => {
  const [step, setStep] = useState<'info' | 'review' | 'success'>('info');
  const [accountCreated, setAccountCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    notes: '',
  });

  const plan = items.find(i => i.type === 'plan');
  const addons = items.filter(i => i.type === 'addon');
  
  const planPrice = plan ? (typeof plan.price === 'number' ? plan.price : 0) : 0;
  const addonTotal = addons.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0);
  const total = planPrice + addonTotal;
  const totalDisplay = total === 0 ? 'Free' : `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const billingLabel = billing === 'monthly' ? '/mo' : '/yr';
  const isValid = Boolean(
    form.fullName?.trim() && 
    form.email?.trim() && 
    form.email?.includes('@') && 
    (form.password || '').trim().length >= 6
  );

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      // Save subscription request to database
      const orderId = `sub-${Date.now()}`;
      const orderDetails = {
        plan: plan?.name || 'Unknown',
        addons: addons.map(a => a.name).join(', ') || 'None',
        billing,
        total: totalDisplay,
        trialDays: trialDays || 0,
        category: planCategory || 'general',
      };

      await turso.execute({
        sql: `INSERT INTO subscription_requests (id, customer_name, customer_email, customer_phone, company_name, plan_name, addons, billing_cycle, total_amount, trial_days, category, notes, status, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`,
        args: [
          orderId,
          form.fullName,
          form.email,
          form.phone || '',
          form.company || '',
          orderDetails.plan,
          orderDetails.addons,
          billing,
          total,
          trialDays || 0,
          planCategory || 'general',
          form.notes || '',
        ],
      });
    } catch (err) {
      console.warn('DB save skipped (table may not exist yet):', err);
    }

    // Create Firebase Auth User Account
    try {
      const computedRole = getRoleFromCategory(planCategory);
      localStorage.setItem('gghp_pending_role', computedRole);
      
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: form.email,
        role: computedRole, // Map category to correct system role
        status: 'Pending',
        displayName: form.fullName,
        companyName: form.company,
        createdAt: new Date().toISOString()
      });
      setAccountCreated(true);
    } catch (err: any) {
      console.error('Firebase account creation error:', err);
      setAccountCreated(false);
      if (err.code === 'auth/email-already-in-use') {
        alert('An account with this email already exists. We will still process your subscription request.');
      }
    }

    // Send email notification to the team
    try {
      await fetch('/api/notify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.fullName,
          customerEmail: form.email,
          customerPhone: form.phone,
          company: form.company,
          plan: plan?.name,
          addons: addons.map(a => `${a.name} ($${a.price})`),
          billing,
          total: totalDisplay,
          trialDays,
          notes: form.notes,
        }),
      });
    } catch {
      // Notification is best-effort
    }

    setIsSubmitting(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('info');
    setForm({ fullName: '', email: '', phone: '', company: '', password: '', notes: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={handleClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white rounded-t-[2rem] border-b border-slate-100 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-800">
                {step === 'success' ? 'Order Confirmed!' : step === 'review' ? 'Review & Submit' : 'Secure Checkout'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {step === 'success' ? 'Your subscription request has been received' : 'Invoice will be sent via ACH for payment'}
              </p>
            </div>
            <button onClick={handleClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* ═══ SUCCESS STATE ═══ */}
            {step === 'success' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CircleCheck size={40} className="text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800">Thank You, {form.fullName.split(' ')[0]}!</h3>
                  <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                    Your <strong>{plan?.name}</strong> subscription request has been submitted. 
                    Our team will send an ACH invoice to <strong>{form.email}</strong> within 24 hours.
                  </p>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Plan:</span>
                    <span className="font-bold text-slate-800">{plan?.name}</span>
                  </div>
                  {addons.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 font-medium">Add-ons:</span>
                      <span className="font-bold text-slate-800">{addons.length} selected</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-emerald-200">
                    <span className="text-emerald-700 font-bold">Total:</span>
                    <span className="font-black text-emerald-700">{trialDays ? `$0 for ${trialDays} days, then ${totalDisplay}${billingLabel}` : `${totalDisplay}${billingLabel}`}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold">
                  <Shield size={14} className="text-emerald-500" />
                  Payment via ACH Bank Transfer • Secure & Encrypted
                </div>

                <button onClick={() => {
                  handleClose();
                  window.location.href = accountCreated ? '/dashboard' : '/login';
                }} className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-lg">
                  {accountCreated ? 'Done - Go to Dashboard' : 'Done - Continue to Sign In'}
                </button>
              </motion.div>
            )}

            {/* ═══ INFO COLLECTION ═══ */}
            {step === 'info' && (
              <>
                {/* Order Summary */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Summary</h3>
                  
                  {plan && (
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-bold text-slate-800">{plan.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{billing} subscription</p>
                      </div>
                      <span className="font-black text-slate-800">
                        {typeof plan.price === 'number' ? (plan.price === 0 ? 'Free' : `$${plan.price.toLocaleString()}${billingLabel}`) : plan.price}
                      </span>
                    </div>
                  )}

                  {addons.length > 0 && (
                    <>
                      <div className="border-t border-slate-200 pt-2">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Add-ons ({addons.length})</p>
                        {addons.map((addon, i) => (
                          <div key={i} className="flex justify-between text-sm py-1">
                            <span className="text-slate-600">{addon.name}</span>
                            <span className="font-bold text-slate-800">${typeof addon.price === 'number' ? addon.price.toLocaleString() : addon.price}{addon.per ? `/${addon.per}` : '/mo'}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="border-t-2 border-slate-300 pt-3 flex justify-between items-center">
                    <div>
                      <p className="font-black text-slate-800 text-lg">{trialDays ? 'Due today: $0.00' : `Total: ${totalDisplay}${billingLabel}`}</p>
                      {trialDays && <p className="text-xs text-slate-500">Then {totalDisplay}{billingLabel} after {trialDays}-day trial</p>}
                    </div>
                    <CreditCard size={20} className="text-slate-400" />
                  </div>
                </div>

                {/* Customer Info Form */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <User size={12} /> Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Mail size={12} /> Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Shield size={12} /> Secure Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="Create a password (min 6 chars)"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Phone size={12} /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="(555) 000-0000"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Building2 size={12} /> Company / Organization
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        placeholder="Your Business Name"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                      <FileText size={12} /> Notes (Optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Any special requirements or questions..."
                      rows={2}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Payment Method Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <Shield size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">Invoice / Payment Request via ACH</p>
                    <p className="text-xs text-amber-700 mt-0.5">An invoice or payment request will be sent to your email within 24 hours. Payment is completed via secure ACH bank transfer — no credit card required at this time.</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 py-1.5 px-4 bg-gradient-to-r from-slate-50 to-indigo-50 border border-indigo-100 rounded-xl">
                  <CreditCard size={14} className="text-indigo-400" />
                  <span className="text-[11px] font-bold text-indigo-500 tracking-wide">Card Processing Coming Soon</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-base hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={20} className="animate-spin" /> Processing...</>
                  ) : (
                    <>{trialDays ? `Start ${trialDays}-Day Free Trial` : 'Submit Order'} <ArrowRight size={18} /></>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  By submitting, you agree to our Terms of Service and Privacy Policy. 
                  {trialDays ? ` Your trial begins immediately. Invoice for ${totalDisplay}${billingLabel} will be sent after your ${trialDays}-day trial ends.` : ''}
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
