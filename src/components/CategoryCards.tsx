import { Settings, Globe, Wrench, Gauge, Droplet, ArrowRight, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/api';
import allCategoriesImg from '../assets/allCategories.png';

export default function CategoryCards() {
  const fallbackCards = [
    { title: 'Local Machines', icon: Settings },
    { title: 'Global Machines', icon: Globe },
    { title: 'Spare Parts', icon: Wrench },
    { title: 'Gauges', icon: Gauge },
    { title: 'Glue', icon: Droplet },
  ];

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories().then(data => {
      if (data && data.length > 0) {
        setCategories(data.slice(0, 5));
      } else {
        setCategories(fallbackCards);
      }
    });
  }, []);

  // Always append 'All Categories' with the static image asset
  const displayCards = [
    ...categories,
    { title: 'All Categories', name: 'All Categories', icon: LayoutGrid, icon_url: allCategoriesImg, isStatic: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-30 mt-6 md:mt-[-64px] mb-8">
      <div className="flex md:hidden justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#0b1042]">Shop by Category</h2>
        <span className="metallic-red-text text-xs font-semibold">View All</span>
      </div>
      <div className="md:mt-[25px] grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap justify-between gap-4 md:gap-6 pt-4">
        {displayCards.map((card, idx) => {
          const Icon = card.icon || Settings; // Fallback icon
          const targetUrl = card.isStatic 
            ? "/shop" 
            : `/shop?category=${card.slug || (card.name || card.title).toLowerCase().replace(/\\s+/g, '-')}`;
          return (
          <Link to={targetUrl} key={idx} className="flex-1 min-w-[140px] block">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="h-full flex flex-col items-center text-center cursor-pointer group bg-white/40 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 shadow-[8px_8px_20px_rgba(15,23,42,0.08),-8px_-8px_20px_rgba(255,255,255,1)] hover:shadow-[12px_12px_24px_rgba(15,23,42,0.12),-12px_-12px_24px_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl mb-3 md:mb-4 relative flex items-center justify-center p-2">
                 {card.icon_url ? (
                   <img 
                     src={card.icon_url} 
                     alt={card.name || card.title} 
                     className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105" 
                   />
                 ) : (
                   <span className="text-gray-400 text-[10px] md:text-xs">Image</span>
                 )}
                 <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-md p-1 md:p-1.5 rounded-full shadow-sm text-blue-900 border border-gray-100">
                   <Icon size={12} color="url(#metal-red)" strokeWidth={2.5} className="md:w-3.5 md:h-3.5" />
                 </div>
              </div>
              <h3 className="text-slate-800 font-bold mb-2 md:mb-3 leading-tight text-xs md:text-sm">{card.name || card.title}</h3>
              <span className="text-red-600 group-hover:text-red-700 font-semibold text-[10px] md:text-[11px] uppercase tracking-wider flex items-center transition-colors">
                Explore <ArrowRight size={10} color="url(#metal-red)" className="ml-1 transition-transform group-hover:translate-x-1 md:w-3 md:h-3" />
              </span>
            </motion.div>
          </Link>
        )})}
      </div>
    </div>
  );
}
