import React, { useState, useCallback } from 'react';
import { Search, User, Phone, Mail, MapPin, Building2, Tag, Calendar, Edit2, Save, X, Loader2, AlertTriangle, FileText, Hash, ChevronDown, ChevronUp, DollarSign, CircleCheck, HeartPulse, Shield, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { turso } from '../../lib/turso';

interface SearchResult {
  id: string;
  source: 'contacts' | 'users' | 'crm_deals' | 'turso_patients' | 'turso_audit';
  name: string;
  email: string;
  phone: string;
  state: string;
  accountId: string;
  contactType: string;
  status: string;
  createdAt: string;
  // Extended fields
  address?: string;
  city?: string;
  zip?: string;
  businessName?: string;
  licenseType?: string;
  notes?: string;
  tags?: string[];
  rawData?: any;
  // Intake-specific
  dob?: string;
  ssn?: string;
  conditions?: string;
  allergies?: string;
  insurance?: string;
  appointmentType?: string;
  appType?: string;
  pcpInfo?: string;
  portalAccount?: string;
}

const PAYMENT_TYPES = ['Processing Fee', 'Application Fee', 'Consultation Fee', 'Service Fee', 'Filing Fee', 'Late Fee', 'Renewal Fee', 'Licensing Fee', 'Document Fee', 'Other'];
const PAYMENT_METHODS = ['Chime', 'Cash App', 'Zelle', 'Venmo', 'Cash', 'Check', 'Wire Transfer', 'Credit Card', 'Bank Transfer', 'PayPal', 'Other'];

// ─── Moved OUTSIDE component to prevent React remount on every keystroke ───
const EditField = ({ label, field, value, type = 'text', editData, setEditData }: { label: string; field: string; value: string; type?: string; editData: Record<string, any>; setEditData: React.Dispatch<React.SetStateAction<Record<string, any>>> }) => (
  <div>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">{label}</label>
    <input
      type={type}
      value={editData[field] !== undefined ? String(editData[field]) : value}
      onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
    />
  </div>
);

const EditSelect = ({ label, field, value, options, editData, setEditData }: { label: string; field: string; value: string; options: string[]; editData: Record<string, any>; setEditData: React.Dispatch<React.SetStateAction<Record<string, any>>> }) => (
  <div>
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">{label}</label>
    <select
      value={editData[field] !== undefined ? String(editData[field]) : value}
      onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
    >
      <option value="">— Select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export const AccountLookupTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Payment state per-record
  const [paymentFormFor, setPaymentFormFor] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    type: 'Processing Fee',
    method: 'Chime',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [paymentPosted, setPaymentPosted] = useState(false);
  const [postingPayment, setPostingPayment] = useState(false);

  const deduplicateResults = (items: SearchResult[]): SearchResult[] => {
    const map = new Map<string, SearchResult>();
    for (const item of items) {
      const email = (item.email || '').toLowerCase().trim();
      const phone = (item.phone || '').replace(/\D/g, '');
      const name = (item.name || '').toLowerCase().trim();
      const key = email || phone || name || item.id;
      
      if (map.has(key)) {
        const existing = map.get(key)!;
        const priority = ['users', 'contacts', 'crm_deals', 'turso_patients', 'turso_audit'];
        if (priority.indexOf(item.source) < priority.indexOf(existing.source)) {
          map.set(key, { ...existing, ...item, notes: item.notes || existing.notes, tags: [...(existing.tags || []), ...(item.tags || [])] });
        } else {
          map.set(key, {
            ...existing,
            phone: existing.phone || item.phone,
            address: existing.address || item.address,
            city: existing.city || item.city,
            state: existing.state || item.state,
            accountId: existing.accountId || item.accountId,
            notes: existing.notes || item.notes,
            dob: existing.dob || item.dob,
            ssn: existing.ssn || item.ssn,
            conditions: existing.conditions || item.conditions,
            allergies: existing.allergies || item.allergies,
            insurance: existing.insurance || item.insurance,
            appointmentType: existing.appointmentType || item.appointmentType,
            appType: existing.appType || item.appType,
            pcpInfo: existing.pcpInfo || item.pcpInfo,
          });
        }
      } else {
        map.set(key, item);
      }
    }
    return Array.from(map.values());
  };

  // Parse intake-specific data from rawData
  const extractIntakeFields = (raw: any): Partial<SearchResult> => {
    if (!raw) return {};
    return {
      dob: raw.dob || raw.dateOfBirth || '',
      ssn: raw.ssn || '',
      conditions: raw.conditions || '',
      allergies: raw.allergies || '',
      insurance: raw.insuranceName || raw.insurance || '',
      appointmentType: raw.appointmentType || '',
      appType: raw.appType || raw.licenseType || '',
      pcpInfo: raw.pcpInfo || '',
      portalAccount: raw.hasPortalAccount || '',
    };
  };

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);
    setHasSearched(true);
    setExpandedId(null);
    setEditingId(null);
    setPaymentFormFor(null);
    setPaymentPosted(false);

    const allResults: SearchResult[] = [];
    const qLower = q.toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    const isAccountId = q.toUpperCase().startsWith('ACC-');
    const isPhoneSearch = qDigits.length >= 7;

    // 1. Search Firestore `contacts` collection
    try {
      if (q.includes('@')) {
        const snap = await getDocs(query(collection(db, 'contacts'), where('email', '==', qLower)));
        snap.docs.forEach(d => {
          const data = d.data();
          allResults.push({
            id: d.id, source: 'contacts', name: data.name || '', email: data.email || '',
            phone: data.phone || '', state: data.state || data.jurisdiction || '',
            accountId: data.accountId || '',
            contactType: data.contactType || '', status: data.status || 'active',
            createdAt: data.createdAt || '', address: data.address || '',
            city: data.city || '', zip: data.zip || '', businessName: data.businessName || '',
            licenseType: data.licenseType || '', notes: data.notes || '',
            tags: data.tags || [], rawData: data,
            ...extractIntakeFields(data),
          });
        });
      }
      if (isPhoneSearch) {
        const snap = await getDocs(query(collection(db, 'contacts'), where('phone', '==', q)));
        snap.docs.forEach(d => {
          const data = d.data();
          if (!allResults.find(r => r.id === d.id)) {
            allResults.push({
              id: d.id, source: 'contacts', name: data.name || '', email: data.email || '',
              phone: data.phone || '', state: data.state || '', accountId: data.accountId || '',
              contactType: data.contactType || '', status: data.status || 'active',
              createdAt: data.createdAt || '', address: data.address || '',
              city: data.city || '', zip: data.zip || '', businessName: data.businessName || '',
              licenseType: data.licenseType || '', notes: data.notes || '',
              tags: data.tags || [], rawData: data,
              ...extractIntakeFields(data),
            });
          }
        });
      }
      if (!q.includes('@') && !isPhoneSearch) {
        const snap = await getDocs(collection(db, 'contacts'));
        snap.docs.forEach(d => {
          const data = d.data();
          const name = (data.name || '').toLowerCase();
          const email = (data.email || '').toLowerCase();
          const phone = (data.phone || '').replace(/\D/g, '');
          const notes = (data.notes || '').toLowerCase();
          
          if (name.includes(qLower) || email.includes(qLower) || 
              (qDigits && phone.includes(qDigits)) ||
              (isAccountId && notes.includes(q.toUpperCase()))) {
            if (!allResults.find(r => r.id === d.id)) {
              allResults.push({
                id: d.id, source: 'contacts', name: data.name || '', email: data.email || '',
                phone: data.phone || '', state: data.state || '', accountId: data.accountId || '',
                contactType: data.contactType || '', status: data.status || 'active',
                createdAt: data.createdAt || '', address: data.address || '',
                city: data.city || '', zip: data.zip || '', businessName: data.businessName || '',
                licenseType: data.licenseType || '', notes: data.notes || '',
                tags: data.tags || [], rawData: data,
                ...extractIntakeFields(data),
              });
            }
          }
        });
      }
    } catch (err) {
      console.error('Contacts search error:', err);
    }

    // 2. Search Firestore `users` collection
    try {
      const snap = await getDocs(collection(db, 'users'));
      snap.docs.forEach(d => {
        const data = d.data();
        const name = (data.fullName || data.displayName || data.name || '').toLowerCase();
        const email = (data.email || '').toLowerCase();
        const phone = (data.phone || data.textPhone || '').replace(/\D/g, '');
        
        if (name.includes(qLower) || email.includes(qLower) || 
            (q.includes('@') && email === qLower) ||
            (qDigits && phone.includes(qDigits))) {
          if (!allResults.find(r => r.source === 'users' && r.id === d.id)) {
            allResults.push({
              id: d.id, source: 'users',
              name: data.fullName || data.displayName || data.name || '',
              email: data.email || '', phone: data.phone || data.textPhone || '',
              state: data.state || data.jurisdiction || '',
              accountId: data.accountId || '',
              contactType: data.role || 'user',
              status: data.applicationStatus || 'active',
              createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || '',
              address: data.address || '', city: data.city || '', zip: data.zip || '',
              businessName: data.businessName || '',
              licenseType: data.licenseType || '', notes: '',
              tags: [], rawData: data,
              ...extractIntakeFields(data),
            });
          }
        }
      });
    } catch (err) {
      console.error('Users search error:', err);
    }

    // 3. Search Firestore `crm_deals` collection
    try {
      const snap = await getDocs(collection(db, 'crm_deals'));
      snap.docs.forEach(d => {
        const data = d.data();
        const name = (data.name || data.contactName || '').toLowerCase();
        const email = (data.email || '').toLowerCase();
        const phone = (data.phone || '').replace(/\D/g, '');
        
        if (name.includes(qLower) || email.includes(qLower) || 
            (q.includes('@') && email === qLower) ||
            (qDigits && phone.includes(qDigits))) {
          if (!allResults.find(r => r.source === 'crm_deals' && r.id === d.id)) {
            allResults.push({
              id: d.id, source: 'crm_deals',
              name: data.name || data.contactName || '',
              email: data.email || '', phone: data.phone || '',
              state: data.state || data.jurisdiction || '',
              accountId: data.accountId || '', contactType: data.type || 'lead',
              status: data.status || data.stage || 'lead',
              createdAt: data.createdAt || '',
              address: data.address || '', city: data.city || '', zip: data.zip || '',
              businessName: data.businessName || '',
              licenseType: data.licenseType || '', notes: data.notes || '',
              tags: data.tags || [], rawData: data,
              ...extractIntakeFields(data),
            });
          }
        }
      });
    } catch (err) {
      console.error('CRM deals search error:', err);
    }

    // 4. Search Turso `patients` table
    try {
      const tursoResult = await turso.execute('SELECT * FROM patients ORDER BY created_at DESC');
      tursoResult.rows.forEach((row: any) => {
        const name = (row.name || row.fullName || '').toLowerCase();
        const email = (row.email || '').toLowerCase();
        const phone = (row.phone || '').replace(/\D/g, '');
        
        if (name.includes(qLower) || email.includes(qLower) || 
            (q.includes('@') && email === qLower) ||
            (qDigits && phone.includes(qDigits))) {
          allResults.push({
            id: String(row.id), source: 'turso_patients',
            name: row.name || row.fullName || '',
            email: row.email || '', phone: row.phone || '',
            state: row.state || row.jurisdiction || '',
            accountId: '', contactType: 'patient',
            status: row.status || 'Pending',
            createdAt: row.created_at || '',
            rawData: row,
          });
        }
      });
    } catch (err) {
      console.error('Turso patients search error:', err);
    }

    // 5. Search Turso `audit_logs` for phone intake records
    try {
      const tursoResult = await turso.execute(
        "SELECT * FROM audit_logs WHERE action IN ('PHONE_INTAKE_ACCOUNT_CREATE', 'PHONE_INTAKE_APPLICATION') ORDER BY rowid DESC LIMIT 500"
      );
      tursoResult.rows.forEach((row: any) => {
        try {
          const data = JSON.parse(row.data || '{}');
          const name = (data.name || data.applicant || '').toLowerCase();
          const email = (data.email || '').toLowerCase();
          const phone = (data.phone || '').replace(/\D/g, '');
          const accId = (data.accountId || '').toUpperCase();
          
          if (name.includes(qLower) || email.includes(qLower) || 
              (q.includes('@') && email === qLower) ||
              (qDigits && phone.includes(qDigits)) ||
              (isAccountId && accId === q.toUpperCase())) {
            allResults.push({
              id: String(row.id), source: 'turso_audit',
              name: data.name || data.applicant || '',
              email: data.email || '', phone: data.phone || '',
              state: data.state || '',
              accountId: data.accountId || '',
              contactType: data.type || data.intakeType || 'intake',
              status: data.status || 'Submitted',
              createdAt: row.created_at || '',
              notes: data.callerNotes || '',
              rawData: data,
              conditions: data.conditions || '',
              appType: data.appType || data.intakeType || '',
            });
          }
        } catch {}
      });
    } catch (err) {
      console.error('Turso audit search error:', err);
    }

    setResults(deduplicateResults(allResults));
    setIsSearching(false);
  }, [searchQuery]);

  const handleSave = async (result: SearchResult) => {
    setSaving(true);
    try {
      // Build the save payload from editData
      const payload: any = { updatedAt: new Date().toISOString() };
      
      // Map all standard fields
      if (editData.name !== undefined) payload.name = editData.name;
      if (editData.email !== undefined) payload.email = editData.email;
      if (editData.phone !== undefined) payload.phone = editData.phone;
      if (editData.state !== undefined) payload.state = editData.state;
      if (editData.address !== undefined) payload.address = editData.address;
      if (editData.city !== undefined) payload.city = editData.city;
      if (editData.zip !== undefined) payload.zip = editData.zip;
      if (editData.businessName !== undefined) payload.businessName = editData.businessName;
      if (editData.notes !== undefined) payload.notes = editData.notes;
      if (editData.licenseType !== undefined) payload.licenseType = editData.licenseType;
      if (editData.status !== undefined) payload.status = editData.status;
      
      // Extended intake fields
      if (editData.dob !== undefined) payload.dob = editData.dob;
      if (editData.ssn !== undefined) payload.ssn = editData.ssn;
      if (editData.conditions !== undefined) payload.conditions = editData.conditions;
      if (editData.allergies !== undefined) payload.allergies = editData.allergies;
      if (editData.insurance !== undefined) payload.insuranceName = editData.insurance;
      if (editData.appointmentType !== undefined) payload.appointmentType = editData.appointmentType;
      if (editData.appType !== undefined) payload.appType = editData.appType;
      if (editData.pcpInfo !== undefined) payload.pcpInfo = editData.pcpInfo;
      if (editData.portalAccount !== undefined) payload.hasPortalAccount = editData.portalAccount;

      if (result.source === 'contacts') {
        await updateDoc(doc(db, 'contacts', result.id), payload);
      } else if (result.source === 'users') {
        if (payload.name) { payload.fullName = payload.name; delete payload.name; }
        await updateDoc(doc(db, 'users', result.id), payload);
      } else if (result.source === 'crm_deals') {
        if (payload.name) { payload.contactName = payload.name; }
        await updateDoc(doc(db, 'crm_deals', result.id), payload);
      }

      // Update local state
      setResults(prev => prev.map(r => r.id === result.id ? { ...r, ...editData } : r));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes: ' + (err as any)?.message);
    }
    setSaving(false);
  };

  const handlePostPayment = async (result: SearchResult) => {
    if (!paymentForm.amount) return alert('Please enter an amount.');
    setPostingPayment(true);
    try {
      const clientName = result.name || result.businessName || 'Unknown Client';
      const cleanAmount = paymentForm.amount.replace(/[^0-9.]/g, '');
      const formatted = '$' + parseFloat(cleanAmount).toFixed(2);
      const entryName = `${clientName} — ${paymentForm.type}`;

      await turso.execute({
        sql: "INSERT INTO founder_ledger (origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [
          entryName,
          `${paymentForm.type} (${paymentForm.method})`,
          formatted,
          formatted,
          'Settled',
          'bg-emerald-600',
          new Date(paymentForm.date).toISOString()
        ]
      });

      // Audit log
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: [
          'log-' + Math.random().toString(36).substr(2, 9),
          'PAYMENT_POSTED_ACCOUNT_LOOKUP',
          'OPS_Agent',
          JSON.stringify({
            client: clientName,
            accountId: result.accountId || '',
            amount: formatted,
            type: paymentForm.type,
            method: paymentForm.method,
            notes: paymentForm.notes,
            date: paymentForm.date,
            sourceRecordId: result.id,
            sourceCollection: result.source,
          })
        ]
      });

      // Save payment to the contact's Firestore doc for payment history
      if (result.source === 'contacts' || result.source === 'crm_deals') {
        try {
          const colName = result.source === 'contacts' ? 'contacts' : 'crm_deals';
          const contactRef = doc(db, colName, result.id);
          const paymentRecord = {
            amount: formatted,
            type: paymentForm.type,
            method: paymentForm.method,
            notes: paymentForm.notes,
            date: paymentForm.date,
            postedAt: new Date().toISOString(),
            postedBy: 'OPS_Agent',
          };
          // Use arrayUnion to append to payments array
          const { arrayUnion } = await import('firebase/firestore');
          await updateDoc(contactRef, {
            payments: arrayUnion(paymentRecord),
            lastPaymentDate: paymentForm.date,
            lastPaymentAmount: formatted,
          });
        } catch (e) {
          console.warn('Could not save payment to contact record:', e);
        }
      }

      setPaymentPosted(true);
    } catch (err: any) {
      console.error(err);
      alert('Error posting payment: ' + err.message);
    }
    setPostingPayment(false);
  };

  const sourceLabel = (s: string) => {
    switch (s) {
      case 'contacts': return 'CRM Contact';
      case 'users': return 'Platform User';
      case 'crm_deals': return 'Pipeline Deal';
      case 'turso_patients': return 'Legacy Patient';
      case 'turso_audit': return 'Phone Intake';
      default: return s;
    }
  };

  const sourceColor = (s: string) => {
    switch (s) {
      case 'contacts': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'users': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'crm_deals': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'turso_patients': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'turso_audit': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // EditField and EditSelect are defined OUTSIDE the component (above) to prevent focus loss on re-render

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Search size={80} /></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
              <Search size={20} />
            </div>
            Account Lookup
          </h2>
          <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mt-1">Search by Account ID, Phone, Name, or Email</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, or Account ID (ACC-XXXXXXXX)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-wider transition-all disabled:opacity-40 flex items-center gap-2 shadow-md"
          >
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </form>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Searches:</span>
          {['Firestore Contacts', 'Platform Users', 'CRM Deals', 'Turso Patients', 'Phone Intake Logs'].map(s => (
            <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Results */}
      {isSearching && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-indigo-500 mx-auto" />
            <p className="text-sm font-bold text-slate-500">Searching all data sources...</p>
          </div>
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <AlertTriangle size={32} className="text-amber-400 mx-auto" />
            <p className="text-lg font-bold text-slate-700">No results found</p>
            <p className="text-sm text-slate-500">Try a different name, email, phone, or Account ID.</p>
          </div>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>

          {results.map((r) => {
            const isExpanded = expandedId === r.id;
            const isEditing = editingId === r.id;
            const showPayment = paymentFormFor === r.id;

            return (
              <div key={`${r.source}-${r.id}`} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                {/* Summary Row */}
                <div
                  onClick={() => { setExpandedId(isExpanded ? null : r.id); if (isEditing) { setEditingId(null); setEditData({}); } }}
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                      {(r.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{r.name || 'Unknown'}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {r.email && <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10} /> {r.email}</span>}
                        {r.phone && <span className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10} /> {r.phone}</span>}
                        {r.state && <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} /> {r.state}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {r.accountId && (
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                        {r.accountId}
                      </span>
                    )}
                    <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-full border", sourceColor(r.source))}>
                      {sourceLabel(r.source)}
                    </span>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {!isEditing ? (
                      <>
                        {/* Core Info */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { l: 'Full Name', v: r.name, icon: User },
                            { l: 'Email', v: r.email, icon: Mail },
                            { l: 'Phone', v: r.phone, icon: Phone },
                            { l: 'State', v: r.state, icon: MapPin },
                            { l: 'Account ID', v: r.accountId || '—', icon: Hash },
                            { l: 'Type', v: r.contactType, icon: Tag },
                            { l: 'Status', v: r.status, icon: FileText },
                            { l: 'Created', v: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—', icon: Calendar },
                            { l: 'Business', v: r.businessName || '—', icon: Building2 },
                          ].map((f, i) => (
                            <div key={i}>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">
                                <f.icon size={10} /> {f.l}
                              </p>
                              <p className="text-sm font-medium text-slate-700">{f.v || '—'}</p>
                            </div>
                          ))}
                        </div>

                        {/* Intake-specific fields (if available) */}
                        {(r.dob || r.conditions || r.appType || r.insurance || r.rawData?.conditions || r.rawData?.appType) && (
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                              <HeartPulse size={12} /> Medical / Intake Details
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                { l: 'DOB', v: r.dob || r.rawData?.dob || '—' },
                                { l: 'App Type', v: r.appType || r.rawData?.appType || '—' },
                                { l: 'Conditions', v: r.conditions || r.rawData?.conditions || '—' },
                                { l: 'Allergies', v: r.allergies || r.rawData?.allergies || '—' },
                                { l: 'Insurance', v: r.insurance || r.rawData?.insuranceName || '—' },
                                { l: 'Appointment', v: r.appointmentType || r.rawData?.appointmentType || '—' },
                                { l: 'PCP Info', v: r.pcpInfo || r.rawData?.pcpInfo || '—' },
                                { l: 'Portal Account', v: r.portalAccount || r.rawData?.hasPortalAccount || '—' },
                                { l: 'License Type', v: r.licenseType || '—' },
                              ].map((f, i) => (
                                <div key={i}>
                                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">{f.l}</p>
                                  <p className="text-sm font-medium text-slate-700">{f.v}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {r.address && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
                            <p className="text-sm text-slate-700">{[r.address, r.city, r.state, r.zip].filter(Boolean).join(', ')}</p>
                          </div>
                        )}
                        {r.notes && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Notes</p>
                            <p className="text-sm text-amber-900 whitespace-pre-wrap">{r.notes}</p>
                          </div>
                        )}
                        {r.tags && r.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag size={12} className="text-slate-400" />
                            {r.tags.map((t, i) => (
                              <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                            ))}
                          </div>
                        )}

                        {/* Payment History */}
                        {r.rawData?.payments && r.rawData.payments.length > 0 && (
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                              <DollarSign size={12} /> Payment History ({r.rawData.payments.length})
                            </p>
                            <div className="space-y-2">
                              {r.rawData.payments.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between bg-white rounded-lg p-2.5 border border-emerald-100">
                                  <div>
                                    <p className="text-xs font-bold text-slate-800">{p.type} — <span className="text-emerald-600">{p.amount}</span></p>
                                    <p className="text-[10px] text-slate-500">{p.method} • {p.date ? new Date(p.date).toLocaleDateString() : '—'}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Settled</span>
                                    {p.postedAt && <p className="text-[9px] text-slate-400 mt-0.5">Posted {new Date(p.postedAt).toLocaleDateString()}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-200">
                          {(r.source === 'contacts' || r.source === 'users' || r.source === 'crm_deals') && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingId(r.id); setEditData({}); }}
                              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                            >
                              <Edit2 size={14} /> Edit Record
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (showPayment) {
                                setPaymentFormFor(null);
                              } else {
                                setPaymentFormFor(r.id);
                                setPaymentPosted(false);
                                setPaymentForm({ amount: '', type: 'Processing Fee', method: 'Chime', notes: '', date: new Date().toISOString().split('T')[0] });
                              }
                            }}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                          >
                            <DollarSign size={14} /> {showPayment ? 'Hide Payment' : 'Post Payment'}
                          </button>
                          {(r.source === 'turso_patients' || r.source === 'turso_audit') && (
                            <span className="text-xs text-slate-400 italic">Legacy record — contact info is read-only. Payment can still be posted.</span>
                          )}
                        </div>

                        {/* Inline Payment Form */}
                        {showPayment && (
                          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CreditCard size={16} className="text-emerald-600" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-800">Post Payment for {r.name}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Posts directly to Accounting Ledger</p>
                              </div>
                            </div>

                            {paymentPosted ? (
                              <div className="flex flex-col items-center justify-center py-6 space-y-3 animate-in fade-in zoom-in duration-300">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <CircleCheck size={28} className="text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-black text-slate-800">Payment Posted!</h3>
                                <p className="text-sm text-slate-500 font-medium">Entry added to Accounting Ledger.</p>
                                <button onClick={(e) => { e.stopPropagation(); setPaymentFormFor(null); setPaymentPosted(false); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Dismiss</button>
                              </div>
                            ) : (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount *</label>
                                    <div className="relative">
                                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                      <input type="text" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="102.50" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Date Received</label>
                                    <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Type</label>
                                    <select value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                                      {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                                    <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                                      {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Notes (optional)</label>
                                  <textarea value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm resize-none" />
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handlePostPayment(r); }}
                                  disabled={postingPayment}
                                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                                >
                                  {postingPayment ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
                                  Post Payment to Ledger
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      /* ====== EDIT MODE ====== */
                      <div className="space-y-4">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-2">
                          <Edit2 size={14} className="text-indigo-600" />
                          <span className="text-xs font-bold text-indigo-700">Editing — changes save directly to Firestore</span>
                        </div>

                        {/* Core Contact Info */}
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><User size={10} /> Contact Information</p>
                          <div className="grid grid-cols-2 gap-4">
                            <EditField label="Full Name" field="name" value={r.name} editData={editData} setEditData={setEditData} />
                            <EditField label="Email" field="email" value={r.email} editData={editData} setEditData={setEditData} />
                            <EditField label="Phone" field="phone" value={r.phone} editData={editData} setEditData={setEditData} />
                            <EditField label="State" field="state" value={r.state} editData={editData} setEditData={setEditData} />
                            <EditField label="Address" field="address" value={r.address || ''} editData={editData} setEditData={setEditData} />
                            <EditField label="City" field="city" value={r.city || ''} editData={editData} setEditData={setEditData} />
                            <EditField label="ZIP" field="zip" value={r.zip || ''} editData={editData} setEditData={setEditData} />
                            <EditField label="Business Name" field="businessName" value={r.businessName || ''} editData={editData} setEditData={setEditData} />
                          </div>
                        </div>

                        {/* Medical / Intake Info */}
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1"><HeartPulse size={10} /> Medical / Intake Details</p>
                          <div className="grid grid-cols-2 gap-4">
                            <EditField label="Date of Birth" field="dob" value={r.dob || r.rawData?.dob || ''} type="date" editData={editData} setEditData={setEditData} />
                            <EditField label="SSN (Encrypted)" field="ssn" value={r.ssn || r.rawData?.ssn || ''} editData={editData} setEditData={setEditData} />
                            <EditField label="Conditions" field="conditions" value={r.conditions || r.rawData?.conditions || ''} editData={editData} setEditData={setEditData} />
                            <EditField label="Allergies" field="allergies" value={r.allergies || r.rawData?.allergies || ''} editData={editData} setEditData={setEditData} />
                            <EditField label="Insurance Name" field="insurance" value={r.insurance || r.rawData?.insuranceName || ''} editData={editData} setEditData={setEditData} />
                            <EditField label="PCP Info" field="pcpInfo" value={r.pcpInfo || r.rawData?.pcpInfo || ''} editData={editData} setEditData={setEditData} />
                            <EditSelect label="Appointment Type" field="appointmentType" value={r.appointmentType || r.rawData?.appointmentType || ''} options={['Phone', 'Video', 'In-Person']} editData={editData} setEditData={setEditData} />
                            <EditSelect label="Application Type" field="appType" value={r.appType || r.rawData?.appType || ''} options={['New MMJ Card', 'Renewal', 'New Application', 'Transfer of Ownership']} editData={editData} setEditData={setEditData} />
                            <EditSelect label="Portal Account" field="portalAccount" value={r.portalAccount || r.rawData?.hasPortalAccount || ''} options={['Yes', 'No']} editData={editData} setEditData={setEditData} />
                            <EditField label="License Type" field="licenseType" value={r.licenseType || ''} editData={editData} setEditData={setEditData} />
                          </div>
                        </div>

                        {/* Status */}
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Shield size={10} /> Status & Classification</p>
                          <div className="grid grid-cols-2 gap-4">
                            <EditSelect label="Account Status" field="status" value={r.status} options={['active', 'Pending Review', 'State Approved', 'Doctor Recommendation Approved', 'State Mailed', 'State Rejected', 'Do Not Call', 'Incomplete']} editData={editData} setEditData={setEditData} />
                            <EditField label="Account ID" field="accountId" value={r.accountId || ''} editData={editData} setEditData={setEditData} />
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="border-t border-slate-200 pt-4">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Notes</label>
                          <textarea
                            value={editData.notes !== undefined ? editData.notes : (r.notes || '')}
                            onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                          />
                        </div>

                        {/* Save / Cancel */}
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSave(r); }}
                            disabled={saving}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                          >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Changes
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingId(null); setEditData({}); }}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
