'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({ checklist: z.array(z.string()).optional() });

export function OperationalStatusVisitForm() {
  return (
    <OmmaFormWrapper schema={schema} formType="OperationalStatusVisitForm">
      {({ register }: any) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Operational Status Visit Form</h1>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
