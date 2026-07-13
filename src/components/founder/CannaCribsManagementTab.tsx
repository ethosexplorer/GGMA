import React, { useState } from 'react';
import {
  Home, Building2, Users, FileText, Shield, Activity, Search, Plus, Eye,
  Clock, UserCheck, CheckCircle, X, XCircle, Filter, ChevronRight, ChevronDown,
  DollarSign, Star, MapPin, Leaf, Briefcase, ClipboardList, CalendarCheck,
  TrendingUp, AlertTriangle, Mail, Phone, Download, MoreVertical, Edit, Trash2,
  Bed, Bath, Maximize, Heart, Award, Sparkles, ShieldCheck, CreditCard,
  Upload, FolderLock, Calendar, Save, Image, FileImage, Palette, User, AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ─── TYPES ───
type Application = {
  id: string; name: string; type: string; email: string; phone: string;
  property: string; propertyType: string; location: string; status: string;
  submitted: string; submittedTime: string; creditScore: number; cannabis_card: boolean;
  employment: string; income: string; notes: string;
  // Full intake data
  dob: string; ssn_last4: string; currentAddress: string;
  emergencyName: string; emergencyPhone: string; emergencyRelation: string;
  allergies: string; medicalConditions: string; medications: string;
  previousLandlord: string; previousLandlordPhone: string;
  reasonForMoving: string; pets: string; vehicles: string;
  moveInDate: string; leaseTerm: string;
  // Landlord-specific
  llCompany: string; llPropertyAddress: string; llTierPreference: string;
  llInsurance: boolean; llNumUnits: string;
  // Short-term specific
  stCheckIn: string; stCheckOut: string; stGuests: string; stPurpose: string;
};
type Property = { id: string; name: string; location: string; type: string; tier: string; rent: number; status: string; tenant: string; nextInspection: string; occupancy: string; beds: string; baths: string; sqft: string; photos: string[] };
type Landlord = { name: string; email: string; properties: number; tier: string; revenue: string; status: string; phone: string; company: string; address: string; bankInfo: string; taxId: string; insurance: string; notes: string };
type InspectionItem = string;
type CalendarEvent = { date: string; title: string; property: string; type: 'inspection' | 'booking' | 'cleaning' | 'maintenance'; tier: string };
type VaultDoc = { id: string; name: string; type: string; property: string; date: string; size: string };

// ─── INITIAL DATA ───
const INIT_APPS: Application[] = [
  { id: 'CC-APP-001', name: 'James Carter', type: 'Tenant', email: 'james.carter@email.com', phone: '(405) 555-0142', property: 'Modern Cannabis-Friendly Loft', propertyType: 'Apartment', location: 'Oklahoma City, OK', status: 'Pending Review', submitted: '2026-07-12', submittedTime: '10:30 AM', creditScore: 720, cannabis_card: true, employment: 'Verified', income: '$4,200/mo', notes: '', dob: '1992-03-15', ssn_last4: '4821', currentAddress: '1234 NW 10th St, OKC, OK 73103', emergencyName: 'Linda Carter', emergencyPhone: '(405) 555-0199', emergencyRelation: 'Mother', allergies: 'None', medicalConditions: 'None', medications: 'Medical cannabis (THC)', previousLandlord: 'Mark Reynolds', previousLandlordPhone: '(405) 555-0312', reasonForMoving: 'Current landlord prohibits cannabis', pets: 'Dog — Golden Retriever, 45 lbs', vehicles: '2022 Toyota Camry', moveInDate: '2026-08-01', leaseTerm: '12 months', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-002', name: 'Sarah Mitchell', type: 'Tenant', email: 'sarah.m@email.com', phone: '(918) 555-0387', property: 'Cozy 420-Friendly Cottage', propertyType: 'House', location: 'Norman, OK', status: 'Background Check', submitted: '2026-07-11', submittedTime: '2:15 PM', creditScore: 685, cannabis_card: true, employment: 'Verified', income: '$3,800/mo', notes: 'Previous landlord reference positive', dob: '1995-08-22', ssn_last4: '7193', currentAddress: '567 Elm St, Norman, OK 73071', emergencyName: 'Robert Mitchell', emergencyPhone: '(918) 555-0401', emergencyRelation: 'Father', allergies: 'Penicillin', medicalConditions: 'Asthma (mild)', medications: 'Inhaler, Medical cannabis', previousLandlord: 'Susan Blake', previousLandlordPhone: '(918) 555-0288', reasonForMoving: 'Lease ending, wants grow-friendly space', pets: 'Cat — Siamese', vehicles: '2021 Honda Civic', moveInDate: '2026-08-15', leaseTerm: '6 months', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-003', name: 'David Rosenberg', type: 'Landlord', email: 'drosenberg@realty.com', phone: '(480) 555-0219', property: '3BR House — Edmond, OK', propertyType: 'House', location: 'Edmond, OK', status: 'Approved', submitted: '2026-07-09', submittedTime: '9:00 AM', creditScore: 0, cannabis_card: false, employment: 'N/A', income: 'N/A', notes: 'Platinum tier selected. Signed contract.', dob: '', ssn_last4: '', currentAddress: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '', allergies: '', medicalConditions: '', medications: '', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: 'Rosenberg Realty LLC', llPropertyAddress: '789 Oak Ridge Dr, Edmond, OK 73034', llTierPreference: 'Platinum', llInsurance: true, llNumUnits: '2', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-004', name: 'Maria Gonzalez', type: 'Tenant', email: 'mgonzalez@gmail.com', phone: '(405) 555-0901', property: 'Downtown Cannabis-Friendly Studio', propertyType: 'Apartment', location: 'Tulsa, OK', status: 'Pending Review', submitted: '2026-07-13', submittedTime: '11:45 AM', creditScore: 740, cannabis_card: true, employment: 'Pending', income: '$5,100/mo', notes: '', dob: '1990-11-03', ssn_last4: '3056', currentAddress: '321 S Boston Ave, Tulsa, OK 74103', emergencyName: 'Carlos Gonzalez', emergencyPhone: '(405) 555-0822', emergencyRelation: 'Brother', allergies: 'Latex', medicalConditions: 'Anxiety', medications: 'Medical cannabis, Lexapro', previousLandlord: 'Heritage Apts Mgmt', previousLandlordPhone: '(918) 555-0100', reasonForMoving: 'Need cannabis-friendly policy', pets: 'None', vehicles: '2024 Tesla Model 3', moveInDate: '2026-09-01', leaseTerm: '12 months', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-005', name: 'Tom Williams', type: 'Landlord', email: 'twilliams@okprops.com', phone: '(405) 555-0555', property: '4-Unit Multi-Family — Moore, OK', propertyType: 'Multi-Family', location: 'Moore, OK', status: 'Verification', submitted: '2026-07-10', submittedTime: '3:30 PM', creditScore: 0, cannabis_card: false, employment: 'N/A', income: 'N/A', notes: 'Gold tier. Wants inspection schedule.', dob: '', ssn_last4: '', currentAddress: '', emergencyName: '', emergencyPhone: '', emergencyRelation: '', allergies: '', medicalConditions: '', medications: '', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: 'OK Properties', llPropertyAddress: '456 SW 4th St, Moore, OK 73160', llTierPreference: 'Gold', llInsurance: false, llNumUnits: '4', stCheckIn: '', stCheckOut: '', stGuests: '', stPurpose: '' },
  { id: 'CC-APP-006', name: 'Ashley Park', type: 'Short-Term Guest', email: 'ashpark@travel.com', phone: '(602) 555-0733', property: 'Desert Oasis Cannabis Retreat', propertyType: 'Short-Term', location: 'Bullhead City, AZ', status: 'Approved', submitted: '2026-07-08', submittedTime: '6:00 PM', creditScore: 0, cannabis_card: true, employment: 'N/A', income: 'N/A', notes: 'Guest for Jul 15-20. Executive tier property.', dob: '1988-05-12', ssn_last4: '', currentAddress: '9876 E Camelback Rd, Scottsdale, AZ 85251', emergencyName: 'Jessica Park', emergencyPhone: '(602) 555-0800', emergencyRelation: 'Sister', allergies: 'None', medicalConditions: 'None', medications: 'None', previousLandlord: '', previousLandlordPhone: '', reasonForMoving: '', pets: '', vehicles: '', moveInDate: '', leaseTerm: '', llCompany: '', llPropertyAddress: '', llTierPreference: '', llInsurance: false, llNumUnits: '', stCheckIn: '2026-07-15', stCheckOut: '2026-07-20', stGuests: '2', stPurpose: 'Vacation — cannabis retreat' },
];

const INIT_PROPS: Property[] = [
  { id: 'PROP-001', name: 'Modern Cannabis-Friendly Loft', location: 'Oklahoma City, OK', type: 'Apartment', tier: 'Gold', rent: 1450, status: 'Occupied', tenant: 'Marcus Reed', nextInspection: '2026-07-18', occupancy: '100%', beds: '2', baths: '1', sqft: '950', photos: [] },
  { id: 'PROP-002', name: 'Cozy 420-Friendly Cottage', location: 'Norman, OK', type: 'House', tier: 'Green', rent: 1200, status: 'Vacant', tenant: '—', nextInspection: '—', occupancy: '0%', beds: '3', baths: '2', sqft: '1400', photos: [] },
  { id: 'PROP-003', name: 'Luxury CannaCrib Suite', location: 'Scottsdale, AZ', type: 'Short-Term', tier: 'Executive', rent: 189, status: 'Booked', tenant: 'Ashley Park (Jul 15-20)', nextInspection: '2026-07-15', occupancy: '85%', beds: '1', baths: '1', sqft: '650', photos: [] },
  { id: 'PROP-004', name: 'Spacious Grow-Friendly Rancher', location: 'Edmond, OK', type: 'House', tier: 'Platinum', rent: 1800, status: 'Occupied', tenant: 'David Rosenberg (Owner)', nextInspection: '2026-07-20', occupancy: '100%', beds: '4', baths: '3', sqft: '2200', photos: [] },
  { id: 'PROP-005', name: 'Cannabis-Friendly Commercial Space', location: 'Moore, OK', type: 'Commercial', tier: 'Platinum', rent: 3200, status: 'Vacant', tenant: '—', nextInspection: '—', occupancy: '0%', beds: '—', baths: '2', sqft: '3500', photos: [] },
  { id: 'PROP-006', name: 'Midtown 420 Friendly Townhome', location: 'Oklahoma City, OK', type: 'House', tier: 'Gold', rent: 1650, status: 'Occupied', tenant: 'Jasmine Wells', nextInspection: '2026-07-22', occupancy: '100%', beds: '3', baths: '2.5', sqft: '1800', photos: [] },
];

const INIT_LANDLORDS: Landlord[] = [
  { name: 'David Rosenberg', email: 'drosenberg@realty.com', properties: 2, tier: 'Platinum', revenue: '$598/mo', status: 'Active', phone: '(480) 555-0219', company: 'Rosenberg Realty LLC', address: '789 Oak Ridge Dr, Edmond, OK 73034', bankInfo: 'Chase ****4821', taxId: '**-***7890', insurance: 'State Farm Policy #SF-29381', notes: 'Long-term partner. 2 properties. Platinum tier.' },
  { name: 'Tom Williams', email: 'twilliams@okprops.com', properties: 1, tier: 'Gold', revenue: '$149/mo', status: 'Onboarding', phone: '(405) 555-0555', company: 'OK Properties', address: '456 SW 4th St, Moore, OK 73160', bankInfo: 'BoA ****3392', taxId: '**-***1234', insurance: 'Pending', notes: 'Onboarding in progress. 4-unit multi-family.' },
  { name: 'Linda Chen', email: 'lchen@email.com', properties: 1, tier: 'Executive', revenue: '$499/mo', status: 'Active', phone: '(602) 555-0811', company: 'Chen Hospitality Group', address: '9012 E Camelback, Scottsdale, AZ 85251', bankInfo: 'Wells Fargo ****5567', taxId: '**-***5678', insurance: 'Allstate Policy #AL-83291', notes: 'Short-term rental specialist. Executive tier.' },
  { name: 'Robert Jackson', email: 'rjackson@prop.com', properties: 1, tier: 'Green', revenue: '$49/mo', status: 'Active', phone: '(918) 555-0422', company: '', address: '123 Main St, Norman, OK 73071', bankInfo: 'Credit Union ****9901', taxId: '**-***9012', insurance: 'None on file', notes: 'Independent landlord. Single cottage.' },
];

const INIT_CHECKLIST: InspectionItem[] = [
  'Exterior Condition', 'Interior Walls & Paint', 'Flooring Condition', 'Windows & Locks', 'Doors & Hinges', 'Plumbing & Fixtures',
  'Electrical Outlets', 'HVAC System', 'Smoke Detectors', 'CO Detectors', 'Fire Extinguisher', 'Appliance Function',
  'Kitchen Condition', 'Bathroom Condition', 'Pest Inspection', 'Cannabis Odor Level', 'Ventilation System', 'Air Filtration',
  'Grow Area (if any)', 'Waste Disposal', 'Yard/Exterior Clean', 'Parking Area', 'Security System', 'Key/Lock Integrity',
  'Furniture Condition', 'Linen/Bedding Check', 'Supply Inventory', 'Neighbor Complaints', 'Photo Documentation', 'Overall Rating',
];

const INIT_CALENDAR: CalendarEvent[] = [
  { date: '2026-07-15', title: 'Pre-Guest Inspection', property: 'Desert Oasis Cannabis Retreat', type: 'inspection', tier: 'Executive' },
  { date: '2026-07-15', title: 'Guest Check-In: Ashley Park', property: 'Luxury CannaCrib Suite', type: 'booking', tier: 'Executive' },
  { date: '2026-07-18', title: 'Bi-Weekly Inspection', property: 'Modern Cannabis-Friendly Loft', type: 'inspection', tier: 'Gold' },
  { date: '2026-07-19', title: 'Standard Clean', property: 'Midtown 420 Friendly Townhome', type: 'cleaning', tier: 'Gold' },
  { date: '2026-07-20', title: 'Weekly Inspection', property: 'Spacious Grow-Friendly Rancher', type: 'inspection', tier: 'Platinum' },
  { date: '2026-07-20', title: 'Guest Check-Out: Ashley Park', property: 'Luxury CannaCrib Suite', type: 'booking', tier: 'Executive' },
  { date: '2026-07-20', title: 'Turnover Clean + Ozone', property: 'Luxury CannaCrib Suite', type: 'cleaning', tier: 'Executive' },
  { date: '2026-07-22', title: 'Bi-Weekly Inspection', property: 'Midtown 420 Friendly Townhome', type: 'inspection', tier: 'Gold' },
  { date: '2026-07-25', title: 'HVAC Maintenance', property: 'Spacious Grow-Friendly Rancher', type: 'maintenance', tier: 'Platinum' },
  { date: '2026-07-28', title: 'Guest Booking: J. Thomas', property: 'Luxury CannaCrib Suite', type: 'booking', tier: 'Executive' },
];

const INIT_VAULT: VaultDoc[] = [
  { id: 'V-001', name: 'Lease Agreement — Marcus Reed', type: 'Lease', property: 'Modern Cannabis-Friendly Loft', date: '2026-06-01', size: '2.4 MB' },
  { id: 'V-002', name: 'Inspection Report Jul 13', type: 'Inspection', property: 'Modern Cannabis-Friendly Loft', date: '2026-07-13', size: '1.1 MB' },
  { id: 'V-003', name: 'Cannabis Card — James Carter', type: 'ID Docs', property: '—', date: '2026-07-12', size: '890 KB' },
  { id: 'V-004', name: 'Property Photos — Desert Oasis', type: 'Photos', property: 'Luxury CannaCrib Suite', date: '2026-06-15', size: '18.3 MB' },
  { id: 'V-005', name: 'Landlord Contract — D. Rosenberg', type: 'Contract', property: 'Spacious Grow-Friendly Rancher', date: '2026-07-09', size: '3.2 MB' },
  { id: 'V-006', name: 'Insurance Certificate', type: 'Insurance', property: 'Midtown 420 Friendly Townhome', date: '2026-05-20', size: '1.5 MB' },
];

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
  const [applications, setApplications] = useState<Application[]>(INIT_APPS);
  const [properties, setProperties] = useState<Property[]>(INIT_PROPS);
  const [landlords, setLandlords] = useState<Landlord[]>(INIT_LANDLORDS);
  const [checklist, setChecklist] = useState<InspectionItem[]>(INIT_CHECKLIST);
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>(INIT_CALENDAR);
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>(INIT_VAULT);

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
  const [editingPropIdx, setEditingPropIdx] = useState<number | null>(null);
  const [editingLLIdx, setEditingLLIdx] = useState<number | null>(null);

  const [newProp, setNewProp] = useState({ name: '', location: '', type: 'House', tier: 'Green', rent: '', status: 'Vacant', tenant: '', beds: '', baths: '', sqft: '' });
  const [newApp, setNewApp] = useState<Partial<Application>>({ ...EMPTY_APP });
  const [newInspItem, setNewInspItem] = useState('');
  const [newLandlord, setNewLandlord] = useState({ name: '', email: '', phone: '', company: '', tier: 'Green', properties: 1, address: '', notes: '' });
  const [newCalEvt, setNewCalEvt] = useState({ date: '', title: '', property: '', type: 'inspection' as CalendarEvent['type'], tier: 'Green' });
  const [calMonth, setCalMonth] = useState(6);

  const filteredApps = applications.filter(a => {
    if (appFilter === 'All') return true;
    if (appFilter === 'Tenants') return a.type === 'Tenant';
    if (appFilter === 'Landlords') return a.type === 'Landlord';
    if (appFilter === 'Short-Term') return a.type === 'Short-Term Guest';
    if (appFilter === 'Pending') return a.status === 'Pending Review';
    return true;
  });

  // ─── CRUD ───
  const addProperty = () => { if (!newProp.name) return; setProperties(p => [...p, { ...newProp, id: 'PROP-' + String(p.length + 1).padStart(3, '0'), rent: Number(newProp.rent) || 0, nextInspection: '—', occupancy: newProp.status === 'Occupied' ? '100%' : '0%', photos: [] }]); setNewProp({ name: '', location: '', type: 'House', tier: 'Green', rent: '', status: 'Vacant', tenant: '', beds: '', baths: '', sqft: '' }); setShowAddProperty(false); };
  const deleteProperty = (idx: number) => { if (confirm('Delete this property?')) setProperties(p => p.filter((_, i) => i !== idx)); };
  const saveEditProperty = (idx: number, u: Property) => { setProperties(p => p.map((x, i) => i === idx ? u : x)); setEditingPropIdx(null); setSelectedProp(null); };

  const addApplicant = () => {
    if (!newApp.name) return;
    const now = new Date();
    setApplications(p => [...p, { ...EMPTY_APP, ...newApp, id: 'CC-APP-' + String(p.length + 1).padStart(3, '0'), submitted: now.toISOString().split('T')[0], submittedTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } as Application]);
    setNewApp({ ...EMPTY_APP }); setShowAddApplicant(false);
  };
  const deleteApplication = (idx: number) => { if (confirm('Delete?')) setApplications(p => p.filter((_, i) => i !== idx)); };
  const changeAppStatus = (id: string, s: string) => { setApplications(p => p.map(a => a.id === id ? { ...a, status: s } : a)); };
  const saveEditApp = (updated: Application) => { setApplications(p => p.map(a => a.id === updated.id ? updated : a)); setEditingApp(false); };

  const addInspectionItem = () => { if (newInspItem.trim()) { setChecklist(p => [...p, newInspItem.trim()]); setNewInspItem(''); setShowAddInspection(false); } };
  const deleteInspectionItem = (idx: number) => setChecklist(p => p.filter((_, i) => i !== idx));

  const addLandlordFn = () => { if (!newLandlord.name) return; setLandlords(p => [...p, { ...newLandlord, properties: Number(newLandlord.properties) || 1, revenue: '$0/mo', status: 'Onboarding', bankInfo: '', taxId: '', insurance: '', notes: newLandlord.notes }]); setNewLandlord({ name: '', email: '', phone: '', company: '', tier: 'Green', properties: 1, address: '', notes: '' }); setShowAddLandlord(false); };
  const deleteLandlord = (idx: number) => { if (confirm('Remove?')) setLandlords(p => p.filter((_, i) => i !== idx)); };
  const saveEditLandlord = (idx: number, u: Landlord) => { setLandlords(p => p.map((x, i) => i === idx ? u : x)); setEditingLLIdx(null); setSelectedLandlord(null); };

  const addCalendarEvent = () => { if (!newCalEvt.date || !newCalEvt.title) return; setCalEvents(p => [...p, newCalEvt].sort((a, b) => a.date.localeCompare(b.date))); setNewCalEvt({ date: '', title: '', property: '', type: 'inspection', tier: 'Green' }); setShowAddCalEvent(false); };
  const deleteCalEvent = (idx: number) => setCalEvents(p => p.filter((_, i) => i !== idx));
  const deleteVaultDoc = (idx: number) => { if (confirm('Delete?')) setVaultDocs(p => p.filter((_, i) => i !== idx)); };

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
        <Select value={app.status} onChange={(e: any) => { changeAppStatus(app.id, e.target.value); setSelectedApp({ ...app, status: e.target.value }); }}>
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
        <button onClick={() => { changeAppStatus(app.id, 'Approved'); setSelectedApp({ ...app, status: 'Approved' }); }} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"><CheckCircle size={16} /> Approve</button>
        <button onClick={() => { changeAppStatus(app.id, 'Denied'); setSelectedApp({ ...app, status: 'Denied' }); }} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><XCircle size={16} /> Deny</button>
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
          <button onClick={() => { saveEditApp(app); }} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Save size={16} /> Save Changes</button>
          <button onClick={() => setEditingApp(false)} className="py-3 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20"><Leaf className="text-white" size={24} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2"><span className="text-green-600">Canna</span><span className="text-amber-500">Cribs</span><span className="text-slate-400 text-sm font-bold">Management</span></h1>
            <p className="text-xs text-slate-500">Cannabis-Friendly Real Estate Platform — Back Office</p>
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
          <button onClick={addProperty} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Add Property</button>
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
          <button onClick={addApplicant} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Add Applicant</button>
        </div>
      </Modal>

      {/* ═══ ADD LANDLORD ═══ */}
      <Modal open={showAddLandlord} onClose={() => setShowAddLandlord(false)} title="Onboard Landlord">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Name</FieldLabel><Input value={newLandlord.name} onChange={(e: any) => setNewLandlord(l => ({ ...l, name: e.target.value }))} /></div><div><FieldLabel>Company</FieldLabel><Input value={newLandlord.company} onChange={(e: any) => setNewLandlord(l => ({ ...l, company: e.target.value }))} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Email</FieldLabel><Input value={newLandlord.email} onChange={(e: any) => setNewLandlord(l => ({ ...l, email: e.target.value }))} type="email" /></div><div><FieldLabel>Phone</FieldLabel><Input value={newLandlord.phone} onChange={(e: any) => setNewLandlord(l => ({ ...l, phone: e.target.value }))} /></div></div>
          <div className="grid grid-cols-3 gap-4"><div><FieldLabel>Tier</FieldLabel><Select value={newLandlord.tier} onChange={(e: any) => setNewLandlord(l => ({ ...l, tier: e.target.value }))}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div><div><FieldLabel># Properties</FieldLabel><Input value={String(newLandlord.properties)} onChange={(e: any) => setNewLandlord(l => ({ ...l, properties: Number(e.target.value) || 1 }))} type="number" /></div><div><FieldLabel>Address</FieldLabel><Input value={newLandlord.address} onChange={(e: any) => setNewLandlord(l => ({ ...l, address: e.target.value }))} /></div></div>
          <div><FieldLabel>Notes</FieldLabel><textarea value={newLandlord.notes} onChange={(e) => setNewLandlord(l => ({ ...l, notes: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none" rows={2} /></div>
          <button onClick={addLandlordFn} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Onboard Landlord</button>
        </div>
      </Modal>

      {/* ═══ CALENDAR EVENT / INSPECTION ITEM / VAULT UPLOAD MODALS ═══ */}
      <Modal open={showAddCalEvent} onClose={() => setShowAddCalEvent(false)} title="Add Calendar Event"><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Date</FieldLabel><Input type="date" value={newCalEvt.date} onChange={(e: any) => setNewCalEvt(c => ({ ...c, date: e.target.value }))} /></div><div><FieldLabel>Type</FieldLabel><Select value={newCalEvt.type} onChange={(e: any) => setNewCalEvt(c => ({ ...c, type: e.target.value }))}><option value="inspection">🔍 Inspection</option><option value="booking">📅 Booking</option><option value="cleaning">✨ Cleaning</option><option value="maintenance">🔧 Maintenance</option></Select></div></div><div><FieldLabel req>Title</FieldLabel><Input value={newCalEvt.title} onChange={(e: any) => setNewCalEvt(c => ({ ...c, title: e.target.value }))} placeholder="Event title" /></div><div className="grid grid-cols-2 gap-4"><div><FieldLabel>Property</FieldLabel><Select value={newCalEvt.property} onChange={(e: any) => setNewCalEvt(c => ({ ...c, property: e.target.value }))}><option value="">Select</option>{properties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</Select></div><div><FieldLabel>Tier</FieldLabel><Select value={newCalEvt.tier} onChange={(e: any) => setNewCalEvt(c => ({ ...c, tier: e.target.value }))}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div></div><button onClick={addCalendarEvent} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Add Event</button></div></Modal>

      <Modal open={showUploadVault} onClose={() => setShowUploadVault(false)} title="Upload Document"><div className="space-y-4"><div className="border-2 border-dashed border-violet-300 rounded-xl p-8 text-center hover:border-violet-500 cursor-pointer bg-violet-50/50"><Upload className="mx-auto text-violet-500 mb-2" size={36} /><p className="text-sm font-bold text-violet-700">Drag & Drop or Click to Upload</p><p className="text-xs text-violet-500 mt-1">PDF, JPG, PNG, DOCX — max 25 MB</p></div><div className="grid grid-cols-2 gap-4"><div><FieldLabel>Type</FieldLabel><Select><option>Lease</option><option>Inspection</option><option>Contract</option><option>ID Docs</option><option>Photos</option><option>Insurance</option><option>Other</option></Select></div><div><FieldLabel>Property</FieldLabel><Select><option value="">General</option>{properties.map(p => <option key={p.id}>{p.name}</option>)}</Select></div></div><button onClick={() => { setShowUploadVault(false); alert('Upload will connect to storage backend.'); }} className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Upload size={16} /> Upload</button></div></Modal>

      <Modal open={showAddInspection} onClose={() => setShowAddInspection(false)} title="Add Inspection Item"><div className="space-y-4"><div><FieldLabel req>Item Name</FieldLabel><Input value={newInspItem} onChange={(e: any) => setNewInspItem(e.target.value)} placeholder="e.g. Carbon Filter Check" /></div><button onClick={addInspectionItem} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={16} /> Add</button></div></Modal>

      {/* ═══ APPLICATION DETAIL MODAL ═══ */}
      {selectedApp && (
        <Modal open={!!selectedApp} onClose={() => { setSelectedApp(null); setEditingApp(false); }} title={editingApp ? `Edit: ${selectedApp.name}` : selectedApp.name} subtitle={`${selectedApp.id} • ${selectedApp.type} Application`} wide>
          {editingApp ? renderAppEdit(selectedApp) : renderAppDetail(selectedApp)}
        </Modal>
      )}

      {/* ═══ PROPERTY DETAIL / EDIT MODAL ═══ */}
      {selectedProp && (
        <Modal open={!!selectedProp} onClose={() => { setSelectedProp(null); setEditingPropIdx(null); }} title={editingPropIdx !== null ? 'Edit Property' : selectedProp.name} subtitle={selectedProp.id} wide>
          {editingPropIdx !== null ? (
            <div className="space-y-4">
              <div><FieldLabel req>Name</FieldLabel><Input value={selectedProp.name} onChange={(e: any) => setSelectedProp({ ...selectedProp, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4"><div><FieldLabel>Location</FieldLabel><Input value={selectedProp.location} onChange={(e: any) => setSelectedProp({ ...selectedProp, location: e.target.value })} /></div><div><FieldLabel>Type</FieldLabel><Select value={selectedProp.type} onChange={(e: any) => setSelectedProp({ ...selectedProp, type: e.target.value })}>{PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}</Select></div></div>
              <div className="grid grid-cols-4 gap-4"><div><FieldLabel>Rent $</FieldLabel><Input value={String(selectedProp.rent)} onChange={(e: any) => setSelectedProp({ ...selectedProp, rent: Number(e.target.value) || 0 })} /></div><div><FieldLabel>Tier</FieldLabel><Select value={selectedProp.tier} onChange={(e: any) => setSelectedProp({ ...selectedProp, tier: e.target.value })}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div><div><FieldLabel>Status</FieldLabel><Select value={selectedProp.status} onChange={(e: any) => setSelectedProp({ ...selectedProp, status: e.target.value })}><option>Vacant</option><option>Occupied</option><option>Booked</option></Select></div><div><FieldLabel>Tenant</FieldLabel><Input value={selectedProp.tenant} onChange={(e: any) => setSelectedProp({ ...selectedProp, tenant: e.target.value })} /></div></div>
              <div className="grid grid-cols-3 gap-4"><div><FieldLabel>Beds</FieldLabel><Input value={selectedProp.beds} onChange={(e: any) => setSelectedProp({ ...selectedProp, beds: e.target.value })} /></div><div><FieldLabel>Baths</FieldLabel><Input value={selectedProp.baths} onChange={(e: any) => setSelectedProp({ ...selectedProp, baths: e.target.value })} /></div><div><FieldLabel>Sq Ft</FieldLabel><Input value={selectedProp.sqft} onChange={(e: any) => setSelectedProp({ ...selectedProp, sqft: e.target.value })} /></div></div>
              <div><FieldLabel>Next Inspection</FieldLabel><Input type="date" value={selectedProp.nextInspection} onChange={(e: any) => setSelectedProp({ ...selectedProp, nextInspection: e.target.value })} /></div>
              <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center cursor-pointer bg-green-50/50"><Upload className="mx-auto text-green-500 mb-2" size={28} /><p className="text-sm font-bold text-green-700">Upload / Replace Photos</p></div>
              <button onClick={() => saveEditProperty(editingPropIdx, selectedProp)} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Save size={16} /> Save</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-center"><div className="text-xl font-black text-green-600">${selectedProp.rent.toLocaleString()}</div><div className="text-[10px] text-slate-400 font-bold">{selectedProp.type === 'Short-Term' ? '/night' : '/mo'}</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-xl font-black">{selectedProp.beds}/{selectedProp.baths}</div><div className="text-[10px] text-slate-400 font-bold">Beds/Baths</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-xl font-black">{selectedProp.sqft}</div><div className="text-[10px] text-slate-400 font-bold">Sq Ft</div></div>
                <div className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-xl font-black">{selectedProp.occupancy}</div><div className="text-[10px] text-slate-400 font-bold">Occupancy</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4"><InfoBlock label="Location" value={selectedProp.location} /><InfoBlock label="Tenant" value={selectedProp.tenant} /></div>
              <div className="grid grid-cols-3 gap-4"><InfoBlock label="Type" value={selectedProp.type} /><div className="p-2.5 bg-slate-50 rounded-lg"><div className="text-[9px] text-slate-400 uppercase font-black mb-0.5">Tier</div><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", TIER_COLORS[selectedProp.tier])}>{selectedProp.tier}</span></div><InfoBlock label="Next Inspection" value={selectedProp.nextInspection} /></div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50"><Image className="mx-auto text-slate-300 mb-2" size={36} /><p className="text-xs text-slate-400">Property photos will display here</p></div>
              <div className="flex gap-3">
                <button onClick={() => { const idx = properties.findIndex(p => p.id === selectedProp.id); setEditingPropIdx(idx); }} className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
                <button onClick={() => { const idx = properties.findIndex(p => p.id === selectedProp.id); deleteProperty(idx); setSelectedProp(null); }} className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ═══ LANDLORD DETAIL / EDIT MODAL ═══ */}
      {selectedLandlord && (
        <Modal open={!!selectedLandlord} onClose={() => { setSelectedLandlord(null); setEditingLLIdx(null); }} title={editingLLIdx !== null ? 'Edit Landlord' : selectedLandlord.name} subtitle={selectedLandlord.company || 'Independent Landlord'} wide>
          {editingLLIdx !== null ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4"><div><FieldLabel req>Name</FieldLabel><Input value={selectedLandlord.name} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, name: e.target.value })} /></div><div><FieldLabel>Company</FieldLabel><Input value={selectedLandlord.company} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, company: e.target.value })} /></div></div>
              <div className="grid grid-cols-2 gap-4"><div><FieldLabel>Email</FieldLabel><Input value={selectedLandlord.email} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, email: e.target.value })} /></div><div><FieldLabel>Phone</FieldLabel><Input value={selectedLandlord.phone} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, phone: e.target.value })} /></div></div>
              <div><FieldLabel>Address</FieldLabel><Input value={selectedLandlord.address} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, address: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4"><div><FieldLabel>Tier</FieldLabel><Select value={selectedLandlord.tier} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, tier: e.target.value })}><option>Green</option><option>Gold</option><option>Platinum</option><option>Executive</option></Select></div><div><FieldLabel>Properties</FieldLabel><Input value={String(selectedLandlord.properties)} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, properties: Number(e.target.value) || 1 })} type="number" /></div><div><FieldLabel>Status</FieldLabel><Select value={selectedLandlord.status} onChange={(e: any) => setSelectedLandlord({ ...selectedLandlord, status: e.target.value })}><option>Active</option><option>Onboarding</option><option>Inactive</option></Select></div></div>
              <div><FieldLabel>Notes</FieldLabel><textarea value={selectedLandlord.notes} onChange={(e) => setSelectedLandlord({ ...selectedLandlord, notes: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none resize-none" rows={2} /></div>
              <button onClick={() => saveEditLandlord(editingLLIdx, selectedLandlord)} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Save size={16} /> Save</button>
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
                <button onClick={() => { const idx = landlords.findIndex(l => l.email === selectedLandlord.email); setEditingLLIdx(idx); }} className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Edit size={16} /> Edit</button>
                <button onClick={() => { const idx = landlords.findIndex(l => l.email === selectedLandlord.email); deleteLandlord(idx); setSelectedLandlord(null); }} className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
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
            <div className="flex gap-3"><button className="flex-1 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-200 text-sm flex items-center justify-center gap-2"><Download size={16} /> Download</button><button onClick={() => { const idx = vaultDocs.findIndex(d => d.id === selectedVaultDoc.id); deleteVaultDoc(idx); setSelectedVaultDoc(null); }} className="py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 text-sm flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button></div>
          </div>
        </Modal>
      )}

      {/* ═══════════ TAB CONTENT ═══════════ */}

      {/* ═══ OVERVIEW ═══ */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ label: 'Total Properties', value: String(properties.length), change: `${properties.filter(p => p.status === 'Occupied').length} occupied`, icon: Home, color: 'text-green-600', bg: 'bg-green-50' },{ label: 'Active Tenants', value: String(properties.filter(p => p.status === 'Occupied').length), change: `${Math.round((properties.filter(p => p.status === 'Occupied').length / properties.length) * 100)}% occupancy`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },{ label: 'Pending Apps', value: String(applications.filter(a => a.status === 'Pending Review').length), change: 'Review needed', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },{ label: 'Monthly Revenue', value: '$6,489', change: '+18% MoM', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' }].map((k, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all"><div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', k.bg)}><k.icon size={18} className={k.color} /></div><div className="text-2xl font-black text-slate-900">{k.value}</div><div className="text-xs text-slate-500 font-medium">{k.label}</div><div className="text-[10px] text-emerald-600 font-bold mt-1">{k.change}</div></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-green-600" />Revenue by Service Tier</h3><div className="space-y-3">{[{ tier: 'Green', props: properties.filter(p => p.tier === 'Green').length, revenue: '$49', color: 'bg-emerald-500' },{ tier: 'Gold', props: properties.filter(p => p.tier === 'Gold').length, revenue: '$298', color: 'bg-amber-500' },{ tier: 'Platinum', props: properties.filter(p => p.tier === 'Platinum').length, revenue: '$598', color: 'bg-violet-500' },{ tier: 'Executive', props: properties.filter(p => p.tier === 'Executive').length, revenue: '$499', color: 'bg-purple-500' }].map((r, i) => (<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"><div className="flex items-center gap-3"><div className={cn('w-3 h-3 rounded-full', r.color)} /><span className="text-sm font-bold text-slate-700">{r.tier}</span><span className="text-xs text-slate-400">{r.props} properties</span></div><span className="text-sm font-black text-slate-900">{r.revenue}/mo</span></div>))}<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"><span className="text-sm font-black text-green-700">Total Tier Revenue</span><span className="text-lg font-black text-green-700">$1,444/mo</span></div></div></div>
            <div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><Activity size={16} className="text-blue-600" />Recent Activity</h3><div className="space-y-3">{[{ time: '2 min ago', event: 'New Application', detail: 'Maria Gonzalez — Tenant app for Studio, Tulsa', color: 'text-amber-600', bg: 'bg-amber-50' },{ time: '1 hr ago', event: 'Inspection Complete', detail: 'Modern Loft, OKC — All 30 points passed', color: 'text-emerald-600', bg: 'bg-emerald-50' },{ time: '3 hrs ago', event: 'Lease Signed', detail: 'Jasmine Wells — Midtown Townhome, 12-mo lease', color: 'text-blue-600', bg: 'bg-blue-50' },{ time: 'Yesterday', event: 'Cleaning Done', detail: 'Desert Oasis, AZ — Turnover clean + odor mitigation', color: 'text-purple-600', bg: 'bg-purple-50' }].map((a, i) => (<div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"><div className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mt-0.5', a.bg, a.color)}>{a.event}</div><div className="flex-1"><p className="text-xs text-slate-700 font-medium">{a.detail}</p><p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p></div></div>))}</div></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><CreditCard size={16} className="text-violet-600" />Tenant & Guest Fee Schedule</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[{ fee: 'Application Fee', amount: '$45', type: 'Per application' },{ fee: 'Background Check', amount: '$35', type: 'Per tenant' },{ fee: 'Lease Processing', amount: '$75', type: 'Per lease' },{ fee: 'Short-Term Booking', amount: '12%', type: 'Per booking' },{ fee: 'Cannabis Card Verify', amount: '$15', type: 'Per verification' },{ fee: "Renter's Insurance", amount: '$29', type: 'Per month' },{ fee: 'Move-In/Out Inspect', amount: '$95', type: 'Per event' },{ fee: 'Key Deposit', amount: '$50', type: 'Refundable' }].map((f, i) => (<div key={i} className="p-3 bg-slate-50 rounded-lg text-center"><div className="text-lg font-black text-green-600">{f.amount}</div><div className="text-xs font-bold text-slate-700">{f.fee}</div><div className="text-[10px] text-slate-400">{f.type}</div></div>))}</div></div>
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
                <tr key={i} className="border-b border-slate-100 hover:bg-green-50/30 transition-colors cursor-pointer" onClick={() => { setSelectedApp(app); setEditingApp(false); }}>
                  <td className="p-3"><div className="font-bold text-sm text-slate-900 hover:text-green-600">{app.name}</div><div className="text-xs text-slate-400">{app.email}</div></td>
                  <td className="p-3"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', app.type === 'Tenant' ? 'bg-blue-100 text-blue-700' : app.type === 'Landlord' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700')}>{app.type}</span></td>
                  <td className="p-3"><div className="text-xs text-slate-700 font-medium">{app.property}</div><div className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={8} /> {app.location} • {app.propertyType}</div></td>
                  <td className="p-3"><select value={app.status} onClick={e => e.stopPropagation()} onChange={e => changeAppStatus(app.id, e.target.value)} className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border outline-none cursor-pointer', STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-600 border-slate-200')}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                  <td className="p-3 text-xs text-slate-500">{app.submitted}</td>
                  <td className="p-3" onClick={e => e.stopPropagation()}><div className="flex gap-1">
                    <button onClick={() => { setSelectedApp(app); setEditingApp(false); }} className="p-1.5 hover:bg-slate-100 rounded-lg" title="View"><Eye size={14} className="text-slate-400" /></button>
                    <button onClick={() => { setSelectedApp(app); setEditingApp(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={14} className="text-blue-500" /></button>
                    <button onClick={() => { const idx = applications.findIndex(a => a.id === app.id); deleteApplication(idx); }} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ PROPERTIES ═══ */}
      {subTab === 'properties' && (<div className="space-y-4"><div className="flex justify-end"><button onClick={() => setShowAddProperty(true)} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 flex items-center gap-1.5"><Plus size={14} /> Add Property</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{properties.map((prop, i) => (<div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedProp(prop)}><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">{prop.type === 'House' && <Home size={14} className="text-green-600" />}{prop.type === 'Apartment' && <Building2 size={14} className="text-green-600" />}{prop.type === 'Short-Term' && <Star size={14} className="text-green-600" />}{prop.type === 'Commercial' && <Briefcase size={14} className="text-green-600" />}{!['House','Apartment','Short-Term','Commercial'].includes(prop.type) && <Home size={14} className="text-green-600" />}</div><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase', TIER_COLORS[prop.tier])}>{prop.tier}</span></div><div className="flex items-center gap-1"><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', STATUS_COLORS[prop.status] || 'bg-slate-100 text-slate-600')}>{prop.status}</span><div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity" onClick={e => e.stopPropagation()}><button onClick={() => { setSelectedProp(prop); setEditingPropIdx(i); }} className="p-1 hover:bg-blue-50 rounded"><Edit size={12} className="text-blue-500" /></button><button onClick={() => deleteProperty(i)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400" /></button></div></div></div><h4 className="font-bold text-slate-900 text-sm mb-1">{prop.name}</h4><p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin size={10} /> {prop.location}</p><div className="grid grid-cols-3 gap-2 text-center mb-3"><div className="p-2 bg-slate-50 rounded-lg"><div className="text-sm font-black text-green-600">${prop.rent.toLocaleString()}</div><div className="text-[9px] text-slate-400">{prop.type === 'Short-Term' ? '/night' : '/mo'}</div></div><div className="p-2 bg-slate-50 rounded-lg"><div className="text-sm font-black">{prop.occupancy}</div><div className="text-[9px] text-slate-400">Occupancy</div></div><div className="p-2 bg-slate-50 rounded-lg"><div className="text-sm font-black">{prop.beds}/{prop.baths}</div><div className="text-[9px] text-slate-400">Bed/Bath</div></div></div><div className="text-xs text-slate-500 border-t border-slate-100 pt-2"><span className="font-semibold">Tenant:</span> {prop.tenant}</div>{prop.nextInspection !== '—' && <div className="text-[10px] text-blue-600 font-bold mt-1">Next Inspection: {prop.nextInspection}</div>}</div>))}</div></div>)}

      {/* ═══ CALENDAR ═══ */}
      {subTab === 'calendar' && (<div className="space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Calendar size={16} className="text-blue-600" /> CannaCribs Calendar</h3><div className="flex items-center gap-2">{[{ type: 'inspection', label: '🔍 Inspections', c: 'bg-blue-100 text-blue-700' },{ type: 'booking', label: '📅 Bookings', c: 'bg-purple-100 text-purple-700' },{ type: 'cleaning', label: '✨ Cleaning', c: 'bg-emerald-100 text-emerald-700' },{ type: 'maintenance', label: '🔧 Maintenance', c: 'bg-amber-100 text-amber-700' }].map(l => <span key={l.type} className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', l.c)}>{l.label}</span>)}</div></div><button onClick={() => setShowAddCalEvent(true)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 flex items-center gap-1.5"><Plus size={14} /> Add Event</button></div><div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between"><button onClick={() => setCalMonth(m => Math.max(0, m - 1))} className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg">← Prev</button><h4 className="font-black text-slate-900">{new Date(2026, calMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h4><button onClick={() => setCalMonth(m => Math.min(11, m + 1))} className="px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg">Next →</button></div><div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-2">{d}</div>)}</div><div className="grid grid-cols-7">{(() => { const firstDay = new Date(2026, calMonth, 1).getDay(); const daysInMonth = new Date(2026, calMonth + 1, 0).getDate(); const cells = []; for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} className="min-h-[80px] border-b border-r border-slate-100 bg-slate-50/50" />); for (let d = 1; d <= daysInMonth; d++) { const dateStr = `2026-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; const dayEvents = calEvents.filter(e => e.date === dateStr); const isToday = d === 13 && calMonth === 6; cells.push(<div key={d} className={cn("min-h-[80px] border-b border-r border-slate-100 p-1", isToday && "bg-blue-50/50")}><div className={cn("text-xs font-bold mb-1 px-1", isToday ? "text-blue-600" : "text-slate-500")}>{d}</div><div className="space-y-0.5">{dayEvents.map((ev, j) => (<div key={j} className={cn("px-1 py-0.5 rounded text-[8px] font-bold border truncate cursor-pointer group/evt flex items-center gap-0.5", CAL_TEXT[ev.type])} title={`${ev.title} — ${ev.property}`}><span className={cn("w-1.5 h-1.5 rounded-full shrink-0", CAL_COLORS[ev.type])} /><span className="truncate">{ev.title}</span><button onClick={() => deleteCalEvent(calEvents.indexOf(ev))} className="opacity-0 group-hover/evt:opacity-100 ml-auto shrink-0"><X size={8} /></button></div>))}</div></div>); } return cells; })()}</div></div><div className="bg-white rounded-xl border border-slate-200 p-6"><h4 className="font-bold text-sm text-slate-900 mb-4">Upcoming Events</h4><div className="space-y-2 max-h-[300px] overflow-y-auto">{calEvents.filter(e => e.date >= '2026-07-13').map((ev, i) => (<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group"><div className="flex items-center gap-3"><div className={cn("w-3 h-3 rounded-full", CAL_COLORS[ev.type])} /><div><div className="text-sm font-bold text-slate-800">{ev.title}</div><div className="text-xs text-slate-400">{ev.date} • {ev.property}</div></div></div><div className="flex items-center gap-2"><span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold", TIER_COLORS[ev.tier])}>{ev.tier}</span><button onClick={() => deleteCalEvent(i)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400" /></button></div></div>))}</div></div></div>)}

      {/* ═══ INSPECTIONS ═══ */}
      {subTab === 'inspections' && (<div className="space-y-6"><div className="bg-white rounded-xl border border-slate-200 p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Eye size={16} className="text-violet-600" /> {checklist.length}-Point Inspection Checklist</h3><button onClick={() => setShowAddInspection(true)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 flex items-center gap-1"><Plus size={12} /> Add Item</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{checklist.map((item, i) => (<div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group"><div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span className="text-xs text-slate-700 font-medium">{item}</span></div><button onClick={() => deleteInspectionItem(i)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded"><Trash2 size={10} className="text-red-400" /></button></div>))}</div></div><div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><CalendarCheck size={16} className="text-blue-600" /> Upcoming Inspections</h3><div className="space-y-3">{properties.filter(p => p.nextInspection !== '—').map((prop, i) => (<div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100" onClick={() => setSelectedProp(prop)}><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><CalendarCheck size={14} className="text-blue-600" /></div><div><div className="text-sm font-bold text-slate-900">{prop.name}</div><div className="text-xs text-slate-400">{prop.location}</div></div></div><div className="text-right flex items-center gap-3"><div><div className="text-sm font-bold text-blue-600">{prop.nextInspection}</div><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', TIER_COLORS[prop.tier])}>{prop.tier}</span></div><button className="p-1 hover:bg-blue-50 rounded" onClick={e => { e.stopPropagation(); setSelectedProp(prop); setEditingPropIdx(properties.indexOf(prop)); }}><Edit size={12} className="text-blue-500" /></button></div></div>))}</div></div><div className="bg-white rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2"><Sparkles size={16} className="text-purple-600" /> Cleaning Service Tiers</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[{ tier: 'Standard Clean', price: '$85', desc: 'Surface cleaning, vacuum, mop, bathroom/kitchen scrub, trash removal', color: 'border-emerald-200 bg-emerald-50' },{ tier: 'Deep Clean', price: '$175', desc: 'Standard + appliance interior, baseboard, window sill, cabinet wipe, grout', color: 'border-amber-200 bg-amber-50' },{ tier: 'Turnover Clean + Odor', price: '$350', desc: 'Deep clean + ozone treatment, air scrub, carpet steam, linen change', color: 'border-purple-200 bg-purple-50' }].map((c, i) => (<div key={i} className={cn('rounded-xl border-2 p-4', c.color)}><div className="text-xl font-black text-slate-900 mb-1">{c.price}</div><div className="text-sm font-bold text-slate-700 mb-2">{c.tier}</div><div className="text-xs text-slate-500 leading-relaxed">{c.desc}</div></div>))}</div></div></div>)}

      {/* ═══ VAULT ═══ */}
      {subTab === 'vault' && (<div className="space-y-4"><div className="flex items-center justify-between"><h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><FolderLock size={16} className="text-violet-600" /> CannaCribs Document Vault</h3><button onClick={() => setShowUploadVault(true)} className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-lg hover:bg-violet-500 flex items-center gap-1.5"><Upload size={14} /> Upload Document</button></div><div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><table className="w-full"><thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Document</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Type</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Property</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Date</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Size</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Actions</th></tr></thead><tbody>{vaultDocs.map((doc, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedVaultDoc(doc)}><td className="p-3"><div className="flex items-center gap-2"><FileImage size={16} className="text-violet-500" /><span className="text-sm font-bold text-slate-800">{doc.name}</span></div></td><td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">{doc.type}</span></td><td className="p-3 text-xs text-slate-600">{doc.property}</td><td className="p-3 text-xs text-slate-500">{doc.date}</td><td className="p-3 text-xs text-slate-500">{doc.size}</td><td className="p-3" onClick={e => e.stopPropagation()}><div className="flex gap-1"><button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Download"><Download size={14} className="text-slate-400" /></button><button onClick={() => setSelectedVaultDoc(doc)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="View"><Eye size={14} className="text-blue-500" /></button><button onClick={() => deleteVaultDoc(i)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button></div></td></tr>))}</tbody></table></div></div>)}

      {/* ═══ LANDLORDS ═══ */}
      {subTab === 'landlords' && (<div className="space-y-4"><div className="bg-white rounded-xl border border-slate-200 overflow-hidden"><div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between"><h3 className="font-bold text-sm text-slate-900 flex items-center gap-2"><Users size={16} className="text-purple-600" /> Registered Landlords</h3><button onClick={() => setShowAddLandlord(true)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 flex items-center gap-1"><Plus size={12} /> Onboard Landlord</button></div><table className="w-full"><thead><tr className="bg-slate-50 border-b border-slate-200"><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Landlord</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Properties</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Tier</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Revenue</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th><th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Actions</th></tr></thead><tbody>{landlords.map((ll, i) => (<tr key={i} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => { setSelectedLandlord(ll); setEditingLLIdx(null); }}><td className="p-3"><div className="font-bold text-sm text-slate-900 hover:text-green-600">{ll.name}</div><div className="text-xs text-slate-400">{ll.email}</div></td><td className="p-3 text-sm font-bold text-slate-700">{ll.properties}</td><td className="p-3"><span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase', TIER_COLORS[ll.tier])}>{ll.tier}</span></td><td className="p-3 text-sm font-bold text-green-600">{ll.revenue}</td><td className="p-3"><span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', ll.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ll.status === 'Onboarding' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500')}>{ll.status}</span></td><td className="p-3" onClick={e => e.stopPropagation()}><div className="flex gap-1"><button onClick={() => { setSelectedLandlord(ll); setEditingLLIdx(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg" title="View"><Eye size={14} className="text-slate-400" /></button><button onClick={() => { setSelectedLandlord(ll); setEditingLLIdx(i); }} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={14} className="text-blue-500" /></button><button onClick={() => deleteLandlord(i)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-400" /></button></div></td></tr>))}</tbody></table></div></div>)}
    </div>
  );
};

export default CannaCribsManagementTab;
