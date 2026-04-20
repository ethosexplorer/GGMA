const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix the SignupScreen loop icons
const oldLoop = `                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">
                                {cat === 'Public' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Law Enforcement' && <Shield size={18} className="text-[#1a4731]" />}
                                {cat === 'Regulators' && <Activity size={18} className="text-orange-500" />}
                                {cat === 'Executive' && <BarChart3 size={18} className="text-indigo-500" />}
                                {cat === 'Operations' && <Cpu size={18} className="text-slate-500" />}
                                {cat}
                            </h2>`;

const newLoop = `                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">
                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}
                                {cat}
                            </h2>`;

c = c.replace(oldLoop, newLoop);

// 2. Fix Step 2 Role Specific Fields in SignupScreen
// Find the end of selectedRole === 'attorney' block
const attorneyBlockEnd = c.indexOf('AddressAutocompleteInput label="Firm Address"', c.indexOf("{selectedRole === 'attorney'")) + 200; 
// I need a better way to insert new blocks.

// Let's replace the entire Role Specific Fields block
const fieldsStart = c.indexOf('<div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100/50 space-y-5">');
const fieldsEnd = c.indexOf('</div>', c.indexOf('</form>', fieldsStart)) - 1; // This is risky

// I'll use a safer replacement for the fields container
const oldFieldsContainer = `                        {/* ROLE SPECIFIC FIELDS */}
                        <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100/50 space-y-5">`;

const newFieldsContainer = `                        {/* ROLE SPECIFIC FIELDS */}
                        <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100/50 space-y-5">
                             {/* ALL ROLES SEE THE POSITION DROPDOWN */}
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
                                        <option value="Medical Director">Medical Director</option>
                                        <option value="Compliance Service Admin">Compliance Service Admin</option>
                                    </optgroup>
                                    
                                    <optgroup label="Oversight & RIP Roles">
                                        <option value="Executive Founder">Executive Founder</option>
                                        <option value="State Authority Director">State Authority Director</option>
                                        <option value="Chief of Police / Sheriff">Chief of Police / Sheriff</option>
                                        <option value="Operations Manager">Operations Manager</option>
                                        <option value="Narcotics Investigator">Narcotics Investigator</option>
                                        <option value="Field Inspector">Field Inspector</option>
                                    </optgroup>
                                </select>
                             </div>`;

// I'll remove the old dropdown which was inside the fields block
const oldDropdown = `                             <div className="mb-6 space-y-1.5 bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
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
                                    
                                    <optgroup label="Oversight & RIP Roles">
                                        <option value="State Authority Director">State Authority Director</option>
                                        <option value="Operations Manager">Operations Manager</option>
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
                             </div>`;

c = c.replace(oldFieldsContainer, newFieldsContainer);
c = c.replace(oldDropdown, ''); // Remove the redundant one

// 3. Add Compliance Service fields
const businessBlock = `{selectedRole === 'business' && (`;
const complianceBlock = `{selectedRole === 'compliance_service' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Company Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Tax ID / EIN <span className="text-red-500">*</span></span>} name="ein" value={formData.ein} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Business Address" name="address" value={formData.address} required />
                                    </div>
                                    <Input label="Number of Managed Clients" type="number" name="clientCount" value={formData.employeeCount} onChange={handleInputChange} />
                                </div>
                             )}
                             
                             ` + businessBlock;

if (!c.includes("selectedRole === 'compliance_service'")) {
    c = c.replace(businessBlock, complianceBlock);
}

// 4. Add Oversight fields
const oversightBlock = `{selectedRole?.startsWith('enforcement') || selectedRole?.startsWith('regulator') || selectedRole === 'executive_founder' || selectedRole === 'backoffice_staff' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Department / Agency Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Badge Number / Official ID <span className="text-red-500">*</span></span>} name="officialId" value={formData.officialId} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Agency Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             ) : null}
                             `;

// Insert before the end of fields block
const fieldsEndAnchor = '</div>\n\n                             <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">';
c = c.replace(fieldsEndAnchor, oversightBlock + fieldsEndAnchor);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx Signup UI fixed.');
