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
        rotation={[0, Math.PI / 4, 0]} // Rotate the sign for better visibility
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleSignClick}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 1, 0.1]} />
          <meshStandardMaterial color={hovered ? "#4CAF50" : "#2E7D32"} />
        </mesh>
        
        {/* White border for sign */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[3.2, 1.2, 0.01]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Sign text */}
        <Text
          position={[0, 0, 0.06]}
          color="white"
          fontSize={0.2}
          maxWidth={2.8}
          textAlign="center"
          font="bold"
        >
          Michael R Smith Portfolio Street
        </Text>
      </group>
      
      {/* Info popup when clicked */}
      {showInfo && (
        <group position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          {/* Background with border */}
          <mesh>
            <boxGeometry args={[4, 2.5, 0.1]} />
            <meshStandardMaterial color="#333333" transparent opacity={0.95} />
          </mesh>
          
          {/* White border */}
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[4.1, 2.6, 0.01]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
          
          <Text
            position={[0, 0.9, 0.06]}
            color="#FFEB3B" // Yellow title
            fontSize={0.25}
            maxWidth={3.8}
            textAlign="center"
            font="bold"
          >
            About This Portfolio
          </Text>
          
          <Text
            position={[0, 0.1, 0.06]}
            color="white"
            fontSize={0.15}
            maxWidth={3.6}
            textAlign="left"
            lineHeight={1.5}
          >
            Built with:
            • Three.js & React Three Fiber
            • React & TypeScript
            • TailwindCSS for UI styling
            • Custom animation system
            • Interactive mini-games
          </Text>
          
          <Text
            position={[0, -0.5, 0.06]}
            color="#E0E0E0"
            fontSize={0.15}
            maxWidth={3.6}
            textAlign="left"
            lineHeight={1.5}
          >
            This 3D portfolio features custom character
            animations, interactive objects, and fully
            explorable environment with houses that
            represent different projects.
          </Text>
          
          <Text
            position={[0, -1.1, 0.06]}
            color="#4FC3F7"
            fontSize={0.15}
            maxWidth={3.8}
            textAlign="center"
            font="bold"
          >
            Click the sign again to close
          </Text>
        </group>
      )}
    </group>
  );
};

export default StreetSign;