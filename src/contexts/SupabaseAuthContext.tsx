"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ data?: any; error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('SupabaseAuthContext.signIn called with:', { email, password: '***' });
    console.log('Supabase client configured with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase anon key (first 50 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50));
    
    // Validate input
    if (!email || !password) {
      const error = new Error('Email and password are required');
      console.error('Validation error:', error.message);
      return { error };
    }
    
    if (!email.includes('@')) {
      const error = new Error('Invalid email format');
      console.error('Email format error:', error.message);
      return { error };
    }
    
    try {
      console.log('Attempting Supabase auth.signInWithPassword...');
      
      const result = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });
      
      console.log('Supabase signInWithPassword complete result:', result);
      
      if (result.error) {
        console.error('Supabase auth error details:', {
          message: result.error.message,
          status: result.error.status,
          details: result.error,
        });
        
        // Return a properly formatted error
        return { 
          error: {
            message: result.error.message || 'Authentication failed',
            status: result.error.status || 400,
            code: result.error.code || 'auth_error'
          }
        };
      } else {
        console.log('Authentication successful:', {
          user: result.data?.user?.email || 'No user',
          session: !!result.data?.session
        });
        return { error: null };
      }
      
    } catch (exception: any) {
      console.error('Exception in signIn:', {
        message: exception.message,
        name: exception.name,
        stack: exception.stack,
      });
      
      // Return a properly formatted error for exceptions
      return { 
        error: {
          message: exception.message || 'Network error occurred',
          status: 500,
          code: 'network_error'
        }
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      setUser, 
      signIn, 
      signUp, 
      signInWithGoogle,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
