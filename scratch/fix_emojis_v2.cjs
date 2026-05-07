const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The corrupted emojis in the file
content = content.replace(/dY\?/g, '🏢');
content = content.replace(/dY\?/g, '🏢');
content = content.replace(/dY\?/g, '✅');
content = content.replace(/dY"/g, '✅');
content = content.replace(/dY\?\\/g, '🏢');
content = content.replace(/dY\\?/g, '🏢');

// Fix any "dY" strings that followed by anything weird
content = content.replace(/dY.[^\s]*/g, '✅'); 

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed emojis aggressively!');
