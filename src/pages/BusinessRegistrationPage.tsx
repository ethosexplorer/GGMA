import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertCircle, Upload, Plus, Trash2, CheckCircle, FileText, X, Info, CircleCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const BUSINESS_STEPS = [
  'Pre-Registration',
  'General Information',
  'Owners & Officers',
  'Location Information',
  'Primary Contact (PPOC)',
  'Questions & Verifications',
  'Document Uploads',
  'Bond Requirement',
  'Review & Submit'
];

const LICENSE_TYPES = [
  'Dispensary', 'Grower', 'Processor', 'Laboratory',
  'Transporter', 'Researcher', 'Education', 'Waste Disposal'
];

const BUSINESS_STRUCTURES = [
  'Sole Proprietor (Individual Owner)',
  'Limited Liability Company (LLC)',
  'Corporation (Inc. or Corp.)',
  'Limited Partnerships',
  'Limited Liability Partnerships',
];

interface OwnerData {
  id: string;
  name: string;
  phone: string;
  email: string;
  idType: string;
  idNumber: string;
  idExpiry: string;
  dob: string;
  entityAffiliation: string;
  shares: string;
  relationship: string;
  residence: string;
  mailing: string;
}

export default function BusinessRegistrationPage({ onNavigate, onComplete }: { onNavigate: (view: any) => void, onComplete?: (email: string, pass: string, role: string, payload: any) => Promise<void> }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Forms State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    email: '',
    password: '',
    entityName: '',
    licenseType: '',
    // Step 2
    tradeName: '',
    phone: '',
    businessStructure: '',
    operatingHours: {
      Mon: { active: true, open: '09:00', close: '18:00' },
      Tue: { active: true, open: '09:00', close: '18:00' },
      Wed: { active: true, open: '09:00', close: '18:00' },
      Thu: { active: true, open: '09:00', close: '18:00' },
      Fri: { active: true, open: '09:00', close: '18:00' },
      Sat: { active: false, open: '10:00', close: '16:00' },
      Sun: { active: false, open: '10:00', close: '16:00' },
    },
    // Step 4
    physicalAddress: '',
    gpsCoordinates: '',
    mailingSameAsPhysical: true,
    locationMailing: '',
    // Step 5
    ppocName: '',
    ppocTitle: '',
    ppocPhone: '',
    ppocEmail: '',
    ppocAddress: '',
    // Step 6 (Attestations)
    attest1: false, attest2: false, attest3: false, attest4: false, attest5: false,
    attest6: false, attest7: false, attest8: false, attest9: false, attest10: false,
    // Step 8 (Bond)
    bondType: '',
  });

  const [owners, setOwners] = useState<OwnerData[]>([]);
  
  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | { name: string; size: number }>>({});
  
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [activeAddressField, setActiveAddressField] = useState('');

  const handleAddressChange = (field: string, value: string) => {
    updateField(field, value);
    setActiveAddressField(field);
    if (value.length > 4) {
      setAddressSuggestions([
        `${value.split(',')[0]} Ave, Oklahoma City, OK 73102 (USPS Verified)`,
        `${value.split(',')[0]} Blvd, Tulsa, OK 74103 (USPS Verified)`,
        `${value.split(',')[0]} Pkwy, Norman, OK 73069 (USPS Verified)`
      ]);
      setShowAddressSuggestions(true);
    } else {
      setShowAddressSuggestions(false);
    }
  };

  const selectAddress = (address: string) => {
    const cleanAddr = address.replace(' (USPS Verified)', '');
    updateField(activeAddressField, cleanAddr);
    setShowAddressSuggestions(false);
  };
  
  const updateField = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const addOwner = () => {
    setOwners(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      name: '', phone: '', email: '', idType: "OK Driver's License",
      idNumber: '', idExpiry: '', dob: '', entityAffiliation: '',
      shares: '', relationship: '', residence: '', mailing: ''
    }]);
  };

  const updateOwner = (id: string, field: keyof OwnerData, value: string) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const removeOwner = (id: string) => {
    setOwners(prev => prev.filter(o => o.id !== id));
  };

  // Mock file uploader logic
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const handleFileUpload = (docKey: string, file: File) => {
    // Check file type and size
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB.");
      return;
    }
    setUploadedFiles(prev => ({ ...prev, [docKey]: file }));
  };

  const removeFile = (docKey: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[docKey];
      return copy;
    });
  };

  const getRequiredDocuments = () => {
    const base = [
      'Affidavit of Lawful Presence',
      'Proof of Oklahoma Residency (75% ownership)',
      'OSBI Background Check (each owner)',
      'National Background Check Attestation',
      'ID copies (each person of interest)',
      'Certificate of Compliance',
      'Certificate(s) of Occupancy & Site Plans',
      'Certificate of Good Standing',
      'Ownership Disclosure Documentation',
    ];
    if (formData.licenseType === 'Processor') base.push('Hazardous License / Chemical Safety Data Sheets');
    if (formData.licenseType === 'Dispensary') base.push('Dispensary Distance Attestation (1,000 ft from schools)');
    if (formData.licenseType === 'Grower') base.push('Grow Facility Distance Attestation (1,000 ft from schools)');
    return base;
  };

  const requiredDocs = getRequiredDocuments();

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Pre-Registration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Registrant Full Name</label>
                <input type="text" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Secure Password</label>
                <input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" placeholder="Min 8 Characters" />
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Business Configuration</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Business Legal Entity Name</label>
                  <input type="text" value={formData.entityName} onChange={(e) => updateField('entityName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" placeholder="e.g. Acme Health LLC" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Primary License Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {LICENSE_TYPES.map(type => (
                      <label key={type} className={cn("border p-3 rounded-lg text-sm text-center font-medium cursor-pointer transition-colors", formData.licenseType === type ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200")}>
                        <input type="radio" className="hidden" name="licenseType" value={type} checked={formData.licenseType === type} onChange={(e) => updateField('licenseType', e.target.value)} />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">General Information</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trade Name (DBA) <span className="text-slate-400 font-normal">(Leave blank if same as Entity Name)</span></label>
                <input type="text" value={formData.tradeName} onChange={(e) => updateField('tradeName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" placeholder={formData.entityName || "Business Name"} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Business Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" placeholder="(555) 555-5555" />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-3"><span className="text-red-500 mr-1">*</span>Operating Hours</label>
                   <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                         <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                               <th className="px-4 py-2 font-bold text-slate-600">Day</th>
                               <th className="px-4 py-2 font-bold text-slate-600 text-center">Open</th>
                               <th className="px-4 py-2 font-bold text-slate-600 text-center">Open Time</th>
                               <th className="px-4 py-2 font-bold text-slate-600 text-center">Close Time</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-200">
                            {Object.entries(formData.operatingHours).map(([day, data]: [string, any]) => (
                               <tr key={day}>
                                  <td className="px-4 py-3 font-medium text-slate-700">{day}</td>
                                  <td className="px-4 py-3 text-center">
                                     <input 
                                      type="checkbox" 
                                      checked={data.active} 
                                      onChange={(e) => updateField('operatingHours', { ...formData.operatingHours, [day]: { ...data, active: e.target.checked } })}
                                      className="w-4 h-4 accent-[#1a4731]" 
                                     />
                                  </td>
                                  <td className="px-4 py-3">
                                     <input 
                                      type="time" 
                                      disabled={!data.active}
                                      value={data.open}
                                      onChange={(e) => updateField('operatingHours', { ...formData.operatingHours, [day]: { ...data, open: e.target.value } })}
                                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 disabled:bg-slate-100 disabled:text-slate-400" 
                                     />
                                  </td>
                                  <td className="px-4 py-3">
                                     <input 
                                      type="time" 
                                      disabled={!data.active}
                                      value={data.close}
                                      onChange={(e) => updateField('operatingHours', { ...formData.operatingHours, [day]: { ...data, close: e.target.value } })}
                                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 disabled:bg-slate-100 disabled:text-slate-400" 
                                     />
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Business Structure Type</label>
                <select value={formData.businessStructure} onChange={(e) => updateField('businessStructure', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none bg-white">
                  <option value="">Select Structure...</option>
                  {BUSINESS_STRUCTURES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
               <h3 className="text-xl font-semibold text-slate-800">Owners & Principal Officers</h3>
               <button onClick={addOwner} className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors">
                  <Plus size={16} /> Add Owner
               </button>
            </div>
            {owners.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                 <p className="text-slate-500 mb-4">No owners added yet. You must add at least one owner/officer.</p>
                 <button onClick={addOwner} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300">Add Primary Owner</button>
              </div>
            ) : (
              <div className="space-y-8">
                {owners.map((owner, idx) => (
                  <div key={owner.id} className="p-5 border border-slate-200 bg-slate-50 rounded-xl relative">
                    <button onClick={() => removeOwner(owner.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={20}/></button>
                    <h4 className="font-bold text-slate-700 mb-4">Owner / Officer #{idx + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" value={owner.name} onChange={(e) => updateOwner(owner.id, 'name', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
                      <input type="text" placeholder="Phone Number" value={owner.phone} onChange={(e) => updateOwner(owner.id, 'phone', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
                      <input type="email" placeholder="Email Address" value={owner.email} onChange={(e) => updateOwner(owner.id, 'email', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
                      <div className="flex gap-2">
                        <select value={owner.idType} onChange={(e) => updateOwner(owner.id, 'idType', e.target.value)} className="w-[120px] px-3 border rounded-lg text-sm bg-white">
                           <option>OK ID</option><option>Passport</option><option>Tribal ID</option>
                        </select>
                        <input type="text" placeholder="ID Number" value={owner.idNumber} onChange={(e) => updateOwner(owner.id, 'idNumber', e.target.value)} className="flex-1 px-4 py-2 border rounded-lg text-sm" />
                      </div>
                      <input type="text" placeholder="Direct/Indirect Ownership (e.g. 50%)" value={owner.shares} onChange={(e) => updateOwner(owner.id, 'shares', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
                      <input type="text" placeholder="Relationship to Licensee" value={owner.relationship} onChange={(e) => updateOwner(owner.id, 'relationship', e.target.value)} className="px-4 py-2 border rounded-lg text-sm" />
                      <input type="text" placeholder="Residence Address" value={owner.residence} onChange={(e) => updateOwner(owner.id, 'residence', e.target.value)} className="md:col-span-2 px-4 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Location Information</h3>
            <div className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Physical Address of Commercial Establishment</label>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    value={formData.physicalAddress} 
                    onChange={(e) => handleAddressChange('physicalAddress', e.target.value)}
                    onFocus={() => { if(formData.physicalAddress.length > 4) setShowAddressSuggestions(true); setActiveAddressField('physicalAddress'); }}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" 
                    placeholder="Street Address, City, State, Zip" 
                   />
                   
                   {showAddressSuggestions && activeAddressField === 'physicalAddress' && (
                     <div className="absolute top-full left-0 mt-1 w-full bg-white border border-emerald-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                       <div className="bg-emerald-50 px-3 py-2 border-b border-emerald-100 flex items-center gap-2 text-xs font-bold text-emerald-800">
                         <CircleCheck size={14} /> USPS Suggested Addresses
                       </div>
                       {addressSuggestions.map((s, i) => (
                         <div key={i} onClick={() => selectAddress(s)} className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-b-0 border-slate-100 transition-colors flex items-center justify-between group">
                           <span className="font-medium text-slate-700">{s.replace(' (USPS Verified)', '')}</span>
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                         </div>
                       ))}
                     </div>
                   )}
                   <button 
                    onClick={() => {
                      // Mock GPS verification
                      if (formData.physicalAddress) {
                        updateField('gpsCoordinates', '35.4676° N, 97.5164° W');
                        alert("USPS Verification Success: GPS Coordinates Generated.");
                      } else {
                        alert("Please enter an address first.");
                      }
                    }}
                    className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap"
                   >
                     Verify & Geocode
                   </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>GPS Coordinates</label>
                <input 
                  type="text" 
                  readOnly
                  value={formData.gpsCoordinates} 
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg text-sm outline-none cursor-not-allowed" 
                  placeholder="Will auto-generate upon address verification" 
                />
                <p className="text-[10px] text-blue-600 font-bold mt-1">GGP-OS SECURE GEO-FENCE SYSTEM READY</p>
              </div>
              <div className="pt-2">
                 <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input 
                      type="checkbox" 
                      checked={formData.mailingSameAsPhysical} 
                      onChange={(e) => updateField('mailingSameAsPhysical', e.target.checked)}
                      className="w-4 h-4 accent-[#1a4731]" 
                    />
                    <span className="text-sm font-medium text-slate-700">Mailing address is same as physical establishment</span>
                 </label>
                 
                 {!formData.mailingSameAsPhysical && (
                   <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mailing Address</label>
                      <input type="text" value={formData.locationMailing} onChange={(e) => updateField('locationMailing', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" placeholder="Mailing Address" />
                   </motion.div>
                 )}
              </div>
            </div>
          </div>
        );
      case 4:
         return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Primary Point of Contact (PPOC)</h3>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4 text-sm text-blue-800">
               State agencies require a dedicated PPOC for all communications, inspections, and rapid response needs. 
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>PPOC Name</label>
                <input type="text" value={formData.ppocName} onChange={(e) => updateField('ppocName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Title</label>
                <input type="text" value={formData.ppocTitle} onChange={(e) => updateField('ppocTitle', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Phone</label>
                <input type="tel" value={formData.ppocPhone} onChange={(e) => updateField('ppocPhone', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Email Address</label>
                <input type="email" value={formData.ppocEmail} onChange={(e) => updateField('ppocEmail', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Full Address</label>
                <input type="text" value={formData.ppocAddress} onChange={(e) => updateField('ppocAddress', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 outline-none" />
              </div>
            </div>
          </div>
         );
      case 5:
         const attests = [
            { id: 'attest1', text: "The commercial entity will not be located on tribal lands." },
            { id: 'attest2', text: "The establishment pledges not to divert marijuana to unauthorized individuals." },
            { id: 'attest3', text: "You are authorized to make this application on behalf of the applicant." },
            { id: 'attest4', text: "All information provided is true and correct." },
            { id: 'attest5', text: "You understand the name, address, city, county, and phone of the establishment will be published on the state website." },
            { id: 'attest6', text: "If applicable, the dispensary perimeter wall is at least 1,000 feet from the nearest school." },
            { id: 'attest7', text: "If applicable, the grower's premises property line is at least 1,000 feet from the nearest school." },
            { id: 'attest8', text: "The business has obtained all applicable local licenses and permits." },
            { id: 'attest9', text: "No individual with ownership interest is a law enforcement officer or state regulatory employee." },
            { id: 'attest10', text: "You understand responsibilities for transporter agent ID cards and security measures." }
         ];
         return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Questions & Verifications</h3>
            <p className="text-sm text-slate-600 mb-4">Please read and attest to all true statements below to proceed.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
              {attests.map((a, i) => (
                <label key={a.id} className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" checked={formData[a.id as keyof typeof formData] as boolean} onChange={(e) => updateField(a.id, e.target.checked)} className="mt-1 w-5 h-5 accent-[#1a4731]" />
                  <span className={cn("text-sm transition-colors", formData[a.id as keyof typeof formData] ? "text-slate-900 font-medium" : "text-slate-600 group-hover:text-slate-800")}>{i+1}. {a.text}</span>
                </label>
              ))}
            </div>
          </div>
         );
      case 6:
         return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Document Uploads</h3>
            <p className="text-sm text-slate-600 mb-6 font-medium">Please upload all required documentation. Max file size: 10MB.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requiredDocs.map((docName, idx) => (
                <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-[#1a4731]/30 transition-colors">
                  <h4 className="text-xs font-bold text-slate-600 uppercase mb-3 line-clamp-2 pr-4">{docName}</h4>
                  
                  {uploadedFiles[docName] ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                       <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={16} className="text-emerald-600 shrink-0"/>
                          <span className="text-sm font-medium text-emerald-800 truncate">{(uploadedFiles[docName] as File).name}</span>
                       </div>
                       <button onClick={() => removeFile(docName)} className="text-emerald-700 hover:text-red-500 hover:bg-white p-1 rounded transition-colors"><X size={14}/></button>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        ref={el => fileInputRefs.current[docName] = el}
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(docName, e.target.files[0]);
                          }
                        }}
                      />
                      <button 
                        onClick={() => fileInputRefs.current[docName]?.click()}
                        className="w-full border-2 border-dashed border-slate-300 rounded-lg py-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-[#1a4731]/40 text-slate-500 hover:text-[#1a4731] transition-all"
                      >
                        <Upload size={20} />
                        <span className="text-xs font-semibold">Upload File</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-blue-50 p-4 rounded-xl flex items-start gap-3">
              <CircleCheck className="text-blue-500 shrink-0" size={20} />
              <p className="text-sm text-blue-800">Files are immediately scanned for viruses. By uploading, you acknowledge these documents fall under state open records policies where applicable.</p>
            </div>
          </div>
         );
      case 7:
         // Bond requirement is conditionally skipped if not Grower, but we'll show it generically if they arrive here
         return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-2">Bond Requirement (Growers Only)</h3>
            {formData.licenseType !== 'Grower' ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center">
                 <CircleCheck size={32} className="text-emerald-500 mx-auto mb-3" />
                 <h4 className="font-bold text-emerald-800 text-lg">Not Required</h4>
                 <p className="text-emerald-700 text-sm mt-1">Since you selected {formData.licenseType}, you are exempt from this specific state Bond Requirement.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Please select how you will satisfy the operational bond requirement for your Grower license:</p>
                
                <label className={cn("flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors", formData.bondType === 'Bond' ? "border-[#1a4731] bg-emerald-50" : "border-slate-200 hover:border-slate-300")}>
                   <input type="radio" className="mt-1 w-5 h-5 accent-[#1a4731]" name="bondType" value="Bond" checked={formData.bondType === 'Bond'} onChange={(e) => updateField('bondType', e.target.value)} />
                   <div>
                      <h4 className="font-bold text-slate-800">I have secured a Surety Bond</h4>
                      <p className="text-sm text-slate-500 mt-1">You will need to attach the bond documentation with your application.</p>
                   </div>
                </label>

                <label className={cn("flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors", formData.bondType === 'Land' ? "border-[#1a4731] bg-emerald-50" : "border-slate-200 hover:border-slate-300")}>
                   <input type="radio" className="mt-1 w-5 h-5 accent-[#1a4731]" name="bondType" value="Land" checked={formData.bondType === 'Land'} onChange={(e) => updateField('bondType', e.target.value)} />
                   <div>
                      <h4 className="font-bold text-slate-800">Land Ownership Exception (5+ Years)</h4>
                      <p className="text-sm text-slate-500 mt-1">I or a person of interest have owned the permitted land for at least 5 years strictly prior to this application.</p>
                   </div>
                </label>
              </div>
            )}
          </div>
         );
      case 8:
         return (
          <div className="space-y-6">
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
               <div className="bg-slate-50 p-4 border-b">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><CircleCheck className="text-[#1a4731]" size={20}/> Application Review</h3>
                  <p className="text-xs text-slate-500 mt-1">Please review your setup before submitting. State processing fees will be evaluated upon submission.</p>
               </div>
               
               <div className="p-6 space-y-8">
                  <div>
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">1. Business Profile</h4>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500 font-medium">Entity Name:</span> <div className="font-semibold">{formData.entityName || "—"}</div></div>
                        <div><span className="text-slate-500 font-medium">License Type:</span> <div className="font-semibold text-[#1a4731]">{formData.licenseType || "—"}</div></div>
                        <div><span className="text-slate-500 font-medium">Trade Name:</span> <div className="font-medium">{formData.tradeName || "—"}</div></div>
                        <div><span className="text-slate-500 font-medium">Structure:</span> <div className="font-medium">{formData.businessStructure || "—"}</div></div>
                     </div>
                  </div>

                  <div className="border-t pt-5">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">2. Locations & Contacts</h4>
                     <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="col-span-2"><span className="text-slate-500 font-medium">Physical Address:</span> <div className="font-medium">{formData.physicalAddress || "—"}</div></div>
                        <div><span className="text-slate-500 font-medium">PPOC Name:</span> <div className="font-medium">{formData.ppocName || "—"}</div></div>
                        <div><span className="text-slate-500 font-medium">PPOC Phone:</span> <div className="font-medium">{formData.ppocPhone || "—"}</div></div>
                     </div>
                  </div>

                  <div className="border-t pt-5">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">3. Ownership ({owners.length})</h4>
                     <div className="grid gap-3">
                        {owners.map(o => (
                           <div key={o.id} className="bg-slate-50 p-3 rounded-lg text-sm flex justify-between items-center border">
                              <span className="font-semibold">{o.name}</span>
                              <span className="text-slate-500">{o.shares}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="border-t pt-5 text-sm">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">4. Documents</h4>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{Object.keys(uploadedFiles).length} Uploaded</span>
                     </div>
                     <p className="text-slate-600">All required documents have been cached locally. Ensure sizes do not exceed 10MB.</p>
                  </div>
               </div>
            </div>
            
            <div className="bg-[#1a4731]/10 p-5 rounded-xl border border-[#1a4731]/20">
               <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 mt-0.5 accent-[#1a4731]" />
                  <span className="text-sm font-semibold text-slate-800 flex items-center flex-wrap">
                     <span>I certify under penalty of perjury that this application is accurate and complete, and I submit it for processing.</span>
                     <div className="inline-flex items-center group relative ml-1.5 align-middle">
                        <Info size={16} className="text-[#1a4731] hover:text-emerald-600 transition-colors cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                           By agreeing, you consent to our HIPAA-compliant data practices, OMMA reporting requirements, state open records policies, and platform financial terms.
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                     </div>
                  </span>
               </label>
            </div>
          </div>
         );
      case 9: // Submission Success
         return (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-600" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Application Submitted!</h3>
            <p className="text-slate-600 leading-relaxed max-w-lg mx-auto text-lg mb-8">
              Your business application for <strong className="text-slate-900">{formData.entityName}</strong> has been received by the compliance network. 
              Our regulatory team will review it shortly.
            </p>
            <button
              onClick={() => onNavigate('dashboard')} // Direct to business dashboard
              className="px-8 py-3.5 bg-[#1a4731] text-white rounded-xl font-semibold hover:bg-[#153a28] shadow-lg hover:shadow-xl transition-all"
            >
              Enter Workspace Command Center
            </button>
          </div>
         );
    }
  };

  const handleNext = () => {
    // If Step 6 (Attestations), ensure all to 10 are checked
    if (currentStep === 5) {
      if(!formData.attest1 || !formData.attest2 || !formData.attest3 || !formData.attest4 || !formData.attest5 || !formData.attest6 || !formData.attest7 || !formData.attest8 || !formData.attest9 || !formData.attest10) {
        alert("You must check all 10 attestations to proceed.");
        return;
      }
    }
    // If Step 7 (Bond), skip if not grower
    if (currentStep === 6 && formData.licenseType !== 'Grower') {
      setCurrentStep(8);
      return;
    }
    setCurrentStep(s => Math.min(s + 1, 9));
  };

  const submitApplication = async () => {
     setLoading(true);
     // Simulate API latency & upload processing
     try {
       if (onComplete) {
         await onComplete(formData.email, formData.password, 'business', { ...formData, uploadedDocuments: Object.keys(uploadedFiles).length, bonded: formData.bondType });
       } else {
         await new Promise(r => setTimeout(r, 2000));
       }
     } catch(e) {
       console.error("Submission failed", e);
     }
     setLoading(false);
     setCurrentStep(9);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/ggp-os-logo.png" alt="Logo" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-sm font-bold text-slate-800 tracking-wide hidden md:inline ml-2 border-l border-slate-300 pl-4 py-1">Business Registration Gateway</span>
        </div>
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1a4731] text-sm font-semibold transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border hover:bg-slate-100"
        >
          <ArrowLeft size={16} /> Exit
        </button>
      </nav>

      <div className="flex flex-1 mx-auto w-full max-w-6xl my-8 bg-white md:rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Sidebar Steps */}
        <aside className="w-72 bg-slate-50 border-r border-slate-200 p-8 hidden md:block">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Commercial License</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Complete all required sections.</p>
          </div>
          
          <div className="relative space-y-4">
            {BUSINESS_STEPS.map((stepLabel, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ring-4 ring-transparent",
                  idx === currentStep ? "bg-[#1a4731] text-white ring-emerald-100 scale-110" : 
                  idx < currentStep ? "bg-emerald-500 text-white" : "bg-white text-slate-400 border-2 border-slate-200"
                )}>
                  {idx < currentStep ? <CheckCircle size={14} strokeWidth={3} /> : idx + 1}
                </div>
                <span className={cn(
                  "font-semibold text-sm transition-colors",
                  idx === currentStep ? "text-[#1a4731]" : idx < currentStep ? "text-slate-800" : "text-slate-400"
                )}>
                  {stepLabel}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 border-l border-slate-100 flex flex-col relative">
          
          <div className="flex-1">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, scale: 0.98, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.3 }}
             >
               {renderStepContent()}
             </motion.div>
          </div>

          {/* Navigation Footer */}
          {currentStep < 9 && (
             <div className="sticky bottom-0 bg-white pt-6 border-t border-slate-100 mt-8 flex justify-between items-center z-10 w-full">
               {currentStep > 0 ? (
                 <button onClick={() => setCurrentStep(currentStep === 8 && formData.licenseType !== 'Grower' ? 6 : currentStep - 1)} className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                   Previous Step
                 </button>
               ) : <div/>}
               
               <button 
                 onClick={currentStep === 8 ? submitApplication : handleNext}
                 disabled={loading}
                 className="px-8 py-2.5 rounded-lg bg-[#1a4731] text-white font-bold hover:bg-[#153a28] shadow-md transition-all flex items-center gap-2"
               >
                 {loading ? "Processing..." : currentStep === 8 ? "Submit Application" : "Save & Continue"}
               </button>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
