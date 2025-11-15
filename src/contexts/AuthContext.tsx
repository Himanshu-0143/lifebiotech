import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  sendMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout duration in milliseconds (4 minutes)
const SESSION_TIMEOUT = 4 * 60 * 1000;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset activity timer
  const resetActivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if user is logged in
    if (user) {
      timeoutRef.current = setTimeout(() => {
        handleSessionTimeout();
      }, SESSION_TIMEOUT);
    }
  }, [user]);

  // Handle session timeout
  const handleSessionTimeout = async () => {
    if (user) {
      await supabase.auth.signOut();
      setIsAdmin(false);
      toast({
        title: 'Session Expired',
        description: 'You have been logged out due to inactivity. Please sign in again.',
        variant: 'destructive',
      });
    }
  };

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetActivityTimer();
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initial timer setup
    resetActivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, resetActivityTimer]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Don't check admin role - treat all users as non-admin until table exists
        setIsAdmin(false);
        
        if (session?.user) {
          // Reset timer when user signs in
          resetActivityTimer();
        } else {
          setIsAdmin(false);
          // Clear timeout when user signs out
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        resetActivityTimer();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [resetActivityTimer]);

  // Temporarily disabled - uncomment after creating user_roles table in Supabase
  // const checkAdminRole = async (userId: string) => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('user_roles')
  //       .select('role')
  //       .eq('user_id', userId)
  //       .eq('role', 'admin')
  //       .maybeSingle();

  //     if (error) {
  //       setIsAdmin(false);
  //       return;
  //     }

  //     setIsAdmin(!!data);
  //   } catch (err) {
  //     setIsAdmin(false);
  //   }
  // };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    // If there's an error, show it
    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      // If a session was returned, the user is already signed in.
      // If not, Supabase likely requires email confirmation — instruct the user.
      if (data?.session) {
        toast({
          title: 'Account created!',
          description: 'You are signed in.',
        });
      } else {
        toast({
          title: 'Account created!',
          description: 'Please check your email for a confirmation link before signing in.',
        });
      }
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Provide a clearer message when the email hasn't been confirmed.
      const lower = (error.message || '').toLowerCase();
      if (lower.includes('confirm') || lower.includes('confirmed') || lower.includes('email')) {
        toast({
          title: 'Sign in failed',
          description: 'Your email address is not confirmed. Please check your inbox for a confirmation link.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
    
    return { error };
  };

  const sendMagicLink = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl },
      });

      if (error) {
        toast({
          title: 'Magic link failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Magic link sent',
          description: `Check ${email} for the sign-in link.`,
        });
      }

      return { error };
    } catch (err: any) {
      toast({
        title: 'Magic link failed',
        description: err?.message || 'Unexpected error while sending magic link',
        variant: 'destructive',
      });
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, signUp, signIn, sendMagicLink, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
