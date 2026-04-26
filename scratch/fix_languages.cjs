const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
let changed = false;

// ── Fix 1: Remove left-side language flags from the dark bar ──
// Replace the left side content with just a simple label
const oldLeftSide = `<div className="flex items-center gap-3">
          <Globe size={14} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Speak Your Language:</span>
          <div className="flex items-center gap-1">
            {[
              { code: 'en', flag: '🇺🇸', label: 'EN' },
              { code: 'es', flag: '🇲🇽', label: 'ES' },
              { code: 'zh-CN', flag: '🇨🇳', label: '中文' },
              { code: 'vi', flag: '🇻🇳', label: 'VI' },
              { code: 'ko', flag: '🇰🇷', label: '한' },
              { code: 'ar', flag: '🇸🇦', label: 'عر' },
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => { 
                  if (lang.code === 'en') {
                    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
                  } else {
                    document.cookie = \`googtrans=/en/\${lang.code}; path=/;\`;
                    document.cookie = \`googtrans=/en/\${lang.code}; path=/; domain=\` + window.location.hostname;
                  }
                  window.location.reload();
                }}
                className="px-2 py-1 rounded-md text-xs hover:bg-white/10 transition-colors text-white/80 hover:text-white flex items-center gap-1"
              >
                <span>{lang.flag}</span>
                <span className="text-[9px] font-bold hidden md:inline">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>`;

// Find it in the file
const lines = c.split('\n');
const globeLineIdx = lines.findIndex(l => l.includes("Globe size={14}") && l.includes("text-emerald-400"));
if (globeLineIdx >= 0) {
  console.log(`Found Globe line at ${globeLineIdx + 1}`);
  // Find the closing </div> for the left side (the one right before the right side starts)
  // The right side starts with <div className="flex items-center gap-3"> containing jurisdiction
  let depth = 0;
  let startIdx = globeLineIdx - 1; // the <div className="flex items-center gap-3">
  let endIdx = -1;
  
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    depth += opens - closes;
    if (depth <= 0 && i > startIdx) {
      endIdx = i;
      break;
    }
  }
  
  if (endIdx > 0) {
    console.log(`Removing left-side flags: lines ${startIdx + 1} to ${endIdx + 1}`);
    // Replace with a simple label
    const newLeftSide = '        <div className="flex items-center gap-3">\n          <Globe size={14} className="text-emerald-400" />\n          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Speak Your Language</span>\n        </div>';
    lines.splice(startIdx, endIdx - startIdx + 1, newLeftSide);
    c = lines.join('\n');
    changed = true;
    console.log('✅ Removed left-side language flags');
  }
}

// ── Fix 2: Reduce Sylara chatbot language choices to 6 defaults + "More Languages..." ──
const oldChoices = `'English', 'Español', 'Português', 'Français', 'Kreyòl Ayisyen', '中文(简体)', '中文(繁體)', 'Tiếng Việt', '한국어', '日本語', 'Tagalog', 'Hmoob', 'हिन्दी', 'اردو', 'ဗမာစာ', 'ไทย', 'العربية', 'Soomaali', 'አማርኛ', 'Kiswahili', 'Deutsch', 'Italiano', 'Русский', 'Polski', 'Українська', 'Română', 'Diné Bizaad'`;
const newChoices = `'English', 'Español', '中文(简体)', 'Tiếng Việt', '한국어', 'العربية', '+ More Languages...'`;

if (c.includes(oldChoices)) {
  c = c.replace(oldChoices, newChoices);
  changed = true;
  console.log('✅ Reduced chatbot language choices to 6 defaults + More');
} else {
  console.log('❌ Could not find chatbot language choices');
}

if (changed) {
  fs.writeFileSync('src/App.tsx', c, 'utf8');
  console.log('✅ File saved');
} else {
  console.log('❌ No changes made');
}
