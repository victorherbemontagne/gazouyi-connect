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
      
      // Étape 1: Appeler notre fonction personnalisée pour supprimer toutes les données
      const { data, error: fnError } = await supabase
        .rpc('delete_user_account', { user_id: user.id });
      
      if (fnError) {
        console.error('Erreur lors de la suppression des données:', fnError);
        return { error: fnError, success: false };
      }
      
      // Étape 2: Déconnecter l'utilisateur
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
