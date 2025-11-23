import { UserProfile } from '../hooks/useAuth';
import { Game } from '../data/games';
import { Mission } from '../data/missions';

// Define the shape of the data we want to persist for each user
export interface UserGameState {
  userId: string;
  credits: number;
  xp: number;
  level: number;
  playTime: number;
  killCount: number;
  faction: 'syndicate' | 'security' | null;
  inventory: string[]; // Item IDs
  equippedItems: string[]; // Item IDs
  unlockedGames: string[]; // Game IDs
  highScores: Record<string, number>;
  missions: Mission[];
  settings: {
    theme: string;
    volume: number;
    notifications: boolean;
    hudColor?: string;
  };
  lastSaved: string;
}

// Default state for new users
export const DEFAULT_GAME_STATE: Omit<UserGameState, 'userId' | 'lastSaved'> = {
  credits: 100,
  xp: 0,
  level: 1,
  playTime: 0,
  killCount: 0,
  faction: null,
  inventory: [],
  equippedItems: [],
  unlockedGames: [],
  highScores: {},
  missions: [], // Should be initialized with DAILY_MISSIONS
  settings: {
    theme: 'cyberpunk',
    volume: 0.8,
    notifications: true,
    hudColor: '#00ffd5'
  }
};

class StorageService {
  private readonly USERS_KEY = 'nexus_db_users';
  private readonly GAME_STATE_PREFIX = 'nexus_db_state_';

  // --- User Management ---

  getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load users', e);
      return [];
    }
  }

  getUser(userId: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === userId) || null;
  }

  getUserByUsername(username: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find(u => u.username?.toLowerCase() === username.toLowerCase()) || null;
  }

  saveUser(user: UserProfile): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // --- Game State Management ---

  getGameState(userId: string): UserGameState | null {
    try {
      const data = localStorage.getItem(`${this.GAME_STATE_PREFIX}${userId}`);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.error(`Failed to load game state for user ${userId}`, e);
      return null;
    }
  }

  saveGameState(state: UserGameState): void {
    try {
      const stateWithTimestamp = {
        ...state,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(`${this.GAME_STATE_PREFIX}${state.userId}`, JSON.stringify(stateWithTimestamp));
      
      // Also update the main user profile with key stats for quick access (leaderboards)
      const user = this.getUser(state.userId);
      if (user) {
        this.saveUser({
          ...user,
          kill_count: state.killCount,
          faction: state.faction,
          last_seen: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error(`Failed to save game state for user ${state.userId}`, e);
    }
  }

  // Initialize a new user with default state
  initializeUser(userId: string): UserGameState {
    const existing = this.getGameState(userId);
    if (existing) return existing;

    const newState: UserGameState = {
      ...DEFAULT_GAME_STATE,
      userId,
      lastSaved: new Date().toISOString()
    };
    
    this.saveGameState(newState);
    return newState;
  }

  // --- Multiplayer / Leaderboard Helpers ---

  getLeaderboard(limit: number = 100): UserProfile[] {
    const users = this.getAllUsers();
    // Sort by kill count descending
    return users
      .sort((a, b) => (b.kill_count || 0) - (a.kill_count || 0))
      .slice(0, limit);
  }

  getFactionCounts(): { syndicate: number; security: number } {
    const users = this.getAllUsers();
    return {
      syndicate: users.filter(u => u.faction === 'syndicate').length,
      security: users.filter(u => u.faction === 'security').length
    };
  }
}

export const storage = new StorageService();
