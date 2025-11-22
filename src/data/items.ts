export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'cheat' | 'cosmetic' | 'system';
  icon: string;
  rarity: 'common' | 'rare' | 'legendary' | 'illegal';
}

export const MARKET_ITEMS: Item[] = [
  {
    id: 'cheat_slow_time',
    name: 'CHRONO_DILATOR_v1',
    description: 'Slows down time in Snake and Breakout by 20%.',
    price: 500,
    type: 'cheat',
    icon: 'Clock',
    rarity: 'rare'
  },
  {
    id: 'cheat_magnet',
    name: 'VOID_MAGNET',
    description: 'Attracts power-ups from a larger radius.',
    price: 750,
    type: 'cheat',
    icon: 'Magnet',
    rarity: 'rare'
  },
  {
    id: 'cosmetic_matrix',
    name: 'THEME_MATRIX',
    description: 'Unlocks the classic green rain matrix background.',
    price: 1000,
    type: 'cosmetic',
    icon: 'Code',
    rarity: 'legendary'
  },
  {
    id: 'cosmetic_gold_hud',
    name: 'HUD_PRESTIGE',
    description: 'Changes all UI accents to Prestige Gold.',
    price: 2000,
    type: 'cosmetic',
    icon: 'Crown',
    rarity: 'legendary'
  },
  {
    id: 'system_firewall_bypass',
    name: 'ROOT_ACCESS_KEY',
    description: 'Bypasses level restrictions on all games for 24h.',
    price: 5000,
    type: 'system',
    icon: 'Key',
    rarity: 'illegal'
  }
];
