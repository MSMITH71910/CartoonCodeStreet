import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { ControlName, PHYSICS, STREET } from "../lib/constants";
import { usePortfolio } from "../lib/stores/usePortfolio";

const SimpleWorkingCharacter = () => {
  // References
  const characterRef = useRef<THREE.Group>(null);
  const { setCharacterRef } = usePortfolio();
  
  // State
  const [moving, setMoving] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [waveArm, setWaveArm] = useState<'left' | 'right'>('left');
  const [animationTime, setAnimationTime] = useState(0);
  
  // Initialize character reference in the portfolio store
  useEffect(() => {
    if (characterRef.current) {
      setCharacterRef(characterRef);
      console.log("Character reference set in portfolio store");
    }
  }, [setCharacterRef]);
  
  // Direct keyboard event handlers for dancing and waving
  useEffect(() => {
    // Event handlers
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyZ' && !moving && !isDancing && !isWaving) {
        console.log("DANCE KEY PRESSED");
        setIsDancing(true);
        setIsWaving(false);
      } else if (event.code === 'KeyQ' && !moving && !isDancing && !isWaving) {
        console.log("WAVE LEFT KEY PRESSED");
        setIsWaving(true);
        setWaveArm('left');
        setIsDancing(false);
      } else if (event.code === 'KeyR' && !moving && !isDancing && !isWaving) {
        console.log("WAVE RIGHT KEY PRESSED");
        setIsWaving(true);
        setWaveArm('right');
        setIsDancing(false);
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyZ' && isDancing) {
        console.log("DANCE KEY RELEASED");
        setIsDancing(false);
      } else if (event.code === 'KeyQ' && isWaving && waveArm === 'left') {
        console.log("WAVE LEFT KEY RELEASED");
        setIsWaving(false);
      } else if (event.code === 'KeyR' && isWaving && waveArm === 'right') {
        console.log("WAVE RIGHT KEY RELEASED");
        setIsWaving(false);
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [moving, isDancing, isWaving, waveArm]);
  
  // Use keyboard controls from drei
  const forward = useKeyboardControls(state => state[ControlName.forward]);
  const backward = useKeyboardControls(state => state[ControlName.backward]);
  const leftward = useKeyboardControls(state => state[ControlName.leftward]);
  const rightward = useKeyboardControls(state => state[ControlName.rightward]);
  
  // Main update loop
  useFrame((state, delta) => {
    if (!characterRef.current) return;
    
    // Constants
    const speed = PHYSICS.CHARACTER_SPEED;
    const turnSpeed = PHYSICS.CHARACTER_TURN_SPEED;
    
    // Handle rotation - FIXED directions
    if (leftward) {
      characterRef.current.rotation.y -= turnSpeed * delta;
    }
    
    if (rightward) {
      characterRef.current.rotation.y += turnSpeed * delta;
    }
    
    // Update movement state
    const isMovingNow = forward || backward;
    if (isMovingNow !== moving) {
      setMoving(isMovingNow);
    }
    
    // Handle forward/backward movement - FIXED directions
    if (forward || backward) {
      const direction = new THREE.Vector3();
      direction.set(0, 0, forward ? 1 : -1); // Positive Z is forward
      direction.applyQuaternion(characterRef.current.quaternion);
      
      const moveAmount = speed * delta * (forward ? 1 : 0.5);
      direction.multiplyScalar(moveAmount);
      
      characterRef.current.position.add(direction);
    }
    
    // Apply boundary constraints
    const { position } = characterRef.current;
    position.x = Math.max(STREET.BOUNDARY_MIN_X, Math.min(STREET.BOUNDARY_MAX_X, position.x));
    position.z = Math.max(STREET.BOUNDARY_MIN_Z, Math.min(STREET.BOUNDARY_MAX_Z, position.z));
    
    // Update animation time for moving parts
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
            isWaving && waveArm === 'right' ? Math.sin(animationTime) * 1.2 : 0,
            isWaving && waveArm === 'right' ? Math.sin(animationTime * 0.5) * 0.3 : 0, 
            moving ? Math.sin(animationTime) * 0.5 : 0
          ]}
        >
          <capsuleGeometry args={[0.1, 0.6, 8, 4]} />
          <meshStandardMaterial color={isWaving && waveArm === 'right' ? "#FFA500" : "#4285F4"} />
        </mesh>
      </group>
      
      {/* Left arm with waving animation */}
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

export default SimpleWorkingCharacter;