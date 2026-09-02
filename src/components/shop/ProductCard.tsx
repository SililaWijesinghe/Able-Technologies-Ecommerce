import React, { useState } from 'react';
import { ShoppingCart, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import QuoteModal from './QuoteModal';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  const mainImage = product.image_urls?.[0] || product.image_url || product.images?.[0]?.image_url || '';
  
  // Data extraction based on new rich schema
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.base_price || product.price || 0);
  const comparePrice = typeof product.compare_at_price === 'number' ? product.compare_at_price : parseFloat(product.compare_at_price || 0);
  
  const displayPrice = `Rs. ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const displayComparePrice = `Rs. ${comparePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  const hasDiscount = comparePrice > price;
  const brandName = typeof product.brand === 'object' ? product.brand?.name : (product.brand || product.brand_id);
  
  const rawStatus = String(product.availability_status || product.stock_status || '').toLowerCase().trim();
  const isOnOrder = rawStatus === 'on_order' || rawStatus === 'on-order' || rawStatus === 'on order' || rawStatus === 'pre_order' || rawStatus === 'preorder';
  const isInStock = !isOnOrder && (rawStatus === 'in_stock' || rawStatus === 'instock' || (!rawStatus && (product.stock > 0 || product.stock_quantity > 0)));
  const description = product.short_description || product.description || '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-[8px_8px_20px_rgba(15,23,42,0.06),-8px_-8px_20px_rgba(255,255,255,1)] hover:-translate-y-2 hover:shadow-[12px_12px_24px_rgba(15,23,42,0.1),-12px_-12px_24px_rgba(255,255,255,1)] transition-all duration-300 flex flex-col group relative overflow-hidden h-full"
    >
      {/* Top Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <div className="bg-red-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold w-fit">
            Sale
          </div>
        )}
        {product.is_oeko_tex && (
          <div className="bg-emerald-500/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-[0_4px_10px_rgba(16,185,129,0.4)] w-fit">
            Oeko-Tex Certified
          </div>
        )}
      </div>
      
      {brandName && (
        <div className="bg-blue-950/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs absolute top-4 right-4 z-10 shadow-sm">
          {brandName}
        </div>
      )}

      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col group/link mt-2">
        {/* Image */}
        <div className="w-full h-48 bg-white/50 rounded-2xl mb-2 flex items-center justify-center p-4 group-hover/link:bg-white/80 transition-colors overflow-hidden mix-blend-multiply border border-white/50">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="w-full h-full object-contain group-hover/link:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1">
          <h3 className="text-slate-800 font-bold text-lg leading-tight mt-4 group-hover/link:text-blue-600 transition-colors">{product.name}</h3>
          
          {description && (
            <p className="text-slate-500 text-sm line-clamp-2 mt-2">{description}</p>
          )}
          
          <div className="flex items-center mt-3">
            <span className="text-red-600 font-extrabold text-xl">{displayPrice}</span>
            {hasDiscount && (
              <span className="text-slate-400 line-through text-sm ml-2">{displayComparePrice}</span>
            )}
          </div>

          <div className={`text-xs font-semibold mt-1 ${isOnOrder ? 'text-amber-600' : isInStock ? 'text-green-600' : 'text-red-500'}`}>
            {isOnOrder ? 'On Order' : isInStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      {(product.is_service || product.is_rentable) ? (
        <button 
          onClick={async (e) => {
            e.preventDefault();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              toast.error("Please log in to request a rental or quote");
              navigate('/login');
              return;
            }
            setIsQuoteModalOpen(true);
          }}
          className="w-full mt-4 bg-[#0b1042] hover:bg-[#151c5c] text-white rounded-2xl py-3 shadow-md flex items-center justify-center gap-2 transition-colors relative overflow-hidden group/btn"
        >
          <FileText size={18} className="relative z-10" />
          <span className="font-semibold relative z-10 text-[15px]">Request Quote / Rent</span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </button>
      ) : (
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              productId: product.id,
              name: product.name,
              price: price,
              image: mainImage,
              quantity: 1,
            });
          }}
          className="w-full mt-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl py-3 shadow-md flex items-center justify-center gap-2 transition-colors relative overflow-hidden group/btn"
        >
          <ShoppingCart size={18} className="relative z-10" />
          <span className="font-semibold relative z-10">Add to Cart</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </button>
      )}

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        product={product} 
      />
    </motion.div>
  );
};

export default ProductCard;
