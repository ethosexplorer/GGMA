const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace corrupted emoji
content = content.replace(/const response = 'dY[^ ]* Let's begin/g, "const response = '🏢 Let\\'s begin");

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed dY emoji completely!');
