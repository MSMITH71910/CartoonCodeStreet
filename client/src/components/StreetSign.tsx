import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useAudio } from '../lib/stores/useAudio';

interface StreetSignProps {
  position: [number, number, number];
}

const StreetSign: React.FC<StreetSignProps> = ({ position }) => {
  const { playHit } = useAudio();
  const [showInfo, setShowInfo] = useState(false);
  const [hovered, setHovered] = useState(false);
  const signRef = useRef<THREE.Group>(null);
  
  // Subtle hover animation
  useFrame((state, delta) => {
    if (!signRef.current) return;
    
    if (hovered) {
      // Gentle hovering animation
      signRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    } else {
      // Reset to original position
      signRef.current.position.y = position[1];
    }
  });
  
  const handleSignClick = (e: any) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
    playHit();
  };
  
  return (
    <group ref={signRef} position={position}>
      {/* Sign post */}
      <mesh 
        castShadow 
        position={[0, 1, 0]}
      >
        <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Sign board */}
      <group 
        position={[0, 2, 0]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleSignClick}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.8, 0.1]} />
          <meshStandardMaterial color={hovered ? "#4CAF50" : "#2E7D32"} />
        </mesh>
        
        {/* Sign text */}
        <Text
          position={[0, 0, 0.06]}
          color="white"
          fontSize={0.12}
          maxWidth={2.3}
          textAlign="center"
        >
          Michael R Smith Portfolio Street
        </Text>
      </group>
      
      {/* Info popup when clicked */}
      {showInfo && (
        <group position={[0, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[4, 2.5, 0.1]} />
            <meshStandardMaterial color="#333333" transparent opacity={0.9} />
          </mesh>
          
          <Text
            position={[0, 0.9, 0.06]}
            color="white"
            fontSize={0.15}
            maxWidth={3.8}
            textAlign="center"
          >
            About This Portfolio
          </Text>
          
          <Text
            position={[0, 0, 0.06]}
            color="white"
            fontSize={0.1}
            maxWidth={3.8}
            textAlign="left"
            lineHeight={1.5}
          >
            Built with:
            • Three.js & React Three Fiber
            • React & TypeScript
            • TailwindCSS for UI styling
            • Custom animation system
            • Interactive mini-games
            
            This 3D portfolio features custom character
            animations, interactive objects, and a fully
            explorable environment with houses that
            represent different projects.
          </Text>
          
          <Text
            position={[0, -1, 0.06]}
            color="#4FC3F7"
            fontSize={0.08}
            maxWidth={3.8}
            textAlign="center"
          >
            Click the sign again to close this info
          </Text>
        </group>
      )}
    </group>
  );
};

export default StreetSign;