import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, LayoutGrid, Search, User, ChevronRight, X, ArrowUp, Home, FileText } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { fetchSettings } from '../services/api';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useAuth } from '../context/AuthContext';
import MobileSearchModal from './search/MobileSearchModal';

export default function FloatingControls() {
  const [settings, setSettings] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    fetchSettings().then(data => data && setSettings(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
  };

  const whatsappNumber = '94778692075';
  const whatsappUrl = 'https://wa.me/94778692075';
  const phoneNumber = '94778692075';
  const email = settings?.support_email || 'able@ablero.com';

  return (
    <>
      {/* ---------------- DESKTOP LIQUID GLASS CONTACT DOCK ---------------- */}
      <div className="hidden md:flex fixed right-6 top-[55%] -translate-y-1/2 z-[100] flex-col items-end bg-white/20 backdrop-blur-[24px] border border-white/40 p-2 rounded-[2.5rem] shadow-[0_12px_40px_rgba(10,20,50,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] space-y-2 pointer-events-auto">
        
        {/* WhatsApp */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group relative flex items-center justify-end h-14 w-14 hover:w-[220px] bg-transparent hover:bg-white/80 backdrop-blur-sm border border-transparent hover:border-white/80 rounded-full shadow-none hover:shadow-[0_8px_32px_rgba(10,20,50,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] overflow-hidden transition-all duration-[400ms] ease-out pointer-events-auto active:scale-[0.97]"
          aria-label="WhatsApp"
        >
          {/* Label (hidden initially, revealed on expand) */}
          <div className="absolute left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-[300ms] delay-100 flex flex-col justify-center whitespace-nowrap pointer-events-none">
            <span className="text-[13px] font-bold text-[#060740] flex items-center">
              WhatsApp
              <ChevronRight size={14} className="ml-1 text-[#25D366] group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[10px] font-semibold text-gray-500">077 869 2075</span>
          </div>

          {/* Icon Sphere */}
          <div className="w-14 h-14 shrink-0 flex items-center justify-center relative rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[800ms] ease-in-out pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-[#25D366]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-md" />
            <WhatsAppIcon size={22} className="text-gray-700 group-hover:text-[#25D366] transition-colors relative z-10 group-hover:scale-[1.1] group-hover:-translate-y-0.5 duration-300" />
          </div>
        </a>
        
        <div className="w-10 h-[1px] bg-white/40 mr-2" />

        {/* Call Us */}
        <a 
          href="tel:+94778692075"
          className="group relative flex items-center justify-end h-14 w-14 hover:w-[220px] bg-transparent hover:bg-white/80 backdrop-blur-sm border border-transparent hover:border-white/80 rounded-full shadow-none hover:shadow-[0_8px_32px_rgba(10,20,50,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] overflow-hidden transition-all duration-[400ms] ease-out pointer-events-auto active:scale-[0.97]"
          aria-label="Call Us"
        >
          <div className="absolute left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-[300ms] delay-100 flex flex-col justify-center whitespace-nowrap pointer-events-none">
            <span className="text-[13px] font-bold text-[#060740] flex items-center">
              Call Us
              <ChevronRight size={14} className="ml-1 text-[#0066ff] group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[10px] font-semibold text-gray-500">077 869 2075</span>
          </div>

          <div className="w-14 h-14 shrink-0 flex items-center justify-center relative rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[800ms] ease-in-out pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-[#0066ff]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-md" />
            <Phone size={22} className="text-gray-700 group-hover:text-[#0066ff] transition-colors relative z-10 group-hover:scale-[1.1] group-hover:-translate-y-0.5 duration-300" />
          </div>
        </a>

        <div className="w-10 h-[1px] bg-white/40 mr-2" />

        {/* Email Us */}
        <a 
          href={`mailto:${email}`}
          className="group relative flex items-center justify-end h-14 w-14 hover:w-[220px] bg-transparent hover:bg-white/80 backdrop-blur-sm border border-transparent hover:border-white/80 rounded-full shadow-none hover:shadow-[0_8px_32px_rgba(10,20,50,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] overflow-hidden transition-all duration-[400ms] ease-out pointer-events-auto active:scale-[0.97]"
          aria-label="Email Us"
        >
          <div className="absolute left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-[300ms] delay-100 flex flex-col justify-center whitespace-nowrap pointer-events-none">
            <span className="text-[13px] font-bold text-[#060740] flex items-center">
              Email Us
              <ChevronRight size={14} className="ml-1 text-[#e11d48] group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[10px] font-semibold text-gray-500">able@ablero.com</span>
          </div>

          <div className="w-14 h-14 shrink-0 flex items-center justify-center relative rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[800ms] ease-in-out pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-[#e11d48]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-md" />
            <Mail size={22} className="text-gray-700 group-hover:text-[#e11d48] transition-colors relative z-10 group-hover:scale-[1.1] group-hover:-translate-y-0.5 duration-300" />
          </div>
        </a>
      </div>



      {/* ---------------- SUPER MOBILE BOTTOM NAVIGATION ---------------- */}
      <div className={`md:hidden fixed bottom-4 left-4 right-4 z-[50] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${scrollDirection === 'down' && !isAtTop ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="bg-[#0b1042]/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 rounded-3xl flex justify-around items-center px-2 py-2 relative">
          
          <Link to="/" className="flex flex-col items-center relative w-14 group">
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${pathname === '/' ? 'bg-white/10 scale-100' : 'bg-transparent scale-90'}`}></div>
            <Home size={20} className={`relative z-10 transition-colors duration-300 ${pathname === '/' ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-200'}`} />
            <span className={`text-[9px] font-bold mt-1 relative z-10 transition-colors duration-300 ${pathname === '/' ? 'text-white' : 'text-gray-400'}`}>Home</span>
            {pathname === '/' && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>}
          </Link>
          
          <Link to="/shop" className="flex flex-col items-center relative w-14 group">
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${pathname.startsWith('/shop') ? 'bg-white/10 scale-100' : 'bg-transparent scale-90'}`}></div>
            <LayoutGrid size={20} className={`relative z-10 transition-colors duration-300 ${pathname.startsWith('/shop') ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-200'}`} />
            <span className={`text-[9px] font-bold mt-1 relative z-10 transition-colors duration-300 ${pathname.startsWith('/shop') ? 'text-white' : 'text-gray-400'}`}>Products</span>
            {pathname.startsWith('/shop') && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>}
          </Link>
          
          {/* Prominent Search Action */}
          <button 
            onClick={() => setIsMobileSearchOpen(true)} 
            className="flex flex-col items-center relative w-14 group -translate-y-3"
          >
            <div className="absolute inset-0 bg-red-600/0 rounded-xl transition-all duration-300"></div>
            <div className="w-12 h-12 bg-gradient-to-tr from-red-700 to-red-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(220,38,38,0.4)] border-2 border-white/20 transform transition-transform duration-300 group-active:scale-95 group-hover:-translate-y-1 backdrop-blur-md">
              <Search size={22} className="drop-shadow-md" />
            </div>
            <span className="text-[9px] font-bold mt-1 text-gray-300 tracking-wide">Search</span>
          </button>
          
          <Link to="/contact" className="flex flex-col items-center relative w-14 group">
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${pathname.startsWith('/contact') ? 'bg-white/10 scale-100' : 'bg-transparent scale-90'}`}></div>
            <FileText size={20} className={`relative z-10 transition-colors duration-300 ${pathname.startsWith('/contact') ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-200'}`} />
            <span className={`text-[9px] font-bold mt-1 relative z-10 transition-colors duration-300 ${pathname.startsWith('/contact') ? 'text-white' : 'text-gray-400'}`}>Quote</span>
            {pathname.startsWith('/contact') && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>}
          </Link>
          
          <button onClick={handleAccountClick} className="flex flex-col items-center relative w-14 group">
             <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${pathname.startsWith('/profile') || pathname.startsWith('/admin') ? 'bg-white/10 scale-100' : 'bg-transparent scale-90'}`}></div>
             <User size={20} className={`relative z-10 transition-colors duration-300 ${pathname.startsWith('/profile') || pathname.startsWith('/admin') ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-200'}`} />
             <span className={`text-[9px] font-bold mt-1 relative z-10 transition-colors duration-300 ${pathname.startsWith('/profile') || pathname.startsWith('/admin') ? 'text-white' : 'text-gray-400'}`}>Account</span>
             {(pathname.startsWith('/profile') || pathname.startsWith('/admin')) && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>}
          </button>
        </div>
      </div>
      
      {/* ---------------- FLOATING METALLIC RED SCROLL-TO-TOP BUTTON (RIGHT) ---------------- */}
      <button
        onClick={scrollToTop}
        className={`fixed right-4 md:right-8 bottom-32 md:bottom-8 z-[90] w-12 h-12 md:w-14 md:h-14 metallic-red-bg rounded-full shadow-[0_10px_25px_rgba(180,0,0,0.4),0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_30px_rgba(255,50,50,0.5),0_6px_16px_rgba(0,0,0,0.6)] flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden border border-red-400/40 ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        aria-label="Scroll to top"
        title="Scroll to Top"
      >
        {/* Light sweep metallic sheen reflection */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[700ms] ease-in-out pointer-events-none rounded-full" />
        
        {/* Subtle radial inner glow */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        
        {/* Arrow Icon */}
        <ArrowUp size={22} className="relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] group-hover:-translate-y-1 transition-all duration-300" strokeWidth={2.5} />
      </button>

      {/* Spacer for mobile bottom nav */}
      <div className="h-16 md:hidden"></div>

      {/* Mobile Search Modal */}
      <MobileSearchModal isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />
    </>
  );
}
