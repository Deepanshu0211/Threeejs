import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Coffee } from 'lucide-react';

export default function CoffeeMug() {
  const mugRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (steamRef.current) {
      const particles = steamRef.current.geometry.attributes.position;
      for (let i = 0; i < particles.count; i++) {
        const y = particles.getY(i);
        particles.setY(i, y + (Math.random() * 0.01));
        if (y > 0.5) particles.setY(i, 0);
        particles.setX(i, particles.getX(i) + Math.sin(state.clock.elapsedTime + i) * 0.0005);
      }
      particles.needsUpdate = true;
    }
  });

  return (
    <group position={[-0.7, 0.15, 0.3]}>
      <mesh ref={mugRef}>
        <cylinderGeometry args={[0.08, 0.06, 0.15]} />
        <meshStandardMaterial 
          color="#fff"
          metalness={0.3}
          roughness={0.7}
        />
        
        {/* Mug Handle */}
        <mesh position={[0.09, 0, 0]}>
          <torusGeometry args={[0.03, 0.01, 16, 32, Math.PI * 1.5]} />
          <meshStandardMaterial 
            color="#fff"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </mesh>

      {/* Steam Particles */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={20}
            array={new Float32Array(20 * 3).map((_, i) => {
              if (i % 3 === 0) return (Math.random() - 0.5) * 0.05;
              if (i % 3 === 1) return Math.random() * 0.2;
              return (Math.random() - 0.5) * 0.05;
            })}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          color="#ffffff"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </points>

      <Html position={[0, 0.3, 0]} center>
        <a
          href="https://www.buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-100 transition-opacity duration-300"
        >
          <Coffee className="w-5 h-5 text-white" />
        </a>
      </Html>
    </group>
  );
}