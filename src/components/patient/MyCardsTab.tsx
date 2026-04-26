import React from 'react';
import { CreditCard, QrCode, Clock, RefreshCw, AlertCircle, Shield, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

const myCards = [
  {
    id: 'OMMA-2026-99482',
    type: 'Medical Marijuana Patient',
    state: 'Oklahoma',
    status: 'Active',
    issued: 'Jan 15, 2026',
    expires: 'Jan 15, 2028',
    daysLeft: 636,
    photo: null,
  },
  {
    id: 'OMMA-2026-CG-1123',
    type: 'Caregiver Authorization',
    state: 'Oklahoma',
    status: 'Active',
    issued: 'Mar 1, 2026',
    expires: 'Mar 1, 2028',
    daysLeft: 681,
    photo: null,
  },
];

const compassionNetwork = {
  balance: 150.00,
  earned: 742,
  redeemed: 318,
  pending: 45,
};

export const MyCardsTab = () => (
  <div className="space-y-6">
    {/* Cards Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {myCards.map((card) => (
        <div key={card.id} className="space-y-4">
          {/* Authentic OMMA Card Replica */}
          <div className="bg-white shadow-xl overflow-hidden border border-slate-200 relative w-full aspect-[1.6] rounded-xl flex flex-col">
            {/* Header */}
            <div className="bg-[#1b4f8a] px-3 py-2 flex justify-between items-center text-white border-b-4 border-blue-900 shrink-0">
               <div className="flex items-center gap-2">
                  <div className="text-[7px] leading-tight font-black uppercase tracking-tighter">
                    Oklahoma<br/>Medical Marijuana<br/>Authority
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[6px] font-bold tracking-widest text-blue-200 uppercase">Oklahoma Medical Marijuana</div>
                  <div className="text-[10px] font-black tracking-tight uppercase leading-none">Adult Patient License</div>
               </div>
            </div>

            {/* Body */}
            <div className="p-3 flex gap-4 flex-1 relative bg-white">
               {/* Watermark */}
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                  <span className="text-6xl font-black uppercase -rotate-12 tracking-[0.3em]">VALID</span>
               </div>
               
               {/* Photo Column */}
               <div className="w-24 flex flex-col z-10 shrink-0">
                  <div className="flex-1 bg-slate-100 border border-slate-300 flex items-end justify-center overflow-hidden">
                     <div className="w-20 h-24 bg-slate-300 rounded-t-full mt-4 mx-auto flex items-center justify-center border-b-0 border-slate-400">
                        <span className="text-slate-400 text-4xl">👤</span>
                     </div>
                  </div>
                  <div className="bg-[#1b4f8a] text-white text-center text-[10px] font-black uppercase py-1 tracking-widest border border-[#1b4f8a]">
                     {card.type.includes('Caregiver') ? 'Caregiver' : 'Patient'}
                  </div>
               </div>

               {/* Info Column */}
               <div className="flex-1 flex flex-col justify-between z-10 py-1">
                  <div>
                     <div className="text-[8px] font-bold text-slate-800 uppercase">Sample</div>
                     <div className="font-bold text-slate-900 leading-none text-sm mb-1">Sally Ann</div>
                     <div className="font-bold text-slate-800 text-xs leading-tight">Oklahoma City</div>
                     <div className="font-bold text-slate-800 text-xs leading-tight">Oklahoma County</div>
                  </div>
                  
                  <div className="space-y-0.5">
                     <div className="font-bold text-slate-900 text-[10px]">DOB: 01/20/1990</div>
                     <div className="font-bold text-red-600 text-[10px]">EXP: {card.expires}</div>
                  </div>

                  <div>
                     <div className="text-[9px] font-bold text-slate-800 uppercase">Patient ID#:</div>
                     <div className="font-mono text-xs font-black text-slate-900 tracking-wider -mt-0.5">{card.id}</div>
                  </div>

                  {/* Barcode Mock */}
                  <div className="h-6 w-full max-w-[120px] opacity-70 mt-1" style={{ backgroundImage: 'repeating-linear-gradient(to right, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 7px)' }}></div>
               </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm">
              <QrCode size={14} /> Scan
            </button>
            <button className="flex-1 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm">
              <Download size={14} /> Export
            </button>
            <button className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-900/20">
              <RefreshCw size={14} /> Renew
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Compassion Network */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Compassion Network</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Wallet Balance', value: `$${compassionNetwork.balance.toFixed(2)}`, color: 'text-emerald-600' },
            { label: 'Points Earned', value: compassionNetwork.earned.toString(), color: 'text-blue-600' },
            { label: 'Points Redeemed', value: compassionNetwork.redeemed.toString(), color: 'text-purple-600' },
            { label: 'Pending Points', value: compassionNetwork.pending.toString(), color: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <p className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield size={16} className="text-emerald-600" /> Card Compliance
        </h3>
        <div className="space-y-3">
          {[
            { check: 'Card Status Valid', ok: true },
            { check: 'Photo ID Verified', ok: true },
            { check: 'Physician Recommendation', ok: true },
            { check: 'Purchase Limits', ok: true },
            { check: 'Next Renewal', ok: false, note: 'Due Jan 15, 2028' },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{c.check}</span>
              {c.ok ? (
                <span className="text-emerald-600 font-bold text-xs">✓ Verified</span>
              ) : (
                <span className="text-amber-600 text-xs font-medium">{c.note}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Alerts */}
    <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-800 text-sm">Upcoming Renewals</h4>
          <p className="text-xs text-amber-700 mt-1">Your Medical Marijuana Patient card expires Jan 15, 2028. You can start the renewal process 90 days before expiration. Sylara will remind you automatically.</p>
        </div>
      </div>
    </div>
  </div>
);

