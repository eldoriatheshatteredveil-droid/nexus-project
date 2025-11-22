import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GAMES, Game } from '../data/games';

interface CartItem {
  game: Game;
  quantity: number;
}

interface StoreState {
  games: Game[];
  cart: CartItem[];
  addGame: (game: Game) => void;
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  incrementDownloads: (gameId: string) => void;
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
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      games: GAMES,
      cart: [],
      killCount: 0,
      selectedOrbId: 'default',
      xp: 0,
      playTime: 0,
      selectedAvatarId: '',

      addGame: (game) => set((state) => ({ games: [game, ...state.games] })),
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
      incrementKillCount: (amount = 1) => set((state) => ({ killCount: state.killCount + amount })),
      setKillCount: (count) => set({ killCount: count }),

      setSelectedOrbId: (id) => set({ selectedOrbId: id }),
      
      // Profile Actions
      setXp: (amount) => set({ xp: amount }),
      setPlayTime: (seconds) => set({ playTime: seconds }),
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      incrementPlayTime: (seconds) => set((state) => ({ 
        playTime: state.playTime + seconds,
        xp: state.xp + (seconds * 5) // 5 XP per second played
      })),
      setSelectedAvatarId: (id) => set({ selectedAvatarId: id }),
    }),
    {
      name: 'nexus-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        // Only persist these fields
        cart: state.cart,
        killCount: state.killCount,
        selectedOrbId: state.selectedOrbId,
        xp: state.xp,
        playTime: state.playTime,
        selectedAvatarId: state.selectedAvatarId
      }),
    }
  )
);