import { Facebook, Linkedin, Instagram, Youtube, MapPin, Phone, Mail, Heart } from 'lucide-react';
import whiteAbleLogo from '../assets/whiteAbleLogo.png';

export default function Footer() {
  return (
    <footer className="bg-[#0b1042] pt-16 pb-6 text-blue-100 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Column 1 - Brand */}
          <div className="flex flex-col pr-0 lg:pr-8">
            <img src={whiteAbleLogo} alt="Able Technologies" className="w-48 mb-6 object-contain" />
            <p className="text-sm text-blue-200 leading-relaxed mb-6">
              Your trusted partner for industrial machines, spare parts, gauges and more. We deliver quality, reliability and performance.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-colors">
                <Facebook size={14} className="text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-colors">
                <Linkedin size={14} className="text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-colors">
                <Instagram size={14} className="text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-colors">
                <Youtube size={14} className="text-white" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-600 hover:border-green-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Shop', 'Machines', 'Spare Parts', 'Gauges', 'Glue', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors relative inline-block group">
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3">
              {['My Account', 'Order History', 'Shipping Policy', 'Return & Refund', 'Terms & Conditions', 'Privacy Policy', 'FAQs'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-blue-200 hover:text-white transition-colors relative inline-block group">
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact Us */}
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start space-x-3 text-sm text-blue-200">
                <MapPin size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <span>No.10, Hathbodhi Mawatha,<br />Udahamulla, Panadura,<br />Sri Lanka.</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-blue-200">
                <Phone size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:0382221613" className="hover:text-white transition-colors">038 222 1613</a>
                  <a href="tel:0777852476" className="hover:text-white transition-colors">077 785 2476</a>
                </div>
              </li>
              <li className="flex items-center space-x-3 text-sm text-blue-200">
                <Mail size={18} className="text-blue-400 shrink-0" />
                <a href="mailto:able@ablero.com" className="hover:text-white transition-colors">able@ablero.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-blue-300">
          <p>© 2024 Able Technologies (Pvt) Ltd. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Designed with <Heart size={12} className="text-red-500 mx-1 fill-red-500" /> for Industrial Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
