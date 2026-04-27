const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
    /                            <\/div>\n                        <\/div>\n                    \}\)\}\n                <\/div>/g,
    `                            </div>\n                            {selectedRole === 'other_' + cat.toLowerCase() && (\n                                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">\n                                    <label className="block text-sm font-bold text-slate-700 mb-2">Please specify your role</label>\n                                    <input type="text" name="customRoleName" value={formData.customRoleName} onChange={handleInputChange} placeholder="E.g., Logistics Coordinator, Vendor, etc." className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731]" required />\n                                </div>\n                            )}\n                        </div>\n                    ))}\n                </div>`
);

fs.writeFileSync('src/App.tsx', content);
