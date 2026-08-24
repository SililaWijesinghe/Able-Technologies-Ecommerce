import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-[#0b1042]">Your Cart ({cartItems.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                  <ShoppingCart size={48} className="text-gray-200" />
                  <p className="font-semibold text-gray-500">Your cart is empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-blue-600 font-bold hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-[10px] text-gray-400">No Image</span>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="text-sm font-bold text-[#0b1042] line-clamp-2">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {item.variant && <p className="text-xs text-gray-500 font-semibold mb-2">Variant: {item.variant}</p>}
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 text-gray-500 hover:text-[#0b1042] hover:bg-gray-100 transition-colors rounded-l-lg"><Minus size={14}/></button>
                          <span className="px-2 text-xs font-bold w-6 text-center text-[#0b1042]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 text-gray-500 hover:text-[#0b1042] hover:bg-gray-100 transition-colors rounded-r-lg"><Plus size={14}/></button>
                        </div>
                        <span className="text-sm font-black metallic-red-text">
                          Rs. {(Number(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-bold text-sm">Subtotal</span>
                  <span className="text-2xl font-black text-[#0b1042]">
                    Rs. {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full metallic-red-bg hover:bg-red-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
