import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Package, Plus, Grid, Tag, Archive, 
  ShoppingBag, Clock, CheckCircle, XCircle, 
  Users, Image as ImageIcon, FileText, Settings, 
  LogOut, Eye, Bell, ChevronDown
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1042] text-white flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar">
        {/* Logo */}
        <div className="p-6 pb-2 border-b border-white/10 flex items-center">
          {/* Logo Placeholder (White text instead of image to match theme) */}
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider flex items-center">
              <span className="text-blue-500 mr-1 text-2xl">▲</span> ABLE
            </span>
            <span className="text-[9px] uppercase tracking-widest text-red-500 font-bold ml-6">Technologies</span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <Link 
            to="/admin" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-bold transition-colors mb-6 ${isActive('/admin') ? 'bg-[#da1c26] text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Link>

          {/* PRODUCTS Section */}
          <div className="mb-6">
            <span className="px-4 text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 block">Products</span>
            <div className="space-y-1">
              <Link to="/admin/products" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/products') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Package size={16} /> <span>All Products</span>
              </Link>
              <Link to="/admin/products/add" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/products/add') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Plus size={16} /> <span>Add New Product</span>
              </Link>
              <Link to="/admin/categories" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/categories') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Grid size={16} /> <span>Categories</span>
              </Link>
              <Link to="/admin/brands" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/brands') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Tag size={16} /> <span>Brands</span>
              </Link>
              <Link to="/admin/inventory" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/inventory') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Archive size={16} /> <span>Inventory</span>
              </Link>
            </div>
          </div>

          {/* ORDERS Section */}
          <div className="mb-6">
            <span className="px-4 text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 block">Orders</span>
            <div className="space-y-1">
              <Link to="/admin/orders" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/orders') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <ShoppingBag size={16} /> <span>All Orders</span>
              </Link>
              <Link to="/admin/orders/pending" className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/orders/pending') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <div className="flex items-center space-x-3"><Clock size={16} /> <span>Pending Orders</span></div>
                <span className="bg-yellow-500 text-[#0b1042] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">5</span>
              </Link>
              <Link to="/admin/orders/completed" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/orders/completed') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <CheckCircle size={16} /> <span>Completed Orders</span>
              </Link>
              <Link to="/admin/orders/cancelled" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/orders/cancelled') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <XCircle size={16} /> <span>Cancelled Orders</span>
              </Link>
            </div>
          </div>

          {/* CUSTOMERS Section */}
          <div className="mb-6">
            <span className="px-4 text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 block">Customers</span>
            <div className="space-y-1">
              <Link to="/admin/customers" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/customers') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Users size={16} /> <span>Customers</span>
              </Link>
            </div>
          </div>

          {/* WEBSITE Section */}
          <div className="mb-6">
            <span className="px-4 text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 block">Website</span>
            <div className="space-y-1">
              <Link to="/admin/banners" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/banners') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <ImageIcon size={16} /> <span>Banners</span>
              </Link>
              <Link to="/admin/pages" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/pages') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <FileText size={16} /> <span>Pages</span>
              </Link>
            </div>
          </div>

          {/* SETTINGS Section */}
          <div className="mb-6">
            <span className="px-4 text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2 block">Settings</span>
            <div className="space-y-1">
              <Link to="/admin/settings" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive('/admin/settings') ? 'text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <Settings size={16} /> <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 w-full transition-colors font-bold border border-white/10"
          >
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-[#0b1042]">Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Welcome back, Admin!</p>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-sm font-bold text-gray-600 hover:text-[#0b1042] border border-gray-200 px-4 py-2 rounded-lg transition-colors">
              <Eye size={16} /> <span>View Store</span>
            </Link>

            <button className="relative text-gray-500 hover:text-[#0b1042] transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white box-content">3</span>
            </button>

            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6 cursor-pointer group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold group-hover:bg-gray-200 transition-colors">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex items-center space-x-1 text-sm font-bold text-gray-700 group-hover:text-[#0b1042]">
                <span>Admin</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
}
