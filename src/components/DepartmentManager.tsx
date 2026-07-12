import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Shield, Building2, Briefcase, Phone, Settings, Trash2, Edit3, Check, ChevronDown, ChevronRight, UserPlus, Eye, EyeOff, Cpu, Globe, FlaskConical, Lock, Loader2, MapPin, CreditCard, Calendar, Hash } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, serverTimestamp, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

interface Position { title: string; tabs: string[]; permissions: 'admin' | 'edit' | 'view'; }
interface Department { id: string; name: string; head: string; icon: string; color: string; positions: Position[]; createdAt: any; }
interface StaffMember { id: string; name: string; email: string; department: string; position: string; status: 'active' | 'onboarding' | 'inactive'; onboardedAt: any; accessibleDashboards?: string[]; allowedTabs?: string[]; jurisdiction?: string; }

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

// Dashboard portals available in the Oversight Hub
const DASHBOARD_PORTALS = [
  { id: 'operations', label: 'Ops & Support Center', icon: Cpu, color: 'indigo', description: 'Call center, support tickets, document vault, payments' },
  { id: 'state_admin', label: 'State Licensing (Admin)', icon: Shield, color: 'slate', description: 'Manage patients, businesses, approvals, compliance' },
  { id: 'federal', label: 'Federal Command', icon: Globe, color: 'blue', description: 'Nationwide analytics, interstate monitoring' },
  { id: 'public_health', label: 'Public Health & Labs', icon: FlaskConical, color: 'emerald', description: 'Lab standards, exposure tracking, recalls' },
  { id: 'overview', label: 'Master Command', icon: Building2, color: 'purple', description: 'Oversight hub home dashboard' },
  { id: 'audit_logs', label: 'System Audit Logs', icon: Shield, color: 'amber', description: 'Full system activity audit trail' },
  { id: 'virtual_attendant', label: 'GGE World Call Center', icon: Phone, color: 'sky', description: 'Virtual attendant & call routing' },
  { id: 'processor', label: 'GGE Processor', icon: Cpu, color: 'rose', description: 'Private settlement rail oversight' },
  { id: 'subscription', label: 'Billing & Tiers', icon: Settings, color: 'teal', description: 'Subscription management' },
];

// Ops Center specific modules
const OPS_MODULES = [
  { id: 'call_center', label: 'Call Center Command' },
  { id: 'phone_intake', label: 'Phone Intake Form' },
  { id: 'account_lookup', label: 'Account Lookup' },
  { id: 'payment_lookup', label: 'Payment Lookup' },
  { id: 'operations_calendar', label: 'Operations Calendar' },
  { id: 'support', label: 'Active Support Tickets' },
  { id: 'calls', label: 'Call Queue' },
  { id: 'backoffice', label: 'Escalations Queue' },
  { id: 'it_support', label: 'IT Support & Diagnostics' },
  { id: 'hr_intelligence', label: 'HR Intelligence' },
  { id: 'applications', label: 'Applications Queue' },
  { id: 'document_vault', label: 'Document Vault' },
  { id: 'post_payment', label: 'Post Payment' },
  { id: 'personnel', label: 'Personnel Force' },
  { id: 'patients', label: 'Patient Inquiries' },
  { id: 'business', label: 'Business Inquiries' },
  { id: 'products_services', label: 'Products & Services' },
];

const STAFF_ROLES = [
  { value: 'operations', label: 'Operations Admin' },
  { value: 'staff_support', label: 'Support Agent' },
  { value: 'staff_compliance', label: 'Compliance Officer' },
  { value: 'staff_it', label: 'IT Support' },
  { value: 'admin_internal', label: 'Internal Admin' },
  { value: 'regulator_state', label: 'State Regulator' },
  { value: 'backoffice', label: 'Back Office Staff' },
  { value: 'staff_hr', label: 'HR Personnel' },
  { value: 'staff_finance', label: 'Finance Staff' },
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
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
  
  // Enhanced staff onboarding form
  const [staffForm, setStaffForm] = useState({
    name: '', email: '', password: '', department: '', position: '',
    role: 'operations', jurisdiction: 'Mississippi',
    accessibleDashboards: [] as string[],
    allowedTabs: [] as string[],
    // Personal Information
    ssn: '', dateOfBirth: '', phone: '', stateIdNumber: '',
    homeAddress: '', homeCity: '', homeState: 'Mississippi', homeZip: '',
  });
  const [showSSN, setShowSSN] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState('');
  const [onboardingSuccess, setOnboardingSuccess] = useState('');

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

  const toggleDashboard = (dashId: string) => {
    setStaffForm(prev => ({
      ...prev,
      accessibleDashboards: prev.accessibleDashboards.includes(dashId)
        ? prev.accessibleDashboards.filter(d => d !== dashId)
        : [...prev.accessibleDashboards, dashId]
    }));
  };

  const toggleOpsModule = (modId: string) => {
    setStaffForm(prev => ({
      ...prev,
      allowedTabs: prev.allowedTabs.includes(modId)
        ? prev.allowedTabs.filter(t => t !== modId)
        : [...prev.allowedTabs, modId]
    }));
  };

  const selectAllOpsModules = () => {
    setStaffForm(prev => ({
      ...prev,
      allowedTabs: OPS_MODULES.map(m => m.id)
    }));
  };

  const clearAllOpsModules = () => {
    setStaffForm(prev => ({ ...prev, allowedTabs: [] }));
  };

  const saveStaff = async () => {
    if (!staffForm.name.trim() || !staffForm.email.trim() || !staffForm.password.trim()) {
      setOnboardingError('Name, email, and password are required.');
      return;
    }
    if (staffForm.password.length < 6) {
      setOnboardingError('Password must be at least 6 characters.');
      return;
    }
    if (staffForm.accessibleDashboards.length === 0) {
      setOnboardingError('Please select at least one dashboard to grant access.');
      return;
    }

    setOnboardingLoading(true);
    setOnboardingError('');
    setOnboardingSuccess('');

    try {
      // 1. Create Firebase Auth account using a SECONDARY app instance
      //    so the founder doesn't get signed out (createUserWithEmailAndPassword auto-signs-in)
      const { initializeApp, deleteApp } = await import('firebase/app');
      const { getAuth, createUserWithEmailAndPassword: createUser } = await import('firebase/auth');
      const firebaseConfig = (await import('../../firebase-applet-config.json')).default;
      const secondaryApp = initializeApp(firebaseConfig, 'staff-onboarding-' + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      
      let newUid: string;
      try {
        const userCredential = await createUser(secondaryAuth, staffForm.email, staffForm.password);
        newUid = userCredential.user.uid;
      } finally {
        // Always clean up the secondary app
        await deleteApp(secondaryApp).catch(() => {});
      }

      // 2. Create user profile in Firestore with access control
      const userProfile = {
        uid: newUid,
        email: staffForm.email,
        displayName: staffForm.name,
        role: staffForm.role,
        status: 'Active',
        jurisdiction: staffForm.jurisdiction,
        accessibleDashboards: staffForm.accessibleDashboards,
        allowedTabs: staffForm.allowedTabs,
        department: staffForm.department || '',
        position: staffForm.position || '',
        // Personal Information
        ssn: staffForm.ssn || '',
        dateOfBirth: staffForm.dateOfBirth || '',
        phone: staffForm.phone || '',
        stateIdNumber: staffForm.stateIdNumber || '',
        homeAddress: staffForm.homeAddress || '',
        homeCity: staffForm.homeCity || '',
        homeState: staffForm.homeState || '',
        homeZip: staffForm.homeZip || '',
        onboardedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        onboardedBy: 'Founder',
      };
      await setDoc(doc(db, 'users', newUid), userProfile);

      // 3. Also save to staff collection for the department manager
      await addDoc(collection(db, 'staff'), {
        name: staffForm.name,
        email: staffForm.email,
        department: staffForm.department || '',
        position: staffForm.position || staffForm.role,
        status: 'active',
        jurisdiction: staffForm.jurisdiction,
        accessibleDashboards: staffForm.accessibleDashboards,
        allowedTabs: staffForm.allowedTabs,
        role: staffForm.role,
        // Personal Information
        ssn: staffForm.ssn || '',
        dateOfBirth: staffForm.dateOfBirth || '',
        phone: staffForm.phone || '',
        stateIdNumber: staffForm.stateIdNumber || '',
        homeAddress: staffForm.homeAddress || '',
        homeCity: staffForm.homeCity || '',
        homeState: staffForm.homeState || '',
        homeZip: staffForm.homeZip || '',
        onboardedAt: serverTimestamp(),
      });

      // 4. Log the onboarding action
      try {
        const { turso } = await import('../lib/turso');
        await turso.execute({
          sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
          args: [
            'log-' + Math.random().toString(36).substr(2, 9),
            'STAFF_ONBOARDED',
            'Founder',
            JSON.stringify({
              name: staffForm.name,
              email: staffForm.email,
              role: staffForm.role,
              jurisdiction: staffForm.jurisdiction,
              dashboards: staffForm.accessibleDashboards,
              modules: staffForm.allowedTabs,
            })
          ]
        });
      } catch (e) { console.error('Audit log error:', e); }

      setOnboardingSuccess(`✅ ${staffForm.name} has been onboarded successfully! They can now log in with their credentials.`);

      // Reset form after 2 seconds
      setTimeout(() => {
        setStaffForm({
          name: '', email: '', password: '', department: '', position: '',
          role: 'operations', jurisdiction: 'Mississippi',
          accessibleDashboards: [], allowedTabs: [],
          ssn: '', dateOfBirth: '', phone: '', stateIdNumber: '',
          homeAddress: '', homeCity: '', homeState: 'Mississippi', homeZip: '',
        });
        setShowAddStaff(false);
        setOnboardingSuccess('');
      }, 3000);

    } catch (err: any) {
      console.error('Onboarding error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setOnboardingError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-email') {
        setOnboardingError('Invalid email address format.');
      } else if (err.code === 'auth/weak-password') {
        setOnboardingError('Password is too weak. Use at least 6 characters.');
      } else {
        setOnboardingError(err.message || 'Failed to onboard staff member.');
      }
    } finally {
      setOnboardingLoading(false);
    }
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ENHANCED ONBOARD STAFF MODAL — Full Access Control Panel          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center">
                    <UserPlus size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Onboard Staff Member</h3>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Create account · Set permissions · Assign dashboards</p>
                  </div>
                </div>
                <button onClick={() => { setShowAddStaff(false); setOnboardingError(''); setOnboardingSuccess(''); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={20} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Success / Error Messages */}
              {onboardingSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 animate-in fade-in">
                  {onboardingSuccess}
                </div>
              )}
              {onboardingError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-700 animate-in fade-in">
                  {onboardingError}
                </div>
              )}

              {/* ── SECTION 1: Identity ── */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Users size={12} /> Identity & Credentials
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Full Name *</label>
                    <input
                      value={staffForm.name}
                      onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Shawntay Robinson"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Email *</label>
                    <input
                      value={staffForm.email}
                      onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Drobinson507@yahoo.com"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={staffForm.password}
                      onChange={e => setStaffForm({ ...staffForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── SECTION 1B: Personal Information ── */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CreditCard size={12} /> Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Social Security Number</label>
                    <div className="relative">
                      <input
                        type={showSSN ? 'text' : 'password'}
                        value={staffForm.ssn}
                        onChange={e => {
                          // Auto-format SSN: XXX-XX-XXXX
                          let v = e.target.value.replace(/[^\d]/g, '').slice(0, 9);
                          if (v.length > 5) v = v.slice(0,3) + '-' + v.slice(3,5) + '-' + v.slice(5);
                          else if (v.length > 3) v = v.slice(0,3) + '-' + v.slice(3);
                          setStaffForm({ ...staffForm, ssn: v });
                        }}
                        className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                        placeholder="XXX-XX-XXXX"
                        maxLength={11}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSSN(!showSSN)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showSSN ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={staffForm.dateOfBirth}
                      onChange={e => setStaffForm({ ...staffForm, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Phone Number</label>
                    <input
                      value={staffForm.phone}
                      onChange={e => {
                        // Auto-format phone: (XXX) XXX-XXXX
                        let v = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                        if (v.length > 6) v = '(' + v.slice(0,3) + ') ' + v.slice(3,6) + '-' + v.slice(6);
                        else if (v.length > 3) v = '(' + v.slice(0,3) + ') ' + v.slice(3);
                        else if (v.length > 0) v = '(' + v;
                        setStaffForm({ ...staffForm, phone: v });
                      }}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="(601) 555-0123"
                      maxLength={14}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">State ID / Driver License #</label>
                    <input
                      value={staffForm.stateIdNumber}
                      onChange={e => setStaffForm({ ...staffForm, stateIdNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="e.g. 800-123-456"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Home Address</label>
                  <input
                    value={staffForm.homeAddress}
                    onChange={e => setStaffForm({ ...staffForm, homeAddress: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">City</label>
                    <input
                      value={staffForm.homeCity}
                      onChange={e => setStaffForm({ ...staffForm, homeCity: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="Jackson"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">State</label>
                    <select
                      value={staffForm.homeState}
                      onChange={e => setStaffForm({ ...staffForm, homeState: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 cursor-pointer bg-white"
                    >
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Zip Code</label>
                    <input
                      value={staffForm.homeZip}
                      onChange={e => setStaffForm({ ...staffForm, homeZip: e.target.value.replace(/[^\d-]/g, '').slice(0, 10) })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="39201"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Role & Jurisdiction ── */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Shield size={12} /> Role & Jurisdiction
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Role / Title *</label>
                    <select
                      value={staffForm.role}
                      onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 cursor-pointer bg-white"
                    >
                      {STAFF_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Jurisdiction *</label>
                    <select
                      value={staffForm.jurisdiction}
                      onChange={e => setStaffForm({ ...staffForm, jurisdiction: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 cursor-pointer bg-white"
                    >
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Department (Optional)</label>
                    <select
                      value={staffForm.department}
                      onChange={e => setStaffForm({ ...staffForm, department: e.target.value, position: '' })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 cursor-pointer bg-white"
                    >
                      <option value="">— No Department —</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  {staffForm.department && (
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Position</label>
                      <select
                        value={staffForm.position}
                        onChange={e => setStaffForm({ ...staffForm, position: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 cursor-pointer bg-white"
                      >
                        <option value="">Select Position</option>
                        {(departments.find(d => d.id === staffForm.department)?.positions || []).map((p, i) => (
                          <option key={i} value={p.title}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* ── SECTION 3: Dashboard Access ── */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Cpu size={12} /> Dashboard Access — Check what they can see
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {DASHBOARD_PORTALS.map(dash => {
                    const DashIcon = dash.icon;
                    const isSelected = staffForm.accessibleDashboards.includes(dash.id);
                    return (
                      <label
                        key={dash.id}
                        className={`flex items-center gap-4 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleDashboard(dash.id)}
                          className="w-5 h-5 rounded-md accent-indigo-600 cursor-pointer shrink-0"
                        />
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <DashIcon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>{dash.label}</p>
                          <p className="text-[10px] text-slate-500 truncate">{dash.description}</p>
                        </div>
                        {isSelected && <Check size={16} className="text-indigo-600 shrink-0" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* ── SECTION 4: Ops Center Module Access (only if Ops Center is selected) ── */}
              {staffForm.accessibleDashboards.includes('operations') && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Settings size={12} /> Ops Center Module Access
                    </h4>
                    <div className="flex gap-2">
                      <button onClick={selectAllOpsModules} className="text-[10px] font-bold text-indigo-600 hover:underline">Select All</button>
                      <span className="text-slate-300">|</span>
                      <button onClick={clearAllOpsModules} className="text-[10px] font-bold text-red-500 hover:underline">Clear All</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {OPS_MODULES.map(mod => {
                      const isChecked = staffForm.allowedTabs.includes(mod.id);
                      return (
                        <label
                          key={mod.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                            isChecked
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-700 font-bold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleOpsModule(mod.id)}
                            className="w-4 h-4 rounded accent-emerald-600 cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-bold">{mod.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-5 bg-slate-50 flex justify-between items-center shrink-0">
              <div className="text-[10px] text-slate-500 font-bold">
                {staffForm.accessibleDashboards.length} dashboard{staffForm.accessibleDashboards.length !== 1 ? 's' : ''} selected
                {staffForm.allowedTabs.length > 0 && ` · ${staffForm.allowedTabs.length} module${staffForm.allowedTabs.length !== 1 ? 's' : ''}`}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAddStaff(false); setOnboardingError(''); setOnboardingSuccess(''); }}
                  className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStaff}
                  disabled={onboardingLoading || !staffForm.name.trim() || !staffForm.email.trim() || !staffForm.password.trim() || staffForm.accessibleDashboards.length === 0}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-black text-sm rounded-xl disabled:opacity-50 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  {onboardingLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Onboard & Create Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
