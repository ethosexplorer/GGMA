import fs from 'fs';

const content = fs.readFileSync('c:/GGMA/GGMA/src/App.tsx', 'utf8');

function findUnclosedTag(text) {
    let stack = [];
    let i = 0;
    while (i < text.length) {
        // Find next <
        if (text[i] === '<') {
            // Check if it's a tag or a generic
            // A tag starts with a letter or /
            if (text[i+1] === '/' || /^[a-zA-Z]/.test(text[i+1])) {
                // Peek ahead to see if it's a generic in a type definition
                // e.g. useState<string> or Component<any, any>
                // Heuristic: if it's preceded by a name or 'extends', it's likely a generic
                let prevWord = text.substring(0, i).trim().split(/[\s,;(){}[\]]/).pop();
                if (['useState', 'extends', 'Component', 'Record', 'Partial', 'Omit', 'Pick'].includes(prevWord)) {
                    // Skip generic
                    let depth = 1;
                    i++;
                    while (i < text.length && depth > 0) {
                        if (text[i] === '<') depth++;
                        if (text[i] === '>') depth--;
                        i++;
                    }
                    continue;
                }

                if (text[i+1] === '/') {
                    // Closing tag
                    let j = i + 2;
                    while (j < text.length && text[j] !== '>') j++;
                    let tag = text.substring(i + 2, j).split(' ')[0].split('\n')[0].trim();
                    if (stack.length > 0) {
                        let last = stack.pop();
                        if (last.tag !== tag) {
                            console.log(`Mismatch at line ${text.substring(0, i).split('\n').length}: expected </${last.tag}> but found </${tag}>`);
                        }
                    } else {
                        console.log(`Unexpected closing tag </${tag}> at line ${text.substring(0, i).split('\n').length}`);
                    }
                    i = j;
                } else {
                    // Opening tag
                    let j = i + 1;
                    let inString = false;
                    let stringChar = '';
                    let isSelfClosing = false;
                    let braceCount = 0;
                    
                    while (j < text.length) {
                        const char = text[j];
                        if (braceCount > 0) {
                            if (char === '{') braceCount++;
                            if (char === '}') braceCount--;
                            j++;
                            continue;
                        }
                        if (char === '{') {
                            braceCount++;
                            j++;
                            continue;
                        }
                        if (inString) {
                            if (char === stringChar && text[j-1] !== '\\') inString = false;
                            j++;
                            continue;
                        }
                        if (char === '"' || char === "'") {
                            inString = true;
                            stringChar = char;
                            j++;
                            continue;
                        }
                        if (char === '/' && text[j+1] === '>') {
                            isSelfClosing = true;
                            j++;
                            break;
                        }
                        if (char === '>') break;
                        j++;
                    }
                    
                    let tagFull = text.substring(i + 1, j).trim();
                    let tag = tagFull.split(' ')[0].split('\n')[0].trim();
                    
                    if (!isSelfClosing && !['img', 'input', 'br', 'hr', 'link', 'meta'].includes(tag.toLowerCase()) && /^[A-Z]/.test(tag) || ['div', 'span', 'main', 'aside', 'nav', 'header', 'footer', 'button', 'form', 'label', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'p', 'dt', 'dd', 'details', 'summary', 'svg', 'path'].includes(tag)) {
                        stack.push({ tag, line: text.substring(0, i).split('\n').length });
                    }
                    i = j;
                }
            }
        }
        i++;
    }
    
    console.log('Open tags at end:');
    stack.forEach(s => console.log(`${s.tag} (line ${s.line})`));
}

findUnclosedTag(content);
