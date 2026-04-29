import React, { useState } from 'react';
import { Shield, ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Download, Save, Sparkles, Building2, FileText, Users, Lock, ClipboardList, CreditCard, Send } from 'lucide-react';

const DEA_SECTIONS = [
  { id: 1, title: 'Business Information', icon: Building2, fields: [
    { key: 'businessName', label: 'Legal Business Name', type: 'text', placeholder: 'Global Green Enterprise Inc.' },
    { key: 'businessAddress', label: 'Business Address', type: 'text', placeholder: '123 Main St, Oklahoma City, OK 73101' },
    { key: 'businessPhone', label: 'Business Phone', type: 'tel', placeholder: '(405) 555-0100' },
    { key: 'businessEmail', label: 'Business Email', type: 'email', placeholder: 'compliance@globalgreen.com' },
    { key: 'contactName', label: 'Primary Contact Name', type: 'text', placeholder: 'Shantell Robinson' },
    { key: 'contactCell', label: 'Contact Cell Phone', type: 'tel', placeholder: '(405) 555-0101' },
    { key: 'contactEmail', label: 'Contact Email', type: 'email', placeholder: 'shantell@globalgreen.com' },
    { key: 'taxId', label: 'Tax ID / EIN', type: 'text', placeholder: 'XX-XXXXXXX' },
    { key: 'orgType', label: 'Organization Type', type: 'select', options: ['Corporation','LLC','Partnership','LLP','Sole Proprietorship','Other'] },
    { key: 'ownershipChanged', label: 'Has ownership changed in the past 12 months?', type: 'select', options: ['No','Yes'] },
    { key: 'existingDEA', label: 'Does the firm have other DEA registrations?', type: 'select', options: ['No','Yes'] },
    { key: 'priorControlled', label: 'Past experience handling controlled substances?', type: 'select', options: ['No','Yes'] },
  ]},
  { id: 2, title: 'Activity & Drug Codes', icon: FileText, fields: [
    { key: 'marijuana7362', label: 'Marijuana (Drug Code 7362)', type: 'checkbox' },
    { key: 'extract7353', label: 'Marijuana Extract (Drug Code 7353)', type: 'checkbox' },
    { key: 'thc7386', label: 'Delta-9 THC (Drug Code 7386)', type: 'checkbox' },
    { key: 'dispensing', label: 'Will your firm dispense medical marijuana?', type: 'select', options: ['Yes','No'] },
    { key: 'recreational', label: 'Will your firm handle recreational marijuana?', type: 'select', options: ['No','Yes'] },
    { key: 'npi', label: 'National Provider ID (if applicable)', type: 'text', placeholder: 'Optional' },
  ]},
  { id: 3, title: 'State License(s)', icon: Shield, fields: [
    { key: 'licenseNumber', label: 'OMMA License Number', type: 'text', placeholder: 'GAAA-XXXX-XXXX' },
    { key: 'licenseState', label: 'License State', type: 'text', placeholder: 'Oklahoma' },
    { key: 'licenseExpiry', label: 'License Expiration Date', type: 'date', placeholder: '' },
  ]},
  { id: 4, title: 'Liability Questions', icon: Lock, fields: [
    { key: 'criminalHistory', label: 'Convicted of a crime related to controlled substances?', type: 'select', options: ['No','Yes'] },
    { key: 'deaSurrendered', label: 'Ever surrendered or had DEA registration revoked?', type: 'select', options: ['No','Yes'] },
    { key: 'stateSurrendered', label: 'Ever had a state license revoked, suspended, or on probation?', type: 'select', options: ['No','Yes'] },
    { key: 'officerConvictions', label: 'Any officer/partner convicted of controlled substance crimes?', type: 'select', options: ['No','Yes'] },
    { key: 'priorUnauthorized', label: 'Anyone involved previously handled controlled substances without DEA registration?', type: 'select', options: ['No','Yes'] },
  ]},
  { id: 5, title: 'Compliance & SOPs', icon: ClipboardList, fields: [
    { key: 'supplierName', label: 'Primary Supplier Name', type: 'text', placeholder: 'Enter supplier name' },
    { key: 'supplierDEA', label: 'Supplier DEA Registration #', type: 'text', placeholder: 'Pending — suppliers may not yet have DEA #' },
    { key: 'repackaging', label: 'Does the firm anticipate repackaging/relabeling?', type: 'select', options: ['No','Yes'] },
    { key: 'sopOrdering', label: 'SOP: Ordering', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopReceiving', label: 'SOP: Receiving', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopInventory', label: 'SOP: Inventories', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopStorage', label: 'SOP: Storage of Marijuana', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopSecurity', label: 'SOP: Security', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopDispensing', label: 'SOP: Dispensing (incl. delivery)', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopDestruction', label: 'SOP: Destruction/Disposal', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopTheftLoss', label: 'SOP: Theft/Loss Reporting', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopDueDiligence', label: 'SOP: Due Diligence', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'sopRecords', label: 'SOP: Records Maintenance', type: 'select', options: ['Yes — documented','No — needs creation'] },
    { key: 'hasVault', label: 'Security: Vault or Safe', type: 'select', options: ['Yes','No'] },
    { key: 'hasAlarm', label: 'Security: Alarm System', type: 'select', options: ['Yes','No'] },
    { key: 'hasAccessControl', label: 'Security: Access Controls (key/fob/passcode)', type: 'select', options: ['Yes','No'] },
    { key: 'hasOnsiteSecurity', label: 'Security: Onsite Security Personnel', type: 'select', options: ['Yes','No'] },
  ]},
  { id: 6, title: 'Payment', icon: CreditCard, fields: [
    { key: 'paypalReady', label: 'PayPal account ready for DEA fee?', type: 'select', options: ['Yes','No — need to set up'] },
    { key: 'feeAcknowledged', label: 'Acknowledge: DEA application fee is non-refundable (⚠️ Portal lists $794; Federal Register lists $888/3yr for dispensers)', type: 'checkbox' },
  ]},
  { id: 7, title: 'Review & Submit', icon: Send, fields: [] },
];

interface DEAWizardProps {
  mode?: 'larry' | 'sylara';
  onSaveToVault?: (data: Record<string, string>) => void;
}

export const DEAApplicationWizard: React.FC<DEAWizardProps> = ({ mode = 'larry', onSaveToVault }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [savedToVault, setSavedToVault] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const section = DEA_SECTIONS[currentSection];
  const isLarry = mode === 'larry';
  const accentColor = isLarry ? '#1a4731' : '#6366f1';
  const accentBg = isLarry ? 'bg-[#1a4731]' : 'bg-indigo-600';
  const accentText = isLarry ? 'text-emerald-400' : 'text-indigo-400';
  const agentName = isLarry ? 'L.A.R.R.Y.' : 'Sylara';

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const filledFields = Object.keys(formData).filter(k => formData[k] && formData[k].length > 0).length;
  const totalFields = DEA_SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);
  const progress = Math.round((filledFields / totalFields) * 100);

  const getSectionCompletion = (sectionIdx: number) => {
    const sec = DEA_SECTIONS[sectionIdx];
    if (sec.fields.length === 0) return 100;
    const filled = sec.fields.filter(f => formData[f.key] && formData[f.key].length > 0).length;
    return Math.round((filled / sec.fields.length) * 100);
  };

  const chatMessages: Record<number, string> = {
    0: `Welcome! I'm ${agentName} and I'll guide you through the DEA Schedule III registration. As of April 23, 2026, dispensaries have 60 days to apply (deadline: June 22). IMPORTANT: Not participating means losing eligibility for tax breaks (280E relief), banking services, and interstate commerce. Let's start with your business information.`,
    1: `Now let's confirm your product categories. These map to DEA drug codes. Most dispensaries will select Marijuana (7362), Marijuana Extract (7353), and Delta-9 THC (7386). The reclassification from Schedule I to Schedule III was finalized by Acting AG Todd Blanche.`,
    2: `Your OMMA license is your gateway to DEA registration. Per OMMA Executive Director Adria Berry: "These requirements are an important step toward a more mature and standardized regulatory environment." Note: If your state license is revoked, suspended, or expires — the same action applies to your DEA license.`,
    3: `These liability questions are required by the DEA. Answer honestly — most OMMA-licensed dispensaries will answer "No." If any apply, consult legal counsel before submitting. Your answers here directly affect approval.`,
    4: `This is the most detailed section — the DEA requires documented SOPs for every operational category. Good news: if you've been OMMA-compliant and using GGP-OS, most of these are already covered by your Metrc integration and compliance data. I'll flag any gaps.`,
    5: `Almost there! The DEA requires a registration fee (non-refundable) paid via PayPal.\n\n⚠️ FEE DISCREPANCY NOTICE: The DEA application portal currently lists $794, however the Federal Register (21 CFR §1301.13) lists $888 for a 3-year dispensary registration. Gies Law Firm PLLC and others have flagged this discrepancy. The portal fee ($794) is what you will be charged at time of submission. We recommend confirming the exact amount on the portal before paying.\n\nYou can continue operating under your state license during the DEA review period (up to 6 months). Make sure your PayPal account is ready before submitting.`,
    6: `Here's your complete application summary. Review everything carefully, then:\n1. Save to Vault for your records\n2. Download the data package\n3. Open the DEA Medical Marijuana Application Portal to submit\n\nYou can operate lawfully under your OMMA license during the entire review period.\n\n📞 DEA Registration Support: 1-800-882-9539 (8:30 AM–5:50 PM ET)\n📧 DEA.Registration.Help@dea.gov 💪`,
  };

  const handleSaveToVault = () => {
    setSavedToVault(true);
    if (onSaveToVault) onSaveToVault(formData);
  };

  const handleExport = () => {
    const lines = [
      'DEA SCHEDULE III — APPLICATION DATA PACKAGE',
      `Generated: ${new Date().toLocaleString()}`,
      `Agent: ${agentName}`,
      `Source: OMMA Statement (April 28, 2026) + DEA Diversion Control Division`,
      '='.repeat(60),
      '',
      'IMPORTANT CONTEXT:',
      '- Application window: April 23 – June 22, 2026 (60 days)',
      '- Fee: $794 per DEA portal (⚠️ Federal Register lists $888/3yr for dispensers — discrepancy noted)',
      '- Review period: Up to 6 months',
      '- Operate lawfully under state license during review',
      '- NOT participating = lose tax breaks, banking, interstate commerce',
      '- State license revocation/suspension = DEA license revocation',
      ''
    ];
    DEA_SECTIONS.forEach(sec => {
      lines.push(`\n§${sec.id}: ${sec.title}`);
      lines.push('-'.repeat(40));
      sec.fields.forEach(f => {
        lines.push(`  ${f.label}: ${formData[f.key] || '(not provided)'}`);
      });
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `DEA_Application_Package_${new Date().toISOString().split('T')[0]}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Critical Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 space-y-1">
          <p className="font-black">Why Register? Licensees NOT participating will lose eligibility for:</p>
          <p>• <strong>280E Tax Relief</strong> — Removal of the federal tax burden on cannabis businesses</p>
          <p>• <strong>Banking Services</strong> — Access to traditional banking and financial institutions</p>
          <p>• <strong>Interstate Commerce</strong> — Ability to participate in cross-state trade</p>
          <p className="text-amber-600 font-bold mt-1">Deadline: June 22, 2026 • You can operate under your state license during the DEA review (up to 6 months)</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Application Progress</span>
          <span className="text-sm font-black text-slate-800">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-1 mt-3">
          {DEA_SECTIONS.map((s, i) => {
            const pct = getSectionCompletion(i);
            return (
              <button key={i} onClick={() => setCurrentSection(i)}
                className={`flex-1 h-8 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 transition-all ${
                  i === currentSection ? `${accentBg} text-white shadow-md` : pct === 100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {pct === 100 && i !== currentSection ? <CheckCircle size={10} /> : null}
                §{s.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agent Chat Bubble */}
      <div className={`${accentBg} rounded-2xl p-4 flex items-start gap-3`}>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">{agentName} — DEA Compliance Guide</p>
          <p className="text-sm text-white/90 leading-relaxed">{chatMessages[currentSection]}</p>
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          {section.icon && <section.icon size={20} className="text-blue-600" />}
          <h4 className="font-black text-slate-800">§{section.id}: {section.title}</h4>
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
            getSectionCompletion(currentSection) === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {getSectionCompletion(currentSection)}%
          </span>
        </div>

        {/* Review Section */}
        {currentSection === 6 ? (
          <div className="space-y-4">
            {DEA_SECTIONS.slice(0, 6).map((sec, si) => (
              <div key={si} className="border border-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-black text-slate-700">§{sec.id}: {sec.title}</h5>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    getSectionCompletion(si) === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>{getSectionCompletion(si)}%</span>
                </div>
                <div className="space-y-1">
                  {sec.fields.map((f, fi) => (
                    <div key={fi} className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-slate-500">{f.label}</span>
                      <span className={`font-bold ${formData[f.key] ? 'text-slate-800' : 'text-amber-500'}`}>
                        {formData[f.key] || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleSaveToVault} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-black transition-all ${
                savedToVault ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : `${accentBg} text-white hover:opacity-90 shadow-lg`
              }`}>
                {savedToVault ? <><CheckCircle size={16} /> Saved to Vault</> : <><Save size={16} /> Save to Vault</>}
              </button>
              <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg">
                <Download size={16} /> Download Package
              </button>
              <button onClick={() => window.open('https://mmapplication.diversion.dea.gov/', '_blank')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg">
                <Send size={16} /> Submit to DEA Portal
              </button>
              <button onClick={() => window.open('https://www.deadiversion.usdoj.gov/drugreg/registration.html', '_blank')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-xl text-sm font-black hover:bg-slate-700 transition-all shadow-lg">
                <FileText size={16} /> DEA Registration Info
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {section.fields.map((field, i) => (
              <div key={i}>
                <label className="text-xs font-bold text-slate-600 mb-1 block">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt, oi) => <option key={oi} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData[field.key] === 'Yes'}
                      onChange={(e) => updateField(field.key, e.target.checked ? 'Yes' : '')}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                    />
                    <span className="text-sm font-medium text-slate-700">Confirmed</span>
                  </label>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-xs font-bold text-slate-400">Section {currentSection + 1} of 7</span>
        <button
          onClick={() => setCurrentSection(Math.min(6, currentSection + 1))}
          disabled={currentSection === 6}
          className={`flex items-center gap-2 px-4 py-2.5 ${accentBg} text-white rounded-xl text-sm font-black hover:opacity-90 disabled:opacity-40 transition-all shadow-md`}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
