export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  category: 'lofi' | 'chill' | 'cyberpunk' | 'gaming';
}

export const MUSIC_TRACKS: Track[] = [
  { 
    id: '1', 
    title: 'Moonlight Sonata (Cyber)', 
    artist: 'Joth', 
    url: 'https://opengameart.org/sites/default/files/Cyberpunk%20Moonlight%20Sonata_0.mp3', 
    category: 'cyberpunk' 
  },
  { 
    id: '2', 
    title: 'Lines of Code', 
    artist: 'Trevor Lentz', 
    url: 'https://opengameart.org/sites/default/files/Lines%20of%20Code_0.mp3', 
    category: 'gaming' 
  },
  { 
    id: '3', 
    title: 'Deus Ex Tempus', 
    artist: 'Trevor Lentz', 
    url: 'https://opengameart.org/sites/default/files/Deus%20Ex%20Tempus_0.mp3', 
    category: 'cyberpunk' 
  },
  { 
    id: '4', 
    title: 'Chill Lo-Fi', 
    artist: 'omfgdude', 
    url: 'https://opengameart.org/sites/default/files/ChillLofiR_0.mp3', 
    category: 'lofi' 
  },
  { 
    id: '5', 
    title: 'November Snow', 
    artist: 'cynicmusic', 
    url: 'https://opengameart.org/sites/default/files/155%20November_snow-33_tape_leveled.mp3', 
    category: 'chill' 
  },
  { 
    id: '6', 
    title: 'Cold Lake', 
    artist: 'TAD', 
    url: 'https://opengameart.org/sites/default/files/8_bit_cold_lake_lofi.mp3', 
    category: 'lofi' 
  },
  { 
    id: '7', 
    title: 'Shinsei', 
    artist: 'obscure music', 
    url: 'https://opengameart.org/sites/default/files/cda98e895139.mp3', 
    category: 'chill' 
  }
];
