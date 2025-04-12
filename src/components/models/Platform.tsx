import * as THREE from 'three';

export default function Platform() {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Main Platform */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 32]} />
        <meshStandardMaterial
          color="#202030"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Edge Glow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.9, 3, 32]} />
        <meshBasicMaterial
          color="#404060"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}