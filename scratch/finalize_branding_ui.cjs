const fs = require('fs');

// 1. Fix AdminDashboard.tsx
let adminC = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
adminC = adminC.replace(
    '<p className="text-xs font-bold text-white">System Admin</p>',
    '<p className="text-xs font-bold text-white">{user?.displayName || user?.email?.split("@")[0] || "Executive Founder"}</p>'
);
adminC = adminC.replace(
    '<p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">INTERNAL STAFF • OPERATIONS</p>',
    '<p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{user?.role?.toUpperCase()?.replace("_", " ") || "OVERSIGHT COMMAND"}</p>'
);
adminC = adminC.replace(
    'src="https://ui-avatars.com/api/?name=System+Admin&background=4F46E5&color=fff&size=32"',
    'src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "Admin")}&background=4F46E5&color=fff&size=32`}'
);
fs.writeFileSync('src/pages/AdminDashboard.tsx', adminC);

// 2. Fix ProviderDashboard.tsx Branding
let providerC = fs.readFileSync('src/pages/ProviderDashboard.tsx', 'utf8');
providerC = providerC.replace('alt="GGMA Logo"', 'alt="GGHP Logo"');
providerC = providerC.replace('src="/logo.png"', 'src="/gghp-logo.png"');
fs.writeFileSync('src/pages/ProviderDashboard.tsx', providerC);

// 3. Fix AttorneyDashboard.tsx Branding
let attorneyC = fs.readFileSync('src/pages/AttorneyDashboard.tsx', 'utf8');
const attorneyLogo = `<div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <img src="/gghp-logo.png" alt="GGHP Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-black text-lg leading-tight tracking-tight">Legal Green</h2>
              <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Attorney Network</p>
            </div>
          </div>
        </div>`;
if (!attorneyC.includes('gghp-logo.png')) {
    attorneyC = attorneyC.replace('<div className="p-6 pb-8">', attorneyLogo);
}
fs.writeFileSync('src/pages/AttorneyDashboard.tsx', attorneyC);

// 4. Fix App.tsx Signup Step 2
let appC = fs.readFileSync('src/App.tsx', 'utf8');

const positionDropdown = `                             <div className="mb-6 space-y-1.5 bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
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
                                <p className="text-xs text-slate-500 mt-2">This determines your dashboard features and goes to our paralegal queue for verification.</p>
                             </div>`;

// Re-insert the dropdown if missing
if (!appC.includes('Entity Title or Position')) {
    appC = appC.replace('<h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Role Specific Details Configuration</h3>', 
                      '<h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Role Specific Details Configuration</h3>\n' + positionDropdown);
}

fs.writeFileSync('src/App.tsx', appC);

console.log('Dashboards and Signup UI Branding finalized.');
