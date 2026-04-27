const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace ssn in formData
content = content.replace(
    `    ssn: '', // Added for ID Code (last 4)\n  });`,
    `    ssn: '', // Added for ID Code (last 4)\n    customRoleName: '',\n  });`
);

// Replace roles array
content = content.replace(
    `    { id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems.' },\n  ];`,
    `    { id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems.' },\n    { id: 'other_oversight', label: 'Other', category: 'Oversight', icon: Plus, desc: 'Not listed here? Define your custom role.' },\n    { id: 'other_patient', label: 'Other', category: 'Patient', icon: Plus, desc: 'Not listed here? Define your custom role.' },\n    { id: 'other_business', label: 'Other', category: 'Business', icon: Plus, desc: 'Not listed here? Define your custom role.' },\n    { id: 'other_operations', label: 'Other', category: 'Operations', icon: Plus, desc: 'Not listed here? Define your custom role.' },\n  ];`
);

// Also add a text input for when "other" is selected
content = content.replace(
    `                                        {selectedRole === role.id && (\n                                            <div className="absolute top-4 right-4 text-[#1a4731]">\n                                                <CheckCircle2 size={20} className="fill-[#1a4731] text-white" />\n                                            </div>\n                                        )}\n                                    </button>\n                                ))} `,
    `                                        {selectedRole === role.id && (\n                                            <div className="absolute top-4 right-4 text-[#1a4731]">\n                                                <CheckCircle2 size={20} className="fill-[#1a4731] text-white" />\n                                            </div>\n                                        )}\n                                    </button>\n                                ))} `
);

// We should also replace the rendering part for step 1 to inject the text input conditionally:
content = content.replace(
    `                                        {selectedRole === role.id && (\n                                            <div className="absolute top-4 right-4 text-[#1a4731]">\n                                                <CheckCircle2 size={20} className="fill-[#1a4731] text-white" />\n                                            </div>\n                                        )}\n                                    </button>\n                                ))} \n                            </div>\n                        </div>\n                    ))} `,
    `                                        {selectedRole === role.id && (\n                                            <div className="absolute top-4 right-4 text-[#1a4731]">\n                                                <CheckCircle2 size={20} className="fill-[#1a4731] text-white" />\n                                            </div>\n                                        )}\n                                    </button>\n                                ))} \n                            </div>\n                            {selectedRole === 'other_' + cat.toLowerCase() && (\n                                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">\n                                    <label className="block text-sm font-bold text-slate-700 mb-2">Please specify your role</label>\n                                    <input type="text" name="customRoleName" value={formData.customRoleName} onChange={handleInputChange} placeholder="E.g., Logistics Coordinator, Vendor, etc." className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731]" required />\n                                </div>\n                            )}\n                        </div>\n                    ))} `
);

fs.writeFileSync('src/App.tsx', content);
