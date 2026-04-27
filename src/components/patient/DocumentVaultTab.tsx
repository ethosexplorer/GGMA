import React, { useState } from 'react';
import { Upload, FileText, Image, Shield, Trash2, Eye, Download, FolderOpen, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

const initialDocs = [
  { id: 1, name: 'Oklahoma State ID — Front', type: 'ID', format: 'JPG', size: '2.1 MB', uploaded: 'Jan 15, 2026', status: 'Verified', category: 'identification' },
  { id: 2, name: 'Oklahoma State ID — Back', type: 'ID', format: 'JPG', size: '1.8 MB', uploaded: 'Jan 15, 2026', status: 'Verified', category: 'identification' },
  { id: 3, name: 'Dr. Johnson Recommendation', type: 'Medical', format: 'PDF', size: '340 KB', uploaded: 'Jan 12, 2026', status: 'Verified', category: 'medical' },
  { id: 4, name: 'Lab Results — CBC Panel', type: 'Lab', format: 'PDF', size: '890 KB', uploaded: 'Mar 22, 2026', status: 'Verified', category: 'lab' },
  { id: 5, name: 'Insurance Card — SoonerCare', type: 'Insurance', format: 'JPG', size: '1.2 MB', uploaded: 'Jan 15, 2026', status: 'Verified', category: 'insurance' },
  { id: 6, name: 'OMMA Card — Digital Copy', type: 'Card', format: 'PNG', size: '560 KB', uploaded: 'Jan 20, 2026', status: 'Active', category: 'cards' },
];

export let globalDocuments = initialDocs;

try {
  const saved = localStorage.getItem('vault_docs');
  if (saved) {
    globalDocuments = JSON.parse(saved);
  }
} catch (e) {}

export const setGlobalDocuments = (docs: any[]) => {
  globalDocuments = docs;
  try {
    localStorage.setItem('vault_docs', JSON.stringify(docs));
  } catch (e) {}
};

const baseCategories = [
  { id: 'all', label: 'All Documents' },
  { id: 'identification', label: 'Identification' },
  { id: 'medical', label: 'Medical Records' },
  { id: 'lab', label: 'Lab Results' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'cards', label: 'Cards & Licenses' },
];

export const DocumentVaultTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [localDocs, setLocalDocsState] = useState(globalDocuments);
  
  const setLocalDocs = (updateFn: any) => {
    setLocalDocsState((prev: any) => {
      const nextDocs = typeof updateFn === 'function' ? updateFn(prev) : updateFn;
      setGlobalDocuments(nextDocs);
      return nextDocs;
    });
  };

  const filtered = selectedCategory === 'all' ? localDocs : localDocs.filter(d => d.category === selectedCategory);

  const getCategoryCount = (catId: string) => catId === 'all' ? localDocs.length : localDocs.filter(d => d.category === catId).length;

  const handleUpload = (e?: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file;
    if (e && 'dataTransfer' in e && e.dataTransfer) {
       file = e.dataTransfer.files[0];
    } else if (e && 'target' in e && (e.target as HTMLInputElement).files) {
       file = (e.target as HTMLInputElement).files?.[0];
    }
    
    const fileName = file ? file.name : 'New_Scanned_Document.pdf';
    const fileSize = file ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : '1.2 MB';
    const fileFormat = file ? fileName.split('.').pop()?.toUpperCase() || 'PDF' : 'PDF';

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setLocalDocs(prev => [{
        id: Date.now(),
        name: fileName,
        type: 'General',
        format: fileFormat,
        size: fileSize,
        uploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Active',
        category: selectedCategory === 'all' ? 'medical' : selectedCategory
      }, ...prev]);
      alert('Document securely uploaded to your Vault and synced with the Master Administrative Vault.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* OMMA 2026 Compliance Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a4731] rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">OMMA 2026 Compliance</h4>
            <h3 className="text-xl font-black mb-2">Required for Adult Patient License</h3>
            <ul className="text-xs space-y-1.5 text-emerald-100/90 font-medium">
              <li className="flex items-center gap-2">✅ Signed Recommendation (dated within 30 days)</li>
              <li className="flex items-center gap-2">✅ Passport Photo (white background, {'<'} 6 mo)</li>
              <li className="flex items-center gap-2">✅ OK Driver's License or Proof of Residency</li>
              <li className="flex items-center gap-2">✅ OK-Registered Physician (SB 1066)</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-emerald-600 mt-1" />
            <div>
              <h4 className="font-bold text-slate-800">SB 1066 Physician Verification</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Ensure your doctor is registered with OMMA before uploading your recommendation form.</p>
            </div>
          </div>
          <button onClick={() => window.open('https://oklahoma.gov/omma/patients-caregivers/physician-list.html', '_blank')} className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-black hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-slate-200">
            Verify Physician Registration Status
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 flex items-center gap-3">
        <Lock size={20} className="text-blue-600 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Secure Document Vault</h4>
          <p className="text-xs text-blue-700">All documents are encrypted with HIPAA-compliant storage and full audit trails.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Categories */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <h3 className="font-bold text-slate-800 mb-3 text-sm">Categories</h3>
          <div className="space-y-1">
            {baseCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between",
                  selectedCategory === cat.id ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{cat.label}</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{getCategoryCount(cat.id)}</span>
              </button>
            ))}
          </div>

          {/* Storage Stats */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-2">Storage Used</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '18%' }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">6.9 MB of 5 GB used</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Upload Zone */}
          <input type="file" id="vault-upload" onChange={handleUpload} className="sr-only" />
          <label
            htmlFor="vault-upload"
            className={cn(
              "block border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
              dragOver ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
              isUploading && "opacity-50 pointer-events-none"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e); }}
          >
            <Upload size={32} className={cn("mx-auto mb-3", dragOver ? "text-emerald-500" : "text-slate-400")} />
            <p className="font-bold text-slate-700 text-sm">{isUploading ? 'Encrypting & Uploading...' : 'Drop files here or click to upload'}</p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG up to 10MB each</p>
          </label>

          {/* Documents List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">{selectedCategory === 'all' ? 'All Documents' : baseCategories.find(c => c.id === selectedCategory)?.label} ({filtered.length})</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      doc.format === 'PDF' ? "bg-red-50 text-red-500" :
                      doc.format === 'JPG' || doc.format === 'PNG' ? "bg-blue-50 text-blue-500" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {doc.format === 'PDF' ? <FileText size={18} /> : <Image size={18} />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.format} • {doc.size} • {doc.uploaded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      doc.status === 'Verified' ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                    )}>
                      {doc.status}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
