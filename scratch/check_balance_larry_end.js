
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let balance = 0;

for (let i = 0; i < 4357; i++) {
  const line = content[i];
  if (!line) continue;
  for (let char of line) {
    if (char === '{') balance++;
    if (char === '}') balance--;
  }
}

console.log(`Balance at end of line 4357: ${balance}`);
