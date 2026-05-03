import React, { useState, useEffect } from 'react';
import { turso } from '../../lib/turso';
import { db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { FileText, CheckCircle, AlertCircle, Loader2, Send, CreditCard, ExternalLink, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { MasterBankingInfo } from '../MasterBankingInfo';

export const InvoiceManager = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewEmail, setPreviewEmail] = useState<{type: 'invoice' | 'welcome', request: any, subject: string, body: string} | null>(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await turso.execute('SELECT * FROM subscription_requests ORDER BY created_at DESC');
      setRequests(res.rows);
    } catch (err) {
      console.error('Failed to fetch subscription requests', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleGenerateInvoiceClick = (request: any) => {
    const subject = `Invoice for GGP-OS Subscription: ${request.plan_name}`;
    const body = `Hello ${request.customer_name},

Thank you for choosing GGP-OS. Your registration for the ${request.plan_name} has been received.

INVOICE DETAILS:
- Plan: ${request.plan_name}
- Total Amount Due: $${Number(request.total_amount).toLocaleString()}

PAYMENT INSTRUCTIONS (ACH / Wire Transfer):
Please remit payment to our official corporate payables account below:

Bank Name: Found Bank (Lead Bank)
Account Name: Global Green Enterprise Inc
Routing Number: 101019644
Account Number: 216135695772

Once your transfer has cleared, your dashboard access will be immediately activated.

Thank you,
GGP-OS Executive Command
globalgreenhp@gmail.com`;

    setPreviewEmail({ type: 'invoice', request, subject, body });
  };

  const handleMarkPaidClick = (request: any) => {
    const subject = `Welcome to GGP-OS: Your Account is Active!`;
    const body = `Hello ${request.customer_name},

We have successfully received your payment. Your GGP-OS account has been fully provisioned and unlocked!

You can now log in securely using your email address and the password you created during registration.

Access the Portal Here:
https://ggp-os.com/

If you have any questions or need onboarding assistance, please reach out.

Welcome aboard,
GGP-OS Executive Command
globalgreenhp@gmail.com`;

    setPreviewEmail({ type: 'welcome', request, subject, body });
  };

  const confirmAndDispatchEmail = async () => {
    if (!previewEmail) return;
    
    const { type, request, subject, body } = previewEmail;
    setProcessingId(request.id as string);
    
    try {
      if (type === 'invoice') {
        await turso.execute({
          sql: "UPDATE subscription_requests SET status = 'invoiced' WHERE id = ?",
          args: [request.id]
        });
      } else if (type === 'welcome') {
        await turso.execute({
          sql: "UPDATE subscription_requests SET status = 'active' WHERE id = ?",
          args: [request.id]
        });

        // 2. Find User in Firebase by Email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', request.customer_email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          let newRole = 'user';
          const cat = String(request.category).toLowerCase();
          const plan = String(request.plan_name).toLowerCase();
          
          if (cat.includes('business') || plan.includes('business') || plan.includes('dispensary') || plan.includes('cultivator')) newRole = 'business';
          else if (cat.includes('provider') || plan.includes('provider') || plan.includes('clinic')) newRole = 'provider';
          else if (cat.includes('attorney') || plan.includes('attorney')) newRole = 'attorney';
          else if (cat.includes('patient')) newRole = 'Patient / Caregiver';
          else newRole = 'business';

          await updateDoc(doc(db, 'users', userDoc.id), {
            role: newRole,
            status: 'Active',
            plan: request.plan_name
          });
        } else {
          console.warn('User not found in Firebase to upgrade role. Email:', request.customer_email);
        }
      }

      // Open email client
      window.open(`mailto:${request.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      
      setPreviewEmail(null);
      await fetchRequests();
    } catch (err) {
      console.error(err);
      alert('Failed to process and dispatch.');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Invoice & Provisioning Manager</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage ACH invoices and manual account activations</p>
        </div>
      </div>

      {previewEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 text-lg">Email Preview: {previewEmail.type === 'invoice' ? 'Payment Invoice' : 'Welcome Dispatch'}</h3>
                <p className="text-sm text-slate-500">Review the dispatch contents before sending.</p>
              </div>
              <button onClick={() => setPreviewEmail(null)} className="text-slate-400 hover:text-slate-600 font-bold p-2 text-xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                <div className="mb-2"><span className="text-xs font-bold text-slate-400 w-16 inline-block">TO:</span> <span className="font-medium text-slate-700">{previewEmail.request.customer_email}</span></div>
                <div><span className="text-xs font-bold text-slate-400 w-16 inline-block">SUBJECT:</span> <span className="font-bold text-slate-800">{previewEmail.subject}</span></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 h-[40vh] overflow-y-auto font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                {previewEmail.body}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setPreviewEmail(null)} className="px-5 py-2.5 text-slate-500 hover:text-slate-700 font-bold transition-colors">Cancel</button>
              <button 
                onClick={confirmAndDispatchEmail} 
                disabled={processingId === previewEmail.request.id}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {processingId === previewEmail.request.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Approve & Dispatch via Gmail
              </button>
            </div>
          </div>
        </div>
      )}

      <MasterBankingInfo />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan & Addons</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No subscription requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id as string} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {String(req.customer_name).charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{req.customer_name}</p>
                          <p className="text-xs text-slate-500">{req.customer_email}</p>
                          {req.company_name && <p className="text-[10px] font-bold text-indigo-600 uppercase mt-0.5">{req.company_name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700">{req.plan_name}</p>
                      <p className="text-xs text-slate-500 max-w-[200px] truncate" title={req.addons as string}>
                        {req.addons || 'No addons'}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                        {String(req.billing_cycle).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-emerald-700">${Number(req.total_amount).toLocaleString()}</p>
                      {Number(req.trial_days) > 0 && (
                        <p className="text-[10px] text-amber-600 font-bold">{req.trial_days} Day Trial</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                          <AlertCircle size={12} /> Pending Invoice
                        </span>
                      )}
                      {req.status === 'invoiced' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                          <Mail size={12} /> Invoiced
                        </span>
                      )}
                      {req.status === 'active' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                          <CheckCircle size={12} /> Active & Paid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleGenerateInvoiceClick(req)}
                            disabled={processingId === req.id}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {processingId === req.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            Send Invoice
                          </button>
                        )}
                        {(req.status === 'pending' || req.status === 'invoiced') && (
                          <button
                            onClick={() => handleMarkPaidClick(req)}
                            disabled={processingId === req.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {processingId === req.id ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
