'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({ checklist: z.array(z.string()) });

export function LaboratoryInspectionForm() {
  return (
    <OmmaFormWrapper schema={schema} formType="LaboratoryInspectionForm">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Laboratory Inspection Form</h1>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
