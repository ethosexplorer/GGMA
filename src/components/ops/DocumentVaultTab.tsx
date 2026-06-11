import React, { useState, useEffect, useCallback } from 'react';
import { Search, Upload, FileText, FolderLock, Trash2, Download, Eye, X, AlertTriangle, Clock, CheckCircle, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface VaultDocument {
  id: string;
  user_id: string;
  user_name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  category: string;
  notes: string;
  uploaded_by: string;
  created_at: string;
}

const DOC_CATEGORIES = [
  'Medical Card Application',
  'State ID / Driver License',
  'Physician Recommendation',
  'Proof of Residency',
  'Business License',
  'Insurance Document',
  'Legal / Court Document',
  'Tax Document (280E)',
  'Correspondence',
  'Other'
];

export const DocumentVaultTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userDocuments, setUserDocuments] = useState<VaultDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [docCategory, setDocCategory] = useState('Medical Card Application');
  const [docNotes, setDocNotes] = useState('');
  const [viewingDoc, setViewingDoc] = useState<VaultDocument | null>(null);

  // Ensure the vault_documents table exists
  useEffect(() => {
    turso.execute(`
      CREATE TABLE IF NOT EXISTS vault_documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT,
        file_size INTEGER DEFAULT 0,
        file_url TEXT NOT NULL,
        category TEXT DEFAULT 'Other',
        notes TEXT DEFAULT '',
        uploaded_by TEXT DEFAULT 'Staff',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).catch(console.error);
  }, []);

  // Search users from Turso patients + businesses + Firestore CRM contacts/deals
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Turso patients + businesses
        const pRes = await turso.execute('SELECT id, name, email, status, "Patient" as type, state FROM patients');
        const bRes = await turso.execute('SELECT id, business_name as name, license_type as email, status, "Business" as type, "" as state FROM businesses');
        const tursoUsers = [...pRes.rows, ...bRes.rows];

        // Firestore CRM contacts + deals (for contacts like Merl Wood that aren't in Turso)
        let firestoreUsers: any[] = [];
        try {
          const { collection: fbCollection, getDocs: fbGetDocs } = await import('firebase/firestore');
          const { db: fbDb } = await import('../../firebase');
          const [contactsSnap, dealsSnap] = await Promise.all([
            fbGetDocs(fbCollection(fbDb, 'crm_contacts')),
            fbGetDocs(fbCollection(fbDb, 'crm_deals')),
          ]);
          const contactsList = contactsSnap.docs.map(d => {
            const data = d.data();
            return { id: d.id, name: data.name || data.displayName || '', email: data.email || '', status: data.status || 'active', type: 'CRM Contact', state: data.state || '' };
          });
          const dealsList = dealsSnap.docs.map(d => {
            const data = d.data();
            return { id: d.id, name: data.name || data.contact || data.company || '', email: data.email || '', status: data.status || data.stage || 'active', type: 'CRM Deal', state: data.state || '' };
          });
          firestoreUsers = [...contactsList, ...dealsList];
        } catch (fsErr) {
          console.warn('[Vault] Firestore CRM fetch skipped:', fsErr);
        }

        // Merge and deduplicate by email (prefer Turso entries)
        const seen = new Set<string>();
        const merged: any[] = [];
        for (const u of tursoUsers) {
          const key = String(u.email || '').toLowerCase() || String(u.id);
          if (!seen.has(key)) { seen.add(key); merged.push(u); }
        }
        for (const u of firestoreUsers) {
          const key = String(u.email || '').toLowerCase() || String(u.id);
          if (key && !seen.has(key) && u.name) { seen.add(key); merged.push(u); }
        }
        setAllUsers(merged);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch documents for selected user
  const fetchDocuments = useCallback(async (userId: string) => {
    try {
      const res = await turso.execute({
        sql: 'SELECT * FROM vault_documents WHERE user_id = ? ORDER BY created_at DESC',
        args: [userId]
      });
      setUserDocuments(res.rows as any);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchDocuments(String(selectedUser.id));
    }
  }, [selectedUser, fetchDocuments]);

  const filteredUsers = allUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q)
    );
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedUser) return;

    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${file.name} (${i + 1}/${files.length})...`);

      try {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `vault/${selectedUser.id}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Save metadata to Turso
        const docId = 'doc-' + Math.random().toString(36).substr(2, 9);
        await turso.execute({
          sql: `INSERT INTO vault_documents (id, user_id, user_name, file_name, file_type, file_size, file_url, category, notes, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            docId,
            String(selectedUser.id),
            String(selectedUser.name),
            file.name,
            file.type || 'application/octet-stream',
            file.size,
            downloadURL,
            docCategory,
            docNotes,
            'Staff (Ops Center)',
            new Date().toISOString()
          ]
        });

        // Audit log
        await turso.execute({
          sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
          args: [
            'log-' + Math.random().toString(36).substr(2, 9),
            'DOCUMENT_UPLOAD',
            'Staff',
            JSON.stringify({ user: selectedUser.name, file: file.name, category: docCategory })
          ]
        });

      } catch (err) {
        console.error('Upload error:', err);
        alert(`Failed to upload ${file.name}: ${err}`);
      }
    }

    setUploadProgress('');
    setUploading(false);
    setDocNotes('');
    fetchDocuments(String(selectedUser.id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDeleteDoc = async (doc: VaultDocument) => {
    if (!confirm(`Delete "${doc.file_name}" from ${doc.user_name}'s vault?`)) return;
    try {
      await turso.execute({ sql: 'DELETE FROM vault_documents WHERE id = ?', args: [doc.id] });
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), 'DOCUMENT_DELETE', 'Staff', JSON.stringify({ user: doc.user_name, file: doc.file_name })]
      });
      fetchDocuments(doc.user_id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ─── RENDER: User not selected yet ───
  if (!selectedUser) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 p-8 opacity-10"><FolderLock size={120} /></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <FolderLock className="text-indigo-400" size={28} /> Document Vault
            </h2>
            <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mt-2">
              Search for a user, then upload or manage their documents
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm"
              autoFocus
            />
          </div>

          {searchQuery.length > 0 && (
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold">No users found matching "{searchQuery}"</div>
              ) : (
                filteredUsers.map((u, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedUser(u)}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-indigo-50 transition-colors text-left rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">
                        {String(u.name || '').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email} {u.state ? `• ${u.state}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                        u.type === 'Patient' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      )}>{u.type}</span>
                      <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                        u.status === 'active' || u.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      )}>{u.status}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {searchQuery.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <User size={28} />
              </div>
              <p className="text-sm font-bold text-slate-500">Start typing a name to look up a user's document vault</p>
              <p className="text-xs text-slate-400">{allUsers.length} users in system</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RENDER: User selected — show their vault ───
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black">
              {String(selectedUser.name || '').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{selectedUser.name}'s Vault</h2>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
                {selectedUser.type || 'User'} • {selectedUser.email} {selectedUser.state ? `• ${selectedUser.state}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedUser(null); setUserDocuments([]); setSearchQuery(''); }}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <X size={14} /> Back to Search
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-8 transition-all text-center",
              dragOver ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-300"
            )}
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">Drop files here</h3>
            <p className="text-sm text-slate-500 mb-4">
              or click below to browse. PDFs, images, documents accepted.
            </p>

            {uploading ? (
              <div className="flex items-center justify-center gap-3 py-3">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-bold text-indigo-600">{uploadProgress}</span>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                <Upload size={16} /> Select Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.csv,.txt"
                />
              </label>
            )}
          </div>
        </div>

        {/* Upload Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Upload Settings</h4>
          
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Document Category</label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              {DOC_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notes (optional)</label>
            <textarea
              value={docNotes}
              onChange={(e) => setDocNotes(e.target.value)}
              placeholder="e.g. Received via text on 5/12"
              rows={3}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium resize-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage</p>
            <p className="text-xs text-slate-600 font-medium mt-1">Firebase Storage (Encrypted)</p>
            <p className="text-xs text-slate-600 font-medium">Metadata: Turso SQL (Production)</p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FolderLock size={16} className="text-indigo-500" /> Documents ({userDocuments.length})
          </h3>
        </div>

        {userDocuments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="font-bold">No documents in this vault yet</p>
            <p className="text-xs mt-1">Upload files above to add them to {selectedUser.name}'s vault</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white",
                    doc.file_type?.includes('pdf') ? 'bg-red-500' :
                    doc.file_type?.includes('image') ? 'bg-blue-500' :
                    doc.file_type?.includes('word') || doc.file_type?.includes('doc') ? 'bg-indigo-500' :
                    'bg-slate-500'
                  )}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{doc.file_name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{doc.category}</span>
                      <span>{formatFileSize(doc.file_size || 0)}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {new Date(doc.created_at).toLocaleDateString()}</span>
                      {doc.notes && <span className="italic text-slate-400">"{doc.notes}"</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(doc.file_url, '_blank')}
                    className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"
                    title="View / Download"
                  >
                    <Eye size={14} />
                  </button>
                  <a
                    href={doc.file_url}
                    download={doc.file_name}
                    className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={14} />
                  </a>
                  <button
                    onClick={() => handleDeleteDoc(doc)}
                    className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
