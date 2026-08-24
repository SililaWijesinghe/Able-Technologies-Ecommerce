import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import robotArm from '../../assets/heroBg.webp'; // Placeholder for the robot arm in the B2B banner

export default function ProductTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState('Description');
  const tabs = ['Description', 'Specifications', 'Downloads', 'Reviews (125)', 'Q&A'];

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-16 border-t border-gray-200 pt-10">
      <div className="flex-1">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-[#0b1042]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pr-0 md:pr-8">
          <h2 className="text-xl font-black text-[#0b1042] mb-4">Product Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            The <strong className="text-gray-800">{product.name}</strong> is designed to deliver exceptional performance and durability in demanding industrial environments. Manufactured to ISO 15552 standards, it ensures interchangeability, reliability and long service life.
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start text-sm text-gray-600">
              <Check size={16} className="text-green-500 mr-2 shrink-0 mt-0.5" />
              Conforms to ISO 15552 standard
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <Check size={16} className="text-green-500 mr-2 shrink-0 mt-0.5" />
              Magnetic piston as standard
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <Check size={16} className="text-green-500 mr-2 shrink-0 mt-0.5" />
              Adjustable cushioning at both ends
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <Check size={16} className="text-green-500 mr-2 shrink-0 mt-0.5" />
              Wide range of mounting accessories
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <Check size={16} className="text-green-500 mr-2 shrink-0 mt-0.5" />
              High corrosion resistance and durability
            </li>
          </ul>

          {/* Feature Callouts - visually mocking the image chart */}
          <div className="relative mt-12 mb-8 bg-gray-50 rounded-xl p-8 border border-gray-100 flex items-center justify-center min-h-[300px]">
             {product.images?.[0]?.image_url && (
                <img src={product.images[0].image_url} alt="features" className="w-2/3 object-contain mix-blend-multiply opacity-50" />
             )}
             
             {/* Mock labels */}
             <div className="absolute top-1/4 left-1/4 -translate-x-1/2">
                <div className="text-xs font-bold text-[#0b1042]">Adjustable Cushioning</div>
                <div className="text-[10px] text-gray-500">Smooth performance</div>
                <div className="w-16 h-px bg-blue-300 mt-2 rotate-12"></div>
             </div>
             
             <div className="absolute top-1/4 right-1/4 translate-x-1/2 text-right">
                <div className="text-xs font-bold text-[#0b1042]">Aluminum Body</div>
                <div className="text-[10px] text-gray-500">Lightweight & Durable</div>
                <div className="w-16 h-px bg-blue-300 mt-2 -rotate-12 ml-auto"></div>
             </div>

             <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2">
                <div className="text-xs font-bold text-[#0b1042]">Magnetic Piston</div>
                <div className="text-[10px] text-gray-500">Built-in magnet</div>
                <div className="w-16 h-px bg-blue-300 mb-2 -rotate-12"></div>
             </div>

             <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 text-right">
                <div className="text-xs font-bold text-[#0b1042]">ISO 15552 Standard</div>
                <div className="text-[10px] text-gray-500">Internationally Compliant</div>
                <div className="w-16 h-px bg-blue-300 mb-2 rotate-12 ml-auto"></div>
             </div>
          </div>

        </div>
      </div>

      {/* B2B Banner Right Column */}
      <div className="w-full lg:w-[350px] shrink-0">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
          <h3 className="text-lg font-black text-[#0b1042] mb-2 relative z-10">Need a Custom Solution?</h3>
          <p className="text-sm text-gray-600 mb-6 relative z-10">Our experts are ready to help you</p>
          
          <ul className="space-y-3 mb-8 relative z-10">
            <li className="flex items-center text-xs font-semibold text-gray-700">
              <Check size={14} className="text-[#0b1042] mr-2" /> Custom sizes available
            </li>
            <li className="flex items-center text-xs font-semibold text-gray-700">
              <Check size={14} className="text-[#0b1042] mr-2" /> Bulk order support
            </li>
            <li className="flex items-center text-xs font-semibold text-gray-700">
              <Check size={14} className="text-[#0b1042] mr-2" /> Technical consultation
            </li>
          </ul>

          <button className="metallic-red-bg text-white w-full py-3 rounded-lg font-bold text-sm shadow-lg shadow-red-900/20 hover:bg-red-700 transition-colors mb-4 relative z-10">
            Request a Quote <ArrowRight size={16} className="inline ml-1" />
          </button>
          
          <p className="text-center text-sm text-gray-600 relative z-10">
            or Call: <span className="font-bold text-[#0b1042]">038 222 1613</span>
          </p>

          {/* Decorative image cutting off at bottom right */}
          <img src={robotArm} alt="" className="absolute -bottom-10 -right-10 w-48 opacity-20 mix-blend-multiply pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
