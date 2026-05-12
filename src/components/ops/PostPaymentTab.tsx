import React, { useState } from 'react';
import { DollarSign, CreditCard, CheckCircle, User, FileText, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';

const PAYMENT_TYPES = [
  'Processing Fee',
  'Application Fee',
  'Consultation Fee',
  'Service Fee',
  'Filing Fee',
  'Late Fee',
  'Renewal Fee',
  'Licensing Fee',
  'Document Fee',
  'Other'
];

const PAYMENT_METHODS = [
  'Chime',
  'Cash App',
  'Zelle',
  'Venmo',
  'Cash',
  'Check',
  'Wire Transfer',
  'Credit Card',
  'Bank Transfer',
  'Other'
];

export const PostPaymentTab = () => {
  const [form, setForm] = useState({
    clientName: '',
    amount: '',
    type: 'Processing Fee',
    method: 'Chime',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitted, setSubmitted] = useState(false);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  // Load recent payments on mount
  React.useEffect(() => {
    turso.execute("SELECT * FROM founder_ledger ORDER BY created_at DESC LIMIT 20")
      .then(res => setRecentPayments(res.rows))
      .catch(console.error);
  }, [submitted]);

  const handleSubmit = async () => {
    if (!form.clientName || !form.amount) {
      alert('Please enter the client name and amount.');
      return;
    }

    const cleanAmount = form.amount.replace(/[^0-9.]/g, '');
    const formatted = '$' + parseFloat(cleanAmount).toFixed(2);
    const entryName = `${form.clientName} — ${form.type}`;

    try {
      // Insert into founder_ledger (Accounting Ledger)
      await turso.execute({
        sql: "INSERT INTO founder_ledger (id, origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          'pay-' + Math.random().toString(36).substr(2, 9),
          entryName,
          `${form.type} (${form.method})`,
          formatted,
          formatted,
          'Settled',
          'bg-emerald-600',
          new Date(form.date).toISOString()
        ]
      });

      // Audit log
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: [
          'log-' + Math.random().toString(36).substr(2, 9),
          'PAYMENT_POSTED',
          'Staff (Ops Center)',
          JSON.stringify({
            client: form.clientName,
            amount: formatted,
            type: form.type,
            method: form.method,
            notes: form.notes,
            date: form.date
          })
        ]
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ clientName: '', amount: '', type: 'Processing Fee', method: 'Chime', notes: '', date: new Date().toISOString().split('T')[0] });
      }, 3000);

    } catch (err) {
      console.error('Payment post error:', err);
      alert('Error posting payment: ' + err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10"><DollarSign size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <DollarSign className="text-emerald-400" size={28} /> Post Payment
          </h2>
          <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mt-2">
            Log one-time payments received (Chime, Cash App, Cash, etc.) → posts to Accounting Ledger
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Payment Posted!</h3>
              <p className="text-sm text-slate-500 font-medium">
                Entry added to Accounting Ledger and audit log.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-emerald-600" /> Payment Details
              </h3>

              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Client / Payer Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="e.g. Jasmin Garrett"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                  />
                </div>
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="20.00"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Date Received</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Type + Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                  >
                    {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                  <select
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm"
                  >
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Patient application processing fee received via Chime"
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <DollarSign size={16} /> Post Payment to Ledger
              </button>
            </div>
          )}
        </div>

        {/* Recent Payments Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <CreditCard size={14} className="text-emerald-600" /> Recent Ledger Entries
          </h4>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {recentPayments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm font-bold">No entries yet</div>
            ) : (
              recentPayments.map((p: any, i: number) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{p.origin_vector}</p>
                    <span className="text-xs font-black text-emerald-600 shrink-0 ml-2">{p.gross_revenue}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{p.type}</span>
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded",
                      p.status === 'Settled' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    )}>{p.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
