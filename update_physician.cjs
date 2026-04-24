const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `    } else if (lower.includes('medical card evaluation') || lower.includes('med card eval')) {
      window.open('https://calendly.com/globalgreenenterprize/15-min-meeting', '_blank');
      response = '💳 **Medical Card Evaluation ($45)**\\n\\nYour evaluation includes:\\n• **$35** — Physician Consultation\\n• **$10** — GGE Processing Fee\\n\\n📅 **Booking page opened!** If it didn\\'t open, click below:\\n🔗 [Book Online via Calendly](https://calendly.com/globalgreenenterprize/15-min-meeting)\\n\\n';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Patient Intake', 'I Already Scheduled', 'Main Menu'] } as any]);`;

const replace1 = `    } else if (lower.includes('medical card evaluation') || lower.includes('med card eval') || lower.includes('medical card')) {
      window.open('https://calendly.com/globalgreenenterprize/15-min-meeting', '_blank');
      response = '💳 **Medical Card Evaluation ($45)**\\n\\nYour evaluation includes:\\n• **$35** — Physician Consultation\\n• **$10** — GGE Processing Fee\\n\\n📅 **Booking page opened!** If it didn\\'t open, click below:\\n🔗 [Book Online via Calendly](https://calendly.com/globalgreenenterprize/15-min-meeting)\\n\\n📞 **Prefer to call?** Dial **1-405-492-7487**';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Patient Intake', 'I Already Scheduled', 'Main Menu'] } as any]);`;

app = app.split(target1).join(replace1);

const target2 = `    } else if (lower.includes('general telehealth wellness') || lower.includes('general telehealth')) {
      window.open('https://calendly.com/globalgreenenterprize/15-min-meeting', '_blank');
      response = '🏥 **General Telehealth Wellness Visit**\\n\\nConnect with a licensed physician for:\\n• Non-emergency consultations\\n• Follow-up visits\\n• Prescription management\\n• General health questions\\n\\n📅 **Booking page opened!** If it didn\\'t open, click below:\\n🔗 [Book Online via Calendly](https://calendly.com/globalgreenenterprize/15-min-meeting)\\n\\n';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);`;

const replace2 = `    } else if (lower.includes('general telehealth wellness') || lower.includes('general telehealth') || lower.includes('general health')) {
      window.open('https://calendly.com/globalgreenenterprize/15-min-meeting', '_blank');
      response = '🏥 **General Telehealth Wellness Visit**\\n\\nConnect with a licensed physician for:\\n• Non-emergency consultations\\n• Follow-up visits\\n• Prescription management\\n• General health questions\\n\\n📅 **Booking page opened!** If it didn\\'t open, click below:\\n🔗 [Book Online via Calendly](https://calendly.com/globalgreenenterprize/15-min-meeting)\\n\\n📞 **Prefer to call?** Dial **1-405-252-1178**';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);`;

app = app.split(target2).join(replace2);

const target3 = `    } else if (lower.includes('book physician') || lower.includes('doctor') || lower.includes('recommendation') || lower.includes('med card intake')) {
      response = '⚕️ **Physician Booking**\\n\\nWhat type of visit do you need?\\n\\n• **Medical Card Evaluation ($45)** — physician recommendation for OMMA card\\n• **General Telehealth Wellness** — non-emergency consultation\\n\\nSelect below to proceed! 📅';`;

const replace3 = `    } else if (lower.includes('book physician') || lower.includes('doctor') || lower.includes('recommendation') || lower.includes('med card intake') || lower.includes('patient licensing') || lower.includes('physician')) {
      response = '⚕️ **Physician Booking & Patient Licensing**\\n\\nWhat type of visit do you need?\\n\\n• **Medical Card Evaluation ($45)** — physician recommendation for OMMA card (Call: 1-405-492-7487)\\n• **General Telehealth Wellness** — non-emergency consultation (Call: 1-405-252-1178)\\n\\nSelect below to proceed to online booking! 📅';`;

app = app.split(target3).join(replace3);

fs.writeFileSync('src/App.tsx', app);
