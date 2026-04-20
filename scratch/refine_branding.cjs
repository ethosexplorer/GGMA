const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// Refine "Global Green introducing" placement
c = c.replace(
    '<p className="text-[#1a4731] font-bold tracking-widest uppercase text-sm mb-[-20px]">Global Green introducing</p>',
    '<p className="text-[#1a4731] font-bold tracking-[0.3em] uppercase text-xs mb-[-10px] opacity-70">Global Green introducing</p>'
);

// Ensure the GGHP logo on bottom is prominent
c = c.replace(
    '<img src="/gghp-logo.png" alt="GGHP Logo" className="w-48 h-20 object-contain hover:scale-105 transition-all"',
    '<img src="/gghp-logo.png" alt="GGHP Logo" className="w-64 h-24 object-contain hover:scale-110 transition-all cursor-pointer"'
);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx hero and footer refined.');
