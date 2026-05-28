import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Eye, EyeOff, LogIn, Loader2, Leaf, Lock, Mail, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/shared/Button';
export const LoginScreen = ({ onLogin, onSignUp, onForgotPassword, jurisdiction = 'Oklahoma' }: { onLogin: (email: string, pass: string) => Promise<void>; onSignUp: () => void; onForgotPassword: () => void; onBack?: () => void; initialRole?: any; key?: string; jurisdiction?: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const samplePlans = getPlansForRole('business', 'cannabis', 'National').slice(0, 3); // Get 3 plans to showcase

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 pt-10 pb-10">
      <div className="w-full max-w-[1000px]">
        <StateWelcomeBanner jurisdiction={jurisdiction} type="business" />
      </div>
      {/* 🗳️ Revolving Survey removed as per request */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col mt-6"
      >
        {/* LOGIN FORM SECTION */}
        <div className="w-full p-8 md:p-12 flex flex-col justify-center">
          <div className="flex flex-col items-center text-center mb-6">
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-40 h-40 sm:w-48 sm:h-48 object-contain mb-4" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
            }} />
            <div className="fallback-logo hidden w-20 h-20 bg-[#1a4731] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mt-2">Welcome Back</h2>
            <p className="text-slate-500 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email Address"
                placeholder="jane.doe@example.com"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
                rightElement={
                  <button type="button" onClick={onForgotPassword} className="text-xs font-medium text-[#1a4731] hover:underline">
                    Forgot Password?
                  </button>
                }
                icon={showPassword ? EyeOff : Eye}
                className="cursor-pointer"
                onClickIcon={() => setShowPassword(!showPassword)}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 text-lg"
              icon={loading ? Loader2 : LogIn}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </Button>

            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button type="button" onClick={onSignUp} className="text-[#1a4731] font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* SUBSCRIPTIONS SECTION REMOVED */}

      </motion.div>
    </div>
  );
};

