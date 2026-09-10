import React from 'react';

export const FormattedDescription: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  
  // Check if it uses the custom arrow bullet
  if (text.includes('➢') || text.includes('➤') || text.includes('➣')) {
    const char = text.includes('➢') ? '➢' : text.includes('➤') ? '➤' : '➣';
    const parts = text.split(char).filter(p => p.trim().length > 0);
    
    return (
      <ul className="space-y-3 mb-6">
        {parts.map((part, idx) => (
          <li key={idx} className="flex items-start text-gray-700 text-[14px] md:text-[15px] leading-relaxed bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 hover:bg-red-50/20 transition-all duration-200">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center mr-3 mt-0.5 shadow-[0_2px_8px_rgba(220,38,38,0.4)]">
              <span className="font-bold text-sm leading-none mt-[-2px] ml-[1px]">➢</span>
            </span>
            <span>{part.trim()}</span>
          </li>
        ))}
      </ul>
    );
  }
  
  // Check if it uses asterisks as bullets
  if (text.includes('*')) {
    const parts = text.split('*').filter(p => p.trim().length > 0);
    
    return (
      <ul className="space-y-3 mb-6">
        {parts.map((part, idx) => (
          <li key={idx} className="flex items-start text-gray-700 text-[14px] md:text-[15px] leading-relaxed bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 hover:bg-red-50/20 transition-all duration-200">
            <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center mr-3 mt-0.5 shadow-[0_2px_8px_rgba(220,38,38,0.4)]">
              <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </span>
            <span>{part.trim()}</span>
          </li>
        ))}
      </ul>
    );
  }
  
  // Check if it uses newlines
  if (text.includes('\n')) {
    const lines = text.split('\n').filter(p => p.trim().length > 0);
    return (
      <ul className="space-y-3 mb-6">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');
          const content = isBullet ? trimmed.substring(1).trim() : trimmed;
          
          return (
            <li key={idx} className={`flex items-start text-gray-700 text-[14px] md:text-[15px] leading-relaxed ${isBullet ? 'bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 hover:bg-red-50/20 transition-all duration-200' : ''}`}>
              {isBullet ? (
                <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center mr-3 mt-0.5 shadow-[0_2px_8px_rgba(220,38,38,0.4)]">
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </span>
              ) : null}
              <span>{content}</span>
            </li>
          );
        })}
      </ul>
    );
  }
  
  // Default paragraph fallback
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <p className="text-gray-700 text-[14px] md:text-[15px] leading-relaxed">{text}</p>
    </div>
  );
};
