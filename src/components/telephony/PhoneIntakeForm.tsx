import React, { useState } from 'react';
import { Phone, User, Building2, HeartPulse, FileText, CircleCheck, AlertCircle, Shield, MapPin, Mail, Calendar, CreditCard, Loader2, UserPlus, ExternalLink, PhoneIncoming } from 'lucide-react';
import { cn } from '../../lib/utils';
import { turso } from '../../lib/turso';

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
  businessType: string;
  einNumber: string;
  licenseType: string;
  entityType: string;
  ownerCount: string;
}

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const BIZ_TYPES = ['Dispensary','Cultivator / Grower','Processor','Transporter','Testing Laboratory','Vertically Integrated'];
const ENTITY_TYPES = ['LLC','Corporation','Sole Proprietor','Partnership','Non-Profit'];
const CONDITIONS = ['Chronic Pain','PTSD','Cancer','Epilepsy / Seizures','Glaucoma','HIV/AIDS','Crohn\'s Disease','Multiple Sclerosis','Nausea','Severe or intractable muscle spasms','Terminal Illness','Other'];

const STEPS_PATIENT = ['Intake Questionnaire', 'Schedule Doctor Visit', 'State Portal Setup', 'Review & Submit'];
const STEPS_BUSINESS = ['Owner Info', 'Address', 'Business Details', 'Review & Submit'];

const empty: IntakeData = { firstName:'',lastName:'',email:'',phone:'',dob:'',ssn:'',street:'',city:'',state:'Oklahoma',zip:'', isAdult:'Yes', mailingAddress:'', appointmentType:'Phone', appType:'New MMJ Card', hasPortalAccount:'No', hasPcp:'No', pcpInfo:'', conditions:[], allergies:'No', lastDoctorVisit:'', insuranceName:'', optInMessaging:'Yes', businessName:'',businessType:'Dispensary',einNumber:'',licenseType:'New Application',entityType:'LLC',ownerCount:'1' };

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
      // 1. Log account creation
      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [
        'log-' + Math.random().toString(36).substr(2, 9),
        'PHONE_INTAKE_ACCOUNT_CREATE',
        'OPS_Agent',
        JSON.stringify({ accountId, name: data.firstName + ' ' + data.lastName, email: data.email, phone: data.phone, type: intakeType, state: data.state })
      ]});
      // 2. Log application submission
      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [
        'log-' + Math.random().toString(36).substr(2, 9),
        'PHONE_INTAKE_APPLICATION',
        'OPS_Agent',
        JSON.stringify({
          appId, accountId, intakeType,
          applicant: data.firstName + ' ' + data.lastName,
          ...(intakeType === 'patient_card' ? { conditions: data.conditions.join(', '), appType: data.appType } : { businessName: data.businessName, businessType: data.businessType, ein: data.einNumber }),
          state: data.state,
          callerNotes,
          submittedVia: 'Phone Intake — OPS Call Center'
        })
      ]});
      setCallerId(accountId);
      setSubmitted(true);
    } catch (e) { console.error(e); alert('Submission error. Check console.'); }
    setSubmitting(false);
  };

  const reset = () => { setIntakeType(null); setStep(0); setData({...empty}); setSubmitted(false); setCallerId(''); setCallerNotes(''); setScheduledAppt(false); setCompletedPortal(false); };

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
          <p><strong>Agent:</strong> "Perfect. Now we need to schedule your telehealth visit with the doctor."</p>
          <p><strong>Agent:</strong> "I'm opening the calendar now. Do you have a preferred day or time?"</p>
          <div className="mt-4 bg-[#0f291c] p-4 rounded-xl border border-emerald-800/50 shadow-inner">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Action Required</p>
            <p className="text-xs text-emerald-100/70">Click 'Open Acuity Scheduling' and complete the booking for the patient. Check the box once confirmed.</p>
          </div>
        </div>
      );
      if (step === 2) return (
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
      if (step === 3) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Let me read this back to make sure we have everything correct..."</p>
          <p className="text-xs italic text-emerald-200">Verify Name, DOB, Address, and Appointment Time.</p>
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
          <p><strong>Agent:</strong> "I can help with your business licensing. Let's start with your information as the primary owner."</p>
          <p><strong>Agent:</strong> "May I have your first and last name, email, and best contact number?"</p>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What is the physical street address for the business facility?"</p>
          <p className="text-xs italic text-emerald-200">Ensure the ZIP code matches the city.</p>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "What is the legal name of the business entity?"</p>
          <p><strong>Agent:</strong> "And what type of license are you applying for? (e.g. Dispensary, Grower, Processor)"</p>
          <p><strong>Agent:</strong> "Do you have your EIN ready?"</p>
        </div>
      );
      if (step === 3) return (
        <div className="space-y-4 text-sm text-emerald-50/90 leading-relaxed">
          <p><strong>Agent:</strong> "Let's review the details to ensure accuracy before I submit this to our compliance team."</p>
          <p className="text-xs italic text-emerald-200">Verify Business Name, License Type, and Contact Info.</p>
          <p><strong>Agent:</strong> "Our team will review this and reach out shortly. Thank you!"</p>
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
        <div className="space-y-6 flex flex-col items-center justify-center text-center py-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Calendar size={36} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Schedule Telehealth Appointment</h3>
          <p className="text-slate-500 max-w-md">The patient's initial intake is recorded. Next, proceed to the Acuity Scheduling system to book their Doctor visit.</p>
          
          <a href="https://www.renewoklahomacard.com/booking-calendar/renew-oklahoma-card?referral=service_list_widget" target="_blank" rel="noreferrer" 
             className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 w-full max-w-sm mt-4">
            <ExternalLink size={20} /> Open Acuity Scheduling
          </a>

          <div className="mt-8 pt-6 border-t border-slate-200 w-full flex justify-center">
            <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-200 p-4 rounded-xl hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={scheduledAppt} onChange={(e) => setScheduledAppt(e.target.checked)} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
              <span className="font-bold text-slate-700">I have completed scheduling the appointment.</span>
            </label>
          </div>
        </div>
      );
      if (step === 2) return (
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

          <div className="mt-8 pt-6 border-t border-slate-200 w-full flex justify-center">
            <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border border-slate-200 p-4 rounded-xl hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={completedPortal} onChange={(e) => setCompletedPortal(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
              <span className="font-bold text-slate-700">I have successfully registered the patient's portal account.</span>
            </label>
          </div>
        </div>
      );
      if (step === 3) {
        const rows = [
          { l: 'Name', v: data.firstName + ' ' + data.lastName },
          { l: 'Email', v: data.email },
          { l: 'Phone', v: data.phone },
          { l: 'DOB', v: data.dob },
          { l: 'Jurisdiction', v: data.state },
          { l: 'Physical Address', v: `${data.street}, ${data.city}, ${data.state} ${data.zip}` },
          { l: 'Mailing Address', v: data.mailingAddress },
          { l: 'App Type', v: data.appType },
          { l: 'Conditions', v: data.conditions.join(', ') || 'None selected' },
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
            <Field label="Owner First Name" value={data.firstName} onChange={(v: string) => set('firstName', v)} placeholder="John" required />
            <Field label="Owner Last Name" value={data.lastName} onChange={(v: string) => set('lastName', v)} placeholder="Doe" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email Address" value={data.email} onChange={(v: string) => set('email', v)} placeholder="john@email.com" type="email" required />
            <Field label="Phone Number" value={data.phone} onChange={(v: string) => set('phone', v)} placeholder="(555) 123-4567" required />
          </div>
        </div>
      );
      if (step === 1) return (
        <div className="space-y-4">
          <Field label="Business Street Address" value={data.street} onChange={(v: string) => set('street', v)} placeholder="123 Main St" required />
          <div className="grid grid-cols-3 gap-4">
            <Field label="City" value={data.city} onChange={(v: string) => set('city', v)} placeholder="Oklahoma City" required />
            <Select label="State" value={data.state} onChange={(v: string) => set('state', v)} options={US_STATES} required />
            <Field label="ZIP Code" value={data.zip} onChange={(v: string) => set('zip', v)} placeholder="73102" required />
          </div>
        </div>
      );
      if (step === 2) return (
        <div className="space-y-4">
          <Field label="Business Legal Name" value={data.businessName} onChange={(v: string) => set('businessName', v)} placeholder="Green Leaf Dispensary LLC" required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Business Type" value={data.businessType} onChange={(v: string) => set('businessType', v)} options={BIZ_TYPES} required />
            <Select label="Entity Type" value={data.entityType} onChange={(v: string) => set('entityType', v)} options={ENTITY_TYPES} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="EIN / Tax ID" value={data.einNumber} onChange={(v: string) => set('einNumber', v)} placeholder="12-3456789" required />
            <Field label="Number of Owners" value={data.ownerCount} onChange={(v: string) => set('ownerCount', v)} placeholder="1" />
          </div>
          <Select label="License Type" value={data.licenseType} onChange={(v: string) => set('licenseType', v)} options={['New Application','Renewal','Transfer of Ownership','Change of Location']} />
          <div>
            <label className="text-xs font-bold text-slate-600 mb-1.5 block">Agent Notes</label>
            <textarea value={callerNotes} onChange={(e) => setCallerNotes(e.target.value)} rows={3} placeholder="Additional notes from the call..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
          </div>
        </div>
      );
      if (step === 3) {
        const rows = [
          { l: 'Owner Name', v: data.firstName + ' ' + data.lastName },
          { l: 'Email', v: data.email },
          { l: 'Phone', v: data.phone },
          { l: 'Business Name', v: data.businessName },
          { l: 'Business Type', v: data.businessType },
          { l: 'Entity Type', v: data.entityType },
          { l: 'EIN', v: data.einNumber },
          { l: 'License Type', v: data.licenseType },
        ];
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border text-xs font-bold flex items-start gap-2 bg-indigo-50 border-indigo-200 text-indigo-800">
              <Shield size={14} className="shrink-0 mt-0.5" />
              <span>Review all information with the caller before submitting. This will create their account and submit the application.</span>
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
      if (step === 1) return scheduledAppt;
      if (step === 2) return completedPortal;
    } else {
      if (step === 0) return data.firstName && data.lastName && data.email && data.phone;
      if (step === 1) return data.street && data.city && data.zip;
      if (step === 2) return data.businessName && data.einNumber;
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
              <button onClick={() => canNext() ? setStep(step + 1) : alert(isPatient && step === 1 ? 'Please check the box confirming you scheduled the appointment.' : isPatient && step === 2 ? 'Please check the box confirming you set up the portal.' : 'Please fill in all required fields.')}
                className={cn("px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-all", isPatient ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700")}>
                Next Step →
              </button>
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
