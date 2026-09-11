import { FormattedDescription } from '../../components/FormattedDescription';
import { useState } from 'react';
import { ArrowRight, Check, FileText, Download } from 'lucide-react';
import robotArm from '../../assets/heroBg.webp'; 

export default function ProductTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState('Description');
  const tabs = ['Description', 'Specifications', 'Downloads', 'Reviews (125)', 'Q&A'];

  const specifications = product.specifications || {};

  
  
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
                <FormattedDescription text={product.description} />

                {product.applicable_fields && Array.isArray(product.applicable_fields) && product.applicable_fields.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-[#0b1042] uppercase tracking-wider mb-3">Applicable Industries</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.applicable_fields.map((field: string, idx: number) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-900 text-xs font-semibold"
                        >
                          <Check size={12} className="text-blue-600 stroke-[2.5]" />
                          <span>{field}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
             </>
          )}

          {activeTab === 'Specifications' && (
            <>
              {Object.keys(specifications).length > 0 ? (
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
              )}

              {product.applicable_fields && Array.isArray(product.applicable_fields) && product.applicable_fields.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#0b1042] uppercase tracking-wider mb-3">Applicable Industries & Sectors</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.applicable_fields.map((field: string, idx: number) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-900 text-xs font-semibold"
                      >
                        <Check size={12} className="text-blue-600 stroke-[2.5]" />
                        <span>{field}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'Downloads' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {product.downloads && Array.isArray(product.downloads) && product.downloads.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h3 className="text-xl font-black text-[#0b1042] mb-6 flex items-center">
                    <FileText size={24} className="mr-3 text-emerald-600 stroke-[2.5]" /> 
                    Product Manuals & Downloads
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {product.downloads.map((file: any, idx: number) => (
                      <a 
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-900/5 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-4 overflow-hidden">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50 group-hover:bg-emerald-100 transition-colors duration-300">
                            <FileText size={22} className="stroke-[2]" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm md:text-[15px] font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors duration-300">
                              {file.name}
                            </span>
                            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                              Download File
                            </span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all duration-300 shrink-0 ml-3 shadow-sm">
                           <Download size={18} className="text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <FileText size={32} className="text-gray-300 stroke-[2]" />
                  </div>
                  <h3 className="text-lg text-[#0b1042] font-black mb-2">No Downloads Available</h3>
                  <p className="text-gray-500 text-sm font-medium">There are no manuals or specification sheets for this product.</p>
                </div>
              )}
            </div>
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
