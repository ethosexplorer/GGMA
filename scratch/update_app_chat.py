import os

path = 'src/App.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1
old1 = "         } else {\n            // Using LIVE Gemini Integration"
new1 = "         } else if (lowerQuery.includes('upgrade') || lowerQuery.includes('subscription') || lowerQuery.includes('plan')) {\n            botResponse = 'You can upgrade your subscription directly from the Pricing portal. Tap \"Subscription/Add-ons\" in your dashboard menu or ask your admin. We offer scalable plans for any size operation. Let me know if you need help selecting a tier!';\n         } else if (lowerQuery.includes('add-on') || lowerQuery.includes('addons') || lowerQuery.includes('purchase') || lowerQuery.includes('single')) {\n            botResponse = 'We offer modular enhancements like Premium AI Guidance, Provider Connections, and Disposable Cards that you can purchase as single-use without a full subscription. Navigate to the \"Available Single/Add-on\" section below the pricing tiers to checkout securely.';\n         } else {\n            // Using LIVE Gemini Integration"

if old1 in content:
    content = content.replace(old1, new1)
    print("Replaced 1 (LF)")
elif old1.replace('\n', '\r\n') in content:
    content = content.replace(old1.replace('\n', '\r\n'), new1.replace('\n', '\r\n'))
    print("Replaced 1 (CRLF)")

# Replace 2
old2 = "                <div className=\"p-3 bg-white border-t border-slate-100\">\n                  <form onSubmit={handleSendMessage} className=\"flex gap-2\">"
new2 = "                <div className=\"p-3 bg-white border-t border-slate-100 flex flex-col gap-2\">\n                  <div className=\"flex gap-2 overflow-x-auto hide-scrollbar pb-1\">\n                    <button onClick={(e) => { e.preventDefault(); setInputValue(\"Upgrade Subscription\"); handleSendMessage(undefined, \"Upgrade Subscription\"); }} className=\"shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest\">Upgrade Plan</button>\n                    <button onClick={(e) => { e.preventDefault(); setInputValue(\"Purchase Add-ons\"); handleSendMessage(undefined, \"Purchase Add-ons\"); }} className=\"shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest\">Purchase Add-ons</button>\n                  </div>\n                  <form onSubmit={handleSendMessage} className=\"flex gap-2\">"

if old2 in content:
    content = content.replace(old2, new2)
    print("Replaced 2 (LF)")
elif old2.replace('\n', '\r\n') in content:
    content = content.replace(old2.replace('\n', '\r\n'), new2.replace('\n', '\r\n'))
    print("Replaced 2 (CRLF)")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
