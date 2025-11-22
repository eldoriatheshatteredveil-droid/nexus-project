export interface Game {
  id: string;
  title: string;
  slug: string;
  price: number;
  payWhatYouWant?: boolean;
  cover: string;
  description: string;
  tags: string[];
  rating: number;
  downloads: number;
  category: 'ai' | 'dev' | 'nvious';
  uploaderId?: string;
  uploaderName?: string;
}

export const GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Puzzle',
  'Horror',
  'Sci-Fi',
  'Platformer',
  'Shooter',
  'Fighting',
  'Arcade',
  'Indie'
];

export const GAMES: Game[] = [
  {
    id: 'nvious-snake',
    title: 'Nexus Snake',
    slug: 'neon-snake',
    price: 0,
    payWhatYouWant: true,
    cover: 'data:image/svg+xml;utf8,<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="black"/><rect x="200" y="200" width="20" height="20" fill="%2300ffd5"/><rect x="180" y="200" width="20" height="20" fill="%2300ffd5"/><rect x="160" y="200" width="20" height="20" fill="%2300ffd5"/><rect x="300" y="100" width="20" height="20" fill="%23ff66cc"/></svg>',
    description: 'Dive into the digital abyss with Nexus Snake, a high-octane reimagining of the arcade classic. Navigate through a pulsating cyber-grid, consuming data packets to expand your digital footprint while avoiding system firewalls and your own trailing code. Featuring reactive synth-wave audio, holographic visuals, and progressively challenging speeds, this isn\'t just a game—it\'s a test of your reflexes in the machine. Built exclusively for the NEXUS platform.',
    tags: ['Arcade', 'Retro', 'Nexus Exclusive', 'Cyberpunk', 'Reaction', 'Single Player'],
    rating: 5.0,
    downloads: 1337,
    category: 'nvious'
  },
  {
    id: 'nvious-cyber-guess',
    title: 'Nexus Guess',
    slug: 'cyber-guess',
    price: 0,
    payWhatYouWant: true,
    cover: 'data:image/svg+xml;utf8,<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="black"/><text x="50" y="100" fill="%2300ffd5" font-family="monospace" font-size="24">ACCESS_CODE_REQUIRED</text><text x="50" y="150" fill="white" font-family="monospace" font-size="24">ENTER KEY: ****</text><rect x="50" y="200" width="200" height="40" stroke="%2300ffd5" fill="none"/><text x="60" y="230" fill="%2300ffd5" font-family="monospace" font-size="20">7 2 9 1</text></svg>',
    description: 'Infiltrate the secure mainframe by decrypting the numeric key. The system will guide your brute-force attempts with high/low indicators. Crack the code in the fewest attempts to prove your hacking prowess. A logic puzzle forged in the digital frontier.',
    tags: ['Puzzle', 'Logic', 'Nexus Exclusive', 'Strategy'],
    rating: 4.8,
    downloads: 892,
    category: 'nvious'
  },
  {
    id: 'nvious-20-questions',
    title: 'Nexus Oracle',
    slug: 'neural-oracle',
    price: 0,
    payWhatYouWant: true,
    cover: 'data:image/svg+xml;utf8,<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="black"/><circle cx="400" cy="300" r="100" stroke="%2300ffd5" stroke-width="2" fill="none"/><circle cx="400" cy="300" r="80" stroke="%23ff66cc" stroke-width="2" fill="none"/><text x="400" y="300" fill="white" font-family="monospace" font-size="20" text-anchor="middle" dominant-baseline="middle">THINKING...</text></svg>',
    description: 'Challenge the Nexus Oracle. The AI will select a concept from its database. You have 20 queries to deduce the nature of the hidden variable. Ask wisely—the machine is listening.',
    tags: ['Puzzle', 'Trivia', 'Nexus Exclusive', 'AI'],
    rating: 4.9,
    downloads: 404,
    category: 'nvious'
  },
  {
    id: 'nexus-pong',
    title: 'Nexus Pong',
    slug: 'nexus-pong',
    price: 0,
    payWhatYouWant: true,
    cover: 'data:image/svg+xml;utf8,<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="black"/><line x1="400" y1="0" x2="400" y2="600" stroke="%2300ffd5" stroke-width="2" stroke-dasharray="10,10"/><rect x="20" y="250" width="10" height="80" fill="%2300ffd5"/><rect x="770" y="300" width="10" height="80" fill="%23ff0055"/><circle cx="400" cy="300" r="6" fill="white"/><text x="200" y="100" fill="%2300ffd5" font-family="monospace" font-size="40">0</text><text x="600" y="100" fill="%23ff0055" font-family="monospace" font-size="40">0</text></svg>',
    description: 'The classic arcade experience, reimagined for the Nexus. Face off against a relentless AI in this high-speed, neon-soaked battle of reflexes. Featuring reactive physics and a pulsating cyber-grid arena. Can you defeat the machine?',
    tags: ['Arcade', 'Retro', 'Nexus Original', 'Sports', 'Reaction'],
    rating: 4.7,
    downloads: 42,
    category: 'nvious'
  },
  {
    id: 'nexus-breakout',
    title: 'Nexus Breakout',
    slug: 'nexus-breakout',
    price: 0,
    payWhatYouWant: true,
    cover: 'data:image/svg+xml;utf8,<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="black"/><g fill="%23ff0055"><rect x="35" y="60" width="70" height="25"/><rect x="115" y="60" width="70" height="25"/><rect x="195" y="60" width="70" height="25"/><rect x="275" y="60" width="70" height="25"/><rect x="355" y="60" width="70" height="25"/></g><g fill="%23ff66cc"><rect x="35" y="95" width="70" height="25"/><rect x="115" y="95" width="70" height="25"/><rect x="195" y="95" width="70" height="25"/></g><rect x="350" y="550" width="100" height="15" fill="%2300ffd5"/><circle cx="400" cy="500" r="6" fill="white"/></svg>',
    description: 'Smash through the firewall. A high-velocity brick-breaking assault on the system\'s defenses. Features reactive physics, particle destruction, and neon-soaked visuals. Use your mouse or keyboard to control the paddle and breach the core.',
    tags: ['Arcade', 'Retro', 'Nexus Original', 'Action', 'Physics'],
    rating: 4.9,
    downloads: 0,
    category: 'nvious'
  },
  {
    id: 'void-vanguard',
    title: 'Nexus Invaders',
    slug: 'void-vanguard',
    price: 0,
    payWhatYouWant: true,
    cover: 'data:image/svg+xml;utf8,<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="600" fill="black"/><g fill="%23ff0055"><rect x="100" y="50" width="30" height="20"/><rect x="150" y="50" width="30" height="20"/><rect x="200" y="50" width="30" height="20"/><rect x="250" y="50" width="30" height="20"/></g><g fill="%23ff66cc"><rect x="100" y="90" width="30" height="20"/><rect x="150" y="90" width="30" height="20"/></g><rect x="380" y="560" width="40" height="20" fill="%2300ffd5"/><rect x="100" y="480" width="80" height="40" fill="%2300ff99"/><rect x="300" y="480" width="80" height="40" fill="%2300ff99"/></svg>',
    description: 'They are coming from the void. Defend the Nexus against waves of relentless cyber-invaders. A modern reimagining of the classic space shooter with destructible cover, increasing difficulty, and intense boss waves. Hold the line.',
    tags: ['Arcade', 'Shooter', 'Nexus Original', 'Action', 'Retro'],
    rating: 4.8,
    downloads: 0,
    category: 'nvious'
  }
];

export default GAMES;
