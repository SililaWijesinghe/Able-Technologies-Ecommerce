import { useState } from 'react';
import { Plus, Minus, Users, Zap, CheckCircle2, Headphones, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      q: "Do you provide installation and technical support?",
      a: "Yes, our expert technical team provides complete installation, commissioning, and ongoing maintenance support for all machinery and equipment we supply."
    },
    {
      q: "Can I get a quotation before purchasing?",
      a: "Absolutely. You can request a formal quotation through our contact form or by calling our sales team directly. We'll provide a detailed breakdown of costs."
    },
    {
      q: "Do you deliver islandwide?",
      a: "Yes, we offer fast and reliable islandwide delivery across Sri Lanka for all our machines, spare parts, and supplies."
    },
    {
      q: "Are the products covered by warranty?",
      a: "All our machines and major components come with a comprehensive manufacturer's warranty. The duration varies by product category."
    }
  ];

  const features = [
    { icon: <Users size={24} className="text-blue-600" />, title: "Friendly &\nProfessional Team" },
    { icon: <Zap size={24} className="text-blue-600" />, title: "Quick Replies" },
    { icon: <CheckCircle2 size={24} className="text-blue-600" />, title: "Clear Guidance" },
    { icon: <Headphones size={24} className="text-blue-600" />, title: "Support Even\nAfter Your Purchase" }
  ];

  return (
    <section className="container mx-auto px-6 py-12 md:py-16 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left - FAQs */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-[#0b1042] tracking-tight">Frequently Asked Questions</h2>
            <a href="#" className="hidden md:flex items-center space-x-1 text-red-600 font-bold text-sm hover:text-red-700 transition-colors">
              <span>View All FAQs</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-xl overflow-hidden transition-colors ${openIndex === index ? 'border-red-500 bg-red-50/10' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <button
                  onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-bold text-sm md:text-base ${openIndex === index ? 'text-[#0b1042]' : 'text-gray-700'}`}>{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {openIndex === index ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <a href="#" className="md:hidden flex items-center space-x-1 text-red-600 font-bold text-sm mt-6 hover:text-red-700 transition-colors">
            <span>View All FAQs</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Right - Support Promise */}
        <div className="lg:w-[450px] shrink-0">
          <h2 className="text-2xl md:text-3xl font-black text-[#0b1042] mb-8 tracking-tight">Our Customer Support Promise</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-blue-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-[#0b1042]">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-[#0b1042] text-xs leading-tight whitespace-pre-line">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
