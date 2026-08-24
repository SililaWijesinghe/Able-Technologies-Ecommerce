import { useState, useEffect } from 'react';
import { fetchProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Just fetch some products for the "You May Also Like"
    fetchProducts().then(data => {
      // Filter out the current product and take 4
      const related = (data || []).filter((p: any) => p.id !== currentProductId).slice(0, 4);
      setProducts(related);
    });
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-20 border-t border-gray-200 pt-12 mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#0b1042]">You May Also Like</h2>
        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0b1042] hover:bg-gray-50 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0b1042] hover:bg-gray-50 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
