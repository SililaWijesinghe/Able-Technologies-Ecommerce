import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { fetchProduct, fetchCategories } from '../../services/api';
import { useCart } from '../../context/CartContext';

import ProductGallery from './ProductGallery';
import ProductBuyBox from './ProductBuyBox';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import QuoteModal from '../../components/shop/QuoteModal';
import { Skeleton } from '../../components/ui/Skeleton';

export default function ProductDetails() {
  const { settings } = useStoreSettings();
  const { id } = useParams<{ id: string }>();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    setIsLoading(true);
    Promise.all([
      fetchProduct(id),
      fetchCategories()
    ])
      .then(([productData, categoriesData]) => {
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load product details');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Skeleton className="w-64 h-4 mb-8" />
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
                <Skeleton className="w-full aspect-square rounded-2xl" />
                <div className="flex gap-4 mt-6">
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <Skeleton className="w-20 h-20 rounded-xl" />
                </div>
              </div>
              <div className="p-6 md:p-10 md:py-12 bg-gray-50/50 flex flex-col justify-between relative">
                <div>
                  <Skeleton className="w-32 h-6 rounded-full mb-6" />
                  <Skeleton className="w-3/4 h-10 mb-4" />
                  <Skeleton className="w-full h-24 mb-6" />
                  <Skeleton className="w-1/2 h-8 mb-8" />
                  <Skeleton className="w-full h-12 rounded-xl mb-4" />
                  <Skeleton className="w-full h-12 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
  const showPrice = settings.show_prices && !product.requires_quote;
  const displayPrice = showPrice ? `Rs. ${basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Price on Request';
  
  // Find category name
  const categoryObj = categories.find(c => c.id === product.category_id || c.slug === product.category_id);
  const categoryName = categoryObj ? categoryObj.name : (product.category_id ? product.category_id.replace('-', ' ') : '');

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-16 pt-4 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-[13px] md:text-sm font-bold text-slate-700 mb-6 md:mb-8 pb-2">
          <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
          <ChevronRight size={15} className="text-slate-400 shrink-0" />
          <Link to="/shop" className="hover:text-red-600 transition-colors">Shop</Link>
          <ChevronRight size={15} className="text-slate-400 shrink-0" />
          {product.category_id && (
             <>
               <span className="hover:text-red-600 transition-colors cursor-pointer capitalize">{categoryName}</span>
               <ChevronRight size={15} className="text-slate-400 shrink-0" />
             </>
          )}
          <span className="text-[#0b1042] truncate max-w-[200px] sm:max-w-[300px]">{product.name}</span>
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
      <div className={`md:hidden fixed left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 pt-3 z-[60] flex items-center ${showPrice ? 'justify-between' : 'justify-center'} shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out ${scrollDirection === 'down' && !isAtTop ? 'bottom-0' : 'bottom-[64px]'}`}
        style={{ paddingBottom: scrollDirection === 'down' && !isAtTop ? 'max(env(safe-area-inset-bottom), 12px)' : '12px' }}>
        {showPrice && (
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price</span>
            <span className="metallic-red-text font-black text-lg">{displayPrice}</span>
          </div>
        )}

        <div className={`flex items-center space-x-2 ${showPrice ? '' : 'w-full'}`}>
          {product.requires_quote ? (
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className={`metallic-red-bg text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-red-900/30 active:scale-95 transition-transform ${showPrice ? '' : 'w-full'}`}
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
              className={`bg-[#0b1042] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md shadow-blue-900/30 flex items-center justify-center space-x-2 active:scale-95 transition-transform ${showPrice ? '' : 'w-full'}`}
            >
              <ShoppingCart size={15} />
              <span>{settings.enable_checkout ? 'Add to Cart' : 'Submit Order Request'}</span>
            </button>
          )}
        </div>
      </div>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} product={product} />
    </div>
  );
}

