import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Loader2, MapPin, Mail, Phone, Calendar, ShoppingBag, CreditCard } from 'lucide-react';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

export default function CustomerDetailsModal({ isOpen, onClose, customerId }: CustomerDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerDetails();
    }
  }, [isOpen, customerId]);

  async function fetchCustomerDetails() {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', customerId)
        .single();
        
      if (userError) throw userError;
      setCustomer(userData);

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

    } catch (err) {
      console.error('Error fetching customer details:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const totalSpent = orders.reduce((sum, o) => {
    if (o.status !== 'cancelled') {
      return sum + Number(o.total_amount || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-black text-gray-900">Customer Details</h2>
            {customer && <p className="text-sm text-gray-500 font-medium mt-1">ID: {customer.id}</p>}
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
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Profile...</p>
            </div>
          ) : customer ? (
            <div className="space-y-8">
              
              {/* Profile Card */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-black shrink-0">
                  {customer.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || customer.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-black text-gray-900">{customer.full_name || 'Unknown Name'}</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Mail size={16} className="text-gray-400" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Phone size={16} className="text-gray-400" />
                      <span>{customer.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <div className={`w-2 h-2 rounded-full ${customer.is_active !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-bold">{customer.is_active !== false ? 'Active Account' : 'Inactive Account'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Total Orders</p>
                    <p className="text-xl font-black text-gray-900">{orders.length}</p>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Lifetime Spend</p>
                    <p className="text-xl font-black text-gray-900">Rs. {totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-900 font-black border-b border-gray-100 pb-2">
                  <ShoppingBag size={18} className="text-gray-400" />
                  <h3>Order History ({orders.length})</h3>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-3 font-bold text-gray-900">Order ID</th>
                        <th className="p-3 font-bold text-gray-900">Date</th>
                        <th className="p-3 font-bold text-gray-900">Status</th>
                        <th className="p-3 font-bold text-gray-900 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-gray-500">No orders found.</td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-bold text-blue-600">#AT-{order.id.substring(0, 6).toUpperCase()}</td>
                            <td className="p-3 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-1 rounded ${
                                order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'processing' ? 'bg-orange-100 text-orange-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.status || 'Pending'}
                              </span>
                            </td>
                            <td className="p-3 text-right font-black text-gray-900">Rs. {Number(order.total_amount || 0).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 font-medium">Customer not found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
