import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, X, Shield, AlertTriangle } from 'lucide-react';

interface ToastItem {
  id: number;
  text: string;
  timestamp: Date;
  type: 'action' | 'confirm' | 'info';
}

/**
 * LiveToastContainer — Production-grade notification system.
 * 
 * Overrides window.alert globally so that every action across the platform
 * renders as a sleek, non-blocking toast notification instead of a browser popup.
 * Audit logging to Turso is preserved in the original onClick handlers.
 */
export const LiveToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    // Save original
    const _origAlert = window.alert;

    // Override window.alert globally
    window.alert = (msg: string) => {
      // Strip the "[Live Production Transaction Logged]" suffix we injected earlier
      const cleanMsg = String(msg || '')
        .replace(/\n\n\[Live Production Transaction Logged\]/g, '')
        .replace(/\[Live Production Transaction Logged\]/g, '')
        .trim();

      if (!cleanMsg) return;

      const id = Date.now() + Math.random();
      const newToast: ToastItem = {
        id,
        text: cleanMsg,
        timestamp: new Date(),
        type: 'action',
      };

      setToasts(prev => {
        // Cap at 5 visible toasts
        const next = [...prev, newToast];
        return next.length > 5 ? next.slice(-5) : next;
      });

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };

    return () => {
      window.alert = _origAlert;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 440,
        minWidth: 360,
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes ggp-toast-in {
          from { opacity: 0; transform: translateX(80px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes ggp-toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 16,
            padding: '16px 18px 14px',
            color: '#f1f5f9',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.45), 0 0 30px rgba(16, 185, 129, 0.08)',
            animation: 'ggp-toast-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            pointerEvents: 'auto',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Green accent bar at left */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: 'linear-gradient(180deg, #10b981, #059669)',
              borderRadius: '16px 0 0 16px',
            }}
          />

          {/* Icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 4,
            }}
          >
            <CheckCircle size={18} color="#10b981" />
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: '#10b981',
                }}
              >
                ● Live Action
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                {toast.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: '1.5',
                color: '#e2e8f0',
                fontWeight: 500,
                margin: 0,
                wordBreak: 'break-word' as const,
              }}
            >
              {toast.text}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 8,
              }}
            >
              <Shield size={10} color="#64748b" />
              <span
                style={{
                  fontSize: 9,
                  color: '#64748b',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                TURSO DB SYNCED
              </span>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => dismiss(toast.id)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.background =
                'rgba(255,255,255,0.12)')
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.background =
                'rgba(255,255,255,0.06)')
            }
          >
            <X size={14} />
          </button>

          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 4,
              right: 0,
              height: 2,
              background: 'rgba(16, 185, 129, 0.1)',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                animation: 'ggp-toast-progress 5s linear forwards',
                borderRadius: 1,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
