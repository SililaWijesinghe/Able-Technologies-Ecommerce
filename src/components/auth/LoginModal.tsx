import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = activeTab === 'login' 
        ? { email, password } 
        : { email, password, fullName, phone };
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `${activeTab === 'login' ? 'Login' : 'Registration'} failed.`);
      }

      if (activeTab === 'register') {
        // Upon successful registration, we can automatically log them in
        // Supabase register doesn't always return a session if email confirmation is required,
        // but since we are mocking/assuming no email confirmation for now:
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
           setSuccess('Registration successful! Please sign in.');
           setActiveTab('login');
           setLoading(false);
           return;
        }
        login(loginData.session.access_token, loginData.user);
        onClose();
      } else {
        login(data.session.access_token, data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 pb-0">
              <div className="flex space-x-6">
                <button
                  onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                  className={`pb-4 text-base font-black transition-colors border-b-2 ${activeTab === 'login' ? 'border-[#0b1042] text-[#0b1042]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
                  className={`pb-4 text-base font-black transition-colors border-b-2 ${activeTab === 'register' ? 'border-[#0b1042] text-[#0b1042]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  Create Account
                </button>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100 mb-4"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 font-semibold">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg border border-green-100 font-semibold">
                  {success}
                </div>
              )}
              
              {activeTab === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              {activeTab === 'login' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042]" />
                    <label htmlFor="remember" className="ml-2 text-xs font-semibold text-gray-600 cursor-pointer">Remember me</label>
                  </div>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</a>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full metallic-red-bg hover:bg-red-700 text-white py-3.5 rounded-xl flex items-center justify-center transition-colors text-sm font-black shadow-lg shadow-red-900/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (activeTab === 'login' ? 'Login securely' : 'Create Account')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
