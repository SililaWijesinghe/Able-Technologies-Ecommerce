import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Shield, 
  RefreshCw, 
  Headphones, 
  Award, 
  Facebook, 
  Linkedin, 
  Instagram, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp, 
  Users,
  CheckCircle,
  Truck,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import whiteAbleLogo from '../assets/whiteAbleLogo.png';
import { fetchSettings } from '../services/api';

export default function Footer() {

  const handleComingSoon = (e: any) => {
    e.preventDefault();
    toast('Coming soon!', { icon: '🚧', style: { borderRadius: '10px', background: '#0b1042', color: '#fff' } });
  };

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings().then(data => data && setSettings(data));
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <footer className="relative bg-[#040822] overflow-hidden">
      
      {/* ================================================== */}
      {/* SECTION 01: WHY THOUSANDS OF INDUSTRIES TRUST US */}
      {/* ================================================== */}
      <div className="relative pt-20 pb-16 px-4 md:px-6">
        {/* Subtle background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Faint industrial grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-red-600"></div>
              <span className="text-red-500 text-xs font-bold uppercase tracking-[0.2em]">Our Track Record</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-red-600"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Why Thousands of Industries Trust Us
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto text-sm">
              Reliable industrial solutions backed by quality, experience and professional support.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {/* Stat 1 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-[#0a0f33]/60 backdrop-blur-md border border-blue-500/10 hover:border-blue-500/30 rounded-2xl p-6 overflow-hidden transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#111945] border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-900/40 group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <Shield className="text-blue-400 group-hover:text-blue-300" size={24} strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-black text-white mb-1 group-hover:text-blue-100 transition-colors">10+</div>
                <div className="text-xs font-semibold text-blue-200/60 tracking-wide uppercase">Years of<br/>Experience</div>
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-[#0a0f33]/60 backdrop-blur-md border border-blue-500/10 hover:border-blue-500/30 rounded-2xl p-6 overflow-hidden transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#111945] border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-900/40 group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <Users className="text-blue-400 group-hover:text-blue-300" size={24} strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-black text-white mb-1 group-hover:text-blue-100 transition-colors">5000+</div>
                <div className="text-xs font-semibold text-blue-200/60 tracking-wide uppercase">Happy<br/>Customers</div>
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-[#0a0f33]/60 backdrop-blur-md border border-blue-500/10 hover:border-blue-500/30 rounded-2xl p-6 overflow-hidden transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#111945] border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-900/40 group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <CheckCircle className="text-blue-400 group-hover:text-blue-300" size={24} strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-black text-white mb-1 group-hover:text-blue-100 transition-colors">100%</div>
                <div className="text-xs font-semibold text-blue-200/60 tracking-wide uppercase">Genuine<br/>Products</div>
              </div>
            </motion.div>

            {/* Stat 4 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-[#0a0f33]/60 backdrop-blur-md border border-red-500/10 hover:border-red-500/30 rounded-2xl p-6 overflow-hidden transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#111945] border border-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-900/40 group-hover:border-red-400/40 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300">
                  <Truck className="text-red-400 group-hover:text-red-300" size={24} strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-black text-white mb-1 group-hover:text-red-100 transition-colors">Islandwide</div>
                <div className="text-xs font-semibold text-blue-200/60 tracking-wide uppercase">Fast<br/>Delivery</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SECTION 02: TRUST / SERVICE BENEFITS STRIP */}
      {/* ================================================== */}
      <div className="relative z-20 bg-gradient-to-r from-[#eef2fc] via-[#f8f9ff] to-[#fcebed] shadow-[0_-10px_40px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] border-y border-white/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-x-0 lg:divide-x lg:divide-blue-900/10">
            
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4 px-2 group"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(11,16,66,0.06)] border border-blue-50 flex items-center justify-center group-hover:shadow-[0_6px_16px_rgba(11,16,66,0.1)] group-hover:-translate-y-1 transition-all duration-300">
                <Shield className="text-blue-700 group-hover:scale-110 transition-transform duration-300" size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-[#0b1042] group-hover:text-blue-900 transition-colors">Secure Checkout</h5>
                <p className="text-xs text-gray-500 mt-1 font-medium">100% Protected</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4 px-2 lg:pl-8 group"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(11,16,66,0.06)] border border-blue-50 flex items-center justify-center group-hover:shadow-[0_6px_16px_rgba(11,16,66,0.1)] group-hover:-translate-y-1 transition-all duration-300">
                <RefreshCw className="text-blue-700 group-hover:scale-110 transition-transform duration-300" size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-[#0b1042] group-hover:text-blue-900 transition-colors">Easy Returns</h5>
                <p className="text-xs text-gray-500 mt-1 font-medium">Hassle Free</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4 px-2 lg:pl-8 group"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(11,16,66,0.06)] border border-blue-50 flex items-center justify-center group-hover:shadow-[0_6px_16px_rgba(11,16,66,0.1)] group-hover:-translate-y-1 transition-all duration-300">
                <Headphones className="text-blue-700 group-hover:scale-110 transition-transform duration-300" size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-[#0b1042] group-hover:text-blue-900 transition-colors">Customer Support</h5>
                <p className="text-xs text-gray-500 mt-1 font-medium">Always Here to Help</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4 px-2 lg:pl-8 group"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(11,16,66,0.06)] border border-blue-50 flex items-center justify-center group-hover:shadow-[0_6px_16px_rgba(11,16,66,0.1)] group-hover:-translate-y-1 transition-all duration-300">
                <Award className="text-blue-700 group-hover:scale-110 transition-transform duration-300" size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-[#0b1042] group-hover:text-blue-900 transition-colors">Quality Assured</h5>
                <p className="text-xs text-gray-500 mt-1 font-medium">Genuine Products</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* SECTION 03: PREMIUM MAIN FOOTER */}
      {/* ================================================== */}
      <div className="relative pt-16 md:pt-20 pb-28 md:pb-8 bg-[#040822]">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Top CTA Row */}
          <div className="bg-[#0a0f33]/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between mb-16 shadow-2xl">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="font-poppins text-xl md:text-2xl font-extrabold text-white mb-2 tracking-tight">Need a Custom Industrial Solution?</h3>
              <p className="font-sans text-[14px] md:text-[15px] text-blue-200/70">Talk to our team and find the right solution for your business.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a 
                href="/contact" 
                className="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_15px_rgba(220,38,38,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_20px_rgba(220,38,38,0.6)] transition-all duration-300 flex items-center"
              >
                Get a Quote <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href={`https://wa.me/${(settings?.whatsapp_number || '0777852476').replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold rounded-xl transition-all duration-300 flex items-center group"
              >
                <WhatsAppIcon size={18} className="mr-2 text-[#25D366] group-hover:scale-110 transition-transform" /> WhatsApp Us
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-12">
            
            {/* Col 1 - Brand */}
            <div className="lg:col-span-4 pr-0 lg:pr-8">
              <Link to="/" className="inline-block mb-6">
                <img 
                  src={whiteAbleLogo} 
                  alt="Able Technologies Logo" 
                  className="h-12 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                />
              </Link>
              <p className="text-blue-100/60 text-sm mb-8 leading-relaxed font-medium">
                Your trusted partner for industrial machines, spare parts, gauges and more. We deliver quality, reliability and performance.
              </p>
              
              <div className="flex items-center space-x-3">
                <a href="#!" onClick={handleComingSoon} className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/70 hover:text-white hover:bg-[#1877F2] hover:border-transparent hover:shadow-[0_0_20px_rgba(24,119,242,0.4)] transition-all duration-300" title="Facebook">
                  <Facebook size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#!" onClick={handleComingSoon} className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/70 hover:text-white hover:bg-[#0A66C2] hover:border-transparent hover:shadow-[0_0_20px_rgba(10,102,194,0.4)] transition-all duration-300" title="LinkedIn">
                  <Linkedin size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="#!" onClick={handleComingSoon} className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/70 hover:text-white hover:bg-[#E4405F] hover:border-transparent hover:shadow-[0_0_20px_rgba(228,64,95,0.4)] transition-all duration-300" title="Instagram">
                  <Instagram size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href={`https://wa.me/${(settings?.whatsapp_number || '0777852476').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/70 hover:text-white hover:bg-[#25D366] hover:border-transparent hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300"
                  title="WhatsApp"
                >
                  <WhatsAppIcon size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Col 2 - Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="font-poppins text-white font-bold mb-6 text-[15px] tracking-wider uppercase flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-sm mr-2 inline-block"></span> Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'About Us', path: '#!', available: false },
                  { name: 'Shop', path: '/shop' },
                  { name: 'Machines', path: '/shop?category=machines' },
                  { name: 'Spare Parts', path: '/shop?category=spare-parts' },
                  { name: 'Gauges', path: '/shop?category=gauges' },
                  { name: 'Glue', path: '/shop?category=glue' },
                  { name: 'Contact Us', path: '/contact' }
                ].map((link, i) => (
                  <li key={i}>
                    <Link 
                       to={link.path} 
                       onClick={link.available === false ? handleComingSoon : undefined}
                       className="group flex items-center text-blue-100/60 hover:text-white text-sm font-medium transition-colors"
                    >
                      <ChevronRight size={14} className="opacity-0 -ml-4 mr-2 group-hover:opacity-100 group-hover:ml-0 text-red-500 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 - Customer Service */}
            <div className="lg:col-span-3">
              <h4 className="font-poppins text-white font-bold mb-6 text-[15px] tracking-wider uppercase flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-sm mr-2 inline-block"></span> Customer Service
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'My Account', path: '/profile', available: true },
                  { name: 'Order History', path: '/profile', available: true },
                  { name: 'Shipping Policy', path: '#!', available: false },
                  { name: 'Return & Refund', path: '#!', available: false },
                  { name: 'Terms & Conditions', path: '#!', available: false },
                  { name: 'Privacy Policy', path: '#!', available: false },
                  { name: 'FAQ\'s', path: '#!', available: false }
                ].map((link, i) => (
                  <li key={i}>
                    <Link 
                       to={link.path}
                       onClick={link.available === false ? handleComingSoon : undefined}
                       className="group flex items-center text-blue-100/60 hover:text-white text-sm font-medium transition-colors"
                    >
                      <ChevronRight size={14} className="opacity-0 -ml-4 mr-2 group-hover:opacity-100 group-hover:ml-0 text-blue-500 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 - Contact Us */}
            <div className="lg:col-span-3">
              <h4 className="font-poppins text-white font-bold mb-6 text-[15px] tracking-wider uppercase flex items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-sm mr-2 inline-block"></span> Contact Us
              </h4>
              <ul className="space-y-5">
                <li className="flex items-start group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 mt-0.5 group-hover:bg-blue-900/30 group-hover:border-blue-500/30 transition-colors">
                    <MapPin size={14} className="text-blue-400" />
                  </div>
                  <span className="text-blue-100/70 text-sm leading-relaxed font-medium">No.10, Hathbodhi Mawatha,<br/>Udahamulla, Panadura, Sri Lanka. 12500.<br/><br/>No.26, Kulathunga Road,<br/>Udahamulla, Panadura, Sri Lanka. 12500.</span>
                </li>
                <li className="flex items-start group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 mt-0.5 group-hover:bg-blue-900/30 group-hover:border-blue-500/30 transition-colors">
                    <Phone size={14} className="text-blue-400" />
                  </div>
                  <span className="text-blue-100/70 text-sm font-medium leading-relaxed">+94 38 222 1613<br/>{settings?.whatsapp_number || '+94 777 852 476'}<br/>+94 77 869 2075</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 group-hover:bg-blue-900/30 group-hover:border-blue-500/30 transition-colors">
                    <Mail size={14} className="text-blue-400" />
                  </div>
                  <span className="text-blue-100/70 text-sm font-medium">{settings?.support_email || 'able@ablero.com'}</span>
                </li>
                <li className="flex items-center group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mr-3 group-hover:bg-blue-900/30 group-hover:border-blue-500/30 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  </div>
                  <a href="https://www.ablero.com" target="_blank" rel="noopener noreferrer" className="text-blue-100/70 text-sm font-medium hover:text-white transition-colors">www.ablero.com</a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="w-full h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-blue-100/50 font-medium text-center md:text-left space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Able Technologies (Pvt) Ltd. All Rights Reserved.</p>
          <p className="flex items-center flex-wrap justify-center md:justify-end gap-1.5">
            <span>designed and developed by</span>
            <a 
              href="https://premierdigital.lk" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="metallic-red-text font-bold hover:underline transition-all"
            >
              Premier Digital Pvt Ltd
            </a>
          </p>
        </div>
      </div>

    </footer>
  );
}
