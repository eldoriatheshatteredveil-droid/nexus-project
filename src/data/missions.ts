export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number; // Credits
  xpReward: number;
  type: 'play' | 'kill' | 'upload' | 'score';
  target: number;
  current: number;
  completed: boolean;
}

export const DAILY_MISSIONS: Mission[] = [
  {
    id: 'daily_snake_score',
    title: 'SERPENT_MASTER',
    description: 'Score 50 points in a single game of Snake.',
    reward: 100,
    xpReward: 250,
    type: 'score',
    target: 50,
    current: 0,
    completed: false
  },
  {
    id: 'daily_kills',
    title: 'CLEAN_SWEEP',
    description: 'Accumulate 20 kills across any game.',
    reward: 150,
    xpReward: 300,
    type: 'kill',
    target: 20,
    current: 0,
    completed: false
  },
  {
    id: 'daily_playtime',
    title: 'NEURAL_SYNC',
    description: 'Stay connected to the Nexus for 10 minutes.',
    reward: 50,
    xpReward: 100,
    type: 'play',
    target: 600, // seconds
    current: 0,
    completed: false
  }
];
