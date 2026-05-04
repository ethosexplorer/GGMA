const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');

const files = fs.readdirSync(dir).filter(f => f.endsWith('Dashboard.tsx') || f.endsWith('Layout.tsx'));

let totalRemoved = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // This regex looks for buttons containing "MASTER SIGN OUT" or "LOG OUT" or "SIGN OUT" near the bottom of sidebars
  // Since JSX can span multiple lines, we can match the `<button ... onClick={onLogout}...> ... </button>`
  // Or we can just look for the typical pattern of the sidebar footer button
  
  const originalLength = content.length;
  
  // Replace standard block
  content = content.replace(/<button[^>]*onClick=\{onLogout\}[^>]*>[\s\S]*?(?:MASTER\s+SIGN\s+OUT|SIGN\s+OUT|LOG\s+OUT|Logout)[\s\S]*?<\/button>/gi, '');
  
  // Also look for ones that use `LogOut` icon and `onLogout` prop
  content = content.replace(/<button[^>]*onClick=\{onLogout\}[^>]*>[\s\S]*?<LogOut[\s\S]*?<\/button>/gi, '');

  if (content.length !== originalLength) {
    fs.writeFileSync(filePath, content);
    console.log(`Removed logout button from ${file}`);
    totalRemoved++;
  }
}

console.log(`Done. Modified ${totalRemoved} files.`);
