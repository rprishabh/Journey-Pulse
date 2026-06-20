"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { CompassSpinner } from "./CompassSpinner";

// Coordinates helper
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
}

const MARKERS = [
  { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
];

function Earth({ textureUrl }: { textureUrl: string }) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Load texture
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>
      
      {/* Dynamic Destination Pins */}
      {MARKERS.map((marker, i) => {
        const position = latLngToVector3(marker.lat, marker.lng, 2.22);
        return <PulsingPin key={i} position={position} name={marker.name} />;
      })}
    </group>
  );
}

function PulsingPin({ position, name }: { position: THREE.Vector3; name: string }) {
  const pinRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (pinRef.current) {
      // Gentle bounce
      pinRef.current.position.copy(position).addScaledVector(position.clone().normalize(), Math.sin(elapsed * 4) * 0.015);
    }
    if (ringRef.current) {
      // Pulsing ring scale
      const scale = 1 + (elapsed * 2 % 1) * 1.5;
      ringRef.current.scale.set(scale, scale, scale);
      // Fade ring out
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 1 - (elapsed * 2 % 1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Core Pin */}
      <mesh ref={pinRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ff6b35" />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={new THREE.Euler(Math.PI/2, 0, 0)}>
        <ringGeometry args={[0.05, 0.08, 16]} />
        <meshBasicMaterial color="#f7931e" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function HeroScene3D() {
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return <div className="w-full h-[400px] flex items-center justify-center"><CompassSpinner /></div>;

  // Fallback to static interactive SVG globe on Mobile
  if (isMobile) {
    return (
      <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center max-w-md mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-full h-full animate-[spin_30s_linear_infinite] drop-shadow-[0_0_35px_rgba(255,107,53,0.15)] text-sunset-1"
        >
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <path d="M30,100 Q100,20 170,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M30,100 Q100,180 170,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M100,30 Q60,100 100,170" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M100,30 Q140,100 100,170" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Coordinates grid lines */}
          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" />
          {/* Pulse Pins */}
          <circle cx="120" cy="80" r="4" fill="#ff6b35" className="animate-ping" />
          <circle cx="120" cy="80" r="2.5" fill="#ff6b35" />
          <circle cx="70" cy="120" r="4" fill="#e84393" className="animate-ping" />
          <circle cx="70" cy="120" r="2.5" fill="#e84393" />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-end text-center pointer-events-none p-4">
          <p className="text-xs uppercase tracking-wider font-extrabold text-sunset-1">Swipe to Rotate in 3D (Desktop Only)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] relative select-none rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><CompassSpinner /></div>}>
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, 4.2], fov: 60 }}
          shadows
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 3, 5]} intensity={1.8} castShadow />
          <directionalLight position={[-5, -3, -5]} intensity={0.5} />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <Earth textureUrl="/textures/earth-day.jpg" />
          </Float>
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/75 backdrop-blur-md border border-sunset-1/20 px-3 py-1 rounded-full text-[10px] text-cream font-bold uppercase tracking-wider pointer-events-none">
        Drag to spin 3D Globe
      </div>
    </div>
  );
}
