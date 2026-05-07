const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const indices = [];
lines.forEach((l, i) => { if (l.includes("lower === 'english'")) indices.push(i); });
indices.forEach(i => console.log(lines.slice(i-2, i+15).join('\n') + '\n---'));
