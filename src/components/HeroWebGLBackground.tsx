"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color } from 'three';
import * as THREE from 'three';
import { useStore } from '../store';

/**
 * HeroWebGLBackground
 * - Interactive "Pixel Grid" that ripples and lights up under the cursor.
 * - Uses InstancedMesh for high performance with thousands of cubes.
 */

interface ThemeColors {
  primary: string;
  secondary: string;
  bg: string;
  fog: string;
}

const PixelGrid: React.FC<{ theme: ThemeColors }> = ({ theme }) => {
  const meshRef = useRef<InstancedMesh>(null!);
  const [hovered, setHover] = useState<number | null>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const primaryColor = useMemo(() => new Color(theme.primary), [theme.primary]);
  
  // Grid configuration
  const rows = 40;
  const cols = 60;
  const count = rows * cols;
  const spacing = 1.2;

  // Mouse position tracking
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalize mouse to -1 to 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    let i = 0;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        // Calculate position centered on screen
        const xPos = (x - cols / 2) * spacing;
        const yPos = (y - rows / 2) * spacing;
        
        // Distance from mouse (mapped to world space approx)
        const dx = xPos - mouse.current.x * 30; // Scale mouse to world
        const dy = yPos - mouse.current.y * 20;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Wave effect - Smoother, slower
        const z = Math.sin(dist * 0.2 - time * 0.5) * 0.8 + Math.cos(x * 0.1 + time * 0.5) * 0.2;
        
        // Scale effect based on proximity - Less aggressive
        const scale = Math.max(0.1, 0.6 - dist * 0.05);

        dummy.position.set(xPos, yPos, z);
        dummy.scale.set(scale, scale, scale);
        // Gentle rotation
        dummy.rotation.x = time * 0.1 + dist * 0.05;
        dummy.rotation.y = time * 0.05;
        dummy.updateMatrix();

        meshRef.current.setMatrixAt(i, dummy.matrix);

        // Color effect - Softer
        const isNear = dist < 8;
        
        if (isNear) {
          // Lerp towards primary color based on distance
          const intensity = Math.max(0, 1 - dist / 8);
          color.copy(primaryColor).multiplyScalar(0.3 + intensity * 0.4);
        } else {
          color.copy(primaryColor).multiplyScalar(0.05);
        }
        
        meshRef.current.setColorAt(i, color);

        i++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color="#111111" 
        emissive={theme.primary} 
        emissiveIntensity={0.2} 
        roughness={0.4} 
        metalness={0.6} 
        transparent 
        opacity={0.6} 
      />
    </instancedMesh>
  );
};

const HeroWebGLBackground: React.FC = () => {
  const equippedItems = useStore((state) => state.equippedItems);
  
  const theme = useMemo(() => {
    if (equippedItems.some(i => i === 'cosmetic_gold_hud')) {
      return {
        primary: '#FFD700',
        secondary: '#DAA520',
        bg: '#1a1a00',
        fog: '#1a1a00'
      };
    }
    if (equippedItems.some(i => i === 'cosmetic_matrix')) {
      return {
        primary: '#00FF00',
        secondary: '#003300',
        bg: '#000000',
        fog: '#000000'
      };
    }
    return {
      primary: '#00ffd5',
      secondary: '#ff66cc',
      bg: '#07070b',
      fog: '#07070b'
    };
  }, [equippedItems]);

  return (
    <div className="absolute inset-0 -z-10 opacity-30 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 45], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color={theme.secondary} />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color={theme.primary} />
        <fog attach="fog" args={[theme.fog, 25, 65]} />
        <PixelGrid theme={theme} />
      </Canvas>
    </div>
  );
};

export default HeroWebGLBackground;
