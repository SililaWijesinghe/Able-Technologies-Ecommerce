import { UserCheck, Clock, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactTrustBar() {
  const items = [
    {
      icon: <UserCheck size={28} className="text-[#0b1042]" strokeWidth={1.5} />,
      title: 'Expert Consultation',
      subtitle: 'Free Technical Advice',
    },
    {
      icon: <Clock size={28} className="text-[#0b1042]" strokeWidth={1.5} />,
      title: 'Quick Response',
      subtitle: 'Within 24 Hours',
    },
    {
      icon: <ShieldCheck size={28} className="text-[#0b1042]" strokeWidth={1.5} />,
      title: 'Trusted by Professionals',
      subtitle: 'Across Sri Lanka',
    },
    {
      icon: <Award size={28} className="text-[#0b1042]" strokeWidth={1.5} />,
      title: '100% Genuine Products',
      subtitle: 'Guaranteed Quality',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-20 -mt-8 mb-16">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-6 px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 md:divide-x divide-gray-200">
        {items.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-4 px-4 md:px-2 lg:px-6"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">{item.icon}</div>
            <div>
              <h4 className="font-bold text-sm text-[#0b1042]">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
