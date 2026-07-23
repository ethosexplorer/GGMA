import React, { useState } from 'react';
import { Phone, User, Building2, HeartPulse, FileText, CircleCheck, AlertCircle, Shield, MapPin, Mail, Calendar, CreditCard, Loader2, UserPlus, ExternalLink, PhoneIncoming, DollarSign, ClipboardList, Send, Home, Leaf, Check, Copy, Stethoscope, Scale, Gavel, ShieldAlert, Landmark, Megaphone, Vote } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { captureContact } from '../../lib/contactCapture';

type IntakeType = 'patient_card' | 'business_license' | 'cannacribs_application' | 'provider' | 'legal_intake' | 'attorney' | 'local_enforcement' | 'state_agency' | 'federal_agency' | 'gov_office' | 'advocate';

interface IntakeData {
  // Account
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  ssn: string;
  // Address
  street: string;
  city: string;
  state: string;
  zip: string;
  // Patient-specific (Acuity)
  isAdult: string;
  mailingAddress: string;
  appointmentType: string;
  appType: string;
  hasPortalAccount: string;
  hasPcp: string;
  pcpInfo: string;
  conditions: string[];
  allergies: string;
  lastDoctorVisit: string;
  insuranceName: string;
  optInMessaging: string;
  // Business-specific
  businessName: string;
  tradeName: string;
  businessType: string;
  einNumber: string;
  licenseType: string;
  entityType: string;
  ownerCount: string;
  ppocName: string;
  ppocPhone: string;
  ppocEmail: string;
  ownerShares: string;
  // Payment
  paymentPreference: string;
  // CannaCribs-specific
  ccApplicantType: string;
  ccPropertyType: string;
  ccDesiredProperty: string;
  ccMoveInDate: string;
  ccLeaseTerm: string;
  ccPets: string;
  ccVehicles: string;
  ccReasonForMoving: string;
  ccPreviousLandlord: string;
  ccPreviousLandlordPhone: string;
  ccEmergencyName: string;
  ccEmergencyPhone: string;
  ccEmergencyRelation: string;
  ccMedicalConditions: string;
  ccMedications: string;
  ccCannabisCard: string;
  // Provider-specific
  provNpi: string;
  provDea: string;
  provLicenseNumber: string;
  provPracticeName: string;
  provSpecialty: string;
  provStatesLicensed: string;
  provTelehealth: string;
  provAcceptingPatients: string;
  // Legal Intake
  legalCaseType: string;
  legalIncidentDate: string;
  legalCharges: string;
  legalCourtJurisdiction: string;
  legalCaseNumber: string;
  legalOpposingParty: string;
  legalUrgency: string;
  legalDescription: string;
  // Attorney
  attBarNumber: string;
  attBarState: string;
  attFirmName: string;
  attPracticeAreas: string;
  attYearsExperience: string;
  attRateType: string;
  attRetainer: string;
  attMalpracticeInsurance: string;
  // Local Enforcement
  enfAgencyName: string;
  enfBadgeId: string;
  enfDepartment: string;
  enfRankTitle: string;
  enfJurisdictionLevel: string;
  enfReportingReason: string;
  enfIncidentRef: string;
  enfDescription: string;
  // State Agency
  stAgencyName: string;
  stDepartment: string;
  stOfficialName: string;
  stOfficialTitle: string;
  stInquiryType: string;
  stDescription: string;
  // Federal Agency
  fedAgencyName: string;
  fedDepartment: string;
  fedAgentName: string;
  fedAgentBadge: string;
  fedCaseRef: string;
  fedInquiryType: string;
  fedDescription: string;
  // Government Office
  govOfficeName: string;
  govJurisdictionLevel: string;
  govElectedOfficial: string;
  govOfficeTitle: string;
  govInquiryType: string;
  govDescription: string;
  // Advocate
  advOrgName: string;
  advOrgType: string;
  advFocusArea: string;
  advWebsite: string;
  advMemberCount: string;
  advDescription: string;
  // Products & Services
  selectedTier: string;
  selectedBilling: string;
}

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const BIZ_TYPES = ['Dispensary','Cultivator / Grower','Processor','Transporter','Testing Laboratory','Vertically Integrated'];
const ENTITY_TYPES = ['LLC','Corporation','Sole Proprietor','Partnership','Non-Profit'];
const CONDITIONS = ['Chronic Pain','PTSD','Cancer','Epilepsy / Seizures','Glaucoma','HIV/AIDS','Crohn\'s Disease','Multiple Sclerosis','Nausea','Severe or intractable muscle spasms','Terminal Illness','Other'];

const PAYMENT_TYPES = ['Processing Fee', 'Application Fee', 'Consultation Fee', 'Service Fee', 'Filing Fee', 'Late Fee', 'Renewal Fee', 'Licensing Fee', 'Document Fee', 'Other'];
const PAYMENT_METHODS = ['Chime', 'Cash App', 'Zelle', 'Venmo', 'Cash', 'Check', 'Wire Transfer', 'Credit Card', 'Bank Transfer', 'Other'];
const STEPS_PATIENT = ['Intake Questionnaire', 'Payment Info', 'Schedule Doctor Visit', 'State Portal Setup', 'Products & Services', 'Review & Submit'];
const STEPS_BUSINESS = ['Entity & Type', 'Facility & Contact', 'Primary Owner Info', 'Payment Info', 'Products & Services', 'Review & Submit'];
const STEPS_CANNACRIBS = ['Applicant Info & Property', 'Background & Screening', 'Emergency & Medical', 'Payment Info', 'Products & Services', 'Review & Submit'];
const STEPS_PROVIDER = ['Provider Info & Credentials', 'Practice Details', 'Payment Info', 'Products & Services', 'Review & Submit'];
const STEPS_LEGAL = ['Case Details', 'Party & Jurisdiction', 'Documents & Urgency', 'Payment Info', 'Products & Services', 'Review & Submit'];
const STEPS_ATTORNEY = ['Attorney Credentials', 'Practice & Rates', 'Payment Info', 'Products & Services', 'Review & Submit'];
const STEPS_LOCAL_ENF = ['Agency & Officer', 'Incident Details', 'Products & Services', 'Review & Submit'];
const STEPS_STATE_AGENCY = ['Agency & Official', 'Inquiry Details', 'Products & Services', 'Review & Submit'];
const STEPS_FEDERAL = ['Agency & Agent', 'Case Details', 'Products & Services', 'Review & Submit'];
const STEPS_GOV_OFFICE = ['Office & Official', 'Inquiry Details', 'Products & Services', 'Review & Submit'];
const STEPS_ADVOCATE = ['Organization Info', 'Focus & Mission', 'Products & Services', 'Review & Submit'];
const CC_PROPERTY_TYPES = ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Duplex', 'Multi-Family', 'Short-Term Rental', 'Commercial Space'];
const CC_APPLICANT_TYPES = ['Tenant', 'Landlord', 'Short-Term Guest'];

const INTAKE_META: Record<string, { label: string; gradient: string; accent: string; icon: string }> = {
  patient_card: { label: 'Patient Medical Card Intake', gradient: 'from-emerald-800 to-teal-700', accent: 'emerald', icon: 'HP' },
  business_license: { label: 'Business License Intake', gradient: 'from-indigo-800 to-violet-700', accent: 'indigo', icon: 'BL' },
  cannacribs_application: { label: 'CannaCribs Housing Application', gradient: 'from-green-700 to-amber-700', accent: 'green', icon: 'CC' },
  provider: { label: 'Provider Onboarding', gradient: 'from-teal-700 to-cyan-700', accent: 'teal', icon: 'PR' },
  legal_intake: { label: 'Legal Case Intake', gradient: 'from-amber-700 to-orange-700', accent: 'amber', icon: 'LI' },
  attorney: { label: 'Attorney Onboarding', gradient: 'from-purple-800 to-fuchsia-700', accent: 'purple', icon: 'AT' },
  local_enforcement: { label: 'Local Enforcement Intake', gradient: 'from-orange-700 to-red-700', accent: 'orange', icon: 'LE' },
  state_agency: { label: 'State Agency Intake', gradient: 'from-cyan-700 to-blue-700', accent: 'cyan', icon: 'SA' },
  federal_agency: { label: 'Federal Agency Intake', gradient: 'from-red-800 to-rose-700', accent: 'red', icon: 'FA' },
  gov_office: { label: 'Government Office Intake', gradient: 'from-slate-700 to-zinc-700', accent: 'slate', icon: 'GO' },
  advocate: { label: 'Advocate Onboarding', gradient: 'from-rose-700 to-pink-700', accent: 'rose', icon: 'AV' },
};

const TIER_OPTIONS = [
  { id: 'patient', label: 'Patient / Consumer', price: '$49.99/mo', icon: 'P' },
  { id: 'business', label: 'Business / Dispensary', price: '$199/mo', icon: 'B' },
  { id: 'provider', label: 'Provider / Physician', price: '$99/mo', icon: 'Dr' },
  { id: 'attorney', label: 'Attorney / Legal', price: '$149/mo', icon: 'JD' },
  { id: 'advocacy', label: 'Advocacy & Research', price: '$79/mo', icon: 'AR' },
  { id: 'state_authority', label: 'State Authority', price: 'From $4,999/mo', icon: 'SA' },
  { id: 'law_enforcement', label: 'Law Enforcement', price: 'From $999/mo', icon: 'LE' },
  { id: 'federal_agency', label: 'Federal Agency', price: 'From $9,999/mo', icon: 'FA' },
  { id: 'independent_lab', label: 'Independent Lab', price: '$499/mo', icon: 'IL' },
  { id: 'care_wallet_gold', label: 'Care Wallet Gold', price: '$49/mo', icon: 'CW' },
];

const empty: IntakeData = { firstName:'',lastName:'',email:'',phone:'',dob:'',ssn:'',street:'',city:'',state:'Oklahoma',zip:'', isAdult:'Yes', mailingAddress:'', appointmentType:'Phone', appType:'New MMJ Card', hasPortalAccount:'No', hasPcp:'No', pcpInfo:'', conditions:[], allergies:'No', lastDoctorVisit:'', insuranceName:'', optInMessaging:'Yes', businessName:'',tradeName:'',businessType:'Dispensary',einNumber:'',licenseType:'New Application',entityType:'LLC',ownerCount:'1', ppocName:'', ppocPhone:'', ppocEmail:'', ownerShares:'', paymentPreference:'', ccApplicantType:'Tenant', ccPropertyType:'Apartment', ccDesiredProperty:'', ccMoveInDate:'', ccLeaseTerm:'12 months', ccPets:'None', ccVehicles:'', ccReasonForMoving:'', ccPreviousLandlord:'', ccPreviousLandlordPhone:'', ccEmergencyName:'', ccEmergencyPhone:'', ccEmergencyRelation:'', ccMedicalConditions:'None', ccMedications:'None', ccCannabisCard:'Yes', provNpi:'', provDea:'', provLicenseNumber:'', provPracticeName:'', provSpecialty:'Internal Medicine', provStatesLicensed:'', provTelehealth:'Yes', provAcceptingPatients:'Yes', legalCaseType:'Criminal Defense', legalIncidentDate:'', legalCharges:'', legalCourtJurisdiction:'', legalCaseNumber:'', legalOpposingParty:'', legalUrgency:'Standard', legalDescription:'', attBarNumber:'', attBarState:'Oklahoma', attFirmName:'', attPracticeAreas:'Cannabis Law', attYearsExperience:'', attRateType:'Hourly', attRetainer:'', attMalpracticeInsurance:'Yes', enfAgencyName:'', enfBadgeId:'', enfDepartment:'', enfRankTitle:'', enfJurisdictionLevel:'City', enfReportingReason:'Inquiry', enfIncidentRef:'', enfDescription:'', stAgencyName:'', stDepartment:'', stOfficialName:'', stOfficialTitle:'', stInquiryType:'Licensing', stDescription:'', fedAgencyName:'DEA', fedDepartment:'', fedAgentName:'', fedAgentBadge:'', fedCaseRef:'', fedInquiryType:'Inquiry', fedDescription:'', govOfficeName:'', govJurisdictionLevel:'City', govElectedOfficial:'', govOfficeTitle:'', govInquiryType:'Policy Inquiry', govDescription:'', advOrgName:'', advOrgType:'Non-Profit', advFocusArea:'Patient Rights', advWebsite:'', advMemberCount:'', advDescription:'', selectedTier:'', selectedBilling:'Monthly' };

// --- FORM INPUT HELPER (Moved OUTSIDE component to fix focus glitch) ---
const Field = ({ label, value, onChange, placeholder, type = 'text', required = false }: any) => (
  <div>
    <label className="text-xs font-bold text-slate-600 mb-1.5 block">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type={type} value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }: any) => (
  <div>
    <label className="text-xs font-bold text-slate-600 mb-1.5 block">{label} {required && <span className="text-red-500">*</span>}</label>
    <select value={value} onChange={(e: any) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all">
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export const PhoneIntakeForm = () => {
  const [intakeType, setIntakeType] = useState<IntakeType | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>({...empty});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [callerId, setCallerId] = useState('');
  const [callerNotes, setCallerNotes] = useState('');
  const [mailingSame, setMailingSame] = useState(true);
  const [quickSaved, setQuickSaved] = useState(false);
  
  // Custom step completion flags for patients
  const [scheduledAppt, setScheduledAppt] = useState(false);
  const [completedPortal, setCompletedPortal] = useState(false);
  const [portalUsername, setPortalUsername] = useState('');
  const [portalPassword, setPortalPassword] = useState('');

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    type: 'Processing Fee',
    method: 'Chime',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [paymentPosted, setPaymentPosted] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const handleCopyReceiptText = () => {
    const clientName = intakeType === 'patient_card' ? `${data.firstName} ${data.lastName}` : data.businessName;
    const cleanAmount = paymentForm.amount.replace(/[^0-9.]/g, '') || (intakeType === 'patient_card' ? '102.50' : '249.00');
    const formatted = '$' + parseFloat(cleanAmount).toFixed(2);
    const formattedDate = paymentForm.date ? new Date(paymentForm.date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A';
    const txId = 'INTAKE-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const receiptText = `=======================================
GLOBAL GREEN HYBRID PLATFORM RECEIPT
=======================================
Client Name    : ${clientName || 'Valued Client'}
Payment Type   : ${paymentForm.type}
Method         : ${paymentForm.method}
Amount Paid    : ${formatted}
Status         : Settled
Date           : ${formattedDate}
Transaction ID : ${txId}
=======================================
Thank you for supporting GGP-OS!
For inquiries or refunds, contact GGE Billing
Phone: 1-888-963-4447 | Email: asstsupport@gmail.com
=======================================`;

    navigator.clipboard.writeText(receiptText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const set = (k: keyof IntakeData, v: any) => setData(p => ({...p, [k]: v}));
  const toggleCondition = (c: string) => {
    if (data.conditions.includes(c)) set('conditions', data.conditions.filter(x => x !== c));
    else set('conditions', [...data.conditions, c]);
  };

  const steps = intakeType === 'patient_card' ? STEPS_PATIENT : intakeType === 'cannacribs_application' ? STEPS_CANNACRIBS : intakeType === 'provider' ? STEPS_PROVIDER : intakeType === 'legal_intake' ? STEPS_LEGAL : intakeType === 'attorney' ? STEPS_ATTORNEY : intakeType === 'local_enforcement' ? STEPS_LOCAL_ENF : intakeType === 'state_agency' ? STEPS_STATE_AGENCY : intakeType === 'federal_agency' ? STEPS_FEDERAL : intakeType === 'gov_office' ? STEPS_GOV_OFFICE : intakeType === 'advocate' ? STEPS_ADVOCATE : STEPS_BUSINESS;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const accountId = 'ACC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const appId = 'APP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const fullName = (data.firstName + ' ' + data.lastName).trim();
      const stateAbbrev = US_STATES.indexOf(data.state) >= 0
        ? ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'][US_STATES.indexOf(data.state)]
        : data.state;

      // 1. Log account creation
      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [
        'log-' + Math.random().toString(36).substr(2, 9),
        'PHONE_INTAKE_ACCOUNT_CREATE',
        'OPS_Agent',
        JSON.stringify({ accountId, name: fullName, email: data.email, phone: data.phone, type: intakeType, state: data.state })
      ]});
      // 2. Log application submission
      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [
        'log-' + Math.random().toString(36).substr(2, 9),
        'PHONE_INTAKE_APPLICATION',
        'OPS_Agent',
        JSON.stringify({
          appId, accountId, intakeType,
          applicant: fullName,
          ...(intakeType === 'patient_card' ? { conditions: data.conditions.join(', '), appType: data.appType } : { businessName: data.businessName, businessType: data.businessType, ein: data.einNumber }),
          state: data.state,
          paymentPreference: data.paymentPreference,
          callerNotes,
          submittedVia: 'Phone Intake — OPS Call Center'
        })
      ]});

      // 3. UNIVERSAL CONTACT CAPTURE — writes to `contacts`, `crm_deals`, AND Turso `patients`/`businesses` tables
      try {
        const isPatientIntake = intakeType === 'patient_card';
        await captureContact({
          name: isPatientIntake ? fullName : data.businessName,
          email: data.email,
          phone: data.phone,
          address: data.street ? `${data.street}, ${data.city}, ${stateAbbrev} ${data.zip}` : '',
          city: data.city,
          state: data.state, // Full state name (e.g. "Oklahoma") for Jurisdiction Performance Matrix grouping
          zip: data.zip,
          contactType: isPatientIntake ? 'patient' : 'business_owner',
          source: isPatientIntake ? 'phone_intake_patient' : 'phone_intake_business',
          businessName: isPatientIntake ? '' : data.businessName,
          licenseType: isPatientIntake ? (data.appType || 'Patient Card') : (data.businessType || 'Business License'),
          ein: data.einNumber || '',
          jurisdiction: data.state, // Full state name for consistency
          tags: ['phone-intake', intakeType || '', stateAbbrev.toLowerCase()],
          notes: `Account: ${accountId} | App: ${appId} | ${isPatientIntake ? 'Conditions: ' + data.conditions.join(', ') : 'EIN: ' + data.einNumber} | ${callerNotes}`,
          emailOptIn: true,
        });
      } catch (crmErr) {
        console.error('Contact capture error (non-blocking):', crmErr);
      }

      // 4. AUTO-CREATE Firebase Auth account so patient can log in immediately
      if (data.email) {
        try {
          const defaultPassword = (data.state || 'State').split(' ')[0] + 'Name1'; // e.g. "OklahomaName1"
          const res = await fetch('/api/admin-auth?action=changePassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, newPassword: defaultPassword }),
          });
          const result = await res.json();
          if (result.success) {
            console.log(`[PhoneIntake] Firebase account ${result.created ? 'created' : 'updated'} for ${data.email}`);
          } else {
            console.warn('[PhoneIntake] Account creation warning:', result.error);
          }
        } catch (authErr) {
          console.error('[PhoneIntake] Auto-create account error (non-blocking):', authErr);
        }
      }

      setCallerId(accountId);
      setSubmitted(true);
    } catch (e) { console.error(e); alert('Submission error. Check console.'); }
    setSubmitting(false);
  };

  const handlePostPayment = async () => {
    if (!paymentForm.amount) return alert('Please enter an amount.');
    setSubmitting(true);
    try {
      const clientName = data.firstName ? `${data.firstName} ${data.lastName}` : data.businessName;
      if (!clientName.trim()) {
        setSubmitting(false);
        return alert('Please go back and fill out the name/business on Step 1 first.');
      }

      const cleanAmount = paymentForm.amount.replace(/[^0-9.]/g, '');
      const formatted = '$' + parseFloat(cleanAmount).toFixed(2);
      const entryName = `${clientName} — ${paymentForm.type} (Intake)`;

      await turso.execute({
        sql: "INSERT INTO founder_ledger (origin_vector, type, gross_revenue, net_profit, status, color, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [
          entryName,
          `${paymentForm.type} (${paymentForm.method})`,
          formatted,
          formatted,
          'Settled',
          'bg-emerald-600',
          new Date(paymentForm.date).toISOString()
        ]
      });

      // Audit log
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: [
          'log-' + Math.random().toString(36).substr(2, 9),
          'PAYMENT_POSTED_INTAKE',
          'OPS_Agent',
          JSON.stringify({
            client: clientName,
            amount: formatted,
            type: paymentForm.type,
            method: paymentForm.method,
            notes: paymentForm.notes,
            date: paymentForm.date
          })
        ]
      });

      setPaymentPosted(true);
    } catch (err: any) {
      console.error(err);
      alert('Error posting payment: ' + err.message);
    }
    setSubmitting(false);
  };

  const handleSaveForLater = async () => {
    setSubmitting(true);
    try {
      const accountId = callerId || 'ACC-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const appId = 'APP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Only log account create if we haven't already
      if (!callerId) {
        await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [
          'log-' + Math.random().toString(36).substr(2, 9),
          'PHONE_INTAKE_ACCOUNT_CREATE',
          'OPS_Agent',
          JSON.stringify({ accountId, name: data.firstName + ' ' + data.lastName, email: data.email, phone: data.phone, type: intakeType, state: data.state })
        ]});
        setCallerId(accountId);
      }

      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [
        'log-' + Math.random().toString(36).substr(2, 9),
        'PHONE_INTAKE_PARTIAL_SAVE',
        'OPS_Agent',
        JSON.stringify({
          appId, accountId, intakeType,
          applicant: data.firstName + ' ' + data.lastName,
          ...(intakeType === 'patient_card' ? { conditions: data.conditions.join(', '), appType: data.appType } : { businessName: data.businessName, businessType: data.businessType, ein: data.einNumber }),
          state: data.state,
          paymentPreference: data.paymentPreference,
          callerNotes,
          submittedVia: 'Phone Intake — OPS Call Center',
          savedAtStep: step,
          status: 'Incomplete'
        })
      ]});
      alert('Intake saved! The account is created and you can pull it up later to complete payment or documents.');
      reset();
    } catch (e) { console.error(e); alert('Save error. Check console.'); }
    setSubmitting(false);
  };

  const handleQuickSaveLead = async () => {
    if (!data.firstName || !data.lastName) return alert('Please enter at least a first and last name.');
    setSubmitting(true);
    try {
      const accountId = 'LEAD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const fullName = (data.firstName + ' ' + data.lastName).trim();
      const stateAbbrev = US_STATES.indexOf(data.state) >= 0
        ? ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'][US_STATES.indexOf(data.state)]
        : data.state;

      // 1. Audit log
      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [
        'log-' + Math.random().toString(36).substr(2, 9),
        'QUICK_LEAD_SAVED',
        'OPS_Agent',
        JSON.stringify({ accountId, name: fullName, email: data.email, phone: data.phone, dob: data.dob, type: intakeType, state: data.state, status: 'callback', callerNotes })
      ]});

      // 2. Contact capture (partial — lead/callback)
      try {
        await captureContact({
          name: fullName,
          email: data.email || '',
          phone: data.phone || '',
          address: '',
          city: data.city || '',
          state: data.state || '',
          zip: '',
          contactType: intakeType === 'patient_card' ? 'patient' : 'business_owner',
          source: 'phone_intake_lead',
          businessName: '',
          licenseType: intakeType === 'patient_card' ? 'Patient Card' : 'Business License',
          ein: '',
          jurisdiction: data.state || '',
          tags: ['lead', 'callback', intakeType || '', stateAbbrev.toLowerCase()],
          notes: `LEAD (Callback) | ${accountId} | DOB: ${data.dob || 'N/A'} | ${callerNotes || 'No notes'}`,
          emailOptIn: false,
        });
      } catch (crmErr) {
        console.error('Lead capture error (non-blocking):', crmErr);
      }

      setCallerId(accountId);
      setQuickSaved(true);
      alert(`✅ Lead Saved!\n\nName: ${fullName}\nPhone: ${data.phone || 'N/A'}\nEmail: ${data.email || 'N/A'}\nLead ID: ${accountId}\n\nThis contact is saved in the CRM. If they call back, you can look them up in Account Lookup.`);
    } catch (e) { console.error(e); alert('Error saving lead. Check console.'); }
    setSubmitting(false);
  };

  const reset = () => { setIntakeType(null); setStep(0); setData({...empty}); setSubmitted(false); setCallerId(''); setCallerNotes(''); setScheduledAppt(false); setCompletedPortal(false); setPortalUsername(''); setPortalPassword(''); setPaymentPosted(false); setPaymentForm({ amount: '', type: 'Processing Fee', method: 'Chime', notes: '', date: new Date().toISOString().split('T')[0] }); setMailingSame(true); setQuickSaved(false); };

  const renderScript = () => {
    if (intakeType === null) {
      return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Thank you for calling GGP. How can I assist you today?"</p>
          <p><strong>Listen for:</strong> Patient looking for a medical card, OR a business looking for licensing (dispensary, grower, etc.).</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
            <p className="text-xs text-emerald-100/70">Select the appropriate intake path on the right to load the guided script.</p>
          </div>
        </div>
      );
    }
    
    const isPatient = intakeType === 'patient_card';
    if (isPatient) {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "I can help you with your medical card. First, are you 18 or older?"</p>
          <p className="text-xs italic text-emerald-200">If under 18, advise they need a parent/guardian.</p>
          <p><strong>Agent:</strong> "Are you applying for a new card or a renewal?"</p>
          <p><strong>Agent:</strong> "Let's get your basic information down: First and last name, email, phone number, and date of birth."</p>
          <p><strong>Agent:</strong> "I also need the physical address on your ID. If you want the card mailed elsewhere, let me know."</p>
          <p><strong>Agent:</strong> "What condition are you seeking to treat with medical marijuana?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Make sure to ask about PCP and allergies for the doctor's notes.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Our total price for the medical card is $102.50 with a state discount, which covers the doctor's fee, the state fee, and our processing. If you do not have a state discount, the total is $184.30."</p>
          <p><strong>Agent:</strong> "We need to collect the fee to schedule your doctor recommendation appointment. We accept Chime, CashApp, Venmo, PayPal, or we can email you a secure Invoice. How would you like to pay?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
            <p className="text-xs text-emerald-100/70">Select the payment option so a formal request/invoice can be dispatched via the selected platform. (You can skip and 'Save for Later' if they need time).</p>
          </div>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Perfect. Now we need to schedule your telehealth visit with the doctor."</p>
          <p><strong>Agent:</strong> "I'm opening the calendar now. Do you have a preferred day or time?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
            <p className="text-xs text-emerald-100/70">Click 'Schedule with Dr. Jiss Mathew' on RenewOklahomaCard.com and complete the booking for the patient. Check the box once confirmed.</p>
          </div>
        </div>
      );
      if (step === 3) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "The doctor visit is scheduled. Lastly, the state requires you to be registered in their OMMA portal."</p>
          <p><strong>Agent:</strong> "Have you already created an account on the state website?"</p>
          <p className="text-xs italic text-emerald-200">If No: "I can guide you through creating one now, or I can email you the link with instructions."</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
            <p className="text-xs text-emerald-100/70">Assist the caller with ok.gov registration. Verify email access if possible.</p>
          </div>
        </div>
      );
      if (step === 4) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Let me read this back to make sure we have everything correct..."</p>
          <p className="text-xs italic text-emerald-200">Verify Name, DOB, Address, Appointment Time, and Payment preference.</p>
          <p><strong>Agent:</strong> "Everything looks great. Do you have any questions for me before we wrap up?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Final Step</p>
            <p className="text-xs text-emerald-100/70">Submit the form to finalize the intake in the CRM.</p>
          </div>
        </div>
      );
    } else if (intakeType === 'business_license') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "I can help with your business licensing. What state or jurisdiction are you applying in?"</p>
          <p><strong>Agent:</strong> "What is the legal name of the business entity, and do you have a DBA or Trade Name?"</p>
          <p><strong>Agent:</strong> "Are you applying as a Dispensary, Grower, or Processor?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Verify if they are an LLC, Corporation, or Sole Proprietor for the state forms.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What is the physical street address for the facility?"</p>
          <p><strong>Agent:</strong> "The state requires a Primary Point of Contact (PPOC) for inspections. Who will that be, and what is their phone and email?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
            <p className="text-xs text-emerald-100/70">Ensure the Facility ZIP code matches the city. Remind them that PPOC must be available during business hours.</p>
          </div>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Let's get the Primary Owner's information down. Can I have your first and last name, email, and direct phone number?"</p>
          <p><strong>Agent:</strong> "What is your ownership percentage? And do you have the business EIN ready?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Background checks are required for anyone with &gt;10% ownership. Advise the caller.</p>
          </div>
        </div>
      );
    } else if (isCannaCribs) {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "I can help you with our CannaCribs housing program. Are you looking to rent a cannabis-friendly property, list your property as a landlord, or book a short-term stay?"</p>
          <p><strong>Agent:</strong> "Great! Let me get your personal information — first and last name, email, phone, and date of birth."</p>
          <p><strong>Agent:</strong> "What type of property are you looking for — apartment, house, condo, studio?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Verify their cannabis card status and desired move-in date.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "For our screening process, I need your current address, previous landlord contact, and reason for moving."</p>
          <p><strong>Agent:</strong> "Do you have any pets or vehicles we should note?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">All CannaCribs tenants must pass background + credit check. Inform the caller.</p>
          </div>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "For safety, I need an emergency contact — name, phone, and relationship."</p>
          <p><strong>Agent:</strong> "Do you have any allergies, medical conditions, or medications we should be aware of?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">This is required for all applicant types per CannaCribs safety protocol.</p>
          </div>
        </div>
      );
    } else if (intakeType === 'provider') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Thank you for your interest in partnering with GGP as a healthcare provider. I'll need to collect your credentials."</p>
          <p><strong>Agent:</strong> "Can I have your full name, NPI number, DEA number, and medical license number?"</p>
          <p><strong>Agent:</strong> "What is your specialty, and what states are you currently licensed to practice in?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">NPI is required for provider verification. DEA is optional but preferred for prescribing physicians.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What is the name of your practice? And do you offer telehealth consultations?"</p>
          <p><strong>Agent:</strong> "Are you currently accepting new patients for medical cannabis recommendations?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Telehealth capability is essential for multi-state patient coverage.</p>
          </div>
        </div>
      );
    } else if (intakeType === 'legal_intake') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "I understand you need legal assistance. Can you tell me what type of case this involves — criminal defense, civil matter, compliance issue, or licensing dispute?"</p>
          <p><strong>Agent:</strong> "When did the incident occur? And are there any charges or allegations filed?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Do NOT provide legal advice. We are collecting intake information for attorney assignment only.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What court or jurisdiction is this case in? Do you have a case number?"</p>
          <p><strong>Agent:</strong> "Is there an opposing party or agency involved?"</p>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "How urgent is this matter? Do you have a court date approaching?"</p>
          <p><strong>Agent:</strong> "Please describe the situation in your own words so we can match you with the right attorney."</p>
        </div>
      );
    } else if (intakeType === 'attorney') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Welcome! We'd like to onboard you to the GGP Legal Network. Can I get your bar number and the state you're admitted in?"</p>
          <p><strong>Agent:</strong> "What is the name of your firm, and how many years have you been practicing?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Bar number is required for verification. Ask about cannabis law experience specifically.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What practice areas do you focus on? Do you bill hourly or flat-fee?"</p>
          <p><strong>Agent:</strong> "Do you require a retainer? And do you carry malpractice insurance?"</p>
        </div>
      );
    } else if (intakeType === 'local_enforcement') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Thank you for contacting GGP. May I have the name of your agency and department?"</p>
          <p><strong>Agent:</strong> "Can I get your badge or ID number, rank, and title for our records?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">⚠️ Protocol</p>
            <p className="text-xs text-emerald-100/70">Verify agency identity. All law enforcement contacts are logged and escalated to compliance.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What is the nature of your inquiry? Is there an incident or case reference number?"</p>
          <p><strong>Agent:</strong> "Please describe the situation so we can route your request appropriately."</p>
        </div>
      );
    } else if (intakeType === 'state_agency') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Thank you for reaching out. Which state agency or department are you contacting us from?"</p>
          <p><strong>Agent:</strong> "May I have the name and title of the official making this inquiry?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">⚠️ Protocol</p>
            <p className="text-xs text-emerald-100/70">State agency contacts are logged and escalated to the Chief Compliance Officer immediately.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Is this regarding an audit, a complaint, a licensing matter, or a general information request?"</p>
          <p><strong>Agent:</strong> "Please provide details so we can prepare the appropriate documentation."</p>
        </div>
      );
    } else if (intakeType === 'federal_agency') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Thank you for contacting Global Green Platform. Which federal agency are you representing — DEA, FDA, ATF, DOJ, or another?"</p>
          <p><strong>Agent:</strong> "May I have the agent's name, badge number, and department?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">🔴 Critical Protocol</p>
            <p className="text-xs text-emerald-100/70">Federal agency contacts are IMMEDIATELY escalated to the Founder and Chief Compliance Officer. Log all details accurately.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Is there a case or reference number associated with this contact?"</p>
          <p><strong>Agent:</strong> "What is the nature of the inquiry? Please describe in detail."</p>
        </div>
      );
    } else if (intakeType === 'gov_office') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Thank you for reaching out. Which government office are you contacting us from?"</p>
          <p><strong>Agent:</strong> "May I have the elected official's name and title?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Government office contacts are escalated to the Founder for direct follow-up.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What is the nature of this inquiry — policy, licensing, partnerships, or something else?"</p>
          <p><strong>Agent:</strong> "Please describe so we can prepare a proper briefing."</p>
        </div>
      );
    } else if (intakeType === 'advocate') {
      if (step === 0) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Thank you for your interest in partnering with GGP. What is the name of your organization?"</p>
          <p><strong>Agent:</strong> "Are you a non-profit, research institution, community organization, or policy group?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
            <p className="text-xs text-emerald-100/70">Advocacy organizations may qualify for discounted platform access.</p>
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What is your organization's primary focus area — patient rights, social equity, policy reform, or research?"</p>
          <p><strong>Agent:</strong> "Do you have a website and approximately how many members does your organization have?"</p>
        </div>
      );
    }
    // Generic script for payment/products/review steps on all types
    const currentStepName = steps[step] || '';
    if (currentStepName.includes('Payment')) return (
      <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
        <p><strong>Agent:</strong> "Let's discuss payment. How would you like to handle the processing fee?"</p>
        <p><strong>Agent:</strong> "We accept Chime, CashApp, Venmo, PayPal, or we can send a formal Invoice."</p>
        <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
          <p className="text-xs text-emerald-100/70">Post payment or 'Save for Later' if they need time.</p>
        </div>
      </div>
    );
    if (currentStepName.includes('Products')) return (
      <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
        <p><strong>Agent:</strong> "We have several service tiers available. Let me walk you through the options that best fit your needs."</p>
        <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Agent Note</p>
          <p className="text-xs text-emerald-100/70">Select the appropriate tier and billing cycle for the caller.</p>
        </div>
      </div>
    );
    if (currentStepName.includes('Review')) return (
      <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
        <p><strong>Agent:</strong> "Let me read this back to make sure everything is correct..."</p>
        <p className="text-xs italic text-emerald-200">Verify all details with the caller before submitting.</p>
        <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Final Step</p>
          <p className="text-xs text-emerald-100/70">Submit the form to create the account and application.</p>
        </div>
      </div>
    );
  };

  // --- TYPE SELECTOR ---
  if (!intakeType) return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#1a4731] to-emerald-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Phone size={100} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center"><Phone size={20} /></div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Phone Intake Form</h2>
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest">OPS Call Center — Internal Use Only</p>
            </div>
          </div>
          <p className="text-emerald-100/80 text-sm mt-4 max-w-lg">Create an account and submit an application on behalf of a caller. Select the application type below to begin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Row 1: Patient, Business, CannaCribs */}
        <button onClick={() => setIntakeType('patient_card')} className="group bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-emerald-100">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors"><HeartPulse size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Patient Medical Card</h3>
          <p className="text-xs text-slate-500">New patient card, renewal, or caregiver registration.</p>
          <div className="mt-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Start →</div>
        </button>
        <button onClick={() => setIntakeType('business_license')} className="group bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-indigo-100">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors"><Building2 size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Business License</h3>
          <p className="text-xs text-slate-500">Dispensary, cultivator, processor, or lab license.</p>
          <div className="mt-3 text-[10px] font-black text-indigo-600 uppercase tracking-widest">Start →</div>
        </button>
        <button onClick={() => setIntakeType('cannacribs_application')} className="group bg-white border-2 border-slate-200 hover:border-green-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-green-100">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-amber-50 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-amber-100 transition-colors"><Leaf size={24} className="text-green-600" /></div>
          <h3 className="text-base font-black text-slate-800 mb-1"><span className="text-green-600">Canna</span><span className="text-amber-500">Cribs</span></h3>
          <p className="text-xs text-slate-500">Tenant, landlord, or short-term guest housing.</p>
          <div className="mt-3 text-[10px] font-black text-green-600 uppercase tracking-widest">Start →</div>
        </button>

        {/* Row 2: Provider, Legal Intake, Attorney */}
        <button onClick={() => setIntakeType('provider')} className="group bg-white border-2 border-slate-200 hover:border-teal-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-teal-100">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4 group-hover:bg-teal-100 transition-colors"><Stethoscope size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Provider Onboarding</h3>
          <p className="text-xs text-slate-500">Physician or healthcare provider registration.</p>
          <div className="mt-3 text-[10px] font-black text-teal-600 uppercase tracking-widest">Start →</div>
        </button>
        <button onClick={() => setIntakeType('legal_intake')} className="group bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-amber-100">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-100 transition-colors"><Scale size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Legal Intake</h3>
          <p className="text-xs text-slate-500">Cannabis-related legal case or dispute intake.</p>
          <div className="mt-3 text-[10px] font-black text-amber-600 uppercase tracking-widest">Start →</div>
        </button>
        <button onClick={() => setIntakeType('attorney')} className="group bg-white border-2 border-slate-200 hover:border-purple-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-purple-100">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-100 transition-colors"><Gavel size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Attorney Onboarding</h3>
          <p className="text-xs text-slate-500">Onboard attorneys to the GGP legal network.</p>
          <div className="mt-3 text-[10px] font-black text-purple-600 uppercase tracking-widest">Start →</div>
        </button>

        {/* Row 3: Local Enforcement, State Agency, Federal Agency */}
        <button onClick={() => setIntakeType('local_enforcement')} className="group bg-white border-2 border-slate-200 hover:border-orange-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-orange-100">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-100 transition-colors"><Shield size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Local Enforcement</h3>
          <p className="text-xs text-slate-500">City/county law enforcement inbound inquiry.</p>
          <div className="mt-3 text-[10px] font-black text-orange-600 uppercase tracking-widest">Start →</div>
        </button>
        <button onClick={() => setIntakeType('state_agency')} className="group bg-white border-2 border-slate-200 hover:border-cyan-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-cyan-100">
          <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 mb-4 group-hover:bg-cyan-100 transition-colors"><Landmark size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">State Agency</h3>
          <p className="text-xs text-slate-500">State regulatory authority or department inquiry.</p>
          <div className="mt-3 text-[10px] font-black text-cyan-600 uppercase tracking-widest">Start →</div>
        </button>
        <button onClick={() => setIntakeType('federal_agency')} className="group bg-white border-2 border-slate-200 hover:border-red-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-red-100">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-100 transition-colors"><ShieldAlert size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Federal Agency</h3>
          <p className="text-xs text-slate-500">DEA, FDA, ATF, DOJ, or other federal inquiry.</p>
          <div className="mt-3 text-[10px] font-black text-red-600 uppercase tracking-widest">Start →</div>
        </button>

        {/* Row 4: Gov Office, Advocate */}
        <button onClick={() => setIntakeType('gov_office')} className="group bg-white border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-slate-100">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-slate-200 transition-colors"><Vote size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Government Office</h3>
          <p className="text-xs text-slate-500">Governor's office, legislator, or elected official.</p>
          <div className="mt-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">Start →</div>
        </button>
        <button onClick={() => setIntakeType('advocate')} className="group bg-white border-2 border-slate-200 hover:border-rose-400 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-rose-100">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4 group-hover:bg-rose-100 transition-colors"><Megaphone size={24} /></div>
          <h3 className="text-base font-black text-slate-800 mb-1">Advocate Onboarding</h3>
          <p className="text-xs text-slate-500">Advocacy org or research organization registration.</p>
          <div className="mt-3 text-[10px] font-black text-rose-600 uppercase tracking-widest">Start →</div>
        </button>
      </div>
    </div>
  );

  // --- SUCCESS SCREEN ---
  if (submitted) return (
    <div className="max-w-xl mx-auto text-center space-y-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"><CircleCheck size={40} className="text-emerald-600" /></div>
      <h2 className="text-3xl font-black text-slate-800">Application Submitted</h2>
      <p className="text-slate-500">Account and application have been created for <strong className="text-slate-800">{data.firstName} {data.lastName}</strong>.</p>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3 max-w-md mx-auto">
        <div className="flex justify-between text-sm"><span className="text-slate-500">Account ID</span><span className="font-mono font-bold text-indigo-600">{callerId}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-500">Type</span><span className="font-bold text-slate-800">{intakeType ? INTAKE_META[intakeType]?.label || intakeType : 'Unknown'}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-500">State</span><span className="font-bold text-slate-800">{data.state}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-500">Email</span><span className="font-bold text-slate-800">{data.email}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-500">Submitted Via</span><span className="font-bold text-emerald-600">Phone Intake — OPS</span></div>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 font-bold flex items-start gap-2 max-w-md mx-auto text-left">
        <Mail size={16} className="shrink-0 mt-0.5" />
        <span>A registration invite has been sent to <strong>{data.email}</strong>. The caller can set up their login from that email. Their application is already visible in the Applications tab.</span>
      </div>
      <button onClick={reset} className="px-8 py-3 bg-[#1a4731] text-white font-bold rounded-xl hover:bg-[#153a28] transition-colors shadow-lg">Start New Intake</button>
    </div>
  );

  const isPatient = intakeType === 'patient_card';
  const isCannaCribs = intakeType === 'cannacribs_application';

  // --- STEP CONTENT ---
  const renderStep = () => {
    if (isPatient) {
      if (step === 0) return (
        <div className="space-y-6">
          {/* Quick Intake Form Link — Send to patient */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <ClipboardList size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-blue-900 mb-1">📋 Fast-Track: Send Digital Intake Form</p>
                <p className="text-xs text-blue-700 mb-2">Send this link to the caller so they can pre-fill their info before the appointment. All data will be available at appointment time.</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://ggp-os.com/intake');
                      alert('Intake link copied to clipboard!');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Copy Link
                  </button>
                  <a
                    href="https://form.jotform.com/261585644243057"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    Open Form ↗
                  </a>
                  <span className="text-[10px] text-blue-500 font-mono self-center truncate">ggp-os.com/intake</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 font-medium">
            <strong>Qualifying Intake for Medical Card:</strong> 18 OR OLDER (if under 18 please have a parent or guardian schedule on your behalf). Fill info accurately.
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select label="Are you an adult?" value={data.isAdult} onChange={(v: string) => set('isAdult', v)} options={['Yes', 'No']} required />
            <Select label="App Type" value={data.appType} onChange={(v: string) => set('appType', v)} options={['New MMJ Card', 'Renewal']} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="John" required />
            <Field label="Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Doe" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email Address" value={data.email} onChange={(v: string) => set('email', v)} placeholder="john@email.com" type="email" required />
            <Field label="Phone Number" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth" value={data.dob} onChange={(v: string) => set('dob', v)} type="date" required />
            <Field label="Social Security Number" value={data.ssn} onChange={(v: string) => set('ssn', v)} placeholder="XXX-XX-XXXX" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select label="State / Jurisdiction" value={data.state} onChange={(v: string) => set('state', v)} options={US_STATES} required />
            <Field label="City" value={data.city} onChange={(v: string) => set('city', v)} placeholder="Oklahoma City" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Physical Street Address" value={data.street} onChange={(v: string) => set('street', v)} placeholder="123 Main St" required />
            <Field label="ZIP Code" value={data.zip} onChange={(v: string) => set('zip', v)} placeholder="73102" required />
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer group mb-2">
              <input type="checkbox" checked={mailingSame} onChange={() => {
                const next = !mailingSame;
                setMailingSame(next);
                if (next) set('mailingAddress', 'SAME');
                else set('mailingAddress', '');
              }} className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer" />
              <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">Mailing address is the SAME as physical address</span>
            </label>
            {!mailingSame && (
              <Field label="Mailing Address (if different)" value={data.mailingAddress} onChange={(v: string) => set('mailingAddress', v)} placeholder="Enter mailing address" required />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select label="How do you want your appointment to be done?" value={data.appointmentType} onChange={(v: string) => set('appointmentType', v)} options={['Phone', 'Video', 'In-Person']} required />
            <Select label="HAVE YOU REGISTERED YOUR ACCOUNT UNDER THE NEW MMJ PORTAL?" value={data.hasPortalAccount} onChange={(v: string) => set('hasPortalAccount', v)} options={['Yes', 'No']} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Do you have a primary care provider?" value={data.hasPcp} onChange={(v: string) => set('hasPcp', v)} options={['Yes', 'No']} required />
            {data.hasPcp === 'Yes' && <Field label="Primary Physician Name & Phone" value={data.pcpInfo} onChange={(v: string) => set('pcpInfo', v)} placeholder="Dr. Smith - 555-0000" />}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Why do you want to apply for your Medical Marijuana Card, which of the following do you have? *</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {CONDITIONS.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={data.conditions.includes(c)} onChange={() => toggleCondition(c)} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                  {c}
                </label>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select label="Do you have any allergies?" value={data.allergies} onChange={(v: string) => set('allergies', v)} options={['Yes', 'No']} required />
            <Field label="When was the last time you spoke with a doctor about these complaints?" value={data.lastDoctorVisit} onChange={(v: string) => set('lastDoctorVisit', v)} placeholder="e.g. 6 months ago" />
          </div>

          <Field label="Name of your primary health insurance" value={data.insuranceName} onChange={(v: string) => set('insuranceName', v)} placeholder="BlueCross, Medicare, etc." />
          
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Document Uploads</label>
            <p className="text-xs text-slate-500 mb-2 font-bold text-emerald-700">Instruct the caller to send the following documents to asstsupport@gmail.com or text 1-405-492-7487:</p>
            <ul className="list-disc list-inside text-xs text-slate-500 mb-2 space-y-1">
              <li>Medical Records (if available)</li>
              <li>Front of Driver License, Passport, or Tribal ID</li>
              <li>Passport-style Selfie on a white background (no hat, necklace, glasses, no teeth showing)</li>
              <li>Front of Health Insurance Card</li>
            </ul>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Agent Notes / Remarks</label>
            <textarea value={callerNotes} onChange={(e) => setCallerNotes(e.target.value)} rows={3} placeholder="Additional notes from the call..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none" />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-emerald-50 border-emerald-200 text-emerald-800 mb-4">
            <DollarSign size={14} className="shrink-0 mt-0.5" />
            <span>Post a one-time payment directly to the accounting ledger.</span>
          </div>

          {paymentPosted ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CircleCheck size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Payment Posted!</h3>
              <p className="text-sm text-slate-500 font-medium mb-2">Entry added to Accounting Ledger.</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopyReceiptText(); }}
                className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 shadow-sm", 
                  copiedReceipt 
                    ? "bg-emerald-600 border-emerald-600 text-white" 
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                )}
              >
                {copiedReceipt ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Receipt</>}
              </button>
            </div>
          ) : (
            <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="102.50" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Date Received</label>
                  <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Type</label>
                  <select value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                    {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                  <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Notes (optional)</label>
                <textarea value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm resize-none" />
              </div>

              <button onClick={handlePostPayment} disabled={submitting} className={cn("w-full py-3.5 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4", isPatient ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700")}>
                <DollarSign size={16} /> Post Payment to Ledger
              </button>

              {/* Quick Dispatch via Found */}
              {data.email && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const clientName = data.firstName ? `${data.firstName} ${data.lastName}` : 'Client';
                      const amount = paymentForm.amount ? `$${parseFloat(paymentForm.amount.replace(/[^0-9.]/g, '')).toFixed(2)}` : '$102.50';
                      navigator.clipboard.writeText(`${clientName} — ${data.email} — ${amount} — Medical Card ${data.appType || 'Application'}`);
                      window.open('https://app.found.com/invoices', '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black rounded-xl border border-blue-200 transition-colors"
                  >
                    <Send size={14} /> Send Invoice
                  </button>
                  <button
                    onClick={() => {
                      const clientName = data.firstName ? `${data.firstName} ${data.lastName}` : 'Client';
                      const amount = paymentForm.amount ? `$${parseFloat(paymentForm.amount.replace(/[^0-9.]/g, '')).toFixed(2)}` : '$102.50';
                      navigator.clipboard.writeText(`${clientName} — ${data.email} — ${amount} — Medical Card ${data.appType || 'Application'}`);
                      window.open('https://app.found.com/invoices', '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black rounded-xl border border-emerald-200 transition-colors"
                  >
                    <DollarSign size={14} /> Request for Pay
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
      if (step === 2) return (
        <div className="space-y-6 flex flex-col items-center justify-center text-center py-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Calendar size={36} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Schedule with Dr. Jiss Mathew</h3>
          <p className="text-slate-500 max-w-md">The patient's initial intake is recorded. Next, proceed to RenewOklahomaCard.com to book their Doctor recommendation appointment.</p>
          
          <a href="https://www.renewoklahomacard.com/" target="_blank" rel="noreferrer" 
             className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 w-full max-w-sm mt-4">
            <ExternalLink size={20} /> Open Dr. Jiss Mathew — RenewOklahomaCard.com
          </a>

          <div className="mt-8 pt-6 border-t border-slate-200 w-full flex justify-center">
            <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-200 p-4 rounded-xl hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={scheduledAppt} onChange={(e) => setScheduledAppt(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
              <span className="font-bold text-slate-700">I have completed scheduling the appointment.</span>
            </label>
          </div>
        </div>
      );
      if (step === 3) return (
        <div className="space-y-6 flex flex-col items-center justify-center text-center py-8">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <UserPlus size={36} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">State Portal Registration</h3>
          <p className="text-slate-500 max-w-md">Open the state licensing portal to assist the patient in creating or verifying their government account.</p>
          
          <a href="https://login.ok.gov/5daebe6e-7dde-4666-aac4-f2a4e50d5286/B2C_1A_455_SIGNUPORSIGNIN/oauth2/v2.0/authorize?client_id=0f51c232-01e9-40da-bb92-cd58d2ed6525&nonce=185366832846426923&redirect_uri=https%3A%2F%2Fmedportal.omma.ok.gov%2Fservices%2Fauthcallback%2FB2C_OIDC_Custom&response_type=code&scope=openid+offline_access+0f51c232-01e9-40da-bb92-cd58d2ed6525&state=CAAAAZ4p5xctMDAwMDAwMDAwMDAwMDAwAAABBJl5a1INVw5q98hF5BCu-fHokmxKJwCpwoAaRgUsvgl51cTHhLpf7dMSTCYGkqU_U--ppnZySnvsiQobJ5Hk_A_x9S5Pk4srAPOPTbFwHrPOJqEQvw9NMb7uRdp6i_FF5NJNUaMAddov6f-t8wKd-iT0mvS2ZtzvbVa4t-n_uwnUnYJ1rGU-5OM6j8BdtTelnlWs5_rEK9axgSiYpzS-vsue9uxCNbzn1b03gyjzkYwLPgaHWugr_VRMcdz3LtXLQQ%3D%3D" target="_blank" rel="noreferrer" 
             className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 w-full max-w-sm mt-4">
            <ExternalLink size={20} /> Open OK.gov Portal
          </a>

          {/* State Portal Login Credentials */}
          <div className="w-full max-w-sm mt-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 space-y-3 text-left">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
              <Shield size={12} /> Patient's State Portal Login Info
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Portal Username / Email</label>
              <input type="text" value={portalUsername} onChange={(e) => setPortalUsername(e.target.value)} placeholder="patient@email.com"
                className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Portal Password</label>
              <input type="text" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} placeholder="Password set during registration"
                className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Record the login credentials created for the patient's state portal account.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 w-full flex justify-center">
            <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-200 p-4 rounded-xl hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={completedPortal} onChange={(e) => setCompletedPortal(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="font-bold text-slate-700">I have successfully registered the patient's portal account.</span>
            </label>
          </div>
        </div>
      );
      if (step === 4) {
        const rows = [
          { l: 'Name', v: data.firstName + ' ' + data.lastName },
          { l: 'App Type', v: data.appType },
          { l: 'Payment', v: data.paymentPreference },
          { l: 'DOB', v: data.dob },
          { l: 'Phone', v: data.phone },
          { l: 'State', v: data.state },
          { l: 'PCP', v: data.hasPcp === 'Yes' ? data.pcpInfo : 'None' },
        ];
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-emerald-50 border-emerald-200 text-emerald-800">
              <Shield size={14} className="shrink-0 mt-0.5" />
              <span>Review all information. This will finalize the patient's record in GGP-OS and sync with the scheduling systems.</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
              {rows.map((r, i) => (
                <div key={i} className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-slate-500">{r.l}</span>
                  <span className="font-bold text-slate-800 text-right max-w-[60%]">{r.v || '—'}</span>
                </div>
              ))}
            </div>
            {callerNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Agent Notes</p>
                <p className="text-sm text-amber-900">{callerNotes}</p>
              </div>
            )}
          </div>
        );
      }
    } else if (!isCannaCribs) {
      // --- BUSINESS STEPS ---
      if (step === 0) return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Jurisdiction (State)" value={data.state} onChange={(v: string) => set('state', v)} options={US_STATES} required />
            <Select label="License Type" value={data.licenseType} onChange={(v: string) => set('licenseType', v)} options={['New Application','Renewal','Transfer of Ownership','Change of Location']} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business Legal Name" value={data.businessName} onChange={(v: string) => set('businessName', v)} placeholder="Green Leaf LLC" required />
            <Field label="Trade Name (DBA)" value={data.tradeName} onChange={(v: string) => set('tradeName', v)} placeholder="Green Leaf Dispensary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Business Type" value={data.businessType} onChange={(v: string) => set('businessType', v)} options={BIZ_TYPES} required />
            <Select label="Entity Type" value={data.entityType} onChange={(v: string) => set('entityType', v)} options={ENTITY_TYPES} required />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4">
          <Field label="Facility Street Address" value={data.street} onChange={(v: string) => set('street', v)} placeholder="123 Main St" required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value={data.city} onChange={(v: string) => set('city', v)} placeholder="Oklahoma City" required />
            <Field label="ZIP Code" value={data.zip} onChange={(v: string) => set('zip', v)} placeholder="73102" required />
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 mt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Primary Point of Contact (PPOC)</h4>
            <div className="space-y-3">
              <Field label="PPOC Name" value={data.ppocName} onChange={(v: string) => set('ppocName', v)} placeholder="Jane Doe" required />
              <div className="grid grid-cols-2 gap-4">
                <Field label="PPOC Phone" value={data.ppocPhone} onChange={(v: string) => set('ppocPhone', v)} placeholder="(555) 123-4567" required />
                <Field label="PPOC Email" value={data.ppocEmail} onChange={(v: string) => set('ppocEmail', v)} placeholder="jane@email.com" required />
              </div>
            </div>
          </div>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Owner First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="John" required />
            <Field label="Primary Owner Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Smith" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Owner Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="john@email.com" required />
            <Field label="Owner Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ownership %" value={data.ownerShares} onChange={(v: string) => set('ownerShares', v)} placeholder="100%" required />
            <Field label="Business EIN" value={data.einNumber} onChange={(v: string) => set('einNumber', v)} placeholder="12-3456789" required />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Agent Notes</label>
            <textarea value={callerNotes} onChange={(e) => setCallerNotes(e.target.value)} rows={3} placeholder="Additional notes from the call..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
          </div>
        </div>
      );
      if (step === 3) return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-indigo-50 border-indigo-200 text-indigo-800 mb-4">
            <DollarSign size={14} className="shrink-0 mt-0.5" />
            <span>Post a one-time payment directly to the accounting ledger.</span>
          </div>

          {paymentPosted ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <CircleCheck size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Payment Posted!</h3>
              <p className="text-sm text-slate-500 font-medium mb-2">Entry added to Accounting Ledger.</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopyReceiptText(); }}
                className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 shadow-sm", 
                  copiedReceipt 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                )}
              >
                {copiedReceipt ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Receipt</>}
              </button>
            </div>
          ) : (
            <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="249.00" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Date Received</label>
                  <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Type</label>
                  <select value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm">
                    {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                  <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm">
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Notes (optional)</label>
                <textarea value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-sm resize-none" />
              </div>

              <button onClick={handlePostPayment} disabled={submitting} className={cn("w-full py-3.5 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4", isPatient ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700")}>
                <DollarSign size={16} /> Post Payment to Ledger
              </button>

              {/* Quick Dispatch via Found */}
              {data.email && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const clientName = data.businessName || `${data.firstName} ${data.lastName}`;
                      const amount = paymentForm.amount ? `$${parseFloat(paymentForm.amount.replace(/[^0-9.]/g, '')).toFixed(2)}` : '$249.00';
                      navigator.clipboard.writeText(`${clientName} — ${data.email} — ${amount} — ${data.businessType || 'Business'} License`);
                      window.open('https://app.found.com/invoices', '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black rounded-xl border border-blue-200 transition-colors"
                  >
                    <Send size={14} /> Send Invoice
                  </button>
                  <button
                    onClick={() => {
                      const clientName = data.businessName || `${data.firstName} ${data.lastName}`;
                      const amount = paymentForm.amount ? `$${parseFloat(paymentForm.amount.replace(/[^0-9.]/g, '')).toFixed(2)}` : '$249.00';
                      navigator.clipboard.writeText(`${clientName} — ${data.email} — ${amount} — ${data.businessType || 'Business'} License`);
                      window.open('https://app.found.com/invoices', '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black rounded-xl border border-emerald-200 transition-colors"
                  >
                    <DollarSign size={14} /> Request for Pay
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
      if (step === 4) {
        const rows = [
          { l: 'Business Name', v: data.businessName },
          { l: 'Jurisdiction', v: data.state },
          { l: 'License Type', v: data.licenseType },
          { l: 'Payment', v: data.paymentPreference },
          { l: 'Facility Address', v: data.street ? data.street + ', ' + data.city + ', ' + data.state + ' ' + data.zip : '—' },
          { l: 'PPOC Name', v: data.ppocName },
          { l: 'Primary Owner', v: data.firstName + ' ' + data.lastName },
          { l: 'Owner Email', v: data.email },
          { l: 'EIN', v: data.einNumber },
        ];
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-indigo-50 border-indigo-200 text-indigo-800">
              <Shield size={14} className="shrink-0 mt-0.5" />
              <span>Review all information with the caller before submitting. This will create their account and submit the initial application.</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
              {rows.map((r, i) => (
                <div key={i} className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-slate-500">{r.l}</span>
                  <span className="font-bold text-slate-800 text-right max-w-[60%]">{r.v || '—'}</span>
                </div>
              ))}
            </div>
            {callerNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Agent Notes</p>
                <p className="text-sm text-amber-900">{callerNotes}</p>
              </div>
            )}
          </div>
        );
      }
    }
    // CannaCribs form steps
    if (isCannaCribs) {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-green-50 to-amber-50 border border-green-200 rounded-xl text-sm text-green-800 font-medium">
            <strong>CannaCribs Application:</strong> Cannabis-friendly housing for verified cardholders, landlords, and short-term guests.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Applicant Type" value={data.ccApplicantType} onChange={(v: string) => set('ccApplicantType', v)} options={CC_APPLICANT_TYPES} required />
            <Select label="Property Type" value={data.ccPropertyType} onChange={(v: string) => set('ccPropertyType', v)} options={CC_PROPERTY_TYPES} required />
          </div>
          <Field label="Desired Property / Area" value={data.ccDesiredProperty} onChange={(v: string) => set('ccDesiredProperty', v)} placeholder="e.g. Modern Cannabis-Friendly Loft, OKC area" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="John" required />
            <Field label="Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Doe" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email Address" value={data.email} onChange={(v: string) => set('email', v)} placeholder="john@email.com" type="email" required />
            <Field label="Phone Number" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth" value={data.dob} onChange={(v: string) => set('dob', v)} type="date" required />
            <Select label="Do you have a Cannabis Card?" value={data.ccCannabisCard} onChange={(v: string) => set('ccCannabisCard', v)} options={['Yes', 'No', 'In Progress']} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Desired Move-In Date" value={data.ccMoveInDate} onChange={(v: string) => set('ccMoveInDate', v)} type="date" />
            <Select label="Lease Term" value={data.ccLeaseTerm} onChange={(v: string) => set('ccLeaseTerm', v)} options={['Month-to-Month', '3 months', '6 months', '12 months', '24 months', 'Short-Term (1-30 days)']} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Agent Notes / Remarks</label>
            <textarea value={callerNotes} onChange={(e) => setCallerNotes(e.target.value)} rows={3} placeholder="Additional notes from the call..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none" />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <div className="text-[10px] font-black text-green-600 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Background & Screening</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Current Street Address" value={data.street} onChange={(v: string) => set('street', v)} placeholder="123 Main St" required />
            <Field label="City" value={data.city} onChange={(v: string) => set('city', v)} placeholder="Oklahoma City" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="State" value={data.state} onChange={(v: string) => set('state', v)} options={US_STATES} required />
            <Field label="ZIP Code" value={data.zip} onChange={(v: string) => set('zip', v)} placeholder="73102" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Previous Landlord Name" value={data.ccPreviousLandlord} onChange={(v: string) => set('ccPreviousLandlord', v)} placeholder="Mark Reynolds" />
            <Field label="Previous Landlord Phone" value={data.ccPreviousLandlordPhone} onChange={(v: string) => set('ccPreviousLandlordPhone', v)} placeholder="(555) 000-0000" />
          </div>
          <Field label="Reason for Moving" value={data.ccReasonForMoving} onChange={(v: string) => set('ccReasonForMoving', v)} placeholder="e.g. Current landlord prohibits cannabis" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Pets" value={data.ccPets} onChange={(v: string) => set('ccPets', v)} placeholder="Dog — Golden Retriever, 45 lbs" />
            <Field label="Vehicles" value={data.ccVehicles} onChange={(v: string) => set('ccVehicles', v)} placeholder="2022 Toyota Camry" />
          </div>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-6">
          <div className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Emergency Contact & Medical Information</div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Emergency Contact Name" value={data.ccEmergencyName} onChange={(v: string) => set('ccEmergencyName', v)} placeholder="Linda Carter" required />
            <Field label="Emergency Phone" value={data.ccEmergencyPhone} onChange={(v: string) => set('ccEmergencyPhone', v)} placeholder="(555) 000-0000" required />
            <Select label="Relationship" value={data.ccEmergencyRelation} onChange={(v: string) => set('ccEmergencyRelation', v)} options={['Mother', 'Father', 'Spouse', 'Sibling', 'Friend', 'Other']} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Medical Conditions" value={data.ccMedicalConditions} onChange={(v: string) => set('ccMedicalConditions', v)} placeholder="None, or describe" />
            <Field label="Medications" value={data.ccMedications} onChange={(v: string) => set('ccMedications', v)} placeholder="Medical cannabis, etc." />
          </div>
          <Select label="Allergies" value={data.allergies} onChange={(v: string) => set('allergies', v)} options={['Yes', 'No']} />
        </div>
      );
      // Step 3 (Payment) reuses the same payment form as patient/business — handled in the isPatient else branch
      if (step === 3) return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-green-50 border-green-200 text-green-800 mb-4">
            <DollarSign size={14} className="shrink-0 mt-0.5" />
            <span>Post a one-time CannaCribs application processing fee to the accounting ledger.</span>
          </div>
          {paymentPosted ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"><CircleCheck size={32} className="text-emerald-600" /></div>
              <h3 className="text-lg font-black text-slate-800">Payment Posted!</h3>
              <p className="text-sm text-slate-500 font-medium mb-2">Entry added to Accounting Ledger.</p>
            </div>
          ) : (
            <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="75.00" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-medium text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Date Received</label>
                  <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-medium text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Type</label>
                  <select value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-medium text-sm">
                    {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                  <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 font-medium text-sm">
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handlePostPayment} disabled={submitting} className="w-full py-3.5 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 bg-green-600 hover:bg-green-700">
                <DollarSign size={16} /> Post Payment to Ledger
              </button>
            </div>
          )}
        </div>
      );
      if (step === 4) return (
        <div className="space-y-4">
          <h3 className="font-black text-slate-900 flex items-center gap-2"><ClipboardList size={18} className="text-green-600" /> CannaCribs Application Summary</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
            {[
              { l: 'Applicant', v: `${data.firstName} ${data.lastName}` },
              { l: 'Type', v: data.ccApplicantType },
              { l: 'Email', v: data.email },
              { l: 'Phone', v: data.phone },
              { l: 'DOB', v: data.dob },
              { l: 'Cannabis Card', v: data.ccCannabisCard },
              { l: 'Property Type', v: data.ccPropertyType },
              { l: 'Desired Property', v: data.ccDesiredProperty },
              { l: 'Move-In Date', v: data.ccMoveInDate },
              { l: 'Lease Term', v: data.ccLeaseTerm },
              { l: 'Current Address', v: `${data.street}, ${data.city}, ${data.state} ${data.zip}` },
              { l: 'Previous Landlord', v: `${data.ccPreviousLandlord} ${data.ccPreviousLandlordPhone}` },
              { l: 'Reason for Moving', v: data.ccReasonForMoving },
              { l: 'Pets', v: data.ccPets },
              { l: 'Vehicles', v: data.ccVehicles },
              { l: 'Emergency Contact', v: `${data.ccEmergencyName} (${data.ccEmergencyRelation}) — ${data.ccEmergencyPhone}` },
              { l: 'Medical Conditions', v: data.ccMedicalConditions },
              { l: 'Medications', v: data.ccMedications },
              { l: 'Allergies', v: data.allergies },
            ].map((r, i) => (
              <div key={i} className="flex justify-between px-5 py-3 text-sm">
                <span className="text-slate-500">{r.l}</span>
                <span className="font-bold text-slate-800 text-right max-w-[60%]">{r.v || '—'}</span>
              </div>
            ))}
          </div>
          {callerNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Agent Notes</p>
              <p className="text-sm text-amber-900">{callerNotes}</p>
            </div>
          )}
        </div>
      );
    }

    // ═══ SHARED FORM STEPS FOR ALL NEW TYPES ═══
    // Provider form steps
    if (intakeType === 'provider') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl text-sm text-teal-800 font-medium">
            <strong>Provider Onboarding:</strong> Register a physician or healthcare provider to the GGP network.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="Dr. Jane" required />
            <Field label="Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Smith" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="dr.smith@clinic.com" type="email" required />
            <Field label="Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="NPI Number" value={data.provNpi} onChange={(v: string) => set('provNpi', v)} placeholder="1234567890" required />
            <Field label="DEA Number" value={data.provDea} onChange={(v: string) => set('provDea', v)} placeholder="AB1234567" />
            <Field label="Medical License #" value={data.provLicenseNumber} onChange={(v: string) => set('provLicenseNumber', v)} placeholder="MD-12345" required />
          </div>
          <Select label="Specialty" value={data.provSpecialty} onChange={(v: string) => set('provSpecialty', v)} options={['Internal Medicine', 'Family Medicine', 'Pain Management', 'Psychiatry', 'Neurology', 'Oncology', 'Other']} required />
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <Field label="Practice Name" value={data.provPracticeName} onChange={(v: string) => set('provPracticeName', v)} placeholder="Green Health Clinic" required />
          <Field label="States Licensed In" value={data.provStatesLicensed} onChange={(v: string) => set('provStatesLicensed', v)} placeholder="Oklahoma, Texas, California" required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Offers Telehealth?" value={data.provTelehealth} onChange={(v: string) => set('provTelehealth', v)} options={['Yes', 'No']} />
            <Select label="Accepting New Patients?" value={data.provAcceptingPatients} onChange={(v: string) => set('provAcceptingPatients', v)} options={['Yes', 'No', 'Waitlist']} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Agent Notes</label>
            <textarea value={callerNotes} onChange={(e) => setCallerNotes(e.target.value)} rows={3} placeholder="Additional notes..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all resize-none" />
          </div>
        </div>
      );
    }
    // Legal Intake form steps
    if (intakeType === 'legal_intake') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-sm text-amber-800 font-medium">
            <strong>Legal Intake:</strong> Collect case details for attorney assignment. Do NOT provide legal advice.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Caller First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="John" required />
            <Field label="Caller Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Doe" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="john@email.com" type="email" required />
            <Field label="Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Case Type" value={data.legalCaseType} onChange={(v: string) => set('legalCaseType', v)} options={['Criminal Defense', 'Civil Matter', 'Compliance Issue', 'Licensing Dispute', 'Employment', 'Other']} required />
            <Field label="Incident Date" value={data.legalIncidentDate} onChange={(v: string) => set('legalIncidentDate', v)} type="date" />
          </div>
          <Field label="Charges / Allegations" value={data.legalCharges} onChange={(v: string) => set('legalCharges', v)} placeholder="Describe charges or allegations" />
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Court / Jurisdiction" value={data.legalCourtJurisdiction} onChange={(v: string) => set('legalCourtJurisdiction', v)} placeholder="Oklahoma County District Court" />
            <Field label="Case Number" value={data.legalCaseNumber} onChange={(v: string) => set('legalCaseNumber', v)} placeholder="CF-2026-1234" />
          </div>
          <Field label="Opposing Party" value={data.legalOpposingParty} onChange={(v: string) => set('legalOpposingParty', v)} placeholder="State of Oklahoma, etc." />
        </div>
      );
      if (step === 2) return (
        <div className="space-y-6">
          <Select label="Urgency Level" value={data.legalUrgency} onChange={(v: string) => set('legalUrgency', v)} options={['Standard', 'Urgent — Court Date Within 30 Days', 'Emergency — Immediate Attention Required']} required />
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Case Description *</label>
            <textarea value={data.legalDescription} onChange={(e) => set('legalDescription', e.target.value)} rows={4} placeholder="Describe the situation in detail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none" />
          </div>
        </div>
      );
    }
    // Attorney form steps
    if (intakeType === 'attorney') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 rounded-xl text-sm text-purple-800 font-medium">
            <strong>Attorney Onboarding:</strong> Register an attorney to the GGP Legal Network.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="Jane" required />
            <Field label="Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Esquire" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="jane@lawfirm.com" type="email" required />
            <Field label="Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Bar Number" value={data.attBarNumber} onChange={(v: string) => set('attBarNumber', v)} placeholder="12345" required />
            <Select label="Bar State" value={data.attBarState} onChange={(v: string) => set('attBarState', v)} options={US_STATES} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Firm Name" value={data.attFirmName} onChange={(v: string) => set('attFirmName', v)} placeholder="Smith & Associates" />
            <Field label="Years Experience" value={data.attYearsExperience} onChange={(v: string) => set('attYearsExperience', v)} placeholder="10" />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <Select label="Practice Areas" value={data.attPracticeAreas} onChange={(v: string) => set('attPracticeAreas', v)} options={['Cannabis Law', 'Criminal Defense', 'Business Law', 'Regulatory Compliance', 'Civil Litigation', 'Employment Law', 'Real Estate', 'Other']} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Rate Type" value={data.attRateType} onChange={(v: string) => set('attRateType', v)} options={['Hourly', 'Flat Fee', 'Contingency', 'Retainer']} />
            <Field label="Retainer Amount" value={data.attRetainer} onChange={(v: string) => set('attRetainer', v)} placeholder="$5,000" />
          </div>
          <Select label="Malpractice Insurance?" value={data.attMalpracticeInsurance} onChange={(v: string) => set('attMalpracticeInsurance', v)} options={['Yes', 'No']} />
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Agent Notes</label>
            <textarea value={callerNotes} onChange={(e) => setCallerNotes(e.target.value)} rows={3} placeholder="Additional notes..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none" />
          </div>
        </div>
      );
    }
    // Local Enforcement form steps
    if (intakeType === 'local_enforcement') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl text-sm text-orange-800 font-medium">
            <strong>⚠️ Law Enforcement Contact:</strong> All agency contacts are logged and escalated to compliance.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Agency Name" value={data.enfAgencyName} onChange={(v: string) => set('enfAgencyName', v)} placeholder="OKC Police Department" required />
            <Field label="Department" value={data.enfDepartment} onChange={(v: string) => set('enfDepartment', v)} placeholder="Narcotics Division" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Officer Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="Officer John" required />
            <Field label="Badge / ID #" value={data.enfBadgeId} onChange={(v: string) => set('enfBadgeId', v)} placeholder="Badge #1234" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rank / Title" value={data.enfRankTitle} onChange={(v: string) => set('enfRankTitle', v)} placeholder="Detective" />
            <Select label="Jurisdiction Level" value={data.enfJurisdictionLevel} onChange={(v: string) => set('enfJurisdictionLevel', v)} options={['City', 'County', 'Multi-Jurisdictional']} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="officer@pd.gov" type="email" />
            <Field label="Contact Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <Select label="Reason for Contact" value={data.enfReportingReason} onChange={(v: string) => set('enfReportingReason', v)} options={['Inquiry', 'Complaint', 'Investigation', 'Subpoena', 'Verification Request', 'Partnership', 'Other']} required />
          <Field label="Incident / Case Reference #" value={data.enfIncidentRef} onChange={(v: string) => set('enfIncidentRef', v)} placeholder="IR-2026-5678" />
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Description of Inquiry *</label>
            <textarea value={data.enfDescription} onChange={(e) => set('enfDescription', e.target.value)} rows={4} placeholder="Describe the nature of the contact..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none" />
          </div>
        </div>
      );
    }
    // State Agency form steps
    if (intakeType === 'state_agency') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl text-sm text-cyan-800 font-medium">
            <strong>⚠️ State Agency Contact:</strong> Logged and escalated to the Chief Compliance Officer.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Agency Name" value={data.stAgencyName} onChange={(v: string) => set('stAgencyName', v)} placeholder="OMMA" required />
            <Field label="Department" value={data.stDepartment} onChange={(v: string) => set('stDepartment', v)} placeholder="Licensing Division" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Official Name" value={data.stOfficialName} onChange={(v: string) => set('stOfficialName', v)} placeholder="Jane Smith" required />
            <Field label="Title" value={data.stOfficialTitle} onChange={(v: string) => set('stOfficialTitle', v)} placeholder="Deputy Director" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="official@state.gov" type="email" />
            <Field label="Contact Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" />
          </div>
          <Select label="State" value={data.state} onChange={(v: string) => set('state', v)} options={US_STATES} required />
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <Select label="Inquiry Type" value={data.stInquiryType} onChange={(v: string) => set('stInquiryType', v)} options={['Audit', 'Complaint', 'Licensing', 'Information Request', 'Compliance Review', 'Partnership', 'Other']} required />
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Description of Inquiry *</label>
            <textarea value={data.stDescription} onChange={(e) => set('stDescription', e.target.value)} rows={4} placeholder="Describe the agency's inquiry..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all resize-none" />
          </div>
        </div>
      );
    }
    // Federal Agency form steps
    if (intakeType === 'federal_agency') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-300 rounded-xl text-sm text-red-800 font-bold">
            🔴 <strong>Federal Agency Contact:</strong> IMMEDIATELY escalate to Founder and Chief Compliance Officer.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Agency" value={data.fedAgencyName} onChange={(v: string) => set('fedAgencyName', v)} options={['DEA', 'FDA', 'ATF', 'DOJ', 'FBI', 'IRS', 'USDA', 'HHS', 'Other']} required />
            <Field label="Department" value={data.fedDepartment} onChange={(v: string) => set('fedDepartment', v)} placeholder="Diversion Control" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Agent Name" value={data.fedAgentName} onChange={(v: string) => set('fedAgentName', v)} placeholder="Special Agent Smith" required />
            <Field label="Badge / ID #" value={data.fedAgentBadge} onChange={(v: string) => set('fedAgentBadge', v)} placeholder="SA-12345" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="agent@agency.gov" type="email" />
            <Field label="Contact Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <Field label="Case / Reference #" value={data.fedCaseRef} onChange={(v: string) => set('fedCaseRef', v)} placeholder="FED-2026-9876" />
          <Select label="Inquiry Type" value={data.fedInquiryType} onChange={(v: string) => set('fedInquiryType', v)} options={['Inquiry', 'Investigation', 'Subpoena', 'Audit', 'Information Request', 'Partnership', 'Other']} required />
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Description *</label>
            <textarea value={data.fedDescription} onChange={(e) => set('fedDescription', e.target.value)} rows={4} placeholder="Describe the federal agency's inquiry in detail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none" />
          </div>
        </div>
      );
    }
    // Government Office form steps
    if (intakeType === 'gov_office') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-slate-50 to-zinc-50 border border-slate-300 rounded-xl text-sm text-slate-800 font-medium">
            <strong>Government Office Contact:</strong> Escalated to Founder for direct follow-up.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Office Name" value={data.govOfficeName} onChange={(v: string) => set('govOfficeName', v)} placeholder="Governor's Office" required />
            <Select label="Jurisdiction Level" value={data.govJurisdictionLevel} onChange={(v: string) => set('govJurisdictionLevel', v)} options={['City', 'County', 'State', 'Federal']} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Elected Official / Contact" value={data.govElectedOfficial} onChange={(v: string) => set('govElectedOfficial', v)} placeholder="Rep. Jane Smith" required />
            <Field label="Title" value={data.govOfficeTitle} onChange={(v: string) => set('govOfficeTitle', v)} placeholder="State Representative" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="office@state.gov" type="email" />
            <Field label="Contact Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <Select label="Inquiry Type" value={data.govInquiryType} onChange={(v: string) => set('govInquiryType', v)} options={['Policy Inquiry', 'Licensing', 'Partnership', 'Constituent Referral', 'Information Request', 'Other']} required />
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Description *</label>
            <textarea value={data.govDescription} onChange={(e) => set('govDescription', e.target.value)} rows={4} placeholder="Describe the inquiry..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all resize-none" />
          </div>
        </div>
      );
    }
    // Advocate form steps
    if (intakeType === 'advocate') {
      if (step === 0) return (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl text-sm text-rose-800 font-medium">
            <strong>Advocate Onboarding:</strong> Register an advocacy or research organization.
          </div>
          <Field label="Organization Name" value={data.advOrgName} onChange={(v: string) => set('advOrgName', v)} placeholder="Cannabis Patients Alliance" required />
          <Select label="Organization Type" value={data.advOrgType} onChange={(v: string) => set('advOrgType', v)} options={['Non-Profit', 'Research Institution', 'Community Organization', 'Policy Group', 'Trade Association', 'Other']} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Contact First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="Maria" required />
            <Field label="Contact Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Garcia" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" value={data.email} onChange={(v: string) => set('email', v)} placeholder="info@alliance.org" type="email" required />
            <Field label="Phone" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-6">
          <Select label="Focus Area" value={data.advFocusArea} onChange={(v: string) => set('advFocusArea', v)} options={['Patient Rights', 'Social Equity', 'Policy Reform', 'Research', 'Community Health', 'Veterans', 'Other']} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Website" value={data.advWebsite} onChange={(v: string) => set('advWebsite', v)} placeholder="https://alliance.org" />
            <Field label="Approximate Member Count" value={data.advMemberCount} onChange={(v: string) => set('advMemberCount', v)} placeholder="500" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Organization Mission / Description</label>
            <textarea value={data.advDescription} onChange={(e) => set('advDescription', e.target.value)} rows={4} placeholder="Describe your organization's mission and how you'd like to partner with GGP..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none" />
          </div>
        </div>
      );
    }

    // ═══ SHARED: Products & Services step (all types) ═══
    const currentStepName = steps[step] || '';
    if (currentStepName.includes('Products')) return (
      <div className="space-y-6">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Select Service Tier</div>
        <div className="grid grid-cols-2 gap-3">
          {TIER_OPTIONS.map(t => (
            <button key={t.id} onClick={() => set('selectedTier', t.id)}
              className={cn("p-4 rounded-xl border-2 text-left transition-all", data.selectedTier === t.id ? "border-emerald-500 bg-emerald-50 shadow-lg" : "border-slate-200 bg-white hover:border-slate-300")}
            >
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="text-sm font-black text-slate-800">{t.label}</div>
              <div className="text-xs font-bold text-emerald-600 mt-1">{t.price}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {['Monthly', 'Quarterly', 'Annual'].map(b => (
            <button key={b} onClick={() => set('selectedBilling', b)}
              className={cn("py-3 rounded-xl border-2 text-sm font-bold transition-all", data.selectedBilling === b ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:border-slate-300")}
            >{b}</button>
          ))}
        </div>
      </div>
    );

    // ═══ SHARED: Generic payment step (for new types that reuse business payment) ═══
    if (currentStepName.includes('Payment') && !isPatient && !isCannaCribs && intakeType !== 'business_license') return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-slate-50 border-slate-200 text-slate-800 mb-4">
          <DollarSign size={14} className="shrink-0 mt-0.5" />
          <span>Post a one-time payment directly to the accounting ledger.</span>
        </div>
        {paymentPosted ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"><CircleCheck size={32} className="text-emerald-600" /></div>
            <h3 className="text-lg font-black text-slate-800">Payment Posted!</h3>
            <p className="text-sm text-slate-500 font-medium mb-2">Entry added to Accounting Ledger.</p>
            <button onClick={(e) => { e.stopPropagation(); handleCopyReceiptText(); }}
              className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 shadow-sm", copiedReceipt ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50")}
            >{copiedReceipt ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Receipt</>}</button>
          </div>
        ) : (
          <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Amount *</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} placeholder="99.00" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Date Received</label>
                <input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Type</label>
                <select value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                  {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Payment Method</label>
                <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm">
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handlePostPayment} disabled={submitting} className="w-full py-3.5 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-4 bg-emerald-600 hover:bg-emerald-700">
              <DollarSign size={16} /> Post Payment to Ledger
            </button>
          </div>
        )}
      </div>
    );

    // ═══ SHARED: Review & Submit step (generic for new types) ═══
    if (currentStepName.includes('Review')) {
      const meta = intakeType ? INTAKE_META[intakeType] : null;
      const reviewRows: { l: string; v: string }[] = [];
      if (data.firstName) reviewRows.push({ l: 'Name', v: `${data.firstName} ${data.lastName}` });
      if (data.email) reviewRows.push({ l: 'Email', v: data.email });
      if (data.phone) reviewRows.push({ l: 'Phone', v: data.phone });
      if (data.state) reviewRows.push({ l: 'State', v: data.state });
      // Type-specific fields
      if (intakeType === 'provider') { reviewRows.push({ l: 'NPI', v: data.provNpi }, { l: 'Practice', v: data.provPracticeName }, { l: 'Specialty', v: data.provSpecialty }, { l: 'Telehealth', v: data.provTelehealth }); }
      if (intakeType === 'legal_intake') { reviewRows.push({ l: 'Case Type', v: data.legalCaseType }, { l: 'Urgency', v: data.legalUrgency }, { l: 'Court', v: data.legalCourtJurisdiction }); }
      if (intakeType === 'attorney') { reviewRows.push({ l: 'Bar #', v: data.attBarNumber }, { l: 'Bar State', v: data.attBarState }, { l: 'Firm', v: data.attFirmName }, { l: 'Practice', v: data.attPracticeAreas }); }
      if (intakeType === 'local_enforcement') { reviewRows.push({ l: 'Agency', v: data.enfAgencyName }, { l: 'Badge', v: data.enfBadgeId }, { l: 'Reason', v: data.enfReportingReason }); }
      if (intakeType === 'state_agency') { reviewRows.push({ l: 'Agency', v: data.stAgencyName }, { l: 'Official', v: data.stOfficialName }, { l: 'Inquiry', v: data.stInquiryType }); }
      if (intakeType === 'federal_agency') { reviewRows.push({ l: 'Agency', v: data.fedAgencyName }, { l: 'Agent', v: data.fedAgentName }, { l: 'Case Ref', v: data.fedCaseRef }, { l: 'Inquiry', v: data.fedInquiryType }); }
      if (intakeType === 'gov_office') { reviewRows.push({ l: 'Office', v: data.govOfficeName }, { l: 'Official', v: data.govElectedOfficial }, { l: 'Inquiry', v: data.govInquiryType }); }
      if (intakeType === 'advocate') { reviewRows.push({ l: 'Organization', v: data.advOrgName }, { l: 'Type', v: data.advOrgType }, { l: 'Focus', v: data.advFocusArea }); }
      if (data.selectedTier) reviewRows.push({ l: 'Service Tier', v: TIER_OPTIONS.find(t => t.id === data.selectedTier)?.label || data.selectedTier });
      if (data.selectedBilling) reviewRows.push({ l: 'Billing Cycle', v: data.selectedBilling });
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-slate-50 border-slate-200 text-slate-800">
            <Shield size={14} className="shrink-0 mt-0.5" />
            <span>Review all information with the caller before submitting.</span>
          </div>
          <h3 className="font-black text-slate-900 flex items-center gap-2"><ClipboardList size={18} /> {meta?.label || 'Application'} Summary</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-200 overflow-hidden">
            {reviewRows.map((r, i) => (
              <div key={i} className="flex justify-between px-5 py-3 text-sm">
                <span className="text-slate-500">{r.l}</span>
                <span className="font-bold text-slate-800 text-right max-w-[60%]">{r.v || '—'}</span>
              </div>
            ))}
          </div>
          {callerNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Agent Notes</p>
              <p className="text-sm text-amber-900">{callerNotes}</p>
            </div>
          )}
        </div>
      );
    }
  };

  const canNext = () => {
    if (isPatient) {
      if (step === 0) return data.firstName && data.lastName && data.email && data.phone && data.ssn && data.street && data.city && data.state && data.zip && (mailingSame || data.mailingAddress);
      if (step === 1) return true;
      if (step === 2) return scheduledAppt;
      if (step === 3) return completedPortal;
    } else if (isCannaCribs) {
      if (step === 0) return data.firstName && data.lastName && data.email && data.phone;
      if (step === 1) return data.street && data.city && data.state && data.zip;
      if (step === 2) return data.ccEmergencyName && data.ccEmergencyPhone;
      if (step === 3) return true;
    } else if (intakeType === 'business_license') {
      if (step === 0) return data.state && data.businessName && data.licenseType && data.entityType && data.businessType;
      if (step === 1) return data.street && data.city && data.zip && data.ppocName && data.ppocPhone && data.ppocEmail;
      if (step === 2) return data.firstName && data.lastName && data.email && data.phone && data.ownerShares && data.einNumber;
      if (step === 3) return true;
    } else if (intakeType === 'provider') {
      if (step === 0) return data.firstName && data.lastName && data.email && data.phone && data.provNpi && data.provLicenseNumber;
      if (step === 1) return data.provPracticeName && data.provStatesLicensed;
    } else if (intakeType === 'legal_intake') {
      if (step === 0) return data.firstName && data.lastName && data.email && data.phone && data.legalCaseType;
      if (step === 1) return true;
      if (step === 2) return data.legalUrgency && data.legalDescription;
    } else if (intakeType === 'attorney') {
      if (step === 0) return data.firstName && data.lastName && data.email && data.phone && data.attBarNumber;
      if (step === 1) return data.attPracticeAreas;
    } else if (intakeType === 'local_enforcement') {
      if (step === 0) return data.enfAgencyName && data.firstName;
      if (step === 1) return data.enfReportingReason && data.enfDescription;
    } else if (intakeType === 'state_agency') {
      if (step === 0) return data.stAgencyName && data.stOfficialName;
      if (step === 1) return data.stInquiryType && data.stDescription;
    } else if (intakeType === 'federal_agency') {
      if (step === 0) return data.fedAgencyName && data.fedAgentName;
      if (step === 1) return data.fedInquiryType && data.fedDescription;
    } else if (intakeType === 'gov_office') {
      if (step === 0) return data.govOfficeName && data.govElectedOfficial;
      if (step === 1) return data.govInquiryType && data.govDescription;
    } else if (intakeType === 'advocate') {
      if (step === 0) return data.advOrgName && data.firstName && data.lastName && data.email;
      if (step === 1) return data.advFocusArea;
    }
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Script / Guide */}
        <div className="col-span-1">
          <div className="bg-[#1a4731] text-white rounded-3xl p-6 shadow-xl sticky top-6 border border-emerald-800">
            <h3 className="text-lg font-black flex items-center gap-2 mb-6 text-emerald-50 pb-4 border-b border-emerald-800/50">
              <PhoneIncoming size={20} className="text-emerald-400" /> Live Call Script
            </h3>
            {renderScript()}
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="col-span-2 space-y-6">
          {/* Header */}
          {(() => {
            const meta = intakeType ? INTAKE_META[intakeType] : null;
            const accentBg: Record<string, string> = { emerald: 'bg-emerald-600 hover:bg-emerald-700', indigo: 'bg-indigo-600 hover:bg-indigo-700', green: 'bg-green-600 hover:bg-green-700', teal: 'bg-teal-600 hover:bg-teal-700', amber: 'bg-amber-600 hover:bg-amber-700', purple: 'bg-purple-600 hover:bg-purple-700', orange: 'bg-orange-600 hover:bg-orange-700', cyan: 'bg-cyan-600 hover:bg-cyan-700', red: 'bg-red-600 hover:bg-red-700', slate: 'bg-slate-600 hover:bg-slate-700', rose: 'bg-rose-600 hover:bg-rose-700' };
            const accentProgress: Record<string, string> = { emerald: 'bg-emerald-500', indigo: 'bg-indigo-500', green: 'bg-green-500', teal: 'bg-teal-500', amber: 'bg-amber-500', purple: 'bg-purple-500', orange: 'bg-orange-500', cyan: 'bg-cyan-500', red: 'bg-red-500', slate: 'bg-slate-500', rose: 'bg-rose-500' };
            const accent = meta?.accent || 'emerald';
            return (
              <div className={cn("rounded-2xl p-6 text-white relative overflow-hidden shadow-lg bg-gradient-to-r", meta?.gradient || 'from-emerald-800 to-teal-700')}>
                <div className="absolute top-0 right-0 p-4 opacity-10"><Phone size={80} /></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black">{meta?.label || 'Intake Form'}</h2>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">Step {step + 1} of {steps.length} — {steps[step]}</p>
                  </div>
                  <button onClick={reset} className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            );
          })()}

          {/* Progress */}
          {(() => {
            const meta = intakeType ? INTAKE_META[intakeType] : null;
            const accentProgress: Record<string, string> = { emerald: 'bg-emerald-500', indigo: 'bg-indigo-500', green: 'bg-green-500', teal: 'bg-teal-500', amber: 'bg-amber-500', purple: 'bg-purple-500', orange: 'bg-orange-500', cyan: 'bg-cyan-500', red: 'bg-red-500', slate: 'bg-slate-500', rose: 'bg-rose-500' };
            const progressColor = accentProgress[meta?.accent || 'emerald'] || 'bg-emerald-500';
            return (
              <div className="flex gap-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex-1">
                    <div className={cn("h-1.5 rounded-full transition-all", i <= step ? progressColor : "bg-slate-200")} />
                    <p className={cn("text-[9px] font-bold mt-1.5 uppercase tracking-widest", i <= step ? "text-slate-700" : "text-slate-400")}>{s}</p>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Form Content */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          {(() => {
            const meta = intakeType ? INTAKE_META[intakeType] : null;
            const accentBg: Record<string, string> = { emerald: 'bg-emerald-600 hover:bg-emerald-700', indigo: 'bg-indigo-600 hover:bg-indigo-700', green: 'bg-green-600 hover:bg-green-700', teal: 'bg-teal-600 hover:bg-teal-700', amber: 'bg-amber-600 hover:bg-amber-700', purple: 'bg-purple-600 hover:bg-purple-700', orange: 'bg-orange-600 hover:bg-orange-700', cyan: 'bg-cyan-600 hover:bg-cyan-700', red: 'bg-red-600 hover:bg-red-700', slate: 'bg-slate-600 hover:bg-slate-700', rose: 'bg-rose-600 hover:bg-rose-700' };
            const btnColor = accentBg[meta?.accent || 'emerald'] || 'bg-emerald-600 hover:bg-emerald-700';
            return (
              <div className="flex justify-between gap-4">
                <button onClick={() => step === 0 ? reset() : setStep(step - 1)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                  {step === 0 ? '← Back to Type' : '← Previous'}
                </button>
                {step < steps.length - 1 ? (
                  <div className="flex gap-3">
                    {step === 0 && intakeType && (
                      <button onClick={handleQuickSaveLead} disabled={submitting || quickSaved}
                        className={cn("px-5 py-3 font-bold rounded-xl border transition-all flex items-center gap-2 text-sm",
                          quickSaved
                            ? "bg-emerald-50 text-emerald-600 border-emerald-300 cursor-default"
                            : "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100"
                        )}>
                        {quickSaved ? <><Check size={14} /> Lead Saved</> : submitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><UserPlus size={14} /> Quick Save as Lead</>}
                      </button>
                    )}
                    {step > 0 && (
                      <button onClick={handleSaveForLater} disabled={submitting}
                        className="px-6 py-3 bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors">
                        {submitting ? 'Saving...' : 'Save for Later'}
                      </button>
                    )}
                    <button onClick={() => canNext() ? setStep(step + 1) : alert('Please fill in all required fields or confirm steps to proceed.')}
                      className={cn("px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-all", btnColor)}>
                      Next Step →
                    </button>
                  </div>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting}
                    className={cn("px-8 py-3 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2 uppercase tracking-widest text-sm", submitting ? "opacity-60" : "", btnColor)}>
                    {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><CircleCheck size={16} /> Create Account & Submit</>}
                  </button>
                )}
              </div>
            );
          })()}
          </div>
        </div>
      </div>
  );
};
