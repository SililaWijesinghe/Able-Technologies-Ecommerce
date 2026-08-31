import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export default function QuoteModal({ isOpen, onClose, product }: QuoteModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setFormData({
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            message: ''
          });
        }
      };
      loadUserData();
    }
  }, [isOpen]);

  const validate = () => {
    let tempErrors = { name: '', email: '', phone: '', message: '' };
    let isValid = true;

    if (!formData.name.trim()) { tempErrors.name = 'Name is required'; isValid = false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { tempErrors.email = 'Valid email is required'; isValid = false; }
    if (formData.phone && formData.phone.length < 10) { tempErrors.phone = 'Minimum 10 digits required'; isValid = false; }
    if (!formData.message.trim()) { tempErrors.message = 'Message is required'; isValid = false; }
    
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const { error: submitError } = await supabase.from('service_inquiries').insert({
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        product_id: product.id,
        inquiry_type: product.is_rentable ? 'Rental' : 'Service',
        user_id: currentUser?.id
      });

      if (submitError) throw submitError;
      
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_24px_60px_rgba(11,16,66,0.15),inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-[2rem] w-full max-w-md p-6 relative overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/50 hover:bg-white border border-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-sm z-20"><X size={20} /></button>

            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
                  <CheckCircle2 size={40} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Rental Request Received!</h3>
                <p className="text-sm text-slate-500 font-medium px-4">
                  We have received your inquiry for <span className="font-bold">{product.name}</span>. Our technical team will reach out to <span className="font-bold">{formData.email}</span> within 24 hours.
                </p>
                <button onClick={() => { setSuccess(false); onClose(); }} className="mt-8 bg-[#0b1042] text-white px-8 py-3 rounded-full font-bold hover:bg-[#151c5c] transition-colors">Done</button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-[#0b1042] mb-4">Request {product?.is_rentable ? 'Rental' : 'Service'}</h2>
                  <div className="bg-white/50 backdrop-blur-md p-3 rounded-2xl flex items-center gap-4 border border-white/60">
                    <img src={product.image_urls?.[0] || product.image_url} alt={product.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{product.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">Rs. {product.price?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
                  
                  {['name', 'email', 'phone', 'message'].map((field) => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0b1042] capitalize">{field === 'message' ? 'Requirements' : field}</label>
                      {field === 'message' ? (
                        <textarea required rows={3} value={formData[field]} onChange={(e) => setFormData({...formData, [field]: e.target.value})} className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-[#0b1042] rounded-xl p-3.5 text-slate-800 outline-none transition-all shadow-inner text-sm resize-none" placeholder="Please specify your requirements..." />
                      ) : (
                        <input type={field === 'email' ? 'email' : 'text'} required={field !== 'phone'} value={formData[field]} onChange={(e) => setFormData({...formData, [field]: e.target.value})} className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-[#0b1042] rounded-xl p-3.5 text-slate-800 outline-none transition-all shadow-inner text-sm" placeholder={`Your ${field}`} />
                      )}
                      {errors[field as keyof typeof errors] && <p className="text-red-500 text-xs">{errors[field as keyof typeof errors]}</p>}
                    </div>
                  ))}

                  <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-[#0b1042] hover:bg-[#151c5c] text-white rounded-2xl py-4 font-bold shadow-md flex items-center justify-center gap-2 transition-colors relative overflow-hidden group disabled:opacity-70">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><span className="text-[15px]">Submit Request</span><Send size={18} /></>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
