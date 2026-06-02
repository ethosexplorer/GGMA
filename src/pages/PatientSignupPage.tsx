import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield, ChevronRight, ArrowLeft, Lock, Upload, Leaf, CheckCircle, 
  Loader2, ArrowRight, ChevronDown, ChevronUp, CircleCheck, Check,
  AlertCircle, Eye, EyeOff, User, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];


const PATIENT_STEPS = [
  'License Eligibility Criteria',
  'Personal Information',
  'Caregiver Patient Information',
  'Proof of Identity',
  'Digital Photo Requirements',
  'Attestation',
  'Application Review',
  'Confirmation'
];

interface PayPalButtonProps {
  hostedButtonId: string;
  containerId: string;
  key?: string;
}

const PayPalButton = ({ hostedButtonId, containerId }: PayPalButtonProps) => {
  const [isRendered, setIsRendered] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    
    // Check if script is already in the document, if not append it
    const scriptId = 'paypal-sdk-hosted-buttons';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    const initializeButton = () => {
      let attempts = 0;
      const checkAndRender = () => {
        if (!active) return;
        const paypal = (window as any).paypal;
        if (paypal && paypal.HostedButtons) {
          try {
            const container = document.getElementById(containerId);
            if (container) {
              container.innerHTML = ''; // Clear container to avoid duplicate buttons
            }
            paypal.HostedButtons({
              hostedButtonId: hostedButtonId,
            }).render(`#${containerId}`);
            setIsRendered(true);
          } catch (err) {
            console.error('Error rendering PayPal Hosted Button:', err);
            setLoadError(true);
          }
        } else {
          attempts++;
          if (attempts < 25) {
            setTimeout(checkAndRender, 200);
          } else {
            setLoadError(true);
          }
        }
      };
      checkAndRender();
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.paypal.com/sdk/js?client-id=BAApZMT_akVrk09QmyOS0_2iMW0qbnqULY-vmI1tW59I2b0yM_v4wg6XrL2fN8Xvy0P4FwwsobAzoONHEI&components=hosted-buttons&enable-funding=venmo&currency=USD';
      script.async = true;
      script.onload = initializeButton;
      script.onerror = () => {
        if (active) setLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      initializeButton();
    }

    return () => {
      active = false;
    };
  }, [hostedButtonId, containerId]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200/80 rounded-2xl w-full">
      {!isRendered && !loadError && (
        <div className="flex flex-col items-center gap-2.5 py-6">
          <Loader2 className="animate-spin text-[#1a4731]" size={28} />
          <span className="text-xs text-slate-500 font-semibold tracking-wide">Loading Secure PayPal Checkout...</span>
        </div>
      )}
      {loadError && (
        <div className="text-center py-4 text-slate-500">
          <p className="text-xs text-red-600 font-bold mb-1">Interactive widget loading failed.</p>
          <p className="text-[11px] text-slate-400">Please use the direct link button below to complete your payment.</p>
        </div>
      )}

      {/* Container where the iframe will mount - must be separate from React-rendered children */}
      <div 
        id={containerId} 
        className={cn("w-full flex items-center justify-center", (isRendered && !loadError) ? "min-h-[140px] block" : "hidden")} 
      />

      {/* Fallback Checkout Link (renders if SDK fails or while loading as backup) */}
      {(loadError || !isRendered) && (
        <div className="mt-2 w-full text-center">
          <style>{`
            .pp-${hostedButtonId} {
              text-align: center;
              border: none;
              border-radius: 0.5rem;
              width: 100%;
              max-width: 18rem;
              height: 2.75rem;
              font-weight: bold;
              background-color: #FFD140;
              color: #000000;
              font-family: "Helvetica Neue", Arial, sans-serif;
              font-size: 1rem;
              line-height: 1.25rem;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              transition: background-color 0.2s;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .pp-${hostedButtonId}:hover {
              background-color: #ebd035;
            }
          `}</style>
          <form action={`https://www.paypal.com/ncp/payment/${hostedButtonId}`} method="post" target="_blank" className="flex flex-col items-center gap-2">
            <input className={`pp-${hostedButtonId}`} type="submit" value="Pay Now" />
            <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" className="h-6 mt-1" />
            <section className="text-[10px] text-slate-400">
              Powered by <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" alt="paypal" className="h-3.5 inline-block align-middle ml-1" />
            </section>
          </form>
        </div>
      )}
    </div>
  );
};
export const PatientSignupPage = ({ onNavigate }: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [qualifiesForDiscount, setQualifiesForDiscount] = useState(false);
  const [showAuraError, setShowAuraError] = useState(false);
  const [auraErrorSource, setAuraErrorSource] = useState<'patient' | 'resident' | ''>('');
  const [formData, setFormData] = useState({
    isPatientOrGuardian: '',
    isCaregiver: '',
    isStateResident: '',
    isAdultLicense: '',
    licenseType: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    caregiverFirstName: '',
    caregiverLastName: '',
    caregiverRelationship: '',
    idType: 'drivers-license',
    idNumber: '',
    attestationAgreed: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset license type when eligibility answers change so stale values don't carry over
  const handleEligibilityChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value, licenseType: '' }));
  };

  // Compute available license types from eligibility answers
  const getAvailableLicenseTypes = () => {
    const { isPatientOrGuardian, isCaregiver, isStateResident, isAdultLicense } = formData;

    if (isPatientOrGuardian === 'no' && isCaregiver === 'yes') {
      return [{ value: 'Caregiver', label: 'Caregiver' }];
    }

    if (isPatientOrGuardian === 'yes') {
      if (!isStateResident || !isAdultLicense) return [];

      if (isStateResident === 'yes' && isAdultLicense === 'yes') {
        return [
          { value: 'Adult Patient 2-Year License', label: 'Adult Patient 2-Year License' },
          { value: 'Adult Patient 60-Day Temporary License', label: 'Adult Patient 60-Day Temporary License' },
        ];
      }
      if (isStateResident === 'yes' && isAdultLicense === 'no') {
        return [
          { value: 'Minor Patient 2-Year License', label: 'Minor Patient 2-Year License' },
          { value: 'Minor Patient 60-Day Temporary License', label: 'Minor Patient 60-Day Temporary License' },
          { value: 'Caregiver', label: 'Caregiver' },
        ];
      }
      if (isStateResident === 'no' && isAdultLicense === 'yes') {
        return [
          { value: 'Adult Patient - Temporary License (Out of State)', label: 'Adult Patient - Temporary License (Out of State)' },
        ];
      }
      if (isStateResident === 'no' && isAdultLicense === 'no') {
        return [
          { value: 'Minor Patient - Temporary License (Out of State)', label: 'Minor Patient - Temporary License (Out of State)' },
        ];
      }
    }
    return [];
  };

  const isIneligible = formData.isPatientOrGuardian === 'no' && formData.isCaregiver === 'no';
  const availableLicenses = getAvailableLicenseTypes();
  const canProceedFromStep0 = (formData.isPatientOrGuardian === 'yes' && formData.isStateResident !== '' && formData.isAdultLicense !== '' && formData.licenseType !== '') || 
                              (formData.isPatientOrGuardian === 'no' && formData.isCaregiver === 'yes' && formData.licenseType !== '');

  // Determine which steps to show based on license type
  const isCaregiverLicense = formData.licenseType === 'Caregiver';

  const RadioOption = ({ name, value, checked, onChange, label }: { name: string; value: string; checked: boolean; onChange: () => void; label: string }) => (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="w-4 h-4 accent-[#1a4731]" />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // License Eligibility Criteria
        return (
          <div className="space-y-7">
            {/* Question 1: Patient or Legal Guardian */}
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-3">
                <span className="text-red-500 mr-1">*</span>Are you a Patient Or Legal Guardian?
              </p>
              <div className="flex gap-6">
                <RadioOption name="isPatientOrGuardian" value="yes" checked={formData.isPatientOrGuardian === 'yes'} onChange={() => { handleEligibilityChange('isPatientOrGuardian', 'yes'); setAuraErrorSource(''); setShowAuraError(false); }} label="Yes" />
                <RadioOption name="isPatientOrGuardian" value="no" checked={formData.isPatientOrGuardian === 'no'} onChange={() => handleEligibilityChange('isPatientOrGuardian', 'no')} label="No" />
              </div>
            </div>

            {/* Caregiver Flow */}
            {formData.isPatientOrGuardian === 'no' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="h-px bg-slate-200 mb-6" />
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  <span className="text-red-500 mr-1">*</span>Are you a Caregiver?
                </p>
                <div className="flex gap-6">
                  <RadioOption name="isCaregiver" value="yes" checked={formData.isCaregiver === 'yes'} onChange={() => handleEligibilityChange('isCaregiver', 'yes')} label="Yes" />
                  <RadioOption name="isCaregiver" value="no" checked={formData.isCaregiver === 'no'} onChange={() => handleEligibilityChange('isCaregiver', 'no')} label="No" />
                </div>
                
                {formData.isCaregiver === 'no' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6">
                    <p className="font-bold text-slate-800 text-lg">You are not eligible to apply for any license</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Patient Flow: Question 2 - State Resident */}
            {formData.isPatientOrGuardian === 'yes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="h-px bg-slate-200 mb-6" />
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  <span className="text-red-500 mr-1">*</span>Are you an Oklahoma State Resident?
                </p>
                <div className="flex gap-6">
                  <RadioOption name="isStateResident" value="yes" checked={formData.isStateResident === 'yes'} onChange={() => { handleEligibilityChange('isStateResident', 'yes'); setShowAuraError(false); setAuraErrorSource(''); }} label="Yes" />
                  <RadioOption name="isStateResident" value="no" checked={formData.isStateResident === 'no'} onChange={() => { handleEligibilityChange('isStateResident', 'no'); setShowAuraError(true); setAuraErrorSource('resident'); }} label="No" />
                </div>
                {formData.isStateResident === 'no' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-800">As a non-resident, you are eligible only for an Out-of-State Temporary License.</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Patient Flow: Question 3 - Adult or Minor */}
            {formData.isPatientOrGuardian === 'yes' && formData.isStateResident !== '' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
                <div className="h-px bg-slate-200 mb-6" />
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  <span className="text-red-500 mr-1">*</span>Are you applying for an adult patient license?
                </p>
                <div className="flex gap-6">
                  <RadioOption name="isAdultLicense" value="yes" checked={formData.isAdultLicense === 'yes'} onChange={() => handleEligibilityChange('isAdultLicense', 'yes')} label="Yes" />
                  <RadioOption name="isAdultLicense" value="no" checked={formData.isAdultLicense === 'no'} onChange={() => handleEligibilityChange('isAdultLicense', 'no')} label="No" />
                </div>
              </motion.div>
            )}

            {/* License Type Options */}
            {availableLicenses.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
                <p className="text-sm font-semibold text-slate-800 mb-3 mt-6">
                   <span className="text-red-500 mr-1">*</span>
                   {availableLicenses.length > 1 ? 'You can apply for the following licenses:' : 'You can apply for the following license:'}
                </p>
                <div className="space-y-3 ml-1">
                  {availableLicenses.map((lt) => (
                    <label key={lt.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="licenseType"
                        value={lt.value}
                        checked={formData.licenseType === lt.value}
                        onChange={() => updateField('licenseType', lt.value)}
                        className="w-4 h-4 accent-[#1a4731]"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-[#1a4731] transition-colors">{lt.label}</span>
                    </label>
                  ))}
                </div>

                {/* License Description Callout */}
                {formData.licenseType && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {formData.licenseType.includes('2-Year') && 'A 2-Year License is valid for 24 months from the date of approval. You will need a physician recommendation and proof of identity.'}
                      {formData.licenseType.includes('60-Day') && 'A 60-Day Temporary License is intended for urgent access. It is valid for 60 days and may be renewed once while your 2-year application is pending.'}
                      {formData.licenseType === 'Caregiver' && 'A Caregiver License allows you to purchase and administer medical products on behalf of a licensed patient. You must provide the patient\'s information in the next step.'}
                      {formData.licenseType.includes('Out of State') && 'An Out-of-State Temporary License allows non-residents to access medical services while visiting. You must provide proof of an active license from your home state.'}
                    </p>
                  </motion.div>

                )}
              </motion.div>
            )}
          </div>
        );

      case 1: // Personal Information
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="Enter first name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="Enter last name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Date of Birth</label>
              <input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="(555) 000-0000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Street Address</label>
              <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <input type="text" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                <select value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all bg-white">
                  <option value="">Select</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ZIP Code</label>
                <input type="text" value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
            </div>
          </div>
        );

      case 2: // Caregiver Patient Information
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-500">If you selected Caregiver, please provide the patient information below.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient First Name</label>
                <input type="text" value={formData.caregiverFirstName} onChange={(e) => updateField('caregiverFirstName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient Last Name</label>
                <input type="text" value={formData.caregiverLastName} onChange={(e) => updateField('caregiverLastName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Relationship to Patient</label>
              <select value={formData.caregiverRelationship} onChange={(e) => updateField('caregiverRelationship', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all bg-white">
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="legal-guardian">Legal Guardian</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 3: // Proof of Identity
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Identification Type</label>
              <select value={formData.idType} onChange={(e) => updateField('idType', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all bg-white">
                <option value="drivers-license">Driver's License</option>
                <option value="state-id">State ID</option>
                <option value="passport">Passport</option>
                <option value="military-id">Military ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>ID Number</label>
              <input type="text" value={formData.idNumber} onChange={(e) => updateField('idNumber', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="Enter your ID number" />
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#1a4731]/40 transition-colors cursor-pointer">
              <Upload className="mx-auto text-slate-400 mb-3" size={32} />
              <p className="text-sm font-semibold text-slate-700">Upload a copy of your ID</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG or PDF — max 10 MB</p>
            </div>
          </div>
        );

      case 4: // Digital Photo Requirements
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-normal text-slate-800 mb-2">Digital Photo Requirements</h1>
              <div className="h-px bg-slate-200 mb-4" />
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-6">
              {/* Instructions */}
              <div className="bg-white p-0">
                <p className="font-semibold mb-2">Instructions:</p>
                <div className="space-y-4 text-sm text-slate-800">
                  <p>You must upload a recent photograph for your medical marijuana card. It must meet the following requirements:</p>
                  <ul className="list-disc pl-10 space-y-1">
                    <li>Taken within the last 6 months</li>
                    <li>White or off-white background</li>
                    <li>An eye-level, clear photo with a fully visible face</li>
                    <li>No glasses or hats</li>
                    <li>No photo filters or enhancements</li>
                    <li>Positioned where the top of your head and top of your shoulders can be seen</li>
                  </ul>
                  <p>
                    For more information and assistance please review our <a href="https://oklahoma.gov/content/dam/ok/en/omma/forms/Photo%20Requirements.pdf" target="_blank" rel="noopener noreferrer" className="text-[#0176d3] underline font-bold">License Application Photo Requirements</a> document.
                  </p>
                  <div className="flex items-start mt-2">
                    <span className="font-bold text-[#c23934] mr-1">Note: </span>
                    <strong>Submitting a photo that does not meet the requirements will result in a delay in processing your application.</strong>
                  </div>
                </div>
              </div>

              {/* Do's and Don'ts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Do's */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xl" style={{ color: '#169179' }}>Do's</h3>
                  <ul className="list-disc pl-8 space-y-4 text-sm text-slate-800">
                    <li><strong>Do keep hair out of your face.</strong> It should not cover your eyebrows, eyes, ears, or any part of your face.</li>
                    <li><strong>Do remove eyeglasses</strong> and <strong>hats</strong> before taking the photo.</li>
                    <li><strong>Do avoid shadows on your face.</strong></li>
                    <li><strong>Do wear</strong> hats or head <strong>coverings for medical or religious purposes are</strong> as long as your full face is visible.</li>
                    <li><strong>Do position your head and shoulders</strong> where they can be seen.</li>
                  </ul>
                  <img src="https://medportal.omma.ok.gov/servlet/servlet.ImageServer?id=015cr000006pKFoAAM&docName=CACFAEBGAf2ac1475b8374fd58d90261503ed081a&oid=00Dcr000003EIjJ" alt="Dos" className="max-w-full h-auto mt-4" />
                </div>

                {/* Don'ts */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xl" style={{ color: '#e03e2d' }}>Don'ts</h3>
                  <ul className="list-disc pl-8 space-y-4 text-sm text-slate-800">
                    <li><strong>Do not</strong> use digital filters, borders, text or any other method of <strong>altering the appearance</strong> of the picture.</li>
                    <li><strong>Do not tilt your head</strong> or <strong>turn your shoulder</strong> to the side.</li>
                    <li><strong>Do not crop</strong> off your <strong>head and shoulders by zooming in</strong> too closely.</li>
                    <li><strong>Do not wear</strong> sunglasses, show hands or other <strong>objects in the photo.</strong></li>
                    <li><strong>Do not re-size</strong> the photo outside the provided guidelines.</li>
                    <li><strong>Do not capture anyone else</strong> besides the person applying for a license in the photo.</li>
                  </ul>
                  <img src="https://medportal.omma.ok.gov/servlet/servlet.ImageServer?id=015cr000006pKFnAAM&docName=CACFAEBGA8993fd0ac76e46e596401d99d9882b4f&oid=00Dcr000003EIjJ" alt="Donts" className="max-w-full h-auto mt-4" />
                </div>
              </div>

              {/* Upload Photo Accordion */}
              <div className="border border-slate-200 rounded bg-white mt-4 shadow-sm">
                <button type="button" className="w-full flex items-center justify-start p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200 cursor-default">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-slate-500 transform rotate-90" />
                    <h3 className="font-semibold text-slate-800 text-lg">Upload Photo</h3>
                  </div>
                </button>
                <div className="p-6 space-y-6">
                  <div className="text-sm text-slate-800 space-y-3">
                    <p>Choose a photo to upload and attach to your application.</p>
                    <p><span className="font-bold text-[#c23934]">Note: </span><strong>File Format: </strong>must be .jpg, .png, or .gif and <strong>no larger than 3 MB in size</strong></p>
                    <p><span className="font-bold text-[#c23934]">Note: </span><strong>Resolution Limits: </strong>must be <strong>Minimum:</strong> 600 x 600 pixels. <strong>Maximum:</strong> 1200 x 1200 pixels.</p>
                  </div>

                  {/* Upload Dropzone and Cropper */}
                  <div className="flex flex-col xl:flex-row gap-8 items-start">
                    <div className="w-full max-w-sm shrink-0">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <span className="text-[#c23934] mr-1">*</span>Select Photo
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                        <Upload className="text-[#0176d3] mb-2" size={32} />
                        <button type="button" className="text-[#0176d3] font-semibold text-sm mb-1">Upload Files</button>
                        <p className="text-xs text-slate-500">Or drop files</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="text-sm text-slate-800 space-y-4">
                        <p><span className="font-bold text-[#c23934]">Note: </span><strong>All photos will be cropped square and converted to jpeg once uploaded</strong></p>
                        <div>
                          <strong className="block mb-1">Drag and adjust the photo:</strong>
                          <p>(Move, zoom or rotate) within the square box below, so that the top of the head and shoulders are within the frame.</p>
                        </div>
                      </div>
                      
                      {/* Fake Cropper UI */}
                      <div className="w-[200px] h-[200px] border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                         <span className="text-slate-400 text-xs text-center px-4">Image preview will appear here</span>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex gap-2">
                          <button type="button" className="px-4 py-2 bg-white border border-slate-300 text-[#0176d3] text-sm font-medium rounded hover:bg-slate-50 shadow-sm flex items-center gap-2">
                            Rotate Left
                          </button>
                          <button type="button" className="px-4 py-2 bg-white border border-slate-300 text-[#0176d3] text-sm font-medium rounded hover:bg-slate-50 shadow-sm flex items-center gap-2">
                            Rotate Right
                          </button>
                        </div>
                        <button type="button" className="px-5 py-2 bg-[#0176d3] text-white text-sm font-medium rounded hover:bg-blue-700 shadow-sm">Save Image</button>
                      </div>
                    </div>
                  </div>

                  {/* Attestations */}
                  <div className="pt-8 space-y-4">
                    <strong className="block text-sm text-slate-800">Select the checkboxes below to attest that the uploaded photo meets all the requirements listed below:</strong>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug"><span className="text-[#c23934] font-bold mr-1">*</span>I attest the photo only shows the applicant and was taken within the last 6 months.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug"><span className="text-[#c23934] font-bold mr-1">*</span>I attest the photo was taken with a white or off-white background.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug"><span className="text-[#c23934] font-bold mr-1">*</span>I attest this photo shows the applicants full face to the top of the shoulders and is not a photo of a photo.</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Hat or Head Covering Accordion */}
              <div className="border border-slate-200 rounded bg-white shadow-sm">
                <button type="button" className="w-full flex items-center justify-start p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200 cursor-default">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-slate-500 transform rotate-90" />
                    <h3 className="font-semibold text-slate-800 text-lg">Hat or Head Covering (if applicable)</h3>
                  </div>
                </button>
                <div className="p-6 space-y-8">
                  <p className="text-sm text-slate-800">If you are wearing a hat or head covering, please upload one of the necessary files below:</p>
                  
                  {/* Medical Purpose */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-2 text-sm text-slate-800">
                      <p className="font-bold">Is the hat or head covering for medical purposes?</p>
                      <p>In accordance with <strong>OAC 442:10-1-8(6)(B),</strong> please submit a signed doctor's statement verifying the hat or head covering in the photo is used daily for medical purposes.</p>
                    </div>
                    {/* Upload */}
                    <div className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                      <Upload className="text-[#0176d3] mb-2" size={32} />
                      <button type="button" className="text-[#0176d3] font-semibold text-sm mb-1">Upload Files</button>
                      <p className="text-xs text-slate-500">Or drop files</p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200" />

                  {/* Religious Purpose */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-2 text-sm text-slate-800">
                      <p className="font-bold">Is the hat or head covering for religious purposes?</p>
                      <p>In accordance with <strong>OAC 442:10-1-8(6)(A),</strong> please submit a signed statement that verifies the hat or head covering in the photo is part of recognized, traditional religious attire that is customarily or required to be worn continuously in public.</p>
                    </div>
                    {/* Upload */}
                    <div className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                      <Upload className="text-[#0176d3] mb-2" size={32} />
                      <button type="button" className="text-[#0176d3] font-semibold text-sm mb-1">Upload Files</button>
                      <p className="text-xs text-slate-500">Or drop files</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug">I attest the photo meets the License Application Photo Requirements and I have provided all relevant information and forms requested.</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );

      case 5: // Attestation
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-sm text-amber-900 leading-relaxed">
                By checking the box below, I attest that all information provided in this application is true and accurate to the best of my knowledge. I understand that providing false information may result in denial or revocation of my license.
              </p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.attestationAgreed} onChange={(e) => updateField('attestationAgreed', e.target.checked)} className="w-5 h-5 accent-[#1a4731] mt-0.5 rounded" />
              <span className="text-sm text-slate-700 leading-relaxed flex items-center flex-wrap">
                <span>I hereby certify that all statements made in this application are true and complete. I understand that false statements or omissions may be grounds for denial, suspension, or revocation of my patient license.</span>
                <div className="inline-flex items-center group relative ml-1.5 align-middle">
                   <Info size={16} className="text-[#1a4731] hover:text-emerald-600 transition-colors cursor-help" />
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                     By agreeing, you consent to our HIPAA-compliant data practices, OMMA reporting requirements, and state open records policies.
                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                   </div>
                </div>
              </span>
            </label>
          </div>
        );

      case 6: { // Application Review
        const licenseTypeLabels: any = {
          'adult-2year': 'Adult Patient 2-Year License',
          'adult-60day': 'Adult Patient 60-Day Temporary License',
          'minor-2year': 'Minor Patient 2-Year License',
          'minor-60day': 'Minor Patient 60-Day Temporary License',
          'caregiver': 'Caregiver License',
          'out-of-state-adult': 'Out-of-State Adult 30-Day Temporary License',
          'out-of-state-minor': 'Out-of-State Minor 30-Day Temporary License',
        };

        const reviewSections = [];
        reviewSections.push({
          title: 'License Eligibility Criteria',
          icon: '📋',
          fields: [
            { label: 'Patient Or Legal Guardian', value: formData.isPatientOrGuardian === 'yes' ? 'Yes' : formData.isPatientOrGuardian === 'no' ? 'No' : '-' },
            { label: 'State Resident', value: formData.isStateResident === 'yes' ? 'Yes' : formData.isStateResident === 'no' ? 'No' : '-' },
            { label: 'Adult License (18+)', value: formData.isAdultLicense === 'yes' ? 'Yes' : formData.isAdultLicense === 'no' ? 'No' : '-' },
            { label: 'License Type', value: licenseTypeLabels[formData.licenseType] || '-' },
          ],
        });
        reviewSections.push({
          title: 'Personal Information',
          icon: '👤',
          fields: [
            { label: 'First Name', value: formData.firstName || '-' },
            { label: 'Last Name', value: formData.lastName || '-' },
            { label: 'Date of Birth', value: formData.dateOfBirth || '-' },
            { label: 'Email Address', value: formData.email || '-' },
            { label: 'Phone Number', value: formData.phone || '-' },
            { label: 'Street Address', value: formData.address || '-' },
            { label: 'City', value: formData.city || '-' },
            { label: 'State', value: formData.state || '-' },
            { label: 'ZIP Code', value: formData.zip || '-' },
          ],
        });
        
        if (isCaregiverLicense) {
          reviewSections.push({
            title: 'Caregiver Patient Information',
            icon: '🤝',
            fields: [
              { label: 'Patient First Name', value: formData.caregiverFirstName || '-' },
              { label: 'Patient Last Name', value: formData.caregiverLastName || '-' },
              { label: 'Relationship to Patient', value: formData.caregiverRelationship ? formData.caregiverRelationship.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '-' },
            ],
          });
        }
        
        reviewSections.push({
          title: 'Proof of Identity',
          icon: '🪪',
          fields: [
            { label: 'Identification Type', value: formData.idType ? formData.idType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '-' },
            { label: 'ID Number', value: formData.idNumber ? `••••${formData.idNumber.slice(-4)}` : '-' },
            { label: 'ID Document', value: 'Uploaded ✓' },
          ],
        });
        reviewSections.push({
          title: 'Digital Photo Requirements',
          icon: '📸',
          fields: [
            { label: 'Photo', value: 'Uploaded ✓' },
          ],
        });
        reviewSections.push({
          title: 'Attestation',
          icon: '✅',
          fields: [
            { label: 'Certification Agreed', value: formData.attestationAgreed ? 'Yes - Agreed' : 'No' },
          ],
        });

        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <p className="text-sm text-blue-800 leading-relaxed">
                Please review all sections below before submitting your application.
              </p>
            </div>

            {reviewSections.map((section, sIdx) => (
              <details key={sIdx} open className="group border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <summary className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 bg-gradient-to-r from-slate-50 to-white cursor-pointer select-none hover:from-slate-100 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xs">{section.icon}</span>
                  <h3 className="text-sm font-bold text-[#16325c] tracking-wide">{section.title}</h3>
                </summary>
                <div className="border-t border-slate-200 px-5 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {section.fields.map((field, fIdx) => (
                      <div key={fIdx} className="flex flex-col">
                        <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{field.label}</dt>
                        <dd className="text-sm text-slate-900 font-medium break-words">{field.value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}

            {/* Payment & Fees Section */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm mt-6">
              <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <span className="text-xs">💳</span>
                <h3 className="text-sm font-bold text-[#16325c] tracking-wide">Secure Payment &amp; Application Fees</h3>
              </div>
              <div className="px-5 py-5 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your total fee includes the medical evaluation, processing fee, and state license application fee.
                </p>
                
                {/* State Discount Option Selector */}
                <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Leaf className="text-emerald-700 shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-xs font-semibold text-emerald-950">OMMA State Fee Discount Eligibility</p>
                      <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                        Do you qualify for the OMMA Reduced State Fee of $22.50? (Requires proof of SoonerCare/Medicaid, Medicare, or 100% Disabled Veteran status).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 pl-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="qualifiesForDiscount" 
                        checked={qualifiesForDiscount} 
                        onChange={() => setQualifiesForDiscount(true)} 
                        className="w-4 h-4 accent-[#1a4731]" 
                      />
                      <span className="text-xs text-slate-700 font-medium">Yes, I qualify ($112.50 total)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="qualifiesForDiscount" 
                        checked={!qualifiesForDiscount} 
                        onChange={() => setQualifiesForDiscount(false)} 
                        className="w-4 h-4 accent-[#1a4731]" 
                      />
                      <span className="text-xs text-slate-700 font-medium">No, standard price ($194.30 total)</span>
                    </label>
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Medical Recommendation Fee:</span>
                    <span>$40.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>GGHP Processing Fee:</span>
                    <span>$50.00</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-medium pb-2 border-b border-slate-200">
                    <span>OMMA State Application Fee:</span>
                    <span>{qualifiesForDiscount ? '$22.50' : '$104.30'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                    <span>Total Due Now:</span>
                    <span>{qualifiesForDiscount ? '$112.50' : '$194.30'}</span>
                  </div>
                </div>

                {/* PayPal Integration Component */}
                <div className="pt-2">
                  <PayPalButton 
                    key={qualifiesForDiscount ? 'discount' : 'standard'}
                    hostedButtonId={qualifiesForDiscount ? 'EZSS8BUT44LBY' : 'Q4H5AW7NUB73Y'}
                    containerId={qualifiesForDiscount ? 'paypal-container-EZSS8BUT44LBY' : 'paypal-container-Q4H5AW7NUB73Y'}
                  />
                </div>
                
                <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed mt-2">
                  ⚠️ Note: After completing your payment on PayPal, please click the "Submit Application" button below to finalize your application in our system.
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 7:
        return (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h3>
            <button onClick={() => onNavigate('landing')} className="mt-8 px-8 py-3 bg-[#1a4731] text-white rounded-lg font-semibold">Return Home</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGHP Logo" className="h-10 md:h-12 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-sm font-semibold text-slate-600 hidden md:inline">Patient License Application</span>
        </div>
        <button
          onClick={() => onNavigate('patient-portal')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1a4731] text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </nav>

      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar Steps */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:block">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Steps</h3>
          <div className="relative">
            {PATIENT_STEPS.map((stepLabel, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-1">
                {/* Vertical line */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-2 transition-all",
                    idx === currentStep
                      ? "bg-[#1a4731] border-[#1a4731] text-white"
                      : idx < currentStep
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                  )}>
                    {idx < currentStep ? '✓' : ''}
                  </div>
                  {idx < PATIENT_STEPS.length - 1 && (
                    <div className={cn(
                      "w-0.5 h-8",
                      idx < currentStep ? "bg-emerald-400" : "bg-slate-200"
                    )} />
                  )}
                </div>
                <button
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  className={cn(
                    "text-sm text-left pt-0.5 transition-colors leading-tight",
                    idx === currentStep
                      ? "text-[#1a4731] font-bold"
                      : idx < currentStep
                        ? "text-emerald-700 font-medium hover:text-emerald-900 cursor-pointer"
                        : "text-slate-400 cursor-default"
                  )}
                >
                  {stepLabel}
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            {/* Step Title */}
            <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 px-8 py-5">
              <h2 className="text-lg font-bold text-slate-800">{PATIENT_STEPS[currentStep]}</h2>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-b-2xl border border-slate-200 px-8 py-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 7 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-sm text-[#1a4731] font-medium hover:underline"
                >
                  Save for later
                </button>
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={() => {
                        // Skip caregiver step backward if not caregiver
                        if (currentStep === 3 && !isCaregiverLicense) {
                          setCurrentStep(1);
                        } else {
                          setCurrentStep(prev => prev - 1);
                        }
                      }}
                      className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Skip caregiver step forward if not caregiver
                      if (currentStep === 1 && !isCaregiverLicense) {
                        setCurrentStep(3);
                      } else {
                        setCurrentStep(prev => Math.min(prev + 1, PATIENT_STEPS.length - 1));
                      }
                    }}
                    disabled={currentStep === 0 && !canProceedFromStep0}
                    className={cn(
                      "px-8 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm",
                      currentStep === 0 && !canProceedFromStep0
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-[#1a4731] text-white hover:bg-[#153a28]"
                    )}
                  >
                    {currentStep === 6 ? 'Submit Application' : currentStep === 0 ? 'Next' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {showAuraError && (
        <div id="auraErrorMask" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div role="dialog" aria-modal="true" className="bg-white rounded w-full max-w-lg shadow-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <div className="bg-[#16325c] text-white p-4 flex items-center shadow-sm relative">
              <span id="auraErrorTitle" className="font-semibold text-base tracking-wide flex-1">Sorry to interrupt</span>
              <button 
                id="dismissError"
                onClick={() => setShowAuraError(false)} 
                className="text-white hover:text-slate-200 text-2xl leading-none absolute right-4 top-3 h-8 w-8 flex items-center justify-center font-light hover:bg-white/10 rounded"
                aria-label="Cancel and close"
                title="Cancel and close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="p-6 pb-8 text-slate-800 text-[15px] leading-relaxed">
              <div id="auraErrorMessage">
                This page has an error. You might just need to refresh it.
                <div className="mt-4 font-mono text-sm break-words bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  {auraErrorSource === 'resident'
                    ? "[Unhandled PromiseRejection (check your browser console to find the code that isn't handling the error 'Uncaught (in promise)'): You do not have access to the Apex class named 'NewportUtilities'.]"
                    : "[Unhandled PromiseRejection (check your browser console to find the code that isn't handling the error 'Uncaught (in promise)'): You do not have access to the Apex class named 'ComponentController'.]"}
                </div>
              </div>
              <div id="auraErrorStack"></div>
            </div>
            <div className="auraErrorFooter">
              <a
                role="button"
                href={auraErrorSource === 'resident'
                  ? 'apply-license?nocache=https%3A%2F%2Fmedportal.omma.ok.gov%2Fs%2Fapply-license%3FselectedPortal%3DPatient'
                  : '#'}
                id="auraErrorReload"
                onClick={(e) => { e.preventDefault(); setShowAuraError(false); setAuraErrorSource(''); }}
                className="inline-block mt-2 text-sm text-[#0070d2] hover:underline cursor-pointer"
              >
                Refresh
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PendingApprovalScreen removed in favor of ShadowedDashboard

