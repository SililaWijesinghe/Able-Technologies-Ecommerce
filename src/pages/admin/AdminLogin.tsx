import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Invalid login credentials.');
      }

      // Verify Admin Role
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError || profile?.role !== 'ADMIN') {
        await supabase.auth.signOut();
        throw new Error('Access Denied: Administrator privileges required.');
      }

      // Success, redirect to dashboard
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1042] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-8 text-white">
          <div className="flex items-center text-3xl font-black tracking-wider mb-2">
            <span className="text-blue-500 mr-2 text-4xl">▲</span> ABLE
          </div>
          <div className="text-[10px] uppercase tracking-widest text-red-500 font-bold">
            Technologies (Pvt) Ltd
          </div>
          <div className="mt-6 flex items-center space-x-2 text-gray-400 bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
            <Lock size={14} />
            <span>Secure Admin Portal</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 text-center">Administrator Login</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-start space-x-3 border border-red-100">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="admin@abletech.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full metallic-red-bg hover:bg-red-700 text-white py-3.5 rounded-xl flex items-center justify-center transition-colors text-sm font-black shadow-lg shadow-red-900/30 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Authenticate'}
              </button>
            </form>
          </div>
          <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-medium">
              This portal is strictly restricted to authorized personnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
