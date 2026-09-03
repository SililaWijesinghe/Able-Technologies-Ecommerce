import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, User, ChevronRight, Settings, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'inquiries' | 'settings'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Shipping details state
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        if (token) {
          const res = await fetch('/api/orders/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        }
        
        if (user) {
          console.log('Fetching inquiries for user:', user.id);
          const { data, error } = await supabase
            .from('service_inquiries')
            .select('*, products(name, image_urls)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (error) {
            console.error('Supabase fetch error:', error);
          } else {
            console.log('Fetched inquiries:', data);
            if (data) setInquiries(data);
          }
        }
        
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Mock loading saved shipping details from local storage for now
    const saved = localStorage.getItem('shipping_details');
    if (saved) {
      setShippingDetails(JSON.parse(saved));
    }
  }, [user]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('shipping_details', JSON.stringify(shippingDetails));
    setSaveSuccess('Settings saved successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-4 md:pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
              <div className="w-16 h-16 bg-blue-50 text-[#0b1042] rounded-full flex items-center justify-center text-2xl font-black mb-4 mx-auto">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="text-center font-bold text-[#0b1042] truncate">{user?.user_metadata?.full_name || user?.email}</h3>
              <p className="text-center text-xs text-gray-500 mb-6">Customer Account</p>
              
              <div className="space-y-2 border-t border-gray-100 pt-6">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center p-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'orders' ? 'bg-[#0b1042] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package size={18} className="mr-3" /> My Orders
                </button>
                <button 
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full flex items-center p-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'inquiries' ? 'bg-[#0b1042] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <FileText size={18} className="mr-3" /> My Requests
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center p-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'settings' ? 'bg-[#0b1042] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Settings size={18} className="mr-3" /> Account Settings
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm min-h-[500px]">
              
              {activeTab === 'inquiries' && (
                <div>
                  <h2 className="text-2xl font-black text-[#0b1042] mb-6">My Requests & Rentals</h2>
                  
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[1,2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl w-full"></div>)}
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                      <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No inquiries found</h3>
                      <p className="text-gray-500 text-sm">You haven't submitted any service or rental requests yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {inquiries.map(inquiry => (
                        <div key={inquiry.id} className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-xl p-4 shadow-sm flex gap-4 items-center">
                          <img src={inquiry.products?.image_urls?.[0] || '/placeholder-product.jpg'} alt={inquiry.products?.name} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                          <div className="flex-1">
                            <h4 className="font-bold text-[#0b1042]">{inquiry.products?.name}</h4>
                            <p className="text-xs text-gray-500 font-medium capitalize">{inquiry.inquiry_type} • {new Date(inquiry.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${inquiry.status === 'Reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {inquiry.status || 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-black text-[#0b1042] mb-6">Order History</h2>
                  
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl w-full"></div>)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                          <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b border-gray-100 gap-4">
                            <div>
                              <span className="text-xs text-gray-500 font-bold block mb-1">ORDER ID</span>
                              <span className="text-sm font-black text-[#0b1042]">{(order.id as string).substring(0,8).toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 font-bold block mb-1">DATE</span>
                              <span className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 font-bold block mb-1">TOTAL</span>
                              <span className="text-sm font-black metallic-red-text">Rs. {Number(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 font-bold block mb-1">STATUS</span>
                              <span className="text-[10px] font-black px-2 py-1 bg-yellow-100 text-yellow-800 rounded uppercase">{order.status}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.order_items?.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700 font-medium">{item.quantity}x <span className="font-bold text-gray-900">{item.product_name}</span> {item.variant ? `(${item.variant})` : ''}</span>
                                <span className="text-gray-600 font-bold">Rs. {(Number(item.unit_price) * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-xl">
                  <h2 className="text-2xl font-black text-[#0b1042] mb-6">Account Settings</h2>
                  
                  {saveSuccess && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm font-bold">
                      {saveSuccess}
                    </div>
                  )}

                  <div className="mb-8 p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">Full Name</span>
                        <span className="text-sm font-bold text-[#0b1042]">{user?.user_metadata?.full_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">Email Address</span>
                        <span className="text-sm font-bold text-[#0b1042]">{user?.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 font-bold block mb-1">Phone Number</span>
                        <span className="text-sm font-bold text-[#0b1042]">{user?.user_metadata?.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSaveSettings} className="space-y-5">
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Default Shipping Details</h3>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        value={shippingDetails.fullName}
                        onChange={e => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Phone Number</label>
                      <input 
                        type="tel" 
                        value={shippingDetails.phone}
                        onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Street Address</label>
                      <input 
                        type="text" 
                        value={shippingDetails.address}
                        onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">City</label>
                        <input 
                          type="text" 
                          value={shippingDetails.city}
                          onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Postal Code</label>
                        <input 
                          type="text" 
                          value={shippingDetails.postalCode}
                          onChange={e => setShippingDetails({...shippingDetails, postalCode: e.target.value})}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="metallic-red-bg hover:bg-red-700 text-white py-3 px-8 rounded-lg font-black shadow-lg shadow-red-900/30 transition-colors mt-4">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
