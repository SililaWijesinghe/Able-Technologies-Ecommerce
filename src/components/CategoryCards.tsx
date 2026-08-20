import { Settings, Globe, Wrench, Gauge, Droplet, ArrowRight, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';

export default function CategoryCards() {
  const cards = [
    { title: 'Local Machines', icon: Settings },
    { title: 'Global Machines', icon: Globe },
    { title: 'Spare Parts', icon: Wrench },
    { title: 'Gauges', icon: Gauge },
    { title: 'Glue', icon: Droplet },
    { title: 'All Categories', icon: LayoutGrid },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-30 mt-6 md:mt-[-64px] mb-8">
      <div className="flex md:hidden justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#0b1042]">Shop by Category</h2>
        <span className="metallic-red-text text-xs font-semibold">View All</span>
      </div>
      <div className="md:mt-[25px] bg-transparent md:bg-white md:rounded-2xl md:shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:p-4 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap justify-between gap-3 md:gap-4">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="flex-1 min-w-[140px] bg-white md:bg-gray-50 rounded-xl p-4 md:p-6 flex flex-col items-center text-center shadow-sm md:shadow-none hover:shadow-md hover:bg-white transition-all cursor-pointer group border border-gray-100 md:border-transparent md:hover:border-gray-100"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 md:bg-gray-200 rounded-lg mb-3 md:mb-4 overflow-hidden relative flex items-center justify-center">
               <span className="text-gray-400 text-[10px] md:text-xs">Image</span>
               <div className="absolute top-1.5 right-1.5 bg-red-100 p-1 md:p-1.5 rounded-full border border-white">
                 <card.icon size={12} color="url(#metal-red)" strokeWidth={2.5} className="md:w-3.5 md:h-3.5" />
               </div>
            </div>
            <h3 className="font-bold text-[#0b1042] mb-2 md:mb-3 leading-tight text-xs md:text-sm">{card.title}</h3>
            <span className="metallic-red-text text-[10px] md:text-[11px] font-bold uppercase tracking-wider flex items-center group-hover:underline">
              Explore <ArrowRight size={10} color="url(#metal-red)" className="ml-1 transition-transform group-hover:translate-x-1 md:w-3 md:h-3" />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
