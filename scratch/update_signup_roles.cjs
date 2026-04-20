const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add entityTitleOrPosition to formData
c = c.replace(
  "    lastName: '',\n    dob: '',",
  "    lastName: '',\n    entityTitleOrPosition: '',\n    dob: '',"
);

// 2. Add the Entity Title dropdown to the Role Specific section
const targetString = `<h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Role Specific Details Configuration</h3>`;

const replacementString = `<h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Role Specific Details Configuration</h3>
                             
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
                             </div>`;

c = c.replace(targetString, replacementString);

fs.writeFileSync('src/App.tsx', c);
console.log('Signup roles updated.');
