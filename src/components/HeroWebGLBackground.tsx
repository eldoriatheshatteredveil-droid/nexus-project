"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color } from 'three';
import * as THREE from 'three';

/**
 * HeroWebGLBackground
 * - Interactive "Pixel Grid" that ripples and lights up under the cursor.
 * - Uses InstancedMesh for high performance with thousands of cubes.
 */

const PixelGrid: React.FC = () => {
  const meshRef = useRef<InstancedMesh>(null!);
  const [hovered, setHover] = useState<number | null>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  
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

        // Wave effect
        const z = Math.sin(dist * 0.5 - time * 2) * 1.5 + Math.cos(x * 0.2 + time) * 0.5;
        
        // Scale effect based on proximity
        const scale = Math.max(0.2, 1 - dist * 0.15);

        dummy.position.set(xPos, yPos, z);
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.x = time * 0.2 + dist * 0.1;
        dummy.rotation.y = time * 0.1;
        dummy.updateMatrix();

        meshRef.current.setMatrixAt(i, dummy.matrix);

        // Color effect
        // Base color: dark cyan/purple
        // Highlight: bright cyan/white
        const isNear = dist < 5;
        const r = isNear ? 0.2 : 0.05;
        const g = isNear ? 1.0 : 0.1;
        const b = isNear ? 0.8 : 0.2;
        
        color.setRGB(r, g, b);
        meshRef.current.setColorAt(i, color);

        i++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial 
        color="#000000" 
        emissive="#00ffd5" 
        emissiveIntensity={0.5} 
        roughness={0.1} 
        metalness={0.8} 
        transparent 
        opacity={0.9} 
      />
    </instancedMesh>
  );
};

const HeroWebGLBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 40], fov: 50 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff66cc" />
        <pointLight position={[-10, -10, 10]} intensity={1} color="#00ffd5" />
        <fog attach="fog" args={["#07070b", 20, 60]} />
        <PixelGrid />
      </Canvas>

      {/* Gradient blob overlays */}
      <div className="pointer-events-none absolute -z-5 inset-0 mix-blend-screen">
        <div className="absolute -left-[10%] top-20 w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20 bg-[#ff007f] animate-pulse" />
        <div className="absolute right-0 bottom-0 w-[35vw] h-[35vw] rounded-full blur-[100px] opacity-20 bg-[#00ffd5] animate-pulse" />
      </div>
    </div>
  );
};

export default HeroWebGLBackground;
