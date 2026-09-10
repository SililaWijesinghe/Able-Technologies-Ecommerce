import React from "react";
import { Filter, Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { motion, AnimatePresence } from 'motion/react';

// Helper to determine product availability status
export const getProductAvailabilityStatus = (p: any): 'in_stock' | 'on_order' | 'out_of_stock' => {
  const status = String(p.availability_status || p.stock_status || '').toLowerCase().trim();
  const stock = parseInt(p.stock ?? p.stock_quantity ?? '0', 10);

  if (
    status === 'on_order' || 
    status === 'on-order' || 
    status === 'on order' || 
    status === 'pre_order' || 
    status === 'preorder' || 
    status === 'backorder' || 
    status === 'back_order' ||
    status === 'on_demand'
  ) {
    return 'on_order';
  }

  if (
    status === 'out_of_stock' || 
    status === 'outofstock' || 
    status === 'out of stock' ||
    status === 'sold_out' ||
    status === 'soldout'
  ) {
    return 'out_of_stock';
  }

  if (
    status === 'in_stock' || 
    status === 'instock' || 
    status === 'in stock'
  ) {
    return 'in_stock';
  }

  // Fallback to numeric stock if status is unspecified
  if (!isNaN(stock) && stock > 0) {
    return 'in_stock';
  }

  return 'out_of_stock';
};


const CategoryNode: React.FC<{ cat: any, isCategorySelected: (c: any) => boolean, toggleCategory: (c: any) => void }> = ({ cat, isCategorySelected, toggleCategory }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-1 group">
        <label className="flex items-center min-w-0 flex-1 cursor-pointer">
          <input 
            type="checkbox" 
            className="w-3.5 h-3.5 xl:w-4 xl:h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042] cursor-pointer" 
            checked={isCategorySelected(cat)}
            onChange={() => toggleCategory(cat)}
          />
          <span className="ml-2 xl:ml-3 text-[13px] xl:text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium capitalize truncate">
            {cat.label.replace(/_/g, ' ')}
          </span>
        </label>
        <div className="flex items-center">
          <span className="text-[10px] xl:text-xs text-gray-400 ml-1 mr-1 xl:mx-2 shrink-0">({cat.totalCount || cat.count})</span>
          {hasChildren ? (
            <button 
              onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <motion.div
                animate={{ rotate: expanded ? -180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} />
              </motion.div>
            </button>
          ) : (
            <div className="w-6" /> // spacer
          )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="ml-3 xl:ml-4 border-l border-gray-100 pl-2 xl:pl-3 mt-1 space-y-1 overflow-hidden"
          >
            {cat.children.map(child => (
              <CategoryNode key={child.id} cat={child} isCategorySelected={isCategorySelected} toggleCategory={toggleCategory} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FilterSidebar({ 
  allProducts = [],
  dbCategories = [],
  selectedCategories = [], 
  setSelectedCategories,
  selectedBrands = [], 
  setSelectedBrands,
  priceRange = [0, 500000], 
  setPriceRange,
  availability = 'all', 
  setAvailability,
  maxPrice: propMaxPrice
}: { 
  allProducts?: any[],
  dbCategories?: any[],
  selectedCategories?: string[],
  setSelectedCategories?: (c: string[]) => void,
  selectedBrands?: string[],
  setSelectedBrands?: (b: string[]) => void,
  priceRange?: [number, number],
  setPriceRange?: (p: [number, number]) => void,
  availability?: string,
  setAvailability?: (a: string) => void,
  maxPrice?: number
}) {
  const { settings } = useStoreSettings();
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [availabilityExpanded, setAvailabilityExpanded] = useState(true);
  
  // Brand search query state
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Dynamic maximum catalog price calculation
  const maxCatalogPrice = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return 500000;
    const highest = allProducts.reduce((max, p) => {
      const val = parseFloat(p.price || p.base_price || 0);
      return isNaN(val) ? max : Math.max(max, val);
    }, 0);
    return highest > 0 ? Math.ceil(highest) : 500000;
  }, [allProducts]);

  const effectiveMaxPrice = propMaxPrice || maxCatalogPrice;

  // Dynamic availability counts based on actual products loaded
  const availabilityCounts = useMemo(() => {
    const counts = {
      all: allProducts.length,
      in_stock: 0,
      on_order: 0,
      out_of_stock: 0
    };

    allProducts.forEach(p => {
      const status = getProductAvailabilityStatus(p);
      if (status === 'in_stock') counts.in_stock += 1;
      else if (status === 'on_order') counts.on_order += 1;
      else if (status === 'out_of_stock') counts.out_of_stock += 1;
    });

    return counts;
  }, [allProducts]);

  // 1. Categories calculation with interchangeable ID, Slug, and Name counts
  const categories = useMemo(() => {
    const allCats = (dbCategories || []).map(cat => {
      const catIdLower = String(cat.id || '').toLowerCase().trim();
      const catSlugLower = String(cat.slug || '').toLowerCase().trim();
      const catNameLower = String(cat.name || '').toLowerCase().trim();

      // Count matching products
      const count = (allProducts || []).filter(p => {
        const pCatId = String(p.category_id || '').toLowerCase().trim();
        const pCatName = String(p.category_name || '').toLowerCase().trim();
        const pCatSlug = String(p.category_slug || '').toLowerCase().trim();
        const pCatStr = typeof p.category === 'string' ? p.category.toLowerCase().trim() : '';
        const pCatObjId = typeof p.category === 'object' && p.category?.id ? String(p.category.id).toLowerCase().trim() : '';
        const pCatObjSlug = typeof p.category === 'object' && p.category?.slug ? String(p.category.slug).toLowerCase().trim() : '';
        const pCatObjName = typeof p.category === 'object' && p.category?.name ? String(p.category.name).toLowerCase().trim() : '';

        // Direct ID / Slug / Name match
        if (catIdLower && (pCatId === catIdLower || pCatObjId === catIdLower)) return true;
        if (catSlugLower && (pCatSlug === catSlugLower || pCatObjSlug === catSlugLower || pCatStr === catSlugLower)) return true;
        if (catNameLower && (pCatName === catNameLower || pCatObjName === catNameLower || pCatStr === catNameLower)) return true;
        
        // Also check if p.category_id maps to slug or name
        if (pCatId && (pCatId === catSlugLower || pCatId === catNameLower)) return true;

        return false;
      }).length;

      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        label: cat.name || cat.slug || cat.id,
        parent_id: cat.parent_id,
        children: [],
        level: 0,
        count
      };
    });

    const map = new Map();
    allCats.forEach(c => map.set(c.id, c));
    const roots = [];
    allCats.forEach(c => {
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id).children.push(c);
      } else {
        roots.push(c);
      }
    });

    // Helper to sum counts for parent categories and flatten
    const processNodes = (nodes, level = 0) => {
      nodes.forEach(node => {
        node.level = level;
        const childrenList = processNodes(node.children, level + 1);
        node.totalCount = node.count + (node.children || []).reduce((acc, child) => acc + (child.totalCount || 0), 0);
      });
      return nodes;
    };

    return processNodes(roots);
  }, [dbCategories, allProducts]);

  // Check if a category is selected (interchangeably checking id, slug, or name)
  const isCategorySelected = (cat: { id: string; name?: string; slug?: string }) => {
    if (!selectedCategories || selectedCategories.length === 0) return false;
    const idLower = String(cat.id || '').toLowerCase().trim();
    const slugLower = String(cat.slug || '').toLowerCase().trim();
    const nameLower = String(cat.name || '').toLowerCase().trim();

    return selectedCategories.some(sel => {
      const selLower = String(sel || '').toLowerCase().trim();
      if (!selLower) return false;
      return (
        (idLower && selLower === idLower) ||
        (slugLower && selLower === slugLower) ||
        (nameLower && (selLower === nameLower || selLower === nameLower.replace(/\s+/g, '-')))
      );
    });
  };

  const toggleCategory = (cat: { id: string; name?: string; slug?: string }) => {
    const isSelected = isCategorySelected(cat);
    const idLower = String(cat.id || '').toLowerCase().trim();
    const slugLower = String(cat.slug || '').toLowerCase().trim();
    const nameLower = String(cat.name || '').toLowerCase().trim();

    if (isSelected) {
      if (setSelectedCategories) {
        setSelectedCategories((selectedCategories || []).filter(c => {
          const cLower = String(c || '').toLowerCase().trim();
          const matchesThis = (
            (idLower && cLower === idLower) ||
            (slugLower && cLower === slugLower) ||
            (nameLower && (cLower === nameLower || cLower === nameLower.replace(/\s+/g, '-')))
          );
          return !matchesThis;
        }));
      }
    } else {
      if (setSelectedCategories) {
        setSelectedCategories([...(selectedCategories || []), cat.id]);
      }
    }
  };

  // 2. Brands calculation with robust 'local' grouping for empty/unspecified brands
  const brands = useMemo(() => {
    const brs: Record<string, { id: string; label: string; count: number }> = {};
    
    (allProducts || []).forEach(p => {
      let raw = '';
      if (typeof p.brand === 'object' && p.brand !== null) {
        raw = p.brand.name || p.brand.brand_name || p.brand.id || '';
      } else if (typeof p.brand === 'string') {
        raw = p.brand;
      } else if (p.brand_name) {
        raw = String(p.brand_name);
      } else if (p.brand_id) {
        raw = String(p.brand_id);
      }

      const trimmed = raw.trim();
      const lower = trimmed.toLowerCase();
      const isLocal = !trimmed || 
                      lower === 'local' || 
                      lower === 'generic' || 
                      lower === 'unbranded' || 
                      lower === 'local / generic' || 
                      lower === 'null' || 
                      lower === 'undefined';

      const brandKey = isLocal ? 'local' : lower;
      const brandLabel = isLocal ? 'Local' : (trimmed.charAt(0).toUpperCase() + trimmed.slice(1));

      if (!brs[brandKey]) {
        brs[brandKey] = {
          id: brandKey,
          label: brandLabel,
          count: 0
        };
      }
      brs[brandKey].count += 1;
    });

    return Object.values(brs).sort((a, b) => {
      if (a.id === 'local') return 1;
      if (b.id === 'local') return -1;
      return b.count - a.count;
    });
  }, [allProducts]);

  // Filter brands based on the controlled search query input
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands;
    const q = brandSearch.trim().toLowerCase();
    return brands.filter(b => b.label.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  }, [brands, brandSearch]);

  const visibleBrands = useMemo(() => {
    if (brandSearch.trim() || showAllBrands) {
      return filteredBrands;
    }
    return filteredBrands.slice(0, 8);
  }, [filteredBrands, brandSearch, showAllBrands]);

  // Check if a brand is selected
  const isBrandSelected = (brandId: string) => {
    const brandIdLower = brandId.toLowerCase().trim();
    return (selectedBrands || []).some(b => {
      const bLower = String(b || '').toLowerCase().trim();
      if (brandIdLower === 'local') {
        return bLower === 'local' || bLower === '' || bLower === 'generic' || bLower === 'unbranded' || bLower === 'local / generic';
      }
      return bLower === brandIdLower;
    });
  };

  const toggleBrand = (brandId: string) => {
    const brandIdLower = brandId.toLowerCase().trim();
    const isSelected = isBrandSelected(brandId);

    if (isSelected) {
      if (setSelectedBrands) {
        setSelectedBrands((selectedBrands || []).filter(b => {
          const bLower = String(b || '').toLowerCase().trim();
          if (brandIdLower === 'local') {
            return !(bLower === 'local' || bLower === '' || bLower === 'generic' || bLower === 'unbranded' || bLower === 'local / generic');
          }
          return bLower !== brandIdLower;
        }));
      }
    } else {
      if (setSelectedBrands) {
        setSelectedBrands([...(selectedBrands || []), brandId]);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-4 xl:p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex flex-row items-center justify-between mb-5 gap-2">
        <h2 className="text-base xl:text-lg font-black text-[#0b1042] flex items-center shrink-0">
          <Filter size={16} className="mr-2 shrink-0 text-[#0b1042]" />
          <span className="truncate">Filter Products</span>
        </h2>
        <button 
          onClick={() => {
            if (setSelectedCategories) setSelectedCategories([]);
            if (setSelectedBrands) setSelectedBrands([]);
            if (setPriceRange) setPriceRange([0, effectiveMaxPrice]);
            if (setAvailability) setAvailability('all');
            setBrandSearch('');
          }}
          className="text-[11px] xl:text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer shrink-0 whitespace-nowrap"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="w-full flex items-center justify-between text-[11px] xl:text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-3 cursor-pointer group"
          >
            CATEGORIES
            <motion.div animate={{ rotate: categoriesExpanded ? -180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 group-hover:text-gray-700">
              <ChevronDown size={16} />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {categoriesExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-2 overflow-hidden"
              >
                {(categories || []).map(cat => (
                  <CategoryNode key={cat.id} cat={cat} isCategorySelected={isCategorySelected} toggleCategory={toggleCategory} />
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-gray-400 italic py-1">No categories available</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
        {settings.show_prices && (
          <div className="border-t border-gray-200 pt-4">
            <button 
              onClick={() => setPriceExpanded(!priceExpanded)}
              className="w-full flex items-center justify-between text-[11px] xl:text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-4 cursor-pointer group"
            >
              PRICE RANGE
              <motion.div animate={{ rotate: priceExpanded ? -180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 group-hover:text-gray-700">
                <ChevronDown size={16} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {priceExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-between text-[11px] xl:text-xs text-[#0b1042] font-semibold mb-2 mt-1">
                    <span>Rs. {priceRange[0].toLocaleString()}</span>
                    <span>Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                  
                  {/* Dynamic Price Slider */}
                  <div className="mb-4">
                    <input 
                      type="range"
                      min={0}
                      max={effectiveMaxPrice}
                      step={Math.max(10, Math.round(effectiveMaxPrice / 100))}
                      value={Math.min(priceRange[1], effectiveMaxPrice)}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        if (setPriceRange) {
                          setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
                        }
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b1042]"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="relative w-full">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">Rs.</span>
                      <input 
                        type="number" 
                        min={0}
                        max={effectiveMaxPrice}
                        value={priceRange[0]} 
                        onChange={(e) => setPriceRange && setPriceRange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                        className="w-full text-xs border border-gray-200 rounded pl-7 pr-2 py-1.5 focus:outline-none focus:border-[#0b1042]" 
                        placeholder="Min"
                      />
                    </div>
                    <span className="text-gray-400 font-bold">-</span>
                    <div className="relative w-full">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">Rs.</span>
                      <input 
                        type="number" 
                        min={0}
                        max={effectiveMaxPrice}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange && setPriceRange([priceRange[0], Math.max(0, parseInt(e.target.value) || 0)])}
                        className="w-full text-xs border border-gray-200 rounded pl-7 pr-2 py-1.5 focus:outline-none focus:border-[#0b1042]" 
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Brands with Dynamic Search */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setBrandsExpanded(!brandsExpanded)}
            className="w-full flex items-center justify-between text-[11px] xl:text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-3 cursor-pointer group"
          >
            BRANDS
            <motion.div animate={{ rotate: brandsExpanded ? -180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 group-hover:text-gray-700">
              <ChevronDown size={16} />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {brandsExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-3 overflow-hidden"
              >
                {/* Dynamic Brand Search Input */}
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input 
                    type="text" 
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brands..." 
                    className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-7 py-2 focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042]/20 transition-all"
                  />
                  {brandSearch && (
                    <button 
                      onClick={() => setBrandSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                      title="Clear brand search"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Checkboxes List */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {visibleBrands.length > 0 ? (
                    visibleBrands.map(brand => (
                      <label key={brand.id} className="flex items-center justify-between cursor-pointer group py-0.5">
                        <div className="flex items-center min-w-0">
                          <input 
                            type="checkbox" 
                            className="w-3.5 h-3.5 xl:w-4 xl:h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042] cursor-pointer" 
                            checked={isBrandSelected(brand.id)}
                            onChange={() => toggleBrand(brand.id)}
                          />
                          <span className="ml-2 xl:ml-3 text-[13px] xl:text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium truncate">
                            {brand.label.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] xl:text-xs text-gray-400 ml-1 xl:ml-2 shrink-0">({brand.count})</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic py-2 text-center">
                      No brands matching "{brandSearch}"
                    </p>
                  )}
                </div>

                {!brandSearch && filteredBrands.length > 8 && (
                  <button 
                    onClick={() => setShowAllBrands(!showAllBrands)}
                    className="text-xs font-bold text-[#0b1042] hover:underline flex items-center pt-1 cursor-pointer"
                  >
                    {showAllBrands ? '- Show Less' : `+ Show More (${filteredBrands.length - 8} more)`}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Availability with Dynamic Counts & On Order Support */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setAvailabilityExpanded(!availabilityExpanded)}
            className="w-full flex items-center justify-between text-[11px] xl:text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-3 cursor-pointer group"
          >
            AVAILABILITY
            <motion.div animate={{ rotate: availabilityExpanded ? -180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-400 group-hover:text-gray-700">
              <ChevronDown size={16} />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {availabilityExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-2 overflow-hidden"
              >
                {[
                  { id: 'all', label: 'All Items', count: availabilityCounts.all },
                  { id: 'in_stock', label: 'In Stock', count: availabilityCounts.in_stock },
                  { id: 'on_order', label: 'On Order', count: availabilityCounts.on_order },
                  { id: 'out_of_stock', label: 'Out of Stock', count: availabilityCounts.out_of_stock }
                ].map(status => (
                  <label key={status.id} className="flex items-center justify-between cursor-pointer group py-0.5">
                    <div className="flex items-center min-w-0">
                      <input 
                        type="radio" 
                        name="availability"
                        className="w-3.5 h-3.5 xl:w-4 xl:h-4 border-gray-300 text-[#0b1042] focus:ring-[#0b1042] cursor-pointer" 
                        checked={availability === status.id}
                        onChange={() => setAvailability && setAvailability(status.id)}
                      />
                      <span className={`ml-2 xl:ml-3 text-[13px] xl:text-sm transition-colors font-medium truncate ${availability === status.id ? 'text-[#0b1042] font-bold' : 'text-gray-700 group-hover:text-[#0b1042]'}`}>
                        {status.label}
                      </span>
                    </div>
                    <span className="text-[10px] xl:text-xs text-gray-400 ml-1 xl:ml-2 shrink-0">({status.count})</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
