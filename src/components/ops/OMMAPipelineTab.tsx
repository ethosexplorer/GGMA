import React from 'react';
import { PipelineCRM } from '../crm/PipelineCRM';
import { Search, MapPin, Building2, ExternalLink } from 'lucide-react';

export const OMMAPipelineTab = () => {
  return (
    <div className="h-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side: OMMA Scraper Control Panel */}
      <div className="w-full md:w-1/3 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 bg-indigo-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-black flex items-center gap-2"><MapPin size={18} className="text-indigo-400" /> OMMA Public Registry</h2>
            <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mt-0.5">Scraper Command Center</p>
          </div>
          <a href="https://medportal.omma.ok.gov/s/verify-license-number" target="_blank" rel="noreferrer" className="p-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm" title="Open OMMA Portal">
            <ExternalLink size={16} />
          </a>
        </div>
        
        <div className="flex-1 bg-slate-50 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Automated Extraction Tool</h3>
          <p className="text-sm text-slate-500 font-medium max-w-[250px] mb-8">
            The OMMA Portal restricts direct embedding. Use the backend scraper to securely extract hidden emails and contact details into your pipeline.
          </p>
          
          <div className="space-y-3 w-full max-w-[280px]">
            <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
              <Search size={16} /> Run Scraper (First 100)
            </button>
            <button className="w-full py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-colors">
              Download Latest CSV
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 text-xs font-bold leading-relaxed">
            <p><strong>Note:</strong> Extracting all 25,000 records takes time. The scraper runs in the background and saves data directly to the workspace.</p>
          </div>
        </div>
      </div>

      {/* Right Side: CRM Pipeline */}
      <div className="w-full md:w-2/3 flex-1 flex flex-col h-full bg-[#080e1a] overflow-auto">
        <div className="p-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <h2 className="font-black text-white flex items-center gap-2"><Building2 size={18} className="text-indigo-400" /> B2B CRM Pipeline</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Track Business Acquisitions</p>
        </div>
        <div className="flex-1 overflow-auto relative -m-6 p-6">
          <div className="absolute inset-0">
            <PipelineCRM />
          </div>
        </div>
      </div>

    </div>
  );
};
