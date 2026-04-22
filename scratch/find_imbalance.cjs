const fs = require('fs');

const content = fs.readFileSync('c:/GGMA/GGMA/src/pages/FounderDashboard.tsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if (balance === 0 && i > 100) {
        console.log(`Balance hit 0 at line ${i + 1}: ${line}`);
        // Let's keep going to see if it becomes 0 again.
    }
}
