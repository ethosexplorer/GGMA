
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let openBraces = 0;
let closedBraces = 0;

for (let i = 0; i < 4373; i++) {
  const line = content[i];
  if (!line) continue;
  for (let char of line) {
    if (char === '{') openBraces++;
    if (char === '}') closedBraces++;
  }
}

console.log(`Range 1-4373: Open ${openBraces}, Closed ${closedBraces}, Diff ${openBraces - closedBraces}`);
