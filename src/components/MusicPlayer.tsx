import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, List, Music, Loader2, ChevronRight, Radio } from 'lucide-react';
import { MUSIC_TRACKS, Track } from '../data/music';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

const MusicPlayer: React.FC = () => {
  const { setIsMusicPlaying } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];
  const alternateIndexRef = React.useRef(0);

  // Close player when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Sync local playing state with global store
  useEffect(() => {
    setIsMusicPlaying(isPlaying);
  }, [isPlaying, setIsMusicPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Audio play failed:", e);
        });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // Reset alternate index whenever track changes
  useEffect(() => {
    alternateIndexRef.current = 0;
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      // If we're supposed to be playing, attempt to start playback after switching src
      if (isPlaying) {
        try {
          audioRef.current.load();
          const p = audioRef.current.play();
          if (p && p.catch) {
            p.catch(e => console.warn('Play after track change failed:', e));
          }
          setIsLoading(true);
        } catch (e) {
          console.warn('Error while auto-playing after track change', e);
        }
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleError = () => {
    console.warn(`Error playing track: ${currentTrack.title}. Trying alternates if available.`);
    setIsLoading(false);

    const alternates = (currentTrack as any).alternates as string[] | undefined;
    if (alternates && alternates.length > 0 && alternateIndexRef.current < alternates.length) {
      const nextUrl = alternates[alternateIndexRef.current];
      alternateIndexRef.current += 1;
      if (audioRef.current) {
        audioRef.current.src = nextUrl;
        audioRef.current.load();
        const p = audioRef.current.play();
        if (p && p.catch) p.catch(e => {
          console.warn('Alternate play failed:', e);
          // try next alternate on failure
          handleError();
        });
        setIsLoading(true);
        setIsPlaying(true);
        return;
      }
    }

    // No alternates left — stop and move to next track
    setIsPlaying(false);
    nextTrack();
  };

  const handleWaiting = () => {
    if (isPlaying) setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="auto"
        onEnded={handleEnded}
        onError={handleError}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onPlaying={() => setIsLoading(false)}
        loop={false} 
      />

      {/* Side Tab Button */}
      <motion.button
        ref={buttonRef}
        className={`fixed left-0 top-32 z-40 bg-black/80 border-r border-t border-b border-[#00ffd5] py-6 pr-1 pl-2 rounded-r-xl text-[#00ffd5] hover:bg-[#00ffd5]/20 transition-colors backdrop-blur-md flex flex-col items-center gap-4 ${isExpanded ? 'shadow-[5px_0_15px_rgba(0,255,213,0.2)]' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        animate={{ x: isExpanded ? 320 : 0 }} // Move out when expanded
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Music size={20} />
        <span className="text-[10px] font-orbitron font-bold tracking-widest [writing-mode:vertical-rl] rotate-180">
          AUDIO
        </span>
      </motion.button>

      {/* Expanded Player Panel */}
      <motion.div
        ref={panelRef}
        className="fixed left-0 top-32 z-50 w-80 bg-black/90 border-r border-t border-b border-[#00ffd5]/50 rounded-r-2xl backdrop-blur-xl shadow-[5px_0_30px_rgba(0,255,213,0.15)] overflow-hidden"
        initial={{ x: '-100%' }}
        animate={{ x: isExpanded ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header / Close */}
        <div className="p-4 border-b border-[#00ffd5]/20 flex items-center justify-between bg-gradient-to-r from-[#00ffd5]/10 to-transparent">
          <div className="flex items-center gap-2 text-[#00ffd5]">
            <Radio size={18} className={isPlaying ? "animate-pulse" : ""} />
            <span className="font-orbitron font-bold text-sm tracking-wider text-glow">NEXUS AUDIO</span>
          </div>
          <button 
            onClick={() => setIsExpanded(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Now Playing Section */}
        <div className="p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
          {/* Background Visualizer Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#00ffd5]/50 rounded-full blur-[60px] animate-pulse" />
          </div>

          <div className="relative w-32 h-32 rounded-full border-4 border-[#00ffd5]/30 flex items-center justify-center bg-black/50 shadow-neon group">
            <div className={`absolute inset-0 rounded-full border-2 border-[#00ffd5] border-dashed animate-[spin_10s_linear_infinite] ${isPlaying ? 'opacity-100' : 'opacity-30'}`} />
            <Music size={40} className={`text-[#00ffd5] ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>

          <div className="space-y-1 z-10 w-full">
            <h3 className="text-white font-bold font-orbitron truncate text-lg text-glow">{currentTrack.title}</h3>
            <p className="text-[#00ffd5] text-xs font-mono tracking-wider truncate">{currentTrack.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 z-10">
            <button onClick={prevTrack} className="p-2 text-gray-400 hover:text-white transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-[#00ffd5] text-black rounded-full hover:bg-[#00ffd5]/80 transition-all shadow-neon hover:scale-105"
            >
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-2 text-gray-400 hover:text-white transition-colors">
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 w-full z-10 px-4">
            <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-[#00ffd5]">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00ffd5] [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>

        {/* Playlist */}
        <div 
          className="border-t border-[#00ffd5]/20 bg-black/40 max-h-[300px] overflow-y-auto custom-scrollbar"
          data-lenis-prevent
        >
          <div className="p-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest sticky top-0 bg-black/90 backdrop-blur-sm z-10 border-b border-white/5">
            Queue Sequence
          </div>
          {MUSIC_TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => playTrack(index)}
              className={`w-full text-left p-3 text-xs font-mono border-b border-white/5 hover:bg-white/5 transition-colors flex items-center gap-3 group ${
                currentTrackIndex === index ? 'bg-[#00ffd5]/10' : ''
              }`}
            >
              <div className={`w-1 h-8 rounded-full transition-colors ${currentTrackIndex === index ? 'bg-[#00ffd5]' : 'bg-gray-800 group-hover:bg-gray-700'}`} />
              <div className="flex-1 min-w-0">
                <div className={`font-bold truncate ${currentTrackIndex === index ? 'text-[#00ffd5]' : 'text-gray-300'}`}>
                  {track.title}
                </div>
                <div className="text-[10px] text-gray-500 truncate">{track.artist}</div>
              </div>
              {currentTrackIndex === index && isPlaying && (
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-0.5 bg-[#00ffd5] animate-[music-bar_0.5s_ease-in-out_infinite]" />
                  <div className="w-0.5 bg-[#00ffd5] animate-[music-bar_0.7s_ease-in-out_infinite]" />
                  <div className="w-0.5 bg-[#00ffd5] animate-[music-bar_0.4s_ease-in-out_infinite]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
