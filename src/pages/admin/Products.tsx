import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, Filter, Eye, Edit, Trash, Package, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Products() {
  const toast = useToast();
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
        .select('*')
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
      toast.error('Failed to delete product');
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 size={32} className="animate-spin mb-4 text-[#0b1042]" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Loading Products...</p>
        </div>
      </div>
    );
  }

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
                      <td className="p-4 text-sm text-gray-500 font-medium">{product.category || '-'}</td>
                      <td className="p-4 text-sm text-gray-500 font-medium">{product.brand || '-'}</td>
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
      {viewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button onClick={() => setViewProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 font-bold">X</button>
            <h2 className="text-xl font-bold mb-4">{viewProduct.name}</h2>
            <p className="mb-2"><strong>SKU:</strong> {viewProduct.sku}</p>
            <p className="mb-2"><strong>Price:</strong> Rs. {viewProduct.price}</p>
            <p className="mb-2"><strong>Stock:</strong> {viewProduct.stock}</p>
            <p className="mt-4 text-sm text-gray-600">{viewProduct.description}</p>
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
