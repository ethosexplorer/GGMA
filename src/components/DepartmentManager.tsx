import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Shield, Building2, Briefcase, Phone, Settings, Trash2, Edit3, Check, ChevronDown, ChevronRight, UserPlus } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Position { title: string; tabs: string[]; permissions: 'admin' | 'edit' | 'view'; }
interface Department { id: string; name: string; head: string; icon: string; color: string; positions: Position[]; createdAt: any; }
interface StaffMember { id: string; name: string; email: string; department: string; position: string; status: 'active' | 'onboarding' | 'inactive'; onboardedAt: any; }

const ICONS: Record<string, any> = { shield: Shield, building: Building2, briefcase: Briefcase, phone: Phone, users: Users, settings: Settings };
const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#14b8a6'];

const ALL_TABS = [
  { id: 'overview', label: 'God Overview' }, { id: 'b2b_crm', label: 'Global CRM Pipeline' },
  { id: 'compliance', label: 'Compliance Monitor' }, { id: 'regulatory_library', label: 'Regulatory Library' },
  { id: 'call_center', label: 'Call Center' }, { id: 'support_tickets', label: 'Support Tickets' },
  { id: 'users', label: 'Personnel Force' }, { id: 'hr_intelligence', label: 'HR Intelligence' },
  { id: 'accounting_ledger', label: 'Accounting Ledger' }, { id: 'global_financials', label: 'Global Financials' },
  { id: 'subscriptions', label: 'Subscriptions' }, { id: 'invoices', label: 'Invoice Manager' },
  { id: 'jurisdiction_map', label: 'Nationwide Oversight' }, { id: 'patients', label: 'Registry' },
  { id: 'business', label: 'Economic Infrastructure' }, { id: 'marketing_hub', label: 'Marketing' },
  { id: 'omma_pipeline', label: 'Global Sweep Hub' }, { id: 'approvals', label: 'Agency Approvals' },
  { id: 'applications', label: 'Applications Queue' }, { id: 'reports', label: 'Master Analytics' },
  { id: 'logs', label: 'System Logs' }, { id: 'settings', label: 'Settings' },
  { id: 'messages', label: 'Messages' }, { id: 'ai_training', label: 'AI Training' },
  { id: 'law_enforcement', label: 'Law Enforcement (RIP)' }, { id: 'rapid_testing', label: 'Rapid Testing' },
  { id: 'ip_monitor', label: 'IP / Patent Monitor' }, { id: 'negligence_intercept', label: 'Negligence Intercept' },
];

export const DepartmentManager = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddPosition, setShowAddPosition] = useState<string | null>(null);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [deptForm, setDeptForm] = useState({ name: '', head: '', icon: 'building', color: COLORS[0] });
  const [posForm, setPosForm] = useState({ title: '', tabs: [] as string[], permissions: 'view' as 'admin'|'edit'|'view' });
  const [staffForm, setStaffForm] = useState({ name: '', email: '', department: '', position: '' });

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, 'departments')), snap => {
      setDepartments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Department)));
    });
    const u2 = onSnapshot(query(collection(db, 'staff')), snap => {
      setStaff(snap.docs.map(d => ({ id: d.id, ...d.data() } as StaffMember)));
    });
    return () => { u1(); u2(); };
  }, []);

  const saveDept = async () => {
    if (!deptForm.name.trim()) return;
    if (editingDept) {
      await updateDoc(doc(db, 'departments', editingDept.id), { name: deptForm.name, head: deptForm.head, icon: deptForm.icon, color: deptForm.color });
    } else {
      await addDoc(collection(db, 'departments'), { ...deptForm, positions: [], createdAt: serverTimestamp() });
    }
    setDeptForm({ name: '', head: '', icon: 'building', color: COLORS[0] });
    setShowAddDept(false);
    setEditingDept(null);
  };

  const deleteDept = async (id: string) => {
    if (!confirm('Delete this department and all its positions?')) return;
    await deleteDoc(doc(db, 'departments', id));
  };

  const addPosition = async (deptId: string) => {
    if (!posForm.title.trim()) return;
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return;
    const updated = [...(dept.positions || []), { ...posForm }];
    await updateDoc(doc(db, 'departments', deptId), { positions: updated });
    setPosForm({ title: '', tabs: [], permissions: 'view' });
    setShowAddPosition(null);
  };

  const removePosition = async (deptId: string, idx: number) => {
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return;
    const updated = dept.positions.filter((_, i) => i !== idx);
    await updateDoc(doc(db, 'departments', deptId), { positions: updated });
  };

  const saveStaff = async () => {
    if (!staffForm.name.trim() || !staffForm.department) return;
    await addDoc(collection(db, 'staff'), { ...staffForm, status: 'active', onboardedAt: serverTimestamp() });
    setStaffForm({ name: '', email: '', department: '', position: '' });
    setShowAddStaff(false);
  };

  const removeStaff = async (id: string) => {
    if (!confirm('Remove this staff member?')) return;
    await deleteDoc(doc(db, 'staff', id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Departments & Roles</h2>
          <p className="text-slate-500 font-medium mt-1">Create departments, assign positions, and onboard staff</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddStaff(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg">
            <UserPlus size={16} /> Onboard Staff
          </button>
          <button onClick={() => { setEditingDept(null); setDeptForm({ name: '', head: '', icon: 'building', color: COLORS[0] }); setShowAddDept(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg">
            <Plus size={16} /> New Department
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Departments</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{departments.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Positions</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{departments.reduce((a, d) => a + (d.positions?.length || 0), 0)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Staff</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{staff.filter(s => s.status === 'active').length}</p>
        </div>
      </div>

      {/* Departments List */}
      <div className="space-y-4">
        {departments.map(dept => {
          const Icon = ICONS[dept.icon] || Building2;
          const isExpanded = expandedDept === dept.id;
          const deptStaff = staff.filter(s => s.department === dept.id);
          return (
            <div key={dept.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpandedDept(isExpanded ? null : dept.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: dept.color }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{dept.name}</h3>
                    <p className="text-xs text-slate-500">{dept.head ? `Head: ${dept.head}` : 'No head assigned'} · {dept.positions?.length || 0} positions · {deptStaff.length} staff</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setEditingDept(dept); setDeptForm({ name: dept.name, head: dept.head, icon: dept.icon, color: dept.color }); setShowAddDept(true); }} className="p-2 hover:bg-slate-100 rounded-lg"><Edit3 size={14} className="text-slate-400" /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteDept(dept.id); }} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-400" /></button>
                  {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-4">
                  {/* Positions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Positions</h4>
                      <button onClick={() => { setPosForm({ title: '', tabs: [], permissions: 'view' }); setShowAddPosition(dept.id); }} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"><Plus size={12} /> Add Position</button>
                    </div>
                    {(dept.positions || []).map((pos, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-2">
                        <div>
                          <p className="font-bold text-sm text-slate-800">{pos.title}</p>
                          <p className="text-[10px] text-slate-500">{pos.tabs.length} tabs · {pos.permissions} access</p>
                        </div>
                        <button onClick={() => removePosition(dept.id, idx)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400" /></button>
                      </div>
                    ))}
                  </div>

                  {/* Staff in this dept */}
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Staff</h4>
                    {deptStaff.length === 0 && <p className="text-sm text-slate-400 italic">No staff assigned</p>}
                    {deptStaff.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-2">
                        <div>
                          <p className="font-bold text-sm text-slate-800">{s.name}</p>
                          <p className="text-[10px] text-slate-500">{s.email} · {s.position || 'No position'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{s.status}</span>
                          <button onClick={() => removeStaff(s.id)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {departments.length === 0 && (
          <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl">
            <Building2 size={40} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">No departments yet</p>
            <p className="text-sm text-slate-400">Create your first department to start building your org structure</p>
          </div>
        )}
      </div>

      {/* Add/Edit Department Modal */}
      {showAddDept && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">{editingDept ? 'Edit' : 'New'} Department</h3>
              <button onClick={() => { setShowAddDept(false); setEditingDept(null); }} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Department Name *</label>
                <input value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" placeholder="e.g. Compliance" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Department Head</label>
                <input value={deptForm.head} onChange={e => setDeptForm({ ...deptForm, head: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" placeholder="e.g. Monica Green" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setDeptForm({ ...deptForm, color: c })} className={`w-8 h-8 rounded-full border-2 transition-all ${deptForm.color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Icon</label>
                <div className="flex gap-2">
                  {Object.entries(ICONS).map(([key, Ic]) => (
                    <button key={key} onClick={() => setDeptForm({ ...deptForm, icon: key })} className={`p-2 rounded-lg border transition-all ${deptForm.icon === key ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <Ic size={18} className={deptForm.icon === key ? 'text-indigo-600' : 'text-slate-400'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowAddDept(false); setEditingDept(null); }} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={saveDept} disabled={!deptForm.name.trim()} className="px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg disabled:opacity-50 hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Position Modal */}
      {showAddPosition && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">Add Position</h3>
              <button onClick={() => setShowAddPosition(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Position Title *</label>
                <input value={posForm.title} onChange={e => setPosForm({ ...posForm, title: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" placeholder="e.g. Sr. Compliance Officer" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Permission Level</label>
                <div className="flex gap-2">
                  {(['view', 'edit', 'admin'] as const).map(p => (
                    <button key={p} onClick={() => setPosForm({ ...posForm, permissions: p })} className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase ${posForm.permissions === p ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-500'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Dashboard Tabs Access</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {ALL_TABS.map(tab => (
                    <button key={tab.id} onClick={() => setPosForm({ ...posForm, tabs: posForm.tabs.includes(tab.id) ? posForm.tabs.filter(t => t !== tab.id) : [...posForm.tabs, tab.id] })} className={`px-3 py-2 rounded-lg border text-xs font-bold text-left flex items-center gap-2 ${posForm.tabs.includes(tab.id) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                      {posForm.tabs.includes(tab.id) && <Check size={12} />} {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddPosition(null)} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={() => addPosition(showAddPosition)} disabled={!posForm.title.trim()} className="px-6 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg disabled:opacity-50 hover:bg-indigo-700">Add Position</button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">Onboard Staff Member</h3>
              <button onClick={() => setShowAddStaff(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Full Name *</label>
                <input value={staffForm.name} onChange={e => setStaffForm({ ...staffForm, name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label>
                <input value={staffForm.email} onChange={e => setStaffForm({ ...staffForm, email: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500" placeholder="john@company.com" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Department *</label>
                <select value={staffForm.department} onChange={e => setStaffForm({ ...staffForm, department: e.target.value, position: '' })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              {staffForm.department && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Position</label>
                  <select value={staffForm.position} onChange={e => setStaffForm({ ...staffForm, position: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500">
                    <option value="">Select Position</option>
                    {(departments.find(d => d.id === staffForm.department)?.positions || []).map((p, i) => <option key={i} value={p.title}>{p.title}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddStaff(false)} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={saveStaff} disabled={!staffForm.name.trim() || !staffForm.department} className="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg disabled:opacity-50 hover:bg-emerald-700">Onboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
