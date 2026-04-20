
import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
let balance = 0;
let inString = false;
let stringChar = '';
let inComment = false;
let inBlockComment = false;

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const nextChar = line[j+1];

        if (inComment) {
            continue; // End of line will reset
        }
        if (inBlockComment) {
            if (char === '*' && nextChar === '/') {
                inBlockComment = false;
                j++;
            }
            continue;
        }

        if (char === '/' && nextChar === '/') {
            if (j === 0 || line[j-1] === ' ' || line[j-1] === '\t') {
                inComment = true;
                j++;
                continue;
            }
        }
        if (char === '/' && nextChar === '*') {
            inBlockComment = true;
            j++;
            continue;
        }

        if (char === '{') {
            const oldBalance = balance;
            balance++;
            if (i + 1 >= 1900 && i + 1 <= 1950) {
                console.log(`Line ${i+1} col ${j+1}: ${oldBalance} -> ${balance} ( { ) | ${line.trim()}`);
            }
        }
        if (char === '}') {
            const oldBalance = balance;
            balance--;
            if (balance < 0) {
                console.log(`NEGATIVE BALANCE at line ${i+1} col ${j+1}: balance is ${balance}`);
                console.log(`Line content: ${line.trim()}`);
            }
        }
    }
    inComment = false; // Reset line comment
}
console.log(`Final balance: ${balance}`);
