import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolio } from "../lib/stores/usePortfolio";
import { useAudio } from "../lib/stores/useAudio";
import { useInteraction } from "../lib/stores/useInteraction";
import { useKeyboard } from "../hooks/useKeyboard";
import { useAnimations, AnimationType } from "../hooks/useAnimations";

const Character = () => {
  // Core refs and states
  const characterRef = useRef<THREE.Group>(null);
  const { setCharacterRef, isViewingProject } = usePortfolio();
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const { playHit, playSuccess } = useAudio();
  
  // New direct keyboard handling
  const keys = useKeyboard();
  
  // New animation system
  const {
    animationType,
    animationTime,
    isAnimating,
    startAnimation,
    stopAnimation,
    updateAnimation
  } = useAnimations(3000); // 3 seconds animation duration
  
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
  
  // Animation handlers for special moves
  useEffect(() => {
    // Handle animation triggers from keyboard
    if (keys.dance && !isMoving && interactionType === "none" && !isAnimating) {
      console.log("ANIMATION: Dance key pressed");
      startAnimation('dance');
      playSuccess();
    }
    
    if (keys.waveLeft && !isMoving && interactionType === "none" && !isAnimating) {
      console.log("ANIMATION: Wave left key pressed");
      startAnimation('waveLeft');
      playHit();
    }
    
    if (keys.waveRight && !isMoving && interactionType === "none" && !isAnimating) {
      console.log("ANIMATION: Wave right key pressed");
      startAnimation('waveRight');
      playHit();
    }
    
    // Stop animation if movement starts
    if (isMoving && isAnimating) {
      console.log("ANIMATION: Stopped due to movement");
      stopAnimation();
    }
  }, [keys, isMoving, interactionType, isAnimating, startAnimation, stopAnimation, playHit, playSuccess]);
  
  // Handle interactions with E key
  useEffect(() => {
    if (keys.interact && interactionType === "none") {
      console.log("INTERACTION: Trying to interact");
    } else if (keys.interact && interactionType !== "none") {
      console.log("INTERACTION: Ending current interaction");
      endInteraction();
      playHit();
    }
  }, [keys.interact, interactionType, endInteraction, playHit]);
  
  // Main character movement and physics update
  useFrame((state, delta) => {
    if (!characterRef.current || isViewingProject) return;
    
    // Update animations
    updateAnimation(delta);
    
    // If in a fixed interaction (like seesaw), position character accordingly
    if (interactionPosition && interactionRotation !== null && interactionType === "seesaw") {
      characterRef.current.position.copy(interactionPosition);
      characterRef.current.rotation.y = interactionRotation;
      return; // Skip normal movement when in special interaction
    }
    
    // Movement parameters
    const speed = 5;
    const turnSpeed = 3.5;
    
    // Determine movement direction and speed
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
    
    // Rotation handling
    let rotationChanged = false;
    let newRotation = rotation;
    
    if (keys.leftward) {
      newRotation = rotation - turnSpeed * delta;
      rotationChanged = true;
      console.log(`LEFT key pressed, rotating to ${newRotation.toFixed(2)}`);
    }
    
    if (keys.rightward) {
      newRotation = rotation + turnSpeed * delta;
      rotationChanged = true;
      console.log(`RIGHT key pressed, rotating to ${newRotation.toFixed(2)}`);
    }
    
    // Apply rotation changes
    if (rotationChanged) {
      setRotation(newRotation);
      characterRef.current.rotation.y = newRotation;
    }
    
    // Calculate forward direction based on rotation
    const forwardDir = new THREE.Vector3(0, 0, 1)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), characterRef.current.rotation.y);
    
    // Apply movement
    if (movingForward !== 0) {
      const moveAmount = movingForward * speed * delta;
      const movement = forwardDir.clone().multiplyScalar(moveAmount);
      characterRef.current.position.add(movement);
      
      // Log movement occasionally
      if (Math.random() < 0.05) {
        console.log(`Moving: dir=[${forwardDir.x.toFixed(2)}, ${forwardDir.y.toFixed(2)}, ${forwardDir.z.toFixed(2)}], amount=${moveAmount.toFixed(2)}`);
      }
    }
    
    // Boundary constraints
    const bounds = {
      minX: -20,
      maxX: 20,
      minZ: -50,
      maxZ: 50
    };
    
    characterRef.current.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, characterRef.current.position.x));
    characterRef.current.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, characterRef.current.position.z));
    
    // Log position occasionally
    if (Math.random() < 0.05) {
      console.log(`Character position: (${characterRef.current.position.x.toFixed(2)}, ${characterRef.current.position.y.toFixed(2)}, ${characterRef.current.position.z.toFixed(2)})`);
    }
  });
  
  // Click handlers for the character parts
  const handleLegClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    
    if (!isMoving && !isAnimating && interactionType === "none") {
      console.log("ANIMATION: Dance triggered by click");
      startAnimation('dance');
      playSuccess();
    }
  };
  
  const handleLeftArmClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    
    if (!isMoving && !isAnimating && interactionType === "none") {
      console.log("ANIMATION: Left wave triggered by click");
      startAnimation('waveLeft');
      playHit();
    }
  };
  
  const handleRightArmClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    
    if (!isMoving && !isAnimating && interactionType === "none") {
      console.log("ANIMATION: Right wave triggered by click");
      startAnimation('waveRight');
      playHit();
    }
  };
  
  // Render the character
  return (
    <group ref={characterRef} position={[0, 0.15, 5]}>
      {interactionType === "seesaw" ? (
        // Seated character for seesaw interaction
        <group>
          {/* Torso */}
          <mesh castShadow position={[0, 0.05, 0.05]}>
            <boxGeometry args={[0.3, 0.3, 0.2]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Head */}
          <mesh castShadow position={[0, 0.35, 0.05]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FFCC00" />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[0.05, 0.4, 0.16]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[-0.05, 0.4, 0.16]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="black" />
          </mesh>
          
          {/* Upper legs */}
          <mesh castShadow position={[-0.08, -0.25, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          <mesh castShadow position={[0.08, -0.25, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Lower legs */}
          <mesh castShadow position={[-0.08, -0.45, 0.0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          <mesh castShadow position={[0.08, -0.45, 0.0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="#4285F4" />
          </mesh>
          
          {/* Rollerblades */}
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
              animationType === 'dance' ? Math.sin(animationTime) * 0.3 : 0, 
              0
            ]}
          >
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[
                animationType === 'dance' ? Math.sin(animationTime * 2) * 0.3 : 0,
                0, 
                isMoving ? Math.sin(animationTime) * 0.2 : 0
              ]}
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
              animationType === 'dance' ? -Math.sin(animationTime) * 0.3 : 0, 
              0
            ]}
          >
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[
                animationType === 'dance' ? -Math.sin(animationTime * 2) * 0.3 : 0,
                0, 
                isMoving ? -Math.sin(animationTime) * 0.2 : 0
              ]}
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
          
          {/* Click area for legs - invisible */}
          <mesh
            position={[0, 0.1, 0]}
            onClick={handleLegClick}
            visible={false}
          >
            <boxGeometry args={[0.7, 0.3, 0.7]} />
            <meshBasicMaterial color="red" transparent opacity={0.5} />
          </mesh>
          
          {/* Right arm with waving animation */}
          <group position={[0.5, 1.0, 0]}>
            <mesh 
              castShadow 
              rotation={[
                animationType === 'waveRight' ? Math.sin(animationTime) * 0.8 : 0,
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
              rotation={[
                animationType === 'waveLeft' ? Math.sin(animationTime) * 0.8 : 0,
                0, 
                isMoving ? -Math.sin(animationTime) * 0.5 : 0
              ]}
            >
              <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
              <meshStandardMaterial color="#4285F4" />
            </mesh>
          </group>
          
          {/* Right arm clickable area - invisible */}
          <mesh
            position={[0.5, 1.0, 0]}
            onClick={handleRightArmClick}
            visible={false}
          >
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshBasicMaterial color="blue" transparent opacity={0.5} />
          </mesh>
          
          {/* Left arm clickable area - invisible */}
          <mesh
            position={[-0.5, 1.0, 0]}
            onClick={handleLeftArmClick}
            visible={false}
          >
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshBasicMaterial color="blue" transparent opacity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default Character;