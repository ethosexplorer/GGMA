'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  municipalityName: z.string().min(1),
  schoolName: z.string().min(1),
  dispensaryName: z.string().min(1),
  licenseNumber: z.string().min(1),
});

export function MunicipalSetbackDistanceObjection() {
  return (
    <OmmaFormWrapper schema={schema} formType="MunicipalSetbackDistanceObjection">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Setback Distance Objection Form</h1>
          <div className="grid grid-cols-2 gap-6">
            <div><label>Name of Municipality</label><input {...register('municipalityName')} className="border p-3 w-full rounded" /></div>
            <div><label>School Name</label><input {...register('schoolName')} className="border p-3 w-full rounded" /></div>
          </div>
          <div><label>Dispensary Name</label><input {...register('dispensaryName')} className="border p-3 w-full rounded" /></div>
          <div><label>License Number</label><input {...register('licenseNumber')} className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
