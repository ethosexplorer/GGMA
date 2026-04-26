const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Check to lucide imports
const oldImport = "  Home\n} from 'lucide-react';";
const newImport = "  Home,\n  Check\n} from 'lucide-react';";
if (c.includes(oldImport)) {
  c = c.replace(oldImport, newImport);
  console.log('✅ Added Check to imports');
} else {
  console.log('❌ Could not find import anchor');
}

// 2. Update the "What is C³?" section to include Cannabis Credit Bureau messaging
const oldTitle = 'What is <span className="text-emerald-400">C³</span>?';
const newTitle = 'What is <span className="text-emerald-400">C³</span>?';
// Keep the title but update the description below it
const oldDesc = "C³ stands for **Compassion, Compliance & Community**. It is our proprietary real-time trust metric that rewards ethical participation across the Global Green ecosystem.";
const newDesc = "C³ stands for **Compassion, Compliance & Community** — the industry's first <strong className=\"text-emerald-400\">Cannabis Credit Bureau</strong>. Like a FICO score for cannabis, C³ is our proprietary real-time trust metric that quantifies ethical participation, regulatory adherence, and community impact across the entire Global Green ecosystem.";

if (c.includes(oldDesc)) {
  c = c.replace(oldDesc, newDesc);
  console.log('✅ Updated C³ description with Cannabis Credit Bureau');
} else {
  console.log('❌ Could not find old description');
}

// 3. Also add a "Cannabis Credit Bureau" badge above the title
const oldBadge = '✨ Introducing the Industry Standard';
const newBadge = "✨ The Industry's First Cannabis Credit Bureau";
if (c.includes(oldBadge)) {
  c = c.replace(oldBadge, newBadge);
  console.log('✅ Updated badge text');
}

fs.writeFileSync('src/App.tsx', c, 'utf8');
console.log('✅ Saved');
