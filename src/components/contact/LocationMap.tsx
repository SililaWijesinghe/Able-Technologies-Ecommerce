import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocationMap() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex-1 rounded-2xl overflow-hidden relative shadow-sm border border-gray-200 h-[300px] md:h-[400px] bg-blue-50 group"
    >
      {/* Decorative Map Placeholder - In a real app this would be an iframe or map component */}
      <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply flex items-center justify-center">
        {/* Abstract Map Grid Pattern */}
        <svg className="w-full h-full text-blue-200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-blue-100/30"></div>

      {/* Map Marker & Info Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3 mb-2 animate-bounce-slow">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
             <MapPin size={20} className="text-red-600" />
          </div>
          <div className="flex flex-col pr-4">
            <span className="text-sm font-bold text-[#0b1042]">Able Technologies (PVT) LTD</span>
            <span className="text-xs text-gray-500">Panadura, Sri Lanka</span>
          </div>
        </div>
        <div className="w-4 h-4 bg-red-600 rotate-45 transform translate-y-[-10px] -z-10 shadow-md"></div>
      </div>
    </motion.div>
  );
}
