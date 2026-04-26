const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
let changed = false;

// 1. Add id="c3-score" to the C³ Introduction Section so we can scroll to it
const oldSection = 'section className="py-24 px-6 bg-slate-900 bg-gradient-to-br from-slate-900 to-emerald-950 text-white relative overflow-hidden">';
const newSection = 'section id="c3-score" className="py-24 px-6 bg-slate-900 bg-gradient-to-br from-slate-900 to-emerald-950 text-white relative overflow-hidden">';
if (c.includes(oldSection)) {
  c = c.replace(oldSection, newSection);
  changed = true;
  console.log('✅ Added id="c3-score" to C³ section');
}

// 2. Change the button to scroll to the c3-score-details section (which we'll add below)
const oldClick = "onClick={() => { const el = document.getElementById('membership-tiers'); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } else { onNavigate('login'); } }}";
// Find the one near "View Your Score Potential"
const btnIdx = c.indexOf(oldClick);
if (btnIdx >= 0) {
  const context = c.substring(btnIdx, btnIdx + 300);
  if (context.includes('Score Potential')) {
    const newClick = "onClick={() => { const el = document.getElementById('c3-score-details'); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } }}";
    c = c.substring(0, btnIdx) + newClick + c.substring(btnIdx + oldClick.length);
    changed = true;
    console.log('✅ Changed button to scroll to c3-score-details');
  }
}

// 3. Add a detailed C³ explainer section right after the C³ intro section (before Maps & Stats)
const mapsAnchor = '{/* Maps & Stats Section */}';
const mapsIdx = c.indexOf(mapsAnchor);
if (mapsIdx >= 0) {
  const c3Details = `
      {/* C³ Score Deep Dive — What it does for YOU */}
      <section id="c3-score-details" className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 rounded-full border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
              ✨ C³ Score Explained
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              How C³ <span className="text-emerald-600">Works For You</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Your C³ Score is a living, real-time trust rating that measures Compassion, Compliance & Community across every interaction in the Global Green ecosystem. The higher your score, the more benefits you unlock.
            </p>
          </div>

          {/* How It's Calculated */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                score: 'Compassion', 
                emoji: '💚', 
                weight: '33%',
                color: 'from-teal-500 to-emerald-600',
                items: [
                  'Patient accessibility & social equity participation',
                  'Affordable pricing initiatives for underserved communities',
                  'Caregiver engagement & support network involvement',
                  'Charitable contributions & community health programs'
                ]
              },
              { 
                score: 'Compliance', 
                emoji: '🛡️', 
                weight: '34%',
                color: 'from-blue-500 to-indigo-600',
                items: [
                  'Real-time Metrc & seed-to-sale adherence',
                  'OMMA license status & renewal tracking',
                  'L.A.R.R.Y AI audit pass rates',
                  'Zero violations, zero diversions verified'
                ]
              },
              { 
                score: 'Community', 
                emoji: '🤝', 
                weight: '33%',
                color: 'from-purple-500 to-violet-600',
                items: [
                  'Platform engagement & educational course completion',
                  'Peer referrals & network growth',
                  'Community forum participation & feedback',
                  'Support ticket response quality & transparency'
                ]
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={\`w-14 h-14 rounded-2xl bg-gradient-to-br \${pillar.color} flex items-center justify-center text-2xl mb-5 shadow-lg\`}>
                  {pillar.emoji}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1">{pillar.score}</h3>
                <p className="text-emerald-600 text-xs font-bold mb-4 uppercase tracking-widest">{pillar.weight} of total score</p>
                <ul className="space-y-2.5">
                  {pillar.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Benefits by Tier */}
          <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-10 mb-16">
            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">Benefits by C³ Score Tier</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { tier: 'Bronze', range: '0-249', color: 'bg-amber-700', benefits: ['Basic platform access', 'Standard support', 'Community forums'] },
                { tier: 'Silver', range: '250-499', color: 'bg-slate-400', benefits: ['Priority support queue', 'Monthly compliance reports', '5% add-on discounts'] },
                { tier: 'Gold', range: '500-749', color: 'bg-amber-500', benefits: ['Dedicated account manager', 'Quarterly strategy review', '15% off renewals', 'Early feature access'] },
                { tier: 'Platinum', range: '750-1000', color: 'bg-emerald-600', benefits: ['White-glove onboarding', 'Custom API integrations', '25% lifetime discount', 'Advisory board invitation', 'Featured partner listing'] }
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                  <div className={\`w-10 h-10 rounded-xl \${t.color} flex items-center justify-center mb-4 shadow-sm\`}>
                    <Star size={18} className="text-white" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-1">{t.tier}</h4>
                  <p className="text-xs text-emerald-600 font-bold mb-4">{t.range} points</p>
                  <ul className="space-y-2">
                    {t.benefits.map((b, j) => (
                      <li key={j} className="text-xs text-slate-600 flex items-start gap-2">
                        <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Who it helps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50 rounded-[2rem] border border-emerald-200 p-8">
              <h3 className="text-xl font-black text-emerald-900 mb-4 flex items-center gap-2"><User size={20} /> For Patients</h3>
              <ul className="space-y-3 text-sm text-emerald-800">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Track your compliance journey — card renewals, physician visits, and care milestones</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Earn rewards for staying compliant and engaging with educational resources</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Higher scores unlock discounts at participating dispensaries</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Build a verified patient trust profile visible to your care team</li>
              </ul>
            </div>
            <div className="bg-slate-900 rounded-[2rem] border border-slate-700 p-8 text-white">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Building2 size={20} /> For Businesses</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Demonstrate audit readiness to OMMA and state regulators in real-time</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Reduce compliance violations and avoid costly fines with AI-driven monitoring</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Attract investors and partners with a verified, transparent trust score</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Qualify for reduced insurance premiums and preferred vendor listings</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button 
              onClick={() => document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
            >
              Start Building Your C³ Score
              <ArrowRight size={18} />
            </button>
            <p className="text-sm text-slate-500 mt-4 font-medium">Subscribe to any plan to begin earning your C³ Score</p>
          </div>
        </div>
      </section>

      `;
  
  c = c.substring(0, mapsIdx) + c3Details + c.substring(mapsIdx);
  changed = true;
  console.log('✅ Added C³ Score Details section');
}

if (changed) {
  fs.writeFileSync('src/App.tsx', c, 'utf8');
  console.log('✅ All changes saved');
} else {
  console.log('❌ No changes made');
}
