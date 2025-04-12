import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Html, Text, useTexture } from '@react-three/drei';
import { animated, useSpring, a } from '@react-spring/three';
import { Monitor, Code2, Briefcase, Mail, Github, Linkedin, Terminal as TerminalIcon, Network, Shield, User, Award, Bookmark } from 'lucide-react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

// Holographic particle effect component
const HolographicParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    sizes[i] = Math.random() * 0.05 + 0.01;
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      (particlesRef.current.material as THREE.Material).opacity = 0.6 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes.position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes.size"
          array={sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        color="#88ccff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Animated terminal window component
interface TerminalProps {
  id: string;
  text: string;
  top: number;
  left: number;
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ id, text, top, left, onClose }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const lines = text.split('\n');
  
  useEffect(() => {
    // Type writer effect
    if (currentLine < lines.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + lines[currentLine] + '\n');
        setCurrentLine(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentLine, lines]);
  
  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  const terminalIcons = {
    'Shield': Shield,
    'Code2': Code2,
    'Network': Network,
    'Terminal': TerminalIcon
  };
  
  const IconComponent = terminalIcons[id.split('_')[0] as keyof typeof terminalIcons] || Terminal;
  
  return (
    <div
      className="absolute bg-gray-900/90 p-3 rounded-lg font-mono text-xs text-green-400 shadow-xl border border-green-500/20 backdrop-blur-lg transform-gpu"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: '300px',
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      <div className="flex items-center justify-between mb-2 border-b border-green-500/20 pb-1">
        <div className="flex items-center gap-2">
          <IconComponent className="w-3 h-3" />
          <span>terminal_{id}.exe</span>
        </div>
        <div className="flex gap-1">
          <button className="w-2 h-2 rounded-full bg-yellow-500 hover:bg-yellow-400"></button>
          <button 
            onClick={onClose}
            className="w-2 h-2 rounded-full bg-red-500 hover:bg-red-400"
          ></button>
        </div>
      </div>
      <pre className="whitespace-pre-wrap">
        {displayedText}
        {showCursor && <span className="animate-pulse">▌</span>}
      </pre>
    </div>
  );
};

// Project card component with flip animation
interface Project {
  id: number;
  name: string;
  type: string;
  shortDesc: string;
  description: string;
}

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [flipped, setFlipped] = useState(false);
  
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  
  const handleClick = () => {
    setFlipped(prev => !prev);
  };
  
  const icons = {
    'web': Monitor,
    'ai': Shield,
    'mobile': Network,
    'cloud': Code2
  };
  
  const Icon = icons[project.type as keyof typeof icons] || Code2;
  
  return (
    <div 
      onClick={handleClick}
      className="relative w-full h-20 cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      <a.div
        className="absolute w-full h-full bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all"
        style={{
          opacity: opacity.to(o => 1 - o),
          transform: transform.to((t) => t),
          rotateY: '0deg',
        }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-sm">{project.name}</h3>
        </div>
        <p className="text-xs text-blue-300 mt-1">{project.shortDesc}</p>
      </a.div>
      
      <a.div
        className="absolute w-full h-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-3 rounded-xl"
        style={{
          opacity,
          transform,
          rotateY: '180deg',
        }}
      >
        <div className="flex flex-col justify-between h-full">
          <p className="text-xs">{project.description}</p>
          <div className="flex justify-end">
            <button className="text-xs px-2 py-1 bg-purple-500/20 rounded-full hover:bg-purple-500/40">
              Details
            </button>
          </div>
        </div>
      </a.div>
    </div>
  );
};

// Main Portfolio Content Component
export default function PortfolioContent() {
  const groupRef = useRef(null);
  const hologramRef = useRef<THREE.Group | null>(null);
  interface TerminalData {
    id: string;
    text: string;
    top: number;
    left: number;
  }

  const [terminals, setTerminals] = useState<TerminalData[]>([]);
  const [currentTerminalId, setCurrentTerminalId] = useState(0);
  const [activeSection, setActiveSection] = useState('about');
  
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  
  // Spring animation for main component
  const { scale, rotation } = useSpring({
    from: { scale: 0, rotation: [0, -Math.PI / 4, 0] },
    to: { scale: 1, rotation: [0, 0, 0] },
    config: { tension: 280, friction: 60 }
  });
  
  // Projects data
  const projects = [
    {
      id: 1, 
      name: '3D Portfolio', 
      type: 'web',
      shortDesc: 'Interactive three.js showcase',
      description: 'A responsive WebGL portfolio with interactive 3D elements and animations.'
    },
    {
      id: 2, 
      name: 'AI Assistant', 
      type: 'ai',
      shortDesc: 'Smart conversation agent',
      description: 'Natural language processing AI that helps with daily tasks and information retrieval.'
    },
    {
      id: 3, 
      name: 'Cloud Platform', 
      type: 'cloud',
      shortDesc: 'Scalable infrastructure',
      description: 'Enterprise-grade cloud solution with built-in monitoring and deployment tools.'
    },
    {
      id: 4, 
      name: 'Mobile App', 
      type: 'mobile',
      shortDesc: 'Cross-platform application',
      description: 'React Native app with extensive offline capabilities and realtime synchronization.'
    }
  ];
  
  // Terminal content types
  const terminalTypes = [
    {
      type: 'Shield',
      text: `> Initializing portfolio...
> Loading projects...
> Compiling experience...
> Portfolio ready.
`,
    },
    {
      type: 'Code2',
      text: `> Skills loaded:
  - React/Three.js
  - TypeScript
  - Node.js
  - WebGL/GLSL
`,
    },
    {
      type: 'Network',
      text: `> Recent projects:
  - 3D Portfolio
  - AI Assistant
  - Cloud Platform
  - Mobile App
`,
    }
  ];

  // Create a new terminal window
  const createNewTerminal = useCallback(() => {
    const newId = currentTerminalId + 1;
    setCurrentTerminalId(newId);
    
    const selectedType = terminalTypes[Math.floor(Math.random() * terminalTypes.length)];
    
    setTerminals(prev => {
      const newTerminals = [...prev];
      if (newTerminals.length >= 4) {
        newTerminals.shift();
      }
      return [...newTerminals, {
        id: `${selectedType.type}_${newId}`,
        text: selectedType.text,
        top: 10 + Math.random() * 30,
        left: 5 + Math.random() * 20
      }];
    });
  }, [currentTerminalId, terminalTypes]);
  
  // Remove a terminal
  const removeTerminal = useCallback((terminalId: string) => {
    setTerminals(prev => prev.filter(terminal => terminal.id !== terminalId));
  }, []);
  
  // Initialize terminals
  useEffect(() => {
    createNewTerminal();
    const interval = setInterval(createNewTerminal, 5000);
    return () => clearInterval(interval);
  }, [createNewTerminal]);
  
  // Hologram animation
  useFrame((state) => {
    if (hologramRef.current) {
      // Floating animation
      hologramRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
      
      // Light flicker effect
      hologramRef.current.children.forEach((child) => {
        const material = (child as THREE.Mesh).material;
        if (material && !Array.isArray(material) && material.opacity !== undefined) {
          material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
      });
    }
  });
  
  // Mouse interaction
  const [hovered, setHovered] = useState(false);
  const hoverAnimation = useSpring({
    scale: hovered ? 1.02 : 1,
    config: { tension: 300, friction: 40 }
  });
  
  return (
    <animated.group 
      ref={groupRef} 
      position={[0, isMobile ? 0.8 : 1.2, 0]} 
      scale={scale}
      rotation={rotation.to((r) => Array.isArray(r) ? r : [0, 0, 0]) as unknown as [number, number, number]}
    >
      <Suspense fallback={null}>
        <HolographicParticles />
      </Suspense>
      
      <group 
        ref={hologramRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Terminals section */}
        <Html
          transform
          position={[-1.5, 0.3, 0]}
          rotation={[0, 0.1, 0]}
          style={{ width: '600px' }}
          distanceFactor={1.8}
          center
          className="select-none"
        >
          <div className="relative h-[400px] w-full perspective-1000">
            {terminals.map((terminal) => (
              <Terminal
                key={terminal.id}
                id={terminal.id}
                text={terminal.text}
                top={terminal.top}
                left={terminal.left}
                onClose={() => removeTerminal(terminal.id)}
              />
            ))}
          </div>
        </Html>

        {/* Main portfolio card */}
        <Html
          transform
          position={[0.8, 0, 0]}
          style={{ width: '400px' }}
          distanceFactor={1.8}
          center
          className="select-none"
        >
          <animated.div 
            className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-xl p-6 rounded-2xl text-white shadow-2xl border border-purple-500/20 transform-gpu transition-all"
            style={{ transform: hoverAnimation.scale.to((s) => `scale(${s})`).toString() }}
          >
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  John Doe
                </h2>
                <p className="text-blue-300">Creative Developer & 3D Enthusiast</p>
              </div>

              {/* Navigation tabs */}
              <div className="flex justify-center gap-2 mb-2">
                <button 
                  onClick={() => setActiveSection('about')}
                  className={`px-3 py-1 rounded-full text-xs ${activeSection === 'about' ? 'bg-purple-500/40' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>About</span>
                  </div>
                </button>
                <button 
                  onClick={() => setActiveSection('projects')}
                  className={`px-3 py-1 rounded-full text-xs ${activeSection === 'projects' ? 'bg-purple-500/40' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-1">
                    <Code2 className="w-3 h-3" />
                    <span>Projects</span>
                  </div>
                </button>
                <button 
                  onClick={() => setActiveSection('experience')}
                  className={`px-3 py-1 rounded-full text-xs ${activeSection === 'experience' ? 'bg-purple-500/40' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    <span>Experience</span>
                  </div>
                </button>
              </div>

              {/* Content sections */}
              <div className="min-h-64">
                {activeSection === 'about' && (
                  <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm">About Me</h3>
                      </div>
                      <p className="text-xs">
                        Creative developer with a passion for building immersive digital experiences.
                        Specialized in 3D web development and interactive frontend applications.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm">Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['React', 'Three.js', 'TypeScript', 'Node.js', 'WebGL', 'GLSL', 'UX Design', 'React Native'].map((skill) => (
                          <span key={skill} className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs hover:bg-purple-500/40 cursor-pointer transition-colors">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Bookmark className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm">Interests</h3>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['3D Graphics', 'AR/VR', 'Game Dev', 'UI Animation', 'AI'].map((interest) => (
                          <span key={interest} className="px-2 py-0.5 bg-blue-500/20 rounded-full text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSection === 'projects' && (
                  <div className="space-y-3">
                    {projects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </div>
                )}
                
                {activeSection === 'experience' && (
                  <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm">Senior Developer</h3>
                      </div>
                      <p className="text-xs text-blue-300">Tech Corp • 2022 - Present</p>
                      <p className="text-xs mt-1">
                        Led development of interactive web applications and 3D experiences.
                        Managed team of 5 frontend developers.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm">Lead Engineer</h3>
                      </div>
                      <p className="text-xs text-blue-300">StartupX • 2020 - 2022</p>
                      <p className="text-xs mt-1">
                        Architected scalable frontend solutions and implemented CI/CD processes.
                        Reduced load times by 40%.
                      </p>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        <h3 className="font-semibold text-sm">Full Stack Developer</h3>
                      </div>
                      <p className="text-xs text-blue-300">Innovation Labs • 2018 - 2020</p>
                      <p className="text-xs mt-1">
                        Built responsive web applications and RESTful APIs.
                        Specialized in React and Node.js ecosystems.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              <div className="flex justify-center gap-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-white/5 rounded-full hover:bg-purple-500/20 transition-all hover:scale-110 transform">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-white/5 rounded-full hover:bg-purple-500/20 transition-all hover:scale-110 transform">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:contact@example.com"
                  className="p-2 bg-white/5 rounded-full hover:bg-purple-500/20 transition-all hover:scale-110 transform">
                  <Mail className="w-5 h-5" />
                </a>
              </div>

              <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:opacity-90 transition-all hover:scale-105 transform text-sm font-semibold">
                Download Resume
              </button>
            </div>
          </animated.div>
        </Html>

        {/* Background holographic effect */}
        <mesh position={[0, 0, -0.2]} rotation={[0, 0, 0]}>
          <planeGeometry args={[5, 2.5]} />
          <meshBasicMaterial 
            color="#4f46e5"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Circular glow */}
        <mesh position={[0.8, 0, -0.1]} rotation={[0, 0, 0]}>
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial 
            color="#a855f7"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* 3D Portfolio text */}
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.15}
          color="#d8b4fe"
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={0.7}
        >
          &lt;INTERACTIVE PORTFOLIO /&gt;
        </Text>
      </group>
    </animated.group>
  );
}