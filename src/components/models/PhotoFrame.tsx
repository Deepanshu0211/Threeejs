import React, { useState } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface PhotoFrameProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  imageUrl: string;
}

export default function PhotoFrame({ position, rotation = [0, 0, 0], imageUrl }: PhotoFrameProps) {
  const [hasError, setHasError] = useState(false);
  
  // Create a fallback texture for error cases
  const fallbackTexture = new THREE.TextureLoader().load(
    'https://images.unsplash.com/photo-1533709752211-118fcaf03312?auto=format&fit=crop&w=800&q=80',
    undefined,
    undefined,
    (error) => {
      console.error('Error loading fallback texture:', error);
    }
  );
  
  // Handle texture loading errors
  const handleError = () => {
    console.error('Error loading texture');
    setHasError(true);
  };

  // Load the primary texture
  const texture = useTexture(imageUrl);
  
  const activeTexture = hasError ? fallbackTexture : texture;
  
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
        <meshStandardMaterial color="#1a202c" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Photo */}
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[0.75, 0.55]} />
        <meshBasicMaterial map={activeTexture} />
      </mesh>

      {/* Frame Border */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.82, 0.62, 0.01]} />
        <meshStandardMaterial color="#4a5568" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Subtle Glow */}
      <pointLight position={[0, 0, 0.2]} intensity={0.1} distance={1} color="#ffffff" />
    </group>
  );
}