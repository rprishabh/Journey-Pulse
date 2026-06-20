"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import confetti from "canvas-confetti";
import { CompassSpinner } from "./CompassSpinner";

// Visa stamps loaded from API or fallback
interface Stamp {
  country: string;
  code: string;
  type: string;
}

const FALLBACK_STAMPS: Stamp[] = [
  { country: "Thailand", code: "TH", type: "Visa Free" },
  { country: "Mauritius", code: "MU", type: "Visa Free" },
  { country: "Sri Lanka", code: "LK", type: "Visa Free" },
  { country: "Nepal", code: "NP", type: "Visa Free" },
  { country: "Maldives", code: "MV", type: "Visa on Arrival" },
  { country: "Seychelles", code: "SC", type: "Visa on Arrival" },
  { country: "Kenya", code: "KE", type: "e-Visa" },
];

function PassportMesh({
  isOpen,
  pageIndex,
  stamps,
  onClick,
}: {
  isOpen: boolean;
  pageIndex: number;
  stamps: Stamp[];
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coverRef = useRef<THREE.Group>(null);
  const pageRef = useRef<THREE.Group>(null);

  // Target angles
  const targetCoverAngle = isOpen ? -Math.PI + 0.15 : 0;
  const targetPageAngle = isOpen ? -(Math.PI / 2) * (pageIndex % 2 === 0 ? 0.3 : 1.7) : 0;

  useFrame(() => {
    if (groupRef.current) {
      // Gentle orientation tilt
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, isOpen ? 0.25 : 0.1, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, isOpen ? 0.05 : 0, 0.08);
    }
    if (coverRef.current) {
      // Open the front cover
      coverRef.current.rotation.y = THREE.MathUtils.lerp(coverRef.current.rotation.y, targetCoverAngle, 0.08);
    }
    if (pageRef.current) {
      // Turn the pages
      pageRef.current.rotation.y = THREE.MathUtils.lerp(pageRef.current.rotation.y, targetPageAngle, 0.08);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Back Cover (Stays stationary on the right side) */}
      <group position={[0.75, 0, 0]}>
        <RoundedBox args={[1.5, 2.1, 0.05]} radius={0.03} smoothness={4}>
          <meshStandardMaterial color="#0c1929" roughness={0.3} metalness={0.1} />
        </RoundedBox>
      </group>

      {/* Pages inside */}
      <group position={[0, 0, 0.02]} ref={pageRef}>
        <group position={[0.72, 0, 0]}>
          <RoundedBox args={[1.44, 2.02, 0.03]} radius={0.02} smoothness={3}>
            <meshStandardMaterial color="#fef9f3" roughness={0.9} />
          </RoundedBox>
          {/* Inner pages text/stamps simulation */}
          {isOpen && stamps.length > 0 && (
            <group position={[0, 0, 0.016]}>
              <StampText stamp={stamps[pageIndex % stamps.length]} />
            </group>
          )}
        </group>
      </group>

      {/* Front Cover (Rotates left to open) */}
      <group ref={coverRef}>
        <group position={[0.75, 0, 0.05]}>
          {/* Move pivot to left edge of cover */}
          <group position={[-0.75, 0, 0]}>
            <RoundedBox position={[0.75, 0, 0]} args={[1.5, 2.1, 0.05]} radius={0.03} smoothness={4}>
              <meshStandardMaterial color="#0c1929" roughness={0.3} metalness={0.1} />
            </RoundedBox>
            
            {/* Embossed Text */}
            {!isOpen && (
              <group position={[0.75, 0.4, 0.03]} scale={[0.1, 0.1, 0.1]}>
                {/* Visual mockup of passport lines */}
                <mesh>
                  <boxGeometry args={[4.5, 0.3, 0.1]} />
                  <meshStandardMaterial color="#f7931e" roughness={0.1} metalness={0.9} />
                </mesh>
                <mesh position={[0, -0.6, 0]}>
                  <boxGeometry args={[8.5, 0.6, 0.1]} />
                  <meshStandardMaterial color="#f7931e" roughness={0.1} metalness={0.9} />
                </mesh>
                <mesh position={[0, -2, 0]}>
                  <torusGeometry args={[0.5, 0.1, 8, 32]} />
                  <meshStandardMaterial color="#f7931e" roughness={0.1} metalness={0.9} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

// Simple label/stamp shape
function StampText({ stamp }: { stamp: Stamp }) {
  return (
    <mesh>
      <planeGeometry args={[1, 0.8]} />
      <meshBasicMaterial color="#e84393" transparent opacity={0.8} />
    </mesh>
  );
}

export function Passport3D() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [stamps, setStamps] = useState<Stamp[]>(FALLBACK_STAMPS);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check reduction
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || 
                      document.documentElement.getAttribute("data-motion") === "off";
    if (isReduced) {
      setVisible(false);
      return;
    }

    // Fetch live visa updates
    async function loadStamps() {
      try {
        const res = await fetch("/api/visa?segment=OUTBOUND&pageSize=20");
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const list: Stamp[] = json.data
            .filter((v: any) => !v.isVisaRequired || v.isVisaOnArrival || v.isEVisaAvailable)
            .map((v: any) => ({
              country: v.countryName,
              code: v.countryCode,
              type: !v.isVisaRequired ? "Visa Free" : v.isVisaOnArrival ? "Visa on Arrival" : "e-Visa",
            }));
          if (list.length > 0) {
            setStamps(list);
          }
        }
      } catch (e) {
        // Fallback silently
      }
    }
    loadStamps();
  }, []);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#ff6b35", "#f7931e", "#e84393"],
      });
    } else {
      // Turn page
      setPageIndex((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.7 },
        colors: ["#6c5ce7", "#e84393", "#fef9f3"],
      });
    }
  };

  const currentStamp = stamps[pageIndex % stamps.length];

  if (!visible) {
    // High contrast 2D skeuomorphic representation when animations are disabled
    return (
      <div className="card-modern p-8 max-w-md mx-auto text-center space-y-6 select-none bg-sunset-4/5 border border-sunset-4/15 shadow-md">
        <div className="w-20 h-28 bg-ink rounded-lg mx-auto flex flex-col justify-between p-3 text-cream border-2 border-sunset-2/40 shadow-lg">
          <div className="h-2 w-12 bg-sunset-2 rounded" />
          <div className="w-8 h-8 rounded-full border border-sunset-2 mx-auto" />
          <div className="h-2 w-8 bg-sunset-2 rounded mx-auto" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-heading-lg text-ink dark:text-cream">Your Passport Stamp Portal</h3>
          <p className="text-body-sm text-ink/75 dark:text-cream/75">
            Click standard Visa Maps below to check destination requirements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-cream dark:bg-ink p-6 rounded-3xl border border-sunset-1/10 shadow-lg">
      <div className="h-[360px] relative cursor-pointer select-none">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><CompassSpinner /></div>}>
          <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[2, 4, 3]} intensity={1.8} />
            <directionalLight position={[-2, -4, -1]} intensity={0.4} />
            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
              <group position={isOpen ? [-0.5, 0, 0] : [0, 0, 0]}>
                <PassportMesh
                  isOpen={isOpen}
                  pageIndex={pageIndex}
                  stamps={stamps}
                  onClick={handleClick}
                />
              </group>
            </Float>
          </Canvas>
        </Suspense>
      </div>

      <div className="text-center mt-4 space-y-2">
        <p className="text-sm font-extrabold uppercase tracking-widest text-sunset-1">
          {isOpen ? "Click Passport to turn pages" : "Click Passport to open"}
        </p>
        {isOpen && currentStamp && (
          <div className="inline-flex flex-col items-center p-3 px-6 bg-sunset-3/10 rounded-2xl border border-sunset-3/20 animate-scale-in">
            <span className="text-[10px] uppercase font-bold text-sunset-3 tracking-widest">Active Stamp</span>
            <span className="text-lg font-display font-black text-ink dark:text-cream">{currentStamp.country}</span>
            <span className="text-[11px] font-semibold text-sunset-2 uppercase mt-0.5">{currentStamp.type}</span>
          </div>
        )}
      </div>
    </div>
  );
}
