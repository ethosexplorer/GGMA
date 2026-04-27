'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  applicationNumber: z.string().min(1),
  fullName: z.string().min(1),
});

export function InterviewIntake() {
  return (
    <OmmaFormWrapper schema={schema} formType="InterviewIntake">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Interview Intake Form</h1>
          <div><label>Application Number</label><input {...register('applicationNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Full Legal Name</label><input {...register('fullName')} className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
