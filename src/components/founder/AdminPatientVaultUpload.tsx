import React, { useState, useRef, useEffect } from 'react';
import { Upload, Search, User, FileText, Image, Check, X, Loader2, FolderOpen, Shield, Trash2, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db, storage } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface FBUser {
  uid: string;
  displayName?: string;
  email?: string;
  role?: string;
  state?: string;
  uploadedDocuments?: Record<string, string>;
}

interface QueuedFile {
  file: File;
  label: string;
  category: string;
  preview?: string;
}

const DOC_CATEGORIES = [
  { value: 'physician_recommendation', label: 'Physician Recommendation' },
  { value: 'drivers_license_front', label: "Driver's License — Front" },
  { value: 'drivers_license_back', label: "Driver's License — Back" },
  { value: 'selfie_photo', label: 'Selfie / Passport Photo' },
  { value: 'omma_card', label: 'OMMA Card' },
  { value: 'insurance_card', label: 'Insurance Card' },
  { value: 'lab_results', label: 'Lab Results' },
  { value: 'proof_of_residency', label: 'Proof of Residency' },
  { value: 'state_application', label: 'State Application Confirmation' },
  { value: 'other', label: 'Other Document' },
];

export const AdminPatientVaultUpload = () => {
  const [allUsers, setAllUsers] = useState<FBUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<FBUser | null>(null);
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ name: string; status: 'success' | 'error'; url?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load users from Firebase (real-time)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const users: FBUser[] = [];
      snap.forEach(d => {
        const data = d.data();
        users.push({ uid: d.id, ...data } as FBUser);
      });
      setAllUsers(users);
    });
    return () => unsub();
  }, []);

  // Filter users by search
  const filteredUsers = searchTerm.trim().length >= 2
    ? allUsers.filter(u => {
        const term = searchTerm.toLowerCase();
        return (u.displayName || '').toLowerCase().includes(term) ||
               (u.email || '').toLowerCase().includes(term) ||
               u.uid.toLowerCase().includes(term);
      }).slice(0, 10)
    : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles: QueuedFile[] = [];
    Array.from(files).forEach(file => {
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      newFiles.push({
        file,
        label: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
        category: guessCategory(file.name),
        preview,
      });
    });
    setQueuedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const guessCategory = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('recommend') || n.includes('physician') || n.includes('doctor')) return 'physician_recommendation';
    if (n.includes('license') || n.includes('id') || n.includes('driver')) return 'drivers_license_front';
    if (n.includes('selfie') || n.includes('photo') || n.includes('passport')) return 'selfie_photo';
    if (n.includes('omma') || n.includes('card')) return 'omma_card';
    if (n.includes('insurance')) return 'insurance_card';
    if (n.includes('lab') || n.includes('result')) return 'lab_results';
    return 'other';
  };

  const removeQueued = (idx: number) => {
    setQueuedFiles(prev => {
      const next = [...prev];
      if (next[idx].preview) URL.revokeObjectURL(next[idx].preview!);
      next.splice(idx, 1);
      return next;
    });
  };

  const handleUploadAll = async () => {
    if (!selectedUser || queuedFiles.length === 0) return;
    setUploading(true);
    setUploadResults([]);

    const results: typeof uploadResults = [];
    const docUpdates: Record<string, string> = {};

    for (const qf of queuedFiles) {
      try {
        const timestamp = Date.now();
        const safeLabel = qf.label.replace(/[^a-zA-Z0-9_\-. ]/g, '').trim();
        const storagePath = `users/${selectedUser.uid}/vault/${timestamp}_${safeLabel}.${qf.file.name.split('.').pop()}`;
        const fileRef = ref(storage, storagePath);
        await uploadBytes(fileRef, qf.file);
        const url = await getDownloadURL(fileRef);

        const docKey = `${qf.category}_${safeLabel}`;
        docUpdates[docKey] = url;

        results.push({ name: qf.label, status: 'success', url });
      } catch (err: any) {
        console.error(`Failed to upload ${qf.label}:`, err);
        results.push({ name: qf.label, status: 'error' });
      }
    }

    // Update user's Firestore document with new vault entries
    if (Object.keys(docUpdates).length > 0) {
      try {
        const userRef = doc(db, 'users', selectedUser.uid);
        const updates: Record<string, any> = {};
        for (const [key, url] of Object.entries(docUpdates)) {
          updates[`uploadedDocuments.${key}`] = url;
        }
        updates['vaultLastUpdated'] = serverTimestamp();
        updates['vaultUpdatedBy'] = 'Founder Admin';
        await updateDoc(userRef, updates);
      } catch (err) {
        console.error('Failed to update user document:', err);
      }
    }

    setUploadResults(results);
    setUploading(false);
    setQueuedFiles([]);
  };

  // Get existing docs for selected user
  const existingDocs = selectedUser?.uploadedDocuments
    ? Object.entries(selectedUser.uploadedDocuments)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700">
          <Shield size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">Patient Vault Upload</h2>
          <p className="text-xs text-slate-500">Upload documents to any patient's secure vault (Physician Recommendations, IDs, Photos)</p>
        </div>
      </div>

      {/* Step 1: Search Patient */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">1</span>
          Select Patient
        </h3>

        {selectedUser ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {(selectedUser.displayName || selectedUser.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-emerald-900">{selectedUser.displayName || 'No Name'}</p>
                <p className="text-xs text-emerald-700">{selectedUser.email} • {selectedUser.role} • {selectedUser.state || 'N/A'}</p>
                <p className="text-[10px] text-emerald-600 font-mono">UID: {selectedUser.uid}</p>
              </div>
            </div>
            <button onClick={() => { setSelectedUser(null); setSearchTerm(''); setQueuedFiles([]); setUploadResults([]); }} className="p-2 text-emerald-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or UID..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {filteredUsers.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 overflow-auto">
                {filteredUsers.map(u => (
                  <button
                    key={u.uid}
                    onClick={() => { setSelectedUser(u); setSearchTerm(''); }}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                  >
                    <User size={16} className="text-slate-400" />
                    <div>
                      <p className="font-bold text-sm text-slate-800">{u.displayName || 'No Name'}</p>
                      <p className="text-xs text-slate-500">{u.email} • {u.role} • {u.state || ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Existing Documents */}
      {selectedUser && existingDocs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <FolderOpen size={16} className="text-indigo-500" />
            Existing Vault Documents ({existingDocs.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {existingDocs.map(([name, url]) => (
              <div key={name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-400" />
                  <p className="text-sm font-medium text-slate-700">{name}</p>
                </div>
                <a href={url as string} target="_blank" rel="noopener noreferrer" className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg">
                  <Eye size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Queue Files */}
      {selectedUser && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">2</span>
            Add Documents
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
          >
            <Upload size={28} className="mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <p className="font-bold text-slate-700 text-sm">Click to select files</p>
            <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG — multiple files supported</p>
          </button>

          {queuedFiles.length > 0 && (
            <div className="mt-4 space-y-3">
              {queuedFiles.map((qf, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  {/* Preview */}
                  {qf.preview ? (
                    <img src={qf.preview} alt={qf.label} className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                  ) : (
                    <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center">
                      <FileText size={24} className="text-red-500" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      value={qf.label}
                      onChange={e => setQueuedFiles(prev => { const next = [...prev]; next[idx] = { ...next[idx], label: e.target.value }; return next; })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold"
                      placeholder="Document label..."
                    />
                    <select
                      value={qf.category}
                      onChange={e => setQueuedFiles(prev => { const next = [...prev]; next[idx] = { ...next[idx], category: e.target.value }; return next; })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    >
                      {DOC_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <p className="text-[10px] text-slate-400">{qf.file.name} • {(qf.file.size / 1024).toFixed(0)} KB • {qf.file.type}</p>
                  </div>
                  <button onClick={() => removeQueued(idx)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Upload */}
      {selectedUser && queuedFiles.length > 0 && (
        <button
          onClick={handleUploadAll}
          disabled={uploading}
          className={cn(
            "w-full py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all",
            uploading ? "bg-slate-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.01]"
          )}
        >
          {uploading ? (
            <><Loader2 size={18} className="animate-spin" /> Uploading {queuedFiles.length} file(s) to {selectedUser.displayName}'s Vault...</>
          ) : (
            <><Upload size={18} /> Upload {queuedFiles.length} file(s) to {selectedUser.displayName || 'Patient'}'s Vault</>
          )}
        </button>
      )}

      {/* Results */}
      {uploadResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6">
          <h3 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">
            <Check size={16} className="text-emerald-600" /> Upload Complete
          </h3>
          <div className="space-y-2">
            {uploadResults.map((r, i) => (
              <div key={i} className={cn("flex items-center gap-3 py-2 px-3 rounded-lg", r.status === 'success' ? "bg-emerald-50" : "bg-red-50")}>
                {r.status === 'success' ? <Check size={14} className="text-emerald-600" /> : <X size={14} className="text-red-600" />}
                <span className={cn("text-sm font-medium", r.status === 'success' ? "text-emerald-800" : "text-red-800")}>{r.name}</span>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-indigo-500 hover:underline">View</a>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
