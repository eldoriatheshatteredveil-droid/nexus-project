import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GAMES, Game } from '../data/games';
import { Mission, DAILY_MISSIONS } from '../data/missions';
import { storage, UserGameState } from '../lib/storage';
import { UserProfile } from '../hooks/useAuth';

interface CartItem {
  game: Game;
  quantity: number;
}

export interface Message {
  id: string;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  type: 'system' | 'admin' | 'user';
}

interface StoreState {
  games: Game[];
  cart: CartItem[];
  messages: Message[];
  addGame: (game: Game) => void;
  removeGame: (gameId: string) => void;
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  incrementDownloads: (gameId: string) => void;
  
  // Messaging
  addMessage: (message: Message) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  killCount: number;
  incrementKillCount: (amount?: number) => void;
  setKillCount: (count: number) => void;

  selectedOrbId: string;
  setSelectedOrbId: (id: string) => void;
  
  // Profile & Leveling
  xp: number;
  playTime: number; // in seconds
  selectedAvatarId: string;
  setXp: (amount: number) => void;
  setPlayTime: (seconds: number) => void;
  addXp: (amount: number) => void;
  incrementPlayTime: (seconds: number) => void;
  setSelectedAvatarId: (id: string) => void;

  // Economy & Factions
  credits: number;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  
  inventory: string[]; // Item IDs
  equippedItems: string[]; // Item IDs
  addItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  isEquipped: (itemId: string) => boolean;

  faction: 'syndicate' | 'security' | null;
  setFaction: (faction: 'syndicate' | 'security') => void;
  
  factionScores: { syndicate: number; security: number };
  updateFactionScore: (faction: 'syndicate' | 'security', amount: number) => void;
  resetFactionScores: () => void;

  missions: Mission[];
  updateMissionProgress: (type: Mission['type'], amount: number) => void;
  resetMissions: () => void;

  // High Scores
  highScores: Record<string, number>;
  updateHighScore: (gameId: string, score: number) => void;

  // Audio State
  isMusicPlaying: boolean;
  setIsMusicPlaying: (isPlaying: boolean) => void;

  // Auth State (for restricting rewards)
  isAuthenticated: boolean;
  currentUserId: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  
  // Combat State
  lastShotTimestamp: number;
  setLastShotTimestamp: (timestamp: number) => void;

  // HUD State
  areCreaturesEnabled: boolean;
  toggleCreatures: () => void;

  // Presence State
  onlineUsers: UserProfile[];
  setOnlineUsers: (users: UserProfile[]) => void;

  // Storage Integration
  loadUserData: (userId: string) => void;
  saveUserData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      games: GAMES,
      cart: [],
      messages: [],
      killCount: 0,
      selectedOrbId: 'default',
      xp: 0,
      playTime: 0,
      selectedAvatarId: '',
      
      // New State
      credits: 100, // Starting credits
      inventory: [],
      equippedItems: [],
      faction: null,
      factionScores: { syndicate: 0, security: 0 },
      missions: DAILY_MISSIONS,
      highScores: {},
      isMusicPlaying: false,
      isAuthenticated: false,
      currentUserId: null,
      lastShotTimestamp: 0,
      areCreaturesEnabled: true,
      onlineUsers: [],

      addGame: (game) => set((state) => ({ games: [game, ...state.games] })),
      removeGame: (gameId) => set((state) => ({ games: state.games.filter(g => g.id !== gameId) })),
      
      addToCart: (game) => set((state) => {
        const existingItem = state.cart.find(item => item.game.id === game.id);
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.game.id === game.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { cart: [...state.cart, { game, quantity: 1 }] };
      }),
      removeFromCart: (gameId) => set((state) => ({
        cart: state.cart.filter(item => item.game.id !== gameId),
      })),
      clearCart: () => set({ cart: [] }),
      incrementDownloads: (gameId) => set((state) => ({
        games: state.games.map((game) =>
          game.id === gameId ? { ...game, downloads: game.downloads + 1 } : game
        ),
      })),

      // Messaging Actions
      addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
      markMessageRead: (id) => set((state) => ({
        messages: state.messages.map(m => m.id === id ? { ...m, read: true } : m)
      })),
      deleteMessage: (id) => set((state) => ({
        messages: state.messages.filter(m => m.id !== id)
      })),

      incrementKillCount: (amount = 1) => {
        if (!get().isAuthenticated) return;
        set((state) => ({ killCount: state.killCount + amount }));
        get().updateMissionProgress('kill', amount);
        get().saveUserData();
      },
      setKillCount: (count) => set({ killCount: count }),

      setSelectedOrbId: (id) => {
        set({ selectedOrbId: id });
        get().saveUserData();
      },
      
      // Profile Actions
      setXp: (amount) => set({ xp: amount }),
      setPlayTime: (seconds) => set({ playTime: seconds }),
      addXp: (amount) => {
        if (!get().isAuthenticated) return;
        set((state) => ({ xp: state.xp + amount }));
        get().saveUserData();
      },
      incrementPlayTime: (seconds) => {
        if (!get().isAuthenticated) return;
        set((state) => ({ 
          playTime: state.playTime + seconds,
          xp: state.xp + (seconds * 5) // 5 XP per second played
        }));
        get().updateMissionProgress('play', seconds);
        // Don't save on every second tick to avoid thrashing
      },
      setSelectedAvatarId: (id) => {
        set({ selectedAvatarId: id });
        get().saveUserData();
      },

      // Economy Actions
      addCredits: (amount) => {
        if (!get().isAuthenticated) return;
        set((state) => ({ credits: (state.credits || 0) + amount }));
        get().saveUserData();
      },
      removeCredits: (amount) => {
        set((state) => ({ credits: Math.max(0, (state.credits || 0) - amount) }));
        get().saveUserData();
      },
      
      addItem: (itemId) => {
        set((state) => ({ 
          inventory: (state.inventory || []).includes(itemId) ? state.inventory : [...(state.inventory || []), itemId] 
        }));
        get().saveUserData();
      },
      hasItem: (itemId) => (get().inventory || []).includes(itemId),

      equipItem: (itemId) => {
        set((state) => {
          // Logic to handle exclusive items (e.g. only one HUD theme at a time)
          // For now, we'll just allow equipping anything, but we might want to unequip other items of the same type
          // We need to know the item type to do this properly, but we don't have access to MARKET_ITEMS here easily without importing
          // Let's just add it for now.
          if (state.equippedItems.includes(itemId)) return {};
          return { equippedItems: [...state.equippedItems, itemId] };
        });
        get().saveUserData();
      },
      unequipItem: (itemId) => {
        set((state) => ({
          equippedItems: state.equippedItems.filter(id => id !== itemId)
        }));
        get().saveUserData();
      },
      isEquipped: (itemId) => (get().equippedItems || []).includes(itemId),

      setFaction: (faction) => {
        set({ faction });
        get().saveUserData();
      },
      
      updateFactionScore: (faction, amount) => set((state) => ({
        factionScores: {
          ...state.factionScores,
          [faction]: state.factionScores[faction] + amount
        }
      })),
      
      resetFactionScores: () => set({ factionScores: { syndicate: 0, security: 0 } }),

      updateMissionProgress: (type, amount) => {
        if (!get().isAuthenticated) return;
        set((state) => {
          const updatedMissions = state.missions.map(mission => {
            if (mission.type === type && !mission.completed) {
              const newCurrent = mission.current + amount;
              const isCompleted = newCurrent >= mission.target;
              
              if (isCompleted && !mission.completed) {
                // Grant rewards immediately
                // Note: We can't call get().addCredits here easily inside set, 
                // so we handle it by updating the state directly
                state.credits += mission.reward;
                state.xp += mission.xpReward;
                // Could trigger a notification here
              }

              return {
                ...mission,
                current: newCurrent,
                completed: isCompleted
              };
            }
            return mission;
          });
          return { missions: updatedMissions, credits: state.credits, xp: state.xp };
        });
        get().saveUserData();
      },

      resetMissions: () => set({ missions: DAILY_MISSIONS }),

      updateHighScore: (gameId, score) => {
        if (!get().isAuthenticated) return;
        set((state) => {
          const currentHigh = state.highScores[gameId] || 0;
          if (score > currentHigh) {
            return { highScores: { ...state.highScores, [gameId]: score } };
          }
          return {};
        });
        get().saveUserData();
      },

      setIsMusicPlaying: (isPlaying) => set({ isMusicPlaying: isPlaying }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLastShotTimestamp: (timestamp) => set({ lastShotTimestamp: timestamp }),
      toggleCreatures: () => set((state) => ({ areCreaturesEnabled: !state.areCreaturesEnabled })),
      setOnlineUsers: (users) => set({ onlineUsers: users }),

      // --- Storage Integration ---
      loadUserData: (userId) => {
        const gameState = storage.initializeUser(userId);
        set({
          currentUserId: userId,
          isAuthenticated: true,
          credits: gameState.credits,
          xp: gameState.xp,
          playTime: gameState.playTime,
          killCount: gameState.killCount,
          faction: gameState.faction,
          inventory: gameState.inventory,
          equippedItems: gameState.equippedItems,
          highScores: gameState.highScores,
          missions: gameState.missions.length > 0 ? gameState.missions : DAILY_MISSIONS,
        });
      },

      saveUserData: () => {
        const state = get();
        if (!state.currentUserId) return;

        const gameState: UserGameState = {
          userId: state.currentUserId,
          credits: state.credits,
          xp: state.xp,
          level: Math.floor(state.xp / 1000) + 1,
          playTime: state.playTime,
          killCount: state.killCount,
          faction: state.faction,
          inventory: state.inventory,
          equippedItems: state.equippedItems,
          unlockedGames: [], 
          highScores: state.highScores,
          missions: state.missions,
          settings: {
            theme: 'cyberpunk',
            volume: 0.8,
            notifications: true
          },
          lastSaved: new Date().toISOString()
        };
        
        storage.saveGameState(gameState);
      }
    }),
    {
      name: 'nexus-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      version: 6, // Bump version to force migration/reset if needed
      migrate: (persistedState: any, version) => {
        const state = persistedState as StoreState;
        
        // Refresh static games data while preserving user uploads
        const staticIds = new Set(GAMES.map(g => g.id));
        const userGames = (state.games || []).filter(g => !staticIds.has(g.id));
        state.games = [...GAMES, ...userGames];

        // Ensure new fields exist if migrating from older version
        if (!state.credits) state.credits = 100;
        if (!state.inventory) state.inventory = [];
        if (!state.equippedItems) state.equippedItems = [];
        if (!state.faction) state.faction = null;
        if (!state.factionScores) state.factionScores = { syndicate: 0, security: 0 };
        if (!state.missions) state.missions = DAILY_MISSIONS;
        if (!state.highScores) state.highScores = {};
        if (state.isMusicPlaying === undefined) state.isMusicPlaying = false;
        
        return state;
      },
      partialize: (state) => {
        if (!state.isAuthenticated) {
          // If not authenticated, do not persist user stats
          return {
            cart: state.cart,
            games: state.games,
            // Reset stats to 0/default for non-auth users in storage
            killCount: 0,
            xp: 0,
            playTime: 0,
            credits: 0,
            inventory: [],
            equippedItems: [],
            faction: null,
            missions: DAILY_MISSIONS,
            highScores: {},
            messages: [],
            selectedOrbId: 'default',
            selectedAvatarId: ''
          };
        }
        
        return {  
          // Only persist these fields
          cart: state.cart,
          messages: state.messages,
          killCount: state.killCount,
          selectedOrbId: state.selectedOrbId,
          xp: state.xp,
          playTime: state.playTime,
          selectedAvatarId: state.selectedAvatarId,
          games: state.games,
          credits: state.credits,
          inventory: state.inventory,
          equippedItems: state.equippedItems,
          faction: state.faction,
          factionScores: state.factionScores,
          missions: state.missions,
          highScores: state.highScores,
          isAuthenticated: state.isAuthenticated,
          areCreaturesEnabled: state.areCreaturesEnabled
          // Don't persist isMusicPlaying, it should reset on reload
          // Don't persist onlineUsers, it's real-time
        };
      },
    }
  )
);