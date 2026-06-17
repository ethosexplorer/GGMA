import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { turso } from '../../lib/turso';
import { cn } from '../../lib/utils';
import { Clock, CheckCircle, XCircle, Archive, Search, Filter, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

type AppStatus = 'pending_review' | 'approved' | 'denied' | 'suspended';
type ViewMode = 'pending' | 'denied_archive';

interface Application {
  id: string;
  name: string;
  email: string;
  type: string;
  region: string;
  status: AppStatus;
  createdAt: Date | null;
  deniedAt?: Date | null;
  deniedReason?: string;
  source: 'firestore' | 'turso_patient' | 'turso_business';
}

export const ApprovalsDenialsTab = ({
  setSelectedApplicant
}: {
  setSelectedApplicant: (app: any) => void;
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [deniedArchive, setDeniedArchive] = useState<Application[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('pending');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedToday, setApprovedToday] = useState(0);
  const [deniedCount, setDeniedCount] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch from both Firestore users AND Turso patients/businesses
  useEffect(() => {
    let unsubFirestore: () => void;

    const fetchAll = async () => {
      setLoading(true);
      const allApps: Application[] = [];
      const allDenied: Application[] = [];
      let approved24h = 0;

      // 1. Firestore users (real-time listener)
      try {
        const usersRef = collection(db, 'users');
        unsubFirestore = onSnapshot(usersRef, (snap) => {
          const firestoreApps: Application[] = [];
          const firestoreDenied: Application[] = [];
          let fsApproved24h = 0;
          const now = new Date();
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          snap.docs.forEach(d => {
            const data = d.data();
            const status = data.accountStatus || data.status || 'active';
            const createdAt = data.createdAt?.toDate?.() || null;
            const approvedAt = data.approvedAt?.toDate?.() || null;

            // Count approved in last 24h
            if (status === 'approved' && approvedAt && approvedAt > yesterday) {
              fsApproved24h++;
            }

            if (status === 'pending' || status === 'pending_review') {
              firestoreApps.push({
                id: d.id,
                name: data.displayName || data.name || data.email?.split('@')[0] || 'Unknown',
                email: data.email || '',
                type: mapRoleToType(data.role),
                region: data.state || data.city || 'Oklahoma',
                status: 'pending_review',
                createdAt,
                source: 'firestore',
              });
            } else if (status === 'denied') {
              firestoreDenied.push({
                id: d.id,
                name: data.displayName || data.name || data.email?.split('@')[0] || 'Unknown',
                email: data.email || '',
                type: mapRoleToType(data.role),
                region: data.state || data.city || 'Oklahoma',
                status: 'denied',
                createdAt,
                deniedAt: data.deniedAt?.toDate?.() || null,
                deniedReason: data.deniedReason || '',
                source: 'firestore',
              });
            }
          });

          // Merge with Turso results
          setApplications(prev => {
            const tursoApps = prev.filter(a => a.source !== 'firestore');
            return [...firestoreApps, ...tursoApps];
          });
          setDeniedArchive(prev => {
            const tursoDenied = prev.filter(a => a.source !== 'firestore');
            return [...firestoreDenied, ...tursoDenied];
          });
          setApprovedToday(fsApproved24h);
        });
      } catch (err) {
        console.error('Firestore fetch error:', err);
      }

      // 2. Turso patients table
      try {
        const pendingPatients = await turso.execute("SELECT * FROM patients WHERE status = 'pending' ORDER BY created_at DESC");
        pendingPatients.rows.forEach((r: any) => {
          allApps.push({
            id: `turso-patient-${r.id}`,
            name: String(r.name || 'Unknown Patient'),
            email: String(r.email || ''),
            type: 'Patient Card (Adult)',
            region: String(r.state || 'Oklahoma'),
            status: 'pending_review',
            createdAt: r.created_at ? new Date(String(r.created_at)) : null,
            source: 'turso_patient',
          });
        });

        const deniedPatients = await turso.execute("SELECT * FROM patients WHERE status = 'denied' ORDER BY created_at DESC");
        deniedPatients.rows.forEach((r: any) => {
          allDenied.push({
            id: `turso-patient-${r.id}`,
            name: String(r.name || 'Unknown Patient'),
            email: String(r.email || ''),
            type: 'Patient Card (Adult)',
            region: String(r.state || 'Oklahoma'),
            status: 'denied',
            createdAt: r.created_at ? new Date(String(r.created_at)) : null,
            source: 'turso_patient',
          });
        });
      } catch (err) {
        console.error('Turso patients fetch error:', err);
      }

      // 3. Turso businesses table
      try {
        const pendingBiz = await turso.execute("SELECT * FROM businesses WHERE status = 'pending' ORDER BY created_at DESC");
        pendingBiz.rows.forEach((r: any) => {
          allApps.push({
            id: `turso-biz-${r.id}`,
            name: String(r.business_name || 'Unknown Business'),
            email: '',
            type: String(r.license_type || 'Business License'),
            region: String(r.state || 'Oklahoma'),
            status: 'pending_review',
            createdAt: r.created_at ? new Date(String(r.created_at)) : null,
            source: 'turso_business',
          });
        });

        const deniedBiz = await turso.execute("SELECT * FROM businesses WHERE status = 'denied' ORDER BY created_at DESC");
        deniedBiz.rows.forEach((r: any) => {
          allDenied.push({
            id: `turso-biz-${r.id}`,
            name: String(r.business_name || 'Unknown Business'),
            email: '',
            type: String(r.license_type || 'Business License'),
            region: String(r.state || 'Oklahoma'),
            status: 'denied',
            createdAt: r.created_at ? new Date(String(r.created_at)) : null,
            source: 'turso_business',
          });
        });
      } catch (err) {
        console.error('Turso businesses fetch error:', err);
      }

      // Count totals from Turso
      try {
        const pCount = await turso.execute("SELECT COUNT(*) as c FROM patients WHERE status = 'pending'");
        const bCount = await turso.execute("SELECT COUNT(*) as c FROM businesses WHERE status = 'pending'");
        const tursoTotal = Number(pCount.rows[0]?.c || 0) + Number(bCount.rows[0]?.c || 0);
        setPendingCount(prev => prev + tursoTotal);
      } catch (err) {}

      setApplications(prev => [...prev, ...allApps]);
      setDeniedArchive(prev => [...prev, ...allDenied]);
      setLoading(false);
    };

    fetchAll();
    return () => { if (unsubFirestore) unsubFirestore(); };
  }, []);

  // Update pending count whenever applications change
  useEffect(() => {
    setPendingCount(applications.filter(a => a.status === 'pending_review').length);
  }, [applications]);

  // Update denied count whenever archive changes
  useEffect(() => {
    setDeniedCount(deniedArchive.length);
  }, [deniedArchive]);

  const handleApprove = async (app: Application) => {
    setProcessingId(app.id);
    try {
      if (app.source === 'firestore') {
        await updateDoc(doc(db, 'users', app.id), {
          accountStatus: 'approved',
          status: 'approved',
          approvedAt: Timestamp.now(),
        });
      } else if (app.source === 'turso_patient') {
        const tursoId = app.id.replace('turso-patient-', '');
        await turso.execute({ sql: "UPDATE patients SET status = 'approved' WHERE id = ?", args: [tursoId] });
      } else if (app.source === 'turso_business') {
        const tursoId = app.id.replace('turso-biz-', '');
        await turso.execute({ sql: "UPDATE businesses SET status = 'approved' WHERE id = ?", args: [tursoId] });
      }

      // Log to audit
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), 'LICENSE_APPROVE', 'FOUNDER', JSON.stringify({ applicant: app.name, type: app.type })]
      });

      // Remove from pending list
      setApplications(prev => prev.filter(a => a.id !== app.id));
      setApprovedToday(prev => prev + 1);
    } catch (err) {
      console.error('Approve error:', err);
      alert('Error approving application. Check console.');
    }
    setProcessingId(null);
  };

  const handleDeny = async (app: Application) => {
    const reason = prompt('Denial reason (required for compliance record):');
    if (!reason) return;

    setProcessingId(app.id);
    try {
      if (app.source === 'firestore') {
        await updateDoc(doc(db, 'users', app.id), {
          accountStatus: 'denied',
          status: 'denied',
          deniedAt: Timestamp.now(),
          deniedReason: reason,
        });
      } else if (app.source === 'turso_patient') {
        const tursoId = app.id.replace('turso-patient-', '');
        await turso.execute({ sql: "UPDATE patients SET status = 'denied' WHERE id = ?", args: [tursoId] });
      } else if (app.source === 'turso_business') {
        const tursoId = app.id.replace('turso-biz-', '');
        await turso.execute({ sql: "UPDATE businesses SET status = 'denied' WHERE id = ?", args: [tursoId] });
      }

      // Log to audit
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), 'LICENSE_DENY', 'FOUNDER', JSON.stringify({ applicant: app.name, type: app.type, reason })]
      });

      // Move to denied archive
      const deniedApp: Application = { ...app, status: 'denied', deniedAt: new Date(), deniedReason: reason };
      setApplications(prev => prev.filter(a => a.id !== app.id));
      setDeniedArchive(prev => [deniedApp, ...prev]);
    } catch (err) {
      console.error('Deny error:', err);
      alert('Error denying application. Check console.');
    }
    setProcessingId(null);
  };

  const handleRestore = async (app: Application) => {
    setProcessingId(app.id);
    try {
      if (app.source === 'firestore') {
        await updateDoc(doc(db, 'users', app.id), {
          accountStatus: 'pending_review',
          status: 'pending',
          deniedAt: null,
          deniedReason: null,
        });
      } else if (app.source === 'turso_patient') {
        const tursoId = app.id.replace('turso-patient-', '');
        await turso.execute({ sql: "UPDATE patients SET status = 'pending' WHERE id = ?", args: [tursoId] });
      } else if (app.source === 'turso_business') {
        const tursoId = app.id.replace('turso-biz-', '');
        await turso.execute({ sql: "UPDATE businesses SET status = 'pending' WHERE id = ?", args: [tursoId] });
      }

      // Log to audit
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), 'LICENSE_RESTORE', 'FOUNDER', JSON.stringify({ applicant: app.name, type: app.type })]
      });

      // Move back to pending
      const restoredApp: Application = { ...app, status: 'pending_review', deniedAt: null, deniedReason: undefined };
      setDeniedArchive(prev => prev.filter(a => a.id !== app.id));
      setApplications(prev => [restoredApp, ...prev]);
    } catch (err) {
      console.error('Restore error:', err);
    }
    setProcessingId(null);
  };

  const filteredApps = (viewMode === 'pending' ? applications : deniedArchive).filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-slate-800" data-action-bound>
      {/* Header with live counts */}
      <div className="bg-white border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 rounded-[2rem] shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Authorization Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Processing Pipeline • State-Level Final Authority</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center min-w-[100px]">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Pending Review</p>
            <p className="text-2xl font-black text-slate-800">{loading ? '—' : pendingCount}</p>
          </div>
          <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[100px]">
            <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Approved (24h)</p>
            <p className="text-2xl font-black text-slate-800">{loading ? '—' : approvedToday}</p>
          </div>
          <div className="px-6 py-3 bg-red-50 border border-red-200 rounded-2xl text-center min-w-[100px]">
            <p className="text-[10px] font-black text-red-600 uppercase mb-1">Denied Archive</p>
            <p className="text-2xl font-black text-slate-800">{loading ? '—' : deniedCount}</p>
          </div>
        </div>
      </div>

      {/* View Toggle + Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('pending')}
            className={cn("px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              viewMode === 'pending' ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            <Clock size={14} /> Pending Queue ({pendingCount})
          </button>
          <button
            onClick={() => setViewMode('denied_archive')}
            className={cn("px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              viewMode === 'denied_archive' ? "bg-red-900 text-white shadow-lg" : "bg-red-50 text-red-500 hover:bg-red-100"
            )}
          >
            <Archive size={14} /> Denied Archive ({deniedCount})
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search applicants..."
            className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 ring-blue-500/20 outline-none w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Applicant</th>
              <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
              <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Region</th>
              <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Submitted</th>
              <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Command</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex items-center justify-center gap-3 text-slate-400">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-bold">Loading applications...</span>
                  </div>
                </td>
              </tr>
            ) : filteredApps.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    {viewMode === 'pending' ? (
                      <>
                        <CheckCircle size={32} className="text-emerald-400" />
                        <p className="font-bold text-sm text-slate-600">No pending applications</p>
                        <p className="text-xs">All applications have been processed. New submissions will appear here automatically.</p>
                      </>
                    ) : (
                      <>
                        <Archive size={32} className="text-slate-300" />
                        <p className="font-bold text-sm text-slate-600">No denied applications</p>
                        <p className="text-xs">Denied applications will be archived here for review and potential restoration.</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <button onClick={() => setSelectedApplicant(app)} className="font-black text-indigo-600 hover:text-indigo-800 hover:underline text-left">{app.name}</button>
                  <p className="text-[10px] font-bold text-slate-400 italic mt-1">{app.email}</p>
                </td>
                <td className="px-8 py-6 text-xs font-bold text-slate-600">{app.type}</td>
                <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase">{app.region}</td>
                <td className="px-8 py-6 text-[10px] font-bold text-slate-400">
                  {app.createdAt ? app.createdAt.toLocaleDateString() : '—'}
                  {viewMode === 'denied_archive' && app.deniedReason && (
                    <p className="text-red-500 mt-1 font-bold">Reason: {app.deniedReason}</p>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    {viewMode === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(app)}
                          disabled={processingId === app.id}
                          className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl hover:bg-emerald-500 uppercase tracking-widest disabled:opacity-50 transition-all"
                        >
                          {processingId === app.id ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDeny(app)}
                          disabled={processingId === app.id}
                          className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl hover:bg-red-500 uppercase tracking-widest disabled:opacity-50 transition-all"
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestore(app)}
                        disabled={processingId === app.id}
                        className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl hover:bg-blue-500 uppercase tracking-widest disabled:opacity-50 transition-all flex items-center gap-1"
                      >
                        <RefreshCw size={12} /> Restore to Queue
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper: Map Firestore role to display type
function mapRoleToType(role?: string): string {
  switch (role) {
    case 'patient': return 'Patient Card (Adult)';
    case 'caregiver': return 'Caregiver Authorization';
    case 'business': return 'Business License';
    case 'retail': return 'Retail Dispensary';
    case 'cultivator': return 'Cultivator License';
    case 'processor': return 'Processor License';
    case 'provider': return 'Provider Auth';
    case 'transporter': return 'Transporter License';
    default: return 'General Application';
  }
}
