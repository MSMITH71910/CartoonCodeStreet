import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useAudio } from "../lib/stores/useAudio";
import * as THREE from "three";

const DirectStreetSign = () => {
  const signRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { playHit } = useAudio();

  // Subtle hover animation
  useFrame((state) => {
    if (!signRef.current) return;
    
    if (hovered) {
      // Gentle hovering animation
      signRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    } else {
      // Reset to original position
      signRef.current.position.y = 0;
    }
  });
  
  const handleSignClick = (e: any) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
    playHit();
  };
  
  return (
    <group ref={signRef} position={[0, 0, 25]} rotation={[0, Math.PI, 0]}>
      {/* Sign posts - two sturdy poles */}
      <mesh castShadow position={[-2, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh castShadow position={[2, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Large billboard sign */}
      <group 
        position={[0, 3.5, 0]} 
        rotation={[0, 0, 0]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleSignClick}
      >
        {/* Main sign background */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 2, 0.2]} />
          <meshStandardMaterial color={hovered ? "#4285F4" : "#1E88E5"} />
        </mesh>
        
        {/* Sign border */}
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[5.2, 2.2, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Inner part with text */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[4.8, 1.8, 0.01]} />
          <meshStandardMaterial color={hovered ? "#4285F4" : "#1E88E5"} />
        </mesh>
        
        {/* Title text */}
        <Text
          position={[0, 0.5, 0.15]}
          color="white"
          fontSize={0.4}
          maxWidth={4.5}
          textAlign="center"
          font="bold"
        >
          Michael R Smith Portfolio Street
        </Text>
        
        {/* Subtitle */}
        <Text
          position={[0, -0.2, 0.15]}
          color="#FFEB3B"
          fontSize={0.25}
          maxWidth={4.5}
          textAlign="center"
        >
          Interactive 3D Experience
        </Text>
        
        {/* Instruction */}
        <Text
          position={[0, -0.6, 0.15]}
          color="white"
          fontSize={0.2}
          maxWidth={4.5}
          textAlign="center"
        >
          Click for more information
        </Text>
      </group>
      
      {/* Info panel when clicked */}
      {showInfo && (
        <group position={[0, 3.5, 1]} rotation={[0, 0, 0]}>
          {/* Background with border */}
          <mesh>
            <boxGeometry args={[6, 4, 0.2]} />
            <meshStandardMaterial color="#333333" transparent opacity={0.95} />
          </mesh>
          
          {/* Border */}
          <mesh position={[0, 0, 0.11]}>
            <boxGeometry args={[6.2, 4.2, 0.01]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
          
          {/* Header */}
          <mesh position={[0, 1.7, 0.15]}>
            <boxGeometry args={[5.8, 0.6, 0.01]} />
            <meshStandardMaterial color="#1A237E" />
          </mesh>
          
          <Text
            position={[0, 1.7, 0.16]}
            color="#FFEB3B"
            fontSize={0.4}
            maxWidth={5.5}
            textAlign="center"
            font="bold"
          >
            About This Portfolio
          </Text>
          
          <Text
            position={[0, 0.7, 0.16]}
            color="white"
            fontSize={0.25}
            maxWidth={5.5}
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
            position={[0, -0.3, 0.16]}
            color="#E0E0E0"
            fontSize={0.25}
            maxWidth={5.5}
            textAlign="left"
            lineHeight={1.5}
          >
            This 3D portfolio features custom character
            animations, interactive objects, and a fully
            explorable environment with houses that
            represent different projects.
          </Text>
          
          {/* Footer */}
          <mesh position={[0, -1.7, 0.15]}>
            <boxGeometry args={[5.8, 0.6, 0.01]} />
            <meshStandardMaterial color="#1A237E" />
          </mesh>
          
          <Text
            position={[0, -1.7, 0.16]}
            color="#4FC3F7"
            fontSize={0.3}
            maxWidth={5.5}
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

export default DirectStreetSign;
