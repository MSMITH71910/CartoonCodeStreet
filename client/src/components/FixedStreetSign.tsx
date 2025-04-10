import React, { useState } from "react";
import * as THREE from "three";
import { useAudio } from "../lib/stores/useAudio";
import { useStreetSign } from "../lib/stores/useStreetSign";

/**
 * A completely fixed street sign component that doesn't move with the character.
 * This is independent of the scene hierarchy to ensure it stays stationary.
 */
const FixedStreetSign = () => {
  const [signHovered, setSignHovered] = useState(false);
  const { playHit } = useAudio();
  const { openAboutInfo } = useStreetSign();
  
  const handleSignClick = () => {
    openAboutInfo();
    playHit();
  };
  
  return (
    // Fixed position in the world, independent of character movements
    <group position={[0, 0, 15]} rotation={[0, Math.PI, 0]}>
      {/* Posts */}
      <mesh castShadow position={[-2, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
        <meshStandardMaterial color="#8B4513" side={THREE.DoubleSide} />
      </mesh>
      
      <mesh castShadow position={[2, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
        <meshStandardMaterial color="#8B4513" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Sign */}
      <group position={[0, 3, 0]}>
        {/* Sign board */}
        <mesh 
          castShadow 
          position={[0, 0, 0]} 
          receiveShadow
          onPointerOver={() => setSignHovered(true)}
          onPointerOut={() => setSignHovered(false)}
          onClick={handleSignClick}
        >
          <boxGeometry args={[5, 3, 0.2]} />
          <meshStandardMaterial color={signHovered ? "#4285F4" : "#1E88E5"} side={THREE.DoubleSide} />
        </mesh>

        {/* Front side text */}
        <sprite position={[0, 0, 0.2]} scale={[4.8, 2.8, 1]}>
          <spriteMaterial alphaTest={0.5}>
            <canvasTexture attach="map" args={[(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 1024;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Fill the background
                ctx.fillStyle = "#0D47A1";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Border
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 12;
                ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
                
                // Header
                ctx.font = 'bold 80px Arial';
                ctx.fillStyle = 'yellow';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('MICHAEL R. SMITH', canvas.width / 2, canvas.height * 0.25);
                
                // Subheader
                ctx.font = 'bold 75px Arial';
                ctx.fillText('PORTFOLIO STREET', canvas.width / 2, canvas.height * 0.5);
                
                // Highlight box for bottom text
                ctx.fillStyle = '#1A237E';
                ctx.fillRect(canvas.width * 0.1, canvas.height * 0.68, canvas.width * 0.8, canvas.height * 0.2);
                
                // Highlight border
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 6;
                ctx.strokeRect(canvas.width * 0.1, canvas.height * 0.68, canvas.width * 0.8, canvas.height * 0.2);
                
                // Bottom text
                ctx.font = 'bold 68px Arial';
                ctx.fillStyle = 'yellow';
                ctx.fillText('CLICK FOR INFO', canvas.width / 2, canvas.height * 0.78);
              }
              
              return canvas;
            })()]} />
          </spriteMaterial>
        </sprite>
        
        {/* Back side text */}
        <sprite position={[0, 0, -0.2]} rotation={[0, Math.PI, 0]} scale={[4.8, 2.8, 1]}>
          <spriteMaterial alphaTest={0.5}>
            <canvasTexture attach="map" args={[(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 1024;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Fill the background
                ctx.fillStyle = "#0D47A1";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Border
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 12;
                ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
                
                // Header
                ctx.font = 'bold 80px Arial';
                ctx.fillStyle = 'yellow';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('MICHAEL R. SMITH', canvas.width / 2, canvas.height * 0.25);
                
                // Subheader
                ctx.font = 'bold 75px Arial';
                ctx.fillText('PORTFOLIO STREET', canvas.width / 2, canvas.height * 0.5);
                
                // Highlight box for bottom text
                ctx.fillStyle = '#1A237E';
                ctx.fillRect(canvas.width * 0.1, canvas.height * 0.68, canvas.width * 0.8, canvas.height * 0.2);
                
                // Highlight border
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 6;
                ctx.strokeRect(canvas.width * 0.1, canvas.height * 0.68, canvas.width * 0.8, canvas.height * 0.2);
                
                // Bottom text
                ctx.font = 'bold 68px Arial';
                ctx.fillStyle = 'yellow';
                ctx.fillText('CLICK FOR INFO', canvas.width / 2, canvas.height * 0.78);
              }
              
              return canvas;
            })()]} />
          </spriteMaterial>
        </sprite>
      </group>
    </group>
  );
};

export default FixedStreetSign;