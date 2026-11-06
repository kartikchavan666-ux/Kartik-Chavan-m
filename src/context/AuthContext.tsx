import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/index.ts';
import { supabaseService, getSupabaseCredentials } from '../lib/supabase.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => Promise<void>;
  isLiveDb: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveDb, setIsLiveDb] = useState<boolean>(false);

  useEffect(() => {
    async function initAuth() {
      try {
        const { isReal } = getSupabaseCredentials();
        setIsLiveDb(isReal);

        const { user: current } = await supabaseService.getCurrentSession();
        setUser(current);
      } catch (err) {
        console.error('Failed to init auth session:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await supabaseService.signInWithPassword(email, password);
      if (res.error) {
        return { success: false, error: res.error.message || 'Authentication failed' };
      }
      if (res.data?.user) {
        const u: User = {
          id: res.data.user.id,
          email: res.data.user.email || email,
          name: (res.data.user as any).name || (res.data.user as any).user_metadata?.name || email.split('@')[0],
          avatar_url: (res.data.user as any).avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
        };
        setUser(u);
        return { success: true };
      }
      return { success: false, error: 'User not returned' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const res = await supabaseService.signUp(email, password, name);
      if (res.error) {
        return { success: false, error: res.error.message || 'Registration failed' };
      }
      if (res.data?.user) {
        const u: User = {
          id: res.data.user.id,
          email: res.data.user.email || email,
          name: name || email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        };
        setUser(u);
        return { success: true };
      }
      return { success: true }; // for email verification if required
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      await supabaseService.signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const res = await supabaseService.resetPasswordForEmail(email);
      if (res.error) {
        return { success: false, error: res.error.message || 'Failed to send reset email' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not reset password' };
    }
  };

  const loginAsDemo = async () => {
    setLoading(true);
    await login('alex@taskflow.dev', 'password123');
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        loginAsDemo,
        isLiveDb,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
