const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// Add "More Languages" handler at the top of handleSend, right after the initial checks
const anchor = "// Handle Subscription / Pricing Keywords";
const newCode = `// Handle "More Languages" expansion
    if (lower === '+ more languages...' || lower.includes('more languages')) {
      setMessages(prev => {
        const updated = [...prev];
        // Remove the user's "More Languages" message
        updated.pop();
        // Replace the initial language choices with expanded list
        updated[0] = { 
          role: 'bot', 
          text: '🌎 **Welcome! / ¡Bienvenidos! / 欢迎 / Hoan nghênh**\\n\\nBefore we begin, please select your preferred language:', 
          choices: [
            'English', 'Español', '中文(简体)', 'Tiếng Việt', '한국어', 'العربية',
            'Português', 'Français', 'Kreyòl Ayisyen', '中文(繁體)', '日本語', 'Tagalog', 
            'Hmoob', 'हिन्दी', 'اردو', 'ဗမာစာ', 'ไทย', 'Soomaali', 
            'አማርኛ', 'Kiswahili', 'Deutsch', 'Italiano', 'Русский', 'Polski', 
            'Українська', 'Română', 'Diné Bizaad'
          ] 
        };
        return updated;
      });
      setIsTyping(false);
      return;
    }

    ` + anchor;

if (c.includes(anchor)) {
  c = c.replace(anchor, newCode);
  fs.writeFileSync('src/App.tsx', c, 'utf8');
  console.log('✅ Added More Languages handler');
} else {
  console.log('❌ Could not find anchor');
}
