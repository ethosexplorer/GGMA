'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  patientFirstName: z.string().min(1), patientLastName: z.string().min(1),
  patientLicenseNumber: z.string().min(1),
  caregiverFirstName: z.string().min(1), caregiverLastName: z.string().min(1),
});

export function CaregiverDesignation() {
  return (
    <OmmaFormWrapper schema={schema} formType="CaregiverDesignation">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Caregiver Designation Form</h1>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="font-bold text-sm text-slate-700">First Name</label><input {...register('patientFirstName')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
            <div><label className="font-bold text-sm text-slate-700">Last Name</label><input {...register('patientLastName')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
            <div><label className="font-bold text-sm text-slate-700">Patient License #</label><input {...register('patientLicenseNumber')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
          </div>
          <h2 className="text-xl font-bold text-green-700 mt-6 border-b pb-2">Caregiver Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-bold text-sm text-slate-700">Caregiver First Name</label><input {...register('caregiverFirstName')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
            <div><label className="font-bold text-sm text-slate-700">Caregiver Last Name</label><input {...register('caregiverLastName')} className="border border-slate-300 p-3 w-full rounded-lg" /></div>
          </div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
