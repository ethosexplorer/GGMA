
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let openBraces = 0;
let closedBraces = 0;

for (let i = 2286; i < 4357; i++) {
  const line = content[i];
  if (!line) continue;
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') closedBraces++;
  }
}

console.log(`Range 2287-4357: Open ${openBraces}, Closed ${closedBraces}, Diff ${openBraces - closedBraces}`);
