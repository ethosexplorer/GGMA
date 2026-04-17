import React, { useState } from 'react';
import { Activity, Calendar, Stethoscope, Shield, FileText, Clock, Plus, LayoutDashboard, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';

import { SubscriptionPortal } from '../components/SubscriptionPortal';

export const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscription'>('overview');

  return (
  <div className="space-y-6">
    <div className="flex bg-white rounded-xl border border-slate-200 p-1 w-max shadow-sm mb-6">
      <button 
        onClick={() => setActiveTab('overview')}
        className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", activeTab === 'overview' ? "bg-slate-100 text-[#1a4731]" : "text-slate-500 hover:text-slate-700")}
      >
        <LayoutDashboard size={16} /> Overview
      </button>
      <button 
        onClick={() => setActiveTab('subscription')}
        className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", activeTab === 'subscription' ? "bg-[#1a4731] text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700")}
      >
        <CreditCard size={16} /> Subscription & Billing
      </button>
    </div>

    {activeTab === 'overview' && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Heart Rate" value="72 bpm" trend={2} icon={Activity} color="bg-[#1a4731]" />
      <StatCard label="Next Checkup" value="Oct 12" icon={Calendar} color="bg-[#1a4731]" />
      <StatCard label="Active Meds" value="4" icon={Stethoscope} color="bg-emerald-500" />
      <StatCard label="Health Score" value="94/100" trend={5} icon={Shield} color="bg-indigo-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Recent Activity</h3>
          <button className="text-sm text-[#1a4731] font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-6">
          {[
            { title: 'Blood Test Results', date: 'Yesterday', type: 'Lab Report', status: 'Ready' },
            { title: 'Appointment with Dr. Smith', date: '2 days ago', type: 'Cardiology', status: 'Completed' },
            { title: 'Prescription Refill', date: '5 days ago', type: 'Pharmacy', status: 'Pending' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.type} • {item.date}</p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                item.status === 'Ready' ? "bg-emerald-50 text-emerald-600" :
                  item.status === 'Completed' ? "bg-emerald-50 text-[#1a4731]" : "bg-amber-50 text-amber-600"
              )}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">Upcoming Appointments</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-blue-100">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-[#153a28]">General Checkup</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a4731]">Tomorrow</span>
            </div>
            <p className="text-sm text-[#1a4731]">Dr. Sarah Johnson</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-[#1a4731] font-medium">
              <Clock size={14} />
              <span>09:30 AM</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-800">Dental Cleaning</p>
            <p className="text-sm text-slate-500">Dr. Michael Chen</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-medium">
              <Clock size={14} />
              <span>Oct 15, 02:00 PM</span>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} />
          Book New Appointment
        </button>
      </div>
    </div>
    </>
    )}

    {activeTab === 'subscription' && (
      <SubscriptionPortal userRole="user" initialPlanId="b2c_basic" />
    )}
  </div>
)};
