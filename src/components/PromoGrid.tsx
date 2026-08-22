import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function PromoGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20 overflow-hidden">
      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        
        {/* Left Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="bg-[#0b1042] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden group shadow-lg min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start shrink-0"
        >
          <div className="relative z-10 h-full flex flex-col">
            <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase mb-2 md:mb-3 flex items-center">
              Premium Quality <span className="ml-2 w-4 h-0.5 bg-gray-500"></span>
            </p>
            <h3 className="text-2xl md:text-3xl font-black italic mb-2 md:mb-3 leading-tight">INDUSTRIAL<br/>MACHINES</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-6 md:mb-8 max-w-[200px] leading-relaxed">Built for Precision, Engineered to Last.</p>
            <button className="mt-auto metallic-red-bg border-none text-white text-xs font-bold py-2.5 px-4 md:py-3 md:px-5 rounded-full flex items-center w-fit transition-colors shadow-none">
              Explore Machines <ArrowRight size={14} className="ml-2" />
            </button>
          </div>
          {/* Abstract Image Placeholder overlay */}
          <div className="absolute right-0 bottom-0 w-[55%] h-[70%] bg-white/10 rounded-tl-full backdrop-blur-sm flex justify-center items-center">
            <span className="text-white/30 text-xs italic text-center px-2">Machine<br/>Image</span>
          </div>
        </motion.div>
        
        {/* Center Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="metallic-red-bg border-none rounded-2xl p-6 md:p-8 text-white relative overflow-hidden group shadow-lg min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start shrink-0"
        >
          <div className="relative z-10 h-full flex flex-col">
            <p className="text-[10px] font-bold text-red-100 tracking-widest uppercase mb-2 md:mb-3 flex items-center">
              Wide Range Of <span className="ml-2 w-4 h-0.5 bg-red-200"></span>
            </p>
            <h3 className="text-2xl md:text-3xl font-black italic mb-2 md:mb-3 leading-tight">SPARE<br/>PARTS</h3>
            <p className="text-xs md:text-sm text-red-100 mb-6 md:mb-8 max-w-[200px] leading-relaxed">Keep Your Machines Running Smoothly.</p>
            <button className="mt-auto bg-white metallic-red-text hover:bg-gray-100 text-xs font-bold py-2.5 px-4 md:py-3 md:px-5 rounded-full flex items-center w-fit transition-colors">
              Shop Parts <ArrowRight size={14} color="url(#metal-red)" className="ml-2" />
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-[60%] h-[70%] bg-black/10 rounded-tl-[100px] flex justify-center items-center">
            <span className="text-white/40 text-xs italic text-center px-2">Parts<br/>Image</span>
          </div>
        </motion.div>

        {/* Right Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="bg-[#0b1042] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden group shadow-lg flex flex-col justify-between min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start shrink-0"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase mb-2 md:mb-3 flex items-center">
              Accurate & Reliable <span className="ml-2 w-4 h-0.5 bg-gray-500"></span>
            </p>
            <h3 className="text-2xl md:text-3xl font-black italic mb-2 md:mb-3 leading-tight">GAUGES &<br/>ACCESSORIES</h3>
            <p className="text-xs md:text-sm text-gray-300 mb-6 md:mb-8 max-w-[200px] leading-relaxed">Precision You Can Trust.</p>
            <button className="metallic-red-bg border-none text-white text-xs font-bold py-2.5 px-4 md:py-3 md:px-5 rounded-full flex items-center w-fit transition-colors shadow-none">
              View Gauges <ArrowRight size={14} className="ml-2" />
            </button>
          </div>
          
          <div className="flex justify-center space-x-2 mt-auto relative z-10 pt-6 md:pt-8">
            <div className="w-2 h-2 rounded-full metallic-red-bg border-none shadow-none"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600 cursor-pointer hover:bg-gray-400"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600 cursor-pointer hover:bg-gray-400"></div>
          </div>

          <div className="absolute right-[-10%] top-[10%] w-[55%] h-[60%] bg-white/5 rounded-full backdrop-blur-md flex justify-center items-center">
             <span className="text-white/20 text-xs italic text-center px-2">Gauge<br/>Image</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
