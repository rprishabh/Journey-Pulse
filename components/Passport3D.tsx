"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import confetti from "canvas-confetti";
import { CompassSpinner } from "./CompassSpinner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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

const getFlagEmoji = (code: string) => {
  const flags: Record<string, string> = {
    TH: "🇹🇭", THA: "🇹🇭",
    MU: "🇲🇺", MUS: "🇲🇺",
    LK: "🇱🇰", LKA: "🇱🇰",
    NP: "🇳🇵", NPL: "🇳🇵",
    MV: "🇲🇻", MDV: "🇲🇻",
    SC: "🇸🇨", SYC: "🇸🇨",
    KE: "🇰🇪", KEN: "🇰🇪",
    MY: "🇲🇾", MYS: "🇲🇾",
    AU: "🇦🇺", AUS: "🇦🇺",
  };
  return flags[code.toUpperCase()] || "🌐";
};

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
        <RoundedBox args={[1.5, 2.1, 0.02]} radius={0.03} smoothness={4}>
          <meshStandardMaterial color="#0c1929" roughness={0.3} metalness={0.1} />
        </RoundedBox>
      </group>

      {/* Pages inside (Thin page layout) */}
      <group position={[0, 0, 0.01]} ref={pageRef}>
        <group position={[0.72, 0, 0]}>
          <RoundedBox args={[1.44, 2.02, 0.008]} radius={0.01} smoothness={3}>
            <meshStandardMaterial color="#fef9f3" roughness={0.9} />
          </RoundedBox>
          {/* Inner pages text/stamps simulation */}
          {isOpen && stamps.length > 0 && (
            <group position={[0, 0, 0.005]}>
              <StampText stamp={stamps[pageIndex % stamps.length]} />
            </group>
          )}
        </group>
      </group>

      {/* Front Cover (Rotates left to open) */}
      <group ref={coverRef}>
        <group position={[0.75, 0, 0.02]}>
          {/* Move pivot to left edge of cover */}
          <group position={[-0.75, 0, 0]}>
            <RoundedBox position={[0.75, 0, 0]} args={[1.5, 2.1, 0.02]} radius={0.03} smoothness={4}>
              <meshStandardMaterial color="#0c1929" roughness={0.3} metalness={0.1} />
            </RoundedBox>
            
            {/* Embossed Text */}
            {!isOpen && (
              <group position={[0.75, 0.4, 0.015]} scale={[0.1, 0.1, 0.1]}>
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

// Dynamic label/stamp shape using high-resolution CanvasTexture
function StampText({ stamp }: { stamp: Stamp }) {
  const angle = React.useMemo(() => {
    // Generate a consistent organic tilt for each country stamp based on its characters
    let hash = 0;
    for (let i = 0; i < stamp.country.length; i++) {
      hash = stamp.country.charCodeAt(i) + ((hash << 5) - hash);
    }
    const degrees = (hash % 16) - 8; // Consistent tilt between -8 and +8 degrees
    return (degrees * Math.PI) / 180;
  }, [stamp]);

  const texture = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 1024, 768);

    // Dynamic harmonised ink colors matching passport power stamp theme
    const inkColors = ["#e84393", "#6c5ce7", "#ff6b35", "#00b894", "#0984e3"];
    const colorIndex = (stamp.country.length + stamp.type.length) % inkColors.length;
    const inkColor = inkColors[colorIndex];

    ctx.strokeStyle = inkColor;
    ctx.fillStyle = inkColor;
    ctx.lineWidth = 14;

    const stampType = stamp.country.length % 3;
    if (stampType === 0) {
      // Circular Double-Border Custom Stamp
      ctx.beginPath();
      ctx.arc(512, 384, 250, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(512, 384, 222, 0, Math.PI * 2);
      ctx.stroke();
    } else if (stampType === 1) {
      // Octagon Custom Stamp
      ctx.beginPath();
      const r = 260;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + Math.PI / 8;
        const x = 512 + Math.cos(a) * r;
        const y = 384 + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    } else {
      // Rounded Rectangle Custom Stamp
      ctx.beginPath();
      ctx.roundRect(200, 120, 624, 528, 60);
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(226, 146, 572, 476, 40);
      ctx.stroke();
    }

    // Centered metadata styling
    ctx.font = "bold 64px 'Courier New', Courier, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stamp.country.toUpperCase(), 512, 240);

    ctx.font = "bold 44px 'Courier New', Courier, monospace";
    ctx.fillText(stamp.type.toUpperCase(), 512, 520);

    ctx.font = "bold 52px 'Courier New', Courier, monospace";
    ctx.fillText("21 JUN 2026", 512, 380);

    // Weathering/noise effect (realistic vintage ink texture)
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,1)";
    for (let i = 0; i < 180; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 768;
      const rSize = 1.5 + Math.random() * 4;
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [stamp]);

  if (!texture) return null;

  return (
    <mesh rotation={[0, 0, angle]}>
      <planeGeometry args={[1.15, 0.95]} />
      <meshBasicMaterial map={texture} transparent={true} />
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

      <div className="text-center mt-4 space-y-4">
        <p className="text-sm font-extrabold uppercase tracking-widest text-sunset-1">
          {isOpen ? "Click Passport to turn pages" : "Click Passport to open"}
        </p>
        
        {isOpen && currentStamp && (
          <div className="bg-sunset-4/5 border border-sunset-4/15 rounded-3xl p-5 mt-4 text-left space-y-3 shadow-lg animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl" role="img" aria-label={currentStamp.country}>
                  {getFlagEmoji(currentStamp.code)}
                </span>
                <div>
                  <h4 className="font-display font-black text-sm text-ink dark:text-cream leading-tight">
                    {currentStamp.country} Entry Stamp Info
                  </h4>
                  <span className="text-[10px] uppercase font-extrabold text-sunset-3 tracking-widest mt-0.5 block">
                    Status: {currentStamp.type}
                  </span>
                </div>
              </div>
              <span className="badge bg-sunset-1/10 text-sunset-1 border border-sunset-1/20 text-[9px] font-black px-2.5 py-0.5 uppercase tracking-wider">
                Active Stamp
              </span>
            </div>
            
            <p className="text-xs text-ink/75 dark:text-cream/75 leading-relaxed">
              For Indian passport holders, {currentStamp.country} provides {currentStamp.type.toLowerCase()} access. Ensure your passport has at least 6 months validity from the planned entry date.
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[10px] font-bold text-ink/65 dark:text-cream/65">
                📅 Stay Allowance: <span className="font-extrabold text-sunset-2">30-90 Days</span>
              </span>
              <Link
                href={`/visa-hub?q=${encodeURIComponent(currentStamp.country)}`}
                className="text-[10px] font-extrabold text-sunset-1 hover:underline inline-flex items-center gap-1 group"
              >
                <span>Read Full Visa Policy</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
