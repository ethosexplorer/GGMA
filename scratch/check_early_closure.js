
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let balance = 0;

for (let i = 0; i < content.length; i++) {
  const line = content[i];
  if (!line) continue;
  for (let char of line) {
    if (char === '{') balance++;
    if (char === '}') balance--;
    if (i >= 2286 && i < 4357 && balance < 1) {
      console.log(`COMPONENT CLOSED EARLY at line ${i + 1}: balance ${balance}`);
      process.exit(0);
    }
  }
}
console.log("No early closure found in the specified range.");
