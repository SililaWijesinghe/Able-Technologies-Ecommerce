import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchSettings, fetchCategories } from '../services/api';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import LoginModal from './auth/LoginModal';
import { 
  Facebook, 
  Linkedin, 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  Send, 
  ShieldCheck, 
  Phone,
  Mail,
  Loader2,
  Package
} from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { motion, AnimatePresence } from 'motion/react';

import whiteAbleLogo from '../assets/whiteAbleLogo.png';

const defaultSearchProducts = [
  {
    id: '3',
    name: 'Air Cylinder ISO 15552 Standard Pneumatic',
    price: 12500,
    image_urls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80'],
  },
  {
    id: '101',
    name: 'Hydraulic Bottle Jack 20 Ton Heavy Duty',
    price: 34500,
    image_urls: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80'],
  },
  {
    id: '102',
    name: 'Hydraulic Toe Jack Compact Cylinder 10T',
    price: 42000,
    image_urls: ['https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=300&auto=format&fit=crop&q=80'],
  },
  {
    id: '103',
    name: 'Single Acting Pneumatic Cylinder Compact SC-50',
    price: 9800,
    image_urls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80'],
  },
  {
    id: '1',
    name: 'Pneumatic Pad Printing Machine',
    price: 485000,
    image_urls: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80'],
  },
  {
    id: '2',
    name: 'Industrial Robotic Arm 6 Axis',
    price: 1850000,
    image_urls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80'],
  },
  {
    id: '4',
    name: 'Pneumatic Pressure Gauge 0-10 Bar High Precision',
    price: 4500,
    image_urls: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80'],
  }
];

export default function Header() {
  const { settings } = useStoreSettings();

  const handleComingSoon = (e: any) => {
    e.preventDefault();
    toast('Coming soon!', { icon: '🚧', style: { borderRadius: '10px', background: '#0b1042', color: '#fff' } });
  };

  
  const [categories, setCategories] = useState<any[]>([]);
  const { cartCount, cartTotal, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileContactExpanded, setIsMobileContactExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();

  const whatsappNumber = settings?.whatsapp_number || '+94 777 852 476';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;
  const phoneNumber = settings?.whatsapp_number || '+94 777 852 476';
  const email = settings?.support_email || 'able@ablero.com';

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    fetchCategories().then(data => data && setCategories(data));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleOpenLoginModal = () => setIsLoginModalOpen(true);
    window.addEventListener('open-login-modal', handleOpenLoginModal);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('open-login-modal', handleOpenLoginModal);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDesktop = searchContainerRef.current && searchContainerRef.current.contains(target);
      const clickedMobile = mobileSearchRef.current && mobileSearchRef.current.contains(target);
      if (!clickedDesktop && !clickedMobile) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live Supabase search with debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length <= 2) {
      setResults([]);
      setIsSearching(false);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    setIsDropdownOpen(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_urls')
          .ilike('name', `%${trimmed}%`)
          .limit(5);

        if (!error && data && data.length > 0) {
          setResults(data);
        } else {
          // Fallback search when Supabase is unpopulated or in mock mode
          const filtered = defaultSearchProducts.filter(p =>
            p.name.toLowerCase().includes(trimmed.toLowerCase())
          );
          setResults(filtered);
        }
      } catch (err) {
        console.error('Search error:', err);
        const filtered = defaultSearchProducts.filter(p =>
          p.name.toLowerCase().includes(trimmed.toLowerCase())
        );
        setResults(filtered);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    { name: 'About Us', path: '#!', available: false },
    { name: 'Shop', path: '/shop', id: 'nav-shop' },
    { name: 'Machines', path: '/shop?category=machines' },
    { name: 'Spare Parts', path: '/shop?category=spare-parts' },
    { name: 'Gauges', path: '/shop?category=gauges' },
    { name: 'Glue', path: '/shop?category=glue' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const isHome = location.pathname === '/';

  return (
    <>
      {/* ---------------- MOBILE HEADER ---------------- */}
      <div className={`md:hidden fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${scrollDirection === 'down' && !isAtTop ? '-translate-y-full' : 'translate-y-0'} ${isScrolled || !isHome ? 'bg-[#04081c]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'bg-transparent'}`}>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex justify-between items-center bg-[#0b1042]/70 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <button id="nav-menu-mobile" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-cyan-400 transition-colors p-1">
              <Menu size={24} />
            </button>
            <Link to="/">
              <img src={whiteAbleLogo} alt="Able Technologies" className="h-8 object-contain drop-shadow-md" />
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={handleAccountClick} className="text-white hover:text-cyan-400 transition-colors">
                <User size={20} />
              </button>
              <button className="relative text-white hover:text-cyan-400 transition-colors" id="nav-cart-mobile" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div ref={mobileSearchRef} className="relative w-full z-50 overflow-visible flex items-center gap-2">
            {/* Small Contact Button */}
            <div className={`relative shrink-0 transition-all duration-300 ease-in-out ${isSearchFocused ? 'opacity-0 w-0 overflow-hidden scale-95 pointer-events-none mr-0' : 'opacity-100 w-10 scale-100 mr-0'}`}>
              <button 
                type="button"
                onClick={() => setIsMobileContactExpanded(!isMobileContactExpanded)}
                className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 hover:from-cyan-500/30 hover:to-blue-600/40 border border-cyan-400/40 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse transition-all relative active:scale-95 shrink-0"
                title="Contact Options"
              >
                <Phone size={17} className="text-cyan-300" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-ping" />
              </button>

              {/* Expanded 3 Contact Buttons Dropdown */}
              {isMobileContactExpanded && (
                <div className="absolute top-[120%] left-0 bg-[#0b1042]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-2.5 flex flex-col space-y-2 z-[100] min-w-[170px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <a 
                    href={`tel:${phoneNumber}`} 
                    onClick={() => setIsMobileContactExpanded(false)}
                    className="flex items-center space-x-2.5 text-white hover:bg-white/10 p-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <div className="w-7 h-7 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-blue-400" />
                    </div>
                    <span>Call Us</span>
                  </a>
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setIsMobileContactExpanded(false)}
                    className="flex items-center space-x-2.5 text-white hover:bg-white/10 p-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <div className="w-7 h-7 bg-emerald-600/20 border border-emerald-500/40 rounded-full flex items-center justify-center shrink-0">
                      <WhatsAppIcon size={16} className="text-emerald-400" />
                    </div>
                    <span>WhatsApp</span>
                  </a>
                  <a 
                    href={`mailto:${email}`} 
                    onClick={() => setIsMobileContactExpanded(false)}
                    className="flex items-center space-x-2.5 text-white hover:bg-white/10 p-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <div className="w-7 h-7 bg-rose-600/20 border border-rose-500/40 rounded-full flex items-center justify-center shrink-0">
                      <Mail size={14} className="text-rose-400" />
                    </div>
                    <span>Email Us</span>
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                  if (searchQuery.trim().length > 2) setIsDropdownOpen(true);
                }}
                onBlur={() => {
                  setTimeout(() => setIsSearchFocused(false), 250);
                }}
                placeholder="Search for machines, parts, gauges, glue..." 
                className="bg-white/10 hover:bg-white/20 focus:bg-white/20 backdrop-blur-md border border-white/20 text-white placeholder-white/60 rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-white/30 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition-all w-full text-xs pr-10"
              />
              <button type="submit" className="absolute right-1.5 bg-blue-900/80 text-white p-2 rounded-full transition-all shadow-md flex items-center justify-center">
                {isSearching ? <Loader2 size={14} className="animate-spin text-white" /> : <Search size={14} />}
              </button>
            </form>

            {/* Mobile Search Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-[120%] left-0 w-full bg-slate-900/80 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {isSearching && (
                  <div className="p-3 text-center text-slate-300 font-medium text-xs flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin text-cyan-400" />
                    <span>Searching products...</span>
                  </div>
                )}
                {!isSearching && results.length > 0 && (
                  <div className="max-h-60 overflow-y-auto divide-y divide-white/10">
                    {results.map((item) => {
                      const imgUrl = item.image_urls?.[0] || item.images?.[0]?.image_url || item.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80';
                      return (
                        <Link
                          key={item.id}
                          to={`/product/${item.id}`}
                          onClick={() => { setIsDropdownOpen(false); setSearchQuery(''); }}
                          className="text-white hover:bg-white/10 transition-colors border-b border-white/10 p-3 flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-10 h-10 bg-white/10 rounded-lg overflow-hidden shrink-0 border border-white/20 shadow-sm flex items-center justify-center p-1">
                            <img src={imgUrl} alt={item.name} className="w-full h-full object-cover rounded-md" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-slate-100 font-semibold text-xs truncate group-hover:text-cyan-300 transition-colors">{item.name}</h4>
                            {settings?.show_prices && (
                              <span className="text-red-400 font-bold text-xs">Rs. {typeof item.price === 'number' ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.price}</span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
                {!isSearching && results.length === 0 && (
                  <div className="p-4 text-center text-slate-300 font-medium text-xs">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-[#04081c]/95 backdrop-blur-2xl border-t border-white/10 overflow-y-auto"
            >
              <div className="p-4 flex flex-col space-y-2 pb-32">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={(e) => { 
                      if (link.available === false) { handleComingSoon(e); return; }
                      setIsMobileMenuOpen(false); 
                    }}
                    className="text-gray-300 hover:text-cyan-300 hover:bg-white/5 px-4 py-3 rounded-xl text-lg font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 mt-4 border-t border-white/10">
                  <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-4 rounded-2xl flex items-center justify-center space-x-2 text-base font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
                    <Send size={18} className="-rotate-45" />
                    <span>Get a Quote</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- DESKTOP HEADER ---------------- */}
      <header className={`hidden md:block z-50 w-full transition-all duration-500 ${isHome ? 'absolute top-0 bg-gradient-to-b from-[#060740] via-[#060740]/90 to-[#04081c]/0' : 'relative bg-[#060740]'} ${isScrolled && !isHome ? 'bg-[#04081c]/95 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : ''} pt-6 pb-6 px-4 md:px-8 overflow-visible`}>
        {/* Soft blue atmospheric glow behind header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
        
        {/* Soft red ambient glow on the right behind header */}
        <div className="absolute top-0 right-0 w-[40%] h-[250px] bg-red-600/5 blur-[120px] pointer-events-none mix-blend-screen" />

        <div className="max-w-[1400px] mx-auto space-y-4 relative z-10 overflow-visible">
          
          {/* 1. Top Utility Bar - Floating Glass Capsule */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-[rgba(15,30,70,0.4)] backdrop-blur-md border border-white/10 rounded-full text-gray-200 text-[11px] font-medium py-2 px-6 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)] relative overflow-hidden"
          >
            {/* Luminous top edge */}
            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            
            <span className="tracking-widest opacity-90">All Kind of Machine Makers</span>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={12} className="text-cyan-400" />
                <span className="opacity-90">Need Help? {settings?.whatsapp_number || '+94 777 852 476'}</span>
              </div>
              <div className="flex items-center space-x-4 opacity-90">
                <a href="#" className="hover:text-cyan-400 hover:opacity-100 transition-colors" title="Facebook"><Facebook size={13} /></a>
                <a href="#" className="hover:text-cyan-400 hover:opacity-100 transition-colors" title="LinkedIn"><Linkedin size={13} /></a>
                <a 
                  href={`https://wa.me/${(settings?.whatsapp_number || '+94 777 852 476').replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#25D366] hover:opacity-100 transition-colors"
                  title="WhatsApp"
                >
                  <WhatsAppIcon size={13} />
                </a>
              </div>
              <div className="w-[1px] h-4 bg-white/20" />
              {isAuthenticated ? (
                <button 
                  onClick={logout} 
                  className="hover:text-red-400 transition-colors uppercase tracking-widest text-[10px] font-bold opacity-100"
                >
                  LOGOUT
                </button>
              ) : (
                <Link 
                  to="/admin/login" 
                  className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-[10px] font-bold opacity-100"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </motion.div>

          {/* 2. Main Header Panel - Neumorphic Glass Container */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full bg-[rgba(15,30,70,0.4)] backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 md:px-6 flex items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_1px_3px_rgba(255,255,255,0.3)] relative overflow-visible group/main z-20"
          >
            {/* Luminous reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none rounded-[2rem]" />
            <div className="absolute -top-[50px] -left-[50px] w-[150px] h-[150px] bg-cyan-400/20 blur-[50px] pointer-events-none opacity-50" />
            
            {/* Logo */}
            <div className="pl-2 pr-6 shrink-0 relative z-10">
              <Link to="/">
                <img src={whiteAbleLogo} alt="Able Technologies Logo" className="h-12 lg:h-14 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
              </Link>
            </div>

            {/* Search Bar Container */}
            <div ref={searchContainerRef} className="flex-1 max-w-2xl mx-4 relative z-50 overflow-visible">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim().length > 2) setIsDropdownOpen(true); }}
                  placeholder="Search for machines, parts, gauges, glue..." 
                  className="bg-[rgba(5,10,30,0.5)] hover:bg-[rgba(5,10,30,0.6)] focus:bg-[rgba(5,10,30,0.7)] backdrop-blur-md border border-white/5 text-white placeholder-white/50 rounded-full px-6 py-3.5 outline-none focus:ring-1 focus:ring-white/20 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] transition-all w-full text-[13px] font-medium tracking-wide pr-14"
                />
                <button 
                  type="submit"
                  className="absolute right-2 bg-[rgba(20,35,80,0.8)] hover:bg-[rgba(30,45,90,0.9)] border border-white/10 text-white p-2.5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  {isSearching ? <Loader2 size={16} className="animate-spin text-white" /> : <Search size={16} />}
                </button>
              </form>

              {/* Live Results Dropdown (Elevated Neuromorphic Dropdown) */}
              {isDropdownOpen && (
                <div className="absolute top-[120%] left-0 w-full bg-[rgba(15,20,40,0.95)] backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearching && (
                    <div className="p-4 text-center text-slate-300 font-medium text-sm flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-cyan-400" />
                      <span>Searching for &ldquo;{searchQuery}&rdquo;...</span>
                    </div>
                  )}

                  {!isSearching && results.length > 0 && (
                    <div className="max-h-80 overflow-y-auto divide-y divide-white/10">
                      {results.map((item) => {
                        const imgUrl = item.image_urls?.[0] || item.images?.[0]?.image_url || item.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80';
                        return (
                          <Link 
                            key={item.id}
                            to={`/product/${item.id}`}
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }}
                            className="text-white hover:bg-white/10 transition-colors border-b border-white/10 p-3 flex items-center gap-4 cursor-pointer group"
                          >
                            <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-sm flex items-center justify-center p-1">
                              {imgUrl ? (
                                <img src={imgUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Package size={20} className="text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-slate-100 font-semibold text-sm truncate group-hover:text-white transition-colors">{item.name}</h4>
                              {settings?.show_prices && (
                              <p className="text-red-400 font-bold text-xs mt-0.5">
                                Rs. {typeof item.price === 'number' ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.price}
                              </p>
                            )}
                            </div>
                          </Link>
                        );
                      })}
                      <div className="p-2.5 bg-black/20 border-t border-white/10 text-center">
                        <button 
                          onClick={() => handleSearchSubmit()}
                          className="text-[11px] font-bold text-white hover:text-cyan-300 transition-colors"
                        >
                          View all results for &ldquo;{searchQuery}&rdquo; &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {!isSearching && results.length === 0 && (
                    <div className="p-4 text-center text-slate-300 font-medium text-sm">
                      No products found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account & Cart Cards */}
            <div className="flex items-center space-x-4 shrink-0 relative z-10">
              {/* Account Card */}
              <div 
                onClick={handleAccountClick}
                className="bg-[rgba(25,40,80,0.5)] hover:bg-[rgba(35,50,90,0.6)] border border-white/10 rounded-2xl px-5 py-2.5 flex items-center space-x-3 cursor-pointer transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] group"
              >
                <div className="bg-transparent flex items-center justify-center relative overflow-hidden transition-colors">
                  {isAuthenticated && user?.role === 'ADMIN' ? (
                    <ShieldCheck size={18} className="text-white transition-colors" />
                  ) : (
                    <User size={18} className="text-white transition-colors" />
                  )}
                </div>
                <div className="flex flex-col pr-1">
                  <span className="text-[10px] text-gray-300 font-medium">{isAuthenticated ? 'Welcome back' : 'Login / Register'}</span>
                  <span className="text-[13px] font-bold text-white tracking-wide">
                    {isAuthenticated ? (user?.role === 'ADMIN' ? 'Admin Panel' : (user.user_metadata?.full_name?.split(' ')[0] || 'My Account')) : 'My Account'}
                  </span>
                </div>
              </div>

              {/* Cart Card */}
              <div 
                id="nav-cart"
                onClick={() => setIsCartOpen(true)}
                className="bg-[rgba(25,40,80,0.5)] hover:bg-[rgba(35,50,90,0.6)] border border-white/10 rounded-2xl px-5 py-2.5 flex items-center space-x-3 cursor-pointer transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] group"
              >
                <div className="relative bg-transparent flex items-center justify-center overflow-visible transition-colors">
                  <ShoppingCart size={18} className="text-white transition-colors relative z-10" />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.6)] z-20">
                    {cartCount}
                  </span>
                </div>
                <div className="flex flex-col pr-1">
                  <span className="text-[10px] text-gray-300 font-medium">My Cart</span>
                  <span className="text-[13px] font-bold text-white tracking-wide">Rs. {cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Main Navigation Panel - Floating Glass Capsule */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full bg-[rgba(15,30,70,0.4)] backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)] relative z-10"
          >
            {/* Luminous edge highlighting */}
            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            {/* All Categories Button */}
            <div className="group relative shrink-0 z-20">
              <button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-3.5 rounded-full flex items-center space-x-3 text-sm font-bold shadow-[0_5px_15px_rgba(220,38,38,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-300 relative overflow-hidden border border-red-500/50">
                <Menu size={18} className="relative z-10" />
                <span className="tracking-wide relative z-10">All Categories</span>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-[110%] w-64 bg-[rgba(15,20,40,0.95)] backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-3 overflow-hidden z-50">
                {categories.length > 0 ? (
                  categories.map((cat, idx) => (
                    <Link key={idx} to={`/shop?category=${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 text-gray-200 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors flex items-center space-x-3 relative group/cat">
                      <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 opacity-0 group-hover/cat:opacity-100 transition-opacity shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
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
            <div className="flex-1 flex justify-center items-center space-x-4 lg:space-x-8 px-4 z-10">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.name} 
                    id={link.id}
                    to={link.path} 
                    onClick={link.available === false ? handleComingSoon : undefined}
                    className="relative px-2 py-2 text-[15px] font-semibold text-white/90 hover:text-white transition-all hover:-translate-y-0.5 group/link tracking-wide"
                  >
                    {link.name}
                    {/* Active State Indicator - Futuristic Cyan Underline */}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[3px] bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    )}
                    {/* Hover State Indicator */}
                    {!active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-400/50 rounded-full transition-all duration-300 group-hover/link:w-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Get a Quote Button */}
            <button className="shrink-0 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-3.5 rounded-full flex items-center space-x-2 text-sm font-bold shadow-[0_5px_15px_rgba(220,38,38,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 z-20 relative overflow-hidden border border-red-500/50">
              <span className="text-xl leading-none mr-1 opacity-80" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>A</span>
              <span className="tracking-wide relative z-10">Get a Quote</span>
            </button>

          </motion.div>
        </div>

        {/* Soft Glass Melt / Atmospheric Transition at bottom of header */}
        <div className="absolute bottom-[-50px] left-0 w-full h-[50px] bg-gradient-to-b from-[rgba(10,25,75,0.2)] to-transparent pointer-events-none blur-[20px]" />
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
