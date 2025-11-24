export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  category: 'lofi' | 'chill' | 'cyberpunk' | 'gaming';
  // Optional alternate URLs to try if the primary `url` fails (CORS/redirect/etc)
  alternates?: string[];
}

export const MUSIC_TRACKS: Track[] = [
  // All tracks point to bundled local files in /public/music with remote alternates as fallback.
  {
    id: '1',
    title: 'Moonlight Sonata (Cyber)',
    artist: 'Joth',
    url: '/music/moonlight_sonata_cyber_joth.mp3',
    alternates: ['https://opengameart.org/sites/default/files/Cyberpunk%20Moonlight%20Sonata_0.mp3'],
    category: 'cyberpunk'
  },
  {
    id: '2',
    title: 'Lines of Code',
    artist: 'Trevor Lentz',
    url: '/music/lines_of_code_trevor_lentz.mp3',
    alternates: ['https://opengameart.org/sites/default/files/Lines%20of%20Code_0.mp3'],
    category: 'gaming'
  },
  {
    id: '3',
    title: 'Deus Ex Tempus',
    artist: 'Trevor Lentz',
    url: '/music/deus_ex_tempus_trevor_lentz.mp3',
    alternates: ['https://opengameart.org/sites/default/files/Deus%20Ex%20Tempus_0.mp3'],
    category: 'cyberpunk'
  },
  {
    id: '4',
    title: 'Chill Lo-Fi',
    artist: 'omfgdude',
    url: '/music/chill_lofi_omfgdude.mp3',
    alternates: ['https://opengameart.org/sites/default/files/ChillLofiR_0.mp3'],
    category: 'lofi'
  },
  {
    id: '5',
    title: 'November Snow',
    artist: 'cynicmusic',
    url: '/music/november_snow_cynicmusic.mp3',
    alternates: ['https://opengameart.org/sites/default/files/155%20November_snow-33_tape_leveled.mp3'],
    category: 'chill'
  },
  {
    id: '6',
    title: 'Cold Lake',
    artist: 'TAD',
    url: '/music/cold_lake_tad.mp3',
    alternates: ['https://opengameart.org/sites/default/files/8_bit_cold_lake_lofi.mp3'],
    category: 'lofi'
  },
  {
    id: '7',
    title: 'Shinsei',
    artist: 'obscure music',
    url: '/music/shinsei_obscure_music.mp3',
    alternates: ['https://opengameart.org/sites/default/files/cda98e895139.mp3'],
    category: 'chill'
  },
  {
    id: '8',
    title: 'Cyberpunk City',
    artist: 'Eric Matyas',
    url: '/music/cyberpunk_city_eric_matyas.mp3',
    alternates: ['https://opengameart.org/sites/default/files/Cyberpunk%20City_0.mp3'],
    category: 'cyberpunk'
  },
  {
    id: '9',
    title: 'Cyberpunk Arcade 3',
    artist: 'Eric Matyas',
    url: '/music/cyberpunk_arcade_3_eric_matyas.mp3',
    alternates: ['https://opengameart.org/sites/default/files/cyberpunk_arcade_3_0.mp3'],
    category: 'gaming'
  },
  {
    id: '10',
    title: 'Cyberpunk Beauty',
    artist: 'Tarush Singhal',
    url: '/music/cyberpunk_beauty_tarush_singhal.mp3',
    alternates: ['https://opengameart.org/sites/default/files/cyberpunk.mp3'],
    category: 'chill'
  },
  {
    id: '11',
    title: 'Cyberpunk Genesis',
    artist: 'Trevor Lentz',
    url: '/music/cyberpunk_genesis_trevor_lentz.mp3',
    alternates: ['https://opengameart.org/sites/default/files/trevor_lentz_-_cyberpunk-_genesis_-_01_cyberpunk-_genesis.mp3','https://opengameart.org/sites/default/files/audio_preview/trevor_lentz_-_cyberpunk-_genesis_-_01_cyberpunk-_genesis.mp3'],
    category: 'cyberpunk'
  },
  {
    id: '12',
    title: 'Space Boss Battle',
    artist: 'MintoDog',
    url: '/music/space_boss_battle_mintodog.mp3',
    alternates: ['https://opengameart.org/sites/default/files/space_boss_battle_bpm175.mp3'],
    category: 'gaming'
  },
  {
    id: '13',
    title: 'Pondering the Cosmos',
    artist: 'Ruskerdax',
    url: 'https://opengameart.org/sites/default/files/Ruskerdax%20-%20Pondering%20the%20Cosmos_0.mp3',
    category: 'chill'
  },
  {
    id: '14',
    title: 'CyberPunk Chronicles',
    artist: 'Hitctrl',
    url: 'https://opengameart.org/sites/default/files/CyberPunk_Chronicles.mp3',
    category: 'cyberpunk'
  },
  {
    id: '15',
    title: 'Streetsound',
    artist: 'p0ss',
    url: 'https://opengameart.org/sites/default/files/streetsound_150_bpm.mp3',
    category: 'gaming'
  },
  {
    id: '16',
    title: 'Bit Space',
    artist: 'Beam Theory',
    url: 'https://opengameart.org/sites/default/files/Bit%20Space%20%28loopable%29_3.mp3',
    category: 'gaming'
  },
  {
    id: '17',
    title: 'Echelon',
    artist: 'p0ss',
    url: 'https://opengameart.org/sites/default/files/echelon.mp3',
    category: 'cyberpunk'
  },
  {
    id: '18',
    title: 'Wind',
    artist: 'p0ss',
    url: 'https://opengameart.org/sites/default/files/wind.mp3',
    category: 'chill'
  },
  {
    id: '19',
    title: 'Endless Cyber Runner',
    artist: 'Eric Matyas',
    url: 'https://opengameart.org/sites/default/files/Endless%20Cyber%20Runner_0.mp3',
    category: 'gaming'
  },
  {
    id: '20',
    title: 'Neon Runner',
    artist: 'Eric Matyas',
    url: 'https://opengameart.org/sites/default/files/Neon%20Runner_0.mp3',
    category: 'cyberpunk'
  },
  {
    id: '21',
    title: 'Thrust Sequence',
    artist: 'Matthew Pablo',
    url: 'https://opengameart.org/sites/default/files/Thrust%20Sequence_0.mp3',
    category: 'gaming'
  },
  {
    id: '22',
    title: 'Future Noir',
    artist: 'Eric Matyas',
    url: 'https://opengameart.org/sites/default/files/Future%20Noir_0.mp3',
    category: 'cyberpunk'
  }
];
