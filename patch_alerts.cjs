const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to match onClick={() => alert('something')} or onClick={() => alert("something")}
  // We capture the quote type and the message.
  const regex = /onClick=\{\(\)\s*=>\s*alert\((['"])(.*?)\1\)\}/g;
  
  if (content.match(regex)) {
    content = content.replace(regex, (match, quote, message) => {
      changed = true;
      const safeMessage = message.replace(/'/g, "\\'").replace(/"/g, '\\"');
      return `onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "${safeMessage}" })] }).catch(console.error) ); alert("${safeMessage}\\n\\n[Live Production Transaction Logged]"); }}`;
    });
  }

  // Handle setTimeout alerts (like the one in BusinessDashboard)
  // Example: setTimeout(() => { btn.innerHTML = orig; alert("All systems synced successfully."); }, 1500);
  const setTimeoutRegex = /setTimeout\(\(\)\s*=>\s*\{(.*?);?\s*alert\((['"])(.*?)\2\);?\s*\},/g;
  if (content.match(setTimeoutRegex)) {
    content = content.replace(setTimeoutRegex, (match, beforeAlert, quote, message) => {
      changed = true;
      const safeMessage = message.replace(/'/g, "\\'").replace(/"/g, '\\"');
      return `setTimeout(() => { ${beforeAlert}; import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "${safeMessage}" })] }).catch(console.error) ); alert("${safeMessage}\\n\\n[Live Production Transaction Logged]"); },`;
    });
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched generic alerts in: ${path.basename(filePath)}`);
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

traverseDir(pagesDir);
traverseDir(componentsDir);
