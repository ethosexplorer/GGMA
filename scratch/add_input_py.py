import sys

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                            </div>
                        </div>
                    ))}
                </div>"""

replacement = """                            </div>
                            {selectedRole === 'other_' + cat.toLowerCase() && (
                                <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Please specify your role</label>
                                    <input type="text" name="customRoleName" value={formData.customRoleName} onChange={handleInputChange} placeholder="E.g., Logistics Coordinator, Vendor, etc." className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731]" required />
                                </div>
                            )}
                        </div>
                    ))}
                </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found. Let's try regex.")
    import re
    # Match the end of the step 1 block
    content = re.sub(r'                            <\/div>\s*<\/div>\s*\}\)\}\s*<\/div>', replacement, content)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Regex replaced successfully")
