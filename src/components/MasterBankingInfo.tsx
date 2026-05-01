import React from 'react';
import { Copy, Building, ExternalLink, CircleCheck } from 'lucide-react';

export const MasterBankingInfo = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5"><Building size={160} /></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <Building size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-white">Master Banking & Wiring Hub</h3>
            <p className="text-slate-400 text-sm">Official corporate accounts for global settlements, wires, and payables.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account 1: Medical Receivables */}
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Medical Receivables</span>
                <h4 className="font-bold text-white mt-2">Diversity Health & Wellness LLC</h4>
                <p className="text-xs text-slate-400 mt-1">Novo Bank (Middlesex Federal Savings)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-900 rounded-lg p-3 flex justify-between items-center group">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Routing Number</p>
                  <p className="font-mono font-bold text-slate-200">211370150</p>
                </div>
                <button onClick={() => handleCopy('211370150', 'r1')} className="text-slate-500 hover:text-emerald-400 p-2">
                  {copied === 'r1' ? <CircleCheck size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 flex justify-between items-center group">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Number</p>
                  <p className="font-mono font-bold text-slate-200">103561545</p>
                </div>
                <button onClick={() => handleCopy('103561545', 'a1')} className="text-slate-500 hover:text-emerald-400 p-2">
                  {copied === 'a1' ? <CircleCheck size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Account 2: All Other Receivables */}
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">All Other Receivables</span>
                <h4 className="font-bold text-white mt-2">Global Green Enterprise Inc</h4>
                <p className="text-xs text-slate-400 mt-1">Novo Bank (Middlesex Federal Savings)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-900 rounded-lg p-3 flex justify-between items-center group">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Routing Number</p>
                  <p className="font-mono font-bold text-slate-200">211370150</p>
                </div>
                <button onClick={() => handleCopy('211370150', 'r2')} className="text-slate-500 hover:text-blue-400 p-2">
                  {copied === 'r2' ? <CircleCheck size={16} className="text-blue-400" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 flex justify-between items-center group">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account Number</p>
                  <p className="font-mono font-bold text-slate-200">103566743</p>
                </div>
                <button onClick={() => handleCopy('103566743', 'a2')} className="text-slate-500 hover:text-blue-400 p-2">
                  {copied === 'a2' ? <CircleCheck size={16} className="text-blue-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Account 3: Payables */}
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-5 hover:border-amber-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md">Payables & Operations</span>
                <h4 className="font-bold text-white mt-2">Found Bank</h4>
                <p className="text-xs text-slate-400 mt-1">Primary corporate payables routing</p>
              </div>
            </div>
            <div className="space-y-3 mt-8">
              <a href="https://payments.found.com/preview-account-info/PUxf1rA86xpw" target="_blank" rel="noreferrer" className="bg-slate-900 rounded-lg p-3 flex justify-between items-center group hover:bg-slate-950 transition-colors border border-transparent hover:border-slate-700">
                <div>
                  <p className="font-bold text-slate-200 text-sm">Account Link 1</p>
                  <p className="text-[10px] text-slate-500">payments.found.com/...86xpw</p>
                </div>
                <ExternalLink size={16} className="text-slate-500 group-hover:text-amber-400" />
              </a>
              <a href="https://payments.found.com/preview-account-info/UUGYB9uYbhA1" target="_blank" rel="noreferrer" className="bg-slate-900 rounded-lg p-3 flex justify-between items-center group hover:bg-slate-950 transition-colors border border-transparent hover:border-slate-700">
                <div>
                  <p className="font-bold text-slate-200 text-sm">Account Link 2</p>
                  <p className="text-[10px] text-slate-500">payments.found.com/...bhA1</p>
                </div>
                <ExternalLink size={16} className="text-slate-500 group-hover:text-amber-400" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
