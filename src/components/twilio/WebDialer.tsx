import React, { useState, useEffect, useRef } from 'react';
import { Device } from '@twilio/voice-sdk';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../lib/utils';

export function WebDialer() {
  const [device, setDevice] = useState<Device | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'offline' | 'ready' | 'busy'>('offline');
  const [incomingConnection, setIncomingConnection] = useState<any>(null);
  const [activeConnection, setActiveConnection] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Only initialize if we're in a browser environment
    if (typeof window === 'undefined') return;

    const initializeTwilio = async () => {
      try {
        // Fetch the Twilio Access Token from our new Vercel backend
        const response = await fetch('/api/twilio/token');
        if (!response.ok) throw new Error('Failed to fetch token');
        
        const data = await response.json();
        setToken(data.token);

        // Initialize the Twilio Device
        const newDevice = new Device(data.token, {
          codecPreferences: ['opus', 'pcmu'],
          fakeLocalDTMF: true,
          enableRingingState: true
        });

        // Register event listeners
        newDevice.on('ready', () => setStatus('ready'));
        newDevice.on('error', (twilioError) => {
          console.error('Twilio Error:', twilioError);
          setStatus('offline');
        });
        
        newDevice.on('incoming', (connection) => {
          setIncomingConnection(connection);
          setStatus('busy');
          
          connection.on('accept', () => {
            setIncomingConnection(null);
            setActiveConnection(connection);
          });

          connection.on('disconnect', () => {
            setIncomingConnection(null);
            setActiveConnection(null);
            setStatus('ready');
          });

          connection.on('reject', () => {
            setIncomingConnection(null);
            setStatus('ready');
          });
        });

        // Register the device to receive incoming calls
        await newDevice.register();
        setDevice(newDevice);

      } catch (error) {
        console.error('Failed to initialize Twilio Device:', error);
      }
    };

    initializeTwilio();

    return () => {
      if (device) {
        device.destroy();
      }
    };
  }, []);

  const handleAccept = () => {
    if (incomingConnection) {
      incomingConnection.accept();
    }
  };

  const handleReject = () => {
    if (incomingConnection) {
      incomingConnection.reject();
    }
  };

  const handleHangup = () => {
    if (activeConnection) {
      activeConnection.disconnect();
    }
  };

  const toggleMute = () => {
    if (activeConnection) {
      activeConnection.mute(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  if (status === 'offline') return null;

  return (
    <>
      {/* Persistent Status Indicator */}
      <div className="fixed bottom-6 left-6 z-[100] flex items-center gap-2 bg-slate-900 border border-slate-700 p-2 pr-4 rounded-full shadow-2xl">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-white",
          status === 'ready' ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
        )}>
          <Phone size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Web Dialer</span>
          <span className={cn(
            "text-xs font-black",
            status === 'ready' ? "text-emerald-400" : "text-amber-400"
          )}>
            {status === 'ready' ? 'Ready for Calls' : 'On Call'}
          </span>
        </div>
      </div>

      {/* Incoming Call Overlay */}
      {incomingConnection && !activeConnection && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <PhoneCall size={48} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Incoming Call</h2>
            <p className="text-slate-400 mb-8">{incomingConnection.parameters.From || 'Unknown Caller'}</p>
            
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
      {activeConnection && (
        <div className="fixed bottom-24 left-6 z-[100] bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl w-64">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Call in Progress</span>
            </div>
            <span className="text-xs text-slate-400">{activeConnection.parameters.From}</span>
          </div>
          
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
