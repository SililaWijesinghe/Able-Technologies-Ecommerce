import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from './shop/ProductCard';
import { SkeletonProductCard } from './ui/Skeleton';
import { fetchCategories, fetchProducts } from '../services/api';
import { useStoreSettings } from '../context/StoreSettingsContext';

const SparePartsShowcase = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useStoreSettings();

  useEffect(() => {
    const loadSpareParts = async () => {
      try {
        setLoading(true);
        // First try to find the Spare Parts category
        const categories = await fetchCategories();
        const sparePartsCat = categories.find((c: any) => 
          c.name.toLowerCase().includes('spare parts') || 
          c.slug?.toLowerCase().includes('spare-parts')
        );

        let fetchedProducts = [];
        if (sparePartsCat) {
          fetchedProducts = await fetchProducts({ category: sparePartsCat.id });
        } else {
          // Fallback: fetch all and filter client side just in case
          const allProducts = await fetchProducts();
          fetchedProducts = allProducts.filter((p: any) => 
            p.category_name?.toLowerCase().includes('spare parts') || 
            (p.category && typeof p.category === 'string' && p.category.toLowerCase().includes('spare parts')) ||
            (p.category && typeof p.category === 'object' && p.category.name?.toLowerCase().includes('spare parts'))
          );
        }

        // If no spare parts found, fetch a few default products just to show something in dev
        if (fetchedProducts.length === 0) {
           const fallbackProducts = await fetchProducts();
           fetchedProducts = fallbackProducts.slice(0, 4);
        }

        setProducts(fetchedProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to load spare parts", error);
      } finally {
        setLoading(false);
      }
    };

    loadSpareParts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Column - Banner (33% on desktop) */}
          <div className="w-full lg:w-1/3 shrink-0 flex">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-[#0b1042] flex flex-col justify-between p-10 min-h-[400px] group"
            >
              <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" 
                   style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80")' }}>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a2b] via-[#0b1042]/80 to-[#0b1042]/40 z-0"></div>
              
              <div className="relative z-10 flex flex-col items-start h-full justify-center">
                <div className="w-14 h-14 bg-blue-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-blue-500/30 mb-8 shadow-inner shadow-blue-400/20">
                  <Settings size={28} className="text-blue-400" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-4">
                  Genuine<br/><span className="text-blue-400">Spare Parts</span>
                </h2>
                
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-[280px]">
                  Minimize downtime with our high-quality replacement parts. Engineered for maximum reliability and industrial performance.
                </p>
                
                <Link 
                  to="/shop?category=spare-parts" 
                  className="mt-auto inline-flex items-center gap-2 bg-white text-[#0b1042] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 group-hover:shadow-white/20"
                >
                  View All Parts
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Products Grid (67% on desktop) */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Featured Parts</h3>
              <Link to="/shop?category=spare-parts" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hidden sm:flex items-center">
                See all <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))
              ) : (
                <div className="col-span-1 sm:col-span-2 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
                  <Settings size={48} className="text-gray-300 mb-4" />
                  <h4 className="text-lg font-bold text-gray-800 mb-2">No spare parts found</h4>
                  <p className="text-gray-500 text-sm max-w-sm">We are currently updating our spare parts inventory. Please check back later.</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default SparePartsShowcase;
