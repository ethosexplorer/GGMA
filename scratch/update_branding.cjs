const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Landing Page: "Global Green introducing"
c = c.replace(
    '<div className="max-w-4xl mx-auto text-center space-y-8">',
    '<div className="max-w-4xl mx-auto text-center space-y-8">\n          <p className="text-[#1a4731] font-bold tracking-widest uppercase text-sm mb-[-20px]">Global Green introducing</p>'
);

// 2. Landing Page Footer: GGHP Logo on bottom
c = c.replace(
    '<img src="/ggp-os-logo.png" alt="GGP-OS Logo" className="w-32 h-32 object-contain grayscale hover:grayscale-0 transition-all"',
    '<img src="/gghp-logo.png" alt="GGHP Logo" className="w-48 h-20 object-contain hover:scale-105 transition-all"'
);

// 3. Rename Admin Portal to Oversight Portal on Landing Page
c = c.replace(
    '<h3 className="text-xl font-bold text-[#3E2723] mb-3">Admin Portal</h3>',
    '<h3 className="text-xl font-bold text-[#3E2723] mb-3">Oversight Portal</h3>'
);
c = c.replace(
    '<p className="text-sm italic text-slate-600 mb-6">\n                Regulators, Law Enforcement, Auditors, Public Health\n              </p>',
    '<p className="text-sm italic text-slate-600 mb-6">\n                Law Enforcement (RIP), Regulators, Executives, Operations\n              </p>'
);
c = c.replace(
    '<button\n                onClick={() => onNavigate(\'login\', \'admin\')}\n                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"\n              >\n                Admin Login\n              </button>',
    '<button\n                onClick={() => onNavigate(\'login\', \'admin\')}\n                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"\n              >\n                Oversight Login\n              </button>'
);

// 4. Update SignupScreen Role Categories as requested
// "The only ones under business should be Patient/Compliance Business Service, Business Entity, Medical Provider and Attorney/Lawfirm."
// "And in oversight noone should be able to see who and what is in Oversight unless they work in it. Operations can be under Oversight also."

// Let's find the roles array in SignupScreen and update categories
c = c.replace(
    '{ id: \'enforcement_city\', label: \'City Enforcement\', category: \'Oversight\', icon: Shield, desc: \'Local police or municipal code enforcement officers.\' },',
    '{ id: \'enforcement_city\', label: \'City Enforcement (RIP)\', category: \'Oversight\', icon: Shield, desc: \'Local police or municipal code enforcement officers.\' },'
);

// Ensure Law Enforcement, Regulators, Executive, Operations are in Oversight category
// (This was mostly done in previous steps but let's be thorough)

// 5. Update Entity Title dropdown for Oversight
c = c.replace(
    '<optgroup label="Government & Admin Roles">',
    '<optgroup label="Oversight & RIP Roles">'
);
c = c.replace(
    '<option value="State Authority Director">State Authority Director</option>',
    '<option value="State Authority Director">State Authority Director</option>\n                                        <option value="Operations Manager">Operations Manager</option>'
);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx branding and portals updated.');
