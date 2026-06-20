"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Individual cursor instance representation
interface PlaneInstance {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

const TRAIL_LENGTH = 8;

function CursorTrail() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouseRef = useRef(new THREE.Vector3(0, 0, 0));
  const instancesRef = useRef<PlaneInstance[]>([]);

  // Initialize instances
  useEffect(() => {
    instancesRef.current = Array.from({ length: TRAIL_LENGTH }, () => ({
      pos: new THREE.Vector3(0, 0, 0),
      target: new THREE.Vector3(0, 0, 0),
    }));

    const handleMouseMove = (e: MouseEvent) => {
      // Map mouse position to NDC (-1 to 1) coordinates
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Target position in 3D world space
      mouseRef.current.set(x * 1.5, y * 1.2, 0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!meshRef.current || instancesRef.current.length === 0) return;

    const dummy = new THREE.Object3D();
    const leader = mouseRef.current;

    instancesRef.current.forEach((inst, idx) => {
      // Lag follow behavior
      if (idx === 0) {
        inst.target.copy(leader);
      } else {
        inst.target.copy(instancesRef.current[idx - 1].pos);
      }

      // Spring interpolate
      inst.pos.lerp(inst.target, 0.18);

      // Set instance scale and transform
      dummy.position.copy(inst.pos);
      // Scale down along the trail length
      const scale = (TRAIL_LENGTH - idx) / TRAIL_LENGTH * 0.08;
      dummy.scale.set(scale, scale, scale);
      
      // Direct rotation toward destination
      if (idx > 0) {
        const prev = instancesRef.current[idx - 1].pos;
        dummy.lookAt(prev.x, prev.y, 0);
        // Offset rotation to point paper plane tip forward
        dummy.rotateX(Math.PI / 2);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(idx, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, TRAIL_LENGTH]}>
      {/* Tetrahedron geometry looks exactly like a low-poly folded paper plane! */}
      <coneGeometry args={[0.3, 0.9, 3]} />
      <meshBasicMaterial color="#ff6b35" opacity={0.65} transparent />
    </instancedMesh>
  );
}

export function PaperPlaneCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || 
                      document.documentElement.getAttribute("data-motion") === "off";

    setEnabled(!isTouch && !isReduced);

    const checkMotion = () => {
      const isOff = document.documentElement.getAttribute("data-motion") === "off";
      setEnabled(!isTouch && !isOff);
    };

    const observer = new MutationObserver(checkMotion);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

    return () => observer.disconnect();
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[999] select-none">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
          <ambientLight intensity={1} />
          <CursorTrail />
        </Canvas>
      </Suspense>
    </div>
  );
}
