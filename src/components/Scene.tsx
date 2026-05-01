import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, Sphere, MeshDistortMaterial, Cloud } from '@react-three/drei';
import * as THREE from 'three';

// Detect mobile for performance scaling
const isMobile = typeof window !== 'undefined' && (
  window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
);

// Optimized Balloon component
function Balloon({ position, color, size = 1, speed = 1 }: { position: [number, number, number], color: string, size?: number, speed?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const ropeGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 8; i++) {
      points.push(new THREE.Vector3(0, -i * 0.25 * size, Math.sin(i * 0.5) * 0.08));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 8, 0.015, 4, false);
  }, [size]);

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <group ref={groupRef} position={position}>
        <Sphere args={[size, isMobile ? 16 : 24, isMobile ? 16 : 24]} position={[0, size * 0.3, 0]}>
          <MeshDistortMaterial 
            color={color} 
            distort={0.12} 
            speed={1.5} 
            roughness={0.15} 
            metalness={0.2}
            transparent
            opacity={0.6}
          />
        </Sphere>
        <mesh position={[0, -size * 0.1, 0]}>
          <coneGeometry args={[size * 0.12, size * 0.25, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh geometry={ropeGeometry}>
          <meshStandardMaterial color="#d4d4d4" />
        </mesh>
      </group>
    </Float>
  );
}

// Balloon cluster — fewer on mobile
function BalloonCluster() {
  const colors = ['#93c5fd', '#bfdbfe', '#dbeafe', '#ffffff', '#e0f2fe'];
  
  if (isMobile) {
    return (
      <>
        <Balloon position={[-4, 2, -8]} color={colors[0]} size={1.1} speed={1.2} />
        <Balloon position={[4, 1, -9]} color={colors[2]} size={1.1} speed={1.0} />
        <Balloon position={[0, 4, -12]} color={colors[1]} size={1.2} speed={0.7} />
      </>
    );
  }

  return (
    <>
      <Balloon position={[-4.5, 2.5, -7]} color={colors[0]} size={1.1} speed={1.3} />
      <Balloon position={[-5.5, 0, -9]} color={colors[1]} size={0.9} speed={1.8} />
      <Balloon position={[4.5, 1.5, -8]} color={colors[2]} size={1.2} speed={1.1} />
      <Balloon position={[5.5, -0.5, -10]} color={colors[4]} size={0.85} speed={1.9} />
      <Balloon position={[-1.5, 4, -12]} color={colors[1]} size={1.3} speed={0.7} />
      <Balloon position={[2, -2, -11]} color={colors[0]} size={1.1} speed={0.9} />
    </>
  );
}

// Clouds — skip on mobile
function Clouds() {
  if (isMobile) return null;
  
  return (
    <>
      <Cloud position={[-7, 4, -14]} speed={0.15} opacity={0.15} scale={[8, 1.5, 1.5]} segments={15} color="#ffffff" />
      <Cloud position={[7, 2, -16]} speed={0.1} opacity={0.1} scale={[10, 1.5, 1.5]} segments={15} color="#ffffff" />
    </>
  );
}

// Optimized confetti — reuse objects outside useFrame
function Confetti() {
  const count = isMobile ? 15 : 30;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const { particles, colors } = useMemo(() => {
    const particleData = [];
    const colorData = [];
    const colorOptions = ['#93c5fd', '#bfdbfe', '#fcd34d', '#f9a8d4', '#a5f3fc'];
    
    for (let i = 0; i < count; i++) {
      particleData.push({
        position: [
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 18,
          -4 - Math.random() * 12
        ],
        rotation: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.08
      });
      colorData.push(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    }
    return { particles: particleData, colors: colorData };
  }, [count]);

  // Reuse objects to avoid GC pressure
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const scale = useMemo(() => new THREE.Vector3(0.08, 0.08, 0.01), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    particles.forEach((particle, i) => {
      position.set(
        particle.position[0] + Math.sin(time * particle.speed + i) * 0.4,
        particle.position[1] + Math.sin(time * particle.speed * 0.5 + i) * 0.25,
        particle.position[2]
      );
      euler.set(
        time * particle.rotationSpeed,
        time * particle.rotationSpeed * 1.3,
        particle.rotation
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
      <meshStandardMaterial transparent opacity={0.5} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

// Floating cross
function FloatingCross() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 3.5, -9]} scale={0.45}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.25, 2.2, 0.12]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.5} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.3, 0.25, 0.12]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.5} roughness={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

// Floating hearts — fewer on mobile
function FloatingHearts() {
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
    shape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.2, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2
  }), []);

  const positions: [number, number, number][] = isMobile
    ? [[-5, 1, -6], [5, -0.5, -7]]
    : [[-6, 1.5, -5], [6, -0.5, -6], [3.5, 4, -8]];

  return (
    <>
      {positions.map((pos, i) => (
        <Float key={i} speed={0.8 + i * 0.2} rotationIntensity={0.4} floatIntensity={1.2}>
          <mesh position={pos} rotation={[0, 0, Math.PI]} scale={0.25 + i * 0.03}>
            <extrudeGeometry args={[heartShape, extrudeSettings]} />
            <meshStandardMaterial 
              color="#f9a8d4" 
              metalness={0.25} 
              roughness={0.45} 
              transparent 
              opacity={0.65} 
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.7} color="#ffffff" />
          <directionalLight position={[8, 8, 5]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-8, 4, 4]} intensity={0.6} color="#93c5fd" />
          {!isMobile && <pointLight position={[8, -4, 4]} intensity={0.4} color="#fcd34d" />}
          
          {/* 3D Elements */}
          <BalloonCluster />
          <Clouds />
          <Confetti />
          <FloatingCross />
          <FloatingHearts />
          
          {/* Sparkles */}
          <Sparkles 
            count={isMobile ? 30 : 60} 
            scale={22} 
            size={2} 
            speed={0.25} 
            opacity={0.3} 
            color="#93c5fd" 
          />
          {!isMobile && (
            <Sparkles 
              count={20} 
              scale={18} 
              size={3} 
              speed={0.15} 
              opacity={0.25} 
              color="#fcd34d" 
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
