import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface StreetSignInfoProps {
  showInfo: boolean;
}

const StreetSignInfo: React.FC<StreetSignInfoProps> = ({ showInfo }) => {
  if (!showInfo) return null;

  return (
    <>
      {/* Front side panel */}
      <group position={[0, 3.5, 1]}>
        {/* Background panel */}
        <mesh receiveShadow>
          <boxGeometry args={[6, 4, 0.1]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Header bar - About This Portfolio */}
        <mesh position={[0, 1.7, 0.06]}>
          <boxGeometry args={[5.8, 0.6, 0.02]} />
          <meshStandardMaterial color="#1A237E" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Border */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[5.9, 3.9, 0.01]} />
          <meshStandardMaterial color="#555555" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Title - About This Portfolio */}
        <mesh position={[0, 1.7, 0.07]}>
          <boxGeometry args={[5, 0.3, 0.01]} />
          <meshStandardMaterial color="#FFEB3B" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Title Text */}
        <Text 
          position={[0, 1.7, 0.08]} 
          fontSize={0.22}
          color="black"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          About This Portfolio
        </Text>
        
        {/* Core Technologies Section */}
        <mesh position={[0, 1.1, 0.07]}>
          <boxGeometry args={[5.5, 0.4, 0.01]} />
          <meshStandardMaterial color="#2196F3" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Core Technologies Label */}
        <Text 
          position={[0, 1.1, 0.08]} 
          fontSize={0.18}
          color="white"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          Core Technologies
        </Text>
        
        {/* Main Frameworks Section */}
        <mesh position={[0, 0.5, 0.07]}>
          <boxGeometry args={[5.5, 0.8, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Framework Text Lines */}
        <Text 
          position={[0, 0.7, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          React • TypeScript • Three.js
        </Text>
        
        <Text 
          position={[0, 0.4, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          @react-three/fiber • @react-three/drei
        </Text>
        
        <Text 
          position={[0, 0.1, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          TailwindCSS • Express • Node.js
        </Text>
        
        {/* 3D Features Section */}
        <mesh position={[0, -0.6, 0.07]}>
          <boxGeometry args={[5.5, 0.8, 0.01]} />
          <meshStandardMaterial color="#E0E0E0" side={THREE.DoubleSide} />
        </mesh>
        
        {/* 3D Features Text Lines */}
        <Text 
          position={[0, -0.4, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          3D Features
        </Text>
        
        <Text 
          position={[0, -0.7, 0.08]} 
          fontSize={0.15}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
          maxWidth={4.8}
        >
          Custom lighting • Physics • Animations • Interactions
        </Text>
        
        {/* Interactive Features Section */}
        <mesh position={[0, -1.2, 0.07]}>
          <boxGeometry args={[5.5, 0.5, 0.01]} />
          <meshStandardMaterial color="#4CAF50" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Interactive Features Text */}
        <Text 
          position={[0, -1.2, 0.08]} 
          fontSize={0.18}
          color="white"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          Interactive Mini-Games & Portfolio Showcase
        </Text>
        
        {/* Footer */}
        <mesh position={[0, -1.7, 0.06]}>
          <boxGeometry args={[5.8, 0.6, 0.02]} />
          <meshStandardMaterial color="#1A237E" side={THREE.DoubleSide} />
        </mesh>
        
        <Text 
          position={[0, -1.7, 0.07]} 
          fontSize={0.15}
          color="#4FC3F7"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          Click the sign again to close
        </Text>
      </group>
      
      {/* Back side panel - mirrored */}
      <group position={[0, 3.5, -1]} rotation={[0, Math.PI, 0]}>
        {/* Background panel */}
        <mesh receiveShadow>
          <boxGeometry args={[6, 4, 0.1]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Header bar - About This Portfolio */}
        <mesh position={[0, 1.7, 0.06]}>
          <boxGeometry args={[5.8, 0.6, 0.02]} />
          <meshStandardMaterial color="#1A237E" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Border */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[5.9, 3.9, 0.01]} />
          <meshStandardMaterial color="#555555" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Title - About This Portfolio */}
        <mesh position={[0, 1.7, 0.07]}>
          <boxGeometry args={[5, 0.3, 0.01]} />
          <meshStandardMaterial color="#FFEB3B" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Title Text */}
        <Text 
          position={[0, 1.7, 0.08]} 
          fontSize={0.22}
          color="black"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          About This Portfolio
        </Text>
        
        {/* Core Technologies Section */}
        <mesh position={[0, 1.1, 0.07]}>
          <boxGeometry args={[5.5, 0.4, 0.01]} />
          <meshStandardMaterial color="#2196F3" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Core Technologies Label */}
        <Text 
          position={[0, 1.1, 0.08]} 
          fontSize={0.18}
          color="white"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          Core Technologies
        </Text>
        
        {/* Main Frameworks Section */}
        <mesh position={[0, 0.5, 0.07]}>
          <boxGeometry args={[5.5, 0.8, 0.01]} />
          <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Framework Text Lines */}
        <Text 
          position={[0, 0.7, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          React • TypeScript • Three.js
        </Text>
        
        <Text 
          position={[0, 0.4, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          @react-three/fiber • @react-three/drei
        </Text>
        
        <Text 
          position={[0, 0.1, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          TailwindCSS • Express • Node.js
        </Text>
        
        {/* 3D Features Section */}
        <mesh position={[0, -0.6, 0.07]}>
          <boxGeometry args={[5.5, 0.8, 0.01]} />
          <meshStandardMaterial color="#E0E0E0" side={THREE.DoubleSide} />
        </mesh>
        
        {/* 3D Features Text Lines */}
        <Text 
          position={[0, -0.4, 0.08]} 
          fontSize={0.16}
          color="black"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          3D Features
        </Text>
        
        <Text 
          position={[0, -0.7, 0.08]} 
          fontSize={0.15}
          color="black"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
          maxWidth={4.8}
        >
          Custom lighting • Physics • Animations • Interactions
        </Text>
        
        {/* Interactive Features Section */}
        <mesh position={[0, -1.2, 0.07]}>
          <boxGeometry args={[5.5, 0.5, 0.01]} />
          <meshStandardMaterial color="#4CAF50" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Interactive Features Text */}
        <Text 
          position={[0, -1.2, 0.08]} 
          fontSize={0.18}
          color="white"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          Interactive Mini-Games & Portfolio Showcase
        </Text>
        
        {/* Footer */}
        <mesh position={[0, -1.7, 0.06]}>
          <boxGeometry args={[5.8, 0.6, 0.02]} />
          <meshStandardMaterial color="#1A237E" side={THREE.DoubleSide} />
        </mesh>
        
        <Text 
          position={[0, -1.7, 0.07]} 
          fontSize={0.15}
          color="#4FC3F7"
          font="/fonts/Inter-Regular.woff"
          anchorX="center"
          anchorY="middle"
        >
          Click the sign again to close
        </Text>
      </group>
    </>
  );
};

export default StreetSignInfo;