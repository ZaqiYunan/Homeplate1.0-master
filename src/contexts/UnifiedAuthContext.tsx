"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { auth as firebaseAuth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

type AuthProvider = 'firebase' | 'supabase';

interface UnifiedUser {
  id: string;
  email: string | null;
  displayName?: string | null;
  provider: AuthProvider;
  originalUser: FirebaseUser | SupabaseUser;
}

interface UnifiedAuthContextType {
  user: UnifiedUser | null;
  loading: boolean;
  provider: AuthProvider;
  setUser: Dispatch<SetStateAction<UnifiedUser | null>>;
  setProvider: (provider: AuthProvider) => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  // Firebase-specific
  firebaseUser: FirebaseUser | null;
  // Supabase-specific
  supabaseUser: SupabaseUser | null;
  supabaseSession: Session | null;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export const UnifiedAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<AuthProvider>('firebase'); // Default to Firebase

  useEffect(() => {
    // Initialize Firebase auth listener
    const unsubscribeFirebase = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
      if (user && provider === 'firebase') {
        setUser({
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          provider: 'firebase',
          originalUser: user
        });
      } else if (provider === 'firebase') {
        setUser(null);
      }
      if (provider === 'firebase') {
        setLoading(false);
      }
    });

    // Initialize Supabase auth listener
    const initializeSupabase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseSession(session);
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user && provider === 'supabase') {
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.display_name || null,
          provider: 'supabase',
          originalUser: session.user
        });
      } else if (provider === 'supabase') {
        setUser(null);
      }
      
      if (provider === 'supabase') {
        setLoading(false);
      }
    };

    initializeSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseSession(session);
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user && provider === 'supabase') {
        setUser({
          id: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.display_name || null,
          provider: 'supabase',
          originalUser: session.user
        });
      } else if (provider === 'supabase') {
        setUser(null);
      }
      
      if (provider === 'supabase') {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeFirebase();
      subscription.unsubscribe();
    };
  }, [provider]);

  const handleProviderChange = (newProvider: AuthProvider) => {
    setProvider(newProvider);
    setLoading(true);
    // Reset user state when switching providers
    setUser(null);
    
    // Set user based on current auth state of the new provider
    if (newProvider === 'firebase' && firebaseUser) {
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        provider: 'firebase',
        originalUser: firebaseUser
      });
    } else if (newProvider === 'supabase' && supabaseUser) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || null,
        displayName: supabaseUser.user_metadata?.display_name || null,
        provider: 'supabase',
        originalUser: supabaseUser
      });
    }
    
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    if (provider === 'firebase') {
      try {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        return { error: null };
      } catch (error) {
        return { error };
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (provider === 'firebase') {
      try {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        return { error: null };
      } catch (error) {
        return { error };
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    if (provider === 'firebase') {
      try {
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(firebaseAuth, googleProvider);
        return { error: null };
      } catch (error) {
        return { error };
      }
    } else {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { error };
    }
  };

  const signOut = async () => {
    if (provider === 'firebase') {
      await firebaseSignOut(firebaseAuth);
    } else {
      await supabase.auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <UnifiedAuthContext.Provider value={{ 
      user, 
      loading, 
      provider,
      setUser, 
      setProvider: handleProviderChange,
      signIn, 
      signUp, 
      signInWithGoogle,
      signOut,
      firebaseUser,
      supabaseUser,
      supabaseSession
    }}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = (): UnifiedAuthContextType => {
  const context = useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};
