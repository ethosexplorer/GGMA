const fs = require('fs');

// --- ATTORNEY DASHBOARD UPDATE ---
let attr = fs.readFileSync('src/pages/AttorneyDashboard.tsx', 'utf8');

// Add Oversight alert
attr = attr.replace(
  "{ type: 'update', msg: 'New state rule (CA-AB123) takes effect in 30 days.', time: '3h ago', icon: ShieldAlert, color: 'text-blue-500 bg-blue-50 border-blue-200' }",
  "{ type: 'oversight', msg: 'OVERSIGHT ALERT: Client \"Jane Doe\" review SLA missed by 12 hours. Rating dropped to B.', time: '3h ago', icon: ShieldAlert, color: 'text-red-500 bg-red-50 border-red-200' }"
);

// Add Ratings & Reviews section
const attorneyReviewsHtml = `
                {/* Client Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-[#1a4731]" /> Client Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated attorneys receive \"Top Counsel\" acknowledgement and priority case routing.</p>
                    </div>
                    <div className="bg-[#1a4731] text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                      A+ Rating (4.9/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">GreenLeaf LLC</p>
                          <p className="text-xs text-slate-500">Business Setup • 2 days ago</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"Alex was incredibly fast and handled our entire state compliance application within 24 hours. Highly recommended."</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">Michael S.</p>
                          <p className="text-xs text-slate-500">Patient Appeal • 1 week ago</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"The best legal representation I've had. The AI system made uploading my docs seamless."</p>
                    </div>
                  </div>
                </div>
`;

// Insert after the cases list
attr = attr.replace('</div>\n\n                {/* Add-on Upsells Section */}', attorneyReviewsHtml + '\n                {/* Add-on Upsells Section */}');
fs.writeFileSync('src/pages/AttorneyDashboard.tsx', attr);


// --- PROVIDER DASHBOARD UPDATE ---
let prov = fs.readFileSync('src/pages/ProviderDashboard.tsx', 'utf8');

prov = prov.replace(
  "{ type: 'compliance', msg: 'Larry Check: OMMA Education Certificate expires in 45 days.', time: '3h ago', icon: Shield, color: 'text-blue-500 bg-blue-50' }",
  "{ type: 'oversight', msg: 'OVERSIGHT ALERT: 3 Certifications pending past SLA. Action required immediately to avoid rating penalty.', time: '3h ago', icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-200' }"
);

const providerReviewsHtml = `
                {/* Client Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-blue-600" /> Patient Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated providers receive \"Top Provider\" acknowledgement and priority lead routing.</p>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                      A Rating (4.8/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">Sarah J.</p>
                          <p className="text-xs text-slate-500">Telehealth Visit • Yesterday</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"Dr. Doe was very attentive and the entire process through the patient portal was smooth."</p>
                    </div>
                  </div>
                </div>
`;

// Insert after patient queue
prov = prov.replace('</div>\n\n                {/* Sylara Assistant Widget */}', providerReviewsHtml + '\n                {/* Sylara Assistant Widget */}');

// Add UserCheck import if not present
if (!prov.includes('UserCheck')) {
  prov = prov.replace('Plus, PhoneCall, AlertTriangle, ChevronRight, CheckCircle2, FlaskConical, X', 'Plus, PhoneCall, AlertTriangle, ChevronRight, CheckCircle2, FlaskConical, X, UserCheck');
}

fs.writeFileSync('src/pages/ProviderDashboard.tsx', prov);

console.log('Attorney and Provider dashboards updated.');
