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
          <span className="hover:text-[#0b1042] transition-colors cursor-pointer">Spare Parts</span>
          <ChevronRight size={14} />
          <span className="hover:text-[#0b1042] transition-colors cursor-pointer">Pneumatic</span>
          <ChevronRight size={14} />
          <span className="text-gray-400">{product.name}</span>
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
      
      {/* Why Thousands of Industries Trust Us Banner */}
      <div className="bg-[#0b1042] py-16 relative overflow-hidden">
        {/* Abstract metallic/industrial texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2000')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1042] via-transparent to-[#0b1042]"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-10 text-center md:text-left">Why Thousands of Industries Trust Us</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">10+</div>
                <div className="text-xs text-blue-200">Years of Experience</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">5000+</div>
                <div className="text-xs text-blue-200">Happy Customers</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9 12l2 2 4-4"></path></svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">100%</div>
                <div className="text-xs text-blue-200">Genuine Products</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Islandwide</div>
                <div className="text-xs text-blue-200">Fast Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
