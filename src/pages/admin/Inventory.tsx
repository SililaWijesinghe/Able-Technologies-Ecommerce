import { SkeletonTable } from '../../components/ui/Skeleton';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Package, AlertTriangle, XCircle, DollarSign, Search, Filter, 
  Download, Plus, Eye, Edit2, History, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2,
  Box
} from 'lucide-react';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'adjustments' | 'alerts'>('overview');
  const [loading, setLoading] = useState(true);
  
  const [inventory, setInventory] = useState<any[]>([]);
  const [recentMovements, setRecentMovements] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: { count: 0, percentage: 0 },
    lowStock: { count: 0, percentage: 0 },
    outOfStock: { count: 0, percentage: 0 },
    totalValue: 0
  });

  const [locationStats, setLocationStats] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('stock', { ascending: true });
        
      if (productsError) {
        console.error('Error fetching inventory:', productsError);
        return;
      }

      const products = productsData || [];
      setInventory(products);

      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select('*, products(name, sku)')
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (movementsError) {
        console.error('Error fetching movements:', movementsError);
      } else {
        setRecentMovements(movementsData || []);
      }

      // Calculations
      let totalProducts = products.length;
      let inStockCount = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let totalValue = 0;
      const locations: { [key: string]: number } = {};

      products.forEach((p) => {
        // Assume price column is 'price' or 'cost_price'
        const price = Number(p.price || p.cost_price || 0);
        const stock = Number(p.stock || 0);
        totalValue += (price * stock);

        const threshold = p.low_stock_threshold || 5;
        if (stock === 0) {
          outOfStockCount++;
        } else if (stock <= threshold) {
          lowStockCount++;
        } else {
          inStockCount++;
        }

        const loc = p.location || 'Main Warehouse';
        locations[loc] = (locations[loc] || 0) + stock;
      });

      setStats({
        totalProducts,
        inStock: { 
          count: inStockCount, 
          percentage: totalProducts > 0 ? Math.round((inStockCount/totalProducts)*100) : 0 
        },
        lowStock: { 
          count: lowStockCount, 
          percentage: totalProducts > 0 ? Math.round((lowStockCount/totalProducts)*100) : 0 
        },
        outOfStock: { 
          count: outOfStockCount, 
          percentage: totalProducts > 0 ? Math.round((outOfStockCount/totalProducts)*100) : 0 
        },
        totalValue
      });

      setLocationStats(locations);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getStockStatus = (stock: number, threshold: number = 5) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= threshold) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'out of stock': return 'text-red-500';
      case 'low stock': return 'text-orange-500';
      case 'in stock': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) return <div className="p-6"><SkeletonTable /></div>;

  const topLowStock = [...inventory]
    .filter(p => p.stock > 0)
    .sort((a,b) => a.stock - b.stock)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Inventory Management</h1>
          <div className="text-sm text-gray-500 font-medium flex items-center space-x-2 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900">Inventory</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Box size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.totalProducts}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Total Products</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
              <Package size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.inStock.count}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">In Stock</p>
            <p className="text-xs text-slate-500 mt-1">{stats.inStock.percentage}% of total</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.lowStock.count}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Low Stock</p>
            <p className="text-xs text-slate-500 mt-1">{stats.lowStock.percentage}% of total</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <XCircle size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stats.outOfStock.count}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Out of Stock</p>
            <p className="text-xs text-slate-500 mt-1">{stats.outOfStock.percentage}% of total</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <DollarSign size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              Rs. {stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Total Stock Value</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 overflow-x-auto">
          {['overview', 'movements', 'adjustments', 'alerts'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors capitalize ${
                activeTab === tab ? 'border-[#0b1042] text-[#0b1042]' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' ? 'Stock Overview' : 
               tab === 'movements' ? 'Stock Movements' : 
               tab === 'adjustments' ? 'Adjustments' : 'Stock Alerts'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search SKU, Product Name..." 
              className="w-full pl-10 pr-4 py-2.5 border border-white/60 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-[#0b1042] bg-white text-gray-600 font-medium">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Accessories</option>
            </select>
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-[#0b1042] bg-white text-gray-600 font-medium">
              <option>All Brands</option>
              <option>Brand A</option>
              <option>Brand B</option>
            </select>
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-[#0b1042] bg-white text-gray-600 font-medium">
              <option>All Locations</option>
              <option>Main Warehouse</option>
              <option>Branch A</option>
            </select>
            <select className="border border-white/60 rounded-lg text-sm p-2.5 outline-none focus:border-[#0b1042] bg-white text-gray-600 font-medium">
              <option>All Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
            <button className="px-4 py-2.5 border border-white/60 rounded-lg text-sm font-bold text-gray-600 flex items-center space-x-2 hover:bg-gray-50">
              <Download size={16} />
              <span>Export</span>
            </button>
            <button className="px-4 py-2.5 bg-[#0b1042] text-white rounded-lg text-sm font-bold flex items-center space-x-2 hover:bg-gray-800 transition-colors">
              <Plus size={16} />
              <span>Add Stock Adjustment</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {activeTab === 'overview' && (
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="p-4 text-xs font-bold text-gray-900">Product</th>
                  <th className="p-4 text-xs font-bold text-gray-900">SKU</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Category</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Location</th>
                  <th className="p-4 text-xs font-bold text-gray-900 text-center">Stock</th>
                  <th className="p-4 text-xs font-bold text-gray-900 text-center">Reserved</th>
                  <th className="p-4 text-xs font-bold text-gray-900 text-center">Available</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-900">Last Updated</th>
                  <th className="p-4 text-xs font-bold text-gray-900 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr><td colSpan={11} className="p-8 text-center text-gray-500 text-sm">No inventory items found.</td></tr>
                ) : (
                  inventory.map((item) => {
                    const status = getStockStatus(item.stock, item.low_stock_threshold || 5);
                    const reserved = item.reserved_stock || 0;
                    const available = Math.max(0, item.stock - reserved);
                    const updated = item.updated_at ? new Date(item.updated_at) : new Date(item.created_at);

                    return (
                      <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30">
                        <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-white/60 overflow-hidden shrink-0 flex items-center justify-center text-slate-500">
                              {item.image_urls?.[0] ? (
                                <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                              ) : (
                                <Package size={20} />
                              )}
                            </div>
                            <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-600">{item.sku || '-'}</td>
                        <td className="p-4 text-sm font-medium text-gray-600">{item.category_id || item.category || '-'}</td>
                        <td className="p-4 text-sm font-medium text-gray-600">{item.location || 'Main Warehouse'}</td>
                        <td className="p-4 text-center">
                          <span className={`text-sm font-black ${status.color.split(' ')[1]}`}>{item.stock}</span>
                        </td>
                        <td className="p-4 text-center text-sm font-medium text-gray-500">{reserved}</td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-black text-[#0b1042]">{available}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md ${status.color}`}>
                            {item.stock_status || status.label}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-500">
                          {updated.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="View">
                              <Eye size={14} />
                            </button>
                            <button className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            <button className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="History">
                              <History size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
          {activeTab !== 'overview' && (
             <div className="p-12 text-center text-gray-500 font-medium">
               This tab ({activeTab}) is under construction for detailed reporting.
             </div>
          )}
        </div>
      </div>

      {/* Bottom Analytics Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stock by Status */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4">Stock by Status</h3>
          <div className="flex items-center justify-center h-40">
             {/* Simple visual donut representation */}
             <div className="relative w-32 h-32 rounded-full border-[12px] border-green-500 border-l-orange-500 border-r-red-500 transform rotate-45 flex items-center justify-center">
                <div className="absolute transform -rotate-45 text-center">
                   <div className="text-xl font-black text-gray-900">{stats.totalProducts}</div>
                   <div className="text-[10px] uppercase font-bold text-gray-500">Items</div>
                </div>
             </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-gray-600">In Stock</span></div>
              <span className="font-bold">{stats.inStock.count} <span className="text-slate-500 font-normal">({stats.inStock.percentage}%)</span></span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div><span className="text-gray-600">Low Stock</span></div>
              <span className="font-bold">{stats.lowStock.count} <span className="text-slate-500 font-normal">({stats.lowStock.percentage}%)</span></span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-gray-600">Out of Stock</span></div>
              <span className="font-bold">{stats.outOfStock.count} <span className="text-slate-500 font-normal">({stats.outOfStock.percentage}%)</span></span>
            </div>
          </div>
        </div>

        {/* Stock by Location */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4">Stock by Location</h3>
          <div className="flex items-center justify-center h-40">
             <div className="relative w-32 h-32 rounded-full border-[12px] border-blue-500 border-b-purple-500 transform -rotate-12 flex items-center justify-center">
                <div className="absolute transform rotate-12 text-center">
                   <div className="text-xl font-black text-gray-900">
                     {Object.values(locationStats).reduce((a: number, b: number) => a + b, 0).toLocaleString()}
                   </div>
                   <div className="text-[10px] uppercase font-bold text-gray-500">Units</div>
                </div>
             </div>
          </div>
          <div className="mt-4 space-y-2">
            {Object.entries(locationStats).map(([loc, count], idx) => (
              <div key={loc} className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                  <span className="text-gray-600">{loc}</span>
                </div>
                <span className="font-bold">{count.toLocaleString()}</span>
              </div>
            ))}
            {Object.keys(locationStats).length === 0 && (
              <div className="text-sm text-gray-500 text-center">No locations mapped.</div>
            )}
          </div>
        </div>

        {/* Top Low Stock Items */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4">Top Low Stock Items</h3>
          <div className="space-y-4">
            {topLowStock.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">No low stock items.</div>
            ) : (
              topLowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-gray-100 border border-white/60 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image_urls?.[0] ? (
                        <img src={item.image_urls[0]} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                      ) : <Package size={14} className="text-slate-500" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-orange-600">{item.stock} left</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Stock Movements */}
        <div className="bg-white/50 border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-900">Recent Movements</h3>
          </div>
          <div className="space-y-4">
            {recentMovements.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8">No recent movements.</div>
            ) : (
              recentMovements.slice(0,3).map((mov) => (
                <div key={mov.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      mov.movement_type === 'Added' ? 'bg-green-100 text-green-600' :
                      mov.movement_type === 'Deducted' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {mov.movement_type === 'Added' ? <ArrowUpRight size={14} /> : 
                       mov.movement_type === 'Deducted' ? <ArrowDownRight size={14} /> : <RefreshCw size={14} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{mov.products?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 font-medium">{new Date(mov.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-black ${
                    mov.movement_type === 'Added' ? 'text-green-600' :
                    mov.movement_type === 'Deducted' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {mov.movement_type === 'Added' ? '+' : mov.movement_type === 'Deducted' ? '-' : ''}{mov.quantity}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
