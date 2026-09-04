import { SkeletonTable } from '../../components/ui/Skeleton';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Search, X, Tag, Box, AlertCircle, Info, Shield, Activity, FileText, List, Filter, Eye, Edit, Trash, Package, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Products() {
  
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name), brands(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const prods = data || [];
      setProducts(prods);

      let inStock = 0;
      let lowStock = 0;
      let outOfStock = 0;

      prods.forEach(p => {
        if (p.stock === 0) outOfStock++;
        else if (p.stock <= (p.low_stock_threshold || 5)) lowStock++;
        else inStock++;
      });

      setStats({
        total: prods.length,
        inStock,
        lowStock,
        outOfStock
      });

    } catch (err) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  const getStockStatus = (stock: number, threshold: number = 5) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= threshold) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productToDelete.id);
      if (!error) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setProductToDelete(null);
        toast.success('Product deleted successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      const status = getStockStatus(p.stock, p.low_stock_threshold).label.toUpperCase();
      matchesStatus = status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6"><SkeletonTable /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">All Products</h1>
          <div className="text-sm text-gray-500 font-medium flex items-center space-x-2 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-gray-900">All Products</span>
          </div>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">{stats.total}</h3>
            <p className="text-xs font-bold text-gray-500">Total Products</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">{stats.inStock}</h3>
            <p className="text-xs font-bold text-gray-500">In Stock</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">{stats.lowStock}</h3>
            <p className="text-xs font-bold text-gray-500">Low Stock</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">{stats.outOfStock}</h3>
            <p className="text-xs font-bold text-gray-500">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search products by name, SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/60 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042]"
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-white/60 rounded-lg text-sm font-bold text-gray-600 bg-white focus:outline-none focus:border-[#0b1042] w-full sm:w-auto outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="IN STOCK">In Stock</option>
              <option value="LOW STOCK">Low Stock</option>
              <option value="OUT OF STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 text-xs font-bold text-gray-900">Product</th>
                <th className="p-4 text-xs font-bold text-gray-900">SKU</th>
                <th className="p-4 text-xs font-bold text-gray-900">Category</th>
                <th className="p-4 text-xs font-bold text-gray-900">Brand</th>
                <th className="p-4 text-xs font-bold text-gray-900">Price (Rs.)</th>
                <th className="p-4 text-xs font-bold text-gray-900">Stock</th>
                <th className="p-4 text-xs font-bold text-gray-900">Status</th>
                <th className="p-4 text-xs font-bold text-gray-900 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500 font-medium text-sm">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock, product.low_stock_threshold);
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-white/60 overflow-hidden shrink-0">
                            <img src={product.image_urls?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200'} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 max-w-[200px] truncate">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500 font-medium">{product.sku || '-'}</td>
                      <td className="p-4 text-sm text-gray-500 font-medium">{product.categories?.name || product.category_id || '-'}</td>
                      <td className="p-4 text-sm text-gray-500 font-medium">{product.brands?.name || product.brand_id || product.brand || '-'}</td>
                      <td className="p-4 text-sm font-black text-gray-900">
                        {Number(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`p-4 text-sm font-black ${status.color.split(' ')[1]}`}>{product.stock || 0}</td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-1 rounded-md ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => setViewProduct(product)} className="text-slate-500 hover:text-gray-900 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="View">
                            <Eye size={18}/>
                          </button>
                          <Link to={`/admin/products/edit/${product.id}`} className="text-slate-500 hover:text-blue-600 transition-colors p-1.5 border border-white/60 rounded-lg hover:bg-white shadow-sm" title="Edit">
                            <Edit size={18}/>
                          </Link>
                          <button onClick={() => setProductToDelete(product)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Product">
                            <Trash size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* COMPREHENSIVE PRODUCT VIEW MODAL */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">{viewProduct.name}</h2>
                  <p className="text-sm font-bold text-gray-500">SKU: {viewProduct.sku || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  to={`/admin/products/edit/${viewProduct.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Link>
                <button 
                  onClick={() => setViewProduct(null)} 
                  className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Visuals & Badges */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Image Gallery */}
                  <div className="space-y-3">
                    <div className="w-full aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden relative">
                      {viewProduct.image_urls && viewProduct.image_urls.length > 0 ? (
                        <img 
                          src={viewProduct.image_urls[0]} 
                          alt={viewProduct.name} 
                          className="w-full h-full object-contain mix-blend-multiply p-4"
                        />
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                          <Box size={48} className="mb-2 opacity-20" />
                          <span className="text-sm font-bold">No Image Available</span>
                        </div>
                      )}
                      
                      {/* Status Badge Float */}
                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                          viewProduct.status === 'active' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {viewProduct.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Thumbnails if multiple */}
                    {viewProduct.image_urls && viewProduct.image_urls.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {viewProduct.image_urls.map((url: string, idx: number) => (
                          <div key={idx} className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 shrink-0 overflow-hidden">
                            <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Highlights/Badges */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Product Flags</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewProduct.is_service && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">
                          <Activity size={14} />
                          <span>Service Provider</span>
                        </span>
                      )}
                      {viewProduct.is_oeko_tex && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <Shield size={14} />
                          <span>Oeko-Tex Certified</span>
                        </span>
                      )}
                      {(!viewProduct.is_service && !viewProduct.is_oeko_tex) && (
                        <span className="text-sm font-medium text-gray-500">Standard Product</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Core Details & Rules */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Core Details Grid */}
                  <div>
                    <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center">
                      <List size={16} className="mr-2 text-gray-400" /> General Information
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Brand</p>
                        <p className="text-sm font-semibold text-gray-900">{viewProduct.brand || 'Unbranded'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</p>
                        <p className="text-sm font-semibold text-gray-900">{viewProduct.category || 'Uncategorized'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{viewProduct.description || 'No description provided.'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div>
                    <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center">
                      <Tag size={16} className="mr-2 text-gray-400" /> Pricing Structure
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-1">Selling Price</p>
                        <p className="text-lg font-black text-gray-900">Rs. {viewProduct.price?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-70">
                        <p className="text-xs font-bold text-gray-500 mb-1">Compare At</p>
                        <p className="text-lg font-black text-gray-500 line-through">Rs. {viewProduct.compare_at_price?.toLocaleString() || '-'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 mb-1">Cost Price</p>
                        <p className="text-lg font-black text-gray-900">Rs. {viewProduct.cost_price?.toLocaleString() || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Inventory & Stock Metrics */}
                  <div>
                    <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center">
                      <Box size={16} className="mr-2 text-gray-400" /> Inventory Health
                    </h3>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          viewProduct.stock === 0 ? 'bg-red-100 text-red-600' :
                          viewProduct.stock <= (viewProduct.low_stock_threshold || 5) ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {viewProduct.stock === 0 ? <XCircle size={24} /> : 
                           viewProduct.stock <= (viewProduct.low_stock_threshold || 5) ? <AlertCircle size={24} /> : 
                           <CheckCircle size={24} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-1">Current Stock</p>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-black text-gray-900">{viewProduct.stock || 0}</span>
                            <span className="text-sm font-medium text-gray-500">units</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-px bg-gray-200"></div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-1">Low Stock Alert at</p>
                        <p className="text-lg font-black text-gray-900">{viewProduct.low_stock_threshold || 5} <span className="text-sm font-medium text-gray-500">units</span></p>
                      </div>
                    </div>
                  </div>

                  {/* B2B Configuration */}
                  <div>
                    <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center">
                      <Shield size={16} className="mr-2 text-gray-400" /> B2B & Transaction Rules
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-white shadow-sm">
                        <span className="text-xs font-bold text-gray-400 mb-2 uppercase">Transaction Type</span>
                        <span className="text-sm font-black text-gray-800 capitalize">{viewProduct.transaction_type || 'Sale'}</span>
                      </div>
                      <div className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm ${viewProduct.requires_quote ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                        <span className={`text-xs font-bold mb-2 uppercase ${viewProduct.requires_quote ? 'text-blue-600' : 'text-gray-400'}`}>Requires Quote</span>
                        <span className={`text-sm font-black ${viewProduct.requires_quote ? 'text-blue-700' : 'text-gray-800'}`}>
                          {viewProduct.requires_quote ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm ${viewProduct.is_customizable ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                        <span className={`text-xs font-bold mb-2 uppercase ${viewProduct.is_customizable ? 'text-purple-600' : 'text-gray-400'}`}>Customizable</span>
                        <span className={`text-sm font-black ${viewProduct.is_customizable ? 'text-purple-700' : 'text-gray-800'}`}>
                          {viewProduct.is_customizable ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* JSONB Specifications Render */}
                  {viewProduct.specifications && Array.isArray(viewProduct.specifications) && viewProduct.specifications.length > 0 && (
                    <div>
                      <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 mb-4 flex items-center">
                        <FileText size={16} className="mr-2 text-gray-400" /> Technical Specifications
                      </h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <tbody className="divide-y divide-gray-200">
                            {viewProduct.specifications.map((spec: any, idx: number) => {
                              if (!spec.key) return null;
                              return (
                                <tr key={idx} className="hover:bg-gray-100/50 transition-colors">
                                  <td className="px-4 py-3 font-bold text-gray-700 w-1/3 bg-gray-100/50">{spec.key}</td>
                                  <td className="px-4 py-3 text-gray-600 bg-white">{spec.value}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full relative">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete {productToDelete.name}?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setProductToDelete(null)} className="px-4 py-2 bg-gray-200 rounded font-medium hover:bg-gray-300">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
