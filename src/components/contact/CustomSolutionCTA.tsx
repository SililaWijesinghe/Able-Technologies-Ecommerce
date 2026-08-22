import { ArrowRight, UserCog, FileText, Package, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import toolImg from '../../assets/Tool.png';

export default function CustomSolutionCTA() {
  const processSteps = [
    { icon: <UserCog size={20} />, label: "Consultation" },
    { icon: <FileText size={20} />, label: "Quotation" },
    { icon: <Package size={20} />, label: "Supply" },
    { icon: <Wrench size={20} />, label: "After Sales Support" }
  ];

  return (
    <section className="w-full bg-[#0b1042] py-0 relative overflow-hidden my-16 rounded-3xl mx-4 md:mx-auto max-w-[1400px]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1042] via-[#0b1042]/90 to-red-900/40 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
        {/* Left Image */}
        <div className="hidden md:block w-[300px] h-[250px] relative shrink-0">
          <img 
            src={toolImg} 
            alt="Robotic Arm" 
            className="absolute -bottom-10 -left-10 w-[120%] h-auto object-contain drop-shadow-2xl z-10" 
          />
        </div>

        {/* Center Content */}
        <div className="flex-1 py-12 md:py-16 md:pl-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Need a Custom Solution?</h2>
            <p className="text-blue-100 text-sm md:text-base max-w-xl mb-8 leading-relaxed">
              Tell us your requirement. We design, supply and support the best industrial solutions for your business.
            </p>
            
            {/* Process */}
            <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-0 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-blue-400/30 flex items-center justify-center text-blue-300 mb-2">
                      {step.icon}
                    </div>
                    <span className="text-[10px] md:text-xs text-blue-200 font-medium whitespace-nowrap">{step.label}</span>
                  </div>
                  {index < processSteps.length - 1 && (
                    <ArrowRight size={16} className="text-blue-500/50 mx-2 md:mx-4 mb-4" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="pb-12 md:pb-0 md:pr-12 shrink-0"
        >
          <button className="metallic-red-bg border-none py-3.5 px-8 rounded-full font-bold text-white flex items-center justify-center space-x-2 hover:scale-105 transition-transform shadow-lg shadow-red-900/50">
            <span>Request a Quote</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
