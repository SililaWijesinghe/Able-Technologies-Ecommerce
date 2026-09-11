import { Settings, Globe, Wrench, Gauge, Droplet, ArrowRight, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCatalogQueries';
import { Skeleton } from './ui/Skeleton';
import allCategoriesImg from '../assets/allCategories.png';

const iconMap: Record<string, any> = {
  'local-machines': Settings,
  'global-machines': Globe,
  'spare-parts': Wrench,
  'glue': Droplet,
  'machine-services': Gauge,
};

const imageMap: Record<string, string> = {
  'local-machines': 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/uploads/categories/local.png',
  'global-machines': 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/uploads/categories/global.png',
  'spare-parts': 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/uploads/categories/spareparts&gauges.png',
  'glue': 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/uploads/categories/glue.png',
  'machine-services': 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/uploads/categories/machineServices.png',
};

export default function CategoryCards() {
  const fallbackCategories: any[] = [
    { title: 'Local Machines', name: 'Local Machines', slug: 'local-machines', icon: Settings, icon_url: imageMap['local-machines'] },
    { title: 'Global Machines', name: 'Global Machines', slug: 'global-machines', icon: Globe, icon_url: imageMap['global-machines'] },
    { title: 'Spare Parts', name: 'Spare Parts', slug: 'spare-parts', icon: Wrench, icon_url: imageMap['spare-parts'] },
    { title: 'Glue', name: 'Glue', slug: 'glue', icon: Droplet, icon_url: imageMap['glue'] },
    { title: 'Machine Services', name: 'Machine Services', slug: 'machine-services', icon: Gauge, icon_url: imageMap['machine-services'] },
  ];

  const { data, isLoading } = useCategories();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (data && data.length > 0) {
        // Filter out sub-categories (only keep those where parent_id is null)
        const parentCategories = data.filter((cat: any) => !cat.parent_id);
        
        // Map database categories to include fallback icons based on slug
        const mappedData = parentCategories.map((cat: any) => ({
          ...cat,
          icon: iconMap[cat.slug] || Settings,
          icon_url: imageMap[cat.slug] || cat.icon_url, // Prefer hardcoded image URLs
          title: cat.name
        }));
        
        // Ensure we only take up to 5 categories to maintain layout
        setCategories(mappedData.slice(0, 5));
      } else {
        setCategories(fallbackCategories);
      }
    }
  }, [data, isLoading]);

  // Always append 'All Categories' with the static image asset
  const displayCards: any[] = [
    ...categories,
    { title: 'All Categories', name: 'All Categories', slug: 'all', icon: LayoutGrid, icon_url: 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/uploads/categories/1788260803970_others_11zon_png.png', isStatic: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-30 mt-6 md:mt-[-64px] mb-8">
      <div className="flex md:hidden justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-[#0b1042]">Shop by Category</h2>
        <span className="metallic-red-text text-xs font-semibold">View All</span>
      </div>

      {isLoading ? (
        <div className="md:mt-[25px] flex justify-between gap-4 md:gap-6 pt-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 min-w-[140px] h-48 bg-white/40 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="md:mt-[25px] grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap justify-between gap-4 md:gap-6 pt-4">
          {displayCards.map((card, idx) => {
            const Icon = card.icon || Settings; // Fallback icon
            const targetUrl = card.isStatic 
               ? "/shop" 
               : `/shop?category=${card.slug || (card.name || card.title).toLowerCase().replace(/\s+/g, '-')}`;
            
            return (
            <Link to={targetUrl} key={idx} className="flex-1 min-w-[140px] block">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="h-full flex flex-col items-center text-center cursor-pointer group bg-white/40 backdrop-blur-2xl border border-white/70 rounded-3xl p-4 sm:p-5 md:p-6 shadow-[8px_8px_20px_rgba(15,23,42,0.08),-8px_-8px_20px_rgba(255,255,255,1)] hover:shadow-[12px_12px_24px_rgba(15,23,42,0.12),-12px_-12px_24px_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl mb-3 md:mb-4 relative flex items-center justify-center">
                   {card.icon_url ? (
                     <img 
                        src={card.icon_url} 
                        alt={card.name || card.title} 
                        className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to vector icon if image fails to load
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                          }
                        }}
                      />
                   ) : null}
                   
                   <div style={{ display: card.icon_url ? 'none' : 'block' }}>
                     <ImageIcon size={48} className="text-gray-300" strokeWidth={1.5} />
                   </div>

                   <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-md p-1 md:p-1.5 rounded-full shadow-sm text-blue-900 border border-gray-100 translate-x-1 -translate-y-1">
                     <Icon size={14} color="url(#metal-red)" strokeWidth={2.5} className="md:w-4 md:h-4" />
                   </div>
                </div>
                <h3 className="text-slate-800 font-bold mb-2 md:mb-3 leading-tight text-sm md:text-base">{card.name || card.title}</h3>
                <span className="text-red-600 group-hover:text-red-700 font-semibold text-[11px] md:text-xs uppercase tracking-wider flex items-center transition-colors">
                  Explore <ArrowRight size={12} color="url(#metal-red)" className="ml-1 transition-transform group-hover:translate-x-1 md:w-3.5 md:h-3.5" />
                </span>
              </motion.div>
            </Link>
          )})}
        </div>
      )}
    </div>
  );
}
