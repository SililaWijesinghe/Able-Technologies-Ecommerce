import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Eye, Users, UserCheck, UserPlus, DollarSign, Activity, FileText, Loader2, Download, Plus, MoreVertical, Edit2, Phone } from 'lucide-react';
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    totalSpend: 0,
    avgOrderValue: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      // Fetch customers
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'CUSTOMER')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all orders to compute stats
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount, status, shipping_address');

      if (ordersError) throw ordersError;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      let activeCount = 0;
      let newCount = 0;
      let totalPlatformSpend = 0;
      let validOrdersCount = 0;

      const customersWithStats = (usersData || []).map((user) => {
        const userOrders = (ordersData || []).filter(o => o.user_id === user.id);
        
        let spend = 0;
        let validOrders = 0;
        let latestCity = 'Unknown';
        
        // Find latest city from shipping address
        for (let i = userOrders.length - 1; i >= 0; i--) {
          if (userOrders[i].shipping_address?.city) {
            latestCity = userOrders[i].shipping_address.city;
            break;
          }
        }

        userOrders.forEach(o => {
          if (o.status !== 'cancelled') {
            spend += Number(o.total_amount || 0);
            validOrders++;
            totalPlatformSpend += Number(o.total_amount || 0);
            validOrdersCount++;
          }
        });

        const isActive = user.is_active !== false;
        if (isActive) activeCount++;
        
        const joinDate = new Date(user.created_at);
        if (joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear) {
          newCount++;
        }

        return {
          ...user,
          totalOrders: userOrders.length,
          totalSpent: spend,
          location: latestCity,
          isActive
        };
      });

      setCustomers(customersWithStats);
      
      setStats({
        total: customersWithStats.length,
        active: activeCount,
        newThisMonth: newCount,
        totalSpend: totalPlatformSpend,
        avgOrderValue: validOrdersCount > 0 ? totalPlatformSpend / validOrdersCount : 0
      });

    } catch (err) {
      console.error('Error in fetchCustomers:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6"><SkeletonTable /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Customers</h1>
          <div className="text-sm text-gray-500 font-medium flex items-center space-x-2 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900">Customers</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Users size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.total}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Total Customers</p>
            <a href="#" className="text-xs font-bold text-blue-600 mt-2 inline-block">View all customers &rarr;</a>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
              <UserCheck size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.active}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Active Customers</p>
            <p className="text-xs text-slate-500 mt-2">{stats.total > 0 ? Math.round((stats.active/stats.total)*100) : 0}% of total</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <UserPlus size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.newThisMonth}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">New This Month</p>
            <p className="text-xs text-slate-500 mt-2">{stats.total > 0 ? Math.round((stats.newThisMonth/stats.total)*100) : 0}% of total</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <DollarSign size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              Rs. {stats.totalSpend > 1000000 ? (stats.totalSpend/1000000).toFixed(1) + 'M' : stats.totalSpend.toLocaleString()}
            </h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Total Customer Spend</p>
            <a href="#" className="text-xs font-bold text-blue-600 mt-2 inline-block">View report &rarr;</a>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
              <Activity size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              Rs. {Math.round(stats.avgOrderValue).toLocaleString()}
            </h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Avg. Order Value</p>
            <a href="#" className="text-xs font-bold text-blue-600 mt-2 inline-block">View analytics &rarr;</a>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6">
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email, phone..." 
              className="w-full pl-10 pr-4 py-2.5 border border-white/60 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-[#0b1042] bg-white text-gray-600 font-medium">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-[#0b1042] bg-white text-gray-600 font-medium">
              <option>All Locations</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
            </select>
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-[#0b1042] bg-white text-gray-600 font-medium">
              <option>All Registration Date</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
            <button className="px-4 py-2.5 border border-white/60 rounded-lg text-sm font-bold text-gray-600 flex items-center space-x-2 hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2.5 border border-white/60 rounded-lg text-sm font-bold text-gray-600 flex items-center space-x-2 hover:bg-gray-50">
              <Download size={16} />
              <span>Export</span>
            </button>
            <button className="px-4 py-2.5 bg-[#0b1042] text-white rounded-lg text-sm font-bold flex items-center space-x-2 hover:bg-gray-800 transition-colors">
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 text-xs font-bold text-gray-900">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-900">Contact</th>
                <th className="p-4 text-xs font-bold text-gray-900">Location</th>
                <th className="p-4 text-xs font-bold text-gray-900 text-center">Total Orders</th>
                <th className="p-4 text-xs font-bold text-gray-900 text-right">Total Spent</th>
                <th className="p-4 text-xs font-bold text-gray-900">Status</th>
                <th className="p-4 text-xs font-bold text-gray-900">Joined Date</th>
                <th className="p-4 text-xs font-bold text-gray-900 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500 font-medium text-sm">No customers found.</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">
                          {c.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || c.email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{c.full_name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={14} className="text-slate-500" />
                        <span>{c.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-gray-900">{c.location}</div>
                      <div className="text-xs text-gray-500">Sri Lanka</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm font-black text-gray-900">{c.totalOrders}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-black text-gray-900">Rs. {c.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-[11px] uppercase tracking-wider font-bold ${c.isActive ? 'text-green-700' : 'text-red-700'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-medium">
                      {new Date(c.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}<br/>
                      <span className="text-xs text-slate-500">{new Date(c.created_at).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => setSelectedCustomerId(c.id)}
                          className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="View Profile"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="Edit Profile">
                          <Edit2 size={14} />
                        </button>
                        <button className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="More">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1 to {Math.min(10, customers.length)} of {customers.length} results</div>
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <select className="border border-white/60 rounded p-1 outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>per page</span>
            <div className="flex items-center ml-4 space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-white/60 hover:bg-gray-50">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0b1042] text-slate-800 font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-white/60 hover:bg-gray-50 font-medium">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-white/60 hover:bg-gray-50 font-medium">3</button>
              <span>...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-white/60 hover:bg-gray-50">&gt;</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Customers by Status */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4">Customers by Status</h3>
          <div className="flex items-center justify-center h-40">
             {/* Mock Donut Chart */}
             <div className="relative w-32 h-32 rounded-full border-[12px] border-green-500 border-l-red-500 transform rotate-45 flex items-center justify-center">
                <div className="absolute transform -rotate-45 text-center">
                   <div className="text-xl font-black text-gray-900">{stats.total}</div>
                </div>
             </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-gray-600">Active</span></div>
              <span className="font-bold">{stats.active} <span className="text-slate-500 font-normal">({stats.total > 0 ? Math.round(stats.active/stats.total*100) : 0}%)</span></span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-gray-600">Inactive</span></div>
              <span className="font-bold">{stats.total - stats.active} <span className="text-slate-500 font-normal">({stats.total > 0 ? Math.round((stats.total-stats.active)/stats.total*100) : 0}%)</span></span>
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4">Top Customers by Spend</h3>
          <div className="space-y-4">
            {customers.sort((a,b) => b.totalSpent - a.totalSpent).slice(0,4).map((c, idx) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-600'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{c.full_name || 'Unknown'}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">Rs. {c.totalSpent.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* New Customers This Month */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-900">New Customers</h3>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">{stats.newThisMonth}</span>
          </div>
          <div className="h-40 flex items-end space-x-1 pt-4">
            {/* Sparkline mock */}
            {[10, 20, 15, 25, 22, 35, 40, 30, 28].map((h, i) => (
              <div key={i} className="flex-1 bg-green-100 rounded-t relative group transition-all duration-300 hover:bg-green-200" style={{ height: `${h}%` }}>
                 <div className="w-2 h-2 rounded-full bg-green-500 absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
            <span>May 01</span>
            <span>May 15</span>
            <span>May 31</span>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4">Customer Insights</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">Repeat Customers</p>
                <p className="text-sm font-black text-gray-900">
                  {customers.filter(c => c.totalOrders > 1).length} 
                  <span className="text-slate-500 font-medium ml-1">
                    ({stats.total > 0 ? Math.round(customers.filter(c => c.totalOrders > 1).length / stats.total * 100) : 0}%)
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">Avg. Orders per Customer</p>
                <p className="text-sm font-black text-gray-900">
                  {stats.total > 0 ? (customers.reduce((sum,c)=>sum+c.totalOrders,0) / stats.total).toFixed(1) : 0}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">Customer Retention Rate</p>
                <p className="text-sm font-black text-gray-900">68.7%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CustomerDetailsModal 
        isOpen={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        customerId={selectedCustomerId}
      />
    </div>
  );
}
