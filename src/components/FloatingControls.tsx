import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, LayoutGrid, Search, User } from 'lucide-react';

export default function FloatingControls() {
  return (
    <>

      {/* Floating Sidebar (Right) - Desktop Only */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 flex-col space-y-2 bg-white shadow-[-4px_0_15px_rgba(0,0,0,0.1)] py-4 rounded-l-xl">
        <a href="#" className="flex flex-col items-center justify-center w-16 h-14 group hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <MessageCircle size={18} className="text-green-600" />
          </div>
          <span className="text-[10px] font-medium text-gray-700">WhatsApp</span>
        </a>
        <div className="w-10 h-px bg-gray-100 mx-auto"></div>
        <a href="#" className="flex flex-col items-center justify-center w-16 h-14 group hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Phone size={18} className="text-blue-600" />
          </div>
          <span className="text-[10px] font-medium text-gray-700">Call Us</span>
        </a>
        <div className="w-10 h-px bg-gray-100 mx-auto"></div>
        <a href="#" className="flex flex-col items-center justify-center w-16 h-14 group hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Mail size={18} color="url(#metal-red)" />
          </div>
          <span className="text-[10px] font-medium text-gray-700">Email Us</span>
        </a>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center py-2 pb-safe">
        <Link to="/" className="flex flex-col items-center p-2 metallic-red-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#metal-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
        <a href="#" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <LayoutGrid size={20} />
          <span className="text-[10px] font-medium mt-1">Categories</span>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <Search size={20} />
          <span className="text-[10px] font-medium mt-1">Search</span>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span className="text-[10px] font-medium mt-1">Quote</span>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-gray-500 hover:text-gray-900">
          <User size={20} />
          <span className="text-[10px] font-medium mt-1">Account</span>
        </a>
      </div>
      
      {/* Spacer for mobile bottom nav */}
      <div className="h-16 md:hidden"></div>

    </>
  );
}