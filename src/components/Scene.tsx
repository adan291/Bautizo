import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function Balloons() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[-4, 2, -5]}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial color="#bae6fd" attach="material" distort={0.2} speed={2} roughness={0} metalness={0.1} />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2} position={[5, -2, -8]}>
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial color="#fdfbf7" attach="material" distort={0.3} speed={1.5} roughness={0.1} metalness={0.1} />
        </Sphere>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5} position={[2, 4, -6]}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial color="#e0f2fe" attach="material" distort={0.2} speed={3} roughness={0.2} metalness={0.1} />
        </Sphere>
      </Float>
      
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={2.5} position={[-6, -3, -7]}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial color="#bfdbfe" attach="material" distort={0.4} speed={2} roughness={0} metalness={0.2} />
        </Sphere>
      </Float>
    </>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-soft-light">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#e0f2fe" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#bfdbfe" />
        
        <Balloons />
        
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />
        <Sparkles count={150} scale={20} size={4} speed={0.4} opacity={0.5} color="#93c5fd" />
      </Canvas>
    </div>
  );
}
