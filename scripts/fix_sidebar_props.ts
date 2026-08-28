import fs from 'fs';

let content = fs.readFileSync('src/components/shop/FilterSidebar.tsx', 'utf8');

const oldSignature = `export default function FilterSidebar({ filters, setFilters }: { filters: any, setFilters: any }) {`;

const newSignature = `export default function FilterSidebar({ 
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
}) {`;

content = content.replace(oldSignature, newSignature);
fs.writeFileSync('src/components/shop/FilterSidebar.tsx', content);
