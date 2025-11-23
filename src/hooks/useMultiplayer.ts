import { useState, useEffect, useCallback } from 'react';
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
  lastPing: number;
}

interface GameState {
  players: { [id: string]: any };
  ball?: { x: number, y: number, dx: number, dy: number };
  score?: { p1: number, p2: number };
  status: 'waiting' | 'playing' | 'finished';
}

const STORAGE_KEY = 'nexus_multiplayer_state';
const PING_INTERVAL = 5000;
const CLEANUP_INTERVAL = 10000;

export const useMultiplayer = (gameId: string) => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [queue, setQueue] = useState<string[]>([]); // User IDs
  const [activeMatch, setActiveMatch] = useState<string | null>(null); // Match ID if in game
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Helper to get full state
  const getStorageState = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"lobbies": {}, "matches": {}}');
    } catch {
      return { lobbies: {}, matches: {} };
    }
  };

  // Helper to save state
  const setStorageState = (newState: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    // Dispatch event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  // Initialize / Join Lobby
  useEffect(() => {
    if (!user) return;

    const joinLobby = () => {
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
      // Heartbeat
      const state = getStorageState();
      if (state.lobbies[gameId]?.players[user.id]) {
        state.lobbies[gameId].players[user.id].lastPing = Date.now();
        setStorageState(state);
      }
    }, PING_INTERVAL);

    return () => {
      clearInterval(interval);
      // Leave lobby on unmount
      const state = getStorageState();
      if (state.lobbies[gameId]?.players[user.id]) {
        delete state.lobbies[gameId].players[user.id];
        // Also remove from queue
        state.lobbies[gameId].queue = state.lobbies[gameId].queue.filter((id: string) => id !== user.id);
        setStorageState(state);
      }
    };
  }, [user, gameId]);

  // Sync State & Cleanup
  useEffect(() => {
    const sync = () => {
      const state = getStorageState();
      const lobby = state.lobbies[gameId];
      
      if (!lobby) return;

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
        } else {
          setActiveMatch(null);
          setGameState(null);
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
  }, [gameId, user]);

  // Actions
  const sendMessage = (text: string) => {
    if (!user) return;
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
  };

  const joinQueue = () => {
    if (!user) return;
    const state = getStorageState();
    const lobby = state.lobbies[gameId];
    
    if (!lobby.queue.includes(user.id)) {
      lobby.queue.push(user.id);
      lobby.players[user.id].status = 'in-queue';
      
      // Matchmaking Logic (Simple 1v1)
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

        // Update player status
        lobby.players[p1].status = 'in-game';
        lobby.players[p2].status = 'in-game';
        
        // System message
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
  };

  const leaveQueue = () => {
    if (!user) return;
    const state = getStorageState();
    const lobby = state.lobbies[gameId];
    
    lobby.queue = lobby.queue.filter((id: string) => id !== user.id);
    lobby.players[user.id].status = 'online';
    setStorageState(state);
  };

  const updateGameState = (newState: Partial<GameState>) => {
    if (!activeMatch) return;
    const state = getStorageState();
    if (state.matches[activeMatch]) {
      state.matches[activeMatch].state = { ...state.matches[activeMatch].state, ...newState };
      setStorageState(state);
    }
  };

  return {
    players,
    messages,
    queue,
    activeMatch,
    gameState,
    sendMessage,
    joinQueue,
    leaveQueue,
    updateGameState
  };
};
