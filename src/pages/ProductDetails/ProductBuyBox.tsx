import { ShoppingCart, Heart, Shuffle, Star, Shield, Clock, Truck, Plus, Minus, CheckCircle2, Upload, MessageSquare } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import QuoteModal from '../../components/shop/QuoteModal';

export default function ProductBuyBox({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
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

  // Track selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (variants.length > 0) {
      Object.entries(variants[0].attributes || {}).forEach(([k, v]) => {
        initial[k] = v as string;
      });
    }
    return initial;
  });

  // Find matching variant
  const selectedVariant = useMemo(() => {
    return variants.find((v: any) => 
      Object.entries(selectedAttributes).every(([k, val]) => v.attributes[k] === val)
    );
  }, [variants, selectedAttributes]);

  const basePrice = parseFloat(product.price || 0);
  const priceModifier = selectedVariant ? parseFloat(selectedVariant.price_modifier || 0) : 0;
  const totalPrice = basePrice + priceModifier;

  const displayPrice = `Rs. ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const updateAttribute = (key: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [key]: value }));
  };

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
      <h1 className="text-2xl md:text-3xl font-black text-[#0b1042] leading-tight mb-2">
        {product.name}
      </h1>

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
        <span className="metallic-red-text font-black text-3xl">{displayPrice}</span>
        {selectedTransaction === 'rent' && <span className="text-gray-500 text-sm font-bold mb-1">/ month</span>}
      </div>
      
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {product.description}
      </p>

      {/* Dynamic Selectors */}
      {attributeKeys.map(key => (
        <div key={key} className="mb-4">
          <h4 className="text-sm font-bold text-[#0b1042] mb-2">{key}</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(variants.map((v: any) => v.attributes[key]))).map((val: any) => (
              <button 
                key={val}
                onClick={() => updateAttribute(key, val)}
                className={`px-4 py-2 text-xs font-semibold rounded border transition-colors ${selectedAttributes[key] === val ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}

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
      {product.requires_quote ? (
        <button 
          onClick={() => setIsQuoteModalOpen(true)}
          className="w-full metallic-red-bg hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center transition-colors text-sm font-bold shadow-lg shadow-red-900/20"
        >
          Request Quote
        </button>
      ) : (
        <button 
          onClick={() => addToCart({
            productId: product.id,
            name: product.name,
            price: totalPrice,
            image: product.images?.[0]?.image_url || (product.image_urls && product.image_urls[0]) || '',
            quantity: quantity,
            variant: JSON.stringify({ ...selectedAttributes, type: selectedTransaction, notes: customNotes })
          })}
          className="w-full bg-[#0b1042] hover:bg-[#1a237e] text-white py-3 rounded-lg flex items-center justify-center transition-colors text-sm font-bold shadow-lg shadow-blue-900/20"
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </button>
      )}

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} product={product} />
    </div>
  );
}
