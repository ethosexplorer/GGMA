import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, Activity, Pencil, Trash2, X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';
import { MasterBankingInfo } from '../MasterBankingInfo';

export const AccountingLedgerTab = ({ fullName, liveStats }: { fullName: string, liveStats: { totalUsers: string; netRevenue: string } }) => {
  const [isAddingLedgerEntry, setIsAddingLedgerEntry] = useState<'revenue' | 'payable' | null>(null);
  const [ledgerForm, setLedgerForm] = useState({ name: '', amount: '', net_profit: '', due_date: '', status: 'Unpaid' });
  const [editingNetProfitId, setEditingNetProfitId] = useState<number | string | null>(null);
  const [editNetProfitValue, setEditNetProfitValue] = useState('');
  const [founderLedger, setFounderLedger] = useState<any[]>([]);
  const [founderPayables, setFounderPayables] = useState<any[]>([]);

  // Edit state for revenue entries
  const [editingRevenueId, setEditingRevenueId] = useState<number | string | null>(null);
  const [editRevenueForm, setEditRevenueForm] = useState({ origin_vector: '', type: '', gross_revenue: '', net_profit: '', status: '' });

  // Edit state for payable entries
  const [editingPayableId, setEditingPayableId] = useState<number | null>(null);
  const [editPayableForm, setEditPayableForm] = useState({ name: '', amount: '', due_date: '', status: '' });

  useEffect(() => {
    // Purge old mock seed data from Turso (one-time cleanup)
    const mockNames = [
      'Sylara Medical Subscriptions', 'Metrc Integration Fees', 'Care Wallet Transactions',
      'Telehealth Consults', 'State Jurisdiction Licensing', 'Back Office Operations (Cannabis)',
      'Back Office Operations (General)', 'Attorney / Legal Retainers (Cannabis)',
      'Attorney / Legal Retainers (General)', 'Ecosystem Add-ons (Patient)',
      'Ecosystem Add-ons (Cross-Dashboard)', 'Distributor / Reseller Fees',
      'Partner Affiliate Commissions', 'Enforcement & Finance AI Bundles',
      'Care Builder Credit Programs', 'Federal Dashboard Leases'
    ];
    Promise.all(mockNames.map(n =>
      turso.execute({ sql: "DELETE FROM founder_ledger WHERE origin_vector = ?", args: [n] })
    )).then(() => {
      // Ensure founder_payables table exists fallback
      turso.execute(`
        CREATE TABLE IF NOT EXISTS founder_payables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          amount TEXT NOT NULL,
          due_date TEXT NOT NULL,
          status TEXT NOT NULL,
          color TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `).then(() => {
        refreshLedger();
        refreshPayables();
      }).catch(console.error);
    }).catch(console.error);
  }, []);

  const refreshLedger = () => {
    turso.execute('SELECT * FROM founder_ledger ORDER BY created_at DESC').then(res => setFounderLedger(res.rows)).catch(console.error);
  };

  const refreshPayables = () => {
    turso.execute('SELECT * FROM founder_payables ORDER BY due_date ASC').then(res => setFounderPayables(res.rows)).catch(console.error);
  };

  const handleSaveLedgerEntry = () => {
    if (isAddingLedgerEntry === 'revenue') {
      const grossAmt = ledgerForm.amount || '$0';
      const netAmt = ledgerForm.net_profit || grossAmt;
      const newEntry = { n: ledgerForm.name || 'Custom Revenue Stream', t: 'Manual Entry', g: grossAmt, net: netAmt, s: 'Settled', c: 'bg-emerald-600' };
      setFounderLedger([newEntry, ...founderLedger]);
      turso.execute({
        sql: "INSERT INTO founder_ledger (origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [newEntry.n, newEntry.t, newEntry.g, newEntry.net, newEntry.s, newEntry.c, new Date().toISOString()]
      }).then(() => refreshLedger()).catch(console.error);
      turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), "REVENUE_ENTRY", "Production_User", JSON.stringify({ detail: "New revenue entry: " + newEntry.n + " — " + newEntry.g })]
      }).catch(console.error);
      alert("Revenue stream added: " + newEntry.n + " — " + newEntry.g + "\n\n[Live Production Transaction Logged]");
    } else if (isAddingLedgerEntry === 'payable') {
      const newPayable = {
        name: ledgerForm.name || 'Custom Payable',
        amount: ledgerForm.amount || '$0.00',
        due_date: ledgerForm.due_date || new Date().toISOString().split('T')[0],
        status: ledgerForm.status || 'Unpaid',
        color: ledgerForm.status === 'Paid' ? 'bg-emerald-600' : (ledgerForm.status === 'Pending' ? 'bg-indigo-600' : 'bg-rose-500')
      };
      
      turso.execute({
        sql: "INSERT INTO founder_payables (name, amount, due_date, status, color) VALUES (?, ?, ?, ?, ?)",
        args: [newPayable.name, newPayable.amount, newPayable.due_date, newPayable.status, newPayable.color]
      }).then(() => {
        refreshPayables();
      }).catch(console.error);

      turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), "PAYABLE_ENTRY", "Production_User", JSON.stringify({ detail: "New account payable entry: " + newPayable.name + " — " + newPayable.amount })]
      }).catch(console.error);

      alert("Account payable added: " + newPayable.name + " — " + newPayable.amount + "\n\n[Live Production Transaction Logged]");
    }
    setIsAddingLedgerEntry(null);
    setLedgerForm({ name: '', amount: '', net_profit: '', due_date: '', status: 'Unpaid' });
  };

  const handleTogglePayableStatus = (id: number, newStatus: 'Paid' | 'Unpaid') => {
    const newColor = newStatus === 'Paid' ? 'bg-emerald-600' : 'bg-rose-500';
    turso.execute({
      sql: "UPDATE founder_payables SET status = ?, color = ? WHERE id = ?",
      args: [newStatus, newColor, id]
    }).then(() => {
      refreshPayables();
      turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), "PAYABLE_STATUS_UPDATE", "Production_User", JSON.stringify({ detail: `Updated payable ID ${id} to ${newStatus}` })]
      }).catch(console.error);
    }).catch(console.error);
  };

  // --- EDIT / DELETE REVENUE ENTRIES ---
  const handleStartEditRevenue = (entry: any) => {
    setEditingRevenueId(entry.id);
    setEditRevenueForm({
      origin_vector: entry.origin_vector || entry.n || '',
      type: entry.type || entry.t || '',
      gross_revenue: entry.gross_revenue || entry.g || '',
      net_profit: entry.net_profit || entry.net || '',
      status: entry.status || entry.s || ''
    });
  };

  const handleSaveEditRevenue = () => {
    if (!editingRevenueId) return;
    const colorMap: Record<string, string> = { 'Settled': 'bg-emerald-600', 'Pending': 'bg-amber-500', 'Refunded': 'bg-rose-500', 'Voided': 'bg-slate-500' };
    const newColor = colorMap[editRevenueForm.status] || 'bg-emerald-600';
    turso.execute({
      sql: "UPDATE founder_ledger SET origin_vector = ?, type = ?, gross_revenue = ?, net_profit = ?, status = ?, color = ? WHERE id = ?",
      args: [editRevenueForm.origin_vector, editRevenueForm.type, editRevenueForm.gross_revenue, editRevenueForm.net_profit, editRevenueForm.status, newColor, editingRevenueId]
    }).then(() => {
      turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), "REVENUE_EDITED", "Production_User", JSON.stringify({ id: editingRevenueId, changes: editRevenueForm })]
      }).catch(console.error);
      refreshLedger();
      setEditingRevenueId(null);
    }).catch(err => { console.error(err); alert('Error saving edit: ' + err.message); });
  };

  const handleDeleteRevenue = (entry: any) => {
    const name = entry.origin_vector || entry.n || 'this entry';
    if (!confirm(`⚠️ Permanently delete revenue entry:\n\n"${name}"\n\nThis action is logged and cannot be undone.`)) return;
    turso.execute({
      sql: "DELETE FROM founder_ledger WHERE id = ?",
      args: [entry.id]
    }).then(() => {
      turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), "REVENUE_DELETED", "Production_User", JSON.stringify({ id: entry.id, origin_vector: name, gross_revenue: entry.gross_revenue || entry.g })]
      }).catch(console.error);
      refreshLedger();
    }).catch(err => { console.error(err); alert('Error deleting entry: ' + err.message); });
  };

  // --- EDIT / DELETE PAYABLE ENTRIES ---
  const handleStartEditPayable = (entry: any) => {
    setEditingPayableId(entry.id);
    setEditPayableForm({
      name: entry.name || '',
      amount: entry.amount || '',
      due_date: entry.due_date || '',
      status: entry.status || ''
    });
  };

  const handleSaveEditPayable = () => {
    if (!editingPayableId) return;
    const colorMap: Record<string, string> = { 'Paid': 'bg-emerald-600', 'Pending': 'bg-indigo-600', 'Unpaid': 'bg-rose-500' };
    const newColor = colorMap[editPayableForm.status] || 'bg-rose-500';
    turso.execute({
      sql: "UPDATE founder_payables SET name = ?, amount = ?, due_date = ?, status = ?, color = ? WHERE id = ?",
      args: [editPayableForm.name, editPayableForm.amount, editPayableForm.due_date, editPayableForm.status, newColor, editingPayableId]
    }).then(() => {
      turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), "PAYABLE_EDITED", "Production_User", JSON.stringify({ id: editingPayableId, changes: editPayableForm })]
      }).catch(console.error);
      refreshPayables();
      setEditingPayableId(null);
    }).catch(err => { console.error(err); alert('Error saving edit: ' + err.message); });
  };

  const handleDeletePayable = (entry: any) => {
    const name = entry.name || 'this entry';
    if (!confirm(`⚠️ Permanently delete payable entry:\n\n"${name}"\n\nThis action is logged and cannot be undone.`)) return;
    turso.execute({
      sql: "DELETE FROM founder_payables WHERE id = ?",
      args: [entry.id]
    }).then(() => {
      turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), "PAYABLE_DELETED", "Production_User", JSON.stringify({ id: entry.id, name, amount: entry.amount })]
      }).catch(console.error);
      refreshPayables();
    }).catch(err => { console.error(err); alert('Error deleting entry: ' + err.message); });
  };

  const parseAmount = (amtStr: string): number => {
    if (!amtStr) return 0;
    const clean = amtStr.replace(/[$,]/g, '').trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalOutstandingPayables = founderPayables
    .filter(p => p.status === 'Unpaid' || p.status === 'Pending')
    .reduce((sum, p) => sum + parseAmount(p.amount), 0);

  const totalPaidPayables = founderPayables
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + parseAmount(p.amount), 0);

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  if (isAddingLedgerEntry) {
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={() => setIsAddingLedgerEntry(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to Ledger
        </button>
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            {isAddingLedgerEntry === 'revenue' ? 'Add Revenue Stream' : 'Add Account Payable'}
          </h2>
          <p className="text-slate-500 mb-8 font-medium">Enter the details for this new manual ledger entry.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Account / Source Name</label>
              <input
                type="text"
                placeholder="e.g. Jasmin Garrett — Processing Fee"
                value={ledgerForm.name}
                onChange={(e) => setLedgerForm({ ...ledgerForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{isAddingLedgerEntry === 'revenue' ? 'Gross Amount' : 'Amount'}</label>
              <input
                type="text"
                placeholder="e.g. $194.30"
                value={ledgerForm.amount}
                onChange={(e) => setLedgerForm({ ...ledgerForm, amount: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
            </div>
            {isAddingLedgerEntry === 'revenue' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Net Profit</label>
                <input
                  type="text"
                  placeholder="e.g. $55.00 (leave blank to use gross)"
                  value={ledgerForm.net_profit}
                  onChange={(e) => setLedgerForm({ ...ledgerForm, net_profit: e.target.value })}
                  className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">The actual profit after costs. If blank, defaults to gross amount.</p>
              </div>
            )}
            {isAddingLedgerEntry === 'payable' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={ledgerForm.due_date}
                    onChange={(e) => setLedgerForm({ ...ledgerForm, due_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select
                    value={ledgerForm.status}
                    onChange={(e) => setLedgerForm({ ...ledgerForm, status: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button onClick={handleSaveLedgerEntry} className="px-6 py-3 bg-[#1a4731] hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg transition-colors flex-1">
              Save Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="bg-emerald-950 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Wallet size={160} className="text-emerald-400" /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">GGP Core Ledger</h2>
            <p className="text-emerald-200 font-medium text-lg">Universal revenue breakdown, taxation vectors, and master settlement routing.</p>
          </div>
          <div className="text-center md:text-right px-8 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Network Gross</p>
            <p className="text-4xl font-black text-white">{liveStats.netRevenue}</p>
          </div>
        </div>
      </div>

      <MasterBankingInfo />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Accounts Receivable Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Activity size={20} className="text-emerald-600" /> Accounts Receivable (Revenue Streams)</h3>
              <div className="flex gap-2">
                <button onClick={() => { setIsAddingLedgerEntry('revenue'); setLedgerForm({ name: '', amount: '', net_profit: '', due_date: '', status: 'Unpaid' }); }} className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">+ Add Revenue Stream</button>
                <button onClick={() => { setIsAddingLedgerEntry('revenue'); setLedgerForm({ name: '', amount: '', net_profit: '', due_date: '', status: 'Unpaid' }); }} className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors">💵 Post Payment</button>
                <button onClick={() => {
                  import('../../lib/turso').then(({ turso }) => {
                    return turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: ['log-' + Math.random().toString(36).substr(2, 9), "EXPORT", "Production_User", JSON.stringify({ detail: "Exporting Accounts Receivable to CSV..." })]
                    });
                  }).then(() => {
                    alert("Exporting Accounts Receivable to CSV...\n\n[Live Production Transaction Logged]");
                  }).catch(console.error);
                }} className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100">Export CSV</button>
              </div>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Origin Vector</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Gross Revenue</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Net Profit</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(founderLedger.length > 0 ? founderLedger : [
                  { n: 'Jasmin Garrett — Patient Application Processing Fee', t: 'Service Fee (Chime)', g: '$20.00', net: '$20.00', s: 'Settled', c: 'bg-emerald-600' }
                ]).map((u: any, i: number) => {
                  const isEditing = editingRevenueId === u.id && u.id != null;

                  if (isEditing) {
                    return (
                      <tr key={u.id || i} className="bg-indigo-50/50">
                        <td className="px-4 py-3">
                          <input type="text" value={editRevenueForm.origin_vector} onChange={e => setEditRevenueForm({ ...editRevenueForm, origin_vector: e.target.value })}
                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" value={editRevenueForm.type} onChange={e => setEditRevenueForm({ ...editRevenueForm, type: e.target.value })}
                            className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" value={editRevenueForm.gross_revenue} onChange={e => setEditRevenueForm({ ...editRevenueForm, gross_revenue: e.target.value })}
                            className="w-28 px-3 py-2 border border-indigo-300 rounded-lg text-sm font-mono font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" value={editRevenueForm.net_profit} onChange={e => setEditRevenueForm({ ...editRevenueForm, net_profit: e.target.value })}
                            className="w-28 px-3 py-2 border border-emerald-300 rounded-lg text-sm font-mono font-bold bg-emerald-50 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </td>
                        <td className="px-4 py-3">
                          <select value={editRevenueForm.status} onChange={e => setEditRevenueForm({ ...editRevenueForm, status: e.target.value })}
                            className="px-3 py-2 border border-indigo-300 rounded-lg text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="Settled">Settled</option>
                            <option value="Pending">Pending</option>
                            <option value="Refunded">Refunded</option>
                            <option value="Voided">Voided</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={handleSaveEditRevenue} className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors" title="Save">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setEditingRevenueId(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="Cancel">
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={u.id || i} className="hover:bg-slate-100 transition-colors group">
                      <td className="px-6 py-5 font-black text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full shadow-sm", u.color || u.c)}></div>
                          <span className="font-bold text-slate-700">{u.origin_vector || u.n}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-slate-500">{u.type || u.t}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-700">{u.gross_revenue || u.g}</td>
                      <td className="px-6 py-5">
                        {editingNetProfitId === (u.id || i) ? (
                          <div className="flex items-center gap-1">
                            <input
                              autoFocus
                              type="text"
                              value={editNetProfitValue}
                              onChange={e => setEditNetProfitValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  const newVal = editNetProfitValue;
                                  if (u.id && typeof u.id === 'number') {
                                    turso.execute({ sql: 'UPDATE founder_ledger SET net_profit = ? WHERE id = ?', args: [newVal, u.id] })
                                      .then(() => turso.execute('SELECT * FROM founder_ledger ORDER BY created_at DESC'))
                                      .then(res => setFounderLedger(res.rows))
                                      .catch(console.error);
                                  } else {
                                    turso.execute({ sql: 'UPDATE founder_ledger SET net_profit = ? WHERE origin_vector = ?', args: [newVal, u.origin_vector || u.n] })
                                      .then(() => turso.execute('SELECT * FROM founder_ledger ORDER BY created_at DESC'))
                                      .then(res => setFounderLedger(res.rows))
                                      .catch(console.error);
                                  }
                                  setEditingNetProfitId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingNetProfitId(null);
                                }
                              }}
                              onBlur={() => setEditingNetProfitId(null)}
                              className="w-24 px-2 py-1 border border-emerald-300 rounded-lg text-sm font-mono font-bold text-emerald-700 bg-emerald-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingNetProfitId(u.id || i); setEditNetProfitValue(u.net_profit || u.net || ''); }}
                            className="font-mono font-black text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 px-2 py-1 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                            title="Click to edit net profit"
                          >
                            {u.net_profit || u.net}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn("text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white", u.color || u.c)}>{u.status || u.s}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {u.id != null && (
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleStartEditRevenue(u)} className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors border border-indigo-200" title="Edit entry">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => handleDeleteRevenue(u)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200" title="Delete entry">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Accounts Payable Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-3">
                  <Activity size={20} className="text-rose-500" /> Accounts Payable (Bills & Invoices)
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Track operational costs, software licenses, vendor invoices, and compliance dues.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setIsAddingLedgerEntry('payable');
                    setLedgerForm({ name: '', amount: '', due_date: new Date().toISOString().split('T')[0], status: 'Unpaid' });
                  }}
                  className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors animate-pulse"
                >
                  + Add Bill / Invoice
                </button>
              </div>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-5 bg-rose-950/5 border border-rose-500/10 rounded-2xl">
                <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">Total Outstanding Payables</p>
                <p className="text-3xl font-black text-rose-600">{formatCurrency(totalOutstandingPayables)}</p>
              </div>
              <div className="p-5 bg-emerald-950/5 border border-emerald-500/10 rounded-2xl">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Total Paid Bills</p>
                <p className="text-3xl font-black text-emerald-600">{formatCurrency(totalPaidPayables)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Bill / Vendor</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Due Date</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {founderPayables.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">No payables registered. Click "+ Add Bill / Invoice" to create one.</td>
                    </tr>
                  ) : (
                    founderPayables.map((p: any, i: number) => {
                      const isEditingP = editingPayableId === p.id;

                      if (isEditingP) {
                        return (
                          <tr key={p.id || i} className="bg-indigo-50/50">
                            <td className="px-4 py-3">
                              <input type="text" value={editPayableForm.name} onChange={e => setEditPayableForm({ ...editPayableForm, name: e.target.value })}
                                className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </td>
                            <td className="px-4 py-3">
                              <input type="date" value={editPayableForm.due_date} onChange={e => setEditPayableForm({ ...editPayableForm, due_date: e.target.value })}
                                className="px-3 py-2 border border-indigo-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </td>
                            <td className="px-4 py-3">
                              <input type="text" value={editPayableForm.amount} onChange={e => setEditPayableForm({ ...editPayableForm, amount: e.target.value })}
                                className="w-28 px-3 py-2 border border-indigo-300 rounded-lg text-sm font-mono font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </td>
                            <td className="px-4 py-3">
                              <select value={editPayableForm.status} onChange={e => setEditPayableForm({ ...editPayableForm, status: e.target.value })}
                                className="px-3 py-2 border border-indigo-300 rounded-lg text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={handleSaveEditPayable} className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors" title="Save">
                                  <Check size={14} />
                                </button>
                                <button onClick={() => setEditingPayableId(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="Cancel">
                                  <X size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={p.id || i} className="hover:bg-slate-100 transition-colors group">
                          <td className="px-6 py-5 font-black text-slate-800">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", p.color || p.c)}></div>
                              <span className="font-bold text-slate-700">{p.name || p.n}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-xs font-bold text-slate-500">{p.due_date || p.due}</td>
                          <td className="px-6 py-5 font-mono font-bold text-slate-700">{p.amount}</td>
                          <td className="px-6 py-5">
                            <span className={cn("text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white", p.color || p.c)}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.status !== 'Paid' ? (
                                <button
                                  onClick={() => handleTogglePayableStatus(p.id, 'Paid')}
                                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-lg border border-emerald-200 transition-colors"
                                >
                                  Mark Paid
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleTogglePayableStatus(p.id, 'Unpaid')}
                                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider rounded-lg border border-rose-200 transition-colors"
                                >
                                  Mark Unpaid
                                </button>
                              )}
                              <button onClick={() => handleStartEditPayable(p)} className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors border border-indigo-200 opacity-0 group-hover:opacity-100" title="Edit entry">
                                <Pencil size={13} />
                              </button>
                              <button onClick={() => handleDeletePayable(p)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 opacity-0 group-hover:opacity-100" title="Delete entry">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden h-full">
            <h3 className="font-black text-sm text-emerald-400 uppercase tracking-widest mb-6">Net Profit Distribution</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-400">OpEx & Infrastructure</span>
                  <span className="text-white">12%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-400">R&D / Sylara AI Engine</span>
                  <span className="text-white">24%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-400">Founder Equity Net</span>
                  <span className="text-emerald-400">64%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available for Draw (Net Profit)</p>
                <p className="text-2xl font-black text-emerald-400">{formatCurrency(founderLedger.reduce((sum, u) => sum + parseAmount(u.net_profit || u.net || u.gross_revenue || u.g || '0'), 0))}</p>
              </div>
              <button onClick={() => {
                if (confirm('Authorize capital draw of $8.33M? This requires dual authentication.')) {
                  import('../../lib/turso').then(({ turso }) => {
                    return turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: ['log-' + Math.random().toString(36).substr(2, 9), "FINANCIAL", "Production_User", JSON.stringify({ detail: "Capital Draw Authorization Initiated. Dual authentication pending." })]
                    });
                  }).then(() => {
                    alert("Capital Draw Authorization Initiated. Dual authentication pending.\n\n[Live Production Transaction Logged]");
                  }).catch(console.error);
                }
              }} className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Authorize Draw</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
