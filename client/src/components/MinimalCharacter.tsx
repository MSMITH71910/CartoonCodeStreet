import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { ControlName } from "../lib/constants";
import { usePortfolio } from "../lib/stores/usePortfolio";

const MinimalCharacter = () => {
  // Core refs and states
  const characterRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  const { setCharacterRef } = usePortfolio();
  
  // Register character with portfolio store
  useEffect(() => {
    if (characterRef.current) {
      setCharacterRef(characterRef);
      console.log("Character ref registered to portfolio store");
    }
  }, [setCharacterRef]);

  // Define keyboard controls outside the frame 
  const forward = useKeyboardControls<ControlName>(state => state.forward);
  const backward = useKeyboardControls<ControlName>(state => state.backward);
  const leftward = useKeyboardControls<ControlName>(state => state.leftward);
  const rightward = useKeyboardControls<ControlName>(state => state.rightward);

  // Animation frames
  useFrame((state, delta) => {
    if (!characterRef.current) return;
    
    // Movement parameters
    const speed = 5;
    const turnSpeed = 2;
    
    // Apply rotation
    if (leftward) {
      const newRotation = rotation - turnSpeed * delta;
      setRotation(newRotation);
      characterRef.current.rotation.y = newRotation;
      console.log("Turning left");
    }
    
    if (rightward) {
      const newRotation = rotation + turnSpeed * delta;
      setRotation(newRotation);
      characterRef.current.rotation.y = newRotation;
      console.log("Turning right");
    }
    
    // Apply movement
    if (forward) {
      // Calculate forward direction based on rotation
      const forwardDir = new THREE.Vector3(0, 0, 1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), characterRef.current.rotation.y);
      
      // Apply movement
      const moveAmount = speed * delta;
      const movement = forwardDir.multiplyScalar(moveAmount);
      characterRef.current.position.add(movement);
      console.log("Moving forward");
    }
    
    if (backward) {
      // Calculate backward direction based on rotation
      const backwardDir = new THREE.Vector3(0, 0, -1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), characterRef.current.rotation.y);
      
      // Apply movement (slower than forward)
      const moveAmount = (speed * 0.5) * delta;
      const movement = backwardDir.multiplyScalar(-moveAmount);
      characterRef.current.position.add(movement);
      console.log("Moving backward");
    }
    
    // Simple boundary constraints
    if (characterRef.current) {
      const bounds = {
        minX: -20,
        maxX: 20,
        minZ: -50,
        maxZ: 50
      };
      
      characterRef.current.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, characterRef.current.position.x));
      characterRef.current.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, characterRef.current.position.z));
    }
  });

  return (
    <group ref={characterRef} position={[0, 0.15, 5]}>
      {/* Simple character - just a colored box with a head */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 1.2, 0.3]} />
        <meshStandardMaterial color="#4285F4" />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFCC00" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.1, 1.7, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[-0.1, 1.7, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      {/* Rollerblades */}
      <mesh castShadow position={[-0.2, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.5]} />
        <meshStandardMaterial color="#E53935" />
      </mesh>
      
      <mesh castShadow position={[0.2, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.5]} />
        <meshStandardMaterial color="#E53935" />
      </mesh>
    </group>
  );
};

export default MinimalCharacter;