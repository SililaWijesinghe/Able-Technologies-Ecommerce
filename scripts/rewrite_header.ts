import fs from 'fs';

const headerContent = `import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchSettings, fetchCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './auth/LoginModal';
import { 
  Facebook, 
  Linkedin, 
  MessageCircle, 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  ChevronDown, 
  Send, 
  ShieldCheck, 
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import whiteAbleLogo from '../assets/whiteAbleLogo.png';
import ableLogo from '../assets/ableLogo.png';

export default function Header() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const { cartCount, cartTotal, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSettings().then(data => data && setSettings(data));
    fetchCategories().then(data => data && setCategories(data));
  }, []);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path) && path !== '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Shop', path: '/shop', id: 'nav-shop' },
    { name: 'Machines', path: '/shop?category=machines' },
    { name: 'Spare Parts', path: '/shop?category=spare-parts' },
    { name: 'Gauges', path: '/shop?category=gauges' },
    { name: 'Glue', path: '/shop?category=glue' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      {/* ---------------- MOBILE HEADER ---------------- */}
      <div className="md:hidden bg-[#04081c] sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex justify-between items-center bg-[#0b1042]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-sm">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-cyan-400 transition-colors p-1">
              <Menu size={24} />
            </button>
            <img src={whiteAbleLogo} alt="Able Technologies" className="h-8 object-contain drop-shadow-md" />
            <div className="flex items-center gap-3">
              <button onClick={handleAccountClick} className="text-white hover:text-cyan-400 transition-colors">
                <User size={20} />
              </button>
              <button className="relative text-white hover:text-cyan-400 transition-colors" id="nav-cart-mobile" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center p-1 focus-within:border-cyan-400/50 focus-within:bg-white/15 transition-all">
             <input type="text" placeholder="Search for machines..." className="flex-1 bg-transparent text-white px-4 py-2 outline-none text-sm placeholder-gray-400" />
             <button className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 p-2 rounded-full transition-colors"><Search size={16} /></button>
          </div>
        </div>

        {/* Mobile Menu Drawer Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#0b1042]/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
            >
              <div className="p-4 flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-cyan-300 hover:bg-white/5 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-white/10">
                  <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 text-sm font-semibold shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    <Send size={16} className="-rotate-45" />
                    <span>Get a Quote</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- DESKTOP HEADER ---------------- */}
      <div className="hidden md:block bg-[#04081c] relative z-40 overflow-hidden pt-4 pb-8 px-4 md:px-8">
        {/* Atmospheric background glow (Layer 1) */}
        <div className="absolute top-[-20%] left-1/4 w-1/2 h-64 bg-blue-600/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto space-y-4 relative z-10">
          
          {/* Top Utility Bar (Layer 3) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0b1042]/60 backdrop-blur-md border border-blue-300/20 rounded-full text-gray-200 text-[11px] font-medium py-2 px-6 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            <span className="tracking-wide">All Kind of Machine Makers</span>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-cyan-50">
                <Phone size={12} className="text-cyan-400" />
                <span>Need Help? {settings?.whatsapp_number || '+1-555-019-8372'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-cyan-400 transition-colors"><Facebook size={12} /></a>
                <a href="#" className="hover:text-cyan-400 transition-colors"><Linkedin size={12} /></a>
                <a href="#" className="hover:text-cyan-400 transition-colors"><MessageCircle size={12} /></a>
              </div>
              <button 
                onClick={logout} 
                className="hover:text-red-400 transition-colors flex items-center border-l border-white/20 pl-4 ml-2 uppercase tracking-widest text-[10px]"
              >
                Logout
              </button>
            </div>
          </motion.div>

          {/* Main Brand / Search / Account Area (Layer 4) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0a0f35]/80 backdrop-blur-2xl border border-blue-400/20 rounded-[2.5rem] p-4 md:px-6 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group/main"
          >
            {/* Inner subtle glow reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover/main:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Logo */}
            <div className="pl-4 pr-6 shrink-0 relative z-10">
              <img src={whiteAbleLogo} alt="Able Technologies Logo" className="h-16 lg:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-4 relative z-10">
              <div className="bg-[#1a2052]/80 backdrop-blur-md border border-white/10 rounded-full flex items-center p-1.5 focus-within:bg-[#202761]/90 focus-within:border-cyan-400/40 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300">
                <input 
                  type="text" 
                  placeholder="Search for machines, parts, gauges, glue..." 
                  className="flex-1 bg-transparent px-5 py-2.5 text-white placeholder-gray-400 outline-none text-sm font-medium"
                />
                <button className="bg-[#0b1042] hover:bg-cyan-900 border border-white/10 text-white p-3 rounded-full transition-all duration-300 shadow-md flex items-center justify-center">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Account & Cart Cards */}
            <div className="flex items-center space-x-3 shrink-0 relative z-10">
              {/* Account Card */}
              <div 
                onClick={handleAccountClick}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-2.5 flex items-center space-x-3 cursor-pointer transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                <div className="bg-transparent border border-white/20 p-2 rounded-full flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/5" />
                  {isAuthenticated && user?.role === 'ADMIN' ? (
                    <ShieldCheck size={18} className="text-white" />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-300 font-medium">{isAuthenticated ? 'Welcome back' : 'Login / Register'}</span>
                  <span className="text-sm font-bold text-white tracking-wide">
                    {isAuthenticated ? (user?.role === 'ADMIN' ? 'Admin Panel' : 'My Account') : 'My Account'}
                  </span>
                </div>
              </div>

              {/* Cart Card */}
              <div 
                id="nav-cart"
                onClick={() => setIsCartOpen(true)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-2.5 flex items-center space-x-3 cursor-pointer transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                <div className="relative bg-transparent border border-white/20 p-2 rounded-full flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white/5" />
                  <ShoppingCart size={18} className="text-white relative z-10" />
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(220,38,38,0.8)] z-20 border border-[#0a0f35]">
                    {cartCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-300 font-medium">My Cart</span>
                  <span className="text-sm font-bold text-white tracking-wide">Rs. {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Navigation (Layer 5) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0b1042]/70 backdrop-blur-xl border border-blue-400/20 rounded-full flex items-center justify-between p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent pointer-events-none" />

            {/* All Categories Button */}
            <div className="group relative shrink-0 z-20">
              <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3.5 rounded-full flex items-center space-x-3 text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300">
                <Menu size={18} />
                <span className="tracking-wide">All Categories</span>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-[110%] w-64 bg-[#0a0f35]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-3 overflow-hidden z-50">
                {categories.length > 0 ? (
                  categories.map((cat, idx) => (
                    <Link key={idx} to={`/shop?category=${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors flex items-center space-x-3 relative group/cat">
                      <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 opacity-0 group-hover/cat:opacity-100 transition-opacity" />
                      {cat.icon_url && <img src={cat.icon_url} alt={cat.name} className="w-5 h-5 object-contain brightness-0 invert opacity-70 group-hover/cat:opacity-100 transition-opacity" />}
                      <span>{cat.name}</span>
                    </Link>
                  ))
                ) : (
                  <span className="px-6 py-3 text-gray-500 text-sm">Loading...</span>
                )}
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex-1 flex justify-center items-center space-x-1 lg:space-x-4 px-4 z-10">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.name} 
                    id={link.id}
                    to={link.path} 
                    className="relative px-4 py-2.5 text-sm font-semibold text-white hover:text-white transition-all hover:-translate-y-0.5 rounded-full group/link"
                  >
                    {link.name}
                    {/* Active State Indicator */}
                    {active && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                    )}
                    {/* Hover State Indicator */}
                    {!active && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-white/30 rounded-full transition-all duration-300 group-hover/link:w-1/2" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Get a Quote Button */}
            <button className="shrink-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3.5 rounded-full flex items-center space-x-2 text-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-0.5 z-20">
              <Send size={16} className="-rotate-45" />
              <span className="tracking-wide">Get a Quote</span>
            </button>

          </motion.div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
`
fs.writeFileSync('src/components/Header.tsx', headerContent);
