const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const old = "onClick={() => onNavigate('larry-chatbot')}";
let idx = 0;
let count = 0;
while ((idx = c.indexOf(old, idx)) !== -1) {
  count++;
  const lineNum = c.substring(0, idx).split('\n').length;
  const context = c.substring(Math.max(0, idx - 100), idx + 200);
  const isC3 = context.includes('px-10') || context.includes('Score Potential');
  console.log(`Occurrence ${count} at line ${lineNum}: isC3=${isC3}`);
  console.log(`  Context: ...${c.substring(idx-50, idx+100).replace(/\n/g, '\\n')}...`);
  
  if (lineNum >= 1900 && lineNum <= 1910) {
    const replacement = "onClick={() => { const el = document.getElementById('membership-tiers'); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } else { onNavigate('login'); } }}";
    c = c.substring(0, idx) + replacement + c.substring(idx + old.length);
    fs.writeFileSync('src/App.tsx', c, 'utf8');
    console.log('✅ Fixed C3 button at line ' + lineNum);
    break;
  }
  idx += old.length;
}

if (count === 0) console.log('❌ Not found');
