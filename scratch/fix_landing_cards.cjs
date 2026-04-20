const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace('<h3 className="text-xl font-bold text-[#3E2723] mb-3">Business Onboarding</h3>', '<h3 className="text-xl font-bold text-[#3E2723] mb-3">Business Portal</h3>');
c = c.replace('<button\n                onClick={() => onNavigate(\'signup\', \'business\')}\n                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"\n              >\n                Business Onboarding\n              </button>', '<button\n                onClick={() => onNavigate(\'signup\', \'business\')}\n                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"\n              >\n                Business Portal\n              </button>');

c = c.replace('Dispensary, Cultivation, Distribution, Manufacturing', 'Dispensary, Cultivation, Manufacturing, Medical Providers, Medcard Services');

c = c.replace('<h3 className="text-xl font-bold text-[#3E2723] mb-3">Government / Admin</h3>', '<h3 className="text-xl font-bold text-[#3E2723] mb-3">Admin Portal</h3>');
c = c.replace('Law Enforcement (City, County, State, Federal), Public Health, Oversight', 'Regulators, Law Enforcement, Auditors, Public Health');

fs.writeFileSync('src/App.tsx', c);
console.log('Landing page cards updated.');
