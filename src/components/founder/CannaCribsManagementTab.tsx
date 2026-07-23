import React, { useState, useEffect, useCallback } from 'react';
import {
  Home, Building2, Users, FileText, Shield, Activity, Search, Plus, Eye,
  Clock, UserCheck, CheckCircle, X, XCircle, Filter, ChevronRight, ChevronDown,
  DollarSign, Star, MapPin, Leaf, Briefcase, ClipboardList, CalendarCheck,
  TrendingUp, AlertTriangle, Mail, Phone, Download, MoreVertical, Edit, Trash2,
  Bed, Bath, Maximize, Heart, Award, Sparkles, ShieldCheck, CreditCard,
  Upload, FolderLock, Calendar, Save, Image, FileImage, Palette, User, AlertCircle,
  Loader2, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, getDoc, setDoc
} from 'firebase/firestore';

// ─── TYPES ───
type Application = {
  id: string; name: string; type: string; email: string; phone: string;
  property: string; propertyType: string; location: string; status: string;
  submitted: string; submittedTime: string; creditScore: number; cannabis_card: boolean;
  employment: string; income: string; notes: string;
  dob: string; ssn_last4: string; currentAddress: string;
  emergencyName: string; emergencyPhone: string; emergencyRelation: string;
  allergies: string; medicalConditions: string; medications: string;
  previousLandlord: string; previousLandlordPhone: string;
  reasonForMoving: string; pets: string; vehicles: string;
  moveInDate: string; leaseTerm: string;
  llCompany: string; llPropertyAddress: string; llTierPreference: string;
  llInsurance: boolean; llNumUnits: string;
  stCheckIn: string; stCheckOut: string; stGuests: string; stPurpose: string;
  _docId?: string; // Firestore document ID
};
type Property = { id: string; name: string; location: string; type: string; tier: string; rent: number; status: string; tenant: string; nextInspection: string; occupancy: string; beds: string; baths: string; sqft: string; photos: string[]; _docId?: string };
type Landlord = { name: string; email: string; properties: number; tier: string; revenue: string; status: string; phone: string; company: string; address: string; bankInfo: string; taxId: string; insurance: string; notes: string; _docId?: string };
type InspectionItem = string;
type CalendarEvent = { date: string; title: string; property: string; type: 'inspection' | 'booking' | 'cleaning' | 'maintenance'; tier: string; _docId?: string };
type VaultDoc = { id: string; name: string; type: string; property: string; date: string; size: string; _docId?: string };
type FeeItem = { label: string; amount: string; type: string };

const STATUS_OPTIONS = ['Pending Review', 'Background Check', 'Verification', 'Approved', 'Denied', 'On Hold', 'Waitlisted'];
const PROPERTY_TYPES = ['Apartment', 'House', 'Condo', 'Townhome', 'Duplex', 'Multi-Family', 'Studio', 'Commercial', 'Short-Term', 'Mobile Home'];
const STATUS_COLORS: Record<string, string> = { 'Pending Review': 'bg-amber-100 text-amber-700 border-amber-200', 'Background Check': 'bg-blue-100 text-blue-700 border-blue-200', 'Verification': 'bg-purple-100 text-purple-700 border-purple-200', 'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200', 'Denied': 'bg-red-100 text-red-700 border-red-200', 'On Hold': 'bg-slate-100 text-slate-600 border-slate-200', 'Waitlisted': 'bg-cyan-100 text-cyan-700 border-cyan-200', 'Occupied': 'bg-emerald-100 text-emerald-700', 'Vacant': 'bg-amber-100 text-amber-700', 'Booked': 'bg-blue-100 text-blue-700' };
const TIER_COLORS: Record<string, string> = { 'Green': 'bg-emerald-100 text-emerald-700', 'Gold': 'bg-amber-100 text-amber-700', 'Platinum': 'bg-violet-100 text-violet-700', 'Executive': 'bg-purple-100 text-purple-700' };
const CAL_COLORS: Record<string, string> = { inspection: 'bg-blue-500', booking: 'bg-purple-500', cleaning: 'bg-emerald-500', maintenance: 'bg-amber-500' };
const CAL_TEXT: Record<string, string> = { inspection: 'text-blue-700 bg-blue-50 border-blue-200', booking: 'text-purple-700 bg-purple-50 border-purple-200', cleaning: 'text-emerald-700 bg-emerald-50 border-emerald-200', maintenance: 'text-amber-700 bg-amber-50 border-amber-200' };

type SubTab = 'overview' | 'applications' | 'properties' | 'inspections' | 'landlords' | 'calendar' | 'vault';

// ─── Helpers ───
const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black tracking-wider mb-0.5">{label}</div><div className="text-sm text-slate-800 font-medium">{value || '—'}</div></div>
);
const SectionHead = ({ icon: Icon, title, color = 'text-slate-600' }: { icon: any; title: string; color?: string }) => (
  <div className={cn("flex items-center gap-2 text-xs font-black uppercase tracking-widest py-2 border-b border-slate-200 mb-3", color)}><Icon size={14} /> {title}</div>
);

const Modal = ({ open, onClose, title, subtitle, children, wide }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className={cn("bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto", wide ? "max-w-4xl w-full" : "max-w-2xl w-full")} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div><h3 className="font-black text-lg text-slate-900">{title}</h3>{subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}</div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const FieldLabel = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <label className="block text-xs font-bold text-slate-600 mb-1">{req && <span className="text-red-500 mr-0.5">*</span>}{children}</label>
);
const Input = ({ value, onChange, placeholder, type = 'text' }: any) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none" />
);
const Select = ({ value, onChange, children }: any) => (
  <select value={value} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white">{children}</select>
);

const EMPTY_APP: Application = { id: '', name: '', type: 'Tenant', email: '', phone: '', property: '', propertyType: 'Apartment', location: '', status: 'Pending Review', submitted: '', submittedTime: '', creditScore: 0, cannabis_card: false, employment: 'Pending', income: '', notes: '', dob: '', ssn_last4: '', currentAddress: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '', allergies: '', medicalConditions: '', medications: '', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '12 months', llCompany: '', llPropertyAddress: '', llTierPreference: 'Green', llInsurance: false, llNumUnits: '', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' };

export const CannaCribsManagementTab = () => {
  const [subTab, setSubTab] = useState<SubTab>('overview');
  const [appFilter, setAppFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // ═══ FIRESTORE-BACKED STATE ═══
  const [applications, setApplications] = useState<Application[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [checklist, setChecklist] = useState<InspectionItem[]>([]);
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>([]);
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([]);
  const [fees, setFees] = useState<Record<string, FeeItem>>({});

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editingApp, setEditingApp] = useState(false);
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);
  const [selectedLandlord, setSelectedLandlord] = useState<Landlord | null>(null);
  const [selectedVaultDoc, setSelectedVaultDoc] = useState<VaultDoc | null>(null);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddApplicant, setShowAddApplicant] = useState(false);
  const [showAddInspection, setShowAddInspection] = useState(false);
  const [showAddLandlord, setShowAddLandlord] = useState(false);
  const [showAddCalEvent, setShowAddCalEvent] = useState(false);
  const [showUploadVault, setShowUploadVault] = useState(false);
  const [editingProp, setEditingProp] = useState(false);
  const [editingLL, setEditingLL] = useState(false);
  const [editingFeeKey, setEditingFeeKey] = useState<string | null>(null);
  const [editingFeeVal, setEditingFeeVal] = useState('');
  const [saving, setSaving] = useState(false);

  const [newProp, setNewProp] = useState({ name: '', location: '', type: 'House', tier: 'Green', rent: '', status: 'Vacant', tenant: '', beds: '', baths: '', sqft: '' });
  const [newApp, setNewApp] = useState<Partial<Application>>({ ...EMPTY_APP });
  const [newInspItem, setNewInspItem] = useState('');
  const [newLandlord, setNewLandlord] = useState({ name: '', email: '', phone: '', company: '', tier: 'Green', properties: 1, address: '', notes: '' });
  const [newCalEvt, setNewCalEvt] = useState({ date: '', title: '', property: '', type: 'inspection' as CalendarEvent['type'], tier: 'Green' });
  const [calMonth, setCalMonth] = useState(6);

  // ═══ FIRESTORE REAL-TIME LISTENERS ═══
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Properties
    unsubs.push(onSnapshot(collection(db, 'cannacribs_properties'), (snap) => {
      const items = snap.docs.map(d => ({ ...d.data(), _docId: d.id } as Property));
      setProperties(items);
    }));

    // Applications
    unsubs.push(onSnapshot(collection(db, 'cannacribs_applications'), (snap) => {
      const items = snap.docs.map(d => ({ ...d.data(), _docId: d.id } as Application));
      items.sort((a, b) => (b.submitted || '').localeCompare(a.submitted || ''));
      setApplications(items);
    }));

    // Landlords
    unsubs.push(onSnapshot(collection(db, 'cannacribs_landlords'), (snap) => {
      const items = snap.docs.map(d => ({ ...d.data(), _docId: d.id } as Landlord));
      setLandlords(items);
    }));

    // Calendar events
    unsubs.push(onSnapshot(collection(db, 'cannacribs_calendar'), (snap) => {
      const items = snap.docs.map(d => ({ ...d.data(), _docId: d.id } as CalendarEvent));
      items.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      setCalEvents(items);
    }));

    // Vault docs
    unsubs.push(onSnapshot(collection(db, 'cannacribs_vault'), (snap) => {
      const items = snap.docs.map(d => ({ ...d.data(), _docId: d.id } as VaultDoc));
      setVaultDocs(items);
    }));

    // Config: fees
    unsubs.push(onSnapshot(doc(db, 'cannacribs_config', 'fees'), (snap) => {
      if (snap.exists()) {
        setFees((snap.data() as any).fees || {});
      }
    }));

    // Config: inspection checklist
    unsubs.push(onSnapshot(doc(db, 'cannacribs_config', 'inspection_checklist'), (snap) => {
      if (snap.exists()) {
        setChecklist((snap.data() as any).items || []);
      }
      setLoading(false);
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  const filteredApps = applications.filter(a => {
    if (appFilter === 'All') return true;
    if (appFilter === 'Tenants') return a.type === 'Tenant';
    if (appFilter === 'Landlords') return a.type === 'Landlord';
    if (appFilter === 'Short-Term') return a.type === 'Short-Term Guest';
    if (appFilter === 'Pending') return a.status === 'Pending Review';
    return true;
  });

  // ═══ FIRESTORE CRUD OPERATIONS ═══

  // Properties
  const addProperty = async () => {
    if (!newProp.name) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'cannacribs_properties'), {
        id: 'PROP-' + Date.now().toString(36).toUpperCase(),
        ...newProp, rent: Number(newProp.rent) || 0,
        nextInspection: '—', occupancy: newProp.status === 'Occupied' ? '100%' : '0%', photos: [],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
      setNewProp({ name: '', location: '', type: 'House', tier: 'Green', rent: '', status: 'Vacant', tenant: '', beds: '', baths: '', sqft: '' });
      setShowAddProperty(false);
    } catch (e) { console.error(e); alert('Error saving property'); }
    setSaving(false);
  };
  const deleteProperty = async (prop: Property) => {
    if (!prop._docId || !confirm('Delete this property?')) return;
    await deleteDoc(doc(db, 'cannacribs_properties', prop._docId));
  };
  const saveEditProperty = async (updated: Property) => {
    if (!updated._docId) return;
    setSaving(true);
    try {
      const { _docId, ...data } = updated;
      await updateDoc(doc(db, 'cannacribs_properties', _docId), { ...data, updatedAt: new Date().toISOString() });
      setSelectedProp(null); setEditingProp(false);
    } catch (e) { console.error(e); alert('Error saving'); }
    setSaving(false);
  };

  // Applications
  const addApplicant = async () => {
    if (!newApp.name) return;
    setSaving(true);
    try {
      const now = new Date();
      await addDoc(collection(db, 'cannacribs_applications'), {
        ...EMPTY_APP, ...newApp,
        id: 'CC-APP-' + Date.now().toString(36).toUpperCase(),
        submitted: now.toISOString().split('T')[0],
        submittedTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        createdAt: now.toISOString(), updatedAt: now.toISOString()
      });
      setNewApp({ ...EMPTY_APP }); setShowAddApplicant(false);
    } catch (e) { console.error(e); alert('Error saving application'); }
    setSaving(false);
  };
  const deleteApplication = async (app: Application) => {
    if (!app._docId || !confirm('Delete this application?')) return;
    await deleteDoc(doc(db, 'cannacribs_applications', app._docId));
  };
  const changeAppStatus = async (app: Application, newStatus: string) => {
    if (!app._docId) return;
    await updateDoc(doc(db, 'cannacribs_applications', app._docId), { status: newStatus, updatedAt: new Date().toISOString() });
    if (selectedApp && selectedApp._docId === app._docId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };
  const saveEditApp = async (updated: Application) => {
    if (!updated._docId) return;
    setSaving(true);
    try {
      const { _docId, ...data } = updated;
      await updateDoc(doc(db, 'cannacribs_applications', _docId), { ...data, updatedAt: new Date().toISOString() });
      setEditingApp(false);
    } catch (e) { console.error(e); alert('Error saving'); }
    setSaving(false);
  };

  // Landlords
  const addLandlordFn = async () => {
    if (!newLandlord.name) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'cannacribs_landlords'), {
        ...newLandlord, properties: Number(newLandlord.properties) || 1,
        revenue: '$0/mo', status: 'Onboarding', bankInfo: '', taxId: '', insurance: '',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
      setNewLandlord({ name: '', email: '', phone: '', company: '', tier: 'Green', properties: 1, address: '', notes: '' });
      setShowAddLandlord(false);
    } catch (e) { console.error(e); alert('Error saving landlord'); }
    setSaving(false);
  };
  const deleteLandlord = async (ll: Landlord) => {
    if (!ll._docId || !confirm('Remove this landlord?')) return;
    await deleteDoc(doc(db, 'cannacribs_landlords', ll._docId));
  };
  const saveEditLandlord = async (updated: Landlord) => {
    if (!updated._docId) return;
    setSaving(true);
    try {
      const { _docId, ...data } = updated;
      await updateDoc(doc(db, 'cannacribs_landlords', _docId), { ...data, updatedAt: new Date().toISOString() });
      setSelectedLandlord(null); setEditingLL(false);
    } catch (e) { console.error(e); alert('Error saving'); }
    setSaving(false);
  };

  // Calendar
  const addCalendarEvent = async () => {
    if (!newCalEvt.date || !newCalEvt.title) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'cannacribs_calendar'), {
        ...newCalEvt, createdAt: new Date().toISOString()
      });
      setNewCalEvt({ date: '', title: '', property: '', type: 'inspection', tier: 'Green' });
      setShowAddCalEvent(false);
    } catch (e) { console.error(e); alert('Error saving event'); }
    setSaving(false);
  };
  const deleteCalEvent = async (evt: CalendarEvent) => {
    if (!evt._docId) return;
    await deleteDoc(doc(db, 'cannacribs_calendar', evt._docId));
  };

  // Vault
  const deleteVaultDoc = async (vd: VaultDoc) => {
    if (!vd._docId || !confirm('Delete this document?')) return;
    await deleteDoc(doc(db, 'cannacribs_vault', vd._docId));
  };

  // Inspection checklist
  const addInspectionItem = async () => {
    if (!newInspItem.trim()) return;
    const updated = [...checklist, newInspItem.trim()];
    await setDoc(doc(db, 'cannacribs_config', 'inspection_checklist'), { items: updated, updatedAt: new Date().toISOString() });
    setNewInspItem(''); setShowAddInspection(false);
  };
  const deleteInspectionItem = async (idx: number) => {
    const updated = checklist.filter((_, i) => i !== idx);
    await setDoc(doc(db, 'cannacribs_config', 'inspection_checklist'), { items: updated, updatedAt: new Date().toISOString() });
  };

  // Fee schedule
  const saveFeeEdit = async (key: string, newAmount: string) => {
    if (!newAmount.trim()) return;
    const updated = { ...fees, [key]: { ...fees[key], amount: newAmount.trim() } };
    await setDoc(doc(db, 'cannacribs_config', 'fees'), { fees: updated, updatedAt: new Date().toISOString() });
    setEditingFeeKey(null); setEditingFeeVal('');
  };

  const subTabs = [
    { id: 'overview' as SubTab, label: 'Overview', icon: Activity },
    { id: 'applications' as SubTab, label: 'Applications', icon: ClipboardList },
    { id: 'properties' as SubTab, label: 'Properties', icon: Home },
    { id: 'calendar' as SubTab, label: 'Calendar', icon: Calendar },
    { id: 'inspections' as SubTab, label: 'Inspections', icon: Eye },
    { id: 'vault' as SubTab, label: 'Vault', icon: FolderLock },
    { id: 'landlords' as SubTab, label: 'Landlords', icon: Users },
  ];

  // ─── Render full app detail content ───
  const renderAppDetail = (app: Application) => (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={app.status} onChange={(e: any) => changeAppStatus(app, e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <span className="text-xs text-slate-400">Submitted {app.submitted} at {app.submittedTime}</span>
      </div>

      {/* Contact Info */}
      <SectionHead icon={User} title="Contact Information" color="text-blue-600" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <InfoBlock label="Email" value={app.email} />
        <InfoBlock label="Phone" value={app.phone} />
        <InfoBlock label="Date of Birth" value={app.dob} />
        <InfoBlock label="SSN (Last 4)" value={app.ssn_last4 ? `****${app.ssn_last4}` : '—'} />
        <InfoBlock label="Current Address" value={app.currentAddress} />
        <InfoBlock label="Type" value={app.type} />
      </div>

      {/* Property Applied For */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-[10px] text-green-600 uppercase font-bold mb-1">Property Applied For</div>
        <div className="text-sm text-slate-900 font-bold">{app.property}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {app.location} • {app.propertyType}</div>
      </div>

      {/* Tenant-specific */}
      {app.type === 'Tenant' && (<>
        <SectionHead icon={ShieldCheck} title="Screening & Verification" color="text-green-600" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-lg font-black text-slate-900">{app.creditScore}</div><div className="text-[10px] text-slate-400 font-bold uppercase">Credit Score</div></div>
          <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-lg font-black text-slate-900">{app.cannabis_card ? '✅' : '❌'}</div><div className="text-[10px] text-slate-400 font-bold uppercase">Cannabis Card</div></div>
          <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-lg font-black text-slate-900">{app.employment}</div><div className="text-[10px] text-slate-400 font-bold uppercase">Employment</div></div>
          <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-lg font-black text-slate-900">{app.income}</div><div className="text-[10px] text-slate-400 font-bold uppercase">Income</div></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <InfoBlock label="Desired Move-In" value={app.moveInDate} />
          <InfoBlock label="Lease Term" value={app.leaseTerm} />
          <InfoBlock label="Reason for Moving" value={app.reasonForMoving} />
          <InfoBlock label="Pets" value={app.pets} />
          <InfoBlock label="Vehicles" value={app.vehicles} />
          <InfoBlock label="Previous Landlord" value={`${app.previousLandlord} ${app.previousLandlordPhone}`} />
        </div>
      </>)}

      {/* Landlord-specific */}
      {app.type === 'Landlord' && (<>
        <SectionHead icon={Building2} title="Landlord Details" color="text-purple-600" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <InfoBlock label="Company/LLC" value={app.llCompany} />
          <InfoBlock label="Property Address" value={app.llPropertyAddress} />
          <InfoBlock label="Tier Preference" value={app.llTierPreference} />
          <InfoBlock label="# Units" value={app.llNumUnits} />
          <InfoBlock label="Has Insurance" value={app.llInsurance ? 'Yes' : 'No'} />
        </div>
      </>)}

      {/* Short-term specific */}
      {app.type === 'Short-Term Guest' && (<>
        <SectionHead icon={Calendar} title="Stay Details" color="text-amber-600" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoBlock label="Check-In" value={app.stCheckIn} />
          <InfoBlock label="Check-Out" value={app.stCheckOut} />
          <InfoBlock label="# Guests" value={app.stGuests} />
          <InfoBlock label="Purpose" value={app.stPurpose} />
        </div>
      </>)}

      {/* Emergency & Medical */}
      <SectionHead icon={AlertCircle} title="Emergency Contact & Medical" color="text-red-600" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <InfoBlock label="Emergency Contact" value={app.emergencyName} />
        <InfoBlock label="Emergency Phone" value={app.emergencyPhone} />
        <InfoBlock label="Relationship" value={app.emergencyRelation} />
        <InfoBlock label="Allergies" value={app.allergies} />
        <InfoBlock label="Medical Conditions" value={app.medicalConditions} />
        <InfoBlock label="Medications" value={app.medications} />
      </div>

      {app.notes && <div className="p-3 bg-amber-50 rounded-lg border border-amber-200"><div className="text-[10px] text-amber-600 uppercase font-bold mb-1">Notes</div><div className="text-sm text-slate-700">{app.notes}</div></div>}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button onClick={() => changeAppStatus(app, 'Approved')} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"><CheckCircle size={16} /> Approve</button>
        <button onClick={() => changeAppStatus(app, 'Denied')} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><XCircle size={16} /> Deny</button>
        <button onClick={() => setEditingApp(true)} className="py-3 px-4 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
        <button className="py-3 px-4 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 text-sm flex items-center justify-center gap-2"><Mail size={16} /> Msg</button>
      </div>
    </div>
  );

  // ─── Render app edit form ───
  const renderAppEdit = (app: Application) => {
    const u = (field: keyof Application, val: any) => setSelectedApp({ ...app, [field]: val } as Application);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel req>Name</FieldLabel><Input value={app.name} onChange={(e: any) => u('name', e.target.value)} /></div>
          <div><FieldLabel>Email</FieldLabel><Input value={app.email} onChange={(e: any) => u('email', e.target.value)} /></div>
          <div><FieldLabel>Phone</FieldLabel><Input value={app.phone} onChange={(e: any) => u('phone', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel>Type</FieldLabel><Select value={app.type} onChange={(e: any) => u('type', e.target.value)}><option>Tenant</option><option>Landlord</option><option>Short-Term Guest</option></Select></div>
          <div><FieldLabel>Property Type</FieldLabel><Select value={app.propertyType} onChange={(e: any) => u('propertyType', e.target.value)}>{PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}</Select></div>
          <div><FieldLabel>Status</FieldLabel><Select value={app.status} onChange={(e: any) => u('status', e.target.value)}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</Select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><FieldLabel>Property</FieldLabel><Input value={app.property} onChange={(e: any) => u('property', e.target.value)} /></div>
          <div><FieldLabel>Location</FieldLabel><Input value={app.location} onChange={(e: any) => u('location', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel>DOB</FieldLabel><Input type="date" value={app.dob} onChange={(e: any) => u('dob', e.target.value)} /></div>
          <div><FieldLabel>Current Address</FieldLabel><Input value={app.currentAddress} onChange={(e: any) => u('currentAddress', e.target.value)} /></div>
          <div><FieldLabel>Income</FieldLabel><Input value={app.income} onChange={(e: any) => u('income', e.target.value)} /></div>
        </div>
        <SectionHead icon={AlertCircle} title="Emergency & Medical" color="text-red-600" />
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel>Emergency Contact</FieldLabel><Input value={app.emergencyName} onChange={(e: any) => u('emergencyName', e.target.value)} /></div>
          <div><FieldLabel>Emergency Phone</FieldLabel><Input value={app.emergencyPhone} onChange={(e: any) => u('emergencyPhone', e.target.value)} /></div>
          <div><FieldLabel>Relationship</FieldLabel><Input value={app.emergencyRelation} onChange={(e: any) => u('emergencyRelation', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><FieldLabel>Allergies</FieldLabel><Input value={app.allergies} onChange={(e: any) => u('allergies', e.target.value)} /></div>
          <div><FieldLabel>Medical Conditions</FieldLabel><Input value={app.medicalConditions} onChange={(e: any) => u('medicalConditions', e.target.value)} /></div>
          <div><FieldLabel>Medications</FieldLabel><Input value={app.medications} onChange={(e: any) => u('medications', e.target.value)} /></div>
        </div>
        <div><FieldLabel>Notes</FieldLabel><textarea value={app.notes} onChange={(e) => u('notes', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none" rows={2} /></div>
        <div className="flex gap-3 pt-2">
          <button onClick={() => saveEditApp(app)} disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes</button>
          <button onClick={() => setEditingApp(false)} className="py-3 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    );
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-500">Loading CannaCribs data...</p>
        </div>
      </div>
    );
  }

  // ─── Fee entries ───
  const feeEntries = Object.entries(fees);

  // ─── Revenue calculation ───
  const tierPricing: Record<string, number> = { 'Green': 49, 'Gold': 149, 'Platinum': 299, 'Executive': 499 };
  const tierRevenue = ['Green', 'Gold', 'Platinum', 'Executive'].map(tier => {
    const count = properties.filter(p => p.tier === tier).length;
    return { tier, count, revenue: count * tierPricing[tier] };
  });
  const totalTierRevenue = tierRevenue.reduce((sum, t) => sum + t.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20"><Leaf className="text-white" size={24} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2"><span className="text-green-600">Canna</span><span className="text-amber-500">Cribs</span><span className="text-slate-400 text-sm font-bold">Management</span></h1>
            <p className="text-xs text-slate-500">Cannabis-Friendly Real Estate Platform — <span className="text-emerald-600 font-bold">Live Production</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/cannacribs" target="_blank" className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all flex items-center gap-1.5"><Eye size={14} /> View Live Site</a>
          <button onClick={() => setShowAddProperty(true)} className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all shadow-sm flex items-center gap-1.5"><Plus size={14} /> Add Property</button>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap', subTab === t.id ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700')}><t.icon size={14} />{t.label}</button>
        ))}
      </div>

      {/* ═══ ADD PROPERTY MODAL ═══ */}
      <Modal open={showAddProperty} onClose={() => setShowAddProperty(false)} title="Add New Property" subtitle="List a new cannabis-friendly property">
        <div className="space-y-4">
          <div><FieldLabel req>Property Name</FieldLabel><Input value={newProp.name} onChange={(e: any) => setNewProp(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Cannabis-Friendly Loft" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel req>Location</FieldLabel><Input value={newProp.location} onChange={(e: any) => setNewProp(p => ({ ...p, location: e.target.value }))} placeholder="City, State" /></div>
            <div><FieldLabel>Property Type</FieldLabel><Select value={newProp.type} onChange={(e: any) => setNewProp(p => ({ ...p, type: e.target.value }))}>{PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}</Select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel>Beds</FieldLabel><Input value={newProp.beds} onChange={(e: any) => setNewProp(p => ({ ...p, beds: e.target.value }))} placeholder="3" /></div>
            <div><FieldLabel>Baths</FieldLabel><Input value={newProp.baths} onChange={(e: any) => setNewProp(p => ({ ...p, baths: e.target.value }))} placeholder="2" /></div>
            <div><FieldLabel>Sq Ft</FieldLabel><Input value={newProp.sqft} onChange={(e: any) => setNewProp(p => ({ ...p, sqft: e.target.value }))} placeholder="1500" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel req>Rent/Night $</FieldLabel><Input value={newProp.rent} onChange={(e: any) => setNewProp(p => ({ ...p, rent: e.target.value }))} placeholder="1450" /></div>
            <div><FieldLabel>Service Tier</FieldLabel><Select value={newProp.tier} onChange={(e: any) => setNewProp(p => ({ ...p, tier: e.target.value }))}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div>
            <div><FieldLabel>Status</FieldLabel><Select value={newProp.status} onChange={(e: any) => setNewProp(p => ({ ...p, status: e.target.value }))}><option>Vacant</option><option>Occupied</option><option>Booked</option></Select></div>
          </div>
          <div><FieldLabel>Current Tenant</FieldLabel><Input value={newProp.tenant} onChange={(e: any) => setNewProp(p => ({ ...p, tenant: e.target.value }))} placeholder="—" /></div>
          <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer bg-green-50/50"><Upload className="mx-auto text-green-500 mb-2" size={28} /><p className="text-sm font-bold text-green-700">Upload Property Photos</p><p className="text-xs text-green-500 mt-1">JPG, PNG — max 10 MB each</p></div>
          <button onClick={addProperty} disabled={saving} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Property</button>
        </div>
      </Modal>

      {/* ═══ ADD APPLICANT MODAL ═══ */}
      <Modal open={showAddApplicant} onClose={() => setShowAddApplicant(false)} title="Add Applicant" subtitle="Manually add a new application" wide>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel req>Full Name</FieldLabel><Input value={newApp.name} onChange={(e: any) => setNewApp(a => ({ ...a, name: e.target.value }))} placeholder="Full name" /></div>
            <div><FieldLabel>Type (Who)</FieldLabel><Select value={newApp.type} onChange={(e: any) => setNewApp(a => ({ ...a, type: e.target.value }))}><option>Tenant</option><option>Landlord</option><option>Short-Term Guest</option></Select></div>
            <div><FieldLabel>Status</FieldLabel><Select value={newApp.status} onChange={(e: any) => setNewApp(a => ({ ...a, status: e.target.value }))}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</Select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel req>Email</FieldLabel><Input value={newApp.email} onChange={(e: any) => setNewApp(a => ({ ...a, email: e.target.value }))} placeholder="email@example.com" type="email" /></div>
            <div><FieldLabel>Phone</FieldLabel><Input value={newApp.phone} onChange={(e: any) => setNewApp(a => ({ ...a, phone: e.target.value }))} placeholder="(555) 000-0000" /></div>
            <div><FieldLabel>Property Type (What)</FieldLabel><Select value={newApp.propertyType} onChange={(e: any) => setNewApp(a => ({ ...a, propertyType: e.target.value }))}>{PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}</Select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Property Name</FieldLabel><Input value={newApp.property} onChange={(e: any) => setNewApp(a => ({ ...a, property: e.target.value }))} placeholder="Property applied for" /></div>
            <div><FieldLabel>Location</FieldLabel><Input value={newApp.location} onChange={(e: any) => setNewApp(a => ({ ...a, location: e.target.value }))} placeholder="City, State" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><FieldLabel>Desired Date</FieldLabel><Input type="date" value={newApp.moveInDate} onChange={(e: any) => setNewApp(a => ({ ...a, moveInDate: e.target.value }))} /></div>
            <div><FieldLabel>Preferred Time</FieldLabel><Input type="time" value={newApp.submittedTime} onChange={(e: any) => setNewApp(a => ({ ...a, submittedTime: e.target.value }))} /></div>
          </div>
          <SectionHead icon={AlertCircle} title="Emergency & Medical" color="text-red-600" />
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel>Emergency Contact</FieldLabel><Input value={newApp.emergencyName} onChange={(e: any) => setNewApp(a => ({ ...a, emergencyName: e.target.value }))} /></div>
            <div><FieldLabel>Emergency Phone</FieldLabel><Input value={newApp.emergencyPhone} onChange={(e: any) => setNewApp(a => ({ ...a, emergencyPhone: e.target.value }))} /></div>
            <div><FieldLabel>Relationship</FieldLabel><Input value={newApp.emergencyRelation} onChange={(e: any) => setNewApp(a => ({ ...a, emergencyRelation: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><FieldLabel>Allergies</FieldLabel><Input value={newApp.allergies} onChange={(e: any) => setNewApp(a => ({ ...a, allergies: e.target.value }))} /></div>
            <div><FieldLabel>Medical Conditions</FieldLabel><Input value={newApp.medicalConditions} onChange={(e: any) => setNewApp(a => ({ ...a, medicalConditions: e.target.value }))} /></div>
            <div><FieldLabel>Medications</FieldLabel><Input value={newApp.medications} onChange={(e: any) => setNewApp(a => ({ ...a, medications: e.target.value }))} /></div>
          </div>
          <div><FieldLabel>Notes</FieldLabel><textarea value={newApp.notes} onChange={(e) => setNewApp(a => ({ ...a, notes: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none" rows={2} placeholder="Optional notes..." /></div>
          <button onClick={addApplicant} disabled={saving} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Applicant</button>
        </div>
      </Modal>

      {/* ═══ ADD LANDLORD ═══ */}
      <Modal open={showAddLandlord} onClose={() => setShowAddLandlord(false)} title="Onboard Landlord">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Name</FieldLabel><Input value={newLandlord.name} onChange={(e: any) => setNewLandlord(l => ({ ...l, name: e.target.value }))} /></div><div><FieldLabel>Company</FieldLabel><Input value={newLandlord.company} onChange={(e: any) => setNewLandlord(l => ({ ...l, company: e.target.value }))} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Email</FieldLabel><Input value={newLandlord.email} onChange={(e: any) => setNewLandlord(l => ({ ...l, email: e.target.value }))} type="email" /></div><div><FieldLabel>Phone</FieldLabel><Input value={newLandlord.phone} onChange={(e: any) => setNewLandlord(l => ({ ...l, phone: e.target.value }))} /></div></div>
          <div className="grid grid-cols-3 gap-4"><div><FieldLabel>Tier</FieldLabel><Select value={newLandlord.tier} onChange={(e: any) => setNewLandlord(l => ({ ...l, tier: e.target.value }))}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div><div><FieldLabel># Properties</FieldLabel><Input value={String(newLandlord.properties)} onChange={(e: any) => setNewLandlord(l => ({ ...l, properties: Number(e.target.value) || 1 }))} type="number" /></div><div><FieldLabel>Address</FieldLabel><Input value={newLandlord.address} onChange={(e: any) => setNewLandlord(l => ({ ...l, address: e.target.value }))} /></div></div>
          <div><FieldLabel>Notes</FieldLabel><textarea value={newLandlord.notes} onChange={(e) => setNewLandlord(l => ({ ...l, notes: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none" rows={2} /></div>
          <button onClick={addLandlordFn} disabled={saving} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Onboard Landlord</button>
        </div>
      </Modal>

      {/* ═══ CALENDAR EVENT / INSPECTION / VAULT MODALS ═══ */}
      <Modal open={showAddCalEvent} onClose={() => setShowAddCalEvent(false)} title="Add Calendar Event"><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Date</FieldLabel><Input type="date" value={newCalEvt.date} onChange={(e: any) => setNewCalEvt(c => ({ ...c, date: e.target.value }))} /></div><div><FieldLabel>Type</FieldLabel><Select value={newCalEvt.type} onChange={(e: any) => setNewCalEvt(c => ({ ...c, type: e.target.value }))}><option value="inspection">🔍 Inspection</option><option value="booking">📅 Booking</option><option value="cleaning">✨ Cleaning</option><option value="maintenance">🔧 Maintenance</option></Select></div></div><div><FieldLabel req>Title</FieldLabel><Input value={newCalEvt.title} onChange={(e: any) => setNewCalEvt(c => ({ ...c, title: e.target.value }))} placeholder="Event title" /></div><div className="grid grid-cols-2 gap-4"><div><FieldLabel>Property</FieldLabel><Select value={newCalEvt.property} onChange={(e: any) => setNewCalEvt(c => ({ ...c, property: e.target.value }))}><option value="">Select</option>{properties.map(p => <option key={p._docId || p.id} value={p.name}>{p.name}</option>)}</Select></div><div><FieldLabel>Tier</FieldLabel><Select value={newCalEvt.tier} onChange={(e: any) => setNewCalEvt(c => ({ ...c, tier: e.target.value }))}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div></div><button onClick={addCalendarEvent} disabled={saving} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Event</button></div></Modal>

      <Modal open={showUploadVault} onClose={() => setShowUploadVault(false)} title="Upload Document"><div className="space-y-4"><div className="border-2 border-dashed border-violet-300 rounded-xl p-8 text-center hover:border-violet-500 cursor-pointer bg-violet-50/50"><Upload className="mx-auto text-violet-500 mb-2" size={36} /><p className="text-sm font-bold text-violet-700">Drag & Drop or Click to Upload</p><p className="text-xs text-violet-500 mt-1">PDF, JPG, PNG, DOCX — max 25 MB</p></div><div className="grid grid-cols-2 gap-4"><div><FieldLabel>Type</FieldLabel><Select><option>Lease</option><option>Inspection</option><option>Contract</option><option>ID Docs</option><option>Photos</option><option>Insurance</option><option>Other</option></Select></div><div><FieldLabel>Property</FieldLabel><Select><option value="">General</option>{properties.map(p => <option key={p._docId || p.id}>{p.name}</option>)}</Select></div></div><button onClick={() => { setShowUploadVault(false); alert('Upload will connect to storage backend.'); }} className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Upload size={16} /> Upload</button></div></Modal>

      <Modal open={showAddInspection} onClose={() => setShowAddInspection(false)} title="Add Inspection Item"><div className="space-y-4"><div><FieldLabel req>Item Name</FieldLabel><Input value={newInspItem} onChange={(e: any) => setNewInspItem(e.target.value)} placeholder="e.g. Carbon Filter Check" /></div><button onClick={addInspectionItem} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Add</button></div></Modal>

      {/* ═══ APPLICATION DETAIL MODAL ═══ */}
      {selectedApp && (
        <Modal open={!!selectedApp} onClose={() => { setSelectedApp(null); setEditingApp(false); }} title={editingApp ? `Edit: ${selectedApp.name}` : selectedApp.name} subtitle={`${selectedApp.id} • ${selectedApp.type} Application`} wide>
          {editingApp ? renderAppEdit(selectedApp) : renderAppDetail(selectedApp)}
        </Modal>
      )}

      {/* ═══ PROPERTY DETAIL / EDIT MODAL ═══ */}
      {selectedProp && (
        <Modal open={!!selectedProp} onClose={() => { setSelectedProp(null); setEditingProp(false); }} title={editingProp ? 'Edit Property' : selectedProp.name} subtitle={selectedProp.id} wide>
          {editingProp ? (
            <div className="space-y-4">
              <div><FieldLabel req>Name</FieldLabel><Input value={selectedProp.name} onChange={(e: any) => setSelectedProp({ ...selectedProp, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4"><div><FieldLabel>Location</FieldLabel><Input value={selectedProp.location} onChange={(e: any) => setSelectedProp({ ...selectedProp, location: e.target.value })} /></div><div><FieldLabel>Type</FieldLabel><Select value={selectedProp.type} onChange={(e: any) => setSelectedProp({ ...selectedProp, type: e.target.value })}>{PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}</Select></div></div>
              <div className="grid grid-cols-4 gap-4"><div><FieldLabel>Rent $</FieldLabel><Input value={String(selectedProp.rent)} onChange={(e: any) => setSelectedProp({ ...selectedProp, rent: Number(e.target.value) || 0 })} /></div><div><FieldLabel>Tier</FieldLabel><Select value={selectedProp.tier} onChange={(e: any) => setSelectedProp({ ...selectedProp, tier: e.target.value })}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div><div><FieldLabel>Status</FieldLabel><Select value={selectedProp.status} onChange={(e: any) => setSelectedProp({ ...selectedProp, status: e.target.value })}><option>Vacant</option><option>Occupied</option><option>Booked</option></Select></div><div><FieldLabel>Tenant</FieldLabel><Input value={selectedProp.tenant} onChange={(e: any) => setSelectedProp({ ...selectedProp, tenant: e.target.value })} /></div></div>
              <div className="grid grid-cols-3 gap-4"><div><FieldLabel>Beds</FieldLabel><Input value={selectedProp.beds} onChange={(e: any) => setSelectedProp({ ...selectedProp, beds: e.target.value })} /></div><div><FieldLabel>Baths</FieldLabel><Input value={selectedProp.baths} onChange={(e: any) => setSelectedProp({ ...selectedProp, baths: e.target.value })} /></div><div><FieldLabel>Sq Ft</FieldLabel><Input value={selectedProp.sqft} onChange={(e: any) => setSelectedProp({ ...selectedProp, sqft: e.target.value })} /></div></div>
              <div><FieldLabel>Next Inspection</FieldLabel><Input type="date" value={selectedProp.nextInspection} onChange={(e: any) => setSelectedProp({ ...selectedProp, nextInspection: e.target.value })} /></div>
              <button onClick={() => saveEditProperty(selectedProp)} disabled={saving} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-center"><div className="text-xl font-black text-green-600">${selectedProp.rent?.toLocaleString()}</div><div className="text-[10px] text-slate-400 font-bold">{selectedProp.type === 'Short-Term' ? '/night' : '/mo'}</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-xl font-black">{selectedProp.beds}/{selectedProp.baths}</div><div className="text-[10px] text-slate-400 font-bold">Beds/Baths</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-xl font-black">{selectedProp.sqft}</div><div className="text-[10px] text-slate-400 font-bold">Sq Ft</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-xl font-black">{selectedProp.occupancy}</div><div className="text-[10px] text-slate-400 font-bold">Occupancy</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4"><InfoBlock label="Location" value={selectedProp.location} /><InfoBlock label="Tenant" value={selectedProp.tenant} /></div>
              <div className="grid grid-cols-3 gap-4"><InfoBlock label="Type" value={selectedProp.type} /><div className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black mb-0.5">Tier</div><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", TIER_COLORS[selectedProp.tier])}>{selectedProp.tier}</span></div><InfoBlock label="Next Inspection" value={selectedProp.nextInspection} /></div>
              <div className="flex gap-3">
                <button onClick={() => setEditingProp(true)} className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
                <button onClick={() => { deleteProperty(selectedProp); setSelectedProp(null); }} className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ═══ LANDLORD DETAIL / EDIT MODAL ═══ */}
      {selectedLandlord && (
        <Modal open={!!selectedLandlord} onClose={() => { setSelectedLandlord(null); setEditingLL(false); }} title={editingLL ? 'Edit Landlord' : selectedLandlord.name} subtitle={selectedLandlord.company || 'Independent Landlord'} wide>
          {editingLL ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Name</FieldLabel><Input value={selectedLandlord.name} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, name: e.target.value })} /></div><div><FieldLabel>Company</FieldLabel><Input value={selectedLandlord.company} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, company: e.target.value })} /></div></div>
              <div className="grid grid-cols-2 gap-4"><div><FieldLabel>Email</FieldLabel><Input value={selectedLandlord.email} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, email: e.target.value })} /></div><div><FieldLabel>Phone</FieldLabel><Input value={selectedLandlord.phone} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, phone: e.target.value })} /></div></div>
              <div><FieldLabel>Address</FieldLabel><Input value={selectedLandlord.address} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, address: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4"><div><FieldLabel>Tier</FieldLabel><Select value={selectedLandlord.tier} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, tier: e.target.value })}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div><div><FieldLabel>Properties</FieldLabel><Input value={String(selectedLandlord.properties)} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, properties: Number(e.target.value) || 1 })} type="number" /></div><div><FieldLabel>Status</FieldLabel><Select value={selectedLandlord.status} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, status: e.target.value })}><option>Active</option><option>Onboarding</option><option>Inactive</option></Select></div></div>
              <div><FieldLabel>Notes</FieldLabel><textarea value={selectedLandlord.notes} onChange={(e) => setSelectedLandlord({ ...selectedLandlord, notes: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none resize-none" rows={2} /></div>
              <button onClick={() => saveEditLandlord(selectedLandlord)} disabled={saving} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save</button>
            </div>
          ) : (
            <div className="space-y-4">
              <SectionHead icon={User} title="Contact Information" color="text-blue-600" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3"><InfoBlock label="Email" value={selectedLandlord.email} /><InfoBlock label="Phone" value={selectedLandlord.phone} /><InfoBlock label="Company" value={selectedLandlord.company || '—'} /><InfoBlock label="Address" value={selectedLandlord.address} /><InfoBlock label="Tax ID" value={selectedLandlord.taxId} /><InfoBlock label="Bank Info" value={selectedLandlord.bankInfo} /></div>
              <SectionHead icon={Building2} title="Property & Business" color="text-purple-600" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg text-center"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", TIER_COLORS[selectedLandlord.tier])}>{selectedLandlord.tier}</span><div className="text-[10px] text-slate-400 mt-1">Tier</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-xl font-black">{selectedLandlord.properties}</div><div className="text-[10px] text-slate-400">Properties</div></div>
                <div className="p-3 bg-green-50 rounded-lg text-center"><div className="text-xl font-black text-green-600">{selectedLandlord.revenue}</div><div className="text-[10px] text-slate-400">Revenue</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-sm font-bold">{selectedLandlord.insurance}</div><div className="text-[10px] text-slate-400">Insurance</div></div>
              </div>
              {selectedLandlord.notes && <div className="p-3 bg-amber-50 rounded-lg border border-amber-200"><div className="text-[10px] text-amber-600 uppercase font-bold mb-1">Notes</div><div className="text-sm text-slate-700">{selectedLandlord.notes}</div></div>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingLL(true)} className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
                <button onClick={() => { deleteLandlord(selectedLandlord); setSelectedLandlord(null); }} className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ═══ VAULT DOC PREVIEW MODAL ═══ */}
      {selectedVaultDoc && (
        <Modal open={!!selectedVaultDoc} onClose={() => setSelectedVaultDoc(null)} title={selectedVaultDoc.name} subtitle={`${selectedVaultDoc.id} • ${selectedVaultDoc.type}`}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3"><InfoBlock label="Document Type" value={selectedVaultDoc.type} /><InfoBlock label="Property" value={selectedVaultDoc.property} /><InfoBlock label="Date Added" value={selectedVaultDoc.date} /><InfoBlock label="File Size" value={selectedVaultDoc.size} /></div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center bg-slate-50"><FileImage className="mx-auto text-slate-300 mb-3" size={48} /><p className="text-sm text-slate-500 font-bold">Document Preview</p><p className="text-xs text-slate-400 mt-1">Preview will render here when storage backend is connected</p></div>
            <div className="flex gap-3"><button className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Download size={16} /> Download</button><button onClick={() => { deleteVaultDoc(selectedVaultDoc); setSelectedVaultDoc(null); }} className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button></div>
          </div>
        </Modal>
      )}

      {/* ═══════════ TAB CONTENT ═══════════ */}

      {/* ═══ OVERVIEW ═══ */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ label: 'Total Properties', value: String(properties.length), change: `${properties.filter(p => p.status === 'Occupied').length} occupied`, icon: Home, color: 'text-green-600', bg: 'bg-green-50' },{ label: 'Active Tenants', value: String(properties.filter(p => p.status === 'Occupied').length), change: `${properties.length > 0 ? Math.round((properties.filter(p => p.status === 'Occupied').length / properties.length) * 100) : 0}% occupancy`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },{ label: 'Pending Apps', value: String(applications.filter(a => a.status === 'Pending Review').length), change: 'Review needed', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },{ label: 'Monthly Revenue', value: `$${totalTierRevenue.toLocaleString()}`, change: `${landlords.length} landlords`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' }].map((k, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all"><div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', k.bg)}><k.icon size={18} className={k.color} /></div><div className="text-2xl font-black text-slate-900">{k.value}</div><div className="text-xs text-slate-500 font-medium">{k.label}</div><div className="text-[10px] text-emerald-600 font-bold mt-1">{k.change}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-green-600" />Revenue by Service Tier</h3><div className="space-y-3">{tierRevenue.map((r, i) => (<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"><div className="flex items-center gap-3"><div className={cn('w-3 h-3 rounded-full', r.tier === 'Green' ? 'bg-emerald-500' : r.tier === 'Gold' ? 'bg-amber-500' : r.tier === 'Platinum' ? 'bg-violet-500' : 'bg-purple-500')} /><span className="text-sm font-bold text-slate-700">{r.tier}</span><span className="text-xs text-slate-400">{r.count} properties</span></div><span className="text-sm font-black text-slate-900">${r.revenue.toLocaleString()}/mo</span></div>))}<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"><span className="text-sm font-black text-green-700">Total Tier Revenue</span><span className="text-lg font-black text-green-700">${totalTierRevenue.toLocaleString()}/mo</span></div></div></div>
            <div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><Activity size={16} className="text-blue-600" />Recent Applications</h3><div className="space-y-3">{applications.slice(0, 4).map((app, i) => (<div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100" onClick={() => { setSelectedApp(app); setEditingApp(false); }}><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase', app.type === 'Tenant' ? 'bg-blue-100 text-blue-700' : app.type === 'Landlord' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700')}>{app.type}</span><div className="flex-1"><p className="text-xs text-slate-700 font-medium">{app.name} — {app.property}</p><p className="text-[10px] text-slate-400 mt-0.5">{app.submitted}</p></div><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', STATUS_COLORS[app.status])}>{app.status}</span></div>))}{applications.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No applications yet</p>}</div></div>
          </div>
          {/* Fee Schedule — Editable */}
          <div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><CreditCard size={16} className="text-violet-600" />Tenant & Guest Fee Schedule <span className="text-[9px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full font-bold ml-2">Click amount to edit</span></h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{feeEntries.map(([key, fee]) => (<div key={key} className="p-3 bg-slate-50 rounded-lg text-center group cursor-pointer hover:bg-green-50 transition-colors" onClick={() => { if (editingFeeKey !== key) { setEditingFeeKey(key); setEditingFeeVal(fee.amount); } }}>{editingFeeKey === key ? (<div className="space-y-2" onClick={e => e.stopPropagation()}><input autoFocus value={editingFeeVal} onChange={e => setEditingFeeVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') saveFeeEdit(key, editingFeeVal); if (e.key === 'Escape') setEditingFeeKey(null); }} className="w-full px-2 py-1 text-center text-lg font-black text-green-600 border border-green-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20" /><div className="flex gap-1"><button onClick={() => saveFeeEdit(key, editingFeeVal)} className="flex-1 text-[10px] font-bold text-white bg-green-600 rounded px-2 py-0.5">Save</button><button onClick={() => setEditingFeeKey(null)} className="text-[10px] font-bold text-slate-500 bg-slate-200 rounded px-2 py-0.5">Cancel</button></div></div>) : (<><div className="text-lg font-black text-green-600 group-hover:text-green-700">{fee.amount}</div><div className="text-xs font-bold text-slate-700">{fee.label}</div><div className="text-[10px] text-slate-400">{fee.type}</div></>)}</div>))}{feeEntries.length === 0 && <p className="col-span-4 text-xs text-slate-400 text-center py-4">Fee schedule loading...</p>}</div></div>
        </div>
      )}

      {/* ═══ APPLICATIONS ═══ */}
      {subTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Filter size={14} className="text-slate-400" />{['All', 'Tenants', 'Landlords', 'Short-Term', 'Pending'].map(f => (<button key={f} onClick={() => setAppFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-xs font-bold transition-all', appFilter === f ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>{f}</button>))}</div>
            <button onClick={() => setShowAddApplicant(true)} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 flex items-center gap-1.5"><Plus size={14} /> Add Applicant</button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Applicant</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Type</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Property</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Submitted</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Actions</th></tr></thead>
              <tbody>{filteredApps.map((app, i) => (
                <tr key={app._docId || i} className="border-b border-slate-100 hover:bg-green-50/30 transition-colors cursor-pointer" onClick={() => { setSelectedApp(app); setEditingApp(false); }}>
                  <td className="p-3"><div className="font-bold text-sm text-slate-900 hover:text-green-600">{app.name}</div><div className="text-xs text-slate-400">{app.email}</div></td>
                  <td className="p-3"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', app.type === 'Tenant' ? 'bg-blue-100 text-blue-700' : app.type === 'Landlord' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700')}>{app.type}</span></td>
                  <td className="p-3"><div className="text-xs text-slate-700 font-medium">{app.property}</div><div className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={8} /> {app.location} • {app.propertyType}</div></td>
                  <td className="p-3"><select value={app.status} onClick={e => e.stopPropagation()} onChange={e => changeAppStatus(app, e.target.value)} className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border outline-none cursor-pointer', STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-600 border-slate-200')}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                  <td className="p-3 text-xs text-slate-500">{app.submitted}</td>
                  <td className="p-3" onClick={e => e.stopPropagation()}><div className="flex gap-1">
                    <button onClick={() => { setSelectedApp(app); setEditingApp(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg" title="View"><Eye size={14} className="text-slate-400" /></button>
                    <button onClick={() => { setSelectedApp(app); setEditingApp(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={14} className="text-blue-500" /></button>
                    <button onClick={() => deleteApplication(app)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
            {filteredApps.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No applications found</div>}
          </div>
        </div>
      )}

      {/* ═══ PROPERTIES ═══ */}
      {subTab === 'properties' && (<div className="space-y-4"><div className="flex justify-end"><button onClick={() => setShowAddProperty(true)} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 flex items-center gap-1.5"><Plus size={14} /> Add Property</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{properties.map((prop, i) => (<div key={prop._docId || i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group" onClick={() => { setSelectedProp(prop); setEditingProp(false); }}><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">{prop.type === 'House' && <Home size={14} className="text-green-600" />}{prop.type === 'Apartment' && <Building2 size={14} className="text-green-600" />}{prop.type === 'Short-Term' && <Star size={14} className="text-green-600" />}{prop.type === 'Commercial' && <Briefcase size={14} className="text-green-600" />}{!['House','Apartment','Short-Term','Commercial'].includes(prop.type) && <Home size={14} className="text-green-600" />}</div><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase', TIER_COLORS[prop.tier])}>{prop.tier}</span></div><div className="flex items-center gap-1"><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', STATUS_COLORS[prop.status] || 'bg-slate-100 text-slate-600')}>{prop.status}</span><div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity" onClick={e => e.stopPropagation()}><button onClick={() => { setSelectedProp(prop); setEditingProp(true); }} className="p-1 hover:bg-blue-50 rounded"><Edit size={12} className="text-blue-500" /></button><button onClick={() => deleteProperty(prop)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400" /></button></div></div></div><h4 className="font-bold text-slate-900 text-sm mb-1">{prop.name}</h4><p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin size={10} /> {prop.location}</p><div className="grid grid-cols-3 gap-2 text-center mb-3"><div className="p-2 bg-slate-50 rounded-lg"><div className="text-sm font-black text-green-600">${prop.rent?.toLocaleString()}</div><div className="text-[9px] text-slate-400">{prop.type === 'Short-Term' ? '/night' : '/mo'}</div></div><div className="p-2 bg-slate-50 rounded-lg"><div className="text-sm font-black">{prop.occupancy}</div><div className="text-[9px] text-slate-400">Occupancy</div></div><div className="p-2 bg-slate-50 rounded-lg"><div className="text-sm font-black">{prop.beds}/{prop.baths}</div><div className="text-[9px] text-slate-400">Bed/Bath</div></div></div><div className="text-xs text-slate-500 border-t border-slate-100 pt-2"><span className="font-semibold">Tenant:</span> {prop.tenant}</div>{prop.nextInspection !== '—' && <div className="text-[10px] text-blue-600 font-bold mt-1">Next Inspection: {prop.nextInspection}</div>}</div>))}</div>{properties.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No properties yet. Add your first property above.</div>}</div>)}

      {/* ═══ CALENDAR ═══ */}
      {subTab === 'calendar' && (<div className="space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Calendar size={16} className="text-blue-600" /> CannaCribs Calendar</h3><div className="flex items-center gap-2">{[{ type: 'inspection', label: '🔍 Inspections', c: 'bg-blue-100 text-blue-700' },{ type: 'booking', label: '📅 Bookings', c: 'bg-purple-100 text-purple-700' },{ type: 'cleaning', label: '✨ Cleaning', c: 'bg-emerald-100 text-emerald-700' },{ type: 'maintenance', label: '🔧 Maintenance', c: 'bg-amber-100 text-amber-700' }].map(l => <span key={l.type} className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', l.c)}>{l.label}</span>)}</div></div><button onClick={() => setShowAddCalEvent(true)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 flex items-center gap-1.5"><Plus size={14} /> Add Event</button></div><div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between"><button onClick={() => setCalMonth(m => Math.max(0, m - 1))} className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg">← Prev</button><h4 className="font-black text-slate-900">{new Date(2026, calMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h4><button onClick={() => setCalMonth(m => Math.min(11, m + 1))} className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg">Next →</button></div><div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-2">{d}</div>)}</div><div className="grid grid-cols-7">{(() => { const firstDay = new Date(2026, calMonth, 1).getDay(); const daysInMonth = new Date(2026, calMonth + 1, 0).getDate(); const cells = []; for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} className="min-h-[80px] border-b border-r border-slate-100 bg-slate-50/50" />); for (let d = 1; d <= daysInMonth; d++) { const dateStr = `2026-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; const dayEvents = calEvents.filter(e => e.date === dateStr); const today = new Date(); const isToday = d === today.getDate() && calMonth === today.getMonth(); cells.push(<div key={d} className={cn("min-h-[80px] border-b border-r border-slate-100 p-1", isToday && "bg-blue-50/50")}><div className={cn("text-xs font-bold mb-1 px-1", isToday ? "text-blue-600" : "text-slate-500")}>{d}</div><div className="space-y-0.5">{dayEvents.map((ev, j) => (<div key={j} className={cn("px-1 py-0.5 rounded text-[8px] font-bold border truncate cursor-pointer group/evt flex items-center gap-0.5", CAL_TEXT[ev.type])} title={`${ev.title} — ${ev.property}`}><span className={cn("w-1.5 h-1.5 rounded-full shrink-0", CAL_COLORS[ev.type])} /><span className="truncate">{ev.title}</span><button onClick={() => deleteCalEvent(ev)} className="opacity-0 group-hover/evt:opacity-100 ml-auto shrink-0"><X size={8} /></button></div>))}</div></div>); } return cells; })()}</div></div><div className="bg-white rounded-xl border border-slate-200 p-6"><h4 className="font-bold text-sm text-slate-900 mb-4">Upcoming Events</h4><div className="space-y-2 max-h-[300px] overflow-y-auto">{calEvents.filter(e => e.date >= new Date().toISOString().split('T')[0]).map((ev, i) => (<div key={ev._docId || i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group"><div className="flex items-center gap-3"><div className={cn("w-3 h-3 rounded-full", CAL_COLORS[ev.type])} /><div><div className="text-sm font-bold text-slate-800">{ev.title}</div><div className="text-xs text-slate-400">{ev.date} • {ev.property}</div></div></div><div className="flex items-center gap-2"><span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold", TIER_COLORS[ev.tier])}>{ev.tier}</span><button onClick={() => deleteCalEvent(ev)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400" /></button></div></div>))}{calEvents.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No events scheduled</p>}</div></div></div>)}

      {/* ═══ INSPECTIONS ═══ */}
      {subTab === 'inspections' && (<div className="space-y-6"><div className="bg-white rounded-xl border border-slate-200 p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Eye size={16} className="text-violet-600" /> {checklist.length}-Point Inspection Checklist</h3><button onClick={() => setShowAddInspection(true)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 flex items-center gap-1"><Plus size={12} /> Add Item</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{checklist.map((item, i) => (<div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group"><div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span className="text-xs text-slate-700 font-medium">{item}</span></div><button onClick={() => deleteInspectionItem(i)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"><Trash2 size={10} className="text-red-400" /></button></div>))}</div></div><div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><CalendarCheck size={16} className="text-blue-600" /> Upcoming Inspections</h3><div className="space-y-3">{properties.filter(p => p.nextInspection !== '—').map((prop, i) => (<div key={prop._docId || i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100" onClick={() => { setSelectedProp(prop); setEditingProp(false); }}><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><CalendarCheck size={14} className="text-blue-600" /></div><div><div className="text-sm font-bold text-slate-900">{prop.name}</div><div className="text-xs text-slate-400">{prop.location}</div></div></div><div className="text-right flex items-center gap-3"><div><div className="text-sm font-bold text-blue-600">{prop.nextInspection}</div><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', TIER_COLORS[prop.tier])}>{prop.tier}</span></div><button className="p-1 hover:bg-blue-50 rounded" onClick={e => { e.stopPropagation(); setSelectedProp(prop); setEditingProp(true); }}><Edit size={12} className="text-blue-500" /></button></div></div>))}</div></div><div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><Sparkles size={16} className="text-purple-600" /> Cleaning Service Tiers</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[{ tier: 'Standard Clean', price: '$85', desc: 'Surface cleaning, vacuum, mop, bathroom/kitchen scrub, trash removal', color: 'border-emerald-200 bg-emerald-50' },{ tier: 'Deep Clean', price: '$175', desc: 'Standard + appliance interior, baseboard, window sill, cabinet wipe, grout', color: 'border-amber-200 bg-amber-50' },{ tier: 'Turnover Clean + Odor', price: '$350', desc: 'Deep clean + ozone treatment, air scrub, carpet steam, linen change', color: 'border-purple-200 bg-purple-50' }].map((c, i) => (<div key={i} className={cn('rounded-xl border-2 p-4', c.color)}><div className="text-xl font-black text-slate-900 mb-1">{c.price}</div><div className="text-sm font-bold text-slate-700 mb-2">{c.tier}</div><div className="text-xs text-slate-500 leading-relaxed">{c.desc}</div></div>))}</div></div></div>)}

      {/* ═══ VAULT ═══ */}
      {subTab === 'vault' && (<div className="space-y-4"><div className="flex items-center justify-between"><h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><FolderLock size={16} className="text-violet-600" /> CannaCribs Document Vault</h3><button onClick={() => setShowUploadVault(true)} className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-500 flex items-center gap-1.5"><Upload size={14} /> Upload Document</button></div><div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><table className="w-full"><thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Document</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Type</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Property</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Date</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Size</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Actions</th></tr></thead><tbody>{vaultDocs.map((vdoc, i) => (<tr key={vdoc._docId || i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedVaultDoc(vdoc)}><td className="p-3"><div className="flex items-center gap-2"><FileImage size={16} className="text-violet-500" /><span className="text-sm font-bold text-slate-800">{vdoc.name}</span></div></td><td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">{vdoc.type}</span></td><td className="p-3 text-xs text-slate-600">{vdoc.property}</td><td className="p-3 text-xs text-slate-500">{vdoc.date}</td><td className="p-3 text-xs text-slate-500">{vdoc.size}</td><td className="p-3" onClick={e => e.stopPropagation()}><div className="flex gap-1"><button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Download"><Download size={14} className="text-slate-400" /></button><button onClick={() => setSelectedVaultDoc(vdoc)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="View"><Eye size={14} className="text-blue-500" /></button><button onClick={() => deleteVaultDoc(vdoc)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button></div></td></tr>))}</tbody></table>{vaultDocs.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No documents in vault</div>}</div></div>)}

      {/* ═══ LANDLORDS ═══ */}
      {subTab === 'landlords' && (<div className="space-y-4"><div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between"><h3 className="font-bold text-sm text-slate-900 flex items-center gap-2"><Users size={16} className="text-purple-600" /> Registered Landlords</h3><button onClick={() => setShowAddLandlord(true)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 flex items-center gap-1"><Plus size={12} /> Onboard Landlord</button></div><table className="w-full"><thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Landlord</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Properties</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Tier</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Revenue</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Actions</th></tr></thead><tbody>{landlords.map((ll, i) => (<tr key={ll._docId || i} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => { setSelectedLandlord(ll); setEditingLL(false); }}><td className="p-3"><div className="font-bold text-sm text-slate-900 hover:text-green-600">{ll.name}</div><div className="text-xs text-slate-400">{ll.email}</div></td><td className="p-3 text-sm font-bold text-slate-700">{ll.properties}</td><td className="p-3"><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase', TIER_COLORS[ll.tier])}>{ll.tier}</span></td><td className="p-3 text-sm font-bold text-green-600">{ll.revenue}</td><td className="p-3"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', ll.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ll.status === 'Onboarding' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500')}>{ll.status}</span></td><td className="p-3" onClick={e => e.stopPropagation()}><div className="flex gap-1"><button onClick={() => { setSelectedLandlord(ll); setEditingLL(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg" title="View"><Eye size={14} className="text-slate-400" /></button><button onClick={() => { setSelectedLandlord(ll); setEditingLL(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={14} className="text-blue-500" /></button><button onClick={() => deleteLandlord(ll)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button></div></td></tr>))}</tbody></table>{landlords.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No landlords registered</div>}</div></div>)}
    </div>
  );
};

export default CannaCribsManagementTab;
