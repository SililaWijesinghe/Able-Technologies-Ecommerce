import { UserCog, Clock, ShieldCheck, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustBenefits() {
  const benefits = [
    {
      icon: <UserCog size={24} className="text-[#0b1042]" />,
      title: "Expert Consultation",
      desc: "Free Technical Advice"
    },
    {
      icon: <Clock size={24} className="text-[#0b1042]" />,
      title: "Quick Response",
      desc: "Within 24 Hours"
    },
    {
      icon: <ShieldCheck size={24} className="text-[#0b1042]" />,
      title: "Trusted by Professionals",
      desc: "Across Sri Lanka"
    },
    {
      icon: <BadgeCheck size={24} className="text-[#0b1042]" />,
      title: "100% Genuine Products",
      desc: "Guaranteed Quality"
    }
  ];

  return (
    <div className="w-full relative z-20 -mt-10 mb-12 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-1 p-5 md:p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors cursor-default group"
            >
              <div className="w-12 h-12 rounded-full border border-blue-100 bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#0b1042]">{benefit.title}</h3>
                <p className="text-xs text-gray-500 font-medium">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
