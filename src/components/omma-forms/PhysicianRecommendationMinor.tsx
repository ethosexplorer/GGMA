'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  patientFirstName: z.string().min(1),
  patientLastName: z.string().min(1),
});

export function PhysicianRecommendationMinor() {
  return (
    <OmmaFormWrapper schema={schema} formType="PhysicianRecommendationMinor">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Physician Recommendation Form – Minor Patient</h1>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-bold text-sm">Minor First Name</label><input {...register('patientFirstName')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
            <div><label className="font-bold text-sm">Minor Last Name</label><input {...register('patientLastName')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
