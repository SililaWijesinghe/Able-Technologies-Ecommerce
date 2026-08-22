import { useState } from 'react';
import { Send, Headphones, Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Simulate form submission
    console.log(formData);
    alert('Message sent successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Form Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0b1042] mb-2">Send Us a Message</h2>
          <p className="text-gray-600 text-sm mb-8">
            Have a question, need a quotation or product recommendation?<br className="hidden md:block"/> Fill out the form and our team will get back to you shortly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Your Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Company / Business Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingIcon />
                  </div>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Enter company name (optional)" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="youremail@example.com" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="07X XXX XXXX" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
              <select required name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all bg-white appearance-none">
                <option value="" disabled>Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Machine Inquiry">Machine Inquiry</option>
                <option value="Spare Parts Inquiry">Spare Parts Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Request a Quote">Request a Quote</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Your Message <span className="text-red-500">*</span></label>
              <textarea required name="message" value={formData.message} onChange={handleChange} maxLength={500} rows={5} placeholder="Tell us what you need..." className="w-full p-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all resize-none"></textarea>
              <div className="text-right text-xs text-gray-400 mt-1">{formData.message.length}/500</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3">Preferred Contact Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button type="button" onClick={() => setFormData(prev => ({...prev, contactMethod: 'email'}))} className={`py-2.5 px-4 rounded-lg border flex items-center justify-center space-x-2 text-sm transition-all ${formData.contactMethod === 'email' ? 'border-[#0b1042] bg-blue-50 text-[#0b1042] font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <Mail size={16} /><span>Email</span>
                </button>
                <button type="button" onClick={() => setFormData(prev => ({...prev, contactMethod: 'phone'}))} className={`py-2.5 px-4 rounded-lg border flex items-center justify-center space-x-2 text-sm transition-all ${formData.contactMethod === 'phone' ? 'border-[#0b1042] bg-blue-50 text-[#0b1042] font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <Phone size={16} /><span>Phone</span>
                </button>
                <button type="button" onClick={() => setFormData(prev => ({...prev, contactMethod: 'whatsapp'}))} className={`py-2.5 px-4 rounded-lg border flex items-center justify-center space-x-2 text-sm transition-all ${formData.contactMethod === 'whatsapp' ? 'border-green-600 bg-green-50 text-green-700 font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <MessageCircle size={16} /><span>WhatsApp</span>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 rounded-full metallic-red-bg text-white font-semibold text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity shadow-md">
              <Send size={18} />
              <span>Send Message</span>
            </button>
            <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
              <LockIcon /> Your information is safe with us. We never share your details with anyone.
            </p>
          </form>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-2">
          <div className="bg-[#0b1042] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden h-full">
            {/* Background design */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-900/40 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <Headphones size={28} className="text-blue-400" />
                <h2 className="text-2xl font-bold">Get in Touch Directly</h2>
              </div>
              <p className="text-blue-200 text-sm mb-8">Talk to our friendly team for instant assistance</p>

              <div className="space-y-6">
                {/* Call Us */}
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone size={18} className="text-blue-300" />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Call Us</h4>
                      <p className="text-lg font-bold">038 222 1613</p>
                      <p className="text-lg font-bold">077 785 2476</p>
                    </div>
                    <div className="bg-green-500/20 text-green-400 text-[10px] px-3 py-1.5 rounded-md font-semibold text-center border border-green-500/30">
                      Mon - Sat<br/>8.00 AM - 5.30 PM
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle size={18} className="text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">WhatsApp Chat</h4>
                    <p className="text-blue-200 text-xs mb-3">Chat with us for quick support</p>
                    <button className="bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                      <span>Chat on WhatsApp</span>
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>

                {/* Email Us */}
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail size={18} className="text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Email Us</h4>
                    <p className="text-base font-semibold mb-3">able@ablero.com</p>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                      <span>Send Email</span>
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>

                {/* Visit Us */}
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin size={18} className="text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Visit Us</h4>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      No.10, Hathbodhi Mawatha,<br/>
                      Udahamulla, Panadura,<br/>
                      Sri Lanka.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small inline icons
function UserIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function BuildingIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
}
function LockIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
function ArrowRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
