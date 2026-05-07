const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The specific emojis
content = content.replace(/dY\?/g, '🏢');
content = content.replace(/dY\?/g, '🏢');
content = content.replace(/dY"\</g, '✅');
content = content.replace(/dYZ,/g, '🛂');
content = content.replace(/dY",/g, '📄');
content = content.replace(/dY"\?/g, '🔍');
content = content.replace(/dY\?-/g, '👉');
content = content.replace(/dY\?>,\?/g, '🏛️');
content = content.replace(/dY ,\?/g, '🔍');
content = content.replace(/dY \?/g, '✅');
content = content.replace(/dY\? /g, '✅ ');

// There's a stray `dY?` emoji on the first screenshot.
content = content.replace(/dY\?/g, '🏢');

// Save the file
fs.writeFileSync('src/App.tsx', content);
console.log('Fixed more emojis!');
