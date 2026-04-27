'use client';
import React from 'react';
import OmmaFormWrapper from './OmmaFormWrapper';
import { z } from 'zod';

const checklistSchema = z.object({ completed: z.array(z.string()).optional() });

export function CommercialPostApprovalChecklist() {
  return (
    <OmmaFormWrapper schema={checklistSchema} formType="CommercialPostApprovalChecklist">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Commercial Post-Approval Checklist</h1>
          <p className="text-slate-600 text-center">Steps to complete after your license is approved by OMMA.</p>
          <div className="space-y-3">
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
               <input type="checkbox" value="metrc" {...register('completed')} className="w-5 h-5 text-green-600 rounded" />
               <span className="font-medium text-slate-700">Metrc Admin Training Completed</span>
             </label>
             <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
               <input type="checkbox" value="tags" {...register('completed')} className="w-5 h-5 text-green-600 rounded" />
               <span className="font-medium text-slate-700">Ordered initial plant/package tags</span>
             </label>
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
