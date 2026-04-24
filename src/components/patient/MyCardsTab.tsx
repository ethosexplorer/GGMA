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
        <div key={card.id} className="relative overflow-hidden bg-[#0f2d1e] bg-gradient-to-br from-[#0f2d1e] via-[#1a4731] to-[#0b3320] rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-300/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-300" />
                <span className="text-emerald-300/80 text-xs font-bold uppercase tracking-wider">{card.state}</span>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold",
                card.status === 'Active' ? "bg-emerald-500/30 text-emerald-200" : "bg-red-500/30 text-red-200"
              )}>
                {card.status}
              </span>
            </div>

            <h3 className="text-lg font-bold mb-1">{card.type}</h3>
            <p className="text-emerald-300/60 text-sm font-mono">{card.id}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-emerald-300/50 text-[10px] uppercase tracking-wider">Issued</p>
                <p className="text-sm font-semibold">{card.issued}</p>
              </div>
              <div>
                <p className="text-emerald-300/50 text-[10px] uppercase tracking-wider">Expires</p>
                <p className="text-sm font-semibold">{card.expires}</p>
              </div>
            </div>

            {/* Expiration Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-300/60">{card.daysLeft} days remaining</span>
                <span className="text-emerald-300/60">{Math.round((card.daysLeft / 730) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.round((card.daysLeft / 730) * 100)}%` }} />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                <QrCode size={14} /> Show QR
              </button>
              <button className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                <Download size={14} /> Download
              </button>
              <button className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                <RefreshCw size={14} /> Renew
              </button>
            </div>
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

