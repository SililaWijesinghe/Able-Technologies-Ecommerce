import { ArrowRight, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function NewsletterCTA() {
  return (
    <div className="md:bg-[#0b1042] md:py-16 py-8 px-4 md:px-0">
      <div className="max-w-7xl mx-auto px-6 md:px-6 bg-[#0b1042] rounded-2xl md:rounded-none py-10 md:py-0 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center divide-y md:divide-y-0 md:divide-x divide-white/10 shadow-lg md:shadow-none">
        
        {/* Left Side CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="md:pr-12"
        >
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-2 tracking-tight">Need a Custom Solution?</h2>
          <p className="text-gray-300 text-xs md:text-sm mb-6 md:mb-6">Get in touch with our experts today.</p>
          <button className="metallic-red-bg border-none text-white font-bold py-3 md:py-3.5 px-6 md:px-8 rounded-full flex items-center transition-transform hover:scale-105 text-xs md:text-sm w-fit shadow-lg shadow-red-900/40">
            Get a Quote <ArrowRight size={14} className="ml-2 md:w-4 md:h-4" />
          </button>
        </motion.div>

        {/* Right Side Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.2 }}
          className="pt-8 md:pt-0 md:pl-12 hidden md:block"
        >
          <h2 className="text-xl font-bold text-white mb-2">Subscribe to our newsletter</h2>
          <p className="text-gray-300 text-sm mb-6">Get updates on new products, offers & more.</p>
          <div className="flex w-full max-w-md shadow-lg">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white px-5 py-3.5 rounded-l text-sm outline-none text-gray-800 placeholder:text-gray-400"
            />
            <button className="bg-[#060a2b] hover:bg-black text-white px-6 py-3.5 rounded-r transition-colors flex items-center justify-center">
              <Send size={18} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
