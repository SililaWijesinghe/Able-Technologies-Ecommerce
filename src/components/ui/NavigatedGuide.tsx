import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface GuideStep {
  targetId: string | string[];
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface NavigatedGuideProps {
  guideId: string;
  steps: GuideStep[];
}

export default function NavigatedGuide({ guideId, steps }: NavigatedGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem(`guide_seen_${guideId}`);
    if (!hasSeenGuide && steps.length > 0) {
      // Small delay to ensure the DOM is painted
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [guideId, steps.length]);

  useEffect(() => {
    if (!isVisible || steps.length === 0) return;

    const updateTarget = () => {
      const step = steps[currentStepIndex];
      const targetIds = Array.isArray(step.targetId) ? step.targetId : [step.targetId];
      
      let foundEl: HTMLElement | null = null;
      for (const id of targetIds) {
        const el = document.getElementById(id);
        // Check if element exists and is visible
        if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
          foundEl = el;
          break;
        }
      }

      if (foundEl) {
        setTargetRect(foundEl.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateTarget();
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, true); // true for capturing scroll in scrollable containers
    return () => {
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget, true);
    };
  }, [isVisible, currentStepIndex, steps]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      dismissGuide();
    }
  };

  const dismissGuide = () => {
    setIsVisible(false);
    localStorage.setItem(`guide_seen_${guideId}`, 'true');
  };

  if (!isVisible || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  
  // Calculate position logic simplified
  let top = '50%';
  let left = '50%';
  let transform = 'translate(-50%, -50%)'; // default centered if no target found
  let showHighlight = false;

  if (targetRect) {
    showHighlight = true;
    const padding = 16;
    const position = currentStep.position || 'bottom';

    if (position === 'bottom') {
      top = `${targetRect.bottom + padding}px`;
      left = `${targetRect.left + targetRect.width / 2}px`;
      transform = 'translateX(-50%)';
    } else if (position === 'top') {
      top = `${targetRect.top - padding}px`;
      left = `${targetRect.left + targetRect.width / 2}px`;
      transform = 'translate(-50%, -100%)';
    } else if (position === 'right') {
      top = `${targetRect.top + targetRect.height / 2}px`;
      left = `${targetRect.right + padding}px`;
      transform = 'translateY(-50%)';
    } else if (position === 'left') {
      top = `${targetRect.top + targetRect.height / 2}px`;
      left = `${targetRect.left - padding}px`;
      transform = 'translate(-100%, -50%)';
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ position: 'absolute', top, left, transform }}
            className="pointer-events-auto"
          >
            <div className="relative w-[300px] bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-5 text-white">
              {/* Highlight Ring Anchor point visually */}
              {showHighlight && (
                <div 
                  className="absolute"
                  style={{
                    ...(currentStep.position === 'bottom' ? { top: -16, left: '50%', transform: 'translateX(-50%)' } : {}),
                    ...(currentStep.position === 'top' ? { bottom: -16, left: '50%', transform: 'translateX(-50%)' } : {}),
                    ...(currentStep.position === 'right' ? { top: '50%', left: -16, transform: 'translateY(-50%)' } : {}),
                    ...(currentStep.position === 'left' ? { top: '50%', right: -16, transform: 'translateY(-50%)' } : {}),
                  }}
                >
                   <div className="w-8 h-8 flex items-center justify-center animate-pulse">
                     <div className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                   </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2 text-blue-300">
                <Sparkles size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <h4 className="text-lg font-bold mb-1">{currentStep.title}</h4>
              <p className="text-sm text-gray-300 mb-5 leading-relaxed">{currentStep.description}</p>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={dismissGuide}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Skip
                </button>
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                >
                  {currentStepIndex < steps.length - 1 ? 'Next' : 'Got it'}
                  {currentStepIndex < steps.length - 1 && <ArrowRight size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Highlight Overlay (Subtle) */}
      {targetRect && isVisible && (
        <div 
          className="absolute border-2 border-blue-400/50 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(96,165,250,0.3)] pointer-events-none"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8
          }}
        />
      )}
    </div>
  );
}
