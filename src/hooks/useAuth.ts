import { useState, useEffect } from 'react';
import { supabase } from '../lib/auth';
import { useStore } from '../store';
import { storage } from '../lib/storage';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  is_dev?: boolean;
  is_tester?: boolean;
  kill_count?: number;
  verified?: boolean;
  last_seen?: string; // ISO Date string
  faction?: 'syndicate' | 'security' | null;
}

const DEV_KEY = "1113199011 131990";
const TESTER_KEY = "tester2025";

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setKillCount, setXp, setPlayTime, setIsAuthenticated, loadUserData } = useStore();

  // Update presence (last_seen) periodically
  useEffect(() => {
    if (!user) return;

    const updatePresence = () => {
      const now = new Date().toISOString();
      
      // Update in storage
      if (user.is_dev || user.is_tester) {
        const sessionKey = 'nexus_dev_session';
        const stored = localStorage.getItem(sessionKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.last_seen = now;
          localStorage.setItem(sessionKey, JSON.stringify(parsed));
        }
      } else {
        const stored = localStorage.getItem('nexus_user_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.last_seen = now;
          localStorage.setItem('nexus_user_session', JSON.stringify(parsed));
        }

        // Update in central storage
        const storedUser = storage.getUser(user.id);
        if (storedUser) {
          storage.saveUser({ ...storedUser, last_seen: now });
        }
      }
    };

    updatePresence(); // Initial update
    const interval = setInterval(updatePresence, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user, setIsAuthenticated]);

  useEffect(() => {
    // Check for dev/tester session in local storage
    const devSession = localStorage.getItem('nexus_dev_session');
    if (devSession) {
      const devUser = JSON.parse(devSession);
      
      // Auto-migrate legacy username
      if (devUser.username === 'NEXUS_ARCHITECT') {
        devUser.username = 'NEXUS';
        devUser.avatar_url = 'https://api.dicebear.com/7.x/bottts/svg?seed=NEXUS';
        localStorage.setItem('nexus_dev_session', JSON.stringify(devUser));
      }

      setUser(devUser);
      loadUserData(devUser.id);
      
      if (devUser.is_dev) {
        setKillCount(devUser.kill_count || 99999);
        setXp(157680000);
        setPlayTime(0);
      } else if (devUser.is_tester) {
        setKillCount(0);
        setXp(0);
        setPlayTime(0);
      }
      
      setLoading(false);
      return;
    }

    // Check for standard user session in local storage (Mock Auth)
    const userSession = localStorage.getItem('nexus_user_session');
    if (userSession) {
      const standardUser = JSON.parse(userSession);
      setUser(standardUser);
      loadUserData(standardUser.id);
      setLoading(false);
      return;
    }

    // Check Supabase session (Fallback)
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
        if (!localStorage.getItem('nexus_dev_session') && !localStorage.getItem('nexus_user_session')) {
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
        id: 'Architect',
        email: 'dev@nexus.system',
        username: 'NEXUS',
        is_dev: true,
        kill_count: 99999,
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NEXUS',
      };
      localStorage.setItem('nexus_dev_session', JSON.stringify(devUser));
      setUser(devUser);
      loadUserData(devUser.id);
      // Override for dev
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
      loadUserData(testerUser.id);
      // Testers start with 0 stats to simulate new user experience
      setKillCount(0);
      setXp(0);
      setPlayTime(0);
      return { success: true };
    }

        return { success: false, error: 'Invalid Access Key' };
  };

  const signInWithUsername = async (username: string, password: string) => {
    // MOCK AUTH IMPLEMENTATION
    // Check local storage for registered users
    const users = storage.getAllUsers();
    const foundUser = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (foundUser) {
      // Auto-verify if not verified (since we are removing email verification step for ease)
      if (!foundUser.verified) {
         foundUser.verified = true;
         storage.saveUser(foundUser);
      }

      const userProfile: UserProfile = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${foundUser.username}`,
        kill_count: foundUser.kill_count || 0,
        verified: true,
        last_seen: new Date().toISOString()
      };
      localStorage.setItem('nexus_user_session', JSON.stringify(userProfile));
      setUser(userProfile);
      loadUserData(userProfile.id);
      return { data: { user: userProfile }, error: null };
    }

    return { data: null, error: { message: 'Invalid username or password' } };
  };

  const signUpWithUsername = async (username: string, password: string) => {
    // MOCK AUTH IMPLEMENTATION
    const users = storage.getAllUsers();
    
    if (users.find((u: any) => u.username?.toLowerCase() === username.toLowerCase())) {
      return { data: null, error: { message: 'Username already taken. Please choose another.' } };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: `${username.toLowerCase().replace(/\s+/g, '.')}@nexus.net`, // Generate dummy email
      password, // In a real app, NEVER store plain text passwords
      username,
      verified: true, // Auto verify for seamlessness
      kill_count: 0
    };

    storage.saveUser(newUser);

    // Auto login
    const userProfile: UserProfile = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${newUser.username}`,
        kill_count: 0,
        verified: true,
        last_seen: new Date().toISOString()
    };
    localStorage.setItem('nexus_user_session', JSON.stringify(userProfile));
    setUser(userProfile);
    loadUserData(userProfile.id);

    return { data: { user: userProfile }, error: null };
  };

  const verifyUser = (email: string) => {
    const users = storage.getAllUsers();
    const userIndex = users.findIndex((u: any) => u.email === email);
    
    if (userIndex >= 0) {
      const user = users[userIndex];
      user.verified = true;
      storage.saveUser(user);
      
      // Auto login after verification
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
        kill_count: 0,
        verified: true
      };
      localStorage.setItem('nexus_user_session', JSON.stringify(userProfile));
      setUser(userProfile);
      loadUserData(userProfile.id);
      return true;
    }
    return false;
  };

  const signInWithEmail = async (email: string, password: string) => {
    // MOCK AUTH IMPLEMENTATION
    // Check local storage for registered users
    const users = storage.getAllUsers();
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      if (!foundUser.verified) {
        return { data: null, error: { message: 'Account not verified. Please check your email.' } };
      }

      const userProfile: UserProfile = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${foundUser.username}`,
        kill_count: 0,
        verified: true
      };
      localStorage.setItem('nexus_user_session', JSON.stringify(userProfile));
      setUser(userProfile);
      loadUserData(userProfile.id);
      return { data: { user: userProfile }, error: null };
    }

    // Fallback to Supabase (will likely fail if not configured)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error && data.user) {
        return { data, error };
      }
    } catch (e) {
      // Ignore supabase error if we are in mock mode
    }

    return { data: null, error: { message: 'Invalid email or password (Mock Auth)' } };
  };

  const signUpWithEmail = async (email: string, password: string, username: string) => {
    // MOCK AUTH IMPLEMENTATION
    const users = storage.getAllUsers();
    
    if (users.find((u: any) => u.email === email)) {
      return { data: null, error: { message: 'User already exists' } };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: // In a real app, NEVER store plain text passwords
      username,
      verified: false
    };

    storage.saveUser(newUser);

    // Return success but indicate verification needed (no session created)
    return { data: { user: { ...newUser, kill_count: 0 } }, error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('nexus_dev_session');
    localStorage.removeItem('nexus_user_session');
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

    if (user.is_dev || user.is_tester) {
      localStorage.setItem('nexus_dev_session', JSON.stringify(updatedUser));
    } else {
      localStorage.setItem('nexus_user_session', JSON.stringify(updatedUser));
      
      // Update in registered users list too
      const storedUser = storage.getUser(user.id);
      if (storedUser) {
        storage.saveUser({ ...storedUser, username: newUsername });
      }
    }
  };

  const updateFaction = async (faction: 'syndicate' | 'security') => {
    if (!user) return;

    const updatedUser = { ...user, faction };
    setUser(updatedUser);

    if (user.is_dev || user.is_tester) {
      localStorage.setItem('nexus_dev_session', JSON.stringify(updatedUser));
    } else {
      localStorage.setItem('nexus_user_session', JSON.stringify(updatedUser));
      
      // Update in registered users list too
      const storedUser = storage.getUser(user.id);
      if (storedUser) {
        storage.saveUser({ ...storedUser, faction });
      }
    }
  };

  return {
    user,
    loading,
    signInWithDevKey,
    signInWithUsername,
    signUpWithUsername,
    signOut,
    updateUsername,
    updateFaction,
    verifyUser
  };
};

export default useAuth;