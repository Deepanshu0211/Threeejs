import React from 'react';

export default function MinimalistDesk() {
  return (
    <group>
      {/* Desktop Surface */}
      <mesh receiveShadow castShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[2, 0.05, 1]} />
        <meshStandardMaterial
          color="#303040"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Legs */}
      {[[-0.9, -0.4], [0.9, -0.4]].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0]} castShadow>
          <boxGeometry args={[0.1, 1.5, 0.8]} />
          <meshStandardMaterial
            color="#252535"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}