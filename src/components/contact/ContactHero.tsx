import { motion } from 'framer-motion';
import heroBg from '../../assets/heroBg.webp';

export default function ContactHero() {
  return (
    <section 
      className="relative w-full h-[300px] md:h-[400px] flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark Navy / Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1042] via-[#0b1042]/90 to-transparent z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {/* Breadcrumb */}
          <div className="text-gray-300 text-xs md:text-sm mb-4 font-medium tracking-wide">
            <span className="hover:text-white cursor-pointer transition-colors">Home</span> 
            <span className="mx-2">&gt;</span> 
            <span className="text-white">Contact Us</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
            We're here to help you find the right machine, part or solution. Get in touch with our experts today!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
