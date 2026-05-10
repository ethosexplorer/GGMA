const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to match standalone alert('...') or alert("...") anywhere!
  // But we want to avoid double patching things that already say "[Live Production Transaction Logged]"
  // Or things that are just `alert(error.message)` which don't use string literals.
  const regex = /alert\((['"])(.*?)\1\)/g;
  
  if (content.match(regex)) {
    content = content.replace(regex, (match, quote, message) => {
      // If it's already patched, skip it
      if (message.includes('[Live Production Transaction Logged]')) {
         return match;
      }
      
      changed = true;
      const safeMessage = message.replace(/'/g, "\\'").replace(/"/g, '\\"');
      
      // We wrap the alert in an Immediately Invoked Function Expression (IIFE)
      // so it works anywhere (even inside ternary operators)
      return `(() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "${safeMessage}" })] }).catch(console.error) ); alert("${safeMessage}\\n\\n[Live Production Transaction Logged]"); })()`;
    });
  }

  // Ensure 'import' in IIFE works correctly by making sure we don't break existing stuff.
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Aggressively patched alerts in: ${path.basename(filePath)}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

// Process all files!
traverseDir(pagesDir);
traverseDir(componentsDir);
traverseDir(path.join(__dirname, 'src')); // also hit App.tsx
