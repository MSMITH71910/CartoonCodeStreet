import React, { useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Street from "./Street";
import Character from "./Character";
import { usePortfolio } from "../lib/stores/usePortfolio";
import { useAudio } from "../lib/stores/useAudio";

const Experience = () => {
  const { camera } = useThree();
  const { characterRef, cameraTarget, isViewingProject } = usePortfolio();
  const { playHit } = useAudio();
  const [signHovered, setSignHovered] = useState(false);
  const [showSignInfo, setShowSignInfo] = useState(false);
  
  const handleSignClick = () => {
    setShowSignInfo(!showSignInfo);
    playHit();
  };

  // Set up camera following logic
  useFrame(() => {
    if (characterRef && characterRef.current && !isViewingProject) {
      // Get character position
      const characterPosition = characterRef.current.position;
      
      // Calculate ideal camera position (behind character at a distance)
      const cameraIdealPosition = new THREE.Vector3();
      const characterDirection = new THREE.Vector3();
      
      // Get character's forward direction
      characterRef.current.getWorldDirection(characterDirection);
      
      // Set a higher camera position for better visibility
      // This improves the field of view and helps see objects further away
      const cameraHeight = 8; // Increased from 4 for better overview
      const cameraDistance = 12; // Increased from 8 for wider field of view
      
      // Negate direction to look behind character
      characterDirection.negate(); 
      
      // Position camera behind character at a distance and height
      cameraIdealPosition.copy(characterPosition)
        .add(characterDirection.multiplyScalar(cameraDistance))
        .add(new THREE.Vector3(0, cameraHeight, 0));
      
      // Only interpolate camera position if not actively rotating with mouse
      // This allows the OrbitControls to take over during mouse rotation
      if (!window.isMouseRotating) {
        // Faster lerp for smoother camera movement
        camera.position.lerp(cameraIdealPosition, 0.08);
      }
      
      // Update the camera's target to be further ahead of the character
      // This helps see what's in front instead of looking too close
      const lookTarget = new THREE.Vector3().copy(characterPosition);
      lookTarget.y += 1.5; // Look a bit higher above character
      
      // Add a small forward offset to look ahead of the character
      const forwardDirection = characterDirection.clone().negate(); // Now points forward
      lookTarget.add(forwardDirection.multiplyScalar(5)); // Look 5 units ahead
      
      // Update the camera target in the portfolio store
      cameraTarget.copy(lookTarget);
      
      // Only update lookAt if not currently using orbit controls
      if (!window.isMouseRotating) {
        camera.lookAt(lookTarget);
      }
      
      // Update the camera's far clipping plane to see objects at greater distances
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.far = 1000; // Set a larger value to see farther
        camera.fov = 70; // Wider field of view
        camera.updateProjectionMatrix();
      }
      
      // Log character position occasionally for debugging
      if (Math.random() < 0.01) { // Log about 1% of the time to avoid flooding console
        console.log(`Character position: (${characterPosition.x.toFixed(2)}, ${characterPosition.y.toFixed(2)}, ${characterPosition.z.toFixed(2)})`);
      }
    }
  });
  
  // Add mouse event listeners to track when mouse look is active and handle clicks
  useEffect(() => {
    // Flag to track if mouse button is held down for rotation
    window.isMouseRotating = false;
    
    // Track initial mouse position and time to distinguish between clicks and drags
    let mouseDownTime = 0;
    let initialMouseX = 0;
    let initialMouseY = 0;
    const clickThreshold = 200; // ms to consider as a click vs. drag
    const moveThreshold = 5; // pixels to consider as a drag vs. click
    
    // Event handlers for mouse
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        // Record time and position for click vs. drag detection
        mouseDownTime = Date.now();
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        
        // Don't set isMouseRotating immediately - we'll do that after determining if it's a drag
        // This allows clicks to pass through to clickable objects
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Only track movement if mouse is down
      if (e.buttons & 1) { // Left button is pressed
        const deltaX = Math.abs(e.clientX - initialMouseX);
        const deltaY = Math.abs(e.clientY - initialMouseY);
        
        // If mouse has moved significantly, consider it a drag/rotation
        if (deltaX > moveThreshold || deltaY > moveThreshold) {
          window.isMouseRotating = true;
        }
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        const isClick = (Date.now() - mouseDownTime < clickThreshold);
        
        // If it was a quick click without much movement, don't treat it as rotation
        // This allows the click to propagate to the houses
        window.isMouseRotating = false;
      }
    };
    
    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("Experience component mounted");
    
    return () => {
      console.log("Experience component unmounted");
    };
  }, []);

  return (
    <>
      {/* Main scene lighting - improved for better visibility from all angles */}
      <ambientLight intensity={0.7} /> {/* Brighter ambient light to see everything */}
      
      {/* Main directional light (sun-like) */}
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[2048, 2048]} // Higher resolution shadows
        shadow-camera-near={0.5}
        shadow-camera-far={150} // Increased range
        shadow-camera-left={-50} // Wider area
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Secondary directional light from opposite direction */}
      <directionalLight 
        position={[-10, 8, -5]} 
        intensity={0.4} 
        castShadow={false} // No shadows from this light to avoid conflict
      />
      
      {/* Fill light to brighten up shadowed areas */}
      <hemisphereLight 
        args={['#cce0ff', '#113355', 0.6]} // Sky color, ground color, intensity
      />
      
      {/* Scene environment */}
      <Street />
      
      {/* Player character */}
      <Character />
      
      {/* Direct street sign implementation - very simple */}
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
        
        {/* Sign board - interactive */}
        <mesh 
          castShadow 
          position={[0, 3.5, 0]} 
          receiveShadow
          onPointerOver={() => setSignHovered(true)}
          onPointerOut={() => setSignHovered(false)}
          onClick={handleSignClick}
        >
          <boxGeometry args={[5, 1.8, 0.2]} />
          <meshStandardMaterial color={signHovered ? "#4285F4" : "#1E88E5"} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sign text area - front side */}
        <mesh position={[0, 3.5, 0.12]}>
          <boxGeometry args={[4.5, 1.5, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Back side text area */}
        <mesh position={[0, 3.5, -0.12]}>
          <boxGeometry args={[4.5, 1.5, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Front side text - Michael R. Smith Portfolio Street */}
        {/* Front side text panel - Blue background */}
        <mesh position={[0, 3.7, 0.15]}>
          <planeGeometry args={[4, 0.6]} />
          <meshBasicMaterial color="#0D47A1" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Create text using HTML Canvas */}
        <mesh position={[0, 3.7, 0.16]}>
          <planeGeometry args={[3.5, 0.4]} />
          <meshBasicMaterial side={THREE.DoubleSide}>
            <canvasTexture attach="map" args={[(() => {
              // Create a canvas
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 128;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Clear the canvas
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                ctx.fillStyle = 'white';
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Michael R. Smith Portfolio Street', canvas.width / 2, canvas.height / 2);
              }
              
              return canvas;
            })()]} />
          </meshBasicMaterial>
        </mesh>
        
        {/* Front side text - Bottom Section */}
        <mesh position={[0, 3.3, 0.15]}>
          <planeGeometry args={[4, 0.6]} />
          <meshBasicMaterial color="#1565C0" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Create text for "Click for info" */}
        <mesh position={[0, 3.3, 0.16]}>
          <planeGeometry args={[3.5, 0.4]} />
          <meshBasicMaterial side={THREE.DoubleSide}>
            <canvasTexture attach="map" args={[(() => {
              // Create a canvas
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 128;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Clear the canvas
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                ctx.fillStyle = 'white';
                ctx.font = '36px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Click for info', canvas.width / 2, canvas.height / 2);
              }
              
              return canvas;
            })()]} />
          </meshBasicMaterial>
        </mesh>
        
        {/* Back side text - Top Section */}
        <mesh position={[0, 3.7, -0.15]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4, 0.6]} />
          <meshBasicMaterial color="#0D47A1" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Create text for back side */}
        <mesh position={[0, 3.7, -0.16]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.5, 0.4]} />
          <meshBasicMaterial side={THREE.DoubleSide}>
            <canvasTexture attach="map" args={[(() => {
              // Create a canvas
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 128;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Clear the canvas
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                ctx.fillStyle = 'white';
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Michael R. Smith Portfolio Street', canvas.width / 2, canvas.height / 2);
              }
              
              return canvas;
            })()]} />
          </meshBasicMaterial>
        </mesh>
        
        {/* Back side text - Bottom Section */}
        <mesh position={[0, 3.3, -0.15]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4, 0.6]} />
          <meshBasicMaterial color="#1565C0" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Create text for "Click for info" on back side */}
        <mesh position={[0, 3.3, -0.16]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.5, 0.4]} />
          <meshBasicMaterial side={THREE.DoubleSide}>
            <canvasTexture attach="map" args={[(() => {
              // Create a canvas
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 128;
              const ctx = canvas.getContext('2d');
              
              if (ctx) {
                // Clear the canvas
                ctx.fillStyle = 'transparent';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add text
                ctx.fillStyle = 'white';
                ctx.font = '36px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Click for info', canvas.width / 2, canvas.height / 2);
              }
              
              return canvas;
            })()]} />
          </meshBasicMaterial>
        </mesh>
        
        {/* Info panel when clicked - visible from both sides */}
        {showSignInfo && (
          <>
            {/* Front side panel */}
            <group position={[0, 3.5, 1]}>
              {/* Background panel */}
              <mesh receiveShadow>
                <boxGeometry args={[6, 4, 0.1]} />
                <meshStandardMaterial color="#333333" transparent opacity={0.9} side={THREE.DoubleSide} />
              </mesh>
              
              {/* Info panel text using Canvas texture */}
              <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[5.8, 3.8]} />
                <meshBasicMaterial side={THREE.DoubleSide}>
                  <canvasTexture attach="map" args={[(() => {
                    // Create a canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = 1024;
                    canvas.height = 768;
                    const ctx = canvas.getContext('2d');
                    
                    if (ctx) {
                      // Fill background
                      ctx.fillStyle = '#333';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      
                      // Title
                      ctx.fillStyle = '#FFEB3B';
                      ctx.font = 'bold 48px Arial';
                      ctx.textAlign = 'center';
                      ctx.fillText('About This Portfolio', canvas.width / 2, 100);
                      
                      // Core Technologies
                      ctx.fillStyle = '#2196F3';
                      ctx.fillRect(50, 150, canvas.width - 100, 80);
                      
                      ctx.fillStyle = 'white';
                      ctx.font = 'bold 36px Arial';
                      ctx.fillText('Core Technologies', canvas.width / 2, 200);
                      
                      // Frameworks
                      ctx.fillStyle = 'white';
                      ctx.fillRect(50, 250, canvas.width - 100, 150);
                      
                      ctx.fillStyle = 'black';
                      ctx.font = '28px Arial';
                      ctx.fillText('React • TypeScript • Three.js', canvas.width / 2, 300);
                      ctx.fillText('@react-three/fiber • @react-three/drei', canvas.width / 2, 350);
                      ctx.fillText('TailwindCSS • Express • Node.js', canvas.width / 2, 400);
                      
                      // 3D Features
                      ctx.fillStyle = '#E0E0E0';
                      ctx.fillRect(50, 420, canvas.width - 100, 150);
                      
                      ctx.fillStyle = 'black';
                      ctx.font = 'bold 32px Arial';
                      ctx.fillText('3D Features', canvas.width / 2, 470);
                      
                      ctx.font = '28px Arial';
                      ctx.fillText('Custom lighting • Physics • Animations', canvas.width / 2, 520);
                      ctx.fillText('Interactive objects • Dynamic camera', canvas.width / 2, 560);
                      
                      // Interactive
                      ctx.fillStyle = '#4CAF50';
                      ctx.fillRect(50, 590, canvas.width - 100, 80);
                      
                      ctx.fillStyle = 'white';
                      ctx.font = 'bold 32px Arial';
                      ctx.fillText('Interactive Mini-Games & Portfolio Showcase', canvas.width / 2, 640);
                      
                      // Footer
                      ctx.fillStyle = '#1A237E';
                      ctx.fillRect(50, 690, canvas.width - 100, 60);
                      
                      ctx.fillStyle = '#81D4FA';
                      ctx.font = '26px Arial';
                      ctx.fillText('Click the sign again to close', canvas.width / 2, 725);
                    }
                    
                    return canvas;
                  })()]} />
                </meshBasicMaterial>
              </mesh>
            </group>
            
            {/* Back side panel - mirrored */}
            <group position={[0, 3.5, -1]} rotation={[0, Math.PI, 0]}>
              {/* Background panel */}
              <mesh receiveShadow>
                <boxGeometry args={[6, 4, 0.1]} />
                <meshStandardMaterial color="#333333" transparent opacity={0.9} side={THREE.DoubleSide} />
              </mesh>
              
              {/* Info panel text using Canvas texture */}
              <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[5.8, 3.8]} />
                <meshBasicMaterial side={THREE.DoubleSide}>
                  <canvasTexture attach="map" args={[(() => {
                    // Create a canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = 1024;
                    canvas.height = 768;
                    const ctx = canvas.getContext('2d');
                    
                    if (ctx) {
                      // Fill background
                      ctx.fillStyle = '#333';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      
                      // Title
                      ctx.fillStyle = '#FFEB3B';
                      ctx.font = 'bold 48px Arial';
                      ctx.textAlign = 'center';
                      ctx.fillText('About This Portfolio', canvas.width / 2, 100);
                      
                      // Core Technologies
                      ctx.fillStyle = '#2196F3';
                      ctx.fillRect(50, 150, canvas.width - 100, 80);
                      
                      ctx.fillStyle = 'white';
                      ctx.font = 'bold 36px Arial';
                      ctx.fillText('Core Technologies', canvas.width / 2, 200);
                      
                      // Frameworks
                      ctx.fillStyle = 'white';
                      ctx.fillRect(50, 250, canvas.width - 100, 150);
                      
                      ctx.fillStyle = 'black';
                      ctx.font = '28px Arial';
                      ctx.fillText('React • TypeScript • Three.js', canvas.width / 2, 300);
                      ctx.fillText('@react-three/fiber • @react-three/drei', canvas.width / 2, 350);
                      ctx.fillText('TailwindCSS • Express • Node.js', canvas.width / 2, 400);
                      
                      // 3D Features
                      ctx.fillStyle = '#E0E0E0';
                      ctx.fillRect(50, 420, canvas.width - 100, 150);
                      
                      ctx.fillStyle = 'black';
                      ctx.font = 'bold 32px Arial';
                      ctx.fillText('3D Features', canvas.width / 2, 470);
                      
                      ctx.font = '28px Arial';
                      ctx.fillText('Custom lighting • Physics • Animations', canvas.width / 2, 520);
                      ctx.fillText('Interactive objects • Dynamic camera', canvas.width / 2, 560);
                      
                      // Interactive
                      ctx.fillStyle = '#4CAF50';
                      ctx.fillRect(50, 590, canvas.width - 100, 80);
                      
                      ctx.fillStyle = 'white';
                      ctx.font = 'bold 32px Arial';
                      ctx.fillText('Interactive Mini-Games & Portfolio Showcase', canvas.width / 2, 640);
                      
                      // Footer
                      ctx.fillStyle = '#1A237E';
                      ctx.fillRect(50, 690, canvas.width - 100, 60);
                      
                      ctx.fillStyle = '#81D4FA';
                      ctx.font = '26px Arial';
                      ctx.fillText('Click the sign again to close', canvas.width / 2, 725);
                    }
                    
                    return canvas;
                  })()]} />
                </meshBasicMaterial>
              </mesh>
            </group>
          </>
        )}
      </group>
      
      {/* Camera controls - always enabled to allow viewing from different angles */}
      <OrbitControls 
        target={cameraTarget} 
        enableZoom={true} 
        enablePan={false}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE, // Allow left-click to rotate/look around
          MIDDLE: THREE.MOUSE.DOLLY, // Middle mouse for zoom
          RIGHT: THREE.MOUSE.ROTATE // Right click also rotates
        }}
        rotateSpeed={1.2} // Faster rotation for more responsive feel
        zoomSpeed={1.5} // Faster zoom
        dampingFactor={0.15} // More damping for smoother camera
        enableDamping={true} // Smooth camera movements
        minDistance={5}
        maxDistance={100} // Allow zooming out much further
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
        minPolarAngle={0.1} // Prevent looking directly from above
        
        // Wider limits for horizontal rotation
        minAzimuthAngle={-Math.PI} // Full 360-degree rotation
        maxAzimuthAngle={Math.PI}
        
        // Important: Add event handlers to allow clicks to work on houses
        // This makes OrbitControls more cooperative with other click handlers
        onStart={(e) => {
          // Cast event to appropriate type since OrbitControls' type definitions are complex
          const event = e as unknown as MouseEvent;
          
          // Only start rotation if we've determined it's a drag (not a click)
          if (event && !window.isMouseRotating && 'button' in event && event.button === 0) {
            // Prevent orbit controls from handling this event if it's a click
            event.stopPropagation?.();
          }
        }}
      />
    </>
  );
};

export default Experience;
