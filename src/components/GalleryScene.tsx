import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && (
  window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
);

// Soft floating bubbles
function Bubbles() {
  const count = isMobile ? 4 : 8;
  const colors = ['#93c5fd', '#bfdbfe', '#dbeafe', '#e0f2fe', '#a5f3fc'];

  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        -3 - Math.random() * 6
      ] as [number, number, number],
      size: 0.3 + Math.random() * 0.5,
      color: colors[i % colors.length],
      speed: 0.5 + Math.random() * 1.0
    }));
  }, [count]);

  return (
    <>
      {bubbles.map((bubble, i) => (
        <Float key={i} speed={bubble.speed} rotationIntensity={0.2} floatIntensity={1.5}>
          <Sphere args={[bubble.size, isMobile ? 12 : 16, isMobile ? 12 : 16]} position={bubble.position}>
            <MeshDistortMaterial
              color={bubble.color}
              distort={0.15}
              speed={1.2}
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.35}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

// Floating camera icon made of simple geometry
function FloatingCamera() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={groupRef} position={[0, 1.5, -5]} scale={0.5}>
        {/* Camera body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 1.1, 0.6]} />
          <meshStandardMaterial color="#93c5fd" metalness={0.3} roughness={0.4} transparent opacity={0.5} />
        </mesh>
        {/* Lens */}
        <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.2, 16]} />
          <meshStandardMaterial color="#60a5fa" metalness={0.5} roughness={0.2} transparent opacity={0.6} />
        </mesh>
        {/* Flash */}
        <mesh position={[0.5, 0.6, 0]}>
          <boxGeometry args={[0.35, 0.2, 0.3]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.4} roughness={0.3} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

// Soft confetti particles
function SoftConfetti() {
  const count = isMobile ? 12 : 25;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { particles, colors } = useMemo(() => {
    const particleData = [];
    const colorData = [];
    const colorOptions = ['#93c5fd', '#bfdbfe', '#fcd34d', '#f9a8d4', '#a5f3fc'];

    for (let i = 0; i < count; i++) {
      particleData.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 14,
          -2 - Math.random() * 8
        ],
        speed: 0.1 + Math.random() * 0.3,
        rotationSpeed: (Math.random() - 0.5) * 0.05
      });
      colorData.push(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    }
    return { particles: particleData, colors: colorData };
  }, [count]);

  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const scale = useMemo(() => new THREE.Vector3(0.06, 0.06, 0.01), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      position.set(
        particle.position[0] + Math.sin(time * particle.speed + i) * 0.3,
        particle.position[1] + Math.sin(time * particle.speed * 0.4 + i) * 0.2,
        particle.position[2]
      );
      euler.set(
        time * particle.rotationSpeed,
        time * particle.rotationSpeed * 1.2,
        i * 0.5
      );
      quaternion.setFromEuler(euler);
      matrix.compose(position, quaternion, scale);
      meshRef.current!.setMatrixAt(i, matrix);
      meshRef.current!.setColorAt(i, colorObj.set(colors[i]));
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial transparent opacity={0.4} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export default function GalleryScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-5, 3, 3]} intensity={0.4} color="#93c5fd" />

          <Bubbles />
          <FloatingCamera />
          <SoftConfetti />

          <Sparkles
            count={isMobile ? 20 : 40}
            scale={16}
            size={1.5}
            speed={0.2}
            opacity={0.25}
            color="#93c5fd"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
