'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ambient "draped textile" hero. A subdivided plane whose vertices are
 * displaced by layered sine waves each frame — reads as soft, physical cloth
 * catching light, not a floating blob. Lit with simple lights (no network
 * HDR) so it never blocks paint. Reacts subtly to the cursor via parallax.
 */
function Drape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(7, 4.4, 80, 60);
    return geo;
  }, []);

  const base = useMemo(() => {
    return Float32Array.from(
      (geometry.attributes.position as THREE.BufferAttribute).array
    );
  }, [geometry]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const z =
        Math.sin(x * 0.9 + t * 0.6) * 0.28 +
        Math.cos(y * 1.3 + t * 0.45) * 0.22 +
        Math.sin((x + y) * 0.6 + t * 0.3) * 0.16;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    if (meshRef.current) {
      // gentle pointer parallax
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointer.x * 0.18,
        0.04
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -0.35 + pointer.y * 0.12,
        0.04
      );
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-0.35, 0, 0]}>
      <meshStandardMaterial
        color="#6e2b2b"
        roughness={0.62}
        metalness={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function FabricScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 38 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#e9e6de']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 5]} intensity={1.6} color="#fff6ea" />
      <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#36433b" />
      <pointLight position={[0, 2, 4]} intensity={0.6} color="#e9e6de" />
      <Drape />
    </Canvas>
  );
}
