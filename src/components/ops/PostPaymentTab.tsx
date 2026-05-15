import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, CheckCircle, User, FileText, Calendar, Shield, Loader2, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';
import { processCardPayment, isConfigured as authNetConfigured, getEnvironment, loadAcceptJs } from '../../lib/authorizeNet';

const PAYMENT_TYPES = ['Processing Fee','Application Fee','Consultation Fee','Service Fee','Filing Fee','Late Fee','Renewal Fee','Licensing Fee','Document Fee','Other'];
const PAYMENT_METHODS = ['Authorize.net (Card)','Chime','Cash App','Zelle','Venmo','Cash','Check','Wire Transfer','Credit Card (Manual)','Bank Transfer','Other'];

export const PostPaymentTab = () => {
  const [mode, setMode] = useState<'manual' | 'card'>('card');
  const [form, setForm] = useState({ clientName: '', amount: '', type: 'Processing Fee', method: 'Authorize.net (Card)', notes: '', date: new Date().toISOString().split('T')[0] });
  const [cardForm, setCardForm] = useState({ cardNumber: '', expMonth: '', expYear: '', cvv: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [txResult, setTxResult] = useState<{ success: boolean; message: string; transactionId?: string } | null>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const authNetReady = authNetConfigured();

  useEffect(() => {
    turso.execute("SELECT * FROM founder_ledger ORDER BY created_at DESC LIMIT 20").then(res => setRecentPayments(res.rows)).catch(console.error);
  }, [submitted]);

  useEffect(() => { if (authNetReady) loadAcceptJs().catch(console.error); }, []);

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
      setTimeout(() => { setSubmitted(false); setForm({ clientName: '', amount: '', type: 'Processing Fee', method: 'Chime', notes: '', date: new Date().toISOString().split('T')[0] }); }, 3000);
    } catch (err) { console.error(err); alert('Error posting payment: ' + err); }
  };

  const handleCardSubmit = async () => {
    if (!form.clientName || !form.amount) { alert('Please enter the client name and amount.'); return; }
    if (!cardForm.cardNumber || !cardForm.expMonth || !cardForm.expYear || !cardForm.cvv) { alert('Please fill in all card fields.'); return; }
    setProcessing(true); setTxResult(null);
    const cleanAmount = parseFloat(form.amount.replace(/[^0-9.]/g, '')).toFixed(2);
    try {
      const nameParts = form.clientName.split(' ');
      const result = await processCardPayment(
        { cardNumber: cardForm.cardNumber, expMonth: cardForm.expMonth, expYear: cardForm.expYear, cvv: cardForm.cvv },
        cleanAmount,
        { invoice: `GGP-${Date.now().toString(36).toUpperCase()}`, description: `${form.type} — ${form.clientName}`, customerEmail: cardForm.email || undefined, billTo: { firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' ') || '' } }
      );
      setTxResult(result);
      if (result.success) {
        await postToLedger(`${form.clientName} — ${form.type}`, '$' + cleanAmount, `Authorize.net Card (TX: ${result.transactionId})`, result.transactionId);
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setTxResult(null); setCardForm({ cardNumber: '', expMonth: '', expYear: '', cvv: '', email: '' }); setForm({ clientName: '', amount: '', type: 'Processing Fee', method: 'Authorize.net (Card)', notes: '', date: new Date().toISOString().split('T')[0] }); }, 4000);
      }
    } catch (err: any) { setTxResult({ success: false, message: err.message || 'Payment processing failed' }); }
    setProcessing(false);
  };

  const formatCardNumber = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3"><DollarSign className="text-emerald-400" size={28} /> Post Payment</h2>
          <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mt-2">Process card payments via Authorize.net or log manual payments → Accounting Ledger</p>
          <div className="flex items-center gap-3 mt-4">
            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", authNetReady ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-red-500/20 border-red-400/30 text-red-300")}>
              <div className={cn("w-1.5 h-1.5 rounded-full", authNetReady ? "bg-emerald-400 animate-pulse" : "bg-red-400")} /> Authorize.net {authNetReady ? 'Connected' : 'Not Configured'}
            </div>
            {authNetReady && <span className="text-[10px] text-emerald-400/60 font-bold uppercase">{getEnvironment()} Mode</span>}
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm max-w-md">
        <button onClick={() => setMode('card')} className={cn("flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", mode === 'card' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}>
          <CreditCard size={14} /> Card Payment
        </button>
        <button onClick={() => setMode('manual')} className={cn("flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", mode === 'manual' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50")}>
          <DollarSign size={14} /> Manual Log
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle size={40} className="text-emerald-600" /></div>
              <h3 className="text-xl font-black text-slate-800">Payment {mode === 'card' ? 'Processed' : 'Posted'}!</h3>
              <p className="text-sm text-slate-500 font-medium">{txResult?.transactionId ? `Transaction ID: ${txResult.transactionId}` : 'Entry added to Accounting Ledger and audit log.'}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                {mode === 'card' ? <><CreditCard size={18} className="text-indigo-600" /> Charge Card via Authorize.net</> : <><FileText size={18} className="text-emerald-600" /> Manual Payment Entry</>}
              </h3>

              {/* Transaction Result Banner */}
              {txResult && !txResult.success && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div><p className="text-sm font-bold text-red-800">Transaction Declined</p><p className="text-xs text-red-600 mt-0.5">{txResult.message}</p></div>
                </div>
              )}

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

              {/* Card Fields */}
              {mode === 'card' && (
                <div className="space-y-4 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1"><Shield size={14} className="text-indigo-600" /><span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Secure Card Entry (PCI via Accept.js)</span></div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Card Number</label>
                    <input type="text" value={cardForm.cardNumber} onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })} placeholder="4111 1111 1111 1111" maxLength={19} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm tracking-wider" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Month</label>
                      <input type="text" value={cardForm.expMonth} onChange={(e) => setCardForm({ ...cardForm, expMonth: e.target.value.replace(/\D/g,'').substring(0,2) })} placeholder="MM" maxLength={2} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm text-center" />
                    </div>
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Year</label>
                      <input type="text" value={cardForm.expYear} onChange={(e) => setCardForm({ ...cardForm, expYear: e.target.value.replace(/\D/g,'').substring(0,4) })} placeholder="2028" maxLength={4} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm text-center" />
                    </div>
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">CVV</label>
                      <input type="password" value={cardForm.cvv} onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g,'').substring(0,4) })} placeholder="•••" maxLength={4} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm text-center" />
                    </div>
                  </div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Receipt Email (optional)</label>
                    <input type="email" value={cardForm.email} onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })} placeholder="client@example.com" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" />
                  </div>
                </div>
              )}

              {/* Manual-only fields */}
              {mode === 'manual' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                      <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                        {PAYMENT_METHODS.filter(m => m !== 'Authorize.net (Card)').map(m => <option key={m} value={m}>{m}</option>)}
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
                </>
              )}

              {/* Submit */}
              <button onClick={mode === 'card' ? handleCardSubmit : handleManualSubmit} disabled={processing}
                className={cn("w-full py-3.5 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed", mode === 'card' ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20")}>
                {processing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : mode === 'card' ? <><Zap size={16} /> Charge Card Now</> : <><DollarSign size={16} /> Post Payment to Ledger</>}
              </button>
            </div>
          )}
        </div>

        {/* Recent Payments Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2"><CreditCard size={14} className="text-emerald-600" /> Recent Ledger Entries</h4>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
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
