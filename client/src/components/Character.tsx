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
  
  // Special interaction animations
  const [isDancing, setIsDancing] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [waveArm, setWaveArm] = useState<'left' | 'right'>('right');
  
  // Get keyboard controls
  const forward = useKeyboardControls((state) => state[ControlName.forward]);
  const backward = useKeyboardControls((state) => state[ControlName.backward]);
  const leftward = useKeyboardControls((state) => state[ControlName.leftward]);
  const rightward = useKeyboardControls((state) => state[ControlName.rightward]);
  const interact = useKeyboardControls((state) => state[ControlName.interact]);
  
  // Animation keyboard controls
  const danceKey = useKeyboardControls((state) => state[ControlName.dance]);
  const waveLeftKey = useKeyboardControls((state) => state[ControlName.waveLeft]);
  const waveRightKey = useKeyboardControls((state) => state[ControlName.waveRight]);

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
      if (interactionType === "seesaw") {
        // Snap to interaction position
        characterRef.current.position.copy(interactionPosition);
        characterRef.current.rotation.y = interactionRotation;
        
        // Don't allow movement while in these interactions
        return;
      }
    }
    
    // Regular character movement logic
    const speed = 5; // Base speed
    const turnSpeed = 3.5; // Increased rotation speed for more responsive turning
    
    let movingForward = 0;
    
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
    
    // FIXED ROTATION HANDLING
    // Use a more direct and forceful approach to rotation
    if (leftward) {
      // Left key pressed: rotate counter-clockwise (subtract from rotation)
      const newRotation = rotation - turnSpeed * delta;
      setRotation(newRotation);
      
      // Force direct rotation update on the mesh
      if (characterRef.current) {
        characterRef.current.rotation.y = newRotation;
      }
      
      // Verbose logging for debugging
      console.log(`LEFT key: New rotation = ${newRotation.toFixed(2)}`);
    } 
    
    if (rightward) {
      // Right key pressed: rotate clockwise (add to rotation)
      const newRotation = rotation + turnSpeed * delta;
      setRotation(newRotation);
      
      // Force direct rotation update on the mesh
      if (characterRef.current) {
        characterRef.current.rotation.y = newRotation;
      }
      
      // Verbose logging for debugging
      console.log(`RIGHT key: New rotation = ${newRotation.toFixed(2)}`);
    }
    
    // Calculate forward direction based on character rotation
    // The forward vector is in positive Z with our camera setup
    const forwardDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), characterRef.current.rotation.y);
    
    // Apply movement along the forward direction
    if (movingForward !== 0) {
      const moveAmount = movingForward * speed * delta;
      const movement = forwardDir.clone().multiplyScalar(moveAmount);
      characterRef.current.position.add(movement);
      
      // Log movement for debugging
      if (Math.random() < 0.05) {
        console.log(`Moving: dir=[${forwardDir.x.toFixed(2)}, ${forwardDir.y.toFixed(2)}, ${forwardDir.z.toFixed(2)}], amount=${moveAmount.toFixed(2)}`);
      }
    }
    
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
  
  // Handle animation key presses
  useEffect(() => {
    // Handle dancing with Z key
    if (danceKey && !isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Dance animation triggered by keyboard!");
      setIsDancing(true);
      setAnimationTime(0);
      playSuccess();
    }
    
    // Handle left arm wave with Q key
    if (waveLeftKey && !isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Left arm wave animation triggered by keyboard!");
      setIsWaving(true);
      setWaveArm('left');
      setAnimationTime(0);
      playHit();
    }
    
    // Handle right arm wave with R key
    if (waveRightKey && !isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Right arm wave animation triggered by keyboard!");
      setIsWaving(true);
      setWaveArm('right');
      setAnimationTime(0);
      playHit();
    }
  }, [danceKey, waveLeftKey, waveRightKey, isMoving, isDancing, isWaving, interactionType, playSuccess, playHit]);
  
  // Update animation time for dancing/waving animations
  useFrame((state, delta) => {
    if (isDancing || isWaving) {
      setAnimationTime(prev => prev + delta * 8); // Faster animation for dancing/waving
    }
  });
  
  // Set timeouts to stop animations after a delay
  useEffect(() => {
    let danceTimer: NodeJS.Timeout;
    let waveTimer: NodeJS.Timeout;
    
    if (isDancing) {
      danceTimer = setTimeout(() => setIsDancing(false), 3000);
    }
    
    if (isWaving) {
      waveTimer = setTimeout(() => setIsWaving(false), 3000);
    }
    
    // Clean up timeouts if component unmounts or animation state changes
    return () => {
      clearTimeout(danceTimer);
      clearTimeout(waveTimer);
    };
  }, [isDancing, isWaving]);
  
  // Handle movement stopping animations
  useEffect(() => {
    if (isMoving && (isDancing || isWaving)) {
      // Stop animations when character starts moving
      setIsDancing(false);
      setIsWaving(false);
    }
  }, [isMoving, isDancing, isWaving]);
  
  // Click handlers for character parts
  const handleLegClick = (e: any) => {
    // Try to stop event propagation
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    if (!isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Dancing animation triggered!");
      setIsDancing(true);
      setAnimationTime(0); // Reset animation timer
      playSuccess(); // Play a sound effect
    }
  };
  
  const handleLeftArmClick = (e: any) => {
    // Try to stop event propagation
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    if (!isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Left arm wave animation triggered!");
      setIsWaving(true);
      setWaveArm('left');
      setAnimationTime(0); // Reset animation timer
      playHit(); // Play a sound effect
    }
  };
  
  const handleRightArmClick = (e: any) => {
    // Try to stop event propagation
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    if (!isMoving && !isDancing && !isWaving && interactionType === "none") {
      console.log("Right arm wave animation triggered!");
      setIsWaving(true);
      setWaveArm('right');
      setAnimationTime(0); // Reset animation timer
      playHit(); // Play a sound effect
    }
  };

  return (
    <group ref={characterRef} position={[0, 0.15, 5]}>
      {/* 
        Render different character styles based on interaction:
        - Regular standing character when not interacting
        - Special pose for seesaw interaction
        - Specific poses for other interactions
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
          
          {/* Arms resting on lap for seesaw */}
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
          
          {/* Left rollerblade with dancing animation */}
          <group position={[-0.2, isDancing ? Math.sin(animationTime) * 0.3 : 0, 0]}>
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[
                isDancing ? Math.sin(animationTime * 2) * 0.3 : 0,
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
          
          {/* Right rollerblade with dancing animation */}
          <group position={[0.2, isDancing ? -Math.sin(animationTime) * 0.3 : 0, 0]}>
            <mesh 
              castShadow 
              position={[0, 0.05, 0]} 
              rotation={[
                isDancing ? -Math.sin(animationTime * 2) * 0.3 : 0,
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
          
          {/* Click area for legs - invisible since we're using keyboard controls now */}
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
          
          {/* Right arm clickable area - hidden since we're using keyboard now */}
          <mesh
            position={[0.5, 1.0, 0]}
            onClick={handleRightArmClick}
            visible={false}
          >
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshBasicMaterial color="blue" transparent opacity={0.5} />
          </mesh>
          
          {/* Left arm clickable area - hidden since we're using keyboard now */}
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
