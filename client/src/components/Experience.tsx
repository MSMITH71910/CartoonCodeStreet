import { useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Street from "./Street";
import Character from "./Character";
import { usePortfolio } from "../lib/stores/usePortfolio";

const Experience = () => {
  const { camera } = useThree();
  const { characterRef, cameraTarget, isViewingProject } = usePortfolio();

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
  
  // Add mouse event listeners to track when mouse look is active
  useEffect(() => {
    // Flag to track if mouse button is held down for rotation
    window.isMouseRotating = false;
    
    // Event handlers for mouse
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        window.isMouseRotating = true;
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        window.isMouseRotating = false;
      }
    };
    
    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup function
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
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
      />
    </>
  );
};

export default Experience;
