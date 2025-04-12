import { SpotLight } from '@react-three/drei';

interface RoomLightingProps {
  intensity: number;
  isDarkMode: boolean;
}

export default function RoomLighting({ intensity, isDarkMode }: RoomLightingProps) {
  const ambientColor = isDarkMode ? "#e9d5ff" : "#ffffff";
  
  return (
    <>
      {/* Soft ambient light for base illumination */}
      <ambientLight intensity={intensity * 0.1} color={ambientColor} />
      
      {/* Main key light */}
      <SpotLight
        position={[8, 4, 2]}
        angle={0.6}
        penumbra={1}
        intensity={intensity * 0.3}
        castShadow
        color={ambientColor}
        distance={15}
        decay={2}
        power={4}

      />
      
      {/* Fill light */}
      <SpotLight
        position={[-10, 4, -2]}
        angle={0.6}
        penumbra={1}
        intensity={intensity * 0.2}
        castShadow
        color={isDarkMode ? "#e9d5ff" : "#fef9c3"}
        distance={20}
        decay={2}
        power={2}
        shadow-bias={-0.0005}
      />

      {/* Soft rim light */}
      <pointLight
        position={[0, 2, -3]}
        intensity={intensity * 0.1}
        color={isDarkMode ? "#818cf8" : "#fef9c3"}
        distance={8}
        decay={2.5}
        power={2}
        shadow-bias={-0.0005}
      />
      
      {/* Accent light */}
      <pointLight
        position={[-3, 2, 0]}
        intensity={intensity * 0.08}
        color={isDarkMode ? "#c084fc" : "#fef9c3"}
        distance={7}
        decay={2.5}
        power={2}
        shadow-bias={-0.0005}
      />
    </>
  );
}