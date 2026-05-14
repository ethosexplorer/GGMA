import React from 'react';
import { PipelineCRM } from '../crm/PipelineCRM';
import { Search, MapPin, Building2, ExternalLink } from 'lucide-react';

export const OMMAPipelineTab = () => {
  return (
    <div className="h-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side: OMMA Verification Tool (Iframe) */}
      <div className="w-full md:w-1/3 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 bg-indigo-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-black flex items-center gap-2"><MapPin size={18} className="text-indigo-400" /> OMMA Public Registry</h2>
            <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold mt-0.5">Verify License Number</p>
          </div>
          <a href="https://medportal.omma.ok.gov/s/verify-license-number" target="_blank" rel="noreferrer" className="p-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg transition-colors" title="Open in new tab">
            <ExternalLink size={16} />
          </a>
        </div>
        
        <div className="flex-1 bg-slate-100 relative">
          <iframe 
            src="https://medportal.omma.ok.gov/s/verify-license-number"
            className="absolute inset-0 w-full h-full border-none"
            title="OMMA License Verification"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 text-xs font-bold leading-relaxed">
            <p><strong>Instructions:</strong> Use this registry to look up official OMMA businesses. Once verified, use the CRM on the right to track their progress in our platform.</p>
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
