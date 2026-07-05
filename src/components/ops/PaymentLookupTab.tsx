import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Search, FileText, Calendar, Loader2, CheckCircle, Copy, Check, ExternalLink, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, RefreshCw, CreditCard, User, Mail, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';

interface PaymentRecord {
  id: string;
  clientName: string;
  type: string;
  method: string;
  amount: string;
  net: string;
  status: string;
  date: string;
  notes: string;
  source: 'ledger' | 'audit' | 'firestore';
  rawData?: any;
}

interface PaymentLookupTabProps {
  user?: any;
}

export const PaymentLookupTab = ({ user }: PaymentLookupTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Determine if the user is Master/Founder
  const isMaster = user?.role === 'founder' || 
                   user?.role === 'executive_founder' || 
                   user?.role === 'executive' || 
                   user?.role === 'president' ||
                   user?.roleId === 'founder' ||
                   (user?.displayName || user?.name || '').toLowerCase().includes('founder') ||
                   (user?.displayName || user?.name || '').toLowerCase().includes('shantell');

  // Stats
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    settledCount: 0,
    pendingCount: 0
  });

  const loadAllRecentPayments = useCallback(async () => {
    setIsSearching(true);
    try {
      const ledgerResult = await turso.execute('SELECT * FROM founder_ledger ORDER BY created_at DESC LIMIT 50');
      const records: PaymentRecord[] = ledgerResult.rows.map((row: any) => {
        const origin = row.origin_vector || '';
        // Extract client name and payment type from e.g. "Jasmin Garrett — Processing Fee"
        const parts = origin.split(' — ');
        const clientName = parts[0] || 'Unknown Client';
        const rawType = parts[1] || row.type || 'Service Fee';

        // Extract method from type e.g. "Processing Fee (PayPal)"
        const methodMatch = String(row.type || '').match(/\(([^)]+)\)/);
        const method = methodMatch ? methodMatch[1] : 'Unknown';
        const type = String(row.type || '').split(' (')[0];

        return {
          id: `ledger-${row.id}`,
          clientName,
          type,
          method,
          amount: row.gross_revenue || '$0.00',
          net: row.net_profit || '$0.00',
          status: row.status || 'Settled',
          date: row.created_at || '',
          notes: row.notes || 'Ledger recorded entry',
          source: 'ledger',
          rawData: row
        };
      });

      setPayments(records);
      calculateStats(records);
    } catch (err) {
      console.error('Error loading recent payments:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Run on mount (Only load recent entries by default for Founder/Master)
  useEffect(() => {
    if (isMaster) {
      loadAllRecentPayments();
    }
  }, [isMaster, loadAllRecentPayments]);

  const calculateStats = (records: PaymentRecord[]) => {
    let revenue = 0;
    let settled = 0;
    let pending = 0;

    records.forEach(r => {
      const amt = parseFloat(r.amount.replace(/[^0-9.]/g, '')) || 0;
      revenue += amt;
      if (r.status.toLowerCase() === 'settled' || r.status.toLowerCase() === 'paid') {
        settled++;
      } else {
        pending++;
      }
    });

    setStats({
      totalPayments: records.length,
      totalRevenue: revenue,
      settledCount: settled,
      pendingCount: pending
    });
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      if (isMaster) {
        loadAllRecentPayments();
      } else {
        setPayments([]);
      }
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setExpandedId(null);

    try {
      const qWildcard = `%${q}%`;
      // Query Turso founder_ledger
      const ledgerResult = await turso.execute({
        sql: "SELECT * FROM founder_ledger WHERE origin_vector LIKE ? OR type LIKE ? OR gross_revenue LIKE ? ORDER BY created_at DESC",
        args: [qWildcard, qWildcard, qWildcard]
      });

      const records: PaymentRecord[] = ledgerResult.rows.map((row: any) => {
        const origin = row.origin_vector || '';
        const parts = origin.split(' — ');
        const clientName = parts[0] || 'Unknown Client';
        
        const methodMatch = String(row.type || '').match(/\(([^)]+)\)/);
        const method = methodMatch ? methodMatch[1] : 'Unknown';
        const type = String(row.type || '').split(' (')[0];

        return {
          id: `ledger-${row.id}`,
          clientName,
          type,
          method,
          amount: row.gross_revenue || '$0.00',
          net: row.net_profit || '$0.00',
          status: row.status || 'Settled',
          date: row.created_at || '',
          notes: row.notes || 'Ledger recorded entry',
          source: 'ledger',
          rawData: row
        };
      });

      // Query Turso audit_logs for matching payments
      const auditResult = await turso.execute({
        sql: "SELECT * FROM audit_logs WHERE action = 'PAYMENT_POSTED_ACCOUNT_LOOKUP' AND (data LIKE ? OR user_id LIKE ?) ORDER BY created_at DESC LIMIT 100",
        args: [qWildcard, qWildcard]
      });

      auditResult.rows.forEach((row: any) => {
        try {
          const logData = JSON.parse(row.data || '{}');
          const id = `audit-${row.id}`;
          
          // Avoid duplicate display if it's already represented in ledger results
          const exists = records.some(r => 
            r.clientName.toLowerCase() === (logData.client || '').toLowerCase() &&
            r.amount.replace(/[^0-9.]/g, '') === (logData.amount || '').replace(/[^0-9.]/g, '')
          );

          if (!exists) {
            records.push({
              id,
              clientName: logData.client || 'Unknown Client',
              type: logData.type || 'Payment',
              method: logData.method || 'Unknown',
              amount: logData.amount || '$0.00',
              net: logData.amount || '$0.00',
              status: 'Settled',
              date: logData.date || row.created_at || '',
              notes: logData.notes || 'Recorded via Account Lookup',
              source: 'audit',
              rawData: logData
            });
          }
        } catch {}
      });

      setPayments(records);
      calculateStats(records);
    } catch (err) {
      console.error('Payment search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyReceipt = (p: PaymentRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const formattedDate = p.date ? new Date(p.date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A';
    const cleanAmount = p.amount;
    
    const receiptText = `=======================================
GLOBAL GREEN HYBRID PLATFORM RECEIPT
=======================================
Client Name    : ${p.clientName}
Payment Type   : ${p.type}
Method         : ${p.method}
Amount Paid    : ${cleanAmount}
Status         : ${p.status}
Date           : ${formattedDate}
Transaction ID : ${p.id.replace('ledger-', '').replace('audit-', '').toUpperCase()}
=======================================
Thank you for supporting GGP-OS!
For inquiries or refunds, contact GGE Billing
Phone: 1-888-963-4447 | Email: asstsupport@gmail.com
=======================================`;

    navigator.clipboard.writeText(receiptText);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><DollarSign size={80} /></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-emerald-400" />
            </div>
            Payment Lookup
          </h2>
          <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mt-1">Verify invoice status and payment history for customer inquiries</p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue Found', value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-emerald-600', hide: !isMaster },
          { label: 'Payments Count', value: String(stats.totalPayments), icon: FileText, color: 'text-indigo-600' },
          { label: 'Settled Ledger', value: String(stats.settledCount), icon: CheckCircle, color: 'text-emerald-600' },
          { label: 'Pending Audits', value: String(stats.pendingCount), icon: AlertTriangle, color: 'text-amber-500' }
        ].filter(s => !s.hide).map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <s.icon size={14} className={s.color} />
            </div>
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payment logs by client name, amount, method, or transaction notes..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 flex items-center gap-2 shadow-md"
          >
            {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Query
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              if (isMaster) {
                loadAllRecentPayments();
              } else {
                setPayments([]);
              }
              setHasSearched(false);
            }}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        </form>
      </div>

      {/* Payment Entries */}
      {isSearching ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-indigo-500 mx-auto" />
            <p className="text-sm font-bold text-slate-500">Querying platform ledgers...</p>
          </div>
        </div>
      ) : (!isMaster && !hasSearched) ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
          <Search size={32} className="text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-700">Ready for Payment Lookup</p>
          <p className="text-xs text-slate-400 mt-1">Enter a client's name, email, or transaction details above to search payment logs.</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
          <AlertTriangle size={32} className="text-amber-400 mb-2" />
          <p className="text-sm font-bold text-slate-700">No payment logs found</p>
          <p className="text-xs text-slate-400 mt-1">Try expanding your search query or verify if transaction is posted.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing {payments.length} Transaction{payments.length !== 1 ? 's' : ''} {hasSearched && 'matching query'}
            </p>
          </div>

          <div className="space-y-3">
            {payments.map((p) => {
              const isExpanded = expandedId === p.id;
              return (
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Row Summary */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-800">{p.clientName}</p>
                          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{p.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.method} • {p.date ? new Date(p.date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-emerald-600">{p.amount}</span>
                      <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full border", 
                        p.status.toLowerCase() === 'settled' || p.status.toLowerCase() === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      )}>
                        {p.status}
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Client Name', value: p.clientName, icon: User },
                          { label: 'Payment Type', value: p.type, icon: FileText },
                          { label: 'Channel/Method', value: p.method, icon: CreditCard },
                          { label: 'Gross Settlement', value: p.amount, icon: DollarSign },
                          { label: 'Net Profit', value: p.net, icon: DollarSign },
                          { label: 'Ledger Status', value: p.status, icon: ShieldCheck },
                          { label: 'Date Cleared', value: p.date ? new Date(p.date).toLocaleString() : 'N/A', icon: Calendar },
                          { label: 'System Source', value: p.source === 'ledger' ? 'Accounting Ledger' : 'Lookup Log', icon: FileText }
                        ].map((f, i) => (
                          <div key={i}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                              <f.icon size={10} /> {f.label}
                            </p>
                            <p className="text-xs font-semibold text-slate-700">{f.value}</p>
                          </div>
                        ))}
                      </div>

                      {p.notes && (
                        <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3.5">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transaction Notes</p>
                          <p className="text-xs text-slate-600 whitespace-pre-wrap">{p.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60">
                        <button
                          onClick={(e) => handleCopyReceipt(p, e)}
                          className={cn("px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-sm border", 
                            copiedId === p.id 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          {copiedId === p.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Text Receipt</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
