const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  '<button type="button" className="w-full mt-4 py-3 bg-white text-[#0D6EFD] font-bold rounded-lg hover:bg-white/90 transition-colors shadow-sm">\n                  Submit Request\n                </button>',
  '<button type="button" onClick={() => alert(\'Support ticket successfully submitted! Our AI assistant Sylara will do an initial review, and if needed, route to our paralegal team.\')} className="w-full mt-4 py-3 bg-white text-[#0D6EFD] font-bold rounded-lg hover:bg-white/90 transition-colors shadow-sm">\n                  Submit Request\n                </button>'
);

fs.writeFileSync('src/App.tsx', c);
console.log('Done.');
