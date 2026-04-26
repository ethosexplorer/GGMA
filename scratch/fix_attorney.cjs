const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix 1: Replace the onClick handler that prompts for a code
const oldHandler = `const code = window.prompt("🔒 LEGAL MARKETPLACE IS LOCKED.\\n\\nPlease subscribe or enter Access Code:");
                      if (code === '1234') {
                        alert("✅ Access Granted: Welcome to the Legal Marketplace.");
                        onNavigate('login');
                      } else if (code !== null) {
                        alert("❌ Access Denied: Invalid Code. Please subscribe to unlock.");
                      }`;

const newHandler = `const el = document.getElementById('membership-tiers');
                      if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
                      else { onNavigate('login'); }`;

if (content.includes(oldHandler)) {
  content = content.replace(oldHandler, newHandler);
  console.log('✅ Replaced onClick handler');
} else {
  console.log('❌ Could not find onClick handler, trying simpler match...');
  // Try line-by-line
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('LEGAL MARKETPLACE IS LOCKED')) {
      console.log(`Found at line ${i+1}: ${lines[i].trim().substring(0, 80)}`);
    }
    if (lines[i].includes('Unlock (Code: 1234)')) {
      console.log(`Found code reveal at line ${i+1}: ${lines[i].trim().substring(0, 80)}`);
    }
  }
}

// Fix 2: Replace the hover text that reveals the code
const oldHover = `Unlock (Code: 1234)`;
const newHover = `Subscribe to Unlock`;

if (content.includes(oldHover)) {
  content = content.replace(oldHover, newHover);
  console.log('✅ Replaced hover text');
} else {
  console.log('❌ Could not find hover text');
}

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Done.');
