import { ArrowRight, UserCheck, FileText, Package, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import toolImg from '../../assets/Tool.png';

export default function CustomSolutionCTA() {
  const steps = [
    { icon: <UserCheck size={20} />, label: "Consultation" },
    { icon: <FileText size={20} />, label: "Quotation" },
    { icon: <Package size={20} />, label: "Supply" },
    { icon: <Wrench size={20} />, label: "After Sales Support" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
      <div className="relative bg-[#0b1042] rounded-2xl overflow-hidden shadow-xl border border-blue-900/50 flex flex-col md:flex-row items-center">
        {/* Background Gradients */}
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-red-600/20 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
        
        {/* Image Area */}
        <div className="w-full md:w-1/4 h-48 md:h-auto flex items-center justify-center p-4 relative z-10">
          <img src={toolImg} alt="Industrial Tool" className="h-full object-contain drop-shadow-2xl" style={{ maxHeight: '180px' }} />
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4 p-8 lg:p-12 text-white relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Need a Custom Solution?</h2>
            <p className="text-blue-100 text-sm md:text-base max-w-lg mx-auto lg:mx-0">
              Tell us your requirement. We design, supply and support the best industrial solutions for your business.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Process Steps */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-blue-400/30 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm mb-2">
                      {step.icon}
                    </div>
                    <span className="text-[9px] md:text-[10px] font-medium text-blue-200 text-center uppercase tracking-wider">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-1 md:mx-3 text-blue-500/50 mb-4">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="metallic-red-bg px-8 py-3 rounded-full font-semibold flex items-center space-x-2 hover:opacity-90 transition-opacity shadow-lg">
              <span>Request a Quote</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
