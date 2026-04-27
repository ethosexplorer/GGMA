'use client';
import React from 'react';
import { z } from 'zod';
import OmmaFormWrapper from './OmmaFormWrapper';

const schema = z.object({
  agentFirstName: z.string().min(1),
  agentLastName: z.string().min(1),
  agentDob: z.string().min(1),
  agentLicenseNumber: z.string().min(1),
  businessName: z.string().min(1),
  businessLicenseNumber: z.string().min(1),
  signatureDate: z.string().min(1),
});

export function TransportationAgentEmployeeVerification() {
  return (
    <OmmaFormWrapper schema={schema} formType="TransportationAgentEmployeeVerification">
      {({ register }) => (
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-green-800">Transportation Agent Employee Verification Form</h1>
          <div className="grid grid-cols-2 gap-6">
            <div><label>First Name</label><input {...register('agentFirstName')} className="border p-3 w-full rounded" /></div>
            <div><label>Last Name</label><input {...register('agentLastName')} className="border p-3 w-full rounded" /></div>
          </div>
          <div><label>Date of Birth</label><input {...register('agentDob')} type="date" className="border p-3 w-full rounded" /></div>
          <div><label>Oklahoma Driver's License Number</label><input {...register('agentLicenseNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Business Name</label><input {...register('businessName')} className="border p-3 w-full rounded" /></div>
          <div><label>OMMA Business License Number</label><input {...register('businessLicenseNumber')} className="border p-3 w-full rounded" /></div>
          <div><label>Signature Date</label><input {...register('signatureDate')} type="date" className="border p-3 w-full rounded" /></div>
        </div>
      )}
    </OmmaFormWrapper>
  );
}
