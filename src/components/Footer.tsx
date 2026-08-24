import { Shield, RefreshCw, Headphones, Award, Facebook, Linkedin, Instagram, MapPin, Phone, Mail, ArrowUp, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import whiteAbleLogo from '../assets/whiteAbleLogo.png';
import { fetchSettings } from '../services/api';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings().then(data => data && setSettings(data));
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer>
      {/* Mobile Contact Cards */}
      <div className="md:hidden max-w-7xl mx-auto px-4 pt-8 pb-4 grid grid-cols-3 gap-3">
        <a href="#" className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-xl py-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-2">
            <MessageCircle size={20} className="text-green-500" />
          </div>
          <span className="text-[10px] font-semibold text-gray-700">WhatsApp</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-xl py-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <Phone size={20} className="text-blue-500" />
          </div>
          <span className="text-[10px] font-semibold text-gray-700">Call Us</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-xl py-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
            <Mail size={20} color="url(#metal-red)" />
          </div>
          <span className="text-[10px] font-semibold text-gray-700">Email Us</span>
        </a>
      </div>

      {/* Trust Bar Footer */}
      <div className="bg-[#eaf1ff] py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:space-x-4 text-[#0b1042]">
            <Shield size={24} strokeWidth={1.5} className="mb-2 md:mb-0 md:w-7 md:h-7" />
            <div>
              <h5 className="font-bold text-[11px] md:text-sm">Secure Checkout</h5>
              <p className="text-[9px] md:text-xs text-gray-600 mt-0.5 md:mt-0.5">100% Protected</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:space-x-4 text-[#0b1042]">
            <RefreshCw size={24} strokeWidth={1.5} className="mb-2 md:mb-0 md:w-7 md:h-7" />
            <div>
              <h5 className="font-bold text-[11px] md:text-sm">Easy Returns</h5>
              <p className="text-[9px] md:text-xs text-gray-600 mt-0.5 md:mt-0.5">Hassle Free</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:space-x-4 text-[#0b1042]">
            <Headphones size={24} strokeWidth={1.5} className="mb-2 md:mb-0 md:w-7 md:h-7" />
            <div>
              <h5 className="font-bold text-[11px] md:text-sm">Customer Support</h5>
              <p className="text-[9px] md:text-xs text-gray-600 mt-0.5 md:mt-0.5">Always Here to Help</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left md:space-x-4 text-[#0b1042]">
            <Award size={24} strokeWidth={1.5} className="mb-2 md:mb-0 md:w-7 md:h-7" />
            <div>
              <h5 className="font-bold text-[11px] md:text-sm">Quality Assured</h5>
              <p className="text-[9px] md:text-xs text-gray-600 mt-0.5 md:mt-0.5">Genuine Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#040822] pt-12 md:pt-16 pb-20 md:pb-6 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-8 md:mb-12 border-b border-white/10 pb-10 md:pb-12">
          
          {/* Col 1 */}
          <div className="md:pr-4">
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src={whiteAbleLogo} 
                alt="Able Technologies Logo" 
                className="h-14 object-contain" 
              />
            </div>
            <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
              Your trusted partner for industrial machines, spare parts, gauges and more. We deliver quality, reliability and performance.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] transition-colors"><Facebook size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#0A66C2] transition-colors"><Linkedin size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#E4405F] transition-colors"><Instagram size={14} /></a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-[13px] md:text-sm tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-2 md:space-y-3">
              {['Home', 'About Us', 'Shop', 'Machines', 'Spare Parts', 'Gauges', 'Glue', 'Contact Us'].map((link, i) => (
                <li key={i}><a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors block py-1 md:py-0">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-[13px] md:text-sm tracking-wider">CUSTOMER SERVICE</h4>
            <ul className="space-y-2 md:space-y-3">
              {['My Account', 'Order History', 'Shipping Policy', 'Return & Refund', 'Terms & Conditions', 'Privacy Policy', 'FAQ\'s'].map((link, i) => (
                <li key={i}><a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors block py-1 md:py-0">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-[13px] md:text-sm tracking-wider">CONTACT US</h4>
            <ul className="space-y-4 md:space-y-5">
              <li className="flex items-start text-gray-400 text-xs md:text-sm">
                <MapPin size={16} color="url(#metal-red)" className="mr-3 flex-shrink-0 mt-0.5 md:w-[18px] md:h-[18px]" />
                <span className="leading-relaxed">No 10, Hathbodhi Mawatha,<br/>Udahamulla, Panadura, Sri Lanka.</span>
              </li>
              <li className="flex items-start text-gray-400 text-xs md:text-sm">
                <Phone size={16} color="url(#metal-red)" className="mr-3 flex-shrink-0 mt-0.5 md:w-[18px] md:h-[18px]" />
                <div className="flex flex-col leading-relaxed">
                  <span>{settings?.whatsapp_number || '077 785 2476'}</span>
                </div>
              </li>
              <li className="flex items-center text-gray-400 text-xs md:text-sm">
                <Mail size={16} color="url(#metal-red)" className="mr-3 flex-shrink-0 md:w-[18px] md:h-[18px]" />
                <span>{settings?.support_email || 'able@ablero.com'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] text-gray-500 font-medium text-center md:text-left">
          <p className="mb-2 md:mb-0">© 2024 Able Technologies (Pvt) Ltd. All Rights Reserved.</p>
          <p>Designed by <a href="https://premierdigital.lk" target="_blank" rel="noopener noreferrer" className="metallic-red-text font-bold text-[12px] hover:underline">Premier Digital Pvt Ltd</a></p>
        </div>

        {/* Scroll to top */}
        <button 
          onClick={scrollToTop}
          className="absolute bottom-[90px] md:bottom-6 right-6 md:right-12 w-10 h-10 metallic-red-bg border-none text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </footer>
  );
}
