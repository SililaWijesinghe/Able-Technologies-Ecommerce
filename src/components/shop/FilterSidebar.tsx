import { Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function FilterSidebar({ 
  allProducts = [],
  selectedCategories = [], 
  setSelectedCategories,
  selectedBrands = [], 
  setSelectedBrands,
  priceRange = [0, 500000], 
  setPriceRange,
  availability = 'all', 
  setAvailability
}: { 
  allProducts?: any[],
  selectedCategories?: string[],
  setSelectedCategories?: (c: string[]) => void,
  selectedBrands?: string[],
  setSelectedBrands?: (b: string[]) => void,
  priceRange?: [number, number],
  setPriceRange?: (p: [number, number]) => void,
  availability?: string,
  setAvailability?: (a: string) => void
}) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [availabilityExpanded, setAvailabilityExpanded] = useState(true);
  
  
  const categories = useMemo(() => {
    const cats: Record<string, number> = {};
    (allProducts || []).forEach(p => {
      const cat = (p.category_id || p.category || 'uncategorized').toLowerCase();
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return Object.entries(cats).map(([id, count]) => ({ id, label: id, count }));
  }, [allProducts]);

  const brands = useMemo(() => {
    const brs: Record<string, number> = {};
    (allProducts || []).forEach(p => {
      const brand = (p.brand_id || p.brand || 'local').toLowerCase();
      brs[brand] = (brs[brand] || 0) + 1;
    });
    return Object.entries(brs).map(([id, count]) => ({ id, label: id, count }));
  }, [allProducts]);

  const toggleCategory = (id: string) => {
    if (selectedCategories && selectedCategories.includes(id)) {
      if (setSelectedCategories) setSelectedCategories((selectedCategories || []).filter(c => c !== id));
    } else {
      if (setSelectedCategories) setSelectedCategories([...(selectedCategories || []), id]);
    }
  };

  const toggleBrand = (id: string) => {
    if (selectedBrands && selectedBrands.includes(id)) {
      if (setSelectedBrands) setSelectedBrands((selectedBrands || []).filter(b => b !== id));
    } else {
      if (setSelectedBrands) setSelectedBrands([...(selectedBrands || []), id]);
    }
  };


  

  

  return (
    <div className="w-full bg-transparent">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-[#0b1042] flex items-center">
          <Filter size={18} className="mr-2" />
          Filter Products
        </h2>
        <button 
          onClick={() => {
            if (setSelectedCategories) setSelectedCategories([]);
            if (setSelectedBrands) setSelectedBrands([]);
            if (setPriceRange) setPriceRange([0, 500000]);
            if (setAvailability) setAvailability('all');
          }}
          className="text-xs font-bold metallic-red-text hover:underline flex items-center"
        >
          <Filter size={12} className="mr-1" />
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-3"
          >
            CATEGORIES
            {categoriesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {categoriesExpanded && (
            <div className="space-y-2">
              {(categories || []).map(cat => (
                <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" 
                      checked={(selectedCategories || []).includes(cat.id)} // Mock pre-selected state for visual match if empty
                      onChange={() => toggleCategory(cat.id)}
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium capitalize">{cat.label.replace('_', ' ')}</span>
                  </div>
                  <span className="text-xs text-gray-400">({cat.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setPriceExpanded(!priceExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-4"
          >
            PRICE RANGE
            {priceExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
                    {priceExpanded && (
            <div>
              <div className="flex justify-between text-xs text-[#0b1042] font-semibold mb-2">
                <span>Rs. {priceRange[0]}</span>
                <span>Rs. {priceRange[1] === 500000 ? '500,000+' : priceRange[1]}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3 mt-4">
                <input 
                  type="number" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#0b1042]" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500000])}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#0b1042]" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setBrandsExpanded(!brandsExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-3"
          >
            BRANDS
            {brandsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {brandsExpanded && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search brands..." 
                  className="w-full text-xs border border-gray-200 rounded pl-8 pr-3 py-2 focus:outline-none focus:border-[#0b1042]"
                />
              </div>
              <div className="space-y-2">
                {(brands || []).map(brand => (
                  <label key={brand.id} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" 
                        checked={(selectedBrands || []).includes(brand.id)} // Mock pre-selected state
                        onChange={() => toggleBrand(brand.id)}
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium capitalize">{brand.label.replace('_', ' ')}</span>
                    </div>
                    <span className="text-xs text-gray-400">({brand.count})</span>
                  </label>
                ))}
              </div>
              <button className="text-xs font-bold text-[#0b1042] hover:underline flex items-center pt-1">
                + Show More
              </button>
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setAvailabilityExpanded(!availabilityExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-3"
          >
            AVAILABILITY
            {availabilityExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {availabilityExpanded && (
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All', count: null },
                { id: 'in_stock', label: 'In Stock', count: 198 },
                { id: 'out_of_stock', label: 'Out of Stock', count: 12 },
                { id: 'on_order', label: 'On Order', count: 35 },
              ].map(status => (
                <label key={status.id} className="flex items-center cursor-pointer group">
                  <input 
                    type="radio" 
                    name="availability"
                    className="w-4 h-4 border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" 
                    checked={availability === status.id}
                    onChange={() => setAvailability(status.id)}
                  />
                  <span className={`ml-3 text-sm transition-colors font-medium ${availability === status.id ? 'text-green-600 font-bold' : 'text-gray-700 group-hover:text-[#0b1042]'}`}>
                    {status.label}
                  </span>
                  {status.count !== null && <span className="ml-2 text-xs text-gray-400">({status.count})</span>}
                </label>
              ))}
            </div>
          )}
        </div>

        </div>
    </div>
  );
}
