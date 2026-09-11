import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Tag, Loader2, Sparkles, TrendingUp, LayoutGrid } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileSearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      const stored = localStorage.getItem('able_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
      fetchInitialData();
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSearchResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const timer = setTimeout(() => {
        handleLiveSearch(query);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const fetchInitialData = async () => {
    if (categories.length === 0) {
      const { data: catData } = await supabase.from('categories').select('*').limit(6);
      if (catData) setCategories(catData);
    }
    if (suggestedProducts.length === 0) {
      const { data: prodData } = await supabase.from('products').select('*').limit(4);
      if (prodData) setSuggestedProducts(prodData);
    }
  };

  const handleLiveSearch = async (searchTerm: string) => {
    setIsSearching(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(6);
      
    if (data && !error) {
      setSearchResults(data);
    }
    setIsSearching(false);
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    
    // Save to recent
    const updatedRecents = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updatedRecents);
    localStorage.setItem('able_recent_searches', JSON.stringify(updatedRecents));
    
    onClose();
    navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
  };

  const handleProductClick = (id: string) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const handleCategoryClick = (id: string) => {
    onClose();
    navigate(`/shop?category=${id}`);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('able_recent_searches');
  };

  const removeRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('able_recent_searches', JSON.stringify(updated));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden"
        >
          {/* Header & Input */}
          <div className="pt-safe pb-4 px-4 bg-[#0b1042] text-white shadow-md relative z-10">
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder="Search machines, parts..."
                  className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-10 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-[15px]"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1">
                    <X size={16} />
                  </button>
                )}
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white font-medium text-[15px] shrink-0 p-2">
                Cancel
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 pb-24">
            
            {/* Live Search Results */}
            {query.trim().length > 1 ? (
              <div className="px-4 py-2">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Loader2 size={32} className="animate-spin mb-4 text-red-500" />
                    <p className="text-sm">Searching our catalog...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Results</h3>
                      <button onClick={() => handleSearch(query)} className="text-red-600 text-[13px] font-semibold flex items-center gap-1">
                        View All <ArrowRight size={14} />
                      </button>
                    </div>
                    {searchResults.map((product) => (
                      <div 
                        key={product.id} 
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform"
                      >
                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-100 p-1">
                          <img 
                            src={product.image_urls?.[0] || product.image_url || '/placeholder.png'} 
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-[15px] truncate">{product.name}</h4>
                          <p className="text-gray-500 text-[13px] line-clamp-1">{product.description || 'Industrial equipment'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Search size={40} className="mb-4 text-gray-300 opacity-50" />
                    <p className="text-base font-medium text-gray-600">No results found for "{query}"</p>
                    <p className="text-[13px] mt-1 text-center max-w-[250px]">Check spelling or try using more general terms.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-5 py-6 space-y-8 animate-in fade-in duration-300">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" /> Recent Searches
                      </h3>
                      <button onClick={clearRecent} className="text-gray-400 hover:text-red-500 text-[11px] font-bold uppercase tracking-wider">
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setQuery(term);
                            handleSearch(term);
                          }}
                          className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-[14px] text-gray-700 font-medium active:bg-gray-50 active:scale-95 transition-all shadow-sm"
                        >
                          {term}
                          <button onClick={(e) => removeRecent(e, term)} className="text-gray-400 ml-1 p-0.5 hover:text-gray-900">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Categories */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Tag size={14} className="text-gray-400" /> Top Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <div 
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center p-1.5 shrink-0">
                            {cat.icon_url ? (
                               <img src={cat.icon_url} alt="" className="w-full h-full object-contain mix-blend-multiply opacity-80" />
                            ) : (
                               <LayoutGrid size={18} className="text-blue-600" />
                            )}
                          </div>
                          <span className="font-semibold text-gray-800 text-[13px] leading-tight line-clamp-2">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Products */}
                {suggestedProducts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <TrendingUp size={14} className="text-red-500" /> Popular Products
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-5 px-5">
                      {suggestedProducts.map((prod) => (
                        <div 
                          key={prod.id}
                          onClick={() => handleProductClick(prod.id)}
                          className="w-[160px] shrink-0 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm active:scale-95 transition-all snap-start flex flex-col"
                        >
                          <div className="w-full h-32 bg-gray-50 rounded-xl mb-3 flex items-center justify-center p-2 border border-gray-100">
                            <img 
                              src={prod.image_urls?.[0] || prod.image_url || '/placeholder.png'} 
                              alt={prod.name}
                              className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
                            />
                          </div>
                          <h4 className="font-bold text-gray-900 text-[13px] line-clamp-2 leading-tight mb-1">{prod.name}</h4>
                          <div className="mt-auto pt-2 flex items-center justify-between">
                            <span className="text-red-600 font-bold text-[13px]">
                               {typeof prod.price === 'number' ? `Rs. ${prod.price.toLocaleString('en-US')}` : 'Ask for Quote'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </div>
            )}
          </div>
          
          {/* Quick Action Footer - If no query */}
          {!query && (
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe flex items-center justify-between z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                   <Sparkles size={20} className="text-red-600" />
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900 text-sm">Need Help Finding?</h4>
                   <p className="text-gray-500 text-[11px]">Our experts can assist you.</p>
                 </div>
               </div>
               <button onClick={() => { onClose(); navigate('/contact'); }} className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-[13px] font-bold active:scale-95 transition-transform">
                 Get Quote
               </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
