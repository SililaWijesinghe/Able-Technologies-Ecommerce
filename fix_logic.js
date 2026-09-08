const fs = require('fs');
const content = fs.readFileSync('src/components/ui/NavigatedGuide.tsx', 'utf8');

const replacement = `
  let top = '50%';
  let left = '50%';
  let transform = 'translate(-50%, -50%)'; // default centered if no target found
  let shiftX = 0;
  let shiftY = 0;
  let showHighlight = false;

  if (targetRect) {
    showHighlight = true;
    const padding = 16;
    const popupWidth = 300;
    const margin = 16;
    const position = currentStep.position || 'bottom';

    if (position === 'bottom') {
      top = \`\${targetRect.bottom + padding}px\`;
      const desiredLeft = targetRect.left + targetRect.width / 2;
      
      if (desiredLeft + popupWidth / 2 > window.innerWidth - margin) {
        shiftX = (window.innerWidth - margin) - (desiredLeft + popupWidth / 2);
      } else if (desiredLeft - popupWidth / 2 < margin) {
        shiftX = margin - (desiredLeft - popupWidth / 2);
      }
      
      left = \`\${desiredLeft}px\`;
      transform = \`translateX(calc(-50% + \${shiftX}px))\`;
      
    } else if (position === 'top') {
      top = \`\${targetRect.top - padding}px\`;
      const desiredLeft = targetRect.left + targetRect.width / 2;
      
      if (desiredLeft + popupWidth / 2 > window.innerWidth - margin) {
        shiftX = (window.innerWidth - margin) - (desiredLeft + popupWidth / 2);
      } else if (desiredLeft - popupWidth / 2 < margin) {
        shiftX = margin - (desiredLeft - popupWidth / 2);
      }
      
      left = \`\${desiredLeft}px\`;
      transform = \`translate(calc(-50% + \${shiftX}px), -100%)\`;
      
    } else if (position === 'right') {
      left = \`\${targetRect.right + padding}px\`;
      const desiredTop = targetRect.top + targetRect.height / 2;
      // We could add shiftY logic here if needed, but for now just Y-center
      top = \`\${desiredTop}px\`;
      transform = 'translateY(-50%)';
      
    } else if (position === 'left') {
      left = \`\${targetRect.left - padding}px\`;
      const desiredTop = targetRect.top + targetRect.height / 2;
      top = \`\${desiredTop}px\`;
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
                    ...(currentStep.position === 'bottom' || !currentStep.position ? { top: -16, left: \`calc(50% - \${shiftX}px)\`, transform: 'translateX(-50%)' } : {}),
                    ...(currentStep.position === 'top' ? { bottom: -16, left: \`calc(50% - \${shiftX}px)\`, transform: 'translateX(-50%)' } : {}),
                    ...(currentStep.position === 'right' ? { top: \`calc(50% - \${shiftY}px)\`, left: -16, transform: 'translateY(-50%)' } : {}),
                    ...(currentStep.position === 'left' ? { top: \`calc(50% - \${shiftY}px)\`, right: -16, transform: 'translateY(-50%)' } : {}),
                  }}
                >
                   <div className="w-8 h-8 flex items-center justify-center animate-pulse">
                     <div className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                   </div>
                </div>
              )}
`;

const lines = content.split('\n');
const startIdx = lines.findIndex(line => line.includes('// Calculate position logic simplified') || line.includes('let top = \'50%\';'));
const endIdx = lines.findIndex(line => line.includes('<div className="flex items-center gap-2 mb-2 text-blue-300">'));

if (startIdx !== -1 && endIdx !== -1) {
  const newContent = lines.slice(0, startIdx).join('\n') + replacement + '\n              ' + lines.slice(endIdx).join('\n');
  fs.writeFileSync('src/components/ui/NavigatedGuide.tsx', newContent);
  console.log('Replaced logic successfully.');
} else {
  console.log('Could not find indices', startIdx, endIdx);
}
