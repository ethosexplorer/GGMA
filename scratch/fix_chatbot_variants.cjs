const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix isGeneral logic
content = content.replace(
  "const isGeneral = variant === 'general' || variant === 'ggma' || variant === 'ggma-patient' || variant === 'rip' || variant === 'sinc' || variant === 'provider' || variant === 'government' || variant === 'advocate';",
  "const isGeneral = variant === 'general' || variant === 'ggma' || variant === 'ggma-patient' || variant === 'rip' || variant === 'sinc' || variant === 'provider' || variant === 'government' || variant === 'political_executive' || variant === 'advocate' || variant === 'advocacy_research' || variant === 'legal' || variant === 'attorney';"
);

// Fix getGreeting
content = content.replace(
  "if (variant === 'legal') return",
  "if (variant === 'legal' || variant === 'attorney') return"
);
content = content.replace(
  "if (isRyan && variant !== 'legal')",
  "if (isRyan && variant !== 'legal' && variant !== 'attorney')"
);
content = content.replace(
  "if (isMonica && variant !== 'legal')",
  "if (isMonica && variant !== 'legal' && variant !== 'attorney')"
);
content = content.replace(
  "if (isBob && variant !== 'legal')",
  "if (isBob && variant !== 'legal' && variant !== 'attorney')"
);
content = content.replace(
  "if (isFounderAssistant && variant !== 'legal' && variant !== 'business')",
  "if (isFounderAssistant && variant !== 'legal' && variant !== 'attorney' && variant !== 'business')"
);

content = content.replace(
  "if (variant === 'government') return",
  "if (variant === 'government' || variant === 'political_executive') return"
);

content = content.replace(
  "if (variant === 'advocate') return",
  "if (variant === 'advocate' || variant === 'advocacy_research') return"
);

// Fix getInitialChoices
content = content.replace(
  "if (variant === 'legal') return",
  "if (variant === 'legal' || variant === 'attorney') return"
);

content = content.replace(
  "if (variant === 'government') return",
  "if (variant === 'government' || variant === 'political_executive') return"
);

content = content.replace(
  "if (variant === 'advocate') return",
  "if (variant === 'advocate' || variant === 'advocacy_research') return"
);

fs.writeFileSync(path, content);
console.log('Fixed variant routing in LarryMedCardChatbot');
