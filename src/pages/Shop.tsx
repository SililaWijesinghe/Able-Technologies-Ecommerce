import { useState, useEffect, useMemo } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Grid, 
  List, 
  X, 
  ChevronLeft, 
  Filter,
  Search,
  RotateCcw,
  PackageX,
  Sparkles,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import FilterSidebar, { getProductAvailabilityStatus } from '../components/shop/FilterSidebar';
import ProductCard from '../components/shop/ProductCard';
import TrustBar from '../components/TrustBar';
import heroBg from '../assets/heroBg.webp';
import { useStoreSettings } from '../context/StoreSettingsContext';

// Helper to determine if a brand represents local / unbranded equipment
const isLocalBrand = (brandValue: any): boolean => {
  let raw = '';
  if (typeof brandValue === 'object' && brandValue !== null) {
    raw = brandValue.name || brandValue.brand_name || brandValue.id || '';
  } else if (typeof brandValue === 'string') {
    raw = brandValue;
  }
  const trimmed = String(raw || '').trim().toLowerCase();
  return (
    !trimmed || 
    trimmed === 'local' || 
    trimmed === 'generic' || 
    trimmed === 'unbranded' || 
    trimmed === 'local / generic' || 
    trimmed === 'null' || 
    trimmed === 'undefined'
  );
};

export default function Shop() {
  const { settings } = useStoreSettings();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic maximum catalog price calculation
  const maxCatalogPrice = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return 500000;
    const highest = allProducts.reduce((max, p) => {
      const val = parseFloat(p.price || p.base_price || 0);
      return isNaN(val) ? max : Math.max(max, val);
    }, 0);
    return highest > 0 ? Math.ceil(highest) : 500000;
  }, [allProducts]);

  // URL Parameter and Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [hasInitializedPrice, setHasInitializedPrice] = useState(false);
  const [availability, setAvailability] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('Newest Arrivals');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const itemsPerPage = 12;

  // 1. Fetch ALL products and categories once on mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([productsData, categoriesData]) => {
        setAllProducts(productsData || []);
        setDbCategories(categoriesData || []);
      })
      .catch((err) => {
        console.error('Failed to load shop catalog:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Sync initial dynamic max price once products arrive
  useEffect(() => {
    if (allProducts.length > 0 && !hasInitializedPrice) {
      setPriceRange([0, maxCatalogPrice]);
      setHasInitializedPrice(true);
    }
  }, [allProducts, maxCatalogPrice, hasInitializedPrice]);

  // 2. Listen to URL Search parameters changes (?search=... & ?category=... & ?brand=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || params.get('q') || '';
    const categoryParam = params.get('category');
    const brandParam = params.get('brand');

    setSearchQuery(searchParam);

    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }

    if (brandParam) {
      setSelectedBrands([brandParam]);
    } else {
      setSelectedBrands([]);
    }
  }, [location.search]);

  // 3. Filter & Sort Logic with comprehensive Category, Brand, Search and Price matching
  useEffect(() => {
    let result = [...allProducts];

    // A. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(p => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || p.short_description || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const brand = (p.brand || p.brand_id || (typeof p.brand === 'object' ? p.brand?.name : '') || '').toLowerCase();
        const catName = (typeof p.category === 'object' ? p.category?.name : (p.category || p.category_name || '')).toLowerCase();
        return name.includes(query) || desc.includes(query) || sku.includes(query) || brand.includes(query) || catName.includes(query);
      });
    }

    // B. Filter by Category (Interchangeably checking Category ID, Slug, and Name)
    if (selectedCategories.length > 0) {
      result = result.filter(p => {
        return selectedCategories.some(selectedCat => {
          const selectedLower = String(selectedCat || '').toLowerCase().trim();
          if (!selectedLower) return true;

          // Find all matching categories in dbCategories by ID, Slug, or Name
          const matchedDbCats = dbCategories.filter(c => 
            String(c.id || '').toLowerCase().trim() === selectedLower ||
            String(c.slug || '').toLowerCase().trim() === selectedLower ||
            String(c.name || '').toLowerCase().trim() === selectedLower ||
            String(c.name || '').toLowerCase().trim().replace(/\s+/g, '-') === selectedLower
          );

          // Build a set of all valid category identifiers (UUIDs, slugs, names)
          const targetCategoryKeys = new Set<string>();
          targetCategoryKeys.add(selectedLower);
          targetCategoryKeys.add(selectedLower.replace(/-/g, ' '));
          matchedDbCats.forEach(c => {
            if (c.id) targetCategoryKeys.add(String(c.id).toLowerCase().trim());
            if (c.slug) targetCategoryKeys.add(String(c.slug).toLowerCase().trim());
            if (c.name) {
              targetCategoryKeys.add(String(c.name).toLowerCase().trim());
              targetCategoryKeys.add(String(c.name).toLowerCase().trim().replace(/\s+/g, '-'));
            }
          });

          // Product's category properties
          const pCatId = String(p.category_id || '').toLowerCase().trim();
          const pCatName = String(p.category_name || '').toLowerCase().trim();
          const pCatSlug = String(p.category_slug || '').toLowerCase().trim();
          const pCatStr = typeof p.category === 'string' ? p.category.toLowerCase().trim() : '';
          const pCatObjId = typeof p.category === 'object' && p.category?.id ? String(p.category.id).toLowerCase().trim() : '';
          const pCatObjSlug = typeof p.category === 'object' && p.category?.slug ? String(p.category.slug).toLowerCase().trim() : '';
          const pCatObjName = typeof p.category === 'object' && p.category?.name ? String(p.category.name).toLowerCase().trim() : '';

          // Look up product's category_id in dbCategories to also resolve product's slug & name
          let pLinkedCatSlug = '';
          let pLinkedCatName = '';
          if (pCatId) {
            const pDbCat = dbCategories.find(c => String(c.id).toLowerCase().trim() === pCatId);
            if (pDbCat) {
              pLinkedCatSlug = String(pDbCat.slug || '').toLowerCase().trim();
              pLinkedCatName = String(pDbCat.name || '').toLowerCase().trim();
            }
          }

          // Evaluate match across all target keys
          for (const target of targetCategoryKeys) {
            if (!target) continue;
            if (pCatId && pCatId === target) return true;
            if (pCatSlug && (pCatSlug === target || pCatSlug.replace(/-/g, ' ') === target)) return true;
            if (pCatName && (pCatName === target || pCatName.replace(/-/g, ' ') === target || pCatName.includes(target) || target.includes(pCatName))) return true;
            if (pCatStr && (pCatStr === target || pCatStr.replace(/-/g, ' ') === target || pCatStr.includes(target) || target.includes(pCatStr))) return true;
            if (pCatObjId && pCatObjId === target) return true;
            if (pCatObjSlug && (pCatObjSlug === target || pCatObjSlug.replace(/-/g, ' ') === target)) return true;
            if (pCatObjName && (pCatObjName === target || pCatObjName.replace(/-/g, ' ') === target || pCatObjName.includes(target) || target.includes(pCatObjName))) return true;
            if (pLinkedCatSlug && (pLinkedCatSlug === target || pLinkedCatSlug.replace(/-/g, ' ') === target)) return true;
            if (pLinkedCatName && (pLinkedCatName === target || pLinkedCatName.replace(/-/g, ' ') === target || pLinkedCatName.includes(target) || target.includes(pLinkedCatName))) return true;
          }

          return false;
        });
      });
    }

    // C. Filter by Brand (Accurately supporting 'local' and named brands)
    if (selectedBrands.length > 0) {
      result = result.filter(p => {
        let rawBrand = '';
        if (typeof p.brand === 'object' && p.brand !== null) {
          rawBrand = p.brand.name || p.brand.brand_name || p.brand.id || '';
        } else if (typeof p.brand === 'string') {
          rawBrand = p.brand;
        } else if (p.brand_name) {
          rawBrand = String(p.brand_name);
        } else if (p.brand_id) {
          rawBrand = String(p.brand_id);
        }

        const productIsLocal = isLocalBrand(rawBrand);
        const trimmedBrand = String(rawBrand || '').trim().toLowerCase();

        return selectedBrands.some(selectedB => {
          const selectedBLower = String(selectedB || '').trim().toLowerCase();
          if (!selectedBLower) return false;

          const filterIsLocal = (
            selectedBLower === 'local' || 
            selectedBLower === 'generic' || 
            selectedBLower === 'unbranded' || 
            selectedBLower === 'local / generic' ||
            selectedBLower === ''
          );

          if (filterIsLocal) {
            return productIsLocal;
          }

          if (productIsLocal) {
            return false;
          }

          return (
            trimmedBrand === selectedBLower ||
            trimmedBrand.replace(/\s+/g, '-') === selectedBLower ||
            selectedBLower.replace(/\s+/g, '-') === trimmedBrand ||
            trimmedBrand.includes(selectedBLower)
          );
        });
      });
    }

    // D. Filter by Price Range
    result = result.filter(p => {
      const price = parseFloat(p.price || p.base_price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // E. Filter by Availability (checking availability_status column and stock)
    if (availability !== 'all') {
      result = result.filter(p => {
        const status = getProductAvailabilityStatus(p);
        return status === availability;
      });
    }

    // F. Sorting Logic
    if (sortOption === 'Price: Low to High') {
      result.sort((a, b) => parseFloat(a.price || a.base_price || 0) - parseFloat(b.price || b.base_price || 0));
    } else if (sortOption === 'Price: High to Low') {
      result.sort((a, b) => parseFloat(b.price || b.base_price || 0) - parseFloat(a.price || a.base_price || 0));
    } else if (sortOption === 'Newest Arrivals') {
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (sortOption === 'Popularity') {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [allProducts, dbCategories, searchQuery, selectedCategories, selectedBrands, priceRange, availability, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Active filter representations for chips
  const activeFilters = [
    ...(searchQuery ? [{ id: 'search', label: `Search: "${searchQuery}"`, type: 'search' }] : []),
    ...selectedCategories.map(cId => {
       const cLower = String(cId || '').toLowerCase().trim();
       const cat = dbCategories.find(d => 
         String(d.id || '').toLowerCase().trim() === cLower || 
         String(d.slug || '').toLowerCase().trim() === cLower || 
         String(d.name || '').toLowerCase().trim() === cLower
       );
       return { id: cId, label: cat ? cat.name : (cId.charAt(0).toUpperCase() + cId.slice(1).replace(/-/g, ' ')), type: 'category' };
    }),
    ...selectedBrands.map(b => {
       const bLower = String(b || '').toLowerCase().trim();
       const isLocal = bLower === 'local' || bLower === 'generic' || bLower === 'unbranded' || bLower === 'local / generic' || !bLower;
       return { 
         id: b, 
         label: isLocal ? 'Brand: Local' : `Brand: ${b.charAt(0).toUpperCase() + b.slice(1)}`, 
         type: 'brand' 
       };
    }),
    ...(settings.show_prices && (priceRange[0] > 0 || priceRange[1] < maxCatalogPrice) ? [{ 
      id: 'price', 
      label: `Rs. ${priceRange[0].toLocaleString()} – Rs. ${priceRange[1].toLocaleString()}`, 
      type: 'price' 
    }] : []),
    ...(availability !== 'all' ? [{ 
      id: availability, 
      label: availability === 'in_stock' ? 'In Stock' : availability === 'on_order' ? 'On Order' : 'Out of Stock', 
      type: 'availability' 
    }] : [])
  ];

  // Remove individual filter chip
  const removeFilter = (filter: { id: string; label: string; type: string }) => {
    if (filter.type === 'search') {
      setSearchQuery('');
      const params = new URLSearchParams(location.search);
      params.delete('search');
      params.delete('q');
      navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
    } else if (filter.type === 'category') {
      const filterIdLower = String(filter.id || '').toLowerCase().trim();
      const matchedCat = dbCategories.find(d => 
        String(d.id || '').toLowerCase().trim() === filterIdLower || 
        String(d.slug || '').toLowerCase().trim() === filterIdLower || 
        String(d.name || '').toLowerCase().trim() === filterIdLower
      );
      const keysToRemove = new Set<string>();
      keysToRemove.add(filterIdLower);
      if (matchedCat) {
        if (matchedCat.id) keysToRemove.add(String(matchedCat.id).toLowerCase().trim());
        if (matchedCat.slug) keysToRemove.add(String(matchedCat.slug).toLowerCase().trim());
        if (matchedCat.name) keysToRemove.add(String(matchedCat.name).toLowerCase().trim());
      }

      const updated = selectedCategories.filter(c => !keysToRemove.has(String(c || '').toLowerCase().trim()));
      setSelectedCategories(updated);
      const params = new URLSearchParams(location.search);
      params.delete('category');
      navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
    } else if (filter.type === 'brand') {
      const filterIdLower = String(filter.id || '').toLowerCase().trim();
      const isLocalFilter = filterIdLower === 'local' || filterIdLower === 'generic' || filterIdLower === 'unbranded' || filterIdLower === 'local / generic';
      
      const updated = selectedBrands.filter(b => {
        const bLower = String(b || '').toLowerCase().trim();
        if (isLocalFilter) {
          return !(bLower === 'local' || bLower === '' || bLower === 'generic' || bLower === 'unbranded' || bLower === 'local / generic');
        }
        return bLower !== filterIdLower;
      });
      setSelectedBrands(updated);
      const params = new URLSearchParams(location.search);
      params.delete('brand');
      navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
    } else if (filter.type === 'price') {
      setPriceRange([0, maxCatalogPrice]);
    } else if (filter.type === 'availability') {
      setAvailability('all');
      const params = new URLSearchParams(location.search);
      params.delete('availability');
      navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
    }
  };

  // Clear ALL filters and reset URL
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxCatalogPrice]);
    setAvailability('all');
    setSearchQuery('');
    navigate('/shop', { replace: true });
  };

  // Quick category suggestion click handler
  const handleSelectQuickCategory = (catIdentifier: string) => {
    setSelectedCategories([catIdentifier]);
    setSearchQuery('');
    navigate(`/shop?category=${encodeURIComponent(catIdentifier)}`);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      
      {/* ========================================================
          1. HERO BANNER
          ======================================================== */}
      <section 
        className="relative w-full h-[260px] md:h-[290px] bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center pt-16 md:pt-0"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#03071e] via-[#08123b]/90 to-transparent z-0" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 w-full pt-4">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase mb-2 drop-shadow-md"
          >
            Industrial Equipment & Store
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-sm md:text-base max-w-2xl mb-5"
          >
            {searchQuery 
              ? `Showing real-time results for "${searchQuery}"`
              : 'Browse our complete catalog of industrial machinery, precision pneumatic automation, cylinders, tools & genuine replacement parts.'
            }
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center text-xs font-semibold text-slate-400 space-x-2"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="text-white hover:underline">Shop</Link>
            {searchQuery && (
              <>
                <ChevronRight size={14} />
                <span className="text-blue-400 font-bold truncate max-w-xs">"{searchQuery}"</span>
              </>
            )}
            {selectedCategories.length > 0 && !searchQuery && (
              <>
                <ChevronRight size={14} />
                <span className="text-blue-400 font-bold capitalize">
                  {(() => {
                    const cLower = selectedCategories[0].toLowerCase();
                    const cat = dbCategories.find(c => c.id?.toLowerCase() === cLower || c.slug?.toLowerCase() === cLower || c.name?.toLowerCase() === cLower);
                    return cat ? cat.name : selectedCategories[0];
                  })()}
                </span>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <div className="-mt-7 relative z-30 mb-8">
        <TrustBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8">
        
        {/* ========================================================
            2. DESKTOP & MOBILE FILTER SIDEBAR
            ======================================================== */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-24">
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
              maxPrice={maxCatalogPrice}
            />
          </div>
        </aside>

        {/* Mobile Filter Drawer Overlay */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFilterOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="relative w-full max-w-xs bg-white h-full overflow-y-auto p-6 shadow-2xl z-10 flex flex-col"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="font-black text-lg text-[#0b1042] flex items-center gap-2">
                    <Filter size={18} /> Filters
                  </h3>
                  <button 
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1">
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
                    maxPrice={maxCatalogPrice}
                  />
                </div>
                <div className="pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#0b1042] text-white rounded-xl font-bold text-sm shadow-md cursor-pointer"
                  >
                    View Results ({filteredProducts.length})
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================================
            3. MAIN SHOPPING CONTENT
            ======================================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Controls Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              {/* Mobile Filter Trigger */}
              <button 
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#0b1042] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Filters {activeFilters.length > 0 && `(${activeFilters.length})`}</span>
              </button>

              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                {isLoading ? (
                  'Loading catalog...'
                ) : (
                  <>
                    Showing <strong className="text-slate-800">{filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</strong> of <strong className="text-slate-800">{filteredProducts.length}</strong> products
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button 
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#0b1042] shadow-sm font-bold' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <Grid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#0b1042] shadow-sm font-bold' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-xs font-semibold text-slate-500">Sort by:</span>
                <select 
                  className="text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2 text-[#0b1042] font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips with Clear All */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 bg-blue-50/60 border border-blue-100 rounded-2xl p-3">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1 mr-1">
                <Filter size={13} className="text-blue-600" /> Active Filters:
              </span>

              {activeFilters.map((filter) => (
                <div 
                  key={filter.id} 
                  className="bg-white border border-blue-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-xs group"
                >
                  <span>{filter.label}</span>
                  <button 
                    onClick={() => removeFilter(filter)} 
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50 cursor-pointer"
                    title={`Remove ${filter.label}`}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline ml-auto flex items-center gap-1 px-2 py-1 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Clear All Filters</span>
              </button>
            </div>
          )}

          {/* ========================================================
              4. PRODUCT GRID & USER-FRIENDLY EMPTY STATE
              ======================================================== */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 space-y-4">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0b1042] rounded-full animate-spin shadow-md" />
              <p className="text-sm font-semibold text-slate-500 animate-pulse">
                Fetching industrial equipment...
              </p>
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 mb-10"
                : "flex flex-col gap-4 mb-10"
            }>
              {displayedProducts.map((product, idx) => (
                <ProductCard key={product.id || idx} product={product} />
              ))}
            </div>
          ) : (
            /* ========================================================
                5. WARM, USER-FRIENDLY EMPTY STATE
                ======================================================== */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 md:p-16 my-4 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Warm Industrial Search Illustration */}
              <div className="relative mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-red-50 border border-slate-200/80 flex items-center justify-center shadow-inner relative">
                  <Search size={44} className="text-[#0b1042] stroke-[1.8]" />
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                    <PackageX size={18} />
                  </div>
                </div>
                {/* Floating ambient accents */}
                <span className="absolute -bottom-1 -left-2 text-blue-500 animate-bounce">
                  <Sparkles size={16} />
                </span>
              </div>

              {/* Friendly Message */}
              <h3 className="text-2xl sm:text-3xl font-black text-[#0b1042] tracking-tight mb-3">
                Oops! We couldn't find exactly what you're looking for.
              </h3>
              
              <p className="text-slate-600 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
                {searchQuery ? (
                  <>No products match your search for <strong className="text-[#0b1042]">"{searchQuery}"</strong>. Try checking your spelling or clearing a few filters to see more results!</>
                ) : (
                  <>Try clearing a few filters or broadening your price and brand criteria to explore our complete industrial equipment lineup.</>
                )}
              </p>

              {/* Primary Clear Filters Action */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
                <button
                  onClick={clearAllFilters}
                  className="w-full sm:w-auto metallic-red-bg hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/20 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>Clear All Filters</span>
                </button>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-[#0b1042] font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Request Custom Quote</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Popular Category Quick Shortcuts */}
              <div className="w-full max-w-xl pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Or browse popular machinery categories:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'Pneumatics',
                    'Automation',
                    'Machinery',
                    'Spare Parts',
                    'Power Tools',
                    'Hydraulics'
                  ].map((catName) => {
                    // Match with database category slug or name if available
                    const dbCat = dbCategories.find(c => c.name.toLowerCase() === catName.toLowerCase() || c.slug?.toLowerCase() === catName.toLowerCase());
                    const targetParam = dbCat ? (dbCat.slug || dbCat.name) : catName;
                    return (
                      <button
                        key={catName}
                        onClick={() => handleSelectQuickCategory(targetParam)}
                        className="text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        {catName}
                      </button>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* ========================================================
              6. PAGINATION CONTROLS
              ======================================================== */}
          {filteredProducts.length > itemsPerPage && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
              <div className="flex items-center space-x-1.5">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Show current, first, last, and window
                  if (
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                          currentPage === pageNum 
                            ? 'bg-[#0b1042] text-white shadow-md' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    (pageNum === 2 && currentPage > 3) ||
                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNum} className="px-1 text-slate-400">…</span>;
                  }
                  return null;
                })}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  aria-label="Next Page"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              
              <div className="text-xs font-semibold text-slate-500">
                Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
