import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { ControlName, PHYSICS, STREET } from "../lib/constants";
import { usePortfolio } from "../lib/stores/usePortfolio";

// Map keycode to control name for direct DOM event handling
const KEY_MAP: Record<string, ControlName> = {
  'KeyZ': ControlName.dance,
  'KeyQ': ControlName.waveLeft,
  'KeyR': ControlName.waveRight,
};

const WorkingCharacter = () => {
  // References and state
  const characterRef = useRef<THREE.Group>(null);
  const { setCharacterRef } = usePortfolio();
  const [moving, setMoving] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  
  // Animation states - MOVED UP to avoid initialization errors
  const [isDancing, setIsDancing] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [waveArm, setWaveArm] = useState<'left' | 'right'>('left');
  
  // Setup for keyboard controls - FIXED
  const [subscribeKeys, getKeys] = useKeyboardControls();
  
  // We'll use these variables in our useFrame for more responsive control
  const forward = useKeyboardControls((state) => state[ControlName.forward]);
  const backward = useKeyboardControls((state) => state[ControlName.backward]);
  const leftward = useKeyboardControls((state) => state[ControlName.leftward]);
  const rightward = useKeyboardControls((state) => state[ControlName.rightward]);
  const dance = useKeyboardControls((state) => state[ControlName.dance]);
  const waveLeft = useKeyboardControls((state) => state[ControlName.waveLeft]);
  const waveRight = useKeyboardControls((state) => state[ControlName.waveRight]);
  
  // DIRECT KEYBOARD EVENT HANDLERS - bypassing Three.js keyboard system
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.code;
    
    // Only process our special animation keys
    if (key === 'KeyZ' || key === 'KeyQ' || key === 'KeyR') {
      console.log(`DIRECT KEY DOWN DETECTED: ${key}`);
      
      // Process the animation directly
      if (key === 'KeyZ' && !moving && !isDancing && !isWaving) {
        console.log("Direct dance animation triggered!");
        setIsDancing(true);
        setIsWaving(false);
      }
      
      if (key === 'KeyQ' && !moving && !isDancing && !isWaving) {
        console.log("Direct left wave animation triggered!");
        setIsWaving(true);
        setWaveArm('left');
        setIsDancing(false);
      }
      
      if (key === 'KeyR' && !moving && !isDancing && !isWaving) {
        console.log("Direct right wave animation triggered!");
        setIsWaving(true);
        setWaveArm('right');
        setIsDancing(false);
      }
    }
  }, [moving, isDancing, isWaving, setIsDancing, setIsWaving, setWaveArm]);
  
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.code;
    
    // Only process our special animation keys
    if (key === 'KeyZ' || key === 'KeyQ' || key === 'KeyR') {
      console.log(`DIRECT KEY UP DETECTED: ${key}`);
      
      // Stop the relevant animation
      if (key === 'KeyZ' && isDancing) {
        console.log("Direct dance animation stopped!");
        setIsDancing(false);
      }
      
      if (key === 'KeyQ' && isWaving && waveArm === 'left') {
        console.log("Direct left wave animation stopped!");
        setIsWaving(false);
      }
      
      if (key === 'KeyR' && isWaving && waveArm === 'right') {
        console.log("Direct right wave animation stopped!");
        setIsWaving(false);
      }
    }
  }, [isDancing, isWaving, waveArm]);
  
  // Set up direct DOM event listeners for animation keys
  useEffect(() => {
    console.log("Setting up direct keyboard event listeners for animations");
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    console.log("Initial keyboard control state:", {
      forward, backward, leftward, rightward, dance, waveLeft, waveRight
    });
    
    // Cleanup function
    return () => {
      console.log("Removing direct keyboard event listeners");
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, forward, backward, leftward, rightward, dance, waveLeft, waveRight]);
  
  // Register character ref with portfolio store
  useEffect(() => {
    if (characterRef.current) {
      setCharacterRef(characterRef);
      console.log("Character reference set in portfolio store");
    }
  }, [setCharacterRef]);
  
  // COMPLETELY REVISED animation controls to fix issues
  useFrame((state, delta) => {
    // Check keyboard state on every frame for more responsive animations 
    if (dance && !moving && !isDancing && !isWaving) {
      console.log("Dance animation triggered now!");
      setIsDancing(true);
      setIsWaving(false);
      
      // No need for timeout - we'll handle this in the main update loop
    }
    
    if (waveLeft && !moving && !isDancing && !isWaving) {
      console.log("Left wave animation triggered now!");
      setIsWaving(true);
      setWaveArm('left');
      setIsDancing(false);
    }
    
    if (waveRight && !moving && !isDancing && !isWaving) {
      console.log("Right wave animation triggered now!");
      setIsWaving(true);
      setWaveArm('right');
      setIsDancing(false);
    }
    
    // Add auto-timeout for animations - when key is released
    if ((isDancing && !dance) || (isWaving && waveArm === 'left' && !waveLeft) || 
        (isWaving && waveArm === 'right' && !waveRight)) {
      console.log("Animation released, stopping");
      setIsDancing(false);
      setIsWaving(false);
    }
  });
  
  // Main update loop
  useFrame((state, delta) => {
    if (!characterRef.current) return;
    
    // Log keyboard state occasionally for debugging
    if (Math.random() < 0.01) {
      console.log("Keys:", {
        forward, backward, leftward, rightward, dance, waveLeft, waveRight
      });
    }
    
    // Constants for movement
    const speed = PHYSICS.CHARACTER_SPEED;
    const turnSpeed = PHYSICS.CHARACTER_TURN_SPEED;
    
    // Handle rotation - FIXED: Sign was rotating with character because the rotation was backward
    if (leftward) {
      characterRef.current.rotation.y -= turnSpeed * delta;
      console.log("Turning left");
    }
    
    if (rightward) {
      characterRef.current.rotation.y += turnSpeed * delta;
      console.log("Turning right");
    }
    
    // Track if character is moving
    const isMovingNow = forward || backward;
    if (isMovingNow !== moving) {
      setMoving(isMovingNow);
    }
    
    // Handle movement
    if (forward || backward) {
      // Calculate movement direction based on character's rotation
      const direction = new THREE.Vector3();
      // FIXED: Direction was reversed, change to positive Z for forward
      direction.set(0, 0, forward ? 1 : -1);
      direction.applyQuaternion(characterRef.current.quaternion);
      
      // Scale by speed and delta time
      const moveAmount = speed * delta * (forward ? 1 : 0.5);
      direction.multiplyScalar(moveAmount);
      
      // Apply movement
      characterRef.current.position.add(direction);
      
      // Log movement
      if (forward) {
        console.log("Moving forward");
      } else {
        console.log("Moving backward");
      }
    }
    
    // Enforce boundary constraints
    const { position } = characterRef.current;
    position.x = Math.max(STREET.BOUNDARY_MIN_X, Math.min(STREET.BOUNDARY_MAX_X, position.x));
    position.z = Math.max(STREET.BOUNDARY_MIN_Z, Math.min(STREET.BOUNDARY_MAX_Z, position.z));
    
    // Animate legs while moving
    if (moving || isDancing || isWaving) {
      setAnimationTime(prev => prev + delta * (moving ? 5 : 8));
    }
    
    // Stop animations if moving
    if (moving && (isDancing || isWaving)) {
      setIsDancing(false);
      setIsWaving(false);
    }
  });
  
  return (
    <group ref={characterRef} position={[0, 0.15, 5]}>
      {/* Character body */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.3, 1, 16, 8]} />
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
      
      {/* Left rollerblade with animation - ENHANCED ANIMATIONS */}
      <group position={[-0.2, isDancing ? Math.sin(animationTime) * 0.5 : 0, 0]}>
        <mesh 
          castShadow 
          position={[0, 0.05, 0]} 
          rotation={[
            isDancing ? Math.sin(animationTime * 2) * 0.5 : 0,
            0, 
            moving ? Math.sin(animationTime) * 0.2 : 0
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
      
      {/* Right rollerblade with animation - ENHANCED ANIMATIONS */}
      <group position={[0.2, isDancing ? -Math.sin(animationTime) * 0.5 : 0, 0]}>
        <mesh 
          castShadow 
          position={[0, 0.05, 0]} 
          rotation={[
            isDancing ? -Math.sin(animationTime * 2) * 0.5 : 0,
            0, 
            moving ? -Math.sin(animationTime) * 0.2 : 0
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
      
      {/* Right arm with waving animation - ENHANCED */}
      <group position={[0.5, 1.0, 0]}>
        <mesh 
          castShadow 
          rotation={[
            isWaving && waveArm === 'right' ? Math.sin(animationTime) * 1.2 : 0,
            isWaving && waveArm === 'right' ? Math.sin(animationTime * 0.5) * 0.3 : 0, 
            moving ? Math.sin(animationTime) * 0.5 : 0
          ]}
        >
          <capsuleGeometry args={[0.1, 0.6, 8, 4]} />
          <meshStandardMaterial color={isWaving && waveArm === 'right' ? "#FFA500" : "#4285F4"} />
        </mesh>
      </group>
      
      {/* Left arm with waving animation - ENHANCED */}
      <group position={[-0.5, 1.0, 0]}>
        <mesh 
          castShadow 
          rotation={[
            isWaving && waveArm === 'left' ? Math.sin(animationTime) * 1.2 : 0,
            isWaving && waveArm === 'left' ? Math.sin(animationTime * 0.5) * 0.3 : 0,
            moving ? -Math.sin(animationTime) * 0.5 : 0
          ]}
        >
          <capsuleGeometry args={[0.1, 0.6, 8, 4]} />
          <meshStandardMaterial color={isWaving && waveArm === 'left' ? "#FFA500" : "#4285F4"} />
        </mesh>
      </group>
    </group>
  );
};

export default WorkingCharacter;