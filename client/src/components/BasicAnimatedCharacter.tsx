import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { ControlName, PHYSICS, STREET } from "../lib/constants";
import { usePortfolio } from "../lib/stores/usePortfolio";
import { useMobileControls } from "../hooks/useMobileControls";

// Ultra-direct animation tracking
const useDirectKeyPress = (targetKey: string) => {
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  
  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.code === targetKey) {
        setIsKeyPressed(true);
      }
    };
    
    const upHandler = (e: KeyboardEvent) => {
      if (e.code === targetKey) {
        setIsKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);
  
  return isKeyPressed;
};

const BasicAnimatedCharacter = () => {
  // References
  const characterRef = useRef<THREE.Group>(null);
  const { setCharacterRef } = usePortfolio();
  
  // Local state for movement and animation
  const [moving, setMoving] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  
  // Mobile controls integration
  const { getControlState, resetLookDelta } = useMobileControls();
  
  // Direct key press tracking with our custom hook
  const isDancePressed = useDirectKeyPress('KeyZ');
  const isWaveLeftPressed = useDirectKeyPress('KeyQ');
  const isWaveRightPressed = useDirectKeyPress('KeyR');
  
  // Animation states derived from key presses and movement
  const isDancing = isDancePressed && !moving;
  const isWavingLeft = isWaveLeftPressed && !moving && !isDancing;
  const isWavingRight = isWaveRightPressed && !moving && !isDancing && !isWavingLeft;
  
  // Store character ref in portfolio store
  useEffect(() => {
    if (characterRef.current) {
      setCharacterRef(characterRef);
    }
  }, [setCharacterRef]);
  
  // Get keyboard controls from @react-three/drei for movement
  const forward = useKeyboardControls(state => state[ControlName.forward]);
  const backward = useKeyboardControls(state => state[ControlName.backward]);
  const leftward = useKeyboardControls(state => state[ControlName.leftward]);
  const rightward = useKeyboardControls(state => state[ControlName.rightward]);
  
  // Animation update - runs every frame
  useFrame((state, delta) => {
    if (!characterRef.current) return;
    
    // Get mobile control state
    const mobileControls = getControlState();
    
    // Handle movement
    const speed = PHYSICS.CHARACTER_SPEED;
    const turnSpeed = PHYSICS.CHARACTER_TURN_SPEED;
    
    // Combine keyboard and mobile controls for rotation
    let rotationInput = 0;
    if (leftward) rotationInput -= 1;
    if (rightward) rotationInput += 1;
    
    // Add mobile rotation input
    if (mobileControls.isMobile && Math.abs(mobileControls.movement.x) > 0.1) {
      rotationInput += mobileControls.movement.x;
    }
    
    // Apply rotation
    if (Math.abs(rotationInput) > 0.01) {
      characterRef.current.rotation.y += rotationInput * turnSpeed * delta;
    }
    
    // Combine keyboard and mobile controls for forward/backward movement
    let movementInput = 0;
    if (forward) movementInput += 1;
    if (backward) movementInput -= 0.5;
    
    // Add mobile movement input
    if (mobileControls.isMobile && Math.abs(mobileControls.movement.y) > 0.1) {
      movementInput += mobileControls.movement.y;
    }
    
    // Update movement state
    const isMovingNow = Math.abs(movementInput) > 0.01;
    if (isMovingNow !== moving) {
      setMoving(isMovingNow);
    }
    
    // Apply movement
    if (Math.abs(movementInput) > 0.01) {
      // Calculate direction
      const direction = new THREE.Vector3();
      direction.set(0, 0, 1);
      direction.applyQuaternion(characterRef.current.quaternion);
      
      // Apply movement
      const moveAmount = speed * delta * movementInput;
      direction.multiplyScalar(moveAmount);
      characterRef.current.position.add(direction);
    }
    
    // Enforce boundaries
    const { position } = characterRef.current;
    position.x = Math.max(STREET.BOUNDARY_MIN_X, Math.min(STREET.BOUNDARY_MAX_X, position.x));
    position.z = Math.max(STREET.BOUNDARY_MIN_Z, Math.min(STREET.BOUNDARY_MAX_Z, position.z));
    
    // Update animation time (only when needed)
    if (moving || isDancing || isWavingLeft || isWavingRight) {
      setAnimationTime(prev => prev + delta * (moving ? 5 : 8));
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
      
      {/* Left rollerblade with animation */}
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
      
      {/* Right rollerblade with animation */}
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
      
      {/* Right arm with waving animation */}
      <group position={[0.5, 1.0, 0]}>
        <mesh 
          castShadow 
          rotation={[
            isWavingRight ? Math.sin(animationTime) * 1.2 : 0,
            isWavingRight ? Math.sin(animationTime * 0.5) * 0.3 : 0, 
            moving ? Math.sin(animationTime) * 0.5 : 0
          ]}
        >
          <capsuleGeometry args={[0.1, 0.6, 8, 4]} />
          <meshStandardMaterial color={isWavingRight ? "#FFA500" : "#4285F4"} />
        </mesh>
      </group>
      
      {/* Left arm with waving animation */}
      <group position={[-0.5, 1.0, 0]}>
        <mesh 
          castShadow 
          rotation={[
            isWavingLeft ? Math.sin(animationTime) * 1.2 : 0,
            isWavingLeft ? Math.sin(animationTime * 0.5) * 0.3 : 0,
            moving ? -Math.sin(animationTime) * 0.5 : 0
          ]}
        >
          <capsuleGeometry args={[0.1, 0.6, 8, 4]} />
          <meshStandardMaterial color={isWavingLeft ? "#FFA500" : "#4285F4"} />
        </mesh>
      </group>
    </group>
  );
};

export default BasicAnimatedCharacter;