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
  verified?: boolean;
  last_seen?: string; // ISO Date string
  faction?: 'syndicate' | 'security' | null;
}

const DEV_KEY = "1113199011 131990";
const TESTER_KEY = "tester2025";

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setKillCount, setXp, setPlayTime, setIsAuthenticated } = useStore();

  // Update presence (last_seen) periodically
  useEffect(() => {
    if (!user) return;

    const updatePresence = () => {
      const now = new Date().toISOString();
      
      // Update in local state
      // setUser(prev => prev ? ({ ...prev, last_seen: now }) : null); // Avoid causing re-renders loop if not careful, but actually we don't need to update the state object for this, just the storage.

      // Update in storage
      if (user.is_dev || user.is_tester) {
        // Dev/Tester session
        const sessionKey = user.is_dev ? 'nexus_dev_session' : 'nexus_dev_session'; // logic in original code uses nexus_dev_session for both?
        // Actually original code: localStorage.setItem('nexus_dev_session', JSON.stringify(devUser)); for both dev and tester.
        const stored = localStorage.getItem('nexus_dev_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.last_seen = now;
          localStorage.setItem('nexus_dev_session', JSON.stringify(parsed));
        }
      } else {
        // Regular user session
        const stored = localStorage.getItem('nexus_user_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.last_seen = now;
          localStorage.setItem('nexus_user_session', JSON.stringify(parsed));
        }

        // Also update in registered users list
        const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex >= 0) {
          users[userIndex].last_seen = now;
          localStorage.setItem('nexus_registered_users', JSON.stringify(users));
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

  const signInWithUsername = async (username: string, password: string) => {
    // MOCK AUTH IMPLEMENTATION
    // Check local storage for registered users
    const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
    const foundUser = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

    if (foundUser) {
      // Auto-verify if not verified (since we are removing email verification step for ease)
      if (!foundUser.verified) {
         foundUser.verified = true;
         // Update users array
         const userIndex = users.findIndex((u: any) => u.id === foundUser.id);
         users[userIndex] = foundUser;
         localStorage.setItem('nexus_registered_users', JSON.stringify(users));
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
      return { data: { user: userProfile }, error: null };
    }

    return { data: null, error: { message: 'Invalid username or password' } };
  };

  const signUpWithUsername = async (username: string, password: string) => {
    // MOCK AUTH IMPLEMENTATION
    const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
    
    if (users.find((u: any) => u.username.toLowerCase() === username.toLowerCase())) {
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

    users.push(newUser);
    localStorage.setItem('nexus_registered_users', JSON.stringify(users));

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

    return { data: { user: userProfile }, error: null };
  };

  const verifyUser = (email: string) => {
    const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);
    
    if (userIndex >= 0) {
      users[userIndex].verified = true;
      localStorage.setItem('nexus_registered_users', JSON.stringify(users));
      
      // Auto login after verification
      const user = users[userIndex];
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
      return true;
    }
    return false;
  };

  const signInWithEmail = async (email: string, password: string) => {
    // MOCK AUTH IMPLEMENTATION
    // Check local storage for registered users
    const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
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
    const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
    
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

    users.push(newUser);
    localStorage.setItem('nexus_registered_users', JSON.stringify(users));

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
      const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex >= 0) {
        users[userIndex].username = newUsername;
        localStorage.setItem('nexus_registered_users', JSON.stringify(users));
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
      const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex >= 0) {
        users[userIndex].faction = faction;
        localStorage.setItem('nexus_registered_users', JSON.stringify(users));
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