import { useRef, useEffect, useMemo, useState } from 'react';
import { useSpring, a } from '@react-spring/three';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import useStore from '../../store';
import * as THREE from 'three';

export default function Laptop() {
  const baseRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Mesh>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const { isLaptopOpen, setLaptopOpen } = useStore();
  const { camera, pointer } = useThree();
  const [hologramVisible, setHologramVisible] = useState(false);

  // 🎨 Create screen gradient texture
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(0.5, '#818cf8');
      gradient.addColorStop(1, '#a5b4fc');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 🎨 Create hologram texture
  const hologramTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Create grid pattern
      ctx.fillStyle = '#a5b4fc20';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#a5b4fc80';
      ctx.lineWidth = 1;
      
      // Draw horizontal lines
      for (let i = 0; i < canvas.height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      // Draw vertical lines
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 🌸 Spring animation for lid rotation
  const spring = useSpring({
    rotation: isLaptopOpen ? [-Math.PI / 2.2, 0, 0] : [0, 0, 0],
    config: { tension: 180, friction: 15 },
  });

  // 🌸 Spring animation for hologram
  const hologramSpring = useSpring({
    scale: hologramVisible ? [1, 1, 1] : [0.1, 0.1, 0.1],
    opacity: hologramVisible ? 1 : 0,
    config: { tension: 100, friction: 10 },
  });

  // 🎥 Animate camera when opened
  const moveCamera = () => {
    if (!baseRef.current) return;
    const targetPos = new THREE.Vector3();
    baseRef.current.getWorldPosition(targetPos);
    const cameraTarget = targetPos.clone().add(new THREE.Vector3(0, 2.5, 4));

    gsap.timeline()
      .to(camera.position, {
        x: cameraTarget.x,
        y: cameraTarget.y,
        z: cameraTarget.z,
        duration: 2,
        ease: 'power3.inOut',
      })
      .to(camera.rotation, {
        x: -0.3,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'power2.out',
      }, '-=0.5');
  };

  useEffect(() => {
    if (isLaptopOpen) {
      moveCamera();

      setTimeout(() => {
        if (lidRef.current?.material) {
          gsap.to((lidRef.current.material as THREE.MeshStandardMaterial), {
            emissiveIntensity: 1,
            duration: 1,
            ease: 'power2.out',
          });
        }
        
        // Show hologram with delay after laptop opens
        setTimeout(() => {
          setHologramVisible(true);
        }, 800);
      }, 400); // Slight boot-up delay
    } else {
      setHologramVisible(false);
    }
  }, [isLaptopOpen, camera]);

  // 👀 Move pointer smoothly to laptop base when closed
  useFrame((state, delta) => {
    if (!isLaptopOpen && baseRef.current) {
      const vector = new THREE.Vector3();
      baseRef.current.getWorldPosition(vector);
      vector.project(camera);
      const x = (vector.x + 1) * window.innerWidth / 2;
      const y = (-vector.y + 1) * window.innerHeight / 2;
      gsap.to(pointer, {
        x: (x / window.innerWidth) * 2 - 1,
        y: -(y / window.innerHeight) * 2 + 1,
        duration: 1,
        ease: 'power2.out',
      });
    }

    // Rotate hologram slowly
    if (hologramRef.current && hologramVisible) {
      hologramRef.current.rotation.y += delta * 0.5;
    }
  });

  // 🖱️ Click interaction
  const handleClick = (e: THREE.Event) => {
    (e as unknown as MouseEvent).stopPropagation();

    if (!baseRef.current) return;

    gsap.to(baseRef.current.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 0.15,
      ease: 'back.out(2)',
      yoyo: true,
      repeat: 1,
    });

    setLaptopOpen(!isLaptopOpen);
  };

  return (
    <group position={[0, 0.1, 0]} ref={baseRef} onClick={handleClick}>
      {/* 🖤 Laptop Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.02, 0.5]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.8}
          roughness={0.2}
          emissive="#6366f1"
          emissiveIntensity={0}
        />
      </mesh>

      {/* 💜 Laptop Lid + Screen */}
      <a.mesh
        ref={lidRef}
        position={[0, 0.25, -0.25]}
        rotation={spring.rotation as unknown as [number, number, number]}
        castShadow
      >
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.75, 0.45]} />
          <meshStandardMaterial
            map={screenTexture}
            metalness={0.2}
            roughness={0.8}
            emissive="#6366f1"
            emissiveIntensity={isLaptopOpen ? 0.8 : 0}
          />
        </mesh>
      </a.mesh>

      {/* 🔦 Light when open */}
      {isLaptopOpen && (
        <>
          <pointLight position={[0, 0.1, 0]} intensity={1} distance={2} color="#6366f1" />
          <pointLight position={[0, 0.05, 0.2]} intensity={0.8} distance={1.5} color="#818cf8" />
        </>
      )}

      {/* 🌟 Hologram */}
      {isLaptopOpen && (
        <a.group 
          ref={hologramRef}
          position={[0, 0.5, 0]} 
          scale={hologramSpring.scale as unknown as [number, number, number]}
        >
          {/* Holographic pyramids */}
          <mesh>
            <tetrahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial 
              color="#a5b4fc"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              emissive="#818cf8"
              emissiveIntensity={1}
              wireframe
            />
          </mesh>

          {/* Holographic cube */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshStandardMaterial 
              color="#6366f1"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              emissive="#6366f1"
              emissiveIntensity={1}
              wireframe
            />
          </mesh>

          {/* Holographic rings */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.02, 16, 32]} />
            <meshStandardMaterial 
              color="#818cf8"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              emissive="#818cf8"
              emissiveIntensity={1}
            />
          </mesh>

          {/* Holographic grid plane */}
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.8, 0.8, 8, 8]} />
            <meshStandardMaterial
              map={hologramTexture}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              emissive="#a5b4fc"
              emissiveIntensity={1}
            />
          </mesh>
          
          {/* Hologram glow */}
          <pointLight intensity={0.8} distance={1} color="#a5b4fc" />
        </a.group>
      )}
    </group>
  );
}