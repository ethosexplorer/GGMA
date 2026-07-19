import React, { useState, useEffect } from 'react';
import { Phone, Plus, X, Trash2, Edit2, Check, Shield, Activity, Hash, CheckSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';

export const VoIPExtensionsTab = ({ user }: { user?: any }) => {
  const [extensions, setExtensions] = useState<any[]>([]);
  const [editingExt, setEditingExt] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ext: '',
    name: '',
    dept: 'General',
    status: 'Active',
    desc: '',
  });

  // Sync from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'phone_extensions'), (snap) => {
      if (snap.empty) {
        // Seed default extensions
        const seedData = [
          { ext: '100', name: 'Main Reception / IVR', dept: 'General', status: 'Active', desc: 'Auto-attendant greeting — Sylara routes to department' },
          { ext: '101', name: 'Founder / CEO', dept: 'Executive', status: 'Active', desc: 'Direct line to Shantell Robinson' },
          { ext: '102', name: 'Executive Office', dept: 'Executive', status: 'Active', desc: 'CEO / President overflow' },
          { ext: '110', name: 'Medical Card Intake', dept: 'Medical', status: 'Active', desc: 'Patient med card applications & renewals' },
          { ext: '111', name: 'Patient Support', dept: 'Medical', status: 'Active', desc: 'General patient inquiries & status updates' },
          { ext: '112', name: 'Telehealth Scheduling', dept: 'Medical', status: 'Active', desc: 'Physician consultation bookings' },
          { ext: '120', name: 'Business Licensing', dept: 'Licensing', status: 'Active', desc: 'New business applications & license inquiries' },
          { ext: '121', name: 'Compliance & Regulatory', dept: 'Compliance', status: 'Active', desc: 'Compliance issues, BioTrack/Metrc questions' },
          { ext: '130', name: 'Sales & CRM', dept: 'Sales', status: 'Active', desc: 'B2B sales inquiries & subscription questions' },
          { ext: '131', name: 'Territory Manager — MS', dept: 'Sales', status: 'Active', desc: 'Mississippi territory operations' },
          { ext: '132', name: 'Territory Manager — AR/LA', dept: 'Sales', status: 'Active', desc: 'Arkansas & Louisiana territory' },
          { ext: '133', name: 'Territory Manager — AL/TN', dept: 'Sales', status: 'Active', desc: 'Alabama & Tennessee territory' },
          { ext: '140', name: 'Legal / Attorney Support', dept: 'Legal', status: 'Active', desc: 'Attorney dashboard & legal consultation referrals' },
          { ext: '150', name: 'Billing & Payments', dept: 'Finance', status: 'Active', desc: 'Stripe billing issues, refunds, subscription changes' },
          { ext: '160', name: 'IT Support & Technical', dept: 'IT', status: 'Active', desc: 'Platform issues, login problems, tech support' },
          { ext: '170', name: 'HR & Personnel', dept: 'HR', status: 'Active', desc: 'Employee inquiries, onboarding, benefits' },
          { ext: '199', name: 'Voicemail (General)', dept: 'System', status: 'Active', desc: 'After-hours general voicemail box' },
        ];
        seedData.forEach(async (item) => {
          await setDoc(doc(db, 'phone_extensions', item.ext), item);
        });
      } else {
        const list = snap.docs.map(doc => doc.data());
        list.sort((a, b) => parseInt(a.ext) - parseInt(b.ext));
        setExtensions(list);
      }
    });
    return unsub;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ext || !form.name) return;

    try {
      await setDoc(doc(db, 'phone_extensions', form.ext), {
        ext: form.ext,
        name: form.name,
        dept: form.dept,
        status: form.status,
        desc: form.desc,
      });
      setShowForm(false);
      setEditingExt(null);
      setForm({ ext: '', name: '', dept: 'General', status: 'Active', desc: '' });
    } catch (err) {
      console.error('Error saving extension:', err);
    }
  };

  const handleEdit = (extObj: any) => {
    setEditingExt(extObj);
    setForm({
      ext: extObj.ext,
      name: extObj.name,
      dept: extObj.dept,
      status: extObj.status,
      desc: extObj.desc || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (extNum: string) => {
    if (confirm(`Are you sure you want to delete extension ${extNum}?`)) {
      try {
        await deleteDoc(doc(db, 'phone_extensions', extNum));
      } catch (err) {
        console.error('Error deleting extension:', err);
      }
    }
  };

  const DEPARTMENTS = [
    'General', 'Executive', 'Medical', 'Licensing', 'Compliance', 'Sales', 'Legal', 'Finance', 'IT', 'HR', 'System'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="space-y-6 text-slate-100"
    >
      {/* HEADER CARD */}
      <div className="bg-[#0a1120]/80 border border-[#D4AF77]/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Phone size={160} className="text-[#D4AF77]" /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-2 italic uppercase text-white flex items-center gap-3">
              <Shield className="text-[#D4AF77] shrink-0" size={28} />
              VoIP Extensions Directory
            </h2>
            <p className="text-slate-400 font-medium text-sm max-w-xl">
              Founder Portal Direct Administration. Real-time control over internal office lines, auto-routing rules, and caller ID assignments.
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingExt(null);
              setForm({ ext: '', name: '', dept: 'General', status: 'Active', desc: '' });
              setShowForm(true);
            }}
            className="px-5 py-3 bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/40 hover:bg-[#134D36] hover:border-[#D4AF77]/60 font-black rounded-xl shadow-lg transition-all uppercase text-xs tracking-wider flex items-center gap-2"
          >
            <Plus size={14} /> Add Extension
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-900">
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Assignments</p>
            <p className="text-2xl font-black text-[#D4AF77]">{extensions.length}</p>
          </div>
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Lines</p>
            <p className="text-2xl font-black text-emerald-400">
              {extensions.filter(e => e.status === 'Active').length}
            </p>
          </div>
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">System Voicemails</p>
            <p className="text-2xl font-black text-indigo-400">
              {extensions.filter(e => e.ext === '199' || e.status?.includes('Voicemail')).length || 1}
            </p>
          </div>
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">System Link Status</p>
            <p className="text-xs font-black text-emerald-500 flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Connected & Live
            </p>
          </div>
        </div>
      </div>

      {/* EXTENSIONS TABLE */}
      <div className="bg-[#0a1120]/60 border border-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-900 bg-slate-950/30 flex justify-between items-center">
          <h3 className="font-black text-slate-300 text-xs uppercase tracking-widest flex items-center gap-2">
            <Hash size={14} className="text-[#D4AF77]" /> Internal Directory Mapping
          </h3>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
            Real-time Sync Active
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/40 border-b border-slate-900 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-black text-[9px] uppercase tracking-widest w-24">Ext #</th>
                <th className="px-6 py-4 font-black text-[9px] uppercase tracking-widest">Name / Function</th>
                <th className="px-6 py-4 font-black text-[9px] uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 font-black text-[9px] uppercase tracking-widest">Routing Description</th>
                <th className="px-6 py-4 font-black text-[9px] uppercase tracking-widest text-center w-24">Status</th>
                <th className="px-6 py-4 font-black text-[9px] uppercase tracking-widest text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-950">
              {extensions.map((ext, idx) => (
                <tr key={idx} className="hover:bg-[#0c1326]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-[#D4AF77] text-sm bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-900 shadow-inner">
                      {ext.ext}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-sm">{ext.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border",
                      ext.dept === 'Executive' ? 'bg-purple-950/40 text-purple-400 border-purple-900/30' :
                      ext.dept === 'Medical' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' :
                      ext.dept === 'Sales' ? 'bg-blue-950/40 text-blue-400 border-blue-900/30' :
                      ext.dept === 'Legal' ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' :
                      ext.dept === 'Finance' ? 'bg-pink-950/40 text-pink-400 border-pink-900/30' :
                      ext.dept === 'Compliance' ? 'bg-red-950/40 text-red-400 border-red-900/30' :
                      ext.dept === 'Licensing' ? 'bg-orange-950/40 text-orange-400 border-orange-900/30' :
                      'bg-slate-950/40 text-slate-400 border-slate-900/30'
                    )}>
                      {ext.dept}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">{ext.desc}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                      ext.status === 'Active' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30' : 'bg-rose-950/30 text-rose-400 border-rose-900/30'
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", ext.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500')} />
                      {ext.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(ext)}
                        className="p-1.5 rounded-lg border border-slate-900 hover:border-[#D4AF77]/30 hover:bg-slate-950 text-slate-400 hover:text-white transition-all"
                        title="Edit Line"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ext.ext)}
                        className="p-1.5 rounded-lg border border-slate-900 hover:border-rose-900/40 hover:bg-rose-955/20 text-slate-500 hover:text-rose-400 transition-all"
                        title="Delete Line"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {extensions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-xs italic font-medium">
                    No office extensions found in the registry. Click "Add Extension" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0a1120] border border-[#D4AF77]/30 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-900 bg-slate-950/40 flex justify-between items-center">
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Settings size={18} className="text-[#D4AF77]" />
                {editingExt ? `Modify Extension ${form.ext}` : 'Create New Extension'}
              </h3>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Extension Number *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingExt}
                  value={form.ext}
                  onChange={e => setForm(f => ({ ...f, ext: e.target.value.replace(/\D/g, '') }))}
                  placeholder="e.g. 104"
                  maxLength={4}
                  className="w-full bg-[#080d1a] border border-slate-900 rounded-xl px-4 py-3 text-sm text-[#D4AF77] font-mono font-bold outline-none focus:border-[#D4AF77]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Name / Function / Assignment *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Sales Team Lead"
                  className="w-full bg-[#080d1a] border border-slate-900 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF77]/40 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                  <select
                    value={form.dept}
                    onChange={e => setForm(f => ({ ...f, dept: e.target.value }))}
                    className="w-full bg-[#080d1a] border border-slate-900 rounded-xl px-3 py-3 text-xs text-white outline-none focus:border-[#D4AF77]/40 cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d} className="bg-[#0a1120] text-slate-300">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-[#080d1a] border border-slate-900 rounded-xl px-3 py-3 text-xs text-white outline-none focus:border-[#D4AF77]/40 cursor-pointer"
                  >
                    <option value="Active" className="bg-[#0a1120] text-emerald-400">Active</option>
                    <option value="Suspended" className="bg-[#0a1120] text-rose-400">Suspended</option>
                    <option value="Voicemail-Only" className="bg-[#0a1120] text-indigo-400">Voicemail Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description (Routing Details)</label>
                <textarea
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="e.g. Sales team direct routing, greets with regional hours"
                  rows={3}
                  className="w-full bg-[#080d1a] border border-slate-900 rounded-xl p-4 text-xs text-slate-300 outline-none focus:border-[#D4AF77]/40 transition-colors resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-900 flex justify-end gap-3 bg-slate-950/20 -mx-6 -mb-6 p-6">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2.5 border border-slate-900 text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-950 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/40 hover:bg-[#134D36] font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
                >
                  {editingExt ? 'Save Changes' : 'Create Line'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
