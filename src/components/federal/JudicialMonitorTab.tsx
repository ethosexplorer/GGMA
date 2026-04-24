import React, { useState } from 'react';
import { Scale, Search, ExternalLink, Shield, TrendingUp, AlertTriangle, CheckCircle2, Clock, MapPin, Gavel, Users, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

const LANDMARK_CASES = [
  {
    title: 'United States v. McIntosh (9th Cir. 2016)',
    court: '9th Circuit Court of Appeals',
    status: 'Precedent Set',
    outcome: 'Favorable',
    summary: 'Congress cannot spend funds to prosecute state-legal medical marijuana operations. Established the Rohrabacher-Blumenauer amendment as enforceable protection.',
    impact: 'High',
    date: '2016',
    tags: ['Federal Protection', 'Spending Clause', 'Medical'],
  },
  {
    title: 'Gonzales v. Raich (2005)',
    court: 'U.S. Supreme Court',
    status: 'Decided',
    outcome: 'Unfavorable',
    summary: 'Federal government can criminalize cannabis even where states have legalized it under the Commerce Clause. Still standing but weakened by rescheduling.',
    impact: 'Critical',
    date: '2005',
    tags: ['Commerce Clause', 'Federal Supremacy', 'SCOTUS'],
  },
  {
    title: 'Washington v. Sessions (2018)',
    court: 'S.D.N.Y. Federal District',
    status: 'Dismissed',
    outcome: 'Mixed',
    summary: 'Challenge to Schedule I classification. While dismissed on standing, Judge Hellerstein noted the government\'s position was "at odds with reality."',
    impact: 'Moderate',
    date: '2018',
    tags: ['Scheduling', 'Standing', 'Classification'],
  },
  {
    title: 'State v. Nelson (OK 2023)',
    court: 'Oklahoma Supreme Court',
    status: 'Decided',
    outcome: 'Favorable',
    summary: 'Affirmed that OMMA-licensed patients cannot be denied employment solely based on medical marijuana card status under state anti-discrimination protections.',
    impact: 'High',
    date: '2023',
    tags: ['Employment', 'Patient Rights', 'Oklahoma'],
  },
  {
    title: 'Safe Streets Alliance v. Hickenlooper (10th Cir. 2017)',
    court: '10th Circuit Court of Appeals',
    status: 'Dismissed',
    outcome: 'Favorable',
    summary: 'Anti-cannabis neighboring landowners failed to prove standing to challenge Colorado\'s legalization. Preserved state\'s right to regulate.',
    impact: 'Moderate',
    date: '2017',
    tags: ['State Rights', 'Standing', 'Legalization'],
  },
  {
    title: 'DOJ/DEA Final Order — Schedule III (2026)',
    court: 'Federal Administrative',
    status: 'Active / Final',
    outcome: 'Favorable',
    summary: 'Acting Attorney General signed final order reclassifying state-licensed medical marijuana from Schedule I to Schedule III. Eliminates 280E tax burden and opens banking.',
    impact: 'Critical',
    date: 'April 2026',
    tags: ['Rescheduling', '280E', 'Banking', 'DEA'],
  },
];

const JUDICIAL_PROFILES = [
  {
    name: 'Judge James P. Jones',
    court: 'W.D. Virginia',
    stance: 'Reform-Leaning',
    note: 'Has publicly questioned disproportionate sentencing for cannabis offenses. Issued reduced sentences citing "evolving societal understanding."',
    cases: 12,
    color: 'emerald',
  },
  {
    name: 'Judge Frederic Block',
    court: 'E.D. New York',
    stance: 'Pro-Reform',
    note: 'Authored opinion criticizing federal cannabis policy as "a relic of a bygone era." Advocated for expungement of minor possession records.',
    cases: 8,
    color: 'emerald',
  },
  {
    name: 'Judge Reggie Walton',
    court: 'D.C. District Court',
    stance: 'Moderate',
    note: 'Former drug court judge who has evolved on sentencing reform. Supports diversion programs over incarceration for cannabis offenses.',
    cases: 15,
    color: 'amber',
  },
  {
    name: 'Justice Clarence Thomas',
    court: 'U.S. Supreme Court',
    stance: 'States\' Rights',
    note: 'In his 2021 dissent (Standing Akimbo v. US), stated federal cannabis enforcement is "contradictory and unstable" and questioned the government\'s half-in, half-out approach.',
    cases: 3,
    color: 'blue',
  },
  {
    name: 'Judge Katherine Forrest',
    court: 'S.D. New York (Ret.)',
    stance: 'Pro-Reform',
    note: 'Known for questioning the constitutionality of Schedule I classification. Authored influential commentary on cannabis commerce and interstate regulation.',
    cases: 6,
    color: 'emerald',
  },
];

const ACTIVE_CASES = [
  {
    title: 'Canna Provisions v. DEA',
    court: '1st Circuit',
    type: 'Regulatory Challenge',
    status: 'Active',
    nextHearing: 'May 12, 2026',
    summary: 'Challenge to DEA registration requirements for Schedule III cannabis businesses. Could define compliance framework nationally.',
  },
  {
    title: 'Oklahoma OMMA v. Green Country Farms',
    court: 'Oklahoma County District',
    type: 'License Revocation',
    status: 'Active',
    nextHearing: 'May 3, 2026',
    summary: 'State challenge to revoke commercial license for Metrc reporting violations. Key test case for SINC-type automated compliance systems.',
  },
  {
    title: 'Cannabis Trade Federation v. IRS',
    court: 'U.S. Tax Court',
    type: '280E Refund',
    status: 'Active',
    nextHearing: 'June 1, 2026',
    summary: 'Industry group seeking retroactive 280E refunds following Schedule III reclassification. Could set precedent for billions in tax recovery.',
  },
  {
    title: 'People v. Rodriguez (Expungement)',
    court: 'California Superior',
    type: 'Expungement',
    status: 'Pending',
    nextHearing: 'April 30, 2026',
    summary: 'Class-action for automatic expungement of pre-legalization cannabis convictions. Governor supports, DA opposes on procedural grounds.',
  },
];

export const JudicialMonitorTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'cases' | 'judges' | 'active'>('cases');

  const filteredCases = LANDMARK_CASES.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredJudges = JUDICIAL_PROFILES.filter(j =>
    j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0b1525] via-[#111f36] to-[#0b1525] rounded-[2rem] p-8 border border-blue-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Gavel size={120} /></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-900/50 border border-blue-700/30 rounded-xl flex items-center justify-center">
              <Gavel size={24} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Judicial Intelligence Monitor</h2>
              <p className="text-blue-300/50 text-xs font-bold uppercase tracking-widest">Cannabis Court Cases • Judicial Profiles • Legal Precedent Tracker</p>
            </div>
          </div>
          <p className="text-blue-200/60 text-sm max-w-2xl leading-relaxed">
            Track landmark rulings, active litigation, and judicial sentiment across federal and state courts.
            Identify judges who support reform, advocate for patients, and shape cannabis policy through the bench.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Landmark Rulings Tracked', value: '142', icon: Scale, color: 'text-blue-400', bg: 'bg-blue-900/30' },
          { label: 'Active Cases Monitored', value: '38', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-900/30' },
          { label: 'Reform-Leaning Judges', value: '24', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
          { label: 'States with Active Litigation', value: '31', icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-900/30' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0b1525] border border-blue-900/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{stat.label}</p>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Section Tabs + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-2">
          {[
            { id: 'cases' as const, label: 'Landmark Rulings', icon: Scale },
            { id: 'judges' as const, label: 'Judicial Profiles', icon: Users },
            { id: 'active' as const, label: 'Active Litigation', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                activeSection === tab.id
                  ? "bg-blue-900/50 text-blue-200 border-blue-700/40 shadow-lg shadow-blue-900/20"
                  : "bg-[#0b1525] text-blue-300/40 border-blue-900/20 hover:bg-[#111f36] hover:text-blue-200"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/30" />
          <input
            type="text"
            placeholder="Search cases, judges, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0b1525] border border-blue-900/30 rounded-xl text-xs text-blue-200 placeholder:text-blue-400/20 outline-none focus:border-blue-600 transition-colors"
          />
        </div>
      </div>

      {/* Landmark Rulings */}
      {activeSection === 'cases' && (
        <div className="space-y-4">
          {filteredCases.map((c, i) => (
            <div key={i} className="bg-[#0b1525] border border-blue-900/20 rounded-2xl p-6 hover:border-blue-700/30 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      c.outcome === 'Favorable' ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800/30" :
                      c.outcome === 'Unfavorable' ? "bg-red-900/40 text-red-400 border border-red-800/30" :
                      "bg-amber-900/40 text-amber-400 border border-amber-800/30"
                    )}>{c.outcome}</span>
                    <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      c.impact === 'Critical' ? "bg-red-900/30 text-red-300" :
                      c.impact === 'High' ? "bg-amber-900/30 text-amber-300" :
                      "bg-blue-900/30 text-blue-300"
                    )}>Impact: {c.impact}</span>
                  </div>
                  <h3 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">{c.title}</h3>
                  <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest mt-1">{c.court} • {c.date}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold",
                    c.status === 'Active / Final' ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/30 animate-pulse" :
                    "bg-[#111f36] text-blue-300/60 border border-blue-900/20"
                  )}>{c.status}</span>
                </div>
              </div>
              <p className="text-xs text-blue-200/60 leading-relaxed mb-4">{c.summary}</p>
              <div className="flex flex-wrap gap-2">
                {c.tags.map((tag, j) => (
                  <span key={j} className="px-2 py-0.5 bg-[#111f36] border border-blue-900/20 rounded text-[9px] font-bold text-blue-300/50 uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            </div>
          ))}
          {filteredCases.length === 0 && (
            <div className="text-center py-16 text-blue-300/30 text-sm italic">No cases matching "{searchQuery}"</div>
          )}
        </div>
      )}

      {/* Judicial Profiles */}
      {activeSection === 'judges' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJudges.map((j, i) => (
            <div key={i} className="bg-[#0b1525] border border-blue-900/20 rounded-2xl p-6 hover:border-blue-700/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm border",
                    j.color === 'emerald' ? "bg-emerald-900/40 border-emerald-800/30" :
                    j.color === 'amber' ? "bg-amber-900/40 border-amber-800/30" :
                    "bg-blue-900/40 border-blue-800/30"
                  )}>
                    <Scale size={20} className={cn(
                      j.color === 'emerald' ? "text-emerald-400" :
                      j.color === 'amber' ? "text-amber-400" :
                      "text-blue-400"
                    )} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">{j.name}</h3>
                    <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest">{j.court}</p>
                  </div>
                </div>
                <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border",
                  j.stance.includes('Pro-Reform') ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/30" :
                  j.stance.includes('States') ? "bg-blue-900/30 text-blue-400 border-blue-800/30" :
                  j.stance.includes('Reform-Leaning') ? "bg-emerald-900/20 text-emerald-300 border-emerald-800/20" :
                  "bg-amber-900/30 text-amber-400 border-amber-800/30"
                )}>{j.stance}</span>
              </div>
              <p className="text-xs text-blue-200/60 leading-relaxed mb-4 italic">"{j.note}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-blue-900/20">
                <span className="text-[10px] font-bold text-blue-300/30 uppercase tracking-widest">{j.cases} Cannabis-Related Rulings</span>
                <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-1">
                  View Full Profile <ExternalLink size={10} />
                </button>
              </div>
            </div>
          ))}
          {filteredJudges.length === 0 && (
            <div className="col-span-full text-center py-16 text-blue-300/30 text-sm italic">No judges matching "{searchQuery}"</div>
          )}
        </div>
      )}

      {/* Active Litigation */}
      {activeSection === 'active' && (
        <div className="space-y-4">
          {ACTIVE_CASES.map((c, i) => (
            <div key={i} className="bg-[#0b1525] border border-blue-900/20 rounded-2xl p-6 hover:border-blue-700/30 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">{c.title}</h3>
                  <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-widest mt-1">{c.court} • {c.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                    c.status === 'Active' ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/30" :
                    "bg-amber-900/30 text-amber-400 border-amber-800/30"
                  )}>
                    <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1.5",
                      c.status === 'Active' ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    )}></span>
                    {c.status}
                  </span>
                  <div className="bg-[#111f36] border border-blue-900/30 rounded-lg px-3 py-1.5">
                    <p className="text-[9px] font-bold text-blue-300/40 uppercase tracking-widest">Next Hearing</p>
                    <p className="text-xs font-black text-white">{c.nextHearing}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-blue-200/60 leading-relaxed">{c.summary}</p>
            </div>
          ))}
        </div>
      )}

      {/* Advocacy Resources Footer */}
      <div className="bg-[#0b1525] border border-blue-900/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={18} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white">Advocacy & Education Resources</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: 'LEAP — Law Enforcement Action Partnership', url: 'https://lawenforcementactionpartnership.org/', desc: 'Police & judges advocating for drug policy reform' },
            { title: 'NORML Legal Committee', url: 'https://norml.org/legal/', desc: 'Legal defense resources and case tracking' },
            { title: 'Marijuana Policy Project', url: 'https://www.mpp.org/', desc: 'Policy analysis and legislative tracking' },
            { title: 'Last Prisoner Project', url: 'https://www.lastprisonerproject.org/', desc: 'Advocating for cannabis prisoner release & expungement' },
            { title: 'ACLU Cannabis Campaign', url: 'https://www.aclu.org/issues/smart-justice/sentencing-reform/marijuana-legalization', desc: 'Civil liberties and racial justice in cannabis enforcement' },
            { title: 'Cannabis Regulators Assn (CANNRA)', url: 'https://www.cann-ra.org/', desc: 'State regulators collaborating on best practices' },
          ].map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              className="p-4 bg-[#111f36] border border-blue-900/20 rounded-xl hover:border-blue-600/30 hover:bg-[#152847] transition-all group/link"
            >
              <h4 className="text-xs font-bold text-blue-200 group-hover/link:text-blue-100 mb-1">{r.title}</h4>
              <p className="text-[10px] text-blue-300/40">{r.desc}</p>
              <div className="flex items-center gap-1 mt-2 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                Visit <ExternalLink size={8} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
