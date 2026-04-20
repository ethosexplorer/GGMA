const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  '<div className="flex items-center gap-3 pl-4 border-l border-slate-200">',
  '<div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 shadow-sm mr-2"><span className="font-bold text-xs uppercase tracking-wider">Care Wallet:</span><span className="font-black text-sm">0 Tokens</span><button className="ml-2 px-2 py-0.5 bg-[#1a4731] text-white rounded text-xs font-bold hover:bg-[#153a28] transition-colors">Buy</button></div>\n            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">'
);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx updated with Care Wallet.');
