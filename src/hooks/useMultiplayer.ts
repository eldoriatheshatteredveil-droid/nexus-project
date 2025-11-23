import { useState, useEffect, useRef, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/auth';
import { useAuth, UserProfile } from './useAuth';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  system?: boolean;
}

export interface LobbyPlayer extends UserProfile {
  status: 'online' | 'in-queue' | 'in-game';
  lastPing?: number;
}

interface GameState {
  players: { [id: string]: any };
  ball?: { x: number, y: number, dx: number, dy: number };
  score?: { p1: number, p2: number };
  status: 'waiting' | 'playing' | 'finished';
}

const STORAGE_KEY = 'nexus_multiplayer_state';
const PING_INTERVAL = 5000;

// Check if Supabase is properly configured (not using the placeholder)
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
                             !import.meta.env.VITE_SUPABASE_URL.includes('xyzcompany');

export const useMultiplayer = (gameId: string) => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [activeMatch, setActiveMatch] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [matchMetadata, setMatchMetadata] = useState<{ hostId: string, guestId: string } | null>(null);
  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const matchChannelRef = useRef<RealtimeChannel | null>(null);

  // Derived state
  const isHost = !!(user && matchMetadata && user.id === matchMetadata.hostId);
  const opponent = players.find(p => 
    matchMetadata && (p.id === matchMetadata.hostId || p.id === matchMetadata.guestId) && p.id !== user?.id
  );

  // --------------------------------------------------------------------------
  // SUPABASE IMPLEMENTATION (Online)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseConfigured || !gameId) return;

    // Clean up previous channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`lobby:${gameId}`, {
      config: {
        presence: {
          key: user?.id || `anon-${Date.now()}`,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const activePlayers: LobbyPlayer[] = [];
        const queueIds: string[] = [];

        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: any) => {
            // Only add if it's a real user (has id and username)
            if (p.id && !p.id.startsWith('anon-')) {
                activePlayers.push(p);
                if (p.status === 'in-queue') {
                queueIds.push(p.id);
                }
            }
          });
        });

        setPlayers(activePlayers);
        setQueue(queueIds);

        // Matchmaking Logic (Host Side)
        if (user) {
            const myPresence = activePlayers.find(p => p.id === user.id);
            if (myPresence?.status === 'in-queue') {
            const opponents = activePlayers.filter(p => p.status === 'in-queue' && p.id !== user.id);
            if (opponents.length > 0) {
                const sortedIds = [user.id, opponents[0].id].sort();
                if (sortedIds[0] === user.id) {
                const matchId = `match:${Date.now()}:${user.id}`;
                channel.send({
                    type: 'broadcast',
                    event: 'match_invite',
                    payload: {
                    matchId,
                    hostId: user.id,
                    guestId: opponents[0].id,
                    hostName: user.username,
                    guestName: opponents[0].username
                    }
                });
                }
            }
            }
        }
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        setMessages(prev => [...prev.slice(-49), payload]);
      })
      .on('broadcast', { event: 'match_invite' }, ({ payload }) => {
        if (user && (payload.hostId === user.id || payload.guestId === user.id)) {
          setActiveMatch(payload.matchId);
          setMatchMetadata({ hostId: payload.hostId, guestId: payload.guestId });
          
          channel.track({
            ...user,
            status: 'in-game'
          });

          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            userId: 'system',
            username: 'NEXUS',
            text: `MATCH STARTED: ${payload.hostName} vs ${payload.guestName}`,
            timestamp: Date.now(),
            system: true
          }]);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            ...user,
            status: 'online'
          });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, gameId]);

  // Handle Active Match Channel (Supabase)
  useEffect(() => {
    if (!isSupabaseConfigured || !activeMatch || !user) return;

    if (matchChannelRef.current) {
      supabase.removeChannel(matchChannelRef.current);
    }

    const matchChannel = supabase.channel(activeMatch);

    matchChannel
      .on('broadcast', { event: 'game_state' }, ({ payload }) => {
        setGameState(payload);
      })
      .subscribe();

    matchChannelRef.current = matchChannel;

    return () => {
      if (matchChannelRef.current) {
        supabase.removeChannel(matchChannelRef.current);
      }
    };
  }, [activeMatch, user]);


  // --------------------------------------------------------------------------
  // LOCAL STORAGE IMPLEMENTATION (Fallback / Offline)
  // --------------------------------------------------------------------------
  
  // Helper to get full state
  const getStorageState = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"lobbies": {}, "matches": {}}');
    } catch {
      return { lobbies: {}, matches: {} };
    }
  }, []);

  // Helper to save state
  const setStorageState = useCallback((newState: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    window.dispatchEvent(new Event('storage'));
  }, []);

  // Initialize / Join Lobby (Local)
  useEffect(() => {
    if (isSupabaseConfigured) return;

    const joinLobby = () => {
      if (!user) return;
      const state = getStorageState();
      if (!state.lobbies[gameId]) {
        state.lobbies[gameId] = { players: {}, messages: [], queue: [] };
      }
      
      state.lobbies[gameId].players[user.id] = {
        ...user,
        status: 'online',
        lastPing: Date.now()
      };
      
      setStorageState(state);
    };

    joinLobby();

    const interval = setInterval(() => {
      if (!user) return;
      const state = getStorageState();
      if (state.lobbies[gameId]?.players[user.id]) {
        state.lobbies[gameId].players[user.id].lastPing = Date.now();
        setStorageState(state);
      }
    }, PING_INTERVAL);

    return () => {
      clearInterval(interval);
      if (user) {
        const state = getStorageState();
        if (state.lobbies[gameId]?.players[user.id]) {
            delete state.lobbies[gameId].players[user.id];
            state.lobbies[gameId].queue = state.lobbies[gameId].queue.filter((id: string) => id !== user.id);
            setStorageState(state);
        }
      }
    };
  }, [user, gameId, getStorageState, setStorageState]);

  // Sync State & Cleanup (Local)
  useEffect(() => {
    if (isSupabaseConfigured) return;

    const sync = () => {
      const state = getStorageState();
      const lobby = state.lobbies[gameId];
      
      if (!lobby) {
          setPlayers([]);
          return;
      }

      // Cleanup stale players (timeout 15s)
      const now = Date.now();
      let changed = false;
      Object.keys(lobby.players).forEach(pid => {
        if (now - lobby.players[pid].lastPing > 15000) {
          delete lobby.players[pid];
          lobby.queue = lobby.queue.filter((id: string) => id !== pid);
          changed = true;
        }
      });

      if (changed) setStorageState(state);

      setPlayers(Object.values(lobby.players));
      setMessages(lobby.messages || []);
      setQueue(lobby.queue || []);

      // Check for active match
      if (user && state.matches) {
        const matchId = Object.keys(state.matches).find(mid => 
          state.matches[mid].players.includes(user.id)
        );
        if (matchId) {
          setActiveMatch(matchId);
          setGameState(state.matches[matchId].state);
          
          // Set metadata for local match
          const p1 = state.matches[matchId].players[0];
          const p2 = state.matches[matchId].players[1];
          setMatchMetadata({ hostId: p1, guestId: p2 });

        } else {
          setActiveMatch(null);
          setGameState(null);
          setMatchMetadata(null);
        }
      }
    };

    sync();
    const interval = setInterval(sync, 1000);
    window.addEventListener('storage', sync);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', sync);
    };
  }, [gameId, user, getStorageState, setStorageState]);


  // --------------------------------------------------------------------------
  // UNIFIED ACTIONS
  // --------------------------------------------------------------------------

  const sendMessage = async (text: string) => {
    if (!user) return;

    if (isSupabaseConfigured) {
        if (!channelRef.current) return;
        const msg: ChatMessage = {
            id: Date.now().toString(),
            userId: user.id,
            username: user.username || 'Unknown',
            text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev.slice(-49), msg]);
        await channelRef.current.send({
            type: 'broadcast',
            event: 'chat',
            payload: msg
        });
    } else {
        const state = getStorageState();
        if (!state.lobbies[gameId]) return;

        const msg: ChatMessage = {
            id: Date.now().toString(),
            userId: user.id,
            username: user.username || 'Unknown',
            text,
            timestamp: Date.now()
        };

        state.lobbies[gameId].messages = [...(state.lobbies[gameId].messages || []).slice(-49), msg];
        setStorageState(state);
    }
  };

  const joinQueue = async () => {
    if (!user) return;

    if (isSupabaseConfigured) {
        if (!channelRef.current) return;
        await channelRef.current.track({
            ...user,
            status: 'in-queue'
        });
    } else {
        const state = getStorageState();
        const lobby = state.lobbies[gameId];
        
        if (!lobby.queue.includes(user.id)) {
            lobby.queue.push(user.id);
            lobby.players[user.id].status = 'in-queue';
            
            // Matchmaking Logic (Simple 1v1 Local)
            if (lobby.queue.length >= 2) {
                const p1 = lobby.queue.shift();
                const p2 = lobby.queue.shift();
                
                const matchId = `match-${Date.now()}`;
                state.matches[matchId] = {
                    id: matchId,
                    gameId,
                    players: [p1, p2],
                    startTime: Date.now(),
                    state: {
                        status: 'waiting',
                        players: {},
                        score: { p1: 0, p2: 0 }
                    }
                };

                lobby.players[p1].status = 'in-game';
                lobby.players[p2].status = 'in-game';
                
                const sysMsg: ChatMessage = {
                    id: Date.now().toString(),
                    userId: 'system',
                    username: 'NEXUS',
                    text: `MATCH STARTED: ${lobby.players[p1].username} vs ${lobby.players[p2].username}`,
                    timestamp: Date.now(),
                    system: true
                };
                lobby.messages.push(sysMsg);
            }
            setStorageState(state);
        }
    }
  };

  const leaveQueue = async () => {
    if (!user) return;

    if (isSupabaseConfigured) {
        if (!channelRef.current) return;
        await channelRef.current.track({
            ...user,
            status: 'online'
        });
    } else {
        const state = getStorageState();
        const lobby = state.lobbies[gameId];
        lobby.queue = lobby.queue.filter((id: string) => id !== user.id);
        lobby.players[user.id].status = 'online';
        setStorageState(state);
    }
  };

  const updateGameState = async (newState: Partial<GameState>) => {
    if (!activeMatch) return;

    if (isSupabaseConfigured) {
        if (!matchChannelRef.current) return;
        setGameState(prev => {
            if (!prev) return newState as GameState;
            return { ...prev, ...newState };
        });
        await matchChannelRef.current.send({
            type: 'broadcast',
            event: 'game_state',
            payload: newState
        });
    } else {
        const state = getStorageState();
        if (state.matches[activeMatch]) {
            state.matches[activeMatch].state = { ...state.matches[activeMatch].state, ...newState };
            setStorageState(state);
        }
    }
  };

  return {
    players,
    messages,
    queue,
    activeMatch,
    gameState,
    isHost,
    opponent,
    sendMessage,
    joinQueue,
    leaveQueue,
    updateGameState
  };
};

