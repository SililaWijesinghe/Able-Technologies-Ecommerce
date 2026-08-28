import React from 'react';
import { ShoppingCart, Heart, CheckCircle2, BarChart2, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart } = useCart();
  
  const mainImage = product.images?.[0]?.image_url || (product.image_urls && product.image_urls[0]) || '';
  const displayPrice = product.price ? `Rs. ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : (product.newPrice || '');
  
  // Calculate discount or use existing oldPrice if available
  // To match the UI precisely, if there's an oldPrice string, use it. 
  // We can mock oldPrice for now if not available to match the visual.
  const oldPrice = product.oldPrice || (product.price ? `Rs. ${(parseFloat(product.price) * 1.15).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '');
  const discountLabel = product.discount || (product.price ? '-15%' : 'New');
  const badgeColor = discountLabel === 'New' ? 'bg-[#0b1042]' : 'metallic-red-bg';

  const brandName = product.brand_id ? 'SMC' : 'Local'; // Fallback for brand
  const categoryName = product.category_id ? 'Pneumatic' : 'Machine'; // Fallback for category

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-all relative flex flex-col h-full group"
    >
      {/* Top Badges */}
      <div className={`absolute top-4 left-4 ${badgeColor} border-none text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-sm`}>
        {discountLabel}
      </div>
      
      <button className="absolute top-4 right-4 text-gray-300 hover:text-red-600 z-10 transition-colors bg-white rounded-full p-1 shadow-sm">
        <Heart size={16} />
      </button>

      <Link to={`/product/${product.id}`} className="flex-1 flex flex-col group/link">
        {/* Image */}
        <div className="w-full h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center p-4 group-hover/link:bg-gray-100 transition-colors overflow-hidden">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs text-center">
              Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-bold text-[#0b1042] mb-1 line-clamp-2 leading-snug group-hover/link:text-blue-600 transition-colors">{product.name}</h3>
          <p className="text-[11px] text-gray-500 mb-2">{brandName} &bull; {categoryName}</p>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className="metallic-red-text font-black text-lg">{displayPrice}</span>
            {oldPrice && <span className="text-gray-400 text-xs line-through">{oldPrice}</span>}
          </div>

          <div className="flex items-center text-green-600 text-xs font-semibold mb-4 mt-auto">
            <CheckCircle2 size={14} className="mr-1" />
            In Stock
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              productId: product.id,
              name: product.name,
              price: parseFloat(product.price || 0),
              image: mainImage,
              quantity: 1,
            });
          }}
          className="flex-1 bg-[#0b1042] hover:bg-[#a81414] text-white py-2 rounded-lg flex items-center justify-center transition-colors text-sm font-semibold shadow-sm"
        >
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
        <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#0b1042] hover:bg-gray-50 transition-colors">
          <Shuffle size={16} />
        </button>
        <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#0b1042] hover:bg-gray-50 transition-colors">
          <BarChart2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
