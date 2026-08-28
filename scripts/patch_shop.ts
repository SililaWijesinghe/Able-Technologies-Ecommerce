import fs from 'fs';

let content = fs.readFileSync('src/pages/Shop.tsx', 'utf8');

// Replace the imports to include useLocation
content = content.replace(
  "import { fetchProducts } from '../services/api';",
  "import { fetchProducts } from '../services/api';\nimport { useLocation } from 'react-router-dom';"
);

// Replace state block
const newStateBlock = `  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [availability, setAvailability] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('Newest Arrivals');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 1. Fetch ALL products once
  useEffect(() => {
    setIsLoading(true);
    fetchProducts().then(data => {
      setAllProducts(data || []);
      setIsLoading(false);
    });
  }, []);

  // 2. Filter & Sort Logic
  useEffect(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category_id?.toLowerCase() || p.category?.toLowerCase() || ''));
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
    ...selectedCategories.map(c => ({ label: c, type: 'category' })),
    ...selectedBrands.map(b => ({ label: b, type: 'brand' })),
    ...(availability !== 'all' ? [{ label: availability.replace('_', ' '), type: 'availability' }] : [])
  ];

  const removeFilter = (filter: any) => {
    if (filter.type === 'category') setSelectedCategories(selectedCategories.filter(c => c !== filter.label));
    if (filter.type === 'brand') setSelectedBrands(selectedBrands.filter(b => b !== filter.label));
    if (filter.type === 'availability') setAvailability('all');
  };`;

content = content.replace(
  /const \[products, setProducts\].*?  ];/s,
  newStateBlock
);

// Update sidebar props
content = content.replace(
  "<FilterSidebar filters={filters} setFilters={setFilters} />",
  `<FilterSidebar 
            allProducts={allProducts}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availability={availability}
            setAvailability={setAvailability}
          />`
);

// Update sorting select
content = content.replace(
  /<select className="text-sm border border-gray-200[^"]*"[^>]*>.*?<\/select>/s,
  `<select 
                  className="text-sm border border-gray-200 rounded px-3 py-1.5 text-[#0b1042] font-semibold focus:outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>`
);

// Update active filters
content = content.replace(
  /\{activeFilters\.map\(\(filter, idx\) => \(.*?<\/div>\s*\)\)\}/s,
  `{activeFilters.map((filter, idx) => (
              <div key={idx} className="bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center shadow-sm capitalize">
                {filter.label}
                <button onClick={() => removeFilter(filter)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}`
);

// Update Showing results
content = content.replace(
  "Showing 1–12 of 245 results",
  `Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results`
);

// Update products.length to displayedProducts
content = content.replace(
  /products\.length > 0 \? \(\s*products\.map/g,
  `displayedProducts.length > 0 ? (
                displayedProducts.map`
);

// Update pagination
const paginationBlock = `<div className="flex flex-col md:flex-row items-center justify-between mt-auto border-t border-gray-200 pt-6">
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
                    className={\`w-8 h-8 rounded flex items-center justify-center font-semibold text-sm \${currentPage === pageNum ? 'bg-[#0b1042] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 transition-colors'}\`}
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
          </div>`;

content = content.replace(
  /<div className="flex flex-col md:flex-row items-center justify-between mt-auto border-t border-gray-200 pt-6">.*<\/div>\s*<\/div>\s*<\/div>/s,
  paginationBlock + "\n        </div>\n      </div>"
);

fs.writeFileSync('src/pages/Shop.tsx', content);
