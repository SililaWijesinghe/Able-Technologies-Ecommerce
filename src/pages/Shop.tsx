import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import { motion } from 'motion/react';
import { 
  ChevronRight, Grid, List, X, ChevronLeft, 
  Settings, ArrowRight
} from 'lucide-react';
import FilterSidebar from '../components/shop/FilterSidebar';
import ProductCard from '../components/shop/ProductCard';
import TrustBar from '../components/TrustBar';

import heroBg from '../assets/heroBg.webp';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchProducts(filters).then(data => {
      setProducts(data || []);
      setIsLoading(false);
    });
  }, [filters]);

  const activeFilters = [
    { label: 'Spare Parts' },
    { label: 'In Stock' },
    { label: 'SMC' },
    { label: 'Price: Rs. 0 - Rs. 500,000+' }
  ];

  return (
    <div className="bg-gray-50 pb-16">
      {/* Hero Banner */}
      <section 
        className="relative w-full h-[250px] md:h-[300px] bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a2b] via-[#0b1042]/90 to-transparent z-0"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 w-full pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black italic tracking-tight text-white uppercase mb-2"
          >
            Shop
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-sm md:text-base mb-6"
          >
            Browse our wide range of machines, spare parts, gauges & more.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center text-xs font-semibold text-gray-400 space-x-2"
          >
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={14} />
            <span className="text-white">Shop</span>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges - positioned to overlap banner slightly, or just right below */}
      <div className="-mt-8 relative z-30">
        <TrustBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-100">
            <span className="text-sm text-gray-500 font-medium mb-3 md:mb-0">
              Showing 1–12 of 245 results
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 border border-gray-200 rounded p-0.5">
                <button className="p-1.5 bg-gray-100 text-[#0b1042] rounded shadow-sm">
                  <Grid size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-[#0b1042] rounded">
                  <List size={16} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                <select className="text-sm border border-gray-200 rounded px-3 py-1.5 text-[#0b1042] font-semibold focus:outline-none">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {activeFilters.map((filter, idx) => (
              <div key={idx} className="bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                {filter.label}
                <button className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0b1042] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-10">
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <ProductCard key={product.id || idx} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No products found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-auto border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center bg-[#0b1042] text-white font-semibold text-sm shadow-sm">1</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm">2</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm">3</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm">4</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm">5</button>
              <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm">21</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-[#0b1042]">Show:</span>
              <select className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none">
                <option>12 per page</option>
                <option>24 per page</option>
                <option>48 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16">
        <div className="bg-[#0b1042] rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', maskImage: 'linear-gradient(to right, transparent, black)' }}></div>
          
          <div className="relative z-10 max-w-2xl text-center md:text-left mb-6 md:mb-0">
            <span className="text-gray-300 text-sm font-semibold tracking-wider mb-2 block">Can't Find What You Need?</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">Get a Custom Solution for Your Requirement</h2>
            <p className="text-gray-300 text-sm mb-6">Our experts are ready to provide the right machine, part or service for your business.</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center text-xs font-semibold text-blue-200 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                <Settings size={14} className="mr-2" /> Expert Consultation
              </div>
              <div className="flex items-center text-xs font-semibold text-blue-200 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                <Settings size={14} className="mr-2" /> Custom Solutions
              </div>
              <div className="flex items-center text-xs font-semibold text-blue-200 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                <Settings size={14} className="mr-2" /> Quick Response
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center md:items-end">
            <button className="metallic-red-bg text-white font-bold text-sm md:text-base px-8 py-4 rounded-xl flex items-center shadow-xl shadow-red-900/30 hover:scale-105 transition-transform mb-3">
              Get a Quote Now <ArrowRight size={18} className="ml-2" />
            </button>
            <p className="text-white text-sm font-semibold">
              or Call: <span className="font-bold">038 222 1613</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
