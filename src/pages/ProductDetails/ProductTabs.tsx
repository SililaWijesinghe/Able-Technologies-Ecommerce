import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import robotArm from '../../assets/heroBg.webp'; 

export default function ProductTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState('Description');
  const tabs = ['Description', 'Specifications', 'Downloads', 'Reviews (125)', 'Q&A'];

  const specifications = product.specifications || {};

  
  const renderFormattedDescription = (text: string) => {
    if (!text) return null;
    
    // Check if it uses the custom arrow bullet
    if (text.includes('➢') || text.includes('➤') || text.includes('➣')) {
      // Find which character is used
      const char = text.includes('➢') ? '➢' : text.includes('➤') ? '➤' : '➣';
      const parts = text.split(char).filter(p => p.trim().length > 0);
      
      return (
        <ul className="space-y-2 mb-6">
          {parts.map((part, idx) => (
            <li key={idx} className="flex items-start text-gray-600 text-sm leading-relaxed">
              <span className="text-red-500 font-bold mr-2 mt-0.5 shrink-0 text-xs">➢</span>
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
        <ul className="space-y-2 mb-6">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');
            const content = isBullet ? trimmed.substring(1).trim() : trimmed;
            
            return (
              <li key={idx} className={`flex items-start text-gray-600 text-sm leading-relaxed`}>
                {isBullet ? (
                  <span className="text-red-500 font-bold mr-2 mt-0.5 shrink-0 text-xs">•</span>
                ) : null}
                <span>{content}</span>
              </li>
            );
          })}
        </ul>
      );
    }
    
    // Default paragraph fallback
    return <p className="text-gray-600 text-sm leading-relaxed mb-6">{text}</p>;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-16 border-t border-gray-200 pt-10">
      <div className="flex-1">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 md:px-6 md:py-3 text-[13px] md:text-[14px] font-sans font-semibold rounded-full transition-all duration-200 ${activeTab === tab ? 'metallic-red-bg text-white shadow-md shadow-red-900/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#0b1042] border border-gray-200/60'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pr-0 md:pr-8">
          {activeTab === 'Description' && (
             <>
                <h2 className="text-xl font-black text-[#0b1042] mb-4">Product Description</h2>
                {renderFormattedDescription(product.description)}
             </>
          )}

          {activeTab === 'Specifications' && (
            Object.keys(specifications).length > 0 ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <dl className="divide-y divide-gray-100">
                  {Object.entries(specifications).map(([key, value], idx) => (
                    <div 
                      key={key} 
                      className={`flex flex-col sm:flex-row transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-blue-50/40`}
                    >
                      <dt className="w-full sm:w-1/3 py-3.5 px-5 text-sm font-bold text-[#0b1042] bg-gray-50/70 sm:border-r border-gray-100 flex items-center">
                        {key}
                      </dt>
                      <dd className="w-full sm:w-2/3 py-3.5 px-5 text-sm text-gray-700 font-medium flex items-center leading-relaxed">
                        {value as string}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">No specifications available for this product.</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* B2B Banner Right Column */}
      <div className="w-full lg:w-[350px] shrink-0">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 relative overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.03)] h-full flex flex-col justify-center min-h-[240px]">
          
          {/* Full Background with Gradient Masking for perfect alignment on all screens */}
          <div 
            className="absolute inset-0 bg-cover bg-center md:bg-right opacity-30 mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: `url(${robotArm})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/40 z-0 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-black text-[#0b1042] mb-2 tracking-tight">Need a Custom Solution?</h3>
            <p className="text-sm text-gray-600 mb-6 font-medium max-w-[200px]">Our experts are ready to help you</p>
            
            <button className="metallic-red-bg text-white w-full py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5 transition-all flex items-center justify-center">
              Request a Quote <ArrowRight size={18} className="ml-1.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
