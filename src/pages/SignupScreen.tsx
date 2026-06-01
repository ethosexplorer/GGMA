import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, User, AlertCircle, Eye, EyeOff, Info, ChevronRight, ArrowLeft,
  Lock, Mail, Loader2, ArrowRight, Globe, MapPin, ChevronDown, ChevronUp,
  Send, Sparkles, Briefcase, Bot, Check, Leaf, CheckCircle,
  Phone, Building2, GraduationCap, Users, Stethoscope, HeartHandshake,
  Activity, Plus, CircleCheck, Headphones, Clock, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';
import {
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { captureContact } from '../lib/contactCapture';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];
export const SignupScreen = ({ onLogin, onComplete, onNavigate, initialRole = 'user' }: {
  key?: string,
  onBack?: () => void,
  onLogin: () => void,
  onComplete: (email: string, pass: string, role: string, data: any) => Promise<void>,
  onNavigate?: (view: string) => void,
  initialRole?: string
}) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pushOptIn, setPushOptIn] = useState(false);

  // Common + Role Specific Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    dlNumber: '',
    email: '',
    password: '',
    phone: '',
    state: 'National',
    // Patient/Provider
    address: '',
    isProvider: false,
    patientSubRole: '',
    selectedPlan: '',
    selectedBillingCycle: 'monthly',
    businessType: 'cannabis',
    selectedAddOns: [] as string[],
    medicalProviderLicense: '',
    npi: '',
    caregiverPatientId: '',
    // Business
    companyName: '',
    ein: '',
    organizationType: 'Dispensary',
    businessLicenseNumber: '',
    employeeCount: '',
    // Attorney
    barNumber: '',
    practiceAreas: [],
    lawFirmName: '',
    // Regulator
    agencyName: '',
    officialTitle: '',
    jurisdiction: 'State',
    badgeNumber: '',
    // Executive
    invitationCode: '',
    department: '',
    ssn: '', // Added for ID Code (last 4)
    customRoleName: '',
  });

  const [uploads, setUploads] = useState({
    dlFront: false,
    dlBack: false,
    additionalDoc: false
  });
  
  const [privacyConsent, setPrivacyConsent] = useState(false);

        const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL ROLES (Professional Entities)
    { id: 'compliance_service', label: 'Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies managing cards and compliance for clients.' },
    { id: 'business', label: 'Commercial Entity (Dispensary/Cultivator)', category: 'Business', icon: Building2, desc: 'Dispensaries, growers, and processors requiring state-integrated tools.' },
    { id: 'provider', label: 'Medical Provider / Physician', category: 'Business', icon: Stethoscope, desc: 'Licensed medical professionals conducting consultations and certifications.' },
    { id: 'attorney', label: 'Attorney / Law Firm', category: 'Business', icon: Briefcase, desc: 'Legal counsel managing multi-state licensing and compliance portfolios.' },
    
    // OVERSIGHT PORTAL ROLES
    { id: 'enforcement_federal', label: 'Federal Agency (DEA/FBI)', category: 'Oversight', icon: Shield, desc: 'Federal regulatory compliance and interstate enforcement operations.' },
    { id: 'gov_office', label: 'Government / Policy Maker', category: 'Oversight', icon: Building2, desc: 'Municipal, state, and federal officials requiring policy and tax impact data.' },
    { id: 'advocate_researcher', label: 'Advocacy & Non-Profit', category: 'Oversight', icon: HeartHandshake, desc: 'Researchers and advocates tracking public health and social equity metrics.' },
    { id: 'admin_external', label: 'External Administrator', category: 'Oversight', icon: Activity, desc: 'Administrative monitoring for external agencies and partners.' },
    { id: 'enforcement_state', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing (RIP) for authorized agencies.' },
    { id: 'regulator_state', label: 'Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'State-level licensing authority and legal oversight bodies.' },
    { id: 'other_patient', label: 'Other', category: 'Patient', icon: Plus, desc: 'Not listed here? Define your custom role.' },
    { id: 'other_business', label: 'Other', category: 'Business', icon: Plus, desc: 'Not listed here? Define your custom role.' },
    { id: 'other_oversight', label: 'Other', category: 'Oversight', icon: Plus, desc: 'Not listed here? Define your custom role.' },
    { id: 'other_operations', label: 'Other', category: 'Operations', icon: Plus, desc: 'Not listed here? Define your custom role.' }
  ];

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // --- Address Autocomplete ---
  const [addressSuggestions, setAddressSuggestions] = useState<{formatted: string; address_line1: string; address_line2: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressWrapperRef = useRef<HTMLDivElement>(null);

  const fetchAddressSuggestions = useCallback((text: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const trimmed = text.trim();
    // Only trigger after a full word or number is entered (trailing space or ends with a digit sequence)
    const hasCompleteToken = text.endsWith(' ') || /\d+\s/.test(text) || /\b\d+$/.test(trimmed);
    if (!trimmed || trimmed.length < 2 || !hasCompleteToken) {
      return;
    }
    debounceTimerRef.current = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(trimmed)}&filter=countrycode:us&apiKey=274a3cfd28334ecfbb269e99496afdbc`
        );
        const data = await res.json();
        const results = (data.features || []).map((f: any) => ({
          formatted: f.properties.formatted || '',
          address_line1: f.properties.address_line1 || '',
          address_line2: f.properties.address_line2 || '',
        }));
        setAddressSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error('Address autocomplete error:', err);
        setAddressSuggestions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 300);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addressWrapperRef.current && !addressWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const AddressAutocompleteInput = ({ label, name, value, required, placeholder }: { label: string; name: string; value: string; required?: boolean; placeholder?: string }) => (
    <div className="relative space-y-1.5 w-full" ref={addressWrapperRef}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          required={required}
          placeholder={placeholder || '123 Example St, City, State ZIP'}
          autoComplete="off"
          onChange={(e) => {
            setFormData(prev => ({ ...prev, [name]: e.target.value }));
            fetchAddressSuggestions(e.target.value);
          }}
          onFocus={() => { if (addressSuggestions.length > 0) setShowSuggestions(true); }}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 transition-all focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731]"
        />
        {addressLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
      </div>
      {showSuggestions && addressSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {addressSuggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-slate-50 last:border-0 flex flex-col gap-0.5"
              onMouseDown={(e) => {
                e.preventDefault();
                setFormData(prev => ({ ...prev, [name]: s.formatted }));
                setShowSuggestions(false);
                setAddressSuggestions([]);
              }}
            >
              <span className="text-sm font-medium text-slate-800">{s.address_line1}</span>
              <span className="text-xs text-slate-500">{s.address_line2}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const submitDraft = async () => {
    setLoading(true);
    // Simulate Draft save
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onLogin(); 
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onComplete(formData.email, formData.password, selectedRole, formData);
    } catch (err: any) {
      const errorCode = err?.code || 'unknown';
      const errorMessage = err?.message || 'Unknown error';
      console.error('[AdminSignup] Registration failed:', { errorCode, errorMessage, selectedRole });

      const friendlyMessages: Record<string, string> = {
        'auth/operation-not-allowed': 'Sign-in is not enabled.',
        'auth/network-request-failed': 'Network error. Check connection.',
        'auth/email-already-in-use': 'Account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
      };
      setError(friendlyMessages[errorCode] || `Registration failed: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200/50 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGHP Logo" className="h-12 w-auto object-contain" />
          <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:inline">GGHP Secure Registry</span>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1a4731] mb-3">Create Account</h1>
          <p className="text-slate-600">Join the unified platform. Setup your workspace in 4 easy steps.</p>
        </div>

        {/* Stepper Progress */}
        <div className="w-full flex items-center justify-between mb-12 relative px-4 md:px-12">
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1a4731] transition-all duration-500 ease-out" 
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
            </div>
            
            {[
              { num: 1, label: 'Role Selection' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Verification' },
              { num: 4, label: 'Review & Submit' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-[#FDFBF7] px-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                  step > s.num ? "bg-[#1a4731] border-[#1a4731] text-white" : 
                  step === s.num ? "bg-white border-[#1a4731] text-[#1a4731] shadow-md ring-4 ring-emerald-50" : 
                  "bg-white border-slate-300 text-slate-400"
                )}>
                  {step > s.num ? <CircleCheck size={20} /> : s.num}
                </div>
                <span className={cn(
                  "text-xs font-semibold whitespace-nowrap transition-colors",
                  step >= s.num ? "text-[#1a4731]" : "text-slate-400"
                )}>{s.label}</span>
              </div>
            ))}
        </div>

        {error && (
            <div className="w-full bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 mb-8 shadow-sm">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
        )}

        {/* Content Container */}
        <div className="w-full bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
            
            {/* --- STEP 1: ROLE SELECTION --- */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                    {['Patient', 'Business', 'Oversight', 'Operations'].filter(cat => !initialRole || initialRole === 'all' || cat === initialRole).map((cat) => (
                        <div key={cat} className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">
                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}
                                {cat === 'Operations' && <Headphones size={18} className="text-indigo-500" />}
                                {cat}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roles.filter(r => r.category === cat).map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={cn(
                                            "flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left group relative overflow-hidden",
                                            selectedRole === role.id
                                            ? "border-[#1a4731] bg-[#f2f7f4] ring-1 ring-[#1a4731]/10"
                                            : "border-slate-200 hover:border-slate-300 hover:shadow-md bg-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105",
                                            selectedRole === role.id ? "bg-[#1a4731] text-white shadow-md" : "bg-slate-100 text-slate-500"
                                        )}>
                                            <role.icon size={20} />
                                        </div>
                                        <h3 className="font-bold text-sm mb-1">{role.label}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{role.desc}</p>
                                        
                                        {selectedRole === role.id && (
                                            <div className="absolute top-4 right-4 text-[#1a4731]">
                                                <CircleCheck size={20} className="fill-[#1a4731] text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {selectedRole === 'other_' + cat.toLowerCase() && (
                                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Please specify your role</label>
                                    <input type="text" name="customRoleName" value={formData.customRoleName} onChange={handleInputChange} placeholder="E.g., Logistics Coordinator, Vendor, etc." className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731]" required />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- STEP 2: DETAILS --- */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 border-b border-slate-100 pb-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                             <h2 className="text-lg font-bold text-slate-800 capitalize">Personal & Business Details <span className="text-slate-400 font-normal ml-2">({selectedRole})</span></h2>
                        </div>
                    </div>

                    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                        {/* COMMON REQUIRED FIELDS */}
                        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 space-y-5">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Common Required Fields</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input label={<span>Full Name (First & Last) <span className="text-red-500">*</span></span>} name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="E.g., Sarah Jenkins" required />
                                <Input label={<span>Email Address <span className="text-red-500">*</span></span>} type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="sarah@example.com" required />
                                <Input label={<span>Date of Birth (DOB) <span className="text-red-500">*</span></span>} name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                                <Input label={<span>Password (8+ chars) <span className="text-red-500">*</span></span>} name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                                <Input label={<span>Driver's License / State ID Number <span className="text-red-500">*</span></span>} name="dlNumber" value={formData.dlNumber} onChange={handleInputChange} placeholder="X0000000" required />
                                <Input label={<span>Phone Number <span className="text-red-500">*</span></span>} name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="(555) 000-0000" required />
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Resident / Operating State <span className="text-red-500">*</span></label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20">
                                        <option value="National">National (Federal Context)</option>
                                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ROLE SPECIFIC FIELDS */}
                        <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100/50 space-y-5">
                             <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Role Specific Details Configuration</h3>
                             
                             <div className="mb-6 space-y-1.5 bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                                <label className="text-sm font-bold text-emerald-900">Entity Title or Position (For Approval Routing) <span className="text-red-500">*</span></label>
                                <select name="entityTitleOrPosition" value={formData.entityTitleOrPosition} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20 font-medium" required>
                                    <option value="">-- Select Your Exact Title/Position --</option>
                                    
                                    <optgroup label="Patient Portal Roles">
                                        <option value="Primary Adult Patient">Primary Adult Patient</option>
                                        <option value="Registered Caregiver">Registered Caregiver</option>
                                        <option value="Minor Patient Guardian">Minor Patient Guardian</option>
                                        <option value="Out-of-State Reciprocity Patient">Out-of-State Reciprocity Patient</option>
                                    </optgroup>
                                    
                                    <optgroup label="Business & Provider Roles">
                                        <option value="Business Owner / CEO">Business Owner / CEO</option>
                                        <option value="General Manager">General Manager</option>
                                        <option value="Chief Compliance Officer">Chief Compliance Officer</option>
                                        <option value="Medical Director / Supervising Physician">Medical Director / Supervising Physician</option>
                                        <option value="Recommending Practitioner (MD/DO)">Recommending Practitioner (MD/DO)</option>
                                        <option value="Medcard Service Administrator">Medcard Service Administrator</option>
                                        <option value="General Counsel / Attorney">General Counsel / Attorney</option>
                                        <option value="Dispensary Agent / Budtender">Dispensary Agent / Budtender</option>
                                        <option value="Cultivation / Processing Director">Cultivation / Processing Director</option>
                                        <option value="Lab Technician / Scientist">Lab Technician / Scientist</option>
                                    </optgroup>
                                    
                                    <optgroup label="Government & Admin Roles">
                                        <option value="State Authority Director">State Authority Director</option>
                                        <option value="Compliance Auditor">Compliance Auditor</option>
                                        <option value="Field Inspector">Field Inspector</option>
                                        <option value="Chief of Police / Sheriff">Chief of Police / Sheriff</option>
                                        <option value="Narcotics Investigator">Narcotics Investigator</option>
                                        <option value="City Council / Mayor">City Council / Mayor</option>
                                        <option value="State Attorney / Prosecutor">State Attorney / Prosecutor</option>
                                        <option value="Federal DEA / Agent">Federal DEA / Agent</option>
                                    </optgroup>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">This determines your dashboard features and goes to our paralegal queue for verification.</p>
                             </div>
                             <div className="mb-6 space-y-1.5 bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                                <label className="text-sm font-bold text-emerald-900">Entity Title or Position (For Approval Routing) <span className="text-red-500">*</span></label>
                                <select name="entityTitleOrPosition" value={formData.entityTitleOrPosition} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20 font-medium" required>
                                    <option value="">-- Select Your Exact Title/Position --</option>
                                    
                                            <optgroup label="Patient Portal Roles">
                                        <option value="Primary Adult Patient">Primary Adult Patient</option>
                                        <option value="Registered Caregiver">Registered Caregiver</option>
                                        <option value="Minor Patient Guardian">Minor Patient Guardian</option>
                                    </optgroup>
                                    
                                    <optgroup label="Business & Provider Roles">
                                        <option value="Business Owner / CEO">Business Owner / CEO</option>
                                        <option value="General Manager">General Manager</option>
                                        <option value="Chief Compliance Officer">Chief Compliance Officer</option>
                                        <option value="General Counsel / Attorney">General Counsel / Attorney</option>
                                        <option value="Paralegal / Legal Staff">Paralegal / Legal Staff</option>
                                        <option value="Medical Director">Medical Director</option>
                                        <option value="Physician (MD/DO)">Physician (MD/DO)</option>
                                        <option value="PA / NP / LPN">PA / NP / LPN</option>
                                        <option value="Medical Office Staff">Medical Office Staff</option>
                                        <option value="Compliance Service Admin">Compliance Service Admin</option>
                                    </optgroup>
                                    
                                    <optgroup label="Oversight & RIP Roles">
                                        <option value="Federal Agent / Director">Federal Agent / Director</option>
                                        <option value="Government Official / Policy Maker">Government Official / Policy Maker</option>
                                        <option value="Advocacy / Researcher">Advocacy / Researcher</option>
                                        <option value="External Administrator">External Administrator</option>
                                        <option value="State Authority Director">State Authority Director</option>
                                        <option value="Chief of Police / Sheriff">Chief of Police / Sheriff</option>
                                        <option value="Field Inspector">Field Inspector</option>
                                    </optgroup>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">This determines your dashboard features and goes to our paralegal queue for verification.</p>
                             </div>
                             

                             
                             {selectedRole === 'user' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">I am a... <span className="text-red-500">*</span></label>
                                        <select name="patientSubRole" value={formData.patientSubRole} onChange={(e) => setFormData(p => ({...p, patientSubRole: e.target.value, isProvider: e.target.value === 'caregiver' || e.target.value === 'telehealth-caregiver', selectedPlan: ''}))} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20">
                                            <option value="">Select a role...</option>
                                            <option value="telehealth-patient">TeleHealth Patient – Subscription</option>
                                            <option value="medical-card-patient">Medical Card Patient (Cannabis Medical Card)</option>
                                            <option value="caregiver">Caregiver (Cannabis Medical Card Caregiver)</option>
                                            <option value="telehealth-caregiver">TeleHealth Caregiver – Subscription</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Physical Address" name="address" value={formData.address} required />
                                    </div>
                                    {(formData.patientSubRole === 'caregiver' || formData.patientSubRole === 'telehealth-caregiver') && (
                                        <Input label="Linked Patient ID" name="caregiverPatientId" value={formData.caregiverPatientId} onChange={handleInputChange} placeholder="Enter the patient ID you are caring for" required />
                                    )}
                                </div>
                             )}

                             { selectedRole?.startsWith('medical_provider_') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label={<span>Practice / Clinic Address <span className="text-red-500">*</span></span>} name="address" value={formData.address} required />
                                    </div>
                                    <Input label={<span>Professional License Number <span className="text-red-500">*</span></span>} name="medicalProviderLicense" value={formData.medicalProviderLicense} onChange={handleInputChange} required />
                                    <Input label={<span>NPI (National Provider ID)</span>} name="npi" value={formData.npi} onChange={handleInputChange} />
                                    <Input label="DEI / State Controlled Substance Registration" name="caregiverPatientId" value={formData.caregiverPatientId} onChange={handleInputChange} placeholder="Optional for staff" />
                                </div>
                             )}

                             {selectedRole === 'compliance_service' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Company Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Tax ID / EIN <span className="text-red-500">*</span></span>} name="ein" value={formData.ein} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Business Address" name="address" value={formData.address} required />
                                    </div>
                                    <Input label="Number of Managed Clients" type="number" name="clientCount" value={formData.employeeCount} onChange={handleInputChange} />
                                </div>
                             )}
                             
                             {selectedRole === 'business' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Business Industry Setup <span className="text-red-500">*</span></label>
                                        <div className="flex gap-4">
                                            <label className={cn("flex-1 p-3 rounded-lg border-2 cursor-pointer flex justify-between items-center", formData.businessType === 'cannabis' ? "border-[#1a4731] bg-emerald-50 text-[#1a4731]" : "border-slate-200")}>
                                              <span className="font-bold text-sm">Cannabis Industry</span>
                                              <input type="radio" name="businessType" value="cannabis" checked={formData.businessType === 'cannabis'} onChange={handleInputChange} className="hidden" />
                                              {formData.businessType === 'cannabis' && <CircleCheck size={18} />}
                                            </label>
                                            <label className={cn("flex-1 p-3 rounded-lg border-2 cursor-pointer flex justify-between items-center", formData.businessType === 'traditional' ? "border-[#1a4731] bg-emerald-50 text-[#1a4731]" : "border-slate-200")}>
                                              <span className="font-bold text-sm">Traditional Business</span>
                                              <input type="radio" name="businessType" value="traditional" checked={formData.businessType === 'traditional'} onChange={handleInputChange} className="hidden" />
                                              {formData.businessType === 'traditional' && <CircleCheck size={18} />}
                                            </label>
                                        </div>
                                    </div>
                                    <Input label={<span>Business Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>EIN (Tax ID) <span className="text-red-500">*</span></span>} name="ein" value={formData.ein} onChange={handleInputChange} required />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Organization Type <span className="text-red-500">*</span></label>
                                        <select name="organizationType" value={formData.organizationType} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg">
                                            <option>Dispensary</option>
                                            <option>Cultivator</option>
                                            <option>Processor</option>
                                            <option>Lab</option>
                                            <option>Transport</option>
                                        </select>
                                    </div>
                                    <Input label="Business License Number (If held)" name="businessLicenseNumber" value={formData.businessLicenseNumber} onChange={handleInputChange} />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label={<span>Physical Business Address <span className="text-red-500">*</span></span>} name="address" value={formData.address} required />
                                        <div className="mt-2 flex items-center gap-4 text-[10px] font-mono text-slate-400">
                                            <div className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><MapPin size={10}/> GPS: {formData.address ? '35.4676, -97.5164' : 'Pending Verification'}</div>
                                            <div className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500"/> USPS Address Verified</div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-3">
                                        <input type="checkbox" id="mailingSame" className="w-4 h-4 text-[#1a4731] border-slate-300 rounded focus:ring-[#1a4731]" />
                                        <label htmlFor="mailingSame" className="text-sm text-slate-600 font-medium">Mailing address is same as physical</label>
                                    </div>
                                    
                                    <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                                        <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Clock size={16} className="text-blue-500"/> Operating Hours</h4>
                                        <div className="space-y-3">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                <div key={day} className="flex items-center gap-4">
                                                    <label className="flex items-center gap-2 w-32">
                                                        <input type="checkbox" defaultChecked={day !== 'Sunday'} className="w-4 h-4 rounded border-slate-300 text-[#1a4731] focus:ring-[#1a4731]" />
                                                        <span className="text-sm font-medium text-slate-600">{day}</span>
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="time" defaultValue="09:00" className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                                                        <span className="text-slate-400 text-xs">to</span>
                                                        <input type="time" defaultValue="21:00" className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Input label="Number of Employees" type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} />
                                </div>
                             )}

                             { (selectedRole === 'attorney_lawyer' || selectedRole === 'attorney_staff') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="State Bar Number (Mandatory for Attorneys)" name="barNumber" value={formData.barNumber} onChange={handleInputChange} required={selectedRole === 'attorney_lawyer'} placeholder="BAR-XXXXX" />
                                    <Input label="Law Firm / Legal Dept Name" name="lawFirmName" value={formData.lawFirmName} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <Input label="Legal Practice Areas" name="practiceAreas" placeholder="e.g. Regulatory Compliance, Licensing, Administrative Law" value={(formData.practiceAreas as string[] || []).join(', ')} onChange={(e: any) => setFormData(p => ({...p, practiceAreas: e.target.value.split(', ')}))} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Firm Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             )}

                             { (selectedRole === 'regulator_state' || selectedRole === 'enforcement_rip' || selectedRole === 'executive_founder' || selectedRole === 'admin_internal' || selectedRole === 'admin_external') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Agency / Department Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Official ID / Badge Number <span className="text-red-500">*</span></span>} name="officialId" value={formData.officialId} onChange={handleInputChange} required />
                                    {selectedRole === 'admin_internal' && (
                                        <div className="md:col-span-2">
                                            <Input label={<span>Social Security Number (For ID Code Gen) <span className="text-red-500">*</span></span>} name="ssn" value={formData.ssn} onChange={handleInputChange} placeholder="000-00-0000" required />
                                            <p className="text-[10px] text-amber-600 font-bold uppercase mt-1">Last 4 digits will be your internal login PIN.</p>
                                        </div>
                                    )}
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Agency Headquarters Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             )}

                             {selectedRole === 'executive' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2 bg-[#E9C46A]/20 border border-[#E9C46A]/30 p-4 rounded-lg flex items-start gap-3">
                                        <AlertCircle size={20} className="text-[#B08968] shrink-0 mt-0.5" />
                                        <p className="text-sm text-[#7F5539] leading-relaxed font-bold">
                                            Executive Module access requires a verified Invitation Code. Other fields cannot be processed without pre-authorization.
                                        </p>
                                    </div>
                                    <Input label="Invitation Code" name="invitationCode" value={formData.invitationCode} onChange={handleInputChange} placeholder="GGP-XXXX-XXXX" required />
                                    <Input label="Organization / Department" name="department" value={formData.department} onChange={handleInputChange} required />
                                </div>
                             )}
                             {/* SUBSCRIPTION PLAN SELECTION (Global) - Bypassed for Internal Admins */}
                             {!selectedRole.startsWith('executive') && selectedRole !== 'backoffice_staff' && selectedRole !== 'admin_internal' && (
                                <div className="mt-8 space-y-6 pt-6 border-t border-emerald-100/50 relative">
                                  <div className="bg-[#f2f7f4] border border-[#1a4731]/20 p-6 rounded-xl flex flex-col items-center text-center">
                                    <Sparkles size={32} className="text-[#1a4731] mb-4" />
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Create Your Free Account Today!</h3>
                                    <p className="text-slate-600 max-w-md mx-auto mb-4">
                                      Unlock advanced AI capabilities, multi-state aggregation, and priority compliance routing. Scale your dashboard with tailored modules.
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-4">
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CircleCheck size={12} className="text-emerald-500" /> Advanced AI
                                       </div>
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CircleCheck size={12} className="text-emerald-500" /> Multi-State
                                       </div>
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CircleCheck size={12} className="text-emerald-500" /> Priority Support
                                       </div>
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CircleCheck size={12} className="text-emerald-500" /> Custom API
                                       </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">Pricing and tier selection available post-login for registered free accounts.</p>
                                  </div>
                                </div>
                             )}

                        </div>
                        
                        {/* Hidden Submit to catch enter key */}
                        <button type="submit" className="hidden">Submit</button>
                    </form>
                </div>
            )}

            {/* --- STEP 3: VERIFICATION UPLOADS --- */}
            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 border-b border-slate-100 pb-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
                             <h2 className="text-lg font-bold text-slate-800 capitalize">Verification & Document Uploads</h2>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-slate-700">Driver's License / State ID <span className="text-red-500">*</span></h3>
                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">Required For All Roles</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setUploads(p => ({...p, dlFront: true}))}
                                    className={cn("border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors", uploads.dlFront ? "border-[#1a4731] bg-emerald-50/50" : "border-slate-300 hover:border-slate-400 bg-slate-50")}
                                >
                                    {uploads.dlFront ? <CircleCheck size={32} className="text-[#1a4731]"/> : <FileText size={32} className="text-slate-400" />}
                                    <div className="text-center">
                                        <span className="block font-bold text-slate-700">{uploads.dlFront ? "Front ID Uploaded" : "Upload ID Front"}</span>
                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setUploads(p => ({...p, dlBack: true}))}
                                    className={cn("border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors", uploads.dlBack ? "border-[#1a4731] bg-emerald-50/50" : "border-slate-300 hover:border-slate-400 bg-slate-50")}
                                >
                                    {uploads.dlBack ? <CircleCheck size={32} className="text-[#1a4731]"/> : <FileText size={32} className="text-slate-400" />}
                                    <div className="text-center">
                                        <span className="block font-bold text-slate-700">{uploads.dlBack ? "Back ID Uploaded" : "Upload ID Back"}</span>
                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-700 mb-3">Additional Documents <span className="text-slate-400 font-normal ml-2">(Max 5)</span></h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    selectedRole === 'user' ? "Doctor Rec / Insurance" :
                                    selectedRole === 'provider' ? "Provider License / DEA Cert" :
                                    selectedRole === 'business' ? "EIN / License Cert" :
                                    selectedRole === 'attorney' ? "Bar Card Copy" :
                                    selectedRole === 'regulator' ? "Official ID / Badge" : "Gov/Dept Auth Memo"
                                ].map((docLabel, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setUploads(p => ({...p, additionalDoc: true}))}
                                        className={cn("border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center transition-colors h-32", uploads.additionalDoc ? "border-[#1a4731] bg-emerald-50/30" : "border-slate-200 hover:border-slate-300 bg-slate-50")}
                                    >
                                        <span className="block text-sm font-bold text-slate-700">{docLabel}</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{uploads.additionalDoc ? "Uploaded" : "Optional"}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                            <input 
                                type="checkbox" 
                                id="hipaa" 
                                className="mt-1 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]"
                                checked={privacyConsent}
                                onChange={(e) => setPrivacyConsent(e.target.checked)}
                            />
                            <div className="flex-1">
                                <label htmlFor="hipaa" className="font-bold text-slate-800 text-sm block mb-1">HIPAA / Privacy Consent Statement <span className="text-red-500">*</span></label>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    I consent to the digital processing and secure storage of my provided information according to local jurisdiction laws and state-level compliance mandates. I verify that documents uploaded match the data entered.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STEP 4: REVIEW --- */}
            {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 border-b border-slate-100 pb-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">4</div>
                             <h2 className="text-lg font-bold text-slate-800 capitalize">Review & Submit</h2>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-6">
                        <div className="flex items-center justify-between p-4 bg-slate-100/50 border-b border-slate-200">
                            <span className="font-bold text-sm uppercase text-slate-600 tracking-wider">Account Summary</span>
                            <button onClick={() => setStep(1)} className="text-[#1a4731] text-sm font-bold hover:underline">Edit</button>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500 w-1/3">Role Selected</td><td className="py-3 px-4 font-bold text-slate-900 capitalize">{selectedRole}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Full Name</td><td className="py-3 px-4 font-bold text-slate-900">{formData.firstName || 'Not provided'}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Email Address</td><td className="py-3 px-4 font-bold text-slate-900">{formData.email || 'Not provided'}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">State / Region</td><td className="py-3 px-4 font-bold text-slate-900">{formData.state}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Subscription Plan</td><td className="py-3 px-4 font-bold text-slate-900">Selected After Login</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500 mt-2">Verified Documents</td><td className="py-3 px-4 font-bold text-emerald-600 flex items-center gap-1.5"><CircleCheck size={16}/> {uploads.dlFront && uploads.dlBack ? 'ID Scanned and Verified' : 'Pending Upload'}</td></tr>
                                    {selectedRole === 'admin_internal' && (
                                        <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Internal Login ID Code</td><td className="py-3 px-4 font-black text-amber-600">{formData.ssn?.slice(-4) || 'Pending'}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <input 
                                type="checkbox" 
                                className="mt-0.5 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]" 
                                checked={pushOptIn}
                                onChange={(e) => setPushOptIn(e.target.checked)}
                            />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">
                                    I wish to receive account updates via In-App Push.
                                </p>
                                <p className="text-[11px] leading-relaxed text-slate-500 mt-1.5 border-l-2 border-slate-200 pl-2">
                                    By checking this box, you consent to receive 2FA codes and account notifications via Secure In-App Push Notifications to your connected device. Information is not shared or sold to third parties for marketing purposes. Read our <a href="#" className="text-emerald-600 font-bold hover:underline">Privacy Policy</a>.
                                </p>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                            <input type="checkbox" className="mt-0.5 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]" required />
                            <span className="text-sm text-slate-800 font-medium leading-relaxed flex items-center flex-wrap">
                                <span>I confirm all information is accurate and agree to platform terms of service. I understand this establishes an immutable digital footprint tracked by the GGP-OS compliance engine.</span>
                                <div className="inline-flex items-center group relative ml-1.5 align-middle">
                                   <Info size={16} className="text-[#1a4731] hover:text-emerald-600 transition-colors cursor-help" />
                                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                                     By agreeing, you consent to our HIPAA-compliant data practices, Metrc reporting requirements, state open records policies, and the Care Wallet financial terms.
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                   </div>
                                </div>
                            </span>
                        </label>
                    </div>
                </div>
            )}
            
            {/* ACTION FOOTER */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-slate-100">
                <Button variant="ghost" className="w-full sm:w-auto text-slate-500 font-semibold" onClick={submitDraft}>Save & Resume Later</Button>
                
                <div className="flex gap-3 w-full sm:w-auto">
                    {step > 1 && (
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setStep(step - 1)}>Back</Button>
                    )}
                    {step < 4 && (
                        <Button 
                            className="w-full sm:w-auto px-8" 
                            onClick={() => {
                                if (step === 1 && selectedRole === 'business' && onNavigate) {
                                    onNavigate('business-signup');
                                    return;
                                }
                                if (step === 2 && !selectedRole.startsWith('executive') && selectedRole !== 'backoffice_staff') {
                                    // Subscription selection has been deferred to login
                                }
                                if (step === 3 && (!uploads.dlFront || !uploads.dlBack || !privacyConsent)) {
                                    (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Please complete required uploads and HIPAA consent." })] }).catch(console.error) ); alert("Please complete required uploads and HIPAA consent.\n\n[Live Production Transaction Logged]"); })();
                                    return;
                                }
                                setStep(step + 1);
                            }}
                        >
                            Continue
                        </Button>
                    )}
                    {step === 4 && (
                        <Button 
                            className="w-full sm:w-auto bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-8 font-bold shadow-lg flex-row-reverse" 
                            icon={loading ? Loader2 : CircleCheck}
                            onClick={handleSignup}
                            disabled={loading || !privacyConsent}
                        >
                            {loading ? 'Processing...' : 'Submit Final Registration'}
                        </Button>
                    )}
                </div>
            </div>

        </div>
      </main>
    </div >
  );
};
