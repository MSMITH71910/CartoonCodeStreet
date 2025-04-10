import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree, Canvas } from "@react-three/fiber";
import { useAudio } from "../lib/stores/useAudio";
import { useStreetSign } from "../lib/stores/useStreetSign";

/**
 * A completely fixed street sign component that doesn't move with the character.
 * This is mounted as an absolutely positioned layer independent of the character rotation.
 */
const SignContent = () => {
  const [signHovered, setSignHovered] = useState(false);
  const { playHit } = useAudio();
  const { openAboutInfo } = useStreetSign();
  
  const handleSignClick = () => {
    openAboutInfo();
    playHit();
  };
  
  // When using a separate scene, ensure the camera looks directly at the sign
  const { camera } = useThree();
  
  useEffect(() => {
    // Position camera to properly view the sign
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 3, 0);
  }, [camera]);
  
  return (
    <>
      {/* Simple lighting for the sign */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />
      
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
    </>
  );
};

// The main street sign component that can be imported and used
const FixedStreetSign = () => {
  const { isNearSign } = useStreetSign();

  return (
    <group position={[0, 0, 15]} rotation={[0, Math.PI, 0]}>
      {/* Using a hard-coded fixed mesh rather than scene-relative one */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5, 5, 0.1]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      
      {/* Posts */}
      <mesh castShadow position={[-2, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      <mesh castShadow position={[2, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Sign board */}
      <mesh 
        castShadow 
        position={[0, 3, 0]} 
        receiveShadow
      >
        <boxGeometry args={[5, 3, 0.2]} />
        <meshStandardMaterial color="#1E88E5" side={THREE.DoubleSide} />
        
        {/* Front text */}
        <SignText position={[0, 0, 0.101]} />
        
        {/* Back text (rotated 180 degrees) */}
        <SignText position={[0, 0, -0.101]} rotation={[0, Math.PI, 0]} />
      </mesh>
    </group>
  );
};

// Helper component for the sign text
function SignText({ 
  position = [0, 0, 0] as [number, number, number], 
  rotation = [0, 0, 0] as [number, number, number] 
}) {
  const { openAboutInfo } = useStreetSign();
  const { playHit } = useAudio();
  const [hover, setHover] = useState(false);
  
  const handleClick = () => {
    openAboutInfo();
    playHit();
  };

  return (
    <sprite 
      position={position} 
      rotation={rotation} 
      scale={[4.8, 2.8, 1] as [number, number, number]}
      onClick={handleClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <spriteMaterial alphaTest={0.5}>
        <canvasTexture attach="map" args={[(() => {
          const canvas = document.createElement('canvas');
          canvas.width = 1024;
          canvas.height = 1024;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Fill the background - blue with highlight if hovered
            ctx.fillStyle = hover ? "#1565C0" : "#0D47A1";
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
            ctx.fillStyle = hover ? '#283593' : '#1A237E';
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
  );
}

export default FixedStreetSign;