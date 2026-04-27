'use client';
import React from 'react';
import OmmaFormWrapper from './OmmaFormWrapper';
import { z } from 'zod';

const schema = z.object({ checked: z.boolean().optional() });

export function CommercialLicenseeChecklist() {
  return (
    <OmmaFormWrapper schema={schema} formType="CommercialLicenseeChecklist">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Commercial Licensee Operations Checklist</h1>
          <div><label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
            <input type="checkbox" {...register('checked')} className="w-5 h-5 text-green-600 rounded" />
            <span className="font-medium text-slate-700">Standard Operating Procedures verified</span>
          </label></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
