'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  businessName: z.string(),
  licenseNumber: z.string(),
});

export function NonMedicalMarijuanaWasteDisposalLog() {
  return (
    <OmmaFormWrapper schema={schema} formType="NonMedicalMarijuanaWasteDisposalLog">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Non-Medical Marijuana Waste Disposal Log</h1>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
