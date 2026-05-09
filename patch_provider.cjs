const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'ProviderDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// 1. Fix Top Notification button
c = c.replace(
  /<button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">/g,
  '<button onClick={() => document.dispatchEvent(new CustomEvent("open-sylara"))} className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">'
);

// 2. Fix System Connections buttons
c = c.replace(
  /<button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">/g,
  '<button onClick={() => document.dispatchEvent(new CustomEvent("open-sylara"))} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">'
);

// 3. Fix "New Consultation" button to "Issue Certification"
c = c.replace(
  /<Plus size=\{16\} \/> New Consultation/g,
  '<FileText size={16} /> Issue Certification'
);

// 4. Fix UserCalendar to not show internal tabs by overriding user prop
c = c.replace(
  /<UserCalendar user=\{user\} title="Provider Schedule" subtitle="Appointments • Telehealth • Clinics" \/>/g,
  `<UserCalendar user={{...user, role: 'provider', email: 'provider@example.com'}} title="Provider Schedule" subtitle="Appointments • Telehealth • Clinics" />`
);

// 5. Replace placeholder for certifications and reports
// Let's remove them from the array first
c = c.replace(
  /\['overview', 'certifications', 'reports', 'settings'\]\.includes\(activeTab\)/g,
  "['overview', 'settings'].includes(activeTab)"
);

// Now inject custom UI for certifications and reports right below the schedule condition
const certAndReportsUI = `
                  {activeTab === 'certifications' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Recent Certifications</h3>
                          <p className="text-sm text-slate-500">Track and manage state-filed medical evaluations.</p>
                        </div>
                        <button onClick={() => setShowCertificationModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
                           <Plus size={16} /> New Cert
                        </button>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                             <tr>
                               <th className="p-4">Patient</th>
                               <th className="p-4">Condition</th>
                               <th className="p-4">Date Issued</th>
                               <th className="p-4">Status</th>
                               <th className="p-4">Actions</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800">Michael Chen<br/><span className="text-xs text-slate-400 font-normal">PT-9942</span></td>
                               <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Chronic Pain</span></td>
                               <td className="p-4 text-slate-600">Apr 21, 2026</td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 w-max"><CircleCheck size={10}/> Filed</span></td>
                               <td className="p-4"><button className="text-blue-600 hover:underline font-bold">View PDF</button></td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800">Sarah Jenkins<br/><span className="text-xs text-slate-400 font-normal">PT-8812</span></td>
                               <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Anxiety</span></td>
                               <td className="p-4 text-slate-600">Apr 15, 2026</td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 w-max"><CircleCheck size={10}/> Filed</span></td>
                               <td className="p-4"><button className="text-blue-600 hover:underline font-bold">View PDF</button></td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800">James Wilson<br/><span className="text-xs text-slate-400 font-normal">PT-7721</span></td>
                               <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">PTSD (Renewal)</span></td>
                               <td className="p-4 text-slate-600">Apr 10, 2026</td>
                               <td className="p-4"><span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 w-max">Pending State</span></td>
                               <td className="p-4"><button className="text-blue-600 hover:underline font-bold">Review</button></td>
                             </tr>
                           </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reports' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-800">Provider Intelligence & Reports</h3>
                        <p className="text-sm text-slate-500">Automated compliance, revenue, and clinical outcome metrics.</p>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><BarChart size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">Monthly Patient Volume</h4>
                           <p className="text-xs text-slate-500 mb-4">Telehealth vs Traditional breakdown with SINC referral metrics.</p>
                           <button className="text-blue-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Shield size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">State Compliance Audit</h4>
                           <p className="text-xs text-slate-500 mb-4">LARRY AI certified compliance score and pre-audit readiness report.</p>
                           <button className="text-emerald-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><CreditCard size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">Revenue & Billing Summary</h4>
                           <p className="text-xs text-slate-500 mb-4">Subscription, consultation fees, and pending invoice totals.</p>
                           <button className="text-purple-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><FileText size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">Prescription Outcome Data</h4>
                           <p className="text-xs text-slate-500 mb-4">Anonymized efficacy reports linked to specific product categories.</p>
                           <button className="text-amber-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}
`;

c = c.replace(
  /\{activeTab === 'schedule' && \(\s*<UserCalendar[^\n]*\/>\s*\)\}/,
  match => match + '\n\n' + certAndReportsUI
);

// Oh wait, make sure we import ArrowRight in ProviderDashboard.tsx if it's not there.
if (!c.includes('ArrowRight')) {
  c = c.replace(/CircleCheck \} from 'lucide-react';/, 'CircleCheck, ArrowRight } from "lucide-react";');
}

fs.writeFileSync(p, c, 'utf8');
console.log('ProviderDashboard patched successfully.');
