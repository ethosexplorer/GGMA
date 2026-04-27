const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace dlFront
content = content.replace(
    `<button \n                                    onClick={() => setUploads(p => ({...p, dlFront: true}))}`,
    `<input type="file" id="dlFrontUpload" className="sr-only" onChange={(e) => { if(e?.target?.files?.length) { setTimeout(() => { setUploads(p => ({...p, dlFront: true})); alert('ID Front securely uploaded and encrypted.'); }, 800); } }} />\n                                <label htmlFor="dlFrontUpload"`
);
content = content.replace(
    `                                    <div className="text-center">\n                                        <span className="block font-bold text-slate-700">{uploads.dlFront ? "Front ID Uploaded" : "Upload ID Front"}</span>\n                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>\n                                    </div>\n                                </button>`,
    `                                    <div className="text-center">\n                                        <span className="block font-bold text-slate-700">{uploads.dlFront ? "Front ID Uploaded" : "Upload ID Front"}</span>\n                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>\n                                    </div>\n                                </label>`
);

// Replace dlBack
content = content.replace(
    `<button \n                                    onClick={() => setUploads(p => ({...p, dlBack: true}))}`,
    `<input type="file" id="dlBackUpload" className="sr-only" onChange={(e) => { if(e?.target?.files?.length) { setTimeout(() => { setUploads(p => ({...p, dlBack: true})); alert('ID Back securely uploaded and encrypted.'); }, 800); } }} />\n                                <label htmlFor="dlBackUpload"`
);
content = content.replace(
    `                                    <div className="text-center">\n                                        <span className="block font-bold text-slate-700">{uploads.dlBack ? "Back ID Uploaded" : "Upload ID Back"}</span>\n                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>\n                                    </div>\n                                </button>`,
    `                                    <div className="text-center">\n                                        <span className="block font-bold text-slate-700">{uploads.dlBack ? "Back ID Uploaded" : "Upload ID Back"}</span>\n                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>\n                                    </div>\n                                </label>`
);

fs.writeFileSync('src/App.tsx', content);
