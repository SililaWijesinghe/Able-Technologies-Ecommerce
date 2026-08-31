import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; variant?: ToastType | 'danger' }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'info' }: { title: string; description?: string; variant?: ToastType | 'danger' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    // map danger to error
    const type = variant === 'danger' ? 'error' : variant as ToastType;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="pointer-events-auto flex flex-col gap-1 min-w-[300px] max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-5 duration-300"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-sm">
                {t.type === 'success' && '✅ '}
                {t.type === 'error' && '❌ '}
                {t.title}
              </h4>
              <button 
                onClick={() => removeToast(t.id)}
                className="text-white/50 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            {t.description && <p className="text-xs text-white/70">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
