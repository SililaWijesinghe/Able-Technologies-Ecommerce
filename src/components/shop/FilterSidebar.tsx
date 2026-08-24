import { Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function FilterSidebar({ filters, setFilters }: { filters: any, setFilters: any }) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [availabilityExpanded, setAvailabilityExpanded] = useState(true);
  const [typeExpanded, setTypeExpanded] = useState(true);

  const categories = [
    { id: 'all', label: 'All Categories', count: 245 },
    { id: 'local', label: 'Local Machines', count: 45 },
    { id: 'global', label: 'Global Machines', count: 38 },
    { id: 'spare', label: 'Spare Parts', count: 89 },
    { id: 'gauges', label: 'Gauges', count: 32 },
    { id: 'glue', label: 'Glue', count: 16 },
  ];

  const brands = [
    { id: 'festo', label: 'Festo', count: 28 },
    { id: 'smc', label: 'SMC', count: 31 },
    { id: 'mitsubishi', label: 'Mitsubishi', count: 24 },
    { id: 'omron', label: 'Omron', count: 18 },
    { id: 'airtac', label: 'AirTAC', count: 27 },
  ];

  const productTypes = [
    { id: 'pneumatic', label: 'Pneumatic', count: 42 },
    { id: 'hydraulic', label: 'Hydraulic', count: 28 },
    { id: 'mechanical', label: 'Mechanical', count: 36 },
    { id: 'electrical', label: 'Electrical', count: 15 },
  ];

  return (
    <div className="w-full bg-transparent">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-[#0b1042] flex items-center">
          <Filter size={18} className="mr-2" />
          Filter Products
        </h2>
        <button 
          onClick={() => setFilters({})}
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
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" 
                      checked={filters.category === cat.id || (cat.id === 'spare' && !filters.category)} // Mock pre-selected state for visual match if empty
                      onChange={() => setFilters({ ...filters, category: cat.id })}
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium">{cat.label}</span>
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
                <span>Rs. 0</span>
                <span>Rs. 500,000+</span>
              </div>
              <div className="relative h-1 bg-gray-200 rounded mb-4">
                <div className="absolute left-0 right-[30%] h-full bg-[#0b1042] rounded"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0b1042] rounded-full border-2 border-white shadow"></div>
                <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0b1042] rounded-full border-2 border-white shadow"></div>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <input type="text" placeholder="Rs. 0" className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#0b1042]" />
                <span className="text-gray-400">-</span>
                <input type="text" placeholder="Rs. 500,000+" className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#0b1042]" />
              </div>
              <button className="w-full bg-[#0b1042] hover:bg-[#a81414] text-white text-xs font-bold py-2 rounded transition-colors">
                Apply
              </button>
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
                {brands.map(brand => (
                  <label key={brand.id} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" 
                        checked={filters.brand === brand.id || (brand.id === 'smc' && !filters.brand)} // Mock pre-selected state
                        onChange={() => setFilters({ ...filters, brand: brand.id })}
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium">{brand.label}</span>
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
                    checked={filters.availability === status.id || (status.id === 'in_stock' && !filters.availability)}
                    onChange={() => setFilters({ ...filters, availability: status.id })}
                  />
                  <span className={`ml-3 text-sm transition-colors font-medium ${status.id === 'in_stock' && !filters.availability ? 'text-green-600 font-bold' : 'text-gray-700 group-hover:text-[#0b1042]'}`}>
                    {status.label}
                  </span>
                  {status.count !== null && <span className="ml-2 text-xs text-gray-400">({status.count})</span>}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Product Type */}
        <div className="border-t border-gray-200 pt-4">
          <button 
            onClick={() => setTypeExpanded(!typeExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#0b1042] uppercase tracking-wider mb-3"
          >
            PRODUCT TYPE
            {typeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {typeExpanded && (
            <div className="space-y-4">
              <div className="space-y-2">
                {productTypes.map(type => (
                  <label key={type.id} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" 
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium">{type.label}</span>
                    </div>
                    <span className="text-xs text-gray-400">({type.count})</span>
                  </label>
                ))}
              </div>
              <button className="w-full bg-white border border-[#0b1042] hover:bg-gray-50 text-[#0b1042] text-xs font-bold py-2 rounded transition-colors">
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
