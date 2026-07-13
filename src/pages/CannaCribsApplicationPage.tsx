import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowRight, ChevronRight, Shield, CheckCircle, Leaf, Home,
  Upload, User, Briefcase, CreditCard, FileText, Eye, Lock, MapPin,
  AlertCircle, Info, Loader2, Building2, Star, DollarSign, Phone, Mail,
  Calendar, Hash, Heart
} from 'lucide-react';
import { cn } from '../lib/utils';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const STEPS = [
  'Applicant Type',
  'Personal Information',
  'Cannabis Verification',
  'Employment & Income',
  'Identity Verification',
  'Rental Preferences',
  'Attestation & Consent',
  'Review Application',
  'Confirmation'
];

const LANDLORD_STEPS = [
  'Applicant Type',
  'Landlord Information',
  'Property Details',
  'Service Tier Selection',
  'Attestation & Consent',
  'Review Application',
  'Confirmation'
];

export const CannaCribsApplicationPage = ({ onNavigate }: { onNavigate?: (view: string) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 0: Applicant Type
    applicantType: '' as '' | 'tenant' | 'landlord' | 'short-term',
    // Step 1: Personal Info
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
    address: '', city: '', state: '', zip: '',
    // Step 2: Cannabis Verification (tenant)
    hasCannaCard: '' as '' | 'yes' | 'no',
    cannaCardState: '', cannaCardNumber: '', cannaCardExpiry: '',
    consumptionType: '' as '' | 'medical' | 'recreational' | 'both',
    // Step 3: Employment
    employmentStatus: '' as '' | 'employed' | 'self-employed' | 'student' | 'retired' | 'other',
    employer: '', jobTitle: '', monthlyIncome: '',
    previousLandlord: '', previousLandlordPhone: '',
    // Step 4: ID
    idType: 'drivers-license',
    idNumber: '',
    // Step 5: Rental Preferences
    propertyType: '' as '' | 'apartment' | 'house' | 'short-term' | 'commercial',
    budgetMin: '', budgetMax: '', moveInDate: '', leaseTerm: '',
    petsYN: '' as '' | 'yes' | 'no', petDetails: '',
    preferredLocation: '',
    // Step 6: Attestation
    attestTruthful: false, attestBackgroundCheck: false, attestCannaPolicy: false, attestTerms: false,
    // Landlord fields
    llCompany: '', llProperties: '', llExperience: '',
    llPropertyName: '', llPropertyAddress: '', llPropertyCity: '', llPropertyState: '', llPropertyZip: '',
    llPropertyType: '' as '' | 'house' | 'apartment' | 'multi-family' | 'commercial' | 'short-term',
    llBeds: '', llBaths: '', llSqft: '', llRentAmount: '',
    llFurnished: '' as '' | 'yes' | 'no' | 'partial',
    llGrowAllowed: '' as '' | 'yes' | 'no',
    llServiceTier: '' as '' | 'green' | 'gold' | 'platinum' | 'executive',
    llAttestOwner: false, llAttestCompliant: false, llAttestInspection: false,
  });

  const isLandlord = formData.applicantType === 'landlord';
  const activeSteps = isLandlord ? LANDLORD_STEPS : STEPS;
  const totalSteps = activeSteps.length;

  const update = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const next = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  const back = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const canProceed = (): boolean => {
    if (currentStep === 0) return !!formData.applicantType;
    // Allow progression for demo purposes
    return true;
  };

  const RadioOption = ({ name, value, checked, onChange, label, desc }: any) => (
    <label className={cn(
      'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
      checked ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300 bg-white'
    )}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="w-4 h-4 accent-green-600 mt-0.5" />
      <div>
        <span className="text-sm font-bold text-slate-800">{label}</span>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
    </label>
  );

  const FieldLabel = ({ required, children }: any) => (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {required && <span className="text-red-500 mr-1">*</span>}{children}
    </label>
  );

  const TextInput = ({ value, onChange, placeholder, type = 'text' }: any) => (
    <input type={type} value={value} onChange={onChange}
      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" placeholder={placeholder} />
  );

  const SelectInput = ({ value, onChange, children }: any) => (
    <select value={value} onChange={onChange}
      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all bg-white">
      {children}
    </select>
  );

  // ─── TENANT STEPS ───
  const renderTenantStep = () => {
    switch (currentStep) {
      case 0: return renderApplicantType();
      case 1: return renderPersonalInfo();
      case 2: return renderCannabisVerification();
      case 3: return renderEmployment();
      case 4: return renderIdentity();
      case 5: return renderRentalPreferences();
      case 6: return renderAttestation();
      case 7: return renderReview();
      case 8: return renderConfirmation();
      default: return null;
    }
  };

  // ─── LANDLORD STEPS ───
  const renderLandlordStep = () => {
    switch (currentStep) {
      case 0: return renderApplicantType();
      case 1: return renderLandlordInfo();
      case 2: return renderPropertyDetails();
      case 3: return renderServiceTier();
      case 4: return renderLandlordAttestation();
      case 5: return renderLandlordReview();
      case 6: return renderConfirmation();
      default: return null;
    }
  };

  // ═══════════════════════════════════════════
  // SHARED: Applicant Type
  // ═══════════════════════════════════════════
  const renderApplicantType = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-1">What brings you to CannaCribs?</h3>
        <p className="text-sm text-slate-500">Select your applicant type to get started.</p>
      </div>
      <div className="space-y-3">
        <RadioOption name="applicantType" value="tenant" checked={formData.applicantType === 'tenant'}
          onChange={() => { update('applicantType', 'tenant'); setCurrentStep(0); }}
          label="🏠 I'm Looking for a Place to Rent"
          desc="Find cannabis-friendly apartments, houses, and rooms." />
        <RadioOption name="applicantType" value="short-term" checked={formData.applicantType === 'short-term'}
          onChange={() => { update('applicantType', 'short-term'); setCurrentStep(0); }}
          label="🌴 I Need a Short-Term Stay"
          desc="Book 420-friendly vacation rentals and temporary housing." />
        <RadioOption name="applicantType" value="landlord" checked={formData.applicantType === 'landlord'}
          onChange={() => { update('applicantType', 'landlord'); setCurrentStep(0); }}
          label="🔑 I'm a Landlord / Property Owner"
          desc="List your property on CannaCribs and earn 20-30% above market rent." />
      </div>
      {formData.applicantType === 'short-term' && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-blue-800">Short-term guests follow the same application as tenants with simplified requirements. No lease term or employment verification needed.</p>
        </motion.div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════
  // TENANT STEP 1: Personal Info
  // ═══════════════════════════════════════════
  const renderPersonalInfo = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel required>First Name</FieldLabel><TextInput value={formData.firstName} onChange={(e: any) => update('firstName', e.target.value)} placeholder="Enter first name" /></div>
        <div><FieldLabel required>Last Name</FieldLabel><TextInput value={formData.lastName} onChange={(e: any) => update('lastName', e.target.value)} placeholder="Enter last name" /></div>
      </div>
      <div><FieldLabel required>Date of Birth</FieldLabel><TextInput type="date" value={formData.dateOfBirth} onChange={(e: any) => update('dateOfBirth', e.target.value)} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel required>Email Address</FieldLabel><TextInput type="email" value={formData.email} onChange={(e: any) => update('email', e.target.value)} placeholder="you@example.com" /></div>
        <div><FieldLabel required>Phone Number</FieldLabel><TextInput type="tel" value={formData.phone} onChange={(e: any) => update('phone', e.target.value)} placeholder="(555) 000-0000" /></div>
      </div>
      <div><FieldLabel required>Street Address</FieldLabel><TextInput value={formData.address} onChange={(e: any) => update('address', e.target.value)} placeholder="123 Main St" /></div>
      <div className="grid grid-cols-3 gap-4">
        <div><FieldLabel>City</FieldLabel><TextInput value={formData.city} onChange={(e: any) => update('city', e.target.value)} /></div>
        <div>
          <FieldLabel>State</FieldLabel>
          <SelectInput value={formData.state} onChange={(e: any) => update('state', e.target.value)}>
            <option value="">Select</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
        </div>
        <div><FieldLabel>ZIP Code</FieldLabel><TextInput value={formData.zip} onChange={(e: any) => update('zip', e.target.value)} /></div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // TENANT STEP 2: Cannabis Verification
  // ═══════════════════════════════════════════
  const renderCannabisVerification = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Leaf className="text-green-600" size={20} /> Cannabis Verification
      </h3>
      <p className="text-sm text-slate-500">This information helps us match you with the right properties and ensures compliance with state regulations.</p>

      <div>
        <FieldLabel required>Do you hold a valid cannabis/medical marijuana card?</FieldLabel>
        <div className="flex gap-4 mt-2">
          <RadioOption name="hasCannaCard" value="yes" checked={formData.hasCannaCard === 'yes'} onChange={() => update('hasCannaCard', 'yes')} label="Yes" />
          <RadioOption name="hasCannaCard" value="no" checked={formData.hasCannaCard === 'no'} onChange={() => update('hasCannaCard', 'no')} label="No" />
        </div>
      </div>

      {formData.hasCannaCard === 'yes' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Issuing State</FieldLabel>
              <SelectInput value={formData.cannaCardState} onChange={(e: any) => update('cannaCardState', e.target.value)}>
                <option value="">Select State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectInput>
            </div>
            <div><FieldLabel required>Card/License Number</FieldLabel><TextInput value={formData.cannaCardNumber} onChange={(e: any) => update('cannaCardNumber', e.target.value)} placeholder="OMMA-XXXXXXX" /></div>
          </div>
          <div><FieldLabel required>Expiration Date</FieldLabel><TextInput type="date" value={formData.cannaCardExpiry} onChange={(e: any) => update('cannaCardExpiry', e.target.value)} /></div>

          <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer bg-green-50/50">
            <Upload className="mx-auto text-green-500 mb-2" size={28} />
            <p className="text-sm font-bold text-green-700">Upload Cannabis Card (Front & Back)</p>
            <p className="text-xs text-green-500 mt-1">JPG, PNG or PDF — max 10 MB</p>
          </div>
        </motion.div>
      )}

      {formData.hasCannaCard === 'no' && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs text-amber-800 font-bold">No cannabis card required for recreational-legal states.</p>
            <p className="text-xs text-amber-700 mt-1">Properties in states with recreational legalization do not require a cannabis card. We'll verify state eligibility during review.</p>
          </div>
        </motion.div>
      )}

      <div>
        <FieldLabel required>Primary Cannabis Use Type</FieldLabel>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[
            { v: 'medical', l: '🏥 Medical', d: 'Licensed medical patient' },
            { v: 'recreational', l: '🌿 Recreational', d: 'Adult-use consumer' },
            { v: 'both', l: '💚 Both', d: 'Medical + recreational' },
          ].map(o => (
            <RadioOption key={o.v} name="consumptionType" value={o.v} checked={formData.consumptionType === o.v}
              onChange={() => update('consumptionType', o.v)} label={o.l} desc={o.d} />
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // TENANT STEP 3: Employment & Income
  // ═══════════════════════════════════════════
  const renderEmployment = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Briefcase className="text-blue-600" size={20} /> Employment & Income
      </h3>
      {formData.applicantType === 'short-term' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-blue-800">Employment verification is optional for short-term stays. You may skip this step.</p>
        </div>
      )}
      <div>
        <FieldLabel required>Employment Status</FieldLabel>
        <SelectInput value={formData.employmentStatus} onChange={(e: any) => update('employmentStatus', e.target.value)}>
          <option value="">Select Status</option>
          <option value="employed">Employed Full-Time</option>
          <option value="self-employed">Self-Employed</option>
          <option value="student">Student</option>
          <option value="retired">Retired</option>
          <option value="other">Other</option>
        </SelectInput>
      </div>
      {(formData.employmentStatus === 'employed' || formData.employmentStatus === 'self-employed') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><FieldLabel required>Employer / Business Name</FieldLabel><TextInput value={formData.employer} onChange={(e: any) => update('employer', e.target.value)} placeholder="Company name" /></div>
            <div><FieldLabel>Job Title</FieldLabel><TextInput value={formData.jobTitle} onChange={(e: any) => update('jobTitle', e.target.value)} placeholder="Your title" /></div>
          </div>
        </motion.div>
      )}
      <div><FieldLabel required>Monthly Gross Income</FieldLabel><TextInput value={formData.monthlyIncome} onChange={(e: any) => update('monthlyIncome', e.target.value)} placeholder="$4,000" /></div>
      <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50/50">
        <Upload className="mx-auto text-blue-500 mb-2" size={28} />
        <p className="text-sm font-bold text-blue-700">Upload Proof of Income</p>
        <p className="text-xs text-blue-500 mt-1">Pay stubs, bank statements, or tax returns — max 10 MB</p>
      </div>
      <h4 className="text-sm font-bold text-slate-800 mt-6">Previous Landlord Reference</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Landlord Name</FieldLabel><TextInput value={formData.previousLandlord} onChange={(e: any) => update('previousLandlord', e.target.value)} placeholder="Previous landlord name" /></div>
        <div><FieldLabel>Landlord Phone</FieldLabel><TextInput type="tel" value={formData.previousLandlordPhone} onChange={(e: any) => update('previousLandlordPhone', e.target.value)} placeholder="(555) 000-0000" /></div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // TENANT STEP 4: Identity Verification
  // ═══════════════════════════════════════════
  const renderIdentity = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Shield className="text-violet-600" size={20} /> Identity Verification
      </h3>
      <div>
        <FieldLabel required>Identification Type</FieldLabel>
        <SelectInput value={formData.idType} onChange={(e: any) => update('idType', e.target.value)}>
          <option value="drivers-license">Driver's License</option>
          <option value="state-id">State ID</option>
          <option value="passport">Passport</option>
          <option value="military-id">Military ID</option>
          <option value="tribal-id">Tribal ID</option>
        </SelectInput>
      </div>
      <div><FieldLabel required>ID Number</FieldLabel><TextInput value={formData.idNumber} onChange={(e: any) => update('idNumber', e.target.value)} placeholder="Enter your ID number" /></div>
      <div className="border-2 border-dashed border-violet-300 rounded-xl p-6 text-center hover:border-violet-500 transition-colors cursor-pointer bg-violet-50/50">
        <Upload className="mx-auto text-violet-500 mb-2" size={28} />
        <p className="text-sm font-bold text-violet-700">Upload Government-Issued ID (Front & Back)</p>
        <p className="text-xs text-violet-500 mt-1">JPG, PNG or PDF — max 10 MB</p>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
        <Lock className="text-slate-400 shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-xs text-slate-600 font-bold">Your documents are encrypted and secure.</p>
          <p className="text-xs text-slate-500 mt-0.5">CannaCribs uses bank-level AES-256 encryption. Your data is never shared with third parties without your consent.</p>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // TENANT STEP 5: Rental Preferences
  // ═══════════════════════════════════════════
  const renderRentalPreferences = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Home className="text-green-600" size={20} /> Rental Preferences
      </h3>
      <div>
        <FieldLabel required>What type of property are you looking for?</FieldLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {[
            { v: 'apartment', l: '🏢 Apartment', i: Building2 },
            { v: 'house', l: '🏠 House', i: Home },
            { v: 'short-term', l: '🌴 Short-Term', i: Star },
            { v: 'commercial', l: '🏭 Commercial', i: Briefcase },
          ].map(o => (
            <button key={o.v} onClick={() => update('propertyType', o.v)}
              className={cn('p-3 rounded-xl border-2 text-center transition-all',
                formData.propertyType === o.v ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'
              )}>
              <div className="text-2xl mb-1">{o.l.split(' ')[0]}</div>
              <div className="text-xs font-bold text-slate-700">{o.l.split(' ').slice(1).join(' ')}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Monthly Budget (Min)</FieldLabel><TextInput value={formData.budgetMin} onChange={(e: any) => update('budgetMin', e.target.value)} placeholder="$500" /></div>
        <div><FieldLabel>Monthly Budget (Max)</FieldLabel><TextInput value={formData.budgetMax} onChange={(e: any) => update('budgetMax', e.target.value)} placeholder="$2,000" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Preferred Move-In Date</FieldLabel><TextInput type="date" value={formData.moveInDate} onChange={(e: any) => update('moveInDate', e.target.value)} /></div>
        <div>
          <FieldLabel>Desired Lease Term</FieldLabel>
          <SelectInput value={formData.leaseTerm} onChange={(e: any) => update('leaseTerm', e.target.value)}>
            <option value="">Select</option>
            <option value="month-to-month">Month-to-Month</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
            <option value="12-months">12 Months</option>
            <option value="24-months">24 Months</option>
          </SelectInput>
        </div>
      </div>
      <div><FieldLabel>Preferred Location / City</FieldLabel><TextInput value={formData.preferredLocation} onChange={(e: any) => update('preferredLocation', e.target.value)} placeholder="e.g. Oklahoma City, Tulsa, Scottsdale" /></div>
      <div>
        <FieldLabel>Do you have pets?</FieldLabel>
        <div className="flex gap-4 mt-2">
          <RadioOption name="petsYN" value="yes" checked={formData.petsYN === 'yes'} onChange={() => update('petsYN', 'yes')} label="Yes" />
          <RadioOption name="petsYN" value="no" checked={formData.petsYN === 'no'} onChange={() => update('petsYN', 'no')} label="No" />
        </div>
      </div>
      {formData.petsYN === 'yes' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <FieldLabel>Pet Details</FieldLabel>
          <TextInput value={formData.petDetails} onChange={(e: any) => update('petDetails', e.target.value)} placeholder="Type, breed, weight — e.g. Dog, Labrador, 65 lbs" />
        </motion.div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════
  // TENANT STEP 6: Attestation
  // ═══════════════════════════════════════════
  const renderAttestation = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <FileText className="text-amber-600" size={20} /> Attestation & Consent
      </h3>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-900 leading-relaxed">
          By checking the boxes below, you confirm the accuracy of your application and consent to the verification process required by CannaCribs and its property partners.
        </p>
      </div>
      <div className="space-y-4">
        {[
          { field: 'attestTruthful', label: 'I certify that all information provided in this application is true, complete, and accurate to the best of my knowledge.' },
          { field: 'attestBackgroundCheck', label: 'I authorize CannaCribs to conduct a background check and credit inquiry as part of the application process.' },
          { field: 'attestCannaPolicy', label: 'I understand and agree to comply with the cannabis consumption policies of the property I am applying for, including designated areas and odor mitigation requirements.' },
          { field: 'attestTerms', label: 'I have read and agree to the CannaCribs Terms of Service, Privacy Policy, and Fair Housing Compliance guidelines.' },
        ].map((att, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            <input type="checkbox" checked={(formData as any)[att.field]} onChange={(e) => update(att.field, e.target.checked)} className="w-5 h-5 accent-green-600 mt-0.5 rounded" />
            <span className="text-sm text-slate-700 leading-relaxed"><span className="text-red-500 mr-1">*</span>{att.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // TENANT STEP 7: Review
  // ═══════════════════════════════════════════
  const renderReview = () => {
    const sections = [
      { title: 'Applicant Type', icon: '📋', fields: [
        { l: 'Type', v: formData.applicantType === 'tenant' ? 'Tenant (Long-Term)' : formData.applicantType === 'short-term' ? 'Short-Term Guest' : 'Landlord' }
      ]},
      { title: 'Personal Information', icon: '👤', fields: [
        { l: 'Name', v: `${formData.firstName} ${formData.lastName}` || '—' },
        { l: 'Email', v: formData.email || '—' },
        { l: 'Phone', v: formData.phone || '—' },
        { l: 'DOB', v: formData.dateOfBirth || '—' },
        { l: 'Address', v: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`.replace(/^, /, '') || '—' },
      ]},
      { title: 'Cannabis Verification', icon: '🌿', fields: [
        { l: 'Cannabis Card', v: formData.hasCannaCard === 'yes' ? `Yes — ${formData.cannaCardState} #${formData.cannaCardNumber}` : 'No' },
        { l: 'Use Type', v: formData.consumptionType || '—' },
      ]},
      { title: 'Employment', icon: '💼', fields: [
        { l: 'Status', v: formData.employmentStatus || '—' },
        { l: 'Employer', v: formData.employer || '—' },
        { l: 'Monthly Income', v: formData.monthlyIncome || '—' },
      ]},
      { title: 'Rental Preferences', icon: '🏠', fields: [
        { l: 'Property Type', v: formData.propertyType || '—' },
        { l: 'Budget', v: formData.budgetMin && formData.budgetMax ? `${formData.budgetMin} - ${formData.budgetMax}` : '—' },
        { l: 'Move-In Date', v: formData.moveInDate || '—' },
        { l: 'Lease Term', v: formData.leaseTerm || '—' },
        { l: 'Pets', v: formData.petsYN === 'yes' ? `Yes — ${formData.petDetails}` : 'No' },
      ]},
    ];

    return (
      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900">Review Your Application</h3>
        <p className="text-sm text-slate-500">Please review all information before submitting.</p>
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
                <span>{s.icon}</span>
                <span className="text-sm font-bold text-slate-900">{s.title}</span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {s.fields.map((f, j) => (
                  <div key={j} className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-xs text-slate-500">{f.l}</span>
                    <span className="text-xs font-bold text-slate-800 text-right">{f.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Fee Summary */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
          <h4 className="font-black text-green-800 text-sm mb-3">Application Fees</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-600">Application Fee</span><span className="font-bold text-slate-900">$45.00</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Background Check</span><span className="font-bold text-slate-900">$35.00</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-600">Cannabis Card Verification</span><span className="font-bold text-slate-900">$15.00</span></div>
            <div className="h-px bg-green-300 my-2" />
            <div className="flex justify-between text-base"><span className="font-black text-green-800">Total Due</span><span className="font-black text-green-800 text-lg">$95.00</span></div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // LANDLORD STEPS
  // ═══════════════════════════════════════════
  const renderLandlordInfo = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Building2 className="text-purple-600" size={20} /> Landlord Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel required>First Name</FieldLabel><TextInput value={formData.firstName} onChange={(e: any) => update('firstName', e.target.value)} placeholder="First name" /></div>
        <div><FieldLabel required>Last Name</FieldLabel><TextInput value={formData.lastName} onChange={(e: any) => update('lastName', e.target.value)} placeholder="Last name" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel required>Email</FieldLabel><TextInput type="email" value={formData.email} onChange={(e: any) => update('email', e.target.value)} placeholder="email@example.com" /></div>
        <div><FieldLabel required>Phone</FieldLabel><TextInput type="tel" value={formData.phone} onChange={(e: any) => update('phone', e.target.value)} placeholder="(555) 000-0000" /></div>
      </div>
      <div><FieldLabel>Company / LLC Name (optional)</FieldLabel><TextInput value={formData.llCompany} onChange={(e: any) => update('llCompany', e.target.value)} placeholder="Property management company name" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><FieldLabel>Total Properties Owned</FieldLabel><TextInput value={formData.llProperties} onChange={(e: any) => update('llProperties', e.target.value)} placeholder="e.g. 4" /></div>
        <div><FieldLabel>Years of Landlord Experience</FieldLabel><TextInput value={formData.llExperience} onChange={(e: any) => update('llExperience', e.target.value)} placeholder="e.g. 8" /></div>
      </div>
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Home className="text-green-600" size={20} /> Property Details
      </h3>
      <div><FieldLabel required>Property Name / Title</FieldLabel><TextInput value={formData.llPropertyName} onChange={(e: any) => update('llPropertyName', e.target.value)} placeholder="e.g. Cannabis-Friendly Ranch House" /></div>
      <div><FieldLabel required>Property Address</FieldLabel><TextInput value={formData.llPropertyAddress} onChange={(e: any) => update('llPropertyAddress', e.target.value)} placeholder="123 Main St" /></div>
      <div className="grid grid-cols-3 gap-4">
        <div><FieldLabel>City</FieldLabel><TextInput value={formData.llPropertyCity} onChange={(e: any) => update('llPropertyCity', e.target.value)} /></div>
        <div>
          <FieldLabel>State</FieldLabel>
          <SelectInput value={formData.llPropertyState} onChange={(e: any) => update('llPropertyState', e.target.value)}>
            <option value="">Select</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
        </div>
        <div><FieldLabel>ZIP</FieldLabel><TextInput value={formData.llPropertyZip} onChange={(e: any) => update('llPropertyZip', e.target.value)} /></div>
      </div>
      <div>
        <FieldLabel required>Property Type</FieldLabel>
        <SelectInput value={formData.llPropertyType} onChange={(e: any) => update('llPropertyType', e.target.value)}>
          <option value="">Select Type</option>
          <option value="house">Single-Family House</option>
          <option value="apartment">Apartment / Unit</option>
          <option value="multi-family">Multi-Family (2-4 units)</option>
          <option value="commercial">Commercial Space</option>
          <option value="short-term">Short-Term / Vacation Rental</option>
        </SelectInput>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><FieldLabel>Bedrooms</FieldLabel><TextInput value={formData.llBeds} onChange={(e: any) => update('llBeds', e.target.value)} placeholder="3" /></div>
        <div><FieldLabel>Bathrooms</FieldLabel><TextInput value={formData.llBaths} onChange={(e: any) => update('llBaths', e.target.value)} placeholder="2" /></div>
        <div><FieldLabel>Sq Ft</FieldLabel><TextInput value={formData.llSqft} onChange={(e: any) => update('llSqft', e.target.value)} placeholder="1,500" /></div>
        <div><FieldLabel required>Rent/Night $</FieldLabel><TextInput value={formData.llRentAmount} onChange={(e: any) => update('llRentAmount', e.target.value)} placeholder="1,450" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Furnished?</FieldLabel>
          <SelectInput value={formData.llFurnished} onChange={(e: any) => update('llFurnished', e.target.value)}>
            <option value="">Select</option>
            <option value="yes">Yes — Fully Furnished</option>
            <option value="partial">Partially Furnished</option>
            <option value="no">No — Unfurnished</option>
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Cannabis Growing Allowed?</FieldLabel>
          <div className="flex gap-4 mt-2">
            <RadioOption name="llGrowAllowed" value="yes" checked={formData.llGrowAllowed === 'yes'} onChange={() => update('llGrowAllowed', 'yes')} label="Yes" />
            <RadioOption name="llGrowAllowed" value="no" checked={formData.llGrowAllowed === 'no'} onChange={() => update('llGrowAllowed', 'no')} label="No" />
          </div>
        </div>
      </div>
      <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors cursor-pointer bg-purple-50/50">
        <Upload className="mx-auto text-purple-500 mb-2" size={28} />
        <p className="text-sm font-bold text-purple-700">Upload Property Photos (up to 10)</p>
        <p className="text-xs text-purple-500 mt-1">JPG or PNG — max 10 MB each</p>
      </div>
    </div>
  );

  const renderServiceTier = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <Award className="text-amber-600" size={20} /> Choose Your Service Tier
      </h3>
      <p className="text-sm text-slate-500">Select the level of management service you'd like for your property.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'green', name: 'Green', price: '$49/mo', color: 'border-emerald-400 bg-emerald-50', features: ['Basic listing on CannaCribs', 'Tenant screening', 'Monthly occupancy report', 'Email support'] },
          { id: 'gold', name: 'Gold', price: '$149/mo', color: 'border-amber-400 bg-amber-50', features: ['Everything in Green', 'Bi-weekly inspections', 'Standard cleaning on turnover', 'Dedicated account manager', 'Cannabis odor monitoring'] },
          { id: 'platinum', name: 'Platinum', price: '$299/mo', color: 'border-violet-400 bg-violet-50', features: ['Everything in Gold', 'Weekly inspections', 'Deep clean on turnover', 'Renter\'s insurance coordination', 'Maintenance dispatch', 'Emergency response'] },
          { id: 'executive', name: 'Executive', price: '$499/mo', color: 'border-purple-400 bg-purple-50', features: ['Everything in Platinum', 'Full concierge management', '24/7 monitoring', 'Hotel-grade turnover service', 'Revenue optimization', 'Legal compliance audit', 'Priority listing boost'] },
        ].map(t => (
          <button key={t.id} onClick={() => update('llServiceTier', t.id)}
            className={cn('p-5 rounded-xl border-2 text-left transition-all', formData.llServiceTier === t.id ? t.color : 'border-slate-200 hover:border-slate-300 bg-white')}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-black text-slate-900">{t.name}</span>
              <span className="text-lg font-black text-green-600">{t.price}</span>
            </div>
            <ul className="space-y-1">
              {t.features.map((f, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                  <CheckCircle size={10} className="text-green-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );

  const renderLandlordAttestation = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
        <FileText className="text-amber-600" size={20} /> Landlord Attestation & Agreement
      </h3>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-900 leading-relaxed">
          By checking the boxes below, you confirm your authority to list this property and agree to CannaCribs management terms.
        </p>
      </div>
      <div className="space-y-4">
        {[
          { field: 'llAttestOwner', label: 'I certify that I am the legal owner or authorized agent of the property listed in this application.' },
          { field: 'llAttestCompliant', label: 'I understand my property must comply with all state and local cannabis consumption laws. I agree to allow cannabis use as permitted by law on the premises.' },
          { field: 'llAttestInspection', label: 'I agree to allow scheduled inspections and cleaning services as outlined by my selected service tier. I understand these services protect my investment and ensure tenant compliance.' },
        ].map((att, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            <input type="checkbox" checked={(formData as any)[att.field]} onChange={(e) => update(att.field, e.target.checked)} className="w-5 h-5 accent-green-600 mt-0.5 rounded" />
            <span className="text-sm text-slate-700 leading-relaxed"><span className="text-red-500 mr-1">*</span>{att.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderLandlordReview = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900">Review Your Listing Application</h3>
      <div className="space-y-4">
        {[
          { title: 'Landlord Info', icon: '🔑', fields: [
            { l: 'Name', v: `${formData.firstName} ${formData.lastName}` },
            { l: 'Email', v: formData.email }, { l: 'Phone', v: formData.phone },
            { l: 'Company', v: formData.llCompany || '—' },
            { l: 'Properties Owned', v: formData.llProperties || '—' },
          ]},
          { title: 'Property', icon: '🏠', fields: [
            { l: 'Name', v: formData.llPropertyName || '—' },
            { l: 'Address', v: `${formData.llPropertyAddress}, ${formData.llPropertyCity}, ${formData.llPropertyState} ${formData.llPropertyZip}` },
            { l: 'Type', v: formData.llPropertyType || '—' },
            { l: 'Beds/Baths/SqFt', v: `${formData.llBeds || '—'}/${formData.llBaths || '—'}/${formData.llSqft || '—'}` },
            { l: 'Rent', v: formData.llRentAmount ? `$${formData.llRentAmount}` : '—' },
            { l: 'Furnished', v: formData.llFurnished || '—' }, { l: 'Growing Allowed', v: formData.llGrowAllowed || '—' },
          ]},
          { title: 'Service Tier', icon: '⭐', fields: [
            { l: 'Selected Tier', v: formData.llServiceTier ? formData.llServiceTier.charAt(0).toUpperCase() + formData.llServiceTier.slice(1) : '—' },
          ]},
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
              <span>{s.icon}</span><span className="text-sm font-bold text-slate-900">{s.title}</span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {s.fields.map((f, j) => (
                <div key={j} className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-xs text-slate-500">{f.l}</span>
                  <span className="text-xs font-bold text-slate-800 text-right">{f.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
        <h4 className="font-black text-purple-800 text-sm mb-3">Landlord Listing Fee</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-slate-600">One-Time Listing Setup</span><span className="font-bold text-slate-900">$0.00</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-600">First Month Service ({formData.llServiceTier || 'N/A'})</span><span className="font-bold text-slate-900">{formData.llServiceTier === 'green' ? '$49.00' : formData.llServiceTier === 'gold' ? '$149.00' : formData.llServiceTier === 'platinum' ? '$299.00' : formData.llServiceTier === 'executive' ? '$499.00' : '$0.00'}</span></div>
          <div className="h-px bg-purple-300 my-2" />
          <div className="flex justify-between text-base"><span className="font-black text-purple-800">Total Due Today</span><span className="font-black text-purple-800 text-lg">{formData.llServiceTier === 'green' ? '$49.00' : formData.llServiceTier === 'gold' ? '$149.00' : formData.llServiceTier === 'platinum' ? '$299.00' : formData.llServiceTier === 'executive' ? '$499.00' : '$0.00'}</span></div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // CONFIRMATION (shared)
  // ═══════════════════════════════════════════
  const renderConfirmation = () => (
    <div className="text-center py-8 space-y-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-green-500/30">
        <CheckCircle className="text-white" size={48} />
      </motion.div>
      <div>
        <h2 className="text-3xl font-black text-slate-900">Application Submitted!</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          {isLandlord
            ? 'Your property listing application has been received. Our team will review it within 24-48 hours and contact you to schedule your first inspection.'
            : 'Your tenant application has been received. We\'ll verify your information and cannabis card, then match you with available properties. Expect a response within 24-48 hours.'
          }
        </p>
      </div>
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 max-w-md mx-auto space-y-3">
        <div className="flex justify-between text-sm"><span className="text-slate-500">Application ID</span><span className="font-mono font-bold text-green-600">CC-APP-{String(Date.now()).slice(-6)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span><span className="font-bold text-amber-600">Under Review</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-500">Est. Response</span><span className="font-bold text-slate-700">24-48 hours</span></div>
      </div>
      <div className="flex justify-center gap-4 pt-4">
        <button onClick={() => onNavigate?.('cannacribs')} className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all flex items-center gap-2">
          <Home size={16} /> Back to CannaCribs
        </button>
        <button onClick={() => onNavigate?.('landing')} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2">
          <ArrowLeft size={16} /> Back to GGP-OS
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════
  const isConfirmation = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#1a0a2e] via-[#2d1b4e] to-[#0a2e1a] text-white py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('cannacribs')}>
          <Leaf size={20} className="text-green-400" />
          <span className="font-black text-lg"><span className="text-green-400">Canna</span><span className="text-amber-400">Cribs</span></span>
          <span className="text-white/50 text-xs font-bold">|</span>
          <span className="text-white/70 text-xs font-bold">Application Portal</span>
        </div>
        <button onClick={() => onNavigate?.('cannacribs')} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft size={12} /> Back to Properties
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Progress */}
        {!isConfirmation && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Step {currentStep + 1} of {totalSteps}</span>
              <span className="text-xs font-bold text-green-600">{Math.round(((currentStep) / (totalSteps - 1)) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep) / (totalSteps - 1)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {activeSteps.map((step, i) => (
                <span key={i} className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full transition-all',
                  i < currentStep ? 'bg-green-100 text-green-700' :
                  i === currentStep ? 'bg-green-600 text-white' :
                  'bg-slate-100 text-slate-400'
                )}>{step}</span>
              ))}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {!isConfirmation && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                {currentStep === 0 && <User className="text-white" size={18} />}
                {currentStep === 1 && <User className="text-white" size={18} />}
                {currentStep === 2 && <Leaf className="text-white" size={18} />}
                {currentStep === 3 && <Briefcase className="text-white" size={18} />}
                {currentStep === 4 && <Shield className="text-white" size={18} />}
                {currentStep === 5 && <Home className="text-white" size={18} />}
                {currentStep === 6 && <FileText className="text-white" size={18} />}
                {currentStep === 7 && <Eye className="text-white" size={18} />}
              </div>
              <div>
                <h2 className="text-white font-black text-lg">{activeSteps[currentStep]}</h2>
                <p className="text-white/70 text-xs">CannaCribs {isLandlord ? 'Landlord' : 'Tenant'} Application</p>
              </div>
            </div>
          )}

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {isLandlord ? renderLandlordStep() : renderTenantStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {!isConfirmation && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button onClick={back} disabled={currentStep === 0}
                className={cn('px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all',
                  currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'
                )}>
                <ArrowLeft size={14} /> Back
              </button>
              <button onClick={next} disabled={!canProceed()}
                className={cn('px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all',
                  canProceed()
                    ? currentStep === totalSteps - 2
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-green-500/20'
                      : 'bg-green-600 text-white hover:bg-green-500'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                )}>
                {currentStep === totalSteps - 2 ? 'Submit Application' : 'Continue'} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CannaCribsApplicationPage;
