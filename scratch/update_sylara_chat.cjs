const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const old1 = `         } else {
            // Using LIVE Gemini Integration
            try {
               botResponse = await generateGeminiResponse(userMessage, 'general', messages.filter(m => m.role !== 'system'));
            } catch (err) {
               botResponse = 'I am your Assistant. Try asking about specific US States to get Cannabis regulations, portals, and guides. (Gemini AI service unavailable)';
            }
         }
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);`;

const new1 = `         } else if (lowerQuery.includes('upgrade') || lowerQuery.includes('subscription') || lowerQuery.includes('plan')) {
            botResponse = 'You can upgrade your subscription directly from the Pricing portal. Tap "Subscription/Add-ons" in your dashboard menu or ask your admin. We offer scalable plans for any size operation. Let me know if you need help selecting a tier!';
         } else if (lowerQuery.includes('add-on') || lowerQuery.includes('addons') || lowerQuery.includes('purchase') || lowerQuery.includes('single')) {
            botResponse = 'We offer modular enhancements like Premium AI Guidance, Provider Connections, and Disposable Cards that you can purchase as single-use without a full subscription. Navigate to the "Available Single/Add-on" section below the pricing tiers to checkout securely.';
         } else {
            // Using LIVE Gemini Integration
            try {
               botResponse = await generateGeminiResponse(userMessage, 'general', messages.filter(m => m.role !== 'system'));
            } catch (err) {
               botResponse = 'I am your Assistant. Try asking about specific US States to get Cannabis regulations, portals, and guides. (Gemini AI service unavailable)';
            }
         }
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);`;

const old2 = `                <div className="p-3 bg-white border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about Cannabis rules..."
                      className="flex-1 px-3 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:bg-white"
                    />
                    <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-2 bg-[#0D6EFD] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </form>
                </div>`;

const new2 = `                <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    <button onClick={(e) => { e.preventDefault(); setInputValue("Upgrade Subscription"); handleSendMessage(undefined, "Upgrade Subscription"); }} className="shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest">Upgrade Plan</button>
                    <button onClick={(e) => { e.preventDefault(); setInputValue("Purchase Add-ons"); handleSendMessage(undefined, "Purchase Add-ons"); }} className="shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest">Purchase Add-ons</button>
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about Cannabis rules..."
                      className="flex-1 px-3 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:bg-white"
                    />
                    <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-2 bg-[#0D6EFD] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </form>
                </div>`;

if (content.includes(old1)) {
    content = content.replace(old1, new1);
    console.log('Replaced 1');
} else {
    console.log('Failed to replace 1');
}

if (content.includes(old2)) {
    content = content.replace(old2, new2);
    console.log('Replaced 2');
} else {
    console.log('Failed to replace 2');
}

fs.writeFileSync(path, content, 'utf8');
