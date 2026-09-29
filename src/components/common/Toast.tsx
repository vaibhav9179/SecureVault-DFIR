import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
        };

        const borders = {
          success: 'border-emerald-500/30 bg-slate-900/95',
          warning: 'border-amber-500/30 bg-slate-900/95',
          error: 'border-rose-500/30 bg-slate-900/95',
          info: 'border-cyan-500/30 bg-slate-900/95'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-lg border ${borders[toast.type]} shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <div>
                <p className="text-xs font-semibold text-white">{toast.title}</p>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
