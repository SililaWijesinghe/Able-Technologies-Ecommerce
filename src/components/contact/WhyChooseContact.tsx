import { CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhyChooseContact() {
  const reasons = [
    "Genuine & High Quality Products",
    "Expert Technical Support",
    "Competitive Pricing",
    "Fast Islandwide Delivery",
    "Long-Term Trusted Partner"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="md:w-[400px] lg:w-[450px] shrink-0 pl-0 md:pl-10 flex flex-col justify-center relative"
    >
      <h2 className="text-2xl md:text-3xl font-black text-[#0b1042] mb-6 tracking-tight">Why Choose Able Technologies?</h2>
      
      <div className="space-y-4 mb-8">
        {reasons.map((reason, index) => (
          <div key={index} className="flex items-center space-x-3">
            <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
            <span className="text-sm font-medium text-gray-700">{reason}</span>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
      <div className="absolute right-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-32 h-32 md:w-40 md:h-40 pointer-events-none opacity-90">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Starburst background */}
          <path d="M50 2 L56 18 L73 12 L73 30 L90 32 L83 48 L97 60 L80 67 L83 85 L66 80 L56 95 L44 80 L27 85 L30 67 L13 60 L27 48 L20 32 L37 30 L37 12 L54 18 Z" fill="#0b1042" stroke="#ffb300" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="35" fill="transparent" stroke="#ffb300" strokeWidth="1" strokeDasharray="4 2" />
          <text x="50" y="45" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#ffb300" textAnchor="middle">TRUSTED</text>
          <text x="50" y="55" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#ffb300" textAnchor="middle">INDUSTRIAL</text>
          <text x="50" y="65" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#ffb300" textAnchor="middle">PARTNER</text>
          {/* Decorative Stars */}
          <path d="M35 75 L38 82 L31 78 L39 78 L32 82 Z" fill="#ffb300" />
          <path d="M50 78 L53 85 L46 81 L54 81 L47 85 Z" fill="#ffb300" />
          <path d="M65 75 L68 82 L61 78 L69 78 L62 82 Z" fill="#ffb300" />
        </svg>
      </div>
    </motion.div>
  );
}
