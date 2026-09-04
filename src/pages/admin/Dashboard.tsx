import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Package, Users, Clock, DollarSign, 
  ArrowRight, Eye, Plus, Grid, ImageIcon, FileText, Settings, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  async function fetchDashboardData() {

      try {
        setLoading(true);
        const [
          { count: ordersCount },
          { count: productsCount },
          { count: customersCount },
          { count: pendingCount },
          { data: revenueData },
          { data: recentOrdersData },
          { data: lowStockData }
        ] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'CUSTOMER'),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('orders').select('total_amount').neq('status', 'cancelled'),
          supabase.from('orders').select('*, users(full_name, email)').order('created_at', { ascending: false }).limit(5),
          supabase.from('products').select('*').order('stock', { ascending: true }).limit(4)
        ]);

        const revenue = (revenueData || []).reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

        setStats({
          totalOrders: ordersCount || 0,
          totalProducts: productsCount || 0,
          totalCustomers: customersCount || 0,
          pendingOrders: pendingCount || 0,
          totalRevenue: revenue,
        });

        const formattedOrders = (recentOrdersData || []).map(order => {
          let customerName = 'Unknown Customer';
          if (order.users?.full_name) {
            customerName = order.users.full_name;
          } else if (order.shipping_address?.fullName) {
            customerName = order.shipping_address.fullName;
          } else if (order.users?.email) {
            customerName = order.users.email;
          }

          return {
            id: `#AT-${order.id.substring(0, 6).toUpperCase()}`,
            rawId: order.id,
            customer: customerName,
            date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            total: `Rs. ${Number(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            status: order.status
          };
        });
        setRecentOrders(formattedOrders);

        const formattedLowStock = (lowStockData || []).map(product => ({
          name: product.name,
          stock: product.stock,
          type: 'pcs',
          img: product.image_urls?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200'
        }));
        setLowStock(formattedLowStock);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metrics = [
    { title: 'Total Orders', value: stats.totalOrders.toString(), link: 'View all orders', to: '/admin/orders', icon: ShoppingBag, color: 'blue' },
    { title: 'Total Products', value: stats.totalProducts.toString(), link: 'View all products', to: '/admin/products', icon: Package, color: 'green' },
    { title: 'Total Customers', value: stats.totalCustomers.toString(), link: 'View all customers', to: '/admin/customers', icon: Users, color: 'purple' },
    { title: 'Pending Orders', value: stats.pendingOrders.toString(), link: 'View pending orders', to: '/admin/orders', icon: Clock, color: 'orange' },
    { title: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, link: 'View reports', to: '/admin/reports', icon: DollarSign, color: 'red' },
  ];

  const getColorClasses = (color: string) => {
    const map: Record<string, { bg: string, text: string, stroke: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', stroke: '#2563eb' },
      green: { bg: 'bg-green-100', text: 'text-green-600', stroke: '#16a34a' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', stroke: '#9333ea' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', stroke: '#ea580c' },
      red: { bg: 'bg-red-100', text: 'text-red-600', stroke: '#dc2626' },
    };
    return map[color] || map.blue;
  };

  const getStatusStyle = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-700';
    switch(status.toLowerCase()) {
      case 'completed':
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-orange-100 text-orange-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const quickActions = [
    { title: 'Add New Product', desc: 'Add a new product', to: '/admin/products/new', icon: Plus, color: 'blue' },
    { title: 'Manage Categories', desc: 'Edit categories', to: '/admin/categories', icon: Grid, color: 'green' },
    { title: 'Manage Banners', desc: 'Update banners', to: '/admin/banners', icon: ImageIcon, color: 'orange' },
    { title: 'View Orders', desc: 'Manage all orders', to: '/admin/orders', icon: FileText, color: 'purple' },
    { title: 'Store Settings', desc: 'General settings', to: '/admin/settings', icon: Settings, color: 'red' },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 size={32} className="animate-spin mb-4 text-[#0b1042]" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => {
          const colors = getColorClasses(metric.color);
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-start space-x-4 z-10 relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{metric.value}</h3>
                  <p className="text-xs font-bold text-gray-500 mb-2">{metric.title}</p>
                  <Link to={metric.to} className={`text-[11px] font-black flex items-center group-hover:underline ${colors.text}`}>
                    {metric.link} <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
              
              {/* Sparkline Decorative SVG */}
              <div className="absolute bottom-0 left-0 w-full h-12 opacity-30 pointer-events-none transform translate-y-2">
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                  <path 
                    d="M0,15 Q10,5 20,10 T40,15 T60,5 T80,10 T100,5 L100,20 L0,20 Z" 
                    fill={`url(#grad-${metric.color})`} 
                    opacity="0.3"
                  />
                  <path 
                    d="M0,15 Q10,5 20,10 T40,15 T60,5 T80,10 T100,5" 
                    fill="none" 
                    stroke={colors.stroke} 
                    strokeWidth="1" 
                  />
                  <defs>
                    <linearGradient id={`grad-${metric.color}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={colors.stroke} stopOpacity="1"/>
                      <stop offset="100%" stopColor={colors.stroke} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Recent Orders (60%) */}
        <div className="lg:col-span-3 bg-white/50 border border-gray-100 rounded-2xl shadow-sm">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-bold px-4 py-2 border border-white/60 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-4 text-xs font-bold text-gray-900">Order ID</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Customer</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Date</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Total</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-900 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 font-medium text-sm">No recent orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="p-4 text-sm font-bold text-blue-600">{order.id}</td>
                      <td className="p-4 text-sm font-medium text-gray-700">{order.customer}</td>
                      <td className="p-4 text-sm text-gray-500 font-medium">{order.date}</td>
                      <td className="p-4 text-sm font-black text-gray-900">{order.total}</td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md ${getStatusStyle(order.status)}`}>
                          {order.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedOrderId(order.rawId)} className="inline-flex text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm cursor-pointer" title="View Order">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products (40%) */}
        <div className="lg:col-span-2 bg-white/50 border border-gray-100 rounded-2xl shadow-sm">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-900">Low Stock Products</h2>
            <Link to="/admin/products" className="text-xs font-bold px-4 py-2 border border-white/60 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              View All Products
            </Link>
          </div>
          <div className="p-2">
            {lowStock.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium text-sm">No low stock alerts.</div>
            ) : (
              lowStock.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-white/60 overflow-hidden shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <span className="text-xs font-bold text-red-500">Stock: {item.stock} {item.type}</span>
                    </div>
                  </div>
                  <Link to="/admin/inventory" className="text-xs font-bold border border-white/60 px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shrink-0 whitespace-nowrap">
                    Update Stock
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Quick Actions */}
      <div>
        <h2 className="text-lg font-black text-gray-900 mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, idx) => {
            const colors = getColorClasses(action.color);
            const Icon = action.icon;
            return (
              <Link key={idx} to={action.to} className={`border border-gray-100/50 rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-1 bg-opacity-30 ${colors.bg}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white/60 shadow-sm ${colors.text}`}>
                  <Icon size={20} />
                </div>
                <h4 className="text-sm font-black text-gray-900 mb-1">{action.title}</h4>
                <p className="text-xs font-medium text-gray-600">{action.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Footer / Copyright */}
      <div className="flex justify-between items-center text-xs font-medium text-slate-500 pt-8 pb-4">
        <span>© 2024 Able Technologies (Pvt) Ltd. All rights reserved.</span>
        <span>Version 1.0.0</span>
      </div>

      <OrderDetailsModal 
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
        onStatusUpdate={fetchDashboardData}
      />
    </div>
  );
}
