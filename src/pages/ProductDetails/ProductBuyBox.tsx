import { ShoppingCart, Heart, Shuffle, Star, Shield, Clock, Truck, Plus, Minus, CheckCircle2, Upload, MessageSquare } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import QuoteModal from '../../components/shop/QuoteModal';

export default function ProductBuyBox({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(product.transaction_type === 'rent' ? 'rent' : 'buy');
  const [customNotes, setCustomNotes] = useState('');
  const [customFiles, setCustomFiles] = useState<FileList | null>(null);
  
  // Variants from product object
  const variants = product.product_variants || [];
  
  // Derived unique attribute keys
  const attributeKeys = useMemo(() => {
    const keys = new Set<string>();
    variants.forEach((v: any) => {
      Object.keys(v.attributes || {}).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [variants]);

  // Track selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    return variants.length > 0 ? variants[0].id : '';
  });

  const selectedVariant = useMemo(() => {
    return variants.find((v: any) => v.id === selectedVariantId) || null;
  }, [variants, selectedVariantId]);

  const basePrice = parseFloat(product.price || 0);
  const priceModifier = selectedVariant ? parseFloat(selectedVariant.price_modifier || 0) : 0;
  const totalPrice = basePrice + priceModifier;
  const displayPrice = `Rs. ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  
  const showPrice = settings.show_prices && !product.requires_quote;

  const currentSku = selectedVariant?.sku || product.sku || '';

  

  return (
    <div className="flex flex-col">
      {/* Stock & Shipping */}
      <div className="flex items-center space-x-4 mb-3">
        <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
          <CheckCircle2 size={12} className="mr-1" />
          In Stock
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-black text-[#0b1042] leading-tight mb-1">
        {product.name}
      </h1>
      
      {currentSku && (
        <div className="text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded inline-block mt-2 mb-4">Model: {currentSku}</div>
      )}

      {/* Transaction Type Toggle */}
      {product.transaction_type === 'both' && (
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          {['buy', 'rent'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTransaction(type)}
              className={`flex-1 py-2 text-xs font-bold rounded-md capitalize transition-colors ${selectedTransaction === type ? 'bg-white shadow-sm text-[#0b1042]' : 'text-gray-500'}`}
            >
              {type}
            </button>
          ))}
        </div>
      )}
      
      {/* Price */}
      <div className="flex items-end space-x-3 mb-4">
        {showPrice ? (
          <>
            <span className="metallic-red-text font-black text-3xl">{displayPrice}</span>
            {selectedTransaction === 'rent' && <span className="text-gray-500 text-sm font-bold mb-1">/ month</span>}
          </>
        ) : (
          <span className="text-blue-900 font-bold text-xl bg-blue-100 px-4 py-2 rounded-lg">Price on Request</span>
        )}
      </div>
      

      {/* Variant Selector */}
      {variants.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#0b1042] mb-2">Select Model</label>
          <div className="relative">
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold transition-all"
            >
              {variants.map((v: any) => {
                const attrs = Object.entries(v.attributes || {})
                  .map(([k, val]) => `${k}: ${val}`)
                  .join(' | ');
                const optionLabel = attrs || v.sku || `Variant ${v.id}`;
                return (
                  <option key={v.id} value={v.id}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      )}

      {/* Customization Section */}
      {product.is_customizable && (
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h4 className="text-sm font-bold text-[#0b1042] mb-3 flex items-center gap-2"><MessageSquare size={16} /> Special Requirements</h4>
          <textarea 
            placeholder="Notes about your customization..." 
            className="w-full text-sm p-3 rounded-lg border border-gray-200 mb-3"
            rows={3}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
          />
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
            <input type="file" onChange={(e) => setCustomFiles(e.target.files)} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-[#0b1042]">
              <Upload size={20} />
              <span className="text-xs font-bold mt-1">Upload Tech Drawing</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
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
      <button 
        onClick={() => {
          if (product.requires_quote) {
            setIsQuoteModalOpen(true);
          } else {
            addToCart({
              productId: product.id,
              name: product.name,
              price: totalPrice,
              image: product.images?.[0]?.image_url || (product.image_urls && product.image_urls[0]) || '',
              quantity: quantity,
              variant: JSON.stringify({ variantId: selectedVariantId, sku: currentSku, type: selectedTransaction, notes: customNotes })
            });
          }
        }}
        className={`w-full ${product.requires_quote ? 'metallic-red-bg hover:bg-red-700 shadow-red-900/20' : 'bg-[#0b1042] hover:bg-[#1a237e] shadow-blue-900/20'} text-white py-3 rounded-lg flex items-center justify-center transition-colors text-sm font-bold shadow-lg`}
      >
        {!product.requires_quote && <ShoppingCart size={18} className="mr-2" />}
        {product.requires_quote ? 'Request Quote' : (settings.enable_checkout ? 'Add to Cart' : 'Request Quote')}
      </button>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} product={product} variantSku={currentSku} />
    </div>
  );
}
