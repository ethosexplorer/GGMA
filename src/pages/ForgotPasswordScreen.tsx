import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield, ArrowLeft, Mail, Loader2, CheckCircle, Leaf, AlertCircle, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
export const ForgotPasswordScreen = ({ onBack, onReset }: { onBack: () => void; onReset: (email: string) => Promise<void>; key?: string }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-12"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-[#1a4731] rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Reset Password</h2>
          <p className="text-slate-500 mt-1">Enter your email to receive a reset link</p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start gap-3 text-left">
              <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700">
                Password reset email sent! Please check your inbox.
              </p>
            </div>
            <Button onClick={onBack} variant="outline" className="w-full">
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Input
              label="Email Address"
              placeholder="jane.doe@example.com"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full py-3"
                icon={loading ? Loader2 : Mail}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button type="button" onClick={onBack} variant="ghost" className="w-full">
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
