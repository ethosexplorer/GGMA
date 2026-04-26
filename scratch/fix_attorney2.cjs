const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Show the exact bytes around the prompt line
const lines = content.split('\n');
const promptLineIdx = lines.findIndex(l => l.includes('LEGAL MARKETPLACE IS LOCKED'));
if (promptLineIdx >= 0) {
  // Replace lines from onClick handler start to the closing }}
  // Line promptLineIdx-1 should be "onClick={() => {"
  // We need to find the closing }}" which ends the handler
  console.log(`Prompt at line ${promptLineIdx + 1}`);
  for (let i = promptLineIdx - 1; i <= promptLineIdx + 8; i++) {
    console.log(`  ${i+1}: ${JSON.stringify(lines[i])}`);
  }
  
  // Replace lines promptLineIdx-1 through promptLineIdx+7 (the onClick handler)
  const newLines = [
    '                    onClick={() => {',
    "                      const el = document.getElementById('membership-tiers');",
    "                      if (el) { el.scrollIntoView({ behavior: 'smooth' }); }",
    "                      else { onNavigate('login'); }",
    '                    }}'
  ];
  
  // The handler spans from promptLineIdx-1 (onClick) to the line with }}
  const endIdx = lines.findIndex((l, i) => i > promptLineIdx && l.trim() === '}}');
  console.log(`End at line ${endIdx + 1}: ${JSON.stringify(lines[endIdx])}`);
  
  lines.splice(promptLineIdx - 1, (endIdx - promptLineIdx + 2), ...newLines);
  content = lines.join('\n');
  fs.writeFileSync('src/App.tsx', content, 'utf8');
  console.log('✅ Replaced onClick handler');
} else {
  console.log('❌ Could not find prompt line');
}
