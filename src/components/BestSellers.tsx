import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from './shop/ProductCard';

export default function BestSellers() {
  const fallbackProducts = [
    { id: '1', name: 'Pneumatic Pad Printing Machine', oldPrice: 'Rs. 570,000.00', newPrice: 'Rs. 485,000.00', discount: '-15%' },
    { id: '2', name: 'Industrial Robotic Arm 6 Axis', oldPrice: 'Rs. 2,050,000.00', newPrice: 'Rs. 1,850,000.00', discount: '-10%' },
    { id: '3', name: 'Air Cylinder ISO 15552', oldPrice: 'Rs. 14,200.00', newPrice: 'Rs. 12,500.00', discount: '-12%' },
    { id: '4', name: 'Pneumatic Fittings Set', oldPrice: 'Rs. 1,360.00', newPrice: 'Rs. 1,250.00', discount: '-8%' },
  ];

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch 4 live products, if empty use fallback
    fetchProducts().then(data => {
      if (data && data.length > 0) {
        setProducts(data.slice(0, 4));
      } else {
        setProducts(fallbackProducts);
      }
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-24 overflow-hidden">
      <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-gray-100 pb-3 md:pb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1 md:mb-2">
            <span className="metallic-red-text text-[10px] font-bold uppercase tracking-wider">Featured Products</span>
            <div className="w-8 md:w-12 h-px metallic-red-bg border-none shadow-none"></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#0b1042] tracking-tight">Best Sellers</h2>
        </div>
        <Link to="/shop" className="metallic-red-text text-xs md:text-sm font-semibold flex items-center hover:underline group">
          View All <ArrowRight size={14} color="url(#metal-red)" className="ml-1 transition-transform group-hover:translate-x-1 md:w-4 md:h-4" />
        </Link>
      </div>

      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {products.map((product, idx) => (
          <div 
            key={idx}
            className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start shrink-0 h-full"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
