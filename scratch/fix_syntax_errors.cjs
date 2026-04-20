const fs = require('fs');

// 1. Fix App.tsx - Remove messy braces
let appC = fs.readFileSync('src/App.tsx', 'utf8');

// The script update_signup_fields.cjs introduced these
// Let's look for the problematic blocks and fix them.

// Fix Attorney block end (lines 2125-2127)
appC = appC.replace(/\}\)\s+<\/div>\s+\)\}\s+\)\}/g, ')}');
// Wait, regex might be hard due to whitespace. 
// I'll just use simple string replacement for known bad patterns.
appC = appC.replace(/\)\}                            <\/div>\s+    \)\}/g, ')}');
appC = appC.replace(/\)\}                         \)\}/g, ')}');

// Re-do the blocks properly to ensure balance
const attorneyBlock = `{ (selectedRole === 'attorney_lawyer' || selectedRole === 'attorney_staff') && (
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

const regulatorBlock = `{ (selectedRole === 'regulator_state' || selectedRole === 'enforcement_rip' || selectedRole === 'executive_founder' || selectedRole === 'internal_admin') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Agency / Department Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Official ID / Badge Number <span className="text-red-500">*</span></span>} name="officialId" value={formData.officialId} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Agency Headquarters Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             )}`;

// I'll just replace the whole mess between business and executive
const startPos = appC.indexOf("{ (selectedRole === 'attorney_lawyer'");
const endPos = appC.indexOf("{selectedRole === 'executive' && (");
if (startPos !== -1 && endPos !== -1) {
    appC = appC.substring(0, startPos) + attorneyBlock + '\n\n                             ' + regulatorBlock + '\n\n                             ' + appC.substring(endPos);
}

fs.writeFileSync('src/App.tsx', appC);

// 2. Fix FounderDashboard.tsx
let founderC = fs.readFileSync('src/pages/FounderDashboard.tsx', 'utf8');
founderC = founderC.replace(/\\\`/g, '`');
founderC = founderC.replace(/\\\$/g, '$');
fs.writeFileSync('src/pages/FounderDashboard.tsx', founderC);

console.log('Syntax errors fixed in App.tsx and FounderDashboard.tsx.');
