import React, { useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Street from "./Street";
import Character from "./Character";
import { usePortfolio } from "../lib/stores/usePortfolio";
import { useAudio } from "../lib/stores/useAudio";
import { useStreetSign } from "../lib/stores/useStreetSign";

const Experience = () => {
  const { camera } = useThree();
  const { characterRef, cameraTarget, isViewingProject } = usePortfolio();
  const { playHit } = useAudio();
  const [signHovered, setSignHovered] = useState(false);
  const { toggleDetails } = useStreetSign();
  
  const handleSignClick = () => {
    toggleDetails();
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

  // Use the street sign store
  const { setIsNearSign } = useStreetSign();
  
  // Check if character is near the sign
  useFrame(() => {
    if (characterRef && characterRef.current) {
      const characterPosition = characterRef.current.position;
      const signPosition = new THREE.Vector3(0, 0, 15);
      const distance = characterPosition.distanceTo(signPosition);
      
      // Show overlay when within 10 units of the sign
      setIsNearSign(distance < 10);
    }
  });

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
      
      {/* Simple street sign implementation - no complex text rendering */}
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
        
        {/* Simple white background for text - both sides */}
        <mesh position={[0, 3.5, 0.12]}>
          <boxGeometry args={[4.5, 1.5, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
        
        <mesh position={[0, 3.5, -0.12]}>
          <boxGeometry args={[4.5, 1.5, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Blue accent strip on top - both sides */}
        <mesh position={[0, 4.1, 0.14]}>
          <boxGeometry args={[4.6, 0.2, 0.01]} />
          <meshBasicMaterial color="#0D47A1" side={THREE.DoubleSide} />
        </mesh>
        
        <mesh position={[0, 4.1, -0.14]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[4.6, 0.2, 0.01]} />
          <meshBasicMaterial color="#0D47A1" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Blue accent strip on bottom - both sides */}
        <mesh position={[0, 2.9, 0.14]}>
          <boxGeometry args={[4.6, 0.2, 0.01]} />
          <meshBasicMaterial color="#0D47A1" side={THREE.DoubleSide} />
        </mesh>
        
        <mesh position={[0, 2.9, -0.14]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[4.6, 0.2, 0.01]} />
          <meshBasicMaterial color="#0D47A1" side={THREE.DoubleSide} />
        </mesh>
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
