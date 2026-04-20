const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the Entity Title or Position dropdown
const dropdownStart = c.indexOf('<optgroup label="Patient Portal Roles">');
const dropdownEnd = c.indexOf('</select>', dropdownStart);

const newDropdownContent = `        <optgroup label="Patient Portal Roles">
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
                                        <option value="Executive Founder">Executive Founder</option>
                                        <option value="Internal Administrator">Internal Administrator</option>
                                        <option value="State Authority Director">State Authority Director</option>
                                        <option value="Chief of Police / Sheriff">Chief of Police / Sheriff</option>
                                        <option value="Field Inspector">Field Inspector</option>
                                    </optgroup>

                                    <optgroup label="Operations (Call Center) Roles">
                                        <option value="Operations Manager">Operations Manager</option>
                                        <option value="Call Center Supervisor">Call Center Supervisor</option>
                                        <option value="Escalation Specialist">Escalation Specialist</option>
                                        <option value="Support Agent">Support Agent</option>
                                    </optgroup>
                                `;

c = c.substring(0, dropdownStart) + newDropdownContent + c.substring(dropdownEnd);

// 2. Update Role Specific Fields logic for Attorneys
const attorneyBlockOld = c.indexOf("{selectedRole === 'attorney' && (");
const attorneyBlockEnd = c.indexOf('</div>', c.indexOf('AddressAutocompleteInput', attorneyBlockOld)) + 12;

const newAttorneyBlock = `{ (selectedRole === 'attorney_lawyer' || selectedRole === 'attorney_staff') && (
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
                             )}`;

if (attorneyBlockOld !== -1) {
    c = c.substring(0, attorneyBlockOld) + newAttorneyBlock + c.substring(attorneyBlockEnd);
}

// 3. Update Provider roles logic
const providerBlockOld = c.indexOf("{selectedRole === 'provider' && (");
const providerBlockEnd = c.indexOf('</div>', c.indexOf('medicalProviderLicense', providerBlockOld)) + 12;

const newProviderBlock = `{ selectedRole?.startsWith('medical_provider_') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label={<span>Practice / Clinic Address <span className="text-red-500">*</span></span>} name="address" value={formData.address} required />
                                    </div>
                                    <Input label={<span>Professional License Number <span className="text-red-500">*</span></span>} name="medicalProviderLicense" value={formData.medicalProviderLicense} onChange={handleInputChange} required />
                                    <Input label={<span>NPI (National Provider ID)</span>} name="npi" value={formData.npi} onChange={handleInputChange} />
                                    <Input label="DEI / State Controlled Substance Registration" name="caregiverPatientId" value={formData.caregiverPatientId} onChange={handleInputChange} placeholder="Optional for staff" />
                                </div>
                             )}`;

if (providerBlockOld !== -1) {
    c = c.replace(c.substring(providerBlockOld, providerBlockEnd), newProviderBlock);
}

// 4. Update Regulator roles logic
const regulatorBlockOld = c.indexOf("{selectedRole === 'regulator' && (");
const regulatorBlockEnd = c.indexOf('</div>', c.indexOf('badgeNumber', regulatorBlockOld)) + 12;

const newRegulatorBlock = `{ (selectedRole === 'regulator_state' || selectedRole === 'enforcement_rip' || selectedRole === 'executive_founder' || selectedRole === 'internal_admin') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Agency / Department Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Official ID / Badge Number <span className="text-red-500">*</span></span>} name="officialId" value={formData.officialId} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Agency Headquarters Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             )}`;

if (regulatorBlockOld !== -1) {
    c = c.replace(c.substring(regulatorBlockOld, regulatorBlockEnd), newRegulatorBlock);
}

// 5. Update Operations roles logic
const opsBlock = `{ selectedRole?.startsWith('ops_') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-3">
                                        <Bot size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                                        <p className="text-sm text-indigo-900 leading-relaxed font-bold">
                                            Operations roles are restricted to internal human-in-the-loop staff. You will be assigned to a specific queue upon approval.
                                        </p>
                                    </div>
                                    <Input label="Employee ID" name="employeeId" value={formData.employeeId || ''} onChange={handleInputChange} required />
                                    <Input label="Assigned Department" name="department" value={formData.department || ''} onChange={handleInputChange} required />
                                </div>
                             )}`;

// Insert before the last block
const anchor = '{ selectedRole?.startsWith(\'enforcement\')';
if (c.indexOf(anchor) !== -1) {
    c = c.replace(anchor, opsBlock + '\n\n                             ' + anchor);
}

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx Signup fields updated for new roles.');
