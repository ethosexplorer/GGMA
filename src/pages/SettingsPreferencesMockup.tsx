import React, { useState } from 'react';
import { Shield, Bell, Truck, AlertTriangle, ChevronLeft, Save, CircleCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPreferencesMockup = () => {
  const [preferences, setPreferences] = useState({
    deliverySms: true,
    securitySms: true,
    psaSms: true,
    emailMarketing: false
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="bg-[#1a4731] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Account Settings</h1>
              <p className="text-emerald-100 text-sm">Manage your notifications and privacy preferences</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            JD
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="text-emerald-600" size={20} />
              Notification Preferences
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure how Global Green Hybrid Platform (GGHP) communicates with you.</p>
          </div>

          <div className="space-y-6">
            {/* Delivery Notifications */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Truck size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-base mb-1">Delivery Notifications</h3>
                  <p className="text-sm text-slate-600 mb-3">Receive real-time tracking updates when your orders or medical products are dispatched and out for delivery.</p>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <input 
                      type="checkbox" 
                      className="mt-0.5 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]" 
                      checked={preferences.deliverySms}
                      onChange={(e) => setPreferences({...preferences, deliverySms: e.target.checked})}
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Opt-in to Delivery SMS Alerts</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        By checking this box, you consent to receive order and delivery status text messages from Global Green Hybrid Platform (GGHP) to your registered mobile number. <strong className="text-slate-700">Message and data rates may apply. Reply STOP to opt out.</strong> See our <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Alerts */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Shield size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-base mb-1">Security Alerts</h3>
                  <p className="text-sm text-slate-600 mb-3">Get immediate notifications regarding suspicious logins, password resets, and account credential changes.</p>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <input 
                      type="checkbox" 
                      className="mt-0.5 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]" 
                      checked={preferences.securitySms}
                      onChange={(e) => setPreferences({...preferences, securitySms: e.target.checked})}
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Opt-in to Security SMS Alerts</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        By checking this box, you consent to receive critical security and account integrity text messages from Global Green Hybrid Platform (GGHP). <strong className="text-slate-700">Message and data rates may apply. Reply STOP to opt out.</strong> We never share your data with 3rd parties for marketing purposes.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Public Service Announcements */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-base mb-1">Public Service Announcements (PSA)</h3>
                  <p className="text-sm text-slate-600 mb-3">Stay informed about state regulatory changes, public health notices, and system-wide compliance updates.</p>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <input 
                      type="checkbox" 
                      className="mt-0.5 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]" 
                      checked={preferences.psaSms}
                      onChange={(e) => setPreferences({...preferences, psaSms: e.target.checked})}
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Opt-in to PSA SMS Alerts</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        By checking this box, you consent to receive public service and regulatory update text messages from Global Green Hybrid Platform (GGHP). <strong className="text-slate-700">Message and data rates may apply. Reply STOP to opt out.</strong> See our <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-4">
          <button className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2.5 rounded-xl font-bold bg-[#1a4731] text-white hover:bg-[#153a28] transition-colors flex items-center gap-2 shadow-sm">
            <Save size={18} />
            Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
};
