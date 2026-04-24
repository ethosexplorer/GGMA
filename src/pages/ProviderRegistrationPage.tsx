import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Stethoscope, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  User,
  Building2,
  Mail,
  Smartphone,
  Briefcase,
  MapPin,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ProviderRegistrationPageProps {
  onNavigate: (view: 'landing' | 'login') => void;
  onComplete?: (data: any) => void;
  key?: string;
}

const PROVIDER_TYPES = [
  'Physician (MD/DO)',
  'Nurse Practitioner (NP)',
  'Physician Assistant (PA)',
  'Clinic / Medical Group',
  'Telehealth Group',
  'Specialist'
];

const SPECIALTIES = [
  'General Practice',
  'Internal Medicine',
  'Family Medicine',
  'Oncology',
  'Neurology',
  'Pain Management',
  'Psychiatry',
  'Pediatrics (Minor Patients)',
  'Other'
];

export default function ProviderRegistrationPage({ onNavigate, onComplete }: ProviderRegistrationPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    providerType: '',
    specialty: '',
    licenseNumber: '',
    npi: '',
    clinicName: '',
    clinicAddress: '',
    clinicCity: '',
    clinicState: '',
    clinicZip: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    documents: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    } else if (step === 2) {
      if (!formData.providerType) newErrors.providerType = 'Provider type is required';
      if (!formData.licenseNumber) newErrors.licenseNumber = 'Medical license number is required';
      if (!formData.npi) newErrors.npi = 'NPI number is required';
      else if (!/^\d{10}$/.test(formData.npi)) newErrors.npi = 'NPI must be a 10-digit number';
    } else if (step === 3) {
      if (!formData.clinicName) newErrors.clinicName = 'Clinic/Practice name is required';
      if (!formData.clinicAddress) newErrors.clinicAddress = 'Address is required';
    } else if (step === 4) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocs = Array.from(files).map((f: any) => f.name);
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
    }
  };

  const removeDoc = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const renderProgress = () => (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
            step === s ? "bg-[#1a4731] text-white" : step > s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
          )}>
            {step > s ? <CheckCircle2 size={16} /> : s}
          </div>
          {s < 4 && <div className={cn("w-12 h-0.5 rounded", step > s ? "bg-emerald-500" : "bg-slate-100")} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Healthcare Provider Registration</h1>
              <p className="text-slate-500 mt-2">Join the GGP-OS medical network and assist patients with applications.</p>
            </div>
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Stethoscope size={32} />
            </div>
          </div>

          {renderProgress()}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">First Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className={cn("w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.firstName && "border-red-500")}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Last Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className={cn("w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.lastName && "border-red-500")}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Professional Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={cn("w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.email && "border-red-500")}
                      placeholder="dr.doe@clinic.com"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Mobile Phone <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={cn("w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.phone && "border-red-500")}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Provider Type <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.providerType}
                      onChange={(e) => updateField('providerType', e.target.value)}
                      className={cn("w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all bg-white", errors.providerType && "border-red-500")}
                    >
                      <option value="">Select Type</option>
                      {PROVIDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.providerType && <p className="text-xs text-red-500">{errors.providerType}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Specialty</label>
                    <select 
                      value={formData.specialty}
                      onChange={(e) => updateField('specialty', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all bg-white"
                    >
                      <option value="">Select Specialty</option>
                      {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Medical License Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.licenseNumber}
                      onChange={(e) => updateField('licenseNumber', e.target.value)}
                      className={cn("w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.licenseNumber && "border-red-500")}
                      placeholder="e.g. 123456"
                    />
                  </div>
                  {errors.licenseNumber && <p className="text-xs text-red-500">{errors.licenseNumber}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">NPI Number (10 Digits) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      maxLength={10}
                      value={formData.npi}
                      onChange={(e) => updateField('npi', e.target.value.replace(/\D/g, ''))}
                      className={cn("w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.npi && "border-red-500")}
                      placeholder="1234567890"
                    />
                  </div>
                  {errors.npi && <p className="text-xs text-red-500">{errors.npi}</p>}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="text-amber-600 shrink-0" size={18} />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Provider credentials will be verified against state medical boards and the NPPES registry. Please ensure all information matches your official registration.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Clinic / Practice Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.clinicName}
                      onChange={(e) => updateField('clinicName', e.target.value)}
                      className={cn("w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.clinicName && "border-red-500")}
                      placeholder="Main Street Medical Center"
                    />
                  </div>
                  {errors.clinicName && <p className="text-xs text-red-500">{errors.clinicName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Clinic Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.clinicAddress}
                      onChange={(e) => updateField('clinicAddress', e.target.value)}
                      className={cn("w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.clinicAddress && "border-red-500")}
                      placeholder="123 Care Lane"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <input 
                      type="text" 
                      value={formData.clinicCity}
                      onChange={(e) => updateField('clinicCity', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <input 
                      type="text" 
                      value={formData.clinicState}
                      onChange={(e) => updateField('clinicState', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">ZIP</label>
                    <input 
                      type="text" 
                      value={formData.clinicZip}
                      onChange={(e) => updateField('clinicZip', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Credential Verification Documents (License, DEA, etc.)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-emerald-300 transition-all cursor-pointer"
                  >
                    <Upload className="text-slate-400 mb-2" size={24} />
                    <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden" 
                      multiple
                    />
                  </div>

                  <div className="space-y-2">
                    {formData.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                          <span className="text-sm text-emerald-800 truncate">{doc}</span>
                        </div>
                        <button onClick={() => removeDoc(i)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Set Password <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={cn("w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.password && "border-red-500")}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Confirm Password <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className={cn("w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] transition-all", errors.confirmPassword && "border-red-500")}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div className="h-px bg-slate-100 my-4" />

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.termsAccepted}
                      onChange={(e) => updateField('termsAccepted', e.target.checked)}
                      className="w-5 h-5 accent-[#1a4731] rounded-lg mt-0.5"
                    />
                    <div className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors flex items-center flex-wrap">
                      <span>I attest that I am a licensed healthcare provider in good standing and that all information provided is accurate. I agree to the <span className="text-[#1a4731] font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-[#1a4731] font-bold underline cursor-pointer">HIPAA Compliance Agreement</span>.</span>
                      <div className="inline-flex items-center group/tooltip relative ml-1.5 align-middle">
                         <Info size={16} className="text-[#1a4731] hover:text-emerald-600 transition-colors cursor-help" />
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all shadow-xl z-50">
                            By agreeing, you consent to our HIPAA-compliant data practices, state open records policies, and platform financial terms regarding telehealth compensation.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                         </div>
                      </div>
                    </div>
                  </label>
                  {errors.termsAccepted && <p className="text-xs text-red-500">{errors.termsAccepted}</p>}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield className="text-emerald-600" size={16} />
                    Registration Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Provider</p>
                      <p className="text-sm font-medium text-slate-700">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">License / NPI</p>
                      <p className="text-sm font-medium text-slate-700">{formData.licenseNumber} / {formData.npi}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Clinic</p>
                      <p className="text-sm font-medium text-slate-700">{formData.clinicName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:text-slate-900 font-medium transition-all"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:text-slate-900 font-medium transition-all"
              >
                <ArrowLeft size={18} />
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all"
              >
                Next Step
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={() => onComplete(formData)}
                className="flex items-center gap-2 px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all"
              >
                Submit Registration
                <CheckCircle size={20} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-8 opacity-40">
        <div className="flex items-center gap-2">
          <Shield size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">HIPAA Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Board Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Enterprise Ready</span>
        </div>
      </div>
    </div>
  );
}
