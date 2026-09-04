import { Check, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function LocationAndWhyUs() {
  const reasons = [
    "Genuine & High Quality Products",
    "Expert Technical Support",
    "Competitive Pricing",
    "Fast Islandwide Delivery",
    "Long-Term Trusted Partner"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Map Area */}
        <div className="relative h-[300px] lg:h-[400px] bg-gray-200">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.379162190262!2d79.90854557499469!3d6.723504093272458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae246042903b98f%3A0x819e1a562e791e8f!2sAble%20Technologies%20(PVT)%20LTD%20-%20Head%20Office!5e0!3m2!1sen!2slk!4v1788511897387!5m2!1sen!2slk" 
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>

        {/* Why Choose Us */}
        <div className="p-8 lg:p-12 relative">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0b1042] mb-8">Why Choose Able Technologies?</h2>
          
          <ul className="space-y-4">
            {reasons.map((reason, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check size={14} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">{reason}</span>
              </motion.li>
            ))}
          </ul>

          {/* Trust Badge */}
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.5, type: 'spring' }}
             className="absolute right-8 bottom-8 md:right-12 md:bottom-12 w-28 h-28 bg-[#0b1042] rounded-full flex flex-col items-center justify-center text-center shadow-xl border-4 border-[#ffb700] rotate-12"
          >
             <div className="text-[#ffb700] text-[10px] font-bold tracking-widest uppercase mb-1">Trusted</div>
             <div className="text-white text-xs font-bold leading-tight">INDUSTRIAL<br/>PARTNER</div>
             <div className="flex space-x-0.5 mt-1">
               {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StarIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="#ffb700" stroke="#ffb700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
