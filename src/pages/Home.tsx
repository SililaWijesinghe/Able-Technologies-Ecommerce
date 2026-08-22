import { ArrowRight, Award, Headphones, LayoutGrid, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import CategoryCards from '../components/CategoryCards';
import TrustBar from '../components/TrustBar';
import PromoGrid from '../components/PromoGrid';
import BestSellers from '../components/BestSellers';
import WhyChooseUs from '../components/WhyChooseUs';
import NewsletterCTA from '../components/NewsletterCTA';
import heroBg from '../assets/heroBg.webp';
import toolImg from '../assets/Tool.png';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full min-h-[550px] md:h-[600px] bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat pb-10 md:pb-0"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark Navy Faded Overlay for Text Highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a2b] via-[#0b1042]/90 md:via-[#0b1042]/95 to-transparent z-0 w-full md:w-[75%]"></div>

        {/* Floating Tool Image (Robotic Arm) */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute right-[-15%] md:right-0 bottom-[10%] md:bottom-[-5%] w-[85%] md:w-[55%] h-[60%] md:h-[115%] z-10 pointer-events-none flex items-end justify-center opacity-40 md:opacity-100"
        >
          <div className="relative w-full h-full flex justify-center items-end">
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={toolImg} 
              alt="Industrial Robotic Arm" 
              className="h-full w-auto object-contain relative z-10 drop-shadow-[-25px_15px_25px_rgba(0,0,0,0.6)]"
            />
            {/* Ground Shadow for Base */}
            <div className="absolute bottom-[3%] left-[45%] -translate-x-1/2 w-[35%] h-[40px] bg-black/70 blur-[20px] rounded-[100%] z-0"></div>
            <div className="absolute bottom-[2%] left-[45%] -translate-x-1/2 w-[25%] h-[20px] bg-black/90 blur-[10px] rounded-[100%] z-0"></div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col pt-8 md:pt-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center mb-4 md:mb-5 w-fit"
          >
            <div className="w-1.5 md:w-2 h-4 md:h-5 bg-gradient-to-b from-red-200 via-red-600 to-red-800 transform -skew-x-[20deg] mr-2 shadow-[0_0_8px_rgba(255,0,0,0.5)]"></div>
            <div className="relative flex items-center pr-12 md:pr-20 pl-2 md:pl-3 py-1 md:py-1.5">
              <div className="absolute inset-0 bg-gradient-to-r from-[#b30000] via-[#7a0000]/70 to-transparent transform -skew-x-[20deg] origin-left border-l-[3px] border-[#ff3333]"></div>
              <span className="relative text-white font-bold italic tracking-widest text-[10px] md:text-[11px] z-10 drop-shadow-sm">
                PRECISION. PERFORMANCE. POSSIBILITIES.
              </span>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-4xl md:text-6xl font-black italic tracking-tight uppercase leading-[1.1] mb-4 md:mb-6"
          >
            <span className="text-white block">ALL KIND OF</span>
            <span className="metallic-red-text block">MACHINE <span className="text-white">MAKERS</span></span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-300 text-sm md:text-lg max-w-[85%] md:max-w-xl mb-6 md:mb-10 leading-relaxed"
          >
            Your one-stop solution for high-quality machines, spare parts, gauges and industrial supplies.
          </motion.p>

          {/* Features Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-2 gap-4 md:flex md:items-center md:space-x-8 mb-8 md:mb-12"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <ShieldCheck size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">High Quality Products</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <Award size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">Trusted by Professionals</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <Truck size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">Fast & Reliable Delivery</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <Headphones size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">Expert Support</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <button className="metallic-red-bg text-white rounded-full px-6 py-3 md:px-8 md:py-3.5 flex items-center justify-center space-x-3 font-semibold transition-transform hover:scale-105 shadow-lg shadow-red-900/40 text-sm md:text-base w-fit">
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </button>
            
            <button className="bg-transparent border border-blue-400 text-white rounded-full px-6 py-3 md:px-8 md:py-3.5 flex items-center justify-center space-x-3 font-semibold hover:bg-blue-900/50 transition-colors backdrop-blur-sm text-sm md:text-base w-fit">
              <span>View Categories</span>
              <LayoutGrid size={18} />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Page Content */}
      <CategoryCards />
      <TrustBar />
      <PromoGrid />
      <BestSellers />
      <WhyChooseUs />
      <NewsletterCTA />
    </>
  );
}
