import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/90 border border-rose-500/50 backdrop-blur-xl text-rose-200 shadow-[0_10px_30px_rgba(244,63,94,0.3)]">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorAlert;
