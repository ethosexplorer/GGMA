
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
let balance = 0;
let inString = false;
let stringChar = '';
let inComment = false;
let inBlockComment = false;
let inRegex = false;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const nextChar = content[i+1];

  if (inComment) {
    if (char === '\n') inComment = false;
    continue;
  }
  if (inBlockComment) {
    if (char === '*' && nextChar === '/') {
      inBlockComment = false;
      i++;
    }
    continue;
  }
  if (inString) {
    if (char === stringChar && content[i-1] !== '\\') {
      inString = false;
    }
    continue;
  }

  if (char === '/' && nextChar === '/') {
    inComment = true;
    i++;
    continue;
  }
  if (char === '/' && nextChar === '*') {
    inBlockComment = true;
    i++;
    continue;
  }
  if ((char === "'" || char === '"' || char === '`')) {
    inString = true;
    stringChar = char;
    continue;
  }

  if (char === '{') balance++;
  if (char === '}') balance--;

  if (balance < 0) {
      const lineNum = content.substring(0, i).split('\n').length;
      console.log(`FIRST NEGATIVE BALANCE at line ${lineNum}: balance is ${balance}`);
      process.exit(0);
  }
}

console.log(`Final balance: ${balance}`);
