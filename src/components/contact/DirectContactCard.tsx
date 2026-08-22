import { Headphones, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DirectContactCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#0b1042] rounded-2xl shadow-xl border border-blue-900 overflow-hidden flex flex-col md:w-[400px] lg:w-[450px] shrink-0 relative"
    >
      <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
        <div className="flex items-center space-x-3 mb-2">
          <Headphones size={24} className="text-blue-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Get in Touch Directly</h2>
        </div>
        <p className="text-blue-200 text-sm mb-8">Talk to our friendly team for instant assistance</p>

        <div className="space-y-6 flex-1">
          {/* Call Us */}
          <div className="flex items-start space-x-4 group">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-800/50 group-hover:bg-blue-800 transition-colors">
              <Phone size={18} className="text-blue-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">Call Us</h3>
              <a href="tel:0382221613" className="block text-xl font-bold text-blue-100 hover:text-white transition-colors leading-tight">038 222 1613</a>
              <a href="tel:0777852476" className="block text-xl font-bold text-blue-100 hover:text-white transition-colors">077 785 2476</a>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-500/20 border border-green-500/30 rounded px-2 py-1">
              <span className="text-[10px] font-bold text-green-400">Mon - Sat</span>
              <span className="text-[10px] text-green-400">8.00 AM - 5.30 PM</span>
            </div>
          </div>

          <div className="h-px w-full bg-blue-900/50"></div>

          {/* WhatsApp */}
          <div className="flex items-start space-x-4 group">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30 group-hover:bg-green-500/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">WhatsApp Chat</h3>
              <p className="text-xs text-blue-200 mb-2">Chat with us for quick support</p>
              <a href="#" className="inline-flex items-center space-x-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors">
                <span>Chat on WhatsApp</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

          <div className="h-px w-full bg-blue-900/50"></div>

          {/* Email */}
          <div className="flex items-start space-x-4 group">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-800/50 group-hover:bg-blue-800 transition-colors">
              <Mail size={18} className="text-blue-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">Email Us</h3>
              <a href="mailto:able@ablero.com" className="block text-lg font-bold text-blue-100 hover:text-white transition-colors mb-2">able@ablero.com</a>
              <a href="mailto:able@ablero.com" className="inline-flex items-center space-x-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors border border-blue-600">
                <span>Send Email</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

          <div className="h-px w-full bg-blue-900/50"></div>

          {/* Visit Us */}
          <div className="flex items-start space-x-4 group pb-24">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-800/50 group-hover:bg-blue-800 transition-colors">
              <MapPin size={18} className="text-blue-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white mb-1">Visit Us</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                No.10, Hathbodhi Mawatha,<br />
                Udahamulla, Panadura,<br />
                Sri Lanka.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Office Image placeholder */}
      <div className="absolute bottom-0 right-0 w-3/4 h-48 bg-gradient-to-t from-[#0b1042] via-transparent to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-3/4 h-48 opacity-40 z-0 overflow-hidden">
         <div className="w-full h-full bg-blue-900 rounded-tl-full bg-gradient-to-tl from-blue-700/50 to-transparent flex items-end justify-end p-4">
             {/* If building image isn't available, we create a subtle geometric/industrial shape pattern */}
             <svg className="w-32 h-32 text-blue-500 opacity-20" viewBox="0 0 100 100" fill="currentColor">
               <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" />
             </svg>
         </div>
      </div>
    </motion.div>
  );
}
