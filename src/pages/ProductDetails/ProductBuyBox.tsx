import { ShoppingCart, Heart, Shuffle, Star, Shield, Clock, Truck, Plus, Minus, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductBuyBox({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const specs = product.specs || {};
  
  const displayPrice = product.price ? `Rs. ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : (product.newPrice || '');
  const oldPrice = product.price ? `Rs. ${(parseFloat(product.price) * 1.15).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '';

  const boreSizes = specs['Bore Size'] ? (Array.isArray(specs['Bore Size']) ? specs['Bore Size'] : [specs['Bore Size']]) : ['32mm', '40mm', '50mm', '63mm', '80mm', '100mm'];
  const [selectedBore, setSelectedBore] = useState('40mm');

  return (
    <div className="flex flex-col">
      {/* Stock & Shipping */}
      <div className="flex items-center space-x-4 mb-3">
        <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
          <CheckCircle2 size={12} className="mr-1" />
          In Stock
        </span>
        <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded">
          Ships within 24 hrs
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-black text-[#0b1042] leading-tight mb-2">
        {product.name}
      </h1>
      
      {/* Brand & Reviews */}
      <div className="flex flex-wrap items-center text-sm mb-4 gap-y-2">
        <span className="text-gray-500 mr-4">SMC &bull; Pneumatic</span>
        <div className="flex items-center">
          <div className="flex text-yellow-400 mr-2">
            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <span className="text-gray-700 font-semibold">4.8 <span className="text-blue-600 hover:underline cursor-pointer font-normal">(125 reviews)</span></span>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-6 font-medium">
        SKU: <span className="text-gray-800">{product.sku || 'AC-15552'}</span>
      </div>

      {/* Price */}
      <div className="flex items-end space-x-3 mb-4">
        <span className="metallic-red-text font-black text-3xl">{displayPrice}</span>
        {oldPrice && <span className="text-gray-400 text-base line-through mb-1">{oldPrice}</span>}
        <span className="metallic-red-bg text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1.5 ml-2">-12%</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {product.description || 'High performance pneumatic air cylinder conforming to ISO 15552 standard. Reliable, durable and suitable for a wide range of industrial applications.'}
      </p>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="bg-gray-50 rounded p-3 flex flex-col justify-center border border-gray-100">
           <Shield className="text-blue-500 mb-1" size={20} />
           <span className="text-xs font-bold text-[#0b1042]">ISO 15552 Standard</span>
           <span className="text-[10px] text-gray-500">International Quality</span>
        </div>
        <div className="bg-gray-50 rounded p-3 flex flex-col justify-center border border-gray-100">
           <svg className="text-green-500 mb-1 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
           <span className="text-xs font-bold text-[#0b1042]">High Durability</span>
           <span className="text-[10px] text-gray-500">Longer Life</span>
        </div>
        <div className="bg-gray-50 rounded p-3 flex flex-col justify-center border border-gray-100">
           <svg className="text-purple-500 mb-1 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
           <span className="text-xs font-bold text-[#0b1042]">Easy Installation</span>
           <span className="text-[10px] text-gray-500">User Friendly</span>
        </div>
      </div>

      {/* Variants */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-[#0b1042] mb-3">Bore Size</h4>
        <div className="flex flex-wrap gap-2">
          {boreSizes.map((size: string) => (
            <button 
              key={size}
              onClick={() => setSelectedBore(size)}
              className={`px-4 py-2 text-xs font-semibold rounded border transition-colors ${selectedBore === size ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#0b1042] mb-2">Stroke Length</h4>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 font-medium">
            <option>50mm</option>
            <option>100mm</option>
            <option>150mm</option>
            <option>200mm</option>
          </select>
        </div>
        <div className="w-32">
          <h4 className="text-sm font-bold text-[#0b1042] mb-2">Quantity</h4>
          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-1">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded">
              <Minus size={16} />
            </button>
            <span className="text-sm font-bold text-[#0b1042]">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 mb-4">
        <button 
          onClick={() => addToCart({
            productId: product.id,
            name: product.name,
            price: parseFloat(product.price || 0),
            image: product.images?.[0]?.image_url || (product.image_urls && product.image_urls[0]) || '',
            quantity: quantity,
            variant: selectedBore
          })}
          className="flex-1 bg-[#0b1042] hover:bg-[#1a237e] text-white py-3 rounded-lg flex items-center justify-center transition-colors text-sm font-bold shadow-lg shadow-blue-900/20"
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </button>
        <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors bg-white">
          <Heart size={20} />
        </button>
        <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-200 transition-colors bg-white">
          <Shuffle size={20} />
        </button>
      </div>
      
      <button className="w-full metallic-red-bg hover:bg-red-700 text-white py-3.5 rounded-lg flex items-center justify-center transition-colors text-base font-black shadow-lg shadow-red-900/30">
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Buy Now
      </button>

      {/* Footer info */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
         <span className="flex items-center"><Shield size={14} className="mr-1 text-green-500" /> 100% Genuine Products</span>
         <span className="flex items-center"><Shield size={14} className="mr-1 text-gray-400" /> Secure Payments</span>
         <span className="flex items-center"><Truck size={14} className="mr-1 text-gray-400" /> 7 Days Easy Returns</span>
      </div>
    </div>
  );
}
