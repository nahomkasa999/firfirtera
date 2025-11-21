'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/store/useToastStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }: { toast: { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning'; duration?: number }; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500/95 text-white border-green-600',
    error: 'bg-red-500/95 text-white border-red-600',
    info: 'bg-blue-500/95 text-white border-blue-600',
    warning: 'bg-orange-500/95 text-white border-orange-600',
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`${typeStyles[toast.type]} rounded-lg p-4 shadow-lg border backdrop-blur-sm pointer-events-auto flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-200`}
    >
      <Icon size={20} className="shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 hover:opacity-70 transition-opacity p-1 -mr-1 -mt-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}

