import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  RotateCcw,
  Headphones, 
  Cog, 
  Hammer, 
  Hexagon,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { useCart } from '../../context/CartContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const { settings } = useStoreSettings();
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartCount 
  } = useCart();

  // Popular category items matching Able Technologies industrial catalog
  const popularCategories = [
    { 
      name: 'Machinery', 
      path: '/shop?category=Machinery',
      icon: Cog
    },
    { 
      name: 'Power Tools', 
      path: '/shop?category=Power+Tools',
      icon: Hammer
    },
    { 
      name: 'Spare Parts', 
      path: '/shop?category=Spare+Parts',
      icon: Hexagon
    },
  ];

  // Lock body scroll when cart drawer is active
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Handle ESC key to close cart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  const handleCategoryClick = (path: string) => {
    setIsCartOpen(false);
    navigate(path);
  };

  // Generate and copy formatted Proforma Quotation for Corporate PO / Approvals
  const handleCopyProforma = () => {
    if (cartItems.length === 0) return;
    
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const itemsList = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.name}${item.variant ? ` (${item.variant})` : ''} - Qty: ${item.quantity} × Rs. ${Number(item.price).toLocaleString()} = Rs. ${(Number(item.price) * item.quantity).toLocaleString()}`
    ).join('\n');

    const proformaText = `*ABLE TECHNOLOGIES (PVT) LTD - PROFORMA CART QUOTATION*\nDate: ${dateStr}\nTotal Line Items: ${cartCount}\n----------------------------------------\n${itemsList}\n----------------------------------------\n*ESTIMATED TOTAL: Rs. ${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*\n* Official VAT/SVAT Invoicing & Manufacturer Warranty Included.\n* Factory Inspection & Colombo Showroom Support.\nHotline / WhatsApp: +94 77 000 0000 | Web: abletechnologies.lk`;

    navigator.clipboard.writeText(proformaText).then(() => {
      setIsCopied(true);
      toast.success('Proforma Quotation copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#07153a',
          color: '#fff',
          border: '1px solid rgba(59,130,246,0.3)',
        }
      });
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(() => {
      toast.error('Unable to copy quotation.');
    });
  };

  // Direct WhatsApp technical check for cart items
  const handleWhatsAppConsult = () => {
    if (cartItems.length === 0) return;
    const itemsSummary = cartItems.map(i => `• ${i.name} (Qty: ${i.quantity})`).join('%0A');
    const msg = `Hello Able Technologies, I would like to verify technical compatibility / request a corporate invoice for the following items in my cart:%0A%0A${itemsSummary}%0A%0ATotal: Rs. ${cartTotal.toLocaleString()}`;
    window.open(`https://wa.me/94770000000?text=${msg}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark Translucent Liquid Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#000a23]/75 backdrop-blur-[16px] z-[100]"
            aria-hidden="true"
          />

          {/* Deep Navy Liquid-Glass Slide-In Cart Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-[85%] sm:w-[78%] md:max-w-[480px] lg:max-w-[500px] bg-gradient-to-b from-[#07173e]/95 via-[#040e29]/98 to-[#020718]/99 backdrop-blur-[36px] border-l border-white/15 rounded-l-[28px] shadow-[-25px_0_60px_rgba(0,0,0,0.75)] z-[101] flex flex-col text-slate-100 overflow-hidden"
          >
            {/* Ambient Lighting Flares */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* ---------------- HEADER ---------------- */}
            <div className="relative px-5 py-4.5 border-b border-white/10 bg-[#07153a]/80 backdrop-blur-xl flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0b1c48] border border-blue-400/35 text-blue-300 flex items-center justify-center shadow-inner">
                  <ShoppingBag size={18} className="text-blue-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base sm:text-lg font-black text-white tracking-tight">Your Cart</h2>
                    <span className="bg-blue-600/30 text-blue-300 border border-blue-400/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Able Technologies Industrial Solutions</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    title="Clear cart"
                    className="text-xs text-slate-400 hover:text-red-400 px-2.5 py-1.5 rounded-xl hover:bg-red-500/10 transition-all font-semibold flex items-center space-x-1"
                  >
                    <Trash2 size={13} />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart drawer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 group"
                >
                  <X size={17} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* ---------------- MAIN BODY CONTENT (SCROLLABLE) ---------------- */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
              {cartItems.length === 0 ? (
                /* ================ EMPTY CART ================ */
                <div className="h-full min-h-[340px] flex flex-col items-center justify-center text-center p-2 my-auto">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#0b245c]/45 to-[#041235]/65 border border-blue-400/30 shadow-[0_0_30px_rgba(37,99,235,0.2)] flex items-center justify-center mb-4">
                    <ShoppingBag size={42} className="text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Your Cart is Empty</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 mb-5 max-w-[270px] leading-relaxed">
                    Explore our heavy industrial machines, power tools, and precision spare parts.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full max-w-[280px] metallic-red-bg text-white py-3 px-6 rounded-xl text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-red-400/30"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight size={15} />
                  </Link>

                  <div className="w-full max-w-[300px] my-5 flex items-center justify-center space-x-2 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                    <div className="flex-1 h-px bg-white/10" />
                    <span>Popular Categories</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full max-w-[320px]">
                    {popularCategories.map(cat => {
                      const IconComponent = cat.icon;
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => handleCategoryClick(cat.path)}
                          className="bg-[#0a1c47]/70 hover:bg-[#0f2963] border border-blue-400/20 rounded-xl p-2.5 flex flex-col items-center justify-center text-center transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-950/60 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:text-blue-300">
                            <IconComponent size={15} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-200 group-hover:text-white mt-1.5">
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ================ CART PRODUCTS LIST (CLEAN & SPACIOUS) ================ */
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-[#081a44]/80 border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-sm flex items-center space-x-3 group"
                      >
                        {/* Product Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-1 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/src/assets/Tool.png';
                              }}
                            />
                          ) : (
                            <Hexagon size={22} className="text-slate-400" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-tight">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                              className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {item.variant && (
                            <p className="text-[10px] sm:text-[11px] text-blue-300 font-medium truncate mt-0.5">
                              {item.variant}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-[#03091e] rounded-lg p-0.5 border border-white/15">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="w-5 h-5 rounded bg-[#0a1d48] text-slate-300 hover:text-red-400 flex items-center justify-center text-xs font-bold active:scale-90"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-6 text-center text-xs font-black text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="w-5 h-5 rounded bg-[#0a1d48] text-slate-300 hover:text-blue-300 flex items-center justify-center text-xs font-bold active:scale-90"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            {/* Total Line Item Price */}
                            <div className="text-right">
                              <span className="text-xs sm:text-sm font-black text-red-400 tracking-tight">
                                {settings.show_prices && settings.enable_checkout ? `Rs. ${(Number(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Quick B2B Proforma & Technical Check Bar (Clean & Minimal) */}
                  <div className="bg-[#040e2b] border border-blue-400/25 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <div className="flex items-center space-x-2 text-left w-full sm:w-auto">
                      <div className="w-7 h-7 rounded-lg bg-blue-900/50 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                        <FileText size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-white">Corporate PO Quote</p>
                        <p className="text-[9px] text-slate-400">VAT / SVAT Proforma ready</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleCopyProforma}
                        className="text-[10px] sm:text-[11px] font-bold bg-[#0b2052] hover:bg-[#123177] text-blue-200 px-2.5 py-1.5 rounded-xl border border-blue-400/30 transition-all flex items-center space-x-1 active:scale-95 cursor-pointer"
                      >
                        {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{isCopied ? 'Copied' : 'Proforma'}</span>
                      </button>

                      <button
                        onClick={handleWhatsAppConsult}
                        className="text-[10px] sm:text-[11px] font-bold bg-[#0b3824] hover:bg-[#0f4d32] text-emerald-300 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 transition-all flex items-center space-x-1 active:scale-95 cursor-pointer"
                      >
                        <WhatsAppIcon size={12} className="text-emerald-400" />
                        <span>Ask Tech</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------- STICKY BOTTOM CHECKOUT SUMMARY ---------------- */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#040e2b]/95 backdrop-blur-2xl space-y-3 shrink-0">
                {settings.enable_checkout && (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal</span>
                      <span className="text-white font-bold">
                        {settings.show_prices ? `Rs. ${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Corporate Warranty</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck size={12} /> Guaranteed
                      </span>
                    </div>
                    <div className="h-px bg-white/10 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-white">Estimated Total</span>
                      <span className="text-base sm:text-lg font-black text-red-400">
                        {settings.show_prices ? `Rs. ${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'TBD'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full metallic-red-bg hover:brightness-110 text-white py-3 px-6 rounded-xl font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center space-x-2 border border-red-400/40"
                  >
                    <span>{settings.enable_checkout ? 'Proceed to Checkout' : 'Submit Order Request'}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-xs font-bold text-slate-300 hover:text-white py-1 flex items-center justify-center space-x-1 transition-colors"
                  >
                    <ArrowLeft size={13} />
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


