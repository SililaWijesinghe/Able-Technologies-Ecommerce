import { useState, FormEvent } from 'react';
import { Mail, Phone, Lock, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [method, setMethod] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex-1 w-full"
    >
      <h2 className="text-2xl font-black text-[#0b1042] mb-2 tracking-tight">Send Us a Message</h2>
      <p className="text-gray-500 text-sm mb-8">
        Have a question, need a quotation or product recommendation?<br className="hidden md:block"/>
        Fill out the form and our team will get back to you shortly.
      </p>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Thank you! Your message has been received. Our team will contact you shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Your Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input required type="text" placeholder="Enter your full name" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] transition-colors" />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Company / Business Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              <input type="text" placeholder="Enter company name (optional)" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input required type="email" placeholder="youremail@example.com" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] transition-colors" />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={16} />
              </span>
              <input required type="tel" placeholder="07X XXX XXXX" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Subject <span className="text-red-500">*</span></label>
          <select required defaultValue="" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] transition-colors appearance-none cursor-pointer">
            <option value="" disabled>Select a subject</option>
            <option value="product">Product Inquiry</option>
            <option value="machine">Machine Inquiry</option>
            <option value="parts">Spare Parts</option>
            <option value="support">Technical Support</option>
            <option value="quote">Request a Quote</option>
            <option value="general">General Inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Your Message <span className="text-red-500">*</span></label>
          <textarea required rows={4} placeholder="Tell us what you need..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] transition-colors resize-none"></textarea>
          <div className="text-right text-[10px] text-gray-400 mt-1">0/500</div>
        </div>

        <div className="flex flex-col space-y-2 mt-4">
          <label className="text-xs font-bold text-gray-700">Preferred Contact Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button 
              type="button" 
              onClick={() => setMethod('email')}
              className={`flex items-center justify-center space-x-2 py-2 border rounded-lg text-sm transition-colors ${method === 'email' ? 'border-[#0b1042] text-[#0b1042] bg-blue-50 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <Mail size={16} />
              <span>Email</span>
            </button>
            <button 
              type="button" 
              onClick={() => setMethod('phone')}
              className={`flex items-center justify-center space-x-2 py-2 border rounded-lg text-sm transition-colors ${method === 'phone' ? 'border-[#0b1042] text-[#0b1042] bg-blue-50 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <Phone size={16} />
              <span>Phone</span>
            </button>
            <button 
              type="button" 
              onClick={() => setMethod('whatsapp')}
              className={`flex items-center justify-center space-x-2 py-2 border rounded-lg text-sm transition-colors ${method === 'whatsapp' ? 'border-green-600 text-green-700 bg-green-50 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        <button 
          disabled={isSubmitting}
          type="submit" 
          className="w-full metallic-red-bg py-3.5 mt-4 rounded-full font-bold text-white flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform shadow-lg shadow-red-900/30 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              <span>Send Message</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center space-x-2 mt-4 text-gray-400 text-xs">
          <Lock size={12} />
          <span>Your information is safe with us. We never share your details with anyone.</span>
        </div>
      </form>
    </motion.div>
  );
}
