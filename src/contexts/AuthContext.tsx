
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  user: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    return supabase.auth.signUp({
      email,
      password,
    });
  };

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        return { error: new Error('Aucun utilisateur connecté'), success: false };
      }
      
      // Delete user from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        return { error, success: false };
      }
      
      // Sign out after deletion
      await signOut();
      
      return { error: null, success: true };
    } catch (error: any) {
      console.error('Erreur lors de la suppression du compte:', error);
      return { error, success: false };
    }
  };

  const value = {
    session,
    loading,
    signUp,
    signIn,
    signOut,
    deleteAccount,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
