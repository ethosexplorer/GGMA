import React, { useState, useCallback } from 'react';
import { Search, User, Phone, Mail, MapPin, Building2, Tag, Calendar, Edit2, Save, X, Loader2, AlertTriangle, FileText, Hash, ChevronDown, ChevronUp } from 'lucide-react';
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
}

export const AccountLookupTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SearchResult>>({});
  const [saving, setSaving] = useState(false);

  const deduplicateResults = (items: SearchResult[]): SearchResult[] => {
    const map = new Map<string, SearchResult>();
    for (const item of items) {
      // Build a key from email or phone or name
      const email = (item.email || '').toLowerCase().trim();
      const phone = (item.phone || '').replace(/\D/g, '');
      const name = (item.name || '').toLowerCase().trim();
      
      const key = email || phone || name || item.id;
      
      if (map.has(key)) {
        // Merge — prefer contacts/users over audit logs
        const existing = map.get(key)!;
        const priority = ['users', 'contacts', 'crm_deals', 'turso_patients', 'turso_audit'];
        if (priority.indexOf(item.source) < priority.indexOf(existing.source)) {
          map.set(key, { ...existing, ...item, notes: item.notes || existing.notes, tags: [...(existing.tags || []), ...(item.tags || [])] });
        } else {
          // Fill in blanks from lower-priority source
          map.set(key, {
            ...existing,
            phone: existing.phone || item.phone,
            address: existing.address || item.address,
            city: existing.city || item.city,
            state: existing.state || item.state,
            accountId: existing.accountId || item.accountId,
            notes: existing.notes || item.notes,
          });
        }
      } else {
        map.set(key, item);
      }
    }
    return Array.from(map.values());
  };

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearching(true);
    setHasSearched(true);
    setExpandedId(null);
    setEditingId(null);

    const allResults: SearchResult[] = [];
    const qLower = q.toLowerCase();
    const qDigits = q.replace(/\D/g, '');
    const isAccountId = q.toUpperCase().startsWith('ACC-');
    const isPhoneSearch = qDigits.length >= 7;

    // 1. Search Firestore `contacts` collection
    try {
      // By email
      if (q.includes('@')) {
        const snap = await getDocs(query(collection(db, 'contacts'), where('email', '==', qLower)));
        snap.docs.forEach(d => {
          const data = d.data();
          allResults.push({
            id: d.id,
            source: 'contacts',
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            state: data.state || data.jurisdiction || '',
            accountId: '',
            contactType: data.contactType || '',
            status: data.status || 'active',
            createdAt: data.createdAt || '',
            address: data.address || '',
            city: data.city || '',
            zip: data.zip || '',
            businessName: data.businessName || '',
            licenseType: data.licenseType || '',
            notes: data.notes || '',
            tags: data.tags || [],
            rawData: data,
          });
        });
      }

      // By phone (if looks like phone number)
      if (isPhoneSearch) {
        const snap = await getDocs(query(collection(db, 'contacts'), where('phone', '==', q)));
        snap.docs.forEach(d => {
          const data = d.data();
          if (!allResults.find(r => r.id === d.id)) {
            allResults.push({
              id: d.id, source: 'contacts', name: data.name || '', email: data.email || '',
              phone: data.phone || '', state: data.state || '', accountId: '',
              contactType: data.contactType || '', status: data.status || 'active',
              createdAt: data.createdAt || '', address: data.address || '',
              city: data.city || '', zip: data.zip || '', businessName: data.businessName || '',
              licenseType: data.licenseType || '', notes: data.notes || '',
              tags: data.tags || [], rawData: data,
            });
          }
        });
      }

      // Broad search — load all contacts and filter client-side by name (Firestore doesn't support LIKE)
      // Only if not email/phone search
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
                phone: data.phone || '', state: data.state || '', accountId: '',
                contactType: data.contactType || '', status: data.status || 'active',
                createdAt: data.createdAt || '', address: data.address || '',
                city: data.city || '', zip: data.zip || '', businessName: data.businessName || '',
                licenseType: data.licenseType || '', notes: data.notes || '',
                tags: data.tags || [], rawData: data,
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
              accountId: '', contactType: data.type || 'lead',
              status: data.status || data.stage || 'lead',
              createdAt: data.createdAt || '',
              address: data.address || '', city: data.city || '', zip: data.zip || '',
              businessName: data.businessName || '',
              licenseType: data.licenseType || '', notes: data.notes || '',
              tags: data.tags || [], rawData: data,
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
      if (result.source === 'contacts') {
        await updateDoc(doc(db, 'contacts', result.id), {
          name: editData.name ?? result.name,
          email: editData.email ?? result.email,
          phone: editData.phone ?? result.phone,
          state: editData.state ?? result.state,
          address: editData.address ?? result.address,
          city: editData.city ?? result.city,
          zip: editData.zip ?? result.zip,
          businessName: editData.businessName ?? result.businessName,
          notes: editData.notes ?? result.notes,
          updatedAt: new Date().toISOString(),
        });
      } else if (result.source === 'users') {
        await updateDoc(doc(db, 'users', result.id), {
          fullName: editData.name ?? result.name,
          email: editData.email ?? result.email,
          phone: editData.phone ?? result.phone,
          state: editData.state ?? result.state,
          updatedAt: new Date().toISOString(),
        });
      } else if (result.source === 'crm_deals') {
        await updateDoc(doc(db, 'crm_deals', result.id), {
          name: editData.name ?? result.name,
          contactName: editData.name ?? result.name,
          email: editData.email ?? result.email,
          phone: editData.phone ?? result.phone,
          state: editData.state ?? result.state,
          notes: editData.notes ?? result.notes,
          updatedAt: new Date().toISOString(),
        });
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

  const EditField = ({ label, field, value }: { label: string; field: keyof SearchResult; value: string }) => (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">{label}</label>
      <input
        value={editData[field] !== undefined ? String(editData[field]) : value}
        onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
      />
    </div>
  );

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
                        {(r.source === 'contacts' || r.source === 'users' || r.source === 'crm_deals') && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingId(r.id); setEditData({}); }}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                          >
                            <Edit2 size={14} /> Edit Record
                          </button>
                        )}
                        {(r.source === 'turso_patients' || r.source === 'turso_audit') && (
                          <p className="text-xs text-slate-400 italic">This record is stored in the legacy database (read-only from this view).</p>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-2">
                          <Edit2 size={14} className="text-indigo-600" />
                          <span className="text-xs font-bold text-indigo-700">Editing — changes save directly to Firestore</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <EditField label="Full Name" field="name" value={r.name} />
                          <EditField label="Email" field="email" value={r.email} />
                          <EditField label="Phone" field="phone" value={r.phone} />
                          <EditField label="State" field="state" value={r.state} />
                          <EditField label="Address" field="address" value={r.address || ''} />
                          <EditField label="City" field="city" value={r.city || ''} />
                          <EditField label="ZIP" field="zip" value={r.zip || ''} />
                          <EditField label="Business Name" field="businessName" value={r.businessName || ''} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Notes</label>
                          <textarea
                            value={editData.notes !== undefined ? editData.notes : (r.notes || '')}
                            onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-3">
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
