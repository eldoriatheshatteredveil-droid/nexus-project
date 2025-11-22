import { useCallback } from 'react';
import { playHoverSound, playClickSound, playSwitchSound, playGlitchSound, playGunshotSound } from '../utils/audio';

export const useCyberSound = () => {
  const playHover = useCallback(() => {
    playHoverSound();
  }, []);

  const playClick = useCallback(() => {
    playClickSound();
  }, []);

  const playSwitch = useCallback(() => {
    playSwitchSound();
  }, []);

  const playGlitch = useCallback(() => {
    playGlitchSound();
  }, []);

  const playGunshot = useCallback(() => {
    playGunshotSound();
  }, []);

  return { playHover, playClick, playSwitch, playGlitch, playGunshot };
};
