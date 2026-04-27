'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({ checklist: z.array(z.string()) });

export function DispensaryInspectionForm() {
  return (
    <OmmaFormWrapper schema={schema} formType="DispensaryInspectionForm">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Dispensary Inspection Form</h1>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" {...register('checklist')} value="item1" />
              <span>Are the records and information maintained in the licensee&apos;s online OMMA license account correct?</span>
            </div>
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
