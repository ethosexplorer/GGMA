import fs from 'fs';

const content = fs.readFileSync('c:/GGMA/GGMA/src/App.tsx', 'utf8');

function checkBalance(text) {
    let braces = 0;
    let brackets = 0;
    let parens = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (inString) {
            if (char === stringChar && text[i-1] !== '\\') {
                inString = false;
            }
            continue;
        }
        
        if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
            continue;
        }
        
        if (char === '{') braces++;
        if (char === '}') braces--;
        if (char === '[') brackets++;
        if (char === ']') brackets--;
        if (char === '(') parens++;
        if (char === ')') parens--;
        
        if (braces < 0 || brackets < 0 || parens < 0) {
            console.log(`Unbalanced at char ${i} (line ${text.substring(0, i).split('\n').length}): braces=${braces}, brackets=${brackets}, parens=${parens}`);
        }
    }
    
    console.log(`Final balance: braces=${braces}, brackets=${brackets}, parens=${parens}`);
}

checkBalance(content);
