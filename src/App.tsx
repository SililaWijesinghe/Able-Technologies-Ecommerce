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
import CategoryCards from './components/CategoryCards';
import TrustBar from './components/TrustBar';
import PromoGrid from './components/PromoGrid';
import BestSellers from './components/BestSellers';
import WhyChooseUs from './components/WhyChooseUs';
import NewsletterCTA from './components/NewsletterCTA';
import Footer from './components/Footer';

import whiteAbleLogo from './assets/whiteAbleLogo.png';
import ableLogo from './assets/ableLogo.png';
import toolImg from './assets/Tool.png';
import heroBg from './assets/heroBg.webp';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      {/* SVG Gradient Defs */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="metal-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4b4b" />
            <stop offset="45%" stopColor="#d41414" />
            <stop offset="100%" stopColor="#7a0000" />
          </linearGradient>
        </defs>
      </svg>

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
          <a href="#" className="text-blue-400 border-b-2 border-blue-400 pb-1">Home</a>
          <a href="#" className="hover:text-gray-300 transition-colors">About Us</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Shop</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Machines</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Spare Parts</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Gauges</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Glue</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Contact Us</a>
        </div>
        <button className="metallic-red-bg border-none px-8 py-4 flex items-center space-x-2 text-sm font-semibold transition-colors shadow-none rounded-none">
          <Send size={16} className="-rotate-45" />
          <span>Get a Quote</span>
        </button>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full min-h-[550px] md:h-[600px] bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat pb-10 md:pb-0"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark Navy Faded Overlay for Text Highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a2b] via-[#0b1042]/90 md:via-[#0b1042]/95 to-transparent z-0 w-full md:w-[75%]"></div>

        {/* Floating Tool Image (Robotic Arm) */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute right-[-15%] md:right-0 bottom-[10%] md:bottom-[-5%] w-[85%] md:w-[55%] h-[60%] md:h-[115%] z-10 pointer-events-none flex items-end justify-center opacity-40 md:opacity-100"
        >
          <div className="relative w-full h-full flex justify-center items-end">
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={toolImg} 
              alt="Industrial Robotic Arm" 
              className="h-full w-auto object-contain relative z-10 drop-shadow-[-25px_15px_25px_rgba(0,0,0,0.6)]"
            />
            {/* Ground Shadow for Base */}
            <div className="absolute bottom-[3%] left-[45%] -translate-x-1/2 w-[35%] h-[40px] bg-black/70 blur-[20px] rounded-[100%] z-0"></div>
            <div className="absolute bottom-[2%] left-[45%] -translate-x-1/2 w-[25%] h-[20px] bg-black/90 blur-[10px] rounded-[100%] z-0"></div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col pt-8 md:pt-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center mb-4 md:mb-5 w-fit"
          >
            <div className="w-1.5 md:w-2 h-4 md:h-5 bg-gradient-to-b from-red-200 via-red-600 to-red-800 transform -skew-x-[20deg] mr-2 shadow-[0_0_8px_rgba(255,0,0,0.5)]"></div>
            <div className="relative flex items-center pr-12 md:pr-20 pl-2 md:pl-3 py-1 md:py-1.5">
              <div className="absolute inset-0 bg-gradient-to-r from-[#b30000] via-[#7a0000]/70 to-transparent transform -skew-x-[20deg] origin-left border-l-[3px] border-[#ff3333]"></div>
              <span className="relative text-white font-bold italic tracking-widest text-[10px] md:text-[11px] z-10 drop-shadow-sm">
                PRECISION. PERFORMANCE. POSSIBILITIES.
              </span>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-4xl md:text-6xl font-black italic tracking-tight uppercase leading-[1.1] mb-4 md:mb-6"
          >
            <span className="text-white block">ALL KIND OF</span>
            <span className="metallic-red-text block">MACHINE <span className="text-white">MAKERS</span></span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-300 text-sm md:text-lg max-w-[85%] md:max-w-xl mb-6 md:mb-10 leading-relaxed"
          >
            Your one-stop solution for high-quality machines, spare parts, gauges and industrial supplies.
          </motion.p>

          {/* Features Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-2 gap-4 md:flex md:items-center md:space-x-8 mb-8 md:mb-12"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <ShieldCheck size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">High Quality Products</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <Award size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">Trusted by Professionals</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <Truck size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">Fast & Reliable Delivery</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
                <Headphones size={16} className="text-blue-400 md:w-5 md:h-5" />
              </div>
              <span className="text-white text-xs md:text-sm font-medium leading-tight max-w-[100px]">Expert Support</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <button className="metallic-red-bg text-white rounded-full px-6 py-3 md:px-8 md:py-3.5 flex items-center justify-center space-x-3 font-semibold transition-transform hover:scale-105 shadow-lg shadow-red-900/40 text-sm md:text-base w-fit">
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </button>
            
            <button className="bg-transparent border border-blue-400 text-white rounded-full px-6 py-3 md:px-8 md:py-3.5 flex items-center justify-center space-x-3 font-semibold hover:bg-blue-900/50 transition-colors backdrop-blur-sm text-sm md:text-base w-fit">
              <span>View Categories</span>
              <LayoutGrid size={18} />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Page Content */}
      <CategoryCards />
      <TrustBar />
      <PromoGrid />
      <BestSellers />
      <WhyChooseUs />
      <NewsletterCTA />
      <Footer />

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
        <a href="#" className="flex flex-col items-center p-2 metallic-red-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#metal-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium mt-1">Home</span>
        </a>
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

    </div>
  );
}
