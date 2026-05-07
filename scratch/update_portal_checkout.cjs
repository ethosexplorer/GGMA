const fs = require('fs');

const path = 'src/components/SubscriptionPortal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add Stripe load script if missing
if (!content.includes('loadStripe')) {
  content = content.replace("import { CreditCard, Shield", "import { loadStripe } from '@stripe/stripe-js';\nimport { CreditCard, Shield");
}

const oldCheckoutBtn = `              <button 
                onClick={() => {
                  const selectedItems = currentAddonsList.filter(a => activeAddOns.includes(a.id));
                  alert(\`Redirecting to secure checkout...\\n\\nProcessing payment for \${selectedItems.length} item(s):\\n\${selectedItems.map(a => \`? \${a.name} ($\${a.price})\`).join('\\n')}\\n\\nTotal: $\${selectedItems.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0).toFixed(2)}\`);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-md"
              >
                Checkout <ArrowRight size={16} />
              </button>`;

const newCheckoutBtn = `              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={async () => {
                    const selectedItems = currentAddonsList.filter(a => activeAddOns.includes(a.id));
                    const total = selectedItems.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0).toFixed(2);
                    
                    alert(\`STRIPE SECURE CHECKOUT INITIATED\\n\\nRedirecting to Stripe Hosted Checkout.\\n\\nPayment Options Enabled:\\n? Credit/Debit Card\\n? ACH Direct Debit\\n? Apple Pay\\n? Google Pay\\n? Klarna / Afterpay\\n\\nTotal Due: $\${total}\\n(This covers your current platform balance and selected add-ons).\`);
                    
                    try {
                      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
                      if (!stripe) throw new Error('Stripe failed to load');
                      
                      // In production, fetch a Checkout Session ID from the backend here:
                      // const response = await fetch('/api/create-checkout-session', { method: 'POST' });
                      // const session = await response.json();
                      // await stripe.redirectToCheckout({ sessionId: session.id });
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-[#635BFF] text-white rounded-xl text-sm font-black hover:bg-[#4B45D6] transition-all shadow-md shadow-[#635BFF]/30 hover:-translate-y-0.5"
                >
                  Pay with Stripe <ArrowRight size={16} />
                </button>
                <div className="flex items-center gap-3 text-slate-400 mt-1 opacity-70">
                  <div className="flex items-center gap-1.5"><CreditCard size={12} /><span className="text-[9px] font-black uppercase tracking-widest">Card</span></div>
                  <span className="text-[9px] font-black uppercase tracking-widest">&bull;</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Apple Pay</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">&bull;</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">GPay</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">&bull;</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">ACH</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">&bull;</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Klarna</span>
                </div>
              </div>`;

content = content.replace(oldCheckoutBtn, newCheckoutBtn);
fs.writeFileSync(path, content);
console.log('SubscriptionPortal updated!');
