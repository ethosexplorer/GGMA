const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

// Remove stray block (lines 5317 to 5349 in original, but indices may have shifted)
// We'll search for the specific garbage lines
const newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect start of garbage block
  // The line after the first valid handleLogin's closing brace
  if (i > 0 && lines[i-1].trim() === '};' && line.includes('setUserProfile(adminProfile);')) {
    skip = true;
  }
  
  if (!skip) {
    newLines.push(line);
  }
  
  // Detect end of garbage block
  if (skip && line.trim() === '};' && lines[i+1]?.includes('const handleSignup')) {
    skip = false;
  }
}

fs.writeFileSync('src/App.tsx', newLines.join('\n'));
console.log('App.tsx garbage fragments removed.');
