const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split(/\r?\n/);

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let b = 0;
    for (let char of line) {
        if (char === '{') b++;
        if (char === '}') b--;
    }
    balance += b;
    if (i >= 5480 && i <= 5510) {
        console.log(`Line ${i+1}: b=${b}, total=${balance}: ${line}`);
    }
}
