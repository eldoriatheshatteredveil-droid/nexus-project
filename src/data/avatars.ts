export interface Avatar {
  id: string;
  name: string;
  minLevel: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const generateAvatars = (): Avatar[] => {
  const avatars: Avatar[] = [];
  
  for (let i = 1; i <= 50; i++) {
    let rarity: Avatar['rarity'] = 'common';
    let name = `Organism Stage ${i}`;

    if (i >= 50) {
      rarity = 'legendary';
      name = 'APEX PREDATOR';
    } else if (i >= 40) {
      rarity = 'epic';
      name = `Leviathan Class - Stage ${i - 39}`;
    } else if (i >= 30) {
      rarity = 'rare';
      name = `Hunter Class - Stage ${i - 29}`;
    } else if (i >= 20) {
      rarity = 'uncommon';
      name = `Chrysalis Class - Stage ${i - 19}`;
    } else if (i >= 10) {
      rarity = 'common';
      name = `Larva Class - Stage ${i - 9}`;
    } else {
      name = `Spore Class - Stage ${i}`;
    }

    avatars.push({
      id: `evo-${i}`,
      name: name,
      minLevel: i,
      rarity
    });
  }
  return avatars;
};

export const AVATARS = generateAvatars();

// 1 year = 365 * 24 * 3600 = 31,536,000 seconds
// 5 XP per second (from store)
// Total XP for Level 50 = 31,536,000 * 5 = 157,680,000 XP
const XP_FOR_LEVEL_50 = 157680000;
const MAX_LEVEL = 50;
// Formula: XP = CONSTANT * (Level - 1)^2
// CONSTANT = XP_FOR_LEVEL_50 / (49^2) = 157680000 / 2401 ≈ 65672.636
const XP_CONSTANT = 65673;

export const getLevelFromXP = (xp: number): number => {
  // Formula: Level = Math.floor(Math.sqrt(xp / XP_CONSTANT)) + 1
  return Math.min(MAX_LEVEL, Math.floor(Math.sqrt(xp / XP_CONSTANT)) + 1);
};

export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(XP_CONSTANT * Math.pow(level - 1, 2));
};
