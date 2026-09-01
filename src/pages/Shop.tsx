import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';
import { useLocation } from 'react-router-dom';
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
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [availability, setAvailability] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('Newest Arrivals');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 1. Fetch ALL products and categories once
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchProducts(), fetchCategories()]).then(([productsData, categoriesData]) => {
      setAllProducts(productsData || []);
      setDbCategories(categoriesData || []);
      setIsLoading(false);
    });
  }, []);

  // 2. Filter & Sort Logic
  useEffect(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        const pCat = dbCategories.find(c => c.id === p.category_id);
        return selectedCategories.includes(p.category_id) || 
               (pCat && selectedCategories.includes(pCat.slug)) ||
               (pCat && selectedCategories.includes(pCat.name));
      });
    }

    // Filter by Brand
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand_id?.toLowerCase() || p.brand?.toLowerCase() || ''));
    }

    // Filter by Price
    result = result.filter(p => {
      const price = parseFloat(p.price || p.base_price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by Availability
    if (availability === 'in_stock') {
      result = result.filter(p => parseInt(p.stock || p.stock_quantity || '0') > 0);
    } else if (availability === 'out_of_stock') {
      result = result.filter(p => parseInt(p.stock || p.stock_quantity || '0') === 0);
    }

    // Sorting
    if (sortOption === 'Price: Low to High') {
      result.sort((a, b) => parseFloat(a.price || a.base_price || 0) - parseFloat(b.price || b.base_price || 0));
    } else if (sortOption === 'Price: High to Low') {
      result.sort((a, b) => parseFloat(b.price || b.base_price || 0) - parseFloat(a.price || a.base_price || 0));
    } else if (sortOption === 'Newest Arrivals') {
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [allProducts, selectedCategories, selectedBrands, priceRange, availability, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFilters = [
    ...selectedCategories.map(cId => {
       const cat = dbCategories.find(d => d.id === cId || d.slug === cId);
       return { id: cId, label: cat ? cat.name : cId, type: 'category' };
    }),
    ...selectedBrands.map(b => ({ id: b, label: b, type: 'brand' })),
    ...(availability !== 'all' ? [{ id: availability, label: availability.replace('_', ' '), type: 'availability' }] : [])
  ];

  const removeFilter = (filter: any) => {
    if (filter.type === 'category') setSelectedCategories(selectedCategories.filter(c => c !== filter.id));
    if (filter.type === 'brand') setSelectedBrands(selectedBrands.filter(b => b !== filter.id));
    if (filter.type === 'availability') setAvailability('all');
  };

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
          <FilterSidebar 
            allProducts={allProducts}
            dbCategories={dbCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availability={availability}
            setAvailability={setAvailability}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-100">
            <span className="text-sm text-gray-500 font-medium mb-3 md:mb-0">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
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
                <select 
                  className="text-sm border border-gray-200 rounded px-3 py-1.5 text-[#0b1042] font-semibold focus:outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
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
              <div key={idx} className="bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-sm capitalize">
                {filter.label}
                <button onClick={() => removeFilter(filter)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
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
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product, idx) => (
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
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                }
                return (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded flex items-center justify-center font-semibold text-sm ${currentPage === pageNum ? 'bg-[#0b1042] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 transition-colors'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-[#0b1042]">Show:</span>
              <select className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none">
                <option>12 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
