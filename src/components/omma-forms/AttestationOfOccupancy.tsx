'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({ submissionDate: z.string().min(1), signatureDate: z.string().min(1) });

export function AttestationOfOccupancy() {
  return (
    <OmmaFormWrapper schema={schema} formType="AttestationOfOccupancy">
      {({ register }) => (
        <div className="space-y-8">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-green-800">Attestation of Application for Certificate of Occupancy</h1>
            <p className="text-green-700">Oklahoma Medical Marijuana Authority</p>
          </div>
          <div className="border p-6 rounded-xl border-slate-200 bg-slate-50">
            <label className="block text-sm font-bold text-slate-700 mb-2">Date I submitted the full application (mm/dd/yyyy)</label>
            <input {...register('submissionDate')} type="date" className="w-full border border-slate-300 p-4 rounded-lg bg-white" />
          </div>
          <div className="border p-6 rounded-xl border-slate-200 bg-slate-50">
            <label className="block text-sm font-bold text-slate-700 mb-2">Signature (Type Full Legal Name)</label>
            <input type="text" className="w-full border border-slate-300 p-4 rounded-lg bg-white" placeholder="Full Legal Name" />
          </div>
          <div className="border p-6 rounded-xl border-slate-200 bg-slate-50">
            <label className="block text-sm font-bold text-slate-700 mb-2">Date of Signature (mm/dd/yyyy)</label>
            <input {...register('signatureDate')} type="date" className="w-full border border-slate-300 p-4 rounded-lg bg-white" />
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
