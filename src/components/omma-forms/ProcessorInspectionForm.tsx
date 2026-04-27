'use client';
import React from 'react';
import OmmaFormWrapper from './OmmaFormWrapper';
import { z } from 'zod';

const schema = z.object({ checklist: z.array(z.string()).optional() });

export function ProcessorInspectionForm() {
  return (
    <OmmaFormWrapper schema={schema} formType="ProcessorInspectionForm">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Processor Inspection Form</h1>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
