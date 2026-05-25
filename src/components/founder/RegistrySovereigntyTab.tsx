import React, { useState } from 'react';
import { HeartPulse, TrendingUp, Globe, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { PatientCaseTracker } from '../patient/PatientCaseTracker';

export const RegistrySovereigntyTab = ({
  counts,
  fullName,
  patientList
}: {
  counts: { users: number; patients: number; businesses: number; admins: number; joinedToday: number };
  fullName: string;
  patientList: any[];
}) => {
  const [selectedPatientCase, setSelectedPatientCase] = useState<any>(null);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-white border-4 border-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><HeartPulse size={160} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">Registry Sovereignty</h2>
            <p className="text-slate-500 font-bold text-lg max-w-xl">Unified citizen oversight. Monitor patient distribution, medical card velocity, and state-level registration reciprocities in real-time.</p>
          </div>
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center min-w-[240px] shadow-2xl">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Total Verified Citizens</p>
            <p className="text-5xl font-black">{counts.patients.toLocaleString()}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
              <TrendingUp size={16} /> 4.2% Growth (24h)
            </div>
          </div>
        </div>
      </div>

      {/* Patient Case Tracker */}
      {selectedPatientCase ? (
        <div>
          <button onClick={() => setSelectedPatientCase(null)} className="mb-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center gap-2">
            ← Back to Patient List
          </button>
          <PatientCaseTracker
            patientUid={selectedPatientCase.uid}
            patientName={selectedPatientCase.fullName || selectedPatientCase.name || selectedPatientCase.displayName || 'Unknown'}
            patientEmail={selectedPatientCase.email || ''}
            patientState={selectedPatientCase.state || selectedPatientCase.jurisdiction || 'Oklahoma'}
            patientPhone={selectedPatientCase.phone || selectedPatientCase.textPhone || ''}
            staffName={fullName}
          />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-black text-slate-800 flex items-center gap-3"><HeartPulse size={20} className="text-emerald-600" /> Patient Case Files ({patientList.length})</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Click a patient to manage their case</p>
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {patientList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">No patients registered yet</div>
            ) : patientList.map((patient: any) => (
              <button
                key={patient.uid}
                onClick={() => setSelectedPatientCase(patient)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-emerald-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-sm">
                    {(patient.fullName || patient.name || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 group-hover:text-emerald-700 transition-colors">{patient.fullName || patient.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{patient.email} • {patient.state || patient.jurisdiction || 'No state'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-emerald-600">Open Case →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Globe size={60} /></div>
          <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Top Growth States</h4>
          <div className="space-y-4">
            {['Oklahoma', 'Missouri', 'Texas', 'Florida'].map((state, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="font-bold text-sm">{state}</span>
                <span className="text-xs font-black text-emerald-400">+{(12 - i * 2.5).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
            <Activity size={18} className="text-indigo-600" /> Patient Reciprocity Index
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { l: 'Verified Medical', v: '82%', c: 'bg-emerald-500' },
              { l: 'Out-of-State Sync', v: '64%', c: 'bg-blue-500' },
              { l: 'Auto-Renewals', v: '91%', c: 'bg-indigo-500' },
              { l: 'Minor Patient Approval', v: '12%', c: 'bg-amber-500' }
            ].map((idx, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-slate-800">{idx.v}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{idx.l}</p>
                <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div className={cn("h-full", idx.c)} style={{ width: idx.v }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
