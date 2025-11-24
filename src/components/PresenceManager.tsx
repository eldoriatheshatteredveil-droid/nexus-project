import React, { useEffect } from 'react';
import { supabase } from '../lib/auth';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';

const PresenceManager: React.FC = () => {
  const { user } = useAuth();
  const setOnlineUsers = useStore((state) => state.setOnlineUsers);

  useEffect(() => {
    // Create a unique channel for online users
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user?.id || `anon-${Math.random().toString(36).substring(7)}`,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.values(newState).map((presence: any) => presence[0]);
        
        // Filter out anonymous users if you only want to show logged-in users
        // or keep them if you want to show total count
        // For the profile view, we likely want to map these to UserProfile objects
        const formattedUsers = users.map(u => ({
          id: u.id,
          username: u.username || 'Anonymous',
          avatar_url: u.avatar_url,
          is_dev: u.is_dev,
          email: u.email,
          last_seen: new Date().toISOString(),
          // Add other fields as necessary
        }));

        setOnlineUsers(formattedUsers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track presence
          await channel.track({
            id: user?.id || `anon-${Math.random().toString(36).substring(7)}`,
            username: user?.username || 'Anonymous',
            avatar_url: user?.avatar_url,
            is_dev: user?.is_dev || false,
            email: user?.email,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user, setOnlineUsers]);

  return null; // This component renders nothing
};

export default PresenceManager;
