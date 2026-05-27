import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Loader2, CircleCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './shared/Button';
// PIN Verification Screen for Admins
export const PinVerificationScreen = ({ userProfile, onVerify, onBack }: { userProfile: any, onVerify: () => void, onBack: () => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      // Logic: idCode is last 4 of SSN stored in profile
      // Founder=0000, Ryan/Monica=1234, Bob=0331, everyone else=last 4 SSN
      if (pin === (userProfile.idCode || '')) {
        onVerify();
      } else {
        setError('Invalid Security PIN. Access Denied.');
        setPin('');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#111a2e] border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
          <Shield size={40} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Security Shield Active</h2>
        <p className="text-slate-400 text-sm mb-8">Executive session detected. Please enter your <span className="text-white font-bold">4-digit Security PIN</span> (Last 4 of SSN) to proceed.</p>
        
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn("w-12 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all", pin.length > i ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-slate-800 bg-slate-900 text-slate-700")}>
              {pin.length > i ? '•' : ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map((num, i) => (
            <button
              key={i}
              onClick={() => {
                if (num === 'C') setPin('');
                else if (num === '⌫') setPin(prev => prev.slice(0, -1));
                else if (pin.length < 4) setPin(prev => prev + num);
              }}
              className="h-14 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-white font-bold text-lg transition-colors border border-white/5 active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-xs font-bold mb-6 animate-pulse uppercase tracking-widest">{error}</p>}

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/40"
            onClick={handleVerify}
            disabled={pin.length < 4 || loading}
            icon={loading ? Loader2 : CircleCheck}
          >
            {loading ? 'Verifying...' : 'Authorize Supreme Command'}
          </Button>
          <button onClick={onBack} className="text-xs text-slate-500 font-bold hover:text-slate-300 transition-colors uppercase tracking-widest mt-2">Abort Login</button>
        </div>
      </motion.div>
    </div>
  );
};
