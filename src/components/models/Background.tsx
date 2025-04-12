import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Background({
  isDarkMode,
  timeOfDay,
}: {
  isDarkMode: boolean;
  timeOfDay: number;
}) {
  const { scene } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  // 🌈 Dynamic background color
  const getBackgroundColor = () => {
    if (isDarkMode) {
      return timeOfDay >= 20 || timeOfDay <= 5 ? '#0a0a1a' : '#1a1a2e';
    }
    if (timeOfDay >= 20 || timeOfDay <= 5) return '#1a1a2e';
    if (timeOfDay >= 17) return '#2d3748';
    if (timeOfDay >= 7) return '#f0f0f0';
    return '#2d3748';
  };

  // 🌞 Sun position and visibility
  const isDaytime = timeOfDay >= 6 && timeOfDay < 18;
  const sunPosition = new THREE.Vector3(10, 10, -10);
  const moonPosition = new THREE.Vector3(-10, 10, 10);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    if (sphereRef.current) {
      sphereRef.current.rotation.x = elapsed * 0.05;
      sphereRef.current.rotation.y = elapsed * 0.08;
    }
    if (sunRef.current) {
      sunRef.current.visible = isDaytime;
      sunRef.current.position.y = Math.sin(elapsed * 0.1) * 15;
    }
    if (moonRef.current) {
      moonRef.current.visible = !isDaytime;
      moonRef.current.position.y = Math.cos(elapsed * 0.1) * 15;
    }
  });

  useEffect(() => {
    // 🌌 Sky Sphere
    const geometry = new THREE.SphereGeometry(40, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      side: THREE.BackSide,
      color: getBackgroundColor(),
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 0.1,
    });

    const sky = new THREE.Mesh(geometry, material);
    scene.add(sky);
    (sphereRef.current as THREE.Mesh | null) = sky;

    // 🌞 Sun
    const sunMat = new THREE.MeshStandardMaterial({ color: '#ffff66', emissive: '#ffff99' });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), sunMat);
    sun.position.copy(sunPosition);
    scene.add(sun);
    (sunRef.current as THREE.Mesh | null) = sun;

    // 🌙 Moon
    const moonMat = new THREE.MeshStandardMaterial({ color: '#ccccff', emissive: '#aaaaee' });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), moonMat);
    moon.position.copy(moonPosition);
    scene.add(moon);
    (moonRef.current as THREE.Mesh | null) = moon;

    return () => {
      scene.remove(sky, sun, moon);
      geometry.dispose();
      material.dispose();
      sun.geometry.dispose();
      sunMat.dispose();
      moon.geometry.dispose();
      moonMat.dispose();
    };
  }, [scene, isDarkMode, timeOfDay]);

  return null;
}
