const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The corrupted emojis in the file
content = content.replace(/dY\?/g, '🏢');
content = content.replace(/dY\?/g, '🏢');

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed emojis!');
