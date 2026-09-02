import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, LayoutGrid, Search, User, ChevronRight, X, ArrowUp } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { fetchSettings } from '../services/api';

export default function FloatingControls() {
  const [settings, setSettings] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const whatsappNumber = settings?.whatsapp_number || '+94777852476';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;
  const phoneNumber = settings?.whatsapp_number || '+94777852476';
  const email = settings?.support_email || 'info@abletech.com';

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
            <span className="text-[10px] font-semibold text-gray-500">Chat with us</span>
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
          href={`tel:${phoneNumber}`}
          className="group relative flex items-center justify-end h-14 w-14 hover:w-[220px] bg-transparent hover:bg-white/80 backdrop-blur-sm border border-transparent hover:border-white/80 rounded-full shadow-none hover:shadow-[0_8px_32px_rgba(10,20,50,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] overflow-hidden transition-all duration-[400ms] ease-out pointer-events-auto active:scale-[0.97]"
          aria-label="Call Us"
        >
          <div className="absolute left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-[300ms] delay-100 flex flex-col justify-center whitespace-nowrap pointer-events-none">
            <span className="text-[13px] font-bold text-[#060740] flex items-center">
              Call Us
              <ChevronRight size={14} className="ml-1 text-[#0066ff] group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[10px] font-semibold text-gray-500">Speak to our team</span>
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
            <span className="text-[10px] font-semibold text-gray-500">Send us an email</span>
          </div>

          <div className="w-14 h-14 shrink-0 flex items-center justify-center relative rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[800ms] ease-in-out pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-[#e11d48]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-md" />
            <Mail size={22} className="text-gray-700 group-hover:text-[#e11d48] transition-colors relative z-10 group-hover:scale-[1.1] group-hover:-translate-y-0.5 duration-300" />
          </div>
        </a>
      </div>



      {/* ---------------- MOBILE BOTTOM NAVIGATION (UNCHANGED) ---------------- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-[50] flex justify-around items-center py-2 pb-safe border-t border-gray-100">
        <Link to="/" className="flex flex-col items-center p-2 metallic-red-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#metal-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <LayoutGrid size={20} />
          <span className="text-[10px] font-medium mt-1">Categories</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <Search size={20} />
          <span className="text-[10px] font-medium mt-1">Search</span>
        </Link>
        <Link to="/contact" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span className="text-[10px] font-medium mt-1">Quote</span>
        </Link>
        <Link to="/account" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <User size={20} />
          <span className="text-[10px] font-medium mt-1">Account</span>
        </Link>
      </div>
      
      {/* ---------------- FLOATING METALLIC RED SCROLL-TO-TOP BUTTON (RIGHT) ---------------- */}
      <button
        onClick={scrollToTop}
        className={`fixed right-4 md:right-8 bottom-20 md:bottom-8 z-[90] w-12 h-12 md:w-14 md:h-14 metallic-red-bg rounded-full shadow-[0_10px_25px_rgba(180,0,0,0.4),0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_30px_rgba(255,50,50,0.5),0_6px_16px_rgba(0,0,0,0.6)] flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden border border-red-400/40 ${
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

    </>
  );
}
