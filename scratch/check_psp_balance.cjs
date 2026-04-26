const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 6519; i < 7336; i++) { // 1-indexed lines 6520 to 7336
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance within PatientSignupPage (6520-7336): ${balance}`);
