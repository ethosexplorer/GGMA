import React, { useState } from 'react';
import { Phone, User, Building2, HeartPulse, FileText, CircleCheck, AlertCircle, Shield, MapPin, Mail, Calendar, CreditCard, Loader2, UserPlus, ExternalLink, PhoneIncoming, DollarSign, ClipboardList, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { captureContact } from '../../lib/contactCapture';

type IntakeType = 'patient_card' | 'business_license';

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
}

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const BIZ_TYPES = ['Dispensary','Cultivator / Grower','Processor','Transporter','Testing Laboratory','Vertically Integrated'];
const ENTITY_TYPES = ['LLC','Corporation','Sole Proprietor','Partnership','Non-Profit'];
const CONDITIONS = ['Chronic Pain','PTSD','Cancer','Epilepsy / Seizures','Glaucoma','HIV/AIDS','Crohn\'s Disease','Multiple Sclerosis','Nausea','Severe or intractable muscle spasms','Terminal Illness','Other'];

const PAYMENT_TYPES = ['Processing Fee', 'Application Fee', 'Consultation Fee', 'Service Fee', 'Filing Fee', 'Late Fee', 'Renewal Fee', 'Licensing Fee', 'Document Fee', 'Other'];
const PAYMENT_METHODS = ['Chime', 'Cash App', 'Zelle', 'Venmo', 'Cash', 'Check', 'Wire Transfer', 'Credit Card', 'Bank Transfer', 'Other'];

const STEPS_PATIENT = ['Intake Questionnaire', 'Payment Info', 'Schedule Doctor Visit', 'State Portal Setup', 'Review & Submit'];
const STEPS_BUSINESS = ['Entity & Type', 'Facility & Contact', 'Primary Owner Info', 'Payment Info', 'Review & Submit'];

const empty: IntakeData = { firstName:'',lastName:'',email:'',phone:'',dob:'',ssn:'',street:'',city:'',state:'Oklahoma',zip:'', isAdult:'Yes', mailingAddress:'', appointmentType:'Phone', appType:'New MMJ Card', hasPortalAccount:'No', hasPcp:'No', pcpInfo:'', conditions:[], allergies:'No', lastDoctorVisit:'', insuranceName:'', optInMessaging:'Yes', businessName:'',tradeName:'',businessType:'Dispensary',einNumber:'',licenseType:'New Application',entityType:'LLC',ownerCount:'1', ppocName:'', ppocPhone:'', ppocEmail:'', ownerShares:'', paymentPreference:'' };

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

  const steps = intakeType === 'patient_card' ? STEPS_PATIENT : STEPS_BUSINESS;

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

  const reset = () => { setIntakeType(null); setStep(0); setData({...empty}); setSubmitted(false); setCallerId(''); setCallerNotes(''); setScheduledAppt(false); setCompletedPortal(false); setPortalUsername(''); setPortalPassword(''); setPaymentPosted(false); setPaymentForm({ amount: '', type: 'Processing Fee', method: 'Chime', notes: '', date: new Date().toISOString().split('T')[0] }); };

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
    } else {
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
      if (step === 3) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Our processing fee is $249 without a subscription tier, plus the standard state application fees."</p>
          <p><strong>Agent:</strong> "How will your business be handling these fees today? We accept Chime, CashApp, Venmo, PayPal, or we can send a formal Invoice."</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
            <p className="text-xs text-emerald-100/70">Select the payment option so accounting can dispatch the request. (You can skip and 'Save for Later' if they need time).</p>
          </div>
        </div>
      );
      if (step === 4) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Let's review the details to ensure accuracy..."</p>
          <p className="text-xs italic text-emerald-200">Verify Business Name, Address, Owner Email, and Payment preference.</p>
          <p><strong>Agent:</strong> "I will submit this into our GGP-OS portal. You will receive an email shortly with a secure link to upload your required documents (ID, Background Check, Certificate of Compliance)."</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Final Step</p>
            <p className="text-xs text-emerald-100/70">Submit the form to generate the business account and send the secure upload link.</p>
          </div>
        </div>
      );
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => setIntakeType('patient_card')} className="group bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-8 text-left transition-all hover:shadow-xl hover:shadow-emerald-100">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 group-hover:bg-emerald-100 transition-colors">
            <HeartPulse size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Patient Medical Card</h3>
          <p className="text-sm text-slate-500">New patient card, renewal, or caregiver registration for state medical marijuana program.</p>
          <div className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Start Patient Intake →</div>
        </button>
        <button onClick={() => setIntakeType('business_license')} className="group bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-8 text-left transition-all hover:shadow-xl hover:shadow-indigo-100">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-5 group-hover:bg-indigo-100 transition-colors">
            <Building2 size={28} />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2">Business License</h3>
          <p className="text-sm text-slate-500">Dispensary, cultivator, processor, transporter, or testing lab license application.</p>
          <div className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest">Start Business Intake →</div>
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
        <div className="flex justify-between text-sm"><span className="text-slate-500">Type</span><span className="font-bold text-slate-800">{intakeType === 'patient_card' ? 'Patient Medical Card' : 'Business License'}</span></div>
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
          <Field label="Mailing Address (if different)" value={data.mailingAddress} onChange={(v: string) => set('mailingAddress', v)} placeholder="Same as above, or enter new address" required />
          
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
    } else {
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
  };

  const canNext = () => {
    if (isPatient) {
      if (step === 0) return data.firstName && data.lastName && data.email && data.phone && data.ssn && data.street && data.city && data.state && data.zip && data.mailingAddress;
      if (step === 1) return true; // Payment is optional, allows skipping
      if (step === 2) return scheduledAppt;
      if (step === 3) return completedPortal;
    } else {
      if (step === 0) return data.state && data.businessName && data.licenseType && data.entityType && data.businessType;
      if (step === 1) return data.street && data.city && data.zip && data.ppocName && data.ppocPhone && data.ppocEmail;
      if (step === 2) return data.firstName && data.lastName && data.email && data.phone && data.ownerShares && data.einNumber;
      if (step === 3) return true; // Payment is optional, allows skipping
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
          <div className={cn("rounded-2xl p-6 text-white relative overflow-hidden shadow-lg", isPatient ? "bg-gradient-to-r from-emerald-800 to-teal-700" : "bg-gradient-to-r from-indigo-800 to-violet-700")}>
            <div className="absolute top-0 right-0 p-4 opacity-10">{isPatient ? <HeartPulse size={80} /> : <Building2 size={80} />}</div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">{isPatient ? 'Patient Medical Card Intake' : 'Business License Intake'}</h2>
                <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", isPatient ? "text-emerald-200" : "text-indigo-200")}>Step {step + 1} of {steps.length} — {steps[step]}</p>
              </div>
              <button onClick={reset} className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest">Cancel</button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex-1">
                <div className={cn("h-1.5 rounded-full transition-all", i <= step ? (isPatient ? "bg-emerald-500" : "bg-indigo-500") : "bg-slate-200")} />
                <p className={cn("text-[9px] font-bold mt-1.5 uppercase tracking-widest", i <= step ? "text-slate-700" : "text-slate-400")}>{s}</p>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <button onClick={() => step === 0 ? reset() : setStep(step - 1)}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              {step === 0 ? '← Back to Type' : '← Previous'}
            </button>
            {step < steps.length - 1 ? (
              <div className="flex gap-3">
                {step > 0 && (
                  <button onClick={handleSaveForLater} disabled={submitting}
                    className="px-6 py-3 bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors">
                    {submitting ? 'Saving...' : 'Save for Later'}
                  </button>
                )}
                <button onClick={() => canNext() ? setStep(step + 1) : alert('Please fill in all required fields or confirm steps to proceed.')}
                  className={cn("px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-all", isPatient ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700")}>
                  Next Step →
                </button>
              </div>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className={cn("px-8 py-3 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2 uppercase tracking-widest text-sm", submitting ? "opacity-60" : "", isPatient ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700")}>
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><CircleCheck size={16} /> Create Account & Submit</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
