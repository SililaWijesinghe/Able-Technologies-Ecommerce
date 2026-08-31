import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function GlassModal({ isOpen, onClose, title, children, actions }: GlassModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg bg-white/10 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-6 sm:p-8 overflow-hidden"
          >
            {/* Subtle glow effect behind content */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                {title && <h3 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">{title}</h3>}
                <button 
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 border border-white/10 rounded-full text-gray-700 dark:text-gray-300 transition-colors backdrop-blur-sm shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-gray-800 dark:text-gray-200">
                {children}
              </div>

              {actions && (
                <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-6">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
