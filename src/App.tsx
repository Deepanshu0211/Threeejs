import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  Preload, 
  Stars, 
  ContactShadows 
} from '@react-three/drei';
import Scene from './components/Scene';
import Interface from './components/Interface';
import Loading from './components/Loading';
import useStore from './store';

function App() {
  const { isLaptopOpen, setInitialCameraAnimation, initialCameraAnimation } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    // Initial animation startup sequence with staggered timing
    const animationTimer = setTimeout(() => {
      setInitialCameraAnimation(true);
    }, 500);
    
    // Show tip after a delay if laptop isn't opened
    const tipTimer = setTimeout(() => {
      if (!isLaptopOpen) {
        setShowTip(true);
      }
    }, 5000);
    
    // Mark as loaded after a minimum display time of loading screen
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);
    
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(tipTimer);
      clearTimeout(loadTimer);
    };
  }, [isLaptopOpen]);

  // Hide tip when laptop opens
  useEffect(() => {
    if (isLaptopOpen) {
      setShowTip(false);
    }
  }, [isLaptopOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 animate-gradient-slow">
        {/* Grid overlay for cyberpunk effect */}
        <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
      </div>
      
      {/* Loading screen with fade-out */}
      <Suspense fallback={null}>
        {!isLoaded && <Loading />}
        
        <div className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 10, 15], fov: 65 }}
            gl={{ 
              antialias: true,
              alpha: false,
              powerPreference: "high-performance"
            }}
            performance={{ min: 0.5 }}
          >
            <color attach="background" args={['#111827']} />
            <fog attach="fog" args={['#111827', 8, 20]} />
            
            <PerspectiveCamera makeDefault position={[0, 10, 15]} />
            <OrbitControls 
              enablePan={true}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              minDistance={isLaptopOpen ? 2 : 3}
              maxDistance={isLaptopOpen ? 3 : 7}
              enabled={!isLaptopOpen && !initialCameraAnimation}
              dampingFactor={0.05}
              rotateSpeed={0.5}
              enableDamping={true}
            />
            
            {/* Higher quality environment for better reflections */}
            <Environment preset="apartment" background={false} />
            
            {/* Ambient occlusion for more realistic shadows */}
            <ambientLight intensity={0.4} />
            
            {/* Main scene */}
            <Scene />
            
            {/* Contact shadows under objects */}
            <ContactShadows
              opacity={0.6}
              scale={10}
              blur={3}
              far={10}
              resolution={256}
              color="#000000"
            />
            
            {/* Distant stars for atmosphere */}
            {!isLaptopOpen && (
              <Stars 
                radius={100} 
                depth={50} 
                count={1000} 
                factor={4} 
                saturation={0} 
                fade={true} 
                speed={0.5}
              />
            )}
            
            {/* Preload assets for better performance */}
            <Preload all />
          </Canvas>
        </div>
      </Suspense>
      
      {/* UI Overlay */}
      <Interface />
      
      {/* Interactive Elements Highlight */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className={`absolute w-4 h-4 border-2 border-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
            isLaptopOpen || initialCameraAnimation ? 'opacity-0' : 'animate-ping opacity-100'
          }`}
          style={{ left: '50%', top: '50%' }}
        />
      </div>
      
      {/* User tip toast message */}
      <div 
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 
                  text-purple-300 px-6 py-3 rounded-full shadow-lg backdrop-filter backdrop-blur-md 
                  border border-purple-500 transition-all duration-500 flex items-center gap-2
                  ${showTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Click on the laptop to interact</span>
      </div>
      
      {/* Visual effects when laptop opens */}
      {isLaptopOpen && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-purple-700/5 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan"></div>
        </div>
      )}
      
      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -60%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        @keyframes gradient-slow {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 15s ease infinite;
        }
        
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

export default App;