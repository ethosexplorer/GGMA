const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldOutdoorTable = `'| Tier | Acreage | Fee | Total w/ CC |\\n' +
        '|------|---------|-----|-------------|\\n' +
        '| Tier 1 | Up to 2.5 acres | $2,500 | $2,558.30 |\\n' +
        '| Tier 2 | 2.5–5 acres | $5,000 | $5,114.55 |\\n' +
        '| Tier 3 | 5–10 acres | $10,000 | $10,227.05 |\\n' +
        '| Tier 4 | 10–20 acres | $20,000 | $20,452.04 |\\n' +
        '| Tier 5 | 20–30 acres | $30,000 | $30,677.05 |\\n' +
        '| Tier 6 | 30–40 acres | $40,000 | $40,902.05 |\\n' +
        '| Tier 7 | 40–50 acres | $50,000 | $51,127.04 |\\n' +
        '| Tier 8 | 50+ acres | $50,000 + $250/acre | Varies |\\n\\n' +`;
const newOutdoorTable = `'• **Tier 1** (Up to 2.5 acres): **$2,500** _($2,558.30 w/ CC)_\\n' +
        '• **Tier 2** (2.5–5 acres): **$5,000** _($5,114.55 w/ CC)_\\n' +
        '• **Tier 3** (5–10 acres): **$10,000** _($10,227.05 w/ CC)_\\n' +
        '• **Tier 4** (10–20 acres): **$20,000** _($20,452.04 w/ CC)_\\n' +
        '• **Tier 5** (20–30 acres): **$30,000** _($30,677.05 w/ CC)_\\n' +
        '• **Tier 6** (30–40 acres): **$40,000** _($40,902.05 w/ CC)_\\n' +
        '• **Tier 7** (40–50 acres): **$50,000** _($51,127.04 w/ CC)_\\n' +
        '• **Tier 8** (50+ acres): **$50,000 + $250/acre**\\n\\n' +`;
app = app.replace(oldOutdoorTable, newOutdoorTable);

const oldProcessorTable = `'| Tier | Production Volume | Fee | Total w/ CC |\\n' +
        '|------|------------------|-----|-------------|\\n' +
        '| Tier 1 | Up to 10,000 lbs biomass / 100L concentrate | $2,500 | $2,558.30 |\\n' +
        '| Tier 2 | 10,001–50,000 lbs / 101–350L | $5,000 | $5,114.55 |\\n' +
        '| Tier 3 | 50,001–150,000 lbs / 351–650L | $10,000 | $10,227.05 |\\n' +
        '| Tier 4 | 150,001–300,000 lbs / 651–1,000L | $15,000 | $15,339.55 |\\n' +
        '| Tier 5 | 300,001+ lbs / 1,001L+ | $20,000 | $20,452.04 |\\n\\n' +`;
const newProcessorTable = `'• **Tier 1** (Up to 10k lbs / 100L): **$2,500** _($2,558.30 w/ CC)_\\n' +
        '• **Tier 2** (10k–50k lbs / 101–350L): **$5,000** _($5,114.55 w/ CC)_\\n' +
        '• **Tier 3** (50k–150k lbs / 351–650L): **$10,000** _($10,227.05 w/ CC)_\\n' +
        '• **Tier 4** (150k–300k lbs / 651–1k L): **$15,000** _($15,339.55 w/ CC)_\\n' +
        '• **Tier 5** (300k+ lbs / 1,001L+): **$20,000** _($20,452.04 w/ CC)_\\n\\n' +`;
app = app.replace(oldProcessorTable, newProcessorTable);

const oldIndoorTable = `'| Tier | Canopy Size | Fee | Total w/ CC |\\n' +
        '|------|------------|-----|-------------|\\n' +
        '| Tier 1 | Up to 10,000 sq ft | $2,500 | $2,558.30 |\\n' +
        '| Tier 2 | 10,001–20,000 sq ft | $5,000 | $5,114.55 |\\n' +
        '| Tier 3 | 20,001–40,000 sq ft | $10,000 | $10,227.05 |\\n' +
        '| Tier 4 | 40,001–60,000 sq ft | $20,000 | $20,452.04 |\\n' +
        '| Tier 5 | 60,001–80,000 sq ft | $30,000 | $30,677.05 |\\n' +
        '| Tier 6 | 80,001–99,999 sq ft | $40,000 | $40,902.05 |\\n' +
        '| Tier 7 | 100,000+ sq ft | $50,000 + $0.25/sq ft | Varies |\\n\\n' +`;
const newIndoorTable = `'• **Tier 1** (Up to 10k sq ft): **$2,500** _($2,558.30 w/ CC)_\\n' +
        '• **Tier 2** (10k–20k sq ft): **$5,000** _($5,114.55 w/ CC)_\\n' +
        '• **Tier 3** (20k–40k sq ft): **$10,000** _($10,227.05 w/ CC)_\\n' +
        '• **Tier 4** (40k–60k sq ft): **$20,000** _($20,452.04 w/ CC)_\\n' +
        '• **Tier 5** (60k–80k sq ft): **$30,000** _($30,677.05 w/ CC)_\\n' +
        '• **Tier 6** (80k–99,999 sq ft): **$40,000** _($40,902.05 w/ CC)_\\n' +
        '• **Tier 7** (100k+ sq ft): **$50,000 + $0.25/sq ft**\\n\\n' +`;
app = app.replace(oldIndoorTable, newIndoorTable);

fs.writeFileSync('src/App.tsx', app);

let founder = fs.readFileSync('src/pages/FounderDashboard.tsx', 'utf8');

const oldLegend = `        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-purple-600"></div>
             <span className="text-xs font-bold text-slate-700">Direct Priority (Shantell)</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
             <span className="text-xs font-bold text-slate-700">RIP Intelligence / Ops</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-amber-500"></div>
             <span className="text-xs font-bold text-slate-700">SINC / Business Compliance</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
             <span className="text-xs font-bold text-slate-700">Telehealth / Patients</span>
          </div>
        </div>`;

const newLegend = `        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-purple-600"></div>
             <span className="text-xs font-bold text-slate-700">Direct Priority (Shantell)</span>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
             <span className="text-xs font-bold text-slate-700">RIP Intel / Ops</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-amber-500"></div>
             <span className="text-xs font-bold text-slate-700">SINC / Compliance</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
             <span className="text-xs font-bold text-slate-700">Telehealth</span>
          </div>
          <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
             <span className="text-xs font-bold text-slate-700">State Authority</span>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
             <div className="w-4 h-4 rounded-full bg-red-600"></div>
             <span className="text-xs font-bold text-slate-700">Federal Oversight</span>
          </div>
        </div>`;
founder = founder.replace(oldLegend, newLegend);

const oldMockData = `           {[
             { time: 'Today, 10:00 AM', t: 'Direct Escalation (Human Coord)', e: 'Apex Health CEO', c: 'bg-purple-100 border-purple-200 text-purple-900', dot: 'bg-purple-600', type: 'Call' },
             { time: 'Today, 1:30 PM', t: 'Business License Review', e: 'GreenLeaf Farms', c: 'bg-amber-50 border-amber-200 text-amber-900', dot: 'bg-amber-500', type: 'Appointment' },
             { time: 'Today, 3:00 PM', t: 'Metrc Integration Sync', e: 'SINC Tech Team', c: 'bg-amber-50 border-amber-200 text-amber-900', dot: 'bg-amber-500', type: 'Ticket' },
             { time: 'Tomorrow, 9:00 AM', t: 'Field Intel Briefing', e: 'OK-Sector Enforcement', c: 'bg-indigo-50 border-indigo-200 text-indigo-900', dot: 'bg-indigo-600', type: 'Appointment' },
             { time: 'Tomorrow, 11:15 AM', t: 'Telehealth Escalation', e: 'Dr. Smith', c: 'bg-emerald-50 border-emerald-200 text-emerald-900', dot: 'bg-emerald-500', type: 'Call' },
           ]`;

const newMockData = `           {[
             { time: 'Today, 10:00 AM', t: 'Direct Escalation (Human Coord)', e: 'Apex Health CEO', c: 'bg-purple-100 border-purple-200 text-purple-900', dot: 'bg-purple-600', type: 'Call' },
             { time: 'Today, 1:30 PM', t: 'OMMA State Regulator Review', e: 'Emily Davis (OK)', c: 'bg-cyan-50 border-cyan-200 text-cyan-900', dot: 'bg-cyan-500', type: 'Call' },
             { time: 'Today, 3:00 PM', t: 'Metrc Integration Sync', e: 'SINC Tech Team', c: 'bg-amber-50 border-amber-200 text-amber-900', dot: 'bg-amber-500', type: 'Ticket' },
             { time: 'Tomorrow, 9:00 AM', t: 'DOJ Intel Review', e: 'Federal Oversight Office', c: 'bg-red-50 border-red-200 text-red-900', dot: 'bg-red-600', type: 'Appointment' },
             { time: 'Tomorrow, 11:15 AM', t: 'Telehealth Escalation', e: 'Dr. Smith', c: 'bg-emerald-50 border-emerald-200 text-emerald-900', dot: 'bg-emerald-500', type: 'Call' },
           ]`;
founder = founder.replace(oldMockData, newMockData);

fs.writeFileSync('src/pages/FounderDashboard.tsx', founder);
