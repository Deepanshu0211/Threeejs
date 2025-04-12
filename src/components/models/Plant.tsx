import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Plant() {
  const groupRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);
  
  // Gentle swaying animation
  useFrame((state) => {
    if (groupRef.current) {
      // Small rotation of the entire plant
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime / 2) * 0.05;
    }
    
    if (leavesRef.current) {
      // Additional subtle movement for leaves
      leavesRef.current.children.forEach((leaf, i) => {
        const offset = i * 0.2;
        leaf.rotation.x = Math.sin(state.clock.elapsedTime / 2 + offset) * 0.05;
        leaf.rotation.z = Math.cos(state.clock.elapsedTime / 3 + offset) * 0.05;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0.8, 0.1, 0.3]}>
      {/* Pot base */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#a0aec0" roughness={0.8} />
      </mesh>
      
      {/* Pot main */}
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 16]} />
        <meshStandardMaterial color="#718096" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Soil */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        <meshStandardMaterial color="#553c32" roughness={1} />
      </mesh>
      
      {/* Plant stem */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.01, 0.015, 0.3, 8]} />
        <meshStandardMaterial color="#2f855a" roughness={0.8} />
      </mesh>
      
      {/* Plant leaves group */}
      <group ref={leavesRef}>
        {/* Main leaves */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#48bb78" 
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Additional leaves */}
        {Array(5).fill(null).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const x = Math.cos(angle) * 0.07;
          const z = Math.sin(angle) * 0.07;
          const rotationY = angle;
          const heightOffset = 0.25 + Math.random() * 0.2;
          const scale = 0.7 + Math.random() * 0.4;
          
          return (
            <mesh 
              key={i}
              position={[x, heightOffset, z]}
              rotation={[Math.PI / 8, rotationY, Math.PI / 8]}
              scale={[scale, scale, scale]}
              castShadow
            >
              <coneGeometry args={[0.04, 0.15, 8]} />
              <meshStandardMaterial 
                color={new THREE.Color(0.2 + Math.random() * 0.2, 0.7 + Math.random() * 0.2, 0.3 + Math.random() * 0.2)} 
                roughness={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
        
        {/* Small randomly placed leaf buds */}
        {Array(8).fill(null).map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.03 + Math.random() * 0.08;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const heightOffset = 0.3 + Math.random() * 0.15;
          const scale = 0.3 + Math.random() * 0.3;
          
          return (
            <mesh 
              key={`bud-${i}`}
              position={[x, heightOffset, z]}
              scale={[scale, scale, scale]}
              castShadow
            >
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial 
                color={new THREE.Color(0.2 + Math.random() * 0.2, 0.7 + Math.random() * 0.2, 0.3 + Math.random() * 0.2)} 
                roughness={0.9}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}