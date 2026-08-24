import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await handleSession(session);
        } else {
          // If no supabase session but local token exists (from legacy custom login)
          const localToken = localStorage.getItem('auth_token');
          if (localToken) {
            // Ideally we'd hydrate, but we lack the Supabase session context here
            // This is a bridge for legacy login
            setIsAuthenticated(true);
            // user object was not fully saved locally, we'd just leave it mostly empty or fetch it
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleSession(session);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('auth_token');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSession = async (session: any) => {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role, full_name, phone')
        .eq('id', session.user.id)
        .single();

      setIsAuthenticated(true);
      setUser({ 
        ...session.user, 
        role: profile?.role || 'CUSTOMER',
        full_name: profile?.full_name || session.user.user_metadata?.full_name,
        phone: profile?.phone || session.user.user_metadata?.phone,
        ...profile 
      });
      localStorage.setItem('auth_token', session.access_token);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setIsAuthenticated(true);
      setUser({ ...session.user, role: 'CUSTOMER' });
      localStorage.setItem('auth_token', session.access_token);
    }
  };

  const login = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('auth_token', token);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
