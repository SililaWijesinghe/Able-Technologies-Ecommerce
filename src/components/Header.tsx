import { Search, ShoppingCart, User, Menu, ChevronDown, Facebook, Linkedin, Instagram } from 'lucide-react';
import ableLogo from '../assets/ableLogo.png';

export default function Header() {
  return (
    <header className="w-full flex flex-col font-sans">
      {/* Top Utility Bar */}
      <div className="bg-[#0b1042] text-white text-[10px] md:text-xs py-1.5 md:py-2 px-4 md:px-6 flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <span className="text-red-500">🚀</span>
          <span className="hidden md:inline font-medium">All Kind of Machine Makers</span>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-medium opacity-90">Need Help?</span>
            <span className="font-bold">038 222 1613 | 077 785 2476</span>
          </div>
          <div className="hidden md:flex items-center space-x-3 opacity-80">
            <a href="#" className="hover:text-red-500 transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-red-500 transition-colors"><Linkedin size={14} /></a>
            <a href="#" className="hover:text-red-500 transition-colors"><Instagram size={14} /></a>
            {/* WhatsApp Icon */}
            <a href="#" className="hover:text-green-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-3 md:py-4 px-4 md:px-6 flex items-center justify-between shadow-sm relative z-20 w-full">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center space-x-3 md:space-x-0 w-full md:w-auto justify-between md:justify-start">
          <button className="md:hidden text-[#0b1042] p-1">
            <Menu size={24} />
          </button>
          <img 
            src={ableLogo} 
            alt="Able Technologies Logo" 
            className="h-10 md:h-16 w-auto object-contain" 
          />
          {/* Mobile Cart Icon */}
          <div className="md:hidden relative p-1">
            <ShoppingCart size={24} className="text-[#0b1042]" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">0</span>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <div className="flex w-full rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50 focus-within:border-blue-200 transition-colors shadow-inner">
            <input 
              type="text" 
              placeholder="Search for machines, parts, gauges, glue..." 
              className="w-full bg-transparent py-2.5 px-6 outline-none text-sm text-gray-700"
            />
            <button className="bg-[#0b1042] text-white px-8 flex items-center justify-center hover:bg-blue-900 transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* User Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-[#0b1042] group-hover:border-[#0b1042] transition-colors bg-gray-50">
              <User size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium">Login / Register</span>
              <span className="text-xs font-bold text-[#0b1042]">My Account</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-[#0b1042] transition-colors" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">0</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium">My Cart</span>
              <span className="text-xs font-bold text-[#0b1042]">Rs. 0.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="hidden md:flex bg-[#0b1042] text-white w-full sticky top-0 z-30 shadow-md h-12">
        <div className="flex items-center w-full px-6">
          {/* All Categories Dropdown */}
          <div className="bg-red-600 h-full flex items-center px-6 space-x-2 cursor-pointer hover:bg-red-700 transition-colors font-medium">
            <Menu size={18} />
            <span className="text-sm">All Categories</span>
          </div>

          {/* Nav Links */}
          <ul className="flex flex-1 items-center space-x-8 ml-8 text-xs font-semibold tracking-wide">
            <li className="hover:text-red-400 cursor-pointer transition-colors">Home</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Shop</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Machines</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Spare Parts</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Gauges</li>
            <li className="hover:text-red-400 cursor-pointer transition-colors">Glue</li>
            <li className="text-red-500 cursor-pointer transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-red-500">Contact Us</li>
          </ul>

          {/* Get a Quote */}
          <button className="metallic-red-bg border-none flex items-center space-x-2 px-6 py-2 rounded-sm text-xs font-bold transition-transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span>Get a Quote</span>
          </button>
        </div>
      </nav>

      {/* Mobile Search (Shows below header on small screens) */}
      <div className="md:hidden bg-gray-50 p-3 border-b border-gray-200">
         <div className="flex w-full rounded-md border border-gray-200 overflow-hidden bg-white focus-within:border-blue-300 transition-colors shadow-sm">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-transparent py-2 px-3 outline-none text-sm text-gray-700"
            />
            <button className="bg-[#0b1042] text-white px-4 flex items-center justify-center">
              <Search size={16} />
            </button>
          </div>
      </div>
    </header>
  );
}
