import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Check, Truck, CreditCard, Landmark, Banknote, ShieldCheck } from 'lucide-react';
import LoginModal from '../components/auth/LoginModal';

export default function Checkout() {
  const toast = useToast();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', company: '', 
    address1: '', address2: '', city: '', district: '', 
    postalCode: '', country: 'Sri Lanka'
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

    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
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
      setOrderId(data.orderId);
      setOrderConfirmed(true);
      toast.success('Order placed successfully!');
      clearCart();
    } catch (error) {
      console.error(error);
      toast.error('There was an error placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="bg-gray-50 min-h-screen pb-16 pt-8 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-[#0b1042] mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6 font-medium">Thank you for your purchase. We've received your order and are getting it ready to ship.</p>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 inline-block">
            <span className="text-xs text-gray-500 font-bold block mb-1">ORDER NUMBER</span>
            <span className="text-lg font-black text-[#0b1042]">{orderId}</span>
          </div>
          <div>
            <Link to="/shop" className="inline-flex items-center justify-center metallic-red-bg hover:bg-red-700 text-white py-3.5 px-8 rounded-xl transition-colors text-sm font-black shadow-lg shadow-red-900/30">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Progress Tracker */}
        <div className="flex items-center text-xs md:text-sm font-bold text-gray-400 mb-10 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link to="/cart" className="text-gray-500 hover:text-[#0b1042] transition-colors">Shopping Cart</Link>
          <ChevronRight size={16} className="mx-2 shrink-0" />
          <span className="text-[#0b1042] flex items-center">
            <span className="w-5 h-5 rounded-full bg-[#0b1042] text-white flex items-center justify-center text-[10px] mr-2">2</span>
            Checkout
          </span>
          <ChevronRight size={16} className="mx-2 shrink-0" />
          <span className="flex items-center">
             <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] mr-2">3</span>
             Order Review
          </span>
          <ChevronRight size={16} className="mx-2 shrink-0" />
          <span className="flex items-center">
             <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] mr-2 ${orderConfirmed ? 'bg-[#0b1042] text-white' : 'bg-gray-200 text-gray-500'}`}>{orderConfirmed ? <Check size={12}/> : '4'}</span>
             <span className={orderConfirmed ? 'text-[#0b1042]' : 'text-gray-500'}>Order Confirmed</span>
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Forms */}
          <div className="flex-1 space-y-8">
            
            {/* Header & Login Prompt */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-black text-[#0b1042]">Billing & Shipping</h2>
              {!isAuthenticated ? (
                <span className="text-sm text-gray-600 mt-2 md:mt-0 font-medium">
                  Returning customer? <button onClick={() => setIsLoginModalOpen(true)} className="text-blue-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">Login here</button>
                </span>
              ) : (
                <span className="text-sm text-green-600 mt-2 md:mt-0 font-bold flex items-center">
                  <Check size={16} className="mr-1" /> Logged in as {user?.name || user?.email}
                </span>
              )}
            </div>

            {/* Section 1: Shipping Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#0b1042] mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Full Name *</label>
                  <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Email Address *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Phone Number *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="+94 7X XXX XXXX" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Company Name (Optional)</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="Acme Industries" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Street Address *</label>
                  <input type="text" value={formData.address1} onChange={(e) => setFormData({...formData, address1: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all mb-2" placeholder="House number and street name" />
                  <input type="text" value={formData.address2} onChange={(e) => setFormData({...formData, address2: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="Apartment, suite, unit, etc. (optional)" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Town / City *</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">District *</label>
                  <select value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white">
                    <option>Colombo</option>
                    <option>Gampaha</option>
                    <option>Kalutara</option>
                    <option>Kandy</option>
                    {/* Add more as needed */}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Postal Code *</label>
                  <input type="text" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Country / Region *</label>
                  <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white" disabled>
                    <option>Sri Lanka</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <input type="checkbox" id="same-billing" className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" defaultChecked />
                <label htmlFor="same-billing" className="ml-2 text-sm font-semibold text-gray-700 cursor-pointer">Shipping address is the same as billing address</label>
              </div>
            </div>

            {/* Section 2: Shipping Method */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#0b1042] mb-4">Shipping Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'standard', label: 'Standard Delivery', time: '3-5 Business Days', price: 500, icon: Truck },
                  { id: 'express', label: 'Express Delivery', time: '1-2 Business Days', price: 1200, icon: Truck },
                  { id: 'freight', label: 'Heavy Freight', time: '5-7 Business Days', price: 5000, icon: Truck },
                ].map(method => (
                  <label 
                    key={method.id} 
                    className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === method.id ? 'border-[#0b1042] bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <input 
                        type="radio" 
                        name="shipping" 
                        value={method.id} 
                        checked={shippingMethod === method.id} 
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mt-1 w-4 h-4 text-[#0b1042] focus:ring-[#0b1042]"
                      />
                      <method.icon size={20} className={shippingMethod === method.id ? 'text-[#0b1042]' : 'text-gray-400'} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 block mb-1">{method.label}</span>
                    <span className="text-xs text-gray-500 block mb-2">{method.time}</span>
                    <span className="text-sm font-black text-[#0b1042] mt-auto">Rs. {method.price.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#0b1042] mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'credit', label: 'Credit / Debit Card', desc: 'Securely pay via card', icon: CreditCard },
                  { id: 'bank', label: 'Bank Transfer', desc: 'Direct deposit to our account', icon: Landmark },
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive the order', icon: Banknote },
                  { id: 'online', label: 'Online Payment', desc: 'WebXPay / Koko', icon: ShieldCheck },
                ].map(method => (
                  <label 
                    key={method.id} 
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#0b1042] bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method.id} 
                      checked={paymentMethod === method.id} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#0b1042] focus:ring-[#0b1042]"
                    />
                    <div className="ml-3 flex-1">
                      <span className="text-sm font-bold text-gray-900 block">{method.label}</span>
                      <span className="text-xs text-gray-500 block">{method.desc}</span>
                    </div>
                    <method.icon size={24} strokeWidth={1.5} className={paymentMethod === method.id ? 'text-[#0b1042]' : 'text-gray-400'} />
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full md:w-auto metallic-red-bg hover:bg-red-700 text-white py-4 px-12 rounded-xl flex items-center justify-center transition-colors text-base font-black shadow-lg shadow-red-900/30 float-right disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Confirm & Pay'} <ChevronRight size={20} className="ml-2" />
            </button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-200/40 p-6 sticky top-24">
              <h3 className="text-xl font-black text-[#0b1042] mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 p-1 shrink-0 flex items-center justify-center">
                        {/* Quantity Badge */}
                        <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm z-10">
                          {item.quantity}
                        </div>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                          <span className="text-[8px] text-gray-400">No Img</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        {item.variant && <p className="text-xs text-gray-500 font-medium">{item.variant}</p>}
                      </div>
                      <div className="text-sm font-bold text-[#0b1042] whitespace-nowrap">
                        Rs. {(Number(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pt-6 border-t border-gray-100 text-sm font-medium">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-900">Rs. {shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (18%)</span>
                  <span className="font-bold text-gray-900">Rs. {vat.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-100">
                <span className="text-base font-black text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">LKR</span>
                  <span className="text-2xl font-black metallic-red-text">
                    Rs. {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
