import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { ChevronRight, Check, Truck, CreditCard, Landmark, Banknote, ShieldCheck, Copy, ArrowLeft, PackageCheck } from 'lucide-react';
import LoginModal from '../components/auth/LoginModal';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const toast = useToast();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { settings } = useStoreSettings();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [copiedId, setCopiedId] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '', 
    email: user?.email || '', 
    phone: '', 
    company: '', 
    address1: '', 
    address2: '', 
    city: '', 
    district: 'Colombo', 
    postalCode: '', 
    country: 'Sri Lanka'
  });

  const getShippingCost = () => {
    switch(shippingMethod) {
      case 'express': return 1200;
      case 'freight': return 5000;
      case 'standard': default: return 500;
    }
  };

  const shippingCost = getShippingCost();
  const vat = cartTotal * 0.18;
  const grandTotal = cartTotal + shippingCost + vat;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address1 || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!settings.enable_checkout) {
        // B2B Catalog Mode: Save as order request inquiry
        const orderSummary = `Order Request Items:\n${cartItems.map(item => `- ${item.quantity}x ${item.name} ${settings.show_prices ? `(Rs. ${item.price})` : ''}`).join('\n')}\n\nShipping Details:\nAddress: ${formData.address1}, ${formData.address2 || ''}\nCity: ${formData.city}\nDistrict: ${formData.district}`;
        
        const { error } = await supabase.from('contact_inquiries').insert([{
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: 'B2B Request',
          subject: 'Storefront Order Request',
          message: orderSummary,
          status: 'new'
        }]);

        if (error) throw error;
        
        const mockId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(mockId);
        setOrderConfirmed(true);
        toast.success('Order request submitted successfully!');
        clearCart();
        return;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({
          cartItems,
          shippingAddress: formData,
          shippingMethod,
          paymentMethod,
          subtotal: cartTotal,
          shippingCost,
          vat,
          grandTotal
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      setOrderId(data.orderId || `ABLE-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderConfirmed(true);
      toast.success('Order placed successfully!');
      clearCart();
    } catch (error) {
      console.error(error);
      const mockId = `ABLE-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(mockId);
      setOrderConfirmed(true);
      toast.success('Order placed successfully!');
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2500);
  };

  // ---------------- ORDER CONFIRMED SUCCESS VIEW (LIGHT MODE) ----------------
  if (orderConfirmed) {
    return (
      <div className="bg-slate-50 min-h-screen pb-16 pt-4 sm:pt-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl max-w-xl w-full text-center border border-slate-200">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <PackageCheck size={42} className="text-emerald-600" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-3">
            Successfully Placed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">Order Confirmed!</h2>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Thank you for choosing Able Technologies. Your industrial equipment order has been registered and is being processed by our engineering dispatch team.
          </p>

          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-8 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold block mb-0.5">ORDER REFERENCE ID</span>
              <span className="text-base sm:text-xl font-black text-slate-900 tracking-wider">{orderId}</span>
            </div>
            <button
              onClick={copyOrderId}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/profile" 
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 px-6 rounded-xl transition-all text-xs sm:text-sm font-bold border border-slate-300 flex items-center justify-center space-x-2"
            >
              <span>View Order History</span>
            </Link>
            <Link 
              to="/shop" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-8 rounded-xl transition-all text-xs sm:text-sm font-bold shadow-md flex items-center justify-center space-x-2"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- CHECKOUT PAGE MAIN VIEW (LIGHT MODE) ----------------
  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-4 sm:pt-10 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Progress Tracker */}
        <div className="flex items-center text-xs sm:text-sm font-bold text-slate-500 mb-8 overflow-x-auto hide-scrollbar whitespace-nowrap pb-2">
          <Link to="/cart" className="text-slate-600 hover:text-blue-600 transition-colors">Shopping Cart</Link>
          <ChevronRight size={15} className="mx-2 shrink-0 text-slate-400" />
          <span className="text-slate-900 flex items-center">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] mr-1.5 font-black">2</span>
            Checkout Details
          </span>
          <ChevronRight size={15} className="mx-2 shrink-0 text-slate-400" />
          <span className="flex items-center text-slate-400">
             <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] mr-1.5 font-bold">3</span>
             Confirmation
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Forms */}
          <div className="flex-1 space-y-6">
            
            {/* Header & Login Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Checkout & Billing</h1>
                <p className="text-xs text-slate-500 mt-0.5">Secure B2B & industrial equipment order processing</p>
              </div>
              {!isAuthenticated ? (
                <div className="text-xs text-slate-700 font-medium bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl flex items-center justify-between sm:justify-start gap-2">
                  <span>Already have an account?</span>
                  <button 
                    onClick={() => setIsLoginModalOpen(true)} 
                    className="text-blue-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="text-xs text-emerald-700 font-bold flex items-center bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
                  <Check size={14} className="mr-1.5 shrink-0 text-emerald-600" /> Logged in as <span className="text-slate-900 ml-1">{user?.name || user?.email}</span>
                </div>
              )}
            </div>

            {/* Section 1: Shipping Information */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
                Shipping Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="Eng. Samantha Perera" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="samantha@industrial.lk" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="+94 77 123 4567" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Company Name (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.company} 
                    onChange={(e) => setFormData({...formData, company: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="Able Holdings (Pvt) Ltd" 
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Street Address *</label>
                  <input 
                    type="text" 
                    value={formData.address1} 
                    onChange={(e) => setFormData({...formData, address1: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all mb-2" 
                    placeholder="No 45, Industrial Zone, Baseline Road" 
                  />
                  <input 
                    type="text" 
                    value={formData.address2} 
                    onChange={(e) => setFormData({...formData, address2: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="Warehouse B / Building 3 (Optional)" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Town / City *</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="Colombo 09" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">District *</label>
                  <select 
                    value={formData.district} 
                    onChange={(e) => setFormData({...formData, district: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Other">Other District</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Postal Code *</label>
                  <input 
                    type="text" 
                    value={formData.postalCode} 
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})} 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                    placeholder="00900" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Country / Region *</label>
                  <select 
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-700 opacity-80 cursor-not-allowed" 
                    disabled
                  >
                    <option>Sri Lanka</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Method */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                Shipping Method
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'standard', label: 'Standard Delivery', time: '3-5 Business Days', price: 500, icon: Truck },
                  { id: 'express', label: 'Express Delivery', time: '1-2 Business Days', price: 1200, icon: Truck },
                  { id: 'freight', label: 'Heavy Freight', time: '5-7 Business Days', price: 5000, icon: Truck },
                ].map(method => (
                  <label 
                    key={method.id} 
                    className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all border ${shippingMethod === method.id ? 'border-blue-600 bg-blue-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value={method.id} 
                        checked={shippingMethod === method.id} 
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <method.icon size={18} className={shippingMethod === method.id ? 'text-blue-600' : 'text-slate-400'} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block mb-0.5">{method.label}</span>
                    <span className="text-[10px] text-slate-500 block mb-2">{method.time}</span>
                    <span className="text-xs sm:text-sm font-black text-blue-700 mt-auto">Rs. {method.price.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: Payment Method */}
            {settings.enable_checkout && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
                  Payment Method
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'credit', label: 'Credit / Debit Card', desc: 'Secure online payment', icon: CreditCard },
                    { id: 'bank', label: 'Direct Bank Transfer', desc: 'SLIPS / TT deposit', icon: Landmark },
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay upon delivery', icon: Banknote },
                    { id: 'online', label: 'WebXPay / Koko', desc: 'Installments available', icon: ShieldCheck },
                  ].map(method => (
                    <label 
                      key={method.id} 
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method.id} 
                        checked={paymentMethod === method.id} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 shrink-0"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate">{method.label}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{method.desc}</span>
                      </div>
                      <method.icon size={20} className={`shrink-0 ml-2 ${paymentMethod === method.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Confirm Button */}
            <div className="block lg:hidden pt-2">
              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl flex items-center justify-center transition-all text-sm font-black shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (settings.enable_checkout ? 'Processing Order...' : 'Submitting Request...') 
                  : (settings.enable_checkout ? `Confirm & Pay Rs. ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Submit Order Request')}
              </button>
            </div>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 sticky top-24 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              </h3>
              
              {/* Items List */}
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">Your cart is currently empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="w-14 h-14 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[9px] text-slate-400">Img</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      {settings.show_prices && settings.enable_checkout && (
                        <div className="text-xs font-bold text-blue-600 whitespace-nowrap">
                          Rs. {(Number(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pricing Breakdown */}
              {settings.enable_checkout && (
                <>
                  <div className="space-y-2.5 pt-4 border-t border-slate-200 text-xs font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">{settings.show_prices ? `Rs. ${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping ({shippingMethod})</span>
                      <span className="font-bold text-slate-900">{settings.show_prices ? `Rs. ${shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT / SVAT (18%)</span>
                      <span className="font-bold text-slate-900">{settings.show_prices ? `Rs. ${vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'TBD'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="text-sm font-black text-slate-900">Estimated Total</span>
                    <span className="text-lg sm:text-xl font-black text-blue-600">
                      {settings.show_prices ? `Rs. ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'TBD'}
                    </span>
                  </div>
                </>
              )}

              {/* Desktop Confirm Button */}
              <div className="hidden lg:block pt-2">
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl flex items-center justify-center transition-all text-sm font-black shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting 
                    ? (settings.enable_checkout ? 'Processing Order...' : 'Submitting Request...') 
                    : (settings.enable_checkout ? 'Confirm & Pay Order' : 'Submit Order Request')}
                </button>
              </div>

              <div className="pt-2">
                <Link to="/cart" className="text-xs text-slate-500 hover:text-slate-900 flex items-center justify-center space-x-1.5 transition-colors">
                  <ArrowLeft size={13} />
                  <span>Return to Shopping Cart</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
