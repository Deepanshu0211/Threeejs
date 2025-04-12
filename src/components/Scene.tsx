import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Cloud, Float } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import Desk from './models/Desk';
import Laptop from './models/Laptop';
import Plant from './models/Plant';
import CoffeeMug from './models/CoffeeMug';
import Chair from './models/Chair';
import PhotoFrame from './models/PhotoFrame';
import Background from './models/Background';
import PortfolioContent from './PortfolioContent';
import RoomLighting from './effects/RoomLighting';
import useStore from '../store';

export default function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { isLaptopOpen, isDarkMode, setLaptopOpen, initialCameraAnimation, setInitialCameraAnimation } = useStore();
  const { camera } = useThree();

  useEffect(() => {
    if (initialCameraAnimation && camera) {
      gsap.timeline()
        .set(camera.position, { x: -15, y: 10, z: -15 })
        .to(camera.position, {
          x: -8,
          y: 5,
          z: -8,
          duration: 3,
          ease: "power2.inOut"
        })
        .to(camera.position, {
          x: 0,
          y: 2,
          z: 5,
          duration: 2,
          ease: "power2.inOut"
        })
        .call(() => setInitialCameraAnimation(false));
    }
  }, [initialCameraAnimation, camera]);

  useFrame((state) => {
    if (groupRef.current && !isLaptopOpen && !initialCameraAnimation) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.5) * 0.15,
        0.05
      );
    }
  });

  const handleSceneClick = (event: THREE.Event) => {
    if (isLaptopOpen) {
      const clickedObject = (event as unknown as THREE.Event & { object: THREE.Object3D }).object;
      const isHologramClick = clickedObject.name === 'hologram' || 
                            clickedObject.parent?.name === 'hologram' ||
                            clickedObject.name === 'laptop' ||
                            clickedObject.parent?.name === 'laptop';
      
      if (!isHologramClick) {
        (event as unknown as React.MouseEvent).stopPropagation();
        gsap.to(camera.position, {
          x: 0,
          y: 2,
          z: 5,
          duration: 1.5,
          ease: "power3.inOut"
        });
        gsap.to(camera.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.inOut"
        });
        setLaptopOpen(false);
      }
    }
  };

  return (
    <group onClick={handleSceneClick}>
      <Background isDarkMode={isDarkMode} timeOfDay={14} />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={15000} 
        factor={4} 
        saturation={0.8} 
        fade 
        speed={1}
      />
      
      <group position={[0, 5, -15]}>
        {[...Array(5)].map((_, i) => (
          <Float 
            key={i}
            speed={0.5 + Math.random() * 0.5} 
            rotationIntensity={0.2 + Math.random() * 0.3} 
            floatIntensity={0.5 + Math.random() * 0.3}
          >
            <Cloud 
              position={[
                (Math.random() - 0.5) * 20,
                Math.random() * 5,
                -5 - Math.random() * 10
              ]} 
              speed={0.1 + Math.random() * 0.2}
              opacity={0.3}
              scale={[8 + Math.random() * 4, 1.5, 1.5]}
              segments={20}
            />
          </Float>
        ))}
      </group>
      
      <fog attach="fog" args={[isDarkMode ? '#1a1a2e' : '#f0f0f0', 8, 20]} />
      
      <group ref={groupRef}>
        <RoomLighting isDarkMode={isDarkMode} intensity={0.8} />
        
        <hemisphereLight
          position={[0, 20, 0]}
          intensity={0.1}
          groundColor={isDarkMode ? "#1a1a2e" : "#f0f0f0"}
        />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <PhotoFrame 
            position={[-1.5, 1.5, -0.5]} 
            rotation={[0, Math.PI / 6, 0]} 
            imageUrl="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
          />
        </Float>
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
          <PhotoFrame 
            position={[1.5, 1.8, -0.8]} 
            rotation={[0, -Math.PI / 8, 0]} 
            imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
          />
        </Float>
        
        <group position={[0, 0, 0]}>
          <Desk />
          <group position={[0, 0, 0.8]}>
            <Chair />
          </group>
          <group name="laptop">
            <Laptop />
          </group>
          <Plant />
          <CoffeeMug />
        </group>
      </group>

      {isLaptopOpen && (
        <group name="hologram">
          <PortfolioContent />
          <pointLight
            position={[0, 2, 0]}
            intensity={0.15}
            color="#6366f1"
            distance={4}
            decay={2.5}
            power={2}
          />
        </group>
      )}
    </group>
  );
}