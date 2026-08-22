import { useState } from 'react';
import { ArrowRight, Plus, Minus, Users, Clock, Compass, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQAndPromise() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do you provide installation and technical support?",
      a: "Yes, our expert team provides full installation and comprehensive technical support for all our machinery to ensure optimal performance."
    },
    {
      q: "Can I get a quotation before purchasing?",
      a: "Absolutely. You can request a detailed quotation through our contact form or by reaching out directly to our sales team."
    },
    {
      q: "Do you deliver islandwide?",
      a: "Yes, we offer fast and reliable islandwide delivery across Sri Lanka for all our products."
    },
    {
      q: "Are the products covered by warranty?",
      a: "Yes, all our genuine products come with a manufacturer warranty. Specific warranty periods depend on the product type."
    }
  ];

  const promises = [
    {
      icon: <Users size={28} className="text-blue-600" strokeWidth={1.5} />,
      title: "Friendly &\nProfessional Team",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Clock size={28} className="text-cyan-600" strokeWidth={1.5} />,
      title: "Quick\nReplies",
      bgColor: "bg-cyan-50"
    },
    {
      icon: <Compass size={28} className="text-orange-600" strokeWidth={1.5} />,
      title: "Clear\nGuidance",
      bgColor: "bg-orange-50"
    },
    {
      icon: <HeartHandshake size={28} className="text-pink-600" strokeWidth={1.5} />,
      title: "Support Even\nAfter Your Purchase",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* FAQ Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0b1042]">Frequently Asked Questions</h2>
            <a href="#" className="text-red-600 text-sm font-semibold flex items-center hover:text-red-700 transition-colors">
              View All FAQs <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-colors ${openFaq === index ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none"
                >
                  <span className={`font-semibold text-sm md:text-base ${openFaq === index ? 'text-[#0b1042]' : 'text-gray-700'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-colors ${openFaq === index ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {openFaq === index ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 md:p-5 pt-0 text-sm text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Support Promise */}
        <div>
          <h2 className="text-2xl font-bold text-[#0b1042] mb-6">Our Customer Support Promise</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 h-[calc(100%-3rem)]">
            {promises.map((promise, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className={`${promise.bgColor} rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-100/50 shadow-sm`}
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                  {promise.icon}
                </div>
                <h4 className="font-bold text-[#0b1042] text-sm whitespace-pre-line leading-snug">
                  {promise.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
