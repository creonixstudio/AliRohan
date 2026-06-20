'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';

/**
 * Lightweight interactive 3D — a faceted garment-form proxy with a fabric-like
 * material. Orbit is limited so it never disorients. Kept primitive-based so
 * it stays mobile-safe; swap in <useGLTF> with a draco .glb per product later.
 */
function GarmentProxy({ colorHex }: { colorHex: string }) {
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh castShadow rotation={[0.2, 0.4, 0]}>
        <torusKnotGeometry args={[0.85, 0.34, 180, 32]} />
        <meshStandardMaterial color={colorHex} roughness={0.55} metalness={0.1} />
      </mesh>
    </Float>
  );
}

export default function ViewerCanvas({ colorHex }: { colorHex: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} dpr={[1, 1.8]} shadows>
      <color attach="background" args={['#d4cec3']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow color="#fff6ea" />
      <directionalLight position={[-4, -1, -3]} intensity={0.4} color="#36433b" />
      <Suspense fallback={null}>
        <GarmentProxy colorHex={colorHex} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.35} blur={2.4} far={4} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
        autoRotate
        autoRotateSpeed={1.1}
      />
    </Canvas>
  );
}
