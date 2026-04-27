'use client';
import React from 'react';
import OmmaFormWrapper from './OmmaFormWrapper';
import { z } from 'zod';

const schema = z.object({ checklist: z.array(z.string()).optional() });

export function GrowerInspectionForm() {
  return (
    <OmmaFormWrapper schema={schema} formType="GrowerInspectionForm">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Grower Inspection Form</h1>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
