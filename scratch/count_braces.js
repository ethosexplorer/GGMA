
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
let openBraces = 0;
let closedBraces = 0;
let openJSX = 0;
let closedJSX = 0;

for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') openBraces++;
  if (content[i] === '}') closedBraces++;
  if (content[i] === '<' && content[i+1] !== ' ' && content[i+1] !== '=') openJSX++;
  if (content[i] === '>' && content[i-1] !== ' ') closedJSX++;
}

console.log(`Open Braces: ${openBraces}, Closed Braces: ${closedBraces}, Diff: ${openBraces - closedBraces}`);
