import React, { useEffect } from 'react';
import { useStore } from '../store';

const ThemeManager: React.FC = () => {
  const { isEquipped } = useStore();

  useEffect(() => {
    const isGold = isEquipped('cosmetic_gold_hud');
    const isMatrix = isEquipped('cosmetic_matrix');

    if (isGold) {
      document.body.classList.add('theme-gold');
    } else {
      document.body.classList.remove('theme-gold');
    }

    if (isMatrix) {
      document.body.classList.add('theme-matrix');
    } else {
      document.body.classList.remove('theme-matrix');
    }

  }, [isEquipped]);

  return null;
};

export default ThemeManager;
