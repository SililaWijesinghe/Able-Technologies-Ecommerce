import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  return (
    <section className="bg-white border-t border-b border-gray-100 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-6 w-full md:w-auto"
          >
            <div className="hidden md:flex shrink-0">
               <Mail size={48} className="text-[#0b1042]" strokeWidth={1} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#0b1042] tracking-tight mb-1">Stay Updated with Our Latest Products & Offers</h2>
              <p className="text-gray-500 text-sm">Subscribe to our newsletter and never miss an update.</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-auto md:min-w-[400px]"
          >
            <form className="flex w-full rounded-md border border-gray-200 overflow-hidden focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400 transition-all shadow-sm">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full px-4 py-3 outline-none text-sm bg-gray-50"
                required
              />
              <button 
                type="submit" 
                className="metallic-red-bg px-8 font-bold text-white text-sm hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
