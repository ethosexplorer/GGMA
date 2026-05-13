import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Shield, Eye, EyeOff, Save, Clock, CheckCircle, AlertCircle,
  Calendar, FileText, Lock, Plus, ChevronDown, ChevronUp,
  Clipboard, ExternalLink, Truck, RefreshCw, MessageSquare, Send, Phone
} from 'lucide-react';
import { sendSMS, checkQuota, SMS_TEMPLATES } from '../../lib/textbelt';

interface PatientCaseTrackerProps {
  patientUid: string;
  patientName: string;
  patientEmail: string;
  patientState?: string;
  patientPhone?: string;
  staffName?: string;
}

interface CaseData {
  statePortalEmail: string;
  statePortalPassword: string;
  accountCreatedBy: 'staff' | 'patient' | '';
  applicationSubmittedDate: string;
  applicationStatus: 'not_started' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'card_mailed' | 'card_delivered';
  stateAuthority: string;
  licenseNumber: string;
  internalNotes: string;
}

interface StatusCheck {
  id?: string;
  checkedBy: string;
  checkedAt: any;
  status: string;
  notes: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  not_started: { label: 'Not Started', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock },
  submitted: { label: 'Submitted to State', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileText },
  under_review: { label: 'Under Review (Up to 14 Days)', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: RefreshCw },
  approved: { label: 'Approved — Card Processing', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  denied: { label: 'Denied — Action Required', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
  card_mailed: { label: 'Card Mailed (7-10 Business Days)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
  card_delivered: { label: 'Card Delivered ✓', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle },
};

// Calculate estimated dates based on Oklahoma OMMA timelines
const getEstimatedDates = (submissionDate: string) => {
  if (!submissionDate) return null;
  const submitted = new Date(submissionDate);
  
  // Add business days helper
  const addBusinessDays = (date: Date, days: number) => {
    const result = new Date(date);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return result;
  };

  const approvalDate = addBusinessDays(submitted, 14); // OMMA guarantees up to 14 business days
  const mailEarlyDate = addBusinessDays(approvalDate, 7);
  const mailLateDate = addBusinessDays(approvalDate, 10);

  return {
    submitted,
    approvalBy: approvalDate,
    mailEarly: mailEarlyDate,
    mailLate: mailLateDate
  };
};

const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const PatientCaseTracker: React.FC<PatientCaseTrackerProps> = ({
  patientUid, patientName, patientEmail, patientState = 'Oklahoma', patientPhone = '', staffName = 'Staff'
}) => {
  const [caseData, setCaseData] = useState<CaseData>({
    statePortalEmail: '',
    statePortalPassword: '',
    accountCreatedBy: '',
    applicationSubmittedDate: '',
    applicationStatus: 'not_started',
    stateAuthority: patientState === 'Oklahoma' ? 'OMMA' : 'State MMA',
    licenseNumber: '',
    internalNotes: '',
  });

  const [statusChecks, setStatusChecks] = useState<StatusCheck[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCheckNote, setNewCheckNote] = useState('');
  const [newCheckStatus, setNewCheckStatus] = useState('');
  const [showChecks, setShowChecks] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);

  // SMS Notification state
  const [smsPhone, setSmsPhone] = useState(patientPhone);
  const [smsMessage, setSmsMessage] = useState('');
  const [smsSending, setSmsSending] = useState(false);
  const [smsResult, setSmsResult] = useState<{ success: boolean; message: string } | null>(null);
  const [smsQuota, setSmsQuota] = useState<number | null>(null);
  const [showSmsPanel, setShowSmsPanel] = useState(false);

  // Load SMS quota on mount
  useEffect(() => {
    checkQuota().then(q => setSmsQuota(q));
  }, []);

  // Send SMS notification
  const handleSendSMS = async () => {
    if (!smsPhone.trim() || !smsMessage.trim()) return;
    setSmsSending(true);
    setSmsResult(null);
    try {
      const result = await sendSMS(smsPhone, smsMessage);
      setSmsResult({
        success: result.success,
        message: result.success
          ? `SMS sent! Quota remaining: ${result.quotaRemaining}`
          : `Failed: ${result.message || result.error || 'Unknown error'}`
      });
      if (result.success) {
        // Log the SMS in status checks
        const checksRef = collection(db, 'users', patientUid, 'status_checks');
        await addDoc(checksRef, {
          checkedBy: staffName,
          checkedAt: serverTimestamp(),
          status: caseData.applicationStatus,
          notes: `📱 SMS Notification Sent: "${smsMessage.substring(0, 80)}..."`,
        });
        setSmsQuota(result.quotaRemaining || null);
        setSmsMessage('');
      }
    } catch (err: any) {
      setSmsResult({ success: false, message: err.message });
    }
    setSmsSending(false);
  };

  // Load case data from Firestore
  useEffect(() => {
    const loadCaseData = async () => {
      try {
        const caseRef = doc(db, 'users', patientUid, 'case_data', 'main');
        const snap = await getDoc(caseRef);
        if (snap.exists()) {
          setCaseData(prev => ({ ...prev, ...snap.data() as CaseData }));
        }
      } catch (err) {
        console.error('Error loading case data:', err);
      }
    };
    if (patientUid) loadCaseData();
  }, [patientUid]);

  // Real-time listener for status checks
  useEffect(() => {
    if (!patientUid) return;
    const checksRef = collection(db, 'users', patientUid, 'status_checks');
    const q = query(checksRef, orderBy('checkedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setStatusChecks(snap.docs.map(d => ({ id: d.id, ...d.data() } as StatusCheck)));
    });
    return () => unsub();
  }, [patientUid]);

  // Save case data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const caseRef = doc(db, 'users', patientUid, 'case_data', 'main');
      await setDoc(caseRef, {
        ...caseData,
        updatedAt: serverTimestamp(),
        updatedBy: staffName,
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving case data:', err);
      alert('Failed to save. Check console.');
    }
    setIsSaving(false);
  };

  // Log a status check
  const handleLogCheck = async () => {
    if (!newCheckNote.trim()) return;
    try {
      const checksRef = collection(db, 'users', patientUid, 'status_checks');
      await addDoc(checksRef, {
        checkedBy: staffName,
        checkedAt: serverTimestamp(),
        status: newCheckStatus || caseData.applicationStatus,
        notes: newCheckNote.trim(),
      });
      setNewCheckNote('');
      setNewCheckStatus('');
    } catch (err) {
      console.error('Error logging status check:', err);
    }
  };

  const estimated = getEstimatedDates(caseData.applicationSubmittedDate);
  const StatusIcon = STATUS_LABELS[caseData.applicationStatus]?.icon || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
              {patientName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">{patientName}</h3>
              <p className="text-sm text-slate-400 font-medium">{patientEmail}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-wider ${STATUS_LABELS[caseData.applicationStatus]?.color || 'bg-slate-100 text-slate-600'}`}>
              <StatusIcon size={14} />
              {STATUS_LABELS[caseData.applicationStatus]?.label || 'Unknown'}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">{patientState} • {caseData.stateAuthority}</p>
          </div>
        </div>
      </div>

      {/* Application Timeline */}
      {caseData.applicationSubmittedDate && estimated && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <button onClick={() => setShowTimeline(!showTimeline)} className="w-full flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Calendar size={16} className="text-indigo-600" /> Application Timeline
            </h4>
            {showTimeline ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {showTimeline && (
            <div className="relative">
              <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-slate-200" />
              <div className="space-y-6">
                {/* Submitted */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center z-10 border-2 border-blue-300">
                    <FileText size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800">Application Submitted</p>
                    <p className="text-xs text-slate-500 font-bold">{formatDate(estimated.submitted)}</p>
                  </div>
                </div>
                {/* Estimated Approval */}
                <div className="flex items-start gap-4 relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border-2 ${
                    caseData.applicationStatus === 'approved' || caseData.applicationStatus === 'card_mailed' || caseData.applicationStatus === 'card_delivered'
                      ? 'bg-emerald-100 border-emerald-300' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <CheckCircle size={14} className={
                      caseData.applicationStatus === 'approved' || caseData.applicationStatus === 'card_mailed' || caseData.applicationStatus === 'card_delivered'
                        ? 'text-emerald-600' : 'text-amber-500'
                    } />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800">Estimated Approval</p>
                    <p className="text-xs text-slate-500 font-bold">By {formatDate(estimated.approvalBy)} (up to 14 business days)</p>
                  </div>
                </div>
                {/* Card Delivery */}
                <div className="flex items-start gap-4 relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border-2 ${
                    caseData.applicationStatus === 'card_delivered'
                      ? 'bg-emerald-100 border-emerald-300' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <Truck size={14} className={caseData.applicationStatus === 'card_delivered' ? 'text-emerald-600' : 'text-slate-400'} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800">Estimated Delivery</p>
                    <p className="text-xs text-slate-500 font-bold">{formatDate(estimated.mailEarly)} – {formatDate(estimated.mailLate)} (7-10 business days after approval)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Credential Vault + Application Info */}
        <div className="space-y-6">
          {/* Secure Credential Vault */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider mb-5">
              <Lock size={16} className="text-red-500" /> State Portal Credentials
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Portal Email</label>
                <input
                  type="email"
                  value={caseData.statePortalEmail}
                  onChange={(e) => setCaseData(prev => ({ ...prev, statePortalEmail: e.target.value }))}
                  placeholder="patient@email.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Portal Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={caseData.statePortalPassword}
                    onChange={(e) => setCaseData(prev => ({ ...prev, statePortalPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-12"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Account Created By</label>
                <select
                  value={caseData.accountCreatedBy}
                  onChange={(e) => setCaseData(prev => ({ ...prev, accountCreatedBy: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="">— Select —</option>
                  <option value="staff">Staff Created (default password)</option>
                  <option value="patient">Patient Provided</option>
                </select>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                  ⚠️ Credentials are stored securely in Firestore. Only staff with admin access can view this information. The patient can also login at their state portal to check their own status.
                </p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider mb-5">
              <Clipboard size={16} className="text-emerald-600" /> Application Details
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Date Submitted to State</label>
                  <input
                    type="date"
                    value={caseData.applicationSubmittedDate}
                    onChange={(e) => setCaseData(prev => ({ ...prev, applicationSubmittedDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Application Status</label>
                  <select
                    value={caseData.applicationStatus}
                    onChange={(e) => setCaseData(prev => ({ ...prev, applicationStatus: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  >
                    {Object.entries(STATUS_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">State Authority</label>
                  <input
                    type="text"
                    value={caseData.stateAuthority}
                    onChange={(e) => setCaseData(prev => ({ ...prev, stateAuthority: e.target.value }))}
                    placeholder="e.g. OMMA"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">License/Card Number</label>
                  <input
                    type="text"
                    value={caseData.licenseNumber}
                    onChange={(e) => setCaseData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="Once issued"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Status Checks + Notes */}
        <div className="space-y-6">
          {/* Status Check Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <button onClick={() => setShowChecks(!showChecks)} className="w-full flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <RefreshCw size={16} className="text-blue-600" /> Status Check Log ({statusChecks.length})
              </h4>
              {showChecks ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {showChecks && (
              <>
                {/* Add New Check */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4 space-y-3">
                  <textarea
                    value={newCheckNote}
                    onChange={(e) => setNewCheckNote(e.target.value)}
                    placeholder="e.g. Checked OMMA portal — application still under review, no updates..."
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={newCheckStatus}
                      onChange={(e) => setNewCheckStatus(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="">Current Status (no change)</option>
                      {Object.entries(STATUS_LABELS).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleLogCheck}
                      disabled={!newCheckNote.trim()}
                      className="px-5 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus size={12} /> Log Check
                    </button>
                  </div>
                </div>

                {/* Check History */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {statusChecks.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium text-center py-6">No status checks logged yet</p>
                  ) : statusChecks.map((check, i) => (
                    <div key={check.id || i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{check.checkedBy}</span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {check.checkedAt?.toDate ? check.checkedAt.toDate().toLocaleString() : 'Just now'}
                        </span>
                      </div>
                      {check.status && (
                        <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-1 ${STATUS_LABELS[check.status]?.color || 'bg-slate-100 text-slate-500'}`}>
                          {STATUS_LABELS[check.status]?.label || check.status}
                        </span>
                      )}
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{check.notes}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Internal Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
              <FileText size={16} className="text-purple-600" /> Internal Staff Notes
            </h4>
            <textarea
              value={caseData.internalNotes}
              onChange={(e) => setCaseData(prev => ({ ...prev, internalNotes: e.target.value }))}
              placeholder="Private notes about this patient's case. Only visible to staff..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* SMS Notification Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <button onClick={() => setShowSmsPanel(!showSmsPanel)} className="w-full flex items-center justify-between">
          <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
            <MessageSquare size={16} className="text-green-600" /> SMS Notifications
            {smsQuota !== null && <span className="text-[10px] font-bold text-slate-400 normal-case tracking-normal ml-2">({smsQuota} texts remaining)</span>}
          </h4>
          {showSmsPanel ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        {showSmsPanel && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Patient Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder="4055551234"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500/20"
                />
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'App Submitted', fn: () => setSmsMessage(SMS_TEMPLATES.applicationSubmitted(patientName.split(' ')[0], patientState)) },
                  { label: 'Approved!', fn: () => setSmsMessage(SMS_TEMPLATES.applicationApproved(patientName.split(' ')[0], patientState)) },
                  { label: 'Card Mailed', fn: () => setSmsMessage(SMS_TEMPLATES.cardMailed(patientName.split(' ')[0])) },
                  { label: 'Card Delivered', fn: () => setSmsMessage(SMS_TEMPLATES.cardDelivered(patientName.split(' ')[0])) },
                  { label: 'Status Update', fn: () => setSmsMessage(SMS_TEMPLATES.statusUpdate(patientName.split(' ')[0], STATUS_LABELS[caseData.applicationStatus]?.label || 'Updated')) },
                ].map((tpl, i) => (
                  <button key={i} onClick={tpl.fn} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-green-100 transition-colors">
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Message</label>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type a message or select a template above..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium">{smsMessage.length}/160 characters (1 SMS)</p>
            </div>

            {smsResult && (
              <div className={`p-3 rounded-xl border text-xs font-bold ${smsResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {smsResult.success ? '✅' : '❌'} {smsResult.message}
              </div>
            )}

            <button
              onClick={handleSendSMS}
              disabled={smsSending || !smsPhone.trim() || !smsMessage.trim()}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} /> {smsSending ? 'Sending...' : 'Send SMS to Patient'}
            </button>
          </div>
        )}
      </div>

      {/* Save Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-sm sticky bottom-4">
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-wider animate-pulse">
              <CheckCircle size={14} /> Saved Successfully
            </div>
          )}
          {!saved && (
            <p className="text-[10px] text-slate-400 font-bold">Changes are saved when you click Save. Status checks are saved immediately.</p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          <Save size={14} /> {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};
