const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const tursoFile = path.join(srcDir, 'lib', 'turso.ts');

function getCorrectImportPath(fromFile) {
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, path.join(srcDir, 'lib', 'turso')).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Match any dynamic import to turso with wrong path
  const regex = /import\(['"]([^'"]*turso)['"]\)/g;
  let changed = false;
  
  const correctPath = getCorrectImportPath(filePath);
  
  content = content.replace(regex, (match, importPath) => {
    if (importPath === correctPath) return match; // already correct
    changed = true;
    return `import('${correctPath}')`;
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${path.relative(srcDir, filePath)} -> import('${correctPath}')`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) processFile(full);
  }
}

walk(srcDir);
console.log('\nDone. All turso import paths are now correct relative to each file.');
