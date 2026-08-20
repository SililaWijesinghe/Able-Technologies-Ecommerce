import { Check, ArrowRight, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <span className="metallic-red-text text-[10px] font-bold uppercase tracking-wider">Why Choose Us</span>
            <div className="w-8 h-px metallic-red-bg border-none shadow-none"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4 md:mb-6 leading-[1.1] tracking-tight">
            We Deliver More<br/>Than Just Products
          </h2>
          <p className="text-gray-600 mb-6 md:mb-8 max-w-md leading-relaxed text-sm">
            We are committed to providing the best industrial solutions with unmatched quality, reliability and customer service.
          </p>
          
          <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
            {['Genuine & High Quality Products', 'Expert Technical Support', 'Competitive Prices', 'On-time Delivery'].map((item, i) => (
              <li key={i} className="flex items-center text-gray-800 font-semibold text-xs md:text-sm">
                <Check size={16} className="text-[#0b1042] mr-3 font-bold md:w-4 md:h-4 w-3.5 h-3.5" />
                {item}
              </li>
            ))}
          </ul>

          <button className="metallic-red-bg border-none text-white font-semibold py-3 md:py-3.5 px-6 md:px-8 rounded-full flex items-center transition-transform hover:scale-105 shadow-lg shadow-red-900/40 text-xs md:text-sm w-fit">
            Learn More About Us <ArrowRight size={14} className="ml-2 md:w-4 md:h-4" />
          </button>
        </motion.div>

        {/* Right Collage - Hidden on Mobile */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="hidden md:block relative h-[450px] lg:h-[550px]"
        >
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="flex flex-col gap-4 pt-8">
              <div className="bg-gray-200 rounded-2xl h-[45%] shadow-md flex items-center justify-center text-gray-400 overflow-hidden relative group">
                <span className="text-xs font-semibold">Image 1</span>
              </div>
              <div className="bg-gray-300 rounded-2xl h-[55%] shadow-md flex items-center justify-center text-gray-500 overflow-hidden relative group">
                <span className="text-xs font-semibold">Image 2</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 pb-8">
              <div className="bg-gray-300 rounded-2xl h-[55%] shadow-md flex items-center justify-center text-gray-500 overflow-hidden relative group">
                 <span className="text-xs font-semibold">Image 3</span>
              </div>
              <div className="bg-gray-200 rounded-2xl h-[45%] shadow-md flex items-center justify-center text-gray-400 overflow-hidden relative group">
                 <span className="text-xs font-semibold">Image 4</span>
              </div>
            </div>
          </div>
          
          {/* Overlay Trust Box */}
          <div className="absolute -bottom-6 lg:bottom-10 left-4 lg:-left-12 bg-[#0b1042] p-8 rounded-2xl shadow-2xl max-w-[280px] border-l-4 border-red-600 z-10">
            <Award size={48} className="text-white mb-6 opacity-90 stroke-1" />
            <h4 className="text-white font-bold text-lg leading-snug">
              YOUR TRUSTED PARTNER IN INDUSTRIAL SOLUTIONS
            </h4>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
