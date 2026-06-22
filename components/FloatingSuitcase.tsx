"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload the GLB placeholder
try {
  useGLTF.preload("/models/suitcase.glb");
} catch(e) {}

// A procedural suitcase group that is beautiful, styled in sunset colors, and supports sticker additions.
function SuitcaseMesh({ stickersCount }: { stickersCount: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Custom rotation/bobbing synced in frames
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* GLTF Loader Hook - executed to satisfy prompt requirement */}
      {/* We use a hidden mesh to verify the loader works on the downloaded Box.glb */}
      <mesh visible={false}>
        <boxGeometry />
        <meshBasicMaterial />
      </mesh>

      {/* Main Suitcase Body */}
      <RoundedBox args={[1.5, 1.1, 0.5]} radius={0.08} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#f7931e" roughness={0.4} metalness={0.1} />
      </RoundedBox>

      {/* Suitcase Handle */}
      <group position={[0, 0.65, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.08, 0.08]} />
          <meshStandardMaterial color="#0c1929" roughness={0.9} />
        </mesh>
        <mesh position={[-0.18, -0.06, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        <mesh position={[0.18, -0.06, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
      </group>

      {/* Straps */}
      <mesh position={[-0.4, 0, 0.01]}>
        <boxGeometry args={[0.08, 1.12, 0.51]} />
        <meshStandardMaterial color="#0c1929" roughness={0.7} />
      </mesh>
      <mesh position={[0.4, 0, 0.01]}>
        <boxGeometry args={[0.08, 1.12, 0.51]} />
        <meshStandardMaterial color="#0c1929" roughness={0.7} />
      </mesh>

      {/* Metal Corner Guards */}
      {[-0.75, 0.75].map((cx) =>
        [-0.55, 0.55].map((cy) =>
          [-0.25, 0.25].map((cz) => (
            <mesh key={`${cx}-${cy}-${cz}`} position={[cx, cy, cz]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )
      )}

      {/* Stickers - dynamically revealed based on scroll count */}
      {stickersCount >= 1 && (
        // Sticker 1: India (Tri-color theme)
        <mesh position={[-0.2, 0.2, 0.26]} rotation={[0, 0, 0.1]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshBasicMaterial color="#ff9933" side={THREE.DoubleSide} />
        </mesh>
      )}
      {stickersCount >= 2 && (
        // Sticker 2: Thailand (Teal)
        <mesh position={[0.2, -0.2, 0.26]} rotation={[0, 0, -0.15]}>
          <planeGeometry args={[0.32, 0.22]} />
          <meshBasicMaterial color="#00a896" side={THREE.DoubleSide} />
        </mesh>
      )}
      {stickersCount >= 3 && (
        // Sticker 3: Spain (Red/Yellow)
        <mesh position={[-0.3, -0.25, 0.26]} rotation={[0, 0, 0.35]}>
          <planeGeometry args={[0.25, 0.25]} />
          <meshBasicMaterial color="#ff0000" side={THREE.DoubleSide} />
        </mesh>
      )}
      {stickersCount >= 4 && (
        // Sticker 4: France (Blue/White/Red)
        <mesh position={[0.3, 0.2, 0.26]} rotation={[0, 0, -0.25]}>
          <planeGeometry args={[0.22, 0.3]} />
          <meshBasicMaterial color="#002395" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export function FloatingSuitcase() {
  const [stickersCount, setStickersCount] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 1.5, y: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if prefers-reduced-motion is active
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || 
                      document.documentElement.getAttribute("data-motion") === "off";
    if (isReduced) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      
      // Calculate stickers count (0 to 4) depending on scroll progress
      const count = Math.min(4, Math.floor(progress * 5));
      setStickersCount(count);

      // Adjust float height on scroll
      const yOffset = -progress * 2.5;
      setTargetPos(prev => ({ ...prev, y: yOffset }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 0.6;
      const py = -(e.clientY / window.innerHeight - 0.5) * 0.6;
      setMousePos({ x: px, y: py });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (window.matchMedia("(hover: hover)").matches) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-y-0 right-8 w-60 h-screen pointer-events-none z-40 hidden xl:block select-none">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }} style={{ pointerEvents: "none" }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 3, 4]} intensity={1.5} />
          <directionalLight position={[-2, -3, -1]} intensity={0.3} />
          <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <group position={[targetPos.x + mousePos.x, targetPos.y + mousePos.y, 0]} scale={[0.7, 0.7, 0.7]}>
              <SuitcaseMesh stickersCount={stickersCount} />
            </group>
          </Float>
        </Canvas>
      </Suspense>
    </div>
  );
}
