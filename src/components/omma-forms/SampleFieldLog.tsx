'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  ommaBusinessName: z.string(),
  laboratoryName: z.string(),
});

export function SampleFieldLog() {
  return (
    <OmmaFormWrapper schema={schema} formType="SampleFieldLog">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Sample Field Log</h1>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
