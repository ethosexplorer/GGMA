
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let balance = 0;

for (let i = 2286; i < 4357; i++) {
  const line = content[i];
  if (!line) continue;
  for (let char of line) {
    if (char === '{') balance++;
    if (char === '}') balance--;
    if (balance < 0) {
      console.log(`NEGATIVE BALANCE at line ${i + 1}: ${balance}`);
      // Only print once per line to avoid noise
      break; 
    }
  }
}
