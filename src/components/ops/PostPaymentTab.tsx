import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, User, FileText, Calendar, Loader2, Link, Copy, Check, ExternalLink, CalendarDays, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';

const PAYMENT_TYPES = ['Processing Fee','Application Fee','Consultation Fee','Service Fee','Filing Fee','Late Fee','Renewal Fee','Licensing Fee','Document Fee','Other'];
const PAYMENT_METHODS = ['PayPal','Calendly','Chime','Cash App','Zelle','Venmo','Cash','Check','Wire Transfer','Credit Card (Manual)','Bank Transfer','Other'];

interface PayPalButtonProps {
  hostedButtonId: string;
  containerId: string;
  key?: string;
}

const PayPalButton = ({ hostedButtonId, containerId }: PayPalButtonProps) => {
  const [isRendered, setIsRendered] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    const scriptId = 'paypal-sdk-hosted-buttons';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    const initializeButton = () => {
      let attempts = 0;
      const checkAndRender = () => {
        if (!active) return;
        const paypal = (window as any).paypal;
        if (paypal && paypal.HostedButtons) {
          try {
            const container = document.getElementById(containerId);
            if (container) {
              container.innerHTML = '';
            }
            paypal.HostedButtons({
              hostedButtonId: hostedButtonId,
            }).render(`#${containerId}`);
            setIsRendered(true);
          } catch (err) {
            console.error('Error rendering PayPal Hosted Button:', err);
            setLoadError(true);
          }
        } else {
          attempts++;
          if (attempts < 25) {
            setTimeout(checkAndRender, 200);
          } else {
            setLoadError(true);
          }
        }
      };
      checkAndRender();
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.paypal.com/sdk/js?client-id=BAApZMT_akVrk09QmyOS0_2iMW0qbnqULY-vmI1tW59I2b0yM_v4wg6XrL2fN8Xvy0P4FwwsobAzoONHEI&components=hosted-buttons&enable-funding=venmo&currency=USD';
      script.async = true;
      script.onload = initializeButton;
      script.onerror = () => {
        if (active) setLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      initializeButton();
    }

    return () => {
      active = false;
    };
  }, [hostedButtonId, containerId]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/80 rounded-2xl w-full">
      {!isRendered && !loadError && (
        <div className="flex flex-col items-center gap-2.5 py-6">
          <Loader2 className="animate-spin text-indigo-600" size={28} />
          <span className="text-xs text-slate-500 font-semibold tracking-wide">Loading Secure PayPal Checkout...</span>
        </div>
      )}
      {loadError && (
        <div className="text-center py-4 text-slate-500">
          <p className="text-xs text-red-600 font-bold mb-1">Interactive widget loading failed.</p>
          <p className="text-[11px] text-slate-400">Please use the direct link button below to complete your payment.</p>
        </div>
      )}

      {/* Container where the iframe will mount - must be separate from React-rendered children */}
      <div 
        id={containerId} 
        className={cn("w-full flex items-center justify-center", (isRendered && !loadError) ? "min-h-[140px] block" : "hidden")} 
      />

      {(loadError || !isRendered) && (
        <div className="mt-2 w-full text-center">
          <style>{`
            .pp-${hostedButtonId} {
              text-align: center;
              border: none;
              border-radius: 0.5rem;
              width: 100%;
              max-width: 18rem;
              height: 2.75rem;
              font-weight: bold;
              background-color: #FFD140;
              color: #000000;
              font-family: "Helvetica Neue", Arial, sans-serif;
              font-size: 1rem;
              line-height: 1.25rem;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              transition: background-color 0.2s;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .pp-${hostedButtonId}:hover {
              background-color: #ebd035;
            }
          `}</style>
          <form action={`https://www.paypal.com/ncp/payment/${hostedButtonId}`} method="post" target="_blank" className="flex flex-col items-center gap-2">
            <input className={`pp-${hostedButtonId}`} type="submit" value="Pay Now" />
            <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" className="h-6 mt-1" />
            <section className="text-[10px] text-slate-400">
              Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" className="h-3.5 inline-block align-middle ml-1" />
            </section>
          </form>
        </div>
      )}
    </div>
  );
};

export const PostPaymentTab = () => {
  const [mode, setMode] = useState<'payment' | 'manual'>('payment');
  const [product, setProduct] = useState<'standard' | 'discount'>('standard');
  const [copiedPaypal, setCopiedPaypal] = useState(false);
  const [copiedCalendly, setCopiedCalendly] = useState(false);
  const [form, setForm] = useState({ clientName: '', amount: '194.30', type: 'Processing Fee', method: 'PayPal', notes: '', date: new Date().toISOString().split('T')[0] });
  const [submitted, setSubmitted] = useState(false);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    turso.execute("SELECT * FROM founder_ledger ORDER BY created_at DESC LIMIT 20").then(res => setRecentPayments(res.rows)).catch(console.error);
  }, [submitted]);

  // Adjust pre-filled amounts when product changes
  useEffect(() => {
    if (product === 'standard') {
      setForm(f => ({ ...f, amount: '194.30', method: 'PayPal' }));
    } else if (product === 'discount') {
      setForm(f => ({ ...f, amount: '112.50', method: 'PayPal' }));
    }
  }, [product]);

  const postToLedger = async (entryName: string, formatted: string, methodLabel: string, txId?: string) => {
    await turso.execute({ sql: "INSERT INTO founder_ledger (id, origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", args: ['pay-' + Math.random().toString(36).substr(2, 9), entryName, `${form.type} (${methodLabel})`, formatted, formatted, 'Settled', 'bg-emerald-600', new Date(form.date).toISOString()] });
    await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), 'PAYMENT_POSTED', 'Staff (Ops Center)', JSON.stringify({ client: form.clientName, amount: formatted, type: form.type, method: methodLabel, notes: form.notes, date: form.date, transactionId: txId || 'N/A' })] });
  };

  const handleManualSubmit = async () => {
    if (!form.clientName || !form.amount) { alert('Please enter the client name and amount.'); return; }
    const cleanAmount = form.amount.replace(/[^0-9.]/g, '');
    const formatted = '$' + parseFloat(cleanAmount).toFixed(2);
    try {
      await postToLedger(`${form.clientName} — ${form.type}`, formatted, form.method);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setForm({ clientName: '', amount: '194.30', type: 'Processing Fee', method: 'PayPal', notes: '', date: new Date().toISOString().split('T')[0] }); }, 3000);
    } catch (err) { console.error(err); alert('Error posting payment: ' + err); }
  };

  const getProductDetails = () => {
    if (product === 'standard') {
      return {
        title: 'Standard Patient Application (No State Discount)',
        price: '$194.30',
        breakdown: 'Doctor recommendation ($40.00) + GGP Processing ($50.00) + OMMA State Fee ($104.30)',
        paypalId: 'Q4H5AW7NUB73Y',
        paypalLink: 'https://www.paypal.com/ncp/payment/Q4H5AW7NUB73Y',
        calendlyLink: 'https://calendly.com/globalgreenhpmeet/medical-card-recommendation'
      };
    } else {
      return {
        title: 'Discounted Patient Application (With State Discount)',
        price: '$112.50',
        breakdown: 'Doctor recommendation ($40.00) + GGP Processing ($50.00) + OMMA Reduced State Fee ($22.50)',
        paypalId: 'EZSS8BUT44LBY',
        paypalLink: 'https://www.paypal.com/ncp/payment/EZSS8BUT44LBY',
        calendlyLink: 'https://calendly.com/globalgreenhpmeet/medical-card-recommendation-clone'
      };
    }
  };

  const currentDetails = getProductDetails();

  const handleCopyPaypal = () => {
    navigator.clipboard.writeText(currentDetails.paypalLink);
    setCopiedPaypal(true);
    setTimeout(() => setCopiedPaypal(false), 2000);
  };

  const handleCopyCalendly = () => {
    navigator.clipboard.writeText(currentDetails.calendlyLink);
    setCopiedCalendly(true);
    setTimeout(() => setCopiedCalendly(false), 2000);
  };

  const handlePrepareManualLog = (paymentMethod: 'PayPal' | 'Calendly') => {
    setForm(f => ({
      ...f,
      method: paymentMethod,
      notes: `Payment collected via ${paymentMethod === 'Calendly' ? 'Calendly booking' : 'PayPal Hosted Button'} link.`
    }));
    setMode('manual');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3"><DollarSign className="text-emerald-400" size={28} /> Post Payment</h2>
          <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mt-2">Generate client payment links or log transactions to ledger</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm max-w-md">
        <button onClick={() => setMode('payment')} className={cn("flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", mode === 'payment' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}>
          <CreditCard size={14} /> PayPal / Calendly
        </button>
        <button onClick={() => setMode('manual')} className={cn("flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", mode === 'manual' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}>
          <DollarSign size={14} /> Manual Log
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          
          {/* ═══ MODE: PAYPAL & CALENDILY PAYMENTS ═══ */}
          {mode === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <CreditCard size={18} className="text-indigo-600" /> Payment &amp; Appointment Links
                </h3>
              </div>

              {/* Product Selection Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setProduct('standard')} 
                  className={cn("p-5 rounded-2xl border-2 text-left transition-all", product === 'standard' ? 'border-indigo-500 bg-indigo-50/40 shadow-sm' : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70')}
                >
                  <span className="text-xs font-black text-slate-800 block mb-1">Standard Patient Application</span>
                  <span className="text-2xl font-black text-indigo-700 block">$194.30</span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-bold">No State Discount • Standard OMMA</span>
                </button>

                <button 
                  onClick={() => setProduct('discount')} 
                  className={cn("p-5 rounded-2xl border-2 text-left transition-all", product === 'discount' ? 'border-indigo-500 bg-indigo-50/40 shadow-sm' : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70')}
                >
                  <span className="text-xs font-black text-slate-800 block mb-1">Discounted Patient Application</span>
                  <span className="text-2xl font-black text-emerald-700 block">$112.50</span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-bold">State Discount • SoonerCare/Medicare/Vet</span>
                </button>
              </div>

              {/* Selected Product Information */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800">{currentDetails.title}</h4>
                  <span className="text-sm font-black text-indigo-600">{currentDetails.price}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{currentDetails.breakdown}</p>
              </div>

              {/* Secure Payment Widget Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-600">Secure Live Credit Card Terminal (via PayPal Checkout)</span>
                  <span className="text-[10px] font-bold text-slate-400">Terminal ID: {currentDetails.paypalId}</span>
                </div>
                <PayPalButton 
                  key={currentDetails.paypalId}
                  hostedButtonId={currentDetails.paypalId}
                  containerId={`ops-paypal-container-${currentDetails.paypalId}`}
                />
              </div>

              {/* Sharing Panel: Calendly Link */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-600 flex items-center gap-1.5"><CalendarDays size={14} className="text-amber-600" /> Shareable Calendly Scheduling &amp; Payment Link</span>
                  <button 
                    onClick={handleCopyCalendly} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all active:scale-95 animate-in fade-in duration-200"
                  >
                    {copiedCalendly ? <><Check size={12} className="text-emerald-600" /> Copied!</> : <><Copy size={12} /> Copy Link</>}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly 
                    value={currentDetails.calendlyLink} 
                    className="w-full bg-white border border-slate-200 text-xs font-mono text-slate-500 px-3 py-3 rounded-xl outline-none" 
                  />
                </div>
                <div className="flex justify-between gap-4 pt-1">
                  <a 
                    href={currentDetails.calendlyLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                  >
                    Open Booking <ExternalLink size={12} />
                  </a>
                  <button 
                    onClick={() => handlePrepareManualLog('Calendly')}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                  >
                    Log to Ledger <DollarSign size={12} />
                  </button>
                </div>
              </div>

              {/* Sharing Panel: Direct PayPal Link */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-600 flex items-center gap-1.5"><Link size={14} className="text-indigo-600" /> Shareable Direct PayPal Checkout Link</span>
                  <button 
                    onClick={handleCopyPaypal} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all active:scale-95 animate-in fade-in duration-200"
                  >
                    {copiedPaypal ? <><Check size={12} className="text-emerald-600" /> Copied!</> : <><Copy size={12} /> Copy Link</>}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly 
                    value={currentDetails.paypalLink} 
                    className="w-full bg-white border border-slate-200 text-xs font-mono text-slate-500 px-3 py-3 rounded-xl outline-none" 
                  />
                </div>
                <div className="flex justify-between gap-4 pt-1">
                  <a 
                    href={currentDetails.paypalLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                  >
                    Open Checkout <ExternalLink size={12} />
                  </a>
                  <button 
                    onClick={() => handlePrepareManualLog('PayPal')}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                  >
                    Log to Ledger <DollarSign size={12} />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ═══ MODE: MANUAL LEDGER LOGGING ═══ */}
          {mode === 'manual' && (
            <div className="space-y-5">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle size={40} className="text-emerald-600" /></div>
                  <h3 className="text-xl font-black text-slate-800">Payment Posted!</h3>
                  <p className="text-sm text-slate-500 font-medium">Entry added to Accounting Ledger and audit log.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <FileText size={18} className="text-emerald-600" /> Manual Payment Entry
                  </h3>

                  {/* Common: Client + Amount */}
                  <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Client / Payer Name *</label>
                    <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="e.g. Jasmin Garrett" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Amount *</label>
                      <div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="20.00" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                      </div>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Type</label>
                      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                        {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Manual-only fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                      <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                        {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Date Received</label>
                      <div className="relative"><Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                      </div>
                    </div>
                  </div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Notes (optional)</label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Patient application processing fee received via Chime" rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm resize-none" />
                  </div>

                  {/* Submit */}
                  <button onClick={handleManualSubmit}
                    className="w-full py-3.5 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20">
                    <DollarSign size={16} /> Post Payment to Ledger
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Payments Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-600" /> Recent Ledger Entries</h4>
          <div className="space-y-3 max-h-[500px] overflow-y-auto font-sans">
            {recentPayments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm font-bold">No entries yet</div>
            ) : recentPayments.map((p: any, i: number) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{p.origin_vector}</p>
                  <span className="text-xs font-black text-emerald-600 shrink-0 ml-2">{p.gross_revenue}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{p.type}</span>
                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", p.status === 'Settled' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>{p.status}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
