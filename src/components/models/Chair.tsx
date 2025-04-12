import { useTexture } from '@react-three/drei';

export default function Chair() {
  const leatherTexture = useTexture('https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=512');
  
  return (
    <group position={[0, -0.5, 0.5]}>
      {/* Chair Base with Wheels */}
      <group position={[0, 0.1, 0]}>
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
            <mesh position={[0.25, 0, 0]} castShadow>
              <sphereGeometry args={[0.05]} />
              <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Base Cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.05, 32]} />
        <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Hydraulic Lift */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Seat */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial map={leatherTexture} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Backrest */}
      <group position={[0, 0.8, -0.2]}>
        {/* Main Back */}
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.6, 0.05]} />
          <meshStandardMaterial map={leatherTexture} metalness={0.1} roughness={0.8} />
        </mesh>
        
        {/* Side Supports */}
        {[-0.2, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.02]} castShadow>
            <boxGeometry args={[0.02, 0.6, 0.08]} />
            <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Armrests */}
      {[-0.25, 0.25].map((x, i) => (
        <group key={i} position={[x, 0.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.05, 0.1, 0.3]} />
            <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.03, 0.2]} />
            <meshStandardMaterial map={leatherTexture} metalness={0.1} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}