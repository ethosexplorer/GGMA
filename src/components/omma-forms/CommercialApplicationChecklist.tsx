'use client';
import React from 'react';
import OmmaFormWrapper from './OmmaFormWrapper';
import { z } from 'zod';

const checklistSchema = z.object({ completed: z.array(z.string()).optional() });

export function CommercialApplicationChecklist() {
  return (
    <OmmaFormWrapper schema={checklistSchema} formType="CommercialApplicationChecklist">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Commercial Application Checklist</h1>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" value="identity" {...register('completed')} className="w-5 h-5 text-green-600 rounded" />
              <span className="font-medium text-slate-700">Proof of Identity (State ID, Passport)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" value="background" {...register('completed')} className="w-5 h-5 text-green-600 rounded" />
              <span className="font-medium text-slate-700">Background Check Affidavit</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" value="compliance" {...register('completed')} className="w-5 h-5 text-green-600 rounded" />
              <span className="font-medium text-slate-700">Certificate of Compliance (Zoning)</span>
            </label>
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
