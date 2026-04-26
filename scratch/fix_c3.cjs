const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// Find and replace the onClick for the C3 button
const old = "onClick={() => onNavigate('larry-chatbot')}";
const replacement = "onClick={() => { const el = document.getElementById('membership-tiers'); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } else { onNavigate('login'); } }}";

// Only replace the one near line 1904 (the C3 Score button)
const idx = c.indexOf(old);
if (idx !== -1) {
  // Check context: make sure it's near "px-10 py-4 bg-emerald-500"
  const context = c.substring(idx, idx + 200);
  if (context.includes('px-10 py-4 bg-emerald-500')) {
    c = c.substring(0, idx) + replacement + c.substring(idx + old.length);
    fs.writeFileSync('src/App.tsx', c, 'utf8');
    console.log('✅ Fixed C3 button - now redirects to subscriptions');
  } else {
    console.log('❌ Found onClick but wrong context');
  }
} else {
  console.log('❌ Could not find onClick target');
  // Search for it
  const lines = c.split('\n');
  for (let i = 1900; i < 1910; i++) {
    console.log(`${i+1}: ${lines[i]}`);
  }
}
