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
      characterDirection.negate(); // Look behind character
      
      // Position camera behind character at a distance of 8 units and 4 units up
      // This position is our default when not in mouse-look mode
      cameraIdealPosition.copy(characterPosition)
        .add(characterDirection.multiplyScalar(8))
        .add(new THREE.Vector3(0, 4, 0));
      
      // Only interpolate camera position if not actively rotating with mouse
      // This allows the OrbitControls to take over during mouse rotation
      if (!window.isMouseRotating) {
        camera.position.lerp(cameraIdealPosition, 0.05);
      }
      
      // Update the camera's target to be slightly ahead of the character
      const lookTarget = new THREE.Vector3().copy(characterPosition);
      lookTarget.y += 1; // Look slightly above character
      
      // Update the camera target in the portfolio store
      cameraTarget.copy(lookTarget);
      
      // Only update lookAt if not currently using orbit controls
      if (!window.isMouseRotating) {
        camera.lookAt(lookTarget);
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
      {/* Main scene lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Scene environment */}
      <Street />
      
      {/* Player character */}
      <Character />
      
      {/* Direct street sign implementation - very simple */}
      <group position={[0, 0, 15]} rotation={[0, Math.PI, 0]}>
        {/* Posts */}
        <mesh castShadow position={[-2, 2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        <mesh castShadow position={[2, 2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
          <meshStandardMaterial color="#8B4513" />
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
          <meshStandardMaterial color={signHovered ? "#4285F4" : "#1E88E5"} />
        </mesh>
        
        {/* Sign text area */}
        <mesh position={[0, 3.5, 0.12]}>
          <boxGeometry args={[4.5, 1.5, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Sign text - Top Section */}
        <mesh position={[0, 3.7, 0.15]}>
          <planeGeometry args={[4, 0.6]} />
          <meshBasicMaterial color="#0D47A1" />
        </mesh>
        
        {/* Sign text - Bottom Section */}
        <mesh position={[0, 3.3, 0.15]}>
          <planeGeometry args={[4, 0.6]} />
          <meshBasicMaterial color="#1565C0" />
        </mesh>
        
        {/* Create white bars to represent text */}
        <mesh position={[0, 3.7, 0.16]}>
          <planeGeometry args={[3.5, 0.1]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        
        <mesh position={[0, 3.3, 0.16]}>
          <planeGeometry args={[3, 0.1]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Info panel when clicked */}
        {showSignInfo && (
          <group position={[0, 3.5, 1]}>
            {/* Background panel */}
            <mesh receiveShadow>
              <boxGeometry args={[6, 4, 0.1]} />
              <meshStandardMaterial color="#333333" transparent opacity={0.9} />
            </mesh>
            
            {/* Header bar */}
            <mesh position={[0, 1.7, 0.06]}>
              <boxGeometry args={[5.8, 0.6, 0.02]} />
              <meshStandardMaterial color="#1A237E" />
            </mesh>
            
            {/* Border */}
            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[5.9, 3.9, 0.01]} />
              <meshStandardMaterial color="#555555" />
            </mesh>
            
            {/* Text indicators represented by colored bars */}
            <mesh position={[0, 1.7, 0.07]}>
              <boxGeometry args={[3, 0.3, 0.01]} />
              <meshStandardMaterial color="#FFEB3B" />
            </mesh>
            
            <mesh position={[0, 0.8, 0.07]}>
              <boxGeometry args={[5, 0.8, 0.01]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            
            <mesh position={[0, -0.3, 0.07]}>
              <boxGeometry args={[5, 0.8, 0.01]} />
              <meshStandardMaterial color="#E0E0E0" />
            </mesh>
            
            {/* Footer */}
            <mesh position={[0, -1.7, 0.06]}>
              <boxGeometry args={[5.8, 0.6, 0.02]} />
              <meshStandardMaterial color="#1A237E" />
            </mesh>
            
            <mesh position={[0, -1.7, 0.07]}>
              <boxGeometry args={[4, 0.3, 0.01]} />
              <meshStandardMaterial color="#4FC3F7" />
            </mesh>
          </group>
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
        rotateSpeed={0.8} // Slightly faster rotation for more responsive feel
        zoomSpeed={1.2} // Slightly faster zoom
        dampingFactor={0.1} // Add a small damping effect
        enableDamping={true} // Smooth camera movements
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
        
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
