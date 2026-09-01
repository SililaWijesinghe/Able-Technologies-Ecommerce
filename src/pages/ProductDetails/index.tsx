import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { fetchProduct } from '../../services/api';

import ProductGallery from './ProductGallery';
import ProductBuyBox from './ProductBuyBox';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import TrustBar from '../../components/TrustBar';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    setIsLoading(true);
    fetchProduct(id)
      .then(data => {
        if (data) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load product');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0b1042] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#0b1042] mb-4">{error || 'Product not found'}</h2>
        <Link to="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs font-semibold text-gray-500 space-x-2 mb-8">
          <Link to="/" className="hover:text-[#0b1042] transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-[#0b1042] transition-colors">Shop</Link>
          <ChevronRight size={14} />
          {product.category_id && (
             <>
               <span className="hover:text-[#0b1042] transition-colors cursor-pointer capitalize">{product.category_id.replace('-', ' ')}</span>
               <ChevronRight size={14} />
             </>
          )}
          <span className="text-gray-400 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Top Section: Gallery & Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery product={product} />
          <ProductBuyBox product={product} />
        </div>

        {/* Middle Section: Tabs & Custom Solution */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
        
      </div>
    </div>
  );
}
