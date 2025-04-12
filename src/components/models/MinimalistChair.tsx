import React from 'react';

export default function MinimalistChair() {
  return (
    <group position={[0, 0, 1]}>
      {/* Seat */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial
          color="#303040"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Backrest */}
      <mesh castShadow position={[0, 0.9, -0.22]}>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial
          color="#303040"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Base */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial
          color="#252535"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Base Platform */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
        <meshStandardMaterial
          color="#252535"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}