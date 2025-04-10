import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { ControlName } from "../lib/constants";
import { usePortfolio } from "../lib/stores/usePortfolio";
import { useAudio } from "../lib/stores/useAudio";
import { useInteraction } from "../lib/stores/useInteraction";

// Super simple character that focuses just on movement
const BasicCharacter = () => {
  // Core refs and states
  const characterRef = useRef<THREE.Group>(null);
  const { setCharacterRef, isViewingProject } = usePortfolio();
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const { playHit, playSuccess } = useAudio();
  
  // Animation states
  const [isDancing, setIsDancing] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [waveArm, setWaveArm] = useState<'left' | 'right'>('right');
  const [animationTime, setAnimationTime] = useState(0);
  
  // Get keyboard controls from Drei's useKeyboardControls 
  const [, getKeys] = useKeyboardControls<ControlName>();
  
  // Interaction state
  const { 
    interactionType, 
    interactionPosition, 
    interactionRotation,
    endInteraction
  } = useInteraction();

  // Register character reference to the store
  useEffect(() => {
    setCharacterRef(characterRef);
    console.log("Character ref registered to portfolio store");
  }, [setCharacterRef]);

  // Character movement and animation
  useFrame((state, delta) => {
    if (!characterRef.current || isViewingProject) return;
    
    // Get current keyboard state
    const keys = getKeys();
    
    // Debugging keys
    if (Math.random() < 0.01) {
      console.log("Keys state:", keys);
    }
    
    // If in an interaction that requires positioning, update character position
    if (interactionPosition && interactionRotation !== null && interactionType === "seesaw") {
      characterRef.current.position.copy(interactionPosition);
      characterRef.current.rotation.y = interactionRotation;
      return; // Skip movement when in special interaction
    }
    
    // Movement parameters
    const speed = 5;
    const turnSpeed = 3.5;
    
    // Determine if moving
    let movingForward = 0;
    if (keys.forward) {
      movingForward = 1;
      setIsMoving(true);
      if (interactionType !== "none") endInteraction();
    } else if (keys.backward) {
      movingForward = -0.5;
      setIsMoving(true);
      if (interactionType !== "none") endInteraction();
    } else {
      movingForward = 0;
      setIsMoving(false);
    }
    
    // Handle rotation
    let newRotation = rotation;
    if (keys.leftward) {
      newRotation = rotation - turnSpeed * delta;
      console.log(`LEFT key pressed, rotating to ${newRotation.toFixed(2)}`);
      setRotation(newRotation);
    }
    
    if (keys.rightward) {
      newRotation = rotation + turnSpeed * delta;
      console.log(`RIGHT key pressed, rotating to ${newRotation.toFixed(2)}`);
      setRotation(newRotation);
    }
    
    // Apply rotation to mesh
    if (characterRef.current) {
      characterRef.current.rotation.y = newRotation;
    }
    
    // Calculate forward direction based on rotation
    const forwardDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), newRotation);
    
    // Apply movement
    if (movingForward !== 0 && characterRef.current) {
      const moveAmount = movingForward * speed * delta;
      const movement = forwardDir.clone().multiplyScalar(moveAmount);
      characterRef.current.position.add(movement);
    }
    
    // Update animation time for skating motion
    if (isMoving) {
      setAnimationTime(prev => prev + delta * 5);
    }
    
    // Handle dancing
    if (keys.dance && !isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("DANCE animation triggered!");
      setIsDancing(true);
      setIsWaving(false);
      
      // Auto-stop after 3 seconds
      setTimeout(() => {
        setIsDancing(false);
      }, 3000);
    }
    
    // Handle left wave
    if (keys.waveLeft && !isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("LEFT WAVE animation triggered!");
      setIsDancing(false);
      setIsWaving(true);
      setWaveArm('left');
      
      // Auto-stop after 3 seconds
      setTimeout(() => {
        setIsWaving(false);
      }, 3000);
    }
    
    // Handle right wave
    if (keys.waveRight && !isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("RIGHT WAVE animation triggered!");
      setIsDancing(false);
      setIsWaving(true);
      setWaveArm('right');
      
      // Auto-stop after 3 seconds
      setTimeout(() => {
        setIsWaving(false);
      }, 3000);
    }
    
    // Animation time for dancing/waving
    if (isDancing || isWaving) {
      setAnimationTime(prev => prev + delta * 8);
    }
    
    // Stop animations when moving
    if (isMoving && (isDancing || isWaving)) {
      setIsDancing(false);
      setIsWaving(false);
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
      
      // Log position occasionally
      if (Math.random() < 0.01) {
        console.log(`Character position: (${characterRef.current.position.x.toFixed(2)}, ${characterRef.current.position.y.toFixed(2)}, ${characterRef.current.position.z.toFixed(2)})`);
      }
    }
  });

  // Handle interaction key press
  useEffect(() => {
    const checkInteractions = () => {
      // Manual check instead of using subscribe
      const keys = getKeys();
      if (keys.interact) {
        if (interactionType !== "none") {
          console.log("Ending interaction on button press");
          endInteraction();
          playHit();
        } else {
          console.log("Trying to interact");
        }
      }
    };
    
    // Set up interval to check for interaction key
    const intervalId = setInterval(checkInteractions, 100);
    return () => clearInterval(intervalId);
  }, [interactionType, endInteraction, playHit, getKeys]);

  // Click handlers for character parts
  const handleLegClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    
    if (!isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Dancing animation triggered by click!");
      setIsDancing(true);
      setAnimationTime(0);
      playSuccess();
    }
  };
  
  const handleLeftArmClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    
    if (!isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Left arm wave animation triggered by click!");
      setIsWaving(true);
      setWaveArm('left');
      setAnimationTime(0);
      playHit();
    }
  };
  
  const handleRightArmClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    
    if (!isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Right arm wave animation triggered by click!");
      setIsWaving(true);
      setWaveArm('right');
      setAnimationTime(0);
      playHit();
    }
  };

  return (
    <group ref={characterRef} position={[0, 0.15, 5]}>
      {/* 
        Render different character styles based on interaction:
        - Regular standing character when not interacting
        - Special pose for seesaw interaction
      */}
      {interactionType === "seesaw" ? (
        // Simple seated character facing directly forward
        <group>
          {/* Torso - positioned correctly for seesaw */}
          <mesh castShadow position={[0, 0.05, 0.05]}>
            <boxGeometry args={[0.3, 0.3, 0.2]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Head - facing forward */}
          <mesh castShadow position={[0, 0.35, 0.05]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FFCC00" />
          </mesh>
          
          {/* Eyes - facing directly forward */}
          <mesh position={[0.05, 0.4, 0.16]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[-0.05, 0.4, 0.16]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          
          {/* Upper legs hanging down from seesaw */}
          <mesh castShadow position={[-0.08, -0.25, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          <mesh castShadow position={[0.08, -0.25, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Lower legs - bent at knee */}
          <mesh castShadow position={[-0.08, -0.45, 0.0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          <mesh castShadow position={[0.08, -0.45, 0.0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Rollerblades at the end of legs */}
          <mesh castShadow position={[-0.08, -0.6, 0.05]}>
            <boxGeometry args={[0.1, 0.05, 0.25]} />
            <meshStandardMaterial color="#E53935" />
          </mesh>
          
          <mesh castShadow position={[0.08, -0.6, 0.05]}>
            <boxGeometry args={[0.1, 0.05, 0.25]} />
            <meshStandardMaterial color="#E53935" />
          </mesh>
          
          {/* Arms */}
          <mesh castShadow position={[0.2, -0.05, 0.1]} rotation={[0.3, 0, -0.2]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          <mesh castShadow position={[-0.2, -0.05, 0.1]} rotation={[0.3, 0, 0.2]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
        </group>
      ) : (
        // Standing character for normal gameplay
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
          
          {/* Left rollerblade with animation */}
          <group 
            position={[
              -0.2, 
              isDancing ? Math.sin(animationTime) * 0.3 : 0, 
              0
            ]}
          >
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[
                isDancing ? Math.sin(animationTime * 2) * 0.3 : 0,
                0, 
                isMoving ? Math.sin(animationTime) * 0.2 : 0
              ]}
              onClick={handleLegClick}
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
          
          {/* Right rollerblade with animation */}
          <group 
            position={[
              0.2, 
              isDancing ? -Math.sin(animationTime) * 0.3 : 0, 
              0
            ]}
          >
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[
                isDancing ? -Math.sin(animationTime * 2) * 0.3 : 0,
                0, 
                isMoving ? -Math.sin(animationTime) * 0.2 : 0
              ]}
              onClick={handleLegClick}
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
          
          {/* Right arm with waving animation */}
          <group position={[0.5, 1.0, 0]}>
            <mesh 
              castShadow 
              onClick={handleRightArmClick}
              rotation={[
                isWaving && waveArm === 'right' ? Math.sin(animationTime) * 0.8 : 0,
                0, 
                isMoving ? Math.sin(animationTime) * 0.5 : 0
              ]}
            >
              <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
              <meshStandardMaterial color="#4285F4" />
            </mesh>
          </group>
          
          {/* Left arm with waving animation */}
          <group position={[-0.5, 1.0, 0]}>
            <mesh 
              castShadow 
              onClick={handleLeftArmClick}
              rotation={[
                isWaving && waveArm === 'left' ? Math.sin(animationTime) * 0.8 : 0,
                0, 
                isMoving ? -Math.sin(animationTime) * 0.5 : 0
              ]}
            >
              <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
              <meshStandardMaterial color="#4285F4" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

export default BasicCharacter;