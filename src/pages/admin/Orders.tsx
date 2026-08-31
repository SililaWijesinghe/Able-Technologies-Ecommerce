import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Eye, CheckCircle, Clock, XCircle, DollarSign, FileText, Loader2, Download } from 'lucide-react';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(full_name, email, phone)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      const ords = data || [];
      setOrders(ords);

      let completed = 0;
      let pending = 0;
      let cancelled = 0;
      let revenue = 0;

      ords.forEach(o => {
        if (o.status === 'completed' || o.status === 'delivered') completed++;
        else if (o.status === 'pending') pending++;
        else if (o.status === 'cancelled') cancelled++;
        
        if (o.status !== 'cancelled') {
          revenue += Number(o.total_amount || 0);
        }
      });

      setStats({
        total: ords.length,
        completed,
        pending,
        cancelled,
        revenue
      });

    } catch (err) {
      console.error('Error in fetchOrders:', err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyle = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    switch(status.toLowerCase()) {
      case 'completed':
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 size={32} className="animate-spin mb-4 text-[#0b1042]" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Loading Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">All Orders</h1>
          <div className="text-sm text-gray-500 font-medium flex items-center space-x-2 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Orders</span>
            <span>/</span>
            <span className="text-gray-900">All Orders</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{stats.total}</h3>
            <p className="text-xs font-bold text-gray-500">Total Orders</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{stats.completed}</h3>
            <p className="text-xs font-bold text-gray-500">Completed</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{stats.pending}</h3>
            <p className="text-xs font-bold text-gray-500">Pending</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{stats.cancelled}</h3>
            <p className="text-xs font-bold text-gray-500">Cancelled</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Rs. {stats.revenue > 1000000 ? (stats.revenue/1000000).toFixed(1) + 'M' : stats.revenue.toLocaleString()}</h3>
            <p className="text-xs font-bold text-gray-500">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6">
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by order ID, customer, email..." 
              className="w-full pl-10 pr-4 py-2.5 border border-white/60 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-blue-500 bg-white text-gray-600 font-medium">
              <option>Select Date Range</option>
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-blue-500 bg-white text-gray-600 font-medium">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
            <button className="px-4 py-2.5 border border-white/60 rounded-lg text-sm font-bold text-gray-600 flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2.5 border border-white/60 rounded-lg text-sm font-bold text-gray-600 flex items-center space-x-2 hover:bg-gray-50 ml-auto lg:ml-2">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 text-xs font-bold text-gray-900">Order ID</th>
                <th className="p-4 text-xs font-bold text-gray-900">Date</th>
                <th className="p-4 text-xs font-bold text-gray-900">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-900">Total</th>
                <th className="p-4 text-xs font-bold text-gray-900">Payment</th>
                <th className="p-4 text-xs font-bold text-gray-900">Status</th>
                <th className="p-4 text-xs font-bold text-gray-900 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 font-medium text-sm">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customerName = order.users?.full_name || order.shipping_address?.fullName || order.users?.email || 'Unknown';
                  const customerEmail = order.users?.email || '';
                  const customerPhone = order.users?.phone || order.shipping_address?.phone || '';
                  
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="p-4 text-sm font-bold text-blue-600">
                        #AT-{order.id.substring(0, 6).toUpperCase()}
                      </td>
                      <td className="p-4 text-sm text-gray-500 font-medium">
                        {new Date(order.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}<br/>
                        <span className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-gray-900">{customerName}</div>
                        <div className="text-xs text-gray-500">{customerEmail}</div>
                        <div className="text-xs text-gray-500">{customerPhone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-black text-gray-900">Rs. {Number(order.total_amount || 0).toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.payment_status || 'Pending'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{order.payment_method || 'Unknown'}</div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md ${getStatusStyle(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedOrderId(order.id)}
                          className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="View Order"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <OrderDetailsModal 
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
        onStatusUpdate={fetchOrders}
      />
    </div>
  );
}
