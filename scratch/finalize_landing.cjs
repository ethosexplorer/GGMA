const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix Landing Page button labels
c = c.replace('Business Onboarding', 'Business Access');
c = c.replace('Admin Login', 'Oversight Access'); // Already might be changed but let's be sure

// 2. Fix Oversight Portal description and items
c = c.replace(
    'Authorized regulatory access for public safety monitoring, auditing, and multi-state compliance verification.',
    'Authorized command center for real-time intelligence, policing (RIP), and regulatory oversight.'
);

// 3. Ensure "Law Enforcement (RIP)" is the label for the role
c = c.replace(
    "{ id: 'enforcement_state', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing for authorized agencies.' }",
    "{ id: 'enforcement_state', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing (RIP) for authorized agencies.' }"
);

// 4. Update the "Oversight Portal" Card button to go to 'Oversight' category in signup
// (Already handled by previous script but let's double check the button text)
c = c.replace(
    'Admin Login',
    'Oversight Access'
);

// 5. Update the Patient card button text to be consistent
c = c.replace(
    '<button\n                onClick={() => onNavigate(\'patient-portal\')}\n                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"\n              >\n                Patient Portal\n              </button>',
    '<button\n                onClick={() => onNavigate(\'signup\', \'Patient\')}\n                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"\n              >\n                Patient Access\n              </button>'
);

fs.writeFileSync('src/App.tsx', c);
console.log('Landing Page labels and navigation refined.');
