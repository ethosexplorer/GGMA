const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/GGMA/GGMA/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('CheckCircle2')) {
        // First, replace usage of CheckCircle2 with CircleCheck
        content = content.replace(/<CheckCircle2/g, '<CircleCheck');
        content = content.replace(/icon={CheckCircle2}/g, 'icon={CircleCheck}');
        content = content.replace(/icon:\s*CheckCircle2/g, 'icon: CircleCheck');
        
        // Let's handle the import statements carefully
        // Find the lucide-react import block
        const lucideImportRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/;
        const match = content.match(lucideImportRegex);
        
        if (match) {
            let imports = match[1];
            if (imports.includes('CheckCircle2')) {
                // remove CheckCircle2
                imports = imports.replace(/CheckCircle2\s*,?\s*/g, '');
                
                // add CircleCheck if not present
                if (!imports.includes('CircleCheck')) {
                    imports = imports.trim();
                    if (imports.endsWith(',')) {
                        imports += ' CircleCheck';
                    } else if (imports.length > 0) {
                        imports += ', CircleCheck';
                    } else {
                        imports = 'CircleCheck';
                    }
                }
                
                content = content.replace(lucideImportRegex, `import { ${imports} } from 'lucide-react'`);
            }
        }
        
        // Catch any leftover CheckCircle2 just in case
        content = content.replace(/CheckCircle2/g, 'CircleCheck');
        
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed:', file);
    }
});
