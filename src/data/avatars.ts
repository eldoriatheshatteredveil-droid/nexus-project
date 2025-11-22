export interface Avatar {
  id: string;
  name: string;
  minLevel: number;
  url: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const generateAvatars = (): Avatar[] => {
  const avatars: Avatar[] = [];
  const ranks = ['Initiate', 'Scout', 'Operator', 'Specialist', 'Veteran', 'Elite', 'Commander', 'Warlord', 'Overlord', 'Deity'];
  
  for (let i = 1; i <= 50; i++) {
    let rarity: Avatar['rarity'] = 'common';
    if (i > 10) rarity = 'uncommon';
    if (i > 25) rarity = 'rare';
    if (i > 40) rarity = 'epic';
    if (i === 50) rarity = 'legendary';

    const rankIndex = Math.floor((i - 1) / 5);
    const rankName = ranks[rankIndex] || 'Unknown';
    const subRank = (i - 1) % 5 + 1;

    avatars.push({
      id: `avatar-${i}`,
      name: `${rankName} Unit ${subRank.toString().padStart(2, '0')}`,
      minLevel: i,
      url: `https://api.dicebear.com/7.x/bottts/svg?seed=NEXUS_UNIT_${i}&backgroundColor=${i > 40 ? 'ff0000' : i > 25 ? '00ffd5' : 'transparent'}`,
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
