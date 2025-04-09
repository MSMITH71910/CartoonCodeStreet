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
    if (characterRef.current && !isViewingProject) {
      // Get character position
      const characterPosition = characterRef.current.position;
      
      // Calculate camera target position (slightly above and behind character)
      const cameraIdealPosition = new THREE.Vector3();
      const characterDirection = new THREE.Vector3();
      
      // Get character's forward direction (assume character is looking along negative Z axis)
      characterRef.current.getWorldDirection(characterDirection);
      characterDirection.negate(); // Look behind character
      
      // Position camera behind character at a distance of 8 units and 4 units up
      cameraIdealPosition.copy(characterPosition)
        .add(characterDirection.multiplyScalar(8))
        .add(new THREE.Vector3(0, 4, 0));
      
      // Smoothly interpolate current camera position toward ideal position
      camera.position.lerp(cameraIdealPosition, 0.05);
      
      // Also update the camera target (look at point) to be slightly ahead of character
      const lookTarget = new THREE.Vector3().copy(characterPosition);
      lookTarget.y += 1; // Look slightly above character
      
      // Update the camera target in the portfolio store
      cameraTarget.copy(lookTarget);
      camera.lookAt(lookTarget);
    }
  });

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
      
      {/* Debug camera controls - disabled during normal gameplay */}
      {isViewingProject && <OrbitControls target={cameraTarget} enableZoom={false} />}
    </>
  );
};

export default Experience;
