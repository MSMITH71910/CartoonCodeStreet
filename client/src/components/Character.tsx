import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { ControlName } from "../lib/constants";
import { usePortfolio } from "../lib/stores/usePortfolio";
import { useAudio } from "../lib/stores/useAudio";
import { useInteraction } from "../lib/stores/useInteraction";

const Character = () => {
  const characterRef = useRef<THREE.Group>(null);
  const { setCharacterRef, isViewingProject } = usePortfolio();
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [rotation, setRotation] = useState(0);
  const { playHit, playSuccess } = useAudio();
  
  // Interaction state
  const { 
    interactionType, 
    interactionPosition, 
    interactionRotation,
    isSitting,
    isOnSeesaw,
    endInteraction
  } = useInteraction();
  
  // Animation states
  const [isMoving, setIsMoving] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  
  // Get keyboard controls
  const forward = useKeyboardControls((state) => state[ControlName.forward]);
  const backward = useKeyboardControls((state) => state[ControlName.backward]);
  const leftward = useKeyboardControls((state) => state[ControlName.leftward]);
  const rightward = useKeyboardControls((state) => state[ControlName.rightward]);
  const interact = useKeyboardControls((state) => state[ControlName.interact]);

  // Register character reference to the store
  useEffect(() => {
    setCharacterRef(characterRef);
    console.log("Character ref registered to portfolio store");
  }, [setCharacterRef]);

  // Handle interactions
  useEffect(() => {
    if (interact && interactionType === "none") {
      // If player is pressing interact, try to end current interaction
      console.log("Trying to end interaction on button press");
    } else if (interact && interactionType !== "none") {
      // If already interacting and pressing interact, end interaction
      console.log("Ending interaction on button press");
      endInteraction();
      playHit();
    }
  }, [interact, interactionType, endInteraction, playHit]);

  // Character movement and animation
  useFrame((state, delta) => {
    if (!characterRef.current || isViewingProject) return;
    
    // If in an interaction that requires positioning, update character position
    if (interactionPosition && interactionRotation !== null) {
      if (interactionType === "sitting" || interactionType === "seesaw") {
        // Snap to interaction position
        characterRef.current.position.copy(interactionPosition);
        characterRef.current.rotation.y = interactionRotation;
        
        // Don't allow movement while in these interactions
        return;
      }
    }
    
    // Regular character movement logic
    const speed = 5; // Base speed
    const turnSpeed = 2.5; // Rotation speed
    
    let movingForward = 0;
    let rotating = 0;
    
    // Process keyboard inputs and update velocities
    if (forward) {
      movingForward = 1;
      setIsMoving(true);
      
      // Moving breaks out of certain interactions
      if (interactionType !== "none") {
        endInteraction();
      }
    } else if (backward) {
      movingForward = -0.5; // Move backward at half speed
      setIsMoving(true);
      
      // Moving breaks out of certain interactions
      if (interactionType !== "none") {
        endInteraction();
      }
    } else {
      movingForward = 0;
      setIsMoving(false);
    }
    
    if (leftward) {
      rotating = 1;
    } else if (rightward) {
      rotating = -1;
    } else {
      rotating = 0;
    }
    
    // Update rotation
    const newRotation = rotation + rotating * turnSpeed * delta;
    setRotation(newRotation);
    characterRef.current.rotation.y = newRotation;
    
    // Calculate forward direction based on character rotation
    // Using (0, 0, 1) instead of (0, 0, -1) to move in the correct direction
    const forwardDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), newRotation);
    
    // Apply movement
    const newVelocity = forwardDir.multiplyScalar(movingForward * speed * delta);
    characterRef.current.position.add(newVelocity);
    
    // Update character position
    setVelocity(newVelocity);
    
    // Update animation time for skating motion
    if (isMoving) {
      setAnimationTime((prev) => prev + delta * 5);
    }
    
    // Simple boundary constraints (keep character within street area)
    const bounds = {
      minX: -20,
      maxX: 20,
      minZ: -50,
      maxZ: 50
    };
    
    characterRef.current.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, characterRef.current.position.x));
    characterRef.current.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, characterRef.current.position.z));
    
    // Log character position occasionally for debugging
    if (Math.random() < 0.05) {
      console.log(`Character position: (${characterRef.current.position.x.toFixed(2)}, ${characterRef.current.position.y.toFixed(2)}, ${characterRef.current.position.z.toFixed(2)})`);
    }
  });

  // Debug logging for controls
  useEffect(() => {
    console.log(`Controls: forward=${forward}, backward=${backward}, left=${leftward}, right=${rightward}, interact=${interact}`);
  }, [forward, backward, leftward, rightward, interact]);

  return (
    <group ref={characterRef} position={[0, 0.15, 5]}>
      {/* 
        Render different character styles based on interaction:
        - Regular standing character when not interacting
        - Seated character when sitting on a bench
        - Special pose for seesaw interaction
        - Specific poses for other interactions
      */}
      {interactionType === "sitting" || interactionType === "seesaw" ? (
        // Completely redesigned seated character
        <group position={[0, 0.15, 0]}>
          {/* Main body (sitting upright on bench) */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[0.4, 0.5, 0.25]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Head (properly placed above body) */}
          <mesh castShadow position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#FFCC00" />
          </mesh>
          
          {/* Eyes (facing forward) */}
          <mesh position={[0.08, 0.90, 0.15]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[-0.08, 0.90, 0.15]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          
          {/* Legs hanging down in front of bench */}
          <mesh castShadow position={[-0.12, 0.05, 0.2]} rotation={[Math.PI / 3, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          <mesh castShadow position={[0.12, 0.05, 0.2]} rotation={[Math.PI / 3, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Lower legs more vertical */}
          <mesh castShadow position={[-0.12, -0.15, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          <mesh castShadow position={[0.12, -0.15, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Rollerblades at the end of legs */}
          <mesh castShadow position={[-0.12, -0.25, 0.6]}>
            <boxGeometry args={[0.12, 0.06, 0.3]} />
            <meshStandardMaterial color="#E53935" />
          </mesh>
          
          <mesh castShadow position={[0.12, -0.25, 0.6]}>
            <boxGeometry args={[0.12, 0.06, 0.3]} />
            <meshStandardMaterial color="#E53935" />
          </mesh>
          
          {/* Arms resting on sides/lap */}
          <mesh castShadow position={[0.25, 0.25, 0.1]} rotation={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          <mesh castShadow position={[-0.25, 0.25, 0.1]} rotation={[0.3, 0, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
        </group>
      ) : (
        // Regular standing character
        <group>
          {/* Character body */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <capsuleGeometry args={[0.3, 1, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Character head */}
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
          
          {/* Left rollerblade */}
          <group position={[-0.2, 0, 0]}>
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[0, 0, isMoving ? Math.sin(animationTime) * 0.2 : 0]}
            >
              <boxGeometry args={[0.2, 0.1, 0.5]} />
              <meshStandardMaterial color="#E53935" />
            </mesh>
            
            {/* Wheels */}
            <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
          
          {/* Right rollerblade */}
          <group position={[0.2, 0, 0]}>
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[0, 0, isMoving ? -Math.sin(animationTime) * 0.2 : 0]}
            >
              <boxGeometry args={[0.2, 0.1, 0.5]} />
              <meshStandardMaterial color="#E53935" />
            </mesh>
            
            {/* Wheels */}
            <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
          
          {/* Arms - animate based on movement */}
          <mesh 
            castShadow 
            position={[0.5, 1.0, 0]} 
            rotation={[0, 0, isMoving ? Math.sin(animationTime) * 0.5 : 0]}
          >
            <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          <mesh 
            castShadow 
            position={[-0.5, 1.0, 0]} 
            rotation={[0, 0, isMoving ? -Math.sin(animationTime) * 0.5 : 0]}
          >
            <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default Character;
