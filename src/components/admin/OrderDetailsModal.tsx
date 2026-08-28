import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Loader2, Package, MapPin, CreditCard } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  onStatusUpdate: () => void;
}

export default function OrderDetailsModal({ isOpen, onClose, orderId, onStatusUpdate }: OrderDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  async function fetchOrderDetails() {
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, users(full_name, email, phone)')
        .eq('id', orderId)
        .single();
        
      if (orderError) throw orderError;
      setOrder(orderData);
      setNewStatus(orderData.status || 'pending');

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*, products(name, image_urls)')
        .eq('order_id', orderId);
        
      if (itemsError) throw itemsError;
      setItems(itemsData || []);

    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async () => {
    if (!orderId || newStatus === order?.status) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      setOrder({ ...order, status: newStatus });
      onStatusUpdate();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-black text-gray-900">Order Details</h2>
            {order && <p className="text-sm text-gray-500 font-medium mt-1">ID: {order.id}</p>}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[#0b1042] mb-4" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Order...</p>
            </div>
          ) : order ? (
            <div className="space-y-8">
              
              {/* Status Update Banner */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Status</p>
                  <span className={`inline-flex px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md ${
                    order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg text-sm p-2 outline-none focus:border-[#0b1042] bg-white font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    onClick={handleStatusUpdate}
                    disabled={updating || newStatus === order.status}
                    className="bg-[#0b1042] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {updating && <Loader2 size={16} className="animate-spin mr-2" />}
                    Update
                  </button>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-900 font-black border-b border-gray-100 pb-2">
                    <MapPin size={18} className="text-gray-400" />
                    <h3>Shipping Address</h3>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm">
                    <p className="font-bold text-gray-900 mb-1">{order.shipping_address?.fullName || order.users?.full_name || 'Unknown'}</p>
                    <p className="text-gray-600 leading-relaxed">
                      {order.shipping_address?.address}<br/>
                      {order.shipping_address?.city}, {order.shipping_address?.postalCode}
                    </p>
                    <p className="text-gray-600 mt-2 flex flex-col">
                      <span>📞 {order.shipping_address?.phone || order.users?.phone || 'N/A'}</span>
                      <span>✉️ {order.users?.email || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-900 font-black border-b border-gray-100 pb-2">
                    <CreditCard size={18} className="text-gray-400" />
                    <h3>Payment Details</h3>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500 font-medium">Method</span>
                      <span className="font-bold text-gray-900">{order.payment_method || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500 font-medium">Status</span>
                      <span className={`font-bold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.payment_status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
                      <span className="text-gray-900 font-black">Total Amount</span>
                      <span className="font-black text-blue-600 text-lg">
                        Rs. {Number(order.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-black border-b border-gray-100 pb-2">
                  <Package size={18} className="text-gray-400" />
                  <h3>Order Items ({items.length})</h3>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-3 font-bold text-gray-900">Product</th>
                        <th className="p-3 font-bold text-gray-900 text-center">Qty</th>
                        <th className="p-3 font-bold text-gray-900 text-right">Price</th>
                        <th className="p-3 font-bold text-gray-900 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.products?.image_urls?.[0] ? (
                                <img src={item.products.image_urls[0]} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                              ) : <Package size={16} className="text-gray-400" />}
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-[200px]">{item.products?.name || 'Unknown Product'}</span>
                          </td>
                          <td className="p-3 text-center font-bold text-gray-600">{item.quantity}</td>
                          <td className="p-3 text-right font-medium text-gray-600">Rs. {Number(item.price).toLocaleString()}</td>
                          <td className="p-3 text-right font-black text-gray-900">Rs. {(Number(item.price) * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 font-medium">Order not found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
