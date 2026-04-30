const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  "  const getInitialChoices = () => {\n    if (variant === 'ggma')",
  "  const getInitialChoices = () => {\n    if (isFounderAssistant) return ['View Daily Summary', 'State News Briefing', 'My Appointments', 'Pending Approvals', 'Send Broadcast'];\n    if (variant === 'ggma')"
);

const matchStart = "  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string, choices?: string[]}[]>([\n    { role: 'bot', text: ";
if (c.includes(matchStart)) {
    // We can replace the initial state with a lazy initialization function to ensure it captures `isFounderAssistant` properly when the component mounts.
    c = c.replace(
      "  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string, choices?: string[]}[]>([\n    { role: 'bot', text: '",
      "  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string, choices?: string[]}[]>(() => [\n    { role: 'bot', text: isFounderAssistant ? getGreeting() : '"
    );
    c = c.replace(
      "    ] }\n  ]);",
      "    ] }\n  ]);\n\n  // Need to update choices properly"
    );
}

fs.writeFileSync('src/App.tsx', c);
