import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
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
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
             </>
          )}

          {activeTab === 'Specifications' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specifications).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-bold text-gray-800 bg-gray-50 w-1/3">{key}</td>
                      <td className="py-3 px-4 text-gray-600">{value as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* B2B Banner Right Column */}
      <div className="w-full lg:w-[350px] shrink-0">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
          <h3 className="text-lg font-black text-[#0b1042] mb-2 relative z-10">Need a Custom Solution?</h3>
          <p className="text-sm text-gray-600 mb-6 relative z-10">Our experts are ready to help you</p>
          
          <button className="metallic-red-bg text-white w-full py-3 rounded-lg font-bold text-sm shadow-lg shadow-red-900/20 hover:bg-red-700 transition-colors mb-4 relative z-10">
            Request a Quote <ArrowRight size={16} className="inline ml-1" />
          </button>
          
          {/* Decorative image cutting off at bottom right */}
          <img src={robotArm} alt="" className="absolute -bottom-10 -right-10 w-48 opacity-20 mix-blend-multiply pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
