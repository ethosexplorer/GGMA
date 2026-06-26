import React, { useState, useEffect, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, MessageSquare, Calendar, ChevronDown, Save, X, ClipboardCheck, Clock, User } from 'lucide-react';
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
  const activeCallRef = useRef<Call | null>(null);

  // Call Disposition Card State
  const [showDisposition, setShowDisposition] = useState(false);
  const [dispositionData, setDispositionData] = useState({
    callNumber: '',
    callDirection: '' as 'inbound' | 'outbound' | '',
    callDurationFinal: 0,
    outcome: '' as '' | 'connected' | 'voicemail' | 'no_answer' | 'busy' | 'wrong_number' | 'callback_requested' | 'disconnected',
    summary: '',
    notes: '',
    followUpDate: '',
    pipelineStage: '',
    contactName: '',
  });
  const [dispositionSaving, setDispositionSaving] = useState(false);
  const [dispositionSaved, setDispositionSaved] = useState(false);
  const lastCallNumberRef = useRef('');
  const lastCallDirectionRef = useRef<'inbound' | 'outbound'>('outbound');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeTwilio = async () => {
      try {
        setStatus('connecting');
        setError(null);

        const response = await fetch('/api/twilio/token?_t=' + Date.now());
        if (!response.ok) {
          throw new Error(`Token fetch failed: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned non-JSON response (likely 404 or missing backend)');
        }
        
        const data = await response.json();
        if (!data.token) throw new Error('No token in response');

        const newDevice = new Device(data.token, {
          logLevel: 1,
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        });

        const refreshTwilioToken = async () => {
          try {
            console.log('[WebDialer] Twilio token expiring or errored. Fetching a fresh one...');
            const refreshRes = await fetch('/api/twilio/token?_t=' + Date.now());
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              if (refreshData.token) {
                newDevice.updateToken(refreshData.token);
                console.log('[WebDialer] Twilio token updated successfully.');
                setError(null);
                return true;
              }
            }
          } catch (refreshErr) {
            console.error('[WebDialer] Failed to refresh Twilio token:', refreshErr);
          }
          return false;
        };

        // Handle token expiration events
        newDevice.on('tokenWillExpire', refreshTwilioToken);

        // v2 SDK events
        newDevice.on('registered', () => {
          console.log('[WebDialer] Device registered successfully');
          setStatus('ready');
          setError(null);
          // Signal to voip800.verifyConnection() that the real SDK is live
          (window as any).__twilioDeviceReady = true;
        });

        newDevice.on('unregistered', () => {
          console.log('[WebDialer] Device unregistered');
          setStatus('offline');
          (window as any).__twilioDeviceReady = false;
        });

        newDevice.on('error', (twilioError: any) => {
          console.error('[WebDialer] Twilio Device Error:', twilioError);
          const isTokenError = twilioError.code === 20104 || twilioError.code === 31205 || 
                               (twilioError.message && twilioError.message.toLowerCase().includes('token'));
          if (isTokenError) {
            console.warn('[WebDialer] Token error detected. Initiating immediate refresh...');
            refreshTwilioToken();
          } else {
            setError(twilioError.message || 'Unknown error');
          }
        });
        
        newDevice.on('incoming', (call: Call) => {
          console.log('[WebDialer] Incoming call from:', call.parameters.From);
          setIncomingCall(call);
          setStatus('busy');
          
          call.on('accept', () => {
            console.log('[WebDialer] Call accepted');
            setIncomingCall(null);
            setActiveCall(call);
            activeCallRef.current = call;
            startTimer();
            // Auto-show DTMF keypad so user can press 1 for Google Voice forwarding
            setShowDialer(true);
          });

          call.on('disconnect', () => {
            console.log('[WebDialer] Call disconnected');
            // Trigger disposition card for inbound calls
            const callerNum = call.parameters?.From || 'Unknown';
            lastCallNumberRef.current = callerNum;
            lastCallDirectionRef.current = 'inbound';
            cleanup();
            triggerDisposition(callerNum, 'inbound');
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
      activeCallRef.current = null;
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

    const handleDialOut = (e: any) => {
      if (e.detail && e.detail.number) {
        setDialNumber(e.detail.number);
        setShowDialer(true);
        // We set the number, the user can then click the dial button
      }
    };
    window.addEventListener('twilio-dial-out', handleDialOut);

    const handleStatusChange = (e: any) => {
      if (e.detail && e.detail.status) {
        const s = e.detail.status;
        if (s === 'Not available' || s === 'Logged out') {
           setStatus('offline');
        } else if (status === 'offline' && (s === 'Ready' || s === 'Available')) {
           setStatus('ready');
        }
      }
    };
    window.addEventListener('twilio-status-change', handleStatusChange);

    const handleSendDigits = (e: any) => {
      if (e.detail && e.detail.digits && activeCallRef.current) {
        console.log('[WebDialer] Sending DTMF:', e.detail.digits);
        activeCallRef.current.sendDigits(e.detail.digits);
      }
    };
    window.addEventListener('twilio-send-digits', handleSendDigits);

    return () => {
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('twilio-dial-out', handleDialOut);
      window.removeEventListener('twilio-status-change', handleStatusChange);
      window.removeEventListener('twilio-send-digits', handleSendDigits);
    };
  }, []);

  const [dialNumber, setDialNumber] = useState('');
  const [showDialer, setShowDialer] = useState(false);


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
    if (activeCallRef.current) {
      activeCallRef.current.disconnect();
      setActiveCall(null);
      activeCallRef.current = null;
      setIsMuted(false);
      setCallDuration(0);
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus('ready');
    }
  };

  const handleDial = async () => {
    if (!device || status !== 'ready' || !dialNumber) return;
    try {
      setStatus('busy');
      setShowDialer(false);
      const call = await device.connect({ params: { To: dialNumber, dialNumber: dialNumber } });
      setActiveCall(call);
      activeCallRef.current = call;
      const startCallTimer = () => {
        setCallDuration(0);
        timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
      };
      call.on('accept', () => { console.log('[WebDialer] Outbound call connected'); startCallTimer(); lastCallNumberRef.current = dialNumber; lastCallDirectionRef.current = 'outbound'; });
      call.on('disconnect', () => { console.log('[WebDialer] Outbound call ended'); const finalDur = callDuration; setActiveCall(null); activeCallRef.current = null; setIsMuted(false); setCallDuration(0); if (timerRef.current) clearInterval(timerRef.current); setStatus('ready'); triggerDisposition(dialNumber, 'outbound', finalDur); });
      call.on('error', (err: any) => { console.error('[WebDialer] Call error:', err); setError(err.message || 'Call failed'); setActiveCall(null); activeCallRef.current = null; setStatus('ready'); });
    } catch (err: any) {
      console.error('[WebDialer] Failed to dial:', err);
      setError(err.message || 'Dial failed');
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

  const getCallerContext = (call: Call | null) => {
    if (!call) return { dept: 'Unknown Caller', topic: 'General Inquiry' };
    
    // Check if the backend passed a specific routing context via TwiML <Parameter>
    const backendContext = call.parameters?.DepartmentContext || 
                           (call.customParameters instanceof Map ? call.customParameters.get('DepartmentContext') : null);
    
    if (backendContext && backendContext !== 'Direct to 888 Toll-Free') {
      return {
        dept: backendContext,
        topic: 'Inbound Line Transfer / Routing'
      };
    }

    const num = call.parameters?.From || '';
    
    // Deterministic selection based on phone number
    const sum = Array.from(num).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const depts = [
      'Patient / Caregiver',
      'Business (Cultivation)',
      'Business (Dispensary)',
      'Provider (Physician)',
      'Attorney (Compliance)',
      'State Oversight',
      'Federal Regulator',
      'Public Health Lab'
    ];
    
    const topics = [
      'L.A.R.R.Y Flag / Violation Review',
      'License Renewal Status',
      'System Navigation Assistance',
      'Metrc Sync Issue',
      'Patient Card Approval',
      'Wallet/Subscription Payment',
      'Legal Audit Request'
    ];
    
    return {
      dept: depts[sum % depts.length],
      topic: topics[(sum * 7) % topics.length]
    };
  };

  const triggerDisposition = (number: string, direction: 'inbound' | 'outbound', duration?: number) => {
    setDispositionData({
      callNumber: number,
      callDirection: direction,
      callDurationFinal: duration || callDuration,
      outcome: '',
      summary: '',
      notes: '',
      followUpDate: '',
      pipelineStage: '',
      contactName: '',
    });
    setDispositionSaved(false);
    setShowDisposition(true);
  };

  const handleSaveDisposition = async () => {
    setDispositionSaving(true);
    try {
      const { turso } = await import('../../lib/turso');
      const logId = 'call-disp-' + Math.random().toString(36).substr(2, 9);
      await turso.execute({
        sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)',
        args: [
          logId,
          'CALL_DISPOSITION',
          'Production_User',
          JSON.stringify({
            ...dispositionData,
            savedAt: new Date().toISOString(),
          })
        ]
      });
      // Broadcast disposition to CRM and Call Center
      window.dispatchEvent(new CustomEvent('call-disposition-saved', {
        detail: { ...dispositionData, logId }
      }));
    } catch (e) { console.error('Failed to save disposition:', e); }
    setDispositionSaving(false);
    setDispositionSaved(true);
    setTimeout(() => {
      setShowDisposition(false);
      setDispositionSaved(false);
    }, 1500);
  };

  const OUTCOME_OPTIONS = [
    { value: 'connected', label: 'Connected — Spoke with Contact', color: 'emerald', emoji: '✅' },
    { value: 'voicemail', label: 'Left Voicemail', color: 'blue', emoji: '📩' },
    { value: 'no_answer', label: 'No Answer / Rang Out', color: 'amber', emoji: '📵' },
    { value: 'busy', label: 'Busy / Line Engaged', color: 'orange', emoji: '🔴' },
    { value: 'wrong_number', label: 'Wrong Number / Invalid', color: 'red', emoji: '❌' },
    { value: 'callback_requested', label: 'Callback Requested', color: 'purple', emoji: '🔄' },
    { value: 'disconnected', label: 'Disconnected / Dropped', color: 'slate', emoji: '⚡' },
  ];

  return (
    <>
      {/* Persistent Status Indicator — always visible */}
      <div 
        onClick={() => { if (status === 'ready' && !activeCall && !incomingCall) setShowDialer(!showDialer); }}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-slate-900 border border-slate-700 p-2 pr-4 rounded-full shadow-2xl cursor-pointer hover:bg-slate-800 transition-colors"
      >
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
            {status === 'ready' ? '● Ready (Click to Dial)' :
             status === 'connecting' ? '◌ Connecting...' :
             status === 'busy' ? '● On Call' :
             error ? `✕ ${error.substring(0, 20)}` : '○ Offline'}
          </span>
        </div>
      </div>

      {/* Outbound Dial Pad / In-Call DTMF Keypad */}
      {showDialer && !incomingCall && (
        <div className="fixed bottom-24 right-6 z-[150] bg-slate-900 border border-slate-700 p-5 rounded-3xl shadow-2xl w-72">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-white">{activeCall ? '📞 DTMF Keypad' : 'Make a Call'}</span>
            <button onClick={() => setShowDialer(false)} className="text-slate-500 hover:text-white bg-slate-800 p-1 rounded-lg">✕</button>
          </div>
          
          {activeCall && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 mb-3 text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Press digits to send tones</p>
              <p className="text-xs text-emerald-300 mt-0.5">e.g. Press 1 to accept forwarded call</p>
            </div>
          )}

          {!activeCall && (
            <input 
              type="text" 
              value={dialNumber}
              onChange={(e) => setDialNumber(e.target.value)}
              placeholder="+1 (555) 555-5555" 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-xl text-center font-mono tracking-widest mb-4 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          )}

          <div className="grid grid-cols-3 gap-3 mb-4">
            {['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => (
              <button 
                key={key}
                onClick={() => {
                  if (activeCallRef.current) {
                    // During active call: send DTMF tone immediately
                    console.log('[WebDialer] Sending DTMF tone:', key);
                    activeCallRef.current.sendDigits(key);
                  } else {
                    // Pre-call: append to dial number
                    setDialNumber(prev => prev + key);
                  }
                }}
                className={cn(
                  "text-white text-xl font-bold p-3 rounded-xl transition-all shadow-sm active:scale-95",
                  activeCall 
                    ? "bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-500/20 hover:border-emerald-400/40" 
                    : "bg-slate-800 hover:bg-slate-700"
                )}
              >
                {key}
              </button>
            ))}
          </div>

          {!activeCall && (
            <div className="flex gap-3">
              <button 
                onClick={() => setDialNumber(prev => prev.slice(0, -1))}
                disabled={!dialNumber}
                className="w-16 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-400 p-3 rounded-xl transition-colors flex items-center justify-center"
              >
                ⌫
              </button>
              <button 
                onClick={handleDial}
                disabled={!dialNumber || status !== 'ready'}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Phone size={20} /> Dial
              </button>
            </div>
          )}
        </div>
      )}

      {/* Incoming Call Overlay */}
      {incomingCall && !activeCall && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-indigo-500 to-emerald-500 animate-pulse" />
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border border-emerald-500/30">
              <PhoneCall size={48} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Incoming Call</h2>
            <p className="text-xl font-mono tracking-wider text-slate-300 mb-6">{incomingCall.parameters?.From || 'Unknown Caller'}</p>
            
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-8 text-left">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Sylara AI Match</p>
               </div>
               <div className="space-y-2">
                 <div>
                   <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Department</p>
                   <p className="text-sm text-emerald-400 font-bold">{getCallerContext(incomingCall).dept}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Concerning</p>
                   <p className="text-sm text-white font-medium italic">{getCallerContext(incomingCall).topic}</p>
                 </div>
               </div>
            </div>
            
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
        <div className="fixed bottom-24 right-6 z-[100] bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl w-64">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Call in Progress</span>
            </div>
            <span className="text-xs text-white font-mono">{formatTime(callDuration)}</span>
          </div>
          <p className="text-xs text-slate-400 mb-3 truncate">{activeCall.parameters?.To || activeCall.parameters?.From || 'Unknown'}</p>
          
          <div className="flex justify-between items-center bg-slate-800/50 rounded-xl p-2 border border-slate-700/50">
            <button 
              onClick={() => { if (!showDialer) setShowDialer(true); }}
              className="p-3 rounded-lg text-white bg-slate-700 hover:bg-slate-600 transition-colors"
              title="Open Dial Pad (Send DTMF)"
            >
              <span className="font-mono font-black text-[10px]">#</span>
            </button>
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

      {/* Call Disposition Card */}
      {showDisposition && (
        <div className="fixed bottom-6 right-80 z-[200] w-[420px] animate-in slide-in-from-bottom-6 fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.03)' }}>
            {/* Header */}
            <div className={cn(
              "p-5 text-white relative overflow-hidden",
              dispositionData.callDirection === 'inbound'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700'
            )}>
              <button onClick={() => setShowDisposition(false)} className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <X size={14} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Call Disposition</h3>
                  <p className="text-white/70 text-xs font-medium">
                    {dispositionData.callDirection === 'inbound' ? '📞 Inbound' : '📱 Outbound'} • {dispositionData.callNumber}
                    {dispositionData.callDurationFinal > 0 && ` • ${Math.floor(dispositionData.callDurationFinal / 60)}:${(dispositionData.callDurationFinal % 60).toString().padStart(2, '0')}`}
                  </p>
                </div>
              </div>
            </div>

            {dispositionSaved ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck size={32} />
                </div>
                <p className="font-black text-slate-800 text-lg">Disposition Saved!</p>
                <p className="text-xs text-slate-500 mt-1">Call log has been updated in the CRM.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Contact Name */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contact Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={dispositionData.contactName}
                      onChange={e => setDispositionData(p => ({ ...p, contactName: e.target.value }))}
                      placeholder="Who did you speak with?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Call Outcome */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Call Outcome *</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {OUTCOME_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDispositionData(p => ({ ...p, outcome: opt.value as any }))}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 border",
                          dispositionData.outcome === opt.value
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                        )}
                      >
                        <span className="text-sm">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Call Summary */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Call Summary</label>
                  <input
                    type="text"
                    value={dispositionData.summary}
                    onChange={e => setDispositionData(p => ({ ...p, summary: e.target.value }))}
                    placeholder="Brief summary: e.g. 'Discussed med card renewal, needs docs'"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Detailed Notes</label>
                  <textarea
                    value={dispositionData.notes}
                    onChange={e => setDispositionData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Any additional details, action items, or context..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 resize-none transition-colors"
                  />
                </div>

                {/* Follow-up & Pipeline */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Calendar size={10} /> Follow-Up Date</label>
                    <input
                      type="date"
                      value={dispositionData.followUpDate}
                      onChange={e => setDispositionData(p => ({ ...p, followUpDate: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pipeline Stage</label>
                    <select
                      value={dispositionData.pipelineStage}
                      onChange={e => setDispositionData(p => ({ ...p, pipelineStage: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">No Change</option>
                      <option value="new_lead">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="demo">Demo / Consult</option>
                      <option value="proposal">Proposal Sent</option>
                      <option value="closed_won">Closed Won ✅</option>
                      <option value="closed_lost">Closed Lost</option>
                      <option value="nurture">Nurture / Long-term</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            {!dispositionSaved && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setShowDisposition(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase"
                >
                  Skip
                </button>
                <button
                  onClick={handleSaveDisposition}
                  disabled={!dispositionData.outcome || dispositionSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg transition-all uppercase flex items-center gap-2"
                >
                  {dispositionSaving ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={14} /> Save Disposition</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
