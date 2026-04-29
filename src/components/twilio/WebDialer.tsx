import React, { useState, useEffect, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export function WebDialer() {
  const [device, setDevice] = useState<Device | null>(null);
  const [status, setStatus] = useState<'offline' | 'connecting' | 'ready' | 'busy'>('offline');
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deviceRef = useRef<Device | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeTwilio = async () => {
      try {
        setStatus('connecting');
        setError(null);

        const response = await fetch('/api/twilio/token');
        if (!response.ok) {
          throw new Error(`Token fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.token) throw new Error('No token in response');

        const newDevice = new Device(data.token, {
          logLevel: 1,
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        });

        // v2 SDK events
        newDevice.on('registered', () => {
          console.log('[WebDialer] Device registered successfully');
          setStatus('ready');
          setError(null);
        });

        newDevice.on('unregistered', () => {
          console.log('[WebDialer] Device unregistered');
          setStatus('offline');
        });

        newDevice.on('error', (twilioError: any) => {
          console.error('[WebDialer] Twilio Device Error:', twilioError);
          setError(twilioError.message || 'Unknown error');
          // Don't set offline on transient errors
        });
        
        newDevice.on('incoming', (call: Call) => {
          console.log('[WebDialer] Incoming call from:', call.parameters.From);
          setIncomingCall(call);
          setStatus('busy');
          
          call.on('accept', () => {
            console.log('[WebDialer] Call accepted');
            setIncomingCall(null);
            setActiveCall(call);
            startTimer();
          });

          call.on('disconnect', () => {
            console.log('[WebDialer] Call disconnected');
            cleanup();
          });

          call.on('reject', () => {
            console.log('[WebDialer] Call rejected');
            cleanup();
          });

          call.on('cancel', () => {
            console.log('[WebDialer] Call cancelled by caller');
            cleanup();
          });
        });

        // Register the device to receive incoming calls
        await newDevice.register();
        deviceRef.current = newDevice;
        setDevice(newDevice);

      } catch (err: any) {
        console.error('[WebDialer] Failed to initialize:', err);
        setError(err.message || 'Initialization failed');
        setStatus('offline');
      }
    };

    const cleanup = () => {
      setIncomingCall(null);
      setActiveCall(null);
      setIsMuted(false);
      setCallDuration(0);
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus('ready');
    };

    const startTimer = () => {
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    };

    initializeTwilio();

    return () => {
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAccept = () => {
    if (incomingCall) {
      incomingCall.accept();
    }
  };

  const handleReject = () => {
    if (incomingCall) {
      incomingCall.reject();
      setIncomingCall(null);
      setStatus('ready');
    }
  };

  const handleHangup = () => {
    if (activeCall) {
      activeCall.disconnect();
      setActiveCall(null);
      setIsMuted(false);
      setCallDuration(0);
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus('ready');
    }
  };

  const toggleMute = () => {
    if (activeCall) {
      const newMuted = !isMuted;
      activeCall.mute(newMuted);
      setIsMuted(newMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Persistent Status Indicator — always visible */}
      <div className="fixed bottom-6 left-6 z-[100] flex items-center gap-2 bg-slate-900 border border-slate-700 p-2 pr-4 rounded-full shadow-2xl">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white",
          status === 'ready' ? "bg-emerald-500" :
          status === 'connecting' ? "bg-amber-500 animate-pulse" :
          status === 'busy' ? "bg-rose-500 animate-pulse" :
          "bg-slate-600"
        )}>
          <Phone size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Web Dialer</span>
          <span className={cn(
            "text-xs font-black",
            status === 'ready' ? "text-emerald-400" :
            status === 'connecting' ? "text-amber-400" :
            status === 'busy' ? "text-rose-400" :
            "text-slate-500"
          )}>
            {status === 'ready' ? '● Ready for Calls' :
             status === 'connecting' ? '◌ Connecting...' :
             status === 'busy' ? '● On Call' :
             error ? `✕ ${error.substring(0, 20)}` : '○ Offline'}
          </span>
        </div>
      </div>

      {/* Incoming Call Overlay */}
      {incomingCall && !activeCall && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center">
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <PhoneCall size={48} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Incoming Call</h2>
            <p className="text-slate-400 mb-8">{incomingCall.parameters?.From || 'Unknown Caller'}</p>
            
            <div className="flex justify-center gap-6">
              <button 
                onClick={handleReject}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              >
                <PhoneOff size={24} />
              </button>
              <button 
                onClick={handleAccept}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              >
                <Phone size={24} className="animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Call Overlay */}
      {activeCall && (
        <div className="fixed bottom-24 left-6 z-[100] bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl w-64">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Call in Progress</span>
            </div>
            <span className="text-xs text-white font-mono">{formatTime(callDuration)}</span>
          </div>
          <p className="text-xs text-slate-400 mb-3 truncate">{activeCall.parameters?.From || 'Unknown'}</p>
          
          <div className="flex justify-between items-center bg-slate-800/50 rounded-xl p-2 border border-slate-700/50">
            <button 
              onClick={toggleMute}
              className={cn(
                "p-3 rounded-lg transition-colors",
                isMuted ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-white hover:bg-slate-600"
              )}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              onClick={handleHangup}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
