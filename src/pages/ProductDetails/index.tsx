import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { fetchProduct } from '../../services/api';
import { useCart } from '../../context/CartContext';

import ProductGallery from './ProductGallery';
import ProductBuyBox from './ProductBuyBox';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import QuoteModal from '../../components/shop/QuoteModal';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { addToCart } = useCart();

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-[#0b1042] mb-4">{error || 'Product not found'}</h2>
        <Link to="/shop" className="text-blue-600 hover:underline font-semibold">Return to Shop</Link>
      </div>
    );
  }

  const basePrice = parseFloat(product.price || 0);
  const displayPrice = `Rs. ${basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-16 pt-4 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs font-semibold text-gray-500 space-x-2 mb-6 md:mb-8 overflow-x-auto whitespace-nowrap pb-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <ProductGallery product={product} />
          <ProductBuyBox product={product} />
        </div>

        {/* Middle Section: Tabs & Custom Solution */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
        
      </div>

      {/* Sticky Mobile Bottom Action Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-50 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price</span>
          <span className="metallic-red-text font-black text-lg">{displayPrice}</span>
        </div>

        <div className="flex items-center space-x-2">
          {product.requires_quote ? (
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="metallic-red-bg text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-red-900/30 active:scale-95 transition-transform"
            >
              Request Quote
            </button>
          ) : (
            <button 
              onClick={() => addToCart({
                productId: product.id,
                name: product.name,
                price: basePrice,
                image: product.images?.[0]?.image_url || (product.image_urls && product.image_urls[0]) || '',
                quantity: 1
              })}
              className="bg-[#0b1042] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md shadow-blue-900/30 flex items-center space-x-2 active:scale-95 transition-transform"
            >
              <ShoppingCart size={15} />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} product={product} />
    </div>
  );
}

