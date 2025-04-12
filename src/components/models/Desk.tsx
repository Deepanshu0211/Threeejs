import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Desk() {
  const woodTexture = useTexture('https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=512');
  
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(2, 1);
  
  return (
    <group>
      {/* Main Desktop */}
      <mesh receiveShadow position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial 
          map={woodTexture}
          metalness={0.2}
          roughness={0.8}
          envMapIntensity={1}
        />
      </mesh>

      {/* Desk Legs */}
      {[[-0.9, -0.4, -0.4] as [number, number, number], [0.9, -0.4, -0.4] as [number, number, number], [-0.9, -0.4, 0.4] as [number, number, number], [0.9, -0.4, 0.4] as [number, number, number]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.2} />
        </mesh>
      ))}

      {/* Desk Edge Trim */}
      <mesh position={[0, 0.05, 0.5]} castShadow>
        <boxGeometry args={[2, 0.02, 0.02]} />
        <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}