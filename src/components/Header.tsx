import { Link } from 'react-router-dom';
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
  Award, 
  Truck, 
  Headphones, 
  ArrowRight, 
  LayoutGrid,
  Phone,
  Mail
} from 'lucide-react';
import { motion } from 'motion/react';

import whiteAbleLogo from '../assets/whiteAbleLogo.png';
import ableLogo from '../assets/ableLogo.png';

export default function Header() {
  return (
    <>

      {/* Mobile Header */}
      <div className="md:hidden bg-[#0b1042] flex flex-col pt-4 pb-4 px-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <button className="text-white">
            <Menu size={28} />
          </button>
          <img 
            src={whiteAbleLogo} 
            alt="Able Technologies Logo" 
            className="h-14 object-contain" 
          />
          <button className="relative">
            <ShoppingCart size={28} className="text-white" />
            <span className="absolute -top-1 -right-2 metallic-red-bg border-none text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
        <div className="flex w-full rounded-full bg-white overflow-hidden p-1">
          <input 
            type="text" 
            placeholder="Search for machines, parts, gauges..." 
            className="w-full px-4 py-2 outline-none text-sm text-gray-700"
          />
          <button className="bg-[#0b1042] text-white p-2 rounded-full flex items-center justify-center aspect-square">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Top Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex bg-[#0b1042] text-white text-xs py-2 px-6 justify-between items-center"
      >
        <div className="flex items-center space-x-2">
          {/* Logo placeholder for top left if needed, but image shows text only on right/center */}
          <span className="text-gray-300 italic">All Kind of Machine Makers</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Phone size={14} />
            <span>Need Help? 038 222 1613 | 077 785 2476</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-400"><Facebook size={14} /></a>
            <a href="#" className="hover:text-blue-400"><Linkedin size={14} /></a>
            <a href="#" className="hover:text-green-400"><MessageCircle size={14} /></a>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hidden md:flex bg-white py-4 px-6 items-center justify-between shadow-sm relative z-20"
      >
        {/* Logo Area */}
        <div className="flex items-center">
          <img 
            src={ableLogo} 
            alt="Able Technologies Logo" 
            className="h-20 md:h-24 w-auto object-contain" 
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-12">
          <div className="flex w-full rounded-full border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input 
              type="text" 
              placeholder="Search for machines, parts, gauges, glue..." 
              className="w-full px-5 py-2.5 outline-none text-sm text-gray-700"
            />
            <button className="bg-[#0b1042] text-white px-6 py-2.5 hover:bg-blue-900 transition-colors">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Account & Cart */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-500 transition-colors">
              <User size={20} className="text-gray-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Login / Register</span>
              <span className="text-sm font-semibold text-gray-800">My Account</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <ShoppingCart size={28} className="text-gray-700" />
              <span className="absolute -top-1 -right-2 metallic-red-bg border-none text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">My Cart</span>
              <span className="text-sm font-bold text-gray-800">Rs. 0.00</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:flex bg-[#0b1042] text-white items-center"
      >
        <div className="metallic-red-bg border-none px-6 py-4 flex items-center space-x-2 cursor-pointer w-64 shadow-none">
          <Menu size={20} />
          <span className="font-semibold text-sm">All Categories</span>
        </div>
        <div className="flex-1 px-8 flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className="text-blue-400 border-b-2 border-blue-400 pb-1">Home</Link>
          <a href="#" className="hover:text-gray-300 transition-colors">About Us</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Shop</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Machines</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Spare Parts</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Gauges</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Glue</a>
          <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact Us</Link>
        </div>
        <button className="metallic-red-bg border-none px-8 py-4 flex items-center space-x-2 text-sm font-semibold transition-colors shadow-none rounded-none">
          <Send size={16} className="-rotate-45" />
          <span>Get a Quote</span>
        </button>
      </motion.nav>


    </>
  );
}