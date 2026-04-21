import React, { useState } from 'react';
import { 
  FileDown, Send, CheckCircle2, AlertCircle, Clock, 
  History, ShieldCheck, Download, ExternalLink, RefreshCw 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ReportingEngine } from '../../lib/compliance/ReportingEngine';

export const RegulatoryReportingTab: React.FC<{ facilityId: string }> = ({ facilityId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<any>(null);
  const [activeReport, setActiveReport] = useState<'inventory' | 'sales' | 'transfers' | 'audit'>('inventory');

  const handleExport = async (format: 'json' | 'csv') => {
    setIsGenerating(true);
    try {
      const data = await ReportingEngine.generateReport({ facilityId, type: activeReport, format });
      
      // Simulation of file download
      const blob = new Blob([data as string], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SINC_Report_${activeReport}_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      const reportData = await ReportingEngine.generateReport({ facilityId, type: activeReport, format: 'json' });
      const result = await ReportingEngine.submitToState(reportData as string, activeReport);
      setSubmissionStatus(result);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Regulatory Reporting Engine</h2>
          <p className="text-slate-500 text-sm font-medium">Automated state-level traceability and tax reporting (Metrc/OMMA Compliant)</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase">Certified Adapter</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Selection & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History size={18} className="text-slate-400" /> Select Report Type
            </h3>
            <div className="space-y-2">
              {[
                { id: 'inventory', label: 'Daily Inventory Snapshot', desc: 'Current active packages and weight' },
                { id: 'sales', label: 'Sales Transaction Log', desc: 'B2C and B2B transaction history' },
                { id: 'transfers', label: 'Transfer Manifests', desc: 'Inbound and outbound movements' },
                { id: 'audit', label: 'Compliance Audit Trail', desc: 'Full event log and state changes' },
              ].map((report) => (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id as any)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left transition-all group",
                    activeReport === report.id 
                      ? "bg-[#1a4731] border-[#1a4731] text-white shadow-lg" 
                      : "bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <p className="font-bold text-sm mb-1">{report.label}</p>
                  <p className={cn("text-[10px]", activeReport === report.id ? "text-emerald-100" : "text-slate-400")}>
                    {report.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><RefreshCw size={80} /></div>
            <h4 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
               State Submission Status
            </h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-60">Last Successful Sync</span>
                <span className="font-bold">2h 45m ago</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-60">Pending Adjustments</span>
                <span className="font-bold text-emerald-400">None</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <button 
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                    isSubmitting ? "bg-slate-700 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400 shadow-lg shadow-blue-900/40"
                  )}
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                  SUBMIT TO STATE (OMMA)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Preview & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600">
                  <FileDown size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Preview: {activeReport}</h3>
                  <p className="text-[10px] text-slate-500 font-medium italic">Showing latest 50 records...</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleExport('json')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Download size={14} /> JSON
                </button>
                <button 
                  onClick={() => handleExport('csv')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Download size={14} /> CSV
                </button>
              </div>
            </div>

            <div className="flex-1 p-0 bg-slate-900 overflow-auto font-mono text-[10px] leading-relaxed relative min-h-[400px]">
              <div className="absolute inset-0 p-6 text-emerald-400 opacity-80">
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center text-emerald-500/50">
                    <RefreshCw className="animate-spin mb-2" size={32} />
                    <span className="ml-4 font-bold text-lg">RECONSTRUCTING DATASETS...</span>
                  </div>
                ) : (
                  <pre>{`// SINC REGULATORY EXPORT v1.0
// FACILITY: ${facilityId}
// TIMESTAMP: ${new Date().toISOString()}

{
  "header": {
    "jurisdiction": "OK-OMMA",
    "software": "GGP-OS SINC",
    "version": "5.4.1"
  },
  "payload": [
    { "id": "tx_842", "tag": "1A4FF0100000022000001001", "weight": 28.5, "unit": "Grams", "type": "Sale" },
    { "id": "tx_843", "tag": "1A4FF0100000022000001002", "weight": 14.2, "unit": "Grams", "type": "Sale" },
    { "id": "tx_844", "tag": "1A4FF0100000022000001003", "weight": 56.0, "unit": "Grams", "type": "Internal_Transfer" }
  ]
}`}</pre>
                )}
              </div>
            </div>

            {submissionStatus && (
              <div className="p-6 bg-emerald-50 border-t border-emerald-100 animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900">Submission Successful</h4>
                    <p className="text-xs text-emerald-700 font-medium">Submission ID: {submissionStatus.submissionId} | Logged to State Gateway</p>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-200 transition-colors">View Manifesto</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
