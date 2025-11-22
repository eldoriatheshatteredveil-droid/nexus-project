import { useState, useEffect } from 'react';
import { supabase } from '../lib/auth';
import { useStore } from '../store';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  is_dev?: boolean;
  is_tester?: boolean;
  kill_count?: number;
}

const DEV_KEY = "1113199011 131990";
const TESTER_KEY = "tester2025";

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setKillCount, setXp, setPlayTime } = useStore();

  useEffect(() => {
    // Check for dev session in local storage
    const devSession = localStorage.getItem('nexus_dev_session');
    if (devSession) {
      const devUser = JSON.parse(devSession);
      setUser(devUser);
      
      if (devUser.is_dev) {
        setKillCount(devUser.kill_count || 99999); // Devs get max stats
        setXp(157680000); // Level 50
        setPlayTime(0); // Reset time for dev
      }
      
      setLoading(false);
      return;
    }

    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        if (!localStorage.getItem('nexus_dev_session')) {
          setUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = async (sbUser: any) => {
    // In a real app, we'd fetch the profile from a 'profiles' table here
    // For now, we'll just map the auth user
    const profile: UserProfile = {
      id: sbUser.id,
      email: sbUser.email,
      username: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0],
      avatar_url: sbUser.user_metadata?.avatar_url,
      kill_count: 0, // Default, would fetch from DB
    };
    setUser(profile);
    setLoading(false);
  };

  const signInWithDevKey = (key: string) => {
    if (key === DEV_KEY) {
      const devUser: UserProfile = {
        id: 'NVious A.i.',
        email: 'dev@nexus.system',
        username: 'NEXUS_ARCHITECT',
        is_dev: true,
        kill_count: 99999,
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NEXUS_ARCHITECT',
      };
      localStorage.setItem('nexus_dev_session', JSON.stringify(devUser));
      setUser(devUser);
      setKillCount(99999);
      setXp(157680000); // Level 50
      setPlayTime(0); // Reset time for dev
      return { success: true };
    }

    if (key === TESTER_KEY) {
      const testerUser: UserProfile = {
        id: 'TEST-UNIT-01',
        email: 'tester@nexus.system',
        username: 'BETA_TESTER',
        is_tester: true,
        is_dev: false,
        kill_count: 0,
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=BETA_TESTER',
      };
      localStorage.setItem('nexus_dev_session', JSON.stringify(testerUser));
      setUser(testerUser);
      // Testers start with 0 stats to simulate new user experience
      setKillCount(0);
      setXp(0);
      setPlayTime(0);
      return { success: true };
    }

    return { success: false, error: 'Invalid Access Key' };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUpWithEmail = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
        },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    localStorage.removeItem('nexus_dev_session');
    await supabase.auth.signOut();
    setUser(null);
    setKillCount(0);
    setXp(0);
    setPlayTime(0);
    window.location.href = '/';
  };

  const updateUsername = async (newUsername: string) => {
    if (!user) return;

    const updatedUser = { ...user, username: newUsername };
    setUser(updatedUser);

    if (user.is_dev) {
      localStorage.setItem('nexus_dev_session', JSON.stringify(updatedUser));
    } else {
      // Attempt to update Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newUsername }
      });
      if (error) console.error('Error updating profile:', error);
    }
  };

  return {
    user,
    loading,
    signInWithDevKey,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateUsername
  };
};

export default useAuth;