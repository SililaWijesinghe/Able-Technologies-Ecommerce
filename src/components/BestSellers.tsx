import { ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function BestSellers() {
  const fallbackProducts = [
    { id: '1', name: 'Pneumatic Pad Printing Machine', oldPrice: 'Rs. 570,000.00', newPrice: 'Rs. 485,000.00', discount: '-15%' },
    { id: '2', name: 'Industrial Robotic Arm 6 Axis', oldPrice: 'Rs. 2,050,000.00', newPrice: 'Rs. 1,850,000.00', discount: '-10%' },
    { id: '3', name: 'Air Cylinder ISO 15552', oldPrice: 'Rs. 14,200.00', newPrice: 'Rs. 12,500.00', discount: '-12%' },
    { id: '4', name: 'Pneumatic Fittings Set', oldPrice: 'Rs. 1,360.00', newPrice: 'Rs. 1,250.00', discount: '-8%' },
  ];

  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

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
        {products.map((product, idx) => {
          const mainImage = product.images?.[0]?.image_url || (product.image_urls && product.image_urls[0]);
          const displayPrice = product.price ? `Rs. ${parseFloat(product.price).toLocaleString('en-US', {minimumFractionDigits: 2})}` : product.newPrice;

          return (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-3 md:p-4 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full hover:-translate-y-1 min-w-[160px] sm:min-w-[200px] md:min-w-0 snap-start shrink-0"
          >
            {product.discount && (
              <div className="absolute top-2 left-2 md:top-4 md:left-4 metallic-red-bg border-none text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded z-10 shadow-sm">
                {product.discount}
              </div>
            )}
            <button className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-300 hover:text-red-600 z-10 transition-colors bg-white rounded-full p-1 shadow-sm">
              <Heart size={14} className="md:w-4 md:h-4" />
            </button>

            <Link to={`/product/${product.id}`} className="flex-1 flex flex-col">
              <div className="w-full h-32 md:h-48 bg-gray-50 rounded-lg mb-3 md:mb-4 flex items-center justify-center p-2 md:p-4 group-hover:bg-gray-100 transition-colors overflow-hidden">
                 {mainImage ? (
                   <img src={mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                 ) : (
                   <div className="w-full h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 text-[10px] md:text-xs text-center">
                     Image
                   </div>
                 )}
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-3 md:mb-4 line-clamp-2 leading-snug flex-1">{product.name}</h3>
            </Link>
            
            <div className="flex items-end justify-between mt-auto pt-3 md:pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                {product.oldPrice && <span className="text-gray-400 text-[10px] md:text-xs line-through mb-0.5">{product.oldPrice}</span>}
                <span className="metallic-red-text font-bold text-sm md:text-[15px] leading-none">{displayPrice}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product, 1);
                }}
                className="bg-[#0b1042] hover:bg-[#a81414] text-white w-7 h-7 md:w-9 md:h-9 rounded-md flex items-center justify-center transition-colors shadow-sm shrink-0 ml-2"
              >
                <ShoppingCart size={14} className="md:w-4 md:h-4" />
              </button>
            </div>
          </motion.div>
        )})}
      </div>
    </div>
  );
}
