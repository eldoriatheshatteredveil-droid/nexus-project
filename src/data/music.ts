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
  },
  { 
    id: '8', 
    title: 'Cyberpunk City', 
    artist: 'Eric Matyas', 
    url: 'https://opengameart.org/sites/default/files/Cyberpunk%20City_0.mp3', 
    category: 'cyberpunk' 
  },
  { 
    id: '9', 
    title: 'Cyberpunk Arcade 3', 
    artist: 'Eric Matyas', 
    url: 'https://opengameart.org/sites/default/files/cyberpunk_arcade_3_0.mp3', 
    category: 'gaming' 
  },
  { 
    id: '10', 
    title: 'Cyberpunk Beauty', 
    artist: 'Tarush Singhal', 
    url: 'https://opengameart.org/sites/default/files/cyberpunk.mp3', 
    category: 'chill' 
  },
  { 
    id: '11', 
    title: 'Cyberpunk Genesis', 
    artist: 'Trevor Lentz', 
    url: 'https://opengameart.org/sites/default/files/audio_preview/trevor_lentz_-_cyberpunk-_genesis_-_01_cyberpunk-_genesis.mp3', 
    category: 'cyberpunk' 
  },
  { 
    id: '12', 
    title: 'Space Boss Battle', 
    artist: 'MintoDog', 
    url: 'https://opengameart.org/sites/default/files/space_boss_battle_bpm175.mp3', 
    category: 'gaming' 
  }
];
